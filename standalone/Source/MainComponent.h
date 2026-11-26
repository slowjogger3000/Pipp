#pragma once

// The desktop window: header, tabs, bird list, the Play screen and the
// status bar. Layout follows design/Main.dc.html at 1280x800. The
// interface sends values and hand events to tipp::Engine and draws what it
// publishes. No song or override logic lives here.

#include "UI/BirdList.h"
#include "UI/ChorusScreen.h"
#include "UI/GuideScreen.h"
#include "UI/Knob.h"
#include "UI/Plate.h"
#include "UI/QuizScreen.h"
#include "UI/Sonogram.h"
#include "UI/Strings.h"
#include "UI/Widgets.h"

#include "BirdData.h"
#include "Chorus.h"
#include "Compare.h"
#include "Engine.h"
#include "Quiz.h"

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
    // 0 Play, 1 Field guide, 2 Quiz, 3 Chorus. Log and Collection are not built yet.
    void setTab(int index);
    // Test hook: COMPARE with a lookalike, as its button does.
    void compareWith(const juce::String& id) { startCompare(id); }
    void mouseUp(const juce::MouseEvent& e) override;
    void setLanguage(const juce::String& lang);
    // Test hook: pick a bird by id and a plate variant before a snapshot.
    void chooseScene(const juce::String& birdId, bool female, bool juvenile);
    // Test hooks: speed index (0 1x, 1 half, 2 quarter), hearing shift, and
    // draw mode with a sample line, entered a second before the snapshot.
    void setSpeed(int index);
    void setShift(bool down);
    void snapshotDraw() { snapshotDrawMode = true; }
    // Test hooks for the quiz: a fixed seed, questions answered before the
    // snapshot (wrong, right, wrong, ...), and the answer to give a second
    // before it: 1 right, -1 wrong.
    // Test hook for the chorus: start minute, speed index, lane to mute (-1 none).
    void snapshotChorus(float startMin, int speed, int muteLane)
    {
        chorusSnapStart = startMin;
        chorusSpeed = speed;
        chorusSnapMute = muteLane;
    }
    void snapshotQuiz(std::uint32_t seed, int skip, int answer, bool leave)
    {
        snapshotLeaveQuiz = leave;
        quizSeed = seed;
        quizSkip = skip;
        snapshotAnswer = answer;
    }

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
    void setSex(int v);
    void setAge(int v);
    void setSeason(int v);
    void setSongType(int v);
    void setDrawMode(bool on);
    void drawSampleLine();
    void updateSongTools();
    void playType(int type);
    void startCompare(const juce::String& otherId);
    void stopCompare();
    void configurePlate(Plate& p);
    bool typeAvailable(int type) const;
    juce::String variant() const;
    juce::String sceneSummary(bool caps) const;
    const BirdEntry* currentEntry() const;
    const BirdEntry* headerEntry() const; // hidden in the quiz until answered
    void sendScene(); // every value the interface owns, to the engine

    // Quiz.
    void buildQuizBirds();
    void enterQuiz();
    void leaveQuiz();
    void startQuiz();
    void stageQuestion();
    void quizAnswer(int slot);
    void quizNext();
    void quizPlayAgain();
    void quizCompare();
    void quizOpenGuide();
    void updateQuizView();
    juce::String quizName(int k) const;
    juce::String quizExplain() const;
    juce::String quizHint() const;

    // Chorus.
    void loadChorus();
    void enterChorus();
    void leaveChorus();
    void setChorusPlaying(bool on);
    void setLaneBird(int lane, int quizIndex);
    void changeLaneBird(int lane);
    void updateChorusView();
    int quizIndexOf(const juce::String& id) const;

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
    bool apOn = true, latch = true; // a set knob stays set (prd.md, Override)
    float hold = 3.0f;
    int speedIndex = 0;
    bool shiftDown = false, drawMode = false, kept = false;

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
    Btn eraseBtn, clearBtn, singItBtn, keepBtn; // draw mode
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

    // Field guide and its COMPARE.
    int activeTab = 0;
    std::array<juce::Rectangle<int>, 6> tabRects;
    GuideScreen guide { strings };
    bool namesVerified = false;
    tipp::Compare compare;
    std::unique_ptr<tipp::BirdData> compareBird; // alive while compare runs
    juce::String comparingId;

    // Quiz (F3). quizData holds every bird with data for the whole run, so
    // the engine never holds a quiz bird that was freed.
    QuizScreen quizScreen { strings, engine };
    tipp::Quiz quiz;
    tipp::QuizVoice quizVoice;
    std::vector<tipp::QuizBird> quizBirds;
    std::vector<std::unique_ptr<tipp::BirdData>> quizData;
    std::vector<int> quizEntries; // list.birds index per quiz bird
    std::vector<juce::var> quizInfo; // bird.json per quiz bird
    int quizSet = 0, quizAsk = 0, quizHints = 0;
    bool quizHalf = false, hintShown = false, quizPlaying = false;
    std::uint32_t quizAsks = 0u;
    std::uint32_t quizSeed = 0u; // 0: from the clock
    int quizSkip = 0, snapshotAnswer = 0;
    bool snapshotLeaveQuiz = false; // back to PLAY 4 s before the snapshot

    // Dawn chorus (F4). Lane birds come from quizData, alive for the run.
    tipp::Chorus chorus;
    ChorusScreen chorusScreen { strings, chorus };
    juce::var chorusDoc; // data/chorus.json
    std::array<int, tipp::Chorus::kLanes> laneBird { { -1, -1, -1, -1 } }; // quizData index
    std::array<float, tipp::Chorus::kLanes> laneEntry {}, laneDistance {};
    std::array<bool, tipp::Chorus::kLanes> laneMute {}, laneSolo {};
    int chorusSeason = 0, chorusPlace = 0, chorusSpeed = tipp::Chorus::k10x;
    bool chorusPlaying = false;
    float chorusSnapStart = tipp::Chorus::kStartMin;
    int chorusSnapMute = -1;

    // Snapshot test.
    juce::File snapshotFile;
    double snapshotSeconds = 0.0, elapsed = 0.0, snapshotStartMs = 0.0;
    int snapshotKnob = -1;
    int handPhase = 0;
    bool snapshotDrawMode = false;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(MainComponent)
};
} // namespace tipp::ui
