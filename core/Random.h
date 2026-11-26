#pragma once

// Tipp's own random generators. No std:: distributions and no rand(), so a
// seed gives the same phrase order native and in WebAssembly.
//
// Rng (PCG32) drives every musical choice. Noise (xorshift32) drives audio
// noise only; it never affects which phrase is chosen.

#include <cstdint>

namespace tipp
{
class Rng
{
public:
    void seed(std::uint32_t s) noexcept
    {
        state = 0u;
        inc = (static_cast<std::uint64_t>(s) << 1u) | 1u;
        next();
        state += 0x853c49e6748fea9bULL ^ static_cast<std::uint64_t>(s);
        next();
    }

    std::uint32_t next() noexcept
    {
        const std::uint64_t old = state;
        state = old * 6364136223846793005ULL + inc;
        const auto xorshifted = static_cast<std::uint32_t>(((old >> 18u) ^ old) >> 27u);
        const auto rot = static_cast<std::uint32_t>(old >> 59u);
        return (xorshifted >> rot) | (xorshifted << ((32u - rot) & 31u));
    }

    // 0 to n - 1, integer maths only. n must be above 0.
    std::uint32_t below(std::uint32_t n) noexcept
    {
        return static_cast<std::uint32_t>((static_cast<std::uint64_t>(next()) * n) >> 32u);
    }

    // 0 to 1, from 24 bits. Exact in float on every platform.
    float unit() noexcept
    {
        return static_cast<float>(next() >> 8u) * (1.0f / 16777216.0f);
    }

    float range(float lo, float hi) noexcept { return lo + (hi - lo) * unit(); }

    // -1 to 1.
    float bipolar() noexcept { return unit() * 2.0f - 1.0f; }

private:
    std::uint64_t state = 0u;
    std::uint64_t inc = 1u;
};

class Noise
{
public:
    void seed(std::uint32_t s) noexcept { state = s != 0u ? s : 0x9e3779b9u; }

    // -1 to 1, white.
    float next() noexcept
    {
        state ^= state << 13u;
        state ^= state >> 17u;
        state ^= state << 5u;
        return static_cast<float>(state >> 8u) * (2.0f / 16777216.0f) - 1.0f;
    }

private:
    std::uint32_t state = 0x9e3779b9u;
};
} // namespace tipp
