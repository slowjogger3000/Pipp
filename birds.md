# Pipp: birds and facts

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

## Proposed for M11: 32 more birds (draft, Eirik to edit)

Drafted 2026-11-26 for M11, not yet agreed. Names and Latin names come from general knowledge and are not checked against Artsdatabanken, as for the 18. No fact about any of these birds is verified until its SNL check is written below, as for the 18. Strike, swap or move birds before M11 starts.

The aim: the birds a Norwegian beginner is most likely to hear in a year, spread over 7 groups so each group is a useful quiz set. Four of them are already named as lookalikes of the 18 (redwing, chiffchaff, lesser black-backed gull, common snipe), so COMPARE gets more to play.

| No | Group | Norwegian | English | Latin | Folder | Note |
|---|---|---|---|---|---|---|
| 19 | Garden | Skjære | Magpie | Pica pica | `skjaere` | harsh chatter |
| 20 | Garden | Kråke | Hooded crow | Corvus cornix | `krake` | |
| 21 | Garden | Ringdue | Wood pigeon | Columba palumbus | `ringdue` | cooing |
| 22 | Garden | Grønnfink | Greenfinch | Chloris chloris | `gronnfink` | |
| 23 | Garden | Stær | Starling | Sturnus vulgaris | `staer` | mimics; the MIMICS control stays dropped for version 1 |
| 24 | Garden | Linerle | White wagtail | Motacilla alba | `linerle` | |
| 25 | Forest | Rødvingetrost | Redwing | Turdus iliacus | `rodvingetrost` | lookalike of the song thrush |
| 26 | Forest | Gråtrost | Fieldfare | Turdus pilaris | `gratrost` | |
| 27 | Forest | Svarthvit fluesnapper | Pied flycatcher | Ficedula hypoleuca | `svarthvitfluesnapper` | |
| 28 | Forest | Granmeis | Willow tit | Poecile montanus | `granmeis` | |
| 29 | Forest | Fuglekonge | Goldcrest | Regulus regulus | `fuglekonge` | very high song |
| 30 | Forest | Gransanger | Chiffchaff | Phylloscopus collybita | `gransanger` | lookalike of the willow warbler |
| 31 | Forest | Bjørkefink | Brambling | Fringilla montifringilla | `bjorkefink` | |
| 32 | Forest | Svartspett | Black woodpecker | Dryocopus martius | `svartspett` | drums, uses `core/Drum.h` |
| 33 | Coast and water | Fiskemåke | Common gull | Larus canus | `fiskemake` | |
| 34 | Coast and water | Sildemåke | Lesser black-backed gull | Larus fuscus | `sildemake` | lookalike of the herring gull |
| 35 | Coast and water | Makrellterne | Common tern | Sterna hirundo | `makrellterne` | |
| 36 | Wetland and lake | Stokkand | Mallard | Anas platyrhynchos | `stokkand` | quacks: may need a rougher source |
| 37 | Wetland and lake | Sangsvane | Whooper swan | Cygnus cygnus | `sangsvane` | trumpeting |
| 38 | Wetland and lake | Storlom | Black-throated diver | Gavia arctica | `storlom` | wailing |
| 39 | Wetland and lake | Enkeltbekkasin | Common snipe | Gallinago gallinago | `enkeltbekkasin` | lookalike of the woodcock; its display sound is made by tail feathers, may need a new source |
| 40 | Mountain | Heipiplerke | Meadow pipit | Anthus pratensis | `heipiplerke` | name corrected from "heipiper" 2026-11-26 (SNL) |
| 41 | Mountain | Lirype | Willow ptarmigan | Lagopus lagopus | `lirype` | |
| 42 | Mountain | Heilo | Golden plover | Pluvialis apricaria | `heilo` | |
| 43 | Mountain | Ravn | Raven | Corvus corax | `ravn` | |
| 44 | Farmland | Låvesvale | Barn swallow | Hirundo rustica | `lavesvale` | |
| 45 | Farmland | Sanglerke | Skylark | Alauda arvensis | `sanglerke` | long song in flight |
| 46 | Farmland | Gulspurv | Yellowhammer | Emberiza citrinella | `gulspurv` | |
| 47 | Farmland | Vipe | Lapwing | Vanellus vanellus | `vipe` | |
| 48 | Night | Perleugle | Tengmalm's owl | Aegolius funereus | `perleugle` | |
| 49 | Night | Åkerrikse | Corncrake | Crex crex | `akerrikse` | |
| 50 | Night | Nattravn | Nightjar | Caprimulgus europaeus | `nattravn` | long churring |

Left out on purpose, to swap in if wanted: kaie (jackdaw), dompap (bullfinch), toppmeis (crested tit), munk (blackcap), trepiper (tree pipit), svartbak (great black-backed gull), strandsnipe (common sandpiper), steinskvett (wheatear), tårnseiler (swift), hornugle (long-eared owl).

## M11 batch 1, garden birds, checked 2026-11-26

Source: Store norske leksikon (snl.no), one page per bird, read in full on 2026-11-26. Transcriptions are SNL's own spelling. What SNL does not say is not verified.

### Skjære (folder `skjaere`), snl.no/skjære, Olav Hogstad and Magne Husby, updated 2026-11-17

| Field | Value |
|---|---|
| Length | About 50 cm, of which the tail is 20 to 30 cm |
| Plumage | Black and white, very long tail with green metallic gloss |
| Sexes | Alike; males on average about 10 % larger |
| Juvenile | Like the adults, shorter tail without gloss, thinner-looking neck |
| Song | Usually hoarse, rasping, not very musical sounds. The song is a low, slightly chattering creak, heard even on cold winter days. A pair close together both sing a babbling song |
| Call | «sjakk-sjakk-sjakk», chattering |
| Alarm | Fast staccato series «tsje-tsje-tsje»; at a cat a very intense «tsche-tsche-tsje-tsje» |
| Habitat | Strongly tied to human settlement |
| Range in Norway | The whole country |
| Food | Omnivore: insects, spiders, snails, worms, carrion, scraps, eggs and chicks, berries and grain |
| Nest | Large round stick nest with a roof and one or two side entrances, usually in a tree; building starts in late February |
| Eggs | 6 to 8, most often 7, laid April to May |
| Migration | Resident, very sedentary |
| Population | 100 000 to 200 000 pairs (BirdLife Norge) |
| Status | LC |
| Lookalikes | None named |

### Kråke (folder `krake`), snl.no/kråke, Olav Hogstad and Magne Husby, updated 2026-10-07

| Field | Value |
|---|---|
| Length, weight | Nearly 50 cm, 500 to 600 g |
| Plumage | Grey, with black head, breast, wings and tail |
| Sexes | Female somewhat smaller |
| Juvenile | A little duller than the adults |
| Call | The main call is a harsh, hoarse, rolling «krra krra krra», varying in tone and loudness. A perched bird bows with each call. The incubating female has a begging sound |
| Song | Not described separately |
| Habitat | Coast, inland and treeless mountain, mostly near people |
| Range in Norway | Coast, inland and mountains |
| Food | Omnivore, also nest robbing; drops snails and shellfish on rocks |
| Nest | Twig nest in a tree, bush, cliff or old building, built March to April |
| Eggs | Usually 4 to 5, laid April to May |
| Migration | Both resident and migrant; many winter on the coast, some go to Denmark, Germany, Belgium and Britain and return March to April |
| Population | 150 000 to 300 000 pairs |
| Status | LC |
| Versus raven | The crow's tail is square-cut, the raven's wedge-shaped; the crow flies slowly with calm wingbeats and rarely glides |
| Versus carrion crow | Formerly the same species (svartkråke); hybrids occur in Norway. No field marks given |
| Source note | SNL's systematics table lists Corvus corone, its fact box and text Corvus cornix |

### Ringdue (folder `ringdue`), snl.no/ringdue, Jørgen Skavdal Søraker, updated 2026-11-07

| Field | Value |
|---|---|
| Length, weight | 38 to 42 cm, wingspan 70 to 80 cm, about 300 to 600 g |
| Plumage | Grey-blue, white patch on each side of the neck, white band across the wing, most visible in flight |
| Sexes | Alike in size and plumage |
| Juvenile | The neck patch appears in the autumn of its first year |
| Song | A repeated rhythmic phrase of five syllables of unequal length, «ho-hoo-hoo-ho-ho», which can remind of an owl. Mostly by day. The male sings more than the female |
| Other sound | Can clap its wings together on take-off and at the top of a flight arc |
| Calls | Not described |
| Habitat | Forest and farmland; since the 1950s also city parks and gardens |
| Range in Norway | Most of the country, limited in Finnmark but spreading |
| Food | Seeds, grain, berries, nuts, acorns |
| Nest | Platform of dry twigs in a tree, usually 3 to 5 m up |
| Eggs | 1 to 2 |
| Broods | Often two a year; first brood April to May |
| Migration | Migrant, winters mainly in south-west Europe; some winter on the coast of southern Norway north to Trøndelag |
| Population | 350 000 to 700 000 pairs (BirdLife Norge) |
| Status | LC |
| Lookalikes | Feral pigeon and stock dove: similar build, differ somewhat in colour pattern and size. The neck patch is the mark |

### Grønnfink (folder `gronnfink`), snl.no/grønnfink, Tom Schandy, updated 2026-11-06

| Field | Value |
|---|---|
| Length | 15 cm, about a house sparrow |
| Plumage | Green-yellow, stout cone-shaped bill; yellow on the wing and at the base of the outer tail feathers, clearer in the male |
| Male | Greener and more yellow |
| Female | Greyer, faintly streaked back |
| Juvenile | Not described in the text; a caption says it is fairly like a young siskin, grey and yellow-green |
| Song | A short, monotonous, characteristic reeling sound; like the brambling's (bjørkefink) song but not as harsh, and rising at the end. The male may sing in a stiff-winged song flight in large circles over its territory |
| Calls | Not described |
| Habitat | Open farmland and settled land with dense trees and bushes |
| Range in Norway | Most numerous in the south, breeds north to Sør-Varanger |
| Food | Seeds all year, young also get insects; common at feeders (sunflower seeds) |
| Nest | Often in dense juniper or larger trees |
| Eggs | 5 to 6 |
| Migration | Resident and wanderer; part of the population leaves in autumn |
| Population | 135 000 to 400 000 pairs, falling since the mid-2000s |
| Status | VU, vulnerable, Norwegian red list |
| Versus siskin | The greenfinch is much larger with a heavy cone-shaped bill; the siskin has a fairly long pointed bill |

