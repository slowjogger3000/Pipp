# Pipp: build order

Work on one milestone at a time, in this order. Each one ends with something Eirik can hear or see. Do not start the next until the checks pass and he has said go.

Each milestone names the model to use for most of its work. Switch for a single hard problem if needed and say so.

## M0. Scaffold

**Model: Sonnet.**

- Git repo with `core/`, `standalone/`, `web/`, `phone/`, `data/`, `tools/render/`, `design/`.
- CMake for `core/` and the render tool. Pin a JUCE tag for `standalone/`.
- `core/Params.h` with every ID from `prd.md`.
- A sine test voice so the render tool writes a WAV.
- Fill in the build commands in `CLAUDE.md`.

Checks: clean build with zero warnings. The render tool writes a 5 s WAV with no non-finite samples.

Commit: yes, one commit.

## M1. The voice

**Model: Opus.** This is the product. Expect several rounds by ear.

- Syrinx voice in `core/`: a pitched source with breath noise, tension shaping the harmonics, trill as fast pitch and amplitude modulation, roughness.
- Song player: syllables as pitch and amplitude contours, phrases, pauses.
- Autoplay with a seed, phrase rules and variation.
- `data/birds/svarttrost/` with `voice.json` and `songs.json` for song and call.
- Surroundings: distance (level and high-frequency loss), wind, space.

Checks: render 30 s of blackbird song and 30 s of call. Peak below 0.7, no clicks. Send Eirik an MP3. He compares it with real recordings on xeno-canto.

Done when Eirik says the blackbird is recognisable. Record the final knob ranges in `prd.md`.

Commit: after each round he approves.

## M2. Play screen, Mac standalone

**Model: Sonnet.** Opus for the override logic if it gets tangled.

- Theme from `design/tokens.json`. Embedded fonts.
- Header, tabs (only PLAY active), status bar.
- Knob component with the plum and ink rings and the HAND tag.
- Scene switches with the hatched state.
- Autoplay band and the full override behaviour from `prd.md`.
- Live sonogram: sung in ink, next phrase in grey, fixed playhead.
- Plate drawn from `plate.json`, beak and tail driven by the engine's amplitude.

Checks: screenshot compared with `design/Main.dc.html`. Drag a knob during autoplay and confirm hold, return and latch.

Commit: yes, per working component.

## M3. More birds, sex and age

**Model: Opus** for each bird's song data, **Sonnet** for the rest.

- Bird list with groups. Bird stepper.
- The other 5 garden birds: kjøttmeis, blåmeis, rødstrupe, bokfink, gråspurv.
- MALE/FEMALE and ADULT/JUV toggles with plate callouts.
- A plate per bird.

Checks: an MP3 per bird for Eirik. Each bird's facts come from `birds.md` or carry `[TO VERIFY]`.

Commit: one commit per bird.

## M4. Field guide and language

**Model: Sonnet.**

- Field guide screen from `design/Guide.dc.html`.
- `data/strings/` in English and Norwegian. The language switch.
- COMPARE for lookalikes.

Checks: screenshots in both languages. No string hard-coded in the interface.

## M5. Sonogram tools

**Model: Opus.**

- Speed ½× and ¼× without pitch change.
- Hearing shift −1 octave.
- Draw on the sonogram, from `design/Draw.dc.html`.

Checks: render the blackbird at ¼× and at −1 octave. No artefacts.

## M6. Quiz

**Model: Sonnet.**

Screen from `design/Quiz.dc.html`. Lookalike pairs first. Missed birds return sooner.

## M7. Dawn chorus

**Model: Sonnet,** Opus for running 4 voices in the engine.

Screen from `design/Chorus.dc.html`. Entry times stay `[TO VERIFY]` until Eirik supplies them.

## M8. Web app

**Model: Opus** for the WASM and AudioWorklet bridge, **Sonnet** for the screens.

- `core/` built with Emscripten. AudioWorklet host.
- Play, Field guide, Quiz, Chorus, Log and Collection in TypeScript, sharing `data/`.
- Log stored in the browser.

Checks: the same seed gives the same phrase order in the standalone and the web app. Works in Safari and Chrome.

## M9. Phone app

**Model: Sonnet.** The phone screens are in `design/`. The few that are still missing are listed in `design-handover.md`.

- Capacitor shell around `web/`, iOS first.
- Listen screen with the microphone sonogram.
- Recognition behind the interface in `prd.md`, with a stub that returns fixed results.
- Save recording, take picture, Collection screen, local storage.

Checks: Eirik runs it on his phone. Record, save, find it in the collection, play it back.

Done 2026-11-26: Eirik ran it on his iPhone; recording, saving, the collection, playback, camera, share and settings work.

## M10. Remaining birds and extras

**Model: Opus** for song data.

- Forest, coast and water, and night birds.
- Dialect for birds that have one. Mimics for starling if it is added. Dropped by Eirik 2026-11-26: no source describes a dialect for the 18, and the starling is not one of them.
- Mnemonics once Eirik has collected them. Not a gate for M10: they go into `bird.json` when they come.

Done 2026-11-26: all 18 birds built and approved by Eirik by ear.

## M11. About 50 birds (go from Eirik 2026-11-26)

**Model: Opus** for song data, **Sonnet** for the groundwork.

Eirik asked for many more birds and chose: about 50 in all, new groups, approval in batches, and a list drafted by Claude for him to edit. The draft is in `birds.md` under "Proposed for M11". Nothing starts until Eirik has edited that list and said go.

Groundwork, before the first new bird:

- Groups: garden, forest, coast and water, night stay; add wetland and lake, mountain, farmland. Group names in `index.json` and `data/strings/` in both languages. The 32 new birds in `index.json`, hatched until built, as the 18 were.
- Code that assumes 4 groups: `core/Quiz.h` group index, the quiz set lists in `web/src/ui/quiz.ts` and `standalone/Source/UI/QuizScreen.cpp`, the group headers in the bird lists. Code that assumes 18: `quiz.set.all` (ALL 18 BIRDS) becomes a count.
- Two layout questions for Eirik, since the designs show 18 birds and 6 quiz sets: the desktop bird list (240px, 24px rows) holds about 22 rows in the window, so 50 birds and 7 headers need it to scroll; and the quiz settings need room for 9 sets (pairs, 7 groups, all). Ask before changing either.
- Sound sources: the snipe's display sound is made by tail feathers and the mallard quacks, so the syrinx may not cover them. Check each against the engine before its batch, and ask before adding a source to `core/`, as was done with `Drum.h`.

Groundwork done 2026-11-26: Eirik chose a scrolling bird list and the quiz sets in two (columns, as the sets are a column).

Then one batch per group, 3 to 8 birds, in this order: garden, forest (two batches), coast and water, wetland and lake, mountain, farmland, night. Per bird, as in M3 and M10: facts from SNL into `birds.md`, then `bird.json`, `voice.json`, `songs.json`, `plate.json`, renders and snapshots. Per batch: all render checks pass, MP3s for every bird in the batch, Eirik listens to the batch and names the birds that need work, those are fixed, then commit.

Checks: every existing check still passes with 50 birds (render limits, override, draw, quiz, chorus, `npm run check-seed`, web build). The 18 birds' renders stay byte-identical unless a core change is agreed.

Commit after the groundwork and after each approved batch.

Done 2026-11-26: all 8 batches approved by ear by Eirik; all 50 birds have sound and data.

## Parked

- **Recognition engine.** Eirik will come back to this. Do not choose one, and do not add a model file to the repo.
