#pragma once

// The live sonogram well, 680x320: 40px per kHz from 0 to 8 kHz, 80px per
// second. The playhead is fixed and the song scrolls under it. What the
// bird has sung is drawn in ink from the engine's sonogram feed. What it
// sings next is drawn in shadow grey from the phrase the engine published.

#include "Theme.h"

#include "BirdData.h"
#include "Engine.h"

#include <cmath>
#include <functional>

namespace tipp::ui
{
class Sonogram final : public juce::Component
{
public:
    static constexpr float kPxPerKHz = 40.0f;
    static constexpr float kPxPerSecond = 80.0f;
    static constexpr float kPlayheadX = 456.0f;

    explicit Sonogram(tipp::Engine& e) : engine(e) { setInterceptsMouseClicks(false, false); }

    juce::String nowText { "NOW" };
    std::function<juce::String(int knob)> handLabel; // "PITCH BY HAND"

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

private:
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
        if (bird == nullptr || ! engine.singing() || phrase.count == 0)
            return;

        const float pos = engine.phrasePosMs();
        const float tempo = std::max(0.25f, engine.phraseTempo());
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
};
} // namespace tipp::ui
