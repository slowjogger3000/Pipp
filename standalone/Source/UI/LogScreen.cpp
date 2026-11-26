#include "LogScreen.h"

#include <algorithm>

namespace tipp::ui
{
namespace
{
const char* const kHeard[4] = { "song", "call", "alarm", "flight" };
const char* const kSaw[4] = { "male", "female", "juvenile", "none" };
const char* const kReportUrl = "https://www.artsobservasjoner.no";
constexpr int kCols[5] = { 110, 60, 200, 80, 90 };
constexpr int kColGap = 12;
constexpr int kRowH = 24;

int textW(const juce::Font& f, const juce::String& s) { return draw::textWidth(f, s); }

int indexOf(const char* const* ids, const juce::String& id, int fallback)
{
    for (int i = 0; i < 4; ++i)
        if (id == ids[i])
            return i;
    return fallback;
}

bool digits(const juce::String& s, int from, int count)
{
    for (int i = from; i < from + count; ++i)
        if (! juce::CharacterFunctions::isDigit(s[i]))
            return false;
    return true;
}

bool validDate(const juce::String& s)
{
    if (s.length() != 10 || s[4] != '-' || s[7] != '-' || ! digits(s, 0, 4) || ! digits(s, 5, 2) || ! digits(s, 8, 2))
        return false;
    const int y = s.substring(0, 4).getIntValue(), m = s.substring(5, 7).getIntValue(), d = s.substring(8, 10).getIntValue();
    if (m < 1 || m > 12 || d < 1)
        return false;
    const int days[12] = { 31, (y % 4 == 0 && y % 100 != 0) || y % 400 == 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };
    return d <= days[m - 1];
}

bool validTime(const juce::String& s)
{
    return s.length() == 5 && s[2] == ':' && digits(s, 0, 2) && digits(s, 3, 2) && s.substring(0, 2).getIntValue() < 24
        && s.substring(3, 5).getIntValue() < 60;
}

juce::String csvCell(const juce::String& s)
{
    return s.containsAnyOf("\",\n\r;") ? "\"" + s.replace("\"", "\"\"") + "\"" : s;
}
} // namespace

// Office beige for the text fields and the bird menu.
class LogScreen::Look final : public juce::LookAndFeel_V4
{
public:
    Look()
    {
        setColour(juce::PopupMenu::backgroundColourId, colour::face);
        setColour(juce::PopupMenu::textColourId, colour::ink);
        setColour(juce::PopupMenu::headerTextColourId, colour::inkSoft);
        setColour(juce::PopupMenu::highlightedBackgroundColourId, colour::ink);
        setColour(juce::PopupMenu::highlightedTextColourId, colour::onInk);
    }
    juce::Font getPopupMenuFont() override { return mono(12.0f, 400); }
    void drawPopupMenuBackground(juce::Graphics& g, int w, int h) override
    {
        g.fillAll(colour::face);
        g.setColour(colour::ink);
        g.drawRect(0, 0, w, h, 1);
    }
    void drawPopupMenuSectionHeader(juce::Graphics& g, const juce::Rectangle<int>& area, const juce::String& text) override
    {
        g.setColour(colour::panel);
        g.fillRect(area);
        g.setFont(mono(9.0f, 600, 0.14f));
        g.setColour(colour::inkSoft);
        g.drawText(text, area.withTrimmedLeft(8), juce::Justification::centredLeft, false);
    }
    void drawTextEditorOutline(juce::Graphics& g, int w, int h, juce::TextEditor& t) override
    {
        if (t.hasKeyboardFocus(true) && ! t.isReadOnly())
        {
            g.setColour(colour::ink);
            g.drawRect(0, 0, w, h, 1);
        }
    }
    void fillTextEditorBackground(juce::Graphics&, int, int, juce::TextEditor&) override {}
};

LogScreen::LogScreen(const Strings& s, const std::vector<BirdEntry>& birdList, const juce::StringArray& groupList)
    : strings(s), birds(birdList), groups(groupList), look(std::make_unique<Look>())
{
    for (auto* t : { &dateIn, &timeIn, &placeIn, &noteIn })
    {
        t->setLookAndFeel(look.get());
        t->setFont(mono(12.0f, 500));
        t->setJustification(juce::Justification::centredLeft);
        t->setIndents(7, 0);
        t->setColour(juce::TextEditor::textColourId, colour::ink);
        t->setColour(juce::TextEditor::highlightColourId, colour::ink.withAlpha(0.2f));
        t->setColour(juce::TextEditor::highlightedTextColourId, colour::ink);
        t->setColour(juce::CaretComponent::caretColourId, colour::ink);
        t->setSelectAllWhenFocused(false);
        // Typing in the form is not a shortcut. Enter adds the entry; F keys
        // are not used by a field, so they go on to the window.
        t->onReturnKey = [this] { add(); };
        t->onTextChange = [this] { message = {}; };
        addAndMakeVisible(*t);
    }
    dateIn.setInputRestrictions(10, "0123456789-");
    timeIn.setInputRestrictions(5, "0123456789:");
    for (int i = 0; i < 4; ++i)
    {
        heardBtns[static_cast<std::size_t>(i)].onClick = [this, i] { heard = i; refresh(); };
        sawBtns[static_cast<std::size_t>(i)].onClick = [this, i] { saw = i; refresh(); };
        addAndMakeVisible(heardBtns[static_cast<std::size_t>(i)]);
        addAndMakeVisible(sawBtns[static_cast<std::size_t>(i)]);
    }
    addBtn.fontPx = 11.0f;
    reportBtn.fontPx = 9.0f;
    addBtn.onClick = [this] { add(); };
    reportBtn.onClick = [] { juce::URL(kReportUrl).launchInDefaultBrowser(); };
    openBtn.onClick = [this] { open(); };
    deleteBtn.onClick = [this] { remove(); };
    exportBtn.onClick = [this] { chooseExport(); };
    for (auto* b : { &addBtn, &reportBtn, &openBtn, &deleteBtn, &exportBtn })
        addAndMakeVisible(*b);
}

LogScreen::~LogScreen()
{
    for (auto* t : { &dateIn, &timeIn, &placeIn, &noteIn })
        t->setLookAndFeel(nullptr);
}

// --------------------------------------------------------------- data

const BirdEntry* LogScreen::entry(const juce::String& id) const
{
    for (const auto& b : birds)
        if (b.id == id)
            return &b;
    return nullptr;
}

juce::String LogScreen::name(const juce::String& id) const
{
    const auto* b = entry(id);
    return b != nullptr ? b->name(strings.norwegian()) : id;
}

juce::String LogScreen::heardText(int h) const { return strings("type." + juce::String(kHeard[juce::jlimit(0, 3, h)])); }

juce::String LogScreen::sawText(int v) const
{
    return v == 0 ? strings("plate.male") : v == 1 ? strings("plate.female") : v == 2 ? strings("log.saw_juvenile") : juce::String("---");
}

void LogScreen::setFile(const juce::File& f)
{
    file = f;
    entries.clear();
    const auto doc = juce::JSON::parse(file);
    if (auto* a = doc.getArray())
        for (const auto& v : *a)
        {
            LogEntry e;
            e.bird = v["bird"].toString();
            e.date = v["date"].toString();
            e.time = v["time"].toString();
            e.place = v["place"].toString();
            e.note = v["note"].toString();
            e.heard = indexOf(kHeard, v["heard"].toString(), -1);
            e.saw = indexOf(kSaw, v["saw"].toString(), -1);
            e.added = static_cast<juce::int64>(v["added"]);
            if (e.bird.isNotEmpty() && e.date.isNotEmpty() && e.time.isNotEmpty() && e.heard >= 0 && e.saw >= 0)
                entries.push_back(e);
        }
    sortEntries();
    selected = 0;
    rowScroll = 0;
    refresh();
}

void LogScreen::sortEntries()
{
    std::stable_sort(entries.begin(), entries.end(), [](const LogEntry& a, const LogEntry& b) {
        const auto ka = a.date + " " + a.time, kb = b.date + " " + b.time;
        return ka != kb ? ka > kb : a.added > b.added;
    });
}

void LogScreen::save() const
{
    juce::Array<juce::var> a;
    for (const auto& e : entries)
    {
        auto* o = new juce::DynamicObject();
        o->setProperty("bird", e.bird);
        o->setProperty("date", e.date);
        o->setProperty("time", e.time);
        o->setProperty("place", e.place);
        o->setProperty("heard", kHeard[e.heard]);
        o->setProperty("saw", kSaw[e.saw]);
        o->setProperty("note", e.note);
        o->setProperty("added", e.added);
        a.add(juce::var(o));
    }
    file.getParentDirectory().createDirectory();
    juce::TemporaryFile tmp(file);
    if (tmp.getFile().replaceWithText(juce::JSON::toString(juce::var(a))))
        (void) tmp.overwriteTargetFileWithTemporary();
}

juce::String LogScreen::statusText() const
{
    if (message.isNotEmpty())
        return message;
    const int n = static_cast<int>(entries.size());
    return n == 1 ? strings("log.entries_one") : strings.format("log.entries", { { "n", juce::String(n) } });
}

void LogScreen::setMessage(const juce::String& m)
{
    message = m;
    if (onStatus)
        onStatus();
}

// --------------------------------------------------------------- form

void LogScreen::enter()
{
    const auto now = juce::Time::getCurrentTime();
    setBird(playBird ? playBird() : juce::String());
    dateIn.setText(now.formatted("%Y-%m-%d"), false);
    timeIn.setText(now.formatted("%H:%M"), false);
    heard = playType ? juce::jlimit(0, 3, playType()) : 0;
    message = {};
    refresh();
}

void LogScreen::setBird(const juce::String& id)
{
    formBird = entry(id) != nullptr ? id : birds.empty() ? juce::String() : birds.front().id;
    repaint(birdField);
}

void LogScreen::fill(const juce::String& birdId, const juce::String& date, const juce::String& time, const juce::String& place,
                     int h, int v, const juce::String& note)
{
    setBird(birdId);
    dateIn.setText(date, false);
    timeIn.setText(time, false);
    placeIn.setText(place, false);
    noteIn.setText(note, false);
    heard = juce::jlimit(0, 3, h);
    saw = juce::jlimit(0, 3, v);
    refresh();
}

void LogScreen::chooseBird()
{
    juce::PopupMenu m;
    m.setLookAndFeel(look.get());
    const bool no = strings.norwegian();
    for (const auto& grp : groups)
    {
        m.addSectionHeader(strings("group." + grp));
        for (int i = 0; i < static_cast<int>(birds.size()); ++i)
        {
            const auto& b = birds[static_cast<std::size_t>(i)];
            if (b.group == grp)
                m.addItem(i + 1, b.number + " " + b.name(no), true, b.id == formBird);
        }
    }
    juce::Component::SafePointer<LogScreen> self(this);
    m.showMenuAsync(juce::PopupMenu::Options().withTargetScreenArea(localAreaToGlobal(birdField)).withMinimumWidth(birdField.getWidth()),
                    [self](int r) {
                        if (self != nullptr && r > 0)
                            self->setBird(self->birds[static_cast<std::size_t>(r - 1)].id);
                    });
}

void LogScreen::add()
{
    const auto date = dateIn.getText().trim(), time = timeIn.getText().trim();
    if (! validDate(date))
    {
        setMessage(strings("log.bad_date"));
        dateIn.grabKeyboardFocus();
        return;
    }
    if (! validTime(time))
    {
        setMessage(strings("log.bad_time"));
        timeIn.grabKeyboardFocus();
        return;
    }
    LogEntry e { formBird, date, time, placeIn.getText().trim(), noteIn.getText().trim(), heard, saw, juce::Time::currentTimeMillis() };
    entries.push_back(e);
    sortEntries();
    for (int i = 0; i < static_cast<int>(entries.size()); ++i)
        if (entries[static_cast<std::size_t>(i)].added == e.added && entries[static_cast<std::size_t>(i)].bird == e.bird)
            selected = i;
    save();
    noteIn.clear();
    scrollToSelected();
    refresh();
    setMessage(strings.format("log.added", { { "bird", name(e.bird) } }));
}

// --------------------------------------------------------------- list

void LogScreen::select(int i)
{
    if (entries.empty())
        return;
    selected = juce::jlimit(0, static_cast<int>(entries.size()) - 1, i);
    message = {};
    scrollToSelected();
    refresh();
}

void LogScreen::step(int dir) { select(selected + dir); }

void LogScreen::open()
{
    if (selected < 0 || selected >= static_cast<int>(entries.size()))
        return;
    const auto& e = entries[static_cast<std::size_t>(selected)];
    if (const auto* b = entry(e.bird); b != nullptr && b->available && onOpenBird)
        onOpenBird(e.bird);
}

void LogScreen::remove()
{
    if (selected < 0 || selected >= static_cast<int>(entries.size()))
        return;
    const auto id = entries[static_cast<std::size_t>(selected)].bird;
    entries.erase(entries.begin() + selected);
    selected = std::min(selected, std::max(0, static_cast<int>(entries.size()) - 1));
    save();
    refresh();
    setMessage(strings.format("log.deleted", { { "bird", name(id) } }));
}

// CSV in the language shown, with the Latin name for reporting. A BOM so
// spreadsheet apps read æ, ø and å.
bool LogScreen::exportCsv(const juce::File& f)
{
    juce::StringArray lines;
    juce::StringArray head;
    for (const char* k : { "log.date", "log.time", "log.bird", "log.csv_bird_latin", "log.heard", "log.saw", "log.place", "log.note" })
        head.add(csvCell(strings(k)));
    lines.add(head.joinIntoString(","));
    for (const auto& e : entries)
    {
        const auto* b = entry(e.bird);
        juce::StringArray r { e.date, e.time, name(e.bird), b != nullptr ? b->latin : juce::String(), heardText(e.heard),
                              e.saw == 3 ? juce::String() : sawText(e.saw), e.place, e.note };
        for (auto& c : r)
            c = csvCell(c);
        lines.add(r.joinIntoString(","));
    }
    const auto text = juce::String(juce::CharPointer_UTF8("\xef\xbb\xbf")) + lines.joinIntoString("\r\n") + "\r\n";
    const bool ok = f.replaceWithText(text, false, false, nullptr);
    setMessage(ok ? strings.format("coll.export_saved", { { "file", f.getFileName() } }) : strings("coll.export_failed"));
    return ok;
}

void LogScreen::chooseExport()
{
    const auto name = "tipp-log-" + juce::Time::getCurrentTime().formatted("%Y-%m-%d") + ".csv";
    chooser = std::make_unique<juce::FileChooser>(strings("log.export"),
                                                  juce::File::getSpecialLocation(juce::File::userHomeDirectory).getChildFile("Downloads").getChildFile(name), "*.csv");
    chooser->launchAsync(juce::FileBrowserComponent::saveMode | juce::FileBrowserComponent::canSelectFiles | juce::FileBrowserComponent::warnAboutOverwriting,
                         [this](const juce::FileChooser& fc) {
                             if (fc.getResult() != juce::File())
                                 exportCsv(fc.getResult());
                         });
}

void LogScreen::scrollToSelected()
{
    const int top = selected * kRowH, view = rowsArea.getHeight();
    if (top < rowScroll)
        rowScroll = top;
    else if (top + kRowH > rowScroll + view)
        rowScroll = top + kRowH - view;
}

void LogScreen::refresh()
{
    for (int i = 0; i < 4; ++i)
    {
        heardBtns[static_cast<std::size_t>(i)].setOn(heard == i);
        sawBtns[static_cast<std::size_t>(i)].setOn(saw == i);
    }
    const bool has = selected >= 0 && selected < static_cast<int>(entries.size());
    const auto* b = has ? entry(entries[static_cast<std::size_t>(selected)].bird) : nullptr;
    openBtn.setDisabled(b == nullptr || ! b->available);
    deleteBtn.setDisabled(! has);
    exportBtn.setDisabled(entries.empty());
    repaint();
    if (onStatus)
        onStatus();
}

void LogScreen::applyStrings()
{
    for (int i = 0; i < 4; ++i)
    {
        heardBtns[static_cast<std::size_t>(i)].setText(heardText(i));
        sawBtns[static_cast<std::size_t>(i)].setText(i == 3 ? strings("log.saw_none") : sawText(i));
    }
    placeIn.setTextToShowWhenEmpty(strings("log.place_hint"), colour::inkSoft.withAlpha(0.7f));
    noteIn.setTextToShowWhenEmpty(strings("log.note_hint"), colour::inkSoft.withAlpha(0.7f));
    addBtn.setText(strings("log.add"));
    reportBtn.setText(strings("log.report"));
    openBtn.setText(strings("log.open"));
    deleteBtn.setText(strings("log.delete"));
    exportBtn.setText(strings("log.export"));
    resized();
    refresh();
}

// --------------------------------------------------------------- layout

void LogScreen::resized()
{
    auto r = getLocalBounds().reduced(8);
    left = r.removeFromLeft(360);
    r.removeFromLeft(12);
    auto right = r;

    fieldLabels.clear();
    auto l = left;
    formLabel = l.removeFromTop(14);
    l.removeFromTop(8);
    auto field = [this](juce::Rectangle<int>& area, const char* key, int h) {
        fieldLabels.push_back({ area.removeFromTop(12), key });
        area.removeFromTop(2);
        return area.removeFromTop(h);
    };
    birdField = field(l, "log.bird", 24);
    l.removeFromTop(8);
    {
        auto row = l.removeFromTop(38);
        auto a = row.removeFromLeft((row.getWidth() - 8) / 2);
        row.removeFromLeft(8);
        dateIn.setBounds(field(a, "log.date", 24).reduced(1));
        timeIn.setBounds(field(row, "log.time", 24).reduced(1));
    }
    l.removeFromTop(8);
    placeIn.setBounds(field(l, "log.place", 24).reduced(1));
    l.removeFromTop(8);
    layoutJoined(field(l, "log.heard", 24), { &heardBtns[0], &heardBtns[1], &heardBtns[2], &heardBtns[3] });
    l.removeFromTop(8);
    layoutJoined(field(l, "log.saw", 24), { &sawBtns[0], &sawBtns[1], &sawBtns[2], &sawBtns[3] });
    l.removeFromTop(8);
    noteIn.setBounds(field(l, "log.note", 24).reduced(1));
    l.removeFromTop(8);
    {
        auto row = l.removeFromTop(32);
        addBtn.setBounds(row.removeFromLeft((row.getWidth() - 6) / 2));
        row.removeFromLeft(6);
        reportBtn.setBounds(row);
    }
    l.removeFromTop(12);
    mannersLabel = l.removeFromTop(14);
    l.removeFromTop(6);
    mannersText = l.removeFromTop(96);

    listLabel = right.removeFromTop(14);
    right.removeFromTop(6);
    auto acts = right.removeFromBottom(24);
    right.removeFromBottom(6);
    sheet = right;
    sheetHead = sheet.reduced(1).removeFromTop(24);
    rowsArea = sheet.reduced(1).withTrimmedTop(25);
    const auto f = mono(10.0f, 500, 0.06f);
    for (auto* b : { &openBtn, &deleteBtn, &exportBtn })
    {
        const auto key = b == &openBtn ? "log.open" : b == &deleteBtn ? "log.delete" : "log.export";
        b->setBounds(acts.removeFromLeft(textW(f, strings(key)) + 22));
        acts.removeFromLeft(6);
    }
}

// --------------------------------------------------------------- painting

void LogScreen::paint(juce::Graphics& g)
{
    g.fillAll(colour::ground);
    draw::sectionLabel(g, formLabel, strings("log.form"));
    for (const auto& [r, key] : fieldLabels)
        draw::fieldLabel(g, r, strings(key));

    // The bird field reads as an input; a click opens the list of birds.
    draw::inset(g, birdField);
    if (const auto* b = entry(formBird))
    {
        g.setFont(mono(12.0f, 500));
        g.setColour(colour::ink);
        g.drawText(b->number + " " + b->name(strings.norwegian()), birdField.reduced(8, 0).withTrimmedRight(14), juce::Justification::centredLeft, true);
    }
    {
        juce::Path p;
        const auto c = juce::Point<float>(static_cast<float>(birdField.getRight() - 12), static_cast<float>(birdField.getCentreY()));
        p.addTriangle(c.x - 4.0f, c.y - 2.0f, c.x + 4.0f, c.y - 2.0f, c.x, c.y + 3.0f);
        g.setColour(colour::inkSoft);
        g.fillPath(p);
    }
    for (auto* t : { &dateIn, &timeIn, &placeIn, &noteIn })
        draw::inset(g, t->getBounds().expanded(1));

    draw::sectionLabel(g, mannersLabel, strings("log.manners"));
    g.setFont(mono(11.0f, 400));
    g.setColour(colour::ink);
    g.drawFittedText(strings("log.manners_text"), mannersText, juce::Justification::topLeft, 6, 1.0f);

    // LOG ---- n OF 50 BIRDS HEARD.
    {
        juce::StringArray seen;
        for (const auto& e : entries)
            seen.addIfNotAlreadyThere(e.bird);
        const auto count = strings.format("log.heard_count", { { "n", juce::String(seen.size()) }, { "total", juce::String(static_cast<int>(birds.size())) } });
        const auto cf = mono(10.0f, 500, 0.06f);
        const int cw = textW(cf, count) + 2;
        const auto lf = mono(10.0f, 600, 0.14f);
        const auto label = strings("log.list");
        g.setFont(lf);
        g.setColour(colour::inkSoft);
        const int lw = textW(lf, label) + 2;
        g.drawText(label, listLabel.withWidth(lw), juce::Justification::centredLeft, false);
        g.setColour(colour::ink);
        g.fillRect(listLabel.getX() + lw + 4, listLabel.getCentreY(), listLabel.getWidth() - lw - cw - 10, 1);
        g.setFont(cf);
        g.drawText(count, listLabel.withTrimmedLeft(listLabel.getWidth() - cw), juce::Justification::centredRight, false);
    }

    draw::inset(g, sheet, colour::sheet);
    g.setColour(colour::panel);
    g.fillRect(sheetHead);
    g.setColour(colour::ink);
    g.fillRect(sheetHead.getX(), sheetHead.getBottom(), sheetHead.getWidth(), 1);
    auto columns = [](juce::Rectangle<int> r) {
        std::array<juce::Rectangle<int>, 6> c;
        auto in = r.reduced(8, 0);
        for (std::size_t i = 0; i < 5; ++i)
        {
            c[i] = in.removeFromLeft(kCols[i]);
            in.removeFromLeft(kColGap);
        }
        c[5] = in;
        return c;
    };
    {
        const auto c = columns(sheetHead);
        const char* keys[6] = { "log.date", "log.time", "log.bird", "log.heard", "log.saw", "log.col_place_note" };
        g.setFont(mono(9.0f, 600, 0.14f));
        g.setColour(colour::inkSoft);
        for (std::size_t i = 0; i < 6; ++i)
            g.drawText(strings(keys[i]), c[i], juce::Justification::centredLeft, true);
    }

    const int n = static_cast<int>(entries.size());
    const int content = (n + 1) * kRowH;
    rowScroll = juce::jlimit(0, std::max(0, content - rowsArea.getHeight()), rowScroll);
    juce::Graphics::ScopedSaveState save(g);
    g.reduceClipRegion(rowsArea);
    g.setFont(mono(13.0f, 400));
    for (int i = 0; i <= n; ++i)
    {
        const juce::Rectangle<int> row(rowsArea.getX(), rowsArea.getY() + i * kRowH - rowScroll, rowsArea.getWidth(), kRowH);
        const auto c = columns(row);
        if (i == n)
        {
            // The faint line under the last entry, as in the design.
            g.setColour(colour::faint);
            const char* dash[6] = { "----------", "-----", "---", "---", "---", "---" };
            for (std::size_t k = 0; k < 6; ++k)
                g.drawText(dash[k], c[k], juce::Justification::centredLeft, false);
            break;
        }
        const auto& e = entries[static_cast<std::size_t>(i)];
        const bool sel = i == selected;
        if (sel)
        {
            g.setColour(colour::ink);
            g.fillRect(row);
        }
        g.setColour(sel ? colour::onInk : colour::ink);
        juce::StringArray pn;
        if (e.place.isNotEmpty()) pn.add(e.place);
        if (e.note.isNotEmpty()) pn.add(e.note);
        const juce::String cells[6] = { e.date, e.time, name(e.bird), heardText(e.heard), sawText(e.saw), pn.joinIntoString(", ") };
        for (std::size_t k = 0; k < 6; ++k)
            g.drawText(cells[k], c[k], juce::Justification::centredLeft, true);
    }
    if (content > rowsArea.getHeight())
    {
        const int view = rowsArea.getHeight();
        const int hgt = std::max(24, view * view / content);
        g.setColour(colour::shadow);
        g.fillRect(rowsArea.getRight() - 5, rowsArea.getY() + (view - hgt) * rowScroll / (content - view), 4, hgt);
    }
}

// --------------------------------------------------------------- mouse

void LogScreen::mouseDown(const juce::MouseEvent& e)
{
    const auto pos = e.getPosition();
    if (birdField.contains(pos))
    {
        chooseBird();
        return;
    }
    if (onFocusHost)
        onFocusHost(); // keys back to the window: Up, Down, Enter
    if (rowsArea.contains(pos))
    {
        const int i = (pos.y - rowsArea.getY() + rowScroll) / kRowH;
        if (i >= 0 && i < static_cast<int>(entries.size()))
            select(i);
    }
}

void LogScreen::mouseDoubleClick(const juce::MouseEvent& e)
{
    if (rowsArea.contains(e.getPosition()))
        open();
}

void LogScreen::mouseWheelMove(const juce::MouseEvent& e, const juce::MouseWheelDetails& w)
{
    if (! rowsArea.contains(e.getPosition()))
        return;
    rowScroll -= juce::roundToInt(w.deltaY * 24.0f * 8.0f);
    repaint();
}
} // namespace tipp::ui
