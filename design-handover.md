# Pipp: design handover

The design lives on a canvas: https://claude.ai/code/artifact/c24a91fc-53bd-4c36-bc48-d48d083210e7

The `design/` folder holds the source of each screen. Each `.dc.html` file is plain HTML with inline styles, so every size, colour and label can be read straight from it. They do not render outside the canvas, so read them as a spec.

| File | Screen | Size | Language |
|---|---|---|---|
| `Main.dc.html` | Play (F1) | 1280×800 | English |
| `Guide.dc.html` | Field guide (F2) | 1280×800 | English |
| `Quiz.dc.html` | Quiz (F3) | 1280×800 | English |
| `Chorus.dc.html` | Dawn chorus (F4) | 1280×800 | English |
| `Log.dc.html` | Heard-it log (F5) | 1280×800 | English |
| `Phone.dc.html` | Phone, Play | 390 wide | Norwegian |
| `Listen.dc.html` | Phone, Listen | 390 wide | Norwegian |
| `Collection.dc.html` | Phone, Collection | 390 wide | Norwegian |
| `CollectionLog.dc.html` | Phone, the log inside Collection | 390 wide | Norwegian |
| `CollectionEmpty.dc.html` | Phone, empty collection | 390 wide | Norwegian |
| `ListenDenied.dc.html` | Phone, Listen without microphone access | 390 wide | Norwegian |
| `PhoneGuide.dc.html` | Phone, Field guide (Bok) | 390 wide | Norwegian |
| `PhoneQuiz.dc.html` | Phone, Quiz | 390 wide | Norwegian |
| `PhoneChorus.dc.html` | Phone, Dawn chorus (Kor) | 390 wide | Norwegian |
| `PhoneBirds.dc.html` | Phone, bird picker | 390 wide | Norwegian |
| `Draw.dc.html` | Song panel in draw mode | 710×384 | English |
| `DeskCollection.dc.html` | Collection (F6), desktop | 1280×800 | English |
| `tokens.json` | Skisse design tokens | | |

None of these were rendered and checked by eye when they were made. If a measurement in a file looks wrong on screen, trust the rules below over the file.

## Office beige rules

These come from the Skisse design system and apply to every screen.

