#include "Engine.h"

#include <algorithm>
#include <cmath>

namespace tipp
{
void Engine::prepare(double sampleRate) noexcept
{
    voice.prepare(sampleRate);
    currentLevel = level.load(std::memory_order_relaxed);
    peak.store(0.0f, std::memory_order_relaxed);
}

void Engine::process(float* left, float* right, int numSamples) noexcept
{
    std::fill(left, left + numSamples, 0.0f);

    float blockPeak = 0.0f;

    for (int start = 0; start < numSamples; start += kSubBlock)
    {
        const int n = std::min(kSubBlock, numSamples - start);

        // Control rate.
        voice.setFrequency(toneHz.load(std::memory_order_relaxed));
        voice.setGate(gate.load(std::memory_order_relaxed));
        const float targetLevel = level.load(std::memory_order_relaxed);

        // Per-sample gain ramp across the sub-block.
        voice.render(left + start, n, currentLevel, targetLevel);
        currentLevel = targetLevel;

        for (int i = start; i < start + n; ++i)
            blockPeak = std::max(blockPeak, std::fabs(left[i]));
    }

    if (right != left)
        std::copy(left, left + numSamples, right);

    peak.store(blockPeak, std::memory_order_relaxed);
}
} // namespace tipp
