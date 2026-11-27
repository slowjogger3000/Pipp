#pragma once

// Office beige, from design/tokens.json. Drawing helpers for the rules in
// design-handover.md: ink state, raised and inset bevels, hatching for
// disabled, graph paper in signal wells, labelled sections.

#include <juce_gui_basics/juce_gui_basics.h>

#if PIPP_HAS_FONTS
 #include "BinaryData.h"
#endif

namespace pipp::ui
{
namespace colour
{
inline const juce::Colour ground { 0xffddd3bd };
inline const juce::Colour panel { 0xffcec2a6 };
inline const juce::Colour face { 0xffefe8d6 };
inline const juce::Colour sheet { 0xffe3d9c2 };
inline const juce::Colour hilite { 0xfffbf7ec };
inline const juce::Colour shadow { 0xffa3967a };
inline const juce::Colour ink { 0xff221c14 };
inline const juce::Colour inkSoft { 0xff4f4634 };
inline const juce::Colour faint { 0xffb5a98b };
inline const juce::Colour onInk { 0xffddd3bd };
inline const juce::Colour paper { 0xfffff8ec };
inline const juce::Colour rule { 0xffd8ccb0 };
inline const juce::Colour ruleMajor { 0xffc4b796 };
inline const juce::Colour divider { 0xffbdb093 };
inline const juce::Colour clay { 0xff936255 };
inline const juce::Colour khaki { 0xffb5a37a };
inline const juce::Colour sage { 0xff809a8c };
inline const juce::Colour plum { 0xff5e4458 };
inline juce::Colour hatch() { return ink.withAlpha(0.10f); }
} // namespace colour

// Embedded IBM Plex Mono and Instrument Serif when the font files are in
// standalone/Resources/fonts. Menlo and Georgia otherwise.
struct FontSet
{
    juce::Typeface::Ptr mono400, mono500, mono600, serif;

