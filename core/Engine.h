#pragma once

// The Tipp sound engine. Shared by the standalone, the web worklet and the
// render tool. No allocation, locks or I/O in process().
//
// Threading: setters may be called from any thread. They write atomics
// that process() reads once per 32-sample sub-block. Values for the
// interface are published through atomics as well.

#include "TestVoice.h"

#include <atomic>

namespace tipp
{
class Engine
{
public:
    static constexpr int kSubBlock = 32;

    // Call before audio starts, not on the audio thread.
    void prepare(double sampleRate) noexcept;

    // M0 test tone controls. Replaced by parameter setting in M1.
    void setToneFrequency(float hz) noexcept { toneHz.store(hz, std::memory_order_relaxed); }
    void setLevel(float gain) noexcept       { level.store(gain, std::memory_order_relaxed); }
    void setGate(bool on) noexcept           { gate.store(on, std::memory_order_relaxed); }

    // Writes numSamples to both channels. right may equal left.
    void process(float* left, float* right, int numSamples) noexcept;

    // For the interface. Peak of the last processed block, 0 to 1.
    float outputPeak() const noexcept { return peak.load(std::memory_order_relaxed); }

private:
    TestVoice voice;

    std::atomic<float> toneHz { 440.0f };
    std::atomic<float> level { 0.5f };
    std::atomic<bool> gate { false };
    std::atomic<float> peak { 0.0f };

    float currentLevel = 0.0f; // audio thread only
};
} // namespace tipp
