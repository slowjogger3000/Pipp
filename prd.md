# Tipp: product requirements

Version 1, 2026-11-26. Owner: Eirik (Skisse).

## What it is

A birdsong emulator. Tipp synthesises the songs and calls of common Norwegian birds. A bird sings by itself (autoplay), and you can grab any knob to bend the song for a moment. Around that instrument sit a field guide, ear training, a dawn chorus and, on the phone, recognition from the microphone with a personal collection.

## Who it is for

- People who want to play with birdsong as an instrument.
- Birders who want to learn songs and tell similar birds apart.

## Platforms

| Platform | Carries |
|---|---|
| Mac standalone | Play, Field guide, Quiz, Chorus, Log, Collection (import only) |
| Web app | The same six screens, every control on every screen size |
| Phone app (iOS first) | The web app plus Listen and Collection |

## Core model

**One bird at a time.** The selected bird owns the plate, the sonogram and all knobs.

**A song is data.** Each bird has syllables (pitch and amplitude contours), phrases built from syllables, and rules for how phrases follow each other. Rules vary by season, time of day, song type, sex and age. See "Bird data" below.

**Autoplay** picks and varies phrases from those rules with a seed. It also moves the knob values through each phrase.

**Override.** Dragging a knob takes that parameter away from autoplay.

1. While the knob is held, the engine uses the hand value.
2. After release it holds the hand value for HOLD AFTER RELEASE (default 3.0 s, range 0.5 to 20 s).
3. Then it returns to the autoplay value over 300 ms.
4. LATCH keeps every override until it is switched off. RETURN ALL releases all overrides at once.

LATCH is on when the app starts (Eirik, 2026-11-26): a knob you set stays where you put it until RETURN ALL, or until LATCH is switched off. Steps 2 and 3 apply only with LATCH off.

With autoplay off, SING ONCE triggers one phrase and the knobs stay where the hand left them.

## Controls

### Scene

| Control | Values | Notes |
|---|---|---|
| Season | Spring, Summer, Autumn, Winter | Manual only |
| Time of day | Dawn, Day, Dusk, Night | Manual only |
| Song type | Song, Call, Alarm, Flight | A type the bird lacks in this scene is hatched and disabled |
| Place | Garden, Forest, Open, Shore | Sets the reverb and background character |
| Dialect | Per bird | Hatched for birds with none |
| Mimics | Per bird | Only for mimics such as starling. Hatched otherwise |

### Bird

| Control | Values |
|---|---|
| Bird | 18 birds in 4 groups, see `birds.md` |
| Sex | Male, Female |
| Age | Adult, Juvenile |

Sex and age change the plate and its callouts. Whether they change the sound is set per bird in the data. Where the facts are not verified, they change the picture only.

### Knobs

| ID | Label | Range | Unit |
|---|---|---|---|
| `vo_pitch` | Pitch | 0.5 to 2.0 of the bird's own pitch | shown in kHz |
| `vo_breath` | Breath | 0 to 100 | % |
| `vo_tension` | Tension | 0 to 100 | % |
| `vo_trill` | Trill | 0 to 40 | Hz |
| `vo_rough` | Rough | 0 to 100 | % |
| `ph_tempo` | Tempo | 50 to 200 | % |
| `ph_pause` | Pause | 0.2 to 20 | s |
| `ph_length` | Length | 0.2 to 8 | s |
| `ph_variation` | Variation | 0 to 100 | % |
| `su_distance` | Distance | 1 to 200 | m |
| `su_wind` | Wind | 0 to 15 | m/s |
| `su_space` | Space | 0 to 100 | % |

Final after M1 (2026-11-26): the ranges above are kept as they are. The blackbird was approved as recognisable with them, and `data/birds/svarttrost/voice.json` uses the same ranges. A later bird may narrow a range in its own `voice.json`.

Where autoplay moves a knob, it stays inside a narrower range set per song type in `songs.json`. The blackbird's song moves Pitch 0.97 to 1.03, Breath 8 to 18, Tension 15 to 32, Rough 3 to 10 and Tempo 92 to 108. Its call moves Pitch 0.98 to 1.02, Breath 18 to 26, Tension 72 to 88 and Rough 10 to 18.

Length cannot make a phrase longer than the most syllables its phrase rules allow.

### Autoplay

AUTOPLAY on/off, HOLD AFTER RELEASE, LATCH, RETURN ALL, SING ONCE, REROLL (new seed).

### IDs for the other controls

Decided 2026-11-26. A trigger is an event, not a stored value.

