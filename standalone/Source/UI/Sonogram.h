#pragma once

// The live sonogram well, 680x320: 40px per kHz from 0 to 8 kHz, 80px per
// second. The playhead is fixed and the song scrolls under it. What the
// bird has sung is drawn in ink from the engine's sonogram feed. What it
// sings next is drawn in shadow grey from the phrase the engine published.
//
// Draw mode (design/Draw.dc.html): the view stops once the phrase being
// sung has ended, and that phrase turns grey. The axis then reads 0 to
// 8.5 s from the left edge. Strokes add to the drawn line, which is drawn
// with tipp::drawnAt(), the same function the engine sings.

#include "Theme.h"

#include "BirdData.h"
#include "Drawn.h"
#include "Engine.h"

#include <cmath>
#include <functional>
#include <vector>

namespace tipp::ui
{
class Sonogram final : public juce::Component
{
public:
    static constexpr float kPxPerKHz = 40.0f;
    static constexpr float kPxPerSecond = 80.0f;
    static constexpr float kPlayheadX = 456.0f;

    static constexpr float kPxPerMs = kPxPerSecond / 1000.0f;
    static constexpr float kPxPerHz = kPxPerKHz / 1000.0f;
    static constexpr float kStrokeTolPx = 2.5f;
    static constexpr float kEraseRadiusPx = 7.0f;

    explicit Sonogram(tipp::Engine& e) : engine(e) { setInterceptsMouseClicks(false, false); }

    juce::String nowText { "NOW" };
    juce::String yourPhraseText { "YOUR PHRASE STARTS" };
    std::function<juce::String(int knob)> handLabel; // "PITCH BY HAND"
    std::function<juce::String(float hz, float seconds)> flagText; // "3.4 kHz  6.6 s"

    // Draw mode. The line belongs to the interface; onLineChanged hands it
    // to the engine after each stroke or erase.
    tipp::DrawnLine line;
    bool erasing = false;
    std::function<void()> onLineChanged;

    void setDrawMode(bool on)
    {
        drawMode = on;
        frozen.clear();
        frozenReady = false;
        hover = false;
        stroke.clear();
        setInterceptsMouseClicks(on, false);
        setMouseCursor(on ? juce::MouseCursor::CrosshairCursor : juce::MouseCursor::NormalCursor);
        repaint();
    }
    bool isFrozen() const noexcept { return frozenReady; }

    // Test hook: show the crosshair at a point, as if the pointer were there.
    void hoverAt(juce::Point<float> p)
    {
        hover = true;
        pointer = p;
        repaint();
    }

    void setBird(const tipp::BirdData* b) { bird = b; }

    // From the interface timer at 30 Hz.
    void poll()
    {
        tipp::Engine::PhraseView v;
        for (int attempt = 0; attempt < 4; ++attempt)
            if (engine.readPhrase(v))
            {
                phrase = v;
                break;
            }
        if (phrase.number != startNumber)
        {
            // About one timer tick after it began.
            startNumber = phrase.number;
            const auto back = static_cast<std::uint32_t>(engine.sonoFrameRate() / 30.0);
            phraseStartFrame = engine.sonoWritten() > back ? engine.sonoWritten() - back : 0u;
        }
        if (drawMode && ! frozenReady && ! (engine.singing() && ! phrase.drawn))
            freeze();
        repaint();
    }

    const tipp::Engine::PhraseView& lastPhrase() const noexcept { return phrase; }

