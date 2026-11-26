#pragma once

// The quiz (F3). Lives in core so the standalone and the web app share it.
//
// Quiz picks the birds: which bird each question asks for, the four
// answers, song or call, and the score. Missed birds come back sooner: a
// missed bird is asked again after kMissGap other questions, and the bird
// it was taken for right after it. Lookalikes are the first wrong answers.
// It reads no files and touches no engine; the host hands it one QuizBird
// per bird it has data for.
//
// QuizVoice puts a question's bird in the engine: autoplay off, a scene
// where the type sounds, knobs on the bird's own values, one phrase. Runs
// on the interface thread, ticked from the host timer like Compare. The
// host owns the BirdData and puts its own scene back when the quiz screen
// is left.

#include "BirdData.h"
#include "Engine.h"
#include "Random.h"

#include <array>
#include <cstdint>
#include <vector>

namespace tipp
{
struct QuizBird
{
    int group = 0;               // the host's group index (garden 0, forest 1, coast 2, night 3)
    bool hasCall = false;        // songs.json has a call
    std::vector<int> lookalikes; // indices in the same list, birds with data only
};

class Quiz
{
public:
    // Which birds: lookalike pairs, one group, or every bird with data.
    enum Set : int { kPairs, kGarden, kForest, kCoast, kNight, kAll, kNumSets };
    enum Ask : int { kAskSong, kAskCall, kAskBoth, kNumAsks };

    static constexpr int kQuestions = 10;
    static constexpr int kAnswers = 4;
    static constexpr int kMissGap = 2; // other questions before a missed bird returns

    struct Question
    {
        int bird = -1;
        int type = kSong;
        int count = 0;                       // answers shown, up to kAnswers
        std::array<int, kAnswers> answers {}; // bird indices
        int correctSlot = -1;
        int picked = -1;                     // slot, -1 until answered
    };

    // Birds the set asks about. Pairs: every bird with a lookalike that has
    // data, either way round.
    static std::vector<int> poolFor(const std::vector<QuizBird>& birds, int set);

    // Starts a quiz of kQuestions. False if the set has no bird.
    bool start(const std::vector<QuizBird>& birds, int set, int ask, std::uint32_t seed);

    bool active() const noexcept { return number > 0; }
    const Question& question() const noexcept { return q; }
    int questionNumber() const noexcept { return number; } // 1-based, 0 before start
    bool answered() const noexcept { return q.picked >= 0; }
    bool finished() const noexcept { return number >= kQuestions && answered(); }

    // Returns true if right. Ignored once answered.
    bool answer(int slot);
    // The next question. False when the quiz is over.
    bool next();

    int correct() const noexcept { return right; }
    int missed() const noexcept { return wrong; }
    int left() const noexcept { return kQuestions - number + (answered() ? 0 : 1); }

    // Birds that come back sooner, earliest first.
    std::vector<int> practise() const;

private:
    struct Due
    {
        int bird = -1;
        int at = 0; // question index, 0-based
    };

    int pickBird();
    void makeQuestion();
    void addDue(int bird, int at);

    std::vector<QuizBird> all;
    std::vector<int> pool, deck;
    std::vector<Due> due;
    int ask = kAskSong;
    Rng rng;
    Question q;
    int number = 0, right = 0, wrong = 0, last = -1;
};

class QuizVoice
{
public:
    // A season and time of day where the type sounds for this bird, spring
    // and dawn if they do. False if none does.
    static bool sceneFor(const BirdData& bird, int type, int& season, int& time) noexcept;

    // Sets the scene, autoplay off and play on, then the bird. The phrase
    // starts once the engine has taken the bird.
    void start(Engine& engine, const BirdData* bird, int type, bool halfSpeed) noexcept;
    void playAgain(Engine& engine) noexcept;
    void setHalfSpeed(Engine& engine, bool half) noexcept;
    void tick(Engine& engine) noexcept;
    void stop() noexcept { bird = nullptr; pending = false; }

    const BirdData* current() const noexcept { return bird; }
    int season() const noexcept { return seasonIdx; }
    int timeOfDay() const noexcept { return timeIdx; }
    // Engine::sonoWritten() when the last phrase was asked for, for the
    // quiz sonogram. Valid once started() is true.
    std::uint32_t startFrame() const noexcept { return frame; }
    bool started() const noexcept { return bird != nullptr && ! pending; }
    std::uint32_t sungCount() const noexcept { return asks; } // phrases asked for

private:
    const BirdData* bird = nullptr;
    bool pending = false;
    int seasonIdx = 0, timeIdx = 0;
    std::uint32_t frame = 0u, asks = 0u;
};
} // namespace tipp
