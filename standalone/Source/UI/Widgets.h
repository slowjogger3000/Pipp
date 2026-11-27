#pragma once

// Small controls: a button that is raised when off, ink when on and
// hatched when disabled, and a readout well.

#include "Theme.h"

#include <functional>

namespace pipp::ui
{
class Btn final : public juce::Component
{
public:
    enum class Glyph { None, Play, Stop, Prev, Next };

    Btn() { setRepaintsOnMouseActivity(false); }

    void setText(const juce::String& t) { if (t != text) { text = t; repaint(); } }
    void setOn(bool b) { if (b != on) { on = b; repaint(); } }
    void setDisabled(bool b) { if (b != disabled) { disabled = b; setMouseCursor(b ? juce::MouseCursor::NormalCursor : juce::MouseCursor::PointingHandCursor); repaint(); } }
    bool isOn() const noexcept { return on; }
    bool isDisabled() const noexcept { return disabled; }

    Glyph glyph = Glyph::None;
    float fontPx = 10.0f;
    float tracking = 0.06f;
    bool alignLeft = false; // text from the left with 10px padding, as in the quiz set list
    std::function<void()> onClick;

    void paint(juce::Graphics& g) override
    {
        const auto r = getLocalBounds();
        juce::Colour fg = colour::ink;
        if (on && ! disabled)
        {
            g.setColour(colour::ink);
            g.fillRect(r);
            fg = colour::onInk;
        }
        else if (disabled)
        {
            g.setColour(colour::face);
            g.fillRect(r);
            draw::hatch(g, r);
            draw::border(g, r);
            fg = colour::inkSoft;
        }
        else
            draw::raised(g, r);

        g.setColour(fg);
        if (glyph != Glyph::None)
        {
            const auto c = r.getCentre().toFloat();
            const float x = c.x - 8.0f, y = c.y - 8.0f;
            juce::Path p;
            switch (glyph)
            {
                case Glyph::Play: p.addTriangle(x + 4, y + 2, x + 13, y + 8, x + 4, y + 14); break;
                case Glyph::Stop: p.addRectangle(x + 3, y + 3, 10, 10); break;
                case Glyph::Prev: p.addTriangle(x + 11, y + 3, x + 4, y + 8, x + 11, y + 13); break;
                case Glyph::Next: p.addTriangle(x + 5, y + 3, x + 12, y + 8, x + 5, y + 13); break;
                case Glyph::None: break;
            }
            g.fillPath(p);
            return;
        }
        g.setFont(mono(fontPx, 500, tracking));
        if (alignLeft)
            g.drawFittedText(text, r.reduced(10, 0), juce::Justification::centredLeft, 1, 0.75f);
        else
            g.drawFittedText(text, r.reduced(2, 0), juce::Justification::centred, 1, 0.75f);
    }

    void mouseUp(const juce::MouseEvent& e) override
    {
        if (! disabled && getLocalBounds().contains(e.getPosition()) && onClick)
            onClick();
    }

private:
    juce::String text;
    bool on = false;
    bool disabled = false;
};

// Lays out joined buttons left to right, overlapping by 1px.
inline void layoutJoined(juce::Rectangle<int> r, std::initializer_list<Btn*> buttons, std::initializer_list<int> widths = {})
{
    const int n = static_cast<int>(buttons.size());
    int i = 0;
    auto w = widths.begin();
    int x = r.getX();
    for (auto* b : buttons)
    {
        int bw = 0;
        if (w != widths.end())
            bw = *w++;
        else
        {
            // Equal shares of the row, edges shared.
            const int total = r.getWidth() + (n - 1);
            bw = total * (i + 1) / n - total * i / n;
        }
        b->setBounds(x, r.getY(), bw, r.getHeight());
        x += bw - 1;
        ++i;
    }
}
} // namespace pipp::ui
