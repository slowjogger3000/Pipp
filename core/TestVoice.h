#pragma once

// M0 test voice: a sine with a linear gate ramp. It proves the engine,
// the render tool and the build. The syrinx voice replaces it in M1.

#include <cmath>

namespace tipp
{
class TestVoice
{
public:
    void prepare(double sampleRate) noexcept
    {
        sr = sampleRate;
        phase = 0.0;
        env = 0.0f;
        // 10 ms attack and release keep the gate edges click free.
        envStep = static_cast<float>(1.0 / (0.010 * sr));
    }

    // Control rate: called once per sub-block.
    void setFrequency(float hz) noexcept
    {
        phaseInc = 2.0 * kPi * static_cast<double>(hz) / sr;
    }

    void setGate(bool on) noexcept { gate = on; }

    bool isSilent() const noexcept { return ! gate && env <= 0.0f; }

    // Adds to out. gainFrom and gainTo ramp the level per sample.
    void render(float* out, int n, float gainFrom, float gainTo) noexcept
    {
        const float target = gate ? 1.0f : 0.0f;
        const float gainStep = (gainTo - gainFrom) / static_cast<float>(n);
        float g = gainFrom;

        for (int i = 0; i < n; ++i)
        {
            if (env < target)      env = std::fmin(env + envStep, target);
            else if (env > target) env = std::fmax(env - envStep, target);

            out[i] += g * env * static_cast<float>(std::sin(phase));

            phase += phaseInc;
            if (phase >= 2.0 * kPi)
                phase -= 2.0 * kPi;
            g += gainStep;
        }
    }

private:
    static constexpr double kPi = 3.14159265358979323846;

    double sr = 48000.0;
    double phase = 0.0;
    double phaseInc = 0.0;
    float env = 0.0f;
    float envStep = 0.0f;
    bool gate = false;
};
} // namespace tipp
