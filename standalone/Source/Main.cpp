// Tipp standalone. The window holds MainComponent at 1280x800.
//
// Test hook, used by the M2 checks:
//   Tipp --snapshot <file.png> [--seconds <s>] [--hand <knob id>] [--lang no]
//        [--bird <id>] [--sex female] [--age juvenile] [--tab guide]
//        [--compare <id>] [--speed 0.5|0.25] [--shift] [--draw]
// plays for the given time, drags the knob 3 s before the end if asked,
// saves a picture of the window and quits.

#include "MainComponent.h"

#include "Params.h"

namespace
{
class TippApplication final : public juce::JUCEApplication
{
public:
    const juce::String getApplicationName() override { return JUCE_APPLICATION_NAME_STRING; }
    const juce::String getApplicationVersion() override { return JUCE_APPLICATION_VERSION_STRING; }
    bool moreThanOneInstanceAllowed() override { return true; }

    void initialise(const juce::String& commandLine) override
    {
        // Dev only: data comes from the source tree until packaging.
        auto* content = new tipp::ui::MainComponent(juce::File(TIPP_DATA_DIR));
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
            if (value("--tab") == "guide")
                content->setTab(1);
            if (const auto speed = value("--speed"); speed.isNotEmpty())
                content->setSpeed(speed == "0.25" ? 2 : speed == "0.5" ? 1 : 0);
            if (args.contains("--shift"))
                content->setShift(true);
            if (args.contains("--draw"))
                content->snapshotDraw();
            const auto secs = value("--seconds");
            const int knob = tipp::params::indexOf(value("--hand").toRawUTF8());
            content->runSnapshot(juce::File::getCurrentWorkingDirectory().getChildFile(png),
                                 secs.isNotEmpty() ? secs.getDoubleValue() : 8.0, knob >= 0 && knob < tipp::kNumKnobs ? knob : -1);
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
            : DocumentWindow("Tipp", juce::Colour(0xffddd3bd), DocumentWindow::closeButton | DocumentWindow::minimiseButton)
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

START_JUCE_APPLICATION(TippApplication)
