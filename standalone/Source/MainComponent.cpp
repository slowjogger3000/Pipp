#include "MainComponent.h"

#include "Params.h"

#include <algorithm>
#include <cmath>

namespace tipp::ui
{
namespace
{
namespace P = tipp::params;

constexpr const char* kSceneIds[4] = { P::sc_season, P::sc_time, P::sc_type, P::sc_place };
constexpr const char* kSceneKeys[4] = { "season", "time", "type", "place" };
constexpr const char* kTabKeys[6] = { "play", "guide", "quiz", "chorus", "log", "collection" };

juce::StringArray optionIds(const char* paramId)
{
    return juce::StringArray::fromTokens(juce::String(P::find(paramId)->options), "|", "");
}

juce::String readText(const juce::File& f) { return f.loadFileAsString(); }

int textW(const juce::Font& f, const juce::String& s) { return draw::textWidth(f, s); }
} // namespace

MainComponent::MainComponent(const juce::File& dataDirectory)
    : dataDir(dataDirectory), sono(engine)
{
    setWantsKeyboardFocus(true);
    strings.load(dataDir, "en");

    for (int k = 0; k < tipp::kNumKnobs; ++k)
    {
        knobs.push_back(std::make_unique<Knob>(engine, k));
        addAndMakeVisible(*knobs.back());
    }

    // Header.
    playBtn.glyph = Btn::Glyph::Play;
    stopBtn.glyph = Btn::Glyph::Stop;
    prevBtn.glyph = Btn::Glyph::Prev;
    nextBtn.glyph = Btn::Glyph::Next;
    playBtn.onClick = [this] {
        if (activeTab == 2)
            quizPlayAgain();
        else if (activeTab == 3)
            setChorusPlaying(true);
        else
            setPlaying(true);
    };
    stopBtn.onClick = [this] {
        if (activeTab == 3)
        {
            setChorusPlaying(false);
            return;
        }
        if (activeTab != 2)
        {
            setPlaying(false);
            return;
        }
        stopCompare();
        quizPlaying = false;
        engine.setParam(P::indexOf(P::pb_play), 0.0f);
        refreshControls();
    };
    prevBtn.onClick = [this] { stepBird(-1); };
    nextBtn.onClick = [this] { stepBird(1); };
    enBtn.onClick = [this] { setLanguage("en"); };
    noBtn.onClick = [this] { setLanguage("no"); };
    for (auto* b : { &playBtn, &stopBtn, &prevBtn, &nextBtn, &enBtn, &noBtn })
        addAndMakeVisible(*b);

    addAndMakeVisible(list);
    list.strings = &strings;
    list.onSelect = [this](int i) { selectBird(i); };

    // Plate panel.
    addAndMakeVisible(plate);
    maleBtn.onClick = [this] { setSex(0); };
    femaleBtn.onClick = [this] { setSex(1); };
    adultBtn.onClick = [this] { setAge(0); };
    juvBtn.onClick = [this] { setAge(1); };
    for (auto* b : { &maleBtn, &femaleBtn, &adultBtn, &juvBtn })
        addAndMakeVisible(*b);

    // Song panel.
    addAndMakeVisible(sono);
    sono.handLabel = [this](int k) {
        return strings("knob." + juce::String(P::all[static_cast<std::size_t>(k)].id)) + " " + strings("song.by_hand");
    };
    sono.flagText = [this](float hz, float secs) {
        const bool no = strings.norwegian();
        return number(hz / 1000.0f, 1, no) + " kHz  " + number(secs, 1, no) + " " + strings("unit.s");
    };
    sono.onLineChanged = [this] {
        engine.setDrawn(sono.line);
        if (sono.line.count == 0 && kept)
        {
            kept = false;
            engine.keepDrawn(false);
        }
        refreshControls();
    };
    speedBtns[0].setText(juce::String(juce::CharPointer_UTF8("1\xc3\x97")));
    speedBtns[1].setText(juce::String(juce::CharPointer_UTF8("\xc2\xbd\xc3\x97")));
    speedBtns[2].setText(juce::String(juce::CharPointer_UTF8("\xc2\xbc\xc3\x97")));
    for (int i = 0; i < 3; ++i)
        speedBtns[static_cast<std::size_t>(i)].onClick = [this, i] { setSpeed(i); };
    shiftOffBtn.onClick = [this] { setShift(false); };
    shiftOctBtn.onClick = [this] { setShift(true); };
    drawBtn.onClick = [this] { setDrawMode(! drawMode); };
    eraseBtn.onClick = [this] { sono.erasing = ! sono.erasing; refreshControls(); };
    clearBtn.onClick = [this] {
        sono.line.count = 0;
        sono.onLineChanged();
    };
    singItBtn.onClick = [this] {
        if (! playing)
            setPlaying(true);
        engine.trigger(P::indexOf(P::ap_sing_once));
    };
    keepBtn.onClick = [this] {
        kept = ! kept;
        engine.keepDrawn(kept);
        refreshControls();
    };
    for (auto* b : { &drawBtn, &shiftOffBtn, &shiftOctBtn, &speedBtns[0], &speedBtns[1], &speedBtns[2] })
        addAndMakeVisible(*b);
    for (auto* b : { &eraseBtn, &clearBtn, &singItBtn, &keepBtn })
        addChildComponent(*b);

    // Scene.
    for (int row = 0; row < 4; ++row)
        for (int i = 0; i < 4; ++i)
        {
            auto& b = scene[static_cast<std::size_t>(row)][static_cast<std::size_t>(i)];
            b.onClick = [this, row, i] {
                if (row == 0)      setSeason(i);
                else if (row == 2) setSongType(i);
                else
                {
                    (row == 1 ? timeOfDay : place) = i;
                    sendChoice(kSceneIds[row], i);
                    refreshControls();
                }
            };
            addAndMakeVisible(b);
        }
    dialectBtn.setDisabled(true); // no bird in this build has a dialect
    mimicsBtn.setDisabled(true);
    addAndMakeVisible(dialectBtn);
    addAndMakeVisible(mimicsBtn);

    // Autoplay band.
    apOnBtn.fontPx = 11.0f;
    apOnBtn.onClick = [this] { stopCompare(); apOn = ! apOn; sendChoice(P::ap_on, apOn ? 1 : 0); refreshControls(); };
    holdMinusBtn.setText(juce::String(juce::CharPointer_UTF8("\xe2\x88\x92")));
    holdPlusBtn.setText("+");
    holdMinusBtn.fontPx = holdPlusBtn.fontPx = 12.0f;
    auto stepHold = [this](float d) {
        hold = juce::jlimit(0.5f, 20.0f, hold + d);
        engine.setParam(P::indexOf(P::ap_hold), hold);
        repaint(apBand);
    };
    holdMinusBtn.onClick = [stepHold] { stepHold(-0.5f); };
    holdPlusBtn.onClick = [stepHold] { stepHold(0.5f); };
    latchBtn.onClick = [this] { latch = ! latch; sendChoice(P::ap_latch, latch ? 1 : 0); refreshControls(); };
    returnAllBtn.onClick = [this] { engine.trigger(P::indexOf(P::ap_return_all)); };
    singOnceBtn.onClick = [this] { stopCompare(); engine.trigger(P::indexOf(P::ap_sing_once)); };
    rerollBtn.onClick = [this] { engine.trigger(P::indexOf(P::ap_reroll)); };
    for (auto* b : { &apOnBtn, &holdMinusBtn, &holdPlusBtn, &latchBtn, &returnAllBtn, &singOnceBtn, &rerollBtn })
        addAndMakeVisible(*b);

    // Field guide.
    addChildComponent(guide);
    guide.onSex = [this](int v) { setSex(v); };
    guide.onAge = [this](int v) { setAge(v); };
    guide.onSeason = [this](int v) { setSeason(v); };
    guide.onPlayType = [this](int t) { playType(t); };
    guide.onCompare = [this](const juce::String& id) { startCompare(id); };

    // Quiz.
    addChildComponent(quizScreen);
    quizScreen.onAnswer = [this](int slot) { quizAnswer(slot); };
    quizScreen.onPlayAgain = [this] { quizPlayAgain(); };
    quizScreen.onHalf = [this] {
        quizHalf = ! quizHalf;
        quizVoice.setHalfSpeed(engine, quizHalf);
        updateQuizView();
    };
    quizScreen.onHint = [this] { hintShown = true; updateQuizView(); };
    quizScreen.onCompare = [this] { quizCompare(); };
    quizScreen.onOpenGuide = [this] { quizOpenGuide(); };
    quizScreen.onNext = [this] { quizNext(); };
    quizScreen.onSet = [this](int v) { quizSet = v; startQuiz(); };
    quizScreen.onAsk = [this](int v) { quizAsk = v; startQuiz(); };
    quizScreen.onHints = [this](int v) { quizHints = v; updateQuizView(); };

    // Dawn chorus.
    addChildComponent(chorusScreen);
    chorusScreen.onSeason = [this](int v) { chorusSeason = v; chorus.setSeason(v); updateChorusView(); };
    chorusScreen.onPlace = [this](int v) { chorusPlace = v; chorus.setPlace(v); updateChorusView(); };
    chorusScreen.onSpeed = [this](int v) { chorusSpeed = v; chorus.setSpeed(v); updateChorusView(); };
    chorusScreen.onMute = [this](int i) {
        laneMute[static_cast<std::size_t>(i)] = ! laneMute[static_cast<std::size_t>(i)];
        chorus.setMute(i, laneMute[static_cast<std::size_t>(i)]);
        updateChorusView();
    };
    chorusScreen.onSolo = [this](int i) {
        laneSolo[static_cast<std::size_t>(i)] = ! laneSolo[static_cast<std::size_t>(i)];
        chorus.setSolo(i, laneSolo[static_cast<std::size_t>(i)]);
        updateChorusView();
    };
    chorusScreen.onChange = [this](int i) { changeLaneBird(i); };

    engine.setParam(P::indexOf(P::ap_hold), hold);
    loadIndex();
    for (int i = 0; i < static_cast<int>(list.birds.size()); ++i)
        if (list.birds[static_cast<std::size_t>(i)].id == "svarttrost")
            selectBird(i);

    setSize(1280, 800); // after every child exists: this runs resized()
    applyStrings();
    refreshControls();
    setAudioChannels(0, 2);
    startTimerHz(30);
}

MainComponent::~MainComponent()
{
    stopTimer();
    shutdownAudio();
}

void MainComponent::prepareToPlay(int, double sampleRate)
{
    engine.prepare(sampleRate);
    chorus.prepare(sampleRate);
    engine.setBird(bird.get());
}

void MainComponent::getNextAudioBlock(const juce::AudioSourceChannelInfo& info)
{
    auto* buffer = info.buffer;
    float* left = buffer->getWritePointer(0, info.startSample);
    float* right = buffer->getNumChannels() > 1 ? buffer->getWritePointer(1, info.startSample) : left;
    engine.process(left, right, info.numSamples);
    chorus.processAdd(left, right, info.numSamples); // silent unless the chorus plays
}

// Data -----------------------------------------------------------------------

void MainComponent::loadIndex()
{
    const auto idx = juce::JSON::parse(dataDir.getChildFile("birds").getChildFile("index.json"));
    list.groups.clear();
    namesVerified = static_cast<bool>(idx["verified_names"]);
    if (auto* g = idx["groups"].getArray())
        for (const auto& v : *g)
            list.groups.add(v.toString());
    if (auto* arr = idx["birds"].getArray())
        for (const auto& b : *arr)
        {
            BirdEntry e;
            e.id = b["id"].toString();
            e.number = b["number"].toString();
            e.group = b["group"].toString();
            e.nameNo = b["name"]["no"].toString();
            e.nameEn = b["name"]["en"].toString();
            e.latin = b["latin"].toString();
            const auto dir = dataDir.getChildFile("birds").getChildFile(e.id);
            e.available = dir.getChildFile("voice.json").existsAsFile() && dir.getChildFile("songs.json").existsAsFile();
            list.birds.push_back(e);
        }
    if (list.birds.empty())
        loadError = strings("error.index");
}

void MainComponent::selectBird(int index)
{
    stopCompare();
    const auto& e = list.birds[static_cast<std::size_t>(index)];
    const auto dir = dataDir.getChildFile("birds").getChildFile(e.id);
    auto data = std::make_unique<tipp::BirdData>();
    std::string error;
    if (! tipp::parseBird(e.id.toStdString(), readText(dir.getChildFile("voice.json")).toStdString(),
                          readText(dir.getChildFile("songs.json")).toStdString(), *data, error))
    {
        loadError = strings.format("error.load", { { "bird", e.id.toUpperCase() }, { "error", juce::String(error) } });
        repaint();
        return;
    }
    if (auto err = plate.load(dir.getChildFile("plate.json")); err.isNotEmpty())
        loadError = strings.format("error.load", { { "bird", e.id.toUpperCase() }, { "error", err } });

    if (bird != nullptr)
        retired.push_back(std::move(bird));
    bird = std::move(data);
    engine.setBird(bird.get());
    list.selected = index;
    sono.setBird(bird.get());
    for (auto& k : knobs)
        k->setBird(bird.get());
    guide.setBird(list.birds[static_cast<std::size_t>(index)], bird.get(), juce::JSON::parse(dir.getChildFile("bird.json")),
                  dir.getChildFile("plate.json"), list.birds, namesVerified);
    list.repaint();
    refreshControls();
}

const BirdEntry* MainComponent::currentEntry() const
{
    if (list.selected < 0 || list.selected >= static_cast<int>(list.birds.size()))
        return nullptr;
    return &list.birds[static_cast<std::size_t>(list.selected)];
}

// Controls -------------------------------------------------------------------

void MainComponent::sendChoice(const char* id, int value)
{
    engine.setParam(P::indexOf(id), static_cast<float>(value));
}

void MainComponent::setPlaying(bool on)
{
    stopCompare();
    playing = on;
    engine.setParam(P::indexOf(P::pb_play), on ? 1.0f : 0.0f);
    refreshControls();
}

void MainComponent::setLanguage(const juce::String& lang)
{
    strings.load(dataDir, lang);
    applyStrings();
    refreshControls();
}

bool MainComponent::typeAvailable(int type) const
{
    if (bird == nullptr)
        return false;
    const auto& t = bird->types[static_cast<std::size_t>(type)];
    return t.present && tipp::rulesFor(t, season, timeOfDay, sex, age).active;
}

void MainComponent::setSex(int v)
{
    sex = v;
    sendChoice(P::sc_sex, v);
    refreshControls();
}

void MainComponent::setAge(int v)
{
    age = v;
    sendChoice(P::sc_age, v);
    refreshControls();
}

void MainComponent::setSeason(int v)
{
    season = v;
    sendChoice(P::sc_season, v);
    refreshControls();
}

void MainComponent::setSongType(int v)
{
    stopCompare();
    songType = v;
    sendChoice(P::sc_type, v);
    refreshControls();
}

void MainComponent::setSpeed(int index)
{
    speedIndex = juce::jlimit(0, 2, index);
    sendChoice(P::pb_speed, speedIndex);
    refreshControls();
}

void MainComponent::setShift(bool down)
{
    shiftDown = down;
    sendChoice(P::pb_shift, down ? 1 : 0);
    refreshControls();
}

// Draw mode: autoplay waits (in the engine), the sonogram stops after the
// phrase being sung, and the head shows the drawing tools.
void MainComponent::setDrawMode(bool on)
{
    if (on)
        stopCompare();
    drawMode = on;
    sono.erasing = false;
    sono.setDrawMode(on);
    sendChoice(P::pb_draw, on ? 1 : 0);
    resized();
    refreshControls();
}

void MainComponent::updateSongTools()
{
    const bool play = activeTab == 0;
    for (juce::Component* c : std::initializer_list<juce::Component*> { &speedBtns[0], &speedBtns[1], &speedBtns[2], &shiftOffBtn, &shiftOctBtn })
        c->setVisible(play && ! drawMode);
    for (juce::Component* c : std::initializer_list<juce::Component*> { &eraseBtn, &clearBtn, &singItBtn, &keepBtn })
        c->setVisible(play && drawMode);
}

// The line in design/Draw.dc.html: 4 points from 4 s, ending at 3.4 kHz,
// 6.6 s, where the crosshair sits.
void MainComponent::drawSampleLine()
{
    const tipp::DrawnPoint raw[5] = { { 4000.0f, 1900.0f, false }, { 4650.0f, 3000.0f, false }, { 5275.0f, 2400.0f, false },
                                      { 5950.0f, 3800.0f, false }, { 6550.0f, 3400.0f, false } };
    sono.line.count = 0;
    tipp::addStroke(sono.line, raw, 5, Sonogram::kPxPerMs, Sonogram::kPxPerHz, Sonogram::kStrokeTolPx);
    sono.onLineChanged();
    sono.hoverAt({ 524.0f, 184.0f });
}

// A song type's play button in the field guide: that type, playing, one
// phrase now. Autoplay goes on as it was set.
void MainComponent::playType(int type)
{
    setSongType(type);
    setPlaying(true);
    engine.trigger(P::indexOf(P::ap_sing_once));
}

void MainComponent::startCompare(const juce::String& otherId)
{
    const bool again = compare.running() && otherId == comparingId;
    stopCompare();
    if (drawMode)
        setDrawMode(false); // COMPARE needs autoplay's sing once
    if (again || bird == nullptr)
        return; // a second click on the same COMPARE stops it

    const auto dir = dataDir.getChildFile("birds").getChildFile(otherId);
    auto other = std::make_unique<tipp::BirdData>();
    std::string error;
    if (! tipp::parseBird(otherId.toStdString(), readText(dir.getChildFile("voice.json")).toStdString(),
                          readText(dir.getChildFile("songs.json")).toStdString(), *other, error))
    {
        loadError = strings.format("error.load", { { "bird", otherId.toUpperCase() }, { "error", juce::String(error) } });
        repaint();
        return;
    }
    compareBird = std::move(other);
    comparingId = otherId;
    compare.start(engine, bird.get(), compareBird.get(), { apOn, playing, songType }, juce::Time::getMillisecondCounterHiRes() / 1000.0);
    refreshControls();
}

void MainComponent::stopCompare()
{
    compare.cancel(engine);
    if (compareBird != nullptr)
        retired.push_back(std::move(compareBird)); // freed once the engine lets go
    if (comparingId.isNotEmpty())
    {
        comparingId = {};
        refreshControls();
    }
}

void MainComponent::setTab(int index)
{
    const int was = activeTab;
    activeTab = juce::jlimit(0, 3, index);
    if (was == activeTab)
        return;
    if (was == 2)
        leaveQuiz();
    if (was == 3)
        leaveChorus();
    const bool play = activeTab == 0;
    for (juce::Component* c : std::initializer_list<juce::Component*> {
             &plate, &maleBtn, &femaleBtn, &adultBtn, &juvBtn, &sono, &drawBtn, &shiftOffBtn, &shiftOctBtn,
             &speedBtns[0], &speedBtns[1], &speedBtns[2], &dialectBtn, &mimicsBtn,
             &apOnBtn, &holdMinusBtn, &holdPlusBtn, &latchBtn, &returnAllBtn, &singOnceBtn, &rerollBtn })
        c->setVisible(play);
    for (auto& row : scene)
        for (auto& b : row)
            b.setVisible(play);
    for (auto& k : knobs)
        k->setVisible(play);
    updateSongTools();
    guide.setVisible(activeTab == 1);
    const bool ownBird = activeTab < 2; // Play and Field guide have the list and stepper
    list.setVisible(ownBird);
    prevBtn.setVisible(ownBird);
    nextBtn.setVisible(ownBird);
    quizScreen.setVisible(activeTab == 2);
    chorusScreen.setVisible(activeTab == 3);
    if (activeTab == 2)
        enterQuiz();
    if (activeTab == 3)
        enterChorus();
    refreshControls();
}

void MainComponent::mouseUp(const juce::MouseEvent& e)
{
    for (int i = 0; i < 4; ++i)
        if (tabRects[static_cast<std::size_t>(i)].contains(e.getPosition()))
            setTab(i);
}

void MainComponent::configurePlate(Plate& p)
{
    p.language = strings.language();
    p.toVerify = strings("to_verify");
    for (const char* id : { "bill", "eye_ring", "plumage", "throat", "head", "cheek", "breast", "eye_stripe", "wing" })
        p.calloutLabels[id] = strings("plate." + juce::String(id));
    p.repaint();
}

void MainComponent::chooseScene(const juce::String& birdId, bool female, bool juvenile)
{
    for (int i = 0; i < static_cast<int>(list.birds.size()); ++i)
        if (list.birds[static_cast<std::size_t>(i)].id == birdId)
            selectBird(i);
    (female ? femaleBtn : maleBtn).onClick();
    (juvenile ? juvBtn : adultBtn).onClick();
}

juce::String MainComponent::variant() const
{
    return age == 1 ? "juvenile" : sex == 1 ? "female" : "male";
}

juce::String MainComponent::sceneSummary(bool caps) const
{
    juce::StringArray parts;
    const int values[4] = { season, timeOfDay, songType, place };
    for (int row = 0; row < 4; ++row)
        parts.add(strings(juce::String(kSceneKeys[row]) + "." + optionIds(kSceneIds[row])[values[row]]));
    if (const auto* e = currentEntry())
        parts.insert(0, Strings::upper(e->name(strings.norwegian())));
    auto s = parts.joinIntoString(", ");
    return caps ? s : Strings::lower(s);
}

void MainComponent::applyStrings()
{
    const bool no = strings.norwegian();
    enBtn.setOn(! no);
    noBtn.setOn(no);
    enBtn.setText(strings("lang.en"));
    noBtn.setText(strings("lang.no"));
    maleBtn.setText(strings("plate.male"));
    femaleBtn.setText(strings("plate.female"));
    adultBtn.setText(strings("plate.adult"));
    juvBtn.setText(strings("plate.juv"));
    drawBtn.setText(strings("song.draw"));
    shiftOffBtn.setText(strings("song.shift_off"));
    shiftOctBtn.setText(strings("song.shift_oct"));
    eraseBtn.setText(strings("song.erase"));
    clearBtn.setText(strings("song.clear"));
    singItBtn.setText(strings("song.sing_it"));
    keepBtn.setText(strings("song.keep"));
    sono.yourPhraseText = strings("song.your_phrase");
    for (int row = 0; row < 4; ++row)
    {
        const auto ids = optionIds(kSceneIds[row]);
        for (int i = 0; i < 4; ++i)
            scene[static_cast<std::size_t>(row)][static_cast<std::size_t>(i)].setText(strings(juce::String(kSceneKeys[row]) + "." + ids[i]));
    }
    dialectBtn.setText(strings("scene.dialect_none"));
    mimicsBtn.setText(strings("scene.mimics_none"));
    latchBtn.setText(strings("ap.latch"));
    returnAllBtn.setText(strings("ap.return_all"));
    singOnceBtn.setText(strings("ap.sing_once"));
    rerollBtn.setText(strings("ap.reroll"));
    for (int k = 0; k < tipp::kNumKnobs; ++k)
    {
        auto& knob = *knobs[static_cast<std::size_t>(k)];
        knob.label = strings("knob." + juce::String(P::all[static_cast<std::size_t>(k)].id));
        knob.handTag = strings("knob.hand");
        knob.comma = no;
        knob.repaint();
    }
    configurePlate(plate);
    configurePlate(guide.plate);
    guide.applyStrings();
    quizScreen.applyStrings();
    chorusScreen.applyStrings();
    if (activeTab == 2)
        updateQuizView();
    sono.nowText = strings("song.now");
    list.repaint();
    resized();
    repaint();
}

void MainComponent::refreshControls()
{
    prevBtn.setDisabled(neighbour(-1) < 0);
    nextBtn.setDisabled(neighbour(1) < 0);
    const bool on = activeTab == 2 ? quizPlaying : activeTab == 3 ? chorusPlaying : playing;
    playBtn.setOn(on);
    stopBtn.setOn(! on);
    maleBtn.setOn(sex == 0);
    femaleBtn.setOn(sex == 1);
    adultBtn.setOn(age == 0);
    juvBtn.setOn(age == 1);
    plate.setVariant(variant());

    drawBtn.setOn(drawMode);
    for (int i = 0; i < 3; ++i)
        speedBtns[static_cast<std::size_t>(i)].setOn(speedIndex == i);
    shiftOffBtn.setOn(! shiftDown);
    shiftOctBtn.setOn(shiftDown);
    const bool hasLine = sono.line.count > 0;
    eraseBtn.setOn(sono.erasing);
    eraseBtn.setDisabled(! hasLine);
    clearBtn.setDisabled(! hasLine);
    singItBtn.setDisabled(! hasLine);
    keepBtn.setDisabled(! hasLine);
    keepBtn.setOn(kept);
    updateSongTools();

    const int values[4] = { season, timeOfDay, songType, place };
    for (int row = 0; row < 4; ++row)
        for (int i = 0; i < 4; ++i)
        {
            auto& b = scene[static_cast<std::size_t>(row)][static_cast<std::size_t>(i)];
            b.setOn(values[row] == i);
            b.setDisabled(row == 2 && ! typeAvailable(i));
        }

    guide.setState({ sex, age, season, songType, comparingId });

    apOnBtn.setOn(apOn);
    apOnBtn.setText(strings(apOn ? "ap.on" : "ap.off"));
    latchBtn.setOn(latch);
    if (activeTab == 2)
        updateQuizView();
    if (activeTab == 3)
        updateChorusView();
    repaint();
}

const BirdEntry* MainComponent::headerEntry() const
{
    if (activeTab == 3)
        return nullptr; // several birds, no readout
    if (activeTab != 2)
        return currentEntry();
    if (! quiz.active() || ! quiz.answered())
        return nullptr;
    return &list.birds[static_cast<std::size_t>(quizEntries[static_cast<std::size_t>(quiz.question().bird)])];
}

void MainComponent::sendScene()
{
    engine.setBird(bird.get());
    sendChoice(P::sc_season, season);
    sendChoice(P::sc_time, timeOfDay);
    sendChoice(P::sc_type, songType);
    sendChoice(P::sc_place, place);
    sendChoice(P::sc_sex, sex);
    sendChoice(P::sc_age, age);
    sendChoice(P::ap_on, apOn ? 1 : 0);
    sendChoice(P::ap_latch, latch ? 1 : 0);
    engine.setParam(P::indexOf(P::ap_hold), hold);
    sendChoice(P::pb_speed, speedIndex);
    sendChoice(P::pb_shift, shiftDown ? 1 : 0);
    sendChoice(P::pb_draw, drawMode ? 1 : 0);
    engine.keepDrawn(kept);
    sendChoice(P::pb_play, playing ? 1 : 0);
}

// Quiz -----------------------------------------------------------------------

// Every bird with data, parsed once and kept for the run.
void MainComponent::buildQuizBirds()
{
    if (! quizData.empty())
        return;
    const auto birdsDir = dataDir.getChildFile("birds");
    for (int i = 0; i < static_cast<int>(list.birds.size()); ++i)
    {
        const auto& e = list.birds[static_cast<std::size_t>(i)];
        if (! e.available)
            continue;
        const auto dir = birdsDir.getChildFile(e.id);
        auto data = std::make_unique<tipp::BirdData>();
        std::string error;
        if (! tipp::parseBird(e.id.toStdString(), readText(dir.getChildFile("voice.json")).toStdString(),
                              readText(dir.getChildFile("songs.json")).toStdString(), *data, error))
        {
            loadError = strings.format("error.load", { { "bird", e.id.toUpperCase() }, { "error", juce::String(error) } });
            continue;
        }
        tipp::QuizBird qb;
        qb.group = list.groups.indexOf(e.group);
        qb.hasCall = data->types[tipp::kCall].present;
        quizBirds.push_back(qb);
        quizData.push_back(std::move(data));
        quizEntries.push_back(i);
        quizInfo.push_back(juce::JSON::parse(dir.getChildFile("bird.json")));
    }
    // Lookalikes with data, by id.
    for (std::size_t k = 0; k < quizBirds.size(); ++k)
        if (auto* arr = quizInfo[k]["lookalikes"].getArray())
            for (const auto& l : *arr)
                for (std::size_t j = 0; j < quizEntries.size(); ++j)
                    if (j != k && l["id"].toString() == list.birds[static_cast<std::size_t>(quizEntries[j])].id)
                        quizBirds[k].lookalikes.push_back(static_cast<int>(j));
}

void MainComponent::enterQuiz()
{
    stopCompare();
    if (! quiz.active())
        startQuiz();
    else
        stageQuestion();
}

void MainComponent::leaveQuiz()
{
    stopCompare();
    quizVoice.stop();
    quizPlaying = false;
    sendScene();
}

void MainComponent::startQuiz()
{
    stopCompare();
    buildQuizBirds();
    const auto seed = quizSeed != 0u ? quizSeed : static_cast<std::uint32_t>(juce::Random::getSystemRandom().nextInt());
    if (quiz.start(quizBirds, quizSet, quizAsk, seed))
    {
        // Snapshot hook: answer some questions first.
        for (int i = 0; i < quizSkip && ! quiz.finished(); ++i)
        {
            const auto& q = quiz.question();
            quiz.answer(i % 2 == 0 ? (q.correctSlot + 1) % q.count : q.correctSlot);
            quiz.next();
        }
        quizSkip = 0;
        stageQuestion();
    }
    else
    {
        quizVoice.stop();
        quizPlaying = false;
        engine.setParam(P::indexOf(P::pb_play), 0.0f);
        quizScreen.sono.clear();
        updateQuizView();
    }
}

void MainComponent::stageQuestion()
{
    const auto& q = quiz.question();
    hintShown = false;
    quizScreen.sono.clear();
    quizVoice.start(engine, quizData[static_cast<std::size_t>(q.bird)].get(), q.type, quizHalf);
    quizPlaying = true;
    refreshControls();
}

void MainComponent::quizAnswer(int slot)
{
    if (! quiz.active() || quiz.answered() || slot >= quiz.question().count)
        return;
    quiz.answer(slot);
    refreshControls();
}

void MainComponent::quizNext()
{
    if (! quiz.active() || ! quiz.answered())
        return;
    stopCompare();
    if (quiz.finished())
        startQuiz();
    else if (quiz.next())
        stageQuestion();
}

void MainComponent::quizPlayAgain()
{
    if (! quiz.active())
        return;
    stopCompare();
    quizPlaying = true;
    quizVoice.playAgain(engine);
    refreshControls();
}

// COMPARE BOTH: the bird asked about, then the one picked if it was wrong,
// else a lookalike among the answers, else the next answer.
void MainComponent::quizCompare()
{
    if (compare.running())
    {
        stopCompare();
        return;
    }
    if (! quiz.active() || ! quiz.answered())
        return;
    const auto& q = quiz.question();
    int other = -1;
    if (q.picked != q.correctSlot)
        other = q.answers[static_cast<std::size_t>(q.picked)];
    for (int i = 0; i < q.count && other < 0; ++i)
    {
        const int a = q.answers[static_cast<std::size_t>(i)];
        const auto& look = quizBirds[static_cast<std::size_t>(q.bird)].lookalikes;
        const auto& back = quizBirds[static_cast<std::size_t>(a)].lookalikes;
        if (a != q.bird && (std::find(look.begin(), look.end(), a) != look.end() || std::find(back.begin(), back.end(), q.bird) != back.end()))
            other = a;
    }
    if (other < 0)
        other = q.answers[static_cast<std::size_t>((q.correctSlot + 1) % q.count)];

    const auto* first = quizData[static_cast<std::size_t>(q.bird)].get();
    const auto* second = quizData[static_cast<std::size_t>(other)].get();
    const int type = second->types[static_cast<std::size_t>(q.type)].present ? q.type : tipp::kSong;
    comparingId = list.birds[static_cast<std::size_t>(quizEntries[static_cast<std::size_t>(other)])].id;
    quizPlaying = true;
    compare.start(engine, first, second, { false, true, q.type }, juce::Time::getMillisecondCounterHiRes() / 1000.0, type);
    quizScreen.sono.restart(engine.sonoWritten());
    refreshControls();
}

void MainComponent::quizOpenGuide()
{
    if (! quiz.active() || ! quiz.answered())
        return;
    const int index = quizEntries[static_cast<std::size_t>(quiz.question().bird)];
    setTab(1);
    selectBird(index);
}

juce::String MainComponent::quizName(int k) const
{
    return list.birds[static_cast<std::size_t>(quizEntries[static_cast<std::size_t>(k)])].name(strings.norwegian());
}

// The bird's own text for the type asked, then how the picked bird
// differs if the data says so. Nothing beyond bird.json.
juce::String MainComponent::quizExplain() const
{
    const auto& q = quiz.question();
    const auto& info = quizInfo[static_cast<std::size_t>(q.bird)];
    const auto text = strings.field(info["types"][q.type == tipp::kCall ? "call" : "song"]);
    const auto name = quizName(q.bird);
    if (q.picked == q.correctSlot)
        return strings.format("quiz.explain_right", { { "bird", name }, { "text", text } });

    const int pick = q.answers[static_cast<std::size_t>(q.picked)];
    auto out = strings.format("quiz.explain_wrong", { { "bird", name }, { "pick", quizName(pick) }, { "text", text } });
    auto differs = [this](const juce::var& from, int about, const juce::String& describedName) -> juce::String {
        if (auto* arr = from["lookalikes"].getArray())
            for (const auto& l : *arr)
                if (l["id"].toString() == list.birds[static_cast<std::size_t>(quizEntries[static_cast<std::size_t>(about)])].id)
                    return strings.format("quiz.differs", { { "bird", describedName }, { "text", strings.field(l["text"]) } });
        return {};
    };
    auto d = differs(info, pick, quizName(pick));
    if (d.isEmpty())
        d = differs(quizInfo[static_cast<std::size_t>(pick)], q.bird, name);
    return d.isEmpty() ? out : out + " " + d;
}

juce::String MainComponent::quizHint() const
{
    const auto& info = quizInfo[static_cast<std::size_t>(quiz.question().bird)];
    if (quizHints == 0)
        return strings.format("quiz.hint_mnemonic", { { "text", strings.field(info["mnemonic"]) } });

    // Season: the months the calendar says it sings.
    const auto sings = info["calendar"]["sings"].toString();
    const auto months = juce::StringArray::fromTokens(strings("cal.month_names"), "|", "");
    juce::StringArray yes;
    bool unknown = sings.length() != 12;
    for (int m = 0; m < sings.length() && m < 12; ++m)
    {
        if (sings[m] == 'y')
            yes.add(months[m]);
        unknown = unknown || sings[m] == '?';
    }
    auto text = yes.joinIntoString(", ");
    if (unknown)
        text = text.isEmpty() ? strings("to_verify") : text + " " + strings("to_verify");
    return strings.format("quiz.hint_season", { { "months", text } });
}

void MainComponent::updateQuizView()
{
    QuizScreen::View v;
    v.set = quizSet;
    v.ask = quizAsk;
    v.hints = quizHints;
    v.half = quizHalf;
    v.hintUsed = hintShown;
    v.total = tipp::Quiz::kQuestions;
    v.comparing = compare.running();
    for (int s = 0; s < tipp::Quiz::kNumSets; ++s)
        v.setHasBirds[static_cast<std::size_t>(s)] = ! tipp::Quiz::poolFor(quizBirds, s).empty();
    v.active = quiz.active();
    if (! v.active)
    {
        v.band = strings("quiz.no_birds");
        v.practise = strings("quiz.practise_none");
        quizScreen.setView(v);
        return;
    }

    const auto& q = quiz.question();
    v.number = quiz.questionNumber();
    v.answered = quiz.answered();
    v.finished = quiz.finished();
    v.count = q.count;
    for (int i = 0; i < q.count; ++i)
        v.names[static_cast<std::size_t>(i)] = quizName(q.answers[static_cast<std::size_t>(i)]);
    v.correctSlot = q.correctSlot;
    v.picked = q.picked;
    v.correct = quiz.correct();
    v.missed = quiz.missed();
    v.left = quiz.left();

    juce::StringArray names;
    for (int b : quiz.practise())
        names.add(Strings::lower(quizName(b)));
    if (names.isEmpty())
        v.practise = strings("quiz.practise_none");
    else
    {
        const auto joined = names.size() > 1 ? names.joinIntoString(", ", 0, names.size() - 1) + strings("quiz.and") + names[names.size() - 1] : names[0];
        v.practise = strings.format("quiz.practise", { { "birds", joined } });
    }

    const auto type = Strings::lower(strings("type." + optionIds(P::sc_type)[q.type]));
    const auto seasonText = Strings::lower(strings("season." + optionIds(P::sc_season)[quizVoice.season()]));
    const auto timeText = Strings::lower(strings("time." + optionIds(P::sc_time)[quizVoice.timeOfDay()]));
    v.caption = v.answered ? strings.format("quiz.fig_answered", { { "bird", quizName(q.bird) }, { "type", type }, { "season", seasonText }, { "time", timeText } })
                           : strings.format("quiz.fig", { { "type", type }, { "season", seasonText }, { "time", timeText } });

    if (v.answered)
    {
        v.band = quizExplain();
        if (v.finished)
            v.band += " " + strings.format("quiz.done", { { "correct", juce::String(quiz.correct()) }, { "total", juce::String(tipp::Quiz::kQuestions) } });
    }
    else
        v.band = hintShown && quizHints != 2 ? quizHint() : strings("quiz.prompt");
    quizScreen.setView(v);
    repaint(headerArea);
    repaint(statusArea);
}

// Chorus ---------------------------------------------------------------------

int MainComponent::quizIndexOf(const juce::String& id) const
{
    for (std::size_t k = 0; k < quizEntries.size(); ++k)
        if (list.birds[static_cast<std::size_t>(quizEntries[k])].id == id)
            return static_cast<int>(k);
    return -1;
}

// Lanes, entry minutes and distances from data/chorus.json, once.
void MainComponent::loadChorus()
{
    if (! chorusDoc.isVoid())
        return;
    buildQuizBirds(); // every bird with data, parsed for the run
    chorusDoc = juce::JSON::parse(dataDir.getChildFile("chorus.json"));
    if (chorusDoc.isVoid())
        loadError = strings.format("error.load", { { "bird", "CHORUS" }, { "error", "chorus.json" } });
    const auto* lanes = chorusDoc["lanes"].getArray();
    for (int i = 0; i < tipp::Chorus::kLanes; ++i)
    {
        const auto u = static_cast<std::size_t>(i);
        juce::var lane = lanes != nullptr && i < lanes->size() ? (*lanes)[i] : juce::var();
        laneDistance[u] = lane.hasProperty("distance_m") ? static_cast<float>(lane["distance_m"]) : 15.0f;
        int k = quizIndexOf(lane["bird"].toString());
        if (k < 0)
            for (int j = 0; j < static_cast<int>(quizData.size()) && k < 0; ++j)
                if (std::find(laneBird.begin(), laneBird.end(), j) == laneBird.end())
                    k = j;
        chorus.setDistance(i, laneDistance[u]);
        setLaneBird(i, k);
    }
    chorus.setSeason(chorusSeason);
    chorus.setPlace(chorusPlace);
    chorus.setSpeed(chorusSpeed);
    chorus.setSeed(static_cast<std::uint32_t>(juce::Random::getSystemRandom().nextInt()));
}

void MainComponent::setLaneBird(int lane, int k)
{
    const auto u = static_cast<std::size_t>(lane);
    laneBird[u] = k;
    if (k < 0)
    {
        chorus.setLaneBird(lane, nullptr);
        return;
    }
    const auto id = list.birds[static_cast<std::size_t>(quizEntries[static_cast<std::size_t>(k)])].id;
    const auto entries = chorusDoc["entry_min"];
    laneEntry[u] = static_cast<float>(entries.hasProperty(juce::Identifier(id)) ? entries[juce::Identifier(id)]
                                                                                : chorusDoc.getProperty("default_entry_min", -40.0));
    chorus.setEntry(lane, laneEntry[u]);
    chorus.setLaneBird(lane, quizData[static_cast<std::size_t>(k)].get());

    // The Play bird keeps the voice and phrasing knobs latched there.
    const auto* e = currentEntry();
    const bool playBird = e != nullptr && e->id == id;
    for (int knob = 0; knob < tipp::kDistance; ++knob)
    {
        const bool latched = playBird && engine.knobOverridden(knob) && engine.holdLeft(knob) < 0.0f
                          && engine.knobMode(knob) == tipp::Engine::KnobMode::Hold;
        if (latched)
            chorus.holdKnob(lane, knob, engine.knobValue(knob));
        else
            chorus.releaseKnob(lane, knob);
    }
}

// CHANGE BIRD: the next bird with sound that no other lane has.
void MainComponent::changeLaneBird(int lane)
{
    const int n = static_cast<int>(quizData.size());
    const int from = laneBird[static_cast<std::size_t>(lane)];
    for (int step = 1; step < n; ++step)
    {
        const int k = ((from < 0 ? 0 : from) + step) % n;
        if (std::find(laneBird.begin(), laneBird.end(), k) == laneBird.end())
        {
            setLaneBird(lane, k);
            break;
        }
    }
    updateChorusView();
}

void MainComponent::enterChorus()
{
    stopCompare();
    loadChorus();
    engine.setParam(P::indexOf(P::pb_play), 0.0f); // the Play bird rests
    for (int i = 0; i < tipp::Chorus::kLanes; ++i)
        setLaneBird(i, laneBird[static_cast<std::size_t>(i)]); // picks up latched knobs
    updateChorusView();
}

void MainComponent::leaveChorus()
{
    setChorusPlaying(false);
    sendScene();
}

void MainComponent::setChorusPlaying(bool on)
{
    if (on && chorus.finished())
        chorus.seek(tipp::Chorus::kStartMin);
    chorusPlaying = on;
    chorus.setPlaying(on);
    refreshControls();
}

void MainComponent::updateChorusView()
{
    ChorusScreen::View v;
    v.season = chorusSeason;
    v.place = chorusPlace;
    v.speed = chorusSpeed;
    v.canChange = quizData.size() > static_cast<std::size_t>(tipp::Chorus::kLanes);
    for (int i = 0; i < tipp::Chorus::kLanes; ++i)
    {
        const auto u = static_cast<std::size_t>(i);
        auto& lane = v.lanes[u];
        const int k = laneBird[u];
        lane.name = k >= 0 ? quizName(k) : juce::String();
        lane.entry = laneEntry[u];
        lane.distance = juce::roundToInt(laneDistance[u]);
        lane.mute = laneMute[u];
        lane.solo = laneSolo[u];
        lane.inSeason = k >= 0 && tipp::rulesFor(quizData[static_cast<std::size_t>(k)]->types[tipp::kSong], chorusSeason, 0, 0, 0).active;
    }
    chorusScreen.setView(v);
    repaint(statusArea);
}

// Timer ----------------------------------------------------------------------

void MainComponent::timerCallback()
{
    // Release a replaced bird once the audio thread has let go of it.
    retired.erase(std::remove_if(retired.begin(), retired.end(),
                                 [this](const auto& b) { return b.get() != engine.birdInUse(); }),
                  retired.end());

    for (int k = 0; k < tipp::kNumKnobs; ++k)
    {
        knobs[static_cast<std::size_t>(k)]->poll();
        const auto m = engine.knobMode(k);
        if (m == tipp::Engine::KnobMode::Held && lastModes[static_cast<std::size_t>(k)] != m)
            legendKnob = k;
        lastModes[static_cast<std::size_t>(k)] = m;
    }
    if (legendKnob >= 0 && engine.knobMode(legendKnob) == tipp::Engine::KnobMode::Auto)
    {
        legendKnob = -1;
        for (int k = 0; k < tipp::kNumKnobs; ++k)
            if (engine.knobMode(k) == tipp::Engine::KnobMode::Held || engine.knobMode(k) == tipp::Engine::KnobMode::Hold)
                legendKnob = k;
    }

    sono.poll();

    if (activeTab == 3)
    {
        chorusScreen.poll();
        if (chorusPlaying && chorus.finished())
        {
            chorusPlaying = false;
            chorus.setPlaying(false);
            refreshControls();
        }
        repaint(headerArea);
    }

    if (activeTab == 2)
    {
        quizVoice.tick(engine);
        if (quizVoice.sungCount() != quizAsks)
        {
            quizAsks = quizVoice.sungCount();
            quizScreen.sono.restart(quizVoice.startFrame());
        }
        quizScreen.sono.poll();
    }

    if (compare.running())
    {
        compare.tick(engine, juce::Time::getMillisecondCounterHiRes() / 1000.0);
        if (! compare.running())
            stopCompare();
        repaint(statusArea);
    }

    const float target = juce::jlimit(0.0f, 1.0f, engine.birdLevel() / 0.35f);
    plateOpen += (target - plateOpen) * 0.6f;
    plate.setOpen(plateOpen);
    guide.plate.setOpen(plateOpen);

    float l = 0.0f, r = 0.0f, cl = 0.0f, cr = 0.0f;
    engine.takePeaks(l, r);
    chorus.takePeaks(cl, cr);
    l = std::max(l, cl);
    r = std::max(r, cr);
    meterL = std::max(l, meterL * 0.85f);
    meterR = std::max(r, meterR * 0.85f);
    meterPeak = std::max(std::max(l, r), meterPeak * 0.97f);

    repaint(meterArea.getUnion(outReadoutArea));
    repaint(songHead);
    repaint(legendArea);

    if (snapshotFile != juce::File())
    {
        elapsed = (juce::Time::getMillisecondCounterHiRes() - snapshotStartMs) / 1000.0;
        if (snapshotKnob >= 0)
        {
            // A drag lasting half a second, 3 s before the snapshot.
            const float startAt = static_cast<float>(snapshotSeconds) - 3.0f;
            if (handPhase == 0 && elapsed >= startAt)
            {
                const auto& range = bird->knobRange[static_cast<std::size_t>(snapshotKnob)];
                engine.setParam(snapshotKnob, range.lo + 0.62f * (range.hi - range.lo));
                engine.handDown(snapshotKnob);
                handPhase = 1;
            }
            else if (handPhase == 1 && elapsed >= startAt + 0.5f)
            {
                engine.handUp(snapshotKnob);
                handPhase = 2;
            }
        }
        // Draw mode: enter it a second before, wait until the view stops,
        // then add the design's line and place the crosshair.
        if (snapshotDrawMode && elapsed >= snapshotSeconds - 1.0 && ! drawMode)
            setDrawMode(true);
        const bool drawReady = snapshotDrawMode && sono.isFrozen();
        if (drawReady && sono.line.count == 0)
            drawSampleLine();

        // Without a drag, wait for the middle of a phrase so the grey
        // "next" strokes are on screen.
        const bool midPhrase = engine.singing() && engine.phrasePosMs() > 500.0f;
        if (snapshotLeaveQuiz && activeTab >= 2 && elapsed >= snapshotSeconds - 4.0)
            setTab(0);
        if (activeTab == 2 && snapshotAnswer != 0 && elapsed >= snapshotSeconds - 1.0 && quiz.active() && ! quiz.answered())
        {
            const auto& q = quiz.question();
            quizAnswer(snapshotAnswer > 0 ? q.correctSlot : (q.correctSlot + 1) % q.count);
        }
        // Quiz: once the mystery phrase has been sung in full.
        const bool quizReady = activeTab == 2 && quizAsks > 0u && ! engine.singing()
                            && (snapshotAnswer == 0 || quiz.answered());
        const bool ready = snapshotDrawMode ? drawReady : activeTab == 2 ? quizReady : activeTab == 3 ? true : (snapshotKnob >= 0 || midPhrase);
        if (elapsed >= snapshotSeconds && (ready || elapsed > snapshotSeconds + 15.0))
        {
            const auto image = createComponentSnapshot(getLocalBounds(), true, 1.0f);
            snapshotFile.deleteFile();
            juce::FileOutputStream out(snapshotFile);
            juce::PNGImageFormat().writeImageToStream(image, out);
            out.flush();
            snapshotFile = juce::File();
            juce::JUCEApplication::getInstance()->systemRequestedQuit();
        }
    }
}

void MainComponent::runSnapshot(const juce::File& png, double seconds, int handKnob)
{
    if (activeTab == 3)
    {
        // Chorus: from the given minute, playing, a lane muted if asked.
        snapshotFile = png;
        snapshotSeconds = seconds;
        snapshotKnob = -1;
        elapsed = 0.0;
        snapshotStartMs = juce::Time::getMillisecondCounterHiRes();
        chorus.setSpeed(chorusSpeed);
        chorus.seek(chorusSnapStart);
        if (chorusSnapMute >= 0)
            chorusScreen.onMute(chorusSnapMute);
        setChorusPlaying(true);
        return;
    }
    snapshotFile = png;
    snapshotSeconds = seconds;
    snapshotKnob = handKnob;
    elapsed = 0.0;
    snapshotStartMs = juce::Time::getMillisecondCounterHiRes();
    handPhase = 0;
    setPlaying(true);
}

int MainComponent::neighbour(int dir) const
{
    const int n = static_cast<int>(list.birds.size());
    for (int i = list.selected + dir; i >= 0 && i < n; i += dir)
        if (list.birds[static_cast<std::size_t>(i)].available)
            return i;
    return -1;
}

void MainComponent::stepBird(int dir)
{
    if (const int i = neighbour(dir); i >= 0)
        selectBird(i);
}

bool MainComponent::keyPressed(const juce::KeyPress& key)
{
    if (key == juce::KeyPress::F1Key || key == juce::KeyPress::F2Key || key == juce::KeyPress::F3Key)
    {
        setTab(key == juce::KeyPress::F1Key ? 0 : key == juce::KeyPress::F2Key ? 1 : 2);
        return true;
    }
    if (key == juce::KeyPress::F4Key)
    {
        setTab(3);
        return true;
    }
    if (activeTab == 3)
    {
        // Chorus: 1 to 4 mute a lane, Space plays and stops.
        const auto c = key.getTextCharacter();
        if (c >= '1' && c <= '4')
        {
            chorusScreen.onMute(static_cast<int>(c - '1'));
            return true;
        }
        if (key == juce::KeyPress::spaceKey)
        {
            setChorusPlaying(! chorusPlaying);
            return true;
        }
        return false;
    }
    if (activeTab == 2)
    {
        // Quiz: 1 to 4 answer, Space plays again, Enter goes on.
        const auto c = key.getTextCharacter();
        if (c >= '1' && c <= '4')
        {
            quizAnswer(static_cast<int>(c - '1'));
            return true;
        }
        if (key == juce::KeyPress::spaceKey)
        {
            quizPlayAgain();
            return true;
        }
        if (key == juce::KeyPress::returnKey)
        {
            quizNext();
            return true;
        }
        return false;
    }
    if (key == juce::KeyPress::spaceKey)
    {
        setPlaying(! playing);
        return true;
    }
    if (key == juce::KeyPress::upKey || key == juce::KeyPress::downKey)
    {
        stepBird(key == juce::KeyPress::upKey ? -1 : 1);
        return true;
    }
    return false;
}

// Layout ---------------------------------------------------------------------

void MainComponent::resized()
{
    if (knobs.size() != static_cast<std::size_t>(tipp::kNumKnobs))
        return;
    auto r = getLocalBounds().reduced(1);
    headerArea = r.removeFromTop(56);
    tabsArea = r.removeFromTop(36);
    statusArea = r.removeFromBottom(28);
    bodyArea = r;

    // Header: 12px padding, items centred, 12px gaps.
    {
        auto h = headerArea.withTrimmedBottom(1).reduced(12, 0);
        const int cy = h.getCentreY();
        const int markW = std::max(56, textW(serif(32.0f).withExtraKerningFactor(0.02f), "Tipp") + 2);
        wordmarkArea = h.removeFromLeft(markW).withSizeKeepingCentre(markW, 40);
        h.removeFromLeft(24);
        playBtn.setBounds(h.getX(), cy - 16, 44, 32);
        stopBtn.setBounds(h.getX() + 43, cy - 16, 44, 32);
        h.removeFromLeft(87 + 12);
        prevBtn.setBounds(h.getX(), cy - 16, 32, 32);
        readoutArea = { h.getX() + 31, cy - 16, 280, 32 };
        nextBtn.setBounds(readoutArea.getRight() - 1, cy - 16, 32, 32);

        const int groupTop = cy - 19;
        auto right = h;
        const int outW = 72 + 96 - 1;
        const int outX = right.getRight() - outW;
        outLabelArea = { outX, groupTop, outW, 12 };
        outReadoutArea = { outX, groupTop + 14, 72, 24 };
        meterArea = { outX + 71, groupTop + 14, 96, 24 };
        const int langX = outX - 12 - 71;
        langLabelArea = { langX, groupTop, 71, 12 };
        enBtn.setBounds(langX, groupTop + 14, 36, 24);
        noBtn.setBounds(langX + 35, groupTop + 14, 36, 24);
    }

    asideArea = bodyArea.removeFromLeft(240);
    list.setBounds(asideArea.withTrimmedRight(1).reduced(8).withTrimmedTop(20));
    mainArea = bodyArea.reduced(8);
    guide.setBounds(bodyArea);
    quizScreen.setBounds(bodyArea.withX(headerArea.getX()).withWidth(headerArea.getWidth()));
    chorusScreen.setBounds(quizScreen.getBounds());

    // Tabs: widths follow their labels.
    {
        const auto label = mono(10.0f, 600, 0.14f);
        const auto keyFont = mono(10.0f, 400, 0.14f);
        int x = tabsArea.getX() + 8;
        for (int i = 0; i < 6; ++i)
        {
            const int w = 16 + textW(label, strings("tab." + juce::String(kTabKeys[i]))) + 8 + textW(keyFont, "F" + juce::String(i + 1)) + 16;
            tabRects[static_cast<std::size_t>(i)] = { x, tabsArea.getY(), w, tabsArea.getHeight() };
            x += w - 1;
        }
    }

    auto m = mainArea;
    auto displays = m.removeFromTop(384);
    m.removeFromTop(8);
    auto sceneRow = m.removeFromTop(56);
    m.removeFromTop(8);
    auto knobRow = m.removeFromTop(128);
    m.removeFromTop(8);
    apBand = m.removeFromTop(64);

    // Song panel, 710 wide, on the right.
    songPanel = displays.removeFromRight(710);
    displays.removeFromRight(8);
    platePanel = displays;

    {
        auto p = platePanel.reduced(1);
        plateHead = p.removeFromTop(28);
        plateCaption = p.removeFromBottom(18);
        plateWell = p;
        plate.setBounds(plateWell.reduced(2));

        const auto serifW = textW(serif(22.0f), currentEntry() != nullptr ? currentEntry()->name(strings.norwegian()) : juce::String());
        const int inner = plateHead.getWidth() - 16;
        const int sexW = 111, ageW = 79;
        const int gap = std::max(4, (inner - serifW - sexW - ageW) / 2);
        const int cy = plateHead.getY() + 13;
        const int ageX = plateHead.getRight() - 8 - ageW;
        const int sexX = std::min(plateHead.getX() + 8 + serifW + gap, ageX - 4 - sexW);
        layoutJoined({ sexX, cy - 10, sexW, 20 }, { &maleBtn, &femaleBtn }, { 56, 56 });
        layoutJoined({ ageX, cy - 10, ageW, 20 }, { &adultBtn, &juvBtn }, { 44, 36 });
    }

    {
        auto p = songPanel.reduced(1);
        songHead = p.removeFromTop(28);
        auto graph = p.removeFromTop(320);
        axisArea = graph.removeFromLeft(28);
        sonoArea = graph;
        sono.setBounds(sonoArea);
        timeAxis = p.removeFromTop(16);
        songCaption = p;

        // Head tools, right aligned with 12px gaps.
        songLabels.clear();
        const auto lab = mono(10.0f, 500, 0.06f);
        const int cy = songHead.getY() + 13;
        int x = songHead.getRight() - 8;
        if (drawMode)
        {
            // Draw mode: DRAW and its four tools, 6px apart.
            phraseValue = lengthValue = {};
            for (auto* b : { &keepBtn, &singItBtn, &clearBtn, &eraseBtn, &drawBtn })
            {
                const int w = textW(lab, b == &drawBtn ? strings("song.draw") : b == &eraseBtn ? strings("song.erase")
                                         : b == &clearBtn ? strings("song.clear") : b == &singItBtn ? strings("song.sing_it")
                                                          : strings("song.keep")) + 16;
                x -= w;
                b->setBounds(x, cy - 10, w, 20);
                x -= 6;
            }
        }
        else
        {
        auto takeText = [&](const juce::String& key, int w) {
            x -= w;
            songLabels.push_back({ { x, cy - 7, w, 14 }, key });
            x -= 12;
        };
        lengthValue = { x - 44, cy - 7, 44, 14 };
        x -= 44 + 12;
        takeText("song.length", textW(lab, strings("song.length")));
        phraseValue = { x - 24, cy - 7, 24, 14 };
        x -= 24 + 12;
        takeText("song.phrase", textW(lab, strings("song.phrase")));
        x -= 40 + 56 - 1;
        layoutJoined({ x, cy - 10, 95, 20 }, { &shiftOffBtn, &shiftOctBtn }, { 40, 56 });
        x -= 12;
        takeText("song.shift", textW(lab, strings("song.shift")));
        x -= 32 * 3 - 2;
        layoutJoined({ x, cy - 10, 94, 20 }, { &speedBtns[0], &speedBtns[1], &speedBtns[2] }, { 32, 32, 32 });
        x -= 12;
        takeText("song.speed", textW(lab, strings("song.speed")));
        const int drawW = textW(lab, strings("song.draw")) + 16;
        drawBtn.setBounds(x - drawW, cy - 10, drawW, 20);
        }
    }

    // Scene: 4 flexible switches, then Dialect and Mimics at 92px, 12px gaps.
    {
        sceneLabel = sceneRow.removeFromTop(14);
        sceneRow.removeFromTop(4);
        const int flex = (sceneRow.getWidth() - 2 * 92 - 5 * 12) / 4;
        int x = sceneRow.getX();
        for (int i = 0; i < 6; ++i)
        {
            const int w = i < 4 ? flex : 92;
            sceneFieldLabels[static_cast<std::size_t>(i)] = { x, sceneRow.getY(), w, 12 };
            const juce::Rectangle<int> btns(x, sceneRow.getY() + 14, w, 24);
            if (i < 4)
            {
                auto& s = scene[static_cast<std::size_t>(i)];
                layoutJoined(btns, { &s[0], &s[1], &s[2], &s[3] });
            }
            else
                (i == 4 ? dialectBtn : mimicsBtn).setBounds(btns);
            x += w + 12;
        }
    }

    // Knobs: Voice 400, Phrasing 318, Surroundings 236, spread across.
    {
        const int widths[3] = { 400, 318, 236 };
        const int first[3] = { 0, 5, 9 }, count[3] = { 5, 4, 3 };
        const int gap = (knobRow.getWidth() - 954) / 2;
        int x = knobRow.getX();
        for (int gI = 0; gI < 3; ++gI)
        {
            knobGroupLabels[static_cast<std::size_t>(gI)] = { x, knobRow.getY(), widths[gI], 14 };
            for (int i = 0; i < count[gI]; ++i)
                knobs[static_cast<std::size_t>(first[gI] + i)]->setBounds(x + i * 82, knobRow.getY() + 20,
                                                                         Knob::kWidth + Knob::kTagOverhang, Knob::kHeight);
            x += widths[gI] + gap;
        }
    }

    // Autoplay band.
    {
        auto b = apBand.reduced(1).reduced(12, 0);
        const int cy = b.getCentreY();
        const int titleW = textW(serif(22.0f), strings("ap.title"));
        apTitle = b.removeFromLeft(titleW).withSizeKeepingCentre(titleW, 24);
        b.removeFromLeft(16);
        const auto f11 = mono(11.0f, 500, 0.06f);
        const int onW = std::max(textW(f11, strings("ap.on")), textW(f11, strings("ap.off"))) + 28;
        apOnBtn.setBounds(b.removeFromLeft(onW).withSizeKeepingCentre(onW, 32));
        b.removeFromLeft(16);
        const int holdW = std::max(64 + 24 + 24 - 2, textW(mono(9.0f, 600, 0.14f), strings("ap.hold")));
        auto holdArea = b.removeFromLeft(holdW);
        holdLabel = { holdArea.getX(), cy - 19, holdW, 12 };
        holdReadout = { holdArea.getX(), cy - 5, 64, 24 };
        holdMinusBtn.setBounds(holdReadout.getRight() - 1, cy - 5, 24, 24);
        holdPlusBtn.setBounds(holdReadout.getRight() + 22, cy - 5, 24, 24);
        b.removeFromLeft(16);

        const auto f10 = mono(10.0f, 500, 0.06f);
        const int btnY = apBand.getBottom() - 1 - 11 - 24;
        for (auto* btn : { &latchBtn, &returnAllBtn, &singOnceBtn, &rerollBtn })
        {
            const int w = textW(f10, btn == &latchBtn ? strings("ap.latch") : btn == &returnAllBtn ? strings("ap.return_all")
                                     : btn == &singOnceBtn ? strings("ap.sing_once") : strings("ap.reroll")) + 20;
            btn->setBounds(b.getX(), btnY, w, 24);
            b.removeFromLeft(w + 6);
        }
        legendArea = b.withTrimmedLeft(10).withSizeKeepingCentre(b.getWidth() - 10, 34);
    }
}

// Painting -------------------------------------------------------------------

void MainComponent::paint(juce::Graphics& g)
{
    g.fillAll(colour::ground);
    paintHeader(g);
    paintTabs(g);

    // Bird list aside. Quiz and Chorus have none.
    if (activeTab < 2)
    {
        g.setColour(colour::panel);
        g.fillRect(asideArea);
        g.setColour(colour::ink);
        g.fillRect(asideArea.getRight() - 1, asideArea.getY(), 1, asideArea.getHeight());
        draw::sectionLabel(g, asideArea.withTrimmedRight(1).reduced(8).withHeight(14), strings("list.birds"));
    }

    if (activeTab == 0)
    {
        paintPanels(g);
        paintAutoplay(g);
    }
    paintStatus(g);

    g.setColour(colour::ink);
    g.drawRect(getLocalBounds(), 1);
}

void MainComponent::paintHeader(juce::Graphics& g)
{
    g.setColour(colour::ink);
    g.fillRect(headerArea.getX(), headerArea.getBottom() - 1, headerArea.getWidth(), 1);

    // Wordmark and its four-colour bar.
    g.setFont(serif(32.0f).withExtraKerningFactor(0.02f));
    g.drawText("Tipp", wordmarkArea.withHeight(32), juce::Justification::centredLeft, false);
    const juce::Rectangle<int> bar(wordmarkArea.getX(), wordmarkArea.getY() + 35, 56, 5);
    g.fillRect(bar);
    const juce::Colour tracks[4] = { colour::clay, colour::khaki, colour::sage, colour::plum };
    const auto inner = bar.reduced(1);
    for (int i = 0; i < 4; ++i)
    {
        const int x0 = inner.getX() + (inner.getWidth() + 1) * i / 4;
        const int x1 = inner.getX() + (inner.getWidth() + 1) * (i + 1) / 4 - 1;
        g.setColour(tracks[i]);
        g.fillRect(x0, inner.getY(), x1 - x0, inner.getHeight());
    }

    // Bird readout. In the quiz it waits for the answer.
    const auto* e = headerEntry();
    if (activeTab < 2 || e != nullptr)
        draw::inset(g, readoutArea);
    if (e != nullptr)
    {
        auto r = readoutArea.reduced(10, 0);
        g.setFont(mono(12.0f, 400));
        g.setColour(colour::inkSoft);
        g.drawText(e->number, r.removeFromLeft(18), juce::Justification::centredLeft, false);
        r.removeFromLeft(8);
        g.setFont(mono(11.0f, 400));
        g.drawText(e->latin, r, juce::Justification::centredRight, false);
        g.setFont(mono(12.0f, 500));
        g.setColour(colour::ink);
        g.drawText(e->name(strings.norwegian()), r, juce::Justification::centredLeft, false);
    }

    draw::fieldLabel(g, langLabelArea, strings("header.language"));
    draw::fieldLabel(g, outLabelArea, strings("header.out"));

    // Output level and meter.
    draw::inset(g, outReadoutArea);
    const float db = meterPeak > 1.0e-5f ? 20.0f * std::log10(meterPeak) : -100.0f;
    const juce::String dbText = (db <= -99.0f ? juce::String(juce::CharPointer_UTF8("\xe2\x88\x92\xe2\x88\x9e"))
                                              : number(db, 1, strings.norwegian())) + " " + strings("unit.db");
    g.setFont(mono(12.0f, 500));
    g.setColour(colour::ink);
    g.drawText(dbText, outReadoutArea.reduced(6, 0), juce::Justification::centredRight, false);

    draw::inset(g, meterArea);
    auto mr = meterArea.reduced(4, 0);
    auto width = [&](float v) {
        const float d = v > 1.0e-5f ? 20.0f * std::log10(v) : -60.0f;
        return juce::roundToInt(static_cast<float>(mr.getWidth()) * juce::jlimit(0.0f, 1.0f, (d + 60.0f) / 60.0f));
    };
    g.fillRect(mr.getX(), meterArea.getCentreY() - 7, width(meterL), 6);
    g.fillRect(mr.getX(), meterArea.getCentreY() + 1, width(meterR), 6);
}

void MainComponent::paintTabs(juce::Graphics& g)
{
    g.setColour(colour::panel);
    g.fillRect(tabsArea);
    g.setColour(colour::ink);
    g.fillRect(tabsArea.getX(), tabsArea.getBottom() - 1, tabsArea.getWidth(), 1);

    const auto label = mono(10.0f, 600, 0.14f);
    const auto key = mono(10.0f, 400, 0.14f);
    for (int i = 0; i < 6; ++i)
    {
        const auto text = strings("tab." + juce::String(kTabKeys[i]));
        const auto fkey = "F" + juce::String(i + 1);
        const int x = tabRects[static_cast<std::size_t>(i)].getX();
        const int w = tabRects[static_cast<std::size_t>(i)].getWidth();
        const bool active = i == activeTab;
        const int h = active ? 30 : 26;
        const juce::Rectangle<int> tab(x, tabsArea.getBottom() - 1 - h + (active ? 1 : 0), w, h);
        g.setColour(active ? colour::ground : colour::panel);
        g.fillRect(tab);
        if (i > 3)
            draw::hatch(g, tab); // Play, Field guide, Quiz and Chorus are built
        g.setColour(colour::ink);
        g.fillRect(tab.getX(), tab.getY(), tab.getWidth(), 1);
        g.fillRect(tab.getX(), tab.getY(), 1, tab.getHeight() - (active ? 1 : 0));
        g.fillRect(tab.getRight() - 1, tab.getY(), 1, tab.getHeight() - (active ? 1 : 0));
        if (active)
        {
            g.setColour(colour::ground);
            g.fillRect(tab.getX() + 1, tab.getBottom() - 1, tab.getWidth() - 2, 1);
        }
        g.setColour(active ? colour::ink : colour::inkSoft);
        g.setFont(label);
        auto t = tab.withTrimmedLeft(16);
        g.drawText(text, t, juce::Justification::centredLeft, false);
        g.setColour(colour::inkSoft);
        g.setFont(key);
        g.drawText(fkey, t.withTrimmedLeft(textW(label, text) + 8), juce::Justification::centredLeft, false);
    }
}

void MainComponent::paintPanels(juce::Graphics& g)
{
    const bool no = strings.norwegian();

    // Plate panel.
    draw::border(g, platePanel);
    g.setColour(colour::panel);
    g.fillRect(plateHead);
    g.setColour(colour::ink);
    g.fillRect(plateHead.getX(), plateHead.getBottom() - 1, plateHead.getWidth(), 1);
    if (const auto* e = currentEntry())
    {
        // Long names ("House sparrow") get a smaller serif instead of an ellipsis.
        const auto area = plateHead.reduced(8, 0).withRight(maleBtn.getX() - 8);
        float size = 22.0f;
        while (size > 13.0f && textW(serif(size), e->name(no)) > area.getWidth())
            size -= 1.0f;
        g.setFont(serif(size));
        g.drawFittedText(e->name(no), area, juce::Justification::centredLeft, 1, 0.85f);
    }
    {
        const auto w = plateWell.withTrimmedTop(0).withTrimmedBottom(0);
        draw::graphPaper(g, w.withTrimmedTop(0));
        g.setColour(colour::shadow);
        g.fillRect(w.getX(), w.getY(), w.getWidth(), 1);
        g.fillRect(w.getX(), w.getY(), 1, w.getHeight());
    }
    g.setColour(colour::ink);
    g.fillRect(plateCaption.getX(), plateCaption.getY(), plateCaption.getWidth(), 1);
    {
        auto c = plateCaption.withTrimmedTop(1).reduced(8, 0);
        const auto fig = mono(9.0f, 600, 0.14f);
        const auto figText = strings("fig") + " 1";
        g.setFont(fig);
        g.drawText(figText, c, juce::Justification::centredLeft, false);
        g.setFont(mono(9.0f, 400));
        g.drawFittedText(plate.caption(), c.withTrimmedLeft(textW(fig, figText) + 8), juce::Justification::centredLeft, 1, 0.8f);
    }

    // Song panel.
    draw::border(g, songPanel);
    g.setColour(colour::panel);
    g.fillRect(songHead);
    g.setColour(colour::ink);
    g.fillRect(songHead.getX(), songHead.getBottom() - 1, songHead.getWidth(), 1);
    g.setFont(serif(22.0f));
    g.drawText(strings("song.title"), songHead.reduced(8, 0), juce::Justification::centredLeft, false);
    g.setFont(mono(10.0f, 500, 0.06f));
    g.setColour(colour::inkSoft);
    for (const auto& [rect, keyName] : songLabels)
        g.drawText(strings(keyName), rect, juce::Justification::centredLeft, false);
    g.setColour(colour::ink);
    if (! drawMode)
    {
        const auto& ph = sono.lastPhrase();
        const float tempo = std::max(0.01f, engine.phraseTempo());
        g.drawText(ph.number > 0 ? juce::String(ph.number) : juce::String("-"), phraseValue, juce::Justification::centredLeft, false);
        g.drawText(ph.number > 0 ? number(ph.lengthMs / tempo / 1000.0f, 1, no) + " " + strings("unit.s") : juce::String("-"), lengthValue,
                   juce::Justification::centredLeft, false);
    }

    // kHz axis and the well's left edge.
    g.setFont(mono(9.0f, 400));
    g.setColour(colour::inkSoft);
    for (int i = 0; i < 5; ++i)
    {
        const int y = i < 4 ? axisArea.getY() + 2 + 80 * i : axisArea.getBottom() - 14;
        const auto khz = i < 4 ? strings.format("axis.khz", { { "n", juce::String(8 - 2 * i) } }) : juce::String("0");
        g.drawText(khz, juce::Rectangle<int>(axisArea.getX(), y, axisArea.getWidth() - 4, 12), juce::Justification::centredRight, false);
    }
    g.setColour(colour::ink);
    g.fillRect(sonoArea.getX() - 1, sonoArea.getY(), 1, sonoArea.getHeight());

    // Seconds axis.
    g.fillRect(timeAxis.getX() + 28, timeAxis.getY(), timeAxis.getWidth() - 28, 1);
    g.setColour(colour::inkSoft);
    for (int s = 0; s <= 8; ++s)
        g.drawText(s == 0 ? "0 " + strings("unit.s") : juce::String(s), juce::Rectangle<int>(sonoArea.getX() + 2 + 80 * s, timeAxis.getY() + 1, 60, 14),
                   juce::Justification::centredLeft, false);

    g.setColour(colour::ink);
    g.fillRect(songCaption.getX(), songCaption.getY(), songCaption.getWidth(), 1);
    {
        auto c = songCaption.withTrimmedTop(1).reduced(8, 0);
        const auto fig = mono(9.0f, 600, 0.14f);
        const auto figText = strings("fig") + " 2";
        g.setFont(fig);
        g.drawText(figText, c, juce::Justification::centredLeft, false);
        const int values[3] = { songType, season, timeOfDay };
        const char* rows[3] = { "type", "season", "time" };
        const char* ids[3] = { P::sc_type, P::sc_season, P::sc_time };
        juce::String parts[3];
        for (int i = 0; i < 3; ++i)
            parts[i] = Strings::lower(strings(juce::String(rows[i]) + "." + optionIds(ids[i])[values[i]]));
        const auto text = loadError.isNotEmpty() ? loadError
                        : drawMode ? strings("song.draw_caption")
                        : strings.format("song.caption", { { "bird", currentEntry() != nullptr ? currentEntry()->name(no) : juce::String() },
                                                           { "type", parts[0] }, { "season", parts[1] }, { "time", parts[2] } });
        g.setFont(mono(9.0f, 400));
        g.drawFittedText(text, c.withTrimmedLeft(textW(fig, figText) + 8), juce::Justification::centredLeft, 1, 0.8f);
    }

    // Scene and knob section labels.
    draw::sectionLabel(g, sceneLabel, strings("scene"));
    const char* fields[6] = { "scene.season", "scene.time", "scene.type", "scene.place", "scene.dialect", "scene.mimics" };
    for (int i = 0; i < 6; ++i)
        draw::fieldLabel(g, sceneFieldLabels[static_cast<std::size_t>(i)], strings(fields[i]));
    const char* groups[3] = { "group.voice", "group.phrasing", "group.surroundings" };
    for (int i = 0; i < 3; ++i)
        draw::sectionLabel(g, knobGroupLabels[static_cast<std::size_t>(i)], strings(groups[i]));
}

void MainComponent::paintAutoplay(juce::Graphics& g)
{
    const bool no = strings.norwegian();
    g.setColour(colour::panel);
    g.fillRect(apBand);
    draw::border(g, apBand);
    g.setColour(colour::ink);
    g.setFont(serif(22.0f));
    g.drawText(strings("ap.title"), apTitle, juce::Justification::centredLeft, false);

    draw::fieldLabel(g, holdLabel, strings("ap.hold"));
    draw::inset(g, holdReadout);
    g.setFont(mono(12.0f, 500));
    g.setColour(colour::ink);
    g.drawText(number(hold, 1, no) + " " + strings("unit.s"), holdReadout.reduced(6, 0), juce::Justification::centredRight, false);

    // Legend: the two ring colours, and the countdown for the held knob.
    const auto f = mono(10.0f, 500, 0.06f);
    g.setFont(f);
    auto line1 = legendArea.withHeight(14);
    auto line2 = line1.translated(0, 20);
    const int lx = std::max(legendArea.getX(), legendArea.getRight() - 300);
    g.setColour(colour::plum);
    g.fillRect(lx, line1.getCentreY() - 1, 18, 3);
    g.setColour(colour::ink);
    g.drawText(strings("ap.legend_auto"), line1.withLeft(lx + 26), juce::Justification::centredLeft, false);
    g.fillRect(lx, line2.getCentreY() - 1, 18, 3);

    if (legendKnob < 0)
    {
        g.drawText(strings("ap.legend_hand_any"), line2.withLeft(lx + 26), juce::Justification::centredLeft, false);
        return;
    }
    const auto knobName = strings("knob." + juce::String(P::all[static_cast<std::size_t>(legendKnob)].id));
    const auto text = strings.format("ap.legend_hand", { { "knob", knobName } });
    int x = lx + 26;
    g.drawText(text, juce::Rectangle<int>(x, line2.getY(), textW(f, text) + 2, 14), juce::Justification::centredLeft, false);
    x += textW(f, text) + 8;
    const float left = engine.holdLeft(legendKnob);
    const juce::Rectangle<int> bar(x, line2.getCentreY() - 4, 72, 8);
    g.setColour(colour::face);
    g.fillRect(bar);
    draw::border(g, bar);
    if (left >= 0.0f)
    {
        const float frac = hold > 0.0f ? juce::jlimit(0.0f, 1.0f, left / hold) : 0.0f;
        g.fillRect(bar.getX(), bar.getY(), juce::roundToInt(72.0f * frac), 8);
        g.drawText(number(left, 1, no) + " " + strings("unit.s"), juce::Rectangle<int>(bar.getRight() + 8, line2.getY(), 60, 14), juce::Justification::centredLeft, false);
    }
    else
    {
        g.fillRect(bar);
        g.drawText(strings(latch ? "ap.latched" : "ap.stays"), juce::Rectangle<int>(bar.getRight() + 8, line2.getY(), 80, 14),
                   juce::Justification::centredLeft, false);
    }
}

void MainComponent::paintStatus(juce::Graphics& g)
{
    g.setColour(colour::panel);
    g.fillRect(statusArea);
    g.setColour(colour::ink);
    g.fillRect(statusArea.getX(), statusArea.getY(), statusArea.getWidth(), 1);

    const auto f = mono(10.0f, 500, 0.06f);
    g.setFont(f);
    auto r = statusArea.withTrimmedTop(1).reduced(12, 0);
    if (activeTab == 3)
    {
        const auto state = strings(chorusPlaying ? "status.playing" : "status.stopped");
        g.drawText(state, r.removeFromLeft(textW(f, state) + 2), juce::Justification::centredLeft, false);
        r.removeFromLeft(16);
        g.setColour(colour::inkSoft);
        for (const char* k : { "chorus.keys_mute", "status.keys_play" })
        {
            const auto t = strings(k);
            g.drawText(t, r.removeFromRight(textW(f, t) + 2), juce::Justification::centredRight, false);
            r.removeFromRight(16);
        }
        const juce::String speeds[4] = { strings("chorus.speed_real"), juce::String(juce::CharPointer_UTF8("10\xc3\x97")),
                                         juce::String(juce::CharPointer_UTF8("60\xc3\x97")), strings("chorus.speed_loop") };
        const auto text = chorus.finished() ? strings("chorus.status_done")
                        : strings.format("chorus.status", { { "season", strings("season." + optionIds(P::sc_season)[chorusSeason]) },
                                                            { "place", strings("place." + optionIds(P::sc_place)[chorusPlace]) },
                                                            { "speed", speeds[chorusSpeed] } });
        g.drawText(loadError.isNotEmpty() ? loadError : text, r, juce::Justification::centredLeft, false);
        return;
    }
    if (activeTab == 2)
    {
        const auto state = strings("tab.quiz");
        g.drawText(state, r.removeFromLeft(textW(f, state) + 2), juce::Justification::centredLeft, false);
        r.removeFromLeft(16);
        g.setColour(colour::inkSoft);
        for (const char* k : { "quiz.status_keys_next", "quiz.status_keys_again", "quiz.status_keys_answer" })
        {
            const auto t = strings(k);
            g.drawText(t, r.removeFromRight(textW(f, t) + 2), juce::Justification::centredRight, false);
            r.removeFromRight(16);
        }
        const char* sets[6] = { "pairs", "garden", "forest", "coast", "night", "all" };
        const char* asks[3] = { "type.song", "type.call", "quiz.ask_both" };
        g.drawText(loadError.isNotEmpty() ? loadError : strings("quiz.set." + juce::String(sets[quizSet])) + ", " + strings(asks[quizAsk]),
                   r, juce::Justification::centredLeft, false);
        return;
    }
    const auto state = strings(playing ? "status.playing" : "status.stopped");
    g.drawText(state, r.removeFromLeft(textW(f, state) + 2), juce::Justification::centredLeft, false);
    r.removeFromLeft(14);
    g.setColour(colour::inkSoft);
    for (const char* k : { "status.keys_screen", "status.keys_bird", "status.keys_play" })
    {
        const auto t = strings(k);
        g.drawText(t, r.removeFromRight(textW(f, t) + 2), juce::Justification::centredRight, false);
        r.removeFromRight(14);
    }
    juce::String summary = sceneSummary(true);
    if (compare.running() && currentEntry() != nullptr)
        for (const auto& b : list.birds)
            if (b.id == comparingId)
                summary = strings.format("status.comparing", { { "a", Strings::upper(currentEntry()->name(strings.norwegian())) },
                                                                { "b", Strings::upper(b.name(strings.norwegian())) } });
    g.drawText(loadError.isNotEmpty() ? loadError : summary, r, juce::Justification::centredLeft, false);
}
} // namespace tipp::ui
