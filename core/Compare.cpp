#include "Compare.h"

#include "Params.h"

namespace tipp
{
namespace
{
namespace P = params;
}

void Compare::start(Engine& engine, const BirdData* a, const BirdData* b, Restore restore, double now) noexcept
{
    if (running())
        cancel(engine);
    if (a == nullptr || b == nullptr)
        return;
    first = a;
    second = b;
    saved = restore;
    engine.setParam(P::indexOf(P::ap_on), 0.0f);
    engine.setParam(P::indexOf(P::sc_type), static_cast<float>(kSong));
    engine.setParam(P::indexOf(P::pb_play), 1.0f);
    engine.setBird(first);
    singOnce(engine, now);
    step = Step::SingFirst;
}

void Compare::singOnce(Engine& engine, double now) noexcept
{
    countAtTrigger = engine.phrasesStarted();
    engine.trigger(P::indexOf(P::ap_sing_once));
    stepStart = now;
}

bool Compare::phraseDone(const Engine& engine) const noexcept
{
    return engine.phrasesStarted() != countAtTrigger && ! engine.singing();
}

void Compare::tick(Engine& engine, double now) noexcept
{
    const bool timedOut = now - stepStart > kStepTimeout;
    switch (step)
    {
        case Step::Idle:
            return;
        case Step::SingFirst:
            if (phraseDone(engine) || timedOut)
            {
                step = Step::Gap;
                stepStart = now;
            }
            return;
        case Step::Gap:
            if (now - stepStart >= kGapSeconds)
            {
                engine.setBird(second);
                step = Step::Switch;
                stepStart = now;
            }
            return;
        case Step::Switch:
            // The engine resets a bird when it takes it, which clears a
            // pending sing-once. Trigger only after the swap.
            if (engine.birdInUse() == second)
            {
                singOnce(engine, now);
                step = Step::SingSecond;
            }
            else if (timedOut)
                finish(engine);
            return;
        case Step::SingSecond:
            if (phraseDone(engine) || timedOut)
                finish(engine);
            return;
    }
}

void Compare::cancel(Engine& engine) noexcept
{
    if (running())
        finish(engine);
}

void Compare::finish(Engine& engine) noexcept
{
    engine.setBird(first);
    engine.setParam(P::indexOf(P::sc_type), static_cast<float>(saved.songType));
    engine.setParam(P::indexOf(P::ap_on), saved.autoplay ? 1.0f : 0.0f);
    engine.setParam(P::indexOf(P::pb_play), saved.play ? 1.0f : 0.0f);
    step = Step::Idle;
}

int Compare::stage() const noexcept
{
    switch (step)
    {
        case Step::Idle: return 0;
        case Step::SingFirst:
        case Step::Gap: return 1;
        case Step::Switch:
        case Step::SingSecond: return 2;
    }
    return 0;
}
} // namespace tipp
