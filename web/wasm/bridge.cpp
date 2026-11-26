// C functions over core/ for the web app. Compiled with Emscripten to a
// standalone .wasm with no JavaScript glue, so the same file loads in the
// AudioWorklet (engine, chorus, compare, quiz voice) and on the main thread
// (bird data for drawing, the quiz, the drawn line, offline phrases).
//
// This is glue only: no behaviour lives here. Handles are pointers into the
// module's memory, passed to JavaScript as unsigned 32-bit numbers. Arrays
// go out through buffers the caller allocated with tipp_alloc().

#include "BirdData.h"
#include "Chorus.h"
#include "Compare.h"
#include "Drawn.h"
#include "Engine.h"
#include "Params.h"
#include "Quiz.h"

#include <emscripten/emscripten.h>

#include <cstdint>
#include <cstdlib>
#include <cstring>
#include <new>
#include <string>
#include <vector>

#define TIPP_API extern "C" EMSCRIPTEN_KEEPALIVE

using namespace tipp;

namespace
{
std::string lastError;

bool okKnob(int k) noexcept { return k >= 0 && k < kNumKnobs; }
} // namespace

// ---------------------------------------------------------------- memory

TIPP_API void* tipp_alloc(int bytes) { return std::malloc(static_cast<std::size_t>(bytes > 0 ? bytes : 1)); }
TIPP_API void tipp_free(void* p) { std::free(p); }
TIPP_API const char* tipp_last_error() { return lastError.c_str(); }

// ---------------------------------------------------------------- params

TIPP_API int tipp_param_count() { return static_cast<int>(params::all.size()); }
TIPP_API const char* tipp_param_id(int i) { return params::all[static_cast<std::size_t>(i)].id; }
TIPP_API int tipp_param_kind(int i) { return static_cast<int>(params::all[static_cast<std::size_t>(i)].kind); }
TIPP_API double tipp_param_min(int i) { return params::all[static_cast<std::size_t>(i)].min; }
TIPP_API double tipp_param_max(int i) { return params::all[static_cast<std::size_t>(i)].max; }
TIPP_API double tipp_param_def(int i) { return params::all[static_cast<std::size_t>(i)].def; }
TIPP_API const char* tipp_param_unit(int i) { return params::all[static_cast<std::size_t>(i)].unit; }
TIPP_API const char* tipp_param_options(int i)
{
    const char* o = params::all[static_cast<std::size_t>(i)].options;
    return o != nullptr ? o : "";
}

// ---------------------------------------------------------------- birds

// Text pointers are NUL-terminated UTF-8. Returns 0 and sets the error on
// bad data. A bird lives until tipp_bird_free().
TIPP_API BirdData* tipp_bird_parse(const char* id, const char* voiceJson, const char* songsJson)
{
    auto* b = new (std::nothrow) BirdData();
    if (b == nullptr)
        return nullptr;
    if (! parseBird(id, voiceJson, songsJson, *b, lastError))
    {
        delete b;
        return nullptr;
    }
    return b;
}
TIPP_API void tipp_bird_free(BirdData* b) { delete b; }

TIPP_API float tipp_bird_pitch_ref(const BirdData* b) { return b->pitchRefHz; }
TIPP_API float tipp_bird_base(const BirdData* b, int k) { return okKnob(k) ? b->base[static_cast<std::size_t>(k)] : 0.0f; }
TIPP_API float tipp_bird_range_lo(const BirdData* b, int k) { return okKnob(k) ? b->knobRange[static_cast<std::size_t>(k)].lo : 0.0f; }
TIPP_API float tipp_bird_range_hi(const BirdData* b, int k) { return okKnob(k) ? b->knobRange[static_cast<std::size_t>(k)].hi : 0.0f; }
TIPP_API int tipp_bird_type_present(const BirdData* b, int type)
{
    return type >= 0 && type < kNumSongTypes && b->types[static_cast<std::size_t>(type)].present ? 1 : 0;
}
// Whether the type sounds in the scene: present and active after overrides.
TIPP_API int tipp_bird_type_active(const BirdData* b, int type, int season, int time, int sex, int age)
{
    if (tipp_bird_type_present(b, type) == 0)
        return 0;
    return rulesFor(b->types[static_cast<std::size_t>(type)], season, time, sex, age).active ? 1 : 0;
}
TIPP_API int tipp_bird_part_count(const BirdData* b) { return static_cast<int>(b->parts.size()); }
TIPP_API const char* tipp_bird_part(const BirdData* b, int i) { return b->parts[static_cast<std::size_t>(i)].c_str(); }
TIPP_API int tipp_bird_syllable_count(const BirdData* b) { return static_cast<int>(b->syllables.size()); }
TIPP_API float tipp_bird_syllable_dur(const BirdData* b, int s) { return b->syllables[static_cast<std::size_t>(s)].durMs; }
TIPP_API float tipp_bird_syllable_gain(const BirdData* b, int s) { return b->syllables[static_cast<std::size_t>(s)].gain; }

