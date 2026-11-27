// tipp-render: offline render and checks on core/.
//
//   tipp-render --bird svarttrost --type song --seconds 30 --out out/svarttrost.wav
//   tipp-render --bird svarttrost --type call --seed 7 --set su_distance=60 --out out/x.wav
//   tipp-render --list-params
//   tipp-render --bird svarttrost --check-override
//   tipp-render --bird blameis --compare kjottmeis --out out/compare.wav
//   tipp-render --bird svarttrost --check-draw
//   tipp-render --bird svarttrost --draw --out out/draw.wav
//   tipp-render --bird svarttrost --check-quiz
//   tipp-render --chorus --chorus-start -75 --chorus-speed 60x --seconds 40 --out out/chorus.wav
//   tipp-render --check-chorus
//   tipp-render --bird svarttrost --seconds 120 --phrase-log out/log.txt --out out/x.wav
//
// --phrase-log writes one line per phrase (number, length, syllable indices
// with start times and pitch factors, floats as hex bits). web/scripts/check-seed.mjs
// writes the same lines from the WASM build, so the two can be diffed.
//
// --draw sings a fixed drawn line in draw mode, again each time it ends.
// --keep keeps that line as a phrase: autoplay sings it after each phrase
// of the bird's own. --check-draw tests the drawn line and draw mode
// without writing audio.
//
// --check-quiz tests the quiz: the birds each set asks about, the answers,
// missed birds coming back sooner, the same seed giving the same quiz, and
// QuizVoice singing one phrase of --bird at half speed. No audio file.
//
// --chorus renders the dawn chorus with the 4 lanes in data/chorus.json
// (or --lanes a,b,c,d), from --chorus-start minutes (default -90) at
// --chorus-speed real|10x|60x|loop (default 10x). --check-chorus tests the
// clock, entries, mute, solo, season, the end and loop. No --bird needed.
//
// --compare runs the field guide's COMPARE: one phrase of --bird, a gap,
// one phrase of the other bird, then stop. The file ends when it is done.
//
// --set id=value holds a knob by hand for the whole render, or sets any
// other parameter. Choices take their option id: --set sc_time=dusk.
//
// Exit codes: 0 all checks pass, 1 a check failed, 2 bad arguments or I/O.

#include "BirdData.h"
#include "Chorus.h"
#include "Compare.h"
#include "Engine.h"
#include "Json.h"
#include "Params.h"
#include "Quiz.h"
#include "WavWriter.h"

#include <algorithm>
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <fstream>
#include <memory>
#include <sstream>
#include <string>
#include <utility>
#include <vector>

