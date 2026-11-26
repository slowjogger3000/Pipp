#pragma once

// Plays one recording from the collection, mixed after the engine and the
// chorus. The message thread decodes the whole file into memory and hands it
// over through an atomic, so the audio thread neither reads files nor locks
// nor allocates. A clip fades in and out over 10 ms; STOP fades it out too.

#include <juce_audio_formats/juce_audio_formats.h>

#include <algorithm>
#include <atomic>
#include <memory>
#include <vector>

namespace tipp::ui
{
class FilePlayer
{
public:
    static constexpr double kMaxSeconds = 600.0;

    // Audio thread start-up.
    void prepare(double sampleRate) { outRate.store(sampleRate > 0.0 ? sampleRate : 48000.0); }

    // Message thread. False when the reader holds nothing playable.
    bool start(juce::AudioFormatReader& reader)
    {
        retire(); // a clip still playing is cut
        if (reader.sampleRate <= 0.0 || reader.lengthInSamples <= 0)
            return false;
        auto clip = std::make_unique<Clip>();
        const auto len = static_cast<int>(std::min<juce::int64>(reader.lengthInSamples, static_cast<juce::int64>(kMaxSeconds * reader.sampleRate)));
        const int chans = reader.numChannels > 1 ? 2 : 1;
        clip->buf.setSize(chans, len);
        clip->buf.clear();
        if (! reader.read(&clip->buf, 0, len, 0, true, chans > 1))
            return false;
        clip->rate = reader.sampleRate;
        current.store(clip.get(), std::memory_order_release);
        owned = std::move(clip);
        return true;
    }

    // Message thread: fade the clip out.
    void stop()
    {
        if (owned == nullptr)
            return;
        owned->stopping.store(true); // poll() frees it once faded
    }

    bool playing() const { return owned != nullptr && ! owned->done.load() && ! owned->stopping.load(); }

    // Message thread, from the timer. True once when a clip played to its end.
    bool poll()
    {
        bool ended = false;
        if (owned != nullptr && owned->done.load())
        {
            ended = ! owned->stopping.load();
            retire();
        }
        const double t = juce::Time::getMillisecondCounterHiRes();
        retired.erase(std::remove_if(retired.begin(), retired.end(),
                                     [this, t](const auto& r) { return r.second + 200.0 < t && inUse.load() != r.first.get(); }),
                      retired.end());
        return ended;
    }

    // Audio thread.
    void processAdd(float* left, float* right, int n)
    {
        Clip* c = current.load(std::memory_order_acquire);
        inUse.store(c);
        if (c == nullptr || c->done.load())
            return;
        const double step = c->rate / outRate.load();
        const int len = c->buf.getNumSamples();
        const float* l = c->buf.getReadPointer(0);
        const float* r = c->buf.getReadPointer(c->buf.getNumChannels() > 1 ? 1 : 0);
        const float fade = static_cast<float>(1.0 / (0.010 * outRate.load()));
        const bool stopping = c->stopping.load();
        for (int i = 0; i < n; ++i)
        {
            const int k = static_cast<int>(c->pos);
            if (k + 1 >= len || (stopping && c->gain <= 0.0f))
            {
                c->done.store(true);
                return;
            }
            // Fade in at the start, out before the end or on STOP.
            const double left_ = static_cast<double>(len - 1 - k) / step;
            const float target = stopping || left_ < 0.010 * outRate.load() ? 0.0f : 1.0f;
            c->gain = target > c->gain ? std::min(target, c->gain + fade) : std::max(target, c->gain - fade);
            const float f = static_cast<float>(c->pos - k);
            left[i] += c->gain * (l[k] + f * (l[k + 1] - l[k]));
            if (right != left)
                right[i] += c->gain * (r[k] + f * (r[k + 1] - r[k]));
            c->pos += step;
        }
    }

private:
    struct Clip
    {
        juce::AudioBuffer<float> buf;
        double rate = 48000.0, pos = 0.0;
        float gain = 0.0f;
        std::atomic<bool> done { false }, stopping { false };
    };

    void retire()
    {
        current.store(nullptr, std::memory_order_release);
        if (owned != nullptr)
            retired.emplace_back(std::move(owned), juce::Time::getMillisecondCounterHiRes());
    }

    std::atomic<double> outRate { 48000.0 };
    std::atomic<Clip*> current { nullptr }, inUse { nullptr };
    std::unique_ptr<Clip> owned;
    std::vector<std::pair<std::unique_ptr<Clip>, double>> retired;
};
} // namespace tipp::ui
