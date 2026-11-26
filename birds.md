# Tipp: birds and facts

Rule: a fact goes into the app as verified only if this file says so. Everything else shows `[TO VERIFY]`.

## The 18 birds

| No | Group | Norwegian | English | Latin |
|---|---|---|---|---|
| 01 | Garden | Kjøttmeis | Great tit | Parus major |
| 02 | Garden | Blåmeis | Blue tit | Cyanistes caeruleus |
| 03 | Garden | Svarttrost | Blackbird | Turdus merula |
| 04 | Garden | Rødstrupe | Robin | Erithacus rubecula |
| 05 | Garden | Bokfink | Chaffinch | Fringilla coelebs |
| 06 | Garden | Gråspurv | House sparrow | Passer domesticus |
| 07 | Forest | Løvsanger | Willow warbler | Phylloscopus trochilus |
| 08 | Forest | Måltrost | Song thrush | Turdus philomelos |
| 09 | Forest | Gjøk | Cuckoo | Cuculus canorus |
| 10 | Forest | Flaggspett | Great spotted woodpecker | Dendrocopos major |
| 11 | Forest | Gjerdesmett | Wren | Troglodytes troglodytes |
| 12 | Coast and water | Gråmåke | Herring gull | Larus argentatus |
| 13 | Coast and water | Tjeld | Oystercatcher | Haematopus ostralegus |
| 14 | Coast and water | Ærfugl | Eider | Somateria mollissima |
| 15 | Coast and water | Storspove | Curlew | Numenius arquata |
| 16 | Night | Kattugle | Tawny owl | Strix aluco |
| 17 | Night | Rugde | Woodcock | Scolopax rusticola |
| 18 | Night | Nattergal | Thrush nightingale | Luscinia luscinia |

The names and Latin binomials were written from general knowledge and have not been checked against Artsdatabanken's name list. Check them in M3 and M10.

The great spotted woodpecker drums. Its "song" type is a drum roll, so the voice engine needs a percussive source for it.

## Svarttrost, checked 2026-11-26

Sources used: Store norske leksikon (snl.no/svarttrost), which follows Artsdatabanken's classification and cites BirdLife Norge for its population figure. A search excerpt from Fuglevennen (fuglevennen.no). A BirdLife Norge press release from 2021. Artsdatabanken's own species page and the full Fuglevennen page could not be opened, so check those two when possible.

### Verified

| Field | Value | Source |
|---|---|---|
| Length | About 25 cm | Fuglevennen: just over 25 cm. SNL: 24 cm |
| Male | All black, orange-yellow bill, yellow eye-ring | Fuglevennen, SNL |
| Female | Dark brown, paler brown-spotted throat and breast | SNL, Fuglevennen |
| Female bill | Lacks the male's orange-yellow bill. Some adult females have a fairly yellow one | BirdLife Norge, Fuglevennen |
| Juvenile | Brown-black | SNL |
| First-winter male | Dark bill that lightens through late winter, no eye-ring | Fuglevennen, SNL |
| Song | Mellow, melodious, fluting tones, often slow. No repeated phrases. Varies a lot between birds | SNL |
| Song perch and time | Often from a treetop, mostly early morning and late evening | SNL |
| Singing starts | February | Fuglevennen |
| Call | A metallic, monotonous "pink pink pink" at dusk before roosting, or when disturbed | SNL |
| Alarm | Has a loud alarm call | SNL |
| Habitat | Forest with undergrowth, also towns. Avoids uniform conifer forest | SNL |
| Range in Norway | Common in the lowlands north to Trøndelag, sparser in Nordland, very rare further north | SNL |
| Food | Insects, snails, earthworms. Berries and fruit in autumn and winter | SNL |
| Nest | Cup in a bush, low tree or on a ledge. The female builds | SNL |
| Eggs | 4 to 6 | SNL |
| Broods | 2 in a season is not unusual | SNL |
| Migration | Migrants travel alone at night and return in late March | SNL |
| Status | LC, viable, on the Norwegian red list | SNL |
| Versus song thrush | The song thrush repeats its phrases, the blackbird does not | SNL |

### Sources disagree

Wintering. BirdLife Norge: most leave the country in autumn, and many males stay in the lowlands and live on berries and fruit. SNL: many overwinter along the coast as far north as Troms. The design uses BirdLife Norge's wording.

### To verify

- Phrase length in seconds, and whether phrases end in a thin twitter.
- How the alarm call sounds.
- Any flight call.
- The last singing month.
- Whether females sing.
- Whether juveniles sing a quieter practice song.
- Wingspan and weight.
- The lookalike texts for mistle thrush (duetrost) and starling (stær).
- A mnemonic in Norwegian and English.

## All other birds

Nothing is verified. Collect facts per bird with the same fields as the blackbird table before writing `bird.json`.

## Dawn chorus

The design shows robin, blackbird, song thrush and great tit entering at 70, 60, 50 and 25 minutes before sunrise. These numbers are placeholders with no source.

## Where to look

- Artsdatabanken: names, classification, red list, observations.
- BirdLife Norge and Fuglevennen: identification, song descriptions, wintering.
- Store norske leksikon: general species accounts.
- xeno-canto: real recordings to tune the voice against. Check each recording's licence before using it for anything other than listening.
