#include "Chorus.h"

#include "Params.h"

#include <algorithm>
#include <cmath>

namespace tipp
{
namespace
{
namespace P = params;

bool validLane(int lane) noexcept { return lane >= 0 && lane < Chorus::kLanes; }
} // namespace

float Chorus::clockRate(int speed) noexcept
{
    switch (speed)
    {
        case kRealTime: return 1.0f;
        case k60x:      return 60.0f;
        case k10x:
        case kLoop:
        default:        return 10.0f;
    }
}

Chorus::Chorus()
{
    for (auto& lane : lanes)
    {
        for (auto& c : lane.sung)
            c.store(0u, std::memory_order_relaxed);
        auto set = [&lane](const char* id, float v) { lane.engine.setParam(P::indexOf(id), v); };
        set(P::sc_time, 0.0f); // dawn
        set(P::sc_type, static_cast<float>(kSong));
        set(P::sc_sex, 0.0f);
        set(P::sc_age, 0.0f);
        set(P::ap_on, 1.0f);
        set(P::pb_play, 0.0f);
        // The dawn is calm: no wind control is designed for the chorus.
        lane.engine.setParam(kWind, 0.0f);
        lane.engine.handDown(kWind);
    }
}

void Chorus::prepare(double sampleRate)
{
    sr = static_cast<float>(sampleRate);
    for (auto& lane : lanes)
        lane.engine.prepare(sampleRate);
}

void Chorus::setLaneBird(int lane, const BirdData* bird) noexcept
{
    if (validLane(lane))
        lanes[static_cast<std::size_t>(lane)].engine.setBird(bird);
}

const BirdData* Chorus::laneBirdInUse(int lane) const noexcept
{
    return validLane(lane) ? lanes[static_cast<std::size_t>(lane)].engine.birdInUse() : nullptr;
}

void Chorus::setEntry(int lane, float minute) noexcept
{
    if (validLane(lane))
        lanes[static_cast<std::size_t>(lane)].entry.store(minute, std::memory_order_relaxed);
}

void Chorus::setDistance(int lane, float metres) noexcept
{
    holdKnob(lane, kDistance, metres);
}

void Chorus::holdKnob(int lane, int knob, float value) noexcept
{
    if (! validLane(lane))
        return;
    auto& e = lanes[static_cast<std::size_t>(lane)].engine;
    e.setParam(knob, value);
    e.handDown(knob); // never let go: the lane keeps it
}

void Chorus::releaseKnob(int lane, int knob) noexcept
{
    if (validLane(lane))
        lanes[static_cast<std::size_t>(lane)].engine.handUp(knob);
}

void Chorus::setMute(int lane, bool on) noexcept
{
    if (validLane(lane))
        lanes[static_cast<std::size_t>(lane)].mute.store(on, std::memory_order_relaxed);
}

void Chorus::setSolo(int lane, bool on) noexcept
{
    if (validLane(lane))
        lanes[static_cast<std::size_t>(lane)].solo.store(on, std::memory_order_relaxed);
}

void Chorus::setSeason(int season) noexcept
{
    seasonIn.store(season, std::memory_order_relaxed);
    for (auto& lane : lanes)
        lane.engine.setParam(P::indexOf(P::sc_season), static_cast<float>(season));
}

void Chorus::setPlace(int place) noexcept
{
    for (auto& lane : lanes)
        lane.engine.setParam(P::indexOf(P::sc_place), static_cast<float>(place));
}

void Chorus::setSeed(std::uint32_t seed) noexcept
{
    for (int i = 0; i < kLanes; ++i)
        lanes[static_cast<std::size_t>(i)].engine.setSeed(seed + static_cast<std::uint32_t>(i) * 7919u);
}

void Chorus::seek(float minute) noexcept
{
    seekTo.store(std::clamp(minute, kStartMin, kEndMin), std::memory_order_relaxed);
    seekSeq.fetch_add(1u, std::memory_order_release);
}

void Chorus::processAdd(float* left, float* right, int numSamples) noexcept
{
    const float fadeStep = 1.0f / (kFadeS * sr);
    float blockL = 0.0f, blockR = 0.0f;

    for (int start = 0; start < numSamples; start += kChunk)
    {
        const int n = std::min(kChunk, numSamples - start);

        if (const auto s = seekSeq.load(std::memory_order_acquire); s != seenSeek)
        {
            seenSeek = s;
            clock = seekTo.load(std::memory_order_relaxed);
            done = false;
            for (auto& lane : lanes)
                for (auto& c : lane.sung)
                    c.store(0u, std::memory_order_relaxed);
        }

        const bool play = playIn.load(std::memory_order_relaxed) && ! done;
        const int speed = speedIn.load(std::memory_order_relaxed);
        const int season = seasonIn.load(std::memory_order_relaxed);
        if (play)
        {
            clock += static_cast<float>(n) / sr * clockRate(speed) / 60.0f;
            if (clock >= kEndMin)
            {
                if (speed == kLoop)
                {
                    clock = kStartMin;
                    for (auto& lane : lanes)
                        for (auto& c : lane.sung)
                            c.store(0u, std::memory_order_relaxed);
                }
                else
                {
                    clock = kEndMin;
                    done = true;
                }
            }
        }
        minuteOut.store(clock, std::memory_order_relaxed);
        finishedOut.store(done, std::memory_order_relaxed);

        bool anySolo = false;
        for (const auto& lane : lanes)
            anySolo = anySolo || lane.solo.load(std::memory_order_relaxed);

        const int column = std::clamp(static_cast<int>((clock - kStartMin) * kColumnsPerMin), 0, kColumns - 1);
        for (auto& lane : lanes)
        {
            const BirdData* b = lane.engine.birdInUse();
            const bool inSeason = b != nullptr && rulesFor(b->types[kSong], season, 0, 0, 0).active;
            const bool started = inSeason && clock >= lane.entry.load(std::memory_order_relaxed);
            const bool audible = ! lane.mute.load(std::memory_order_relaxed)
                              && (! anySolo || lane.solo.load(std::memory_order_relaxed));
            const bool wantPlay = play && started;
            if (wantPlay != lane.playing)
            {
                lane.playing = wantPlay;
                lane.engine.setParam(P::indexOf(P::pb_play), wantPlay ? 1.0f : 0.0f);
            }
            lane.inSeasonOut.store(inSeason, std::memory_order_relaxed);
            lane.startedOut.store(started, std::memory_order_relaxed);
            lane.audibleOut.store(audible, std::memory_order_relaxed);

            lane.engine.process(lane.l.data(), lane.r.data(), n);
            if (lane.playing && lane.engine.singing())
                lane.sung[static_cast<std::size_t>(column)].store(1u, std::memory_order_relaxed);

            const float target = audible ? 1.0f : 0.0f;
            for (int i = 0; i < n; ++i)
            {
                if (lane.gain < target)      lane.gain = std::min(target, lane.gain + fadeStep);
                else if (lane.gain > target) lane.gain = std::max(target, lane.gain - fadeStep);
                lane.l[static_cast<std::size_t>(i)] *= lane.gain * kMix;
                lane.r[static_cast<std::size_t>(i)] *= lane.gain * kMix;
            }
        }

        float* l = left + start;
        float* r = right + start;
        for (int i = 0; i < n; ++i)
        {
            float a = 0.0f, c = 0.0f;
            for (const auto& lane : lanes)
            {
                a += lane.l[static_cast<std::size_t>(i)];
                c += lane.r[static_cast<std::size_t>(i)];
            }
            a = softLimit(a);
            c = softLimit(c);
            blockL = std::max(blockL, std::fabs(a));
            blockR = std::max(blockR, std::fabs(c));
            if (right == left)
                l[i] += 0.5f * (a + c);
            else
            {
                l[i] += a;
                r[i] += c;
            }
        }
    }

    for (float old = peakL.load(std::memory_order_relaxed); blockL > old
         && ! peakL.compare_exchange_weak(old, blockL, std::memory_order_relaxed);) {}
    for (float old = peakR.load(std::memory_order_relaxed); blockR > old
         && ! peakR.compare_exchange_weak(old, blockR, std::memory_order_relaxed);) {}
}

bool Chorus::laneStarted(int lane) const noexcept
{
    return validLane(lane) && lanes[static_cast<std::size_t>(lane)].startedOut.load(std::memory_order_relaxed);
}

bool Chorus::laneAudible(int lane) const noexcept
{
    return validLane(lane) && lanes[static_cast<std::size_t>(lane)].audibleOut.load(std::memory_order_relaxed);
}

bool Chorus::laneInSeason(int lane) const noexcept
{
    return validLane(lane) && lanes[static_cast<std::size_t>(lane)].inSeasonOut.load(std::memory_order_relaxed);
}

bool Chorus::laneSinging(int lane) const noexcept
{
    return validLane(lane) && lanes[static_cast<std::size_t>(lane)].engine.singing();
}

float Chorus::laneLevel(int lane) const noexcept
{
    return validLane(lane) ? lanes[static_cast<std::size_t>(lane)].engine.birdLevel() : 0.0f;
}

bool Chorus::sang(int lane, int column) const noexcept
{
    if (! validLane(lane) || column < 0 || column >= kColumns)
        return false;
    return lanes[static_cast<std::size_t>(lane)].sung[static_cast<std::size_t>(column)].load(std::memory_order_relaxed) != 0u;
}

void Chorus::takePeaks(float& left, float& right) noexcept
{
    left = peakL.exchange(0.0f, std::memory_order_relaxed);
    right = peakR.exchange(0.0f, std::memory_order_relaxed);
}
} // namespace tipp
