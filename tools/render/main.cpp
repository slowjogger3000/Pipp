// tipp-render: offline render and checks on core/.
//
//   tipp-render --bird svarttrost --type song --seconds 30 --out out/svarttrost.wav
//   tipp-render --bird svarttrost --type call --seed 7 --set su_distance=60 --out out/x.wav
//   tipp-render --list-params
//
// --set id=value holds a knob by hand for the whole render, or sets any
// other parameter. Choices take their option id: --set sc_time=dusk.
//
// Exit codes: 0 all checks pass, 1 a check failed, 2 bad arguments or I/O.

#include "BirdData.h"
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
        "       tipp-render --list-params\n");
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
} // namespace

int main(int argc, char** argv)
{
    double seconds = 30.0;
    std::string outPath, birdId, type = "song", dataDir;
    std::uint32_t seed = 1u;
    std::vector<std::pair<std::string, std::string>> sets;

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
        else if (a == "--set" && hasValue)
        {
            const std::string kv = argv[++i];
            const auto eq = kv.find('=');
            if (eq == std::string::npos) { usage(); return 2; }
            sets.emplace_back(kv.substr(0, eq), kv.substr(eq + 1));
        }
        else { usage(); return 2; }
    }

    if (outPath.empty() || birdId.empty() || seconds <= 0.5)
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
    const auto frames = static_cast<std::size_t>(seconds * kSampleRate);
    const auto stopAt = frames - static_cast<std::size_t>(0.1 * kSampleRate);

    std::vector<float> left(frames), right(frames);

    for (std::size_t pos = 0; pos < frames; pos += kBlock)
    {
        if (pos >= stopAt)
            engine.setParam(P::indexOf(P::pb_play), 0.0f);
        const int n = static_cast<int>(std::min<std::size_t>(kBlock, frames - pos));
        engine.process(left.data() + pos, right.data() + pos, n);
    }

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
                outPath.c_str(), birdId.c_str(), type.c_str(), seconds, engine.seed(),
                engine.phrasesStarted(), static_cast<double>(rms));
    report("finite", nonFinite == 0, "%.0f non-finite samples (limit %.0f)", static_cast<double>(nonFinite), 0.0);
    report("peak", peak < kMaxPeak, "%.4f (limit %.2f)", static_cast<double>(peak), static_cast<double>(kMaxPeak));
    report("step", maxStep <= kMaxStep, "%.4f largest sample step (limit %.2f)", static_cast<double>(maxStep), static_cast<double>(kMaxStep));
    report("start", edgeStart <= kEdgeLimit, "%.6f (limit %.3f)", static_cast<double>(edgeStart), static_cast<double>(kEdgeLimit));
    report("end", edgeEnd <= kEdgeLimit, "%.6f (limit %.3f)", static_cast<double>(edgeEnd), static_cast<double>(kEdgeLimit));
    report("sang", engine.phrasesStarted() > 0 && rms >= kMinRms, "rms %.4f (minimum %.3f)", static_cast<double>(rms), static_cast<double>(kMinRms));

    return ok ? 0 : 1;
}
