# Pipp on the App Store

Drafted 2026-11-27. Everything here goes into App Store Connect by hand (Eirik), except the build, which Xcode uploads. Norwegian wording is mine, Eirik to check.

## Steps, in order

1. **App Store Connect, new app** (Eirik): appstoreconnect.apple.com, Apps, +, New App. Platform iOS, name below, primary language Norwegian (Bokmål) or English, bundle id `no.skisse.pipp` (pick it from the list; Xcode registered it), SKU `pipp-ios`, full access.
   - If the name Pipp is taken, try "Pipp – fuglesang" or "Pipp: Norwegian birdsong". The name on the phone stays Pipp either way.
2. **Agreements, tax and banking** (Eirik): only needed for a paid app. A free app needs only the Free Apps agreement, which is accepted with the developer program.
3. **Upload the build** (Claude, once step 1 is done): `xcodebuild -exportArchive` with method `app-store-connect` and destination `upload`, from `build-phone/Pipp.xcarchive`. Or in Xcode: Window, Organizer, Pipp, Distribute App, App Store Connect.
4. **Fill in the listing** (Eirik): the texts below, screenshots from `out/store/`, privacy, age rating, price.
5. **TestFlight first** (recommended): install from TestFlight on the iPhone and try it once before review.
6. **Submit for review** (Eirik presses the button).

## Listing

| Field | English | Norsk |
|---|---|---|
| Name (30) | Pipp | Pipp |
| Subtitle (30) | Play Norwegian birdsong | Spill norsk fuglesang |
| Category | Education. Secondary: Music | Utdanning. Sekundær: Musikk |
| Price | Free | Gratis |
| Age rating | 4+ (no questionnaire item applies) | |
| Privacy policy URL | https://slowjogger3000.github.io/Pipp/privacy.html | same |
| Support URL | https://slowjogger3000.github.io/Pipp/privacy.html | same |
| Marketing URL | https://slowjogger3000.github.io/Pipp/ (optional) | same |
| Copyright | 2026 Skisse | |

Keywords (100 characters, comma separated, no spaces):

- EN: `birdsong,birds,bird song,birding,Norway,blackbird,robin,quiz,synth,dawn chorus,nature,field guide`
- NO: `fuglesang,fugler,fuglekikking,svarttrost,rødstrupe,fuglequiz,morgenkor,natur,feltguide,lyd`

Promotional text (170):

- EN: 50 Norwegian birds, synthesised and playable. Turn the knobs and the bird sings for you.
- NO: 50 norske fugler, syntetisert og spillbare. Vri på knappene, og fuglen synger for deg.

Description, English:

> Pipp is a birdsong emulator. It synthesises the songs and calls of 50 common Norwegian birds, one bird at a time, and lets you play the bird with knobs.
>
> PLAY: choose a bird, a season, the time of day and the place, and it sings. Turn pitch, breath, tension, tempo, distance and wind, and hear the bird change. Slow it to a half or a quarter and drop it an octave to hear what goes on in a phrase. Draw your own phrase on the sonogram and let the bird sing it.
>
> GUIDE: what the bird looks and sounds like, male, female and young, when it sings through the year, and which birds it is mistaken for, with the two played one after the other.
>
> QUIZ: 10, 20 or 50 questions on song, call or both, with the birds you missed at the end.
>
> CHORUS: the dawn chorus, four birds entering one by one before sunrise.
>
> LISTEN: record the birds around you and take pictures for your own collection, with a log of what you heard. Pipp does not recognise birds yet.
>
> Every sound comes from the synthesiser, not from recordings. Nothing leaves your phone: no account, no ads, no tracking.

Description, Norsk:

> Pipp er en fuglesang-emulator. Den syntetiserer sang og lokkelyder fra 50 vanlige norske fugler, én fugl om gangen, og lar deg spille fuglen med knapper.
>
> SPILL: velg fugl, årstid, tid på døgnet og sted, og den synger. Vri på tonehøyde, pust, spenning, tempo, avstand og vind, og hør fuglen endre seg. Senk farten til halv eller kvart og senk en oktav for å høre hva som skjer i en frase. Tegn din egen frase i sonogrammet og la fuglen synge den.
>
> BOK: hvordan fuglen ser ut og høres ut, hann, hunn og ungfugl, når den synger gjennom året, og hvilke fugler den forveksles med, spilt etter hverandre.
>
> QUIZ: 10, 20 eller 50 spørsmål om sang, lokkelyd eller begge, med fuglene du bommet på til slutt.
>
> KOR: morgenkoret, fire fugler som starter én etter én før soloppgang.
>
> LYTT: ta opp fuglene rundt deg og ta bilder til din egen samling, med en logg over det du hørte. Pipp kjenner ikke igjen fugler ennå.
>
> Hver lyd kommer fra synthesizeren, ikke fra opptak. Ingenting forlater telefonen: ingen konto, ingen reklame, ingen sporing.

## App Privacy

Answer "No, we do not collect data from this app". Matches `phone/ios/App/App/PrivacyInfo.xcprivacy` and the privacy page.

## Export compliance

`ITSAppUsesNonExemptEncryption` is false in Info.plist, so App Store Connect does not ask.

## Notes for the reviewer

> Pipp synthesises birdsong; no sign-in is needed. The microphone is used only on the LISTEN tab after the user presses START LISTENING, to record birds into the user's own collection on the device. The camera and photo library are used only to add a picture of a bird to that collection. Nothing is sent off the device. The app works offline.

## Screenshots

Taken 2026-11-27 in the iPhone 18 Pro Max simulator, 1320 × 2868 (6.9"), status bar set to 9:41 and full battery. Apple scales them down for smaller phones. Upload in this order:

| # | English | Norsk | Shows |
|---|---|---|---|
| 1 | `out/store/en-1-play.png` | `out/store/no-1-play.png` | PLAY, blackbird singing on the sonogram |
| 2 | `out/store/en-2-knobs.png` | `out/store/no-2-knobs.png` | Autoplay and the 12 knobs |
| 3 | `out/store/en-3-quiz.png` | `out/store/no-3-quiz.png` | A quiz question answered |
| 4 | `out/store/en-4-chorus.png` | `out/store/no-4-chorus.png` | Dawn chorus, 4 birds sung in, minutes before sunrise |
| 5 | `out/store/en-5-listen.png` | `out/store/no-5-listen.png` | LISTEN with the bird chooser |
| 6 | `out/store/en-6-guide.png` | `out/store/no-6-guide.png` | GUIDE, the blackbird plate and the male and female table |

The chorus and guide shots were retaken after the markers were removed. `out/` is gitignored, so these files live only on this Mac.

Seen while taking them, not fixed: on the phone in English, COLLECTION touches the right edge of its tab; in GUIDE the season row's last button reads WIN (cut off) and the xeno-canto link is cut.

## Review risks

- Fixed 2026-11-27: the app shows no `[TO VERIFY]` markers any more. Unknowns read "Not described", and texts say what the sources leave out.
- Placeholder sounds (herring gull, wagtail, others) are marked in the data but sound like real calls to a user.
- A web view app can be rejected as "minimum functionality" (4.2). Pipp has native audio, microphone, camera and file sharing, so the risk is low.
