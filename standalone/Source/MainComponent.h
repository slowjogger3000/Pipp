#pragma once

// The desktop window: header, tabs, bird list, the Play screen and the
// status bar. Layout follows design/Main.dc.html at 1280x800. The
// interface sends values and hand events to tipp::Engine and draws what it
// publishes. No song or override logic lives here.

#include "UI/BirdList.h"
#include "UI/Knob.h"
#include "UI/Plate.h"
#include "UI/Sonogram.h"
#include "UI/Strings.h"
#include "UI/Widgets.h"

#include "BirdData.h"
#include "Engine.h"

#include <juce_audio_utils/juce_audio_utils.h>

#include <array>
#include <memory>
#include <vector>

namespace tipp::ui
{
class MainComponent final : public juce::AudioAppComponent, private juce::Timer
{
public:
    explicit MainComponent(const juce::File& dataDirectory);
    ~MainComponent() override;

    void prepareToPlay(int samplesPerBlock, double sampleRate) override;
    void getNextAudioBlock(const juce::AudioSourceChannelInfo& info) override;
    void releaseResources() override {}

    void paint(juce::Graphics& g) override;
    void resized() override;
    bool keyPressed(const juce::KeyPress& key) override;

    // Test hook: play for `seconds`, optionally drag a knob near the end,
    // save a snapshot and quit.
    void runSnapshot(const juce::File& png, double seconds, int handKnob);
    void setLanguage(const juce::String& lang);

private:
    void timerCallback() override;

    void loadIndex();
    void selectBird(int index);
    void stepBird(int dir);
    int neighbour(int dir) const; // next bird with data, -1 if none
    void applyStrings();
    void sendChoice(const char* id, int value);
    void setPlaying(bool on);
    void refreshControls();
    bool typeAvailable(int type) const;
    juce::String variant() const;
    juce::String sceneSummary(bool caps) const;
    const BirdEntry* currentEntry() const;

    void paintHeader(juce::Graphics& g);
    void paintTabs(juce::Graphics& g);
    void paintStatus(juce::Graphics& g);
    void paintPanels(juce::Graphics& g);
    void paintAutoplay(juce::Graphics& g);

    const juce::File dataDir;
    tipp::Engine engine;
    std::unique_ptr<tipp::BirdData> bird;
    std::vector<std::unique_ptr<tipp::BirdData>> retired; // until the engine lets go
    Strings strings;
    juce::String loadError;

    // State the interface owns. The engine gets each value as it changes.
    bool playing = false;
    int season = 0, timeOfDay = 0, songType = 0, place = 0, sex = 0, age = 0;
    bool apOn = true, latch = false;
    float hold = 3.0f;

    // Header.
    Btn playBtn, stopBtn, prevBtn, nextBtn, enBtn, noBtn;
    float meterL = 0.0f, meterR = 0.0f, meterPeak = 0.0f;

    BirdList list;

    // Plate panel.
    Plate plate;
    Btn maleBtn, femaleBtn, adultBtn, juvBtn;

    // Song panel.
    Sonogram sono;
    Btn drawBtn, shiftOffBtn, shiftOctBtn;
    std::array<Btn, 3> speedBtns;

    // Scene.
    std::array<std::array<Btn, 4>, 4> scene; // season, time, type, place
    Btn dialectBtn, mimicsBtn;

    // Knobs.
    std::vector<std::unique_ptr<Knob>> knobs;
    int legendKnob = -1;
    std::array<tipp::Engine::KnobMode, tipp::kNumKnobs> lastModes {};

    // Autoplay band.
    Btn apOnBtn, holdMinusBtn, holdPlusBtn, latchBtn, returnAllBtn, singOnceBtn, rerollBtn;

    // Painted areas, set in resized().
    juce::Rectangle<int> headerArea, tabsArea, bodyArea, statusArea, asideArea, mainArea;
    juce::Rectangle<int> wordmarkArea, readoutArea, langLabelArea, outLabelArea, outReadoutArea, meterArea;
    juce::Rectangle<int> platePanel, plateHead, plateWell, plateCaption;
    juce::Rectangle<int> songPanel, songHead, axisArea, sonoArea, timeAxis, songCaption;
    std::vector<std::pair<juce::Rectangle<int>, juce::String>> songLabels; // string keys
    juce::Rectangle<int> phraseValue, lengthValue;
    float plateOpen = 0.0f;
    juce::Rectangle<int> sceneLabel;
    std::array<juce::Rectangle<int>, 6> sceneFieldLabels;
    std::array<juce::Rectangle<int>, 3> knobGroupLabels;
    juce::Rectangle<int> apBand, apTitle, holdLabel, holdReadout, legendArea;

    // Snapshot test.
    juce::File snapshotFile;
    double snapshotSeconds = 0.0, elapsed = 0.0, snapshotStartMs = 0.0;
    int snapshotKnob = -1;
    int handPhase = 0;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(MainComponent)
};
} // namespace tipp::ui