namespace
{
constexpr std::uint32_t kSampleRate = 48000;
constexpr int kBlock = 512;

// Render check limits. See CLAUDE.md, "Verification".
constexpr float kMaxPeak = 0.7f;
constexpr float kMaxStep = 0.5f;
constexpr float kEdgeLimit = 0.001f;
constexpr float kMinRms = 0.003f; // below this the bird did not really sing

const char* kindName(tipp::params::Kind k)
{
    using tipp::params::Kind;
    switch (k)
    {
        case Kind::Knob:    return "knob";
        case Kind::Choice:  return "choice";
        case Kind::Toggle:  return "toggle";
        case Kind::Integer: return "integer";
        case Kind::Text:    return "text";
        case Kind::Trigger: return "trigger";
    }
    return "?";
}

void listParams()
{
    for (const auto& p : tipp::params::all)
        std::printf("%-14s %-8s %10g %12g %8g %-4s %s\n", p.id, kindName(p.kind),
                    p.min, p.max, p.def, p.unit, p.options != nullptr ? p.options : "");
    std::printf("%zu parameters\n", tipp::params::all.size());
}

void usage()
{
    std::fprintf(stderr,
        "usage: tipp-render --bird <id> [--type song|call|alarm|flight] [--seconds <s>]\n"
        "                   [--seed <n>] [--set <id>=<value>]... [--data <dir>] --out <file.wav>\n"
        "       tipp-render --list-params\n"
        "       tipp-render --bird <id> --check-override\n"
        "       tipp-render --bird <id> --compare <other id> [--seconds <max s>] --out <file.wav>\n"
        "       tipp-render --bird <id> --check-draw\n"
        "       tipp-render --bird <id> --check-quiz\n"
        "       tipp-render --chorus [--lanes a,b,c,d] [--chorus-start <min>] [--chorus-speed real|10x|60x|loop] [--seconds <s>] --out <file.wav>\n"
        "       tipp-render --check-chorus\n"
        "       tipp-render --bird <id> (--draw | --keep) [--seconds <s>] [--set ...] --out <file.wav>\n");
}

bool readFile(const std::string& path, std::string& out)
{
    std::ifstream f(path, std::ios::binary);
    if (! f)
        return false;
    std::ostringstream ss;
    ss << f.rdbuf();
    out = ss.str();
    return true;
}

// Option id to index for a choice parameter, or a plain number.
bool parseValue(const tipp::params::Info& info, const std::string& text, float& out)
{
    if (info.options != nullptr)
    {
        int index = 0;
        std::string opts = info.options;
        std::size_t start = 0;
        for (;;)
        {
            const std::size_t bar = opts.find('|', start);
            if (opts.substr(start, bar - start) == text)
            {
                out = static_cast<float>(index);
                return true;
            }
            if (bar == std::string::npos)
                break;
            start = bar + 1;
            ++index;
        }
    }
    char* end = nullptr;
    out = std::strtof(text.c_str(), &end);
    return end != text.c_str() && *end == '\0';
}

// The sonogram's scale: 80 px per second, 40 px per kHz.
constexpr float kPxPerMs = 0.08f;
constexpr float kPxPerHz = 0.04f;
constexpr float kTolPx = 2.5f;

// A stroke as the pointer would give it: one sample every 10 ms.
template <typename HzAt>
void stroke(tipp::DrawnLine& line, float fromMs, float toMs, HzAt hzAt)
{
    std::vector<tipp::DrawnPoint> raw;
    for (float t = fromMs; t <= toMs + 0.01f; t += 10.0f)
        raw.push_back({ t, hzAt((t - fromMs) / std::max(1.0f, toMs - fromMs)), false });
    tipp::addStroke(line, raw.data(), static_cast<int>(raw.size()), kPxPerMs, kPxPerHz, kTolPx);
}

// A rising slur with a dip, a dot, and a long fall.
tipp::DrawnLine demoLine()
{
    tipp::DrawnLine line;
    stroke(line, 300.0f, 700.0f, [](float u) { return 2000.0f + 1400.0f * u - 500.0f * std::sin(3.14159f * u); });
    stroke(line, 900.0f, 900.0f, [](float) { return 4000.0f; });
    stroke(line, 1100.0f, 1700.0f, [](float u) { return 5000.0f - 2500.0f * u * u; });
    return line;
}

struct Stats
{
    std::size_t nonFinite = 0;
    float peak = 0.0f, maxStep = 0.0f, rms = 0.0f, edgeStart = 0.0f, edgeEnd = 0.0f;
};

Stats measure(const std::vector<float>& left, const std::vector<float>& right)
{
    Stats st;
    double sumSq = 0.0;
    float prevL = 0.0f, prevR = 0.0f;
    for (std::size_t i = 0; i < left.size(); ++i)
    {
        const float l = left[i], r = right[i];
        if (! std::isfinite(l) || ! std::isfinite(r)) { ++st.nonFinite; continue; }
        st.peak = std::max({ st.peak, std::fabs(l), std::fabs(r) });
        st.maxStep = std::max({ st.maxStep, std::fabs(l - prevL), std::fabs(r - prevR) });
        sumSq += static_cast<double>(l) * static_cast<double>(l);
        prevL = l;
        prevR = r;
    }
    if (! left.empty())
    {
        st.rms = static_cast<float>(std::sqrt(sumSq / static_cast<double>(left.size())));
        st.edgeStart = std::max(std::fabs(left.front()), std::fabs(right.front()));
        st.edgeEnd = std::max(std::fabs(left.back()), std::fabs(right.back()));
    }
    return st;
}

// The dawn chorus setup from data/chorus.json, and the parsed birds.
struct ChorusSetup
{
    std::vector<std::string> ids;
    std::vector<float> entry, distance;
    std::vector<std::unique_ptr<tipp::BirdData>> birds;
};

bool loadChorus(const std::string& dataDir, const std::string& lanesCsv, ChorusSetup& out)
{
    std::string text, error;
    tipp::json::Value doc;
    if (! readFile(dataDir + "/chorus.json", text) || ! tipp::json::parse(text, doc, error))
    {
        std::fprintf(stderr, "cannot read %s/chorus.json %s\n", dataDir.c_str(), error.c_str());
        return false;
    }
    const auto* def = doc.get("default_entry_min");
    const auto* entries = doc.get("entry_min");
    const auto* lanes = doc.get("lanes");
    if (lanes == nullptr || ! lanes->isArray() || lanes->items.size() != static_cast<std::size_t>(tipp::Chorus::kLanes))
    {
        std::fprintf(stderr, "chorus.json needs 4 lanes\n");
        return false;
    }
    for (const auto& l : lanes->items)
    {
        out.ids.push_back(l.get("bird") != nullptr ? l.get("bird")->text : std::string());
        out.distance.push_back(l.get("distance_m") != nullptr ? static_cast<float>(l.get("distance_m")->number) : 15.0f);
    }
    if (! lanesCsv.empty())
    {
        std::stringstream ss(lanesCsv);
        std::string id;
        for (std::size_t i = 0; i < out.ids.size() && std::getline(ss, id, ','); ++i)
            out.ids[i] = id;
    }
    for (const auto& id : out.ids)
    {
        const auto* e = entries != nullptr ? entries->get(id.c_str()) : nullptr;
        out.entry.push_back(static_cast<float>(e != nullptr ? e->number : def != nullptr ? def->number : -40.0));
        std::string v, s;
        const std::string dir = dataDir + "/birds/" + id + "/";
        auto b = std::make_unique<tipp::BirdData>();
        if (! readFile(dir + "voice.json", v) || ! readFile(dir + "songs.json", s) || ! tipp::parseBird(id, v, s, *b, error))
        {
            std::fprintf(stderr, "cannot load bird %s %s\n", id.c_str(), error.c_str());
            return false;
        }
        out.birds.push_back(std::move(b));
    }
    return true;
}

void setUpChorus(tipp::Chorus& chorus, const ChorusSetup& setup, std::uint32_t seed)
{
    chorus.prepare(kSampleRate);
    chorus.setSeed(seed);
    for (int i = 0; i < tipp::Chorus::kLanes; ++i)
    {
        const auto u = static_cast<std::size_t>(i);
        chorus.setLaneBird(i, setup.birds[u].get());
        chorus.setEntry(i, setup.entry[u]);
        chorus.setDistance(i, setup.distance[u]);
    }
}

// Runs the chorus for s seconds in 512-sample blocks. Adds to the buffers if given.
void runChorus(tipp::Chorus& chorus, double s, std::vector<float>* left = nullptr, std::vector<float>* right = nullptr)
{
    std::vector<float> l(kBlock), r(kBlock);
    const auto total = static_cast<std::size_t>(s * kSampleRate);
    for (std::size_t pos = 0; pos < total; pos += kBlock)
    {
        const int n = static_cast<int>(std::min<std::size_t>(kBlock, total - pos));
        std::fill(l.begin(), l.end(), 0.0f);
        std::fill(r.begin(), r.end(), 0.0f);
        chorus.processAdd(l.data(), r.data(), n);
        if (left != nullptr)
        {
            left->insert(left->end(), l.begin(), l.begin() + n);
            right->insert(right->end(), r.begin(), r.begin() + n);
        }
    }
}

int notesIn(const tipp::DrawnLine& line)
{
    int n = 0;
    for (int i = 0; i < line.count; ++i)
        if (! line.pts[static_cast<std::size_t>(i)].joinPrev)
            ++n;
    return n;
}

// The drawn line's editing and how the engine sings it.
int checkDraw(const tipp::BirdData& bird)
{
    namespace P = tipp::params;
    int failures = 0;
    auto check = [&failures](bool pass, const char* what) {
        std::printf("%-4s %s\n", pass ? "ok" : "FAIL", what);
        if (! pass)
            ++failures;
    };

    {
        tipp::DrawnLine line;
        stroke(line, 0.0f, 500.0f, [](float u) { return 2000.0f + 2000.0f * u; });
        check(line.count == 2, "a straight stroke keeps its 2 ends");
    }

    const tipp::DrawnLine demo = demoLine();
    check(notesIn(demo) == 3, "demo line has 3 notes");
    check(demo.count > 4 && demo.count < 20, "curved strokes keep a few corners, not every sample");

    {
        // Within a few px of what was drawn, and never past the points.
        float worst = 0.0f;
        bool monotone = true;
        for (float t = 300.0f; t <= 700.0f; t += 5.0f)
        {
            const float u = (t - 300.0f) / 400.0f;
            const float want = 2000.0f + 1400.0f * u - 500.0f * std::sin(3.14159f * u);
            float hz = 0.0f, amp = 0.0f;
            tipp::drawnAt(demo, t, hz, amp);
            worst = std::max(worst, std::fabs(hz - want) * kPxPerHz);
        }
        for (int k = 0; k + 1 < demo.count; ++k)
        {
            const auto& a = demo.pts[static_cast<std::size_t>(k)];
            const auto& b = demo.pts[static_cast<std::size_t>(k + 1)];
            if (! b.joinPrev)
                continue;
            for (int j = 1; j < 10; ++j)
            {
                float hz = 0.0f, amp = 0.0f;
                tipp::drawnAt(demo, a.tMs + (b.tMs - a.tMs) * static_cast<float>(j) / 10.0f, hz, amp);
                monotone = monotone && hz >= std::min(a.hz, b.hz) * 0.999f && hz <= std::max(a.hz, b.hz) * 1.001f;
            }
        }
        std::printf("     line is within %.1f px of the stroke\n", static_cast<double>(worst));
        check(worst < 6.0f, "sung line follows the stroke within 6 px");
        check(monotone, "no overshoot between points");
    }

    {
        float hz = 0.0f, a0 = 1.0f, a1 = 0.0f, a2 = 1.0f, aGap = 1.0f;
        tipp::drawnAt(demo, 300.0f, hz, a0);
        tipp::drawnAt(demo, 500.0f, hz, a1);
        tipp::drawnAt(demo, 700.0f, hz, a2);
        tipp::drawnAt(demo, 800.0f, hz, aGap);
        check(a0 == 0.0f && a2 == 0.0f && a1 == 1.0f && aGap == 0.0f, "notes start and end silent, full in the middle");
        check(std::fabs(hz - 4000.0f) < 1.0f, "in a gap the pitch waits at the next note");
        check(std::fabs(tipp::drawnEnd(demo) - 1700.0f) < 0.5f && std::fabs(tipp::drawnStart(demo) - 300.0f) < 0.5f, "start and end");
    }

    {
        // A stroke across the middle of a note cuts it into 3.
        tipp::DrawnLine line;
        stroke(line, 0.0f, 1000.0f, [](float u) { return 2000.0f + 1000.0f * u; });
        stroke(line, 400.0f, 600.0f, [](float) { return 5000.0f; });
        float hz = 0.0f, amp = 0.0f;
        tipp::drawnAt(line, 200.0f, hz, amp);
        check(notesIn(line) == 3 && std::fabs(hz - 2200.0f) < 30.0f, "a new stroke replaces only its own span");
    }

    {
        tipp::DrawnLine line = demo;
        const int before = line.count;
        const auto p = line.pts[1];
        tipp::eraseNear(line, p.tMs, p.hz, kPxPerMs, kPxPerHz, 6.0f);
        check(line.count == before - 1, "erase removes the point under the pointer");
        line = demo;
        float hz = 0.0f, amp = 0.0f;
        tipp::drawnAt(line, 1400.0f, hz, amp);
        tipp::eraseNear(line, 1400.0f, hz, kPxPerMs, kPxPerHz, 6.0f);
        check(notesIn(line) > notesIn(demo), "erase on the curve between points cuts the note");
    }

    {
        tipp::DrawnLine line;
        bool lastFit = true;
        for (int i = 0; i < 70; ++i)
        {
            const tipp::DrawnPoint dot { 100.0f * static_cast<float>(i), 3000.0f, false };
            lastFit = tipp::addStroke(line, &dot, 1, kPxPerMs, kPxPerHz, kTolPx);
        }
        check(line.count == tipp::DrawnLine::kMax && ! lastFit, "a full line refuses more points");
    }

    // The engine: draw mode waits, sing once sings the line, kept takes turns.
    {
        tipp::Engine e;
        e.prepare(kSampleRate);
        e.setBird(&bird);
        e.setDrawn(demo);
        e.setParam(P::indexOf(P::pb_draw), 1.0f);
        e.setParam(P::indexOf(P::pb_play), 1.0f);
        std::vector<float> buf(kBlock);
        auto run = [&](double s) {
            for (int i = 0; i < static_cast<int>(s * kSampleRate / kBlock); ++i)
                e.process(buf.data(), buf.data(), kBlock);
        };
        run(4.0);
        check(e.phrasesStarted() == 0u, "draw mode: autoplay waits");
        e.trigger(P::indexOf(P::ap_sing_once));
        run(0.2); // into the first note
        tipp::Engine::PhraseView v;
        const bool read = e.readPhrase(v);
        check(read && v.drawn && v.count == 0 && std::fabs(v.lengthMs - 1400.0f) < 1.0f && e.drawnSung() == 1u,
              "sing once sings the drawn line");
        const auto f = e.sonoFrame(e.sonoWritten() - 1u);
        float hz = 0.0f, amp = 0.0f;
        tipp::drawnAt(demo, 300.0f + e.phrasePosMs(), hz, amp);
        std::printf("     sonogram %.0f Hz, line %.0f Hz\n", static_cast<double>(f.freqHz), static_cast<double>(hz));
        check(f.amp > 0.1f && std::fabs(std::log2(f.freqHz / hz)) < 0.05f, "the sonogram shows the line's pitch");
        run(6.0);
        check(e.phrasesStarted() == 1u && ! e.singing(), "one phrase, then it waits again");

        e.setParam(P::indexOf(P::pb_speed), 2.0f);
        e.trigger(P::indexOf(P::ap_sing_once));
        run(0.1);
        check(std::fabs(e.phraseTempo() - 0.25f) < 1.0e-4f, "quarter speed reaches the drawn line");
        run(5.0);
        check(e.singing() && e.drawnSung() == 2u, "at quarter speed the 1.4 s line still sings after 5 s");
        run(1.0);
        check(! e.singing(), "and ends by 6 s");
        e.setParam(P::indexOf(P::pb_speed), 0.0f);

        e.setParam(P::indexOf(P::pb_draw), 0.0f);
        e.keepDrawn(true);
        const auto p0 = e.phrasesStarted(), d0 = e.drawnSung();
        // At least 4 turns: 40 s for most birds, longer for slow ones (the curlew).
        for (int k = 0; k < 12 && e.phrasesStarted() - p0 < 4u; ++k)
            run(10.0);
        const auto own = (e.phrasesStarted() - p0) - (e.drawnSung() - d0);
        const auto drawn = e.drawnSung() - d0;
        std::printf("     kept: %u own phrases, %u drawn\n", own, drawn);
        check(own >= 2u && drawn >= 2u && (own > drawn ? own - drawn : drawn - own) <= 1u, "a kept line takes every other turn");
    }

    std::printf("%s\n", failures == 0 ? "draw check passed" : "draw check FAILED");
    return failures == 0 ? 0 : 1;
}

// Drives a knob the way the interface does and checks the override
// sequence from prd.md: hold, 3 s wait, 300 ms return, latch, return all,
// autoplay off. Also checks the sonogram feed and the published phrase.
int checkOverride(const tipp::BirdData& bird)
{
    namespace P = tipp::params;
    using Mode = tipp::Engine::KnobMode;
    tipp::Engine engine;
    engine.prepare(kSampleRate);
    engine.setBird(&bird);
    engine.setParam(P::indexOf(P::pb_play), 1.0f);

    std::vector<float> buf(32);
    double now = 0.0;
    auto run = [&](double s) {
        const auto blocks = static_cast<long>(s * kSampleRate / 32.0 + 0.5);
        for (long b = 0; b < blocks; ++b)
            engine.process(buf.data(), buf.data(), 32);
        now += s;
    };

    int failures = 0;
    auto expect = [&](bool ok, const char* what) {
        std::printf("%s  %6.2f s  %s\n", ok ? "pass" : "FAIL", now, what);
        if (! ok)
            ++failures;
    };
    const int k = tipp::kPitch;
    const tipp::Range autoRange = bird.types[tipp::kSong].autoRange[static_cast<std::size_t>(k)];
    auto inAuto = [&] { const float v = engine.knobValue(k); return v >= autoRange.lo - 1e-4f && v <= autoRange.hi + 1e-4f; };
    auto touch = [&](float v) { engine.setParam(k, v); engine.handDown(k); };

    run(2.0);
    expect(engine.knobMode(k) == Mode::Auto && inAuto(), "autoplay sings the knob");

    touch(1.5f);
    run(1.0);
    expect(engine.knobMode(k) == Mode::Held && std::abs(engine.knobValue(k) - 1.5f) < 1e-5f, "held: hand value in use");
    engine.setParam(k, 1.6f);
    run(0.1);
    expect(std::abs(engine.knobValue(k) - 1.6f) < 1e-5f, "held: follows the drag");

    engine.handUp(k);
    run(1.0);
    expect(engine.knobMode(k) == Mode::Hold && std::abs(engine.knobValue(k) - 1.6f) < 1e-5f, "released: keeps the hand value");
    expect(std::abs(engine.holdLeft(k) - 2.0f) < 0.02f, "released: 2.0 s of hold left");
    run(1.95);
    expect(engine.knobMode(k) == Mode::Hold, "still holding at 2.95 s");
    run(0.15);
    expect(engine.knobMode(k) == Mode::Return && engine.knobValue(k) < 1.6f && engine.knobValue(k) > autoRange.hi,
           "returning at 3.1 s, between hand and autoplay");
    run(0.25);
    expect(engine.knobMode(k) == Mode::Auto && inAuto(), "back to autoplay by 3.35 s");

    // Sonogram feed marks the hand time.
    {
        const std::uint32_t w = engine.sonoWritten();
        const double rate = engine.sonoFrameRate();
        const auto back = [&](double s) { return w - 1u - static_cast<std::uint32_t>(s * rate); };
        expect(std::abs(rate - 375.0) < 1e-6, "sonogram frame rate 375 per s");
        expect((engine.sonoFrame(back(2.0)).handMask & 1u) != 0u, "sonogram marks the hold");
        expect(engine.sonoFrame(back(0.1)).handMask == 0u, "sonogram mark ends with the return");
    }

    engine.setParam(P::indexOf(P::ap_latch), 1.0f);
    touch(0.8f);
    run(0.2);
    engine.handUp(k);
    run(6.0);
    expect(engine.knobMode(k) == Mode::Hold && std::abs(engine.knobValue(k) - 0.8f) < 1e-5f, "latch: still holding after 6 s");
    expect(engine.holdLeft(k) < 0.0f, "latch: no countdown");
    engine.setParam(k + 1, 60.0f); // breath, a second override
    engine.handDown(k + 1);
    engine.handUp(k + 1);
    run(0.1);
    engine.trigger(P::indexOf(P::ap_return_all));
    run(0.35);
    expect(engine.knobMode(k) == Mode::Auto && engine.knobMode(k + 1) == Mode::Auto, "return all: both knobs back by 0.35 s");
    engine.setParam(P::indexOf(P::ap_latch), 0.0f);

    engine.setParam(P::indexOf(P::ap_on), 0.0f);
    touch(1.2f);
    run(0.2);
    engine.handUp(k);
    run(6.0);
    expect(engine.knobMode(k) == Mode::Hold && std::abs(engine.knobValue(k) - 1.2f) < 1e-5f, "autoplay off: knob stays where the hand left it");
    // A long song (the skylark's runs 15 to 35 s) can still be going: let it end.
    for (int i = 0; i < 1200 && engine.singing(); ++i)
        run(0.1);
    const auto before = engine.phrasesStarted();
    engine.trigger(P::indexOf(P::ap_sing_once));
    run(0.1);
    expect(engine.phrasesStarted() == before + 1u, "autoplay off: sing once starts one phrase");
    tipp::Engine::PhraseView view;
    bool read = false;
    for (int i = 0; i < 4 && ! read; ++i)
        read = engine.readPhrase(view);
    expect(read && view.count > 0 && view.number == engine.phrasesStarted() && engine.singing(), "phrase published for the sonogram");
    run(8.0);
    expect(engine.phrasesStarted() == before + 1u, "autoplay off: no second phrase");

    std::printf("%s\n", failures == 0 ? "override check passed" : "override check FAILED");
    return failures == 0 ? 0 : 1;
}
} // namespace

