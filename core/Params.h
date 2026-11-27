#pragma once

// Every parameter ID in Pipp. The same strings are used by JUCE, the
// worklet messages and saved state. Source: prd.md, "Knobs" and
// "IDs for the other controls". Add an ID to prd.md first, then here.
//
// Knob ranges are the starting points from prd.md. Defaults are starting
// values chosen in M0. Both get tuned by ear in M1.

#include <array>
#include <cstddef>
#include <cstring>

namespace pipp::params
{
// Voice
inline constexpr const char* vo_pitch   = "vo_pitch";
inline constexpr const char* vo_breath  = "vo_breath";
inline constexpr const char* vo_tension = "vo_tension";
inline constexpr const char* vo_trill   = "vo_trill";
inline constexpr const char* vo_rough   = "vo_rough";

// Phrasing
inline constexpr const char* ph_tempo     = "ph_tempo";
inline constexpr const char* ph_pause     = "ph_pause";
inline constexpr const char* ph_length    = "ph_length";
inline constexpr const char* ph_variation = "ph_variation";

// Surroundings
inline constexpr const char* su_distance = "su_distance";
inline constexpr const char* su_wind     = "su_wind";
inline constexpr const char* su_space    = "su_space";

// Scene
inline constexpr const char* sc_bird    = "sc_bird";
inline constexpr const char* sc_sex     = "sc_sex";
inline constexpr const char* sc_age     = "sc_age";
inline constexpr const char* sc_season  = "sc_season";
inline constexpr const char* sc_time    = "sc_time";
inline constexpr const char* sc_type    = "sc_type";
inline constexpr const char* sc_place   = "sc_place";
inline constexpr const char* sc_dialect = "sc_dialect";
inline constexpr const char* sc_mimics  = "sc_mimics";

// Autoplay
inline constexpr const char* ap_on         = "ap_on";
inline constexpr const char* ap_hold       = "ap_hold";
inline constexpr const char* ap_latch      = "ap_latch";
inline constexpr const char* ap_seed       = "ap_seed";
inline constexpr const char* ap_return_all = "ap_return_all";
inline constexpr const char* ap_sing_once  = "ap_sing_once";
inline constexpr const char* ap_reroll     = "ap_reroll";

// Playback
inline constexpr const char* pb_play  = "pb_play";
inline constexpr const char* pb_speed = "pb_speed";
inline constexpr const char* pb_shift = "pb_shift";
inline constexpr const char* pb_draw  = "pb_draw";

enum class Kind
{
    Knob,    // continuous, min to max
    Choice,  // index into a fixed option list
    Toggle,  // 0 or 1
    Integer, // whole number, min to max
    Text,    // a string id, such as a bird id or a dialect id
    Trigger  // an event, never stored or saved
};

struct Info
{
    const char* id;
    Kind kind;
    double min;
    double max;
    double def;
    const char* unit;     // display unit, "" for none
    const char* options;  // Choice only: option ids separated by '|'
};

// Option ids are stable keys for saved state and data files, not labels.
// Labels come from data/strings/.
inline constexpr std::array<Info, 32> all {{
    // id             kind           min    max          def    unit   options
    { vo_pitch,      Kind::Knob,     0.5,   2.0,         1.0,   "x",   nullptr }, // shown in kHz
    { vo_breath,     Kind::Knob,     0.0,   100.0,       20.0,  "%",   nullptr },
    { vo_tension,    Kind::Knob,     0.0,   100.0,       50.0,  "%",   nullptr },
    { vo_trill,      Kind::Knob,     0.0,   40.0,        0.0,   "Hz",  nullptr },
    { vo_rough,      Kind::Knob,     0.0,   100.0,       10.0,  "%",   nullptr },
    { ph_tempo,      Kind::Knob,     50.0,  200.0,       100.0, "%",   nullptr },
    { ph_pause,      Kind::Knob,     0.2,   20.0,        2.0,   "s",   nullptr },
    { ph_length,     Kind::Knob,     0.2,   8.0,         2.0,   "s",   nullptr },
    { ph_variation,  Kind::Knob,     0.0,   100.0,       30.0,  "%",   nullptr },
    { su_distance,   Kind::Knob,     1.0,   200.0,       10.0,  "m",   nullptr },
    { su_wind,       Kind::Knob,     0.0,   15.0,        2.0,   "m/s", nullptr },
    { su_space,      Kind::Knob,     0.0,   100.0,       30.0,  "%",   nullptr },

    { sc_bird,       Kind::Text,     0.0,   0.0,         0.0,   "",    nullptr }, // bird id, e.g. "svarttrost"
    { sc_sex,        Kind::Choice,   0.0,   1.0,         0.0,   "",    "male|female" },
    { sc_age,        Kind::Choice,   0.0,   1.0,         0.0,   "",    "adult|juvenile" },
    { sc_season,     Kind::Choice,   0.0,   3.0,         0.0,   "",    "spring|summer|autumn|winter" },
    { sc_time,       Kind::Choice,   0.0,   3.0,         0.0,   "",    "dawn|day|dusk|night" },
    { sc_type,       Kind::Choice,   0.0,   3.0,         0.0,   "",    "song|call|alarm|flight" },
    { sc_place,      Kind::Choice,   0.0,   3.0,         0.0,   "",    "garden|forest|open|shore" },
    { sc_dialect,    Kind::Text,     0.0,   0.0,         0.0,   "",    nullptr }, // per bird, "" for none
    { sc_mimics,     Kind::Toggle,   0.0,   1.0,         0.0,   "",    nullptr },

    { ap_on,         Kind::Toggle,   0.0,   1.0,         1.0,   "",    nullptr },
    { ap_hold,       Kind::Knob,     0.5,   20.0,        3.0,   "s",   nullptr },
    { ap_latch,      Kind::Toggle,   0.0,   1.0,         0.0,   "",    nullptr },
    { ap_seed,       Kind::Integer,  0.0,   4294967295.0, 1.0,  "",    nullptr }, // uint32
    { ap_return_all, Kind::Trigger,  0.0,   0.0,         0.0,   "",    nullptr },
    { ap_sing_once,  Kind::Trigger,  0.0,   0.0,         0.0,   "",    nullptr },
    { ap_reroll,     Kind::Trigger,  0.0,   0.0,         0.0,   "",    nullptr }, // writes a new ap_seed

    { pb_play,       Kind::Toggle,   0.0,   1.0,         0.0,   "",    nullptr },
    { pb_speed,      Kind::Choice,   0.0,   2.0,         0.0,   "",    "1|0.5|0.25" },
    { pb_shift,      Kind::Choice,   0.0,   1.0,         0.0,   "",    "off|-1oct" },
    { pb_draw,       Kind::Toggle,   0.0,   1.0,         0.0,   "",    nullptr },
}};

// Index of an id in all, or -1. constexpr so engine code can name
// parameters by id without a lookup at run time.
constexpr bool sameId(const char* a, const char* b) noexcept
{
    while (*a != '\0' && *a == *b)
    {
        ++a;
        ++b;
    }
    return *a == *b;
}

constexpr int indexOf(const char* id) noexcept
{
    for (std::size_t i = 0; i < all.size(); ++i)
        if (sameId(all[i].id, id))
            return static_cast<int>(i);
    return -1;
}

// Returns nullptr for an unknown id. Not for the audio thread: compare ids
// once at setup and keep the index.
inline const Info* find(const char* id) noexcept
{
    for (const auto& p : all)
        if (std::strcmp(p.id, id) == 0)
            return &p;
    return nullptr;
}

} // namespace pipp::params