    void paint(juce::Graphics& g) override
    {
        const auto r = getLocalBounds();
        draw::graphPaper(g, r);
        g.setColour(colour::shadow);
        g.fillRect(0, 0, r.getWidth(), 1);
        g.fillRect(0, 0, 1, r.getHeight());

        const float h = static_cast<float>(r.getHeight());
        auto yFor = [h](float hz) { return h - hz / 1000.0f * kPxPerKHz; };

        if (drawMode && frozenReady)
        {
            paintFrozen(g, yFor);
            paintLine(g, yFor);
            paintCursor(g);
            return;
        }

        paintSung(g, yFor);
        paintNext(g, yFor);

        // Playhead and its flag.
        g.setColour(colour::plum);
        g.fillRect(kPlayheadX, 0.0f, 1.0f, h);
        g.fillRect(kPlayheadX + 1.0f, 0.0f, 26.0f, 12.0f);
        g.setColour(colour::paper);
        g.setFont(mono(8.0f, 600, 0.06f));
        g.drawText(nowText, juce::Rectangle<float>(kPlayheadX + 5.0f, 0.0f, 40.0f, 12.0f), juce::Justification::centredLeft, false);
    }

    void mouseDown(const juce::MouseEvent& e) override
    {
        pointer = e.position;
        hover = true;
        stroke.clear();
        if (erasing)
            eraseAt(e.position);
        else
            stroke.push_back(pointFor(e.position));
        repaint();
    }

    void mouseDrag(const juce::MouseEvent& e) override
    {
        pointer = e.position;
        if (erasing)
            eraseAt(e.position);
        else if (! stroke.empty())
        {
            // Time only moves forward: a stroke is a pitch line.
            const auto p = pointFor(e.position);
            if (p.tMs >= stroke.back().tMs + 1.0f)
                stroke.push_back(p);
        }
        repaint();
    }

    void mouseUp(const juce::MouseEvent&) override
    {
        if (! erasing && ! stroke.empty())
        {
            tipp::addStroke(line, stroke.data(), static_cast<int>(stroke.size()), kPxPerMs, kPxPerHz, kStrokeTolPx);
            stroke.clear();
            if (onLineChanged)
                onLineChanged();
        }
        repaint();
    }

    void mouseMove(const juce::MouseEvent& e) override
    {
        pointer = e.position;
        hover = true;
        repaint();
    }

    void mouseExit(const juce::MouseEvent&) override
    {
        hover = false;
        repaint();
    }

private:
    tipp::DrawnPoint pointFor(juce::Point<float> p) const
    {
        const float h = static_cast<float>(getHeight());
        return { std::max(0.0f, p.x) / kPxPerMs, std::clamp((h - p.y) / kPxPerHz, tipp::kDrawMinHz, tipp::kDrawMaxHz), false };
    }

    void eraseAt(juce::Point<float> p)
    {
        const auto at = pointFor(p);
        if (tipp::eraseNear(line, at.tMs, at.hz, kPxPerMs, kPxPerHz, kEraseRadiusPx) && onLineChanged)
            onLineChanged();
    }

    // Copies the last phrase out of the engine's ring, from a little before
    // it began, so it stays while the ring moves on.
    void freeze()
    {
        frozen.clear();
        frozenRate = engine.sonoFrameRate();
        const std::uint32_t written = engine.sonoWritten();
        const std::uint32_t avail = std::min<std::uint32_t>(written, tipp::Engine::kSonoFrames - 64);
        const std::uint32_t oldest = written - avail;
        const auto lead = static_cast<std::uint32_t>(0.35 * frozenRate);
        if (startNumber > 0u && phraseStartFrame >= oldest + lead)
        {
            const auto span = static_cast<std::uint32_t>(static_cast<double>(getWidth()) / kPxPerSecond * frozenRate);
            const std::uint32_t from = phraseStartFrame - lead;
            for (std::uint32_t i = from; i < written && i - from < span; ++i)
                frozen.push_back(engine.sonoFrame(i));
        }
        frozenReady = true;
    }