// The quiz: who it asks, the answers, missed birds back sooner, and
// QuizVoice on the engine with a real bird.
int checkQuiz(const tipp::BirdData& bird)
{
    namespace P = tipp::params;
    using tipp::Quiz;
    int failures = 0;
    auto check = [&failures](bool pass, const char* what) {
        std::printf("%-4s %s\n", pass ? "ok" : "FAIL", what);
        if (! pass)
            ++failures;
    };

    // Six garden birds like the data: 0 and 1 are lookalikes, 0 and 4 too
    // (named from one side only). 5 has no call.
    std::vector<tipp::QuizBird> birds(6);
    for (auto& b : birds)
        b.hasCall = true;
    birds[0].lookalikes = { 1, 4 };
    birds[1].lookalikes = { 0 };
    birds[5].hasCall = false;

    check(Quiz::poolFor(birds, Quiz::kPairs) == std::vector<int>({ 0, 1, 4 }), "pairs: every bird with a lookalike, either way round");
    check(Quiz::poolFor(birds, Quiz::kGarden).size() == 6 && Quiz::poolFor(birds, Quiz::kAll).size() == 6, "garden and all");
    {
        Quiz q;
        check(Quiz::poolFor(birds, Quiz::kForest).empty() && ! q.start(birds, Quiz::kForest, Quiz::kAskSong, 1), "a set without birds does not start");
    }

    {
        // Always right: 10 questions, 4 different answers, never the same
        // bird twice in a row, lookalikes among the answers.
        Quiz q;
        bool ok = q.start(birds, Quiz::kPairs, Quiz::kAskSong, 3);
        bool answersOk = true, noRepeat = true, inPool = true, lookFirst = true, allRight = true;
        int prev = -1, n = 0;
        const auto pool = Quiz::poolFor(birds, Quiz::kPairs);
        while (ok)
        {
            const auto& qq = q.question();
            ++n;
            answersOk = answersOk && qq.count == Quiz::kAnswers && qq.correctSlot >= 0
                     && qq.answers[static_cast<std::size_t>(qq.correctSlot)] == qq.bird;
            for (int i = 0; i < qq.count; ++i)
                for (int j = i + 1; j < qq.count; ++j)
                    answersOk = answersOk && qq.answers[static_cast<std::size_t>(i)] != qq.answers[static_cast<std::size_t>(j)];
            noRepeat = noRepeat && qq.bird != prev;
            inPool = inPool && std::find(pool.begin(), pool.end(), qq.bird) != pool.end();
            for (int other : { 0, 1, 4 })
            {
                const bool alike = (qq.bird == 0 && other != 0) || (qq.bird != 0 && other == 0);
                if (alike && std::find(qq.answers.begin(), qq.answers.begin() + qq.count, other) == qq.answers.begin() + qq.count)
                    lookFirst = false;
            }
            prev = qq.bird;
            allRight = q.answer(qq.correctSlot) && allRight;
            ok = q.next();
        }
        check(allRight, "a right answer counts as right");
        check(n == Quiz::kQuestions && q.finished() && q.correct() == 10 && q.missed() == 0 && q.left() == 0, "10 questions, all right, none left");
        check(answersOk, "4 different answers, one of them right");
        check(noRepeat, "never the same bird twice in a row");
        check(inPool, "every question from the set");
        check(lookFirst, "lookalikes are among the wrong answers");
    }

    {
        // A miss: that bird is asked again after 2 other questions, and the
        // bird it was taken for right after it.
        Quiz q;
        q.start(birds, Quiz::kGarden, Quiz::kAskSong, 11);
        const int missedBird = q.question().bird;
        const int wrongSlot = (q.question().correctSlot + 1) % Quiz::kAnswers;
        const int takenFor = q.question().answers[static_cast<std::size_t>(wrongSlot)];
        check(! q.answer(wrongSlot) && q.missed() == 1 && q.left() == 9, "a wrong answer counts as missed");
        check(q.practise() == std::vector<int>({ missedBird, takenFor }), "practise names the missed bird and the one it was taken for");
        std::vector<int> asked { missedBird };
        while (q.next())
        {
            asked.push_back(q.question().bird);
            q.answer(q.question().correctSlot);
        }
        std::printf("     asked:");
        for (int b : asked)
            std::printf(" %d", b);
        std::printf("  (missed %d, taken for %d)\n", missedBird, takenFor);
        check(asked.size() == 10 && asked[3] == missedBird, "the missed bird comes back at question 4");
        check(asked[4] == takenFor, "the bird it was taken for comes at question 5");
        check(q.practise().empty(), "practise empties once both came back");
    }

    {
        // Same seed, same quiz. Ask for call and both.
        Quiz a, b;
        a.start(birds, Quiz::kAll, Quiz::kAskBoth, 42);
        b.start(birds, Quiz::kAll, Quiz::kAskBoth, 42);
        bool same = true, songs = false, calls = false, callOk = true;
        do
        {
            const auto& x = a.question();
            const auto& y = b.question();
            same = same && x.bird == y.bird && x.type == y.type && x.answers == y.answers;
            songs = songs || x.type == tipp::kSong;
            calls = calls || x.type == tipp::kCall;
            callOk = callOk && (x.type != tipp::kCall || birds[static_cast<std::size_t>(x.bird)].hasCall);
            a.answer(0);
            b.answer(0);
        } while (a.next() && b.next());
        check(same, "the same seed gives the same quiz");
        check(songs && calls && callOk, "BOTH asks songs and calls, calls only of birds that have one");
        Quiz c;
        c.start(birds, Quiz::kAll, Quiz::kAskCall, 5);
        bool callAsked = true;
        do
        {
            const auto& x = c.question();
            callAsked = callAsked && x.type == (birds[static_cast<std::size_t>(x.bird)].hasCall ? tipp::kCall : tipp::kSong);
            c.answer(0);
        } while (c.next());
        check(callAsked, "CALL asks the call, the song of a bird without one");
    }

    {
        // QuizVoice: a hand value from before is gone, one phrase only, and
        // half speed doubles its length.
        tipp::Engine engine;
        engine.prepare(kSampleRate);
        tipp::BirdData before = bird; // a different pointer, as in the app
        engine.setBird(&before);
        engine.setParam(P::indexOf(P::pb_play), 1.0f);
        std::vector<float> buf(32);
        auto run = [&](double s, tipp::QuizVoice* v, float* peak, bool* finite, double* singing) {
            const auto blocks = static_cast<long>(s * kSampleRate / 32.0 + 0.5);
            for (long i = 0; i < blocks; ++i)
            {
                if (v != nullptr && i % 50 == 0) // about 30 Hz, like the host timer
                    v->tick(engine);
                engine.process(buf.data(), buf.data(), 32);
                for (float x : buf)
                {
                    if (peak != nullptr) *peak = std::max(*peak, std::fabs(x));
                    if (finite != nullptr) *finite = *finite && std::isfinite(x);
                }
                if (singing != nullptr && engine.singing())
                    *singing += 32.0 / kSampleRate;
            }
        };
        engine.setParam(tipp::kPitch, bird.knobRange[tipp::kPitch].hi);
        engine.handDown(tipp::kPitch);
        run(0.5, nullptr, nullptr, nullptr, nullptr);
        engine.handUp(tipp::kPitch);
        engine.setParam(P::indexOf(P::ap_latch), 1.0f);
        run(0.1, nullptr, nullptr, nullptr, nullptr);

        int season = -1, time = -1;
        check(tipp::QuizVoice::sceneFor(bird, tipp::kSong, season, time), "the song sounds in some scene");
        std::printf("     scene: season %d, time %d\n", season, time);

        tipp::QuizVoice voice;
        const auto startCount = engine.phrasesStarted();
        voice.start(engine, &bird, tipp::kSong, false);
        float peak = 0.0f;
        bool finite = true;
        double sang1 = 0.0;
        run(15.0, &voice, &peak, &finite, &sang1);
        check(voice.started() && engine.birdInUse() == &bird, "the quiz bird is in the engine");
        check(engine.knobMode(tipp::kPitch) == tipp::Engine::KnobMode::Auto && ! engine.knobOverridden(tipp::kPitch), "a hand value from before does not carry into the quiz");
        check(engine.phrasesStarted() - startCount == 1u, "one phrase, then quiet (autoplay off)");
        check(finite && peak < kMaxPeak, "output finite and below the peak limit");

        voice.setHalfSpeed(engine, true);
        voice.playAgain(engine);
        double sang2 = 0.0;
        run(25.0, &voice, nullptr, nullptr, &sang2);
        check(engine.phrasesStarted() - startCount == 2u && sang2 > 0.0, "PLAY AGAIN sings one more phrase");
    }

    {
        // Half speed: the same phrase (fresh engines, same seed) sung at 1x
        // and at half speed. PLAY AGAIN draws a new phrase, so comparing it
        // with the first one fails for birds whose phrases differ in length.
        auto firstPhrase = [&](bool half) {
            tipp::Engine engine;
            engine.prepare(kSampleRate);
            std::vector<float> buf(32);
            tipp::QuizVoice voice;
            voice.start(engine, &bird, tipp::kSong, false);
            voice.setHalfSpeed(engine, half);
            double singing = 0.0;
            const auto blocks = static_cast<long>(150.0 * kSampleRate / 32.0 + 0.5); // room for a long song at half speed
            for (long i = 0; i < blocks; ++i)
            {
                if (i % 50 == 0)
                    voice.tick(engine);
                engine.process(buf.data(), buf.data(), 32);
                if (engine.singing())
                    singing += 32.0 / kSampleRate;
            }
            return singing;
        };
        const double sang1 = firstPhrase(false);
        const double sang2 = firstPhrase(true);
        std::printf("     phrase %.2f s at 1x, %.2f s at half speed\n", sang1, sang2);
        check(sang1 > 0.0 && sang2 > sang1 * 1.4, "half speed makes the phrase longer");
    }

    std::printf("%s\n", failures == 0 ? "quiz check passed" : "quiz check FAILED");
    return failures == 0 ? 0 : 1;
}