// n samples across the syllable, t = i / (n - 1): Hz at vo_pitch 1.0 and
// amp (0 to 1, before gain), interleaved in out (2n floats). Uses the
// engine's own contour maths, so the drawing matches the sound.
TIPP_API void tipp_bird_syllable_curve(const BirdData* b, int s, int n, float* out)
{
    const auto& syl = b->syllables[static_cast<std::size_t>(s)];
    for (int i = 0; i < n; ++i)
    {
        const float t = n > 1 ? static_cast<float>(i) / static_cast<float>(n - 1) : 0.0f;
        out[2 * i] = contourPitchAt(syl.pitch, t);
        out[2 * i + 1] = contourAt(syl.amp, t);
    }
}

// One point of the curve at t (0 to 1): Hz at vo_pitch 1.0 and amp times
// the syllable's gain, in out[0] and out[1].
TIPP_API void tipp_bird_syllable_at(const BirdData* b, int s, float t, float* out)
{
    const auto& syl = b->syllables[static_cast<std::size_t>(s)];
    out[0] = contourPitchAt(syl.pitch, t);
    out[1] = contourAt(syl.amp, t) * syl.gain;
}

// ---------------------------------------------------------------- engine

TIPP_API Engine* tipp_engine_new() { return new (std::nothrow) Engine(); }
TIPP_API void tipp_engine_free(Engine* e) { delete e; }
TIPP_API void tipp_engine_prepare(Engine* e, double sr) { e->prepare(sr); }
TIPP_API void tipp_engine_set_bird(Engine* e, const BirdData* b) { e->setBird(b); }
TIPP_API const BirdData* tipp_engine_bird_in_use(Engine* e) { return e->birdInUse(); }
TIPP_API void tipp_engine_set_param(Engine* e, int index, float v) { e->setParam(index, v); }
TIPP_API void tipp_engine_set_seed(Engine* e, std::uint32_t s) { e->setSeed(s); }
TIPP_API void tipp_engine_hand_down(Engine* e, int k) { e->handDown(k); }
TIPP_API void tipp_engine_hand_up(Engine* e, int k) { e->handUp(k); }
TIPP_API void tipp_engine_trigger(Engine* e, int index) { e->trigger(index); }
TIPP_API void tipp_engine_process(Engine* e, float* l, float* r, int n) { e->process(l, r, n); }

// Knob state, 4 floats per knob: effective value, mode (0 auto, 1 held,
// 2 hold, 3 return), seconds of hold left, overridden (0 or 1).
TIPP_API void tipp_engine_knobs(const Engine* e, float* out)
{
    for (int k = 0; k < kNumKnobs; ++k)
    {
        out[4 * k] = e->knobValue(k);
        out[4 * k + 1] = static_cast<float>(e->knobMode(k));
        out[4 * k + 2] = e->holdLeft(k);
        out[4 * k + 3] = e->knobOverridden(k) ? 1.0f : 0.0f;
    }
}

// Engine status, 10 floats: level, peak left, peak right (reset), singing,
// phrase position ms, phrase tempo, seed (as float bits are lossy, so also
// returned by tipp_engine_seed), phrases started, drawn sung, sample rate.
TIPP_API void tipp_engine_status(Engine* e, float* out)
{
    float l = 0.0f, r = 0.0f;
    e->takePeaks(l, r);
    out[0] = e->birdLevel();
    out[1] = l;
    out[2] = r;
    out[3] = e->singing() ? 1.0f : 0.0f;
    out[4] = e->phrasePosMs();
    out[5] = e->phraseTempo();
    out[6] = 0.0f;
    out[7] = static_cast<float>(e->phrasesStarted());
    out[8] = static_cast<float>(e->drawnSung());
    out[9] = static_cast<float>(e->sampleRate());
}
TIPP_API std::uint32_t tipp_engine_seed(const Engine* e) { return e->seed(); }
TIPP_API std::uint32_t tipp_engine_phrases(const Engine* e) { return e->phrasesStarted(); }
TIPP_API int tipp_engine_singing(const Engine* e) { return e->singing() ? 1 : 0; }
TIPP_API double tipp_engine_sono_rate(const Engine* e) { return e->sonoFrameRate(); }
TIPP_API std::uint32_t tipp_engine_sono_written(const Engine* e) { return e->sonoWritten(); }