- **State is ink.** On is filled `ink` (#221c14) with `onInk` (#ddd3bd) text. Off is a raised face.
- **Colour is the track.** `clay`, `khaki`, `sage` and `plum` name channels 1 to 4. In Pipp they appear in the wordmark bar and the 4 chorus lanes. Text on clay and plum is `paper`, on khaki and sage it is `ink`.
- **Red is only Rec.** `rec` (#c2331a) appears on the Listen dot and nowhere else.
- **Sections are labelled.** Caps label in `inkSoft`, then a 1px ink hairline to the edge.
- **Wells hold data.** Anything you read a value from sits in a `face` well with an inset bevel. Lists sit on `sheet`.
- **Disabled is hatched.** 135° lines, 1px, 7px pitch, `hatch` colour.
- **Square corners.** Only knob caps and the Rec dot are round.
- **Every boundary is a 1px ink line.** Joined controls overlap by 1px.
- **Bevels.** Raised: `inset 1px 1px 0 #fbf7ec, inset -1px -1px 0 #a3967a`. Inset: `inset 1px 1px 0 #a3967a`. A pressed or on control has no bevel.
- **Graph paper** in wells that show signal: `rule` every 8px, `ruleMajor` every 40px.
- **Type.** IBM Plex Mono 400, 500, 600 for labels, values, buttons. Instrument Serif 400 for the wordmark, bird names and panel titles. No sans.
- **Writing.** Control labels in caps. Names in sentence case in the serif. Values carry units with a real minus sign. Displays get a `FIG. n` caption.

## Pipp's own conventions

| Thing | Rule |
|---|---|
| Knob sung by autoplay | 3px value ring in `plum` |
| Knob held by hand | 3px value ring in `ink` plus a `HAND` tag at the top right of the knob |
| Sonogram, already sung | `ink` strokes |
| Sonogram, coming next | `shadow` (#a3967a) strokes |
| Playhead | 1px `plum` line with a `NOW` flag |
| Hand override on the sonogram | 4px ink bar along the top over the time it was held, with a label |
| Unavailable song type | Hatched and disabled |
| Quiz, correct answer | Ink fill, label CORRECT |
| Quiz, wrong pick | Hatched, label YOUR ANSWER |
| Recognised bird not in Pipp | Hatched row with a "not in Pipp" tag |
| Unverified content | The literal marker `[TO VERIFY]` |

## Shared layout, desktop

Window 1280×800, 1px ink border. Stacked bands:

1. **Header, 56px.** Wordmark "Pipp" in Instrument Serif 32px with the 5px four-colour bar under it. Play and Stop (44×32). Bird stepper with a 280px readout well. Language EN/NO. Output readout and meter.
2. **Tabs, 36px** on `panel`. PLAY F1, FIELD GUIDE F2, QUIZ F3, CHORUS F4, LOG F5. The active tab is on `ground` and 4px taller.
3. **Body, 680px.**
4. **Status bar, 28px** on `panel`. State on the left, key hints on the right.

Play and Field guide have a 240px bird list on the left: a `sheet` well, 24px rows, group headers on `panel`, the selected row in ink.

Keyboard: Space plays and stops, Up and Down change bird, F1 to F5 change screen, 1 to 4 answer in Quiz and mute lanes in Chorus.

## Play

Right of the bird list, top to bottom with 8px gaps:

| Row | Height | Content |
|---|---|---|
| Displays | 384 | Plate panel (flexible width) and Song panel (710 wide) |
| Scene | 56 | Season, Time of day, Song type, Place as 4-way switches, then Dialect and Mimics (92px each) |
| Knobs | 128 | Voice (5 knobs), Phrasing (4), Surroundings (3) |
| Autoplay | 64 | Band on `panel` |

**Plate panel.** 28px head with the bird name in serif 22px, then MALE/FEMALE and ADULT/JUV toggles (20px high). The well shows the ink plate on graph paper. Four callouts with leader lines name bill, eye-ring, plumage and throat, and their values change with sex and age. An 18px caption row under it.

**Plate drawing.** Vector paths in a 280×240 box, 1.5px ink outline, 1px hatching clipped to the body and cross-hatching on the wing. Hatch pitch carries tone: 5px for the black male, 10px for the brown female, 7px for the juvenile. The paths for the blackbird are in `Main.dc.html` and move to `plate.json`.

**Plate animation.** Upper mandible rotates up to −16° about (192, 67), lower mandible up to +10° about (192, 72), tail dips up to −5° about (98, 147), and three sound arcs fade in. In the design this runs on a fixed 6 s loop. In the build, drive it from the engine's amplitude so the beak follows the sound.

**Song panel.** Head with the title, then DRAW, SPEED (1×, ½×, ¼×), HEARING SHIFT (OFF, −1 OCT), and phrase number and length. Graph 680×320: 40px per kHz from 0 to 8 kHz, 80px per second, 8.5 s visible. The playhead is fixed and the song scrolls under it.

**Knob.** 56px across. 11 tick marks outside the ring at 27° steps over 270°. 3px ring, `faint` track under the value arc. Cap in `face` with a 1px ink edge and a 2px pointer. Label above in caps 10px 600, value below 10px 500. Hover shows the exact value in an ink flag.

**Autoplay band.** Title in serif, AUTOPLAY ON (32px, ink when on), HOLD AFTER RELEASE readout with − and + steppers, then LATCH, RETURN ALL, SING ONCE, REROLL. On the right, a legend for the two ring colours and a countdown bar for the knob that is held.

## Field guide

Two columns right of the bird list.

Left, 360px:

1. Plate panel with the same toggles.
2. **Male and female** table: plumage, bill, eye-ring, throat, song.
3. **Field facts** table: Norwegian, English and Latin name, length, broods, range, habitat, food, status, nest.

Right:

1. **Song notes.** A 320×160 sonogram of one phrase with brackets naming its parts, a link to real recordings at xeno-canto, a short description, the mnemonic, and a table of the four song types, each with its own play button.
2. **Year in Norway.** 12 month columns. A season row whose buttons set the season, a present row, and a sings row where non-singing months are hatched.
3. **Lookalikes.** Name in serif with the other-language name, one line on how the song differs, and COMPARE, which plays both birds back to back.

## Quiz

Left, 950px: question counter, a 920×240 sonogram with PLAY AGAIN, HALF SPEED and HINT, four answer buttons (44px, bird name in serif 22px) in a 2×2 grid, then a band with the explanation, COMPARE BOTH, OPEN IN FIELD GUIDE and NEXT.

Right: which birds are in the quiz (lookalike pairs, each group, all 18), what to ask for (song, call, both), hints (mnemonic, season, none), and the score.

The plate and the header bird readout are hidden until the question is answered. Missed birds return sooner.

## Dawn chorus

A morning row (season, place, dawn speed: real time, 10×, 60×, loop), then one panel.

- 4 lanes, 96px each. Lane head 302px wide: number chip in the track colour, bird name, MUTE, SOLO, CHANGE BIRD, and distance.
- Timeline 960px: 8px per minute, from 90 minutes before sunrise to 30 after. A band in the lane's colour starts where that bird begins singing.
- 1px ink line and flag at sunrise. `plum` playhead with a NOW flag.
- A muted lane is hatched across its full width.

Each bird keeps the voice and phrasing set on the Play screen.

## Log

Left, 360px: an entry form (bird, date, time, place, heard, saw, note), ADD TO LOG, a link to Artsobservasjoner, and the field manners note.

Right: the log list on `sheet` with columns date, time, bird, heard, saw, place and note. The selected row is ink. Under it OPEN BIRD, DELETE ENTRY, EXPORT CSV.

## Phone

390px wide, one column, 16px side padding. Touch targets are at least 44px high.

- Header 60px: wordmark, NO/EN, and on Play the transport.
- Tabs 44px: SPILL, BOK, LYTT, QUIZ, KOR, SAMLING.
- Play stacks everything from the desktop screen: bird stepper, plate, sonogram with a tool row (TEGN, 1×, ½×, ¼×, −1 OKT), scene as 6 rows, the autoplay band, then the three knob groups at 64px per knob.

**Listen.** A 56px LYTTER button in ink with the red dot and a timer, beside a microphone level well. A sonogram of the last 4 s with a 1px ink frame around the recognised phrase. The result panel: best match in serif 32px with a confidence bar, then runners-up as 44px rows. Actions: LAGRE OPPTAK, TA BILDE, SAMMENLIGN, ÅPNE I BOK, ÅPNE SAMLING.

**Collection.** A filter between all birds and one bird. Recordings as 56px rows: play button, a 120×40 sonogram, type and length, date, confidence. Pictures in a 3-column grid of 112px tiles with a NYTT BILDE tile last. Actions: VELG, DEL, EKSPORTER.

## Later additions

**Tabs.** Desktop has a sixth tab, COLLECTION F6. On the phone every tab now links to its screen.

**Phone, Bok.** One column: bird stepper, plate with the sex and age toggles, male and female table, facts, song notes with the four song types as 56px rows, the year calendar (season buttons 44px high), lookalikes with SAMMENLIGN.

**Phone, Quiz.** Sonogram with SPILL IGJEN, HALV FART and HINT under it, four answers stacked, the explanation band with HØR BEGGE, ÅPNE I BOK and NESTE, then the setup rows.

**Phone, Kor.** Morning rows, then 4 lanes. Each lane is a 48px head (number chip, name, distance, DEMP, SOLO) over a 36px timeline strip. 356px covers 90 minutes before sunrise to 30 after.

**Phone, bird picker.** Opens from the bird readout. Group headers 28px, bird rows 44px with the number, the Norwegian name and the English name. LUKK closes it.

**Phone, Collection.** A switch at the top: OPPTAK OG BILDER or LOGG. The log is a list of two-line rows with the selected row in ink, JEG HØRTE DEN for a new line, export as CSV, the link to Artsobservasjoner and the field manners note.

**Phone, empty and refused states.** Empty collection: a title, one sentence, GÅ TIL LYTT and NYTT BILDE. Microphone refused: the listen button is hatched, the level well is empty, and a panel explains how to turn the microphone on with ÅPNE INNSTILLINGER.

**Draw mode.** DRAW is ink while on, with ERASE, CLEAR, SING IT and KEEP AS PHRASE beside it. Autoplay waits. The last sung phrase turns grey. The drawn line is 3px ink with 6px square points, a crosshair with a value flag follows the pointer, and a dashed line marks where the drawn phrase starts.

**Desktop Collection.** Bird list on the left with recording and picture counts per bird. Recordings in a list on `sheet` (play, sonogram, heard, length, date, match, from). Pictures in a 3-column grid on the right. The Mac has no recognition, so content comes from IMPORT FROM PHONE EXPORT or ADD FILES.

## Not designed yet

- Quiz, Chorus and the desktop Log with no content yet (empty states).
- The picture viewer and the recording detail view.
- The new-log-line form on the phone.
- Field guide, Quiz and Chorus in English on the phone. Use the Norwegian layouts with the English strings.

Ask Eirik before inventing any of these.
