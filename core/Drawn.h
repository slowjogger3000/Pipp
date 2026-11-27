#pragma once

// A pitch line drawn on the sonogram, sung by the bird in its own voice.
//
// Points are in time order. A point whose joinPrev is false starts a new
// note; the notes are sung with silence between them. A note of a single
// point lasts kDotMs. Pitch between points follows a monotone cubic in Hz,
// the sonogram's own linear axis, so a straight stroke sings straight and
// the line never overshoots what was drawn.
//
// drawnAt() is the one definition of the line: the engine sings it and the
// interfaces draw it, so what is seen is what is heard.
//
// The editing functions are for the host thread. They may allocate.

#include <array>

namespace pipp
{
struct DrawnPoint
{
    float tMs = 0.0f; // from the left edge of the drawing
    float hz = 0.0f;
    bool joinPrev = false;
};

struct DrawnLine
{
    static constexpr int kMax = 64;
    std::array<DrawnPoint, kMax> pts {};
    int count = 0;
};

inline constexpr float kDotMs = 90.0f;      // a single click sings this long
inline constexpr float kDrawEdgeMs = 12.0f; // attack and release of a note
inline constexpr float kDrawMinHz = 250.0f;
inline constexpr float kDrawMaxHz = 8000.0f;

float drawnStart(const DrawnLine& line) noexcept;
float drawnEnd(const DrawnLine& line) noexcept;

// Pitch and loudness (0 to 1) at t. Between notes amp is 0 and hz is the
// next note's first pitch, so a note never glides in from the last one.
void drawnAt(const DrawnLine& line, float tMs, float& hz, float& amp) noexcept;

// Adds a stroke sampled from the pointer, in time order. It is simplified
// to its corners within tolPx, measured with pxPerMs and pxPerHz, and it
// replaces the points inside its own time span. Returns false if the line
// was full and the stroke was cut.
bool addStroke(DrawnLine& line, const DrawnPoint* raw, int n, float pxPerMs, float pxPerHz, float tolPx);

// Removes the points within radiusPx of (tMs, hz). A note erased in the
// middle splits in two. Returns true if anything was removed.
bool eraseNear(DrawnLine& line, float tMs, float hz, float pxPerMs, float pxPerHz, float radiusPx);
} // namespace pipp
