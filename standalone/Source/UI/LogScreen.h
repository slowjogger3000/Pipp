#pragma once

// LOG (F5) on the Mac, from design/Log.dc.html, the same screen as the web
// app's (web/src/ui/log.ts). Left, 360px: the entry form (bird, date, time,
// place, heard, saw, note), ADD TO LOG, the link to Artsobservasjoner and
// the field manners note. Right: the log on sheet, OPEN BIRD, DELETE ENTRY,
// EXPORT CSV.
//
// Entries live in ~/Library/Application Support/Pipp/log.json, newest
// first, in the web app's entry format. Heard and saw are stored as ids, so
// the language can change after an entry is made. Choices as in the web
// app: the form starts on the Play bird, now, and the Play scene's song
// type; OPEN BIRD goes to the field guide; DELETE has no confirm.

#include "BirdList.h"
#include "Strings.h"
#include "Theme.h"
#include "Widgets.h"

#include <array>
#include <functional>
#include <memory>
#include <vector>

namespace pipp::ui
{
struct LogEntry
{
    juce::String bird, date, time, place, note;
    int heard = 0;  // song, call, alarm, flight
    int saw = 3;    // male, female, juvenile, none
    juce::int64 added = 0; // ms, keeps entries of the same minute in order
};

class LogScreen final : public juce::Component
{
public:
    LogScreen(const Strings& s, const std::vector<BirdEntry>& birdList, const juce::StringArray& groupList);
    ~LogScreen() override;

    void setFile(const juce::File& f); // loads it
    void applyStrings();
    void enter(); // the form starts on the Play bird, now, the Play song type
    void step(int dir);
    void open();
    juce::String statusText() const;

    // Test hooks.
    void fill(const juce::String& birdId, const juce::String& date, const juce::String& time, const juce::String& place,
              int heard, int saw, const juce::String& note);
    void add();
    void remove();
    bool exportCsv(const juce::File& f);
    void select(int i);

    std::function<juce::String()> playBird;
    std::function<int()> playType;
    std::function<void(const juce::String&)> onOpenBird;
    std::function<void()> onStatus;
    std::function<void()> onFocusHost; // a click outside the fields gives keys back to the window

    void paint(juce::Graphics& g) override;
    void resized() override;
    void mouseDown(const juce::MouseEvent& e) override;
    void mouseDoubleClick(const juce::MouseEvent& e) override;
    void mouseWheelMove(const juce::MouseEvent& e, const juce::MouseWheelDetails& w) override;

private:
    class Look;

    const BirdEntry* entry(const juce::String& id) const;
    juce::String name(const juce::String& id) const;
    juce::String heardText(int h) const;
    juce::String sawText(int v) const;
    void setBird(const juce::String& id);
    void setMessage(const juce::String& m);
    void save() const;
    void sortEntries();
    void refresh();
    void scrollToSelected();
    void chooseBird();
    void chooseExport();

    const Strings& strings;
    const std::vector<BirdEntry>& birds;
    const juce::StringArray& groups;
    std::unique_ptr<Look> look;
    juce::File file;
    std::vector<LogEntry> entries;
    int selected = 0;
    juce::String message, formBird;
    int heard = 0, saw = 3;
    std::unique_ptr<juce::FileChooser> chooser;

    juce::TextEditor dateIn, timeIn, placeIn, noteIn;
    std::array<Btn, 4> heardBtns, sawBtns;
    Btn addBtn, reportBtn, openBtn, deleteBtn, exportBtn;

    // Painted areas.
    juce::Rectangle<int> birdField;
    juce::Rectangle<int> left, formLabel, mannersLabel, mannersText, listLabel, sheet, sheetHead, rowsArea;
    std::vector<std::pair<juce::Rectangle<int>, juce::String>> fieldLabels; // string keys
    int rowScroll = 0;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(LogScreen)
};
} // namespace pipp::ui
