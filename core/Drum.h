#pragma once

// The drum source, for the great spotted woodpecker's drumming (M10). It sits
// beside the syrinx and takes the same VoiceControls: while a drum syllable
// sounds, freqHz is the knock's main resonance, amp shapes the roll, and
// drumRateHz is strokes per second.
//
// A stroke is a short click with a little noise (about half a millisecond) through two
// damped two-pole resonators: the main one at freqHz and a weaker, shorter
// one higher up, like bill on dry wood. The noise is audio noise from its own
// generator and never touches phrase choice. No allocation, no locks.

#include "Random.h"

#include <algorithm>
#include <cmath>

namespace tipp
{
class Drum
{
public:
    void prepare(double sampleRate) noexcept
    {
        sr = static_cast<float>(sampleRate);
        noise.seed(0xd7a3b011u);
        excDecay = std::exp(-1.0f / (0.00045f * sr));
        ampCoef = 1.0f - std::exp(-kTwoPi * 300.0f / sr);
        reset();
    }

    void reset() noexcept
    {
        strokePhase = 1.0f; // the first stroke falls on the first sample
        exc = 0.0f;
        ampSmooth = lastAmp = 0.0f;
        y1a = y2a = y1b = y2b = 0.0f;
        env = 0.0f;
    }

    // True while a stroke still rings, so the tail is not cut.
    bool ringing() const noexcept { return env > 1.0e-5f; }
    float envelope() const noexcept { return env; }

    // Adds n samples to out. active is false between drum notes: no new
    // strokes start, the last one rings out.
    void render(float* out, int n, float freqHz, float amp, float rateHz, bool active) noexcept
    {
        const float nyq = 0.45f * sr;
        const float fa = std::clamp(freqHz, 200.0f, nyq);
        const float fb = std::min(fa * 2.63f, nyq);
        // Ring times: about 9 ms for the body, 4 ms for the upper partial.
        const float ra = std::exp(-1.0f / (0.009f * sr));
        const float rb = std::exp(-1.0f / (0.004f * sr));
        const float wa = kTwoPi * fa / sr;
        const float wb = kTwoPi * fb / sr;
        const float a1a = 2.0f * ra * std::cos(wa), a2a = -ra * ra;
        const float a1b = 2.0f * rb * std::cos(wb), a2b = -rb * rb;
        // Scale the input so an impulse rings at about unit peak.
        const float ga = (1.0f - ra) * 2.0f;
        const float gb = (1.0f - rb) * 2.0f;
        const float inc = active ? std::max(0.0f, rateHz) / sr : 0.0f;
        const float aTarget = active ? std::clamp(amp, 0.0f, 1.0f) : 0.0f;
        const float invN = 1.0f / static_cast<float>(n);
        const float a0 = lastAmp;

        for (int i = 0; i < n; ++i)
        {
            const float frac = static_cast<float>(i + 1) * invN;
            ampSmooth += (a0 + (aTarget - a0) * frac - ampSmooth) * ampCoef;

            if (inc > 0.0f)
            {
                strokePhase += inc;
                if (strokePhase >= 1.0f)
                {
                    strokePhase -= 1.0f;
                    // Each stroke a little different in force.
                    strokeGain = ampSmooth * (0.85f + 0.15f * std::fabs(noise.next()));
                    exc = 1.0f;
                }
            }

            // A click with a little noise in it: every stroke rings about the same.
            const float x = exc * (0.75f + 0.25f * noise.next()) * strokeGain;
            exc *= excDecay;

            const float ya = ga * x + a1a * y1a + a2a * y2a;
            y2a = y1a;
            y1a = ya;
            const float yb = gb * x + a1b * y1b + a2b * y2b;
            y2b = y1b;
            y1b = yb;

            const float y = 6.5f * ya + 1.6f * yb;
            out[i] += y;
            env = std::max(std::fabs(y), env * 0.9995f);
        }
        lastAmp = aTarget;
    }

private:
    static constexpr float kTwoPi = 6.28318530717959f;

    float sr = 48000.0f;
    Noise noise;
    float strokePhase = 1.0f, exc = 0.0f, excDecay = 0.0f, strokeGain = 0.0f;
    float ampSmooth = 0.0f, ampCoef = 0.0f, lastAmp = 0.0f;
    float y1a = 0.0f, y2a = 0.0f, y1b = 0.0f, y2b = 0.0f;
    float env = 0.0f;
};
} // namespace tipp
