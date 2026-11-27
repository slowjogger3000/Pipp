#include "GuideScreen.h"

#include "Params.h"

#include <cmath>

namespace pipp::ui
{
namespace
{
namespace P = pipp::params;

constexpr const char* kTypeIds[4] = { "song", "call", "alarm", "flight" };
constexpr const char* kFactIds[7] = { "length", "broods", "range", "habitat", "food", "status", "nest" };
constexpr int kRowH = 22;
constexpr int kTypeRowH = 28;
constexpr int kLookRowH = 46;
constexpr int kLabelCol = 96;
constexpr int kYearLabelCol = 88;
constexpr int kLine = 16; // body line height
// Season buttons: first month and month count. Winter is split over the
// year's two ends, as in the design.
constexpr int kSeasonStart[5] = { 0, 2, 5, 8, 11 };
constexpr int kSeasonSpan[5] = { 2, 3, 3, 3, 1 };
constexpr int kSeasonValue[5] = { 3, 0, 1, 2, 3 }; // sc_season: spring, summer, autumn, winter

int textW(const juce::Font& f, const juce::String& s) { return draw::textWidth(f, s); }

juce::Font body() { return mono(11.0f, 400); }

// Greedy word wrap. Keeps explicit line breaks.
juce::StringArray wrap(const juce::Font& f, const juce::String& text, int width)
{
    juce::StringArray lines;
    for (const auto& para : juce::StringArray::fromLines(text))
    {
        juce::String line;
        for (const auto& word : juce::StringArray::fromTokens(para, " ", ""))
        {
            const auto candidate = line.isEmpty() ? word : line + " " + word;
            if (line.isNotEmpty() && textW(f, candidate) > width)
            {
                lines.add(line);
                line = word;
            }
            else
                line = candidate;
        }
        lines.add(line);
    }
    return lines;
}

int drawWrapped(juce::Graphics& g, const juce::Font& f, const juce::String& text, juce::Rectangle<int> r)
{
    g.setFont(f);
    int y = r.getY();
    for (const auto& line : wrap(f, text, r.getWidth()))
    {
        if (y + kLine > r.getBottom() + 2)
            break;
        g.drawText(line, r.getX(), y, r.getWidth(), kLine, juce::Justification::centredLeft, false);
        y += kLine;
    }
    return y - r.getY();
}

juce::String sentenceCase(const juce::String& caps)
{
    if (caps.isEmpty())
        return caps;
    const auto lower = Strings::lower(caps);
    return Strings::upper(lower.substring(0, 1)) + lower.substring(1);
}

// A row of the calendar: y filled ink, n hatched, ? left plain.
void paintMonths(juce::Graphics& g, const juce::String& row, int x0, float w, int y, int h)
{
    int start = 0;
    for (int m = 1; m <= 12; ++m)
    {
        const juce::juce_wchar c = start < row.length() ? row[start] : '?';
        const juce::juce_wchar next = m < row.length() ? row[m] : '?';
        if (m < 12 && next == c)
            continue;
        const int xa = x0 + juce::roundToInt(static_cast<float>(start) * w);
        const int xb = x0 + juce::roundToInt(static_cast<float>(m) * w) + 1;
        const juce::Rectangle<int> cell(xa, y, xb - xa, h);
        if (c == 'y')
        {
            g.setColour(colour::ink);
            g.fillRect(cell);
        }
        else
        {
            g.setColour(colour::face);
            g.fillRect(cell);
            if (c == 'n')
                draw::hatch(g, cell, colour::ink.withAlpha(0.18f), 5.0f);
            draw::border(g, cell);
        }
        start = m;
    }
}
} // namespace

GuideScreen::GuideScreen(const Strings& s) : strings(s)
{
    addAndMakeVisible(plate);
    maleBtn.onClick = [this] { if (onSex) onSex(0); };
    femaleBtn.onClick = [this] { if (onSex) onSex(1); };
    adultBtn.onClick = [this] { if (onAge) onAge(0); };
    juvBtn.onClick = [this] { if (onAge) onAge(1); };
    for (auto* b : { &maleBtn, &femaleBtn, &adultBtn, &juvBtn })
        addAndMakeVisible(*b);

    for (int i = 0; i < 4; ++i)
    {
        auto& b = typeBtns[static_cast<std::size_t>(i)];
        b.glyph = Btn::Glyph::Play;
        b.onClick = [this, i] { if (onPlayType) onPlayType(i); };
        addAndMakeVisible(b);
    }
    for (int i = 0; i < 5; ++i)
    {
        auto& b = seasonBtns[static_cast<std::size_t>(i)];
        b.onClick = [this, i] { if (onSeason) onSeason(kSeasonValue[i]); };
        addAndMakeVisible(b);
    }
}

// Data -----------------------------------------------------------------------

pipp::Engine::PhraseView GuideScreen::examplePhrase(const pipp::BirdData& b)
{
    auto engine = std::make_unique<pipp::Engine>();
    engine->prepare(48000.0);
    engine->setSeed(1u);
    engine->setBird(&b);
    engine->setParam(P::indexOf(P::sc_type), static_cast<float>(pipp::kSong));
    engine->setParam(P::indexOf(P::pb_play), 1.0f);

    pipp::Engine::PhraseView view;
    std::array<float, 512> buf {};
    for (int block = 0; block < 400; ++block) // about 4 s
    {
        engine->process(buf.data(), buf.data(), static_cast<int>(buf.size()));
        if (engine->phrasesStarted() > 0u && engine->readPhrase(view))
            return view;
    }
    return {};
}

void GuideScreen::setBird(const BirdEntry& e, const pipp::BirdData* data, const juce::var& birdJson,
                          const juce::File& plateFile, const std::vector<BirdEntry>& all, bool verified)
{
    entry = &e;
    bird = data;
    info = birdJson;
    birds = &all;
    namesVerified = verified;
    plate.load(plateFile);
    plateDoc = juce::JSON::parse(plateFile);
    example = bird != nullptr ? examplePhrase(*bird) : pipp::Engine::PhraseView {};

    compareBtns.clear();
    if (auto* arr = info["lookalikes"].getArray())
        for (const auto& l : *arr)
        {
            auto b = std::make_unique<Btn>();
            const auto id = l["id"].toString();
            b->setDisabled(! lookalikePlayable(l));
            b->onClick = [this, id] { if (onCompare) onCompare(id); };
            addAndMakeVisible(*b);
            compareBtns.push_back(std::move(b));
        }
    applyStrings();
}

void GuideScreen::setState(const State& s)
{
    state = s;
    refresh();
}

bool GuideScreen::lookalikePlayable(const juce::var& l) const
{
    const auto id = l["id"].toString();
    if (id.isEmpty() || birds == nullptr)
        return false;
    for (const auto& b : *birds)
        if (b.id == id)
            return b.available;
    return false;
}

juce::String GuideScreen::field(const juce::var& f) const
{
    return strings.field(f);
}

juce::String GuideScreen::calloutValue(const juce::var& c, const char* variant) const
{
    const auto& v = c[variant];
    const auto text = sentenceCase(v[juce::Identifier(strings.language())].toString());
    // A guessed plate value is not a fact: the table reads "Not described".
    return static_cast<bool>(v["verified"]) && text.isNotEmpty() ? text : strings("not_described");
}

juce::String GuideScreen::otherName(const juce::var& l, bool norwegian) const
{
    const auto id = l["id"].toString();
    if (id.isNotEmpty() && birds != nullptr)
        for (const auto& b : *birds)
            if (b.id == id)
                return b.name(norwegian);
    return l["name"][norwegian ? "no" : "en"].toString();
}

void GuideScreen::applyStrings()
{
    maleBtn.setText(strings("plate.male"));
    femaleBtn.setText(strings("plate.female"));
    adultBtn.setText(strings("plate.adult"));
    juvBtn.setText(strings("plate.juv"));
    const char* seasonKeys[5] = { "season.winter", "season.spring", "season.summer", "season.autumn", "season.winter_short" };
    for (int i = 0; i < 5; ++i)
        seasonBtns[static_cast<std::size_t>(i)].setText(strings(seasonKeys[i]));
    for (auto& b : compareBtns)
        b->setText(strings("guide.compare"));
    refresh();
    resized();
    repaint();
}

void GuideScreen::refresh()
{
    maleBtn.setOn(state.sex == 0);
    femaleBtn.setOn(state.sex == 1);
    adultBtn.setOn(state.age == 0);
    juvBtn.setOn(state.age == 1);
    plate.setVariant(state.age == 1 ? "juvenile" : state.sex == 1 ? "female" : "male");
    for (int i = 0; i < 4; ++i)
    {
        auto& b = typeBtns[static_cast<std::size_t>(i)];
        const bool present = bird != nullptr && bird->types[static_cast<std::size_t>(i)].present;
        b.setDisabled(! present);
        b.setOn(present && state.songType == i);
    }
    for (int i = 0; i < 5; ++i)
        seasonBtns[static_cast<std::size_t>(i)].setOn(kSeasonValue[i] == state.season);
    if (auto* arr = info["lookalikes"].getArray())
        for (std::size_t i = 0; i < compareBtns.size() && i < static_cast<std::size_t>(arr->size()); ++i)
        {
            const auto id = (*arr)[static_cast<int>(i)]["id"].toString();
            compareBtns[i]->setOn(id.isNotEmpty() && id == state.comparing);
        }
    repaint();
}

// Layout ---------------------------------------------------------------------

void GuideScreen::resized()
{
    auto r = getLocalBounds().reduced(8);
    left = r.removeFromLeft(360);
    r.removeFromLeft(12);
    right = r;

    // Left column, from the bottom: facts, then male and female, then the plate takes the rest.
    {
        auto l = left;
        const int factsH = 2 + kRowH * 10;
        factsTable = l.removeFromBottom(factsH);
        l.removeFromBottom(6);
        factsLabel = l.removeFromBottom(14);
        l.removeFromBottom(8);

        const auto* callouts = plateDoc["callouts"].getArray();
        const int rows = (callouts != nullptr ? callouts->size() : 0) + 1; // + song
        mfTable = l.removeFromBottom(2 + kRowH * (rows + 1));
        l.removeFromBottom(6);
        mfLabel = l.removeFromBottom(14);
        l.removeFromBottom(8);
        platePanel = l;

        auto p = platePanel.reduced(1);
        plateHead = p.removeFromTop(28);
        plateCaption = p.removeFromBottom(18);
        plateWell = p;
        plate.setBounds(plateWell.reduced(2));
        const int cy = plateHead.getY() + 13;
        const int ageX = plateHead.getRight() - 8 - 79;
        const int sexX = ageX - 8 - 111;
        layoutJoined({ sexX, cy - 10, 111, 20 }, { &maleBtn, &femaleBtn }, { 56, 56 });
        layoutJoined({ ageX, cy - 10, 79, 20 }, { &adultBtn, &juvBtn }, { 44, 36 });
    }

    // Right column, top down.
    {
        auto rr = right;
        notesLabel = rr.removeFromTop(14);
        rr.removeFromTop(6);
        auto row = rr.removeFromTop(162 + 4 + 14 + 4 + 12);
        figAxis = { row.getX(), row.getY(), 28, 162 };
        figWell = { row.getX() + 28, row.getY() + 1, 320, 160 };
        figParts = { figWell.getX(), row.getY() + 166, 320, 14 };
        // The design puts the caption and the link in the 350px column; the
        // caption did not fit there, so the row runs the full width.
        figCaption = { row.getX(), row.getY() + 184, row.getWidth(), 12 };
        notesText = row.withTrimmedLeft(350 + 16);
        rr.removeFromTop(6);
        typesTable = rr.removeFromTop(2 + 4 * kTypeRowH);
        for (int i = 0; i < 4; ++i)
            typeBtns[static_cast<std::size_t>(i)].setBounds(typesTable.getX() + 3, typesTable.getY() + 1 + i * kTypeRowH + 2, 24, 24);

        rr.removeFromTop(12);
        yearLabel = rr.removeFromTop(14);
        rr.removeFromTop(6);
        yearGrid = rr.removeFromTop(24 + 4 + 16 + 4 + 14 + 4 + 14);
        rr.removeFromTop(6);
        monthX0 = yearGrid.getX() + kYearLabelCol;
        monthW = static_cast<float>(yearGrid.getRight() - 1 - monthX0) / 12.0f;
        for (int i = 0; i < 5; ++i)
        {
            const int xa = monthX0 + juce::roundToInt(static_cast<float>(kSeasonStart[i]) * monthW);
            const int xb = monthX0 + juce::roundToInt(static_cast<float>(kSeasonStart[i] + kSeasonSpan[i]) * monthW) + 1;
            seasonBtns[static_cast<std::size_t>(i)].setBounds(xa, yearGrid.getY(), xb - xa, 24);
        }
        const auto noteW = rr.getWidth() - kYearLabelCol;
        const int noteLines = wrap(body(), field(info["calendar"]["note"]), noteW).size();
        yearNote = rr.removeFromTop(kLine * noteLines).withTrimmedLeft(kYearLabelCol);

        rr.removeFromTop(12);
        lookLabel = rr.removeFromTop(14);
        rr.removeFromTop(6);
        lookArea = rr;
        for (std::size_t i = 0; i < compareBtns.size(); ++i)
        {
            const int y = lookArea.getY() + static_cast<int>(i) * kLookRowH;
            compareBtns[i]->setBounds(lookArea.getRight() - 84, y + (kLookRowH - 1 - 24) / 2, 84, 24);
            compareBtns[i]->setVisible(y + kLookRowH <= getHeight());
        }
    }
}

void GuideScreen::mouseUp(const juce::MouseEvent& e)
{
    const auto url = info["xeno_canto"].toString();
    if (linkArea.contains(e.getPosition()) && url.startsWith("https://"))
        juce::URL(url).launchInDefaultBrowser();
}

// Painting -------------------------------------------------------------------

void GuideScreen::paint(juce::Graphics& g)
{
    if (entry == nullptr)
        return;
    paintPlatePanel(g);
    paintTables(g);
    paintSongNotes(g);
    paintYear(g);
    paintLookalikes(g);
}

void GuideScreen::paintPlatePanel(juce::Graphics& g)
{
    const bool no = strings.norwegian();
    draw::border(g, platePanel);
    g.setColour(colour::panel);
    g.fillRect(plateHead);
    g.setColour(colour::ink);
    g.fillRect(plateHead.getX(), plateHead.getBottom() - 1, plateHead.getWidth(), 1);
    {
        const auto area = plateHead.reduced(8, 0).withRight(maleBtn.getX() - 8);
        float size = 22.0f;
        while (size > 13.0f && textW(serif(size), entry->name(no)) > area.getWidth())
            size -= 1.0f;
        g.setFont(serif(size));
        g.drawFittedText(entry->name(no), area, juce::Justification::centredLeft, 1, 0.85f);
    }
    draw::graphPaper(g, plateWell);
    g.setColour(colour::shadow);
    g.fillRect(plateWell.getX(), plateWell.getY(), plateWell.getWidth(), 1);
    g.fillRect(plateWell.getX(), plateWell.getY(), 1, plateWell.getHeight());

    g.setColour(colour::ink);
    g.fillRect(plateCaption.getX(), plateCaption.getY(), plateCaption.getWidth(), 1);
    auto c = plateCaption.withTrimmedTop(1).reduced(8, 0);
    const auto fig = mono(9.0f, 600, 0.14f);
    const auto figText = strings("fig") + " 1";
    g.setFont(fig);
    g.drawText(figText, c, juce::Justification::centredLeft, false);
    g.setFont(mono(9.0f, 400));
    g.drawFittedText(plate.caption(), c.withTrimmedLeft(textW(fig, figText) + 8), juce::Justification::centredLeft, 1, 0.8f);
}

void GuideScreen::paintTables(juce::Graphics& g)
{
    const auto label = mono(9.0f, 600, 0.14f);
    const auto value = body();

    auto drawRow = [&](juce::Rectangle<int> row, const juce::String& key, std::initializer_list<juce::String> values, bool last) {
        g.setFont(label);
        g.setColour(colour::inkSoft);
        g.drawText(key, row.removeFromLeft(kLabelCol).reduced(8, 0), juce::Justification::centredLeft, false);
        g.setFont(value);
        g.setColour(colour::ink);
        const int n = static_cast<int>(values.size());
        int i = 0;
        for (const auto& v : values)
        {
            const int x0 = row.getX() + row.getWidth() * i / n;
            const int x1 = row.getX() + row.getWidth() * (i + 1) / n;
            g.drawFittedText(v, juce::Rectangle<int>(x0, row.getY(), x1 - x0 - 6, row.getHeight()), juce::Justification::centredLeft, 1, 0.8f);
            ++i;
        }
        if (! last)
        {
            g.setColour(colour::divider);
            g.fillRect(row.getX() - kLabelCol, row.getBottom() - 1, row.getWidth() + kLabelCol, 1);
        }
    };

    // Male and female, adults. Rows are the plate's callouts plus song.
    draw::sectionLabel(g, mfLabel, strings("guide.male_female"));
    draw::inset(g, mfTable);
    {
        auto t = mfTable.reduced(1);
        auto head = t.removeFromTop(kRowH);
        g.setColour(colour::panel);
        g.fillRect(head);
        g.setColour(colour::ink);
        g.fillRect(head.getX(), head.getBottom() - 1, head.getWidth(), 1);
        g.setFont(label);
        const int colW = (head.getWidth() - kLabelCol) / 2;
        g.drawText(strings("plate.male"), head.getX() + kLabelCol, head.getY(), colW, kRowH - 1, juce::Justification::centredLeft, false);
        g.drawText(strings("plate.female"), head.getX() + kLabelCol + colW, head.getY(), colW, kRowH - 1, juce::Justification::centredLeft, false);

        if (const auto* callouts = plateDoc["callouts"].getArray())
            for (const auto& c : *callouts)
                drawRow(t.removeFromTop(kRowH), strings("plate." + c["id"].toString()),
                        { calloutValue(c, "male"), calloutValue(c, "female") }, false);
        drawRow(t.removeFromTop(kRowH), strings("guide.song_row"),
                { field(info["sings"]["male"]), field(info["sings"]["female"]) }, true);
    }

    // Field facts. The names were checked against GBIF on 2026-11-27.
    draw::sectionLabel(g, factsLabel, strings("guide.facts"));
    draw::inset(g, factsTable);
    {
        auto t = factsTable.reduced(1);
        drawRow(t.removeFromTop(kRowH), strings("fact.norwegian"), { entry->nameNo }, false);
        drawRow(t.removeFromTop(kRowH), strings("fact.english"), { entry->nameEn }, false);
        drawRow(t.removeFromTop(kRowH), strings("fact.latin"), { entry->latin }, false);
        for (int i = 0; i < 7; ++i)
            drawRow(t.removeFromTop(kRowH), strings("fact." + juce::String(kFactIds[i])),
                    { field(info["facts"][kFactIds[i]]) }, i == 6);
    }
}

void GuideScreen::paintFigure(juce::Graphics& g, juce::Rectangle<int> well)
{
    draw::graphPaper(g, well);
    g.setColour(colour::shadow);
    g.fillRect(well.getX(), well.getY(), well.getWidth(), 1);
    g.fillRect(well.getX(), well.getY(), 1, well.getHeight());
    if (bird == nullptr || example.count == 0 || example.lengthMs <= 0.0f)
        return;

    const float pad = 8.0f;
    const float pxPerMs = (static_cast<float>(well.getWidth()) - 2.0f * pad) / example.lengthMs;
    const float pitchKnob = bird->base[pipp::kPitch];
    auto xFor = [&](float ms) { return static_cast<float>(well.getX()) + pad + ms * pxPerMs; };
    auto yFor = [&](float hz) {
        return static_cast<float>(well.getBottom()) - juce::jlimit(0.0f, 1.0f, hz / 8000.0f) * static_cast<float>(well.getHeight());
    };

    juce::Graphics::ScopedSaveState save(g);
    g.reduceClipRegion(well.reduced(1));
    g.setColour(colour::ink);
    for (int i = 0; i < example.count; ++i)
    {
        const auto& n = example.notes[static_cast<std::size_t>(i)];
        if (n.syl < 0 || n.syl >= static_cast<int>(bird->syllables.size()) || n.durMs <= 0.0f)
            continue;
        const auto& s = bird->syllables[static_cast<std::size_t>(n.syl)];
        const int steps = std::max(4, static_cast<int>(n.durMs * pxPerMs / 1.5f));
        float px = 0.0f, py = 0.0f;
        bool prevOn = false;
        for (int j = 0; j <= steps; ++j)
        {
            const float u = static_cast<float>(j) / static_cast<float>(steps);
            const float x = xFor(n.startMs + u * n.durMs);
            const float y = yFor(pipp::contourPitchAt(s.pitch, u) * n.pitchMul * pitchKnob);
            const float a = pipp::contourAt(s.amp, u) * s.gain;
            const bool on = a > 0.08f;
            if (on && prevOn)
                g.drawLine(px, py, x, y, 1.0f + 1.0f * std::min(1.0f, a));
            px = x;
            py = y;
            prevOn = on;
        }
    }
}

void GuideScreen::paintSongNotes(juce::Graphics& g)
{
    const bool no = strings.norwegian();
    draw::sectionLabel(g, notesLabel, strings("guide.song_notes"));

    // Figure: axis, well, outer border.
    const juce::Rectangle<int> box(figAxis.getX(), figAxis.getY(), 350, 162);
    draw::border(g, box);
    g.setColour(colour::ink);
    g.fillRect(figWell.getX() - 1, box.getY(), 1, box.getHeight());
    g.setFont(mono(9.0f, 400));
    g.setColour(colour::inkSoft);
    const auto axisR = [&](int y) { return juce::Rectangle<int>(figAxis.getX(), y, figAxis.getWidth() - 4, 12); };
    g.drawText(strings.format("axis.khz", { { "n", "8" } }), axisR(figAxis.getY() + 2), juce::Justification::centredRight, false);
    g.drawText(strings.format("axis.khz", { { "n", "4" } }), axisR(figAxis.getY() + 82), juce::Justification::centredRight, false);
    g.drawText("0", axisR(figAxis.getBottom() - 14), juce::Justification::centredRight, false);
    paintFigure(g, figWell);

    // Brackets under the figure for each run of notes from one named part.
    if (example.count > 0 && example.lengthMs > 0.0f && bird != nullptr)
    {
        const float pxPerMs = (static_cast<float>(figWell.getWidth()) - 16.0f) / example.lengthMs;
        const auto f = mono(9.0f, 600, 0.14f);
        g.setFont(f);
        int i = 0;
        int prevTextEnd = figWell.getX();
        while (i < example.count)
        {
            const int part = example.notes[static_cast<std::size_t>(i)].part;
            int j = i;
            while (j + 1 < example.count && example.notes[static_cast<std::size_t>(j + 1)].part == part)
                ++j;
            if (part >= 0 && part < static_cast<int>(bird->parts.size()))
            {
                const auto& a = example.notes[static_cast<std::size_t>(i)];
                const auto& b = example.notes[static_cast<std::size_t>(j)];
                const int x0 = figWell.getX() + 8 + juce::roundToInt(a.startMs * pxPerMs);
                const int x1 = figWell.getX() + 8 + juce::roundToInt((b.startMs + b.durMs) * pxPerMs);
                const auto name = field(info["parts"][juce::Identifier(juce::String(bird->parts[static_cast<std::size_t>(part)]))]);
                g.setColour(colour::ink);
                g.fillRect(x0, figParts.getY(), std::max(2, x1 - x0), 1);
                g.setColour(colour::inkSoft);
                // A short bracket may lend its label the room up to the next one.
                int labelRight = figWell.getRight();
                if (j + 1 < example.count)
                    labelRight = figWell.getX() + 8 + juce::roundToInt(example.notes[static_cast<std::size_t>(j + 1)].startMs * pxPerMs) - 6;
                // A label wider than its room moves left, as far as the previous label allows.
                const int textWidth = textW(f, name);
                const int lx = std::max(prevTextEnd + 8, std::min(x0, std::max(x1, labelRight) - textWidth));
                const int lw = std::max(x1, labelRight) - lx;
                g.drawFittedText(name, juce::Rectangle<int>(lx, figParts.getY() + 2, lw, 12), juce::Justification::centredLeft, 1, 0.7f);
                prevTextEnd = lx + std::min(lw, textWidth);
            }
            i = j + 1;
        }
    }

    // Caption and the link to real recordings.
    {
        const auto fig = mono(9.0f, 600, 0.14f);
        const auto figText = strings("fig") + " 2";
        g.setColour(colour::ink);
        g.setFont(fig);
        auto c = figCaption;
        g.drawText(figText, c.removeFromLeft(textW(fig, figText) + 8), juce::Justification::centredLeft, false);
        const float tempo = bird != nullptr ? std::max(0.25f, bird->base[pipp::kTempo] / 100.0f) : 1.0f;
        const auto caption = example.count > 0
                                 ? strings.format("guide.fig_phrase", { { "s", number(example.lengthMs / tempo / 1000.0f, 1, no) } })
                                 : juce::String();
        const auto link = strings("guide.xeno");
        const int linkW = textW(fig, link) + 2;
        linkArea = c.removeFromRight(linkW);
        g.drawText(link, linkArea, juce::Justification::centredLeft, false);
        g.fillRect(linkArea.getX(), linkArea.getBottom() - 1, linkW - 2, 1);
        g.setFont(mono(9.0f, 400));
        g.drawFittedText(caption, c.withTrimmedRight(8), juce::Justification::centredLeft, 1, 0.8f);
    }

    // Description and mnemonic.
    g.setColour(colour::ink);
    auto t = notesText;
    t.removeFromTop(drawWrapped(g, body(), field(info["song_notes"]), t) + kLine);
    // No mnemonic is collected yet for most birds: then the block is left out.
    const auto mnemonic = info["mnemonic"][juce::Identifier(strings.language())].toString();
    if (mnemonic.isNotEmpty() && t.getHeight() >= 2 * kLine)
    {
        g.setColour(colour::inkSoft);
        g.setFont(mono(9.0f, 600, 0.14f));
        g.drawText(strings("guide.mnemonic"), t.removeFromTop(kLine), juce::Justification::centredLeft, false);
        g.setColour(colour::ink);
        drawWrapped(g, body(), mnemonic, t);
    }

    // The four song types.
    draw::inset(g, typesTable);
    for (int i = 0; i < 4; ++i)
    {
        const juce::Rectangle<int> row(typesTable.getX() + 1, typesTable.getY() + 1 + i * kTypeRowH, typesTable.getWidth() - 2, kTypeRowH);
        if (i < 3)
        {
            g.setColour(colour::divider);
            g.fillRect(row.getX(), row.getBottom() - 1, row.getWidth(), 1);
        }
        auto r = row.withTrimmedLeft(2 + 24 + 8);
        g.setColour(colour::ink);
        g.setFont(mono(10.0f, 600, 0.14f));
        g.drawText(strings("type." + juce::String(kTypeIds[i])), r.removeFromLeft(56), juce::Justification::centredLeft, false);
        r.removeFromLeft(8);
        g.setFont(body());
        g.drawFittedText(field(info["types"][kTypeIds[i]]), r.withTrimmedRight(6), juce::Justification::centredLeft, 1, 0.8f);
    }
}

void GuideScreen::paintYear(juce::Graphics& g)
{
    draw::sectionLabel(g, yearLabel, strings("guide.year"));
    const auto label = mono(9.0f, 600, 0.14f);
    auto rowLabel = [&](int y, int h, const juce::String& text) {
        g.setFont(label);
        g.setColour(colour::inkSoft);
        g.drawText(text, yearGrid.getX(), y, kYearLabelCol - 4, h, juce::Justification::centredLeft, false);
    };

    int y = yearGrid.getY();
    rowLabel(y, 24, strings("cal.season"));
    y += 24 + 4;
    const auto months = juce::StringArray::fromTokens(strings("cal.months"), "|", "");
    g.setFont(mono(10.0f, 500));
    for (int m = 0; m < 12 && m < months.size(); ++m)
    {
        const int xa = monthX0 + juce::roundToInt(static_cast<float>(m) * monthW);
        g.drawText(months[m], xa, y, juce::roundToInt(monthW), 16, juce::Justification::centred, false);
    }
    y += 16 + 4;
    rowLabel(y, 14, strings("cal.present"));
    paintMonths(g, info["calendar"]["present"].toString(), monthX0, monthW, y, 14);
    y += 14 + 4;
    rowLabel(y, 14, strings("cal.sings"));
    paintMonths(g, info["calendar"]["sings"].toString(), monthX0, monthW, y, 14);

    g.setColour(colour::ink);
    drawWrapped(g, body(), field(info["calendar"]["note"]), yearNote);
}

void GuideScreen::paintLookalikes(juce::Graphics& g)
{
    const bool no = strings.norwegian();
    draw::sectionLabel(g, lookLabel, strings("guide.lookalikes"));
    const auto* arr = info["lookalikes"].getArray();
    if (arr == nullptr || arr->isEmpty())
    {
        g.setColour(colour::ink);
        g.setFont(body());
        g.drawText(strings("guide.no_lookalikes"), lookArea.withHeight(kLine), juce::Justification::centredLeft, false);
        return;
    }
    for (int i = 0; i < arr->size(); ++i)
    {
        const auto& l = (*arr)[i];
        const juce::Rectangle<int> row(lookArea.getX(), lookArea.getY() + i * kLookRowH, lookArea.getWidth(), kLookRowH);
        if (row.getBottom() > getHeight())
            break;
        if (i + 1 < arr->size())
        {
            g.setColour(colour::divider);
            g.fillRect(row.getX(), row.getBottom() - 1, row.getWidth(), 1);
        }
        const int cy = row.getY() + (kLookRowH - 1) / 2;
        g.setColour(colour::ink);
        g.setFont(serif(20.0f));
        g.drawFittedText(otherName(l, no), row.getX(), cy - 19, 168, 22, juce::Justification::bottomLeft, 1, 0.8f);
        g.setFont(body());
        g.setColour(colour::inkSoft);
        g.drawText(otherName(l, ! no), row.getX(), cy + 4, 168, 14, juce::Justification::centredLeft, false);

        g.setColour(colour::ink);
        const juce::Rectangle<int> text(row.getX() + 168 + 12, row.getY(), row.getWidth() - 168 - 12 - 84 - 12, kLookRowH - 1);
        const auto lines = wrap(body(), field(l["text"]), text.getWidth());
        g.setFont(body());
        const int ty = text.getY() + (text.getHeight() - kLine * std::min(2, lines.size())) / 2;
        for (int k = 0; k < std::min(2, lines.size()); ++k)
            g.drawText(lines[k], text.getX(), ty + k * kLine, text.getWidth(), kLine, juce::Justification::centredLeft, false);
    }
}
} // namespace pipp::ui
