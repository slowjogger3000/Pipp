#pragma once

// A knob, 72 wide and 104 high: caps label, 72px dial, value. The value
// ring is plum while autoplay sings it and ink while the hand has it, with a
// HAND tag at the top right. Hover shows the exact value in an ink flag.
//
// The knob only sends hand values and hand-down and hand-up events. The
// override sequence runs in the engine.

#include "Theme.h"

#include "BirdData.h"
#include "Engine.h"
#include "Params.h"

#include <cmath>

namespace tipp::ui
{
class Knob final : public juce::Component
{
public:
    Knob(tipp::Engine& e, int knobIndex) : engine(e), k(knobIndex)
    {
        setMouseCursor(juce::MouseCursor::UpDownResizeCursor);
    }

    juce::String label, handTag;
    bool comma = false;

    void setBird(const tipp::BirdData* b)
    {
        bird = b;
        repaint();
    }

    // From the interface timer. Repaints only on change.
    void poll()
    {
        const float v = engine.knobValue(k);
        const bool hand = engine.knobOverridden(k);
        if (std::abs(v - shownValue) > 1e-5f || hand != shownHand)
        {
            shownValue = v;
            shownHand = hand;
            repaint();
        }
    }

    juce::String format(float v, bool exact) const
    {
        const int d = exact ? 2 : 0;
        switch (k)
        {
            case tipp::kPitch:
            {
                const float ref = bird != nullptr ? bird->pitchRefHz : 2000.0f;
                return number(v * ref / 1000.0f, exact ? 3 : 1, comma) + " kHz";
            }
            case tipp::kTrill:    return number(v, exact ? 1 : 0, comma) + " Hz";
            case tipp::kPause:
            case tipp::kLength:   return number(v, exact ? 2 : 1, comma) + " s";
            case tipp::kDistance: return number(v, exact ? 1 : 0, comma) + " m";
            case tipp::kWind:     return number(v, 1, comma) + " m/s";
            default:              return number(v, d == 0 ? 0 : 1, comma) + " %";
        }
    }

    void paint(juce::Graphics& g) override
    {
        const float norm = toNorm(shownValue);
        const juce::Point<float> c { 36.0f, 18.0f + 36.0f };
        constexpr float a0 = -0.75f * juce::MathConstants<float>::pi;
        constexpr float span = 1.5f * juce::MathConstants<float>::pi;

        g.setFont(mono(10.0f, 600, 0.14f));
        g.setColour(colour::inkSoft);
        g.drawText(label, juce::Rectangle<int>(0, 0, 72, 14), juce::Justification::centred, false);

        // 11 ticks at 27° outside the ring.
        g.setColour(colour::inkSoft);
        for (int i = 0; i < 11; ++i)
        {
            const float a = a0 + span * static_cast<float>(i) / 10.0f;
            const float s = std::sin(a), co = -std::cos(a);
            g.drawLine(c.x + 30.0f * s, c.y + 30.0f * co, c.x + 34.0f * s, c.y + 34.0f * co, 1.0f);
        }

        juce::Path track;
        track.addCentredArc(c.x, c.y, 26.5f, 26.5f, 0.0f, a0, a0 + span, true);
        g.setColour(colour::faint);
        g.strokePath(track, juce::PathStrokeType(3.0f));

        if (norm > 0.001f)
        {
            juce::Path arc;
            arc.addCentredArc(c.x, c.y, 26.5f, 26.5f, 0.0f, a0, a0 + span * norm, true);
            g.setColour(shownHand ? colour::ink : colour::plum);
            g.strokePath(arc, juce::PathStrokeType(3.0f));
        }

        g.setColour(colour::face);
        g.fillEllipse(c.x - 22.0f, c.y - 22.0f, 44.0f, 44.0f);
        g.setColour(colour::ink);
        g.drawEllipse(c.x - 22.0f, c.y - 22.0f, 44.0f, 44.0f, 1.0f);

        const float a = a0 + span * norm;
        g.drawLine(c.x + 6.0f * std::sin(a), c.y - 6.0f * std::cos(a), c.x + 19.0f * std::sin(a), c.y - 19.0f * std::cos(a), 2.0f);

        const juce::Rectangle<int> valueRow(0, 90, 72, 14);
        if (hover || dragging)
        {
            const auto f = mono(10.0f, 500, 0.06f);
            const auto text = format(shownValue, true);
            const int w = draw::textWidth(f, text) + 8;
            const juce::Rectangle<int> flag(36 - w / 2, 90, w, 14);
            g.setColour(colour::ink);
            g.fillRect(flag);
            g.setColour(colour::onInk);
            g.setFont(f);
            g.drawText(text, flag, juce::Justification::centred, false);
        }
        else
        {
            g.setFont(mono(10.0f, 500, 0.06f));
            g.setColour(colour::ink);
            g.drawText(format(shownValue, false), valueRow, juce::Justification::centred, false);
        }

        if (shownHand)
        {
            const auto f = mono(8.0f, 600, 0.06f);
            const int w = draw::textWidth(f, handTag) + 6;
            const juce::Rectangle<int> tag(72 + 6 - w, 12, w, 10);
            g.setColour(colour::ink);
            g.fillRect(tag);
            g.setColour(colour::onInk);
            g.setFont(f);
            g.drawText(handTag, tag, juce::Justification::centred, false);
        }
    }

