// tipp-render: offline render and checks on core/.
//
//   tipp-render --bird svarttrost --type song --seconds 30 --out out/svarttrost.wav
//   tipp-render --bird svarttrost --type call --seed 7 --set su_distance=60 --out out/x.wav
//   tipp-render --list-params
//   tipp-render --bird svarttrost --check-override
//   tipp-render --bird blameis --compare kjottmeis --out out/compare.wav
//
// --compare runs the field guide's COMPARE: one phrase of --bird, a gap,
// one phrase of the other bird, then stop. The file ends when it is done.
//
// --set id=value holds a knob by hand for the whole render, or sets any
// other parameter. Choices take their option id: --set sc_time=dusk.
//
// Exit codes: 0 all checks pass, 1 a check failed, 2 bad arguments or I/O.

#include "BirdData.h"
#include "Compare.h"
#include "Engine.h"
#include "Params.h"
#include "WavWriter.h"

#include <algorithm>
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <fstream>
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
        "       tipp-render --bird <id> --compare <other id> [--seconds <max s>] --out <file.wav>\n");
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

int main(int argc, char** argv)
{
    double seconds = 30.0;
    std::string outPath, birdId, type = "song", dataDir, compareId;
    std::uint32_t seed = 1u;
    std::vector<std::pair<std::string, std::string>> sets;
    bool overrideCheck = false;

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
        else if (a == "--compare" && hasValue) compareId = argv[++i];
        else if (a == "--set" && hasValue)
        {
            const std::string kv = argv[++i];
            const auto eq = kv.find('=');
            if (eq == std::string::npos) { usage(); return 2; }
            sets.emplace_back(kv.substr(0, eq), kv.substr(eq + 1));
        }
        else { usage(); return 2; }
    }

    if ((outPath.empty() && ! overrideCheck) || birdId.empty() || seconds <= 0.5)
    {
        usage();
        return 2;
    }

    // Find data/ from the working directory unless given.
    if (dataDir.empty())
        for (const char* candidate : { "data", "../data", "../../data" })
        {
            std::string probe;
            if (readFile(std::string(candidate) + "/birds/" + birdId + "/voice.json", probe))
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

    // Play stops 100 ms before the end; the engine fades out in 30 ms.
    auto frames = static_cast<std::size_t>(seconds * kSampleRate);
    const auto stopAt = frames - static_cast<std::size_t>(0.1 * kSampleRate);

    std::vector<float> left(frames), right(frames);

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
        const int n = static_cast<int>(std::min<std::size_t>(kBlock, frames - pos));
        engine.process(left.data() + pos, right.data() + pos, n);
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
    if (comparing)
    {
        report("compare", sawFirst && sawSecond && doneAt > 0 && engine.phrasesStarted() == 2u,
               "%.0f phrases, both birds, finished (need %.0f)", static_cast<double>(engine.phrasesStarted()), 2.0);
        report("restored", engine.birdInUse() == &bird, "%.0f (first bird back: %.0f)", engine.birdInUse() == &bird ? 1.0 : 0.0, 1.0);
    }

    return ok ? 0 : 1;
}
