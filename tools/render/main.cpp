// tipp-render: offline render and checks on core/.
//
//   tipp-render --tone 440 --seconds 5 --out out/tone.wav
//   tipp-render --list-params
//
// Exit codes: 0 all checks pass, 1 a check failed, 2 bad arguments or I/O.
// --bird and --type are accepted from M1, when bird data exists.

#include "Engine.h"
#include "Params.h"
#include "WavWriter.h"

#include <algorithm>
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <string>
#include <vector>

namespace
{
constexpr std::uint32_t kSampleRate = 48000;
constexpr int kBlock = 512;

// Render check limits. See CLAUDE.md, "Verification".
constexpr float kMaxPeak = 0.7f;
constexpr float kMaxStep = 0.5f;
constexpr float kEdgeLimit = 0.001f;

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
        "usage: tipp-render --tone <hz> --seconds <s> --out <file.wav>\n"
        "       tipp-render --list-params\n");
}
} // namespace

int main(int argc, char** argv)
{
    float toneHz = 440.0f;
    double seconds = 5.0;
    std::string outPath;

    for (int i = 1; i < argc; ++i)
    {
        const std::string a = argv[i];
        const bool hasValue = i + 1 < argc;

        if (a == "--list-params") { listParams(); return 0; }
        else if (a == "--tone" && hasValue)    toneHz = std::strtof(argv[++i], nullptr);
        else if (a == "--seconds" && hasValue) seconds = std::strtod(argv[++i], nullptr);
        else if (a == "--out" && hasValue)     outPath = argv[++i];
        else if ((a == "--bird" || a == "--type") && hasValue)
        {
            std::fprintf(stderr, "%s: bird data arrives in M1. Use --tone for now.\n", a.c_str());
            return 2;
        }
        else { usage(); return 2; }
    }

    if (outPath.empty() || seconds <= 0.1 || toneHz <= 0.0f || toneHz >= 20000.0f)
    {
        usage();
        return 2;
    }

    // Render. The gate closes 50 ms before the end so the release finishes.
    tipp::Engine engine;
    engine.prepare(kSampleRate);
    engine.setToneFrequency(toneHz);
    engine.setLevel(0.5f);
    engine.setGate(true);

    const auto frames = static_cast<std::size_t>(seconds * kSampleRate);
    const auto gateOffAt = frames - static_cast<std::size_t>(0.05 * kSampleRate);

    std::vector<float> left(frames), right(frames);

    for (std::size_t pos = 0; pos < frames; pos += kBlock)
    {
        if (pos >= gateOffAt)
            engine.setGate(false);
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

    std::printf("%s: %.2f s, %u Hz, tone %.1f Hz, rms %.4f\n",
                outPath.c_str(), seconds, kSampleRate, static_cast<double>(toneHz),
                static_cast<double>(rms));
    report("finite", nonFinite == 0, "%.0f non-finite samples (limit %.0f)", static_cast<double>(nonFinite), 0.0);
    report("peak", peak < kMaxPeak, "%.4f (limit %.2f)", static_cast<double>(peak), static_cast<double>(kMaxPeak));
    report("step", maxStep <= kMaxStep, "%.4f largest sample step (limit %.2f)", static_cast<double>(maxStep), static_cast<double>(kMaxStep));
    report("start", edgeStart <= kEdgeLimit, "%.6f (limit %.3f)", static_cast<double>(edgeStart), static_cast<double>(kEdgeLimit));
    report("end", edgeEnd <= kEdgeLimit, "%.6f (limit %.3f)", static_cast<double>(edgeEnd), static_cast<double>(kEdgeLimit));

    return ok ? 0 : 1;
}
