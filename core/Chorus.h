#pragma once

// The dawn chorus (F4): up to 4 birds, one Engine each, on a clock that
// runs from 90 minutes before sunrise to 30 after. A lane starts singing
// when the clock passes its entry minute, if its song sounds in the season.
// Mute and solo ramp each lane's gain over 30 ms. Lives in core so the
// standalone and the web app share it.
//
// Threading as in Engine: setters from any thread write atomics, process()
// reads them once per sub-block. The host owns the birds and keeps each
// alive until laneBirdInUse() no longer returns it. Each lane gets the
// scene, autoplay on, its distance held by hand and wind held at 0.

#include "BirdData.h"
#include "Engine.h"

#include <array>
#include <atomic>
#include <cstdint>

namespace pipp
{
class Chorus
{
public:
    static constexpr int kLanes = 4;
    static constexpr float kStartMin = -90.0f;
    static constexpr float kEndMin = 30.0f;
    static constexpr int kColumns = 960; // activity columns, 8 per minute
    static constexpr float kColumnsPerMin = 8.0f;
    static constexpr float kMix = 0.8f;  // per lane, before the soft limit
    static constexpr float kFadeS = 0.03f;
    // While playing and before any lane has entered, the clock skips the
    // silence to this many minutes before the first lane in season enters.
    static constexpr float kLeadMin = 0.1f;

    // Dawn speed: real time, 10x, 60x, and loop (10x, starts again at the end).
    enum Speed : int { kRealTime, k10x, k60x, kLoop, kNumSpeeds };
    static float clockRate(int speed) noexcept; // dawn minutes per real minute

    Chorus();

    // Not on the audio thread. Allocates.
    void prepare(double sampleRate);

    // Lane setup, host thread.
    void setLaneBird(int lane, const BirdData* bird) noexcept;
    const BirdData* laneBirdInUse(int lane) const noexcept;
    void setEntry(int lane, float minute) noexcept;
    void setDistance(int lane, float metres) noexcept;
    void setMute(int lane, bool on) noexcept;
    void setSolo(int lane, bool on) noexcept;
    // A knob value the lane keeps by hand (voice and phrasing from Play).
    void holdKnob(int lane, int knob, float value) noexcept;
    void releaseKnob(int lane, int knob) noexcept;

    void setSeason(int season) noexcept;
    void setPlace(int place) noexcept;
    void setSpeed(int speed) noexcept { speedIn.store(speed, std::memory_order_relaxed); }
    void setSeed(std::uint32_t seed) noexcept;
    void setPlaying(bool on) noexcept { playIn.store(on, std::memory_order_relaxed); }
    // Moves the clock and clears the activity record. -90 starts over.
    void seek(float minute) noexcept;

    // Adds the chorus to left and right. right may equal left.
    void processAdd(float* left, float* right, int numSamples) noexcept;

    // For the interface.
    float minute() const noexcept { return minuteOut.load(std::memory_order_relaxed); }
    bool finished() const noexcept { return finishedOut.load(std::memory_order_relaxed); }
    bool laneStarted(int lane) const noexcept; // past its entry and in season
    bool laneAudible(int lane) const noexcept; // not muted, not out-soloed
    bool laneSinging(int lane) const noexcept;
    bool laneInSeason(int lane) const noexcept;
    // Whether the lane sang during that column of the timeline.
    bool sang(int lane, int column) const noexcept;
    void takePeaks(float& left, float& right) noexcept;
    float laneLevel(int lane) const noexcept;

private:
    static constexpr int kChunk = 256;

    struct Lane
    {
        Engine engine;
        std::atomic<float> entry { 0.0f };
        std::atomic<bool> mute { false }, solo { false };
        std::atomic<bool> startedOut { false }, audibleOut { false }, inSeasonOut { false };
        std::array<std::atomic<std::uint8_t>, kColumns> sung;
        float gain = 0.0f;
        bool playing = false;
        std::array<float, kChunk> l {}, r {};
    };

    std::array<Lane, kLanes> lanes;

    std::atomic<int> speedIn { k10x }, seasonIn { 0 };
    std::atomic<bool> playIn { false };
    std::atomic<std::uint32_t> seekSeq { 0u };
    std::atomic<float> seekTo { kStartMin };
    std::atomic<float> minuteOut { kStartMin };
    std::atomic<bool> finishedOut { false };
    std::atomic<float> peakL { 0.0f }, peakR { 0.0f };

    // Audio thread only.
    float sr = 48000.0f;
    float clock = kStartMin;
    std::uint32_t seenSeek = 0u;
    bool done = false;
};
} // namespace pipp
