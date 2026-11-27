#include "Quiz.h"

#include "Params.h"

#include <algorithm>

namespace pipp
{
namespace
{
namespace P = params;

template <typename T>
void shuffle(std::vector<T>& v, Rng& rng)
{
    for (std::size_t i = v.size(); i > 1; --i)
    {
        const auto j = static_cast<std::size_t>(rng.below(static_cast<std::uint32_t>(i)));
        std::swap(v[i - 1], v[j]);
    }
}

bool contains(const std::vector<int>& v, int x)
{
    return std::find(v.begin(), v.end(), x) != v.end();
}

bool alike(const std::vector<QuizBird>& birds, int a, int b)
{
    return contains(birds[static_cast<std::size_t>(a)].lookalikes, b)
        || contains(birds[static_cast<std::size_t>(b)].lookalikes, a);
}
} // namespace

std::vector<int> Quiz::poolFor(const std::vector<QuizBird>& birds, int set)
{
    std::vector<int> out;
    const int n = static_cast<int>(birds.size());
    for (int i = 0; i < n; ++i)
    {
        bool in = false;
        if (set == kAll)
            in = true;
        else if (set == kPairs)
            for (int j = 0; j < n && ! in; ++j)
                in = j != i && alike(birds, i, j);
        else
            in = birds[static_cast<std::size_t>(i)].group == set - kGarden;
        if (in)
            out.push_back(i);
    }
    return out;
}

bool Quiz::start(const std::vector<QuizBird>& birds, int set, int askFor, std::uint32_t seed, int questions)
{
    total = std::max(1, questions);
    missList.clear();
    all = birds;
    pool = poolFor(all, set);
    deck.clear();
    due.clear();
    ask = askFor;
    right = wrong = 0;
    number = 0;
    last = -1;
    q = {};
    if (pool.empty())
        return false;
    rng.seed(seed);
    return next();
}

void Quiz::addDue(int bird, int at)
{
    for (auto& d : due)
        if (d.bird == bird)
        {
            d.at = std::min(d.at, at);
            return;
        }
    due.push_back({ bird, at });
    std::stable_sort(due.begin(), due.end(), [](const Due& a, const Due& b) { return a.at < b.at; });
}

int Quiz::pickBird()
{
    const int qi = number; // 0-based index of the question being made

    // A missed bird whose turn has come, unless it was just asked.
    for (auto it = due.begin(); it != due.end(); ++it)
        if (it->at <= qi && (it->bird != last || pool.size() == 1))
        {
            const int b = it->bird;
            due.erase(it);
            return b;
        }

    if (deck.empty())
    {
        deck = pool;
        shuffle(deck, rng);
    }
    if (deck.front() == last && deck.size() > 1)
        std::swap(deck.front(), deck[1u + rng.below(static_cast<std::uint32_t>(deck.size() - 1))]);
    const int b = deck.front();
    deck.erase(deck.begin());
    return b;
}

void Quiz::makeQuestion()
{
    q = {};
    q.bird = pickBird();
    const auto& b = all[static_cast<std::size_t>(q.bird)];
    if (ask == kAskCall)
        q.type = b.hasCall ? kCall : kSong;
    else if (ask == kAskBoth)
        q.type = b.hasCall && rng.below(2) == 1u ? kCall : kSong;
    else
        q.type = kSong;

    // Wrong answers: lookalikes first, then the same group, then the rest.
    std::vector<int> tiers[3];
    for (int i = 0; i < static_cast<int>(all.size()); ++i)
    {
        if (i == q.bird)
            continue;
        const int t = alike(all, q.bird, i) ? 0 : all[static_cast<std::size_t>(i)].group == b.group ? 1 : 2;
        tiers[t].push_back(i);
    }
    std::vector<int> picks { q.bird };
    for (auto& t : tiers)
    {
        shuffle(t, rng);
        for (int i : t)
            if (static_cast<int>(picks.size()) < kAnswers)
                picks.push_back(i);
    }
    shuffle(picks, rng);
    q.count = static_cast<int>(picks.size());
    for (int i = 0; i < q.count; ++i)
    {
        q.answers[static_cast<std::size_t>(i)] = picks[static_cast<std::size_t>(i)];
        if (picks[static_cast<std::size_t>(i)] == q.bird)
            q.correctSlot = i;
    }
}

bool Quiz::answer(int slot)
{
    if (number == 0 || answered() || slot < 0 || slot >= q.count)
        return false;
    q.picked = slot;
    if (slot == q.correctSlot)
    {
        ++right;
        return true;
    }
    ++wrong;
    const int qi = number - 1;
    const int takenFor = q.answers[static_cast<std::size_t>(slot)];
    bool seen = false;
    for (auto& m : missList)
        if (m.bird == q.bird)
        {
            m.taken = takenFor;
            ++m.times;
            seen = true;
        }
    if (! seen)
        missList.push_back({ q.bird, takenFor, 1 });
    addDue(q.bird, qi + kMissGap + 1);
    const int taken = q.answers[static_cast<std::size_t>(slot)];
    if (contains(pool, taken))
        addDue(taken, qi + kMissGap + 2);
    return false;
}

bool Quiz::next()
{
    if (number >= total)
        return false;
    makeQuestion();
    ++number;
    last = q.bird;
    return true;
}

std::vector<int> Quiz::practise() const
{
    std::vector<int> out;
    for (const auto& d : due)
        out.push_back(d.bird);
    return out;
}

// QuizVoice -------------------------------------------------------------------

bool QuizVoice::sceneFor(const BirdData& b, int type, int& season, int& time) noexcept
{
    const auto& t = b.types[static_cast<std::size_t>(type)];
    for (int s = 0; s < 4; ++s)
        for (int d = 0; d < 4; ++d)
            if (rulesFor(t, s, d, 0, 0).active)
            {
                season = s;
                time = d;
                return true;
            }
    season = time = 0;
    return false;
}

void QuizVoice::start(Engine& engine, const BirdData* b, int type, bool halfSpeed) noexcept
{
    bird = b;
    pending = b != nullptr;
    if (b == nullptr)
        return;
    sceneFor(*b, type, seasonIdx, timeIdx);
    auto set = [&engine](const char* id, int v) { engine.setParam(P::indexOf(id), static_cast<float>(v)); };
    set(P::sc_season, seasonIdx);
    set(P::sc_time, timeIdx);
    set(P::sc_type, type);
    set(P::sc_sex, 0);
    set(P::sc_age, 0);
    set(P::ap_on, 0);
    set(P::pb_draw, 0);
    set(P::pb_shift, 0);
    set(P::pb_speed, halfSpeed ? 1 : 0);
    set(P::pb_play, 1);
    engine.keepDrawn(false);
    engine.setBird(b);
}

void QuizVoice::tick(Engine& engine) noexcept
{
    // The engine resets a bird when it takes it, which clears a pending
    // sing once and every hand value. Ask for the phrase after the swap.
    if (pending && bird != nullptr && engine.birdInUse() == bird)
    {
        pending = false;
        playAgain(engine);
    }
}

void QuizVoice::playAgain(Engine& engine) noexcept
{
    if (bird == nullptr || pending)
        return;
    engine.setParam(P::indexOf(P::pb_play), 1.0f);
    frame = engine.sonoWritten();
    engine.trigger(P::indexOf(P::ap_sing_once));
    ++asks;
}

void QuizVoice::setHalfSpeed(Engine& engine, bool half) noexcept
{
    engine.setParam(P::indexOf(P::pb_speed), half ? 1.0f : 0.0f);
}
} // namespace pipp
