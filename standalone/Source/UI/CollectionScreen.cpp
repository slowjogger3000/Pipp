#include "CollectionScreen.h"

#include <algorithm>
#include <cmath>

namespace tipp::ui
{
namespace
{
const char* const kTypeIds[4] = { "song", "call", "alarm", "flight" };
// The design's columns (32 168 70 60 150 60 and FROM, gap 12) add up to more
// than the 604px the list has, so FROM had no room: narrower, same order.
constexpr int kCols[6] = { 24, 160, 56, 44, 126, 40 };
constexpr int kColGap = 10;
constexpr int kRowH = 32;
constexpr int kTileH = 124;
constexpr double kArmMs = 4000.0;

int textW(const juce::Font& f, const juce::String& s) { return draw::textWidth(f, s); }

juce::String minutes(int s)
{
    return s > 0 ? juce::String(s / 60) + ":" + juce::String(s % 60).paddedLeft('0', 2) : juce::String(juce::CharPointer_UTF8("\xe2\x80\x93"));
}

// A section label with a count at the end, as the design's RECORDINGS ---- 3.
void labelRow(juce::Graphics& g, juce::Rectangle<int> r, const juce::String& text, const juce::String& count)
{
    const auto cf = mono(10.0f, 500, 0.06f);
    const int cw = count.isEmpty() ? 0 : textW(cf, count) + 2;
    draw::sectionLabel(g, r.withTrimmedRight(cw > 0 ? cw + 6 : 0), text);
    g.setFont(cf);
    g.setColour(colour::ink);
    g.drawText(count, r.removeFromRight(cw), juce::Justification::centredRight, false);
}

void glyphButton(juce::Graphics& g, juce::Rectangle<int> r, bool stop, bool on)
{
    if (on)
    {
        g.setColour(colour::ink);
        g.fillRect(r);
    }
    else
        draw::raised(g, r);
    g.setColour(on ? colour::onInk : colour::ink);
    const auto c = r.getCentre().toFloat();
    juce::Path p;
    if (stop)
        p.addRectangle(c.x - 4.0f, c.y - 4.0f, 8.0f, 8.0f);
    else
        p.addTriangle(c.x - 3.0f, c.y - 5.0f, c.x + 5.0f, c.y, c.x - 3.0f, c.y + 5.0f);
    g.fillPath(p);
}
} // namespace

CollectionScreen::CollectionScreen(const Strings& s, FilePlayer& p, const std::vector<BirdEntry>& birdList, const juce::StringArray& groupList)
    : strings(s), player(p), birds(birdList), groups(groupList)
{
    importBtn.onClick = [this] { chooseImport(); };
    addBtn.onClick = [this] { chooseAdd(false); };
    exportBtn.onClick = [this] { chooseExport(); };
    compareBtn.onClick = [this] { compare(); };
    openBtn.onClick = [this] {
        if (const auto* r = chosenRec(); r != nullptr && onOpenPlay)
            onOpenPlay(r->bird);
    };
    finderBtn.onClick = [this] {
        if (const auto* r = chosenRec(); r != nullptr && coll != nullptr)
            coll->file(r->audio).revealToUser();
    };
    deleteBtn.onClick = [this] { remove(); };
    prevPic.glyph = Btn::Glyph::Prev;
    nextPic.glyph = Btn::Glyph::Next;
    prevPic.onClick = [this] { if (viewing > 0) { --viewing; picArmedAt = 0.0; layoutViewer(); } };
    nextPic.onClick = [this] {
        if (viewing + 1 < static_cast<int>(shownPics().size())) { ++viewing; picArmedAt = 0.0; layoutViewer(); }
    };
    closeBtn.onClick = [this] { viewing = -1; picArmedAt = 0.0; layoutViewer(); };
    picFinderBtn.onClick = [this] {
        const auto pics = shownPics();
        if (viewing >= 0 && viewing < static_cast<int>(pics.size()) && coll != nullptr)
            coll->file(pics[static_cast<std::size_t>(viewing)].image).revealToUser();
    };
    picDeleteBtn.onClick = [this] {
        const auto pics = shownPics();
        if (viewing < 0 || viewing >= static_cast<int>(pics.size()) || coll == nullptr)
            return;
        if (picArmedAt <= 0.0)
        {
            picArmedAt = juce::Time::getMillisecondCounterHiRes();
            layoutViewer();
            return;
        }
        picArmedAt = 0.0;
        const auto id = pics[static_cast<std::size_t>(viewing)].id;
        pictureCache.erase(id);
        coll->removePicture(id);
        setMessage(strings.format("coll.deleted", { { "n", "1" } }));
        const int n = static_cast<int>(shownPics().size());
        viewing = n == 0 ? -1 : std::min(viewing, n - 1);
        layoutViewer();
        refresh();
    };
    for (auto* b : { &importBtn, &addBtn, &exportBtn, &compareBtn, &openBtn, &finderBtn, &deleteBtn })
        addAndMakeVisible(*b);
    for (auto* b : { &prevPic, &nextPic, &closeBtn, &picFinderBtn, &picDeleteBtn })
        addChildComponent(*b);
}

void CollectionScreen::setCollection(Collection* c)
{
    coll = c;
    pictureCache.clear();
    thumbCache.clear();
    chosen = {};
    viewing = -1;
    if (coll != nullptr)
        coll->load();
    refresh();
}

void CollectionScreen::applyStrings()
{
    importBtn.setText(strings("coll.import"));
    addBtn.setText(strings("coll.add_files"));
    exportBtn.setText(strings("coll.export"));
    compareBtn.setText(strings("coll.compare_tipp"));
    openBtn.setText(strings("coll.open_play"));
    finderBtn.setText(strings("coll.show_finder"));
    closeBtn.setText(strings("coll.close"));
    picFinderBtn.setText(strings("coll.show_finder"));
    resized();
    refresh();
}

void CollectionScreen::show(bool on)
{
    if (on)
    {
        if (coll != nullptr)
            coll->load();
        listToSelected = true;
        refresh();
        return;
    }
    stopAudio();
    viewing = -1;
    armedAt = picArmedAt = 0.0;
    message = {};
    layoutViewer();
}

void CollectionScreen::poll()
{
    const double t = juce::Time::getMillisecondCounterHiRes();
    if (armedAt > 0.0 && t > armedAt + kArmMs)
    {
        armedAt = 0.0;
        refresh();
    }
    if (picArmedAt > 0.0 && t > picArmedAt + kArmMs)
    {
        picArmedAt = 0.0;
        layoutViewer();
    }
    if (player.poll() || (playingId.isNotEmpty() && ! player.playing()))
    {
        // The recording ended. COMPARE WITH TIPP goes on with the bird.
        const bool sing = comparing;
        juce::String birdId;
        int type = 0;
        if (sing)
            for (const auto& r : coll != nullptr ? coll->recordings() : std::vector<CollRecording> {})
                if (r.id == playingId)
                {
                    birdId = r.bird;
                    type = r.type;
                }
        playingId = {};
        comparing = false;
        refresh();
        if (sing && birdId.isNotEmpty() && onSing)
            onSing(birdId, type);
    }
}

// --------------------------------------------------------------- data

const BirdEntry* CollectionScreen::entry(const juce::String& id) const
{
    if (id.isEmpty())
        return nullptr;
    for (const auto& b : birds)
        if (b.id == id)
            return &b;
    return nullptr;
}

juce::String CollectionScreen::name(const juce::String& id, const juce::String& latin) const
{
    if (const auto* b = entry(id))
        return b->name(strings.norwegian());
    return latin.isNotEmpty() ? latin : strings("coll.outside");
}

std::vector<CollRecording> CollectionScreen::shownRecs() const
{
    std::vector<CollRecording> out;
    if (coll != nullptr)
        for (const auto& r : coll->recordings())
            if (bird.isEmpty() || r.bird == bird)
                out.push_back(r);
    return out;
}

std::vector<CollPicture> CollectionScreen::shownPics() const
{
    std::vector<CollPicture> out;
    if (coll != nullptr)
        for (const auto& p : coll->pictures())
            if (bird.isEmpty() || p.bird == bird)
                out.push_back(p);
    return out;
}

const CollRecording* CollectionScreen::chosenRec() const
{
    if (coll == nullptr || chosen.isEmpty())
        return nullptr;
    for (const auto& r : coll->recordings())
        if (r.id == chosen && (bird.isEmpty() || r.bird == bird))
            return &r;
    return nullptr;
}

juce::String CollectionScreen::counts(const juce::String& id) const
{
    if (coll == nullptr)
        return {};
    int r = 0, p = 0;
    for (const auto& x : coll->recordings())
        r += id.isEmpty() || x.bird == id ? 1 : 0;
    for (const auto& x : coll->pictures())
        p += id.isEmpty() || x.bird == id ? 1 : 0;
    return r + p > 0 ? juce::String(r) + juce::String(juce::CharPointer_UTF8(" \xc2\xb7 ")) + juce::String(p) : juce::String();
}

juce::String CollectionScreen::statusText() const
{
    if (message.isNotEmpty())
        return message;
    const auto c = strings.format("coll.counts", { { "r", juce::String(static_cast<int>(shownRecs().size())) },
                                                   { "p", juce::String(static_cast<int>(shownPics().size())) } });
    if (const auto* b = entry(bird))
        return Strings::upper(b->name(strings.norwegian())) + ", " + c;
    return c;
}

void CollectionScreen::setMessage(const juce::String& m)
{
    message = m;
    if (onStatus)
        onStatus();
}

void CollectionScreen::setBird(const juce::String& id)
{
    bird = id;
    message = {};
    armedAt = 0.0;
    rowScroll = picScroll = 0;
    viewing = -1;
    layoutViewer();
    if (chosenRec() == nullptr)
        chosen = {};
    listToSelected = true;
    refresh();
}

void CollectionScreen::step(int dir)
{
    juce::StringArray ids;
    ids.add({});
    for (const auto& grp : groups)
        for (const auto& b : birds)
            if (b.group == grp)
                ids.add(b.id);
    const int i = std::max(0, ids.indexOf(bird));
    const int n = juce::jlimit(0, ids.size() - 1, i + dir);
    if (n != i)
        setBird(ids[n]);
}

void CollectionScreen::refresh()
{
    const auto recs = shownRecs();
    const auto pics = shownPics();
    importBtn.setDisabled(coll == nullptr);
    addBtn.setDisabled(coll == nullptr);
    exportBtn.setDisabled(recs.empty() && pics.empty());
    const auto* c = chosenRec();
    const bool sound = c != nullptr && entry(c->bird) != nullptr && entry(c->bird)->available;
    compareBtn.setDisabled(! sound);
    compareBtn.setOn(comparing);
    openBtn.setDisabled(! sound);
    finderBtn.setDisabled(c == nullptr);
    deleteBtn.setDisabled(c == nullptr);
    deleteBtn.setOn(armedAt > 0.0);
    deleteBtn.setText(armedAt > 0.0 ? strings.format("coll.delete_confirm", { { "n", "1" } }) : strings("coll.delete"));
    resized();
    repaint();
    if (onStatus)
        onStatus();
}

// --------------------------------------------------------------- actions

void CollectionScreen::stopAudio()
{
    player.stop();
    playingId = {};
    comparing = false;
}

void CollectionScreen::play(const CollRecording& r, bool thenSing)
{
    const bool again = playingId == r.id && ! thenSing;
    stopAudio();
    if (again || coll == nullptr)
    {
        refresh();
        return;
    }
    std::unique_ptr<juce::AudioFormatReader> reader(coll->formats().createReaderFor(coll->file(r.audio)));
    if (reader == nullptr || ! player.start(*reader))
    {
        setMessage(strings("coll.cannot_play_mac"));
        refresh();
        return;
    }
    playingId = r.id;
    comparing = thenSing;
    refresh();
}

void CollectionScreen::compare()
{
    if (const auto* r = chosenRec())
    {
        if (comparing)
        {
            stopAudio();
            refresh();
            return;
        }
        const auto copy = *r;
        play(copy, true);
    }
}

void CollectionScreen::remove()
{
    const auto* r = chosenRec();
    if (r == nullptr || coll == nullptr)
        return;
    if (armedAt <= 0.0)
    {
        armedAt = juce::Time::getMillisecondCounterHiRes();
        refresh();
        return;
    }
    armedAt = 0.0;
    const auto id = r->id;
    if (playingId == id)
        stopAudio();
    thumbCache.erase(id);
    coll->removeRecording(id);
    chosen = {};
    setMessage(strings.format("coll.deleted", { { "n", "1" } }));
    refresh();
}

void CollectionScreen::importFile(const juce::File& zip)
{
    if (coll == nullptr)
        return;
    const auto r = coll->importExport(zip);
    if (r.errorKey.isNotEmpty())
        setMessage(strings.format("coll.import_failed", { { "why", strings(r.errorKey) } }));
    else
    {
        auto m = strings.format("coll.imported", { { "r", juce::String(r.recordings) }, { "p", juce::String(r.pictures) }, { "k", juce::String(r.known) } });
        if (r.broken > 0)
            m += "; " + strings.format("coll.import_broken", { { "n", juce::String(r.broken) } });
        setMessage(m);
    }
    refresh();
}

void CollectionScreen::afterAdd(const Collection::AddResult& r)
{
    setMessage(strings.format(r.skipped > 0 ? "coll.added_skipped" : "coll.added",
                              { { "n", juce::String(r.added) }, { "k", juce::String(r.skipped) } }));
    refresh();
}

void CollectionScreen::addFile(const juce::File& f)
{
    if (coll == nullptr)
        return;
    juce::Array<juce::File> files;
    files.add(f);
    afterAdd(coll->addFiles(files, bird.isNotEmpty() ? bird : playBird ? playBird() : juce::String()));
}

bool CollectionScreen::exportFile(const juce::File& zip)
{
    if (coll == nullptr)
        return false;
    const bool ok = coll->exportTo(zip, shownRecs(), shownPics());
    setMessage(ok ? strings.format("coll.export_saved", { { "file", zip.getFileName() } }) : strings("coll.export_failed"));
    return ok;
}

void CollectionScreen::chooseImport()
{
    chooser = std::make_unique<juce::FileChooser>(strings("coll.import"), juce::File::getSpecialLocation(juce::File::userHomeDirectory).getChildFile("Downloads"), "*.zip");
    chooser->launchAsync(juce::FileBrowserComponent::openMode | juce::FileBrowserComponent::canSelectFiles, [this](const juce::FileChooser& fc) {
        if (fc.getResult() != juce::File())
            importFile(fc.getResult());
    });
}

void CollectionScreen::chooseAdd(bool picturesOnly)
{
    const juce::String audio = "*.m4a;*.mp3;*.wav;*.aif;*.aiff;*.caf;*.aac;*.flac", images = "*.jpg;*.jpeg;*.png;*.heic;*.heif;*.webp;*.gif";
    chooser = std::make_unique<juce::FileChooser>(strings(picturesOnly ? "coll.add_picture" : "coll.add_files"), juce::File(),
                                                  picturesOnly ? images : audio + ";" + images);
    chooser->launchAsync(juce::FileBrowserComponent::openMode | juce::FileBrowserComponent::canSelectFiles | juce::FileBrowserComponent::canSelectMultipleItems,
                         [this](const juce::FileChooser& fc) {
                             if (coll == nullptr || fc.getResults().isEmpty())
                                 return;
                             afterAdd(coll->addFiles(fc.getResults(), bird.isNotEmpty() ? bird : playBird ? playBird() : juce::String()));
                         });
}

void CollectionScreen::chooseExport()
{
    const auto name = "tipp-export-" + Collection::now().substring(0, 10) + ".zip";
    chooser = std::make_unique<juce::FileChooser>(strings("coll.export"), juce::File::getSpecialLocation(juce::File::userHomeDirectory).getChildFile("Downloads").getChildFile(name), "*.zip");
    chooser->launchAsync(juce::FileBrowserComponent::saveMode | juce::FileBrowserComponent::canSelectFiles | juce::FileBrowserComponent::warnAboutOverwriting,
                         [this](const juce::FileChooser& fc) {
                             if (fc.getResult() != juce::File())
                                 exportFile(fc.getResult());
                         });
}

void CollectionScreen::chooseRow(int index)
{
    const auto recs = shownRecs();
    if (index >= 0 && index < static_cast<int>(recs.size()))
    {
        chosen = recs[static_cast<std::size_t>(index)].id;
        refresh();
    }
}

void CollectionScreen::openPicture(int index)
{
    if (index >= 0 && index < static_cast<int>(shownPics().size()))
    {
        viewing = index;
        picArmedAt = 0.0;
        layoutViewer();
    }
}

bool CollectionScreen::viewerKey(const juce::KeyPress& key)
{
    if (viewing < 0)
        return false;
    if (key == juce::KeyPress::escapeKey)
        closeBtn.onClick();
    else if (key == juce::KeyPress::leftKey)
        prevPic.onClick();
    else if (key == juce::KeyPress::rightKey)
        nextPic.onClick();
    else
        return false;
    return true;
}

// Pictures are loaded once and kept at most 1200px on the long side. HEIC
// and other formats JUCE cannot read give an empty image, drawn hatched.
juce::Image CollectionScreen::picture(const CollPicture& p)
{
    if (auto it = pictureCache.find(p.id); it != pictureCache.end())
        return it->second;
    auto img = coll != nullptr ? juce::ImageFileFormat::loadFrom(coll->file(p.image)) : juce::Image();
    if (img.isValid() && std::max(img.getWidth(), img.getHeight()) > 1200)
    {
        const double k = 1200.0 / std::max(img.getWidth(), img.getHeight());
        img = img.rescaled(juce::roundToInt(img.getWidth() * k), juce::roundToInt(img.getHeight() * k), juce::Graphics::highResamplingQuality);
    }
    pictureCache[p.id] = img;
    return img;
}

juce::Image CollectionScreen::thumb(const CollRecording& r)
{
    if (auto it = thumbCache.find(r.id); it != thumbCache.end())
        return it->second;
    auto img = coll != nullptr && r.thumb.isNotEmpty() ? juce::ImageFileFormat::loadFrom(coll->file(r.thumb)) : juce::Image();
    thumbCache[r.id] = img;
    return img;
}

// --------------------------------------------------------------- layout

void CollectionScreen::resized()
{
    auto r = getLocalBounds();
    aside = r.removeFromLeft(240);
    auto a = aside.withTrimmedRight(1).reduced(8);
    listLabel = a.removeFromTop(14);
    a.removeFromTop(6);
    listArea = a;

    main = r.reduced(8);
    auto m = main;
    head = m.removeFromTop(28);
    {
        auto h = head;
        const auto f = mono(10.0f, 500, 0.06f);
        for (auto* b : { &exportBtn, &addBtn, &importBtn })
        {
            const int w = textW(f, Strings::upper(b == &exportBtn ? strings("coll.export") : b == &addBtn ? strings("coll.add_files") : strings("coll.import"))) + 22;
            b->setBounds(h.removeFromRight(w).withSizeKeepingCentre(w, 24));
            h.removeFromRight(12);
        }
    }
    m.removeFromTop(8);
    note = m.removeFromBottom(32);
    m.removeFromBottom(8);
    auto picCol = m.removeFromRight(404);
    m.removeFromRight(12);
    auto recCol = m;

    recLabel = recCol.removeFromTop(14);
    recCol.removeFromTop(6);
    auto acts = recCol.removeFromBottom(24);
    recCol.removeFromBottom(6);
    sheet = recCol;
    sheetHead = sheet.reduced(1).removeFromTop(24);
    rowsArea = sheet.reduced(1).withTrimmedTop(25);
    {
        const auto f = mono(10.0f, 500, 0.06f);
        for (auto* b : { &compareBtn, &openBtn, &finderBtn })
        {
            const int w = textW(f, b == &compareBtn ? strings("coll.compare_tipp") : b == &openBtn ? strings("coll.open_play") : strings("coll.show_finder")) + 22;
            b->setBounds(acts.removeFromLeft(w));
            acts.removeFromLeft(6);
        }
        const int w = std::max(textW(f, strings("coll.delete")), textW(f, strings.format("coll.delete_confirm", { { "n", "1" } }))) + 22;
        deleteBtn.setBounds(acts.removeFromLeft(w));
    }

    picLabel = picCol.removeFromTop(14);
    picCol.removeFromTop(6);
    grid = picCol;
    layoutViewer();
}

void CollectionScreen::layoutViewer()
{
    const bool open = viewing >= 0 && viewing < static_cast<int>(shownPics().size());
    if (! open)
        viewing = -1;
    viewerArea = main;
    auto v = viewerArea.reduced(8);
    viewerHead = v.removeFromTop(28);
    v.removeFromTop(8);
    viewerImage = v;
    auto h = viewerHead;
    const auto f = mono(10.0f, 500, 0.06f);
    const auto del = picArmedAt > 0.0 ? strings.format("coll.delete_confirm", { { "n", "1" } }) : strings("coll.delete");
    picDeleteBtn.setText(del);
    picDeleteBtn.setOn(picArmedAt > 0.0);
    picDeleteBtn.setBounds(h.removeFromRight(textW(f, del) + 22).withSizeKeepingCentre(textW(f, del) + 22, 24));
    h.removeFromRight(6);
    const int fw = textW(f, strings("coll.show_finder")) + 22;
    picFinderBtn.setBounds(h.removeFromRight(fw).withSizeKeepingCentre(fw, 24));
    h.removeFromRight(6);
    const int cw = textW(f, strings("coll.close")) + 22;
    closeBtn.setBounds(h.removeFromRight(cw).withSizeKeepingCentre(cw, 24));
    h.removeFromRight(12);
    nextPic.setBounds(h.removeFromRight(32).withSizeKeepingCentre(32, 24));
    prevPic.setBounds(h.removeFromRight(32).withSizeKeepingCentre(32, 24).translated(1, 0));
    const int n = static_cast<int>(shownPics().size());
    prevPic.setDisabled(viewing <= 0);
    nextPic.setDisabled(viewing + 1 >= n);
    for (auto* b : { &prevPic, &nextPic, &closeBtn, &picFinderBtn, &picDeleteBtn })
    {
        b->setVisible(open);
        if (open)
            b->toFront(false);
    }
    for (auto* b : { &importBtn, &addBtn, &exportBtn, &compareBtn, &openBtn, &finderBtn, &deleteBtn })
        b->setVisible(! open);
    repaint();
}

// --------------------------------------------------------------- painting

void CollectionScreen::paint(juce::Graphics& g)
{
    g.fillAll(colour::ground);
    paintList(g);
    if (viewing >= 0)
    {
        paintViewer(g);
        return;
    }

    // Head: the bird's name, its other name and Latin name.
    const auto* b = entry(bird);
    const auto title = b != nullptr ? b->name(strings.norwegian()) : strings("coll.all_birds_row");
    g.setColour(colour::ink);
    g.setFont(serif(28.0f));
    const int tw = textW(serif(28.0f), title) + 2;
    g.drawText(title, head.withWidth(tw), juce::Justification::centredLeft, false);
    if (b != nullptr)
    {
        g.setFont(mono(11.0f, 400));
        g.setColour(colour::inkSoft);
        const auto sub = b->name(! strings.norwegian()) + juce::String(juce::CharPointer_UTF8(" \xc2\xb7 ")) + b->latin;
        g.drawText(sub, head.withTrimmedLeft(tw + 12).withRight(importBtn.getX() - 12), juce::Justification::centredLeft, true);
    }

    paintRecordings(g);
    paintPictures(g);

    g.setFont(mono(11.0f, 400));
    g.setColour(colour::inkSoft);
    g.drawFittedText(strings("coll.desk_note"), note, juce::Justification::centredLeft, 2, 1.0f);
}

int CollectionScreen::listContentHeight() const
{
    int h = 24;
    for (const auto& grp : groups)
    {
        h += 24;
        for (const auto& b : birds)
            h += b.group == grp ? 24 : 0;
    }
    return h;
}

void CollectionScreen::paintList(juce::Graphics& g)
{
    g.setColour(colour::panel);
    g.fillRect(aside);
    g.setColour(colour::ink);
    g.fillRect(aside.getRight() - 1, aside.getY(), 1, aside.getHeight());
    labelRow(g, listLabel, strings("list.birds"), strings("coll.rec_pic"));

    draw::inset(g, listArea, colour::sheet);
    const int view = listArea.getHeight() - 2, content = listContentHeight();

    // Bring the bird shown into view after a change.
    if (listToSelected)
    {
        listToSelected = false;
        int y = 0, top = 0;
        if (bird.isNotEmpty())
        {
            y = 24;
            for (const auto& grp : groups)
            {
                y += 24;
                for (const auto& e : birds)
                {
                    if (e.group != grp)
                        continue;
                    if (e.id == bird)
                        top = y;
                    y += 24;
                }
            }
        }
        if (top - 24 < listScroll)
            listScroll = top - 24;
        else if (top + 24 > listScroll + view)
            listScroll = top + 24 - view;
    }
    listScroll = juce::jlimit(0, std::max(0, content - view), listScroll);

    juce::Graphics::ScopedSaveState save(g);
    g.reduceClipRegion(listArea.reduced(1));
    listRows.clear();
    const bool no = strings.norwegian();
    int y = listArea.getY() + 1 - listScroll;
    const int x = listArea.getX() + 1, w = listArea.getWidth() - 2;
    auto row = [&](const juce::String& id, const juce::String& number, const juce::String& label) {
        const juce::Rectangle<int> r(x, y, w, 24);
        listRows.push_back({ r, id });
        const bool sel = id == bird;
        if (sel)
        {
            g.setColour(colour::ink);
            g.fillRect(r);
        }
        const auto c = counts(id);
        g.setFont(mono(11.0f, 400));
        g.setColour(sel ? colour::onInk : colour::inkSoft);
        const int cw = c.isEmpty() ? 0 : textW(mono(11.0f, 400), c) + 2;
        g.drawText(c, r.withTrimmedRight(8 + (content > view ? 6 : 0)).removeFromRight(cw), juce::Justification::centredRight, false);
        auto t = r.withTrimmedLeft(8).withTrimmedRight(8 + cw + 8);
        g.setFont(mono(13.0f, 400));
        if (number.isNotEmpty())
        {
            g.drawText(number, t.removeFromLeft(20), juce::Justification::centredLeft, false);
            t.removeFromLeft(8);
        }
        g.setColour(sel ? colour::onInk : colour::ink);
        g.drawFittedText(label, t, juce::Justification::centredLeft, 1, 0.8f);
        y += 24;
    };
    row({}, {}, strings("coll.all_birds_row"));
    for (const auto& grp : groups)
    {
        const juce::Rectangle<int> h(x, y, w, 24);
        g.setColour(colour::panel);
        g.fillRect(h);
        g.setColour(colour::divider);
        g.fillRect(h.getX(), h.getY(), h.getWidth(), 1);
        g.fillRect(h.getX(), h.getBottom() - 1, h.getWidth(), 1);
        g.setColour(colour::inkSoft);
        g.setFont(mono(9.0f, 600, 0.14f));
        g.drawText(strings("group." + grp), h.withTrimmedLeft(8), juce::Justification::centredLeft, false);
        y += 24;
        for (const auto& e : birds)
            if (e.group == grp)
                row(e.id, e.number, e.name(no));
    }
    if (content > view)
    {
        const int hgt = std::max(24, view * view / content);
        const int t = listArea.getY() + 1 + (view - hgt) * listScroll / (content - view);
        g.setColour(colour::shadow);
        g.fillRect(listArea.getRight() - 1 - 5, t, 4, hgt);
    }
}

void CollectionScreen::paintRecordings(juce::Graphics& g)
{
    const auto recs = shownRecs();
    labelRow(g, recLabel, strings("coll.recordings"), juce::String(static_cast<int>(recs.size())));
    draw::inset(g, sheet, colour::sheet);

    // Header row on panel.
    g.setColour(colour::panel);
    g.fillRect(sheetHead);
    g.setColour(colour::ink);
    g.fillRect(sheetHead.getX(), sheetHead.getBottom(), sheetHead.getWidth(), 1);
    auto columns = [](juce::Rectangle<int> r) {
        std::array<juce::Rectangle<int>, 7> c;
        auto in = r.reduced(8, 0);
        for (std::size_t i = 0; i < 6; ++i)
        {
            c[i] = in.removeFromLeft(kCols[i]);
            in.removeFromLeft(kColGap);
        }
        c[6] = in;
        return c;
    };
    {
        const auto c = columns(sheetHead);
        const char* keys[7] = { nullptr, "coll.col_sonogram", "coll.col_heard", "coll.col_length", "coll.col_date", "coll.col_match",
                                bird.isEmpty() ? "coll.col_bird" : "coll.col_from" };
        g.setFont(mono(9.0f, 600, 0.14f));
        g.setColour(colour::inkSoft);
        for (std::size_t i = 1; i < 7; ++i)
            g.drawText(strings(keys[i]), c[i], juce::Justification::centredLeft, true);
    }

    const int content = static_cast<int>(recs.size()) * kRowH;
    rowScroll = juce::jlimit(0, std::max(0, content - rowsArea.getHeight()), rowScroll);
    juce::Graphics::ScopedSaveState save(g);
    g.reduceClipRegion(rowsArea);
    recRows.clear();
    const bool no = strings.norwegian();
    for (int i = 0; i < static_cast<int>(recs.size()); ++i)
    {
        const auto& r = recs[static_cast<std::size_t>(i)];
        const juce::Rectangle<int> row(rowsArea.getX(), rowsArea.getY() + i * kRowH - rowScroll, rowsArea.getWidth(), kRowH);
        if (row.getBottom() < rowsArea.getY() || row.getY() > rowsArea.getBottom())
            continue;
        recRows.push_back({ row, i });
        const bool sel = r.id == chosen;
        if (sel)
        {
            g.setColour(colour::ink);
            g.fillRect(row);
        }
        g.setColour(colour::divider);
        g.fillRect(row.getX(), row.getBottom() - 1, row.getWidth(), 1);
        const auto c = columns(row.withTrimmedBottom(1));
        glyphButton(g, c[0].withSizeKeepingCentre(24, 24), playingId == r.id, playingId == r.id);
        const auto well = c[1].withSizeKeepingCentre(160, 24);
        g.setColour(colour::face);
        g.fillRect(well);
        if (const auto img = thumb(r); img.isValid())
            g.drawImage(img, well.reduced(1).toFloat(), juce::RectanglePlacement::stretchToFit);
        else
            draw::hatch(g, well.reduced(1));
        draw::border(g, well);

        g.setFont(mono(13.0f, 400));
        g.setColour(sel ? colour::onInk : colour::ink);
        g.drawText(strings("type." + juce::String(kTypeIds[juce::jlimit(0, 3, r.type)])), c[2], juce::Justification::centredLeft, true);
        g.drawText(minutes(r.seconds), c[3], juce::Justification::centredLeft, false);
        g.drawText(r.date, c[4], juce::Justification::centredLeft, true);
        g.drawText(r.confidence >= 0.0f ? number(std::round(r.confidence * 100.0f), 0, no) + " %" : juce::String(juce::CharPointer_UTF8("\xe2\x80\x93")),
                   c[5], juce::Justification::centredLeft, false);
        const auto last = bird.isEmpty() ? name(r.bird, r.latin) : strings(r.from == "file" ? "coll.from_file" : "coll.from_phone");
        g.drawText(last, c[6], juce::Justification::centredLeft, true);
    }
    if (content > rowsArea.getHeight())
    {
        const int view = rowsArea.getHeight();
        const int hgt = std::max(24, view * view / content);
        g.setColour(colour::shadow);
        g.fillRect(rowsArea.getRight() - 5, rowsArea.getY() + (view - hgt) * rowScroll / (content - view), 4, hgt);
    }
}

void CollectionScreen::paintPictures(juce::Graphics& g)
{
    const auto pics = shownPics();
    labelRow(g, picLabel, strings("coll.pictures"), juce::String(static_cast<int>(pics.size())));
    const int n = static_cast<int>(pics.size()) + 1; // ADD PICTURE last
    const int rows = (n + 2) / 3;
    const int content = rows * (kTileH + 6) - 6;
    picScroll = juce::jlimit(0, std::max(0, content - grid.getHeight()), picScroll);
    juce::Graphics::ScopedSaveState save(g);
    g.reduceClipRegion(grid);
    picTiles.clear();
    for (int i = 0; i < n; ++i)
    {
        const int col = i % 3, rowI = i / 3;
        const int x0 = grid.getX() + (grid.getWidth() + 6) * col / 3;
        const int x1 = grid.getX() + (grid.getWidth() + 6) * (col + 1) / 3 - 6;
        const juce::Rectangle<int> t(x0, grid.getY() + rowI * (kTileH + 6) - picScroll, x1 - x0, kTileH);
        if (t.getBottom() < grid.getY() || t.getY() > grid.getBottom())
            continue;
        if (i == n - 1)
        {
            picTiles.push_back({ t, -1 });
            draw::raised(g, t);
            g.setColour(colour::ink);
            g.setFont(mono(22.0f, 400));
            g.drawText("+", t.withTrimmedBottom(18), juce::Justification::centred, false);
            g.setFont(mono(10.0f, 500, 0.06f));
            g.drawText(strings("coll.add_picture"), t.withTrimmedTop(32), juce::Justification::centred, false);
            continue;
        }
        picTiles.push_back({ t, i });
        const auto& p = pics[static_cast<std::size_t>(i)];
        g.setColour(colour::panel);
        g.fillRect(t);
        auto cap = t.reduced(1).removeFromBottom(16);
        const auto img = picture(p);
        {
            juce::Graphics::ScopedSaveState s2(g);
            g.reduceClipRegion(t.reduced(1));
            if (img.isValid())
                g.drawImage(img, t.reduced(1).toFloat(), juce::RectanglePlacement::fillDestination);
            else
                draw::hatch(g, t.reduced(1));
        }
        g.setColour(colour::face);
        g.fillRect(cap);
        g.setColour(colour::ink);
        g.fillRect(cap.getX(), cap.getY() - 1, cap.getWidth(), 1);
        g.setFont(mono(9.0f, 400));
        const auto text = p.date.substring(0, 10) + (bird.isEmpty() ? " " + name(p.bird) : juce::String());
        g.drawText(text, cap.reduced(4, 0), juce::Justification::centredLeft, true);
        draw::border(g, t);
    }
}

void CollectionScreen::paintViewer(juce::Graphics& g)
{
    const auto pics = shownPics();
    if (viewing < 0 || viewing >= static_cast<int>(pics.size()))
        return;
    const auto& p = pics[static_cast<std::size_t>(viewing)];
    draw::inset(g, viewerArea, colour::sheet);
    g.setColour(colour::ink);
    const auto title = name(p.bird);
    g.setFont(serif(22.0f));
    const int tw = textW(serif(22.0f), title) + 2;
    g.drawText(title, viewerHead.withWidth(tw), juce::Justification::centredLeft, false);
    g.setFont(mono(11.0f, 400));
    g.setColour(colour::inkSoft);
    g.drawText(p.date + "   " + juce::String(viewing + 1) + " / " + juce::String(static_cast<int>(pics.size())),
               viewerHead.withTrimmedLeft(tw + 12).withRight(prevPic.getX() - 12), juce::Justification::centredLeft, true);

    const auto img = picture(p);
    if (img.isValid())
    {
        const auto fit = juce::RectanglePlacement(juce::RectanglePlacement::centred | juce::RectanglePlacement::onlyReduceInSize)
                             .appliedTo(img.getBounds().toFloat(), viewerImage.reduced(1).toFloat())
                             .getSmallestIntegerContainer();
        g.drawImage(img, fit.toFloat(), juce::RectanglePlacement::stretchToFit);
        draw::border(g, fit.expanded(1));
    }
    else
    {
        const auto box = viewerImage.withSizeKeepingCentre(std::min(viewerImage.getWidth(), 480), std::min(viewerImage.getHeight(), 320));
        g.setColour(colour::face);
        g.fillRect(box);
        draw::hatch(g, box);
        draw::border(g, box);
        g.setFont(mono(10.0f, 500, 0.06f));
        g.setColour(colour::inkSoft);
        g.drawText(strings("coll.cannot_show"), box, juce::Justification::centred, false);
    }
}

// --------------------------------------------------------------- mouse

void CollectionScreen::mouseUp(const juce::MouseEvent& e)
{
    const auto pos = e.getPosition();
    if (e.mouseWasDraggedSinceMouseDown())
        return;
    for (const auto& [r, id] : listRows)
        if (r.contains(pos) && listArea.reduced(1).contains(pos))
        {
            setBird(id);
            return;
        }
    if (viewing >= 0)
        return;
    const auto recs = shownRecs();
    for (const auto& [r, i] : recRows)
        if (r.contains(pos) && rowsArea.contains(pos))
        {
            const auto& rec = recs[static_cast<std::size_t>(i)];
            if (chosen != rec.id)
                armedAt = 0.0;
            chosen = rec.id;
            const juce::Rectangle<int> playBtn(r.getX() + 8, r.getY() + 4, 24, 24);
            if (playBtn.contains(pos))
                play(rec, false);
            else
                refresh();
            return;
        }
    for (const auto& [t, i] : picTiles)
        if (t.contains(pos) && grid.contains(pos))
        {
            if (i < 0)
                chooseAdd(true);
            else
                openPicture(i);
            return;
        }
}

void CollectionScreen::mouseWheelMove(const juce::MouseEvent& e, const juce::MouseWheelDetails& w)
{
    const int d = juce::roundToInt(w.deltaY * 24.0f * 8.0f);
    const auto pos = e.getPosition();
    if (listArea.contains(pos))
        listScroll -= d;
    else if (viewing < 0 && rowsArea.contains(pos))
        rowScroll -= d;
    else if (viewing < 0 && grid.contains(pos))
        picScroll -= d;
    else
        return;
    repaint();
}
} // namespace tipp::ui
