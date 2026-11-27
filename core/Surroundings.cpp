#include "Surroundings.h"

#include <algorithm>
#include <cmath>

namespace pipp
{
namespace
{
constexpr float kTwoPi = 6.28318530717959f;

// Reverb character per sc_place: garden, forest, open, shore.
struct PlaceSound
{
    float t60;      // s
    float damping;  // 0 bright to 1 dark
    float wetScale;
    float rustle;   // leaf rustle in wind
    float surf;     // background surf level
};
constexpr PlaceSound kPlaces[4] {
    { 0.9f, 0.45f, 0.8f, 1.0f, 0.0f },  // garden: walls and hedges, short
    { 1.9f, 0.65f, 1.0f, 1.4f, 0.0f },  // forest: long, dark
    { 0.35f, 0.3f, 0.45f, 0.3f, 0.0f }, // open: almost dry
    { 1.1f, 0.35f, 0.7f, 0.2f, 1.0f },  // shore: bright, surf behind
};

constexpr int kDiffuseLen[2] { 142, 379 };
constexpr int kLineLen[4] { 1559, 1867, 2251, 2741 };
} // namespace

void Surroundings::prepare(double sampleRate)
{
    sr = static_cast<float>(sampleRate);
    const float scale = sr / 48000.0f;
    for (int i = 0; i < 2; ++i)
    {
        diffuse[i].len = std::max(1, static_cast<int>(static_cast<float>(kDiffuseLen[i]) * scale));
        diffuse[i].buf.assign(static_cast<std::size_t>(diffuse[i].len), 0.0f);
    }
    for (int i = 0; i < kLines; ++i)
    {
        lines[i].len = std::max(1, static_cast<int>(static_cast<float>(kLineLen[i]) * scale));
        lines[i].buf.assign(static_cast<std::size_t>(lines[i].len), 0.0f);
    }
    windCoef = 1.0f - std::exp(-kTwoPi * 260.0f / sr);
    noise.seed(0x77a1d5edu);
    reset();
}

void Surroundings::reset() noexcept
{
    for (auto& d : diffuse) { std::fill(d.buf.begin(), d.buf.end(), 0.0f); d.pos = 0; }
    for (auto& d : lines)   { std::fill(d.buf.begin(), d.buf.end(), 0.0f); d.pos = 0; }
    for (int i = 0; i < kLines; ++i) { damp[i] = 0.0f; fb[i] = fbTarget[i]; }
    lp1 = lp2 = 0.0f;
    wl1 = wl2 = wr1 = wr2 = rl = rr = rlh = rrh = 0.0f;
    sl = sr2 = 0.0f;
    gain = gainTarget;
    send = sendTarget;
    windLevel = windTarget;
    rustle = rustleTarget;
    surfLevel = surfTarget;
    dampCoef = dampTarget;
}

void Surroundings::set(float distanceM, float windMs, float space, int place) noexcept
{
    const float d = std::clamp(distanceM, 1.0f, 200.0f);
    const auto& p = kPlaces[std::clamp(place, 0, 3)];

    // Level falls with distance, more gently than 1/r so far birds stay audible.
    gainTarget = 1.0f / (1.0f + (d - 1.0f) / 22.0f);

    // Air and foliage take the top off: about 15 kHz at 1 m, 4.5 kHz at 50 m.
    const float cutoff = std::clamp(17000.0f / (1.0f + d / 18.0f), 900.0f, 0.45f * sr);
    lpCoef = 1.0f - std::exp(-kTwoPi * cutoff / sr);

    // More of the room is heard as the bird moves away.
    const float s = std::clamp(space, 0.0f, 1.0f);
    sendTarget = s * p.wetScale * (0.35f + 0.65f * std::min(1.0f, d / 60.0f));

    for (int i = 0; i < kLines; ++i)
        fbTarget[i] = std::pow(10.0f, -3.0f * static_cast<float>(lines[i].len) / (sr * p.t60));
    dampTarget = p.damping;

    const float w = std::clamp(windMs, 0.0f, 15.0f) / 15.0f;
    windTarget = 0.5f * w * std::sqrt(w);
    rustleTarget = 0.05f * w * w * p.rustle;
    turbDepth = 0.45f * w;
    surfTarget = 0.035f * p.surf * (0.3f + 0.7f * s);
}

void Surroundings::process(const float* bird, float* left, float* right, int n) noexcept
{
    const float invN = 1.0f / static_cast<float>(n);
    const float g0 = gain, s0 = send, w0 = windLevel, r0 = rustle, sf0 = surfLevel;
    const float dg = (gainTarget - g0) * invN;
    const float ds = (sendTarget - s0) * invN;
    const float dw = (windTarget - w0) * invN;
    const float dr = (rustleTarget - r0) * invN;
    const float dsf = (surfTarget - sf0) * invN;

    for (int i = 0; i < kLines; ++i)
        fb[i] += (fbTarget[i] - fb[i]) * 0.05f;
    dampCoef += (dampTarget - dampCoef) * 0.05f;
    const float dampA = 1.0f - dampCoef * 0.85f;

    // Turbulence: a slow random wobble of the bird's level in wind.
    turb += (noise.next() - turb) * 0.004f;
    const float turbGain = std::max(0.0f, 1.0f + turbDepth * turb * 6.0f);

    const float surfInc = kTwoPi * 0.09f / sr;
    const float rustleCoef = 0.35f;

    for (int i = 0; i < n; ++i)
    {
        const float fi = static_cast<float>(i);
        const float g = (g0 + dg * fi) * turbGain;
        const float sendNow = s0 + ds * fi;

        // Distance: two one-pole low-passes.
        lp1 += (bird[i] - lp1) * lpCoef;
        lp2 += (lp1 - lp2) * lpCoef;
        const float dry = lp2 * g;

        // Gusts: a new target every 0.6 to 2.4 s, smoothed.
        if (++gustPos >= gustLen)
        {
            gustPos = 0;
            gustLen = static_cast<int>(sr * (0.6f + 1.8f * (0.5f + 0.5f * noise.next())));
            gustFrom = gustTo;
            gustTo = 0.35f + 0.65f * (0.5f + 0.5f * noise.next()) + 0.4f * std::max(0.0f, noise.next());
        }
        const float gp = static_cast<float>(gustPos) / static_cast<float>(gustLen);
        gust = gustFrom + (gustTo - gustFrom) * (0.5f - 0.5f * std::cos(gp * 3.14159265f));

        // Wind rumble, low-passed twice per side.
        const float wc = windCoef * (0.6f + 0.6f * gust);
        wl1 += (noise.next() - wl1) * wc; wl2 += (wl1 - wl2) * wc;
        wr1 += (noise.next() - wr1) * wc; wr2 += (wr1 - wr2) * wc;
        const float wl = (w0 + dw * fi) * gust;

        // Leaf rustle: high-passed noise, comes with the strongest gusts.
        const float nl = noise.next(), nr = noise.next();
        rl += (nl - rl) * rustleCoef; rr += (nr - rr) * rustleCoef;
        rlh += (rl - rlh) * 0.08f; rrh += (rr - rrh) * 0.08f;
        const float rlev = (r0 + dr * fi) * gust * gust;

        // Surf: low noise that swells slowly.
        surfPhase += surfInc;
        if (surfPhase >= kTwoPi)
            surfPhase -= kTwoPi;
        const float swell = 0.55f + 0.45f * std::sin(surfPhase) * std::sin(surfPhase * 0.37f + 1.0f);
        sl += (noise.next() - sl) * 0.03f;
        sr2 += (noise.next() - sr2) * 0.03f;
        const float surf = (sf0 + dsf * fi) * swell * 5.0f;

        // Reverb: two diffusers into a 4-line Hadamard FDN.
        float x = lp1 * g * sendNow;
        for (auto& d : diffuse)
        {
            const float z = d.read();
            const float v = x + 0.6f * z;
            d.write(v);
            x = z - 0.6f * v;
        }
        float o[kLines];
        for (int k = 0; k < kLines; ++k)
        {
            damp[k] += (lines[k].read() - damp[k]) * dampA;
            o[k] = damp[k];
        }
        const float h0 = 0.5f * (o[0] + o[1] + o[2] + o[3]);
        const float h1 = 0.5f * (o[0] - o[1] + o[2] - o[3]);
        const float h2 = 0.5f * (o[0] + o[1] - o[2] - o[3]);
        const float h3 = 0.5f * (o[0] - o[1] - o[2] + o[3]);
        lines[0].write(x + h0 * fb[0]);
        lines[1].write(x + h1 * fb[1]);
        lines[2].write(h2 * fb[2]);
        lines[3].write(h3 * fb[3]);
        const float revL = 0.6f * (o[0] + o[2]);
        const float revR = 0.6f * (o[1] + o[3]);

        left[i] = dry + revL + wl * wl2 * 6.0f + rlev * (rl - rlh) + surf * sl;
        right[i] = dry + revR + wl * wr2 * 6.0f + rlev * (rr - rrh) + surf * sr2;
    }

    gain = gainTarget;
    send = sendTarget;
    windLevel = windTarget;
    rustle = rustleTarget;
    surfLevel = surfTarget;
}
} // namespace pipp