    template <typename YFor>
    void paintFrozen(juce::Graphics& g, YFor yFor)
    {
        if (frozen.size() < 2 || frozenRate <= 0.0)
            return;
        constexpr float kGate = 0.03f;
        g.setColour(colour::shadow);
        for (std::size_t i = 1; i < frozen.size(); ++i)
        {
            const auto& f = frozen[i];
            const auto& prev = frozen[i - 1];
            if (f.amp > kGate && prev.amp > kGate && f.freqHz > 0.0f && prev.freqHz > 0.0f
                && std::abs(std::log2(f.freqHz / prev.freqHz)) < 0.35f)
            {
                const float level = std::min(1.0f, 0.5f * (f.amp + prev.amp) / 0.35f);
                const auto x0 = static_cast<float>(static_cast<double>(i - 1) / frozenRate) * kPxPerSecond;
                const auto x1 = static_cast<float>(static_cast<double>(i) / frozenRate) * kPxPerSecond;
                g.drawLine(x0, yFor(prev.freqHz), x1, yFor(f.freqHz), 1.5f + 1.5f * level);
            }
        }
    }

    // The drawn line: 3px ink through 6px square points, a dashed line where
    // it starts, and a marker while the bird sings it.
    template <typename YFor>
    void paintLine(juce::Graphics& g, YFor yFor)
    {
        const float h = static_cast<float>(getHeight());
        if (line.count > 0)
        {
            const float startX = std::floor(tipp::drawnStart(line) * kPxPerMs) + 0.5f;
            juce::Path dash;
            dash.startNewSubPath(startX, 0.0f);
            dash.lineTo(startX, h);
            const float pattern[2] = { 2.0f, 4.0f };
            juce::PathStrokeType(1.0f).createDashedStroke(dash, dash, pattern, 2);
            g.setColour(colour::ink);
            g.fillPath(dash);
            g.setFont(mono(8.0f, 600, 0.06f));
            g.drawText(yourPhraseText, juce::Rectangle<float>(startX + 5.5f, 3.0f, 200.0f, 11.0f), juce::Justification::centredLeft, false);
        }

        g.setColour(colour::ink);
        g.strokePath(linePath(yFor), juce::PathStrokeType(3.0f, juce::PathStrokeType::mitered, juce::PathStrokeType::butt));

        if (! stroke.empty())
        {
            juce::Path p;
            p.startNewSubPath(stroke.front().tMs * kPxPerMs, yFor(stroke.front().hz));
            for (const auto& s : stroke)
                p.lineTo(s.tMs * kPxPerMs, yFor(s.hz));
            g.strokePath(p, juce::PathStrokeType(3.0f));
        }

        for (int i = 0; i < line.count; ++i)
        {
            const auto& pt = line.pts[static_cast<std::size_t>(i)];
            const juce::Rectangle<float> sq(std::round(pt.tMs * kPxPerMs) - 3.0f, std::round(yFor(pt.hz)) - 3.0f, 6.0f, 6.0f);
            g.setColour(colour::face);
            g.fillRect(sq);
            g.setColour(colour::ink);
            g.drawRect(sq, 1.0f);
        }

        if (engine.singing() && phrase.drawn)
        {
            const float x = (phrase.drawnStartMs + engine.phrasePosMs()) * kPxPerMs;
            g.setColour(colour::plum);
            g.fillRect(x, 0.0f, 1.0f, h);
        }
    }

    template <typename YFor>
    juce::Path linePath(YFor yFor) const
    {
        juce::Path p;
        for (int a = 0; a < line.count;)
        {
            int b = a;
            while (b + 1 < line.count && line.pts[static_cast<std::size_t>(b + 1)].joinPrev)
                ++b;
            const float t0 = line.pts[static_cast<std::size_t>(a)].tMs;
            const float t1 = a == b ? t0 + tipp::kDotMs : line.pts[static_cast<std::size_t>(b)].tMs;
            const int steps = std::max(1, static_cast<int>((t1 - t0) * kPxPerMs / 2.0f));
            for (int j = 0; j <= steps; ++j)
            {
                const float t = t0 + (t1 - t0) * static_cast<float>(j) / static_cast<float>(steps);
                float hz = 0.0f, amp = 0.0f;
                tipp::drawnAt(line, std::clamp(t, t0 + 0.01f, t1 - 0.01f), hz, amp);
                if (j == 0)
                    p.startNewSubPath(t * kPxPerMs, yFor(hz));
                else
                    p.lineTo(t * kPxPerMs, yFor(hz));
            }
            a = b + 1;
        }
        return p;
    }

