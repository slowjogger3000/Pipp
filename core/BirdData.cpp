#include "BirdData.h"

#include "Json.h"
#include "Params.h"

#include <algorithm>
#include <cmath>
#include <cstring>

namespace tipp
{
namespace
{
using json::Value;

int knobIndex(const std::string& id)
{
    for (int i = 0; i < kNumKnobs; ++i)
        if (id == params::all[static_cast<std::size_t>(i)].id)
            return i;
    return -1;
}

int optionIndex(const char* paramId, const std::string& option)
{
    const auto* info = params::find(paramId);
    if (info == nullptr || info->options == nullptr)
        return -1;
    int index = 0;
    const char* p = info->options;
    while (*p != '\0')
    {
        const char* bar = std::strchr(p, '|');
        const std::size_t len = bar != nullptr ? static_cast<std::size_t>(bar - p) : std::strlen(p);
        if (option.size() == len && option.compare(0, len, p, len) == 0)
            return index;
        if (bar == nullptr)
            break;
        p = bar + 1;
        ++index;
    }
    return -1;
}

float num(const Value* v, float fallback)
{
    return v != nullptr && v->isNumber() ? static_cast<float>(v->number) : fallback;
}

bool readRange(const Value* v, Range& r)
{
    if (v == nullptr)
        return true;
    if (! v->isArray() || v->items.size() != 2 || ! v->items[0].isNumber() || ! v->items[1].isNumber())
        return false;
    r.lo = static_cast<float>(v->items[0].number);
    r.hi = static_cast<float>(v->items[1].number);
    return r.lo <= r.hi;
}

bool readContour(const Value* v, std::vector<ContourPoint>& out)
{
    if (v == nullptr || ! v->isArray() || v->items.empty())
        return false;
    for (const auto& p : v->items)
    {
        if (! p.isArray() || p.items.size() != 2 || ! p.items[0].isNumber() || ! p.items[1].isNumber())
            return false;
        out.push_back({ static_cast<float>(p.items[0].number), static_cast<float>(p.items[1].number) });
    }
    for (std::size_t i = 1; i < out.size(); ++i)
        if (out[i].t < out[i - 1].t)
            return false;
    return true;
}

bool fail(std::string& error, const std::string& m)
{
    error = m;
    return false;
}

bool parseSyllables(const Value& root, BirdData& bird, std::string& error)
{
    const Value* syl = root.get("syllables");
    if (syl == nullptr || ! syl->isObject())
        return fail(error, "songs.json: no syllables object");

    for (std::size_t i = 0; i < syl->keys.size(); ++i)
    {
        const Value& v = syl->items[i];
        Syllable s;
        s.id = syl->keys[i];
        const std::string where = "syllable " + s.id + ": ";
        s.durMs = num(v.get("dur_ms"), 0.0f);
        if (s.durMs < 5.0f || s.durMs > 5000.0f)
            return fail(error, where + "dur_ms must be 5 to 5000");
        if (! readContour(v.get("pitch"), s.pitch))
            return fail(error, where + "bad pitch contour");
        if (! readContour(v.get("amp"), s.amp))
            return fail(error, where + "bad amp contour");
        for (const auto& p : s.pitch)
            if (p.v < 50.0f || p.v > 16000.0f)
                return fail(error, where + "pitch must be 50 to 16000 Hz");
        if (s.amp.front().v != 0.0f || s.amp.back().v != 0.0f)
            return fail(error, where + "amp must start and end at 0");
        s.gain = num(v.get("gain"), 1.0f);
        s.breath = num(v.get("breath"), 0.0f);
        s.tension = num(v.get("tension"), 0.0f);
        s.rough = num(v.get("rough"), 0.0f);
        if (const Value* t = v.get("trill"))
        {
            s.trillHz = num(t->get("hz"), 0.0f);
            s.trillDepthSt = num(t->get("depth_st"), 0.0f);
            s.trillAm = num(t->get("am"), 0.0f);
        }
        bird.syllables.push_back(std::move(s));
    }
    return true;
}

int syllableIndex(const BirdData& bird, const std::string& id)
{
    for (std::size_t i = 0; i < bird.syllables.size(); ++i)
        if (bird.syllables[i].id == id)
            return static_cast<int>(i);
    return -1;
}

bool parseType(const Value& v, const BirdData& bird, SongType& t, const std::string& name, std::string& error)
{
    const std::string where = "type " + name + ": ";
    t.present = true;

    if (! readRange(v.get("pause_s"), t.pauseS))   return fail(error, where + "bad pause_s");
    if (! readRange(v.get("length_s"), t.lengthS)) return fail(error, where + "bad length_s");
    t.transposeSt = num(v.get("transpose_st"), 0.0f);
    if (const Value* a = v.get("avoid_repeat"); a != nullptr && a->isBool())
        t.avoidRepeat = a->boolean;
    Range bout { 1.0f, 1.0f };
    if (! readRange(v.get("bout"), bout) || bout.lo < 1.0f || bout.hi > 64.0f)
        return fail(error, where + "bad bout");
    t.boutMin = static_cast<int>(std::lround(bout.lo));
    t.boutMax = std::max(t.boutMin, static_cast<int>(std::lround(bout.hi)));

    const Value* phrases = v.get("phrases");
    if (phrases == nullptr || ! phrases->isArray() || phrases->items.empty())
        return fail(error, where + "no phrases");

    for (const auto& pv : phrases->items)
    {
        PhraseTemplate pt;
        pt.weight = static_cast<std::uint32_t>(std::max(1.0f, std::round(num(pv.get("weight"), 1.0f))));
        const Value* sections = pv.get("sections");
        if (sections == nullptr || ! sections->isArray() || sections->items.empty())
            return fail(error, where + "phrase without sections");

        for (const auto& sv : sections->items)
        {
            Section s;
            const Value* pool = sv.get("pool");
            if (pool == nullptr || ! pool->isArray() || pool->items.empty())
                return fail(error, where + "section without pool");
            for (const auto& id : pool->items)
            {
                const int idx = id.isString() ? syllableIndex(bird, id.text) : -1;
                if (idx < 0)
                    return fail(error, where + "unknown syllable " + id.text);
                s.pool.push_back(idx);
            }
            Range count { 1.0f, 1.0f };
            if (! readRange(sv.get("count"), count))
                return fail(error, where + "bad count");
            s.minCount = static_cast<int>(count.lo);
            s.maxCount = std::max(s.minCount, static_cast<int>(count.hi));
            s.share = num(sv.get("share"), 1.0f);
            s.chanceMilli = static_cast<std::uint32_t>(std::clamp(num(sv.get("chance"), 1.0f), 0.0f, 1.0f) * 1000.0f + 0.5f);
            if (! readRange(sv.get("gap_ms"), s.gapMs))           return fail(error, where + "bad gap_ms");
            if (! readRange(sv.get("lead_gap_ms"), s.leadGapMs)) return fail(error, where + "bad lead_gap_ms");
            if (s.gapMs.lo < 0.0f || s.leadGapMs.lo < 0.0f)
                return fail(error, where + "gaps cannot be negative");
            if (const Value* r = sv.get("no_adjacent_repeat"); r != nullptr && r->isBool())
                s.noAdjacentRepeat = r->boolean;
            pt.sections.push_back(std::move(s));
        }
        t.totalWeight += pt.weight;
        t.templates.push_back(std::move(pt));
    }

    if (const Value* autoObj = v.get("auto"); autoObj != nullptr && autoObj->isObject())
    {
        for (std::size_t i = 0; i < autoObj->keys.size(); ++i)
        {
            const int k = knobIndex(autoObj->keys[i]);
            if (k < 0)
                return fail(error, where + "auto: unknown knob " + autoObj->keys[i]);
            if (! readRange(&autoObj->items[i], t.autoRange[static_cast<std::size_t>(k)]))
                return fail(error, where + "auto: bad range for " + autoObj->keys[i]);
            t.hasAuto[static_cast<std::size_t>(k)] = true;
        }
    }

    if (const Value* ov = v.get("overrides"); ov != nullptr && ov->isArray())
    {
        for (const auto& o : ov->items)
        {
            Override r;
            const Value* when = o.get("when");
            if (when == nullptr || ! when->isObject())
                return fail(error, where + "override without when");
            for (std::size_t i = 0; i < when->keys.size(); ++i)
            {
                const std::string& key = when->keys[i];
                const std::string& val = when->items[i].text;
                int* slot = key == "season" ? &r.season : key == "time" ? &r.time
                          : key == "sex" ? &r.sex : key == "age" ? &r.age : nullptr;
                const char* pid = key == "season" ? params::sc_season : key == "time" ? params::sc_time
                                : key == "sex" ? params::sc_sex : params::sc_age;
                if (slot == nullptr)
                    return fail(error, where + "override: unknown key " + key);
                *slot = optionIndex(pid, val);
                if (*slot < 0)
                    return fail(error, where + "override: unknown value " + val);
            }
            r.hasPause = o.get("pause_s") != nullptr;
            r.hasLength = o.get("length_s") != nullptr;
            if (! readRange(o.get("pause_s"), r.pauseS))   return fail(error, where + "override: bad pause_s");
            if (! readRange(o.get("length_s"), r.lengthS)) return fail(error, where + "override: bad length_s");
            if (const Value* a = o.get("active"); a != nullptr && a->isBool())
            {
                r.hasActive = true;
                r.active = a->boolean;
            }
            t.overrides.push_back(r);
        }
    }
    return true;
}
} // namespace

SceneRules rulesFor(const SongType& t, int season, int time, int sex, int age) noexcept
{
    SceneRules r;
    r.active = t.present;
    r.pauseS = t.pauseS;
    r.lengthS = t.lengthS;
    for (const auto& o : t.overrides)
    {
        if ((o.season >= 0 && o.season != season) || (o.time >= 0 && o.time != time)
            || (o.sex >= 0 && o.sex != sex) || (o.age >= 0 && o.age != age))
            continue;
        if (o.hasPause)  r.pauseS = o.pauseS;
        if (o.hasLength) r.lengthS = o.lengthS;
        if (o.hasActive) r.active = r.active && o.active;
    }
    return r;
}

bool parseBird(const std::string& id, const std::string& voiceJson, const std::string& songsJson,
               BirdData& out, std::string& error)
{
    out = BirdData {};
    out.id = id;

    Value voice, songs;
    if (! json::parse(voiceJson, voice, error))
        return fail(error, "voice.json: " + error);
    if (! json::parse(songsJson, songs, error))
        return fail(error, "songs.json: " + error);

    // Defaults from Params.h, then the bird's own values.
    for (int k = 0; k < kNumKnobs; ++k)
    {
        const auto& info = params::all[static_cast<std::size_t>(k)];
        out.base[static_cast<std::size_t>(k)] = static_cast<float>(info.def);
        out.knobRange[static_cast<std::size_t>(k)] = { static_cast<float>(info.min), static_cast<float>(info.max) };
    }
    out.pitchRefHz = num(voice.get("pitch_ref_hz"), 2000.0f);

    if (const Value* base = voice.get("base"); base != nullptr && base->isObject())
        for (std::size_t i = 0; i < base->keys.size(); ++i)
        {
            const int k = knobIndex(base->keys[i]);
            if (k < 0 || ! base->items[i].isNumber())
                return fail(error, "voice.json: bad base entry " + base->keys[i]);
            out.base[static_cast<std::size_t>(k)] = static_cast<float>(base->items[i].number);
        }

    if (const Value* ranges = voice.get("ranges"); ranges != nullptr && ranges->isObject())
        for (std::size_t i = 0; i < ranges->keys.size(); ++i)
        {
            const int k = knobIndex(ranges->keys[i]);
            if (k < 0 || ! readRange(&ranges->items[i], out.knobRange[static_cast<std::size_t>(k)]))
                return fail(error, "voice.json: bad range entry " + ranges->keys[i]);
        }

    if (! parseSyllables(songs, out, error))
        return false;

    const Value* types = songs.get("types");
    if (types == nullptr || ! types->isObject())
        return fail(error, "songs.json: no types object");
    for (std::size_t i = 0; i < types->keys.size(); ++i)
    {
        const int t = optionIndex(params::sc_type, types->keys[i]);
        if (t < 0)
            return fail(error, "songs.json: unknown song type " + types->keys[i]);
        if (! parseType(types->items[i], out, out.types[static_cast<std::size_t>(t)], types->keys[i], error))
            return false;
    }
    return true;
}
float contourAt(const std::vector<ContourPoint>& c, float t) noexcept
{
    if (t <= c.front().t)
        return c.front().v;
    for (std::size_t i = 1; i < c.size(); ++i)
        if (t <= c[i].t)
        {
            const float span = c[i].t - c[i - 1].t;
            const float u = span > 0.0f ? (t - c[i - 1].t) / span : 1.0f;
            return c[i - 1].v + (c[i].v - c[i - 1].v) * u;
        }
    return c.back().v;
}

float contourPitchAt(const std::vector<ContourPoint>& c, float t) noexcept
{
    if (t <= c.front().t)
        return c.front().v;
    for (std::size_t i = 1; i < c.size(); ++i)
        if (t <= c[i].t)
        {
            const float span = c[i].t - c[i - 1].t;
            const float u = span > 0.0f ? (t - c[i - 1].t) / span : 1.0f;
            return c[i - 1].v * std::exp2(u * std::log2(c[i].v / c[i - 1].v));
        }
    return c.back().v;
}

} // namespace tipp
