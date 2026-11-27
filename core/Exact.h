#pragma once

// Maths that gives the same bits native and in WebAssembly. Library
// functions such as std::exp2 are rounded differently by Apple's libm and
// by Emscripten's musl, so anything that feeds a phrase uses these instead.
// Only + - * / , floor and ldexp, which IEEE 754 defines exactly. Core is
// built with -ffp-contract=off so no multiply-add is fused on one platform
// and not the other.

#include <cmath>

namespace pipp
{
// 2^x, within about 1e-15 relative before the cast to float.
inline float exactExp2(float x) noexcept
{
    const double xd = static_cast<double>(x);
    const double n = std::floor(xd + 0.5);
    const double y = (xd - n) * 0.69314718055994530942; // |y| <= 0.347
    double term = 1.0, sum = 1.0;
    for (int k = 1; k <= 12; ++k)
    {
        term = term * y / static_cast<double>(k);
        sum = sum + term;
    }
    return static_cast<float>(std::ldexp(sum, static_cast<int>(n)));
}
} // namespace pipp
