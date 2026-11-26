# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tipp

Tipp is a birdsong emulator from Skisse. It synthesises the songs and calls of common Norwegian birds, one bird at a time, and lets you play the bird with knobs. It ships as a Mac standalone, a web app and a phone app. English and Norwegian.

Read these before writing code:

- `prd.md`: what Tipp does and what is decided.
- `design-handover.md`: every screen, the Office beige rules, states and measurements.
- `milestones.md`: the build order. Work on one milestone at a time.
- `birds.md`: the 18 birds and which facts are verified.
- `design/`: the source of each designed screen plus `tokens.json`.

When two of these disagree: `prd.md` decides behaviour, the rules in `design-handover.md` decide looks, and a `.dc.html` file loses to both.

## How every reply ends

This is mandatory. End every reply that finishes a piece of work with this block, in this order, and nothing after it:

```
NEXT STEP: <one sentence saying what to do next>
MODEL: <Opus | Sonnet | Haiku> because <short reason>
COMMIT: <yes, with message "..."> or <no, because ...>
SAFE TO CLEAR: <yes> or <no, because ...>
```

Rules for the block:

- **NEXT STEP** names one concrete action, taken from `milestones.md` unless something is broken. If Eirik has to do it himself (listen to a render, test on his phone), say so.
- **MODEL** is the model for that next step. Opus for sound design in code, DSP that needs reasoning, architecture and hard bugs. Sonnet for ordinary implementation from a clear spec. Haiku for small edits, renames and copy changes. Name the tier only, never a version number.
- **COMMIT** is yes only when the build passes, the checks for the work pass, and the tree holds one coherent change. Give the commit message. If the work is half done, say no and say what is missing.
- **SAFE TO CLEAR** is yes only when the Status section below is up to date and nothing needed for the next step lives only in the conversation. Update Status first, then answer. If you say no, name what would be lost.

If a reply only answers a question and changes nothing, still end with the block. COMMIT is then "no, nothing changed".

## Status

Update this at the end of every work session.

- Current milestone: M0 done 2026-11-26, waiting for Eirik's go for M1.
- Verified: core and render tool build with zero warnings. The render check passes on a 5 s 440 Hz test tone. `core/Engine.cpp` compiles with `emcc`. The standalone skeleton builds against JUCE 9.0.6. `tipp-render --list-params` prints all 32 IDs.
- Not verified: the standalone has not been launched or listened to. Web and phone are empty folders.
- The engine plays only `core/TestVoice.h`, a sine. `tipp-render --bird` exits with code 2 until M1.
- Tools present on Eirik's Mac (checked 2026-11-26): cmake, Xcode, emcc, node, ffmpeg, lame.
- Open decisions: recognition engine (parked, see `prd.md`). The phone export format for the desktop Collection.

## Stack

One sound engine, two user interfaces.

| Part | Technology | Notes |
|---|---|---|
| `core/` | C++17, no JUCE, no allocation in the audio path | Syrinx voice, song player, autoplay, surroundings. Builds native and to WebAssembly. |
| `standalone/` | JUCE with CMake, Mac first | Standalone only. No AU or VST3 planned. |
| `web/` | TypeScript, Vite, AudioWorklet running the WASM core | Canvas for sonogram and plate, DOM for controls. |
| `phone/` | Capacitor wrapping `web/` | Adds microphone, camera and file storage. iOS first. |
| `data/` | JSON per bird, shared by all three | Songs, facts, plate paths, both languages. |
| `tools/render/` | Console app on `core/` | Offline WAV render and checks. |

The phone app is the web app plus native plugins. Do not write a third interface.

What follows from one engine and two interfaces:

- **Behaviour lives in `core/`.** Autoplay, the override sequence (hold, 300 ms return, latch, return all), speed and hearing shift are engine features. An interface sends parameter values and hand-down or hand-up events, and draws what the engine publishes. If logic is written twice, once in JUCE and once in TypeScript, it is in the wrong place.
- **Same seed, same song on every platform.** M8 checks that a seed gives the same phrase order native and in WASM. Use one own random generator in `core/`. Do not use `std::` distributions or `rand()`, and keep phrase choice in integer maths or in operations that give the same result in both builds.
- **`core/` reads no files.** The host (JUCE, the worklet's main thread, the render tool) loads `data/` and hands the parsed bird to the engine off the audio thread.
- **A voice is not always a syrinx.** The woodpecker's song is a drum roll and needs a percussive source. Keep the source behind the voice so M10 does not force a rewrite. Chorus (M7) runs 4 voices at once.

Data layout, shared by all three builds:

- `data/birds/<id>/`: `bird.json` (names, facts, a `verified` flag per field), `voice.json` (base voice and knob ranges), `songs.json` (syllables, phrases, rules keyed by song type with overrides for season, time, sex and age), `plate.json` (paths, pivots, callouts).
- `data/strings/`: every interface string in both languages.
- `<id>` is the Norwegian name in lower case, as in `svarttrost`.

## Build and test

Checked in M0:

- Core and render tool: `cmake -B build -G Xcode && cmake --build build --config Release`
- Render check: `build/Release/tipp-render --tone 440 --seconds 5 --out out/tone.wav`
- List parameter IDs: `build/Release/tipp-render --list-params`
- MP3 for listening: `ffmpeg -v error -y -i out/tone.wav -b:a 192k out/tone.mp3`
- Standalone (fetches JUCE, own build folder): `cmake -B build-standalone -G Xcode -DTIPP_BUILD_STANDALONE=ON && cmake --build build-standalone --config Release --target Tipp`. The app lands in `build-standalone/standalone/Tipp_artefacts/Release/Tipp.app`.
- Core to WASM, compile check only: `emcc -std=c++17 -O2 -c core/Engine.cpp -o /tmp/Engine.o`

Planned, not yet working:

- Render a bird (M1): `build/Release/tipp-render --bird svarttrost --type song --seconds 30 --out out/svarttrost.wav`
- Web (M8): `cd web && npm run dev`
- Phone (M9): `cd phone && npx cap run ios`

There is no unit test suite. The render check is the test. `tipp-render` exits 0 when every check passes, 1 when one fails, 2 on bad arguments or I/O. The limits are constants at the top of `tools/render/main.cpp`. It writes 32-bit float WAV so non-finite samples stay visible.

Layout of the build:

- `tipp_warnings` in the root `CMakeLists.txt` holds the strict warning flags. Link it to every project target that is not JUCE.
- `core/` is the static library `tipp_core`. `Engine` reads its setters through atomics once per 32-sample sub-block.
- `core/Params.h` holds every ID as a constant plus one table `tipp::params::all` with kind, range, default, unit and choice option ids.

## Rules

Real-time:

- No allocation, locks, file or network access on the audio thread.
- Run modulation at control rate in 32-sample sub-blocks. Ramp gains per sample.
- Publish values for the interface through atomics. The interface polls at 10 to 20 Hz, and the sonogram at 30 Hz.

Parameters:

- All IDs live in `core/Params.h`, prefixed by area: `vo_` voice, `ph_` phrasing, `su_` surroundings, `sc_` scene, `ap_` autoplay, `pb_` playback.
- The same IDs are used in JUCE, in the worklet messages and in saved state.
- Every ID is listed in `prd.md`: the 12 knobs under Knobs, the rest under "IDs for the other controls". Add a new ID there first, then in `Params.h`.
- `ap_return_all`, `ap_sing_once` and `ap_reroll` are triggers. Send them as events. They are not saved.
- Knob ranges in `prd.md` are starting points. The final values from M1 go back into `prd.md`.

JUCE:

- CMake, not Projucer. Pin a JUCE tag. Check the latest tag with `git ls-remote --tags` before pinning.
- Layout in `resized()` with `Rectangle::removeFromTop/Left`. Nothing overlaps except a knob's tag.
- Theme values come from `design/tokens.json`, mirrored in `standalone/Source/UI/Theme.h`.
- Fonts are IBM Plex Mono and Instrument Serif, embedded with `BinaryData`.

Content:

- The recognition engine is parked. Do not choose one and do not add a model file to the repo. Build Listen against the `recognise()` interface in `prd.md` with a stub.
- Screens listed under "Not designed yet" in `design-handover.md` are not to be invented. Ask Eirik.
- Never invent a bird fact, a call transcription or a mnemonic. If it is not in `birds.md` as verified, show the `[TO VERIFY]` marker in the build.
- Every user-facing string exists in English and Norwegian (bokmål) in `data/strings/`. Norwegian uses a decimal comma.

Verification after every sound or interface change:

- Zero compiler warnings from project files.
- Render check: no non-finite samples, peak below 0.7, no sample-to-sample step above 0.5 at 48 kHz, and the file starts and ends within 0.001 of zero.
- Render a short MP3 so Eirik can listen on his phone. Say if gain was added.
- For interface work, save a screenshot of each changed screen and compare it with the matching file in `design/`. The `.dc.html` files do not render outside the design canvas (they load a `support.js` that is not in the repo), so the comparison is against the sizes, colours and labels read from the file, not against a picture.

Milestones:

- Do not start the next milestone until the checks pass and Eirik has said go.
- Each milestone in `milestones.md` says when to commit. Follow that.

## Working with Eirik

He designs and tests by ear on a Mac. He is often on his phone. Write directly, lead with the result, keep chat replies to about one screen, and put detail in files. Use digits for numbers. No em dashes and no hype words.

## Decisions and why

- **One bird at a time.** The whole window belongs to one bird. Dawn chorus is the only place with several, and it is its own screen.
- **Playing it is the main job.** Knobs and the live sonogram get the most space. Information is one tab away.
- **Season and time of day are manual.** No clock, no location.
- **Synthesis, not samples.** Every sound comes from the engine, so slow playback, pitch shift and drawing on the sonogram all work without artefacts.
- **Red means recording only.** It appears on the Listen button and nowhere else. Wrong quiz answers are hatched.
- **Phone storage is local.** Recordings, pictures and the log stay on the device. No account.

## Gotchas

Add to this list as they are found.

- The click limit of 0.5 per sample is a starting value. A loud tone near 8 kHz can step that far without clicking. If a high bird fails the check and sounds clean, tighten the test (for example a high-passed step) instead of raising the number blindly, and record the change here.
- The root project must enable `C` as well as `CXX`, or JUCE refuses to configure.
- `tokens.json` is the shared Skisse token file. Its usage notes name other products (Syre, Radio Looper). Take the values, ignore those notes.
- The desktop has 6 tabs. `design-handover.md` lists 5 in the shared layout and adds COLLECTION F6 under "Later additions". `Main.dc.html` shows all 6.
- The bird names and Latin names in `birds.md` are not checked against Artsdatabanken. Set `verified: false` on them in `bird.json`. Show the `[TO VERIFY]` marker on the name rows of the Field facts table only. The bird list, header readout, quiz answers and chorus lanes show the name without the marker, so the lists stay readable.

- `AudioProcessorEditor` already has a member called `processor`. Name the reference `proc`.
- `String (v, 0)` does not mean zero decimals. Use `String (roundToInt (v))`.
- Static `StringArray` objects trigger leak-detector noise at shutdown. Return a fresh one from a function.
