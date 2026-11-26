// M0 skeleton: a 1280x800 window that runs tipp::Engine. Space toggles the
// test tone. The real interface starts in M2.

#include "Engine.h"

#include <juce_audio_utils/juce_audio_utils.h>

namespace
{
class MainComponent final : public juce::AudioAppComponent
{
public:
    MainComponent()
    {
        setSize(1280, 800);
        setWantsKeyboardFocus(true);
        setAudioChannels(0, 2);
    }

    ~MainComponent() override { shutdownAudio(); }

    void prepareToPlay(int, double sampleRate) override { engine.prepare(sampleRate); }

    void getNextAudioBlock(const juce::AudioSourceChannelInfo& info) override
    {
        auto* buffer = info.buffer;
        float* left = buffer->getWritePointer(0, info.startSample);
        float* right = buffer->getNumChannels() > 1 ? buffer->getWritePointer(1, info.startSample) : left;
        engine.process(left, right, info.numSamples);
    }

    void releaseResources() override {}

    void paint(juce::Graphics& g) override
    {
        g.fillAll(juce::Colour(0xffddd3bd)); // ground
        g.setColour(juce::Colour(0xff221c14)); // ink
        g.drawRect(getLocalBounds(), 1);
        g.drawText(toneOn ? "TEST TONE ON. SPACE STOPS." : "TIPP M0. SPACE PLAYS A TEST TONE.",
                   getLocalBounds(), juce::Justification::centred);
    }

    bool keyPressed(const juce::KeyPress& key) override
    {
        if (key != juce::KeyPress::spaceKey)
            return false;
        toneOn = ! toneOn;
        engine.setGate(toneOn);
        repaint();
        return true;
    }

private:
    tipp::Engine engine;
    bool toneOn = false;
};

class TippApplication final : public juce::JUCEApplication
{
public:
    const juce::String getApplicationName() override { return JUCE_APPLICATION_NAME_STRING; }
    const juce::String getApplicationVersion() override { return JUCE_APPLICATION_VERSION_STRING; }

    void initialise(const juce::String&) override { window = std::make_unique<Window>(); }
    void shutdown() override { window = nullptr; }

private:
    class Window final : public juce::DocumentWindow
    {
    public:
        Window()
            : DocumentWindow("Tipp", juce::Colour(0xffddd3bd), DocumentWindow::closeButton | DocumentWindow::minimiseButton)
        {
            setUsingNativeTitleBar(true);
            setContentOwned(new MainComponent(), true);
            centreWithSize(getWidth(), getHeight());
            setVisible(true);
        }

        void closeButtonPressed() override { juce::JUCEApplication::getInstance()->systemRequestedQuit(); }
    };

    std::unique_ptr<Window> window;
};
} // namespace

START_JUCE_APPLICATION(TippApplication)
