#pragma once

// The Dawn chorus (F4), the whole body width. Layout follows
// design/Chorus.dc.html: a morning row (season, place, dawn speed), then
// one panel with 4 lanes of 96px. A lane head is 302px: number chip in the
// track colour, bird name, MUTE, SOLO, CHANGE BIRD and distance. The
// timeline is 8px per minute from 90 minutes before sunrise to 30 after;
// a lane's band starts at its entry minute and fills where the bird sang.
//
// The screen only draws and reports clicks. The clock, entries and mix are
// tipp::Chorus in core; the host fills View.

#include "Strings.h"
#include "Widgets.h"

#include "Chorus.h"

#include <array>
#include <functional>

namespace tipp::ui
{
class ChorusScreen final : public juce::Component
{
public:
    ChorusScreen(const Strings& s, const tipp::Chorus& c);

    struct Lane
    {
        juce::String name;
        float entry = 0.0f;
        int distance = 0;
        bool mute = false, solo = false;
        bool inSeason = true; // its song sounds in the season: draw the band
    };
    struct View
    {
        int season = 0, place = 0, speed = 1;
        std::array<Lane, tipp::Chorus::kLanes> lanes;
        bool canChange = true;
    };

    std::function<void(int)> onSeason, onPlace, onSpeed, onMute, onSolo, onChange;

    void setView(const View& v);
    void applyStrings();
    void poll() { repaint(panel); }

    void paint(juce::Graphics& g) override;
    void resized() override;

    static constexpr int kHeadW = 302;
    static constexpr int kLaneH = 96;
    static constexpr float kPxPerMin = 8.0f;

private:
    void refresh();
    void paintTimeline(juce::Graphics& g);

    const Strings& strings;
    const tipp::Chorus& chorus;
    View view;

    std::array<Btn, 4> seasonBtns, placeBtns, speedBtns;
    std::array<Btn, 4> muteBtns, soloBtns, changeBtns;

    // Set in resized().
    juce::Rectangle<int> morningLabel, panel, head, heads, timeline, axis, caption, note;
    std::array<juce::Rectangle<int>, 3> fieldLabels;
};
} // namespace tipp::ui