### Stær (folder `staer`), snl.no/stær, Morten Helberg, updated 2026-11-08

| Field | Value |
|---|---|
| Length | About 22 cm, fairly short tail |
| Plumage | Summer: glossy black with green and blue sheen, fairly plain. Winter into spring: heavily white-spotted |
| Juvenile | Plain brown in autumn, then darker with white spots; adult colour by the first year |
| Sexes | Not described |
| Song | A very good mimic: the song often holds the songs and sounds of many other birds, and whistles, sirens and other man-made signal sounds. Structure and timing not described |
| Calls | Not described |
| Habitat | Near people and farmland; nests in cavities, buildings and nest boxes; roosts in dense flocks |
| Range in Norway | Breeds in every county, most on the coast north to Troms |
| Food | Worms, snails, insects, seeds, fruit and berries |
| Eggs | 3 to 7 |
| Broods | Often two |
| Migration | Mostly a migrant; most Norwegian birds winter in Britain; some winter in Norway |
| Population | Down about 29 % in 18 years |
| Status | NT, near threatened, Norwegian red list |
| Versus blackbird | Both have yellow bills. The starling has a short tail and walks; the blackbird has a long tail and mostly hops |

### Linerle (folder `linerle`), snl.no/linerle, Morten Helberg and Jørgen Skavdal Søraker, updated 2026-08-04

| Field | Value |
|---|---|
| Length, weight | 16,5 to 19 cm, 17,3 to 28 g |
| Plumage | White, black and grey, long wagging tail; easiest known by the white mask around the eye |
| Sexes, juvenile | Not described |
| Song, calls | Not described |
| Habitat | Coast to mountains; nests in cavities and covered places, often on buildings and bridges |
| Range in Norway | The whole country |
| Food | Insects and other small animals, on land and by water, found by sight; wags its tail |
| Eggs | 3 to 8 |
| Broods | Usually two or three |
| Migration | Migrant: arrives from early April in the south to early May in the north; winters in southern Europe, North Africa and the Middle East |
| Population | 400 000 to 600 000 pairs (2015), stable |
| Status | LC |
| Lookalike | Only the subspecies svartryggerle (pied wagtail), with a black or dark grey back and flanks |

### Batch 1, to verify

- Linerle: no source in hand describes its song or calls, so every linerle sound is a placeholder. Starling: no call is described, and the song's structure is not; the starling's sound is a design guess around mimicry, which Pipp does not do (MIMICS dropped for version 1).
- Crow and wood pigeon calls, magpie song shape, greenfinch calls: not described beyond the lines above.
- Every juvenile and most female plate values.

## M11 batch 2, forest birds part 1, checked 2026-11-26

Source: Store norske leksikon (snl.no), one page per bird, read in full on 2026-11-26. Transcriptions are SNL's own spelling.

### Rødvingetrost (folder `rodvingetrost`), snl.no/rødvingetrost, Tom Schandy, updated 2026-08-05

| Field | Value |
|---|---|
| Length, weight | 21 cm, 60 to 80 g |
| Plumage | A clear pale stripe over the eye and a well-visible rust-red patch under the wing. Sexes and juvenile not described |
| Song | A descending, melodic phrase followed by a faint twitter. Varies in regional dialects across the country |
| Flight call | Flocks migrating at night are heard by a thin «siiip» |
| Alarm | Intense alarm calls near the nest; no transcription |
| Habitat | Forest from towns to mountain forest; also willow scrub on mountains and juniper scrub on the coast |
| Range in Norway | Forest over the whole country |
| Food | Snails, earthworms, insects; many berries in autumn, blueberry and crowberry |
| Nest | Low and open, by a trunk or in a bush, sometimes on the ground |
| Eggs | 4 to 6 |
| Migration | Mainly a migrant, winters in south-west Europe; returns March to April, leaves September to November |
| Population | 1 to 1,5 million pairs (BirdLife Norge) |
| Status | LC in Norway (NT globally) |
| Versus song thrush | Like the song thrush; the redwing has a clear pale stripe over the eye and a rust-red patch under the wing |

### Gråtrost (folder `gratrost`), snl.no/gråtrost, Tom Schandy and Audun Rugstad, updated 2026-11-06

| Field | Value |
|---|---|
| Length, weight | 25 cm, 80 to 130 g, one of the largest thrushes |
| Plumage | Ash-grey head, nape and rump, brown upper back, rust-yellow breast with black spots, white belly. Sexes and juvenile not described |
| Song | Not very melodic: a somewhat monotonous chattering with «sjæk-sjæk-sjøl» sounds put in |
| Calls | Not described beyond the song |
| Habitat | Treeless land and mountain birch wood; more and more in towns in Østlandet; feeds on fields and lawns; gardens for berries in late summer and autumn |
| Range in Norway | The whole country |
| Food | Insects and spiders, above all earthworms |
| Nest | Tree forks, bushes, ledges, buildings; often in colonies, defends the nest hard against crows and raptors |
| Eggs | 5 to 6 |
| Broods | Two possible in southern Norway |
| Migration | Migrant and wanderer; many winter on the coast north to Troms, others in Britain and western Europe |
| Population | 0,35 to 0,9 million pairs (BirdLife Norge), falling about 3 % a year 1996 to 2013 |
| Status | LC |
| Lookalikes | None named |

### Svarthvit fluesnapper (folder `svarthvitfluesnapper`), snl.no/svarthvit_fluesnapper, Tom Schandy, updated 2026-11-08

| Field | Value |
|---|---|
| Length | About 13 cm, a little smaller than a great tit |
| Male | Mostly strong black and white. Males vary from brown, female-like plumage to fully black; the darkest are usually the oldest |
| Female | Grey-brown above, white below |
| Juvenile | Not described |
| Song | Short but loud and rhythmic, about 2 s, with repetitions and sudden changes of rhythm and pitch |
| Calls | Not described |
| Habitat | Gardens and forest up into the birch belt |
| Range in Norway | Large parts of the country |
| Food | Insects |
| Nest | Holes in trees, often nest boxes |
| Eggs | 4 to 7 |
| Broods | Bigamy is regular (one male, two females) |
| Migration | Migrant, winters in Africa south of the Sahara; returns around the turn of April and May |
| Population | 630 000 to 1 350 000 pairs, falling about 2 % a year 1996 to 2013 |
| Status | LC |
| Lookalikes | Only the atlas flycatcher, a separate species in north-west Africa; no field marks given |

### Granmeis (folder `granmeis`), snl.no/granmeis, Olav Hogstad, updated 2026-08-04

| Field | Value |
|---|---|
| Length, weight | About 12 cm, 11 to 14 g, fairly large head with a full nape |
| Plumage | Light grey above with a long pale stripe along the wing (the main mark), matt black cap, bright white cheeks, black throat patch. Birds on the west coast have less white cheeks |
| Male | A larger throat patch means higher rank |
| Female | Not described separately |
| Juvenile | Like the adults |
| Song | A plaintive «tiuuu tiuuu tiuuu», more rarely a slightly buzzing «zi-zi-zerrrl». Mostly in the breeding season, also in late summer and now and then in winter |
| Call | «titi-tæææ-tæææ» |
| Alarm | An agitated «spitt! spitt!» and a quick «sisisi» |
| Habitat | Conifer and mixed forest, also mountain birch |
| Range in Norway | The whole country, mountains too |
| Food | Insects and spiders in summer, seeds in winter; hoards 50 000 to 80 000 items over a summer |
| Nest | Hole the pair digs in a rotten stump |
| Eggs | 7 to 9, laid May to June |
| Migration | Resident; some young birds wander south-west in autumn |
| Population | 500 000 to 800 000 pairs |
| Status | VU, vulnerable, Norwegian red list |
| Versus marsh tit | Very like the marsh tit (løvmeis), which looks slimmer and browner, lacks the pale wing stripe and has off-white cheeks |

### Batch 2, to verify

- Pied flycatcher: no call or alarm described; the song's notes are not described beyond rhythm and length.
- Redwing: dialects not modelled (DIALECT dropped for version 1); no alarm transcription.
- Fieldfare: no calls described.
- Every juvenile except the willow tit's, and the female redwing, fieldfare and willow tit.

## M11 batch 3, forest birds part 2, checked 2026-11-26

Source: Store norske leksikon (snl.no), one page per bird, read in full on 2026-11-26. Transcriptions are SNL's own spelling.

### Fuglekonge (folder `fuglekonge`), snl.no/fuglekonge, Olav Hogstad and Magne Husby, updated 2026-08-04

| Field | Value |
|---|---|
| Length, weight | About 9 cm, 4,5 to 7 g, Europe's smallest bird |
| Plumage | Pale greyish-yellow below, olive-green back, two white wing bars, a narrow yellow or red-yellow crown stripe edged with black |
| Male | Orange crown feathers, mostly hidden under the yellow ones |
| Female | No orange crown feathers; otherwise like the male |
| Juvenile | Not described |
| Song | A high, repeated motif ending in a short twitter: «sisisi-sisisi-sisisi-sisryi.» Many older people cannot hear it. Males sing from late winter; song duels March to April |
| Call | Fine three-syllable notes, «sri- sri- sri» |
| Habitat | Coniferous forest, often high in dense branches |
| Range in Norway | Almost all coniferous forest except the far north; most in Sørlandet, Østlandet and Trøndelag |
| Food | Small insects and spiders, sometimes spruce seeds |
| Nest | Hanging round nest of moss and lichen under a spruce branch, 8 to 10 m up |
| Eggs | 8 to 12 |
| Broods | Usually two |
| Migration | Partial migrant: part leaves in autumn (many to Britain), the rest stay; migrants return in April |
| Population | 950 000 to 1,6 million pairs (BirdLife Norge), varies a lot between years |
| Status | LC |
| Lookalikes | Firecrest (rødtoppfuglekonge) named as its close relative; no difference given |