int checkChorus(const std::string& dataDir)
{
    using tipp::Chorus;
    int failures = 0;
    auto check = [&failures](bool pass, const char* what) {
        std::printf("%-4s %s\n", pass ? "ok" : "FAIL", what);
        if (! pass)
            ++failures;
    };
    ChorusSetup setup;
    if (! loadChorus(dataDir, "", setup))
        return 2;
    std::printf("     lanes:");
    for (std::size_t i = 0; i < setup.ids.size(); ++i)
        std::printf(" %s %+g min %g m,", setup.ids[i].c_str(), static_cast<double>(setup.entry[i]), static_cast<double>(setup.distance[i]));
    std::printf("\n");

    auto sangBetween = [](const Chorus& c, int lane, float from, float to) {
        for (int col = 0; col < Chorus::kColumns; ++col)
        {
            const float m = Chorus::kStartMin + static_cast<float>(col) / Chorus::kColumnsPerMin;
            if (m >= from && m < to && c.sang(lane, col))
                return true;
        }
        return false;
    };

    {
        Chorus c;
        setUpChorus(c, setup, 1u);
        c.setSpeed(Chorus::k60x);
        c.setPlaying(true);
        runChorus(c, 0.01);
        const float first = *std::min_element(setup.entry.begin(), setup.entry.end());
        check(std::fabs(c.minute() - (first - Chorus::kLeadMin)) < 0.02f, "Play at -90 skips the silence to just before the first entry");
        c.seek(-65.0f);
        runChorus(c, 30.0);
        check(std::fabs(c.minute() - (-35.0f)) < 0.05f, "60x: 30 s moves the clock from -65 to -35 min");
        c.setPlaying(false);
        runChorus(c, 2.0);
        check(std::fabs(c.minute() - (-35.0f)) < 0.05f, "stopped, the clock waits");
    }

    {
        // Entries: lane 0 (-70) sings after it, never before; lane 3 (-25) not yet.
        Chorus c;
        setUpChorus(c, setup, 1u);
        c.seek(-78.0f);
        c.setSpeed(Chorus::k60x);
        c.setPlaying(true);
        runChorus(c, 0.05); // skipped to -70.1, now about -70.05
        check(! c.laneStarted(0) && ! sangBetween(c, 0, -90.0f, 30.0f), "a lane is quiet before its entry minute");
        runChorus(c, 20.0); // to about -50
        check(c.laneStarted(0) && sangBetween(c, 0, setup.entry[0], 30.0f), "it starts singing after its entry minute");
        check(! sangBetween(c, 0, -90.0f, setup.entry[0]), "nothing recorded before the entry");
        check(c.laneStarted(1) && ! c.laneStarted(3), "lane 2 has started, lane 4 (-25) has not");
    }

    std::vector<float> fullL, fullR;
    {
        // The whole dawn at 60x: every lane sings, the clock stops at +30
        // and the output ends at zero. Peak with all 4 lanes.
        Chorus c;
        setUpChorus(c, setup, 1u);
        c.setSpeed(Chorus::k60x);
        c.setPlaying(true);
        runChorus(c, 121.0, &fullL, &fullR);
        bool all = true;
        for (int i = 0; i < Chorus::kLanes; ++i)
            all = all && sangBetween(c, i, setup.entry[static_cast<std::size_t>(i)], 30.0f);
        check(all, "all 4 lanes sing by sunrise");
        check(c.finished() && std::fabs(c.minute() - Chorus::kEndMin) < 1e-3f, "the clock stops at +30 min");
        const auto st = measure(fullL, fullR);
        std::printf("     whole dawn: peak %.3f, rms %.4f, step %.3f\n", static_cast<double>(st.peak), static_cast<double>(st.rms), static_cast<double>(st.maxStep));
        check(st.nonFinite == 0 && st.peak < kMaxPeak && st.maxStep <= kMaxStep, "4 lanes together: finite, below the peak and step limits");
        check(st.edgeEnd <= kEdgeLimit, "silent after the end");
    }

    {
        // Same seed, same chorus.
        Chorus c;
        setUpChorus(c, setup, 1u);
        c.setSpeed(Chorus::k60x);
        c.setPlaying(true);
        std::vector<float> l, r;
        runChorus(c, 40.0, &l, &r);
        check(std::equal(l.begin(), l.end(), fullL.begin()), "the same seed gives the same chorus");
    }

    {
        // Mute every lane: silent within the 30 ms fade. Solo: only that lane.
        Chorus c;
        setUpChorus(c, setup, 1u);
        c.seek(-20.0f);
        c.setSpeed(Chorus::kRealTime);
        c.setPlaying(true);
        runChorus(c, 4.0);
        for (int i = 0; i < Chorus::kLanes; ++i)
            c.setMute(i, true);
        std::vector<float> l, r;
        runChorus(c, 0.05, &l, &r);
        float tail = 0.0f;
        for (std::size_t i = static_cast<std::size_t>(0.035 * kSampleRate); i < l.size(); ++i)
            tail = std::max({ tail, std::fabs(l[i]), std::fabs(r[i]) });
        check(tail == 0.0f && ! c.laneAudible(0), "muted lanes are silent after the fade");
        for (int i = 0; i < Chorus::kLanes; ++i)
            c.setMute(i, false);
        c.setSolo(1, true);
        runChorus(c, 0.1);
        check(c.laneAudible(1) && ! c.laneAudible(0) && ! c.laneAudible(2) && ! c.laneAudible(3), "solo leaves only that lane audible");
        c.setMute(1, true);
        runChorus(c, 0.1);
        check(! c.laneAudible(1), "mute wins over solo on the same lane");
    }

    {
        // Out of season: a song switched off in winter keeps that lane quiet.
        tipp::BirdData winterless = *setup.birds[0];
        tipp::Override o;
        o.season = 3;
        o.hasActive = true;
        o.active = false;
        winterless.types[tipp::kSong].overrides.push_back(o);
        Chorus c;
        setUpChorus(c, setup, 1u);
        c.setLaneBird(0, &winterless);
        c.setSeason(3);
        c.seek(-60.0f);
        c.setSpeed(Chorus::k60x);
        c.setPlaying(true);
        runChorus(c, 10.0);
        check(! c.laneInSeason(0) && ! c.laneStarted(0) && ! sangBetween(c, 0, -90.0f, 30.0f) && c.laneStarted(1),
              "a bird that does not sing in the season stays quiet");
    }

    {
        // Loop: past +30 it starts over (and skips to the first entry) and clears what was sung.
        Chorus c;
        setUpChorus(c, setup, 1u);
        c.seek(25.0f);
        c.setSpeed(Chorus::kLoop);
        c.setPlaying(true);
        runChorus(c, 33.0); // 5.5 dawn minutes at 10x
        const float first = *std::min_element(setup.entry.begin(), setup.entry.end());
        check(! c.finished() && c.minute() < first + 2.0f && c.minute() > first - 1.0f, "LOOP starts over at the first entry");
        check(! sangBetween(c, 1, 0.0f, 30.0f), "and clears the record");
    }

    std::printf("%s\n", failures == 0 ? "chorus check passed" : "chorus check FAILED");
    return failures == 0 ? 0 : 1;
}

