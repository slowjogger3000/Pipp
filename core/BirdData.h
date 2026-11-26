#pragma once

// A bird as the engine sees it: voice settings, syllables, phrase templates
// and rules per song type. Built by parseBird() off the audio thread from
// the text of voice.json and songs.json. Read only once handed to Engine.

#include <array>
#include <cstdint>
#include <string>
#include <vector>

namespace tipp
{
// The 12 knobs, in the order of params::all.
enum Knob : int
{
    kPitch, kBreath, kTension, kTrill, kRough,
    kTempo, kPause, kLength, kVariation,
    kDistance, kWind, kSpace,
    kNumKnobs
};

enum SongTypeIndex : int { kSong, kCall, kAlarm, kFlight, kNumSongTypes };

struct Range
{
    float lo = 0.0f;
    float hi = 0.0f;
};

// t runs 0 to 1 across the syllable.
struct ContourPoint
{
    float t = 0.0f;
    float v = 0.0f;
};

struct Syllable
{
    std::string id;
    float durMs = 100.0f;
    std::vector<ContourPoint> pitch; // Hz at vo_pitch 1.0
    std::vector<ContourPoint> amp;   // 0 to 1, must start and end at 0
    float gain = 1.0f;
    // Offsets added to the knob, in knob units (0 to 100).
    float breath = 0.0f;
    float tension = 0.0f;
    float rough = 0.0f;
    // A syllable's own trill. Replaces the vo_trill knob while it sounds.
    float trillHz = 0.0f;
    float trillDepthSt = 0.0f;
    float trillAm = 0.0f;
};

struct Section
{
    std::vector<int> pool; // syllable indices
    int minCount = 1;
    int maxCount = 1;
    float share = 1.0f;          // of the phrase length budget
    std::uint32_t chanceMilli = 1000u; // 0 to 1000, integer for determinism
    Range gapMs { 50.0f, 50.0f };
    Range leadGapMs { 0.0f, 0.0f }; // before the section, unless it opens the phrase
    bool noAdjacentRepeat = true;
    int part = -1; // index into BirdData::parts, -1 for none. Drawing only.
};

struct PhraseTemplate
{
    std::uint32_t weight = 1u;
    std::vector<Section> sections;
};

struct Override
{
    // -1 matches any value.
    int season = -1, time = -1, sex = -1, age = -1;
    bool hasPause = false, hasLength = false, hasActive = false;
    Range pauseS, lengthS;
    bool active = true;
};

struct SongType
{
    bool present = false;
    std::vector<PhraseTemplate> templates;
    std::uint32_t totalWeight = 0u;
    Range pauseS { 2.0f, 4.0f };
    Range lengthS { 1.5f, 3.0f };
    float transposeSt = 0.0f; // per-phrase transpose at full variation
    bool avoidRepeat = false;
    // Phrases in a row that use the same template. 1 and 1 picks afresh each time.
    int boutMin = 1, boutMax = 1;
    std::array<bool, kNumKnobs> hasAuto {};
    std::array<Range, kNumKnobs> autoRange {};
    std::vector<Override> overrides;
};

struct BirdData
{
    std::string id;
    float pitchRefHz = 2000.0f;               // vo_pitch 1.0 shown as this, in kHz
    std::array<float, kNumKnobs> base {};      // starting knob values
    std::array<Range, kNumKnobs> knobRange {}; // knob range for this bird
    std::vector<Syllable> syllables;
    std::array<SongType, kNumSongTypes> types {};
    // Names of the parts of a phrase ("motifs", "twitter"), from a section's
    // "part" key. The interface looks the words up in bird.json.
    std::vector<std::string> parts;
};

// The effective rules for one scene, after overrides.
struct SceneRules
{
    bool active = false;
    Range pauseS;
    Range lengthS;
};

// A contour at t (0 to 1). Pitch moves in log frequency, as it is heard.
float contourAt(const std::vector<ContourPoint>& c, float t) noexcept;
float contourPitchAt(const std::vector<ContourPoint>& c, float t) noexcept;

SceneRules rulesFor(const SongType& t, int season, int time, int sex, int age) noexcept;

// Fills out from the two files' text. Returns false and sets error on bad data.
bool parseBird(const std::string& id, const std::string& voiceJson, const std::string& songsJson,
               BirdData& out, std::string& error);
} // namespace tipp
