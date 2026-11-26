#pragma once

// The syrinx voice: a pitched source with breath noise. Tension sets how
// many harmonics sound, trill is fast pitch and amplitude modulation,
// roughness is pitch jitter, a subharmonic and noisy amplitude.
//
// Controls arrive once per sub-block. Frequency and amplitude are
// interpolated per sample from the previous sub-block's values.
//
// Other sources (the woodpecker's drum in M10) sit beside this class and
// take the same VoiceControls.

#include "Random.h"

#include <algorithm>
#include <cmath>

namespace tipp
{
struct VoiceControls
{
    float freqHz = 2000.0f;
    float amp = 0.0f;      // 0 to 1
    float breath = 0.2f;   // 0 to 1
    float tension = 0.5f;  // 0 to 1
    float rough = 0.1f;    // 0 to 1
    float trillHz = 0.0f;
    float trillDepthSt = 0.0f;
    float trillAm = 0.0f;  // 0 to 1
};

class Syrinx
{
public:
    void prepare(double sampleRate) noexcept
    {
        sr = static_cast<float>(sampleRate);
        noise.seed(0x51a7c0deu);
        jitCoef = onePole(70.0f);
        raspCoef = onePole(1800.0f);
        ampCoef = onePole(300.0f); // about 0.5 ms, rounds the corners of contours
        // A one-pole low-pass of uniform noise has variance c / (2 - c) / 3.
        // These scale it back to roughly unit deviation.
        jitNorm = std::sqrt(3.0f * (2.0f - jitCoef) / jitCoef);
        raspNorm = std::sqrt(3.0f * (2.0f - raspCoef) / raspCoef);
        reset();
    }

    void reset() noexcept
    {
        phase = subPhase = trillPhase = 0.0f;
        jit = rasp = 0.0f;
        ampSmooth = lastAmp = 0.0f;
        ic1 = ic2 = 0.0f;
    }

    float envelope() const noexcept { return ampSmooth; }

    // Adds n samples to out.
    void render(float* out, int n, const VoiceControls& c) noexcept
    {
        const float nyq = 0.45f * sr;
        const float f0 = std::clamp(lastFreq, 20.0f, nyq);
        const float f1 = std::clamp(c.freqHz, 20.0f, nyq);

        // Harmonic weights from tension. 0 is a near-pure whistle.
        const float t = std::clamp(c.tension, 0.0f, 1.0f);
        const float ratio = 0.04f + 0.62f * t * t + 0.12f * t;
        float h[kMaxHarm] {};
        float sum = 0.0f;
        const float fMax = std::max(f0, f1) * 1.06f;
        float w = 1.0f;
        for (int k = 0; k < kMaxHarm; ++k)
        {
            const float fk = fMax * static_cast<float>(k + 1);
            const float fade = std::clamp((nyq - fk) / (0.05f * sr), 0.0f, 1.0f);
            h[k] = w * fade * ((k % 2 == 1) ? 1.0f : 0.8f);
            if (k == 0)
                h[k] = 1.0f;
            sum += h[k];
            w *= ratio;
        }
        const float rough = std::clamp(c.rough, 0.0f, 1.0f);
        const float sub = 0.4f * rough * rough;
        const float norm = 1.0f / (sum + sub);

        // Breath: band-pass noise that follows the pitch.
        const float breath = std::clamp(c.breath, 0.0f, 1.0f);
        const float fc = std::clamp(0.5f * (f0 + f1), 200.0f, nyq);
        const float g = std::tan(kPi * fc / sr);
        const float kq = 1.0f / 4.0f;
        const float a1 = 1.0f / (1.0f + g * (g + kq));
        const float a2 = g * a1;
        const float a3 = g * a2;

        const float tonalMix = 1.0f - 0.55f * breath;
        const float breathMix = breath * 1.6f;
        const float hissMix = breath * 0.012f;

        const float trillInc = kTwoPi * std::max(0.0f, c.trillHz) / sr;
        const float depth = c.trillDepthSt;
        const float am = std::clamp(c.trillAm, 0.0f, 1.0f);

        const float invN = 1.0f / static_cast<float>(n);
        const float a0 = lastAmp;
        const float aTarget = std::clamp(c.amp, 0.0f, 1.0f);

        for (int i = 0; i < n; ++i)
        {
            const float frac = static_cast<float>(i + 1) * invN;
            const float f = f0 + (f1 - f0) * frac;
            ampSmooth += (a0 + (aTarget - a0) * frac - ampSmooth) * ampCoef;

            jit += (noise.next() - jit) * jitCoef;
            rasp += (noise.next() - rasp) * raspCoef;

            trillPhase += trillInc;
            if (trillPhase >= kTwoPi)
                trillPhase -= kTwoPi;
            const float tri = std::sin(trillPhase);

            const float st = depth * tri + rough * 0.9f * jit * jitNorm;
            const float fi = std::min(f * std::exp2(st * (1.0f / 12.0f)), nyq);
            const float inc = kTwoPi * fi / sr;
            phase += inc;
            if (phase >= kTwoPi)
                phase -= kTwoPi;
            subPhase += 0.5f * inc;
            if (subPhase >= kTwoPi)
                subPhase -= kTwoPi;

            float tonal = 0.0f;
            for (int k = 0; k < kMaxHarm; ++k)
                if (h[k] > 0.0f)
                    tonal += h[k] * std::sin(static_cast<float>(k + 1) * phase);
            tonal += sub * std::sin(subPhase);
            tonal *= norm * (1.0f + rough * 0.7f * std::clamp(rasp * raspNorm, -1.5f, 1.5f));

            // TPT state-variable filter, band-pass output scaled to unity peak.
            const float x = noise.next();
            const float v3 = x - ic2;
            const float v1 = a1 * ic1 + a2 * v3;
            const float v2 = ic2 + a2 * ic1 + a3 * v3;
            ic1 = 2.0f * v1 - ic1;
            ic2 = 2.0f * v2 - ic2;
            const float band = v1 * kq * 7.0f;

            const float amMod = 1.0f - am * 0.5f * (1.0f - tri);
            out[i] += ampSmooth * amMod * (tonal * tonalMix + band * breathMix + noise.next() * hissMix);
        }

        lastFreq = c.freqHz;
        lastAmp = aTarget;
    }

private:
    static constexpr float kPi = 3.14159265358979f;
    static constexpr float kTwoPi = 6.28318530717959f;
    static constexpr int kMaxHarm = 6;

    float onePole(float hz) const noexcept { return 1.0f - std::exp(-kTwoPi * hz / sr); }

    float sr = 48000.0f;
    Noise noise;
    float phase = 0.0f, subPhase = 0.0f, trillPhase = 0.0f;
    float jit = 0.0f, rasp = 0.0f, jitCoef = 0.0f, raspCoef = 0.0f, jitNorm = 1.0f, raspNorm = 1.0f;
    float ampSmooth = 0.0f, ampCoef = 0.0f, lastAmp = 0.0f;
    float lastFreq = 2000.0f;
    float ic1 = 0.0f, ic2 = 0.0f;
};
} // namespace tipp
