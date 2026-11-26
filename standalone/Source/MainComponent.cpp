#include "MainComponent.h"

#include "Params.h"

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
    playBtn.onClick = [this] { setPlaying(true); };
    stopBtn.onClick = [this] { setPlaying(false); };
    prevBtn.onClick = [this] { stepBird(-1); };
    nextBtn.onClick = [this] { stepBird(1); };
    enBtn.setText("EN");
    noBtn.setText("NO");
    enBtn.onClick = [this] { setLanguage("en"); };
    noBtn.onClick = [this] { setLanguage("no"); };
    for (auto* b : { &playBtn, &stopBtn, &prevBtn, &nextBtn, &enBtn, &noBtn })
        addAndMakeVisible(*b);

    addAndMakeVisible(list);
    list.strings = &strings;
    list.onSelect = [this](int i) { selectBird(i); };

    // Plate panel.
    addAndMakeVisible(plate);
    maleBtn.onClick = [this] { sex = 0; sendChoice(P::sc_sex, 0); refreshControls(); };
    femaleBtn.onClick = [this] { sex = 1; sendChoice(P::sc_sex, 1); refreshControls(); };
    adultBtn.onClick = [this] { age = 0; sendChoice(P::sc_age, 0); refreshControls(); };
    juvBtn.onClick = [this] { age = 1; sendChoice(P::sc_age, 1); refreshControls(); };
    for (auto* b : { &maleBtn, &femaleBtn, &adultBtn, &juvBtn })
        addAndMakeVisible(*b);

    // Song panel. Draw, speed and hearing shift come in M5.
    addAndMakeVisible(sono);
    sono.handLabel = [this](int k) {
        return strings("knob." + juce::String(P::all[static_cast<std::size_t>(k)].id)) + " " + strings("song.by_hand");
    };
    drawBtn.setDisabled(true);
    speedBtns[0].setText(juce::String(juce::CharPointer_UTF8("1\xc3\x97")));
    speedBtns[1].setText(juce::String(juce::CharPointer_UTF8("\xc2\xbd\xc3\x97")));
    speedBtns[2].setText(juce::String(juce::CharPointer_UTF8("\xc2\xbc\xc3\x97")));
    speedBtns[0].setOn(true);
    speedBtns[1].setDisabled(true);
    speedBtns[2].setDisabled(true);
    shiftOffBtn.setOn(true);
    shiftOctBtn.setDisabled(true);
    for (auto* b : { &drawBtn, &shiftOffBtn, &shiftOctBtn, &speedBtns[0], &speedBtns[1], &speedBtns[2] })
        addAndMakeVisible(*b);

    // Scene.
    for (int row = 0; row < 4; ++row)
        for (int i = 0; i < 4; ++i)
        {
            auto& b = scene[static_cast<std::size_t>(row)][static_cast<std::size_t>(i)];
            b.onClick = [this, row, i] {
                int* target[4] = { &season, &timeOfDay, &songType, &place };
                *target[row] = i;
                sendChoice(kSceneIds[row], i);
                refreshControls();
            };
            addAndMakeVisible(b);
        }
    dialectBtn.setDisabled(true); // no bird in this build has a dialect
    mimicsBtn.setDisabled(true);
    addAndMakeVisible(dialectBtn);
    addAndMakeVisible(mimicsBtn);

    // Autoplay band.
    apOnBtn.fontPx = 11.0f;
    apOnBtn.onClick = [this] { apOn = ! apOn; sendChoice(P::ap_on, apOn ? 1 : 0); refreshControls(); };
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
    singOnceBtn.onClick = [this] { engine.trigger(P::indexOf(P::ap_sing_once)); };
    rerollBtn.onClick = [this] { engine.trigger(P::indexOf(P::ap_reroll)); };
    for (auto* b : { &apOnBtn, &holdMinusBtn, &holdPlusBtn, &latchBtn, &returnAllBtn, &singOnceBtn, &rerollBtn })
        addAndMakeVisible(*b);

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
    engine.setBird(bird.get());
}

void MainComponent::getNextAudioBlock(const juce::AudioSourceChannelInfo& info)
{
    auto* buffer = info.buffer;
    float* left = buffer->getWritePointer(0, info.startSample);
    float* right = buffer->getNumChannels() > 1 ? buffer->getWritePointer(1, info.startSample) : left;
    engine.process(left, right, info.numSamples);
}

// Data -----------------------------------------------------------------------

void MainComponent::loadIndex()
{
    const auto idx = juce::JSON::parse(dataDir.getChildFile("birds").getChildFile("index.json"));
    list.groups.clear();
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
        loadError = "data/birds/index.json missing";
}

void MainComponent::selectBird(int index)
{
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
        parts.insert(0, e->name(strings.norwegian()).toUpperCase());
    auto s = parts.joinIntoString(", ");
    return caps ? s : s.toLowerCase();
}

void MainComponent::applyStrings()
{
    const bool no = strings.norwegian();
    enBtn.setOn(! no);
    noBtn.setOn(no);
    maleBtn.setText(strings("plate.male"));
    femaleBtn.setText(strings("plate.female"));
    adultBtn.setText(strings("plate.adult"));
    juvBtn.setText(strings("plate.juv"));
    drawBtn.setText(strings("song.draw"));
    shiftOffBtn.setText(strings("song.shift_off"));
    shiftOctBtn.setText(strings("song.shift_oct"));
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
    plate.language = strings.language();
    plate.toVerify = strings("to_verify");
    for (const char* id : { "bill", "eye_ring", "plumage", "throat", "head", "cheek", "breast", "eye_stripe" })
        plate.calloutLabels[id] = strings("plate." + juce::String(id));
    sono.nowText = strings("song.now");
    list.repaint();
    resized();
    repaint();
}