    void paintCursor(juce::Graphics& g)
    {
        if (! hover)
            return;
        const float x = std::round(pointer.x), y = std::round(pointer.y);
        g.setColour(colour::ink);
        g.fillRect(x, y - 14.0f, 1.0f, 28.0f);
        g.fillRect(x - 14.0f, y, 28.0f, 1.0f);
        if (erasing)
        {
            g.drawEllipse(x - kEraseRadiusPx, y - kEraseRadiusPx, 2.0f * kEraseRadiusPx, 2.0f * kEraseRadiusPx, 1.0f);
            return;
        }
        if (! flagText)
            return;
        const auto p = pointFor(pointer);
        const auto text = flagText(p.hz, p.tMs / 1000.0f);
        const auto f = mono(9.0f, 500);
        const float w = static_cast<float>(draw::textWidth(f, text)) + 12.0f;
        float fx = x + 6.0f, fy = y - 24.0f;
        if (fx + w > static_cast<float>(getWidth()))
            fx = x - 6.0f - w;
        if (fy < 0.0f)
            fy = y + 10.0f;
        g.fillRect(fx, fy, w, 14.0f);
        g.setColour(colour::onInk);
        g.setFont(f);
        g.drawText(text, juce::Rectangle<float>(fx + 5.0f, fy, w, 14.0f), juce::Justification::centredLeft, false);
    }

    template <typename YFor>
    void paintSung(juce::Graphics& g, YFor yFor)
    {
        const std::uint32_t written = engine.sonoWritten();
        const double rate = engine.sonoFrameRate();
        if (written < 2u || rate <= 0.0)
            return;

        const auto visible = static_cast<std::uint32_t>(std::ceil(kPlayheadX / kPxPerSecond * rate)) + 2u;
        const std::uint32_t avail = std::min<std::uint32_t>(written, tipp::Engine::kSonoFrames - 64);
        const std::uint32_t count = std::min(visible, avail);
        const std::uint32_t first = written - count;
        auto xFor = [&](std::uint32_t i) {
            return kPlayheadX - static_cast<float>(static_cast<double>(written - 1u - i) / rate) * kPxPerSecond;
        };

        constexpr float kGate = 0.03f;
        tipp::Engine::SonoFrame prev = engine.sonoFrame(first);
        float prevX = xFor(first);

        int runKnob = -1;
        float runStart = 0.0f;
        auto closeRun = [&](float endX) {
            if (runKnob < 0)
                return;
            g.setColour(colour::ink);
            g.fillRect(juce::Rectangle<float>(runStart, 4.0f, std::max(1.0f, endX - runStart), 4.0f));
            if (handLabel)
            {
                const auto text = handLabel(runKnob);
                const auto f = mono(8.0f, 600, 0.06f);
                const float w = static_cast<float>(draw::textWidth(f, text));
                g.setFont(f);
                const float x = runStart - 6.0f - w >= 2.0f ? runStart - 6.0f - w : endX + 6.0f;
                g.drawText(text, juce::Rectangle<float>(x, 2.0f, w + 2.0f, 10.0f), juce::Justification::centredLeft, false);
            }
            runKnob = -1;
        };

        for (std::uint32_t i = first + 1u; i < written; ++i)
        {
            const auto f = engine.sonoFrame(i);
            const float x = xFor(i);

            if (f.amp > kGate && prev.amp > kGate && f.freqHz > 0.0f && prev.freqHz > 0.0f
                && std::abs(std::log2(f.freqHz / prev.freqHz)) < 0.35f)
            {
                const float level = std::min(1.0f, 0.5f * (f.amp + prev.amp) / 0.35f);
                g.setColour(colour::ink);
                g.drawLine(prevX, yFor(prev.freqHz), x, yFor(f.freqHz), 1.5f + 1.5f * level);
            }

            const int knob = f.handMask != 0 ? lowestBit(f.handMask) : -1;
            if (knob != runKnob)
            {
                closeRun(x);
                if (knob >= 0)
                {
                    runKnob = knob;
                    runStart = x;
                }
            }
            prev = f;
            prevX = x;
        }
        closeRun(kPlayheadX);
    }

