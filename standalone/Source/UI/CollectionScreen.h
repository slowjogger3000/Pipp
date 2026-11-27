#pragma once

// COLLECTION (F6) on the Mac, from design/DeskCollection.dc.html, the same
// screen as the web app's (web/src/ui/deskcollection.ts). The whole body: a
// bird list with recording and picture counts, then the bird's name, IMPORT
// FROM PHONE EXPORT, ADD FILES and EXPORT; the recordings on sheet (play,
// sonogram, heard, length, date, match, from) with COMPARE WITH PIPP, OPEN IN
// PLAY, SHOW IN FINDER and DELETE under them; the pictures in 3 columns with
// ADD PICTURE last, and the note.
//
// Choices as in the web app: ALL BIRDS first, where the last column names
// the bird; a row is chosen by a click; DELETE asks once more (DELETE 1?);
// COMPARE WITH PIPP plays the recording, then the bird sings one phrase of
// the same type; ADD FILES and ADD PICTURE file under the bird shown, or the
// Play bird under ALL BIRDS. A picture opens a viewer over the main area
// with the phone viewer's buttons, SHOW IN FINDER in place of SHARE.

#include "BirdList.h"
#include "Strings.h"
#include "Theme.h"
#include "Widgets.h"

#include "../Collection.h"
#include "../FilePlayer.h"

#include <functional>
#include <map>
#include <memory>
#include <vector>

namespace pipp::ui
{
class CollectionScreen final : public juce::Component
{
public:
    CollectionScreen(const Strings& s, FilePlayer& p, const std::vector<BirdEntry>& birdList, const juce::StringArray& groupList);

    void setCollection(Collection* c);
    void applyStrings();
    void show(bool on);
    void poll(); // from the host timer
    void step(int dir); // Up and Down in the bird list
    bool viewerOpen() const noexcept { return viewing >= 0; }
    bool viewerKey(const juce::KeyPress& key);
    juce::String statusText() const;

    // Test hooks.
    void importFile(const juce::File& zip);
    void addFile(const juce::File& f);
    bool exportFile(const juce::File& zip);
    void chooseBird(const juce::String& id) { setBird(id); }
    void chooseRow(int index);
    void openPicture(int index);
    void compareChosen() { compare(); }

    std::function<juce::String()> playBird;                     // the Play bird's id
    std::function<void(const juce::String&)> onOpenPlay;         // OPEN IN PLAY
    std::function<void(const juce::String&, int)> onSing;        // the bird sings one phrase of a type
    std::function<void()> onStatus;                              // the status text changed

    void paint(juce::Graphics& g) override;
    void resized() override;
    void mouseUp(const juce::MouseEvent& e) override;
    void mouseWheelMove(const juce::MouseEvent& e, const juce::MouseWheelDetails& w) override;

private:
    const BirdEntry* entry(const juce::String& id) const;
    juce::String name(const juce::String& id, const juce::String& latin = {}) const;
    std::vector<CollRecording> shownRecs() const;
    std::vector<CollPicture> shownPics() const;
    const CollRecording* chosenRec() const;
    juce::String counts(const juce::String& id) const;
    void setBird(const juce::String& id);
    void setMessage(const juce::String& m);
    void refresh();
    void play(const CollRecording& r, bool thenSing);
    void stopAudio();
    void compare();
    void remove();
    void chooseImport();
    void chooseAdd(bool picturesOnly);
    void chooseExport();
    void afterAdd(const Collection::AddResult& r);
    juce::Image picture(const CollPicture& p);
    juce::Image thumb(const CollRecording& r);
    void layoutViewer();

    void paintList(juce::Graphics& g);
    void paintRecordings(juce::Graphics& g);
    void paintPictures(juce::Graphics& g);
    void paintViewer(juce::Graphics& g);
    int listContentHeight() const;

    const Strings& strings;
    FilePlayer& player;
    const std::vector<BirdEntry>& birds;
    const juce::StringArray& groups;
    Collection* coll = nullptr;

    juce::String bird;      // empty: all birds
    juce::String chosen;    // chosen recording id
    juce::String playingId;
    bool comparing = false;
    double armedAt = 0.0;   // DELETE waits for its second press until 4 s after this
    juce::String message;
    int viewing = -1;       // picture index in shownPics(), -1 closed
    std::unique_ptr<juce::FileChooser> chooser;
    std::map<juce::String, juce::Image> pictureCache, thumbCache;

    Btn importBtn, addBtn, exportBtn, compareBtn, openBtn, finderBtn, deleteBtn;
    Btn prevPic, nextPic, closeBtn, picFinderBtn, picDeleteBtn;
    double picArmedAt = 0.0;

    // Painted areas.
    juce::Rectangle<int> aside, listLabel, listArea, main, head, recLabel, sheet, sheetHead, rowsArea, picLabel, grid, note;
    juce::Rectangle<int> viewerArea, viewerHead, viewerImage;
    int listScroll = 0, rowScroll = 0, picScroll = 0;
    std::vector<std::pair<juce::Rectangle<int>, juce::String>> listRows; // id, "" for ALL BIRDS
    std::vector<std::pair<juce::Rectangle<int>, int>> recRows, picTiles;  // index in shown; -1 ADD PICTURE
    bool listToSelected = false;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(CollectionScreen)
};
} // namespace pipp::ui
