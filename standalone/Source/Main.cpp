// M1 skeleton: a 1280x800 window that runs tipp::Engine with the blackbird.
// Space plays and stops, 1 picks song, 2 picks call. The real interface
// starts in M2.

#include "BirdData.h"
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
        loadBird("svarttrost");
        setAudioChannels(0, 2);
    }

    ~MainComponent() override { shutdownAudio(); }

    void prepareToPlay(int, double sampleRate) override
    {
        engine.prepare(sampleRate);
        engine.setBird(bird.get());
    }

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
        juce::String text = loadError.isNotEmpty() ? loadError
                          : juce::String(playing ? "PLAYING. " : "STOPPED. ")
                                + (typeIndex == 0 ? "SONG" : "CALL")
                                + ". SPACE PLAYS AND STOPS, 1 SONG, 2 CALL.";
        g.drawText(text, getLocalBounds(), juce::Justification::centred);
    }

    bool keyPressed(const juce::KeyPress& key) override
    {
        namespace P = tipp::params;
        if (key == juce::KeyPress::spaceKey)
        {
            playing = ! playing;
            engine.setParam(P::indexOf(P::pb_play), playing ? 1.0f : 0.0f);
        }
        else if (key.getTextCharacter() == '1' || key.getTextCharacter() == '2')
        {
            typeIndex = key.getTextCharacter() == '1' ? 0 : 1;
            engine.setParam(P::indexOf(P::sc_type), static_cast<float>(typeIndex));
        }
        else
            return false;
        repaint();
        return true;
    }

private:
    // M2 replaces this with a loader shared by the bird list.
    void loadBird(const juce::String& id)
    {
        const juce::File dir = juce::File(TIPP_DATA_DIR).getChildFile("birds").getChildFile(id);
        auto data = std::make_unique<tipp::BirdData>();
        std::string error;
        if (! tipp::parseBird(id.toStdString(), dir.getChildFile("voice.json").loadFileAsString().toStdString(),
                              dir.getChildFile("songs.json").loadFileAsString().toStdString(), *data, error))
        {
            loadError = "CANNOT LOAD " + id.toUpperCase() + ": " + juce::String(error);
            return;
        }
        bird = std::move(data);
    }

    tipp::Engine engine;
    std::unique_ptr<tipp::BirdData> bird;
    juce::String loadError;
    bool playing = false;
    int typeIndex = 0;
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