// One line per new phrase, the same format as web/scripts/check-seed.mjs.
void logPhrase(const tipp::Engine& engine, std::string& out)
{
    static tipp::Engine::PhraseView view;
    static std::uint32_t last = 0u;
    if (out.empty())
        last = 0u;
    if (! engine.readPhrase(view) || view.number == 0u || view.number == last)
        return;
    last = view.number;
    // Floats as their bits, so the comparison is exact.
    const auto bits = [](float f) { std::uint32_t u = 0u; std::memcpy(&u, &f, sizeof u); return static_cast<unsigned>(u); };
    char buf[64];
    std::snprintf(buf, sizeof buf, "%u len %08x:", view.number, bits(view.lengthMs));
    out += buf;
    for (int i = 0; i < view.count; ++i)
    {
        const auto& n = view.notes[static_cast<std::size_t>(i)];
        std::snprintf(buf, sizeof buf, " %d@%08x*%08x", n.syl, bits(n.startMs), bits(n.pitchMul));
        out += buf;
    }
    out += "\n";
}

int main(int argc, char** argv)
{
    double seconds = 30.0;
    std::string outPath, birdId, type = "song", dataDir, compareId, lanesCsv, chorusSpeed = "10x", phraseLogPath;
    float chorusStart = tipp::Chorus::kStartMin;
    std::uint32_t seed = 1u;
    std::vector<std::pair<std::string, std::string>> sets;
    bool overrideCheck = false, drawCheck = false, quizCheck = false, chorusCheck = false, chorusRender = false, drawSing = false, keep = false;

    for (int i = 1; i < argc; ++i)
    {
        const std::string a = argv[i];
        const bool hasValue = i + 1 < argc;

        if (a == "--list-params") { listParams(); return 0; }
        else if (a == "--bird" && hasValue)    birdId = argv[++i];
        else if (a == "--type" && hasValue)    type = argv[++i];
        else if (a == "--seconds" && hasValue) seconds = std::strtod(argv[++i], nullptr);
        else if (a == "--seed" && hasValue)    seed = static_cast<std::uint32_t>(std::strtoul(argv[++i], nullptr, 10));
        else if (a == "--data" && hasValue)    dataDir = argv[++i];
        else if (a == "--out" && hasValue)     outPath = argv[++i];
        else if (a == "--check-override")      overrideCheck = true;
        else if (a == "--check-draw")          drawCheck = true;
        else if (a == "--check-quiz")          quizCheck = true;
        else if (a == "--check-chorus")        chorusCheck = true;
        else if (a == "--chorus")              chorusRender = true;
        else if (a == "--lanes" && hasValue)   lanesCsv = argv[++i];
        else if (a == "--chorus-start" && hasValue) chorusStart = std::strtof(argv[++i], nullptr);
        else if (a == "--chorus-speed" && hasValue) chorusSpeed = argv[++i];
        else if (a == "--draw")                drawSing = true;
        else if (a == "--keep")                keep = true;
        else if (a == "--compare" && hasValue) compareId = argv[++i];
        else if (a == "--phrase-log" && hasValue) phraseLogPath = argv[++i];
        else if (a == "--set" && hasValue)
        {
            const std::string kv = argv[++i];
            const auto eq = kv.find('=');
            if (eq == std::string::npos) { usage(); return 2; }
            sets.emplace_back(kv.substr(0, eq), kv.substr(eq + 1));
        }
        else { usage(); return 2; }
    }

    const bool chorusMode = chorusCheck || chorusRender;
    if ((outPath.empty() && ! overrideCheck && ! drawCheck && ! quizCheck && ! chorusCheck) || (birdId.empty() && ! chorusMode) || seconds <= 0.5)
    {
        usage();
        return 2;
    }

    // Find data/ from the working directory unless given.
    if (dataDir.empty())
        for (const char* candidate : { "data", "../data", "../../data" })
        {
            std::string probe;
            if (readFile(std::string(candidate) + (chorusMode ? "/chorus.json" : "/birds/" + birdId + "/voice.json"), probe))
            {
                dataDir = candidate;
                break;
            }
        }
    if (dataDir.empty())
    {
        std::fprintf(stderr, "cannot find data/birds/%s. Run from the repo root or pass --data.\n", birdId.c_str());
        return 2;
    }

    if (chorusCheck)
        return checkChorus(dataDir);
    if (chorusRender)
    {
        const int speed = chorusSpeed == "real" ? tipp::Chorus::kRealTime : chorusSpeed == "60x" ? tipp::Chorus::k60x
                        : chorusSpeed == "loop" ? tipp::Chorus::kLoop : tipp::Chorus::k10x;
        ChorusSetup setup;
        if (! loadChorus(dataDir, lanesCsv, setup))
            return 2;
        tipp::Chorus chorus;
        setUpChorus(chorus, setup, seed);
        chorus.seek(chorusStart);
        chorus.setSpeed(speed);
        chorus.setPlaying(true);
        std::vector<float> left, right;
        runChorus(chorus, seconds - 0.1, &left, &right);
        chorus.setPlaying(false); // lanes fade out in 30 ms
        runChorus(chorus, 0.1, &left, &right);
        const float endMin = chorus.minute();

        std::vector<float> interleaved(left.size() * 2);
        for (std::size_t i = 0; i < left.size(); ++i)
        {
            interleaved[2 * i] = left[i];
            interleaved[2 * i + 1] = right[i];
        }
        if (! tipp::render::writeWavFloat(outPath.c_str(), interleaved, 2, kSampleRate))
        {
            std::fprintf(stderr, "could not write %s\n", outPath.c_str());
            return 2;
        }
        const auto st = measure(left, right);
        bool ok = true;
        auto report = [&ok](const char* name, bool pass, const char* fmt, double v, double lim) {
            std::printf("%-4s %-10s ", pass ? "ok" : "FAIL", name);
            std::printf(fmt, v, lim);
            std::printf("\n");
            ok = ok && pass;
        };
        int started = 0;
        for (int i = 0; i < tipp::Chorus::kLanes; ++i)
            started += chorus.laneStarted(i) ? 1 : 0;
        std::printf("%s: chorus %s, %+.1f to %+.1f min, seed %u, %d lanes started, rms %.4f\n", outPath.c_str(), chorusSpeed.c_str(),
                    static_cast<double>(chorusStart), static_cast<double>(endMin), seed, started, static_cast<double>(st.rms));
        report("finite", st.nonFinite == 0, "%.0f non-finite samples (limit %.0f)", static_cast<double>(st.nonFinite), 0.0);
        report("peak", st.peak < kMaxPeak, "%.4f (limit %.2f)", static_cast<double>(st.peak), static_cast<double>(kMaxPeak));
        report("step", st.maxStep <= kMaxStep, "%.4f largest sample step (limit %.2f)", static_cast<double>(st.maxStep), static_cast<double>(kMaxStep));
        report("start", st.edgeStart <= kEdgeLimit, "%.6f (limit %.3f)", static_cast<double>(st.edgeStart), static_cast<double>(kEdgeLimit));
        report("end", st.edgeEnd <= kEdgeLimit, "%.6f (limit %.3f)", static_cast<double>(st.edgeEnd), static_cast<double>(kEdgeLimit));
        report("sang", started > 0 && st.rms >= kMinRms, "rms %.4f (minimum %.3f)", static_cast<double>(st.rms), static_cast<double>(kMinRms));
        return ok ? 0 : 1;
    }

    const std::string birdDir = dataDir + "/birds/" + birdId + "/";
    std::string voiceText, songsText, error;
    if (! readFile(birdDir + "voice.json", voiceText) || ! readFile(birdDir + "songs.json", songsText))
    {
        std::fprintf(stderr, "cannot read %svoice.json or songs.json\n", birdDir.c_str());
        return 2;
    }

    tipp::BirdData bird;
    if (! tipp::parseBird(birdId, voiceText, songsText, bird, error))
    {
        std::fprintf(stderr, "%s: %s\n", birdId.c_str(), error.c_str());
        return 2;
    }

    if (overrideCheck)
        return checkOverride(bird);
    if (drawCheck)
        return checkDraw(bird);
    if (quizCheck)
        return checkQuiz(bird);

    tipp::BirdData other;
    if (! compareId.empty())
    {
        const std::string otherDir = dataDir + "/birds/" + compareId + "/";
        std::string v2, s2;
        if (! readFile(otherDir + "voice.json", v2) || ! readFile(otherDir + "songs.json", s2))
        {
            std::fprintf(stderr, "cannot read %svoice.json or songs.json\n", otherDir.c_str());
            return 2;
        }
        if (! tipp::parseBird(compareId, v2, s2, other, error))
        {
            std::fprintf(stderr, "%s: %s\n", compareId.c_str(), error.c_str());
            return 2;
        }
    }

    namespace P = tipp::params;
    tipp::Engine engine;
    engine.setSeed(seed);

    float typeValue = 0.0f;
    if (! parseValue(*P::find(P::sc_type), type, typeValue))
    {
        std::fprintf(stderr, "unknown type %s\n", type.c_str());
        return 2;
    }
    if (! bird.types[static_cast<std::size_t>(typeValue)].present)
    {
        std::fprintf(stderr, "%s has no %s in its data\n", birdId.c_str(), type.c_str());
        return 2;
    }
    engine.setParam(P::indexOf(P::sc_type), typeValue);

    for (const auto& [id, text] : sets)
    {
        const P::Info* info = P::find(id.c_str());
        float v = 0.0f;
        if (info == nullptr || ! parseValue(*info, text, v))
        {
            std::fprintf(stderr, "bad --set %s=%s\n", id.c_str(), text.c_str());
            return 2;
        }
        const int index = P::indexOf(info->id);
        if (info->kind == P::Kind::Knob && index < tipp::kNumKnobs)
            engine.handDown(index); // held for the whole render
        engine.setParam(index, v);
    }

    engine.prepare(kSampleRate);
    engine.setBird(&bird);
    engine.setParam(P::indexOf(P::pb_play), 1.0f);

    if (drawSing || keep)
        engine.setDrawn(demoLine());
    if (drawSing)
        engine.setParam(P::indexOf(P::pb_draw), 1.0f);

    engine.keepDrawn(keep);
    // Play stops 100 ms before the end; the engine fades out in 30 ms.
    auto frames = static_cast<std::size_t>(seconds * kSampleRate);
    const auto stopAt = frames - static_cast<std::size_t>(0.1 * kSampleRate);

    std::vector<float> left(frames), right(frames);
    std::string phraseLog;

    // COMPARE is ticked once per block, as an interface timer would.
    tipp::Compare compare;
    const bool comparing = ! compareId.empty();
    bool sawFirst = false, sawSecond = false;
    std::size_t doneAt = 0;
    if (comparing)
        compare.start(engine, &bird, &other, { true, false, tipp::kSong }, 0.0);

    for (std::size_t pos = 0; pos < frames; pos += kBlock)
    {
        if (comparing)
        {
            compare.tick(engine, static_cast<double>(pos) / kSampleRate);
            sawFirst = sawFirst || compare.stage() == 1;
            sawSecond = sawSecond || compare.stage() == 2;
            if (! compare.running() && doneAt == 0)
                doneAt = pos;
            // Restore turned play off: keep 100 ms for the fade, then end the file.
            if (doneAt > 0 && pos >= doneAt + static_cast<std::size_t>(0.1 * kSampleRate))
            {
                frames = pos;
                break;
            }
        }
        else if (pos >= stopAt)
            engine.setParam(P::indexOf(P::pb_play), 0.0f);
        else if (drawSing && ! engine.singing() && pos % kSampleRate < kBlock)
            engine.trigger(P::indexOf(P::ap_sing_once)); // about once a second while idle
        const int n = static_cast<int>(std::min<std::size_t>(kBlock, frames - pos));
        engine.process(left.data() + pos, right.data() + pos, n);
        if (! phraseLogPath.empty())
            logPhrase(engine, phraseLog);
    }
    if (! phraseLogPath.empty())
    {
        std::ofstream f(phraseLogPath);
        f << phraseLog;
        if (! f)
        {
            std::fprintf(stderr, "could not write %s\n", phraseLogPath.c_str());
            return 2;
        }
    }
    if (comparing && compare.running())
    {
        compare.cancel(engine);
        std::fprintf(stderr, "compare did not finish in %.1f s\n", seconds);
    }
    left.resize(frames);
    right.resize(frames);

    // Checks.
    std::size_t nonFinite = 0;
    float peak = 0.0f, maxStep = 0.0f;
    double sumSq = 0.0;
    float prevL = 0.0f, prevR = 0.0f;

    for (std::size_t i = 0; i < frames; ++i)
    {
        const float l = left[i], r = right[i];
        if (! std::isfinite(l) || ! std::isfinite(r)) { ++nonFinite; continue; }
        peak = std::max({ peak, std::fabs(l), std::fabs(r) });
        maxStep = std::max({ maxStep, std::fabs(l - prevL), std::fabs(r - prevR) });
        sumSq += static_cast<double>(l) * static_cast<double>(l);
        prevL = l;
        prevR = r;
    }

    const float rms = static_cast<float>(std::sqrt(sumSq / static_cast<double>(frames)));
    const float edgeStart = std::max(std::fabs(left.front()), std::fabs(right.front()));
    const float edgeEnd = std::max(std::fabs(left.back()), std::fabs(right.back()));

    std::vector<float> interleaved(frames * 2);
    for (std::size_t i = 0; i < frames; ++i)
    {
        interleaved[2 * i] = left[i];
        interleaved[2 * i + 1] = right[i];
    }

    if (! tipp::render::writeWavFloat(outPath.c_str(), interleaved, 2, kSampleRate))
    {
        std::fprintf(stderr, "could not write %s\n", outPath.c_str());
        return 2;
    }

    bool ok = true;
    const auto report = [&ok](const char* name, bool pass, const char* fmt, double v, double limit)
    {
        std::printf("%-4s %-10s ", pass ? "ok" : "FAIL", name);
        std::printf(fmt, v, limit);
        std::printf("\n");
        ok = ok && pass;
    };

    std::printf("%s: %s %s, %.2f s, seed %u, %u phrases, rms %.4f\n",
                outPath.c_str(), birdId.c_str(), type.c_str(), static_cast<double>(frames) / kSampleRate, engine.seed(),
                engine.phrasesStarted(), static_cast<double>(rms));
    report("finite", nonFinite == 0, "%.0f non-finite samples (limit %.0f)", static_cast<double>(nonFinite), 0.0);
    report("peak", peak < kMaxPeak, "%.4f (limit %.2f)", static_cast<double>(peak), static_cast<double>(kMaxPeak));
    report("step", maxStep <= kMaxStep, "%.4f largest sample step (limit %.2f)", static_cast<double>(maxStep), static_cast<double>(kMaxStep));
    report("start", edgeStart <= kEdgeLimit, "%.6f (limit %.3f)", static_cast<double>(edgeStart), static_cast<double>(kEdgeLimit));
    report("end", edgeEnd <= kEdgeLimit, "%.6f (limit %.3f)", static_cast<double>(edgeEnd), static_cast<double>(kEdgeLimit));
    report("sang", engine.phrasesStarted() > 0 && rms >= kMinRms, "rms %.4f (minimum %.3f)", static_cast<double>(rms), static_cast<double>(kMinRms));
    if (drawSing || keep)
        report("drawn", engine.drawnSung() > 0u, "%.0f drawn phrases (minimum %.0f)", static_cast<double>(engine.drawnSung()), 1.0);
    if (comparing)
    {
        report("compare", sawFirst && sawSecond && doneAt > 0 && engine.phrasesStarted() == 2u,
               "%.0f phrases, both birds, finished (need %.0f)", static_cast<double>(engine.phrasesStarted()), 2.0);
        report("restored", engine.birdInUse() == &bird, "%.0f (first bird back: %.0f)", engine.birdInUse() == &bird ? 1.0 : 0.0, 1.0);
    }

    return ok ? 0 : 1;
}