// Frames from..from+count-1, 3 floats each: Hz, amp, hand mask.
TIPP_API void tipp_engine_sono_read(const Engine* e, std::uint32_t from, int count, float* out)
{
    for (int i = 0; i < count; ++i)
    {
        const auto f = e->sonoFrame(from + static_cast<std::uint32_t>(i));
        out[3 * i] = f.freqHz;
        out[3 * i + 1] = f.amp;
        out[3 * i + 2] = static_cast<float>(f.handMask);
    }
}

// The phrase being sung: 5 header floats (number, count, length ms, drawn,
// drawn start ms), then 5 per note (syllable, start ms, dur ms, pitch
// factor, part). Returns 0 if the phrase changed during the copy.
TIPP_API int tipp_engine_phrase(const Engine* e, float* out)
{
    static Engine::PhraseView view;
    if (! e->readPhrase(view))
        return 0;
    out[0] = static_cast<float>(view.number);
    out[1] = static_cast<float>(view.count);
    out[2] = view.lengthMs;
    out[3] = view.drawn ? 1.0f : 0.0f;
    out[4] = view.drawnStartMs;
    for (int i = 0; i < view.count; ++i)
    {
        const auto& n = view.notes[static_cast<std::size_t>(i)];
        float* o = out + 5 + 5 * i;
        o[0] = static_cast<float>(n.syl);
        o[1] = n.startMs;
        o[2] = n.durMs;
        o[3] = n.pitchMul;
        o[4] = static_cast<float>(n.part);
    }
    return 1;
}
TIPP_API int tipp_engine_max_notes() { return Engine::kMaxNotes; }

TIPP_API void tipp_engine_set_drawn(Engine* e, const DrawnLine* line) { e->setDrawn(*line); }
TIPP_API void tipp_engine_keep_drawn(Engine* e, int keep) { e->keepDrawn(keep != 0); }

// ---------------------------------------------------------------- drawn line

TIPP_API DrawnLine* tipp_line_new() { return new (std::nothrow) DrawnLine(); }
TIPP_API void tipp_line_free(DrawnLine* l) { delete l; }
TIPP_API void tipp_line_clear(DrawnLine* l) { l->count = 0; }
TIPP_API int tipp_line_count(const DrawnLine* l) { return l->count; }
// 3 floats per point: t ms, Hz, joinPrev.
TIPP_API void tipp_line_points(const DrawnLine* l, float* out)
{
    for (int i = 0; i < l->count; ++i)
    {
        const auto& p = l->pts[static_cast<std::size_t>(i)];
        out[3 * i] = p.tMs;
        out[3 * i + 1] = p.hz;
        out[3 * i + 2] = p.joinPrev ? 1.0f : 0.0f;
    }
}
// Replaces the line with n points, 3 floats each as in tipp_line_points.
TIPP_API void tipp_line_set(DrawnLine* l, const float* raw, int n)
{
    l->count = 0;
    for (int i = 0; i < n && i < DrawnLine::kMax; ++i)
    {
        l->pts[static_cast<std::size_t>(i)] = { raw[3 * i], raw[3 * i + 1], raw[3 * i + 2] != 0.0f };
        l->count = i + 1;
    }
}
TIPP_API float tipp_line_start(const DrawnLine* l) { return drawnStart(*l); }
TIPP_API float tipp_line_end(const DrawnLine* l) { return drawnEnd(*l); }
// out: Hz, amp.
TIPP_API void tipp_line_at(const DrawnLine* l, float tMs, float* out) { drawnAt(*l, tMs, out[0], out[1]); }
// raw: 3 floats per point as in tipp_line_points.
TIPP_API int tipp_line_add_stroke(DrawnLine* l, const float* raw, int n, float pxPerMs, float pxPerHz, float tolPx)
{
    std::vector<DrawnPoint> pts(static_cast<std::size_t>(n > 0 ? n : 0));
    for (int i = 0; i < n; ++i)
        pts[static_cast<std::size_t>(i)] = { raw[3 * i], raw[3 * i + 1], raw[3 * i + 2] != 0.0f };
    return addStroke(*l, pts.data(), n, pxPerMs, pxPerHz, tolPx) ? 1 : 0;
}
TIPP_API int tipp_line_erase(DrawnLine* l, float tMs, float hz, float pxPerMs, float pxPerHz, float radiusPx)
{
    return eraseNear(*l, tMs, hz, pxPerMs, pxPerHz, radiusPx) ? 1 : 0;
}