### Gransanger (folder `gransanger`), snl.no/gransanger, Tom Schandy, updated 2026-11-06

| Field | Value |
|---|---|
| Length, weight | 11 cm, 6 to 10 g |
| Plumage | Brown-green above, yellowish-white below, a clear pale stripe over the eye; generally darker legs than the willow warbler. Sexes and juvenile not described |
| Song | A rhythmic «chiff-chaff» with no melody, in series of 15 to 40 notes; the best mark, very different from the willow warbler's |
| Calls | Not described |
| Habitat | All forest types, prefers mixed forest with open areas |
| Range in Norway | From Sørlandet to Troms, perhaps parts of Finnmark; less common than the willow warbler |
| Food | Mainly insects, some berries |
| Nest | Domed with a side opening, at or in a low conifer bush |
| Eggs | 5 to 8 |
| Migration | Migrant, winters around the western Mediterranean; returns from April |
| Population | 250 000 to 500 000 pairs |
| Status | LC |
| Versus willow warbler | Almost identical plumage, only certain by measuring the primaries; the chiffchaff's legs are darker; the songs are very different |

### Bjørkefink (folder `bjorkefink`), snl.no/bjørkefink, Tom Schandy, updated 2026-11-04

| Field | Value |
|---|---|
| Length | 15 cm, about the size of a chaffinch |
| Male, summer | Head, back and tail black, white rump and underside, rust-yellow throat and breast, black wings with pale bars |
| Male, autumn and winter | Grey-brown mottled head and back, like the female |
| Female | Grey-brown mottled head and back, white rump |
| Juvenile | Like the female |
| Song | A slow, raw, hummed note of about a second, «rrrrruh», like the greenfinch's |
| Call | A loud, quacking or hard nasal «tæ-æhp» |
| Habitat | Mountain forest, conifer mixed with mountain birch |
| Range in Norway | Most of the country; in the south most in higher forest |
| Food | Seeds, insects in summer; beech seeds in winter, sunflower seeds at feeders |
| Nest | In trees close to the trunk, a deep well-hidden cup |
| Eggs | 5 to 7 |
| Migration | Migrant and wanderer; winters in southern Scandinavia and Europe, in huge flocks; returns April to May |
| Population | 3 to 4 million birds (BirdLife Norge) |
| Status | LC |
| Versus chaffinch | The rump is white; the chaffinch's is green |
| Versus greenfinch | The song is like the greenfinch's |

### Svartspett (folder `svartspett`), snl.no/svartspett, Olav Hogstad, updated 2026-11-08

| Field | Value |
|---|---|
| Length, weight | 45 to 48 cm, 250 to 370 g, Europe's largest woodpecker |
| Plumage | Glossy black, whitish chisel bill about 5 cm, whitish eyes |
| Male | Red crown |
| Female | Only a small red patch at the back of the head |
| Juvenile | Like the adults but browner |
| Drumming | Very powerful, heard up to 4 km; long and even, may slow a little at the end; about 20 strokes in 2 s; stronger and longer than other woodpeckers'. Mainly spring, often mornings, February through breeding; also autumn and winter. Females drum now and then |
| Flight call | A powerful «kri-kri-kri-kri» |
| Call | After landing, a long plaintive «kliii-æ»; in spring often «kly-kly-kly-kly», like the green woodpecker's |
| Alarm | A hard «krykk krykk krykk» |
| Habitat | Conifer forest with large trees, stumps and logging debris |
| Range in Norway | Østlandet, Sørlandet and Trøndelag; a few in the north, rare in the west |
| Food | Tree-living insects, above all carpenter ants |
| Nest | Oval hole in a large aspen or pine, usually 7 to 8 m up |
| Eggs | 3 to 6 |
| Migration | Resident, irruptive in some years |
| Population | 2000 to 4000 pairs |
| Status | LC |
| Lookalikes | None; can look like a crow. The spring call is like the green woodpecker's |

### Batch 3, to verify

- Goldcrest: juvenile; the twitter's shape; no alarm.
- Chiffchaff: calls; sexes and juvenile; singing months.
- Brambling: singing months; the song's pitch.
- Black woodpecker: drum pitch (tree resonance is mine); pitch and timing of every call.

## M11 batch 4, coast and water, checked 2026-11-26

Source: Store norske leksikon (snl.no), one page per bird, read in full on 2026-11-26. None of the three pages gives a sound transcription.

### Fiskemåke (folder `fiskemake`), snl.no/fiskemåke, Morten Helberg (byline Olav Fossbakken), updated 2026-11-04

| Field | Value |
|---|---|
| Size, weight | One of Norway's smallest gulls; Norwegian breeders 300 to 480 g. Length not given |
| Adult | White underside, blue-grey back and wings, black wingtips with white spots at the end |
| Bill | Yellow-green, without the red spot on the lower bill that the larger gulls have |
| Legs | Grey or yellow-green, sometimes yellow |
| Eye, eye-ring | Not described |
| Juvenile | Brown wings and grey back in the first winter; about two years to adult plumage |
| Sexes | No difference described |
| Sounds | None described (only a link to xeno-canto) |
| Habitat | The whole country, most on the coast; also inland at fresh water, wetlands and bogs; more and more in towns |
| Food | Mostly fish from the surface; shellfish, snails, worms; on land insects, earthworms, flying ants, crane flies, berries |
| Nest | Usually on the ground on skerries and islands; also in trees, on buildings and other structures |
| Eggs | 1 to 3, usually 3, from early May in the south into June in the north; 23 to 28 days, both parents |
| Migration | Most winter around the North Sea, some in Spain and Portugal; a few stay on the west coast |
| Population | 90 000 to 125 000 pairs (2015); over 95 % decline 1984 to 2019 in seabird reserves in Vest-Agder |
| Status | VU (NT from 2010, VU from 2021); protected (the text says 2012, a caption says 2010) |
| Lookalikes | Kittiwake: all-black wingtips and black legs. The larger gulls: red spot on the lower bill |

### Sildemåke (folder `sildemake`), snl.no/sildemåke, Morten Helberg (byline John Sandøy), updated 2026-11-09

| Field | Value |
|---|---|
| Size, weight | Smaller than the herring gull; Norwegian breeders 0,5 to 1 kg. Length not given |
| Adult | Black to dark grey back, white underside, yellow bill with a red spot on the lower bill, usually yellow legs («gulføtting»), red eye-ring |
| Wingtips | Usually white only on the outermost one or two primaries |
| Subspecies | Back tone is the main mark: northern (fuscus) darkest, graellsii palest; intermedius about 28 000 pairs |
| Juvenile | First plumage always has evenly dark primaries (herring and great black-backed gulls paler inner ones); 2 to 4 years to adult plumage |
| Sexes | No difference described |
| Sounds | None described |
| Habitat | The whole country, patchy in the north, most in Vest-Agder; colonies in the skerries, often with herring and great black-backed gulls, on lower boggy ground; roofs in towns from the Swedish border to Bergen |
| Food | Shoaling fish (sand eel, saithe, herring), earthworms, insects, waste |
| Eggs | 2 to 3, May to June; 24 to 26 days; young fly after about 40 days |
| Migration | Arrives from March, leaves mainly August to October; winters from the British Isles to Guinea |
| Population | Northern subspecies about 2000 pairs (2015), down over 90 % |
| Status | LC |
| Lookalikes | Great black-backed gull: about twice the weight (1,1 to 2,2 kg), grey-pink legs, much white in the wingtip. Herring gull: larger; juvenile primaries as above |

### Makrellterne (folder `makrellterne`), snl.no/makrellterne, Jan Eivind Østnes, updated 2026-08-04

