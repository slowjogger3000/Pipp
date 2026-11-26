#include "Engine.h"

#include <algorithm>
#include <cmath>

namespace tipp
{
namespace
{
namespace P = params;

constexpr int iSeason = P::indexOf(P::sc_season);
constexpr int iTime = P::indexOf(P::sc_time);
constexpr int iSex = P::indexOf(P::sc_sex);
constexpr int iAge = P::indexOf(P::sc_age);
constexpr int iType = P::indexOf(P::sc_type);
constexpr int iPlace = P::indexOf(P::sc_place);
constexpr int iApOn = P::indexOf(P::ap_on);
constexpr int iApHold = P::indexOf(P::ap_hold);
constexpr int iApLatch = P::indexOf(P::ap_latch);
constexpr int iApSeed = P::indexOf(P::ap_seed);
constexpr int iReturnAll = P::indexOf(P::ap_return_all);
constexpr int iSingOnce = P::indexOf(P::ap_sing_once);
constexpr int iReroll = P::indexOf(P::ap_reroll);
constexpr int iPlay = P::indexOf(P::pb_play);
constexpr int iSpeed = P::indexOf(P::pb_speed);
constexpr int iShift = P::indexOf(P::pb_shift);
constexpr int iDraw = P::indexOf(P::pb_draw);

// pb_speed options, in order.
constexpr float kSpeeds[3] = { 1.0f, 0.5f, 0.25f };

static_assert(P::indexOf(P::vo_pitch) == kPitch && P::indexOf(P::su_space) == kSpace,
              "the 12 knobs must open params::all in Knob order");

constexpr float kReturnSeconds = 0.3f;
constexpr float kVoiceLevel = 0.62f;
constexpr float kDrawnGain = 0.8f;
constexpr float kShiftGlideS = 0.02f; // hearing shift slides over about 60 ms

// Soft knee above 0.5. Never exceeds 0.68.
float limit(float x) noexcept { return softLimit(x); }

} // namespace

Engine::Engine()
{
    for (int i = 0; i < kSonoFrames; ++i)
    {
        const auto u = static_cast<std::size_t>(i);
        sonoFreq[u].store(0.0f, std::memory_order_relaxed);
        sonoAmp[u].store(0.0f, std::memory_order_relaxed);
        sonoMask[u].store(0u, std::memory_order_relaxed);
    }
    for (int i = 0; i < kMaxNotes; ++i)
    {
        const auto u = static_cast<std::size_t>(i);
        pvSyl[u].store(0, std::memory_order_relaxed);
        pvPart[u].store(-1, std::memory_order_relaxed);
        pvStart[u].store(0.0f, std::memory_order_relaxed);
        pvDur[u].store(0.0f, std::memory_order_relaxed);
        pvMul[u].store(1.0f, std::memory_order_relaxed);
    }
    for (int i = 0; i < DrawnLine::kMax; ++i)
    {
        const auto u = static_cast<std::size_t>(i);
        dlT[u].store(0.0f, std::memory_order_relaxed);
        dlHz[u].store(0.0f, std::memory_order_relaxed);
        dlJoin[u].store(false, std::memory_order_relaxed);
    }
    for (std::size_t i = 0; i < values.size(); ++i)
        values[i].store(static_cast<float>(P::all[i].def), std::memory_order_relaxed);
    for (int k = 0; k < kNumKnobs; ++k)
    {
        const auto u = static_cast<std::size_t>(k);
        handHeld[u].store(false, std::memory_order_relaxed);
        handTouches[u].store(0u, std::memory_order_relaxed);
        effOut[u].store(static_cast<float>(P::all[u].def), std::memory_order_relaxed);
        overOut[u].store(false, std::memory_order_relaxed);
        modeOut[u].store(0u, std::memory_order_relaxed);
        holdOut[u].store(0.0f, std::memory_order_relaxed);
        autoVal[u] = autoFrom[u] = autoTo[u] = eff[u] = static_cast<float>(P::all[u].def);
    }
}

void Engine::prepare(double sampleRate)
{
    sr = static_cast<float>(sampleRate);
    srOut.store(sampleRate, std::memory_order_relaxed);
    voice.prepare(sampleRate);
    surroundings.prepare(sampleRate);
    seenSeed = seedIn.load(std::memory_order_relaxed);
    seedOut.store(seenSeed, std::memory_order_relaxed);
    rng.seed(seenSeed);
    seenReturnAll = trigReturnAll.load(std::memory_order_relaxed);
    seenSingOnce = trigSingOnce.load(std::memory_order_relaxed);
    seenReroll = trigReroll.load(std::memory_order_relaxed);
    for (int k = 0; k < kNumKnobs; ++k)
        seenTouches[static_cast<std::size_t>(k)] = handTouches[static_cast<std::size_t>(k)].load(std::memory_order_relaxed);
    master = 0.0f;
    shiftMul = shiftTarget;
    peakL.store(0.0f, std::memory_order_relaxed);
    peakR.store(0.0f, std::memory_order_relaxed);
    sonoSub = 0;
    sonoBestAmp = sonoBestFreq = 0.0f;
    sonoBestMask = 0;
    bird = nullptr;
    birdActive.store(nullptr, std::memory_order_release);
    resetBird();
}

void Engine::setParam(int index, float value) noexcept
{
    if (index < 0 || index >= kNumParams)
        return;
    const auto& info = P::all[static_cast<std::size_t>(index)];
    if (info.kind == P::Kind::Text || info.kind == P::Kind::Trigger)
        return;
    if (index == iApSeed)
    {
        setSeed(static_cast<std::uint32_t>(std::clamp(value, 0.0f, 4294967040.0f)));
        return;
    }
    const float v = std::clamp(value, static_cast<float>(info.min), static_cast<float>(info.max));
    values[static_cast<std::size_t>(index)].store(v, std::memory_order_relaxed);
}

void Engine::handDown(int knob) noexcept
{
    if (knob < 0 || knob >= kNumKnobs)
        return;
    handTouches[static_cast<std::size_t>(knob)].fetch_add(1u, std::memory_order_relaxed);
    handHeld[static_cast<std::size_t>(knob)].store(true, std::memory_order_release);
}

void Engine::handUp(int knob) noexcept
{
    if (knob < 0 || knob >= kNumKnobs)
        return;
    handHeld[static_cast<std::size_t>(knob)].store(false, std::memory_order_release);
}

void Engine::trigger(int index) noexcept
{
    if (index == iReturnAll)     trigReturnAll.fetch_add(1u, std::memory_order_relaxed);
    else if (index == iSingOnce) trigSingOnce.fetch_add(1u, std::memory_order_relaxed);
    else if (index == iReroll)   trigReroll.fetch_add(1u, std::memory_order_relaxed);
}

void Engine::setDrawn(const DrawnLine& line) noexcept
{
    const std::uint32_t s = dlSeq.load(std::memory_order_relaxed);
    dlSeq.store(s + 1u, std::memory_order_relaxed);
    std::atomic_thread_fence(std::memory_order_release);
    const int n = std::clamp(line.count, 0, DrawnLine::kMax);
    dlCount.store(n, std::memory_order_relaxed);
    for (int i = 0; i < n; ++i)
    {
        const auto u = static_cast<std::size_t>(i);
        dlT[u].store(line.pts[u].tMs, std::memory_order_relaxed);
        dlHz[u].store(line.pts[u].hz, std::memory_order_relaxed);
        dlJoin[u].store(line.pts[u].joinPrev, std::memory_order_relaxed);
    }
    dlSeq.store(s + 2u, std::memory_order_release);
}

bool Engine::readDrawn(DrawnLine& out) const noexcept
{
    const std::uint32_t s1 = dlSeq.load(std::memory_order_acquire);
    if ((s1 & 1u) != 0u)
        return false;
    out.count = std::clamp(dlCount.load(std::memory_order_relaxed), 0, DrawnLine::kMax);
    for (int i = 0; i < out.count; ++i)
    {
        const auto u = static_cast<std::size_t>(i);
        out.pts[u].tMs = dlT[u].load(std::memory_order_relaxed);
        out.pts[u].hz = dlHz[u].load(std::memory_order_relaxed);
        out.pts[u].joinPrev = dlJoin[u].load(std::memory_order_relaxed);
    }
    std::atomic_thread_fence(std::memory_order_acquire);
    return dlSeq.load(std::memory_order_relaxed) == s1;
}

float Engine::knobValue(int knob) const noexcept
{
    if (knob < 0 || knob >= kNumKnobs)
        return 0.0f;
    return effOut[static_cast<std::size_t>(knob)].load(std::memory_order_relaxed);
}

bool Engine::knobOverridden(int knob) const noexcept
{
    if (knob < 0 || knob >= kNumKnobs)
        return false;
    return overOut[static_cast<std::size_t>(knob)].load(std::memory_order_relaxed);
}

Engine::KnobMode Engine::knobMode(int knob) const noexcept
{
    if (knob < 0 || knob >= kNumKnobs)
        return KnobMode::Auto;
    return static_cast<KnobMode>(modeOut[static_cast<std::size_t>(knob)].load(std::memory_order_relaxed));
}

float Engine::holdLeft(int knob) const noexcept
{
    if (knob < 0 || knob >= kNumKnobs)
        return 0.0f;
    return holdOut[static_cast<std::size_t>(knob)].load(std::memory_order_relaxed);
}

void Engine::takePeaks(float& left, float& right) noexcept
{
    left = peakL.exchange(0.0f, std::memory_order_relaxed);
    right = peakR.exchange(0.0f, std::memory_order_relaxed);
}

Engine::SonoFrame Engine::sonoFrame(std::uint32_t index) const noexcept
{
    const auto u = static_cast<std::size_t>(index & static_cast<std::uint32_t>(kSonoFrames - 1));
    SonoFrame f;
    f.freqHz = sonoFreq[u].load(std::memory_order_relaxed);
    f.amp = sonoAmp[u].load(std::memory_order_relaxed);
    f.handMask = sonoMask[u].load(std::memory_order_relaxed);
    return f;
}

bool Engine::readPhrase(PhraseView& out) const noexcept
{
    const std::uint32_t s1 = pvSeq.load(std::memory_order_acquire);
    if ((s1 & 1u) != 0u)
        return false;
    out.number = pvNumber.load(std::memory_order_relaxed);
    out.count = std::clamp(pvCount.load(std::memory_order_relaxed), 0, kMaxNotes);
    out.lengthMs = pvLength.load(std::memory_order_relaxed);
    out.drawn = pvDrawn.load(std::memory_order_relaxed);
    out.drawnStartMs = pvDrawnStart.load(std::memory_order_relaxed);
    for (int i = 0; i < out.count; ++i)
    {
        const auto u = static_cast<std::size_t>(i);
        out.notes[u].syl = pvSyl[u].load(std::memory_order_relaxed);
        out.notes[u].startMs = pvStart[u].load(std::memory_order_relaxed);
        out.notes[u].durMs = pvDur[u].load(std::memory_order_relaxed);
        out.notes[u].pitchMul = pvMul[u].load(std::memory_order_relaxed);
        out.notes[u].part = pvPart[u].load(std::memory_order_relaxed);
    }
    std::atomic_thread_fence(std::memory_order_acquire);
    return pvSeq.load(std::memory_order_relaxed) == s1;
}

void Engine::publishPhrase() noexcept
{
    const std::uint32_t s = pvSeq.load(std::memory_order_relaxed);
    pvSeq.store(s + 1u, std::memory_order_relaxed);
    std::atomic_thread_fence(std::memory_order_release);
    pvNumber.store(phraseCount.load(std::memory_order_relaxed), std::memory_order_relaxed);
    const int count = drawnPhrase ? 0 : cur.count;
    pvCount.store(count, std::memory_order_relaxed);
    pvLength.store(drawnPhrase ? drawnEnd(drawnCur) - drawnStart(drawnCur) : cur.lengthMs, std::memory_order_relaxed);
    pvDrawn.store(drawnPhrase, std::memory_order_relaxed);
    pvDrawnStart.store(drawnStart(drawnCur), std::memory_order_relaxed);
    for (int i = 0; i < count; ++i)
    {
        const auto u = static_cast<std::size_t>(i);
        pvSyl[u].store(cur.notes[u].syl, std::memory_order_relaxed);
        pvStart[u].store(cur.notes[u].startMs, std::memory_order_relaxed);
        pvDur[u].store(cur.notes[u].durMs, std::memory_order_relaxed);
        pvMul[u].store(cur.notes[u].pitchMul, std::memory_order_relaxed);
        pvPart[u].store(cur.notes[u].part, std::memory_order_relaxed);
    }
    pvSeq.store(s + 2u, std::memory_order_release);
}

void Engine::feedSonogram(const VoiceControls& vc) noexcept
{
    std::uint16_t mask = 0;
    for (int k = 0; k < kNumKnobs; ++k)
    {
        const Mode m = knobs[static_cast<std::size_t>(k)].mode;
        if (m == Mode::Held || m == Mode::Hold)
            mask = static_cast<std::uint16_t>(mask | (1u << static_cast<unsigned>(k)));
    }
    if (vc.amp >= sonoBestAmp)
    {
        sonoBestAmp = vc.amp;
        sonoBestFreq = vc.freqHz;
    }
    sonoBestMask = static_cast<std::uint16_t>(sonoBestMask | mask);

    if (++sonoSub < kSonoDecim)
        return;
    const std::uint32_t n = sonoCount.load(std::memory_order_relaxed);
    const auto u = static_cast<std::size_t>(n & static_cast<std::uint32_t>(kSonoFrames - 1));
    sonoFreq[u].store(sonoBestFreq, std::memory_order_relaxed);
    sonoAmp[u].store(sonoBestAmp, std::memory_order_relaxed);
    sonoMask[u].store(sonoBestMask, std::memory_order_relaxed);
    sonoCount.store(n + 1u, std::memory_order_release);
    sonoSub = 0;
    sonoBestAmp = sonoBestFreq = 0.0f;
    sonoBestMask = 0;
}

int Engine::choice(int paramIndex) const noexcept
{
    return static_cast<int>(std::lround(values[static_cast<std::size_t>(paramIndex)].load(std::memory_order_relaxed)));
}

float Engine::pick(Range r) noexcept
{
    // Variation widens the spread around the middle of the range.
    const float var = std::clamp(eff[kVariation] / 100.0f, 0.0f, 1.0f);
    const float mid = 0.5f * (r.lo + r.hi);
    const float half = 0.5f * (r.hi - r.lo);
    return mid + rng.bipolar() * half * (0.2f + 0.8f * var);
}

void Engine::resetBird() noexcept
{
    playing = false;
    hasPhrase = false;
    drawnPhrase = lastWasDrawn = false;
    boutLeft = 0;
    singOncePending = false;
    pauseElapsed = 0.0f;
    firstWait = 0.4f;
    cursor = 0;
    phraseMs = 0.0f;
    lastType = -1;
    for (int k = 0; k < kNumKnobs; ++k)
    {
        const auto u = static_cast<std::size_t>(k);
        const float base = bird != nullptr ? bird->base[u] : static_cast<float>(P::all[u].def);
        autoVal[u] = autoFrom[u] = autoTo[u] = base;
        knobs[u].mode = Mode::Auto;
    }
}

void Engine::readControls() noexcept
{
    if (const BirdData* b = birdIn.load(std::memory_order_acquire); b != bird)
    {
        bird = b;
        birdActive.store(b, std::memory_order_release);
        resetBird();
    }

    if (const auto s = seedIn.load(std::memory_order_relaxed); s != seenSeed)
    {
        seenSeed = s;
        rng.seed(s);
        seedOut.store(s, std::memory_order_relaxed);
    }
    if (const auto t = trigReroll.load(std::memory_order_relaxed); t != seenReroll)
    {
        seenReroll = t;
        const std::uint32_t s = rng.next() ^ (t * 0x9e3779b9u);
        rng.seed(s);
        seenSeed = s;
        seedIn.store(s, std::memory_order_relaxed);
        seedOut.store(s, std::memory_order_relaxed);
    }
    if (const auto t = trigSingOnce.load(std::memory_order_relaxed); t != seenSingOnce)
    {
        seenSingOnce = t;
        singOncePending = true;
    }

    season = choice(iSeason);
    timeOfDay = choice(iTime);
    sex = choice(iSex);
    age = choice(iAge);
    typeIdx = std::clamp(choice(iType), 0, kNumSongTypes - 1);
    place = choice(iPlace);
    apOn = choice(iApOn) != 0;
    latch = choice(iApLatch) != 0;
    play = choice(iPlay) != 0;
    drawMode = choice(iDraw) != 0;
    speed = kSpeeds[std::clamp(choice(iSpeed), 0, 2)];
    shiftTarget = choice(iShift) != 0 ? 0.5f : 1.0f;
    apHold = values[static_cast<std::size_t>(iApHold)].load(std::memory_order_relaxed);
}

void Engine::updateKnobs(float dt) noexcept
{
    bool returnAll = false;
    if (const auto t = trigReturnAll.load(std::memory_order_relaxed); t != seenReturnAll)
    {
        seenReturnAll = t;
        returnAll = true;
    }

    for (int k = 0; k < kNumKnobs; ++k)
    {
        const auto u = static_cast<std::size_t>(k);
        auto& s = knobs[u];
        const bool held = handHeld[u].load(std::memory_order_acquire);
        const auto touches = handTouches[u].load(std::memory_order_relaxed);
        const float hand = values[u].load(std::memory_order_relaxed);

        if (held || touches != seenTouches[u])
        {
            seenTouches[u] = touches;
            s.mode = Mode::Held;
        }

        switch (s.mode)
        {
            case Mode::Held:
                eff[u] = hand;
                if (! held)
                {
                    s.mode = Mode::Hold;
                    s.timer = 0.0f;
                }
                break;

            case Mode::Hold:
                eff[u] = hand;
                s.timer += dt;
                // With autoplay off the knobs stay where the hand left them.
                if (returnAll || (apOn && ! latch && s.timer >= apHold))
                {
                    s.mode = Mode::Return;
                    s.timer = 0.0f;
                    s.from = hand;
                }
                break;

            case Mode::Return:
            {
                s.timer += dt;
                const float p = std::min(1.0f, s.timer / kReturnSeconds);
                eff[u] = s.from + (autoVal[u] - s.from) * p;
                if (p >= 1.0f)
                    s.mode = Mode::Auto;
                break;
            }

            case Mode::Auto:
                eff[u] = autoVal[u];
                break;
        }

        float left = 0.0f;
        if (s.mode == Mode::Held || s.mode == Mode::Hold)
            left = (! apOn || latch) ? -1.0f : std::max(0.0f, apHold - (s.mode == Mode::Hold ? s.timer : 0.0f));
        effOut[u].store(eff[u], std::memory_order_relaxed);
        overOut[u].store(s.mode != Mode::Auto, std::memory_order_relaxed);
        modeOut[u].store(static_cast<std::uint8_t>(s.mode), std::memory_order_relaxed);
        holdOut[u].store(left, std::memory_order_relaxed);
    }
}

void Engine::pickPhraseEndValues(const SceneRules& rules) noexcept
{
    autoVal[kPause] = pick(rules.pauseS);
    autoVal[kLength] = pick(rules.lengthS);
}

void Engine::generatePhrase(const SongType& type) noexcept
{
    const float var = std::clamp(eff[kVariation] / 100.0f, 0.0f, 1.0f);

    // Variation at zero: the same phrase again, exactly.
    if (hasPhrase && var < 0.01f)
        return;

    const float tempo = std::max(0.25f, eff[kTempo] / 100.0f);
    const float budgetMs = std::max(100.0f, eff[kLength] * 1000.0f * tempo);
    const std::uint32_t previous = cur.signature;

    for (int attempt = 0; attempt < 4; ++attempt)
    {
        // Template by integer weight, or the bout's template while the bout lasts.
        const PhraseTemplate* tp = &type.templates.front();
        if (attempt == 0 && boutLeft > 0 && boutTemplate >= 0
            && boutTemplate < static_cast<int>(type.templates.size()))
        {
            tp = &type.templates[static_cast<std::size_t>(boutTemplate)];
            --boutLeft;
        }
        else
        {
            std::uint32_t r = rng.below(std::max(1u, type.totalWeight));
            int ti = 0;
            for (const auto& t : type.templates)
            {
                if (r < t.weight) { tp = &t; break; }
                r -= t.weight;
                ++ti;
            }
            if (type.boutMax > 1)
            {
                boutTemplate = ti;
                const auto span = static_cast<std::uint32_t>(type.boutMax - type.boutMin + 1);
                boutLeft = type.boutMin - 1 + static_cast<int>(rng.below(span));
            }
        }

        const float transpose = rng.bipolar() * type.transposeSt * var;
        float t = 0.0f;
        int count = 0;
        std::uint32_t sig = 2166136261u;

        for (const auto& sec : tp->sections)
        {
            if (sec.chanceMilli < 1000u && rng.below(1000u) >= sec.chanceMilli)
                continue;
            if (count > 0)
                t += rng.range(sec.leadGapMs.lo, sec.leadGapMs.hi);

            const float secStart = t;
            const float secBudget = budgetMs * sec.share;
            const auto poolSize = static_cast<std::uint32_t>(sec.pool.size());
            int last = -1;

            for (int n = 0; n < sec.maxCount && count < kMaxNotes; ++n)
            {
                if (n >= sec.minCount && t - secStart >= secBudget)
                    break;

                std::uint32_t pi = rng.below(poolSize);
                if (sec.noAdjacentRepeat && poolSize > 1u && sec.pool[pi] == last)
                    pi = (pi + 1u + rng.below(poolSize - 1u)) % poolSize;
                const int syl = sec.pool[pi];
                last = syl;

                const Syllable& s = bird->syllables[static_cast<std::size_t>(syl)];
                Note& note = cur.notes[static_cast<std::size_t>(count)];
                if (n > 0)
                    t += rng.range(sec.gapMs.lo, sec.gapMs.hi);
                note.syl = syl;
                note.startMs = t;
                note.durMs = s.durMs * (1.0f + 0.18f * var * rng.bipolar());
                note.pitchMul = std::exp2((transpose + 0.6f * var * rng.bipolar()) / 12.0f);
                note.gain = s.gain * (1.0f - 0.25f * var * rng.unit());
                note.part = sec.part;
                t += note.durMs;
                ++count;
                sig = (sig ^ static_cast<std::uint32_t>(syl + 1)) * 16777619u;
            }
        }

        cur.count = count;
        cur.lengthMs = t;
        cur.signature = sig;

        if (count > 0 && ! (type.avoidRepeat && hasPhrase && sig == previous))
            break;
    }
    hasPhrase = cur.count > 0;
}

void Engine::startPhrase() noexcept
{
    const SongType& type = bird->types[static_cast<std::size_t>(typeIdx)];
    generatePhrase(type);
    if (! hasPhrase)
        return;

    // Autoplay moves the knobs through the phrase, from where they are to a
    // new point in the type's range. Knobs without a range drift to base.
    for (int k = 0; k < kNumKnobs; ++k)
    {
        const auto u = static_cast<std::size_t>(k);
        if (k == kPause || k == kLength)
            continue;
        autoFrom[u] = autoVal[u];
        autoTo[u] = type.hasAuto[u] ? pick(type.autoRange[u]) : bird->base[u];
    }

    playing = true;
    drawnPhrase = lastWasDrawn = false;
    phraseMs = 0.0f;
    cursor = 0;
    phraseCount.fetch_add(1u, std::memory_order_relaxed);
    publishPhrase();
}

bool Engine::startDrawn() noexcept
{
    if (bird == nullptr)
        return false;
    bool read = false;
    for (int attempt = 0; attempt < 3 && ! read; ++attempt)
        read = readDrawn(drawnCur);
    if (! read || drawnCur.count == 0)
    {
        drawnCur.count = 0;
        return false;
    }
    playing = true;
    drawnPhrase = lastWasDrawn = true;
    phraseMs = 0.0f;
    cursor = 0;
    phraseCount.fetch_add(1u, std::memory_order_relaxed);
    drawnCount.fetch_add(1u, std::memory_order_relaxed);
    publishPhrase();
    return true;
}

float Engine::drawnTempo() const noexcept
{
    const float base = bird != nullptr && bird->base[kTempo] > 0.0f ? bird->base[kTempo] : 100.0f;
    return std::max(0.25f, eff[kTempo] / base);
}

// The drawn line in the bird's voice. The pitch knob moves it by its ratio
// to the bird's base pitch, so it sings as drawn until a hand turns it.
void Engine::singDrawn(float dt, const SceneRules& rules, VoiceControls& vc) noexcept
{
    phraseMs += dt * 1000.0f * drawnTempo();
    const float start = drawnStart(drawnCur);
    if (phraseMs >= drawnEnd(drawnCur) - start)
    {
        playing = false;
        drawnPhrase = false;
        pauseElapsed = 0.0f;
        if (apOn && ! drawMode && rules.active)
            pickPhraseEndValues(rules);
        return;
    }

    float hz = 0.0f, amp = 0.0f;
    drawnAt(drawnCur, start + phraseMs, hz, amp);
    const float basePitch = bird->base[kPitch] > 0.0f ? bird->base[kPitch] : 1.0f;
    vc.freqHz = hz * eff[kPitch] / basePitch;
    vc.amp = amp * kDrawnGain * kVoiceLevel;
    lastFreq = vc.freqHz;
    if (eff[kTrill] > 0.5f)
    {
        vc.trillHz = eff[kTrill];
        vc.trillDepthSt = 1.3f;
        vc.trillAm = 0.4f;
    }
}

void Engine::runAutoplay(float dt, VoiceControls& vc) noexcept
{
    vc.amp = 0.0f;
    vc.freqHz = lastFreq;
    vc.breath = eff[kBreath] / 100.0f;
    vc.tension = eff[kTension] / 100.0f;
    vc.rough = eff[kRough] / 100.0f;

    if (bird == nullptr)
        return;

    const SongType& type = bird->types[static_cast<std::size_t>(typeIdx)];
    const SceneRules rules = rulesFor(type, season, timeOfDay, sex, age);

    if (typeIdx != lastType)
    {
        lastType = typeIdx;
        playing = false;
        pauseElapsed = 0.0f;
        firstWait = 0.4f;
        hasPhrase = false;
        boutLeft = 0;
        if (rules.active)
            pickPhraseEndValues(rules);
    }

    if (! playing && drawMode)
    {
        // Draw mode: autoplay waits, and sing once sings the drawn line.
        if (singOncePending)
        {
            singOncePending = false;
            startDrawn();
        }
        if (! playing)
            return;
    }
    else if (! playing)
    {
        if (! rules.active)
            return;
        pauseElapsed += dt;
        const float wait = firstWait > 0.0f ? firstWait : eff[kPause];
        const bool due = apOn && pauseElapsed >= wait;
        if (due || singOncePending)
        {
            singOncePending = false;
            firstWait = 0.0f;
            // A kept line takes its turn after each phrase of the bird's own.
            const bool kept = keptIn.load(std::memory_order_relaxed);
            if (! (kept && ! lastWasDrawn && startDrawn()))
                startPhrase();
        }
        if (! playing)
            return;
    }

    if (drawnPhrase)
    {
        singDrawn(dt, rules, vc);
        return;
    }

    const float tempo = std::max(0.25f, eff[kTempo] / 100.0f);
    phraseMs += dt * 1000.0f * tempo;

    // Autoplay knob glide through the phrase.
    if (apOn)
    {
        const float p = cur.lengthMs > 0.0f ? std::min(1.0f, phraseMs / cur.lengthMs) : 1.0f;
        for (int k = 0; k < kNumKnobs; ++k)
        {
            const auto u = static_cast<std::size_t>(k);
            if (k != kPause && k != kLength)
                autoVal[u] = autoFrom[u] + (autoTo[u] - autoFrom[u]) * p;
        }
    }

    while (cursor < cur.count)
    {
        const Note& n = cur.notes[static_cast<std::size_t>(cursor)];
        if (phraseMs < n.startMs + n.durMs)
            break;
        ++cursor;
    }

    if (cursor >= cur.count)
    {
        playing = false;
        pauseElapsed = 0.0f;
        if (apOn)
            pickPhraseEndValues(rules);
        return;
    }

    const Note& n = cur.notes[static_cast<std::size_t>(cursor)];
    const Syllable& s = bird->syllables[static_cast<std::size_t>(n.syl)];
    const float pitchKnob = eff[kPitch];

    vc.breath = std::clamp((eff[kBreath] + s.breath) / 100.0f, 0.0f, 1.0f);
    vc.tension = std::clamp((eff[kTension] + s.tension) / 100.0f, 0.0f, 1.0f);
    vc.rough = std::clamp((eff[kRough] + s.rough) / 100.0f, 0.0f, 1.0f);

    if (phraseMs < n.startMs)
    {
        // In a gap: silent, already at the next note's first pitch.
        vc.freqHz = s.pitch.front().v * n.pitchMul * pitchKnob;
        lastFreq = vc.freqHz;
        return;
    }

    const float u = (phraseMs - n.startMs) / n.durMs;
    vc.freqHz = contourPitchAt(s.pitch, u) * n.pitchMul * pitchKnob;
    vc.amp = contourAt(s.amp, u) * n.gain * kVoiceLevel;
    lastFreq = vc.freqHz;

    if (s.trillHz > 0.0f)
    {
        vc.trillHz = s.trillHz * tempo;
        vc.trillDepthSt = s.trillDepthSt;
        vc.trillAm = s.trillAm;
    }
    else if (eff[kTrill] > 0.5f)
    {
        vc.trillHz = eff[kTrill];
        vc.trillDepthSt = 1.3f;
        vc.trillAm = 0.4f;
    }
}

void Engine::process(float* left, float* right, int numSamples) noexcept
{
    float blockL = 0.0f, blockR = 0.0f;
    const float masterStep = 1.0f / (0.03f * sr);

    for (int start = 0; start < numSamples; start += kSubBlock)
    {
        const int n = std::min(kSubBlock, numSamples - start);
        const float dt = static_cast<float>(n) / sr;
        float* l = left + start;
        float* r = right + start;

        readControls();
        updateKnobs(dt);

        if (! play && master <= 0.0f)
        {
            std::fill(l, l + n, 0.0f);
            if (right != left)
                std::fill(r, r + n, 0.0f);
            continue;
        }

        // Speed slows song time only. The voice runs at the real rate, so
        // pitch stays where it was.
        VoiceControls vc;
        runAutoplay(dt * speed, vc);
        vc.trillHz *= speed;
        singingOut.store(playing, std::memory_order_relaxed);
        posOut.store(phraseMs, std::memory_order_relaxed);
        const float tempo = drawnPhrase ? drawnTempo() : std::max(0.25f, eff[kTempo] / 100.0f);
        tempoOut.store(tempo * speed, std::memory_order_relaxed);
        feedSonogram(vc);

        // Hearing shift after the sonogram feed: the sonogram shows the
        // bird's own pitch.
        if (shiftMul != shiftTarget)
        {
            shiftMul += (shiftTarget - shiftMul) * (1.0f - std::exp(-dt / kShiftGlideS));
            if (std::fabs(shiftMul - shiftTarget) < 1.0e-4f)
                shiftMul = shiftTarget;
        }
        vc.freqHz *= shiftMul;

        std::fill(birdBuf.begin(), birdBuf.begin() + n, 0.0f);
        voice.render(birdBuf.data(), n, vc);

        surroundings.set(eff[kDistance], eff[kWind], eff[kSpace] / 100.0f, place);
        float tmpR[kSubBlock];
        surroundings.process(birdBuf.data(), l, tmpR, n);

        const float target = play ? 1.0f : 0.0f;
        for (int i = 0; i < n; ++i)
        {
            if (master < target)      master = std::min(target, master + masterStep);
            else if (master > target) master = std::max(target, master - masterStep);
            const float a = limit(l[i] * master);
            const float b = limit(tmpR[i] * master);
            l[i] = a;
            if (right != left)
                r[i] = b;
            blockL = std::max(blockL, std::fabs(a));
            blockR = std::max(blockR, std::fabs(b));
        }
    }

    // Max since the interface last took them.
    for (float old = peakL.load(std::memory_order_relaxed); blockL > old
         && ! peakL.compare_exchange_weak(old, blockL, std::memory_order_relaxed);) {}
    for (float old = peakR.load(std::memory_order_relaxed); blockR > old
         && ! peakR.compare_exchange_weak(old, blockR, std::memory_order_relaxed);) {}
    levelOut.store(voice.envelope(), std::memory_order_relaxed);
}
} // namespace tipp
