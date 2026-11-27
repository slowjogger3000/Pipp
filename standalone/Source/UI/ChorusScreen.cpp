#include "ChorusScreen.h"

#include "Params.h"

#include <cmath>

namespace pipp::ui
{
namespace
{
namespace P = pipp::params;

int textW(const juce::Font& f, const juce::String& s) { return draw::textWidth(f, s); }

const juce::Colour& track(int lane)
{
    static const juce::Colour* c[4] = { &colour::clay, &colour::khaki, &colour::sage, &colour::plum };
    return *c[lane & 3];
}

// Text on clay and plum is paper, on khaki and sage ink.
juce::Colour onTrack(int lane) { return lane == 0 || lane == 3 ? colour::paper : colour::ink; }

juce::StringArray optionIds(const char* paramId)
{
    return juce::StringArray::fromTokens(juce::String(P::find(paramId)->options), "|", "");
}
} // namespace

ChorusScreen::ChorusScreen(const Strings& s, const pipp::Chorus& c) : strings(s), chorus(c)
{
    for (int i = 0; i < 4; ++i)
    {
        const auto u = static_cast<std::size_t>(i);
        seasonBtns[u].onClick = [this, i] { if (onSeason) onSeason(i); };
        placeBtns[u].onClick = [this, i] { if (onPlace) onPlace(i); };
        speedBtns[u].onClick = [this, i] { if (onSpeed) onSpeed(i); };
        muteBtns[u].onClick = [this, i] { if (onMute) onMute(i); };
        soloBtns[u].onClick = [this, i] { if (onSolo) onSolo(i); };
        changeBtns[u].onClick = [this, i] { if (onChange) onChange(i); };
        for (auto* b : { &seasonBtns[u], &placeBtns[u], &speedBtns[u], &muteBtns[u], &soloBtns[u], &changeBtns[u] })
            addAndMakeVisible(*b);
    }
    // Speed glyphs read the same in both languages.
    speedBtns[1].setText(juce::String(juce::CharPointer_UTF8("10\xc3\x97")));
    speedBtns[2].setText(juce::String(juce::CharPointer_UTF8("60\xc3\x97")));
}

void ChorusScreen::applyStrings()
{
    const auto seasons = optionIds(P::sc_season);
    const auto places = optionIds(P::sc_place);
    for (int i = 0; i < 4; ++i)
    {
        const auto u = static_cast<std::size_t>(i);
        seasonBtns[u].setText(strings("season." + seasons[i]));
        placeBtns[u].setText(strings("place." + places[i]));
        muteBtns[u].setText(strings("chorus.mute"));
        soloBtns[u].setText(strings("chorus.solo"));
        changeBtns[u].setText(strings("chorus.change"));
    }
    speedBtns[0].setText(strings("chorus.speed_real"));
    speedBtns[3].setText(strings("chorus.speed_loop"));
    resized();
    repaint();
}

void ChorusScreen::setView(const View& v)
{
    view = v;
    refresh();
}

void ChorusScreen::refresh()
{
    for (int i = 0; i < 4; ++i)
    {
        const auto u = static_cast<std::size_t>(i);
        seasonBtns[u].setOn(view.season == i);
        placeBtns[u].setOn(view.place == i);
        speedBtns[u].setOn(view.speed == i);
        muteBtns[u].setOn(view.lanes[u].mute);
        soloBtns[u].setOn(view.lanes[u].solo);
        changeBtns[u].setDisabled(! view.canChange);
    }
    repaint();
}

void ChorusScreen::resized()
{
    auto r = getLocalBounds().reduced(8);

    // Morning: label, then 3 fields with 16px gaps.
    morningLabel = r.removeFromTop(14);
    r.removeFromTop(4);
    {
        auto row = r.removeFromTop(38);
        const int w = (row.getWidth() - 32) / 3;
        std::array<Btn, 4>* groups[3] = { &seasonBtns, &placeBtns, &speedBtns };
        for (int i = 0; i < 3; ++i)
        {
            const juce::Rectangle<int> f(row.getX() + i * (w + 16), row.getY(), i == 2 ? row.getRight() - (row.getX() + i * (w + 16)) : w, 38);
            fieldLabels[static_cast<std::size_t>(i)] = f.withHeight(12);
            auto& g = *groups[i];
            layoutJoined(f.withTrimmedTop(14), { &g[0], &g[1], &g[2], &g[3] });
        }
    }
    r.removeFromTop(12);

    panel = r.removeFromTop(1 + 28 + 4 * kLaneH + 16 + 18 + 1);
    {
        auto p = panel.reduced(1);
        head = p.removeFromTop(28);
        auto lanesArea = p.removeFromTop(4 * kLaneH);
        heads = lanesArea.removeFromLeft(kHeadW);
        timeline = lanesArea;
        axis = p.removeFromTop(16);
        caption = p;

        const auto f = mono(10.0f, 500, 0.06f);
        for (int i = 0; i < 4; ++i)
        {
            const auto u = static_cast<std::size_t>(i);
            const int top = heads.getY() + i * kLaneH;
            // Chip 28 + 10 gap, then the name (22px) over the buttons, 6px apart.
            int x = heads.getX() + 8 + 28 + 10;
            const int y = top + (kLaneH - 1) / 2 - (22 + 6 + 20) / 2 + 22 + 6;
            for (auto* b : { &muteBtns[u], &soloBtns[u], &changeBtns[u] })
            {
                const int w = textW(f, b == &muteBtns[u] ? strings("chorus.mute") : b == &soloBtns[u] ? strings("chorus.solo") : strings("chorus.change")) + 16;
                b->setBounds(x, y, w, 20);
                x += w + 6;
            }
        }
    }
    r.removeFromTop(12);
    note = r.removeFromTop(16);
}

void ChorusScreen::paint(juce::Graphics& g)
{
    const bool no = strings.norwegian();
    draw::sectionLabel(g, morningLabel, strings("chorus.morning"));
    const char* labels[3] = { "scene.season", "scene.place", "chorus.dawn_speed" };
    for (int i = 0; i < 3; ++i)
        draw::fieldLabel(g, fieldLabels[static_cast<std::size_t>(i)], strings(labels[i]));

    // Panel head: title, then NOW and SINGING on the right.
    draw::border(g, panel);
    g.setColour(colour::panel);
    g.fillRect(head);
    g.setColour(colour::ink);
    g.fillRect(head.getX(), head.getBottom() - 1, head.getWidth(), 1);
    g.setFont(serif(22.0f));
    g.drawText(strings("chorus.title"), head.reduced(8, 0), juce::Justification::centredLeft, false);
    {
        const float m = chorus.minute();
        const int mins = juce::roundToInt(std::fabs(m));
        const auto nowText = mins == 0 ? strings("chorus.at")
                           : strings.format(m < 0.0f ? "chorus.before" : "chorus.after", { { "n", juce::String(mins) } });
        int singing = 0;
        for (int i = 0; i < pipp::Chorus::kLanes; ++i)
            singing += chorus.laneStarted(i) && chorus.laneAudible(i) ? 1 : 0;
        const auto singText = strings.format("chorus.of", { { "n", juce::String(singing) }, { "total", juce::String(pipp::Chorus::kLanes) } });
        const auto f = mono(10.0f, 500, 0.06f);
        g.setFont(f);
        auto h = head.reduced(8, 0);
        const juce::String parts[4] = { strings("chorus.now"), nowText, strings("chorus.singing"), singText };
        int x = h.getRight();
        for (int i = 3; i >= 0; --i)
        {
            const int w = textW(f, parts[i]) + 1;
            x -= w;
            g.setColour(i % 2 == 0 ? colour::inkSoft : colour::ink);
            g.drawText(parts[i], juce::Rectangle<int>(x, h.getY(), w + 1, h.getHeight()), juce::Justification::centredLeft, false);
            x -= 12;
        }
    }

    // Lane heads.
    g.setColour(colour::ink);
    g.fillRect(heads.getRight() - 1, heads.getY(), 1, heads.getHeight());
    for (int i = 0; i < 4; ++i)
    {
        const auto& lane = view.lanes[static_cast<std::size_t>(i)];
        const juce::Rectangle<int> row(heads.getX(), heads.getY() + i * kLaneH, heads.getWidth() - 1, kLaneH);
        if (lane.mute)
            draw::hatch(g, row);
        if (i < 3)
        {
            g.setColour(colour::ink);
            g.fillRect(row.getX(), row.getBottom() - 1, row.getWidth() + 1, 1);
        }
        const int cy = row.getY() + (kLaneH - 1) / 2;
        const juce::Rectangle<int> chip(row.getX() + 8, cy - 14, 28, 28);
        g.setColour(track(i));
        g.fillRect(chip);
        draw::border(g, chip);
        g.setColour(onTrack(i));
        g.setFont(mono(12.0f, 600));
        g.drawText(juce::String(i + 1), chip, juce::Justification::centred, false);

        const auto f = mono(10.0f, 500, 0.06f);
        const auto dist = lane.mute ? strings("chorus.muted") : number(lane.distance, 0, no) + " m";
        const int dw = textW(f, dist) + 2;
        g.setColour(colour::ink);
        g.setFont(f);
        g.drawText(dist, juce::Rectangle<int>(row.getRight() - 8 - dw, cy - 7, dw, 14), juce::Justification::centredRight, false);

        g.setFont(serif(22.0f));
        const int nameX = chip.getRight() + 10;
        g.drawFittedText(lane.name, juce::Rectangle<int>(nameX, cy - 24, row.getRight() - 8 - dw - 10 - nameX, 22),
                         juce::Justification::centredLeft, 1, 0.85f);
    }

    paintTimeline(g);

    // Minute axis under the timeline, labels every 30 minutes.
    g.setColour(colour::ink);
    g.fillRect(axis.getX(), axis.getY(), axis.getWidth(), 1);
    g.setFont(mono(9.0f, 400));
    g.setColour(colour::inkSoft);
    const juce::String minus = juce::String(juce::CharPointer_UTF8("\xe2\x88\x92"));
    for (int k = 0; k < 4; ++k)
    {
        const int n = -90 + 30 * k;
        const auto text = k == 0 ? strings.format("chorus.axis_min", { { "n", minus + juce::String(-n) } })
                        : n < 0 ? minus + juce::String(-n) : juce::String(n);
        g.drawText(text, juce::Rectangle<int>(timeline.getX() + 2 + 240 * k, axis.getY() + 1, 120, 14), juce::Justification::centredLeft, false);
    }

    // Caption.
    g.setColour(colour::ink);
    g.fillRect(caption.getX(), caption.getY(), caption.getWidth(), 1);
    {
        auto c = caption.withTrimmedTop(1).reduced(8, 0);
        const auto fig = mono(9.0f, 600, 0.14f);
        const auto figText = strings("fig") + " 1";
        g.setFont(fig);
        g.drawText(figText, c, juce::Justification::centredLeft, false);
        g.setFont(mono(9.0f, 400));
        g.drawFittedText(strings("chorus.caption"), c.withTrimmedLeft(textW(fig, figText) + 8), juce::Justification::centredLeft, 1, 0.8f);
    }

    g.setColour(colour::inkSoft);
    g.setFont(mono(11.0f, 400));
    g.drawFittedText(strings("chorus.note"), note, juce::Justification::centredLeft, 1, 0.85f);
}

void ChorusScreen::paintTimeline(juce::Graphics& g)
{
    const auto t = timeline;
    draw::graphPaper(g, t);
    g.setColour(colour::shadow);
    g.fillRect(t.getX(), t.getY(), t.getWidth(), 1);
    g.fillRect(t.getX(), t.getY(), 1, t.getHeight());

    auto xFor = [&t](float minute) { return static_cast<float>(t.getX()) + (minute - pipp::Chorus::kStartMin) * kPxPerMin; };
    g.saveState();
    g.reduceClipRegion(t);

    for (int i = 0; i < 4; ++i)
    {
        const auto& lane = view.lanes[static_cast<std::size_t>(i)];
        const int top = t.getY() + i * kLaneH;
        if (lane.inSeason)
        {
            // The band from the entry minute to the right edge, filled in
            // the track colour where the bird sang.
            const int bx = juce::roundToInt(xFor(lane.entry));
            const juce::Rectangle<int> band(bx, top + 34, t.getRight() + 1 - bx, 28);
            g.setColour(track(i));
            for (int col = std::max(0, bx - t.getX()); col < pipp::Chorus::kColumns && t.getX() + col < t.getRight(); ++col)
                if (chorus.sang(i, col))
                    g.fillRect(t.getX() + col, band.getY() + 1, 1, band.getHeight() - 2);
            g.setColour(colour::ink);
            g.fillRect(band.getX(), band.getY(), band.getWidth(), 1);
            g.fillRect(band.getX(), band.getBottom() - 1, band.getWidth(), 1);
            g.fillRect(band.getX(), band.getY(), 1, band.getHeight());
        }
        if (lane.mute)
            draw::hatch(g, juce::Rectangle<int>(t.getX(), top, t.getWidth(), kLaneH));
        if (i > 0)
        {
            g.setColour(colour::ink);
            g.fillRect(t.getX(), top, t.getWidth(), 1);
        }
    }

    // Sunrise line and flag.
    const int sx = juce::roundToInt(xFor(0.0f));
    g.setColour(colour::ink);
    g.fillRect(sx, t.getY(), 1, t.getHeight());
    {
        const auto f = mono(8.0f, 600, 0.06f);
        const auto text = strings("chorus.sunrise");
        const int w = textW(f, text) + 6;
        g.fillRect(sx + 4, t.getY() + 2, w, 10);
        g.setColour(colour::onInk);
        g.setFont(f);
        g.drawText(text, juce::Rectangle<int>(sx + 7, t.getY() + 2, w, 10), juce::Justification::centredLeft, false);
    }

    // Playhead and NOW flag.
    const float nx = std::floor(xFor(chorus.minute()));
    g.setColour(colour::plum);
    g.fillRect(nx, static_cast<float>(t.getY()), 1.0f, static_cast<float>(t.getHeight()));
    {
        const auto f = mono(8.0f, 600, 0.06f);
        const auto text = strings("chorus.now");
        const float w = static_cast<float>(textW(f, text) + 8);
        g.fillRect(nx + 1.0f, static_cast<float>(t.getY()), w, 12.0f);
        g.setColour(colour::paper);
        g.setFont(f);
        g.drawText(text, juce::Rectangle<float>(nx + 5.0f, static_cast<float>(t.getY()), w, 12.0f), juce::Justification::centredLeft, false);
    }
    g.restoreState();
}
} // namespace pipp::ui
