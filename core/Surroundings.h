#pragma once

// Where the bird is heard: distance (level, high-frequency loss and more
// room), wind (a gusting low rumble, leaf rustle and turbulence on the
// bird), space (a small feedback delay network whose colour follows the
// place). Mono bird in, stereo out.

#include "Random.h"

#include <vector>

namespace pipp
{
class Surroundings
{
public:
    // Allocates. Call before audio starts.
    void prepare(double sampleRate);
    void reset() noexcept;

    // Control values, once per sub-block. distance in m, wind in m/s,
    // space 0 to 1, place is the sc_place index.
    void set(float distanceM, float windMs, float space, int place) noexcept;

    // Writes n samples to left and right (overwrites).
    void process(const float* bird, float* left, float* right, int n) noexcept;

private:
    static constexpr int kLines = 4;

    struct Delay
    {
        std::vector<float> buf;
        int len = 1;
        int pos = 0;
        float read() const noexcept { return buf[static_cast<std::size_t>(pos)]; }
        void write(float v) noexcept
        {
            buf[static_cast<std::size_t>(pos)] = v;
            if (++pos >= len)
                pos = 0;
        }
    };

    float sr = 48000.0f;
    Noise noise;

    // Distance.
    float gain = 0.5f, gainTarget = 0.5f;
    float lpCoef = 1.0f, lp1 = 0.0f, lp2 = 0.0f;
    float send = 0.0f, sendTarget = 0.0f;

    // Wind.
    float windLevel = 0.0f, windTarget = 0.0f;
    float rustleTarget = 0.0f, rustle = 0.0f;
    float windCoef = 0.0f;
    float wl1 = 0.0f, wl2 = 0.0f, wr1 = 0.0f, wr2 = 0.0f;
    float rl = 0.0f, rr = 0.0f, rlh = 0.0f, rrh = 0.0f;
    float gust = 1.0f, gustFrom = 1.0f, gustTo = 1.0f;
    int gustPos = 0, gustLen = 1;
    float turb = 0.0f, turbDepth = 0.0f;

    // Shore surf bed.
    float surfLevel = 0.0f, surfTarget = 0.0f, surfPhase = 0.0f;
    float sl = 0.0f, sr2 = 0.0f;

    // Reverb.
    Delay diffuse[2];
    Delay lines[kLines];
    float damp[kLines] {};
    float fb[kLines] {};
    float fbTarget[kLines] {};
    float dampCoef = 0.3f, dampTarget = 0.3f;
};
} // namespace pipp