void MainComponent::refreshControls()
{
    prevBtn.setDisabled(neighbour(-1) < 0);
    nextBtn.setDisabled(neighbour(1) < 0);
    playBtn.setOn(playing);
    stopBtn.setOn(! playing);
    maleBtn.setOn(sex == 0);
    femaleBtn.setOn(sex == 1);
    adultBtn.setOn(age == 0);
    juvBtn.setOn(age == 1);
    plate.setVariant(variant());

    const int values[4] = { season, timeOfDay, songType, place };
    for (int row = 0; row < 4; ++row)
        for (int i = 0; i < 4; ++i)
        {
            auto& b = scene[static_cast<std::size_t>(row)][static_cast<std::size_t>(i)];
            b.setOn(values[row] == i);
            b.setDisabled(row == 2 && ! typeAvailable(i));
        }

    apOnBtn.setOn(apOn);
    apOnBtn.setText(strings(apOn ? "ap.on" : "ap.off"));
    latchBtn.setOn(latch);
    repaint();
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

    const float target = juce::jlimit(0.0f, 1.0f, engine.birdLevel() / 0.35f);
    plateOpen += (target - plateOpen) * 0.6f;
    plate.setOpen(plateOpen);

    float l = 0.0f, r = 0.0f;
    engine.takePeaks(l, r);
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
        // Without a drag, wait for the middle of a phrase so the grey
        // "next" strokes are on screen.
        const bool midPhrase = engine.singing() && engine.phrasePosMs() > 500.0f;
        if (elapsed >= snapshotSeconds && (snapshotKnob >= 0 || midPhrase || elapsed > snapshotSeconds + 15.0))
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

    // Bird list aside.
    g.setColour(colour::panel);
    g.fillRect(asideArea);
    g.setColour(colour::ink);
    g.fillRect(asideArea.getRight() - 1, asideArea.getY(), 1, asideArea.getHeight());
    draw::sectionLabel(g, asideArea.withTrimmedRight(1).reduced(8).withHeight(14), strings("list.birds"));

    paintPanels(g);
    paintAutoplay(g);
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

    // Bird readout.
    draw::inset(g, readoutArea);
    if (const auto* e = currentEntry())
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
    const juce::String dbText = db <= -99.0f ? juce::String(juce::CharPointer_UTF8("\xe2\x88\x92\xe2\x88\x9e dB"))
                                             : number(db, 1, strings.norwegian()) + " dB";
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
    int x = tabsArea.getX() + 8;
    for (int i = 0; i < 6; ++i)
    {
        const auto text = strings("tab." + juce::String(kTabKeys[i]));
        const auto fkey = "F" + juce::String(i + 1);
        const int w = 16 + textW(label, text) + 8 + textW(key, fkey) + 16;
        const bool active = i == 0;
        const int h = active ? 30 : 26;
        const juce::Rectangle<int> tab(x, tabsArea.getBottom() - 1 - h + (active ? 1 : 0), w, h);
        g.setColour(active ? colour::ground : colour::panel);
        g.fillRect(tab);
        if (! active)
            draw::hatch(g, tab); // only Play is built
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
        x += w - 1;
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
    g.setFont(serif(22.0f));
    if (const auto* e = currentEntry())
        g.drawFittedText(e->name(no), plateHead.reduced(8, 0).withRight(maleBtn.getX() - 8), juce::Justification::centredLeft, 1, 0.7f);
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
    const auto& ph = sono.lastPhrase();
    const float tempo = std::max(0.25f, engine.phraseTempo());
    g.drawText(ph.number > 0 ? juce::String(ph.number) : juce::String("-"), phraseValue, juce::Justification::centredLeft, false);
    g.drawText(ph.number > 0 ? number(ph.lengthMs / tempo / 1000.0f, 1, no) + " s" : juce::String("-"), lengthValue,
               juce::Justification::centredLeft, false);

    // kHz axis and the well's left edge.
    g.setFont(mono(9.0f, 400));
    g.setColour(colour::inkSoft);
    const char* khz[5] = { "8k", "6k", "4k", "2k", "0" };
    for (int i = 0; i < 5; ++i)
    {
        const int y = i < 4 ? axisArea.getY() + 2 + 80 * i : axisArea.getBottom() - 14;
        g.drawText(khz[i], juce::Rectangle<int>(axisArea.getX(), y, axisArea.getWidth() - 4, 12), juce::Justification::centredRight, false);
    }
    g.setColour(colour::ink);
    g.fillRect(sonoArea.getX() - 1, sonoArea.getY(), 1, sonoArea.getHeight());

    // Seconds axis.
    g.fillRect(timeAxis.getX() + 28, timeAxis.getY(), timeAxis.getWidth() - 28, 1);
    g.setColour(colour::inkSoft);
    for (int s = 0; s <= 8; ++s)
        g.drawText(s == 0 ? juce::String("0 s") : juce::String(s), juce::Rectangle<int>(sonoArea.getX() + 2 + 80 * s, timeAxis.getY() + 1, 60, 14),
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
            parts[i] = strings(juce::String(rows[i]) + "." + optionIds(ids[i])[values[i]]).toLowerCase();
        const auto text = loadError.isNotEmpty() ? loadError
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
    g.drawText(number(hold, 1, no) + " s", holdReadout.reduced(6, 0), juce::Justification::centredRight, false);

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
        g.drawText(number(left, 1, no) + " s", juce::Rectangle<int>(bar.getRight() + 8, line2.getY(), 60, 14), juce::Justification::centredLeft, false);
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
    g.drawText(loadError.isNotEmpty() ? loadError : sceneSummary(true), r, juce::Justification::centredLeft, false);
}
} // namespace tipp::ui
