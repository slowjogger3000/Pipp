#pragma once

// Writes interleaved 32-bit float WAV. Float keeps non-finite samples
// visible to later checks. Assumes a little-endian host (all Macs).

#include <cstdint>
#include <cstdio>
#include <vector>

namespace tipp::render
{
inline bool writeWavFloat(const char* path, const std::vector<float>& interleaved,
                          std::uint16_t channels, std::uint32_t sampleRate)
{
    std::FILE* f = std::fopen(path, "wb");
    if (f == nullptr)
        return false;

    const auto u32 = [f](std::uint32_t v) { std::fwrite(&v, 4, 1, f); };
    const auto u16 = [f](std::uint16_t v) { std::fwrite(&v, 2, 1, f); };

    const auto frames = static_cast<std::uint32_t>(interleaved.size() / channels);
    const std::uint32_t dataBytes = frames * channels * 4u;
    const std::uint16_t blockAlign = static_cast<std::uint16_t>(channels * 4u);

    std::fwrite("RIFF", 1, 4, f);
    u32(4u + (8u + 18u) + (8u + 4u) + (8u + dataBytes));
    std::fwrite("WAVE", 1, 4, f);

    std::fwrite("fmt ", 1, 4, f);
    u32(18);
    u16(3); // WAVE_FORMAT_IEEE_FLOAT
    u16(channels);
    u32(sampleRate);
    u32(sampleRate * blockAlign);
    u16(blockAlign);
    u16(32);
    u16(0); // cbSize

    std::fwrite("fact", 1, 4, f);
    u32(4);
    u32(frames);

    std::fwrite("data", 1, 4, f);
    u32(dataBytes);
    std::fwrite(interleaved.data(), 4, interleaved.size(), f);

    return std::fclose(f) == 0;
}
} // namespace tipp::render