| ID | Control | Kind |
|---|---|---|
| `sc_bird` | Bird | choice, the bird's id |
| `sc_sex` | Sex | choice |
| `sc_age` | Age | choice |
| `sc_season` | Season | choice |
| `sc_time` | Time of day | choice |
| `sc_type` | Song type | choice |
| `sc_place` | Place | choice |
| `sc_dialect` | Dialect | choice, per bird |
| `sc_mimics` | Mimics | on/off |
| `ap_on` | Autoplay | on/off |
| `ap_hold` | Hold after release | 0.5 to 20 s |
| `ap_latch` | Latch | on/off |
| `ap_seed` | Seed | integer, saved with the state |
| `ap_return_all` | Return all | trigger |
| `ap_sing_once` | Sing once | trigger |
| `ap_reroll` | Reroll | trigger, writes a new `ap_seed` |
| `pb_play` | Play and Stop | on/off |
| `pb_speed` | Speed | 1, 0.5, 0.25 |
| `pb_shift` | Hearing shift | off, -1 oct |
| `pb_draw` | Draw | on/off |

### Sonogram tools

| Control | Values | Effect |
|---|---|---|
| Draw | on/off | Sketch a pitch line on the sonogram and the bird sings it |
| Speed | 1×, ½×, ¼× | Slows the song without changing pitch |
| Hearing shift | Off, −1 oct | Drops the whole song one octave for listeners who cannot hear the top |

## Screens

Full detail is in `design-handover.md`.

1. **Play.** Bird list, plate, sonogram, scene, knobs, autoplay.
2. **Field guide.** Plate, male and female table, field facts, song notes with the four song types, year calendar, lookalikes, mnemonic, link to real recordings.
3. **Quiz.** A mystery song with four answers, an explanation, and settings for which birds and hints.
4. **Dawn chorus.** Up to 4 birds on a timeline in minutes from sunrise, one per track colour.
5. **Log.** Heard-it entries with date, time, bird, type, sex or age seen, place and note. Export as CSV. Link out to Artsobservasjoner.
6. **Listen** (phone). Microphone sonogram, recognised bird with confidence, runners-up, save recording, take picture, compare with Tipp's emulation.
7. **Collection** (phone). The user's own recordings and pictures, sorted per bird. On the phone the log lives here as a third list.

## Bird data

One folder per bird in `data/birds/<id>/`:

- `bird.json`: names in Norwegian, English and Latin, group, facts, calendar, lookalikes, status, and a `verified` flag per field.
- `voice.json`: the bird's base voice settings and knob ranges.
- `songs.json`: syllables, phrases and rules, keyed by song type with overrides for season, time, sex and age.
- `plate.json`: vector paths for the ink plate, animation pivots for beak and tail, and the callout points for sex and age differences.

A field with `verified: false` renders with the `[TO VERIFY]` marker.

## Recognition (phone)

**Parked.** The engine is not chosen. Build Listen against an interface:

```
recognise(audioWindow) -> [{ birdId or latinName, confidence }]
```

Ship M9 with a stub that returns fixed results, so the screen, saving and collection can be finished and tested. Options when the decision is taken up again:

| Engine | Licence | Note |
|---|---|---|
| BirdNET v2.4 | Non-commercial | Not usable in a paid app |
| BirdNET+ V3.0 preview | CC BY-SA 4.0 on the weights, plus extra terms | About 152 MB, about 9,800 species, still a preview. Read the full terms first |
| Own model for the 18 birds | Own | Small. Needs training recordings |

A recognised bird that is not one of the 18 is shown hatched with "not in Tipp".

## Storage and privacy

- Settings, log, recordings and pictures are stored on the device.
- Nothing from the microphone is saved until the user presses save.
- No account, no upload, no analytics in version 1.

## Language

English and Norwegian (bokmål), switched in the header. Bird names follow the language, with the other name shown beside it. Norwegian numbers use a decimal comma.

## Ethics note

The Log and Collection screens carry a short field manners note: playing song outdoors to draw birds in stresses them, most of all in the breeding season.

## Out of scope for version 1

- Plugin formats (AU, VST3), MIDI input, host sync.
- Live clock or location driving season and time.
- Accounts, cloud sync, sharing between users.
- Android. The phone build targets iOS first.

## Open items

| Item | State |
|---|---|
| Recognition engine | Parked by Eirik |
| Does the female or juvenile sound differ | Not verified for any bird |
| Dawn chorus entry order and times | Not verified |
| Mnemonics | None collected yet |
| Desktop collection | Designed. Filled by importing the phone app's export, the export format is not specified yet |
