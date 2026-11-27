#include "QuizScreen.h"

#include <cmath>

namespace pipp::ui
{
namespace
{
int textW(const juce::Font& f, const juce::String& s) { return draw::textWidth(f, s); }

constexpr const char* kSetKeys[pipp::Quiz::kNumSets] = { "pairs", "garden", "forest", "coast", "wetland", "mountain", "farmland", "night", "all" };
} // namespace

juce::String quizSetName(const Strings& s, int set, int birdCount)
{
    if (set < 0 || set >= pipp::Quiz::kNumSets)
        return {};
    const juce::String key = "quiz.set." + juce::String(kSetKeys[set]);
    return set == pipp::Quiz::kAll ? s.format(key, { { "n", juce::String(birdCount) } }) : s(key);
}

// QuizSonogram ----------------------------------------------------------------

void QuizSonogram::poll()
{
    const std::uint32_t written = engine.sonoWritten();
    const std::uint32_t keep = pipp::Engine::kSonoFrames - 64;
    if (written - next > keep && written - next < 0x80000000u)
        next = written - keep; // fell behind the ring; take what is left
    const double rate = engine.sonoFrameRate();
    const auto cap = static_cast<std::size_t>((static_cast<double>(getWidth()) - kLeftPx) / kPxPerSecond * rate) + 2u;
    bool added = false;
    while (next != written && written - next < 0x80000000u)
    {
        if (frames.size() < cap)
        {
            frames.push_back(engine.sonoFrame(next));
            added = true;
        }
        ++next;
    }
    if (added)
        repaint();
}

void QuizSonogram::paint(juce::Graphics& g)
{
    const auto r = getLocalBounds();
    draw::graphPaper(g, r);
    g.setColour(colour::shadow);
    g.fillRect(0, 0, r.getWidth(), 1);
    g.fillRect(0, 0, 1, r.getHeight());

    const double rate = engine.sonoFrameRate();
    if (frames.size() < 2u || rate <= 0.0)
        return;
    const float h = static_cast<float>(r.getHeight());
    auto yFor = [h](float hz) { return h - hz / 1000.0f * kPxPerKHz; };
    auto xFor = [rate](std::size_t i) { return kLeftPx + static_cast<float>(static_cast<double>(i) / rate) * kPxPerSecond; };

    constexpr float kGate = 0.03f;
    g.setColour(colour::ink);
    for (std::size_t i = 1; i < frames.size(); ++i)
    {
        const auto& a = frames[i - 1];
        const auto& b = frames[i];
        if (a.amp > kGate && b.amp > kGate && a.freqHz > 0.0f && b.freqHz > 0.0f
            && std::abs(std::log2(b.freqHz / a.freqHz)) < 0.35f)
        {
            const float level = std::min(1.0f, 0.5f * (a.amp + b.amp) / 0.35f);
            g.drawLine(xFor(i - 1), yFor(a.freqHz), xFor(i), yFor(b.freqHz), 1.5f + 1.5f * level);
        }
    }
}

// Answer ----------------------------------------------------------------------

void QuizScreen::Answer::paint(juce::Graphics& g)
{
    const auto r = getLocalBounds();
    juce::Colour fg = colour::ink;
    switch (look)
    {
        case Look::Correct:
            g.setColour(colour::ink);
            g.fillRect(r);
            fg = colour::onInk;
            break;
        case Look::Wrong:
            g.setColour(colour::face);
            g.fillRect(r);
            draw::hatch(g, r);
            draw::border(g, r);
            break;
        case Look::Raised:
            draw::raised(g, r);
            break;
    }
    g.setColour(fg);
    auto inner = r.reduced(12, 0);
    if (tag.isNotEmpty())
    {
        const auto f = mono(10.0f, 500, 0.06f);
        g.setFont(f);
        g.drawText(tag, inner.removeFromRight(textW(f, tag) + 2), juce::Justification::centredRight, false);
        inner.removeFromRight(8);
    }
    g.setFont(serif(22.0f));
    g.drawFittedText(name, inner, juce::Justification::centredLeft, 1, 0.85f);
}

// QuizScreen ------------------------------------------------------------------

QuizScreen::QuizScreen(const Strings& s, pipp::Engine& e) : sono(e), strings(s)
{
    addAndMakeVisible(sono);
    againBtn.onClick = [this] { if (onPlayAgain) onPlayAgain(); };
    halfBtn.onClick = [this] { if (onHalf) onHalf(); };
    hintBtn.onClick = [this] { if (onHint) onHint(); };
    compareBtn.onClick = [this] { if (onCompare) onCompare(); };
    guideBtn.onClick = [this] { if (onOpenGuide) onOpenGuide(); };
    nextBtn.onClick = [this] { if (onNext) onNext(); };
    for (auto* b : { &againBtn, &halfBtn, &hintBtn, &compareBtn, &guideBtn, &nextBtn })
        addAndMakeVisible(*b);
    for (int i = 0; i < 4; ++i)
    {
        auto& a = answers[static_cast<std::size_t>(i)];
        a.onClick = [this, i] { if (onAnswer) onAnswer(i); };
        addAndMakeVisible(a);
    }
    for (int i = 0; i < pipp::Quiz::kNumSets; ++i)
    {
        auto& b = setBtns[static_cast<std::size_t>(i)];
        b.alignLeft = true;
        b.onClick = [this, i] { if (onSet) onSet(i); };
        addAndMakeVisible(b);
    }
    for (int i = 0; i < 3; ++i)
    {
        askBtns[static_cast<std::size_t>(i)].onClick = [this, i] { if (onAsk) onAsk(i); };
        hintBtns[static_cast<std::size_t>(i)].onClick = [this, i] { if (onHints) onHints(i); };
        addAndMakeVisible(askBtns[static_cast<std::size_t>(i)]);
        addAndMakeVisible(hintBtns[static_cast<std::size_t>(i)]);
        lengthBtns[static_cast<std::size_t>(i)].onClick = [this, i] { if (onLength) onLength(i); };
        addAndMakeVisible(lengthBtns[static_cast<std::size_t>(i)]);
    }
    againResultBtn.onClick = [this] { if (onNext) onNext(); };
    addChildComponent(againResultBtn);
}

void QuizScreen::applyStrings()
{
    againBtn.setText(strings("quiz.play_again"));
    halfBtn.setText(strings("quiz.half"));
    hintBtn.setText(strings("quiz.hint"));
    compareBtn.setText(strings("quiz.compare"));
    guideBtn.setText(strings("quiz.open_guide"));
    for (int i = 0; i < pipp::Quiz::kNumSets; ++i)
        setBtns[static_cast<std::size_t>(i)].setText(quizSetName(strings, i, birdCount));
    const char* ask[3] = { "type.song", "type.call", "quiz.ask_both" };
    const char* hints[3] = { "guide.mnemonic", "scene.season", "quiz.hints_none" };
    for (int i = 0; i < 3; ++i)
    {
        askBtns[static_cast<std::size_t>(i)].setText(strings(ask[i]));
        hintBtns[static_cast<std::size_t>(i)].setText(strings(hints[i]));
        lengthBtns[static_cast<std::size_t>(i)].setText(number(pipp::Quiz::kLengths[i], 0, strings.norwegian()));
    }
    againResultBtn.setText(strings("quiz.again"));
    refresh();
    resized();
}

void QuizScreen::setView(const View& v)
{
    view = v;
    refresh();
}

void QuizScreen::refresh()
{
    nextBtn.setText(strings(view.finished ? "quiz.see_result" : "quiz.next"));
    const bool result = view.showResult && view.finished;
    for (juce::Component* c : { static_cast<juce::Component*>(&sono), static_cast<juce::Component*>(&againBtn), static_cast<juce::Component*>(&halfBtn),
                                static_cast<juce::Component*>(&hintBtn), static_cast<juce::Component*>(&compareBtn), static_cast<juce::Component*>(&guideBtn),
                                static_cast<juce::Component*>(&nextBtn) })
        c->setVisible(! result);
    againResultBtn.setVisible(result);
    againResultBtn.setText(strings("quiz.again"));
    halfBtn.setOn(view.half);
    againBtn.setDisabled(! view.active);
    halfBtn.setDisabled(! view.active);
    hintBtn.setDisabled(! view.active || view.hints == 2 || view.answered);
    hintBtn.setOn(view.hintUsed && ! view.answered && view.hints != 2);
    compareBtn.setDisabled(! view.answered);
    compareBtn.setOn(view.comparing);
    guideBtn.setDisabled(! view.answered);
    nextBtn.setDisabled(! view.answered);

    for (int i = 0; i < 4; ++i)
    {
        auto& a = answers[static_cast<std::size_t>(i)];
        a.setVisible(view.active && i < view.count && ! result);
        a.name = view.names[static_cast<std::size_t>(i)];
        a.look = Answer::Look::Raised;
        a.tag = {};
        if (view.answered && i == view.correctSlot)
        {
            a.look = Answer::Look::Correct;
            a.tag = strings("quiz.correct");
        }
        else if (view.answered && i == view.picked)
        {
            a.look = Answer::Look::Wrong;
            a.tag = strings("quiz.your_answer");
        }
        a.clickable = view.active && ! view.answered;
        a.setMouseCursor(a.clickable ? juce::MouseCursor::PointingHandCursor : juce::MouseCursor::NormalCursor);
        a.repaint();
    }
    for (int i = 0; i < pipp::Quiz::kNumSets; ++i)
    {
        setBtns[static_cast<std::size_t>(i)].setOn(view.set == i);
        setBtns[static_cast<std::size_t>(i)].setDisabled(! view.setHasBirds[static_cast<std::size_t>(i)]);
    }
    for (int i = 0; i < 3; ++i)
    {
        askBtns[static_cast<std::size_t>(i)].setOn(view.ask == i);
        hintBtns[static_cast<std::size_t>(i)].setOn(view.hints == i);
        lengthBtns[static_cast<std::size_t>(i)].setOn(view.length == i);
    }
    layoutResult();
    repaint();
}

// One OPEN IN FIELD GUIDE per missed bird that fits; the rest are counted
// under the list.
void QuizScreen::layoutResult()
{
    const bool result = view.showResult && view.finished;
    const int fit = std::max(0, (resList.getHeight() - 2) / kMissRowH);
    const int total = static_cast<int>(view.misses.size());
    missRowsShown = result ? std::min(total, total > fit ? fit - 1 : fit) : 0;
    while (static_cast<int>(missBtns.size()) < missRowsShown)
    {
        const int i = static_cast<int>(missBtns.size());
        auto b = std::make_unique<Btn>();
        b->onClick = [this, i] { if (onOpenMiss) onOpenMiss(i); };
        addChildComponent(*b);
        missBtns.push_back(std::move(b));
    }
    const auto f = mono(10.0f, 500, 0.06f);
    const auto text = strings("quiz.open_guide");
    const int w = textW(f, text) + 20;
    for (int i = 0; i < static_cast<int>(missBtns.size()); ++i)
    {
        auto& b = *missBtns[static_cast<std::size_t>(i)];
        b.setVisible(i < missRowsShown);
        b.setText(text);
        b.setBounds(resList.getRight() - 1 - 6 - w, resList.getY() + 1 + i * kMissRowH + (kMissRowH - 24) / 2, w, 24);
    }
}

void QuizScreen::resized()
{
    auto r = getLocalBounds().reduced(8);
    left = r.removeFromLeft(950);
    r.removeFromLeft(12);
    right = r;

    auto l = left;
    counter = l.removeFromTop(14);
    l.removeFromTop(8);
    figure = l.removeFromTop(288);
    {
        auto inner = figure.reduced(1);
        figHead = inner.removeFromTop(28);
        figCaption = inner.removeFromBottom(18);
        figAxis = inner.removeFromLeft(28);
        figWell = inner;
        sono.setBounds(figWell);

        // Head tools, right aligned, 6px apart.
        const auto f = mono(10.0f, 500, 0.06f);
        int x = figHead.getRight() - 8;
        const int y = figHead.getY() + 4;
        for (auto* b : { &hintBtn, &halfBtn, &againBtn })
        {
            const int w = textW(f, b == &hintBtn ? strings("quiz.hint") : b == &halfBtn ? strings("quiz.half") : strings("quiz.play_again")) + 16;
            x -= w;
            b->setBounds(x, y, w, 20);
            x -= 6;
        }
    }
    l.removeFromTop(8);
    {
        const int w = (l.getWidth() - 8) / 2;
        for (int i = 0; i < 4; ++i)
            answers[static_cast<std::size_t>(i)].setBounds(l.getX() + (i % 2) * (w + 8), l.getY() + (i / 2) * 52, i % 2 == 1 ? l.getWidth() - w - 8 : w, 44);
        l.removeFromTop(96);
    }
    l.removeFromTop(8);
    band = l.removeFromTop(68);
    {
        auto b = band.reduced(12, 0);
        const auto f = mono(10.0f, 500, 0.06f);
        const int y = band.getCentreY() - 12;
        const int nextW = std::max(textW(f, strings("quiz.next")), textW(f, strings("quiz.again"))) + 28;
        nextBtn.setBounds(b.getRight() - nextW, y, nextW, 24);
        b.removeFromRight(nextW + 16);
        const int guideW = textW(f, strings("quiz.open_guide")) + 20;
        guideBtn.setBounds(b.getRight() - guideW, y, guideW, 24);
        b.removeFromRight(guideW + 16);
        const int cmpW = textW(f, strings("quiz.compare")) + 20;
        compareBtn.setBounds(b.getRight() - cmpW, y, cmpW, 24);
        b.removeFromRight(cmpW + 16);
        bandText = b.reduced(0, 6);
    }

    auto rr = right;
    setLabel = rr.removeFromTop(14);
    rr.removeFromTop(6);
    // Two columns, filled down the first, then the second (agreed with Eirik
    // 2026-11-26 when the sets grew from 6 to 9).
    {
        constexpr int rows = (pipp::Quiz::kNumSets + 1) / 2;
        const int colW = (rr.getWidth() + 1) / 2;
        for (int i = 0; i < pipp::Quiz::kNumSets; ++i)
        {
            const int col = i / rows, row = i % rows;
            const int x = rr.getX() + col * (colW - 1);
            const int w = col == 0 ? colW : rr.getRight() - x;
            setBtns[static_cast<std::size_t>(i)].setBounds(x, rr.getY() + row * 23, w, 24);
        }
        rr.removeFromTop(rows * 23 + 1);
    }
    rr.removeFromTop(12);
    askLabel = rr.removeFromTop(14);
    rr.removeFromTop(6);
    layoutJoined(rr.removeFromTop(24), { &askBtns[0], &askBtns[1], &askBtns[2] });
    rr.removeFromTop(12);
    hintsLabel = rr.removeFromTop(14);
    rr.removeFromTop(6);
    layoutJoined(rr.removeFromTop(24), { &hintBtns[0], &hintBtns[1], &hintBtns[2] });
    rr.removeFromTop(12);
    lengthLabel = rr.removeFromTop(14);
    rr.removeFromTop(6);
    layoutJoined(rr.removeFromTop(24), { &lengthBtns[0], &lengthBtns[1], &lengthBtns[2] });
    rr.removeFromTop(12);
    scoreLabel = rr.removeFromTop(14);
    rr.removeFromTop(6);
    scoreTable = rr.removeFromTop(3 * 22 + 2);
    rr.removeFromTop(6);
    practiseText = rr.removeFromTop(64);

    // Result panel over the figure, answers and band.
    resultArea = figure.getUnion(band);
    {
        auto a = resultArea.reduced(20, 16);
        resLabel = a.removeFromTop(14);
        a.removeFromTop(8);
        resScore = a.removeFromTop(68);
        resPct = a.removeFromTop(18);
        a.removeFromTop(16);
        resMissLabel = a.removeFromTop(14);
        a.removeFromTop(6);
        auto foot = a.removeFromBottom(24);
        const int againW = textW(mono(10.0f, 500, 0.06f), strings("quiz.again")) + 28;
        againResultBtn.setBounds(foot.getRight() - againW, foot.getY(), againW, 24);
        a.removeFromBottom(10);
        resList = a;
    }
    layoutResult();
}

void QuizScreen::paint(juce::Graphics& g)
{
    const bool no = strings.norwegian();
    const bool result = view.showResult && view.finished;
    draw::sectionLabel(g, counter, view.active ? strings.format("quiz.question", { { "n", juce::String(view.number) }, { "total", juce::String(view.total) } })
                                               : strings("quiz.question_none"));

    draw::sectionLabel(g, lengthLabel, strings("quiz.length"));
    if (result)
    {
        g.setColour(colour::panel);
        g.fillRect(resultArea);
        draw::border(g, resultArea);
        draw::sectionLabel(g, resLabel, strings("quiz.result"));
        g.setColour(colour::ink);
        g.setFont(serif(64.0f));
        g.drawText(strings.format("quiz.result_score", { { "correct", number(view.correct, 0, no) }, { "total", number(view.total, 0, no) } }),
                   resScore, juce::Justification::centredLeft, false);
        g.setFont(mono(12.0f, 500, 0.06f));
        const int pct = juce::roundToInt(100.0 * view.correct / std::max(1, view.total));
        g.drawText(strings.format("quiz.result_pct", { { "pct", number(pct, 0, no) } }), resPct, juce::Justification::centredLeft, false);
        draw::sectionLabel(g, resMissLabel, strings("quiz.result_missed"));
        draw::inset(g, resList);
        auto t = resList.reduced(1);
        const int total = static_cast<int>(view.misses.size());
        if (total == 0)
        {
            g.setColour(colour::inkSoft);
            g.setFont(mono(9.0f, 600, 0.14f));
            g.drawText(strings("quiz.result_none"), t.removeFromTop(28).reduced(8, 0), juce::Justification::centredLeft, false);
        }
        const int btnX = missBtns.empty() ? t.getRight() : missBtns.front()->getX();
        for (int i = 0; i < missRowsShown; ++i)
        {
            auto row = t.removeFromTop(kMissRowH);
            if (i < total - 1)
            {
                g.setColour(colour::divider);
                g.fillRect(row.getX(), row.getBottom() - 1, row.getWidth(), 1);
            }
            auto words = row.withRight(btnX - 8).reduced(8, 0);
            const auto& m = view.misses[static_cast<std::size_t>(i)];
            const auto nameF = serif(20.0f);
            g.setColour(colour::ink);
            g.setFont(nameF);
            const int nameW = std::min(words.getWidth() / 2, textW(nameF, m.name) + 4);
            g.drawText(m.name, words.removeFromLeft(nameW), juce::Justification::centredLeft, true);
            words.removeFromLeft(12);
            g.setColour(colour::inkSoft);
            g.setFont(mono(11.0f, 400));
            g.drawText(m.note, words, juce::Justification::centredLeft, true);
        }
        if (missRowsShown < total)
        {
            g.setColour(colour::inkSoft);
            g.setFont(mono(11.0f, 400));
            juce::StringArray rest;
            for (int i = missRowsShown; i < total; ++i)
                rest.add(view.misses[static_cast<std::size_t>(i)].name);
            g.drawFittedText(rest.joinIntoString(", "), t.removeFromTop(kMissRowH).reduced(8, 0), juce::Justification::centredLeft, 1, 0.8f);
        }
    }
    else
    {
    // Figure: head, kHz axis, well, caption.
    draw::border(g, figure);
    g.setColour(colour::panel);
    g.fillRect(figHead);
    g.setColour(colour::ink);
    g.fillRect(figHead.getX(), figHead.getBottom() - 1, figHead.getWidth(), 1);
    g.setFont(serif(22.0f));
    g.drawText(strings("quiz.title"), figHead.reduced(8, 0).withRight(againBtn.getX() - 8), juce::Justification::centredLeft, false);

    g.setFont(mono(9.0f, 400));
    g.setColour(colour::inkSoft);
    const auto axisText = [this](int n) { return strings.format("axis.khz", { { "n", juce::String(n) } }); };
    g.drawText(axisText(8), juce::Rectangle<int>(figAxis.getX(), figAxis.getY() + 2, figAxis.getWidth() - 4, 12), juce::Justification::centredRight, false);
    g.drawText(axisText(4), juce::Rectangle<int>(figAxis.getX(), figAxis.getY() + 122, figAxis.getWidth() - 4, 12), juce::Justification::centredRight, false);
    g.drawText("0", juce::Rectangle<int>(figAxis.getX(), figAxis.getBottom() - 14, figAxis.getWidth() - 4, 12), juce::Justification::centredRight, false);
    g.setColour(colour::ink);
    g.fillRect(figWell.getX() - 1, figWell.getY(), 1, figWell.getHeight());

    g.fillRect(figCaption.getX(), figCaption.getY(), figCaption.getWidth(), 1);
    {
        auto c = figCaption.withTrimmedTop(1).reduced(8, 0);
        const auto fig = mono(9.0f, 600, 0.14f);
        const auto figText = strings("fig") + " 1";
        g.setFont(fig);
        g.drawText(figText, c, juce::Justification::centredLeft, false);
        g.setFont(mono(9.0f, 400));
        g.drawFittedText(view.caption, c.withTrimmedLeft(textW(fig, figText) + 8), juce::Justification::centredLeft, 1, 0.8f);
    }

    // Band.
    g.setColour(colour::panel);
    g.fillRect(band);
    draw::border(g, band);
    g.setColour(colour::ink);
    g.setFont(mono(11.0f, 400));
    g.drawFittedText(view.band, bandText, juce::Justification::centredLeft, 3, 0.9f);
    }

    // Right column.
    draw::sectionLabel(g, setLabel, strings("quiz.birds"));
    draw::sectionLabel(g, askLabel, strings("quiz.ask"));
    draw::sectionLabel(g, hintsLabel, strings("quiz.hints"));
    draw::sectionLabel(g, scoreLabel, strings("quiz.score"));

    draw::inset(g, scoreTable);
    {
        const char* rows[3] = { "quiz.score_correct", "quiz.score_missed", "quiz.score_left" };
        const int values[3] = { view.correct, view.missed, view.left };
        auto t = scoreTable.reduced(1);
        for (int i = 0; i < 3; ++i)
        {
            auto row = t.removeFromTop(22);
            if (i < 2)
            {
                g.setColour(colour::divider);
                g.fillRect(row.getX(), row.getBottom() - 1, row.getWidth(), 1);
            }
            auto value = row.removeFromRight(56).reduced(8, 0);
            g.setColour(colour::inkSoft);
            g.setFont(mono(9.0f, 600, 0.14f));
            g.drawText(strings(rows[i]), row.reduced(8, 0), juce::Justification::centredLeft, false);
            g.setColour(colour::ink);
            g.setFont(mono(12.0f, 500));
            g.drawText(number(values[i], 0, no), value, juce::Justification::centredRight, false);
        }
    }
    g.setColour(colour::inkSoft);
    g.setFont(mono(11.0f, 400));
    g.drawFittedText(view.practise, practiseText, juce::Justification::topLeft, 4, 0.9f);
}
} // namespace pipp::ui