    template <typename YFor>
    void paintNext(juce::Graphics& g, YFor yFor)
    {
        if (bird == nullptr || ! engine.singing())
            return;

        const float pos = engine.phrasePosMs();
        const float tempo = std::max(0.01f, engine.phraseTempo());

        // A kept line: the rest of it, from the interface's own copy.
        if (phrase.drawn)
        {
            const float pitchRatio = engine.knobValue(tipp::kPitch) / std::max(0.01f, bird->base[tipp::kPitch]);
            const float from = phrase.drawnStartMs + pos;
            const float end = tipp::drawnEnd(line);
            g.setColour(colour::shadow);
            float px = 0.0f, py = 0.0f;
            bool prevOn = false;
            for (float t = from; t <= end; t += 3.0f / kPxPerSecond * 1000.0f * tempo)
            {
                float hz = 0.0f, amp = 0.0f;
                tipp::drawnAt(line, t, hz, amp);
                const float x = kPlayheadX + (t - from) / tempo * kPxPerMs;
                const float y = yFor(hz * pitchRatio);
                const bool on = amp > 0.08f;
                if (on && prevOn)
                    g.drawLine(px, py, x, y, 3.0f);
                px = x;
                py = y;
                prevOn = on;
            }
            return;
        }
        if (phrase.count == 0)
            return;
        const float pitchKnob = engine.knobValue(tipp::kPitch);
        const float w = static_cast<float>(getWidth());
        g.setColour(colour::shadow);

        for (int i = 0; i < phrase.count; ++i)
        {
            const auto& n = phrase.notes[static_cast<std::size_t>(i)];
            if (n.syl < 0 || n.syl >= static_cast<int>(bird->syllables.size()) || n.durMs <= 0.0f)
                continue;
            const float end = n.startMs + n.durMs;
            if (end <= pos)
                continue;
            const float startX = kPlayheadX + (std::max(n.startMs, pos) - pos) / tempo / 1000.0f * kPxPerSecond;
            if (startX > w)
                break;

            const auto& s = bird->syllables[static_cast<std::size_t>(n.syl)];
            const float u0 = std::max(0.0f, (pos - n.startMs) / n.durMs);
            const int steps = std::max(2, static_cast<int>(n.durMs / tempo / 1000.0f * kPxPerSecond / 3.0f));
            float px = 0.0f, py = 0.0f;
            bool prevOn = false;
            for (int j = 0; j <= steps; ++j)
            {
                const float u = u0 + (1.0f - u0) * static_cast<float>(j) / static_cast<float>(steps);
                const float t = n.startMs + u * n.durMs;
                const float x = kPlayheadX + (t - pos) / tempo / 1000.0f * kPxPerSecond;
                const float y = yFor(tipp::contourPitchAt(s.pitch, u) * n.pitchMul * pitchKnob);
                const float a = tipp::contourAt(s.amp, u) * s.gain;
                const bool on = a > 0.08f;
                if (on && prevOn)
                    g.drawLine(px, py, x, y, 1.5f + 1.5f * std::min(1.0f, a));
                px = x;
                py = y;
                prevOn = on;
            }
        }
    }

    static int lowestBit(std::uint16_t m) noexcept
    {
        for (int b = 0; b < 16; ++b)
            if ((m >> b) & 1u)
                return b;
        return -1;
    }

    tipp::Engine& engine;
    const tipp::BirdData* bird = nullptr;
    tipp::Engine::PhraseView phrase;

    bool drawMode = false, frozenReady = false, hover = false;
    std::vector<tipp::Engine::SonoFrame> frozen;
    double frozenRate = 0.0;
    std::uint32_t startNumber = 0u, phraseStartFrame = 0u;
    juce::Point<float> pointer;
    std::vector<tipp::DrawnPoint> stroke;
};
} // namespace tipp::ui
