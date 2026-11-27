// Pipp standalone. The window holds MainComponent at 1280x800.
//
// Test hook, used by the M2 checks:
//   Pipp --snapshot <file.png> [--seconds <s>] [--hand <knob id>] [--lang no]
//        [--bird <id>] [--sex female] [--age juvenile] [--tab guide]
//        [--compare <id>] [--speed 0.5|0.25] [--shift] [--draw]
//        [--tab quiz] [--quiz-seed <n>] [--quiz-skip <n>] [--answer right|wrong] [--leave-quiz] [--quiz-length 10|20|50] [--quiz-result]
//        [--tab chorus] [--chorus-start <min>] [--chorus-speed real|10x|60x|loop] [--mute-lane 1-4]
//        [--tab collection] [--collection-dir <dir>] [--import <zip>] [--add <file,file>]
//        [--tab log] [--log-file <json>] [--log-fill "bird|date|time|place|heard 0-3|saw 0-3|note"] [--log-add]
//        [--log-select <n>] [--log-delete] [--log-export <csv>]
//        [--coll-bird <id>] [--choose-row <n>] [--open-picture <n>] [--export <zip>] [--coll-compare]
// plays for the given time, drags the knob 3 s before the end if asked,
// saves a picture of the window and quits.

#include "MainComponent.h"

#include "Params.h"

namespace
{
class PippApplication final : public juce::JUCEApplication
{
public:
    const juce::String getApplicationName() override { return JUCE_APPLICATION_NAME_STRING; }
    const juce::String getApplicationVersion() override { return JUCE_APPLICATION_VERSION_STRING; }
    bool moreThanOneInstanceAllowed() override { return true; }

    void initialise(const juce::String& commandLine) override
    {
        // Dev only: data comes from the source tree until packaging.
        auto* content = new pipp::ui::MainComponent(juce::File(PIPP_DATA_DIR));
        window = std::make_unique<Window>(content);

        const auto args = juce::StringArray::fromTokens(commandLine, true);
        auto value = [&args](const char* flag) {
            const int i = args.indexOf(flag);
            return i >= 0 && i + 1 < args.size() ? args[i + 1].unquoted() : juce::String();
        };
        if (const auto lang = value("--lang"); lang.isNotEmpty())
            content->setLanguage(lang);
        if (const auto png = value("--snapshot"); png.isNotEmpty())
        {
            if (const auto bird = value("--bird"); bird.isNotEmpty())
                content->chooseScene(bird, value("--sex") == "female", value("--age") == "juvenile");
            if (value("--tab") == "quiz")
            {
                const auto answer = value("--answer");
                content->snapshotQuiz(static_cast<std::uint32_t>(value("--quiz-seed").getLargeIntValue()), value("--quiz-skip").getIntValue(),
                                      answer == "right" ? 1 : answer == "wrong" ? -1 : 0, args.contains("--leave-quiz"),
                                      value("--quiz-length") == "50" ? 2 : value("--quiz-length") == "20" ? 1 : 0, args.contains("--quiz-result"));
                content->setTab(2);
            }
            if (value("--tab") == "collection")
            {
                auto& coll = content->collectionScreen();
                const auto cwd = juce::File::getCurrentWorkingDirectory();
                if (const auto dir = value("--collection-dir"); dir.isNotEmpty())
                    content->setCollectionFolder(cwd.getChildFile(dir));
                content->setTab(5);
                if (const auto zip = value("--import"); zip.isNotEmpty())
                    coll.importFile(cwd.getChildFile(zip));
                for (const auto& f : juce::StringArray::fromTokens(value("--add"), ",", ""))
                    if (f.isNotEmpty())
                        coll.addFile(cwd.getChildFile(f));
                if (const auto b = value("--coll-bird"); b.isNotEmpty())
                    coll.chooseBird(b == "all" ? juce::String() : b);
                if (const auto row = value("--choose-row"); row.isNotEmpty())
                    coll.chooseRow(row.getIntValue());
                if (const auto zip = value("--export"); zip.isNotEmpty())
                    coll.exportFile(cwd.getChildFile(zip));
                if (args.contains("--coll-compare"))
                    coll.compareChosen();
                if (const auto pic = value("--open-picture"); pic.isNotEmpty())
                    coll.openPicture(pic.getIntValue());
            }
            if (value("--tab") == "log")
            {
                auto& log = content->logScreenForTest();
                const auto cwd = juce::File::getCurrentWorkingDirectory();
                if (const auto f = value("--log-file"); f.isNotEmpty())
                    log.setFile(cwd.getChildFile(f));
                content->setTab(4);
                if (const auto fill = value("--log-fill"); fill.isNotEmpty())
                {
                    const auto p = juce::StringArray::fromTokens(fill, "|", "");
                    if (p.size() >= 7)
                        log.fill(p[0], p[1], p[2], p[3], p[4].getIntValue(), p[5].getIntValue(), p[6]);
                }
                if (args.contains("--log-add"))
                    log.add();
                if (const auto n = value("--log-select"); n.isNotEmpty())
                    log.select(n.getIntValue());
                if (args.contains("--log-delete"))
                    log.remove();
                if (const auto csv = value("--log-export"); csv.isNotEmpty())
                    log.exportCsv(cwd.getChildFile(csv));
            }
            if (value("--tab") == "guide")
                content->setTab(1);
            if (value("--tab") == "chorus")
            {
                const auto sp = value("--chorus-speed");
                const auto start = value("--chorus-start");
                content->snapshotChorus(start.isNotEmpty() ? start.getFloatValue() : -90.0f,
                                        sp == "real" ? 0 : sp == "60x" ? 2 : sp == "loop" ? 3 : 1,
                                        value("--mute-lane").isNotEmpty() ? value("--mute-lane").getIntValue() - 1 : -1);
                content->snapshotQuiz(0u, 0, 0, args.contains("--leave-quiz"));
                content->setTab(3);
            }
            if (const auto speed = value("--speed"); speed.isNotEmpty())
                content->setSpeed(speed == "0.25" ? 2 : speed == "0.5" ? 1 : 0);
            if (args.contains("--shift"))
                content->setShift(true);
            if (args.contains("--draw"))
                content->snapshotDraw();
            const auto secs = value("--seconds");
            const int knob = pipp::params::indexOf(value("--hand").toRawUTF8());
            content->runSnapshot(juce::File::getCurrentWorkingDirectory().getChildFile(png),
                                 secs.isNotEmpty() ? secs.getDoubleValue() : 8.0, knob >= 0 && knob < pipp::kNumKnobs ? knob : -1);
            // After runSnapshot: its Play would stop a comparison.
            if (const auto other = value("--compare"); other.isNotEmpty())
                content->compareWith(other);
        }
    }

    void shutdown() override { window = nullptr; }

private:
    class Window final : public juce::DocumentWindow
    {
    public:
        explicit Window(juce::Component* content)
            : DocumentWindow("Pipp", juce::Colour(0xffddd3bd), DocumentWindow::closeButton | DocumentWindow::minimiseButton)
        {
            setUsingNativeTitleBar(true);
            setContentOwned(content, true);
            centreWithSize(getWidth(), getHeight());
            setVisible(true);
            content->grabKeyboardFocus();
        }

        void closeButtonPressed() override { juce::JUCEApplication::getInstance()->systemRequestedQuit(); }
    };

    std::unique_ptr<Window> window;
};
} // namespace

START_JUCE_APPLICATION(PippApplication)