// ---------------------------------------------------------------- compare

TIPP_API Compare* tipp_compare_new() { return new (std::nothrow) Compare(); }
TIPP_API void tipp_compare_start(Compare* c, Engine* e, const BirdData* first, const BirdData* second, int restoreAutoplay,
                                 int restorePlay, int restoreType, double now, int type)
{
    c->start(*e, first, second, { restoreAutoplay != 0, restorePlay != 0, restoreType }, now, type);
}
TIPP_API void tipp_compare_tick(Compare* c, Engine* e, double now) { c->tick(*e, now); }
TIPP_API void tipp_compare_cancel(Compare* c, Engine* e) { c->cancel(*e); }
TIPP_API int tipp_compare_running(const Compare* c) { return c->running() ? 1 : 0; }
TIPP_API int tipp_compare_stage(const Compare* c) { return c->stage(); }

// ---------------------------------------------------------------- quiz voice

TIPP_API QuizVoice* tipp_qvoice_new() { return new (std::nothrow) QuizVoice(); }
TIPP_API void tipp_qvoice_start(QuizVoice* q, Engine* e, const BirdData* b, int type, int half) { q->start(*e, b, type, half != 0); }
TIPP_API void tipp_qvoice_again(QuizVoice* q, Engine* e) { q->playAgain(*e); }
TIPP_API void tipp_qvoice_half(QuizVoice* q, Engine* e, int half) { q->setHalfSpeed(*e, half != 0); }
TIPP_API void tipp_qvoice_tick(QuizVoice* q, Engine* e) { q->tick(*e); }
TIPP_API void tipp_qvoice_stop(QuizVoice* q) { q->stop(); }
TIPP_API int tipp_qvoice_started(const QuizVoice* q) { return q->started() ? 1 : 0; }
TIPP_API std::uint32_t tipp_qvoice_start_frame(const QuizVoice* q) { return q->startFrame(); }
TIPP_API std::uint32_t tipp_qvoice_sung(const QuizVoice* q) { return q->sungCount(); }
TIPP_API int tipp_qvoice_season(const QuizVoice* q) { return q->season(); }
TIPP_API int tipp_qvoice_time(const QuizVoice* q) { return q->timeOfDay(); }

// ---------------------------------------------------------------- quiz

struct QuizHost
{
    Quiz quiz;
    std::vector<QuizBird> birds;
    std::vector<int> scratch;
};

TIPP_API QuizHost* tipp_quiz_new() { return new (std::nothrow) QuizHost(); }
TIPP_API void tipp_quiz_clear_birds(QuizHost* q) { q->birds.clear(); }
// lookalikes: n indices into the same list.
TIPP_API void tipp_quiz_add_bird(QuizHost* q, int group, int hasCall, const int* lookalikes, int n)
{
    QuizBird b;
    b.group = group;
    b.hasCall = hasCall != 0;
    b.lookalikes.assign(lookalikes, lookalikes + (n > 0 ? n : 0));
    q->birds.push_back(std::move(b));
}
TIPP_API int tipp_quiz_pool_size(QuizHost* q, int set)
{
    q->scratch = Quiz::poolFor(q->birds, set);
    return static_cast<int>(q->scratch.size());
}
TIPP_API int tipp_quiz_start(QuizHost* q, int set, int ask, std::uint32_t seed) { return q->quiz.start(q->birds, set, ask, seed) ? 1 : 0; }
// 13 ints: bird, type, count, answers[4], correct slot, picked, number,
// correct, missed, left.
TIPP_API void tipp_quiz_state(const QuizHost* q, int* out)
{
    const auto& qq = q->quiz.question();
    out[0] = qq.bird;
    out[1] = qq.type;
    out[2] = qq.count;
    for (int i = 0; i < Quiz::kAnswers; ++i)
        out[3 + i] = qq.answers[static_cast<std::size_t>(i)];
    out[7] = qq.correctSlot;
    out[8] = qq.picked;
    out[9] = q->quiz.questionNumber();
    out[10] = q->quiz.correct();
    out[11] = q->quiz.missed();
    out[12] = q->quiz.left();
}
TIPP_API int tipp_quiz_answer(QuizHost* q, int slot) { return q->quiz.answer(slot) ? 1 : 0; }
TIPP_API int tipp_quiz_next(QuizHost* q) { return q->quiz.next() ? 1 : 0; }
TIPP_API int tipp_quiz_finished(const QuizHost* q) { return q->quiz.finished() ? 1 : 0; }
// Writes up to max bird indices, returns how many.
TIPP_API int tipp_quiz_practise(const QuizHost* q, int* out, int max)
{
    const auto p = q->quiz.practise();
    int n = 0;
    for (int b : p)
        if (n < max)
            out[n++] = b;
    return n;
}
TIPP_API int tipp_quiz_scene_for(const BirdData* b, int type, int* out)
{
    return QuizVoice::sceneFor(*b, type, out[0], out[1]) ? 1 : 0;
}

