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

- Current milestone: M4 built 2026-11-26, waiting for Eirik to check it in the app and say go for M5. M3 signed off by Eirik ("Start m4").
- M4 built: Field guide (F2) in `standalone/Source/UI/GuideScreen.*`, tabs PLAY and FIELD GUIDE clickable, F1 and F2 switch. Facts per bird in new `data/birds/<id>/bird.json` (6 garden birds, both languages, `verified` per field, calendar rows as 12 letters y/n/?). Male and female table reads the plate callouts plus a song row. Example phrase in the figure comes from a throwaway engine, seed 1, the bird's own knobs. Brackets name phrase parts from a new `part` key on song sections (blackbird, great tit, blue tit; the other 3 have guessed shapes, so no brackets). COMPARE is `core/Compare.*`, ticked from the host timer: one phrase of this bird, 0.8 s, one phrase of the other, then the scene is restored. Only lookalikes with data play (great tit, blue tit); others are hatched. Every interface string is in `data/strings/` now; unit symbols (s, Hz, kHz, m, %), key names, speed glyphs and the wordmark stay in code because they read the same in both languages.
- M4 verified: zero warnings in core, render tool and standalone. All 12 renders (6 birds, song and call, seed 1, 20 s) byte-identical to before M4. Override check passes for all 6. `--compare` render passes for blue tit/great tit both ways and chaffinch/great tit; MP3s in `out/m4-compare-*.mp3`. Core plus `Compare.cpp` compiles with emcc. Snapshots: `out/m4-guide-<bird>-<en|no>.png` for all 6, `out/m4-guide-compare-en.png` mid-compare, `out/m4-play-<en|no>.png`. Not verified: clicking the tabs and buttons by hand, and the xeno-canto link opening a browser.
- M4 choices open to Eirik: unknown months in the calendar are plain cells (the design only has sung and hatched); the note under it carries [TO VERIFY]. The figure caption row runs the full column width because the caption and the xeno-canto link did not fit in 350px. Song type play buttons set the type, start playback and sing one phrase; autoplay stays as set. Lookalike texts are only what `birds.md` supports, so they often describe plumage rather than song. Robin has no lookalike in `birds.md` and shows [TO VERIFY]. Norwegian wording in `bird.json` and the new strings is mine, Eirik to check.
- M3 so far: facts for the 5 garden birds, plain-letter ids and the bird stepper are in 3aa9bbb.
- Kjøttmeis done 2026-11-26, Eirik approved the MP3s: `data/birds/kjottmeis/` voice, songs and plate. Each song syllable is a whole 2 or 3 note motif, repeated by one section. New `bout` field in a song type (`[3, 8]` for the great tit): the same phrase template for that many phrases in a row. Without it the engine draws no extra random numbers, so the blackbird renders byte-identical (checked, seed 1, song and call). Plate fills can now name any variant key (the great tit's `cap`), and the plate has HEAD, CHEEK and BREAST callouts in both languages. Bill colour and juvenile cheek show `[TO VERIFY]`. MP3s: `out/kjottmeis-song.mp3`, `out/kjottmeis-call.mp3`. Snapshots: `out/m3-kjottmeis-*.png`.
- Blåmeis done 2026-11-26, Eirik approved the MP3s: `data/birds/blameis/`. Song: 1 to 3 thin 'si' notes then a trill section of short notes (ph_length sets its length), or 2 whistles then a chatter. Calls: 'sits' series, 'sits it pæ-pæ-pæ', 'spitt spitt'. Plate: blue parts in shadow, new EYE STRIPE callout label. Bill colour shows `[TO VERIFY]`. MP3s: `out/blameis-song.mp3`, `out/blameis-call.mp3`. Snapshots: `out/m3-blameis-*.png`.
- Rødstrupe done 2026-11-26, Eirik approved the MP3s: `data/birds/rodstrupe/`. Song: 1 or 2 thin high notes (7 to 8 kHz), then a fast run of varied notes jumping between 2.6 and 6.8 kHz, sometimes a short rattle or a sizzling end note; no phrase repeats. Call: `birds.md` has no robin call, so the 'tick' series and thin 'tsii' are placeholders marked in `_note`. Plate: rust-red forehead, throat and breast in shadow, olive-brown back as hatching. Bill colour and every juvenile callout show `[TO VERIFY]`; the juvenile is drawn like the adults. No new strings or code. MP3s: `out/rodstrupe-song.mp3`, `out/rodstrupe-call.mp3`. Snapshots: `out/m3-rodstrupe-*.png`.
- Bokfink done 2026-11-26, Eirik approved the MP3s: `data/birds/bokfink/`. Song: 3 templates, each one song type (a run of repeated high notes, a faster lower run, a run of low downslurs, an end flourish), repeated for a bout of 4 to 12 songs. `birds.md` says only "strong, characteristic, sings in dialects", so the whole shape is a guess marked in `_note`. Call: a 'pink' series, placeholder based on the great tit's "like the chaffinch". Plate: male hood is hatching over shadow, breast shadow, chestnut back hatched, 2 white wing bars on all three. New: a hatch takes its pitch from `<id>_pitch` in the variant (`hood_pitch`), and a WING callout label in both languages (`plate.wing`). Bill colour shows `[TO VERIFY]`. MP3s: `out/bokfink-song.mp3`, `out/bokfink-call.mp3`. Snapshots: `out/m3-bokfink-*.png`.
- Gråspurv done 2026-11-26, Eirik approved the MP3s: `data/birds/graspurv/`. Song: a run of 3 to 10 harsh chirps ('sjirp', two-part 'sjilp', lower 'tsjip') around 3 to 5 kHz, 2 to 4 a second, repeated in bouts of 3 to 8. Calls: a fast rough chatter run or a soft high twitter; no transcriptions in `birds.md`, both guesses in `_note`. Plate: male grey crown and underparts (shadow), black throat patch (ink, `bib` variant), streaked back; female brown crown as hatching (`crown_pitch`). Bill, every female value but the crown, and the whole juvenile show `[TO VERIFY]`; juvenile drawn like the female. Plate header now shrinks the serif to fit long names instead of an ellipsis (`MainComponent.cpp`). MP3s: `out/graspurv-song.mp3`, `out/graspurv-call.mp3`. Snapshots: `out/m3-graspurv-*.png`.
- M3 done: every item in `milestones.md` M3 is done and all 5 garden birds are approved by ear.
- M1 done 2026-11-26: blackbird approved as recognisable. Final knob ranges are in `prd.md`.
- Built in M2 round 1: `standalone/Source/MainComponent.*` (window, layout, timer), `UI/Theme.h` (tokens, bevels, hatch, graph paper, fonts), `UI/Widgets.h` (`Btn`), `UI/Knob.h`, `UI/Sonogram.h`, `UI/Plate.h`, `UI/BirdList.h`, `UI/Strings.h`. Engine now publishes knob mode and hold countdown, stereo peaks, a sonogram feed (375 frames/s) and the current phrase (seqlock). Contour helpers moved to `BirdData.h` so the sonogram draws grey with the engine's own maths. Data: `data/birds/index.json` (18 birds, names unverified), `data/birds/svarttrost/plate.json`, `data/strings/en.json` and `no.json` (Play screen only; Norwegian wording is mine, Eirik to check).
- Verified: zero warnings in core, render tool and standalone. Engine audio is byte-identical to M1 for song and call (seed 1, 30 s). `tipp-render --check-override` passes 18 checks (hold, 3 s wait, 300 ms return, latch, return all, autoplay off, sing once, sonogram hand mark, phrase publish). Snapshots in `out/m2-play-*.png` match `Main.dc.html` in layout, sizes, colours and labels, in English and Norwegian. Core still compiles with `emcc`.
- Not verified: the standalone has only been tried on Eirik's Mac. State (seed, knobs) is not saved between launches.
- Fonts: IBM Plex Mono 400/500/600 and Instrument Serif 400 are in `standalone/Resources/fonts/` with their OFL texts, fetched from github.com/google/fonts on 2026-11-26, and embedded through `BinaryData`. Without them CMake warns and the app falls back to Menlo and Georgia.
- Choices made in M2 round 1, open to Eirik: grey shows the rest of the phrase being sung, not the phrase after the pause (it is not generated until it starts, so a Length or Variation drag in the pause still applies). Tabs other than PLAY, DRAW, ½×, ¼×, −1 OCT, Dialect, Mimics, the bird stepper and the 17 birds without data are hatched as disabled. Plate callouts not in `birds.md` (juvenile bill, female and juvenile eye-ring, juvenile throat) show `[TO VERIFY]`; the juvenile caption no longer claims a practice song. App starts stopped. State (seed, knobs) is not saved between launches yet.
- Song shapes, timings and pitches in `songs.json` are sound design guesses, marked in its `_note`. The twitter ending and phrase length are still `[TO VERIFY]` in `birds.md`.
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

- `data/birds/<id>/`: `bird.json` (facts, song notes, song type texts, calendar, lookalikes, phrase part names, each text `{en, no, verified}`; names live in `index.json`), `voice.json` (base voice and knob ranges), `songs.json` (syllables, phrases, rules keyed by song type with overrides for season, time, sex and age), `plate.json` (paths, pivots, callouts).
- `data/strings/`: every interface string in both languages.
- `<id>` is the Norwegian name in lower case with æ, ø, å written ae, o, a, as in `svarttrost` and `kjottmeis`. Decided 2026-11-26: macOS stores non-ASCII file names decomposed (NFD), which breaks matching on the web. The real name lives in the data.

## Build and test

Checked in M0 and M1:

- Core and render tool: `cmake -B build -G Xcode && cmake --build build --config Release`
- Render a bird: `build/Release/tipp-render --bird svarttrost --type song --seconds 30 --out out/svarttrost-song.wav` (also `--type call`). Run from the repo root, or pass `--data <dir>`.
- Options: `--seed <n>`, and `--set <id>=<value>` (repeatable). A knob set this way is held by hand for the whole render. Choices take their option id, for example `--set sc_time=dusk`.
- List parameter IDs: `build/Release/tipp-render --list-params`
- MP3 for listening: `ffmpeg -v error -y -i out/svarttrost-song.wav -b:a 192k out/svarttrost-song.mp3`
- Spectrogram to check shapes without listening: `ffmpeg -v error -y -t 10 -i out/svarttrost-song.wav -lavfi "showspectrumpic=s=1600x500:mode=combined:scale=log:stop=10000" out/song.png`
- Standalone (fetches JUCE, own build folder): `cmake -B build-standalone -G Xcode -DTIPP_BUILD_STANDALONE=ON && cmake --build build-standalone --config Release --target Tipp`. The app lands in `build-standalone/standalone/Tipp_artefacts/Release/Tipp.app`.
- Override check (no audio file): `build/Release/tipp-render --bird svarttrost --check-override`
- COMPARE check and listening file: `build/Release/tipp-render --bird blameis --compare kjottmeis --out out/compare.wav`. The file ends when the comparison is done.
- Standalone snapshot (plays, optionally drags a knob 3 s before the end, saves the window and quits): `build-standalone/standalone/Tipp_artefacts/Release/Tipp.app/Contents/MacOS/Tipp --snapshot out/play.png --seconds 7 [--hand vo_pitch] [--lang no] [--bird kjottmeis] [--sex female] [--age juvenile] [--tab guide] [--compare kjottmeis]`. Without `--hand` it waits for mid-phrase so the grey strokes show.
- Core to WASM, compile check only: `for f in Engine BirdData Json Surroundings Compare; do emcc -std=c++17 -O2 -c core/$f.cpp -o /tmp/$f.o; done`

Planned, not yet working:

- Web (M8): `cd web && npm run dev`
- Phone (M9): `cd phone && npx cap run ios`

There is no unit test suite. The render check is the test. `tipp-render` exits 0 when every check passes, 1 when one fails, 2 on bad arguments or I/O. Besides the limits below it checks that the bird sang (at least one phrase, rms at least 0.003). The render stops `pb_play` 100 ms before the end and the engine fades out in 30 ms, which is how the file ends at zero. The limits are constants at the top of `tools/render/main.cpp`. It writes 32-bit float WAV so non-finite samples stay visible.

Layout of the build:

- `tipp_warnings` in the root `CMakeLists.txt` holds the strict warning flags. Link it to every project target that is not JUCE.
- `core/` is the static library `tipp_core`. `Engine` reads its setters through atomics once per 32-sample sub-block.
- Engine API: `setParam(index, value)` with the index in `params::all` (`params::indexOf(id)` is constexpr). On a knob that sets the hand value; wrap drags in `handDown(k)` and `handUp(k)`. `trigger(index)` for the three triggers. `setBird(const BirdData*)`: the host owns it and keeps it alive until `birdInUse()` stops returning it. Read back with `knobValue`, `knobOverridden`, `birdLevel`, `seed`, `phrasesStarted`.
- The host reads the JSON files and hands their text to `tipp::parseBird()`. Parsing in C++ keeps the result identical native and in WASM.
- Musical choices use only `Rng` (integer `below()` and 24-bit `unit()`). Audio noise uses `Noise`, which never touches phrase choice.
- `songs.json` per song type: `pause_s`, `length_s`, `transpose_st`, `avoid_repeat`, `bout`, `auto`, `phrases` (weight, sections with `pool`, `count`, `share`, `chance`, `gap_ms`, `lead_gap_ms`, `no_adjacent_repeat`, `part`), `overrides`. `part` names the section for the field guide's brackets; the words live in `bird.json` under `parts`. It draws no random numbers. A repeated multi-note motif is one syllable whose amp contour drops to 0 between notes.
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

- zsh does not split a variable into words. In a loop over render options use `${=args}`, or `tipp-render` sees one argument and prints usage.
- `songs.json` amp contours must start and end at 0, or `parseBird` refuses the syllable. The engine relies on it for click-free notes.
- `ph_length` cannot make a phrase longer than its sections' `count` maximum allows. At 8 s a blackbird phrase still stops at about 13 syllables.
- `AudioProcessorEditor` already has a member called `processor`. Name the reference `proc`.
- `String (v, 0)` does not mean zero decimals. Use `String (roundToInt (v))`.
- Static `StringArray` objects trigger leak-detector noise at shutdown. Return a fresh one from a function.
- `setSize()` in a component constructor calls `resized()` at once. Call it after every child exists, or `resized()` touches null children (M2 crashed this way).
- A new source file in a CMake target needs a reconfigure (`cmake -B build-standalone ...`) before the Xcode build sees it, or the link fails.
- In snapshot mode `runSnapshot` presses Play, and Play stops a running COMPARE. Start the comparison after it.
- A timer that counts its own ticks runs slow under load. Time tests with `Time::getMillisecondCounterHiRes()`.
