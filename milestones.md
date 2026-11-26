# Tipp: build order

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

## M10. Remaining birds and extras

**Model: Opus** for song data.

- Forest, coast and water, and night birds.
- Dialect for birds that have one. Mimics for starling if it is added.
- Mnemonics once Eirik has collected them.

## Parked

- **Recognition engine.** Eirik will come back to this. Do not choose one, and do not add a model file to the repo.
