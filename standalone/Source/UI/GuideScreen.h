#pragma once

// The Field guide (F2), right of the bird list. Layout follows
// design/Guide.dc.html. Left, 360px: plate with sex and age toggles, the
// male and female table, field facts. Right: song notes with an example
// phrase and the four song types, the year in Norway, lookalikes with
// COMPARE.
//
// Text comes from data/birds/<id>/bird.json and the plate callouts in
// plate.json. A field that is not verified carries [TO VERIFY]. The screen
// only draws and reports clicks; the host sends everything to the engine.

#include "BirdList.h"
#include "Plate.h"
#include "Strings.h"
#include "Widgets.h"

#include "BirdData.h"
#include "Engine.h"

#include <array>
#include <functional>
#include <memory>
#include <vector>

namespace pipp::ui
{
class GuideScreen final : public juce::Component
{
public:
    explicit GuideScreen(const Strings& s);

    // Scene state the guide shows. The host owns it.
    struct State
    {
        int sex = 0, age = 0, season = 0, songType = 0;
        juce::String comparing; // id of the lookalike being compared, empty if none
    };

    std::function<void(int)> onSex, onAge, onSeason, onPlayType;
    std::function<void(const juce::String&)> onCompare; // lookalike bird id

    Plate plate;

    // birdJson is the parsed bird.json, plateFile the bird's plate.json.
    // all is the full bird list, for lookalike names and which have data.
    void setBird(const BirdEntry& entry, const pipp::BirdData* data, const juce::var& birdJson,
                 const juce::File& plateFile, const std::vector<BirdEntry>& all, bool namesVerified);
    void setState(const State& s);
    void applyStrings();

    // An example phrase of the song for the figure, from a throwaway engine
    // with seed 1 at the bird's own knob values. Not on the audio thread.
    static pipp::Engine::PhraseView examplePhrase(const pipp::BirdData& bird);

    void paint(juce::Graphics& g) override;
    void resized() override;
    void mouseUp(const juce::MouseEvent& e) override;

private:
    juce::String field(const juce::var& f) const; // value in the current language, with [TO VERIFY] if needed
    juce::String calloutValue(const juce::var& callout, const char* variant) const;
    juce::String otherName(const juce::var& lookalike, bool norwegian) const;
    bool lookalikePlayable(const juce::var& lookalike) const;
    void refresh();

    void paintPlatePanel(juce::Graphics& g);
    void paintTables(juce::Graphics& g);
    void paintSongNotes(juce::Graphics& g);
    void paintYear(juce::Graphics& g);
    void paintLookalikes(juce::Graphics& g);
    void paintFigure(juce::Graphics& g, juce::Rectangle<int> well);

    const Strings& strings;
    const BirdEntry* entry = nullptr;
    const pipp::BirdData* bird = nullptr;
    const std::vector<BirdEntry>* birds = nullptr;
    bool namesVerified = false;
    juce::var info;      // bird.json
    juce::var plateDoc;  // plate.json, for the callout values
    pipp::Engine::PhraseView example;
    State state;

    Btn maleBtn, femaleBtn, adultBtn, juvBtn;
    std::array<Btn, 4> typeBtns;
    std::array<Btn, 5> seasonBtns; // winter (Jan, Feb), spring, summer, autumn, winter (Dec)
    std::vector<std::unique_ptr<Btn>> compareBtns;

    // Set in resized().
    juce::Rectangle<int> left, right;
    juce::Rectangle<int> platePanel, plateHead, plateWell, plateCaption;
    juce::Rectangle<int> mfLabel, mfTable, factsLabel, factsTable;
    juce::Rectangle<int> notesLabel, figAxis, figWell, figParts, figCaption, linkArea, notesText, typesTable;
    juce::Rectangle<int> yearLabel, yearGrid, yearNote;
    juce::Rectangle<int> lookLabel, lookArea;
    int monthX0 = 0;
    float monthW = 0.0f;
};
} // namespace pipp::ui
