#pragma once

// COMPARE in the field guide: one phrase of the first bird, a short gap,
// then one phrase of the second bird, then back to the first bird and the
// scene as it was. Runs on the host's interface thread, not the audio
// thread: the host calls tick() from its timer (10 to 30 Hz). Lives in core
// so the standalone and the web app share it.
//
// The host owns both birds. It keeps `second` alive while running() is true
// and until Engine::birdInUse() no longer returns it.

#include "BirdData.h"
#include "Engine.h"

namespace pipp
{
class Compare
{
public:
    // What to put back when the comparison ends.
    struct Restore
    {
        bool autoplay = true;
        bool play = false;
        int songType = kSong;
    };

    static constexpr double kGapSeconds = 0.8;
    static constexpr double kStepTimeout = 20.0; // give up on a phrase that never ends

    // type is what both birds sing, song unless given (the quiz may ask for
    // a call).
    void start(Engine& engine, const BirdData* first, const BirdData* second, Restore restore, double now,
               int type = kSong) noexcept;
    void tick(Engine& engine, double now) noexcept;
    // Stops at once and restores the first bird and the scene.
    void cancel(Engine& engine) noexcept;

    bool running() const noexcept { return step != Step::Idle; }
    // 1 while the first bird sings or in the gap, 2 while the second does, 0 idle.
    int stage() const noexcept;
    const BirdData* secondBird() const noexcept { return second; }

private:
    enum class Step { Idle, SingFirst, Gap, Switch, SingSecond };

    void singOnce(Engine& engine, double now) noexcept;
    bool phraseDone(const Engine& engine) const noexcept;
    void finish(Engine& engine) noexcept;

    Step step = Step::Idle;
    const BirdData* first = nullptr;
    const BirdData* second = nullptr;
    Restore saved;
    std::uint32_t countAtTrigger = 0u;
    double stepStart = 0.0;
};
} // namespace pipp