    FontSet()
    {
#if PIPP_HAS_FONTS
        mono400 = juce::Typeface::createSystemTypefaceFor(BinaryData::IBMPlexMonoRegular_ttf, BinaryData::IBMPlexMonoRegular_ttfSize);
        mono500 = juce::Typeface::createSystemTypefaceFor(BinaryData::IBMPlexMonoMedium_ttf, BinaryData::IBMPlexMonoMedium_ttfSize);
        mono600 = juce::Typeface::createSystemTypefaceFor(BinaryData::IBMPlexMonoSemiBold_ttf, BinaryData::IBMPlexMonoSemiBold_ttfSize);
        serif = juce::Typeface::createSystemTypefaceFor(BinaryData::InstrumentSerifRegular_ttf, BinaryData::InstrumentSerifRegular_ttfSize);
#endif
    }
};

// px is the CSS font-size. tracking is letter-spacing in em.
inline juce::Font mono(float px, int weight = 400, float tracking = 0.0f)
{
    juce::SharedResourcePointer<FontSet> fonts;
    const auto& tf = weight >= 600 ? fonts->mono600 : weight >= 500 ? fonts->mono500 : fonts->mono400;
    juce::FontOptions o = tf != nullptr ? juce::FontOptions(tf)
                                        : juce::FontOptions("Menlo", 12.0f, weight >= 600 ? juce::Font::bold : juce::Font::plain);
    return juce::Font(o.withPointHeight(px).withKerningFactor(tracking));
}

inline juce::Font serif(float px)
{
    juce::SharedResourcePointer<FontSet> fonts;
    juce::FontOptions o = fonts->serif != nullptr ? juce::FontOptions(fonts->serif) : juce::FontOptions("Georgia", 12.0f, juce::Font::plain);
    return juce::Font(o.withPointHeight(px));
}

namespace draw
{
inline void border(juce::Graphics& g, juce::Rectangle<int> r, juce::Colour c = colour::ink)
{
    g.setColour(c);
    g.drawRect(r, 1);
}

// Raised face: face fill, ink edge, hilite top-left, shadow bottom-right.
inline void raised(juce::Graphics& g, juce::Rectangle<int> r, juce::Colour fill = colour::face)
{
    g.setColour(fill);
    g.fillRect(r);
    const auto in = r.reduced(1);
    g.setColour(colour::hilite);
    g.fillRect(in.getX(), in.getY(), in.getWidth(), 1);
    g.fillRect(in.getX(), in.getY(), 1, in.getHeight());
    g.setColour(colour::shadow);
    g.fillRect(in.getX(), in.getBottom() - 1, in.getWidth(), 1);
    g.fillRect(in.getRight() - 1, in.getY(), 1, in.getHeight());
    border(g, r);
}

// Inset well: fill, ink edge, shadow lip top-left.
inline void inset(juce::Graphics& g, juce::Rectangle<int> r, juce::Colour fill = colour::face, bool edge = true)
{
    g.setColour(fill);
    g.fillRect(r);
    const auto in = edge ? r.reduced(1) : r;
    g.setColour(colour::shadow);
    g.fillRect(in.getX(), in.getY(), in.getWidth(), 1);
    g.fillRect(in.getX(), in.getY(), 1, in.getHeight());
    if (edge)
        border(g, r);
}

// 135° lines, 1px, 7px pitch.
inline void hatch(juce::Graphics& g, juce::Rectangle<int> r, juce::Colour c = colour::hatch(), float pitch = 7.0f)
{
    juce::Graphics::ScopedSaveState s(g);
    g.reduceClipRegion(r);
    g.setColour(c);
    const float step = pitch * juce::MathConstants<float>::sqrt2;
    const float x0 = static_cast<float>(r.getX()), y0 = static_cast<float>(r.getY());
    const float w = static_cast<float>(r.getWidth()), h = static_cast<float>(r.getHeight());
    for (float c0 = 0.0f; c0 < w + h; c0 += step)
        g.drawLine(x0 + c0, y0, x0 + c0 - h, y0 + h, 1.0f);
}

// rule every 8px, ruleMajor every 40px, from the top-left corner.
inline void graphPaper(juce::Graphics& g, juce::Rectangle<int> r)
{
    g.setColour(colour::face);
    g.fillRect(r);
    for (int pass = 0; pass < 2; ++pass)
    {
        const int step = pass == 0 ? 8 : 40;
        g.setColour(pass == 0 ? colour::rule : colour::ruleMajor);
        for (int x = r.getX(); x < r.getRight(); x += step)
            g.fillRect(x, r.getY(), 1, r.getHeight());
        for (int y = r.getY(); y < r.getBottom(); y += step)
            g.fillRect(r.getX(), y, r.getWidth(), 1);
    }
}

// Caps label in inkSoft, then a 1px ink hairline to the edge.
inline void sectionLabel(juce::Graphics& g, juce::Rectangle<int> r, const juce::String& text)
{
    const auto f = mono(10.0f, 600, 0.14f);
    g.setFont(f);
    g.setColour(colour::inkSoft);
    const int w = juce::roundToInt(juce::GlyphArrangement::getStringWidth(f, text));
    g.drawText(text, r.withWidth(w + 2), juce::Justification::centredLeft, false);
    g.setColour(colour::ink);
    g.fillRect(r.getX() + w + 6, r.getCentreY(), r.getRight() - (r.getX() + w + 6), 1);
}

// Small caps field label above a control.
inline void fieldLabel(juce::Graphics& g, juce::Rectangle<int> r, const juce::String& text)
{
    g.setFont(mono(9.0f, 600, 0.14f));
    g.setColour(colour::inkSoft);
    g.drawText(text, r, juce::Justification::centredLeft, false);
}

inline int textWidth(const juce::Font& f, const juce::String& s)
{
    return juce::roundToInt(std::ceil(juce::GlyphArrangement::getStringWidth(f, s)));
}
} // namespace draw

// Values carry units with a real minus sign. Norwegian uses a decimal comma.
inline juce::String number(double v, int decimals, bool comma)
{
    juce::String s = decimals <= 0 ? juce::String(juce::roundToInt(v)) : juce::String(v, decimals);
    if (comma)
        s = s.replace(".", ",");
    if (s.startsWithChar('-'))
        s = juce::String(juce::CharPointer_UTF8("\xe2\x88\x92")) + s.substring(1);
    return s;
}
} // namespace pipp::ui