// ---------------------------------------------------------------- chorus

TIPP_API Chorus* tipp_chorus_new() { return new (std::nothrow) Chorus(); }
TIPP_API void tipp_chorus_prepare(Chorus* c, double sr) { c->prepare(sr); }
TIPP_API void tipp_chorus_set_lane_bird(Chorus* c, int lane, const BirdData* b) { c->setLaneBird(lane, b); }
TIPP_API const BirdData* tipp_chorus_lane_bird_in_use(const Chorus* c, int lane) { return c->laneBirdInUse(lane); }
TIPP_API void tipp_chorus_set_entry(Chorus* c, int lane, float m) { c->setEntry(lane, m); }
TIPP_API void tipp_chorus_set_distance(Chorus* c, int lane, float m) { c->setDistance(lane, m); }
TIPP_API void tipp_chorus_set_mute(Chorus* c, int lane, int on) { c->setMute(lane, on != 0); }
TIPP_API void tipp_chorus_set_solo(Chorus* c, int lane, int on) { c->setSolo(lane, on != 0); }
TIPP_API void tipp_chorus_hold_knob(Chorus* c, int lane, int k, float v) { c->holdKnob(lane, k, v); }
TIPP_API void tipp_chorus_release_knob(Chorus* c, int lane, int k) { c->releaseKnob(lane, k); }
TIPP_API void tipp_chorus_set_season(Chorus* c, int s) { c->setSeason(s); }
TIPP_API void tipp_chorus_set_place(Chorus* c, int p) { c->setPlace(p); }
TIPP_API void tipp_chorus_set_speed(Chorus* c, int s) { c->setSpeed(s); }
TIPP_API void tipp_chorus_set_seed(Chorus* c, std::uint32_t s) { c->setSeed(s); }
TIPP_API void tipp_chorus_set_playing(Chorus* c, int on) { c->setPlaying(on != 0); }
TIPP_API void tipp_chorus_seek(Chorus* c, float m) { c->seek(m); }
TIPP_API void tipp_chorus_process_add(Chorus* c, float* l, float* r, int n) { c->processAdd(l, r, n); }
// 3 + 5 per lane floats: minute, finished, peaks max (reset); per lane
// started, audible, singing, in season, level.
TIPP_API void tipp_chorus_status(Chorus* c, float* out)
{
    float l = 0.0f, r = 0.0f;
    c->takePeaks(l, r);
    out[0] = c->minute();
    out[1] = c->finished() ? 1.0f : 0.0f;
    out[2] = l > r ? l : r;
    for (int i = 0; i < Chorus::kLanes; ++i)
    {
        float* o = out + 3 + 5 * i;
        o[0] = c->laneStarted(i) ? 1.0f : 0.0f;
        o[1] = c->laneAudible(i) ? 1.0f : 0.0f;
        o[2] = c->laneSinging(i) ? 1.0f : 0.0f;
        o[3] = c->laneInSeason(i) ? 1.0f : 0.0f;
        o[4] = c->laneLevel(i);
    }
}
// kColumns bytes per lane, 4 lanes: 1 where the lane sang.
TIPP_API void tipp_chorus_sang(const Chorus* c, std::uint8_t* out)
{
    for (int lane = 0; lane < Chorus::kLanes; ++lane)
        for (int col = 0; col < Chorus::kColumns; ++col)
            out[lane * Chorus::kColumns + col] = c->sang(lane, col) ? 1u : 0u;
}
TIPP_API float tipp_chorus_clock_rate(int speed) { return Chorus::clockRate(speed); }
