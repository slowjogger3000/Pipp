#pragma once

// The Quiz (F3), the whole body width. Layout follows design/Quiz.dc.html.
// Left, 950px: question counter, the mystery sonogram with PLAY AGAIN,
// HALF SPEED and HINT, four answers in a 2x2 grid, then a band with the
// hint or explanation, COMPARE BOTH, OPEN IN FIELD GUIDE and NEXT. Right:
// birds in the quiz, what to ask for, hints and the score.
//
// The screen only draws and reports clicks. Which bird is asked, the
// answers and the score come from tipp::Quiz in core; the host fills View.

#include "Strings.h"
#include "Widgets.h"

#include "Engine.h"

#include <array>
#include <functional>
#include <vector>

namespace tipp::ui
{
// The mystery song as it is sung, left to right from the moment it was
// asked for. 30px per kHz from 0 to 8 kHz, 80px per second. Frames are
// copied from the engine's feed as they come, so the trace stays while the
// listener thinks.
class QuizSonogram final : public juce::Component
{
public:
    static constexpr float kPxPerKHz = 30.0f;
    static constexpr float kPxPerSecond = 80.0f;
    static constexpr float kLeftPx = 20.0f;

    explicit QuizSonogram(tipp::Engine& e) : engine(e) { setInterceptsMouseClicks(false, false); }

    // Start a new trace at this engine frame.
    void restart(std::uint32_t frame)
    {
        start = next = frame;
        frames.clear();
        repaint();
    }
    void clear()
    {
        frames.clear();
        start = next = engine.sonoWritten();
        repaint();
    }

    void poll();
    void paint(juce::Graphics& g) override;

private:
    tipp::Engine& engine;
    std::vector<tipp::Engine::SonoFrame> frames;
    std::uint32_t start = 0u, next = 0u;
};

class QuizScreen final : public juce::Component
{
public:
    QuizScreen(const Strings& s, tipp::Engine& e);

    struct View
    {
        bool active = false; // a question is up
        int number = 0, total = 10;
        bool answered = false, finished = false;
        int count = 0;
        std::array<juce::String, 4> names;
        int correctSlot = -1, picked = -1;
        juce::String band;    // prompt, hint or explanation
        juce::String caption; // FIG. 1 text
        int set = 0, ask = 0, hints = 0;
        std::array<bool, 6> setHasBirds {};
        int correct = 0, missed = 0, left = 0;
        juce::String practise;
        bool half = false, hintUsed = false, comparing = false;
    };

    std::function<void(int)> onAnswer, onSet, onAsk, onHints;
    std::function<void()> onPlayAgain, onHalf, onHint, onCompare, onOpenGuide, onNext;

    QuizSonogram sono;

    void setView(const View& v);
    void applyStrings();

    void paint(juce::Graphics& g) override;
    void resized() override;

private:
    // An answer: the name in serif, CORRECT or YOUR ANSWER on the right.
    class Answer final : public juce::Component
    {
    public:
        juce::String name, tag;
        enum class Look { Raised, Correct, Wrong } look = Look::Raised;
        bool clickable = true;
        std::function<void()> onClick;
        void paint(juce::Graphics& g) override;
        void mouseUp(const juce::MouseEvent& e) override
        {
            if (clickable && getLocalBounds().contains(e.getPosition()) && onClick)
                onClick();
        }
    };

    void refresh();

    const Strings& strings;
    View view;

    Btn againBtn, halfBtn, hintBtn, compareBtn, guideBtn, nextBtn;
    std::array<Answer, 4> answers;
    std::array<Btn, 6> setBtns;
    std::array<Btn, 3> askBtns, hintBtns;

    // Set in resized().
    juce::Rectangle<int> left, right, counter, figure, figHead, figAxis, figWell, figCaption, band, bandText;
    juce::Rectangle<int> setLabel, askLabel, hintsLabel, scoreLabel, scoreTable, practiseText;
};
} // namespace tipp::ui