    // The tag reaches 6px past the knob's right edge, so the component is
    // wider than the knob and does not clip it.
    static constexpr int kWidth = 72, kHeight = 104, kTagOverhang = 6;

    void mouseEnter(const juce::MouseEvent&) override { hover = true; repaint(); }
    void mouseExit(const juce::MouseEvent&) override { hover = false; repaint(); }

    void mouseDown(const juce::MouseEvent& e) override
    {
        dragging = true;
        startNorm = toNorm(engine.knobValue(k));
        startY = e.position.y;
        send(startNorm);
        engine.handDown(k);
        repaint();
    }

    void mouseDrag(const juce::MouseEvent& e) override
    {
        const float pixelsForRange = e.mods.isShiftDown() ? 800.0f : 200.0f;
        const float n = juce::jlimit(0.0f, 1.0f, startNorm + (startY - e.position.y) / pixelsForRange);
        send(n);
    }

    void mouseUp(const juce::MouseEvent&) override
    {
        dragging = false;
        engine.handUp(k);
        repaint();
    }

    void mouseWheelMove(const juce::MouseEvent&, const juce::MouseWheelDetails& w) override
    {
        const float n = juce::jlimit(0.0f, 1.0f, toNorm(engine.knobValue(k)) + w.deltaY * 0.15f);
        send(n);
        engine.handDown(k);
        engine.handUp(k);
    }

private:
    tipp::Range range() const noexcept
    {
        if (bird != nullptr)
            return bird->knobRange[static_cast<std::size_t>(k)];
        const auto& info = tipp::params::all[static_cast<std::size_t>(k)];
        return { static_cast<float>(info.min), static_cast<float>(info.max) };
    }

    // Pitch, pause, length and distance turn in equal ratios.
    bool logScale() const noexcept
    {
        return k == tipp::kPitch || k == tipp::kPause || k == tipp::kLength || k == tipp::kDistance;
    }

    float toNorm(float v) const noexcept
    {
        const auto r = range();
        if (r.hi <= r.lo)
            return 0.0f;
        v = juce::jlimit(r.lo, r.hi, v);
        if (logScale() && r.lo > 0.0f)
            return std::log(v / r.lo) / std::log(r.hi / r.lo);
        return (v - r.lo) / (r.hi - r.lo);
    }

    float fromNorm(float n) const noexcept
    {
        const auto r = range();
        if (logScale() && r.lo > 0.0f)
            return r.lo * std::pow(r.hi / r.lo, n);
        return r.lo + n * (r.hi - r.lo);
    }

    // Set the hand value before the hand-down, so the engine never takes
    // a stale one.
    void send(float n)
    {
        const float v = fromNorm(n);
        engine.setParam(k, v);
        shownValue = v;
        repaint();
    }

    tipp::Engine& engine;
    const int k;
    const tipp::BirdData* bird = nullptr;
    float shownValue = 0.0f;
    bool shownHand = false;
    bool hover = false, dragging = false;
    float startNorm = 0.0f, startY = 0.0f;
};
} // namespace tipp::ui
