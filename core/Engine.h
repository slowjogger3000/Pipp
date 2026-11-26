#pragma once

// The Tipp sound engine. Shared by the standalone, the web worklet and the
// render tool. No allocation, locks or I/O in process().
//
// Threading: setters may be called from any thread. They write atomics
// that process() reads once per 32-sample sub-block. Values for the
// interface are published through atomics as well.
//
// Knobs: setParam() on a knob sets the hand value. Wrap a drag in
// handDown() and handUp(). The override sequence (hold, 300 ms return,
// latch, return all) runs here, not in the interfaces.

#include "BirdData.h"
#include "Params.h"
#include "Random.h"
#include "Surroundings.h"
#include "Syrinx.h"

#include <array>
#include <atomic>
#include <cstdint>

namespace tipp
{
class Engine
{
public:
    static constexpr int kSubBlock = 32;
    static constexpr int kMaxNotes = 64;
    static constexpr int kNumParams = static_cast<int>(params::all.size());

    Engine();

    // Call before audio starts, not on the audio thread. Allocates.
    void prepare(double sampleRate);

    // The host owns the bird and keeps it alive until birdInUse() no
    // longer returns it. nullptr silences the bird.
    void setBird(const BirdData* newBird) noexcept { birdIn.store(newBird, std::memory_order_release); }
    const BirdData* birdInUse() const noexcept { return birdActive.load(std::memory_order_acquire); }

    // index is the position in params::all. Text and trigger ids are ignored
    // here: use setBird() and trigger().
    void setParam(int index, float value) noexcept;
    void setSeed(std::uint32_t newSeed) noexcept { seedIn.store(newSeed, std::memory_order_relaxed); }
    void handDown(int knob) noexcept;
    void handUp(int knob) noexcept;
    void trigger(int index) noexcept; // ap_return_all, ap_sing_once, ap_reroll

    // Writes numSamples to both channels. right may equal left.
    void process(float* left, float* right, int numSamples) noexcept;

    // For the interface.
    enum class KnobMode : std::uint8_t { Auto, Held, Hold, Return };

    float knobValue(int knob) const noexcept;    // effective value, knob units
    bool knobOverridden(int knob) const noexcept; // hand value in use or returning
    KnobMode knobMode(int knob) const noexcept;
    // Seconds until a released knob starts its return. -1 while it will not
    // return by itself (latch on, autoplay off). Full hold while held.
    float holdLeft(int knob) const noexcept;
    float birdLevel() const noexcept { return levelOut.load(std::memory_order_relaxed); }
    // Largest output sample per channel since the last call. Resets them.
    void takePeaks(float& left, float& right) noexcept;
    double sampleRate() const noexcept { return srOut.load(std::memory_order_relaxed); }

    // Sonogram feed: one frame per kSonoDecim sub-blocks while the output
    // runs, holding the loudest point of the voice in that time. Read
    // frames from sonoWritten() - kSonoFrames + 64 up to sonoWritten() - 1.
    static constexpr int kSonoDecim = 4;
    static constexpr int kSonoFrames = 4096; // power of two
    struct SonoFrame
    {
        float freqHz = 0.0f;
        float amp = 0.0f;
        std::uint16_t handMask = 0; // bit k: knob k held or holding
    };
    double sonoFrameRate() const noexcept { return sampleRate() / (kSubBlock * kSonoDecim); }
    std::uint32_t sonoWritten() const noexcept { return sonoCount.load(std::memory_order_acquire); }
    SonoFrame sonoFrame(std::uint32_t index) const noexcept;

    // The phrase being sung, for drawing what comes next.
    struct PhraseNote
    {
        int syl = 0;
        float startMs = 0.0f; // data time
        float durMs = 0.0f;
        float pitchMul = 1.0f;
    };
    struct PhraseView
    {
        std::uint32_t number = 0; // phrasesStarted() when it began
        int count = 0;
        float lengthMs = 0.0f;
        std::array<PhraseNote, kMaxNotes> notes {};
    };
    // Returns false if the phrase changed during the copy. Try again.
    bool readPhrase(PhraseView& out) const noexcept;
    bool singing() const noexcept { return singingOut.load(std::memory_order_relaxed); }
    float phrasePosMs() const noexcept { return posOut.load(std::memory_order_relaxed); } // data time
    float phraseTempo() const noexcept { return tempoOut.load(std::memory_order_relaxed); } // data ms per real ms
    std::uint32_t seed() const noexcept { return seedOut.load(std::memory_order_relaxed); }
    std::uint32_t phrasesStarted() const noexcept { return phraseCount.load(std::memory_order_relaxed); }

private:
    struct Note
    {
        int syl = 0;
        float startMs = 0.0f; // in data time; tempo scales playback
        float durMs = 0.0f;
        float pitchMul = 1.0f;
        float gain = 1.0f;
    };