| Field | Value |
|---|---|
| Size, weight | A medium-sized tern, 100 to 135 g. Length not given |
| Adult | Grey and white, black cap over the head, red legs in summer, orange-red bill with a black tip in the breeding season, forked tail with outer streamers that do not reach past the wingtips when sitting |
| Winter, juvenile, sexes | Not described |
| Sounds | Like the Arctic tern's, but harder, more grating and deeper; usually very noisy at the colony. No transcription |
| Habitat | Coast and fresh water inland, not in the Arctic; colonies of a few to thousands of pairs, in Norway usually some tens |
| Food | Mainly small fish, also crustaceans and insects; hovers and dives |
| Nest | A shallow scrape on the ground, often lined with dry grass |
| Eggs | Usually 2 to 3, May to June; 22 to 28 days, both sexes; young fly after about 4 weeks |
| Migration | Long-distance migrant; arrives in May, leaves July to September; most Norwegian birds winter on the coasts of West and South Africa |
| Population | About 11 000 pairs (BirdLife Norge); the commonest tern on the coast of southern Norway, the Arctic tern takes over further north; sharp decline in the 2000s |
| Status | EN |
| Versus Arctic tern | Hard to tell apart; the common tern has longer legs, a black bill tip in the breeding season (the Arctic tern's is all red, a little longer, can look down-curved), shorter outer tail streamers |

### Batch 4, to verify

- Every sound of the common gull and the lesser black-backed gull (placeholders, like the herring gull).
- Common tern: the shape and pitch of every sound; winter and juvenile plumage.
- All three: length; female and juvenile plate values beyond what is listed.

## M11 batch 5, wetland and lake, checked 2026-11-26

Source: Store norske leksikon (snl.no), one page per bird, read in full on 2026-11-26. Transcriptions are SNL's own spelling.

### Stokkand (folder `stokkand`), snl.no/stokkand, Rolf Terje Kroglund, updated 2026-11-08

| Field | Value |
|---|---|
| Length, weight | 50 to 60 cm, 800 to 1400 g; one of Norway's largest and heaviest ducks |
| Male | Light body, green-glossed head, yellow bill, white neck ring, rust-brown breast, black rear; keeps the yellow bill all year |
| Female | Brown-mottled all over (camouflage on the nest), orange and black bill |
| Both | Orange feet; blue speculum with broad white edges, the same in both sexes |
| Eclipse | The male looks very like the female in summer moult |
| Juvenile | Not described |
| Voice | Often noisy, clear difference between the sexes. Male: a nasal chatter and a repeated «væph, væph, væph». Female: usually louder, stressed at the start, «kvæh-kvæh-kvah-kvah-kvah» |
| Habitat | Gardens, parks, farmland, wetlands up to the tree line; breeds near water |
| Food | Mainly plants, seeds and berries; at times many invertebrates; bread in parks in winter |
| Nest | On the ground, well hidden; lined with moss, straw, leaves, then feathers and down |
| Eggs | 7 to 13; the female alone sits 28 to 29 days; young fly at 50 to 60 days |
| Migration | Resident over much of Europe; many Norwegian birds winter in Central Europe, many stay on the coast and in fjords |
| Population | More than 50 000 pairs (2015) |
| Status | LC |
| Lookalikes | Other dabbling ducks (none named); the speculum sets it apart |

### Sangsvane (folder `sangsvane`), snl.no/sangsvane, Rolf Terje Kroglund, updated 2026-11-07

| Field | Value |
|---|---|
| Size | Somewhat smaller and lighter than the mute swan; the male a little larger and heavier than the female. Length and weight not given |
| Adult | All white, lemon-yellow bill with a black tip; swims with the neck held straight |
| Juvenile | Grey-brown, usually until the autumn of its second year |
| Voice | Usually very vocal in flight and on the ground; a loud call often compared to a trumpet blast. No transcription |
| Habitat | Breeds near water, often on an islet or a large bog with open water; winters on shallow nutrient-rich lakes, open rivers, brackish water |
| Food | Mainly water plants (eelgrass, pondweed); stubble fields with geese in winter |
| Nest | Moss, water plants and soil, lined with straw and down; reused and enlarged year after year |
| Eggs | Usually 4 to 6, dirty white; the female sits about 35 days, the male guards; young fly at about 2 months |
| Migration | Wintering birds come mainly from northern Scandinavia and Kola |
| Population | 350 to 600 pairs, rising; most in the two northernmost counties |
| Status | LC |
| Versus mute swan | Mute swan: red-orange bill with a big black knob, larger, S-curved neck when swimming |

### Storlom (folder `storlom`), snl.no/storlom, consultant Per Ole Syvertsen, updated 2026-11-08

| Field | Value |
|---|---|
| Length, weight | Up to 68 cm, 2,5 to 3,5 kg |
| Summer plumage | Grey-black above with white cross stripes and spots, black throat patch |
| Winter, juvenile, bill, eyes, sexes | Not described |
| Voice | Not described |
| Habitat, food | Fresh water; eats fish |
| Nest | At the water's edge, often on a small islet |
| Eggs | 2; both sit 28 to 30 days; young fly after about 60 days |
| Migration | Partial migrant: some winter on the south coast, others go to Biscay |
| Range | Most of Norway; no population figure |
| Status | LC |
| Versus red-throated diver | Told by the black throat patch |

### Enkeltbekkasin (folder `enkeltbekkasin`), snl.no/enkeltbekkasin, Jan Eivind Østnes and Fridtjof Mehlum, updated 2026-11-04

| Field | Value |
|---|---|
| Size | Medium-sized snipe; length and weight not given |
| Plumage | Heavily mottled brown and black with clear yellowish-white lengthwise stripes; underparts almost all white; very long straight bill; large eyes |
| Head stripes, legs, juvenile, sexes | Not described |
| Display | In spring and early summer, mostly at dusk and at night, a display flight with an unmistakable bleating sound («mekrende»), made by the outer tail feathers vibrating in a steep dive. Duration and pitch not given. Local names: mekregauk, rossegauk, myrbukk, skoddeføll, tåkehest, himmelhest |
| From the ground | A high, sharp «tikk-a, tikk-a, tikk-a» |
| Flushed | A hoarse, powerful «tsjæt», then a high zigzag flight |
| Habitat | Bogs and other wetlands, coast to mountains |
| Food | Insects, spiders, earthworms, crustaceans, probed from the ground |
| Nest | In a grass tussock near water |
| Eggs | Usually 4, laid in May; mainly the female sits about 20 days; young fly at about 3 weeks |
| Migration | Returns April to May, leaves August to October; winters in western Europe, some on the south coast |
| Population | 50 000 to 75 000 pairs (2015), moderate decline |
| Status | LC |
| Versus great snipe | Hard to tell by plumage, very different in sound and behaviour when breeding |

### Batch 5, to verify

- Mallard: pitch and timing of both sexes' calls; juvenile.
- Whooper swan: the shape of the trumpet call; length.
- Black-throated diver: every sound (placeholder wail); bill, head, winter and juvenile plumage.
- Common snipe: the bleat's pitch, pulse rate and length; which months it bleats; length.

## M11 batch 6, mountain, checked 2026-11-26

Source: Store norske leksikon (snl.no), one page per bird, read in full on 2026-11-26. Transcriptions are SNL's own spelling. The meadow pipit's Norwegian name is heipiplerke (SNL; also engpiplerke), not "heipiper" as first drafted; the folder is `heipiplerke`.

### Heipiplerke (folder `heipiplerke`), snl.no/heipiplerke, Morten Helberg, updated 2026-08-03

| Field | Value |
|---|---|
| Size | A little smaller than the white wagtail; length and weight not given |
| Plumage | Grey-brown and mottled, grey-white belly, the two outer tail feathers white |
| Bill, legs, hind claw, juvenile, sexes | Not described |
| Song | Song flight like the tree pipit's, with a trill that speeds up; no drawn-out ending |
| Flight call | When it flies up, a characteristic «tsip-tsip-tsip» |
| Habitat | Open landscape, coast to high mountains; one of the commonest mountain birds |
| Food | Mainly insects and other invertebrates, now and then seeds |
| Nest | On the ground, often under a tussock; one of the cuckoo's commonest hosts |
| Eggs | Usually 5 to 6, 11 to 15 days; young leave after 10 to 14 days |
| Migration | Partial migrant: most mountain birds leave (Netherlands to Iberia, some to Morocco); some coastal birds stay, Trondheimsfjorden to Oslofjorden |
| Population | 7 to 8 million birds (BirdLife Norge); the widest range of any bird in Norway |
| Status | LC |
| Versus tree pipit | The tree pipit's trill is stronger and darker and ends in a drawn-out «seee-er, seee-er, seee-er» |

### Lirype (folder `lirype`), snl.no/lirype, Edvard Kaurin Barth and Fridtjof Mehlum, updated 2026-08-04

| Field | Value |
|---|---|
| Size | A little larger than the rock ptarmigan; length and weight not given |
| Plumage | Winter all white with a black tail, sexes alike; summer more mottled brown than grey; the wings white in every plumage. The hen has three plumages a year, the cock four |
| Male | Somewhat redder brown and a little larger than the hen |
| Bill | Over 1 cm deep at the base |
| Comb, feet, juvenile | Not described |
| Voice | Not described |
| Habitat | Mountain birch forest and bare mountain; also large bogs in lower conifer forest; in the north to the coast and islands |
| Food | Mostly on the ground; in late winter also in birch and willow |
| Nest | A shallow scrape, well hidden in low shrubs |
| Eggs | 6 to 12, May to June; the hen sits about 21 days |
| Movement | Normally resident; icing can send it to the lowlands and to islands in the south and east |
| Status | LC; no population figure |
| Versus rock ptarmigan | Rock ptarmigan a little smaller, bill under 1 cm deep, sexes differ in winter |

### Heilo (folder `heilo`), snl.no/heilo, Jan Eivind Østnes, updated 2026-08-03

| Field | Value |
|---|---|
| Length | 25 to 28 cm (the intro says 32 cm), about a lapwing's size |
| Summer | Back densely spotted golden-yellow; chin, breast and belly coal-black, framed in white |
| Female | The black underside usually clearly duller |
| Winter | Back unchanged, no black; throat and breast spotted yellow-brown, belly pale |
| Bill, legs | Black bill, blackish-brown legs |
| Juvenile | Not described |
| Voice | In the breeding season very mournful whistling tones that can last for hours, easy to tell from other mountain sounds, carrying far. No transcription |
| Habitat | Open ground with short vegetation, bogs and heaths; farmland outside the breeding season |
| Food | Insects, snails, worms, crustaceans, spiders; berries and seeds in summer |
| Nest | A simple scrape lined with a little dry plant material |
| Eggs | Usually 4, mostly first half of June; both sit 27 to 31 days |
| Migration | Arrives April to May, leaves late July to October; winters in western Europe and the Mediterranean |
| Population | 150 000 to 300 000 pairs |
| Status | NT |
| Lookalikes | None named |

### Ravn (folder `ravn`), snl.no/ravn, Olav Hogstad and Magne Husby, updated 2026-10-12

| Field | Value |
|---|---|
| Size | 65 to 70 cm, about 1,5 kg, wingspan up to 1,3 m; the world's largest passerine |
| Plumage | All black with green or blue-violet gloss; heavy head and bill, long throat feathers, wedge-shaped tail |
| Sexes | Alike, the male considerably larger |
| Juvenile | Black, often without gloss; a narrow yellow patch at the bill base turns black over the first year |
| Calls | A deep «prruk» or «korp»; a hoarse, grating «rrå»; a coarse «ærr ærr ærr» |
| Alarm | A persistent «arrk-arrk-arrk» |
| Display | A hollow «klong», like two wooden blocks struck together, carrying several km; often in the pair's display flights and territory defence |
| Repertoire | 79 sounds mapped, just over 20 with a known function; no song described |
| Habitat | Forest, mountains, coastal mountains |
| Food | Omnivore, mainly animal food and carrion; caches food |
| Nest | Large stick nest on a cliff ledge, reused and built up for years |
| Eggs | 1 to 8, usually 4 to 6; usually March to April, from February on the coast |
| Movement | Resident, now and then wandering |
| Population | 20 000 to 80 000 pairs |
| Status | LC |
| Lookalikes | No field marks against crows given; can look like a bird of prey when soaring (long narrow fingered wings, long neck, wedge tail) |

### Batch 6, to verify

- Meadow pipit: the song's pitch and notes; bill, legs, juvenile.
- Willow ptarmigan: every sound (placeholder); the red comb; juvenile.
- Golden plover: the whistle's shape and pitch; which months it calls; juvenile.
- Raven: pitch and timing of every call.

## M11 batch 7, farmland, checked 2026-11-26

Source: Store norske leksikon (snl.no), one page per bird, read in full on 2026-11-26. Transcriptions are SNL's own spelling.

### Låvesvale (folder `lavesvale`), snl.no/låvesvale, Bård Gunnar Stokke, updated 2026-08-04

| Field | Value |
|---|---|
| Size | About 18 cm, 16 to 24 g |
| Plumage | Blue-black above, white below, rust-red forehead and throat, blue-black breast band |
| Sexes | Long tail streamers, longest in the male |
| Bill, legs, juvenile | Not described |
| Song | A quick twittering. No transcription |
| Calls | Not described |
| Habitat | Open farmland, often near water |
| Food | Insects caught on the wing, low over the ground |
| Nest | Mostly indoors in barns: clay with straw and hair, lined with grass and white feathers |
| Eggs | 2 to 7, usually 4 to 5; often a second brood in July, sometimes three |
| Migration | Arrives April to May; long-distance migrant, winters in Africa south of the Sahara |
| Population | 30 000 to 50 000 pairs; fewer in Finnmark and high up |
| Status | LC |
| Lookalikes | None named |

### Sanglerke (folder `sanglerke`), snl.no/sanglerke, Tom Schandy, updated 2026-08-05

| Field | Value |
|---|---|
| Size | 16 to 18 cm, a little larger than a house sparrow |
| Plumage | Colour pattern like the meadow pipit's and tree pipit's; a hint of a crest |
| Sexes, juvenile, bill | Not described |
| Song | The song flight: whirring, it climbs higher and higher with a continuous stream of trills and whistles, then after a long display glides slowly down and drops to the ground like a stone. No transcription |
| Calls | Not described |
| Habitat | Open farmland with some cover |
| Food | Insects and small animals; seeds and grain in winter |
| Nest | A hollow on the ground, of grass, lined with fine straw and hair |
| Eggs | 2 to 6, the female sits 11 to 12 days; usually 2 to 3 broods |
| Migration | One of the first back: February to March in the south, April in the far north; most winter on the west coast of the continent to Iberia |
| Population | 100 000 to 300 000 pairs; mainly the lowlands of the east and the south coast, common to Trøndelag, sparse in the far north |
| Status | NT on the red list (the SNL text says vulnerable; the list category is used) |
| Lookalikes | Meadow pipit and tree pipit, similar colour pattern but smaller |

### Gulspurv (folder `gulspurv`), snl.no/gulspurv, Bård Gunnar Stokke, updated 2026-08-03

| Field | Value |
|---|---|
| Size | 16 to 16,5 cm, 20 to 36,5 g |
| Male | Yellow head with dark markings, yellow underside, reddish-brown and olive breast patch, reddish-brown rump |
| Female, juvenile | Much less yellow |
| Song | «zi-zi-zi-zi-zi-zi-ziiiiiii», a quick series that many hear as counting to seven; the count varies from five to twelve |
| Calls | Not described |
| Habitat | Farmland, often near the forest edge |
| Food | Mainly seeds; insects in the breeding season |
| Nest | On or near the ground, well hidden: dry grass, lined with fine straw and hair; built in May to June |
| Eggs | 3 to 5; the female sits 12 to 14 days; usually one brood in Norway |
| Movement | Mainly resident and wandering; some leave Norway in winter |
| Population | 100 000 to 200 000 pairs (2015) |
| Status | VU |
| Mnemonic | Counting to seven (SNL: many hear the song this way) |
| Lookalikes | None named |

### Vipe (folder `vipe`), snl.no/vipe, Jan Eivind Østnes, updated 2026-11-15

| Field | Value |
|---|---|
| Size | 32 cm |
| Plumage | Very long crest; dark green glossy back; black face, throat and breast; white belly; rust-red under the tail; black bill |
| Female | Shorter crest; the black breast mottled with white |
| Juvenile, winter | Not described |
| Voice | Very vocal in the breeding season, with high, penetrating, plaintive calls. Early in spring the male tumbles low over the nest site in an acrobatic display flight, with a characteristic hoarse song and humming sounds from the wings. No transcription |
| Habitat | Moist grassland in farmland, coastal meadows, wetlands |
| Food | Almost only animal food, mainly earthworms and insects |
| Nest | A simple scrape on damp ground, lined with dry grass |
| Eggs | Usually 4; both sit 23 to 30 days |
| Migration | One of the first back, February to March in the south; leaves July to October, wintering mainly in France and Iberia; a few winter on the south-west coast |
| Population | 7500 to 10 000 pairs (2015), probably fewer now; about 90 % decline since the 1970s |
| Status | CR |
| Lookalikes | In flight the broad, rounded wingtips set it apart from every other Norwegian wader |

## M11 batch 8, night, checked 2026-11-26

Source: Store norske leksikon (snl.no), one page per bird, read in full on 2026-11-26. Tengmalm's owl is perleugle in SNL (snl.no/perlugle does not exist), so the folder is `perleugle`. None of the three pages names a lookalike.

### Perleugle (folder `perleugle`), snl.no/perleugle, Rolf Terje Kroglund, updated 2026-11-08

| Field | Value |
|---|---|
| Size | 25 to 27 cm, wingspan 50 to 62 cm, 100 to 150 g; the female heaviest; the second-smallest owl in Norway |
| Plumage | Back, crown and nape brownish with many round white spots, the "pearls" of the name; underside pale with brown streaks |
| Juvenile | Uniformly chocolate-brown |
| Sexes | Only weight given; no plumage difference stated |
| Bill, eyes, feet | Not described |
| Song | Males heard in the winter forest: a rapid series of clear, deep notes; from January to February; on quiet nights heard 2 to 3 km. No transcription, note count or rate |
| Calls | Not described |
| Habitat | Coniferous forest; most numerous in Østlandet and Trøndelag |
| Food | Mainly small rodents, hunted by ear from a low perch, moving on after a few minutes; by day sits close to the trunk of a dense spruce |
| Nest | Hollow trees; takes nest boxes filled with wood chips |
| Eggs | 3 to 7 white, usually March to April; the female alone sits 25 to 32 days; young fly at 5 to 6 weeks |
| Movement | In Norway all year; males usually stay, females and young wander |
| Population | Varies strongly with the small-rodent years; no figure |
| Status | LC |

### Åkerrikse (folder `akerrikse`), snl.no/åkerrikse, Helene Lampe, updated 2026-11-04

| Field | Value |
|---|---|
| Size | A little larger than a thrush, about 100 to 200 g; length not given |
| Plumage | Brown and mottled above, yellow-brown with cross bars below, grey neck region; short bill and tail |
| Sexes, juvenile, colours of bill, eye and legs | Not described |
| Voice | Hard to see, but the sound is very distinctive: a single-toned creaking or rattling that can go on for hours, mostly in the evening and at night. No transcription |
| Habitat | Cultivated land; nests on farmland |
| Food, eggs, incubation | Not described |
| Migration | Migrant; breeds sparsely along the coast and probably winters mainly in southern Africa. Arrival and departure not given |
| Population | About 100 pairs in 1994; 204 singing males in 2013 (154 in Østlandet); 5 confirmed breedings in 2013; mainly the coast from Vest-Agder to Møre og Romsdal and some places in Østlandet |
| Status | CR; mowing machines are the threat |
| Folklore | Coming up to mountain farms foretold a bad harvest; staying near houses foretold a death |

### Nattravn (folder `nattravn`), snl.no/nattravn, Tom Schandy, updated 2026-11-08

| Field | Value |
|---|---|
| Size | 24 to 28 cm, 60 to 90 g |
| Plumage | Grey-brown and mottled, fairly long tail, long wings; one of the best camouflages of any bird |
| Bill | Small and weak, a very wide gape fringed with bristles |
| Sexes, juvenile, eye, legs | Not described |
| Song | A very special whirring song, like a spinning wheel (local name huldrerokk). Pitch, length, time and carry not given |
| Call | Frog-like but plaintive «kruit» |
| Other sound | Silent in flight except in courtship, when it claps its wings over its body |
| Habitat | Hilly forest with sparse, open pine; mainly lowland around the Oslofjord and down the Sørlandet coast |
| Food | Insects caught in flight at night: cockchafers, dung beetles, moths |
| Nest | A scrape in the ground |
| Eggs | 2 white with grey-blue and beige marks; mostly the female sits 17 to 18 days |
| Migration | Arrives late in May, leaves in August to September for tropical Africa |
| Population | 715 to 1225 pairs (BirdLife Norge) |
| Status | LC |

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

## Garden birds, checked 2026-11-26

Source: Store norske leksikon, "Norges fugler" (snl.no). One source per bird, read in full. Fuglevennen, BirdLife Norge and Artsdatabanken were not opened for these birds, so a fact that matters for the plate or the quiz should get a second source when possible. Call transcriptions are SNL's own spelling.

### Kjøttmeis (folder `kjottmeis`), snl.no/kjøttmeis, updated 2026-08-05

| Field | Value |
|---|---|
| Length, weight | 15 cm, 15 to 22 g |
| Male | Yellow breast with a black centre stripe running down the belly, glossy black head, white cheeks, greenish back, blue-grey wings with a narrow white wing bar. Black patch between the legs |
| Female | Like the male but less intense colours, narrower breast stripe, no black belly patch, less gloss on the black throat |
| Juvenile | Like the adults but duller |
| Song | Repeated whistled phrases, 1 to about 6 syllables, 2 or 3 most common, such as "tu-ti tu-ti tu-ti". Large repertoire |
| Singing starts | Sometimes as early as January. Territories set up in February and March |
| Calls | "ping ping", like the chaffinch. Also "huit huit" and "ti tuui" |
| Startle call | A sharp "pist! pist!" |
| Habitat | All kinds of forest, most in lowland deciduous and mixed forest. Gardens and parks with nest boxes |
| Range in Norway | The whole country, in forest |
| Food | Mostly insects in summer, plant food in autumn and winter, feeders |
| Nest | Tree holes and nest boxes. The female builds |
| Eggs | 6 to 13, 8 to 13 usual |
| Broods | Usually two, April to May and June to July |
| Migration | Mostly resident. Some move in September and October, mostly within Scandinavia |
| Status | LC on the Norwegian red list |

### Blåmeis (folder `blameis`), snl.no/blåmeis, updated 2026-11-04

| Field | Value |
|---|---|
| Length, weight | About 12 cm, 10 to 13 g |
| Plumage | Light blue crown, wings and tail. White cheeks with a blue-black stripe through the eye. Yellow underside with a hint of a black breast stripe. The blue crown feathers can be raised |
| Sexes | Alike. The female is often a little paler |
| Juvenile | Like the adults |
| Song | A trill-like series, "sit-sitt-sirrrrrrr". Also a chattering series that opens with a couple of whistles |
| Calls | Short sharp "sits", single or in series. Slightly rasping "sits it pæ-pæ-pæ", and a sharp "spitt spitt" |
| Habitat | Lowland deciduous and mixed forest, often at feeders |
| Range in Norway | North to Finnmark, sparser there and mostly inland |
| Food | Insects and spiders in summer, seeds and kernels in autumn and winter, feeders |
| Nest | Tree holes, nest boxes, rock crevices, holes in walls. The female builds |
| Eggs | 8 to 12 |
| Broods | One, in some years two (May and July) |
| Migration | Mostly resident. In some years many move south in September and October, mostly young females |
| Status | LC on the Norwegian red list |
| Versus great tit | Smaller. Blue crown, wings and tail. The great tit has a black head and a yellow breast with a black stripe |

### Rødstrupe (folder `rodstrupe`), snl.no/rødstrupe, updated 2026-11-07

| Field | Value |
|---|---|
| Length, weight | 14 cm, 16 to 22 g |
| Plumage | Rust-red forehead, throat and breast. Olive-brown back |
| Sexes | Alike |
| Song | Very beautiful, compared to a trickling brook. Early at dawn and in the evening. Starts at or a little before the capercaillie in the morning, hence the nickname "tiurklokke" |
| Habitat | Shady, dense forest. Also gardens |
| Range in Norway | Most of the country up to Troms, scarce in Finnmark. Up to at least 1000 m on Dovrefjell |
| Food | Insects and small invertebrates in summer, mostly berries in winter |
| Nest | In cavities on the ground |
| Eggs | 6 to 7 |
| Migration | Mostly migrants, wintering in south-west Europe and the Mediterranean. Some winter in coastal south Norway |
| Status | LC on the Norwegian red list |

SNL names the family both as flycatchers (text) and thrushes (header). Not used in the app.

### Bokfink (folder `bokfink`), snl.no/bokfink, updated 2026-11-04

| Field | Value |
|---|---|
| Length | About 15 cm |
| Male | Blue-grey hood and nape, chestnut-brown back, reddish-brown underside. The hood is browner in autumn and winter |
| Female | Fairly plain grey-brown |
| Juvenile | Fairly plain grey-brown, as the female |
| Both sexes | Nearly black wings with two clear white bars. Green rump |
| Song | The male has a strong, characteristic song and sings in dialects |
| Habitat | Forests and parks |
| Range in Norway | Most of the country north to Troms, scarce in inner fjord and lowland Finnmark |
| Food | Seeds, fruits and buds, some insects in summer |
| Nest | Finely built, usually in a fork of branches |
| Eggs | 4 to 5 |
| Migration | Mostly migrants wintering in western Europe, some along the Norwegian coast. First birds reach south Norway in early March, males about a week before females |
| Status | LC on the Norwegian red list |
| Versus brambling | The brambling (bjørkefink) has a white rump, the chaffinch a green one |

### Gråspurv (folder `graspurv`), snl.no/gråspurv, updated 2026-08-04

| Field | Value |
|---|---|
| Length, weight | About 15 cm, 25 to 35 g |
| Male | Brown and black streaked upperparts, grey underparts, black throat patch, grey crown |
| Female | Brown crown |
| Song | A simple, short, repeated phrase. Chirping "sjirp, sjirp", heard most in spring |
| Calls | Chattering and twittering calls all year |
| Habitat | Tied to buildings: houses and farms. Also nest boxes and hollow trees |
| Range in Norway | The whole country, rarer at altitude |
| Food | Grain, seeds and insects, scraps, buds, berries, feeders in winter |
| Nest | Cavities in buildings, nest boxes, hollow trees. Rarely a domed nest in a tree or bush |
| Eggs | 4 to 5 |
| Broods | Two or three a year are common in Norway |
| Migration | Resident |
| Status | NT (near threatened) on the Norwegian red list. Fell more than 15 % in recent years |
| Versus tree sparrow | The tree sparrow (pilfink) has a chestnut crown and black cheek spots |

### Garden birds, to verify

- Bill colour for all five, and any sex or age difference in it.
- Robin and house sparrow juveniles. Great tit and blue tit juveniles beyond "like the adults, duller".
- Whether the female house sparrow has a throat patch.
- Calls and alarm calls of the robin and the chaffinch. The blue tit's alarm call.
- Song months and time of day for blue tit, chaffinch and house sparrow. Song months for the robin.
- Broods per season for robin and chaffinch.
- What the chaffinch song sounds like, beyond "strong and characteristic".
- Whether females sing, for all five.
- Wingspan for all five.

## Forest birds, checked 2026-11-26

Source: Store norske leksikon (snl.no), one article per bird, read in full, as for the garden birds.

### Måltrost (folder `maltrost`), snl.no/måltrost, Tom Schandy, updated 2026-11-08

| Field | Value |
|---|---|
| Length, weight | About 21 cm, 60 to 100 g |
| Appearance | Fairly anonymous: grey-brown upperparts, brown and white-spotted underparts. Relatively short tail. No rust-red patch under the wings (the redwing has one), though it can be strongly rust-beige there |
| Sex and age | No difference stated |
| Song | One of the forest's best singers. A mix of chirping trills and clear, melodic whistled notes. Sings staccato and repeats the same phrase 2 to 3 times |
| Song perch | Shy; usually seen singing in the top of a tree in spring |
| Habitat | Most common in conifer and mixed forest, also pure deciduous forest and mountain birch forest. In some southern towns, villa areas, large gardens and parks |
| Range in Norway | Breeds in most of the country, scarcer in Finnmark. 1 to 1,5 million pairs |
| Food | Insects, earthworms and snails, most in May to July; smashes snail shells on a stone. Berries and fruit from July to October |
| Nest | Close to the trunk in a tree or bush, with a "mortared" base of wood pulp, unlike other thrushes |
| Eggs | 4 to 6, blue-green with a few black spots. The female incubates 12 to 14 days |
| Young | Fed by both parents, leave the nest after about two weeks |
| Migration | Migrant. Most winter on the Iberian Peninsula and in north-west Africa, some on the Norwegian coast north to Nordland. Returns in March to April |
| Status | LC on the Norwegian red list, and globally |
| Versus redwing | The redwing is the only smaller Norwegian thrush, and has the rust-red patch under the wing |

SNL also names two old folk readings of the song, «kyss meg, kyss meg» and «får du fisk, får du fisk». They are candidates for a mnemonic; Eirik decides whether to use them.

To verify: calls and alarm call (not in the article), bill colour, any sex or age difference, singing months beyond "spring", time of day for song, broods per season, autumn departure month, wingspan, whether females sing.

### Løvsanger (folder `lovsanger`), snl.no/løvsanger, Tom Schandy, updated 2026-08-04

| Field | Value |
|---|---|
| Length, weight | About 11 cm, about 7 to 11 g. One of the smallest birds in Norway |
| Appearance | Grey-green upperparts, grey-white underparts |
| Sex and age | No difference stated |
| Song | A melodic, slightly melancholy row of notes. Different from the chiffchaff's |
| Habitat | From the skerries to the bare mountain. More than a third of all breeding birds in mountain birch forest. Found up to about 1250 m on Dovrefjell |
| Range in Norway | Counted as Norway's most common bird, 4,5 to 11 million pairs (BirdLife Norge). Breeds from Central Europe to the Arctic coast |
| Food | Mostly insects and spiders, some berries in autumn |
| Nest | On the ground |
| Eggs | 6 to 8, about 1,2 g each, incubated about two weeks |
| Young | Leave the nest after about two weeks |
| Migration | Arrives at the turn of April and May; leaves mainly in August. Northern birds winter in East Africa, southern birds in West Africa |
| Status | LC on the Norwegian red list, and globally |
| Versus chiffchaff | Looks confusingly like the chiffchaff (gransanger); the song is different |

To verify: calls and alarm call, how the song is built (length, pitch, ending), singing months and time of day, bill and leg colour, any sex or age difference, broods, wingspan, whether females sing.

### Gjerdesmett (folder `gjerdesmett`), snl.no/gjerdesmett, Edvard Kaurin Barth and Bård Gunnar Stokke, updated 2026-08-04

| Field | Value |
|---|---|
| Length, weight | 9 to 10 cm, 6 to 12 g. One of Norway's smallest birds |
| Appearance | A small, round ball of feathers, barred across in brown shades. Short tail held almost straight up. Bill relatively long, thin and slightly curved |
| Sex | The sexes are alike |
| Song | Remarkably loud for its size: one quick, melodious phrase of trilling sounds. Can sing all year, most in the breeding season |
| Alarm | A hard «tsjekk» or «tsssrrr», often repeated |
| Habitat | All forest types, prefers moist places with fallen trees and root plates, scree and rockfall; also sparse coastal vegetation. Much on or near the ground, darting in and out of stone walls and bushes, often taken for a small rodent. In winter often enters buildings, and several may roost together, for example in a nest box |
| Range in Norway | Common along the coast and up the large valleys of Sør-Norge, sparser inland and further north in Nord-Norge. 350 000 to 700 000 pairs; drops after cold, snowy winters and recovers quickly |
| Food | Mostly insects and spiders, sometimes berries and seeds, mostly in winter |
| Nest | The male builds several nests and lets the female choose. A round ball with a side entrance, of moss, leaves and grass, lined with feathers; in dense twigs, rock crevices, under a turf edge or higher up. Building starts late March or early April |
| Eggs | Most often 5 to 8, white with small rust-brown speckles. The female incubates about 16 days |
| Broods | Two broods can occur |
| Young | Fed by both parents 14 to 19 days in the nest, then 9 to 18 days after |
| Migration | Some winter in Norway, mostly on the south coast; many winter in Western Europe |
| Status | LC on the Norwegian red list, and globally |

To verify: calls other than the alarm, how long the song is and how it is built, bill and leg colour, the juvenile, singing time of day, wingspan, lookalikes, whether females sing.

### Gjøk (folder `gjok`), snl.no/gjøk, Edvard Kaurin Barth and Bård Gunnar Stokke, updated 2026-11-06

| Field | Value |
|---|---|
| Length, weight | 32 to 33 cm, about 115 g |
| Shape | Long tail, long pointed wings. In size, build and flight easily taken for a sparrowhawk or the smallest falcons |
| Male | Slate-grey with cross-barring, paler underparts |
| Female | Two types: one like the male, one strongly rufous-brown above with black bars. In Norway the grey type is clearly the most common |
| Male song | The well-known «ko-ko»: two notes in a falling third, the first «ko» higher than the second. Carries far. The male also has some hoarse, chattering sounds |
| Female call | Only a trilling or bubbling sound, often after laying |
| Winter | Silent in its winter quarters in Africa |
| Habitat | All kinds of forest, out to the coast; in the birch belt and a little into the bare mountain, in places very many. Numbers vary a lot from year to year |
| Range in Norway | Breeds over the whole country. 5000 to 15 000 pairs; fallen about 30 % in ten years |
| Food | A distinct insect eater, most of all caterpillars; also dragonflies, grasshoppers, beetles. Eats eggs from other birds' nests |
| Brood parasite | The only Norwegian brood parasite; builds no nest. At least 27 songbirds are known hosts in Norway; the meadow pipit by far the most common. Each female lays eggs like her host's. The chick tips the host's eggs and young out of the nest from 10 to 12 hours old until about four days old |
| Eggs | 10 to 20, one in each nest about every second day. Incubation about 12 days; the chick leaves the nest after about three weeks |
| Migration | Back over the whole country during May. Adults leave in late July or early August; young from mid-August to mid-September. Winters in tropical and southern Africa |
| Status | NT, near threatened, on the Norwegian red list; LC globally |

To verify: the size of the falling third, how fast and how many times «ko-ko» is repeated, time of day and months of the song, what the male's hoarse sounds and the female's bubbling sound like in detail, bill, eye and leg colour, the juvenile, wingspan.

### Flaggspett (folder `flaggspett`), snl.no/flaggspett, Olav Hogstad, Magne Husby and Jørgen Skavdal Søraker, updated 2026-11-04

| Field | Value |
|---|---|
| Length, weight | About 25 cm, thrush-sized, 70 to 90 g |
| Appearance | Pied black, white and red. Two large white oval shoulder patches on the black back, black wings with fine white bars, white underparts, a blood-red patch under the tail base |
| Male | A small red nape patch |
| Female | Black crown with no red |
| Juvenile | Both sexes have the whole crown red, brightest in the male |
| Drumming | With the bill on a hard surface. About 10 to 15 strokes a second, the fastest of all woodpeckers; a roll lasts just over half a second and ends abruptly. Carries far. Both sexes drum in spring, the male most; sometimes outside the breeding season too, often on posts and metal sheets |
| Call | A loud, short, sharp «kikk», often in series at a calm pace |
| Habitat | Fairly common in deciduous, conifer and mixed forest in Sør-Norge, sparser in Nord-Norge. Needs old trees big enough for nest holes |
| Range in Norway | 10 000 to 35 000 pairs (BirdLife Norge). Our most common woodpecker; numbers follow the spruce and pine seed crop |
| Food | Insects and larvae on and under bark in summer, also fruit and berries; not rarely eggs and nestlings of small birds. In autumn and winter mainly seeds from spruce and pine cones, wedged in an anvil it cuts itself. Suet at feeders. The only Norwegian woodpecker that lives mostly on conifer seeds in winter |
| Nest | A new hole most years, cut by both sexes in a living aspen or other deciduous tree, 2 to 3 weeks' work; entrance about 5 cm, 20 to 30 cm deep. Also cuts roost holes |
| Eggs | 4 to 8, glossy white, in May. Both incubate 10 to 12 days; the male always takes the night |
| Young | Leave the hole at three weeks, then fed 14 more days |
| Movements | Mainly resident; in some years long irruptions, away from an area for one or two years |
| Status | LC on the Norwegian red list, and globally |

To verify: bill, eye and leg colour, number of beats per roll, months of drumming beyond "spring", what the drumming is for, broods, wingspan, lookalikes.

## Coast and water birds, checked 2026-11-26

Source: Store norske leksikon (snl.no), one article per bird, read in full.

### Gråmåke (folder `gramake`), snl.no/gråmåke, Morten Helberg, updated 2026-08-04

| Field | Value |
|---|---|
| Size | Not given as figures. Finnmark birds are on average 150 g heavier, head and bill 6 mm longer, wing 11 mm longer than birds from Vest-Agder and the Oslofjord |
| Adult | Silver-grey back, black wingtips (usually on the five outermost primaries, white tip on the outermost), white head from January on |
| Bill, eye, legs | Yellow bill with a red spot on the lower mandible, yellow eye-ring, grey-pink legs (some pale or straw-yellow, mostly in March and April) |
| Sex | No difference stated |
| Young | Very variable in size, pattern and colour. A pale window on the inner 3 to 5 primaries. Takes three to five years to reach adult plumage |
| Habitat | Breeds mostly on islands in salt water, also fresh water and on buildings in towns; along the whole coast and locally inland |
| Population | 233 000 pairs in 2006, 72 000 in 2015. Sharp decline in Europe and most of Norway; the inner Oslofjord halved since 2001; causes not known |
| Food | Mostly fish taken at the surface; a generalist: shellfish, earthworms, insects, small mammals, plants, waste. Follows fishing boats |
| Nest | Of herbs, grass and moss; alone or in colonies of a few to several thousand pairs |
| Eggs | 1 to 3, usually 2 or 3, laid from about 20 April through May. Both incubate about 26 days; the young fly after about 40 days |
| Migration | Partial migrant. Northern birds winter around the North Sea; southern birds at the Skagerrak and the North Sea |
| Status | VU, vulnerable, on the Norwegian red list (2021 to 2028); LC globally |
| Versus lesser black-backed gull | Young herring gulls are sturdier, with shorter wings and a heavier bill. A broad black band on the sixth outer primary is rare in the herring gull |

Sounds: none of SNL, Norwegian Wikipedia, BirdID or the Fuglevennen and BirdLife Norge pages (not found) describe the herring gull's calls. Every sound in Pipp is a placeholder until a source is found.

To verify: all calls, length, wingspan, weight, head pattern of adults in winter, eye colour.

### Tjeld (folder `tjeld`), snl.no/tjeld, Jan Eivind Østnes, updated 2026-11-08

| Field | Value |
|---|---|
| Length, weight | 40 to 45 cm, 450 to 650 g. One of our very largest waders |
| Appearance | Back, head and neck black, sharp against a chalk-white underside. Winter plumage much the same, with a narrow white collar. Broad white wing bars in flight |
| Bill, eye, legs | Orange-red bill, strong, straight, 7 to 9 cm, wedge-shaped for opening shells. Red eyes. Reddish-pink, fairly short legs |
| Sex, young | No difference stated; no juvenile description |
| Sound | A lively bird that calls often. The flight call is loud, penetrating and easy to recognise. Very vocal when mating |
| Habitat | Shores with soft bottom outside the breeding season. Breeds along the whole coast; in Trøndelag and parts of Østlandet also inland by rivers, lakes and farmland |
| Population | 50 000 to 100 000 pairs (Norsk ornitologisk forening) |
| Food | Mussels (blue mussel, cockle, sand gaper), snails, bristle worms, crustaceans; inland mostly earthworms and insects |
| Nest | A shallow scrape on sand or gravel, often lined with small stones or shell; sometimes in odd places such as flower beds |
| Eggs | Usually three, hen's-egg sized, yellow-brown with dark spots, laid in the second half of May. Both parents raise the young, which fly after about four weeks |
| Pairs, age | Usually monogamous, often back at the same nest site year after year. Oldest ringed bird 46 years |
| Migration | Short-distance migrant, wintering mainly from Denmark to France and in eastern England, the Wadden Sea most of all; some on the coast north to Lofoten; 150 to 200 every winter in the inner Trondheimsfjord. Back in late February in the south, March to mid-April further north; leaves mainly in August and September |
| Status | NT, near threatened, in Norway and globally |

To verify: how the flight call and other calls sound, transcriptions, piping display, alarm, wingspan, the juvenile, incubation time.

### Ærfugl (folder `aerfugl`), snl.no/ærfugl, Rolf Terje Kroglund, updated 2026-11-04

| Field | Value |
|---|---|
| Length, weight | 50 to 70 cm, 1600 to 2800 g. The largest diving duck in Norway, and the most numerous |
| Male | White head with a black crown and two large green patches on the nape; neck, breast and back white; belly, flanks and rear black. Eclipse in late summer: almost all black, flightless for several weeks at moulting sites far offshore |
| Female | Uniform brown with black cross-bars; dark speculum with white edges |
| Young | Young females like adults with more diffuse bars and no white speculum edges. One-year males: white breast, grey-brown head, neck and body with some white |
| Bill | Long, light and wedge-shaped; its profile tells it from every other duck breeding on mainland Norway |
| Sounds | Often heard, soft hollow sounds. The male: «a-ooh-å». The female: a cackling «gak-ak-ak-ak», like the engine of a fishing boat |
| Habitat | Shallow skerries, often in colonies with gulls, terns and greylag geese; nests on islands and the mainland, often under juniper. More tied to the sea than other Norwegian ducks |
| Population | 87 000 pairs on the mainland (BirdLife Norge, 2015). Sharp decline, most likely because islands and small coastal settlements were abandoned |
| Food | Mostly bottom animals in shallow water (under 5 m, can dive to 30 to 40 m): crustaceans, snails, mussels (blue mussel above all), echinoderms. Herring roe in spring |
| Nest | A scrape lined with straw, heather and seaweed, then down from the female's own breast. The female builds alone. Eiderdown tradition kept up on the Helgeland coast, mainly in Vega; about 60 nests of down for one duvet |
| Eggs | 4 to 6, olive-green, around the turn of April and May. The female incubates 25 to 28 days alone |
| Young | Leave the nest 1 to 2 days old; females with broods often join together. Fly after 65 to 75 days |
| Movements | Fairly resident; many from Sør-Norge winter in Danish waters; many Baltic birds winter in the Trondheimsfjord |
| Status | VU, vulnerable, on the Norwegian red list; NT globally |
| Versus king eider | Can be confused with the king eider, which does not breed on mainland Norway |

To verify: when and how the calls are given, leg colour, wingspan, years to adult plumage.

### Storspove (folder `storspove`), snl.no/storspove, Jan Eivind Østnes, updated 2026-11-08

| Field | Value |
|---|---|
| Length, weight | 50 to 60 cm, 450 to 1350 g; the bill alone 10 to 15 cm. Europe's largest wader |
| Appearance | Grey-brown, densely streaked and spotted dark. Very long, down-curved bill. Long blue-grey legs. Slow, calm wingbeats, like a gull at a distance; a clear white wedge on the back in flight |
| Sex | The female is on average a little larger and usually has a clearly longer bill |
| Young | Can have a much shorter bill than adults |
| Song | The display flight starts with long, clear whistled notes that speed up and end in a powerful bubbling sound |
| Call | Powerful and easy to recognise |
| Habitat | Open land: farmland, heaths, bogs, salt marshes; in Norway mostly the coast and farmland. Outside the breeding season on shore flats |
| Population | 2000 to 3000 pairs (BirdLife Norge, 2015); about halved since around 2000 |
| Food | Bristle worms, insects, crustaceans, molluscs; many berries and seeds in summer |
| Nest | A scrape in open ground lined with dry grass and often a few feathers |
| Eggs | Usually four; both incubate 26 to 30 days. The young leave the nest soon and fly after 5 to 6 weeks; the female often leaves halfway |
| Pairs, age | Monogamous and territorial, often the same pair and site for many years. Oldest ringed bird 32 years |
| Migration | Arrives in March to May. Females leave from late June, males in July and August, young in August and September. Winters mostly on the coasts of the British Isles; birds wintering on the Norwegian coast (north to Tromsø) are thought to come from elsewhere |
| Status | EN, endangered, on the Norwegian red list; NT globally |
| Versus whimbrel | The whimbrel is clearly smaller with a shorter bill; young curlews can have a much shorter bill too |

To verify: how the call sounds, transcriptions, alarm, bill colour, wingspan, the juvenile's plumage, song months and time of day.

## Night birds, checked 2026-11-26

Source: Store norske leksikon (snl.no), one article per bird, read in full.

### Kattugle (folder `kattugle`), snl.no/kattugle, Rolf Terje Kroglund, updated 2026-08-05

| Field | Value |
|---|---|
| Size | Wingspan 81 to 104 cm, 550 to 750 g. A medium-sized owl |
| Appearance | More varied than other owls, from grey-brown to red-brown. Pale underside with dark lengthwise streaks; back mottled with dark streaks. Large round head with a fairly pale, even face; two pale bands on the forehead meet over the bill. Rounded, fairly short wings; short tail with diffuse bars |
| Eyes | Entirely black; with the much larger ural owl the only Norwegian owl with black eyes |
| Sex | Same plumage; the female is somewhat larger and heavier |
| Male song | A deep, drawn-out «hoo», about five seconds later a marked «kokk», at once followed by a trembling falling series of 1 to 2 seconds: «hoo..........kokk ho'o'o'o'o'o'o'». Carries 2 to 3 km in calm weather |
| Female call | A characteristic sharp «ku'vitt» or «i' vitt» |
| Other sounds | Many different sounds |
| When | Almost only active at night. The male sings from January, most from the second half of February, and often in autumn too |
| Habitat | Old deciduous forest, also mixed forest; often near people, in large gardens and parks with big trees, and farmland. Most in the lowlands |
| Range in Norway | North to northern Trøndelag. 2500 to 6000 pairs (2015), fairly stable |
| Food | A generalist: large insects, earthworms, snails, amphibians, birds, shrews and small rodents; clutch size follows the rodents |
| Nest | Hollow trees, often large nest boxes; sometimes broken trunks or crow and magpie nests |
| Eggs | 2 to 6, usually March or early April; the female incubates 28 to 30 days |
| Young | Leave the nest at about four weeks before they can fly and climb with their bills; fed two to three months more. Parents can be very aggressive at the nest |
| Movements | Very sedentary; young settle a few km from home |
| Status | LC in Norway and globally |

To verify: length, juvenile plumage, bill and feet colour, duets, the other sounds, hunting.

### Rugde (folder `rugde`), snl.no/rugde, Jan Eivind Østnes, updated 2026-05-12

| Field | Value |
|---|---|
| Weight | About 300 g. A large, compact wader with short legs |
| Appearance | Strongly mottled, mostly in red-brown tones. Very long, straight, strong bill, as in the snipes. Large eyes set far back, seeing almost all round. Broad wings with rounded tips; in flight the bill points down |
| Sex, young | No plumage difference stated; no juvenile description |
| Roding | In spring the males fly regular routes just above the treetops at dusk or shortly before sunrise («rugdetrekket»), grunting and squeaking: «orrt-orrt» followed by a sharp «pisst» |
| Activity | Mainly active at night |
| Habitat | Damp forest over most of the country; seen by forest roads on late spring evenings and early mornings |
| Population | 50 000 to 75 000 pairs (Norsk ornitologisk forening, 2015) |
| Food | Mostly animal food, in the breeding season earthworms and insect larvae; probes deep with the bill, which senses prey at the tip |
| Nest | A shallow scrape, often by a tree, lined with dry leaves, moss and straw |
| Eggs | Usually four, brownish-yellow with dark spots, laid in the second half of April or first half of May. The female incubates alone, about 22 days |
| Young | Leave the nest at once; the female tends them until they fly at 5 to 6 weeks, and can carry one at a time between legs and breast in flight |
| Migration | Most leave in winter, some stay on the south coast. Arrives in March and April, leaves in September and October; winters in western and southern Europe |
| Hunting | Spring hunting during roding banned since 1932; open 10 September to 23 December |
| Status | LC in Norway and globally |

To verify: length, wingspan, bill and leg colour, the juvenile, any call outside roding, exact months of roding.

### Nattergal (folder `nattergal`), snl.no/nattergal, Tom Schandy, updated 2026-11-08

| Field | Value |
|---|---|
| Length | 16 cm |
| Appearance | Grey-brown overall: brown above, grey-white below, rust-brown tail |
| Sex | Male and female are alike |
| Song | Whistled notes repeated the way the song thrush repeats its phrases, plus smacking and drumming sounds. Sung at night, and also in early mornings. Carries up to two kilometres in good conditions |
| Habitat | Mostly deciduous forest with rich undergrowth near farmland, often by damp ground, water or a stream |
| Range in Norway | First heard singing at Bygdøy in 1926 and 1927, first breeding at Tromøya in 1964. Now breeds sparsely from Agder to the Oslofjord and in southern Innlandet, most in Vestfold; north to Sunnmøre. 500 to 1000 pairs; rose in the 1970s, since stable or a little down |
| Food | Insects, earthworms, snails; some berries in autumn and winter |
| Nest | Well hidden on or by the ground |
| Eggs | 4 to 6, incubated 13 days; the young leave the nest after about 10 to 12 days |
| Migration | Back in the first half of May. Probably winters in eastern Africa |
| Status | NT, near threatened, on the Norwegian red list; LC globally |
| Versus common nightingale | The common nightingale (sørnattergal) is more red-brown above and paler below; very rare in Norway |

To verify: calls, bill, eye and leg colour, weight, wingspan, the juvenile, singing months, departure month.

## All other birds

Every bird outside the garden group now has a section above.

## Dawn chorus

The design shows robin, blackbird, song thrush and great tit entering at 70, 60, 50 and 25 minutes before sunrise. These numbers are placeholders with no source.

## Where to look

- Artsdatabanken: names, classification, red list, observations.
- BirdLife Norge and Fuglevennen: identification, song descriptions, wintering.
- Store norske leksikon: general species accounts.
- xeno-canto: real recordings to tune the voice against. Check each recording's licence before using it for anything other than listening.