    struct Phrase
    {
        std::array<Note, kMaxNotes> notes {};
        int count = 0;
        float lengthMs = 0.0f;
        std::uint32_t signature = 0u;
    };

    using Mode = KnobMode;

    struct KnobState
    {
        Mode mode = Mode::Auto;
        float timer = 0.0f;
        float from = 0.0f;
    };

    void resetBird() noexcept;
    void readControls() noexcept;
    void updateKnobs(float dt) noexcept;
    void runAutoplay(float dt, VoiceControls& vc) noexcept;
    void publishPhrase() noexcept;
    void feedSonogram(const VoiceControls& vc) noexcept;
    void startPhrase() noexcept;
    void generatePhrase(const SongType& type) noexcept;
    void pickPhraseEndValues(const SceneRules& rules) noexcept;
    float pick(Range r) noexcept;
    int choice(int paramIndex) const noexcept;

    // Host side.
    std::array<std::atomic<float>, params::all.size()> values;
    std::array<std::atomic<bool>, kNumKnobs> handHeld;
    std::array<std::atomic<std::uint32_t>, kNumKnobs> handTouches;
    std::atomic<std::uint32_t> seedIn { 1u };
    std::atomic<std::uint32_t> trigReturnAll { 0u }, trigSingOnce { 0u }, trigReroll { 0u };
    std::atomic<const BirdData*> birdIn { nullptr };

    // Published.
    std::atomic<const BirdData*> birdActive { nullptr };
    std::array<std::atomic<float>, kNumKnobs> effOut;
    std::array<std::atomic<bool>, kNumKnobs> overOut;
    std::array<std::atomic<std::uint8_t>, kNumKnobs> modeOut;
    std::array<std::atomic<float>, kNumKnobs> holdOut;
    std::atomic<float> levelOut { 0.0f };
    std::atomic<float> peakL { 0.0f }, peakR { 0.0f };
    std::atomic<double> srOut { 48000.0 };

    std::array<std::atomic<float>, kSonoFrames> sonoFreq, sonoAmp;
    std::array<std::atomic<std::uint16_t>, kSonoFrames> sonoMask;
    std::atomic<std::uint32_t> sonoCount { 0u };

    std::atomic<std::uint32_t> pvSeq { 0u };
    std::atomic<std::uint32_t> pvNumber { 0u };
    std::atomic<int> pvCount { 0 };
    std::atomic<float> pvLength { 0.0f };
    std::array<std::atomic<int>, kMaxNotes> pvSyl;
    std::array<std::atomic<float>, kMaxNotes> pvStart, pvDur, pvMul;
    std::atomic<bool> singingOut { false };
    std::atomic<float> posOut { 0.0f }, tempoOut { 1.0f };
    std::atomic<std::uint32_t> seedOut { 1u };
    std::atomic<std::uint32_t> phraseCount { 0u };

    // Audio thread only.
    float sr = 48000.0f;
    const BirdData* bird = nullptr;
    Rng rng;
    Syrinx voice;
    Surroundings surroundings;

    std::uint32_t seenSeed = 1u, seenReturnAll = 0u, seenSingOnce = 0u, seenReroll = 0u;
    std::array<std::uint32_t, kNumKnobs> seenTouches {};
    std::array<KnobState, kNumKnobs> knobs {};
    std::array<float, kNumKnobs> autoFrom {}, autoTo {}, autoVal {}, eff {};

    bool apOn = true, latch = false, play = false;
    float apHold = 3.0f;
    int season = 0, timeOfDay = 0, sex = 0, age = 0, typeIdx = 0, place = 0;
    int lastType = -1;

    Phrase cur;
    bool hasPhrase = false;
    bool playing = false;
    bool singOncePending = false;
    float phraseMs = 0.0f;
    int cursor = 0;
    float pauseElapsed = 0.0f;
    float firstWait = 0.4f; // s, before the first phrase after a change
    float lastFreq = 2000.0f;

    float master = 0.0f;
    int sonoSub = 0;
    float sonoBestAmp = 0.0f, sonoBestFreq = 0.0f;
    std::uint16_t sonoBestMask = 0;
    std::array<float, kSubBlock> birdBuf {};
};
} // namespace tipp
