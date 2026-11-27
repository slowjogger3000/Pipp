(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))t(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&t(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function t(i){if(i.ep)return;i.ep=!0;const s=e(i);fetch(i.href,s)}})();const mt=""+new URL("worklet-C7dXQ3QC.js",import.meta.url).href,vt=12,tn=4,xn=960,bt={Hold:2};function _t(c){const n=[];for(const e of c){let t=e.codePointAt(0);t<128?n.push(t):t<2048?n.push(192|t>>6,128|t&63):t<65536?n.push(224|t>>12,128|t>>6&63,128|t&63):n.push(240|t>>18,128|t>>12&63,128|t>>6&63,128|t&63)}return new Uint8Array(n)}function kt(c){let n="";for(let e=0;e<c.length;){const t=c[e++];t<128?n+=String.fromCharCode(t):t<224?n+=String.fromCharCode((t&31)<<6|c[e++]&63):t<240?n+=String.fromCharCode((t&15)<<12|(c[e++]&63)<<6|c[e++]&63):n+=String.fromCodePoint((t&7)<<18|(c[e++]&63)<<12|(c[e++]&63)<<6|c[e++]&63)}return n}class he{x;params=[];byId=new Map;scratch=0;scratchBytes=0;static async load(n){const e={env:{emscripten_notify_memory_growth:()=>{}},wasi_snapshot_preview1:{fd_close:()=>0,fd_seek:()=>70,fd_write:(s,o,a,r)=>{const d=new DataView(i.x.memory.buffer);let u=0;for(let g=0;g<a;g++)u+=d.getUint32(o+8*g+4,!0);return d.setUint32(r,u,!0),0}}},{instance:t}=await WebAssembly.instantiate(n,e),i=new he(t.exports);return i}constructor(n){this.x=n,n._initialize?.();const e=n.pipp_param_count();for(let t=0;t<e;t++){const i=this.str(n.pipp_param_options(t)),s={index:t,id:this.str(n.pipp_param_id(t)),kind:n.pipp_param_kind(t),min:n.pipp_param_min(t),max:n.pipp_param_max(t),def:n.pipp_param_def(t),unit:this.str(n.pipp_param_unit(t)),options:i?i.split("|"):[]};this.params.push(s),this.byId.set(s.id,t)}}f32(n,e){return new Float32Array(this.x.memory.buffer,n,e)}i32(n,e){return new Int32Array(this.x.memory.buffer,n,e)}u8(n,e){return new Uint8Array(this.x.memory.buffer,n,e)}str(n){if(!n)return"";const e=new Uint8Array(this.x.memory.buffer);let t=n;for(;e[t]!==0;)t++;return kt(e.subarray(n,t))}alloc(n){return this.x.pipp_alloc(n)}free(n){this.x.pipp_free(n)}buf(n){return n>this.scratchBytes&&(this.scratch&&this.free(this.scratch),this.scratchBytes=Math.max(n,4096),this.scratch=this.alloc(this.scratchBytes)),this.scratch}cstr(n){const e=_t(n),t=this.alloc(e.length+1),i=new Uint8Array(this.x.memory.buffer,t,e.length+1);return i.set(e),i[e.length]=0,t}index(n){const e=this.byId.get(n);if(e===void 0)throw new Error(`unknown parameter ${n}`);return e}parseBird(n,e,t){const i=this.cstr(n),s=this.cstr(e),o=this.cstr(t),a=this.x.pipp_bird_parse(i,s,o);if(this.free(i),this.free(s),this.free(o),!a)throw new Error(`${n}: ${this.str(this.x.pipp_last_error())}`);return a}phrase(n){const e=this.x.pipp_engine_max_notes(),t=this.buf((5+5*e)*4);if(!this.x.pipp_engine_phrase(n,t))return null;const i=this.f32(t,5),s=i[1],o=this.f32(t+20,5*s),a=[];for(let r=0;r<s;r++)a.push({syl:o[5*r],startMs:o[5*r+1],durMs:o[5*r+2],pitchMul:o[5*r+3],part:o[5*r+4]});return{number:i[0],lengthMs:i[2],drawn:i[3]!==0,drawnStartMs:i[4],notes:a}}}const yt=`{
 "_note": "Field guide text for the eider, both languages. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/somateria-mollissima",
 "facts": {
  "length": {
   "en": "50 to 70 cm, 1600 to 2800 g",
   "no": "50 til 70 cm, 1600 til 2800 g",
   "verified": true
  },
  "broods": {
   "en": "4 to 6 eggs, turn of April and May",
   "no": "4 til 6 egg, rundt månedsskiftet april–mai",
   "verified": true
  },
  "range": {
   "en": "The whole coast; 87 000 pairs (2015)",
   "no": "Hele kysten; 87 000 par (2015)",
   "verified": true
  },
  "habitat": {
   "en": "Shallow skerries, often with gulls and terns",
   "no": "Grunne skjærgårder, ofte med måker og terner",
   "verified": true
  },
  "food": {
   "en": "Bottom animals, blue mussels above all",
   "no": "Bunndyr, særlig blåskjell",
   "verified": true
  },
  "status": {
   "en": "VU, vulnerable, Norwegian red list",
   "no": "VU, sårbar, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "Scrape lined with the female's own down",
   "no": "Grop foret med hunnens egen dun",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "«a-ooh-å»",
   "no": "«a-ooh-å»",
   "verified": true
  },
  "female": {
   "en": "«gak-ak-ak-ak»",
   "no": "«gak-ak-ak-ak»",
   "verified": true
  }
 },
 "song_notes": {
  "en": "Often heard, with soft, hollow sounds. The male calls “a-ooh-å”; the female has a cackling “gak-ak-ak-ak”, like the engine of a fishing boat. The sources do not say when and how each call is given.",
  "no": "Lager ofte lyd, koselige hule lyder. Hannen roper «a-ooh-å»; hunnen har et kaklende «gak-ak-ak-ak», som motoren på ei fiskeskøyte. Kildene sier ikke når og hvordan hver lyd brukes.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "The male's “a-ooh-å”.",
   "no": "Hannens «a-ooh-å».",
   "verified": true
  },
  "call": {
   "en": "Female: a cackling “gak-ak-ak-ak”, like a fishing boat's engine.",
   "no": "Hunn: et kaklende «gak-ak-ak-ak», som motoren på ei fiskeskøyte.",
   "verified": true
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "????????????",
  "note": {
   "en": "Fairly resident, often near the breeding site all year. Many from Sør-Norge winter in Danish waters. Eggs around the turn of April and May.",
   "no": "Ganske stasjonær, ofte nær hekkeplassen hele året. Mange fra Sør-Norge overvintrer i danske farvann. Egg rundt månedsskiftet april–mai.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "name": {
    "en": "King eider",
    "no": "Praktærfugl"
   },
   "text": {
    "en": "Can be confused with the eider, but does not breed on mainland Norway.",
    "no": "Kan forveksles med ærfugl, men hekker ikke på fastlandet.",
    "verified": true
   }
  }
 ]
}`,wt=`{
 "_note": "Eider ink plate in a 280x240 box, drawn in M10, not from a design: swimming. Drake: white with a black crown, green nape patch (shadow tone) and black belly, flanks and rear (ink). Female: brown with black bars (dense hatching). Juvenile shows the one-year male: grey-brown with a white breast (light hatching). Long, light, wedge-shaped bill (birds.md, SNL).",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M210 92 C210 76 198 66 184 66 C170 66 162 76 162 88 L160 104 C130 104 90 110 66 124 C60 130 64 140 76 146 C100 160 150 166 190 158 C206 152 214 138 210 120 C208 110 206 100 210 92 Z",
  "wing": "M184 112 C150 108 110 112 80 124 C110 132 152 134 186 126 Z"
 },
 "hatch": {
  "body": {
   "rect": [
    58,
    62,
    216,
    166
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    78,
    104,
    188,
    136
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    208,
    90
   ],
   "deg": -8
  },
  "lower": {
   "at": [
    208,
    96
   ],
   "deg": 6
  },
  "tail": {
   "at": [
    66,
    126
   ],
   "deg": -4
  }
 },
 "layers": [
  {
   "path": "M66 124 L42 116 L46 130 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "variant": "breast",
   "fill": "face",
   "within": "body"
  },
  {
   "variant": "black",
   "fill": "ink",
   "within": "body"
  },
  {
   "variant": "cap",
   "fill": "ink",
   "within": "body"
  },
  {
   "variant": "nape",
   "fill": "shadow",
   "stroke": 1,
   "within": "body"
  },
  {
   "clip": "wing",
   "fill": "face"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.2
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    190,
    80
   ],
   "pupil": 2.4
  },
  {
   "path": "M208 84 L240 98 L236 102 L208 94 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M208 94 L236 102 L232 105 L207 99 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M12 160 C60 154 110 162 160 158 C200 155 236 160 270 156",
   "fill": "none",
   "stroke": 2
  },
  {
   "path": "M30 172 q12 -4 24 0 M90 176 q12 -4 24 0 M170 172 q12 -4 24 0 M230 176 q10 -3 20 0",
   "stroke": 1
  },
  {
   "path": "M246 84 A16 16 0 0 1 246 112 M253 76 A26 26 0 0 1 253 120",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "variants": {
  "male": {
   "body_pitch": 0,
   "wing_pitch": 0,
   "eye_ring": 0,
   "bill": "face",
   "black": "M60 124 C60 132 64 140 76 146 C100 160 150 166 190 158 C200 150 206 140 206 128 C170 136 118 134 60 124 Z",
   "cap": "M168 72 C176 64 196 64 206 74 C198 78 180 78 166 78 Z",
   "nape": "M166 82 C170 90 170 100 165 106 C162 98 162 88 166 82 Z",
   "breast": ""
  },
  "female": {
   "body_pitch": 4,
   "wing_pitch": 4,
   "eye_ring": 0,
   "bill": "face",
   "black": "",
   "cap": "",
   "nape": "",
   "breast": ""
  },
  "juvenile": {
   "body_pitch": 8,
   "wing_pitch": 7,
   "eye_ring": 0,
   "bill": "face",
   "black": "",
   "cap": "",
   "nape": "",
   "breast": "M210 100 C214 120 208 140 196 150 C190 140 192 118 198 100 Z"
  }
 },
 "callouts": [
  {
   "id": "head",
   "leader": "M176 70 L130 34",
   "at": [
    128,
    28
   ],
   "align": "right",
   "male": {
    "en": "BLACK CROWN, GREEN NAPE",
    "no": "SVART ISSE, GRØNN NAKKE",
    "verified": true
   },
   "female": {
    "en": "BROWN, BARRED",
    "no": "BRUN, TVERRSTRIPET",
    "verified": true
   },
   "juvenile": {
    "en": "GREY-BROWN",
    "no": "GRÅBRUN",
    "verified": true
   }
  },
  {
   "id": "bill",
   "leader": "M226 94 L226 44",
   "at": [
    226,
    31
   ],
   "align": "centre",
   "male": {
    "en": "LONG, LIGHT, WEDGE",
    "no": "LANGT, LYST, KILE",
    "verified": true
   },
   "female": {
    "en": "LONG, LIGHT, WEDGE",
    "no": "LANGT, LYST, KILE",
    "verified": true
   },
   "juvenile": {
    "en": "LONG, LIGHT, WEDGE",
    "no": "LANGT, LYST, KILE",
    "verified": true
   }
  },
  {
   "id": "plumage",
   "leader": "M110 140 L76 198",
   "at": [
    72,
    210
   ],
   "align": "centre",
   "male": {
    "en": "WHITE ABOVE, BLACK BELOW",
    "no": "HVIT OVER, SVART UNDER",
    "verified": true
   },
   "female": {
    "en": "BROWN, BLACK BARS",
    "no": "BRUN, SVARTE STRIPER",
    "verified": true
   },
   "juvenile": {
    "en": "WHITE BREAST",
    "no": "HVITT BRYST",
    "verified": true
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Drake in breeding plumage. Beak and tail follow the sound.",
   "no": "Hann i prakt. Nebb og hale følger lyden.",
   "verified": true
  },
  "female": {
   "en": "Female. Uniform brown with black bars.",
   "no": "Hunn. Jevnt brun med svarte tverrstriper.",
   "verified": true
  },
  "juvenile": {
   "en": "Young male, one year: white breast, grey-brown head and body.",
   "no": "Ung hann, ett år: hvitt bryst, gråbrunt hode og kropp.",
   "verified": true
  }
 }
}`,Lt=`{
 "_note": "Eider, M10. Verified (birds.md, SNL): often heard, soft hollow sounds; the male's «a-ooh-å»; the female's cackling «gak-ak-ak-ak», like the engine of a fishing boat. Sound design choices: the male's call at about 330 to 560 Hz with a rising 'ooh' and a falling 'å', 1 to 3 times; the female's 'gak' notes 5 to 14 at a steady engine-like 7 or 8 a second. The male's call is the song type (inactive for the female); the call type holds the male's call for the male and the female's cackle for the female, marked by sex, because no other sounds are described.",
 "syllables": {
  "aoha": {
   "dur_ms": 900,
   "pitch": [
    [
     0,
     330
    ],
    [
     0.12,
     340
    ],
    [
     0.2,
     360
    ],
    [
     0.45,
     520
    ],
    [
     0.6,
     500
    ],
    [
     0.72,
     430
    ],
    [
     1,
     340
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.04,
     0.7
    ],
    [
     0.14,
     0.6
    ],
    [
     0.2,
     0.2
    ],
    [
     0.28,
     0.9
    ],
    [
     0.55,
     1
    ],
    [
     0.66,
     0.5
    ],
    [
     0.72,
     0.8
    ],
    [
     0.92,
     0.6
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.95,
   "breath": 10
  },
  "aoha2": {
   "dur_ms": 820,
   "pitch": [
    [
     0,
     350
    ],
    [
     0.15,
     360
    ],
    [
     0.25,
     380
    ],
    [
     0.5,
     560
    ],
    [
     0.65,
     520
    ],
    [
     0.75,
     450
    ],
    [
     1,
     360
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.05,
     0.6
    ],
    [
     0.16,
     0.5
    ],
    [
     0.22,
     0.2
    ],
    [
     0.3,
     0.9
    ],
    [
     0.55,
     1
    ],
    [
     0.68,
     0.5
    ],
    [
     0.75,
     0.8
    ],
    [
     0.92,
     0.6
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.95,
   "breath": 10
  },
  "gak": {
   "dur_ms": 90,
   "pitch": [
    [
     0,
     520
    ],
    [
     0.3,
     560
    ],
    [
     1,
     450
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.85,
   "rough": 55,
   "breath": -10,
   "tension": 35
  }
 },
 "types": {
  "song": {
   "pause_s": [
    3.0,
    9.0
   ],
   "length_s": [
    0.9,
    3.0
   ],
   "transpose_st": 0.6,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     28,
     42
    ],
    "vo_tension": [
     6,
     14
    ],
    "vo_rough": [
     5,
     12
    ],
    "ph_tempo": [
     96,
     104
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "aoha",
        "aoha2"
       ],
       "count": [
        1,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        500,
        1000
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": [
    {
     "_note": "«a-ooh-å» is the male's (SNL).",
     "when": {
      "sex": "female"
     },
     "active": false
    }
   ]
  },
  "call": {
   "pause_s": [
    2.0,
    7.0
   ],
   "length_s": [
    0.8,
    2.0
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     20,
     36
    ],
    "vo_tension": [
     8,
     20
    ],
    "vo_rough": [
     6,
     14
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sex": "male",
     "sections": [
      {
       "pool": [
        "aoha",
        "aoha2"
       ],
       "count": [
        1,
        2
       ],
       "share": 1.0,
       "gap_ms": [
        500,
        900
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 1,
     "sex": "female",
     "sections": [
      {
       "pool": [
        "gak"
       ],
       "count": [
        5,
        14
       ],
       "share": 1.0,
       "gap_ms": [
        35,
        50
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}`,Mt=`{
  "_note": "Sound design starting values for the eider, M10. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 450,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 35,
    "vo_tension": 10,
    "vo_trill": 0,
    "vo_rough": 8,
    "ph_tempo": 100,
    "ph_pause": 4.0,
    "ph_length": 1.2,
    "ph_variation": 50,
    "su_distance": 40,
    "su_wind": 1.5,
    "su_space": 35
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}`,xt=`{
 "_note": "Field guide text for the corncrake, both languages. SNL gives no transcription, so the note shapes are [TO VERIFY]. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/crex-crex",
 "facts": {
  "length": {
   "en": "A little larger than a thrush, about 100 to 200 g",
   "no": "Litt større enn en trost, rundt 100 til 200 g",
   "verified": true
  },
  "broods": {
   "en": "",
   "no": "",
   "verified": false
  },
  "range": {
   "en": "Sparse, mainly the coast from Vest-Agder to Møre og Romsdal and some places in Østlandet; 204 singing males in 2013",
   "no": "Fåtallig, mest langs kysten fra Vest-Agder til Møre og Romsdal og noen steder på Østlandet; 204 syngende hanner i 2013",
   "verified": true
  },
  "habitat": {
   "en": "Cultivated land",
   "no": "Dyrket mark",
   "verified": true
  },
  "food": {
   "en": "",
   "no": "",
   "verified": false
  },
  "status": {
   "en": "CR, critically endangered, Norwegian red list; mowing machines are the threat",
   "no": "CR, kritisk truet, norsk rødliste; slåmaskiner er trusselen",
   "verified": true
  },
  "nest": {
   "en": "In farmland; breeding is very hard to prove",
   "no": "I jordbruksland; hekking er svært vanskelig å påvise",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "",
   "no": "",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "Hard to see, but the sound is very distinctive: a single-toned creaking or rattling that can go on for hours, mostly in the evening and at night. SNL gives no transcription, so the notes Pipp plays are a stand-in. Brown and mottled above, yellow-brown and barred below, a grey neck; short bill and tail.",
  "no": "Vanskelig å se, men lyden er svært særpreget: en enstonig knirking eller klapring som kan vare i timevis, mest om kvelden og natten. SNL gir ingen gjengivelse, så tonene Pipp spiller er en stedfortreder. Brunspraglet ovenpå, gulbrun og tverrstripet under, grå halsregion; kort nebb og hale.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "A single-toned creaking or rattling, for hours.",
   "no": "En enstonig knirking eller klapring, i timevis.",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "calendar": {
  "present": "nn?????????n",
  "sings": "nn?????????n",
  "note": {
   "en": "Migrant; probably winters mainly in southern Africa. The sources do not say when it comes and goes.",
   "no": "Trekkfugl; overvintrer trolig mest i det sørlige Afrika. Kildene sier ikke når den kommer og drar.",
   "verified": true
  }
 },
 "lookalikes": []
}
`,St=`{
 "_note": "Corncrake ink plate in a 280x240 box, M11 batch 8, built from the woodcock plate: brown and mottled above (hatching), yellow-brown barred underside, grey neck region (shadow), short bill and tail (birds.md, SNL). Sexes and juvenile are not described: drawn alike, [TO VERIFY]. Bill and leg colour not described.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M190 96 C190 80 178 70 164 72 C150 74 142 86 140 98 C116 102 92 112 76 126 C70 132 74 140 84 146 C108 160 140 166 164 160 C182 154 192 140 192 124 C192 114 190 104 190 96 Z",
  "wing": "M154 106 C130 108 104 116 82 128 C104 138 132 142 158 134 C164 124 162 112 154 106 Z"
 },
 "hatch": {
  "body": {
   "rect": [
    70,
    68,
    194,
    168
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    80,
    104,
    164,
    144
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    188,
    94
   ],
   "deg": -5
  },
  "lower": {
   "at": [
    188,
    98
   ],
   "deg": 4
  },
  "tail": {
   "at": [
    80,
    130
   ],
   "deg": -3
  }
 },
 "layers": [
  {
   "path": "M14 196 C70 186 150 184 268 190",
   "stroke": 2.5
  },
  {
   "path": "M40 190 q10 -12 22 -2 q-12 6 -22 2 Z M210 186 q12 -10 22 0 q-12 6 -22 0 Z M120 192 q8 -8 16 0",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M138 160 L136 186 M154 162 L156 186 M128 187 L136 186 L144 188 M148 187 L156 186 L164 188",
   "stroke": 1.5
  },
  {
   "path": "M80 126 L58 128 L62 138 L84 136 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "variant": "under",
   "fill": "face",
   "within": "body"
  },
  {
   "path": "M118 152 l4 -6 M130 156 l4 -7 M142 158 l4 -7 M154 158 l4 -8 M166 155 l4 -8 M177 149 l4 -8",
   "stroke": 1.2,
   "within": "body"
  },
  {
   "variant": "neck",
   "fill": "shadow",
   "within": "body"
  },
  {
   "clip": "wing",
   "fill": "face"
  },
  {
   "hatch": "wing"
  },
  {
   "path": "M96 126 l10 -6 M112 130 l10 -6 M128 132 l10 -6 M144 130 l8 -5",
   "stroke": 1.2,
   "within": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    170,
    92
   ],
   "pupil": 3.2
  },
  {
   "path": "M188 92 L206 96 L189 98 Z",
   "fill": "bill",
   "stroke": 1.3,
   "part": "upper"
  },
  {
   "path": "M189 98 L204 98 L188 102 Z",
   "fill": "bill",
   "stroke": 1.3,
   "part": "lower"
  },
  {
   "path": "M130 62 A16 16 0 0 0 130 90 M123 54 A26 26 0 0 0 123 98",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "variants": {
  "male": {
   "body_pitch": 4,
   "wing_pitch": 4,
   "eye_ring": 0,
   "bill": "shadow",
   "under": "M84 146 C108 160 140 166 164 160 C182 154 192 140 192 124 C186 136 172 146 150 148 C124 150 100 146 84 146 Z",
   "neck": "M190 100 C192 112 190 124 186 132 C178 130 170 122 166 110 C164 102 166 96 170 98 C176 102 184 102 190 100 Z"
  },
  "female": {
   "body_pitch": 4,
   "wing_pitch": 4,
   "eye_ring": 0,
   "bill": "shadow",
   "under": "M84 146 C108 160 140 166 164 160 C182 154 192 140 192 124 C186 136 172 146 150 148 C124 150 100 146 84 146 Z",
   "neck": "M190 100 C192 112 190 124 186 132 C178 130 170 122 166 110 C164 102 166 96 170 98 C176 102 184 102 190 100 Z"
  },
  "juvenile": {
   "body_pitch": 4,
   "wing_pitch": 4,
   "eye_ring": 0,
   "bill": "shadow",
   "under": "M84 146 C108 160 140 166 164 160 C182 154 192 140 192 124 C186 136 172 146 150 148 C124 150 100 146 84 146 Z",
   "neck": "M190 100 C192 112 190 124 186 132 C178 130 170 122 166 110 C164 102 166 96 170 98 C176 102 184 102 190 100 Z"
  }
 },
 "callouts": [
  {
   "id": "bill",
   "leader": "M200 96 L214 62",
   "at": [
    214,
    52
   ],
   "align": "centre",
   "male": {
    "en": "SHORT",
    "no": "KORT",
    "verified": true
   },
   "female": {
    "en": "SHORT",
    "no": "KORT",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M110 116 L80 82",
   "at": [
    76,
    76
   ],
   "align": "right",
   "male": {
    "en": "BROWN, MOTTLED",
    "no": "BRUNSPRAGLET",
    "verified": true
   },
   "female": {
    "en": "BROWN, MOTTLED",
    "no": "BRUNSPRAGLET",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "neck",
   "leader": "M186 116 L232 126",
   "at": [
    244,
    132
   ],
   "align": "centre",
   "male": {
    "en": "GREY",
    "no": "GRÅ",
    "verified": true
   },
   "female": {
    "en": "GREY",
    "no": "GRÅ",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "breast",
   "leader": "M160 156 L196 204",
   "at": [
    200,
    216
   ],
   "align": "centre",
   "male": {
    "en": "YELLOW-BROWN, BARRED",
    "no": "GULBRUN, TVERRSTRIPET",
    "verified": true
   },
   "female": {
    "en": "YELLOW-BROWN, BARRED",
    "no": "GULBRUN, TVERRSTRIPET",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Calling. Beak and tail follow the sound.",
   "no": "Roper. Nebb og hale følger lyden.",
   "verified": true
  },
  "female": {
   "en": "Female. No difference from the male is described.",
   "no": "Hunn. Ingen forskjell fra hannen er beskrevet.",
   "verified": false
  },
  "juvenile": {
   "en": "Juvenile. Not described in the sources, so drawn like the adult.",
   "no": "Ungfugl. Ikke beskrevet i kildene, så tegnet som de voksne.",
   "verified": false
  }
 }
}
`,Et=`{
 "_note": "Corncrake, M11 batch 8. Verified by SNL: a single-toned creaking or rattling that can go on for hours, mostly in the evening and at night. No transcription, so the shape is a sound design guess: rough, breathy rasps at one pitch, each rattled by a fast amplitude trill, in pairs with short pauses so the series runs on.",
 "syllables": {
  "rasp": {
   "dur_ms": 220,
   "pitch": [
    [
     0,
     2100
    ],
    [
     1,
     2100
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.8,
     0.9
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "rough": 70,
   "breath": 45,
   "trill": {
    "hz": 22,
    "depth_st": 0.6,
    "am": 0.9
   }
  },
  "rasp2": {
   "dur_ms": 200,
   "pitch": [
    [
     0,
     2050
    ],
    [
     1,
     2050
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.8,
     0.9
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "rough": 70,
   "breath": 45,
   "trill": {
    "hz": 24,
    "depth_st": 0.6,
    "am": 0.9
   }
  }
 },
 "types": {
  "song": {
   "pause_s": [
    0.25,
    0.5
   ],
   "length_s": [
    0.5,
    0.8
   ],
   "transpose_st": 0.2,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.99,
     1.01
    ],
    "vo_breath": [
     40,
     50
    ],
    "vo_tension": [
     40,
     50
    ],
    "vo_rough": [
     60,
     72
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "rasp",
        "rasp2"
       ],
       "count": [
        2,
        2
       ],
       "share": 1.0,
       "gap_ms": [
        200,
        260
       ]
      }
     ]
    }
   ],
   "overrides": [
    {
     "_note": "Mostly evening and night (SNL).",
     "when": {
      "time": "day"
     },
     "active": false
    },
    {
     "_note": "Migrant, winters probably in southern Africa (SNL).",
     "when": {
      "season": "winter"
     },
     "active": false
    }
   ]
  }
 }
}
`,Ct=`{
 "_note": "Sound design starting values for the corncrake, M11 batch 8. Not bird facts.",
 "pitch_ref_hz": 2100,
 "base": {
  "vo_pitch": 1.0,
  "vo_breath": 45,
  "vo_tension": 45,
  "vo_trill": 0,
  "vo_rough": 66,
  "ph_tempo": 100,
  "ph_pause": 0.4,
  "ph_length": 0.6,
  "ph_variation": 50,
  "su_distance": 50,
  "su_wind": 1.5,
  "su_space": 35
 },
 "ranges": {
  "vo_pitch": [
   0.5,
   2.0
  ],
  "vo_breath": [
   0,
   100
  ],
  "vo_tension": [
   0,
   100
  ],
  "vo_trill": [
   0,
   40
  ],
  "vo_rough": [
   0,
   100
  ],
  "ph_tempo": [
   50,
   200
  ],
  "ph_pause": [
   0.2,
   20
  ],
  "ph_length": [
   0.2,
   8
  ],
  "ph_variation": [
   0,
   100
  ],
  "su_distance": [
   1,
   200
  ],
  "su_wind": [
   0,
   15
  ],
  "su_space": [
   0,
   100
  ]
 }
}
`,Tt=`{
 "_note": "Field guide text for this bird, both languages. Facts come from birds.md (M11, SNL). A field with verified false is not shown as a fact: empty means not described, and the text says what the sources leave out. Norwegian wording is mine, Eirik to check. calendar rows: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/fringilla-montifringilla",
 "facts": {
  "length": {
   "en": "15 cm, about a chaffinch's size",
   "no": "15 cm, omtrent som en bokfink",
   "verified": true
  },
  "broods": {
   "en": "",
   "no": "",
   "verified": false
  },
  "range": {
   "en": "Most of the country; in the south most in higher forest",
   "no": "Det meste av landet; i sør mest i høyereliggende skog",
   "verified": true
  },
  "habitat": {
   "en": "Mountain forest, conifer mixed with mountain birch",
   "no": "Fjellskog, barskog blandet med fjellbjørk",
   "verified": true
  },
  "food": {
   "en": "Seeds, insects in summer; beech seeds in winter",
   "no": "Frø, insekter om sommeren; bokfrø om vinteren",
   "verified": true
  },
  "status": {
   "en": "LC, least concern",
   "no": "LC, livskraftig",
   "verified": true
  },
  "nest": {
   "en": "In a tree close to the trunk, a deep hidden cup, 5 to 7 eggs",
   "no": "I et tre inntil stammen, en dyp, skjult skål, 5 til 7 egg",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Sings",
   "no": "Synger",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "A slow, raw, hummed note of about a second, «rrrrruh», like the greenfinch's song. The call is a loud, quacking or hard nasal «tæ-æhp».",
  "no": "En langsom, rå, nynnet tone på omtrent et sekund, «rrrrruh», lik grønnfinkens sang. Lokkelyden er et kraftig, kvekkende eller hardt nasalt «tæ-æhp».",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "A slow, raw «rrrrruh», about a second.",
   "no": "Et langsomt, rått «rrrrruh», omtrent et sekund.",
   "verified": true
  },
  "call": {
   "en": "A hard nasal «tæ-æhp».",
   "no": "Et hardt nasalt «tæ-æhp».",
   "verified": true
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "parts": {},
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "????????????",
  "note": {
   "en": "Migrant and wanderer: most winter in southern Scandinavia and Europe, often in huge flocks with chaffinches; some stay and visit feeders. Returns in April and May. The sources do not give its singing months.",
   "no": "Trekk- og streiffugl: de fleste overvintrer i Sør-Skandinavia og Europa, ofte i enorme flokker med bokfink; noen blir og besøker fuglebrett. Kommer i april og mai. Kildene oppgir ikke månedene med sang.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "id": "bokfink",
   "text": {
    "en": "The rump is white; the chaffinch's is green.",
    "no": "Overgumpen er hvit; bokfinkens er grønn.",
    "verified": true
   }
  },
  {
   "id": "gronnfink",
   "text": {
    "en": "The song is like the greenfinch's.",
    "no": "Sangen ligner grønnfinkens.",
    "verified": true
   }
  }
 ]
}
`,Nt=`{
 "_note": "Brambling ink plate in a 280x240 box, drawn in M11 from the chaffinch plate, not from a design. Male in summer: black head and back (ink and dense hatching), rust-yellow throat and breast (shadow tone), white rump (face). Female: grey-brown mottled head and back, white rump; her breast is not described, drawn pale. Juvenile like the female (SNL).",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M198 72 C196 58 182 52 168 56 C152 60 140 74 132 92 C120 112 114 132 116 150 C120 166 132 176 148 178 C166 180 182 170 190 152 C198 134 200 108 199 92 C200 86 201 82 200 80 Z",
  "wing": "M158 94 C164 120 150 148 120 160 C124 138 134 112 158 94 Z",
  "hood": "M200 64 C194 66 190 66 186 66 C180 68 176 76 172 84 C166 94 156 100 146 104 C148 84 156 64 168 56 C182 50 196 52 200 64 Z"
 },
 "layers": [
  {
   "path": "M14 206 C80 202 150 199 268 194",
   "stroke": 4
  },
  {
   "path": "M214 197 l20 -20 M224 187 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 177 q10 -10 18 -2 q-9 8 -18 2 Z M240 190 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M120 150 L80 200 L92 208 L132 166 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M124 156 L84 203 M128 162 L88 206",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M148 178 L148 199 M162 176 L163 198 M140 201 L148 199 L156 201 M155 199 L163 198 L171 200",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "path": "M200 80 C194 84 188 84 182 80 C174 84 168 92 164 104 C160 120 162 138 172 154 C178 162 184 168 188 170 L216 170 L216 78 Z",
   "fill": "breast",
   "within": "body"
  },
  {
   "path": "M200 64 C194 66 190 66 186 66 C180 68 176 76 172 84 C166 94 156 100 146 104 C148 84 156 64 168 56 C182 50 196 52 200 64 Z",
   "fill": "cap",
   "within": "body"
  },
  {
   "hatch": "hood"
  },
  {
   "path": "M200 64 C194 66 190 66 186 66 C180 68 176 76 172 84 C166 94 156 100 146 104",
   "stroke": 1,
   "within": "body"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "path": "M113 136 C120 133 127 138 129 149 C125 157 118 160 113 156 Z",
   "fill": "face",
   "stroke": 1,
   "within": "body"
  },
  {
   "path": "M134 106 L168 114 L167 120 L132 112 Z",
   "fill": "face",
   "stroke": 1,
   "within": "wing"
  },
  {
   "path": "M126 124 L166 132 L164 138 L124 130 Z",
   "fill": "face",
   "stroke": 1,
   "within": "wing"
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    184,
    72
   ],
   "pupil": 2.4
  },
  {
   "path": "M184.6 71.4 m-1.2 0 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0",
   "fill": "face"
  },
  {
   "path": "M197 68 L214 76 L200 78 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M200 78 L212 77 L199 83 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M226 66 A14 14 0 0 1 226 90 M233 58 A24 24 0 0 1 233 98 M240 50 A34 34 0 0 1 240 106",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "hatch": {
  "body": {
   "rect": [
    112,
    50,
    204,
    182
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    118,
    90,
    166,
    164
   ],
   "up": false,
   "clip": "wing"
  },
  "hood": {
   "rect": [
    140,
    48,
    204,
    108
   ],
   "up": false,
   "clip": "hood"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    200,
    74
   ],
   "deg": -14
  },
  "lower": {
   "at": [
    200,
    79
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    126,
    158
   ],
   "deg": -6
  }
 },
 "variants": {
  "male": {
   "body_pitch": 3,
   "wing_pitch": 3,
   "eye_ring": 0,
   "bill": "shadow",
   "breast": "shadow",
   "cap": "ink"
  },
  "female": {
   "body_pitch": 7,
   "wing_pitch": 3,
   "eye_ring": 0,
   "bill": "shadow",
   "breast": "face",
   "cap": "face",
   "hood_pitch": 6
  },
  "juvenile": {
   "body_pitch": 7,
   "wing_pitch": 3,
   "eye_ring": 0,
   "bill": "shadow",
   "breast": "face",
   "cap": "face",
   "hood_pitch": 6
  }
 },
 "callouts": [
  {
   "id": "head",
   "leader": "M172 60 L122 36",
   "at": [
    120,
    30
   ],
   "align": "right",
   "male": {
    "en": "BLACK IN SUMMER",
    "no": "SVART OM SOMMEREN",
    "verified": true
   },
   "female": {
    "en": "GREY-BROWN, MOTTLED",
    "no": "GRÅBRUN, SPRAGLETE",
    "verified": true
   },
   "juvenile": {
    "en": "GREY-BROWN, MOTTLED",
    "no": "GRÅBRUN, SPRAGLETE",
    "verified": true
   }
  },
  {
   "id": "plumage",
   "leader": "M122 142 L72 120",
   "at": [
    70,
    114
   ],
   "align": "right",
   "male": {
    "en": "WHITE RUMP",
    "no": "HVIT OVERGUMP",
    "verified": true
   },
   "female": {
    "en": "WHITE RUMP",
    "no": "HVIT OVERGUMP",
    "verified": true
   },
   "juvenile": {
    "en": "WHITE RUMP",
    "no": "HVIT OVERGUMP",
    "verified": true
   }
  },
  {
   "id": "breast",
   "leader": "M178 120 L232 200",
   "at": [
    276,
    212
   ],
   "align": "right",
   "male": {
    "en": "RUST-YELLOW",
    "no": "RUSTGUL",
    "verified": true
   },
   "female": {
    "en": "",
    "no": "",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Male in summer. Black head and back, rust-yellow breast. Grey-brown in winter.",
   "no": "Hann om sommeren. Svart hode og rygg, rustgult bryst. Gråbrun om vinteren.",
   "verified": true
  },
  "female": {
   "en": "Female. Grey-brown and mottled, white rump.",
   "no": "Hunn. Gråbrun og spraglete, hvit overgump.",
   "verified": true
  },
  "juvenile": {
   "en": "Juvenile. Like the female.",
   "no": "Ungfugl. Som hunnen.",
   "verified": true
  }
 }
}
`,Rt=`{
 "_note": "Brambling, M11 batch 3. Verified (birds.md, SNL): song a slow, raw, hummed note of about a second, «rrrrruh», like the greenfinch's; call a loud, quacking or hard nasal «tæ-æhp». Design: 'rrrrruh' a buzzing note of 0,9 to 1,2 s falling from about 3,3 to 2,8 kHz with a fast amplitude trill, one per phrase; 'tæ-æhp' a nasal two-part note of 0,3 s near 2,6 kHz. Pitches and timings are guesses.",
 "syllables": {
  "rruh": {
   "dur_ms": 1000,
   "pitch": [
    [
     0,
     3300
    ],
    [
     0.5,
     3200
    ],
    [
     1,
     2800
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     0.9
    ],
    [
     0.6,
     1
    ],
    [
     0.9,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.65,
   "rough": 10,
   "trill": {
    "hz": 42,
    "depth_st": 0.5,
    "am": 0.7
   }
  },
  "rruh2": {
   "dur_ms": 1200,
   "pitch": [
    [
     0,
     3200
    ],
    [
     0.5,
     3100
    ],
    [
     1,
     2700
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     0.9
    ],
    [
     0.6,
     1
    ],
    [
     0.9,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.65,
   "rough": 10,
   "trill": {
    "hz": 38,
    "depth_st": 0.5,
    "am": 0.7
   }
  },
  "taehp": {
   "dur_ms": 300,
   "pitch": [
    [
     0,
     2500
    ],
    [
     0.3,
     2900
    ],
    [
     0.45,
     2800
    ],
    [
     0.55,
     2900
    ],
    [
     1,
     2300
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.4,
     0.8
    ],
    [
     0.47,
     0.25
    ],
    [
     0.55,
     0.9
    ],
    [
     0.85,
     0.6
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.6,
   "rough": 30,
   "tension": 16
  }
 },
 "types": {
  "song": {
   "pause_s": [
    2.0,
    6.0
   ],
   "length_s": [
    0.9,
    1.3
   ],
   "transpose_st": 0.5,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     18,
     26
    ],
    "vo_tension": [
     40,
     52
    ],
    "vo_rough": [
     18,
     30
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "rruh",
        "rruh2"
       ],
       "count": [
        1,
        1
       ],
       "share": 1.0,
       "gap_ms": [
        200,
        200
       ]
      }
     ]
    }
   ],
   "overrides": []
  },
  "call": {
   "pause_s": [
    1.0,
    5.0
   ],
   "length_s": [
    0.3,
    1.0
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     16,
     24
    ],
    "vo_tension": [
     40,
     52
    ],
    "vo_rough": [
     24,
     34
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "taehp"
       ],
       "count": [
        1,
        2
       ],
       "share": 1.0,
       "gap_ms": [
        250,
        450
       ]
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,At=`{
  "_note": "Sound design starting values for the brambling, M11 batch 3. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 3000,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 22,
    "vo_tension": 46,
    "vo_trill": 0,
    "vo_rough": 24,
    "ph_tempo": 100,
    "ph_pause": 4.0,
    "ph_length": 1.0,
    "ph_variation": 35,
    "su_distance": 20,
    "su_wind": 1.5,
    "su_space": 40
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}
`,jt=`{
 "_note": "Field guide text for this bird, both languages. Facts come from birds.md. A field with verified false is not shown as a fact: empty means not described, and the text says what the sources leave out. Norwegian wording is mine, Eirik to check. calendar rows: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/cyanistes-caeruleus",
 "facts": {
  "length": {
   "en": "About 12 cm, 10 to 13 g",
   "no": "Omtrent 12 cm, 10 til 13 g",
   "verified": true
  },
  "broods": {
   "en": "One, in some years two",
   "no": "Ett, noen år to",
   "verified": true
  },
  "range": {
   "en": "North to Finnmark, sparser there",
   "no": "Nord til Finnmark, sjeldnere der",
   "verified": true
  },
  "habitat": {
   "en": "Lowland deciduous and mixed forest",
   "no": "Løv- og blandingsskog i lavlandet",
   "verified": true
  },
  "food": {
   "en": "Insects and spiders; seeds in winter",
   "no": "Insekter og edderkopper; frø om vinteren",
   "verified": true
  },
  "status": {
   "en": "LC, viable, Norwegian red list",
   "no": "LC, livskraftig, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "Holes and nest boxes, 8 to 12 eggs",
   "no": "Hull og fuglekasser, 8 til 12 egg",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Sings",
   "no": "Synger",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "A trill-like series, “sit-sitt-sirrrrrrr”. Also a chattering series that opens with a couple of whistles.",
  "no": "En trilleaktig rekke, «sit-sitt-sirrrrrrr». Også en skravlende rekke som åpner med et par plystretoner.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "“sit-sitt-sirrrrrrr”, or a couple of whistles and a chatter.",
   "no": "«sit-sitt-sirrrrrrr», eller et par plystretoner og skravling.",
   "verified": true
  },
  "call": {
   "en": "Short sharp “sits”, a rasping “sits it pæ-pæ-pæ”, and “spitt spitt”.",
   "no": "Korte, skarpe «sits», et raspende «sits it pæ-pæ-pæ» og «spitt spitt».",
   "verified": true
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "parts": {
  "si": {
   "en": "SIT NOTES",
   "no": "SIT-TONER",
   "verified": true
  },
  "trill": {
   "en": "TRILL",
   "no": "TRILLE",
   "verified": true
  },
  "whistles": {
   "en": "WHISTLES",
   "no": "PLYSTRING",
   "verified": true
  },
  "chatter": {
   "en": "CHATTER",
   "no": "SKRAVLING",
   "verified": true
  }
 },
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "????????????",
  "note": {
   "en": "Mostly resident. In some years many move south in September and October, mostly young females. The sources do not give its singing months.",
   "no": "For det meste standfugl. Noen år trekker mange sørover i september og oktober, mest unge hunner. Kildene oppgir ikke månedene med sang.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "id": "kjottmeis",
   "text": {
    "en": "Bigger, black head, yellow breast with a black stripe. Sings repeated “tu-ti tu-ti”.",
    "no": "Større, svart hode, gult bryst med svart stripe. Synger gjentatt «tu-ti tu-ti».",
    "verified": true
   }
  }
 ]
}
`,It=`{
 "_note": "Blue tit ink plate in a 280x240 box, drawn in M3 (not from the design). Same composition as the other plates: perched, facing right. Blue parts are drawn in shadow. Callout values are from birds.md (SNL); bill colour is not verified.",
 "box": [280, 240],
 "clips": {
  "body": "M198 72 C196 58 182 52 168 56 C152 60 140 74 132 92 C120 112 114 132 116 150 C120 164 132 174 146 176 C164 178 180 168 188 150 C196 132 199 108 199 92 C200 86 201 82 200 80 Z",
  "wing": "M158 94 C164 120 150 148 120 160 C124 138 134 112 158 94 Z"
 },
 "layers": [
  { "path": "M14 206 C80 202 150 199 268 194", "stroke": 4 },
  { "path": "M214 197 l20 -20 M224 187 l16 3", "stroke": 1.5 },
  { "path": "M234 177 q10 -10 18 -2 q-9 8 -18 2 Z M240 190 q11 -5 16 3 q-10 4 -16 -3 Z", "fill": "face", "stroke": 1 },
  { "path": "M120 150 L78 198 L90 206 L132 166 Z", "fill": "cap", "stroke": 1.5, "part": "tail" },
  { "path": "M124 156 L82 202 M128 162 L86 205", "stroke": 1, "part": "tail" },
  { "path": "M146 176 L147 199 M158 174 L160 198 M139 201 L147 199 L155 201 M152 199 L160 198 L168 200", "stroke": 1.5 },
  { "clip": "body", "fill": "face", "stroke": 1.5 },
  { "hatch": "body" },
  { "clip": "wing", "fill": "cap" },
  { "hatch": "wing" },
  { "clip": "wing", "stroke": 1.5 },
  { "path": "M130 106 L164 124 L162 129 L128 111 Z", "fill": "face", "stroke": 1, "within": "wing" },
  { "path": "M200 68 C196 66 190 64 186 64 C170 64 156 70 144 74 L142 82 C146 96 158 106 172 108 C184 108 194 100 198 92 Z", "fill": "face", "within": "body" },
  { "path": "M200 64 C196 54 182 50 168 54 C156 58 148 66 144 74 C156 70 170 64 186 64 C192 64 197 66 200 68 Z", "fill": "cap", "stroke": 1, "within": "body" },
  { "path": "M199 70 C190 67 180 66 170 68 C160 70 150 75 141 81 L144 88 C154 82 164 79 172 79 C182 78 192 79 199 79 Z", "fill": "ink", "within": "body" },
  { "path": "M142 82 C146 96 158 106 172 108 C182 108 190 104 196 98 L198 102 C190 110 180 114 170 114 C154 112 142 100 138 86 Z", "fill": "ink", "within": "body" },
  { "path": "M196 98 C194 104 190 110 186 114 L190 116 C195 110 198 104 199 98 Z", "fill": "ink", "within": "body" },
  { "path": "M188 118 C184 132 178 146 170 160 L167 160 C174 146 180 132 184 118 Z", "fill": "shadow", "within": "body" },
  { "clip": "body", "stroke": 1.5 },
  { "eye": [182, 72], "pupil": 2.2 },
  { "path": "M182.6 71.4 m-1.2 0 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0", "fill": "face" },
  { "path": "M198 72 L212 77 L200 79 Z", "fill": "bill", "stroke": 1.5, "part": "upper" },
  { "path": "M200 79 L211 79 L200 82 Z", "fill": "bill", "stroke": 1.5, "part": "lower" },
  { "path": "M224 66 A14 14 0 0 1 224 90 M231 58 A24 24 0 0 1 231 98 M238 50 A34 34 0 0 1 238 106", "stroke": 1.5, "part": "arcs" }
 ],
 "hatch": {
  "body": { "rect": [112, 50, 204, 180], "up": true, "clip": "body" },
  "wing": { "rect": [118, 90, 166, 164], "up": false, "clip": "wing" }
 },
 "pivots": {
  "upper": { "at": [200, 76], "deg": -14 },
  "lower": { "at": [200, 80], "deg": 10 },
  "tail": { "at": [126, 158], "deg": -5 }
 },
 "variants": {
  "male": { "body_pitch": 9, "wing_pitch": 5, "eye_ring": 0, "bill": "shadow", "cap": "shadow" },
  "female": { "body_pitch": 11, "wing_pitch": 7, "eye_ring": 0, "bill": "shadow", "cap": "shadow" },
  "juvenile": { "body_pitch": 9, "wing_pitch": 5, "eye_ring": 0, "bill": "shadow", "cap": "shadow" }
 },
 "callouts": [
  { "id": "bill", "leader": "M206 72 L206 23", "at": [206, 10], "align": "centre",
    "male": { "en": "", "no": "", "verified": false },
    "female": { "en": "", "no": "", "verified": false },
    "juvenile": { "en": "", "no": "", "verified": false } },
  { "id": "head", "leader": "M170 58 L122 36", "at": [120, 30], "align": "right",
    "male": { "en": "LIGHT BLUE CROWN", "no": "LYSEBLÅ ISSE", "verified": true },
    "female": { "en": "OFTEN A LITTLE PALER", "no": "OFTE LITT BLEKERE", "verified": true },
    "juvenile": { "en": "LIKE THE ADULTS", "no": "SOM DE VOKSNE", "verified": true } },
  { "id": "eye_stripe", "leader": "M152 80 L74 86", "at": [70, 80], "align": "right",
    "male": { "en": "BLUE-BLACK", "no": "BLÅSVART", "verified": true },
    "female": { "en": "BLUE-BLACK", "no": "BLÅSVART", "verified": true },
    "juvenile": { "en": "BLUE-BLACK", "no": "BLÅSVART", "verified": true } },
  { "id": "breast", "leader": "M186 140 L232 212", "at": [276, 224], "align": "right",
    "male": { "en": "YELLOW, FAINT STRIPE", "no": "GULT, SVAK STRIPE", "verified": true },
    "female": { "en": "YELLOW, FAINT STRIPE", "no": "GULT, SVAK STRIPE", "verified": true },
    "juvenile": { "en": "YELLOW, FAINT STRIPE", "no": "GULT, SVAK STRIPE", "verified": true } }
 ],
 "captions": {
  "male": { "en": "Male, singing. The sexes look alike.", "no": "Hann som synger. Kjønnene er like.", "verified": true },
  "female": { "en": "Female. Like the male, often a little paler.", "no": "Hunn. Som hannen, ofte litt blekere.", "verified": true },
  "juvenile": { "en": "Juvenile. Like the adults.", "no": "Ungfugl. Som de voksne.", "verified": true }
 }
}
`,Bt=`{
  "_note": "Blue tit, M3. Shapes, pitches, timings and bout lengths are sound design guesses, not verified, not tuned against recordings. Verified (birds.md, SNL): song is a trill-like series 'sit-sitt-sirrrrrrr', and also a chattering series that opens with a couple of whistles; calls are short sharp 'sits' single or in series, a slightly rasping 'sits it pæ-pæ-pæ', and a sharp 'spitt spitt'. The trill is a section of short repeated notes, so ph_length sets how long it runs.",

  "syllables": {
    "si1": { "dur_ms": 70, "pitch": [[0, 7600], [1, 7200]], "amp": [[0, 0], [0.2, 1], [0.7, 0.8], [1, 0]], "gain": 0.6 },
    "si2": { "dur_ms": 90, "pitch": [[0, 7000], [0.6, 7300], [1, 7200]], "amp": [[0, 0], [0.2, 0.9], [0.7, 1], [1, 0]], "gain": 0.6 },
    "r1":  { "dur_ms": 28, "pitch": [[0, 6200], [1, 5200]], "amp": [[0, 0], [0.2, 1], [1, 0]], "gain": 0.75 },
    "r2":  { "dur_ms": 32, "pitch": [[0, 5000], [1, 4200]], "amp": [[0, 0], [0.2, 1], [1, 0]], "gain": 0.8 },
    "w1":  { "dur_ms": 140, "pitch": [[0, 4800], [0.4, 5200], [1, 4600]], "amp": [[0, 0], [0.15, 0.9], [0.6, 1], [1, 0]], "gain": 0.7 },
    "ch1": { "dur_ms": 45, "pitch": [[0, 4200], [1, 3400]], "amp": [[0, 0], [0.15, 1], [0.6, 0.7], [1, 0]], "gain": 0.6, "breath": 25, "rough": 35, "tension": -10 },
    "ch2": { "dur_ms": 40, "pitch": [[0, 3600], [1, 4400]], "amp": [[0, 0], [0.2, 1], [0.6, 0.7], [1, 0]], "gain": 0.6, "breath": 25, "rough": 35, "tension": -10 },

    "sits":  { "dur_ms": 40, "pitch": [[0, 7500], [1, 6500]], "amp": [[0, 0], [0.1, 1], [0.5, 0.6], [1, 0]], "gain": 0.6, "breath": 15 },
    "it":    { "dur_ms": 30, "pitch": [[0, 6600], [1, 6200]], "amp": [[0, 0], [0.2, 1], [1, 0]], "gain": 0.5, "breath": 15 },
    "pae":   { "dur_ms": 70, "pitch": [[0, 4000], [1, 3600]], "amp": [[0, 0], [0.1, 1], [0.7, 0.8], [1, 0]], "gain": 0.6, "breath": 30, "rough": 40, "tension": -10 },
    "spitt": { "dur_ms": 35, "pitch": [[0, 7000], [1, 5500]], "amp": [[0, 0], [0.08, 1], [0.4, 0.6], [1, 0]], "gain": 0.65, "breath": 12, "rough": 10 }
  },

  "types": {
    "song": {
      "pause_s": [3.0, 7.0],
      "length_s": [1.0, 2.0],
      "transpose_st": 0.8,
      "avoid_repeat": false,
      "bout": [2, 5],
      "auto": {
        "vo_pitch": [0.98, 1.02],
        "vo_breath": [5, 12],
        "vo_tension": [28, 40],
        "vo_rough": [2, 6],
        "ph_tempo": [94, 106]
      },
      "phrases": [
        { "weight": 3, "sections": [
          { "part": "si", "pool": ["si1", "si2"], "count": [2, 3], "share": 0.25, "gap_ms": [60, 110] },
          { "part": "trill", "pool": ["r1"], "count": [6, 30], "share": 0.75, "gap_ms": [14, 22], "lead_gap_ms": [50, 90], "no_adjacent_repeat": false }
        ] },
        { "weight": 2, "sections": [
          { "part": "si", "pool": ["si1", "si2"], "count": [1, 2], "share": 0.2, "gap_ms": [60, 110] },
          { "part": "trill", "pool": ["r2"], "count": [6, 28], "share": 0.8, "gap_ms": [16, 24], "lead_gap_ms": [50, 90], "no_adjacent_repeat": false }
        ] },
        { "weight": 1, "sections": [
          { "part": "whistles", "pool": ["w1"], "count": [2, 2], "share": 0.3, "gap_ms": [80, 120], "no_adjacent_repeat": false },
          { "part": "chatter", "pool": ["ch1", "ch2"], "count": [4, 14], "share": 0.7, "gap_ms": [25, 45], "lead_gap_ms": [60, 100] }
        ] }
      ],
      "overrides": []
    },

    "call": {
      "pause_s": [1.0, 4.0],
      "length_s": [0.3, 1.5],
      "avoid_repeat": false,
      "auto": {
        "vo_pitch": [0.98, 1.02],
        "vo_breath": [8, 16],
        "vo_tension": [40, 55],
        "vo_rough": [4, 10]
      },
      "phrases": [
        { "weight": 3, "sections": [ { "pool": ["sits"], "count": [1, 5], "share": 1.0, "gap_ms": [120, 300], "no_adjacent_repeat": false } ] },
        { "weight": 2, "sections": [
          { "pool": ["sits"], "count": [1, 1], "share": 0.2, "gap_ms": [0, 0] },
          { "pool": ["it"], "count": [1, 1], "share": 0.1, "gap_ms": [0, 0], "lead_gap_ms": [40, 70] },
          { "pool": ["pae"], "count": [2, 4], "share": 0.7, "gap_ms": [50, 80], "lead_gap_ms": [50, 90], "no_adjacent_repeat": false }
        ] },
        { "weight": 2, "sections": [ { "pool": ["spitt"], "count": [2, 3], "share": 1.0, "gap_ms": [150, 250], "no_adjacent_repeat": false } ] }
      ],
      "overrides": []
    }
  }
}
`,Ot=`{
  "_note": "Sound design starting values for the blue tit, M3 round 1. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 6000,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 8,
    "vo_tension": 34,
    "vo_trill": 0,
    "vo_rough": 4,
    "ph_tempo": 100,
    "ph_pause": 4.5,
    "ph_length": 1.5,
    "ph_variation": 50,
    "su_distance": 15,
    "su_wind": 1.5,
    "su_space": 35
  },
  "ranges": {
    "vo_pitch": [0.5, 2.0],
    "vo_breath": [0, 100],
    "vo_tension": [0, 100],
    "vo_trill": [0, 40],
    "vo_rough": [0, 100],
    "ph_tempo": [50, 200],
    "ph_pause": [0.2, 20],
    "ph_length": [0.2, 8],
    "ph_variation": [0, 100],
    "su_distance": [1, 200],
    "su_wind": [0, 15],
    "su_space": [0, 100]
  }
}
`,Ht=`{
 "_note": "Field guide text for this bird, both languages. Facts come from birds.md. A field with verified false is not shown as a fact: empty means not described, and the text says what the sources leave out. Norwegian wording is mine, Eirik to check. calendar rows: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/fringilla-coelebs",
 "facts": {
  "length": {
   "en": "About 15 cm",
   "no": "Omtrent 15 cm",
   "verified": true
  },
  "broods": {
   "en": "",
   "no": "",
   "verified": false
  },
  "range": {
   "en": "North to Troms, scarce in Finnmark",
   "no": "Nord til Troms, fåtallig i Finnmark",
   "verified": true
  },
  "habitat": {
   "en": "Forests and parks",
   "no": "Skog og parker",
   "verified": true
  },
  "food": {
   "en": "Seeds, fruits, buds; insects in summer",
   "no": "Frø, frukt, knopper; insekter om sommeren",
   "verified": true
  },
  "status": {
   "en": "LC, viable, Norwegian red list",
   "no": "LC, livskraftig, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "Finely built in a fork, 4 to 5 eggs",
   "no": "Fint bygd i en greinkløft, 4 til 5 egg",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Sings, in dialects",
   "no": "Synger, på dialekter",
   "verified": true
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "The male has a strong, characteristic song and sings in dialects. The sources do not describe how the song sounds, so Pipp's version is a stand-in.",
  "no": "Hannen har en kraftig, karakteristisk sang og synger på dialekter. Kildene beskriver ikke hvordan sangen låter, så Pipps versjon er en stedfortreder.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "Strong and characteristic, in dialects.",
   "no": "Kraftig og karakteristisk, på dialekter.",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "parts": {},
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "????????????",
  "note": {
   "en": "Mostly migrants wintering in western Europe, some along the Norwegian coast. The first reach south Norway in early March, males about a week before females. The sources do not give its singing months.",
   "no": "For det meste trekkfugl som overvintrer i Vest-Europa, noen langs norskekysten. De første når Sør-Norge tidlig i mars, hannene omtrent en uke før hunnene. Kildene oppgir ikke månedene med sang.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "text": {
    "en": "White rump. The chaffinch has a green one.",
    "no": "Hvit overgump. Bokfinken har grønn.",
    "verified": true
   },
   "id": "bjorkefink"
  },
  {
   "id": "kjottmeis",
   "text": {
    "en": "Its “ping ping” call is like the chaffinch's.",
    "no": "Lokkelyden «ping ping» ligner bokfinkens.",
    "verified": true
   }
  }
 ]
}
`,Gt=`{
 "_note": "Chaffinch ink plate in a 280x240 box, drawn in M3 (not from the design). Same composition as the other plates: perched, facing right. The male's blue-grey hood is drawn as hatching over shadow, the reddish-brown underside in shadow, the chestnut back as hatching. The wing callout drops nearly black to fit; the wing is drawn dark. Nearly black wings with two white bars on all three. Callout values are from birds.md (SNL); bill colour is not verified. The green rump is not drawn.",
 "box": [280, 240],
 "clips": {
  "body": "M198 72 C196 58 182 52 168 56 C152 60 140 74 132 92 C120 112 114 132 116 150 C120 166 132 176 148 178 C166 180 182 170 190 152 C198 134 200 108 199 92 C200 86 201 82 200 80 Z",
  "wing": "M158 94 C164 120 150 148 120 160 C124 138 134 112 158 94 Z",
  "hood": "M200 64 C194 66 190 66 186 66 C180 68 176 76 172 84 C166 94 156 100 146 104 C148 84 156 64 168 56 C182 50 196 52 200 64 Z"
 },
 "layers": [
  { "path": "M14 206 C80 202 150 199 268 194", "stroke": 4 },
  { "path": "M214 197 l20 -20 M224 187 l16 3", "stroke": 1.5 },
  { "path": "M234 177 q10 -10 18 -2 q-9 8 -18 2 Z M240 190 q11 -5 16 3 q-10 4 -16 -3 Z", "fill": "face", "stroke": 1 },
  { "path": "M120 150 L80 200 L92 208 L132 166 Z", "fill": "face", "stroke": 1.5, "part": "tail" },
  { "path": "M124 156 L84 203 M128 162 L88 206", "stroke": 1, "part": "tail" },
  { "path": "M148 178 L148 199 M162 176 L163 198 M140 201 L148 199 L156 201 M155 199 L163 198 L171 200", "stroke": 1.5 },
  { "clip": "body", "fill": "face", "stroke": 1.5 },
  { "hatch": "body" },
  { "path": "M200 80 C194 84 188 84 182 80 C174 84 168 92 164 104 C160 120 162 138 172 154 C178 162 184 168 188 170 L216 170 L216 78 Z", "fill": "breast", "within": "body" },
  { "path": "M200 64 C194 66 190 66 186 66 C180 68 176 76 172 84 C166 94 156 100 146 104 C148 84 156 64 168 56 C182 50 196 52 200 64 Z", "fill": "cap", "within": "body" },
  { "hatch": "hood" },
  { "path": "M200 64 C194 66 190 66 186 66 C180 68 176 76 172 84 C166 94 156 100 146 104", "stroke": 1, "within": "body" },
  { "hatch": "wing" },
  { "clip": "wing", "stroke": 1.5 },
  { "path": "M134 106 L168 114 L167 120 L132 112 Z", "fill": "face", "stroke": 1, "within": "wing" },
  { "path": "M126 124 L166 132 L164 138 L124 130 Z", "fill": "face", "stroke": 1, "within": "wing" },
  { "clip": "body", "stroke": 1.5 },
  { "eye": [184, 72], "pupil": 2.4 },
  { "path": "M184.6 71.4 m-1.2 0 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0", "fill": "face" },
  { "path": "M197 68 L214 76 L200 78 Z", "fill": "bill", "stroke": 1.5, "part": "upper" },
  { "path": "M200 78 L212 77 L199 83 Z", "fill": "bill", "stroke": 1.5, "part": "lower" },
  { "path": "M226 66 A14 14 0 0 1 226 90 M233 58 A24 24 0 0 1 233 98 M240 50 A34 34 0 0 1 240 106", "stroke": 1.5, "part": "arcs" }
 ],
 "hatch": {
  "body": { "rect": [112, 50, 204, 182], "up": true, "clip": "body" },
  "wing": { "rect": [118, 90, 166, 164], "up": false, "clip": "wing" },
  "hood": { "rect": [140, 48, 204, 108], "up": false, "clip": "hood" }
 },
 "pivots": {
  "upper": { "at": [200, 74], "deg": -14 },
  "lower": { "at": [200, 79], "deg": 10 },
  "tail": { "at": [126, 158], "deg": -6 }
 },
 "variants": {
  "male": { "body_pitch": 6, "wing_pitch": 3, "eye_ring": 0, "bill": "shadow", "breast": "shadow", "cap": "shadow", "hood_pitch": 5 },
  "female": { "body_pitch": 9, "wing_pitch": 3, "eye_ring": 0, "bill": "shadow", "breast": "face", "cap": "face" },
  "juvenile": { "body_pitch": 9, "wing_pitch": 3, "eye_ring": 0, "bill": "shadow", "breast": "face", "cap": "face" }
 },
 "callouts": [
  { "id": "bill", "leader": "M206 74 L206 23", "at": [206, 10], "align": "centre",
    "male": { "en": "", "no": "", "verified": false },
    "female": { "en": "", "no": "", "verified": false },
    "juvenile": { "en": "", "no": "", "verified": false } },
  { "id": "head", "leader": "M172 60 L122 36", "at": [120, 30], "align": "right",
    "male": { "en": "BLUE-GREY HOOD", "no": "BLÅGRÅ HETTE", "verified": true },
    "female": { "en": "GREY-BROWN", "no": "GRÅBRUN", "verified": true },
    "juvenile": { "en": "GREY-BROWN", "no": "GRÅBRUN", "verified": true } },
  { "id": "plumage", "leader": "M146 96 L112 104", "at": [108, 98], "align": "right",
    "male": { "en": "CHESTNUT BACK", "no": "KASTANJEBRUN RYGG", "verified": true },
    "female": { "en": "FAIRLY PLAIN", "no": "NOKSÅ ENSFARGET", "verified": true },
    "juvenile": { "en": "LIKE THE FEMALE", "no": "SOM HUNNEN", "verified": true } },
  { "id": "wing", "leader": "M136 128 L104 144", "at": [100, 140], "align": "right",
    "male": { "en": "2 WHITE BARS", "no": "2 HVITE BÅND", "verified": true },
    "female": { "en": "2 WHITE BARS", "no": "2 HVITE BÅND", "verified": true },
    "juvenile": { "en": "2 WHITE BARS", "no": "2 HVITE BÅND", "verified": true } },
  { "id": "breast", "leader": "M178 136 L232 212", "at": [276, 224], "align": "right",
    "male": { "en": "REDDISH-BROWN", "no": "RØDBRUN", "verified": true },
    "female": { "en": "GREY-BROWN", "no": "GRÅBRUN", "verified": true },
    "juvenile": { "en": "GREY-BROWN", "no": "GRÅBRUN", "verified": true } }
 ],
 "captions": {
  "male": { "en": "Male, singing. Hood browner in autumn and winter.", "no": "Hann som synger. Brunere hette høst og vinter.", "verified": true },
  "female": { "en": "Female. Plainer, same white wing bars.", "no": "Hunn. Mer ensfarget, samme hvite vingebånd.", "verified": true },
  "juvenile": { "en": "Juvenile. Grey-brown, like the female.", "no": "Ungfugl. Gråbrun, som hunnen.", "verified": true }
 }
}
`,Dt=`{
  "_note": "Chaffinch, M3 round 1. Shapes, pitches, timings, song structure, bout lengths and the call are sound design guesses, not verified, not tuned against recordings. Verified (birds.md, SNL): the male has a strong, characteristic song and sings in dialects. birds.md lists what the song sounds like as to verify. Design: each phrase template is one song type: a run of repeated high notes that steps down and speeds up, a run of lower notes, then an end flourish. The same template is repeated for a bout, as a bird sings one song type many times before switching. birds.md has no chaffinch call; the great tit's 'ping ping' is 'like the chaffinch' (SNL), so the call type is a metallic 'pink' series, a placeholder to check.",

  "syllables": {
    "a1": { "dur_ms": 70, "pitch": [[0, 6600], [1, 5600]], "amp": [[0, 0], [0.12, 1], [0.6, 0.8], [1, 0]], "gain": 0.55 },
    "a2": { "dur_ms": 55, "pitch": [[0, 5900], [1, 4900]], "amp": [[0, 0], [0.12, 1], [0.6, 0.8], [1, 0]], "gain": 0.6 },
    "b1": { "dur_ms": 85, "pitch": [[0, 4900], [0.3, 4500], [1, 2900]], "amp": [[0, 0], [0.1, 1], [0.7, 0.7], [1, 0]], "gain": 0.65, "rough": 4 },
    "fA": { "dur_ms": 380, "pitch": [[0, 3600], [0.16, 5200], [0.24, 5000], [0.3, 6600], [0.55, 4400], [1, 2400]], "amp": [[0, 0], [0.03, 0.8], [0.14, 0.9], [0.2, 0], [0.3, 0], [0.34, 1], [0.7, 0.8], [1, 0]], "gain": 0.6, "rough": 6 },

    "c1": { "dur_ms": 60, "pitch": [[0, 7000], [1, 5900]], "amp": [[0, 0], [0.12, 1], [0.6, 0.8], [1, 0]], "gain": 0.5 },
    "c2": { "dur_ms": 70, "pitch": [[0, 4800], [0.25, 5400], [1, 4200]], "amp": [[0, 0], [0.15, 1], [0.6, 0.8], [1, 0]], "gain": 0.6 },
    "d1": { "dur_ms": 110, "pitch": [[0, 3900], [0.4, 3600], [1, 2600]], "amp": [[0, 0], [0.1, 1], [0.7, 0.75], [1, 0]], "gain": 0.65, "rough": 4 },
    "fB": { "dur_ms": 420, "pitch": [[0, 6800], [0.08, 6200], [0.16, 6800], [0.24, 6200], [0.32, 3000], [0.5, 5600], [1, 2800]], "amp": [[0, 0], [0.02, 0.8], [0.08, 0], [0.16, 0], [0.18, 0.8], [0.24, 0], [0.32, 0], [0.37, 1], [0.75, 0.8], [1, 0]], "gain": 0.6, "rough": 6 },

    "e1": { "dur_ms": 50, "pitch": [[0, 6200], [0.3, 6300], [1, 5400]], "amp": [[0, 0], [0.15, 1], [0.6, 0.8], [1, 0]], "gain": 0.5, "trill": { "hz": 50, "depth_st": 1, "am": 0.2 } },
    "e2": { "dur_ms": 65, "pitch": [[0, 5200], [1, 4300]], "amp": [[0, 0], [0.12, 1], [0.6, 0.8], [1, 0]], "gain": 0.6 },
    "g1": { "dur_ms": 120, "pitch": [[0, 5400], [1, 2300]], "amp": [[0, 0], [0.1, 1], [0.6, 0.8], [1, 0]], "gain": 0.65, "rough": 4 },
    "fC": { "dur_ms": 300, "pitch": [[0, 3400], [0.2, 4200], [0.3, 7000], [1, 3400]], "amp": [[0, 0], [0.04, 0.8], [0.22, 0.9], [0.26, 0], [0.3, 0], [0.34, 1], [0.7, 0.75], [1, 0]], "gain": 0.6, "rough": 6 },

    "pink":  { "dur_ms": 45, "pitch": [[0, 5400], [0.2, 6200], [1, 4800]], "amp": [[0, 0], [0.06, 1], [0.3, 0.6], [1, 0]], "gain": 0.65, "tension": 25, "rough": 8 },
    "pink2": { "dur_ms": 42, "pitch": [[0, 5200], [0.2, 6000], [1, 4700]], "amp": [[0, 0], [0.06, 1], [0.3, 0.55], [1, 0]], "gain": 0.6, "tension": 25, "rough": 8 }
  },

  "types": {
    "song": {
      "pause_s": [4.0, 8.0],
      "length_s": [2.0, 2.8],
      "transpose_st": 0.6,
      "avoid_repeat": false,
      "bout": [4, 12],
      "auto": {
        "vo_pitch": [0.98, 1.02],
        "vo_breath": [4, 8],
        "vo_tension": [32, 40],
        "vo_rough": [6, 10],
        "ph_tempo": [96, 104]
      },
      "phrases": [
        { "weight": 3, "sections": [
          { "pool": ["a1"], "count": [3, 6], "share": 0.35, "gap_ms": [45, 60], "no_adjacent_repeat": false },
          { "pool": ["a2"], "count": [2, 5], "share": 0.2, "gap_ms": [28, 38], "lead_gap_ms": [40, 70], "no_adjacent_repeat": false },
          { "pool": ["b1"], "count": [2, 4], "share": 0.25, "gap_ms": [55, 80], "lead_gap_ms": [60, 100], "no_adjacent_repeat": false },
          { "pool": ["fA"], "count": [1, 1], "share": 0.2, "gap_ms": [0, 0], "lead_gap_ms": [40, 80] }
        ] },
        { "weight": 2, "sections": [
          { "pool": ["c1"], "count": [4, 7], "share": 0.35, "gap_ms": [35, 50], "no_adjacent_repeat": false },
          { "pool": ["c2"], "count": [2, 4], "share": 0.2, "gap_ms": [40, 55], "lead_gap_ms": [50, 80], "no_adjacent_repeat": false },
          { "pool": ["d1"], "count": [2, 3], "share": 0.25, "gap_ms": [60, 90], "lead_gap_ms": [60, 100], "no_adjacent_repeat": false },
          { "pool": ["fB"], "count": [1, 1], "share": 0.2, "gap_ms": [0, 0], "lead_gap_ms": [40, 80] }
        ] },
        { "weight": 2, "sections": [
          { "pool": ["e1"], "count": [3, 6], "share": 0.3, "gap_ms": [40, 55], "no_adjacent_repeat": false },
          { "pool": ["e2"], "count": [3, 5], "share": 0.3, "gap_ms": [30, 45], "lead_gap_ms": [40, 70], "no_adjacent_repeat": false },
          { "pool": ["g1"], "count": [1, 3], "share": 0.2, "gap_ms": [60, 90], "lead_gap_ms": [60, 100], "no_adjacent_repeat": false },
          { "pool": ["fC"], "count": [1, 1], "share": 0.2, "gap_ms": [0, 0], "lead_gap_ms": [40, 80] }
        ] }
      ],
      "overrides": []
    },

    "call": {
      "pause_s": [1.0, 3.5],
      "length_s": [0.6, 2.5],
      "avoid_repeat": false,
      "auto": {
        "vo_pitch": [0.98, 1.02],
        "vo_breath": [10, 18],
        "vo_tension": [45, 60],
        "vo_rough": [8, 14]
      },
      "phrases": [
        { "weight": 1, "sections": [ { "pool": ["pink", "pink2"], "count": [2, 6], "share": 1.0, "gap_ms": [350, 700], "no_adjacent_repeat": false } ] }
      ],
      "overrides": []
    }
  }
}
`,Pt=`{
  "_note": "Sound design starting values for the chaffinch, M3 round 1. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 5000,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 6,
    "vo_tension": 36,
    "vo_trill": 0,
    "vo_rough": 8,
    "ph_tempo": 100,
    "ph_pause": 6.0,
    "ph_length": 2.4,
    "ph_variation": 40,
    "su_distance": 15,
    "su_wind": 1.5,
    "su_space": 40
  },
  "ranges": {
    "vo_pitch": [0.5, 2.0],
    "vo_breath": [0, 100],
    "vo_tension": [0, 100],
    "vo_trill": [0, 40],
    "vo_rough": [0, 100],
    "ph_tempo": [50, 200],
    "ph_pause": [0.2, 20],
    "ph_length": [0.2, 8],
    "ph_variation": [0, 100],
    "su_distance": [1, 200],
    "su_wind": [0, 15],
    "su_space": [0, 100]
  }
}
`,zt=`{
 "_note": "Field guide text for the common snipe, both languages. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/gallinago-gallinago",
 "facts": {
  "length": {
   "en": "",
   "no": "",
   "verified": false
  },
  "broods": {
   "en": "Usually 4 eggs, laid in May; the female sits about 20 days",
   "no": "Vanligvis 4 egg, lagt i mai; hunnen ruger i rundt 20 dager",
   "verified": true
  },
  "range": {
   "en": "The whole country, coast to mountains; 50 000 to 75 000 pairs (2015)",
   "no": "Hele landet, fra kysten til fjellet; 50 000 til 75 000 par (2015)",
   "verified": true
  },
  "habitat": {
   "en": "Bogs and other wetlands",
   "no": "Myr og annen våtmark",
   "verified": true
  },
  "food": {
   "en": "Insects, spiders, earthworms and crustaceans, probed from the ground",
   "no": "Insekter, edderkopper, meitemark og krepsdyr, som den sonderer etter i bakken",
   "verified": true
  },
  "status": {
   "en": "LC, least concern, Norwegian red list",
   "no": "LC, livskraftig, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "In a grass tussock near water",
   "no": "I en gresstue nær vann",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "",
   "no": "",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "In spring and early summer it makes a display flight with an unmistakable bleating sound, mostly at dusk and at night. The sound comes from the outer tail feathers vibrating as the bird dives steeply. From the ground a high, sharp “tikk-a, tikk-a, tikk-a”; flushed close, a hoarse, powerful “tsjæt”, then a high zigzag flight. Old names for the bleating include «mekregauk» and «himmelhest».",
  "no": "Om våren og forsommeren har den et fluktspill med en umiskjennelig mekrende lyd, mest i skumringen og om natta. Lyden kommer fra de ytterste stjertfjærene, som vibrerer når fuglen stuper bratt. Fra bakken et høyt, skarpt «tikk-a, tikk-a, tikk-a»; skremt opp på kort hold et hest og kraftig «tsjæt», så en høy sikksakkflukt. Gamle navn på mekringen er blant annet «mekregauk» og «himmelhest».",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "Bleating from the tail feathers in a steep dive, dusk and night; from the ground “tikk-a, tikk-a”.",
   "no": "Mekring fra stjertfjærene i bratt stup, skumring og natt; fra bakken «tikk-a, tikk-a».",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "Flushed close: a hoarse, powerful “tsjæt”.",
   "no": "Skremt opp på kort hold: et hest, kraftig «tsjæt».",
   "verified": true
  }
 },
 "parts": {
  "bleat": {
   "en": "BLEATING",
   "no": "MEKRING",
   "verified": true
  },
  "tikka": {
   "en": "TIKK-A",
   "no": "TIKK-A",
   "verified": true
  }
 },
 "calendar": {
  "present": "???yyyyyyy??",
  "sings": "???yyy??????",
  "note": {
   "en": "Returns April to May, leaves August to October; some winter on the south coast. Bleating in spring and early summer. The sources do not give the months.",
   "no": "Kommer april til mai, drar august til oktober; noen overvintrer på sørlandskysten. Mekring om våren og forsommeren. Kildene oppgir ikke månedene.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "name": {
    "en": "Great snipe",
    "no": "Dobbeltbekkasin"
   },
   "text": {
    "en": "Hard to tell apart by plumage, but very different in sound and behaviour in the breeding season.",
    "no": "Vanskelig å skille på utseendet, men svært ulik i lyd og atferd i hekketiden.",
    "verified": true
   }
  },
  {
   "id": "rugde",
   "text": {
    "en": "The woodcock also has a very long, straight bill.",
    "no": "Rugda har også svært langt, rett nebb.",
    "verified": true
   }
  }
 ]
}
`,Zt=`{
 "_note": "Common snipe ink plate in a 280x240 box, M11 batch 5, built from the woodcock plate: heavily mottled brown and black (dense hatching) with pale lengthwise stripes (face), almost white underparts, very long straight bill, large eye (birds.md, SNL). Head stripes, legs, sexes and juvenile are not described; the head bars of the woodcock are left out.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M190 96 C190 80 178 70 164 72 C150 74 142 86 140 98 C116 102 92 112 76 126 C70 132 74 140 84 146 C108 160 140 166 164 160 C182 154 192 140 192 124 C192 114 190 104 190 96 Z",
  "wing": "M154 106 C130 108 104 116 82 128 C104 138 132 142 158 134 C164 124 162 112 154 106 Z"
 },
 "hatch": {
  "body": {
   "rect": [
    70,
    68,
    194,
    168
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    80,
    104,
    164,
    144
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    188,
    94
   ],
   "deg": -5
  },
  "lower": {
   "at": [
    188,
    98
   ],
   "deg": 4
  },
  "tail": {
   "at": [
    80,
    130
   ],
   "deg": -3
  }
 },
 "layers": [
  {
   "path": "M14 196 C70 186 150 184 268 190",
   "stroke": 2.5
  },
  {
   "path": "M40 190 q10 -12 22 -2 q-12 6 -22 2 Z M210 186 q12 -10 22 0 q-12 6 -22 0 Z M120 192 q8 -8 16 0",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M138 160 L136 186 M154 162 L156 186 M128 187 L136 186 L144 188 M148 187 L156 186 L164 188",
   "stroke": 1.5
  },
  {
   "path": "M80 126 L58 128 L62 138 L84 136 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "variant": "belly",
   "fill": "face",
   "within": "body"
  },
  {
   "variant": "stripes",
   "fill": "face",
   "within": "body"
  },
  {
   "clip": "wing",
   "fill": "face"
  },
  {
   "hatch": "wing"
  },
  {
   "path": "M96 126 l10 -6 M112 130 l10 -6 M128 132 l10 -6 M144 130 l8 -5",
   "stroke": 1.2,
   "within": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    170,
    92
   ],
   "pupil": 3.2
  },
  {
   "path": "M188 92 L250 100 L250 102 L189 98 Z",
   "fill": "bill",
   "stroke": 1.3,
   "part": "upper"
  },
  {
   "path": "M189 98 L250 102 L248 104 L188 102 Z",
   "fill": "bill",
   "stroke": 1.3,
   "part": "lower"
  },
  {
   "path": "M130 62 A16 16 0 0 0 130 90 M123 54 A26 26 0 0 0 123 98",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "variants": {
  "male": {
   "body_pitch": 4,
   "wing_pitch": 4,
   "eye_ring": 3.6,
   "bill": "shadow",
   "belly": "M80 144 C104 158 140 166 164 160 C180 154 190 142 192 128 C160 146 120 150 80 144 Z",
   "stripes": "M100 118 L150 102 L151 105 L101 121 Z M106 124 L158 110 L159 113 L107 127 Z M150 86 L178 78 L179 81 L151 89 Z"
  },
  "female": {
   "body_pitch": 4,
   "wing_pitch": 4,
   "eye_ring": 3.6,
   "bill": "shadow",
   "belly": "M80 144 C104 158 140 166 164 160 C180 154 190 142 192 128 C160 146 120 150 80 144 Z",
   "stripes": "M100 118 L150 102 L151 105 L101 121 Z M106 124 L158 110 L159 113 L107 127 Z M150 86 L178 78 L179 81 L151 89 Z"
  },
  "juvenile": {
   "body_pitch": 4,
   "wing_pitch": 4,
   "eye_ring": 3.6,
   "bill": "shadow",
   "belly": "M80 144 C104 158 140 166 164 160 C180 154 190 142 192 128 C160 146 120 150 80 144 Z",
   "stripes": "M100 118 L150 102 L151 105 L101 121 Z M106 124 L158 110 L159 113 L107 127 Z M150 86 L178 78 L179 81 L151 89 Z"
  }
 },
 "callouts": [
  {
   "id": "bill",
   "leader": "M226 100 L226 44",
   "at": [
    226,
    31
   ],
   "align": "centre",
   "male": {
    "en": "VERY LONG, STRAIGHT",
    "no": "SVÆRT LANGT, RETT",
    "verified": true
   },
   "female": {
    "en": "VERY LONG, STRAIGHT",
    "no": "SVÆRT LANGT, RETT",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M110 140 L96 202",
   "at": [
    92,
    214
   ],
   "align": "centre",
   "male": {
    "en": "MOTTLED, PALE STRIPES",
    "no": "SPRAGLETE, LYSE STRIPER",
    "verified": true
   },
   "female": {
    "en": "MOTTLED, PALE STRIPES",
    "no": "SPRAGLETE, LYSE STRIPER",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "breast",
   "leader": "M176 152 L222 202",
   "at": [
    224,
    214
   ],
   "align": "centre",
   "male": {
    "en": "NEARLY WHITE",
    "no": "NESTEN HVITT",
    "verified": true
   },
   "female": {
    "en": "NEARLY WHITE",
    "no": "NESTEN HVITT",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "On the ground. Beak and tail follow the sound.",
   "no": "På bakken. Nebb og hale følger lyden.",
   "verified": true
  },
  "female": {
   "en": "Female. No difference is described.",
   "no": "Hunn. Ingen forskjell er beskrevet.",
   "verified": false
  },
  "juvenile": {
   "en": "Juvenile. Not described in the sources, so drawn like the adults.",
   "no": "Ungfugl. Ikke beskrevet i kildene, så tegnet som de voksne.",
   "verified": false
  }
 }
}
`,Ft=`{
 "_note": "Common snipe, M11 batch 5. Verified by SNL: the display flight's bleating ('mekring'), made by the outer tail feathers vibrating in a steep dive, mostly at dusk and at night in spring and early summer; from the ground a high, sharp «tikk-a, tikk-a, tikk-a»; when flushed a hoarse, powerful «tsjæt». The bleat is the syrinx with strong amplitude trill and much breath (no new source): about 2 s of pulsing, swelling then fading; its pitch and pulse rate are mine, as are all other shapes.",
 "syllables": {
  "bleat": {
   "dur_ms": 1900,
   "pitch": [
    [
     0,
     440
    ],
    [
     0.5,
     470
    ],
    [
     1,
     430
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     0.35
    ],
    [
     0.7,
     1
    ],
    [
     0.9,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.85,
   "breath": 30,
   "rough": 8,
   "tension": -10,
   "trill": {
    "hz": 11,
    "depth_st": 0.6,
    "am": 1.0
   }
  },
  "bleat2": {
   "dur_ms": 1600,
   "pitch": [
    [
     0,
     460
    ],
    [
     0.5,
     490
    ],
    [
     1,
     450
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     0.35
    ],
    [
     0.7,
     1
    ],
    [
     0.9,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8,
   "breath": 30,
   "rough": 8,
   "tension": -10,
   "trill": {
    "hz": 12,
    "depth_st": 0.6,
    "am": 1.0
   }
  },
  "tikka": {
   "dur_ms": 200,
   "pitch": [
    [
     0,
     3700
    ],
    [
     0.3,
     3600
    ],
    [
     0.45,
     3200
    ],
    [
     1,
     3000
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.05,
     1
    ],
    [
     0.25,
     0.8
    ],
    [
     0.32,
     0
    ],
    [
     0.42,
     0
    ],
    [
     0.5,
     0.9
    ],
    [
     0.8,
     0.6
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "tension": 20
  },
  "tsjaet": {
   "dur_ms": 150,
   "pitch": [
    [
     0,
     2500
    ],
    [
     0.3,
     2900
    ],
    [
     1,
     2200
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75,
   "rough": 60,
   "breath": 20
  }
 },
 "types": {
  "song": {
   "pause_s": [
    3.0,
    8.0
   ],
   "length_s": [
    1.2,
    3.2
   ],
   "transpose_st": 0.4,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     40,
     56
    ],
    "vo_tension": [
     26,
     38
    ],
    "vo_rough": [
     6,
     14
    ],
    "ph_tempo": [
     96,
     104
    ]
   },
   "phrases": [
    {
     "weight": 3,
     "sections": [
      {
       "pool": [
        "bleat",
        "bleat2"
       ],
       "count": [
        1,
        1
       ],
       "share": 1.0,
       "gap_ms": [
        100,
        100
       ],
       "part": "bleat"
      }
     ]
    },
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "tikka"
       ],
       "count": [
        5,
        14
       ],
       "share": 1.0,
       "gap_ms": [
        80,
        140
       ],
       "no_adjacent_repeat": false,
       "part": "tikka"
      }
     ]
    }
   ],
   "overrides": [
    {
     "_note": "Mostly at dusk and at night (SNL).",
     "when": {
      "time": "day"
     },
     "active": false
    },
    {
     "_note": "Spring and early summer (SNL).",
     "when": {
      "season": "autumn"
     },
     "active": false
    },
    {
     "when": {
      "season": "winter"
     },
     "active": false
    }
   ]
  },
  "flight": {
   "pause_s": [
    4.0,
    10.0
   ],
   "length_s": [
    0.2,
    1.2
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     30,
     44
    ],
    "vo_tension": [
     26,
     38
    ],
    "vo_rough": [
     40,
     56
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "tsjaet"
       ],
       "count": [
        1,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        300,
        700
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,Kt=`{
 "_note": "Sound design starting values for the common snipe, M11 batch 5. Not bird facts.",
 "pitch_ref_hz": 1000,
 "base": {
  "vo_pitch": 1.0,
  "vo_breath": 46,
  "vo_tension": 32,
  "vo_trill": 0,
  "vo_rough": 10,
  "ph_tempo": 100,
  "ph_pause": 5.0,
  "ph_length": 2.0,
  "ph_variation": 50,
  "su_distance": 50,
  "su_wind": 1.5,
  "su_space": 45
 },
 "ranges": {
  "vo_pitch": [
   0.5,
   2.0
  ],
  "vo_breath": [
   0,
   100
  ],
  "vo_tension": [
   0,
   100
  ],
  "vo_trill": [
   0,
   40
  ],
  "vo_rough": [
   0,
   100
  ],
  "ph_tempo": [
   50,
   200
  ],
  "ph_pause": [
   0.2,
   20
  ],
  "ph_length": [
   0.2,
   8
  ],
  "ph_variation": [
   0,
   100
  ],
  "su_distance": [
   1,
   200
  ],
  "su_wind": [
   0,
   15
  ],
  "su_space": [
   0,
   100
  ]
 }
}
`,Ut=`{
 "_note": "Field guide text for the common gull, both languages. Facts from birds.md (SNL, checked 2026-11-26). SNL describes no sounds, so every sound text is [TO VERIFY]. Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/larus-canus",
 "facts": {
  "length": {
   "en": "",
   "no": "",
   "verified": false
  },
  "broods": {
   "en": "1 to 3 eggs, usually 3; from early May in the south, into June in the north",
   "no": "1 til 3 egg, oftest 3; fra tidlig mai i sør, til og med juni i nord",
   "verified": true
  },
  "range": {
   "en": "The whole country, most on the coast; 90 000 to 125 000 pairs (2015)",
   "no": "Hele landet, flest langs kysten; 90 000 til 125 000 par (2015)",
   "verified": true
  },
  "habitat": {
   "en": "Coast, fresh water, wetlands and bogs; more and more in towns",
   "no": "Kyst, ferskvann, våtmark og myr; stadig oftere i byer",
   "verified": true
  },
  "food": {
   "en": "Mostly fish from the surface; also shellfish, worms, insects and berries",
   "no": "Mest fisk fra vannflaten; også skjell, mark, insekter og bær",
   "verified": true
  },
  "status": {
   "en": "VU, vulnerable, Norwegian red list",
   "no": "VU, sårbar, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "On the ground on skerries and islands, also in trees and on buildings",
   "no": "På bakken på skjær og øyer, også i trær og på bygninger",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "",
   "no": "",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "SNL describes no sounds of the common gull. Pipp plays a long laughing call series here as a stand-in, higher than the herring gull's. One of Norway's smallest gulls: blue-grey back, black wingtips with white spots, a yellow-green bill without a red spot.",
  "no": "SNL beskriver ingen lyder fra fiskemåken. Pipp spiller en lang, lattermild ropserie her som stedfortreder, lysere enn gråmåkens. En av Norges minste måker: blågrå rygg, svarte vingespisser med hvite flekker, gulgrønt nebb uten rød flekk.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "",
   "no": "",
   "verified": false
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "????????????",
  "note": {
   "en": "Most leave for the North Sea countries in winter, some for Spain and Portugal; a few stay on the west coast. Eggs from early May.",
   "no": "De fleste trekker til landene rundt Nordsjøen om vinteren, noen til Spania og Portugal; noen få blir langs Vestlandskysten. Egg fra tidlig mai.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "name": {
    "en": "Kittiwake",
    "no": "Krykkje"
   },
   "text": {
    "en": "The kittiwake has all-black wingtips and black legs.",
    "no": "Krykkja har helt svarte vingespisser og svarte bein.",
    "verified": true
   }
  },
  {
   "id": "gramake",
   "text": {
    "en": "The larger gulls have a red spot on the lower bill; the common gull has none.",
    "no": "De større måkene har rød flekk på undernebbet; fiskemåken har ingen.",
    "verified": true
   }
  }
 ]
}
`,qt=`{
 "_note": "Common gull ink plate in a 280x240 box, M11 batch 4, built from the herring gull plate: blue-grey back (hatching), black wingtips with white spots, a shorter yellow-green bill without the red spot (birds.md, SNL). The juvenile has densely hatched brown wings and the adult's grey back. Size is not shown.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M198 80 C198 64 186 56 172 58 C160 60 152 70 152 82 C126 88 96 104 66 124 C98 138 126 158 150 162 C174 166 192 152 194 130 C196 112 198 96 198 80 Z",
  "wing": "M166 100 C138 100 104 110 70 124 C46 132 28 138 16 142 C40 146 80 142 112 136 C140 130 160 118 166 100 Z"
 },
 "hatch": {
  "body": {
   "rect": [
    64,
    54,
    200,
    168
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    14,
    98,
    168,
    148
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    198,
    82
   ],
   "deg": -10
  },
  "lower": {
   "at": [
    198,
    88
   ],
   "deg": 8
  },
  "tail": {
   "at": [
    70,
    126
   ],
   "deg": -3
  }
 },
 "layers": [
  {
   "path": "M14 216 C50 198 110 192 170 194 C214 196 246 204 268 216 Z",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "path": "M60 210 l14 -6 M150 202 l18 2 M214 206 l12 4",
   "stroke": 1
  },
  {
   "path": "M140 160 L138 196 M158 162 L160 195 M128 197 L138 196 L148 198 M150 196 L160 195 L170 197",
   "stroke": 1.5
  },
  {
   "path": "M70 120 L40 128 L44 136 L74 130 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "clip": "wing",
   "fill": "face"
  },
  {
   "hatch": "wing"
  },
  {
   "variant": "tips",
   "fill": "ink"
  },
  {
   "variant": "mirrors",
   "fill": "face",
   "path": "M198 85 L213 85 L215 88 L198 89 Z"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    184,
    72
   ],
   "pupil": 2.2
  },
  {
   "path": "M197 77 L216 80 C219 82 218 84 214 85 L198 85 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M198 85 L213 85 L215 88 L198 89 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M234 70 A16 16 0 0 1 234 98 M241 62 A26 26 0 0 1 241 106 M248 54 A36 36 0 0 1 248 114",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "variants": {
  "male": {
   "body_pitch": 0,
   "wing_pitch": 8,
   "eye_ring": 0,
   "bill": "face",
   "tips": "M60 128 C40 134 26 139 16 142 C34 145 54 143 70 138 Z",
   "mirrors": "M26 141 a3 2 0 1 0 6 0 a3 2 0 1 0 -6 0 Z M40 139 a3 2 0 1 0 6 0 a3 2 0 1 0 -6 0 Z"
  },
  "female": {
   "body_pitch": 0,
   "wing_pitch": 8,
   "eye_ring": 0,
   "bill": "face",
   "tips": "M60 128 C40 134 26 139 16 142 C34 145 54 143 70 138 Z",
   "mirrors": "M26 141 a3 2 0 1 0 6 0 a3 2 0 1 0 -6 0 Z M40 139 a3 2 0 1 0 6 0 a3 2 0 1 0 -6 0 Z"
  },
  "juvenile": {
   "body_pitch": 0,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow",
   "tips": "",
   "mirrors": ""
  }
 },
 "callouts": [
  {
   "id": "bill",
   "leader": "M208 80 L208 33",
   "at": [
    208,
    20
   ],
   "align": "centre",
   "male": {
    "en": "YELLOW-GREEN, NO RED SPOT",
    "no": "GULGRØNT, INGEN RØD FLEKK",
    "verified": true
   },
   "female": {
    "en": "YELLOW-GREEN, NO RED SPOT",
    "no": "GULGRØNT, INGEN RØD FLEKK",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M120 112 L86 80",
   "at": [
    82,
    74
   ],
   "align": "right",
   "male": {
    "en": "BLUE-GREY BACK",
    "no": "BLÅGRÅ RYGG",
    "verified": true
   },
   "female": {
    "en": "BLUE-GREY BACK",
    "no": "BLÅGRÅ RYGG",
    "verified": false
   },
   "juvenile": {
    "en": "GREY BACK",
    "no": "GRÅ RYGG",
    "verified": true
   }
  },
  {
   "id": "wing",
   "leader": "M40 140 L80 172",
   "at": [
    84,
    184
   ],
   "align": "centre",
   "male": {
    "en": "BLACK TIPS, WHITE SPOTS",
    "no": "SVARTE SPISSER, HVITE FLEKKER",
    "verified": true
   },
   "female": {
    "en": "BLACK TIPS, WHITE SPOTS",
    "no": "SVARTE SPISSER, HVITE FLEKKER",
    "verified": false
   },
   "juvenile": {
    "en": "BROWN WINGS",
    "no": "BRUNE VINGER",
    "verified": true
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Adult. Beak and tail follow the sound.",
   "no": "Voksen. Nebb og hale følger lyden.",
   "verified": true
  },
  "female": {
   "en": "Female. No difference from the male is known.",
   "no": "Hunn. Ingen kjent forskjell fra hannen.",
   "verified": false
  },
  "juvenile": {
   "en": "First winter. About two years to adult plumage.",
   "no": "Første vinter. Omtrent to år til voksendrakt.",
   "verified": true
  }
 }
}
`,Vt=`{
 "_note": "Common gull, M11 batch 4. Placeholder sounds: SNL describes none (birds.md). The 'song' slot holds a long laughing call series, higher and thinner than the herring gull's since it is one of Norway's smallest gulls (the pitch is my choice), and 'call' mewing 'kjiia' notes and short 'kek' series. All shapes are sound design guesses. Rework once a source is found.",
 "syllables": {
  "kiiiah": {
   "dur_ms": 460,
   "pitch": [
    [
     0,
     1800
    ],
    [
     0.3,
     2350
    ],
    [
     0.7,
     2250
    ],
    [
     1,
     1750
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     0.9
    ],
    [
     0.5,
     1
    ],
    [
     0.85,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8
  },
  "kiiow": {
   "dur_ms": 380,
   "pitch": [
    [
     0,
     1900
    ],
    [
     0.35,
     2400
    ],
    [
     1,
     1800
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8
  },
  "kli": {
   "dur_ms": 115,
   "pitch": [
    [
     0,
     2050
    ],
    [
     0.4,
     2250
    ],
    [
     1,
     1850
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8
  },
  "kli2": {
   "dur_ms": 105,
   "pitch": [
    [
     0,
     1950
    ],
    [
     0.4,
     2150
    ],
    [
     1,
     1750
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75
  },
  "kjiia": {
   "dur_ms": 300,
   "pitch": [
    [
     0,
     1850
    ],
    [
     0.4,
     2500
    ],
    [
     1,
     1700
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75
  },
  "kek": {
   "dur_ms": 85,
   "pitch": [
    [
     0,
     2200
    ],
    [
     1,
     1950
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "rough": 8
  }
 },
 "types": {
  "song": {
   "pause_s": [
    5.0,
    12.0
   ],
   "length_s": [
    2.4,
    3.8
   ],
   "transpose_st": 1.0,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     16,
     26
    ],
    "vo_tension": [
     68,
     84
    ],
    "vo_rough": [
     10,
     20
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "kiiiah",
        "kiiow"
       ],
       "count": [
        1,
        3
       ],
       "share": 0.5,
       "gap_ms": [
        120,
        220
       ]
      },
      {
       "pool": [
        "kli",
        "kli2"
       ],
       "count": [
        6,
        14
       ],
       "share": 0.5,
       "gap_ms": [
        30,
        60
       ]
      }
     ]
    }
   ],
   "overrides": []
  },
  "call": {
   "pause_s": [
    1.5,
    5.0
   ],
   "length_s": [
    0.3,
    1.6
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     16,
     26
    ],
    "vo_tension": [
     68,
     84
    ],
    "vo_rough": [
     10,
     20
    ]
   },
   "phrases": [
    {
     "weight": 2,
     "sections": [
      {
       "pool": [
        "kjiia"
       ],
       "count": [
        1,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        220,
        420
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "kek"
       ],
       "count": [
        3,
        6
       ],
       "share": 1.0,
       "gap_ms": [
        70,
        130
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,Wt=`{
 "_note": "Sound design starting values for the common gull, M11 batch 4. Not bird facts.",
 "pitch_ref_hz": 2100,
 "base": {
  "vo_pitch": 1.0,
  "vo_breath": 20,
  "vo_tension": 76,
  "vo_trill": 0,
  "vo_rough": 15,
  "ph_tempo": 100,
  "ph_pause": 5.0,
  "ph_length": 3.0,
  "ph_variation": 50,
  "su_distance": 30,
  "su_wind": 1.5,
  "su_space": 35
 },
 "ranges": {
  "vo_pitch": [
   0.5,
   2.0
  ],
  "vo_breath": [
   0,
   100
  ],
  "vo_tension": [
   0,
   100
  ],
  "vo_trill": [
   0,
   40
  ],
  "vo_rough": [
   0,
   100
  ],
  "ph_tempo": [
   50,
   200
  ],
  "ph_pause": [
   0.2,
   20
  ],
  "ph_length": [
   0.2,
   8
  ],
  "ph_variation": [
   0,
   100
  ],
  "su_distance": [
   1,
   200
  ],
  "su_wind": [
   0,
   15
  ],
  "su_space": [
   0,
   100
  ]
 }
}
`,Yt=`{
 "_note": "Field guide text for the great spotted woodpecker, both languages. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known; the sings row is drumming.",
 "xeno_canto": "https://xeno-canto.org/species/dendrocopos-major",
 "facts": {
  "length": {
   "en": "About 25 cm, 70 to 90 g",
   "no": "Omtrent 25 cm, 70 til 90 g",
   "verified": true
  },
  "broods": {
   "en": "",
   "no": "",
   "verified": false
  },
  "range": {
   "en": "Common in the south, sparser north; 10 000 to 35 000 pairs",
   "no": "Vanlig i sør, færre i nord; 10 000 til 35 000 par",
   "verified": true
  },
  "habitat": {
   "en": "Deciduous, conifer and mixed forest with old trees",
   "no": "Løv-, bar- og blandingsskog med gamle trær",
   "verified": true
  },
  "food": {
   "en": "Insects in summer; conifer seeds in winter",
   "no": "Insekter om sommeren; bartrefrø om vinteren",
   "verified": true
  },
  "status": {
   "en": "LC, viable, Norwegian red list",
   "no": "LC, livskraftig, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "New hole in aspen most years, 4 to 8 eggs",
   "no": "Nytt hull i osp de fleste år, 4 til 8 egg",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Drums, most",
   "no": "Trommer, mest",
   "verified": true
  },
  "female": {
   "en": "Drums",
   "no": "Trommer",
   "verified": true
  }
 },
 "song_notes": {
  "en": "Drums with the bill on a hard surface: about 10 to 15 strokes a second, the fastest of all woodpeckers. A roll lasts just over half a second and ends abruptly, and carries far. Both sexes drum in spring, the male most; sometimes outside the breeding season too, often on posts and metal sheets. The call is a loud, short, sharp “kikk”, often in series at a calm pace.",
  "no": "Trommer med nebbet mot et hardt underlag: rundt 10 til 15 slag i sekundet, raskest av alle spettene. En virvel varer i litt over et halvt sekund og slutter brått, og lyden rekker langt. Begge kjønn trommer om våren, hannen mest; av og til også utenom hekketida, gjerne på stolper og blikkplater. Lokkelyden er et høyt, kort og skarpt «kikk», ofte i serier i rolig tempo.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "Drumming: 10 to 15 strokes a second, just over half a second.",
   "no": "Tromming: 10 til 15 slag i sekundet, litt over et halvt sekund.",
   "verified": true
  },
  "call": {
   "en": "A loud, short, sharp “kikk”, often in series.",
   "no": "Et høyt, kort og skarpt «kikk», ofte i serier.",
   "verified": true
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "??yyy???????",
  "note": {
   "en": "Mainly resident; in some years long irruptions, away for one or two years. Drums in spring, sometimes outside the breeding season too. The sources do not say which months.",
   "no": "For det meste standfugl; noen år lange streif, borte i ett eller to år. Trommer om våren, av og til også utenom hekketida. Kildene sier ikke hvilke måneder.",
   "verified": true
  }
 },
 "lookalikes": []
}`,$t=`{
 "_note": "Great spotted woodpecker ink plate in a 280x240 box, drawn in M10, not from a design: clinging to a trunk, black back (dense hatching) with a white shoulder patch, white bars on the wing, white front and cheek, red under the tail. Red is drawn as shadow tone, as the plate has no red. Male red nape, female none, juvenile whole crown red (birds.md, SNL).",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M178 52 C164 52 154 66 152 86 C148 116 150 150 160 172 C168 186 186 186 194 170 C202 150 204 118 202 90 C200 68 192 52 178 52 Z",
  "wing": "M158 92 C150 118 150 150 162 176 C170 150 172 118 168 94 Z"
 },
 "hatch": {
  "body": {
   "rect": [
    148,
    50,
    206,
    188
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    148,
    90,
    174,
    180
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    197,
    67
   ],
   "deg": -10
  },
  "lower": {
   "at": [
    197,
    71
   ],
   "deg": 8
  },
  "tail": {
   "at": [
    184,
    176
   ],
   "deg": 4
  }
 },
 "layers": [
  {
   "path": "M206 0 L246 0 L246 240 L206 240 Z",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "path": "M214 20 l4 30 M232 50 l-3 40 M218 110 l3 36 M236 150 l-4 40 M212 192 l3 30 M238 6 l-2 22",
   "stroke": 1
  },
  {
   "path": "M176 174 L198 226 L208 222 L190 170 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M186 186 l10 26 M192 182 l10 28",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M196 122 l10 -4 M196 128 l10 2 M194 152 l12 -2 M194 158 l12 4",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "path": "M196 84 C202 110 202 146 194 168 C188 176 182 176 178 170 C186 146 188 112 186 86 Z",
   "fill": "face",
   "within": "body"
  },
  {
   "path": "M184 62 C192 62 198 68 198 76 C192 80 184 80 180 74 Z",
   "fill": "face",
   "stroke": 1,
   "within": "body"
  },
  {
   "path": "M176 168 C182 176 190 178 196 168 C194 182 184 188 174 182 Z",
   "fill": "shadow",
   "stroke": 1,
   "within": "body"
  },
  {
   "variant": "nape",
   "fill": "shadow",
   "stroke": 1,
   "within": "body"
  },
  {
   "variant": "crown",
   "fill": "shadow",
   "stroke": 1,
   "within": "body"
  },
  {
   "clip": "wing",
   "fill": "face"
  },
  {
   "hatch": "wing"
  },
  {
   "path": "M152 130 h20 v3 h-20 Z M152 142 h20 v3 h-20 Z M154 154 h18 v3 h-18 Z",
   "fill": "face",
   "within": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "path": "M159 96 C166 94 170 104 168 116 C164 124 158 120 157 110 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    188,
    66
   ],
   "pupil": 2.2
  },
  {
   "path": "M196 64 L215 63 L198 69 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M198 69 L214 66 L197 72 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M146 50 A16 16 0 0 0 146 80 M139 42 A26 26 0 0 0 139 88 M132 34 A36 36 0 0 0 132 96",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "variants": {
  "male": {
   "body_pitch": 3,
   "wing_pitch": 3,
   "eye_ring": 0,
   "bill": "shadow",
   "nape": "M160 62 C163 56 170 54 174 56 C172 64 166 68 160 68 Z",
   "crown": ""
  },
  "female": {
   "body_pitch": 3,
   "wing_pitch": 3,
   "eye_ring": 0,
   "bill": "shadow",
   "nape": "",
   "crown": ""
  },
  "juvenile": {
   "body_pitch": 3,
   "wing_pitch": 3,
   "eye_ring": 0,
   "bill": "shadow",
   "nape": "",
   "crown": "M166 54 C176 48 188 52 194 60 C186 62 176 60 166 58 Z"
  }
 },
 "callouts": [
  {
   "id": "head",
   "leader": "M164 60 L118 30",
   "at": [
    116,
    24
   ],
   "align": "right",
   "male": {
    "en": "RED NAPE PATCH",
    "no": "RØD NAKKEFLEKK",
    "verified": true
   },
   "female": {
    "en": "BLACK, NO RED",
    "no": "SVART, UTEN RØDT",
    "verified": true
   },
   "juvenile": {
    "en": "WHOLE CROWN RED",
    "no": "HELE ISSEN RØD",
    "verified": true
   }
  },
  {
   "id": "plumage",
   "leader": "M158 108 L96 116",
   "at": [
    92,
    110
   ],
   "align": "right",
   "male": {
    "en": "BLACK, WHITE, RED",
    "no": "SVART, HVIT, RØD",
    "verified": true
   },
   "female": {
    "en": "BLACK, WHITE, RED",
    "no": "SVART, HVIT, RØD",
    "verified": true
   },
   "juvenile": {
    "en": "BLACK, WHITE, RED",
    "no": "SVART, HVIT, RØD",
    "verified": true
   }
  },
  {
   "id": "bill",
   "leader": "M200 62 L180 26",
   "at": [
    180,
    13
   ],
   "align": "centre",
   "male": {
    "en": "",
    "no": "",
    "verified": false
   },
   "female": {
    "en": "",
    "no": "",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Male drumming. Small red nape patch.",
   "no": "Hann som trommer. Liten rød nakkeflekk.",
   "verified": true
  },
  "female": {
   "en": "Female. Black crown, no red.",
   "no": "Hunn. Svart isse uten rødt.",
   "verified": true
  },
  "juvenile": {
   "en": "Juvenile. Whole crown red.",
   "no": "Ungfugl. Hele issen rød.",
   "verified": true
  }
 }
}`,Jt=`{
 "_note": "Great spotted woodpecker, M10. Its song type is drumming, from the drum source in core (core/Drum.h), not the syrinx. Verified (birds.md, SNL): 10 to 15 strokes a second, a roll just over half a second with an abrupt end, carries far; both sexes drum in spring, the male most; the call is a loud, short, sharp 'kikk', often in series at a calm pace. Sound design choices: four rolls (the resonance stands for different trees), the pauses between rolls, the knock's pitch and ring, the 'kikk' shape and its 0,5 to 0,9 s spacing.",
 "syllables": {
  "roll_a": {
   "dur_ms": 560,
   "pitch": [
    [
     0,
     1150
    ],
    [
     1,
     1100
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.02,
     1
    ],
    [
     0.75,
     0.9
    ],
    [
     0.96,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 1.0,
   "drum": {
    "rate": [
     13,
     14
    ]
   }
  },
  "roll_b": {
   "dur_ms": 620,
   "pitch": [
    [
     0,
     950
    ],
    [
     1,
     900
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.02,
     1
    ],
    [
     0.75,
     0.9
    ],
    [
     0.96,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 1.0,
   "drum": {
    "rate": [
     12,
     13
    ]
   }
  },
  "roll_c": {
   "dur_ms": 540,
   "pitch": [
    [
     0,
     1450
    ],
    [
     1,
     1400
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.02,
     1
    ],
    [
     0.75,
     0.9
    ],
    [
     0.96,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.9,
   "drum": {
    "rate": [
     14,
     15
    ]
   }
  },
  "roll_d": {
   "dur_ms": 600,
   "pitch": [
    [
     0,
     1250
    ],
    [
     1,
     1180
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.02,
     1
    ],
    [
     0.75,
     0.9
    ],
    [
     0.96,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 1.0,
   "drum": {
    "rate": [
     11,
     13
    ]
   }
  },
  "kikk": {
   "dur_ms": 45,
   "pitch": [
    [
     0,
     5600
    ],
    [
     0.3,
     5900
    ],
    [
     1,
     4800
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.4,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8,
   "tension": 20,
   "rough": 10
  }
 },
 "types": {
  "song": {
   "pause_s": [
    4.0,
    12.0
   ],
   "length_s": [
    0.5,
    0.7
   ],
   "transpose_st": 0.5,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "ph_tempo": [
     97,
     103
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "roll_a",
        "roll_b",
        "roll_c",
        "roll_d"
       ],
       "count": [
        1,
        1
       ],
       "share": 1.0,
       "gap_ms": [
        50,
        50
       ]
      }
     ]
    }
   ],
   "overrides": []
  },
  "call": {
   "pause_s": [
    2.0,
    6.0
   ],
   "length_s": [
    1.0,
    6.0
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     6,
     14
    ],
    "vo_tension": [
     55,
     70
    ],
    "vo_rough": [
     8,
     16
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "kikk"
       ],
       "count": [
        2,
        8
       ],
       "share": 1.0,
       "gap_ms": [
        500,
        900
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}`,Xt=`{
  "_note": "Sound design starting values for the great spotted woodpecker, M10. For drum syllables the pitch knob moves the knock's resonance; breath, tension, rough and trill only touch the call. Not bird facts.",
  "pitch_ref_hz": 1200,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 10,
    "vo_tension": 60,
    "vo_trill": 0,
    "vo_rough": 12,
    "ph_tempo": 100,
    "ph_pause": 6.0,
    "ph_length": 1.0,
    "ph_variation": 50,
    "su_distance": 25,
    "su_wind": 1.5,
    "su_space": 35
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}`,Qt=`{
 "_note": "Field guide text for this bird, both languages. Facts come from birds.md (M11, SNL). A field with verified false is not shown as a fact: empty means not described, and the text says what the sources leave out. Norwegian wording is mine, Eirik to check. calendar rows: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/regulus-regulus",
 "facts": {
  "length": {
   "en": "About 9 cm, 4,5 to 7 g, Europe's smallest bird",
   "no": "Omtrent 9 cm, 4,5 til 7 g, Europas minste fugl",
   "verified": true
  },
  "broods": {
   "en": "Usually two",
   "no": "Vanligvis to kull",
   "verified": true
  },
  "range": {
   "en": "Almost all coniferous forest but the far north",
   "no": "Nesten all barskog unntatt lengst nord",
   "verified": true
  },
  "habitat": {
   "en": "Coniferous forest, high in dense branches",
   "no": "Barskog, høyt oppe i tette greiner",
   "verified": true
  },
  "food": {
   "en": "Small insects and spiders, some spruce seeds",
   "no": "Små insekter og edderkopper, litt granfrø",
   "verified": true
  },
  "status": {
   "en": "LC, least concern",
   "no": "LC, livskraftig",
   "verified": true
  },
  "nest": {
   "en": "A hanging ball of moss and lichen under a spruce branch, 8 to 12 eggs",
   "no": "En hengende ball av mose og lav under en grangrein, 8 til 12 egg",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Sings from late winter",
   "no": "Synger fra senvinteren",
   "verified": true
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "A high, repeated motif ending in a short twitter: «sisisi-sisisi-sisisi-sisryi». Many older people cannot hear it. Song duels between neighbouring males in March and April. The call is fine three-syllable notes, «sri- sri- sri».",
  "no": "Et høyt, gjentatt motiv som ender i en kort kvitring: «sisisi-sisisi-sisisi-sisryi». Mange eldre hører den ikke. Sangdueller mellom nabohanner i mars og april. Lokkelyden er fine trestavede toner, «sri- sri- sri».",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "High «sisisi-sisisi-sisisi-sisryi».",
   "no": "Høyt «sisisi-sisisi-sisisi-sisryi».",
   "verified": true
  },
  "call": {
   "en": "Fine «sri- sri- sri».",
   "no": "Fine «sri- sri- sri».",
   "verified": true
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "parts": {
  "motif": {
   "en": "SISISI",
   "no": "SISISI",
   "verified": true
  },
  "end": {
   "en": "SISRYI",
   "no": "SISRYI",
   "verified": true
  }
 },
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "??yy????????",
  "note": {
   "en": "Partial migrant: some leave in autumn, many for Britain, the rest stay; migrants return in April. Males sing from late winter, song duels in March and April. The sources say nothing about the other months.",
   "no": "Delvis trekkfugl: noen drar om høsten, mange til Storbritannia, resten blir; trekkfuglene kommer i april. Hannene synger fra senvinteren, sangdueller i mars og april. Kildene sier ikke noe om de andre månedene.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "name": {
    "en": "Firecrest",
    "no": "Rødtoppfuglekonge"
   },
   "text": {
    "en": "Its close relative in Europe.",
    "no": "Dens nære slektning i Europa.",
    "verified": true
   }
  }
 ]
}
`,ni=`{
 "_note": "Goldcrest ink plate in a 280x240 box, drawn in M11 from the chaffinch plate with the willow warbler's thin bill, not from a design: olive-green back (hatching), pale underside (face), two white wing bars, a narrow crown stripe (shadow tone for yellow) edged in ink. The male's orange is hidden in the stripe and not drawn; the callout names it. The juvenile is not described and is drawn as the adults with [TO VERIFY].",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M198 72 C196 58 182 52 168 56 C152 60 140 74 132 92 C120 112 114 132 116 150 C120 166 132 176 148 178 C166 180 182 170 190 152 C198 134 200 108 199 92 C200 86 201 82 200 80 Z",
  "wing": "M158 94 C164 120 150 148 120 160 C124 138 134 112 158 94 Z"
 },
 "layers": [
  {
   "path": "M14 206 C80 202 150 199 268 194",
   "stroke": 4
  },
  {
   "path": "M214 197 l20 -20 M224 187 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 177 q10 -10 18 -2 q-9 8 -18 2 Z M240 190 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M120 150 L80 200 L92 208 L132 166 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M124 156 L84 203 M128 162 L88 206",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M148 178 L148 199 M162 176 L163 198 M140 201 L148 199 L156 201 M155 199 L163 198 L171 200",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "path": "M200 80 C194 84 188 84 182 80 C174 84 168 92 164 104 C160 120 162 138 172 154 C178 162 184 168 188 170 L216 170 L216 78 Z",
   "fill": "breast",
   "within": "body"
  },
  {
   "path": "M160 68 C167 56 184 51 197 59 L196 65 C185 58 173 61 165 73 Z",
   "fill": "shadow",
   "within": "body"
  },
  {
   "path": "M165 73 C173 61 185 58 196 65 M160 68 C167 56 184 51 197 59",
   "stroke": 2,
   "within": "body"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "path": "M134 106 L168 114 L167 120 L132 112 Z",
   "fill": "face",
   "stroke": 1,
   "within": "wing"
  },
  {
   "path": "M126 124 L166 132 L164 138 L124 130 Z",
   "fill": "face",
   "stroke": 1,
   "within": "wing"
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    184,
    72
   ],
   "pupil": 2.4
  },
  {
   "path": "M184.6 71.4 m-1.2 0 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0",
   "fill": "face"
  },
  {
   "path": "M198 69 L218 75 L200 77 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M200 77 L216 76 L200 80 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M226 66 A14 14 0 0 1 226 90 M233 58 A24 24 0 0 1 233 98 M240 50 A34 34 0 0 1 240 106",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "hatch": {
  "body": {
   "rect": [
    112,
    50,
    204,
    182
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    118,
    90,
    166,
    164
   ],
   "up": false,
   "clip": "wing"
  },
  "hood": {
   "rect": [
    140,
    48,
    204,
    108
   ],
   "up": false,
   "clip": "hood"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    200,
    74
   ],
   "deg": -14
  },
  "lower": {
   "at": [
    200,
    79
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    126,
    158
   ],
   "deg": -6
  }
 },
 "variants": {
  "male": {
   "body_pitch": 9,
   "wing_pitch": 4,
   "eye_ring": 0,
   "bill": "shadow",
   "breast": "face"
  },
  "female": {
   "body_pitch": 9,
   "wing_pitch": 4,
   "eye_ring": 0,
   "bill": "shadow",
   "breast": "face"
  },
  "juvenile": {
   "body_pitch": 9,
   "wing_pitch": 4,
   "eye_ring": 0,
   "bill": "shadow",
   "breast": "face"
  }
 },
 "callouts": [
  {
   "id": "head",
   "leader": "M178 54 L122 36",
   "at": [
    120,
    30
   ],
   "align": "right",
   "male": {
    "en": "YELLOW, ORANGE HIDDEN",
    "no": "GUL, SKJULT ORANSJE",
    "verified": true
   },
   "female": {
    "en": "YELLOW, NO ORANGE",
    "no": "GUL, IKKE ORANSJE",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M146 96 L112 104",
   "at": [
    108,
    98
   ],
   "align": "right",
   "male": {
    "en": "OLIVE-GREEN",
    "no": "OLIVENGRØNN",
    "verified": true
   },
   "female": {
    "en": "OLIVE-GREEN",
    "no": "OLIVENGRØNN",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "wing",
   "leader": "M136 128 L104 144",
   "at": [
    100,
    140
   ],
   "align": "right",
   "male": {
    "en": "TWO WHITE BARS",
    "no": "TO HVITE BÅND",
    "verified": true
   },
   "female": {
    "en": "TWO WHITE BARS",
    "no": "TO HVITE BÅND",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Male. Yellow crown stripe edged black, orange hidden in it.",
   "no": "Hann. Gul issestripe kantet med svart, skjult oransje i den.",
   "verified": true
  },
  "female": {
   "en": "Female. Yellow crown stripe, no orange.",
   "no": "Hunn. Gul issestripe, ikke oransje.",
   "verified": true
  },
  "juvenile": {
   "en": "Juvenile. Not described in the sources.",
   "no": "Ungfugl. Ikke beskrevet i kildene.",
   "verified": false
  }
 }
}
`,ei=`{
 "_note": "Goldcrest, M11 batch 3. Verified (birds.md, SNL): song a high, repeated motif ending in a short twitter, «sisisi-sisisi-sisisi-sisryi.» (parts named); call fine three-syllable notes «sri- sri- sri». Design: 'sisisi' is one syllable of three thin notes at 6,6 to 7,6 kHz, repeated 3 or 4 times; 'sisryi' two short notes and a quick rising, trilled end. 'sri' is a thin 7 kHz note of 70 ms, three in a row. Pitches and timings are guesses.",
 "syllables": {
  "sisisi": {
   "dur_ms": 260,
   "pitch": [
    [
     0,
     7400
    ],
    [
     0.3,
     6900
    ],
    [
     0.36,
     7300
    ],
    [
     0.64,
     6800
    ],
    [
     0.72,
     7200
    ],
    [
     1,
     6700
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.042,
     1
    ],
    [
     0.196,
     0.8
    ],
    [
     0.28,
     0
    ],
    [
     0.36,
     0
    ],
    [
     0.402,
     1
    ],
    [
     0.556,
     0.8
    ],
    [
     0.64,
     0
    ],
    [
     0.72,
     0
    ],
    [
     0.762,
     1
    ],
    [
     0.916,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.45,
   "tension": -10
  },
  "sisisi2": {
   "dur_ms": 280,
   "pitch": [
    [
     0,
     7100
    ],
    [
     0.3,
     7500
    ],
    [
     0.36,
     7000
    ],
    [
     0.64,
     7400
    ],
    [
     0.72,
     6900
    ],
    [
     1,
     7300
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.042,
     1
    ],
    [
     0.196,
     0.8
    ],
    [
     0.28,
     0
    ],
    [
     0.36,
     0
    ],
    [
     0.402,
     1
    ],
    [
     0.556,
     0.8
    ],
    [
     0.64,
     0
    ],
    [
     0.72,
     0
    ],
    [
     0.762,
     1
    ],
    [
     0.916,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.45,
   "tension": -10
  },
  "sis": {
   "dur_ms": 150,
   "pitch": [
    [
     0,
     7300
    ],
    [
     0.45,
     6800
    ],
    [
     0.55,
     7100
    ],
    [
     1,
     6700
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.0675,
     1
    ],
    [
     0.315,
     0.8
    ],
    [
     0.45,
     0
    ],
    [
     0.55,
     0
    ],
    [
     0.6175,
     1
    ],
    [
     0.865,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.42,
   "tension": -10
  },
  "ryi": {
   "dur_ms": 260,
   "pitch": [
    [
     0,
     5600
    ],
    [
     0.6,
     7200
    ],
    [
     1,
     6600
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     0.9
    ],
    [
     0.7,
     1
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.45,
   "trill": {
    "hz": 30,
    "depth_st": 1.0,
    "am": 0.5
   }
  },
  "sri": {
   "dur_ms": 70,
   "pitch": [
    [
     0,
     7200
    ],
    [
     0.4,
     7500
    ],
    [
     1,
     6900
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.4,
   "tension": -12
  }
 },
 "types": {
  "song": {
   "pause_s": [
    3.0,
    8.0
   ],
   "length_s": [
    1.2,
    2.2
   ],
   "transpose_st": 0.5,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     8,
     16
    ],
    "vo_tension": [
     24,
     36
    ],
    "vo_rough": [
     0,
     4
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "sisisi",
        "sisisi2"
       ],
       "count": [
        3,
        4
       ],
       "share": 0.75,
       "gap_ms": [
        40,
        80
       ],
       "part": "motif"
      },
      {
       "pool": [
        "sis"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.1,
       "gap_ms": [
        50,
        50
       ],
       "lead_gap_ms": [
        50,
        90
       ],
       "part": "end"
      },
      {
       "pool": [
        "ryi"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.15,
       "gap_ms": [
        40,
        40
       ],
       "lead_gap_ms": [
        30,
        50
       ],
       "part": "end"
      }
     ]
    }
   ],
   "overrides": []
  },
  "call": {
   "pause_s": [
    1.5,
    6.0
   ],
   "length_s": [
    0.3,
    0.5
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     10,
     18
    ],
    "vo_tension": [
     20,
     30
    ],
    "vo_rough": [
     0,
     4
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "sri"
       ],
       "count": [
        3,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        60,
        90
       ]
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,ti=`{
  "_note": "Sound design starting values for the goldcrest, M11 batch 3. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 7000,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 12,
    "vo_tension": 30,
    "vo_trill": 0,
    "vo_rough": 2,
    "ph_tempo": 100,
    "ph_pause": 4.0,
    "ph_length": 1.8,
    "ph_variation": 35,
    "su_distance": 12,
    "su_wind": 1.5,
    "su_space": 45
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}
`,ii=`{
 "_note": "Field guide text for the wren, both languages. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/troglodytes-troglodytes",
 "facts": {
  "length": {
   "en": "9 to 10 cm, 6 to 12 g",
   "no": "9 til 10 cm, 6 til 12 g",
   "verified": true
  },
  "broods": {
   "en": "Two broods can occur",
   "no": "To kull kan forekomme",
   "verified": true
  },
  "range": {
   "en": "Coast and large valleys in the south, sparser north",
   "no": "Kysten og de store dalene i sør, færre nordover",
   "verified": true
  },
  "habitat": {
   "en": "Forest with fallen trees, scree, coastal scrub",
   "no": "Skog med rotvelter, steinur, kystkratt",
   "verified": true
  },
  "food": {
   "en": "Insects and spiders; berries, seeds in winter",
   "no": "Insekter og edderkopper; bær og frø om vinteren",
   "verified": true
  },
  "status": {
   "en": "LC, viable, Norwegian red list",
   "no": "LC, livskraftig, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "Ball with side entrance, 5 to 8 eggs",
   "no": "Kulerundt med inngang på siden, 5 til 8 egg",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Sings",
   "no": "Synger",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "Remarkably loud for so small a bird: one quick, melodious phrase of trilling sounds. Can sing all year, most in the breeding season. Often on or near the ground, darting in and out of stone walls and bushes.",
  "no": "Bemerkelsesverdig kraftig for en så liten fugl: én rask og melodiøs strofe av trillende lyder. Kan synge hele året, oftest i hekketiden. Ofte på eller nær bakken, smetter inn og ut av steingjerder og busker.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "Loud, quick and melodious, full of trills.",
   "no": "Kraftig, rask og melodiøs, full av triller.",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "A hard “tsjekk” or “tsssrrr”, often repeated.",
   "no": "Et hardt «tsjekk» eller «tsssrrr», som ofte gjentas.",
   "verified": true
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "yyyyyyyyyyyy",
  "note": {
   "en": "Some winter in Norway, mostly on the south coast; many winter in Western Europe. Sings all year, most in the breeding season. Nest building starts late March or early April.",
   "no": "Noen overvintrer i Norge, mest langs kysten i sør; mange overvintrer i Vest-Europa. Synger hele året, oftest i hekketiden. Reirbyggingen starter i slutten av mars eller tidlig i april.",
   "verified": true
  }
 },
 "lookalikes": []
}`,si=`{
 "_note": "Wren ink plate in a 280x240 box, drawn in M10, not from a design: a round ball of feathers, barred brown (hatching), tail cocked straight up, long thin slightly curved bill (birds.md, SNL). The sexes are alike; the juvenile is drawn like the adults and not verified.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M196 108 C196 82 176 66 150 68 C122 70 102 92 102 122 C102 152 124 172 152 172 C180 172 198 150 196 108 Z",
  "wing": "M170 112 C168 136 150 154 122 158 C128 138 146 118 170 112 Z"
 },
 "hatch": {
  "body": {
   "rect": [
    100,
    66,
    200,
    174
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    120,
    110,
    172,
    160
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    196,
    103
   ],
   "deg": -14
  },
  "lower": {
   "at": [
    196,
    107
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    118,
    104
   ],
   "deg": -6
  }
 },
 "layers": [
  {
   "path": "M14 206 C80 202 150 199 268 194",
   "stroke": 4
  },
  {
   "path": "M214 197 l20 -20 M224 187 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 177 q10 -10 18 -2 q-9 8 -18 2 Z M240 190 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M112 106 L94 60 L107 55 L126 100 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M104 82 L113 78 M99 70 L109 66 M108 92 L118 88",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M140 170 L142 199 M156 170 L159 198 M134 201 L142 199 L150 201 M151 199 L159 198 L167 200",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "path": "M184 120 l8 -2 M180 132 l9 -2 M174 144 l9 -3 M164 156 l8 -3",
   "stroke": 1,
   "within": "body"
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    180,
    96
   ],
   "pupil": 2.2
  },
  {
   "path": "M194 99 C204 97 214 99 223 104 L196 105 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M196 105 L222 105 C212 109 204 110 196 110 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M234 92 A14 14 0 0 1 234 116 M241 84 A24 24 0 0 1 241 124 M248 76 A34 34 0 0 1 248 132",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "variants": {
  "male": {
   "body_pitch": 6,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow"
  },
  "female": {
   "body_pitch": 6,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow"
  },
  "juvenile": {
   "body_pitch": 6,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow"
  }
 },
 "callouts": [
  {
   "id": "bill",
   "leader": "M212 102 L212 42",
   "at": [
    212,
    29
   ],
   "align": "centre",
   "male": {
    "en": "LONG, THIN, CURVED",
    "no": "LANGT, TYNT, BUET",
    "verified": true
   },
   "female": {
    "en": "LONG, THIN, CURVED",
    "no": "LANGT, TYNT, BUET",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M128 132 L74 150",
   "at": [
    70,
    144
   ],
   "align": "right",
   "male": {
    "en": "BARRED BROWN",
    "no": "TVERRSTRIPET BRUN",
    "verified": true
   },
   "female": {
    "en": "BARRED BROWN",
    "no": "TVERRSTRIPET BRUN",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Singing, tail cocked. Beak and tail follow the sound.",
   "no": "Synger med stjerten til værs. Nebb og hale følger lyden.",
   "verified": true
  },
  "female": {
   "en": "Female. The sexes are alike.",
   "no": "Hunn. Kjønnene er like.",
   "verified": true
  },
  "juvenile": {
   "en": "Juvenile. Not described in the sources, so drawn like the adults.",
   "no": "Ungfugl. Ikke beskrevet i kildene, så tegnet som de voksne.",
   "verified": false
  }
 }
}`,ai=`{
 "_note": "Wren, M10. Verified (birds.md, SNL): remarkably loud for its size, one quick, melodious phrase of trilling sounds; sings all year, most in the breeding season; alarm a hard 'tsjekk' or 'tsssrrr', often repeated. The build (fast notes alternating with trills, a short end) and every pitch and timing are sound design guesses, not tuned against recordings, so no part names. No call type: SNL names none.",
 "syllables": {
  "n1": {
   "dur_ms": 60,
   "pitch": [
    [
     0,
     6200
    ],
    [
     1,
     5600
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.7,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 1.0
  },
  "n2": {
   "dur_ms": 55,
   "pitch": [
    [
     0,
     5400
    ],
    [
     1,
     6400
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.7,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 1.0
  },
  "n3": {
   "dur_ms": 70,
   "pitch": [
    [
     0,
     7000
    ],
    [
     0.5,
     7300
    ],
    [
     1,
     6500
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.7,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 1.0
  },
  "n4": {
   "dur_ms": 65,
   "pitch": [
    [
     0,
     4800
    ],
    [
     1,
     5600
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.7,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 1.0
  },
  "n5": {
   "dur_ms": 50,
   "pitch": [
    [
     0,
     6800
    ],
    [
     1,
     5900
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.7,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 1.0
  },
  "tr1": {
   "dur_ms": 420,
   "pitch": [
    [
     0,
     5600
    ],
    [
     1,
     5300
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.7,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 1.0,
   "trill": {
    "hz": 30,
    "depth_st": 4,
    "am": 0.75
   }
  },
  "tr2": {
   "dur_ms": 380,
   "pitch": [
    [
     0,
     4400
    ],
    [
     1,
     4200
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.7,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 1.0,
   "trill": {
    "hz": 26,
    "depth_st": 3.5,
    "am": 0.7
   }
  },
  "tr3": {
   "dur_ms": 450,
   "pitch": [
    [
     0,
     6600
    ],
    [
     1,
     6200
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.7,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 1.0,
   "trill": {
    "hz": 34,
    "depth_st": 4.5,
    "am": 0.8
   }
  },
  "tr4": {
   "dur_ms": 320,
   "pitch": [
    [
     0,
     3900
    ],
    [
     1,
     4300
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.7,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 1.0,
   "trill": {
    "hz": 22,
    "depth_st": 3,
    "am": 0.65
   }
  },
  "e1": {
   "dur_ms": 90,
   "pitch": [
    [
     0,
     5000
    ],
    [
     0.4,
     6000
    ],
    [
     1,
     5200
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.7,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 1.0
  },
  "e2": {
   "dur_ms": 110,
   "pitch": [
    [
     0,
     6400
    ],
    [
     1,
     4600
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.7,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 1.0
  },
  "tsjekk": {
   "dur_ms": 70,
   "pitch": [
    [
     0,
     4200
    ],
    [
     0.3,
     3800
    ],
    [
     1,
     3300
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.05,
     1
    ],
    [
     0.4,
     0.6
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.48,
   "rough": 60,
   "breath": 30,
   "tension": 60
  },
  "tsss": {
   "dur_ms": 380,
   "pitch": [
    [
     0,
     6500
    ],
    [
     1,
     6000
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     1
    ],
    [
     0.8,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.38,
   "rough": 55,
   "breath": 45,
   "trill": {
    "hz": 40,
    "depth_st": 2,
    "am": 0.85
   }
  }
 },
 "types": {
  "song": {
   "pause_s": [
    3.0,
    7.0
   ],
   "length_s": [
    2.0,
    3.6
   ],
   "transpose_st": 1.0,
   "avoid_repeat": true,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     5,
     12
    ],
    "vo_tension": [
     42,
     56
    ],
    "vo_rough": [
     3,
     8
    ],
    "ph_tempo": [
     96,
     106
    ]
   },
   "phrases": [
    {
     "weight": 3,
     "sections": [
      {
       "pool": [
        "n1",
        "n2",
        "n3",
        "n4",
        "n5"
       ],
       "count": [
        3,
        6
       ],
       "share": 0.2,
       "gap_ms": [
        20,
        45
       ]
      },
      {
       "pool": [
        "tr1",
        "tr2",
        "tr3",
        "tr4"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.2,
       "gap_ms": [
        30,
        60
       ]
      },
      {
       "pool": [
        "n1",
        "n2",
        "n3",
        "n4",
        "n5"
       ],
       "count": [
        3,
        6
       ],
       "share": 0.2,
       "gap_ms": [
        20,
        45
       ]
      },
      {
       "pool": [
        "tr1",
        "tr2",
        "tr3",
        "tr4"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.2,
       "gap_ms": [
        30,
        60
       ]
      },
      {
       "pool": [
        "e1",
        "e2"
       ],
       "count": [
        1,
        2
       ],
       "share": 0.2,
       "gap_ms": [
        30,
        60
       ],
       "chance": 0.7
      }
     ]
    },
    {
     "weight": 2,
     "sections": [
      {
       "pool": [
        "n1",
        "n2",
        "n3",
        "n4",
        "n5"
       ],
       "count": [
        4,
        8
       ],
       "share": 0.3,
       "gap_ms": [
        20,
        45
       ]
      },
      {
       "pool": [
        "tr1",
        "tr2",
        "tr3",
        "tr4"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.25,
       "gap_ms": [
        30,
        60
       ]
      },
      {
       "pool": [
        "n1",
        "n2",
        "n3",
        "n4",
        "n5"
       ],
       "count": [
        2,
        5
       ],
       "share": 0.2,
       "gap_ms": [
        20,
        45
       ]
      },
      {
       "pool": [
        "tr1",
        "tr2",
        "tr3",
        "tr4"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.25,
       "gap_ms": [
        30,
        60
       ]
      }
     ]
    }
   ],
   "overrides": []
  },
  "alarm": {
   "pause_s": [
    0.8,
    3.0
   ],
   "length_s": [
    0.6,
    3.0
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     25,
     40
    ],
    "vo_tension": [
     55,
     70
    ],
    "vo_rough": [
     45,
     65
    ]
   },
   "phrases": [
    {
     "weight": 3,
     "sections": [
      {
       "pool": [
        "tsjekk"
       ],
       "count": [
        3,
        8
       ],
       "share": 1.0,
       "gap_ms": [
        110,
        220
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "tsss"
       ],
       "count": [
        1,
        2
       ],
       "share": 1.0,
       "gap_ms": [
        200,
        400
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}`,oi=`{
  "_note": "Sound design starting values for the wren, M10. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 5000,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 8,
    "vo_tension": 48,
    "vo_trill": 0,
    "vo_rough": 5,
    "ph_tempo": 100,
    "ph_pause": 4.0,
    "ph_length": 3.0,
    "ph_variation": 50,
    "su_distance": 15,
    "su_wind": 1.5,
    "su_space": 35
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}`,ri=`{
 "_note": "Field guide text for the cuckoo, both languages. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/cuculus-canorus",
 "facts": {
  "length": {
   "en": "32 to 33 cm, about 115 g",
   "no": "32 til 33 cm, omtrent 115 g",
   "verified": true
  },
  "broods": {
   "en": "Brood parasite: 10 to 20 eggs, one per host nest",
   "no": "Reirparasitt: 10 til 20 egg, ett i hvert vertsreir",
   "verified": true
  },
  "range": {
   "en": "The whole country, 5000 to 15 000 pairs",
   "no": "Hele landet, 5000 til 15 000 par",
   "verified": true
  },
  "habitat": {
   "en": "All forest, out to the coast and up to the birch belt",
   "no": "All slags skog, ut til kysten og opp i bjørkebeltet",
   "verified": true
  },
  "food": {
   "en": "Insects, most of all caterpillars; birds' eggs",
   "no": "Insekter, mest sommerfugllarver; fugleegg",
   "verified": true
  },
  "status": {
   "en": "NT, near threatened, Norwegian red list",
   "no": "NT, nær truet, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "None; meadow pipit the commonest host",
   "no": "Ingen; heipiplerke er vanligste vert",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Sings «ko-ko»",
   "no": "Synger «ko-ko»",
   "verified": true
  },
  "female": {
   "en": "No; trills or bubbles",
   "no": "Nei; triller eller bobler",
   "verified": true
  }
 },
 "song_notes": {
  "en": "The male's well-known “ko-ko”: two notes falling a third, the first higher than the second. It carries far. The male also has some hoarse, chattering sounds; the female has only a trilling or bubbling sound, often after laying. Silent in Africa in winter.",
  "no": "Hannens kjente «ko-ko»: to toner i en fallende ters, der det første «ko» er lysere enn det andre. Den høres langt. Hannen har også noen hese, skvatrende lyder; hunnen har bare en trillende eller boblende lyd, ofte etter egglegging. Stum i Afrika om vinteren.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "The male's “ko-ko”, falling a third.",
   "no": "Hannens «ko-ko», en fallende ters.",
   "verified": true
  },
  "call": {
   "en": "Male: hoarse, chattering sounds. Female: a trilling or bubbling sound.",
   "no": "Hann: hese, skvatrende lyder. Hunn: en trillende eller boblende lyd.",
   "verified": true
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "calendar": {
  "present": "nnnnyyyyynnn",
  "sings": "nnnn?????nnn",
  "note": {
   "en": "Back over the whole country during May. Adults leave in late July or early August, young from mid-August to mid-September. Winters in tropical and southern Africa. The sources do not give its singing months.",
   "no": "Tilbake over hele landet i løpet av mai. De voksne drar i slutten av juli eller tidlig i august, ungene fra midten av august til midten av september. Overvintrer i tropisk og sørlig Afrika. Kildene oppgir ikke sangmånedene.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "name": {
    "en": "Sparrowhawk",
    "no": "Spurvehauk"
   },
   "text": {
    "en": "In size, build and flight easily taken for a sparrowhawk or the smallest falcons.",
    "no": "I størrelse, bygning og flukt lett å forveksle med spurvehauk eller de minste falkene.",
    "verified": true
   }
  }
 ]
}`,li=`{
 "_note": "Cuckoo ink plate in a 280x240 box, drawn in M10, not from a design: long tail, long pointed wing, slate-grey (hatching) with paler barred underparts (birds.md, SNL). The female is drawn as the grey type, the commonest in Norway; the juvenile is drawn like the adults and not verified.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M206 86 C204 70 188 62 174 66 C150 72 126 96 106 128 C102 138 108 146 120 148 C150 152 182 140 196 118 C204 106 208 96 206 86 Z",
  "wing": "M180 92 C174 118 146 142 92 162 C112 134 140 108 180 92 Z"
 },
 "hatch": {
  "body": {
   "rect": [
    100,
    60,
    210,
    152
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    90,
    90,
    182,
    164
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    204,
    84
   ],
   "deg": -14
  },
  "lower": {
   "at": [
    204,
    90
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    116,
    140
   ],
   "deg": -4
  }
 },
 "layers": [
  {
   "path": "M14 206 C80 202 150 199 268 194",
   "stroke": 4
  },
  {
   "path": "M214 197 l20 -20 M224 187 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 177 q10 -10 18 -2 q-9 8 -18 2 Z M240 190 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M112 134 L28 190 L38 202 L124 148 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M92 150 l7 8 M76 160 l7 9 M60 171 l7 8 M44 181 l7 9",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M150 150 L152 199 M164 148 L168 198 M144 201 L152 199 L160 201 M159 199 L168 198 L176 200",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "variant": "under",
   "fill": "face",
   "within": "body"
  },
  {
   "path": "M196 106 l-8 4 M190 118 l-9 4 M180 128 l-10 4 M168 136 l-10 4 M154 142 l-10 3 M140 146 l-10 2",
   "stroke": 1.2,
   "within": "body"
  },
  {
   "clip": "wing",
   "fill": "face"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    194,
    78
   ],
   "pupil": 2.4
  },
  {
   "path": "M205 79 L223 85 L206 88 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M206 88 L221 87 L205 92 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M232 74 A14 14 0 0 1 232 98 M239 66 A24 24 0 0 1 239 106 M246 58 A34 34 0 0 1 246 114",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "variants": {
  "male": {
   "body_pitch": 7,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow",
   "under": "M207 94 C202 116 186 136 160 146 C144 151 126 151 112 148 C136 144 160 132 178 116 C192 104 200 96 207 94 Z"
  },
  "female": {
   "body_pitch": 7,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow",
   "under": "M207 94 C202 116 186 136 160 146 C144 151 126 151 112 148 C136 144 160 132 178 116 C192 104 200 96 207 94 Z"
  },
  "juvenile": {
   "body_pitch": 7,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow",
   "under": "M207 94 C202 116 186 136 160 146 C144 151 126 151 112 148 C136 144 160 132 178 116 C192 104 200 96 207 94 Z"
  }
 },
 "callouts": [
  {
   "id": "bill",
   "leader": "M212 82 L212 23",
   "at": [
    212,
    10
   ],
   "align": "centre",
   "male": {
    "en": "",
    "no": "",
    "verified": false
   },
   "female": {
    "en": "",
    "no": "",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M150 90 L84 60",
   "at": [
    80,
    54
   ],
   "align": "right",
   "male": {
    "en": "SLATE-GREY",
    "no": "SKIFERGRÅ",
    "verified": true
   },
   "female": {
    "en": "GREY, OR RUFOUS",
    "no": "GRÅ, ELLER RØDBRUN",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "breast",
   "leader": "M176 128 L232 150",
   "at": [
    276,
    158
   ],
   "align": "right",
   "male": {
    "en": "PALER, BARRED",
    "no": "LYSERE, TVERRSTRIPET",
    "verified": true
   },
   "female": {
    "en": "",
    "no": "",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Male calling «ko-ko». Beak and tail follow the sound.",
   "no": "Hann som roper «ko-ko». Nebb og hale følger lyden.",
   "verified": true
  },
  "female": {
   "en": "Female, grey type. Some are rufous-brown above with black bars.",
   "no": "Hunn, grå type. Noen er rødbrune på oversiden med svarte tverrstriper.",
   "verified": true
  },
  "juvenile": {
   "en": "Juvenile. Not described in the sources, so drawn like the adults.",
   "no": "Ungfugl. Ikke beskrevet i kildene, så tegnet som de voksne.",
   "verified": false
  }
 }
}`,hi=`{
 "_note": "Cuckoo, M10. Verified (birds.md, SNL): the male's «ko-ko» is two notes in a falling third, the first higher, and carries far; the male also has some hoarse, chattering sounds; the female has only a trilling or bubbling sound. Sound design choices: a falling major third (4 semitones) at 745 and 591 Hz, «ko-ko» repeated 4 to 10 times in a series with long pauses between series, the shapes of the chatter and the bubbling. The female does not sing «ko-ko» (song inactive for sex female). The call type holds the male chatter and the female bubbling, each marked with its sex, so each sex makes only its own sound.",
 "syllables": {
  "koko": {
   "dur_ms": 560,
   "pitch": [
    [
     0,
     730
    ],
    [
     0.28,
     745
    ],
    [
     0.34,
     745
    ],
    [
     0.46,
     591
    ],
    [
     0.55,
     591
    ],
    [
     1,
     574
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.05,
     1
    ],
    [
     0.24,
     0.9
    ],
    [
     0.32,
     0
    ],
    [
     0.46,
     0
    ],
    [
     0.53,
     1
    ],
    [
     0.85,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.9
  },
  "skvatr": {
   "dur_ms": 140,
   "pitch": [
    [
     0,
     900
    ],
    [
     0.5,
     1100
    ],
    [
     1,
     800
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     1
    ],
    [
     0.6,
     0.6
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "rough": 70,
   "breath": 40,
   "tension": 35
  },
  "bobl": {
   "dur_ms": 1500,
   "pitch": [
    [
     0,
     2100
    ],
    [
     0.3,
     2300
    ],
    [
     1,
     1700
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.06,
     1
    ],
    [
     0.8,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75,
   "breath": 20,
   "tension": 30,
   "trill": {
    "hz": 13,
    "depth_st": 3,
    "am": 0.9
   }
  }
 },
 "types": {
  "song": {
   "pause_s": [
    4.0,
    10.0
   ],
   "length_s": [
    2.5,
    6.5
   ],
   "transpose_st": 0.5,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.99,
     1.01
    ],
    "vo_breath": [
     24,
     36
    ],
    "vo_tension": [
     10,
     18
    ],
    "vo_rough": [
     2,
     6
    ],
    "ph_tempo": [
     96,
     104
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "koko"
       ],
       "count": [
        4,
        10
       ],
       "share": 1.0,
       "gap_ms": [
        280,
        420
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": [
    {
     "_note": "The female has only a trilling or bubbling sound (SNL).",
     "when": {
      "sex": "female"
     },
     "active": false
    }
   ]
  },
  "call": {
   "pause_s": [
    3.0,
    8.0
   ],
   "length_s": [
    0.6,
    2.0
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     20,
     40
    ],
    "vo_tension": [
     25,
     40
    ],
    "vo_rough": [
     4,
     12
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sex": "male",
     "sections": [
      {
       "pool": [
        "skvatr"
       ],
       "count": [
        3,
        7
       ],
       "share": 1.0,
       "gap_ms": [
        40,
        90
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 1,
     "sex": "female",
     "sections": [
      {
       "pool": [
        "bobl"
       ],
       "count": [
        1,
        1
       ],
       "share": 1.0,
       "gap_ms": [
        50,
        50
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}`,di=`{
  "_note": "Sound design starting values for the cuckoo, M10. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 650,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 30,
    "vo_tension": 14,
    "vo_trill": 0,
    "vo_rough": 4,
    "ph_tempo": 100,
    "ph_pause": 6.0,
    "ph_length": 4.0,
    "ph_variation": 50,
    "su_distance": 40,
    "su_wind": 1.5,
    "su_space": 35
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}`,pi=`{
 "_note": "Field guide text for the herring gull, both languages. Facts from birds.md (SNL, checked 2026-11-26). No source describes its calls, so every sound text is [TO VERIFY]. Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/larus-argentatus",
 "facts": {
  "length": {
   "en": "",
   "no": "",
   "verified": false
  },
  "broods": {
   "en": "1 to 3 eggs, from about 20 April",
   "no": "1 til 3 egg, fra rundt 20. april",
   "verified": true
  },
  "range": {
   "en": "The whole coast, locally inland; 72 000 pairs (2015)",
   "no": "Hele kysten, stedvis i innlandet; 72 000 par (2015)",
   "verified": true
  },
  "habitat": {
   "en": "Islands at sea, fresh water, roofs in towns",
   "no": "Øyer i saltvann, ferskvann, tak i byer",
   "verified": true
  },
  "food": {
   "en": "Mostly fish; a generalist, also waste",
   "no": "Mest fisk; altetende, også avfall",
   "verified": true
  },
  "status": {
   "en": "VU, vulnerable, Norwegian red list",
   "no": "VU, sårbar, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "Herbs, grass and moss, often in colonies",
   "no": "Urter, gress og mose, ofte i kolonier",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "",
   "no": "",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "No source describes the herring gull's calls. Pipp plays a long laughing call series here as a stand-in. A silver-grey back, black wingtips and a yellow bill with a red spot; the young take three to five years to look like adults.",
  "no": "Ingen kilde beskriver gråmåkens lyder. Pipp spiller en lang, lattermild ropserie her som stedfortreder. Sølvgrå rygg, svarte vingespisser og gult nebb med rød flekk; ungene bruker tre til fem år på å bli som de voksne.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "",
   "no": "",
   "verified": false
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "????????????",
  "note": {
   "en": "Partial migrant: northern birds winter around the North Sea, southern birds at the Skagerrak and the North Sea. Eggs from about 20 April through May.",
   "no": "Delvis trekkfugl: fugler fra nord overvintrer rundt Nordsjøen, fugler fra sør ved Skagerrak og Nordsjøen. Egg fra rundt 20. april og gjennom mai.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "id": "sildemake",
   "text": {
    "en": "Young herring gulls are sturdier, with shorter wings and a heavier bill.",
    "no": "Unge gråmåker er kraftigere, med kortere vinger og kraftigere nebb.",
    "verified": true
   }
  },
  {
   "id": "fiskemake",
   "text": {
    "en": "The common gull is smaller, with a yellow-green bill without the red spot.",
    "no": "Fiskemåken er mindre, med gulgrønt nebb uten rød flekk.",
    "verified": true
   }
  }
 ]
}
`,ci=`{
 "_note": "Herring gull ink plate in a 280x240 box, drawn in M10, not from a design: standing on a rock, white body, silver-grey back (hatching), black wingtips, yellow bill with a red spot (shadow), yellow eye-ring (birds.md, SNL). The juvenile is drawn brown all over (dense hatching, no black tips) since SNL calls the young very variable.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M198 80 C198 64 186 56 172 58 C160 60 152 70 152 82 C126 88 96 104 66 124 C98 138 126 158 150 162 C174 166 192 152 194 130 C196 112 198 96 198 80 Z",
  "wing": "M166 100 C138 100 104 110 70 124 C46 132 28 138 16 142 C40 146 80 142 112 136 C140 130 160 118 166 100 Z"
 },
 "hatch": {
  "body": {
   "rect": [
    64,
    54,
    200,
    168
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    14,
    98,
    168,
    148
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    198,
    82
   ],
   "deg": -10
  },
  "lower": {
   "at": [
    198,
    88
   ],
   "deg": 8
  },
  "tail": {
   "at": [
    70,
    126
   ],
   "deg": -3
  }
 },
 "layers": [
  {
   "path": "M14 216 C50 198 110 192 170 194 C214 196 246 204 268 216 Z",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "path": "M60 210 l14 -6 M150 202 l18 2 M214 206 l12 4",
   "stroke": 1
  },
  {
   "path": "M140 160 L138 196 M158 162 L160 195 M128 197 L138 196 L148 198 M150 196 L160 195 L170 197",
   "stroke": 1.5
  },
  {
   "path": "M70 120 L40 128 L44 136 L74 130 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "clip": "wing",
   "fill": "face"
  },
  {
   "hatch": "wing"
  },
  {
   "variant": "tips",
   "fill": "ink"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    184,
    72
   ],
   "pupil": 2.2
  },
  {
   "path": "M197 76 L222 79 C226 81 225 84 220 85 L198 86 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M198 86 L219 85 L222 90 L198 91 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "variant": "spot",
   "fill": "shadow",
   "part": "lower"
  },
  {
   "path": "M234 70 A16 16 0 0 1 234 98 M241 62 A26 26 0 0 1 241 106 M248 54 A36 36 0 0 1 248 114",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "variants": {
  "male": {
   "body_pitch": 0,
   "wing_pitch": 9,
   "eye_ring": 3.5,
   "bill": "face",
   "tips": "M60 128 C40 134 26 139 16 142 C34 145 54 143 70 138 Z",
   "spot": "M212 86 L218 86 L219 90 L212 90 Z"
  },
  "female": {
   "body_pitch": 0,
   "wing_pitch": 9,
   "eye_ring": 3.5,
   "bill": "face",
   "tips": "M60 128 C40 134 26 139 16 142 C34 145 54 143 70 138 Z",
   "spot": "M212 86 L218 86 L219 90 L212 90 Z"
  },
  "juvenile": {
   "body_pitch": 6,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow",
   "tips": "",
   "spot": ""
  }
 },
 "callouts": [
  {
   "id": "bill",
   "leader": "M214 80 L214 33",
   "at": [
    214,
    20
   ],
   "align": "centre",
   "male": {
    "en": "YELLOW, RED SPOT",
    "no": "GULT, RØD FLEKK",
    "verified": true
   },
   "female": {
    "en": "YELLOW, RED SPOT",
    "no": "GULT, RØD FLEKK",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "eye_ring",
   "leader": "M182 68 L142 36",
   "at": [
    140,
    30
   ],
   "align": "right",
   "male": {
    "en": "YELLOW",
    "no": "GUL",
    "verified": true
   },
   "female": {
    "en": "YELLOW",
    "no": "GUL",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M120 112 L86 80",
   "at": [
    82,
    74
   ],
   "align": "right",
   "male": {
    "en": "SILVER-GREY BACK",
    "no": "SØLVGRÅ RYGG",
    "verified": true
   },
   "female": {
    "en": "SILVER-GREY BACK",
    "no": "SØLVGRÅ RYGG",
    "verified": false
   },
   "juvenile": {
    "en": "VERY VARIABLE",
    "no": "SVÆRT VARIABEL",
    "verified": true
   }
  },
  {
   "id": "wing",
   "leader": "M40 138 L40 172",
   "at": [
    40,
    184
   ],
   "align": "centre",
   "male": {
    "en": "BLACK TIPS",
    "no": "SVARTE SPISSER",
    "verified": true
   },
   "female": {
    "en": "BLACK TIPS",
    "no": "SVARTE SPISSER",
    "verified": false
   },
   "juvenile": {
    "en": "PALE INNER WINDOW",
    "no": "LYST VINDU INNERST",
    "verified": true
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Adult. Beak and tail follow the sound.",
   "no": "Voksen. Nebb og hale følger lyden.",
   "verified": true
  },
  "female": {
   "en": "Female. No difference from the male is known.",
   "no": "Hunn. Ingen kjent forskjell fra hannen.",
   "verified": false
  },
  "juvenile": {
   "en": "Young bird. Three to five years to adult plumage.",
   "no": "Ungfugl. Tre til fem år til voksendrakt.",
   "verified": true
  }
 }
}`,gi=`{
 "_note": "Herring gull, M10. Placeholder sounds: no source found describes the herring gull's calls (birds.md). The 'song' slot holds a long laughing call series (two drawn-out notes, then quick laughing notes), and 'call' short mewing 'kjau' and 'kek' notes, all sound design guesses. Remove or rework once a source is found.",
 "syllables": {
  "kyaaw": {
   "dur_ms": 420,
   "pitch": [
    [
     0,
     1300
    ],
    [
     0.3,
     1750
    ],
    [
     0.7,
     1650
    ],
    [
     1,
     1250
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     0.9
    ],
    [
     0.5,
     1
    ],
    [
     0.85,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.85
  },
  "kyow": {
   "dur_ms": 360,
   "pitch": [
    [
     0,
     1400
    ],
    [
     0.35,
     1800
    ],
    [
     1,
     1300
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     1
    ],
    [
     0.7,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.85
  },
  "ha": {
   "dur_ms": 120,
   "pitch": [
    [
     0,
     1500
    ],
    [
     0.4,
     1650
    ],
    [
     1,
     1350
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.85
  },
  "ha2": {
   "dur_ms": 110,
   "pitch": [
    [
     0,
     1400
    ],
    [
     0.4,
     1550
    ],
    [
     1,
     1250
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8
  },
  "kjau": {
   "dur_ms": 260,
   "pitch": [
    [
     0,
     1350
    ],
    [
     0.4,
     1850
    ],
    [
     1,
     1200
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8
  },
  "kek": {
   "dur_ms": 90,
   "pitch": [
    [
     0,
     1600
    ],
    [
     1,
     1400
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75,
   "rough": 10
  }
 },
 "types": {
  "song": {
   "pause_s": [
    5.0,
    12.0
   ],
   "length_s": [
    2.4,
    3.6
   ],
   "transpose_st": 1.0,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     14,
     24
    ],
    "vo_tension": [
     64,
     80
    ],
    "vo_rough": [
     16,
     28
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "kyaaw",
        "kyow"
       ],
       "count": [
        1,
        2
       ],
       "share": 0.5,
       "gap_ms": [
        120,
        220
       ]
      },
      {
       "pool": [
        "ha",
        "ha2"
       ],
       "count": [
        6,
        12
       ],
       "share": 0.5,
       "gap_ms": [
        30,
        60
       ]
      }
     ]
    }
   ],
   "overrides": []
  },
  "call": {
   "pause_s": [
    1.5,
    5.0
   ],
   "length_s": [
    0.3,
    1.6
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     14,
     24
    ],
    "vo_tension": [
     64,
     80
    ],
    "vo_rough": [
     16,
     28
    ]
   },
   "phrases": [
    {
     "weight": 2,
     "sections": [
      {
       "pool": [
        "kjau"
       ],
       "count": [
        1,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        200,
        400
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "kek"
       ],
       "count": [
        3,
        6
       ],
       "share": 1.0,
       "gap_ms": [
        70,
        130
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}`,ui=`{
  "_note": "Sound design starting values for the herring gull, M10. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 1500,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 18,
    "vo_tension": 72,
    "vo_trill": 0,
    "vo_rough": 22,
    "ph_tempo": 100,
    "ph_pause": 5.0,
    "ph_length": 3.0,
    "ph_variation": 50,
    "su_distance": 30,
    "su_wind": 1.5,
    "su_space": 35
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}`,fi=`{
 "_note": "Field guide text for this bird, both languages. Facts come from birds.md (M11, SNL). A field with verified false is not shown as a fact: empty means not described, and the text says what the sources leave out. Norwegian wording is mine, Eirik to check. calendar rows: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/poecile-montanus",
 "facts": {
  "length": {
   "en": "About 12 cm, 11 to 14 g",
   "no": "Omtrent 12 cm, 11 til 14 g",
   "verified": true
  },
  "broods": {
   "en": "",
   "no": "",
   "verified": false
  },
  "range": {
   "en": "The whole country, mountains too",
   "no": "Hele landet, også fjellet",
   "verified": true
  },
  "habitat": {
   "en": "Conifer and mixed forest, mountain birch",
   "no": "Bar- og blandingsskog, fjellbjørkeskog",
   "verified": true
  },
  "food": {
   "en": "Insects and spiders, seeds in winter; hoards",
   "no": "Insekter og edderkopper, frø om vinteren; hamstrer",
   "verified": true
  },
  "status": {
   "en": "VU, vulnerable, Norwegian red list",
   "no": "VU, sårbar, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "A hole it digs in a rotten stump, 7 to 9 eggs",
   "no": "Et hull den hakker i en råtten stubbe, 7 til 9 egg",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Sings",
   "no": "Synger",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "A plaintive «tiuuu tiuuu tiuuu», more rarely a slightly buzzing «zi-zi-zerrrl»; mostly in the breeding season, also in late summer and now and then in winter. Call «titi-tæææ-tæææ»; alarm an agitated «spitt! spitt!» and a quick «sisisi».",
  "no": "Et klagende «tiuuu tiuuu tiuuu», sjeldnere et litt summende «zi-zi-zerrrl»; mest i hekketiden, også på sensommeren og av og til om vinteren. Lokker «titi-tæææ-tæææ»; varsler med opphisset «spitt! spitt!» og raskt «sisisi».",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "Plaintive «tiuuu tiuuu tiuuu», rarely «zi-zi-zerrrl».",
   "no": "Klagende «tiuuu tiuuu tiuuu», sjeldnere «zi-zi-zerrrl».",
   "verified": true
  },
  "call": {
   "en": "«titi-tæææ-tæææ».",
   "no": "«titi-tæææ-tæææ».",
   "verified": true
  },
  "alarm": {
   "en": "Agitated «spitt! spitt!» and a quick «sisisi».",
   "no": "Opphisset «spitt! spitt!» og raskt «sisisi».",
   "verified": true
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "parts": {},
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "????yy?y????",
  "note": {
   "en": "Resident; some young birds wander south-west in autumn. Sings mostly in the breeding season (eggs in May to June), also in late summer and now and then in winter. The sources say nothing about the other months.",
   "no": "Standfugl; noen unge fugler streifer mot sørvest om høsten. Synger mest i hekketiden (egg i mai til juni), også på sensommeren og av og til om vinteren. Kildene sier ikke noe om de andre månedene.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "name": {
    "en": "Marsh tit",
    "no": "Løvmeis"
   },
   "text": {
    "en": "Very alike. The marsh tit looks slimmer and browner, has no pale wing stripe and off-white cheeks.",
    "no": "Svært lik. Løvmeisen ser slankere og brunere ut, mangler den lyse vingestripen og har gråhvite kinn.",
    "verified": true
   }
  }
 ]
}
`,mi=`{
 "_note": "Willow tit ink plate in a 280x240 box, drawn in M11 from the great tit plate, not from a design: matt black cap and throat patch (ink), white cheek (face), light grey above (light hatching), a long pale stripe along the wing (face). The female is not described apart, so she shows the species' marks; juveniles look like adults (SNL).",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M198 70 C196 56 180 50 166 56 C152 62 142 76 132 92 C120 110 110 130 108 150 C110 160 118 168 126 172 C146 182 170 174 180 156 C192 136 199 108 199 90 C200 86 201 82 200 80 Z",
  "wing": "M156 92 C164 118 148 148 112 160 C118 138 130 110 156 92 Z"
 },
 "layers": [
  {
   "path": "M14 206 C80 202 150 199 268 194",
   "stroke": 4
  },
  {
   "path": "M214 197 l20 -20 M224 187 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 177 q10 -10 18 -2 q-9 8 -18 2 Z M240 190 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M114 146 L62 204 L74 214 L126 166 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M118 152 L66 207 M122 159 L70 211",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M142 176 L144 199 M156 175 L159 198 M136 201 L144 199 L152 201 M151 199 L159 198 L167 200",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "path": "M157 98 L122 152 L128 155 L161 102 Z",
   "fill": "face",
   "stroke": 1,
   "within": "wing"
  },
  {
   "path": "M200 66 L200 82 C200 96 198 104 194 110 C184 110 172 104 160 98 C152 94 144 92 136 90 C142 76 152 60 168 54 C184 50 198 56 200 66 Z",
   "fill": "cap",
   "within": "body"
  },
  {
   "path": "M190 80 C184 82 172 82 160 78 C156 84 162 94 174 98 C184 100 190 94 192 86 Z",
   "fill": "face",
   "stroke": 1,
   "within": "body"
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    182,
    68
   ],
   "pupil": 2.4
  },
  {
   "path": "M182.4 66.8 m-0.9 0 a0.9 0.9 0 1 0 1.8 0 a0.9 0.9 0 1 0 -1.8 0",
   "fill": "face"
  },
  {
   "path": "M198 70 L214 76 L200 78 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M200 78 L213 78 L200 82 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M226 64 A14 14 0 0 1 226 88 M233 56 A24 24 0 0 1 233 96 M240 48 A34 34 0 0 1 240 104",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "hatch": {
  "body": {
   "rect": [
    104,
    50,
    204,
    184
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    108,
    88,
    166,
    164
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    200,
    74
   ],
   "deg": -14
  },
  "lower": {
   "at": [
    200,
    79
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    120,
    156
   ],
   "deg": -5
  }
 },
 "variants": {
  "male": {
   "body_pitch": 11,
   "wing_pitch": 6,
   "eye_ring": 0,
   "bill": "shadow",
   "cap": "ink"
  },
  "female": {
   "body_pitch": 11,
   "wing_pitch": 6,
   "eye_ring": 0,
   "bill": "shadow",
   "cap": "ink"
  },
  "juvenile": {
   "body_pitch": 11,
   "wing_pitch": 6,
   "eye_ring": 0,
   "bill": "shadow",
   "cap": "ink"
  }
 },
 "callouts": [
  {
   "id": "head",
   "leader": "M166 60 L122 36",
   "at": [
    120,
    30
   ],
   "align": "right",
   "male": {
    "en": "MATT BLACK CAP",
    "no": "MATT SVART ISSE",
    "verified": true
   },
   "female": {
    "en": "MATT BLACK CAP",
    "no": "MATT SVART ISSE",
    "verified": true
   },
   "juvenile": {
    "en": "LIKE THE ADULTS",
    "no": "SOM DE VOKSNE",
    "verified": true
   }
  },
  {
   "id": "cheek",
   "leader": "M164 86 L74 86",
   "at": [
    70,
    80
   ],
   "align": "right",
   "male": {
    "en": "WHITE",
    "no": "HVIT",
    "verified": true
   },
   "female": {
    "en": "WHITE",
    "no": "HVIT",
    "verified": true
   },
   "juvenile": {
    "en": "WHITE",
    "no": "HVIT",
    "verified": true
   }
  },
  {
   "id": "throat",
   "leader": "M194 104 L236 132",
   "at": [
    276,
    140
   ],
   "align": "right",
   "male": {
    "en": "BLACK PATCH",
    "no": "SVART FLEKK",
    "verified": true
   },
   "female": {
    "en": "BLACK PATCH",
    "no": "SVART FLEKK",
    "verified": true
   },
   "juvenile": {
    "en": "BLACK PATCH",
    "no": "SVART FLEKK",
    "verified": true
   }
  },
  {
   "id": "wing",
   "leader": "M140 126 L104 144",
   "at": [
    100,
    140
   ],
   "align": "right",
   "male": {
    "en": "PALE STRIPE",
    "no": "LYS STRIPE",
    "verified": true
   },
   "female": {
    "en": "PALE STRIPE",
    "no": "LYS STRIPE",
    "verified": true
   },
   "juvenile": {
    "en": "PALE STRIPE",
    "no": "LYS STRIPE",
    "verified": true
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Adult. Black cap and throat patch, pale wing stripe.",
   "no": "Voksen. Svart isse og strupeflekk, lys vingestripe.",
   "verified": true
  },
  "female": {
   "en": "Female. Not described in the sources.",
   "no": "Hunn. Ikke beskrevet i kildene.",
   "verified": false
  },
  "juvenile": {
   "en": "Juvenile. Like the adults.",
   "no": "Ungfugl. Som de voksne.",
   "verified": true
  }
 }
}
`,vi=`{
 "_note": "Willow tit, M11 batch 2. Verified (birds.md, SNL): song a plaintive «tiuuu tiuuu tiuuu», more rarely a slightly buzzing «zi-zi-zerrrl», mostly in the breeding season, also late summer and now and then in winter; call «titi-tæææ-tæææ»; alarm an agitated «spitt! spitt!» and a quick «sisisi». Design: 'tiuuu' is a pure falling note of 0,35 s from about 4,3 to 3,3 kHz, 3 to 5 in a row; 'zerrrl' a buzzy 0,5 s trill after two short 'zi'; 'tæææ' a harsh nasal 0,25 s note near 3 kHz; 'spitt' a sharp 60 ms note; 'sisisi' thin quick notes near 7 kHz. Pitches and timings are guesses. Winter pauses longer is a design choice.",
 "syllables": {
  "tiu": {
   "dur_ms": 360,
   "pitch": [
    [
     0,
     4400
    ],
    [
     0.15,
     4300
    ],
    [
     1,
     3300
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.75,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75,
   "tension": -14,
   "rough": -4
  },
  "tiu2": {
   "dur_ms": 400,
   "pitch": [
    [
     0,
     4200
    ],
    [
     0.15,
     4100
    ],
    [
     1,
     3200
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.75,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75,
   "tension": -14,
   "rough": -4
  },
  "zi": {
   "dur_ms": 70,
   "pitch": [
    [
     0,
     6200
    ],
    [
     1,
     5800
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.5
  },
  "zerrl": {
   "dur_ms": 520,
   "pitch": [
    [
     0,
     5400
    ],
    [
     1,
     4600
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     0.9
    ],
    [
     0.8,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.55,
   "rough": 6,
   "trill": {
    "hz": 38,
    "depth_st": 1.2,
    "am": 0.6
   }
  },
  "ti": {
   "dur_ms": 55,
   "pitch": [
    [
     0,
     6600
    ],
    [
     1,
     6200
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.45
  },
  "taeae": {
   "dur_ms": 260,
   "pitch": [
    [
     0,
     2900
    ],
    [
     0.3,
     3200
    ],
    [
     1,
     2800
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     1
    ],
    [
     0.8,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.6,
   "rough": 30,
   "tension": 18
  },
  "spitt": {
   "dur_ms": 60,
   "pitch": [
    [
     0,
     7000
    ],
    [
     1,
     5200
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.5,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.55,
   "rough": 8,
   "tension": 10
  },
  "si": {
   "dur_ms": 45,
   "pitch": [
    [
     0,
     7400
    ],
    [
     1,
     7000
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.35,
   "tension": -10
  }
 },
 "types": {
  "song": {
   "pause_s": [
    3.0,
    9.0
   ],
   "length_s": [
    1.2,
    2.6
   ],
   "transpose_st": 0.6,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     10,
     18
    ],
    "vo_tension": [
     16,
     28
    ],
    "vo_rough": [
     3,
     9
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 4,
     "sections": [
      {
       "pool": [
        "tiu",
        "tiu2"
       ],
       "count": [
        3,
        5
       ],
       "share": 1.0,
       "gap_ms": [
        140,
        240
       ]
      }
     ]
    },
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "zi"
       ],
       "count": [
        2,
        2
       ],
       "share": 0.3,
       "gap_ms": [
        60,
        90
       ]
      },
      {
       "pool": [
        "zerrl"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.7,
       "gap_ms": [
        80,
        80
       ],
       "lead_gap_ms": [
        70,
        100
       ]
      }
     ]
    }
   ],
   "overrides": [
    {
     "_note": "Now and then in winter (birds.md): longer pauses is a design choice.",
     "when": {
      "season": "winter"
     },
     "pause_s": [
      12.0,
      40.0
     ]
    }
   ]
  },
  "call": {
   "pause_s": [
    2.0,
    8.0
   ],
   "length_s": [
    0.6,
    1.2
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     14,
     20
    ],
    "vo_tension": [
     30,
     42
    ],
    "vo_rough": [
     24,
     34
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "ti"
       ],
       "count": [
        2,
        2
       ],
       "share": 0.2,
       "gap_ms": [
        40,
        60
       ]
      },
      {
       "pool": [
        "taeae"
       ],
       "count": [
        2,
        3
       ],
       "share": 0.8,
       "gap_ms": [
        50,
        90
       ],
       "lead_gap_ms": [
        40,
        70
       ]
      }
     ]
    }
   ],
   "overrides": []
  },
  "alarm": {
   "pause_s": [
    0.8,
    3.0
   ],
   "length_s": [
    0.3,
    1.4
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     12,
     18
    ],
    "vo_tension": [
     30,
     40
    ],
    "vo_rough": [
     10,
     18
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "spitt"
       ],
       "count": [
        2,
        4
       ],
       "share": 1.0,
       "gap_ms": [
        220,
        380
       ]
      }
     ]
    },
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "si"
       ],
       "count": [
        3,
        6
       ],
       "share": 1.0,
       "gap_ms": [
        30,
        50
       ]
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,bi=`{
  "_note": "Sound design starting values for the willow tit, M11 batch 2. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 4000,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 14,
    "vo_tension": 22,
    "vo_trill": 0,
    "vo_rough": 6,
    "ph_tempo": 100,
    "ph_pause": 4.0,
    "ph_length": 1.6,
    "ph_variation": 30,
    "su_distance": 15,
    "su_wind": 1.5,
    "su_space": 45
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}
`,_i=`{
 "_note": "Field guide text for this bird, both languages. Facts come from birds.md (M11, SNL). A field with verified false is not shown as a fact: empty means not described, and the text says what the sources leave out. Norwegian wording is mine, Eirik to check. calendar rows: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/phylloscopus-collybita",
 "facts": {
  "length": {
   "en": "11 cm, 6 to 10 g",
   "no": "11 cm, 6 til 10 g",
   "verified": true
  },
  "broods": {
   "en": "",
   "no": "",
   "verified": false
  },
  "range": {
   "en": "Sørlandet to Troms, perhaps parts of Finnmark",
   "no": "Sørlandet til Troms, kanskje deler av Finnmark",
   "verified": true
  },
  "habitat": {
   "en": "All forest, best mixed forest with open areas",
   "no": "All skog, helst blandingsskog med åpne partier",
   "verified": true
  },
  "food": {
   "en": "Mainly insects, some berries",
   "no": "Mest insekter, litt bær",
   "verified": true
  },
  "status": {
   "en": "LC, least concern",
   "no": "LC, livskraftig",
   "verified": true
  },
  "nest": {
   "en": "Domed with a side opening, in a low conifer bush, 5 to 8 eggs",
   "no": "Kuppelformet med sideåpning, i en lav bartrebusk, 5 til 8 egg",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Sings",
   "no": "Synger",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "A rhythmic «chiff-chaff» with no melody, in series of 15 to 40 notes. The song is the best mark: very different from the willow warbler's.",
  "no": "Et rytmisk «chiff-chaff» uten melodi, i serier på 15 til 40 slag. Sangen er det beste kjennetegnet: helt ulik løvsangerens.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "Rhythmic «chiff-chaff», 15 to 40 notes.",
   "no": "Rytmisk «chiff-chaff», 15 til 40 slag.",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "parts": {},
 "calendar": {
  "present": "???yyy??????",
  "sings": "????????????",
  "note": {
   "en": "Migrant, winters around the western Mediterranean; returns from April, up to Nordland. The sources do not say when it leaves, or give its singing months.",
   "no": "Trekkfugl, overvintrer rundt det vestlige Middelhavet; kommer fra april, opp til Nordland. Kildene sier ikke når den drar, og oppgir ikke månedene med sang.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "id": "lovsanger",
   "text": {
    "en": "Almost identical plumage, only certain by measuring the wing feathers; the chiffchaff has darker legs. The songs are very different.",
    "no": "Nesten lik drakt, bare sikker ved å måle håndsvingfjærene; gransangeren har mørkere bein. Sangen er helt ulik.",
    "verified": true
   }
  }
 ]
}
`,ki=`{
 "_note": "Chiffchaff ink plate in a 280x240 box, drawn in M11 from the willow warbler plate, not from a design: brown-green above (hatching), yellowish-white below (face), a pale stripe over the eye, darker legs (heavier stroke). Sexes and juvenile are not described; the female shows the species' marks, the juvenile is drawn alike with [TO VERIFY].",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M198 70 C196 56 180 50 166 56 C152 62 142 76 132 92 C120 110 110 130 108 150 C110 160 118 168 126 172 C146 182 170 174 180 156 C192 136 199 108 199 90 C200 86 201 82 200 80 Z",
  "wing": "M156 92 C164 118 148 148 112 160 C118 138 130 110 156 92 Z"
 },
 "layers": [
  {
   "path": "M14 206 C80 202 150 199 268 194",
   "stroke": 4
  },
  {
   "path": "M214 197 l20 -20 M224 187 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 177 q10 -10 18 -2 q-9 8 -18 2 Z M240 190 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M114 146 L62 204 L74 214 L126 166 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M118 152 L66 207 M122 159 L70 211",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M142 176 L144 199 M156 175 L159 198 M136 201 L144 199 L152 201 M151 199 L159 198 L167 200",
   "stroke": 2.6
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "variant": "under",
   "fill": "face",
   "within": "body"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "path": "M164 64 C172 57 186 56 198 62 L197 66 C186 61 174 61 166 68 Z",
   "fill": "face",
   "stroke": 1,
   "within": "body"
  },
  {
   "eye": [
    182,
    68
   ],
   "pupil": 2.4
  },
  {
   "path": "M182.4 66.8 m-0.9 0 a0.9 0.9 0 1 0 1.8 0 a0.9 0.9 0 1 0 -1.8 0",
   "fill": "face"
  },
  {
   "path": "M198 69 L218 75 L200 77 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M200 77 L216 76 L200 80 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M226 64 A14 14 0 0 1 226 88 M233 56 A24 24 0 0 1 233 96 M240 48 A34 34 0 0 1 240 104",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "hatch": {
  "body": {
   "rect": [
    104,
    50,
    204,
    184
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    108,
    88,
    166,
    164
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    200,
    74
   ],
   "deg": -14
  },
  "lower": {
   "at": [
    200,
    79
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    120,
    156
   ],
   "deg": -5
  }
 },
 "variants": {
  "male": {
   "body_pitch": 7,
   "wing_pitch": 6,
   "eye_ring": 0,
   "bill": "shadow",
   "under": "M199 84 C196 108 190 134 180 156 C170 174 146 182 126 172 C140 170 156 160 166 144 C178 124 188 102 192 84 Z"
  },
  "female": {
   "body_pitch": 7,
   "wing_pitch": 6,
   "eye_ring": 0,
   "bill": "shadow",
   "under": "M199 84 C196 108 190 134 180 156 C170 174 146 182 126 172 C140 170 156 160 166 144 C178 124 188 102 192 84 Z"
  },
  "juvenile": {
   "body_pitch": 7,
   "wing_pitch": 6,
   "eye_ring": 0,
   "bill": "shadow",
   "under": "M199 84 C196 108 190 134 180 156 C170 174 146 182 126 172 C140 170 156 160 166 144 C178 124 188 102 192 84 Z"
  }
 },
 "callouts": [
  {
   "id": "eye_stripe",
   "leader": "M182 58 L122 36",
   "at": [
    120,
    30
   ],
   "align": "right",
   "male": {
    "en": "PALE",
    "no": "LYS",
    "verified": true
   },
   "female": {
    "en": "PALE",
    "no": "LYS",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M140 100 L74 86",
   "at": [
    70,
    80
   ],
   "align": "right",
   "male": {
    "en": "BROWN-GREEN",
    "no": "BRUNGRØNN",
    "verified": true
   },
   "female": {
    "en": "BROWN-GREEN",
    "no": "BRUNGRØNN",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "breast",
   "leader": "M184 130 L232 200",
   "at": [
    276,
    212
   ],
   "align": "right",
   "male": {
    "en": "YELLOWISH WHITE",
    "no": "GULHVIT",
    "verified": true
   },
   "female": {
    "en": "YELLOWISH WHITE",
    "no": "GULHVIT",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Adult. Pale stripe over the eye; darker legs than the willow warbler.",
   "no": "Voksen. Lys stripe over øyet; mørkere bein enn løvsangeren.",
   "verified": true
  },
  "female": {
   "en": "Female. Not described in the sources.",
   "no": "Hunn. Ikke beskrevet i kildene.",
   "verified": false
  },
  "juvenile": {
   "en": "Juvenile. Not described in the sources.",
   "no": "Ungfugl. Ikke beskrevet i kildene.",
   "verified": false
  }
 }
}
`,yi=`{
 "_note": "Chiffchaff, M11 batch 3. Verified (birds.md, SNL): a rhythmic «chiff-chaff» with no melody, in series of 15 to 40 notes. Design: 'chiff' a short note falling from about 6,2 to 4,8 kHz, 'chaff' a lower one from 5 to 3,9 kHz, about 3 notes a second in a loose alternation; the higher and lower notes are my reading of 'chiff' and 'chaff'. No call type: SNL describes none.",
 "syllables": {
  "chiff": {
   "dur_ms": 95,
   "pitch": [
    [
     0,
     6200
    ],
    [
     0.3,
     5700
    ],
    [
     1,
     4800
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7
  },
  "chiff2": {
   "dur_ms": 90,
   "pitch": [
    [
     0,
     6000
    ],
    [
     0.3,
     5500
    ],
    [
     1,
     4700
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.65
  },
  "chaff": {
   "dur_ms": 110,
   "pitch": [
    [
     0,
     5000
    ],
    [
     0.3,
     4600
    ],
    [
     1,
     3900
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7
  }
 },
 "types": {
  "song": {
   "pause_s": [
    3.0,
    10.0
   ],
   "length_s": [
    4.0,
    8.0
   ],
   "transpose_st": 0.4,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     8,
     16
    ],
    "vo_tension": [
     30,
     42
    ],
    "vo_rough": [
     2,
     6
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "chiff",
        "chaff",
        "chiff2"
       ],
       "count": [
        15,
        40
       ],
       "share": 1.0,
       "gap_ms": [
        190,
        280
       ],
       "no_adjacent_repeat": true
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,wi=`{
  "_note": "Sound design starting values for the chiffchaff, M11 batch 3. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 5000,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 12,
    "vo_tension": 36,
    "vo_trill": 0,
    "vo_rough": 4,
    "ph_tempo": 100,
    "ph_pause": 5.0,
    "ph_length": 6.0,
    "ph_variation": 25,
    "su_distance": 18,
    "su_wind": 1.5,
    "su_space": 45
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}
`,Li=`{
 "_note": "Field guide text for this bird, both languages. Facts come from birds.md. A field with verified false is not shown as a fact: empty means not described, and the text says what the sources leave out. Norwegian wording is mine, Eirik to check. calendar rows: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/passer-domesticus",
 "facts": {
  "length": {
   "en": "About 15 cm, 25 to 35 g",
   "no": "Omtrent 15 cm, 25 til 35 g",
   "verified": true
  },
  "broods": {
   "en": "2 or 3 a year are common",
   "no": "2 eller 3 kull i året er vanlig",
   "verified": true
  },
  "range": {
   "en": "The whole country, rarer at altitude",
   "no": "Hele landet, sjeldnere i høyden",
   "verified": true
  },
  "habitat": {
   "en": "By buildings: houses and farms",
   "no": "Ved bygninger: hus og gårder",
   "verified": true
  },
  "food": {
   "en": "Grain, seeds, insects, scraps",
   "no": "Korn, frø, insekter, matrester",
   "verified": true
  },
  "status": {
   "en": "NT, near threatened, Norwegian red list",
   "no": "NT, nær truet, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "Cavities in buildings, 4 to 5 eggs",
   "no": "Hulrom i bygninger, 4 til 5 egg",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Sings",
   "no": "Synger",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "A simple, short, repeated phrase of chirps, “sjirp, sjirp”, heard most in spring. Chattering and twittering calls all year.",
  "no": "En enkel, kort, gjentatt frase av kvitter, «sjirp, sjirp», mest hørt om våren. Skravlende og kvitrende lyder hele året.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "Chirping “sjirp, sjirp”, most in spring.",
   "no": "Kvitrende «sjirp, sjirp», mest om våren.",
   "verified": true
  },
  "call": {
   "en": "Chattering and twittering, all year.",
   "no": "Skravling og kvitring, hele året.",
   "verified": true
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "parts": {},
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "????????????",
  "note": {
   "en": "Resident. The song is heard most in spring. The sources do not give its singing months.",
   "no": "Standfugl. Sangen høres mest om våren. Kildene oppgir ikke månedene med sang.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "name": {
    "en": "Tree sparrow",
    "no": "Pilfink"
   },
   "text": {
    "en": "Chestnut crown and black cheek spots.",
    "no": "Kastanjebrun isse og svarte kinnflekker.",
    "verified": true
   }
  }
 ]
}
`,Mi=`{
 "_note": "House sparrow ink plate in a 280x240 box, drawn in M3 (not from the design). Same composition as the other plates: perched, facing right, with a thick seed-eater bill. The male has a grey crown (shadow), a black throat patch (ink), grey underparts (shadow) and a hatched back and wing with black streaks (birds.md: brown and black streaked upperparts, shortened to STREAKED BACK on the callout). The female has a brown crown, drawn as hatching. Callout values are from birds.md (SNL). Not verified and shown as [TO VERIFY]: bill colour, every female value but the crown (including whether she has a throat patch), and the whole juvenile, which is drawn like the female.",
 "box": [280, 240],
 "clips": {
  "body": "M198 72 C196 58 182 52 168 56 C152 60 140 74 132 92 C120 112 114 132 116 150 C120 166 132 176 148 178 C166 180 182 170 190 152 C198 134 200 108 199 92 C200 86 201 82 200 80 Z",
  "wing": "M158 94 C164 120 150 148 120 160 C124 138 134 112 158 94 Z",
  "crown": "M200 68 C196 58 184 52 170 55 C160 58 152 64 146 74 C158 68 172 64 186 64 C192 64 198 66 200 68 Z"
 },
 "layers": [
  { "path": "M14 206 C80 202 150 199 268 194", "stroke": 4 },
  { "path": "M214 197 l20 -20 M224 187 l16 3", "stroke": 1.5 },
  { "path": "M234 177 q10 -10 18 -2 q-9 8 -18 2 Z M240 190 q11 -5 16 3 q-10 4 -16 -3 Z", "fill": "face", "stroke": 1 },
  { "path": "M120 150 L88 196 L100 204 L132 166 Z", "fill": "face", "stroke": 1.5, "part": "tail" },
  { "path": "M124 156 L92 199 M128 162 L96 202", "stroke": 1, "part": "tail" },
  { "path": "M148 178 L148 199 M162 176 L163 198 M140 201 L148 199 L156 201 M155 199 L163 198 L171 200", "stroke": 1.5 },
  { "clip": "body", "fill": "face", "stroke": 1.5 },
  { "hatch": "body" },
  { "path": "M200 80 C194 84 188 84 182 80 C174 84 168 92 164 104 C160 120 162 138 172 154 C178 162 184 168 188 170 L216 170 L216 78 Z", "fill": "breast", "within": "body" },
  { "path": "M200 68 C196 58 184 52 170 55 C160 58 152 64 146 74 C158 68 172 64 186 64 C192 64 198 66 200 68 Z", "fill": "cap", "within": "body" },
  { "hatch": "crown" },
  { "path": "M146 74 C158 68 172 64 186 64 C192 64 198 66 200 68", "stroke": 1, "within": "body" },
  { "variant": "bib", "fill": "ink", "within": "body" },
  { "hatch": "wing" },
  { "clip": "wing", "stroke": 1.5 },
  { "path": "M130 140 L152 112 M134 150 L156 122 M144 152 L160 132", "stroke": 2.5, "within": "wing" },
  { "path": "M146 84 L136 96 M152 88 L142 102", "stroke": 2, "within": "body" },
  { "clip": "body", "stroke": 1.5 },
  { "eye": [184, 73], "pupil": 2.4 },
  { "path": "M184.6 72.4 m-1.2 0 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0", "fill": "face" },
  { "path": "M196 65 L216 75 L199 78 Z", "fill": "bill", "stroke": 1.5, "part": "upper" },
  { "path": "M199 78 L214 77 L198 85 Z", "fill": "bill", "stroke": 1.5, "part": "lower" },
  { "path": "M228 66 A14 14 0 0 1 228 90 M235 58 A24 24 0 0 1 235 98 M242 50 A34 34 0 0 1 242 106", "stroke": 1.5, "part": "arcs" }
 ],
 "hatch": {
  "body": { "rect": [112, 50, 204, 182], "up": true, "clip": "body" },
  "wing": { "rect": [118, 90, 166, 164], "up": false, "clip": "wing" },
  "crown": { "rect": [140, 48, 204, 78], "up": false, "clip": "crown" }
 },
 "pivots": {
  "upper": { "at": [199, 74], "deg": -14 },
  "lower": { "at": [199, 80], "deg": 10 },
  "tail": { "at": [126, 158], "deg": -6 }
 },
 "variants": {
  "male": { "body_pitch": 7, "wing_pitch": 3, "eye_ring": 0, "bill": "shadow", "breast": "shadow", "cap": "shadow",
   "bib": "M200 81 C200 92 198 104 192 116 C184 114 178 106 180 98 C186 94 190 88 192 81 Z" },
  "female": { "body_pitch": 9, "wing_pitch": 4, "eye_ring": 0, "bill": "shadow", "breast": "face", "cap": "face", "crown_pitch": 4, "bib": "" },
  "juvenile": { "body_pitch": 9, "wing_pitch": 4, "eye_ring": 0, "bill": "shadow", "breast": "face", "cap": "face", "crown_pitch": 4, "bib": "" }
 },
 "callouts": [
  { "id": "bill", "leader": "M206 74 L206 23", "at": [206, 10], "align": "centre",
    "male": { "en": "", "no": "", "verified": false },
    "female": { "en": "", "no": "", "verified": false },
    "juvenile": { "en": "", "no": "", "verified": false } },
  { "id": "head", "leader": "M168 60 L122 36", "at": [120, 30], "align": "right",
    "male": { "en": "GREY CROWN", "no": "GRÅ ISSE", "verified": true },
    "female": { "en": "BROWN CROWN", "no": "BRUN ISSE", "verified": true },
    "juvenile": { "en": "", "no": "", "verified": false } },
  { "id": "plumage", "leader": "M146 96 L112 104", "at": [108, 98], "align": "right",
    "male": { "en": "STREAKED BACK", "no": "STREKET RYGG", "verified": true },
    "female": { "en": "", "no": "", "verified": false },
    "juvenile": { "en": "", "no": "", "verified": false } },
  { "id": "throat", "leader": "M190 104 L218 120", "at": [276, 122], "align": "right",
    "male": { "en": "BLACK PATCH", "no": "SVART FLEKK", "verified": true },
    "female": { "en": "", "no": "", "verified": false },
    "juvenile": { "en": "", "no": "", "verified": false } },
  { "id": "breast", "leader": "M178 136 L232 212", "at": [276, 224], "align": "right",
    "male": { "en": "GREY", "no": "GRÅ", "verified": true },
    "female": { "en": "", "no": "", "verified": false },
    "juvenile": { "en": "", "no": "", "verified": false } }
 ],
 "captions": {
  "male": { "en": "Male, singing. Grey crown, black throat patch.", "no": "Hann som synger. Grå isse, svart strupeflekk.", "verified": true },
  "female": { "en": "Female. Brown crown.", "no": "Hunn. Brun isse.", "verified": true },
  "juvenile": { "en": "Juvenile. Not described in the sources.", "no": "Ungfugl. Ikke beskrevet i kildene.", "verified": false }
 }
}
`,xi=`{
  "_note": "House sparrow, M3 round 1. Shapes, pitches, timings and both call types are sound design guesses, not verified, not tuned against recordings. Verified (birds.md, SNL): the song is a simple, short, repeated phrase, chirping 'sjirp, sjirp', heard most in spring; chattering and twittering calls all year. Design: the song is a run of 3 to 10 harsh chirps, each a quick rise and fall around 3 to 5 kHz with many harmonics and some roughness, 2 to 4 a second; 'sjirp', a two-part 'sjilp' and a lower 'tsjip' mix freely. The same phrase repeats with short pauses (bout). Call type: a fast rough chatter run, or a softer twitter of short high notes. Neither call has a transcription in birds.md.",

  "syllables": {
    "sjirp": { "dur_ms": 130, "pitch": [[0, 3100], [0.3, 4700], [0.55, 4300], [1, 3300]], "amp": [[0, 0], [0.1, 1], [0.6, 0.75], [1, 0]], "gain": 0.6 },
    "sjilp": { "dur_ms": 150, "pitch": [[0, 3300], [0.2, 4500], [0.42, 3600], [0.5, 3900], [0.7, 4400], [1, 3200]], "amp": [[0, 0], [0.08, 1], [0.38, 0.8], [0.46, 0.3], [0.56, 0.9], [0.8, 0.6], [1, 0]], "gain": 0.6 },
    "tsjip": { "dur_ms": 110, "pitch": [[0, 2900], [0.25, 3900], [1, 3000]], "amp": [[0, 0], [0.12, 1], [0.6, 0.7], [1, 0]], "gain": 0.6, "rough": 4 },

    "chat":  { "dur_ms": 38, "pitch": [[0, 3600], [0.3, 4000], [1, 3300]], "amp": [[0, 0], [0.12, 1], [0.6, 0.6], [1, 0]], "gain": 0.55, "rough": 16, "tension": 8 },
    "chat2": { "dur_ms": 34, "pitch": [[0, 3400], [0.3, 3800], [1, 3200]], "amp": [[0, 0], [0.12, 1], [0.6, 0.6], [1, 0]], "gain": 0.5, "rough": 16, "tension": 8 },
    "tw1":   { "dur_ms": 55, "pitch": [[0, 4600], [0.4, 5600], [1, 4900]], "amp": [[0, 0], [0.15, 1], [0.6, 0.7], [1, 0]], "gain": 0.4, "rough": -10, "tension": -20 },
    "tw2":   { "dur_ms": 45, "pitch": [[0, 5300], [1, 4500]], "amp": [[0, 0], [0.15, 1], [0.6, 0.7], [1, 0]], "gain": 0.4, "rough": -10, "tension": -20 }
  },

  "types": {
    "song": {
      "pause_s": [1.2, 4.0],
      "length_s": [1.5, 3.8],
      "transpose_st": 0.8,
      "avoid_repeat": false,
      "bout": [3, 8],
      "auto": {
        "vo_pitch": [0.97, 1.03],
        "vo_breath": [12, 18],
        "vo_tension": [56, 68],
        "vo_rough": [20, 28],
        "ph_tempo": [94, 106]
      },
      "phrases": [
        { "weight": 3, "sections": [
          { "pool": ["sjirp", "sjilp"], "count": [3, 10], "share": 1.0, "gap_ms": [150, 330], "no_adjacent_repeat": false }
        ] },
        { "weight": 2, "sections": [
          { "pool": ["sjirp", "tsjip"], "count": [3, 9], "share": 1.0, "gap_ms": [170, 360], "no_adjacent_repeat": false }
        ] }
      ],
      "overrides": []
    },

    "call": {
      "pause_s": [1.0, 4.0],
      "length_s": [0.4, 1.4],
      "avoid_repeat": false,
      "auto": {
        "vo_pitch": [0.98, 1.02],
        "vo_breath": [14, 22],
        "vo_tension": [60, 72],
        "vo_rough": [26, 36]
      },
      "phrases": [
        { "weight": 2, "sections": [ { "pool": ["chat", "chat2"], "count": [6, 16], "share": 1.0, "gap_ms": [22, 34], "no_adjacent_repeat": false } ] },
        { "weight": 1, "sections": [ { "pool": ["tw1", "tw2"], "count": [3, 8], "share": 1.0, "gap_ms": [60, 120], "no_adjacent_repeat": false } ] }
      ],
      "overrides": []
    }
  }
}
`,Si=`{
  "_note": "Sound design starting values for the house sparrow, M3 round 1. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 4000,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 14,
    "vo_tension": 62,
    "vo_trill": 0,
    "vo_rough": 24,
    "ph_tempo": 100,
    "ph_pause": 2.5,
    "ph_length": 2.6,
    "ph_variation": 30,
    "su_distance": 12,
    "su_wind": 1.5,
    "su_space": 45
  },
  "ranges": {
    "vo_pitch": [0.5, 2.0],
    "vo_breath": [0, 100],
    "vo_tension": [0, 100],
    "vo_trill": [0, 40],
    "vo_rough": [0, 100],
    "ph_tempo": [50, 200],
    "ph_pause": [0.2, 20],
    "ph_length": [0.2, 8],
    "ph_variation": [0, 100],
    "su_distance": [1, 200],
    "su_wind": [0, 15],
    "su_space": [0, 100]
  }
}
`,Ei=`{
 "_note": "Field guide text for this bird, both languages. Facts come from birds.md (M11, SNL). A field with verified false is not shown as a fact: empty means not described, and the text says what the sources leave out. Norwegian wording is mine, Eirik to check. calendar rows: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/turdus-pilaris",
 "facts": {
  "length": {
   "en": "25 cm, 80 to 130 g",
   "no": "25 cm, 80 til 130 g",
   "verified": true
  },
  "broods": {
   "en": "Two possible in the south",
   "no": "To kull mulig i sør",
   "verified": true
  },
  "range": {
   "en": "The whole country",
   "no": "Hele landet",
   "verified": true
  },
  "habitat": {
   "en": "Open land and mountain birch; towns in Østlandet",
   "no": "Åpent land og fjellbjørkeskog; byer på Østlandet",
   "verified": true
  },
  "food": {
   "en": "Earthworms above all, insects, berries",
   "no": "Meitemark fremfor alt, insekter, bær",
   "verified": true
  },
  "status": {
   "en": "LC, least concern",
   "no": "LC, livskraftig",
   "verified": true
  },
  "nest": {
   "en": "Tree forks, bushes, ledges; often in colonies, 5 to 6 eggs",
   "no": "Tregreiner, busker, hyller; ofte i kolonier, 5 til 6 egg",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Sings",
   "no": "Synger",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "Not very melodic: a somewhat monotonous chattering with «sjæk-sjæk-sjøl» sounds put in.",
  "no": "Ikke særlig melodisk: en noe monoton skvatring med innlagte «sjæk-sjæk-sjøl»-lyder.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "Monotonous chattering with «sjæk-sjæk-sjøl».",
   "no": "Monoton skvatring med «sjæk-sjæk-sjøl».",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "parts": {},
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "????????????",
  "note": {
   "en": "Migrant and wanderer; many winter on the coast north to Troms, most in rowan-berry years. The sources do not give its singing months.",
   "no": "Trekk- og streiffugl; mange overvintrer langs kysten nord til Troms, flest i år med mye rognebær. Kildene oppgir ikke månedene med sang.",
   "verified": true
  }
 },
 "lookalikes": []
}
`,Ci=`{
 "_note": "Fieldfare ink plate in a 280x240 box, drawn in M11 from the song thrush plate, not from a design: ash-grey head (shadow tone), brown back (hatching), rust-yellow breast (shadow tone) with black spots, white belly. Sexes and juvenile are not described; the female shows the species' marks, the juvenile is drawn alike with [TO VERIFY].",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M190 60 C184 44 158 42 150 62 C134 80 104 106 90 136 C92 146 98 154 106 158 C128 180 162 178 178 152 C192 130 198 104 192 80 C194 74 194 66 190 60 Z",
  "wing": "M152 90 C156 118 136 146 98 152 C106 136 118 110 152 90 Z"
 },
 "layers": [
  {
   "path": "M14 211 C80 205 150 201 268 193",
   "stroke": 4
  },
  {
   "path": "M214 196 l20 -20 M224 186 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 176 q10 -10 18 -2 q-9 8 -18 2 Z M240 189 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M90 136 L58 178 L70 190 L106 158 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M94 142 L61 182 M98 147 L64 186 M102 153 L67 189",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M136 172 L139 199 M152 173 L157 198 M131 201 L139 199 L148 202 M149 200 L157 198 L166 201",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "path": "M188 76 C180 96 168 120 150 140 C138 152 124 162 112 166 C130 178 162 176 178 152 C192 130 198 104 192 80 Z",
   "fill": "shadow",
   "within": "body"
  },
  {
   "path": "M178 132 C168 146 146 162 114 166 C132 178 162 176 178 152 C182 146 182 138 178 132 Z",
   "fill": "face",
   "within": "body"
  },
  {
   "path": "M190 60 C184 44 158 42 150 62 C146 70 150 78 158 80 C170 82 182 78 192 80 C194 74 194 66 190 60 Z",
   "fill": "shadow",
   "stroke": 1,
   "within": "body"
  },
  {
   "variant": "spots",
   "stroke": 1.5,
   "within": "body"
  },
  {
   "eye": [
    177,
    65
   ],
   "pupil": 2.4
  },
  {
   "path": "M177.6 64.4 m-1.2 0 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0",
   "fill": "face"
  },
  {
   "path": "M190 60 L220 66 L193 70 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M193 70 L216 69 L191 79 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M230 52 A16 16 0 0 1 230 76 M237 44 A26 26 0 0 1 237 84 M243 36 A36 36 0 0 1 243 92",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "hatch": {
  "body": {
   "rect": [
    86,
    42,
    200,
    182
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    96,
    88,
    158,
    154
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    192,
    67
   ],
   "deg": -16
  },
  "lower": {
   "at": [
    192,
    72
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    98,
    147
   ],
   "deg": -5
  }
 },
 "variants": {
  "male": {
   "body_pitch": 7,
   "wing_pitch": 6,
   "eye_ring": 0,
   "bill": "shadow",
   "spots": "M176 96 l2 3 M182 90 l2 3 M186 100 l2 3 M178 108 l2 3 M188 112 l2 3 M170 116 l2 3 M182 120 l2 3 M164 124 l2 3 M174 128 l2 3 M190 96 l2 3 M158 132 l2 3 M186 126 l2 3"
  },
  "female": {
   "body_pitch": 7,
   "wing_pitch": 6,
   "eye_ring": 0,
   "bill": "shadow",
   "spots": "M176 96 l2 3 M182 90 l2 3 M186 100 l2 3 M178 108 l2 3 M188 112 l2 3 M170 116 l2 3 M182 120 l2 3 M164 124 l2 3 M174 128 l2 3 M190 96 l2 3 M158 132 l2 3 M186 126 l2 3"
  },
  "juvenile": {
   "body_pitch": 7,
   "wing_pitch": 6,
   "eye_ring": 0,
   "bill": "shadow",
   "spots": "M176 96 l2 3 M182 90 l2 3 M186 100 l2 3 M178 108 l2 3 M188 112 l2 3 M170 116 l2 3 M182 120 l2 3 M164 124 l2 3 M174 128 l2 3 M190 96 l2 3 M158 132 l2 3 M186 126 l2 3"
  }
 },
 "callouts": [
  {
   "id": "head",
   "leader": "M170 56 L122 36",
   "at": [
    120,
    30
   ],
   "align": "right",
   "male": {
    "en": "ASH-GREY",
    "no": "ASKEGRÅ",
    "verified": true
   },
   "female": {
    "en": "ASH-GREY",
    "no": "ASKEGRÅ",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M120 112 L72 86",
   "at": [
    70,
    80
   ],
   "align": "right",
   "male": {
    "en": "BROWN BACK",
    "no": "BRUN RYGG",
    "verified": true
   },
   "female": {
    "en": "BROWN BACK",
    "no": "BRUN RYGG",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "breast",
   "leader": "M182 112 L236 132",
   "at": [
    276,
    140
   ],
   "align": "right",
   "male": {
    "en": "RUST-YELLOW, BLACK SPOTS",
    "no": "RUSTGUL, SVARTE FLEKKER",
    "verified": true
   },
   "female": {
    "en": "RUST-YELLOW, BLACK SPOTS",
    "no": "RUSTGUL, SVARTE FLEKKER",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Adult. Grey head, brown back, spotted rust-yellow breast.",
   "no": "Voksen. Grått hode, brun rygg, flekket rustgult bryst.",
   "verified": true
  },
  "female": {
   "en": "Female. Not described in the sources.",
   "no": "Hunn. Ikke beskrevet i kildene.",
   "verified": false
  },
  "juvenile": {
   "en": "Juvenile. Not described in the sources.",
   "no": "Ungfugl. Ikke beskrevet i kildene.",
   "verified": false
  }
 }
}
`,Ti=`{
 "_note": "Fieldfare, M11 batch 2. Verified (birds.md, SNL): not very melodic, a somewhat monotonous chattering with «sjæk-sjæk-sjøl» sounds put in. Design: a run of short rough chatter notes at 2 to 4 kHz, broken once or twice by a harsh 'sjæk sjæk' pair and a lower, longer 'sjøl'. Pitches and timings are guesses. No call type: SNL describes none beyond the song.",
 "syllables": {
  "ch1": {
   "dur_ms": 55,
   "pitch": [
    [
     0,
     3000
    ],
    [
     0.4,
     3600
    ],
    [
     1,
     2800
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.45,
   "rough": 14
  },
  "ch2": {
   "dur_ms": 50,
   "pitch": [
    [
     0,
     3400
    ],
    [
     1,
     2900
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.42,
   "rough": 14
  },
  "ch3": {
   "dur_ms": 65,
   "pitch": [
    [
     0,
     2600
    ],
    [
     0.5,
     3200
    ],
    [
     1,
     2700
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.45,
   "rough": 14
  },
  "sjaek": {
   "dur_ms": 120,
   "pitch": [
    [
     0,
     2300
    ],
    [
     0.25,
     3000
    ],
    [
     1,
     2400
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.5,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.6,
   "rough": 32
  },
  "sjol": {
   "dur_ms": 170,
   "pitch": [
    [
     0,
     2000
    ],
    [
     0.4,
     2400
    ],
    [
     1,
     1800
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.55,
   "rough": 26,
   "tension": -8
  }
 },
 "types": {
  "song": {
   "pause_s": [
    2.0,
    6.0
   ],
   "length_s": [
    1.8,
    4.0
   ],
   "transpose_st": 0.6,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     14,
     22
    ],
    "vo_tension": [
     46,
     58
    ],
    "vo_rough": [
     24,
     36
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 2,
     "sections": [
      {
       "pool": [
        "ch1",
        "ch2",
        "ch3"
       ],
       "count": [
        5,
        12
       ],
       "share": 0.5,
       "gap_ms": [
        30,
        80
       ],
       "no_adjacent_repeat": true
      },
      {
       "pool": [
        "sjaek"
       ],
       "count": [
        2,
        2
       ],
       "share": 0.2,
       "gap_ms": [
        70,
        110
       ]
      },
      {
       "pool": [
        "sjol"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.1,
       "gap_ms": [
        60,
        90
       ],
       "lead_gap_ms": [
        60,
        100
       ]
      },
      {
       "pool": [
        "ch1",
        "ch2",
        "ch3"
       ],
       "count": [
        3,
        8
       ],
       "share": 0.2,
       "gap_ms": [
        30,
        80
       ],
       "no_adjacent_repeat": true,
       "chance": 0.6
      }
     ]
    },
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "ch1",
        "ch2",
        "ch3"
       ],
       "count": [
        8,
        16
       ],
       "share": 0.8,
       "gap_ms": [
        30,
        80
       ],
       "no_adjacent_repeat": true
      },
      {
       "pool": [
        "sjaek"
       ],
       "count": [
        1,
        2
       ],
       "share": 0.2,
       "gap_ms": [
        70,
        110
       ]
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,Ni=`{
  "_note": "Sound design starting values for the fieldfare, M11 batch 2. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 2600,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 18,
    "vo_tension": 52,
    "vo_trill": 0,
    "vo_rough": 30,
    "ph_tempo": 100,
    "ph_pause": 4.0,
    "ph_length": 2.6,
    "ph_variation": 55,
    "su_distance": 20,
    "su_wind": 1.5,
    "su_space": 40
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}
`,Ri=`{
 "_note": "Field guide text for this bird, both languages. Facts come from birds.md (M11 batch 1, SNL). A field with verified false is not shown as a fact: empty means not described, and the text says what the sources leave out. Norwegian wording is mine, Eirik to check. calendar rows: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/chloris-chloris",
 "facts": {
  "length": {
   "en": "15 cm, about a house sparrow",
   "no": "15 cm, omtrent som en gråspurv",
   "verified": true
  },
  "broods": {
   "en": "",
   "no": "",
   "verified": false
  },
  "range": {
   "en": "Most in the south, north to Sør-Varanger",
   "no": "Flest i sør, nord til Sør-Varanger",
   "verified": true
  },
  "habitat": {
   "en": "Open farmland with dense trees and bushes",
   "no": "Åpent kulturlandskap med tette trær og busker",
   "verified": true
  },
  "food": {
   "en": "Seeds; common at feeders",
   "no": "Frø; vanlig på fôringsbrett",
   "verified": true
  },
  "status": {
   "en": "VU, vulnerable, Norwegian red list",
   "no": "VU, sårbar, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "In dense juniper or larger trees, 5 to 6 eggs",
   "no": "I tett einer eller større trær, 5 til 6 egg",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Sings, also in a song flight",
   "no": "Synger, også i sangflukt",
   "verified": true
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "A short, monotonous, characteristic reeling sound, like the brambling's song but not as harsh, rising at the end. The male may sing in a stiff-winged song flight in wide circles.",
  "no": "En kort, monoton og karakteristisk snerring, lik bjørkefinkens sang men ikke så hard, og stigende mot slutten. Hannen kan synge i sangflukt med stive vinger i store sirkler.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "A short reeling, rising at the end.",
   "no": "En kort snerring, stigende mot slutten.",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "parts": {},
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "????????????",
  "note": {
   "en": "Resident and wanderer; part of the population leaves in autumn. The sources do not give its singing months.",
   "no": "Stand- og streiffugl; en del forlater landet om høsten. Kildene oppgir ikke månedene med sang.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "name": {
    "en": "Siskin",
    "no": "Grønnsisik"
   },
   "text": {
    "en": "Young birds look alike, grey and yellow-green. The greenfinch is much larger with a heavy cone-shaped bill; the siskin's bill is fairly long and pointed.",
    "no": "Unge fugler ligner, grå og gulgrønne. Grønnfinken er mye større med kraftig, kjegleformet nebb; grønnsisiken har et ganske langt, spisst nebb.",
    "verified": true
   }
  }
 ]
}
`,Ai=`{
 "_note": "Greenfinch ink plate in a 280x240 box, drawn in M11 from the chaffinch plate, not from a design: green-yellow breast in shadow tone, a yellow edge on the wing (face), a heavier cone-shaped bill. The female is greyer with a faintly streaked back (SNL). The juvenile is not described in SNL's text and is drawn as the female.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M198 72 C196 58 182 52 168 56 C152 60 140 74 132 92 C120 112 114 132 116 150 C120 166 132 176 148 178 C166 180 182 170 190 152 C198 134 200 108 199 92 C200 86 201 82 200 80 Z",
  "wing": "M158 94 C164 120 150 148 120 160 C124 138 134 112 158 94 Z"
 },
 "layers": [
  {
   "path": "M14 206 C80 202 150 199 268 194",
   "stroke": 4
  },
  {
   "path": "M214 197 l20 -20 M224 187 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 177 q10 -10 18 -2 q-9 8 -18 2 Z M240 190 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M120 150 L80 200 L92 208 L132 166 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M124 156 L84 203 M128 162 L88 206",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M148 178 L148 199 M162 176 L163 198 M140 201 L148 199 L156 201 M155 199 L163 198 L171 200",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "path": "M200 80 C194 84 188 84 182 80 C174 84 168 92 164 104 C160 120 162 138 172 154 C178 162 184 168 188 170 L216 170 L216 78 Z",
   "fill": "breast",
   "within": "body"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "path": "M156 100 L128 146 L134 149 L160 104 Z",
   "fill": "wingbar",
   "stroke": 1,
   "within": "wing"
  },
  {
   "variant": "streaks",
   "stroke": 1.2,
   "within": "body"
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    184,
    72
   ],
   "pupil": 2.4
  },
  {
   "path": "M184.6 71.4 m-1.2 0 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0",
   "fill": "face"
  },
  {
   "path": "M195 66 L217 76 L200 79 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M200 79 L215 78 L198 87 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M226 66 A14 14 0 0 1 226 90 M233 58 A24 24 0 0 1 233 98 M240 50 A34 34 0 0 1 240 106",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "hatch": {
  "body": {
   "rect": [
    112,
    50,
    204,
    182
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    118,
    90,
    166,
    164
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    200,
    74
   ],
   "deg": -14
  },
  "lower": {
   "at": [
    200,
    79
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    126,
    158
   ],
   "deg": -6
  }
 },
 "variants": {
  "male": {
   "body_pitch": 9,
   "wing_pitch": 4,
   "eye_ring": 0,
   "bill": "shadow",
   "breast": "shadow",
   "wingbar": "face",
   "streaks": ""
  },
  "female": {
   "body_pitch": 6,
   "wing_pitch": 4,
   "eye_ring": 0,
   "bill": "shadow",
   "breast": "face",
   "wingbar": "face",
   "streaks": "M150 74 l-6 8 M160 70 l-6 8 M142 86 l-6 8 M154 84 l-6 8 M134 100 l-6 8"
  },
  "juvenile": {
   "body_pitch": 6,
   "wing_pitch": 4,
   "eye_ring": 0,
   "bill": "shadow",
   "breast": "face",
   "wingbar": "face",
   "streaks": "M150 74 l-6 8 M160 70 l-6 8 M142 86 l-6 8 M154 84 l-6 8 M134 100 l-6 8"
  }
 },
 "callouts": [
  {
   "id": "bill",
   "leader": "M206 74 L206 23",
   "at": [
    206,
    10
   ],
   "align": "centre",
   "male": {
    "en": "STOUT, CONE-SHAPED",
    "no": "KRAFTIG, KJEGLEFORMET",
    "verified": true
   },
   "female": {
    "en": "STOUT, CONE-SHAPED",
    "no": "KRAFTIG, KJEGLEFORMET",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M146 96 L112 104",
   "at": [
    108,
    98
   ],
   "align": "right",
   "male": {
    "en": "GREEN-YELLOW",
    "no": "GRØNNGUL",
    "verified": true
   },
   "female": {
    "en": "GREYER, STREAKED BACK",
    "no": "GRÅERE, STREKET RYGG",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "wing",
   "leader": "M140 126 L104 144",
   "at": [
    100,
    140
   ],
   "align": "right",
   "male": {
    "en": "YELLOW",
    "no": "GUL",
    "verified": true
   },
   "female": {
    "en": "LESS YELLOW",
    "no": "MINDRE GUL",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Male. Green-yellow, yellow on the wing.",
   "no": "Hann. Grønngul, gult på vingen.",
   "verified": true
  },
  "female": {
   "en": "Female. Greyer, faintly streaked back.",
   "no": "Hunn. Gråere, svakt streket rygg.",
   "verified": true
  },
  "juvenile": {
   "en": "Juvenile. Not described in the sources.",
   "no": "Ungfugl. Ikke beskrevet i kildene.",
   "verified": false
  }
 }
}
`,ji=`{
 "_note": "Greenfinch, M11 batch 1. Verified (birds.md, SNL): a short, monotonous, characteristic reeling sound, like the brambling's song but not as harsh, rising at the end. Design: one drawn-out buzzy note of 0,7 to 1,1 s around 3 to 4 kHz, its buzz a fast amplitude trill, gliding up over the last third; sometimes two in a row. Pitch, length and buzz rate are guesses. No call type: SNL describes none.",
 "syllables": {
  "reel": {
   "dur_ms": 900,
   "pitch": [
    [
     0,
     3100
    ],
    [
     0.6,
     3200
    ],
    [
     1,
     4300
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     0.9
    ],
    [
     0.7,
     1
    ],
    [
     0.95,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "rough": 6,
   "trill": {
    "hz": 55,
    "depth_st": 0.4,
    "am": 0.65
   }
  },
  "reel2": {
   "dur_ms": 1100,
   "pitch": [
    [
     0,
     3000
    ],
    [
     0.65,
     3150
    ],
    [
     1,
     4100
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     0.9
    ],
    [
     0.7,
     1
    ],
    [
     0.95,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "rough": 6,
   "trill": {
    "hz": 50,
    "depth_st": 0.4,
    "am": 0.65
   }
  },
  "reel3": {
   "dur_ms": 700,
   "pitch": [
    [
     0,
     3300
    ],
    [
     0.55,
     3350
    ],
    [
     1,
     4500
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     0.9
    ],
    [
     0.7,
     1
    ],
    [
     0.95,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "rough": 6,
   "trill": {
    "hz": 60,
    "depth_st": 0.4,
    "am": 0.65
   }
  }
 },
 "types": {
  "song": {
   "pause_s": [
    3.0,
    7.0
   ],
   "length_s": [
    0.7,
    2.6
   ],
   "transpose_st": 0.5,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     18,
     26
    ],
    "vo_tension": [
     42,
     54
    ],
    "vo_rough": [
     20,
     32
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 3,
     "sections": [
      {
       "pool": [
        "reel",
        "reel2",
        "reel3"
       ],
       "count": [
        1,
        1
       ],
       "share": 1.0,
       "gap_ms": [
        200,
        300
       ]
      }
     ]
    },
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "reel",
        "reel3"
       ],
       "count": [
        2,
        2
       ],
       "share": 1.0,
       "gap_ms": [
        300,
        600
       ]
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,Ii=`{
  "_note": "Sound design starting values for the greenfinch, M11 batch 1. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 3600,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 22,
    "vo_tension": 48,
    "vo_trill": 0,
    "vo_rough": 26,
    "ph_tempo": 100,
    "ph_pause": 4.0,
    "ph_length": 1.2,
    "ph_variation": 30,
    "su_distance": 15,
    "su_wind": 1.5,
    "su_space": 40
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}
`,Bi=`{
 "_note": "Field guide text for the yellowhammer, both languages. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/emberiza-citrinella",
 "facts": {
  "length": {
   "en": "16 to 16,5 cm, 20 to 36,5 g",
   "no": "16 til 16,5 cm, 20 til 36,5 g",
   "verified": true
  },
  "broods": {
   "en": "3 to 5 eggs; the female sits 12 to 14 days; usually one brood in Norway",
   "no": "3 til 5 egg; hunnen ruger i 12 til 14 dager; vanligvis ett kull i Norge",
   "verified": true
  },
  "range": {
   "en": "Common in farmland over much of the country, fewer in the north; 100 000 to 200 000 pairs (2015)",
   "no": "Vanlig i kulturlandskapet i store deler av landet, færre i nord; 100 000 til 200 000 par (2015)",
   "verified": true
  },
  "habitat": {
   "en": "Farmland, often near the forest edge",
   "no": "Kulturlandskap, ofte nær skogkanten",
   "verified": true
  },
  "food": {
   "en": "Mainly seeds; insects in the breeding season",
   "no": "Mest frø; insekter i hekketiden",
   "verified": true
  },
  "status": {
   "en": "VU, vulnerable, Norwegian red list",
   "no": "VU, sårbar, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "Well hidden on or near the ground: dry grass, lined with fine straw and hair",
   "no": "Godt skjult på eller nær bakken: tørt gress, fôret med fine strå og hår",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "",
   "no": "",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "A quick series, “zi-zi-zi-zi-zi-zi-ziiiiiii”, which many hear as counting to seven; the count can vary from five to twelve.",
  "no": "En rask serie, «zi-zi-zi-zi-zi-zi-ziiiiiii», som mange beskriver som å telle til sju; antallet kan variere fra fem til tolv.",
  "verified": true
 },
 "mnemonic": {
  "en": "Counting to seven: zi-zi-zi-zi-zi-zi-ziiii.",
  "no": "Teller til sju: zi-zi-zi-zi-zi-zi-ziiii.",
  "verified": true
 },
 "types": {
  "song": {
   "en": "“zi-zi-zi-zi-zi-zi-ziiiiiii”, five to twelve notes.",
   "no": "«zi-zi-zi-zi-zi-zi-ziiiiiii», fem til tolv toner.",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "parts": {
  "zi": {
   "en": "ZI-ZI-ZI",
   "no": "ZI-ZI-ZI",
   "verified": true
  },
  "ziii": {
   "en": "ZIIIIIII",
   "no": "ZIIIIIII",
   "verified": true
  }
 },
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "????????????",
  "note": {
   "en": "Mainly resident and wandering; some leave Norway in winter. The nest is built in May to June.",
   "no": "Mest standfugl og streiffugl; noen forlater landet om vinteren. Reiret bygges i mai til juni.",
   "verified": true
  }
 },
 "lookalikes": []
}
`,Oi=`{
 "_note": "Yellowhammer ink plate in a 280x240 box, M11 batch 7, built from the willow warbler plate: male with a yellow head with dark markings (face with thin ink marks), yellow underside (face), reddish-brown and olive breast patch and reddish-brown rump (shadow); the female and juvenile much less yellow (the head hatched) (birds.md, SNL).",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M198 70 C196 56 180 50 166 56 C152 62 142 76 132 92 C120 110 110 130 108 150 C110 160 118 168 126 172 C146 182 170 174 180 156 C192 136 199 108 199 90 C200 86 201 82 200 80 Z",
  "wing": "M156 92 C164 118 148 148 112 160 C118 138 130 110 156 92 Z"
 },
 "layers": [
  {
   "path": "M14 206 C80 202 150 199 268 194",
   "stroke": 4
  },
  {
   "path": "M214 197 l20 -20 M224 187 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 177 q10 -10 18 -2 q-9 8 -18 2 Z M240 190 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M114 146 L62 204 L74 214 L126 166 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M118 152 L66 207 M122 159 L70 211",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M142 176 L144 199 M156 175 L159 198 M136 201 L144 199 L152 201 M151 199 L159 198 L167 200",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "variant": "under",
   "fill": "face",
   "within": "body"
  },
  {
   "variant": "head",
   "fill": "face",
   "within": "body"
  },
  {
   "variant": "marks",
   "fill": "ink",
   "within": "body"
  },
  {
   "variant": "breastpatch",
   "fill": "shadow",
   "within": "body"
  },
  {
   "path": "M120 136 C114 146 112 156 116 162 C122 156 128 146 130 138 Z",
   "fill": "shadow",
   "within": "body"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    182,
    68
   ],
   "pupil": 2.4
  },
  {
   "path": "M182.4 66.8 m-0.9 0 a0.9 0.9 0 1 0 1.8 0 a0.9 0.9 0 1 0 -1.8 0",
   "fill": "face"
  },
  {
   "path": "M198 69 L218 75 L200 77 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M200 77 L216 76 L200 80 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M226 64 A14 14 0 0 1 226 88 M233 56 A24 24 0 0 1 233 96 M240 48 A34 34 0 0 1 240 104",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "hatch": {
  "body": {
   "rect": [
    104,
    50,
    204,
    184
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    108,
    88,
    166,
    164
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    200,
    74
   ],
   "deg": -14
  },
  "lower": {
   "at": [
    200,
    79
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    120,
    156
   ],
   "deg": -5
  }
 },
 "variants": {
  "male": {
   "body_pitch": 7,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow",
   "under": "M199 84 C196 108 190 134 180 156 C170 174 146 182 126 172 C140 170 156 160 166 144 C178 124 188 102 192 84 Z",
   "head": "M160 54 C170 48 186 48 196 58 C200 66 200 76 199 84 C188 86 172 84 160 78 C156 70 156 60 160 54 Z",
   "marks": "M166 62 L184 58 L184 60.5 L166 64.5 Z M170 76 L190 78 L190 80.5 L170 78.5 Z",
   "breastpatch": "M197 92 C195 104 191 114 186 120 C182 112 184 100 190 92 Z"
  },
  "female": {
   "body_pitch": 7,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow",
   "under": "M199 84 C196 108 190 134 180 156 C170 174 146 182 126 172 C140 170 156 160 166 144 C178 124 188 102 192 84 Z",
   "head": "",
   "marks": "",
   "breastpatch": ""
  },
  "juvenile": {
   "body_pitch": 7,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow",
   "under": "M199 84 C196 108 190 134 180 156 C170 174 146 182 126 172 C140 170 156 160 166 144 C178 124 188 102 192 84 Z",
   "head": "",
   "marks": "",
   "breastpatch": ""
  }
 },
 "callouts": [
  {
   "id": "head",
   "leader": "M176 54 L126 30",
   "at": [
    122,
    24
   ],
   "align": "right",
   "male": {
    "en": "YELLOW, DARK MARKINGS",
    "no": "GUL, MØRKE TEGNINGER",
    "verified": true
   },
   "female": {
    "en": "MUCH LESS YELLOW",
    "no": "MYE MINDRE GUL",
    "verified": true
   },
   "juvenile": {
    "en": "MUCH LESS YELLOW",
    "no": "MYE MINDRE GUL",
    "verified": true
   }
  },
  {
   "id": "breast",
   "leader": "M188 110 L232 200",
   "at": [
    276,
    212
   ],
   "align": "right",
   "male": {
    "en": "YELLOW, RUST AND OLIVE",
    "no": "GUL, RUSTBRUN OG OLIVEN",
    "verified": true
   },
   "female": {
    "en": "",
    "no": "",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M124 150 L74 120",
   "at": [
    70,
    112
   ],
   "align": "right",
   "male": {
    "en": "RUST-BROWN RUMP",
    "no": "RØDBRUN OVERGUMP",
    "verified": true
   },
   "female": {
    "en": "RUST-BROWN RUMP",
    "no": "RØDBRUN OVERGUMP",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Male. Beak and tail follow the sound.",
   "no": "Hann. Nebb og hale følger lyden.",
   "verified": true
  },
  "female": {
   "en": "Female. Much less yellow.",
   "no": "Hunn. Mye mindre gul.",
   "verified": true
  },
  "juvenile": {
   "en": "Juvenile. Much less yellow.",
   "no": "Ungfugl. Mye mindre gul.",
   "verified": true
  }
 }
}
`,Hi=`{
 "_note": "Yellowhammer, M11 batch 7. Verified by SNL: «zi-zi-zi-zi-zi-zi-ziiiiiii», a quick series that many hear as counting to seven, varying from five to twelve. Pitch and timing are sound design guesses: buzzy 'zi' notes about 5 kHz, then one drawn-out end note. Parts named from the transcription.",
 "syllables": {
  "zi": {
   "dur_ms": 85,
   "pitch": [
    [
     0,
     5300
    ],
    [
     0.4,
     5500
    ],
    [
     1,
     5000
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "rough": 14
  },
  "zi2": {
   "dur_ms": 80,
   "pitch": [
    [
     0,
     5200
    ],
    [
     0.4,
     5450
    ],
    [
     1,
     4950
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.68,
   "rough": 14
  },
  "ziii": {
   "dur_ms": 850,
   "pitch": [
    [
     0,
     5100
    ],
    [
     0.2,
     5250
    ],
    [
     1,
     4700
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.04,
     0.9
    ],
    [
     0.5,
     1
    ],
    [
     0.9,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "rough": 18
  },
  "ziii2": {
   "dur_ms": 700,
   "pitch": [
    [
     0,
     4400
    ],
    [
     0.2,
     4600
    ],
    [
     1,
     4200
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.04,
     0.9
    ],
    [
     0.5,
     1
    ],
    [
     0.9,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.68,
   "rough": 18
  }
 },
 "types": {
  "song": {
   "pause_s": [
    3.0,
    9.0
   ],
   "length_s": [
    1.6,
    2.8
   ],
   "transpose_st": 0.6,
   "avoid_repeat": false,
   "bout": [
    3,
    10
   ],
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     16,
     26
    ],
    "vo_tension": [
     66,
     80
    ],
    "vo_rough": [
     14,
     22
    ],
    "ph_tempo": [
     96,
     104
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "zi",
        "zi2"
       ],
       "count": [
        4,
        11
       ],
       "share": 0.6,
       "gap_ms": [
        55,
        85
       ],
       "part": "zi",
       "no_adjacent_repeat": false
      },
      {
       "pool": [
        "ziii",
        "ziii2"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.4,
       "gap_ms": [
        40,
        40
       ],
       "part": "ziii",
       "lead_gap_ms": [
        60,
        110
       ]
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,Gi=`{
 "_note": "Sound design starting values for the yellowhammer, M11 batch 7. Not bird facts.",
 "pitch_ref_hz": 5000,
 "base": {
  "vo_pitch": 1.0,
  "vo_breath": 20,
  "vo_tension": 72,
  "vo_trill": 0,
  "vo_rough": 16,
  "ph_tempo": 100,
  "ph_pause": 5.0,
  "ph_length": 2.2,
  "ph_variation": 50,
  "su_distance": 30,
  "su_wind": 1.5,
  "su_space": 35
 },
 "ranges": {
  "vo_pitch": [
   0.5,
   2.0
  ],
  "vo_breath": [
   0,
   100
  ],
  "vo_tension": [
   0,
   100
  ],
  "vo_trill": [
   0,
   40
  ],
  "vo_rough": [
   0,
   100
  ],
  "ph_tempo": [
   50,
   200
  ],
  "ph_pause": [
   0.2,
   20
  ],
  "ph_length": [
   0.2,
   8
  ],
  "ph_variation": [
   0,
   100
  ],
  "su_distance": [
   1,
   200
  ],
  "su_wind": [
   0,
   15
  ],
  "su_space": [
   0,
   100
  ]
 }
}
`,Di=`{
 "_note": "Field guide text for the golden plover, both languages. SNL gives no transcription, so the shape of the whistle is [TO VERIFY]. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/pluvialis-apricaria",
 "facts": {
  "length": {
   "en": "25 to 28 cm, about the size of a lapwing",
   "no": "25 til 28 cm, omtrent som ei vipe",
   "verified": true
  },
  "broods": {
   "en": "Usually 4 eggs, mostly the first half of June; both sit 27 to 31 days",
   "no": "Vanligvis 4 egg, mest første halvdel av juni; begge ruger i 27 til 31 dager",
   "verified": true
  },
  "range": {
   "en": "Mountains over much of the country, the coast from Møre northwards; 150 000 to 300 000 pairs",
   "no": "Fjellet i store deler av landet, kysten fra Møre og nordover; 150 000 til 300 000 par",
   "verified": true
  },
  "habitat": {
   "en": "Open ground with short vegetation: bogs and heaths",
   "no": "Åpne vidder med lav vegetasjon: myrer og lyngheier",
   "verified": true
  },
  "food": {
   "en": "Insects, snails, worms, crustaceans and spiders; berries and seeds in summer",
   "no": "Insekter, snegler, børstemark, krepsdyr og edderkopper; bær og frø om sommeren",
   "verified": true
  },
  "status": {
   "en": "NT, near threatened, Norwegian red list",
   "no": "NT, nær truet, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "A simple scrape, lined with a little dry plant material",
   "no": "En enkel grop, fôret med litt tørt plantemateriale",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "",
   "no": "",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "In the breeding season very mournful whistling tones that can go on for hours, easy to tell from other sounds in the mountains, and carrying far. SNL gives no transcription, so the whistle Pipp plays is a stand-in. Summer plumage: golden-spotted back, black chin, breast and belly framed in white.",
  "no": "I hekketiden svært sørgmodige, fløytende toner som kan vare i timevis, lette å skille fra andre lyder på fjellet, og som bærer langt. SNL gir ingen gjengivelse, så fløyten Pipp spiller er en stedfortreder. Sommerdrakt: gulflekket rygg, svart hake, bryst og buk med hvit kant.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "Very mournful whistling tones in the breeding season, for hours.",
   "no": "Svært sørgmodige, fløytende toner i hekketiden, i timevis.",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "calendar": {
  "present": "nnnyyyyyyynn",
  "sings": "????????????",
  "note": {
   "en": "Migrant: arrives April and May, leaves late July to October; winters in western Europe and around the Mediterranean. Eggs mostly in the first half of June.",
   "no": "Trekkfugl: kommer i april og mai, drar fra slutten av juli til oktober; overvintrer i Vest-Europa og rundt Middelhavet. Egg mest i første halvdel av juni.",
   "verified": true
  }
 },
 "lookalikes": []
}
`,Pi=`{
 "_note": "Golden plover ink plate in a 280x240 box, M11 batch 6, built from the curlew plate: summer plumage, back densely spotted golden-yellow (hatching with shadow spots), black chin, breast and belly (ink; the female's duller, drawn in shadow), short black bill, blackish-brown legs (birds.md, SNL). The white border is in the callout only. The juvenile is not described and is drawn like the female, [TO VERIFY].",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M178 74 C178 62 168 56 158 58 C148 60 144 68 144 78 C120 86 96 98 76 114 C100 128 124 138 146 140 C166 142 176 130 176 114 C176 100 178 88 178 74 Z",
  "wing": "M150 92 C126 94 100 104 76 114 C60 120 48 124 40 128 C60 130 90 128 116 122 C138 116 150 106 150 92 Z"
 },
 "hatch": {
  "body": {
   "rect": [
    74,
    54,
    180,
    144
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    38,
    88,
    152,
    132
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    176,
    72
   ],
   "deg": -6
  },
  "lower": {
   "at": [
    176,
    76
   ],
   "deg": 4
  },
  "tail": {
   "at": [
    78,
    116
   ],
   "deg": -3
  }
 },
 "layers": [
  {
   "path": "M14 214 C70 206 150 204 268 208",
   "stroke": 2.5
  },
  {
   "path": "M40 214 q8 -5 16 0 M210 210 q8 -4 16 0",
   "stroke": 1
  },
  {
   "path": "M124 138 L118 206 M140 140 L144 206 M108 207 L118 206 L128 208 M134 207 L144 206 L154 208",
   "stroke": 1.5
  },
  {
   "path": "M78 112 L52 118 L56 126 L82 122 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "variant": "belly",
   "fill": "black",
   "within": "body"
  },
  {
   "variant": "spots",
   "fill": "shadow",
   "within": "body"
  },
  {
   "clip": "wing",
   "fill": "face"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    164,
    68
   ],
   "pupil": 2.2
  },
  {
   "path": "M176 70 L198 73 L176 75 Z",
   "fill": "bill",
   "stroke": 1.4,
   "part": "upper"
  },
  {
   "path": "M176 75 L196 74 L176 78 Z",
   "fill": "bill",
   "stroke": 1.4,
   "part": "lower"
  },
  {
   "path": "M120 40 A14 14 0 0 0 120 66 M113 32 A24 24 0 0 0 113 74",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "variants": {
  "male": {
   "body_pitch": 7,
   "wing_pitch": 6,
   "eye_ring": 0,
   "bill": "ink",
   "spots": "M150 66 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M160 62 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M156 74 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M120 96 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M132 92 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M106 104 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M118 106 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M94 110 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M140 100 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M128 104 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z",
   "belly": "M178 76 C176 92 176 106 176 114 C176 130 166 142 146 140 C124 138 100 128 80 116 C108 122 138 120 158 106 C168 98 172 88 174 76 Z",
   "black": "ink"
  },
  "female": {
   "body_pitch": 7,
   "wing_pitch": 6,
   "eye_ring": 0,
   "bill": "ink",
   "spots": "M150 66 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M160 62 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M156 74 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M120 96 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M132 92 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M106 104 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M118 106 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M94 110 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M140 100 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M128 104 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z",
   "belly": "M178 76 C176 92 176 106 176 114 C176 130 166 142 146 140 C124 138 100 128 80 116 C108 122 138 120 158 106 C168 98 172 88 174 76 Z",
   "black": "shadow"
  },
  "juvenile": {
   "body_pitch": 7,
   "wing_pitch": 6,
   "eye_ring": 0,
   "bill": "ink",
   "spots": "M150 66 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M160 62 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M156 74 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M120 96 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M132 92 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M106 104 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M118 106 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M94 110 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M140 100 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z M128 104 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 Z",
   "belly": "M178 76 C176 92 176 106 176 114 C176 130 166 142 146 140 C124 138 100 128 80 116 C108 122 138 120 158 106 C168 98 172 88 174 76 Z",
   "black": "shadow"
  }
 },
 "callouts": [
  {
   "id": "bill",
   "leader": "M190 72 L226 50",
   "at": [
    230,
    37
   ],
   "align": "centre",
   "male": {
    "en": "BLACK",
    "no": "SVART",
    "verified": true
   },
   "female": {
    "en": "BLACK",
    "no": "SVART",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M112 118 L80 160",
   "at": [
    76,
    172
   ],
   "align": "centre",
   "male": {
    "en": "GOLD-SPOTTED BACK",
    "no": "GULFLEKKET RYGG",
    "verified": true
   },
   "female": {
    "en": "GOLD-SPOTTED BACK",
    "no": "GULFLEKKET RYGG",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "breast",
   "leader": "M170 116 L222 160",
   "at": [
    226,
    172
   ],
   "align": "centre",
   "male": {
    "en": "BLACK, WHITE EDGE",
    "no": "SVART, HVIT KANT",
    "verified": true
   },
   "female": {
    "en": "DULLER BLACK",
    "no": "MATTERE SVART",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Male in summer. Beak and tail follow the sound.",
   "no": "Hann om sommeren. Nebb og hale følger lyden.",
   "verified": true
  },
  "female": {
   "en": "Female. Duller black.",
   "no": "Hunn. Mattere svart.",
   "verified": true
  },
  "juvenile": {
   "en": "Young bird. Not described in the sources, so drawn like the female.",
   "no": "Ungfugl. Ikke beskrevet i kildene, så tegnet som hunnen.",
   "verified": false
  }
 }
}
`,zi=`{
 "_note": "Golden plover, M11 batch 6. SNL: in the breeding season very mournful whistling tones that can go on for hours, easy to tell from other mountain birds. No transcription, so the shape is a sound design guess: one soft, slightly falling whistle about 2,0 to 2,4 kHz, repeated every 2 to 4 s; sometimes a two-part variant. Off in autumn and winter.",
 "syllables": {
  "tluu": {
   "dur_ms": 520,
   "pitch": [
    [
     0,
     2350
    ],
    [
     0.2,
     2420
    ],
    [
     1,
     2050
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     0.9
    ],
    [
     0.4,
     1
    ],
    [
     0.85,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75,
   "tension": 20,
   "breath": -5
  },
  "tluu2": {
   "dur_ms": 460,
   "pitch": [
    [
     0,
     2300
    ],
    [
     0.25,
     2380
    ],
    [
     1,
     2000
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     0.9
    ],
    [
     0.4,
     1
    ],
    [
     0.85,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "tension": 20,
   "breath": -5
  },
  "plyy": {
   "dur_ms": 620,
   "pitch": [
    [
     0,
     2050
    ],
    [
     0.3,
     2300
    ],
    [
     0.55,
     2350
    ],
    [
     1,
     2000
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     0.8
    ],
    [
     0.35,
     0.9
    ],
    [
     0.45,
     0.25
    ],
    [
     0.55,
     0.9
    ],
    [
     0.85,
     0.6
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "tension": 20,
   "breath": -5
  }
 },
 "types": {
  "song": {
   "pause_s": [
    1.8,
    4.0
   ],
   "length_s": [
    0.4,
    0.8
   ],
   "transpose_st": 0.5,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     16,
     26
    ],
    "vo_tension": [
     84,
     94
    ],
    "vo_rough": [
     0,
     4
    ],
    "ph_tempo": [
     96,
     104
    ]
   },
   "phrases": [
    {
     "weight": 3,
     "sections": [
      {
       "pool": [
        "tluu",
        "tluu2"
       ],
       "count": [
        1,
        1
       ],
       "share": 1.0,
       "gap_ms": [
        100,
        100
       ]
      }
     ]
    },
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "plyy"
       ],
       "count": [
        1,
        1
       ],
       "share": 1.0,
       "gap_ms": [
        100,
        100
       ]
      }
     ]
    }
   ],
   "overrides": [
    {
     "_note": "In the breeding season (SNL).",
     "when": {
      "season": "autumn"
     },
     "active": false
    },
    {
     "when": {
      "season": "winter"
     },
     "active": false
    }
   ]
  }
 }
}
`,Zi=`{
 "_note": "Sound design starting values for the golden plover, M11 batch 6. Not bird facts.",
 "pitch_ref_hz": 2200,
 "base": {
  "vo_pitch": 1.0,
  "vo_breath": 20,
  "vo_tension": 90,
  "vo_trill": 0,
  "vo_rough": 2,
  "ph_tempo": 100,
  "ph_pause": 2.8,
  "ph_length": 0.6,
  "ph_variation": 50,
  "su_distance": 60,
  "su_wind": 1.5,
  "su_space": 55
 },
 "ranges": {
  "vo_pitch": [
   0.5,
   2.0
  ],
  "vo_breath": [
   0,
   100
  ],
  "vo_tension": [
   0,
   100
  ],
  "vo_trill": [
   0,
   40
  ],
  "vo_rough": [
   0,
   100
  ],
  "ph_tempo": [
   50,
   200
  ],
  "ph_pause": [
   0.2,
   20
  ],
  "ph_length": [
   0.2,
   8
  ],
  "ph_variation": [
   0,
   100
  ],
  "su_distance": [
   1,
   200
  ],
  "su_wind": [
   0,
   15
  ],
  "su_space": [
   0,
   100
  ]
 }
}
`,Fi=`{
 "_note": "Field guide text for the meadow pipit, both languages. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/anthus-pratensis",
 "facts": {
  "length": {
   "en": "",
   "no": "",
   "verified": false
  },
  "broods": {
   "en": "Usually 5 to 6 eggs, 11 to 15 days",
   "no": "Vanligvis 5 til 6 egg, 11 til 15 dager",
   "verified": true
  },
  "range": {
   "en": "The whole country, coast to high mountains; 7 to 8 million birds",
   "no": "Hele landet, fra kysten til høyt på snaufjellet; 7 til 8 millioner fugler",
   "verified": true
  },
  "habitat": {
   "en": "Open landscape; one of the commonest mountain birds",
   "no": "Åpent landskap; en av de vanligste fjellfuglene",
   "verified": true
  },
  "food": {
   "en": "Mainly insects and other small animals, now and then seeds",
   "no": "Mest insekter og andre smådyr, av og til frø",
   "verified": true
  },
  "status": {
   "en": "LC, least concern, Norwegian red list",
   "no": "LC, livskraftig, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "On the ground, often under a tussock; often used by the cuckoo",
   "no": "På bakken, ofte under en tue; ofte brukt av gjøken",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "",
   "no": "",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "A song flight like the tree pipit's, with a trill that speeds up. When it flies up, a characteristic “tsip-tsip-tsip”. The sources give no pitch or notes, so Pipp's version is a stand-in.",
  "no": "Sangflukt som trepiplerkas, med en trille som øker i tempo. Når den flyr opp, et karakteristisk «tsip-tsip-tsip». Kildene gir ingen tonehøyde eller toner, så Pipps versjon er en stedfortreder.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "Song flight with a trill that speeds up.",
   "no": "Sangflukt med en trille som øker i tempo.",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "Flying up: “tsip-tsip-tsip”.",
   "no": "Når den flyr opp: «tsip-tsip-tsip».",
   "verified": true
  }
 },
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "????????????",
  "note": {
   "en": "Partial migrant: most mountain birds leave, wintering from the Netherlands to Iberia; some coastal birds stay, from Trondheimsfjorden to Oslofjorden.",
   "no": "Delvis trekkfugl: de fleste fjellfuglene drar og overvintrer fra Nederland til Den iberiske halvøy; noen kystfugler blir, fra Trondheimsfjorden til Oslofjorden.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "name": {
    "en": "Tree pipit",
    "no": "Trepiplerke"
   },
   "text": {
    "en": "Its song-flight trill is stronger and darker and ends in a drawn-out “seee-er, seee-er, seee-er”, which the meadow pipit lacks.",
    "no": "Trillen i sangflukten er kraftigere og mørkere og ender i et utdratt «seee-er, seee-er, seee-er», som heipiplerka mangler.",
    "verified": true
   }
  }
 ]
}
`,Ki=`{
 "_note": "Meadow pipit ink plate in a 280x240 box, M11 batch 6, built from the willow warbler plate: grey-brown and mottled (hatching and short streaks), grey-white belly, the two outer tail feathers white (birds.md, SNL). Bill, legs, hind claw, sexes and juvenile are not described.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M198 70 C196 56 180 50 166 56 C152 62 142 76 132 92 C120 110 110 130 108 150 C110 160 118 168 126 172 C146 182 170 174 180 156 C192 136 199 108 199 90 C200 86 201 82 200 80 Z",
  "wing": "M156 92 C164 118 148 148 112 160 C118 138 130 110 156 92 Z"
 },
 "layers": [
  {
   "path": "M14 206 C80 202 150 199 268 194",
   "stroke": 4
  },
  {
   "path": "M214 197 l20 -20 M224 187 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 177 q10 -10 18 -2 q-9 8 -18 2 Z M240 190 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M114 146 L62 204 L74 214 L126 166 Z",
   "fill": "shadow",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M114 146 L62 204 L67 208 L118 151 Z",
   "fill": "face",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M118 152 L66 207 M122 159 L70 211",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M142 176 L144 199 M156 175 L159 198 M136 201 L144 199 L152 201 M151 199 L159 198 L167 200",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "variant": "under",
   "fill": "face",
   "within": "body"
  },
  {
   "path": "M186 96 l2 5 M180 108 l2 5 M190 112 l2 5 M174 122 l2 5 M184 128 l2 5 M168 136 l2 5 M178 142 l2 4",
   "stroke": 1.4,
   "within": "body"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    182,
    68
   ],
   "pupil": 2.4
  },
  {
   "path": "M182.4 66.8 m-0.9 0 a0.9 0.9 0 1 0 1.8 0 a0.9 0.9 0 1 0 -1.8 0",
   "fill": "face"
  },
  {
   "path": "M198 69 L218 75 L200 77 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M200 77 L216 76 L200 80 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M226 64 A14 14 0 0 1 226 88 M233 56 A24 24 0 0 1 233 96 M240 48 A34 34 0 0 1 240 104",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "hatch": {
  "body": {
   "rect": [
    104,
    50,
    204,
    184
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    108,
    88,
    166,
    164
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    200,
    74
   ],
   "deg": -14
  },
  "lower": {
   "at": [
    200,
    79
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    120,
    156
   ],
   "deg": -5
  }
 },
 "variants": {
  "male": {
   "body_pitch": 7,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow",
   "under": "M199 84 C196 108 190 134 180 156 C170 174 146 182 126 172 C140 170 156 160 166 144 C178 124 188 102 192 84 Z"
  },
  "female": {
   "body_pitch": 7,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow",
   "under": "M199 84 C196 108 190 134 180 156 C170 174 146 182 126 172 C140 170 156 160 166 144 C178 124 188 102 192 84 Z"
  },
  "juvenile": {
   "body_pitch": 7,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow",
   "under": "M199 84 C196 108 190 134 180 156 C170 174 146 182 126 172 C140 170 156 160 166 144 C178 124 188 102 192 84 Z"
  }
 },
 "callouts": [
  {
   "id": "plumage",
   "leader": "M140 100 L74 86",
   "at": [
    70,
    80
   ],
   "align": "right",
   "male": {
    "en": "GREY-BROWN, MOTTLED",
    "no": "GRÅBRUN, SPRAGLETE",
    "verified": true
   },
   "female": {
    "en": "GREY-BROWN, MOTTLED",
    "no": "GRÅBRUN, SPRAGLETE",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "breast",
   "leader": "M184 130 L232 200",
   "at": [
    276,
    212
   ],
   "align": "right",
   "male": {
    "en": "GREY-WHITE BELLY",
    "no": "GRÅHVIT BUK",
    "verified": true
   },
   "female": {
    "en": "GREY-WHITE BELLY",
    "no": "GRÅHVIT BUK",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "tail",
   "leader": "M80 190 L50 160",
   "at": [
    46,
    148
   ],
   "align": "centre",
   "male": {
    "en": "WHITE OUTER FEATHERS",
    "no": "HVITE YTTERFJÆR",
    "verified": true
   },
   "female": {
    "en": "WHITE OUTER FEATHERS",
    "no": "HVITE YTTERFJÆR",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Singing. Beak and tail follow the sound.",
   "no": "Synger. Nebb og hale følger lyden.",
   "verified": true
  },
  "female": {
   "en": "Female. No difference from the male is known.",
   "no": "Hunn. Ingen kjent forskjell fra hannen.",
   "verified": false
  },
  "juvenile": {
   "en": "Juvenile. Not described in the sources, so drawn like the adult.",
   "no": "Ungfugl. Ikke beskrevet i kildene, så tegnet som de voksne.",
   "verified": false
  }
 }
}
`,Ui=`{
 "_note": "Meadow pipit, M11 batch 6. Verified by SNL: a song flight with a trill that speeds up (no drawn-out ending, unlike the tree pipit), and «tsip-tsip-tsip» when it flies up. Pitches and timing are sound design guesses: thin notes about 4 to 5,5 kHz, slow at first, then faster, then a fast trill.",
 "syllables": {
  "tsi": {
   "dur_ms": 70,
   "pitch": [
    [
     0,
     4300
    ],
    [
     0.4,
     4700
    ],
    [
     1,
     4200
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75,
   "tension": 10
  },
  "tsi2": {
   "dur_ms": 60,
   "pitch": [
    [
     0,
     4600
    ],
    [
     0.4,
     5000
    ],
    [
     1,
     4500
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75,
   "tension": 10
  },
  "ti": {
   "dur_ms": 40,
   "pitch": [
    [
     0,
     4900
    ],
    [
     1,
     4600
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.2,
     1
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "tension": 10
  },
  "tsip": {
   "dur_ms": 55,
   "pitch": [
    [
     0,
     5400
    ],
    [
     0.3,
     6000
    ],
    [
     1,
     5200
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "tension": 10
  }
 },
 "types": {
  "song": {
   "pause_s": [
    5.0,
    14.0
   ],
   "length_s": [
    2.0,
    4.0
   ],
   "transpose_st": 0.8,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     12,
     22
    ],
    "vo_tension": [
     76,
     88
    ],
    "vo_rough": [
     0,
     6
    ],
    "ph_tempo": [
     96,
     104
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "tsi",
        "tsi2"
       ],
       "count": [
        4,
        7
       ],
       "share": 0.35,
       "gap_ms": [
        150,
        220
       ],
       "no_adjacent_repeat": false
      },
      {
       "pool": [
        "tsi",
        "tsi2"
       ],
       "count": [
        5,
        9
       ],
       "share": 0.3,
       "gap_ms": [
        70,
        110
       ],
       "no_adjacent_repeat": false
      },
      {
       "pool": [
        "ti"
       ],
       "count": [
        10,
        22
       ],
       "share": 0.35,
       "gap_ms": [
        22,
        40
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": []
  },
  "flight": {
   "pause_s": [
    3.0,
    9.0
   ],
   "length_s": [
    0.2,
    0.8
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     12,
     22
    ],
    "vo_tension": [
     76,
     88
    ],
    "vo_rough": [
     0,
     6
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "tsip"
       ],
       "count": [
        2,
        4
       ],
       "share": 1.0,
       "gap_ms": [
        80,
        130
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,qi=`{
 "_note": "Sound design starting values for the meadow pipit, M11 batch 6. Not bird facts.",
 "pitch_ref_hz": 4600,
 "base": {
  "vo_pitch": 1.0,
  "vo_breath": 16,
  "vo_tension": 82,
  "vo_trill": 0,
  "vo_rough": 3,
  "ph_tempo": 100,
  "ph_pause": 8.0,
  "ph_length": 3.0,
  "ph_variation": 50,
  "su_distance": 30,
  "su_wind": 1.5,
  "su_space": 35
 },
 "ranges": {
  "vo_pitch": [
   0.5,
   2.0
  ],
  "vo_breath": [
   0,
   100
  ],
  "vo_tension": [
   0,
   100
  ],
  "vo_trill": [
   0,
   40
  ],
  "vo_rough": [
   0,
   100
  ],
  "ph_tempo": [
   50,
   200
  ],
  "ph_pause": [
   0.2,
   20
  ],
  "ph_length": [
   0.2,
   8
  ],
  "ph_variation": [
   0,
   100
  ],
  "su_distance": [
   1,
   200
  ],
  "su_wind": [
   0,
   15
  ],
  "su_space": [
   0,
   100
  ]
 }
}
`,Vi=`{
 "_note": "The birds in list order (18, plus 32 added in M11 and hatched until built), from birds.md. All 50 Norwegian, English and Latin names were checked on 2026-11-27 against GBIF (accepted Latin name, and the Norwegian and English vernacular names from its checklists, such as Catalogue of Life and Dyntaxa), so verified_names is true. An id is the Norwegian name in lower case with æ, ø, å written ae, o, a.",
 "verified_names": true,
 "groups": [
  "garden",
  "forest",
  "coast",
  "wetland",
  "mountain",
  "farmland",
  "night"
 ],
 "birds": [
  {
   "id": "kjottmeis",
   "number": "01",
   "group": "garden",
   "name": {
    "no": "Kjøttmeis",
    "en": "Great tit"
   },
   "latin": "Parus major"
  },
  {
   "id": "blameis",
   "number": "02",
   "group": "garden",
   "name": {
    "no": "Blåmeis",
    "en": "Blue tit"
   },
   "latin": "Cyanistes caeruleus"
  },
  {
   "id": "svarttrost",
   "number": "03",
   "group": "garden",
   "name": {
    "no": "Svarttrost",
    "en": "Blackbird"
   },
   "latin": "Turdus merula"
  },
  {
   "id": "rodstrupe",
   "number": "04",
   "group": "garden",
   "name": {
    "no": "Rødstrupe",
    "en": "Robin"
   },
   "latin": "Erithacus rubecula"
  },
  {
   "id": "bokfink",
   "number": "05",
   "group": "garden",
   "name": {
    "no": "Bokfink",
    "en": "Chaffinch"
   },
   "latin": "Fringilla coelebs"
  },
  {
   "id": "graspurv",
   "number": "06",
   "group": "garden",
   "name": {
    "no": "Gråspurv",
    "en": "House sparrow"
   },
   "latin": "Passer domesticus"
  },
  {
   "id": "lovsanger",
   "number": "07",
   "group": "forest",
   "name": {
    "no": "Løvsanger",
    "en": "Willow warbler"
   },
   "latin": "Phylloscopus trochilus"
  },
  {
   "id": "maltrost",
   "number": "08",
   "group": "forest",
   "name": {
    "no": "Måltrost",
    "en": "Song thrush"
   },
   "latin": "Turdus philomelos"
  },
  {
   "id": "gjok",
   "number": "09",
   "group": "forest",
   "name": {
    "no": "Gjøk",
    "en": "Cuckoo"
   },
   "latin": "Cuculus canorus"
  },
  {
   "id": "flaggspett",
   "number": "10",
   "group": "forest",
   "name": {
    "no": "Flaggspett",
    "en": "Great spotted woodpecker"
   },
   "latin": "Dendrocopos major"
  },
  {
   "id": "gjerdesmett",
   "number": "11",
   "group": "forest",
   "name": {
    "no": "Gjerdesmett",
    "en": "Wren"
   },
   "latin": "Troglodytes troglodytes"
  },
  {
   "id": "gramake",
   "number": "12",
   "group": "coast",
   "name": {
    "no": "Gråmåke",
    "en": "Herring gull"
   },
   "latin": "Larus argentatus"
  },
  {
   "id": "tjeld",
   "number": "13",
   "group": "coast",
   "name": {
    "no": "Tjeld",
    "en": "Oystercatcher"
   },
   "latin": "Haematopus ostralegus"
  },
  {
   "id": "aerfugl",
   "number": "14",
   "group": "coast",
   "name": {
    "no": "Ærfugl",
    "en": "Eider"
   },
   "latin": "Somateria mollissima"
  },
  {
   "id": "storspove",
   "number": "15",
   "group": "coast",
   "name": {
    "no": "Storspove",
    "en": "Curlew"
   },
   "latin": "Numenius arquata"
  },
  {
   "id": "kattugle",
   "number": "16",
   "group": "night",
   "name": {
    "no": "Kattugle",
    "en": "Tawny owl"
   },
   "latin": "Strix aluco"
  },
  {
   "id": "rugde",
   "number": "17",
   "group": "night",
   "name": {
    "no": "Rugde",
    "en": "Woodcock"
   },
   "latin": "Scolopax rusticola"
  },
  {
   "id": "nattergal",
   "number": "18",
   "group": "night",
   "name": {
    "no": "Nattergal",
    "en": "Thrush nightingale"
   },
   "latin": "Luscinia luscinia"
  },
  {
   "id": "skjaere",
   "number": "19",
   "group": "garden",
   "name": {
    "no": "Skjære",
    "en": "Magpie"
   },
   "latin": "Pica pica"
  },
  {
   "id": "krake",
   "number": "20",
   "group": "garden",
   "name": {
    "no": "Kråke",
    "en": "Hooded crow"
   },
   "latin": "Corvus cornix"
  },
  {
   "id": "ringdue",
   "number": "21",
   "group": "garden",
   "name": {
    "no": "Ringdue",
    "en": "Wood pigeon"
   },
   "latin": "Columba palumbus"
  },
  {
   "id": "gronnfink",
   "number": "22",
   "group": "garden",
   "name": {
    "no": "Grønnfink",
    "en": "Greenfinch"
   },
   "latin": "Chloris chloris"
  },
  {
   "id": "staer",
   "number": "23",
   "group": "garden",
   "name": {
    "no": "Stær",
    "en": "Starling"
   },
   "latin": "Sturnus vulgaris"
  },
  {
   "id": "linerle",
   "number": "24",
   "group": "garden",
   "name": {
    "no": "Linerle",
    "en": "White wagtail"
   },
   "latin": "Motacilla alba"
  },
  {
   "id": "rodvingetrost",
   "number": "25",
   "group": "forest",
   "name": {
    "no": "Rødvingetrost",
    "en": "Redwing"
   },
   "latin": "Turdus iliacus"
  },
  {
   "id": "gratrost",
   "number": "26",
   "group": "forest",
   "name": {
    "no": "Gråtrost",
    "en": "Fieldfare"
   },
   "latin": "Turdus pilaris"
  },
  {
   "id": "svarthvitfluesnapper",
   "number": "27",
   "group": "forest",
   "name": {
    "no": "Svarthvit fluesnapper",
    "en": "Pied flycatcher"
   },
   "latin": "Ficedula hypoleuca"
  },
  {
   "id": "granmeis",
   "number": "28",
   "group": "forest",
   "name": {
    "no": "Granmeis",
    "en": "Willow tit"
   },
   "latin": "Poecile montanus"
  },
  {
   "id": "fuglekonge",
   "number": "29",
   "group": "forest",
   "name": {
    "no": "Fuglekonge",
    "en": "Goldcrest"
   },
   "latin": "Regulus regulus"
  },
  {
   "id": "gransanger",
   "number": "30",
   "group": "forest",
   "name": {
    "no": "Gransanger",
    "en": "Chiffchaff"
   },
   "latin": "Phylloscopus collybita"
  },
  {
   "id": "bjorkefink",
   "number": "31",
   "group": "forest",
   "name": {
    "no": "Bjørkefink",
    "en": "Brambling"
   },
   "latin": "Fringilla montifringilla"
  },
  {
   "id": "svartspett",
   "number": "32",
   "group": "forest",
   "name": {
    "no": "Svartspett",
    "en": "Black woodpecker"
   },
   "latin": "Dryocopus martius"
  },
  {
   "id": "fiskemake",
   "number": "33",
   "group": "coast",
   "name": {
    "no": "Fiskemåke",
    "en": "Common gull"
   },
   "latin": "Larus canus"
  },
  {
   "id": "sildemake",
   "number": "34",
   "group": "coast",
   "name": {
    "no": "Sildemåke",
    "en": "Lesser black-backed gull"
   },
   "latin": "Larus fuscus"
  },
  {
   "id": "makrellterne",
   "number": "35",
   "group": "coast",
   "name": {
    "no": "Makrellterne",
    "en": "Common tern"
   },
   "latin": "Sterna hirundo"
  },
  {
   "id": "stokkand",
   "number": "36",
   "group": "wetland",
   "name": {
    "no": "Stokkand",
    "en": "Mallard"
   },
   "latin": "Anas platyrhynchos"
  },
  {
   "id": "sangsvane",
   "number": "37",
   "group": "wetland",
   "name": {
    "no": "Sangsvane",
    "en": "Whooper swan"
   },
   "latin": "Cygnus cygnus"
  },
  {
   "id": "storlom",
   "number": "38",
   "group": "wetland",
   "name": {
    "no": "Storlom",
    "en": "Black-throated diver"
   },
   "latin": "Gavia arctica"
  },
  {
   "id": "enkeltbekkasin",
   "number": "39",
   "group": "wetland",
   "name": {
    "no": "Enkeltbekkasin",
    "en": "Common snipe"
   },
   "latin": "Gallinago gallinago"
  },
  {
   "id": "heipiplerke",
   "number": "40",
   "group": "mountain",
   "name": {
    "no": "Heipiplerke",
    "en": "Meadow pipit"
   },
   "latin": "Anthus pratensis"
  },
  {
   "id": "lirype",
   "number": "41",
   "group": "mountain",
   "name": {
    "no": "Lirype",
    "en": "Willow ptarmigan"
   },
   "latin": "Lagopus lagopus"
  },
  {
   "id": "heilo",
   "number": "42",
   "group": "mountain",
   "name": {
    "no": "Heilo",
    "en": "Golden plover"
   },
   "latin": "Pluvialis apricaria"
  },
  {
   "id": "ravn",
   "number": "43",
   "group": "mountain",
   "name": {
    "no": "Ravn",
    "en": "Raven"
   },
   "latin": "Corvus corax"
  },
  {
   "id": "lavesvale",
   "number": "44",
   "group": "farmland",
   "name": {
    "no": "Låvesvale",
    "en": "Barn swallow"
   },
   "latin": "Hirundo rustica"
  },
  {
   "id": "sanglerke",
   "number": "45",
   "group": "farmland",
   "name": {
    "no": "Sanglerke",
    "en": "Skylark"
   },
   "latin": "Alauda arvensis"
  },
  {
   "id": "gulspurv",
   "number": "46",
   "group": "farmland",
   "name": {
    "no": "Gulspurv",
    "en": "Yellowhammer"
   },
   "latin": "Emberiza citrinella"
  },
  {
   "id": "vipe",
   "number": "47",
   "group": "farmland",
   "name": {
    "no": "Vipe",
    "en": "Lapwing"
   },
   "latin": "Vanellus vanellus"
  },
  {
   "id": "perleugle",
   "number": "48",
   "group": "night",
   "name": {
    "no": "Perleugle",
    "en": "Tengmalm's owl"
   },
   "latin": "Aegolius funereus"
  },
  {
   "id": "akerrikse",
   "number": "49",
   "group": "night",
   "name": {
    "no": "Åkerrikse",
    "en": "Corncrake"
   },
   "latin": "Crex crex"
  },
  {
   "id": "nattravn",
   "number": "50",
   "group": "night",
   "name": {
    "no": "Nattravn",
    "en": "Nightjar"
   },
   "latin": "Caprimulgus europaeus"
  }
 ]
}
`,Wi=`{
 "_note": "Field guide text for the tawny owl, both languages. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/strix-aluco",
 "facts": {
  "length": {
   "en": "Wingspan 81 to 104 cm, 550 to 750 g",
   "no": "Vingespenn 81 til 104 cm, 550 til 750 g",
   "verified": true
  },
  "broods": {
   "en": "2 to 6 eggs, March or early April",
   "no": "2 til 6 egg, mars eller tidlig april",
   "verified": true
  },
  "range": {
   "en": "North to northern Trøndelag; 2500 to 6000 pairs",
   "no": "Nord til nordlige Trøndelag; 2500 til 6000 par",
   "verified": true
  },
  "habitat": {
   "en": "Old deciduous forest, parks and large gardens",
   "no": "Eldre løvskog, parker og store hager",
   "verified": true
  },
  "food": {
   "en": "Insects, worms, amphibians, birds, small mammals",
   "no": "Insekter, mark, amfibier, fugler, smågnagere",
   "verified": true
  },
  "status": {
   "en": "LC, viable, Norwegian red list",
   "no": "LC, livskraftig, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "Hollow trees and large nest boxes",
   "no": "Hule trær og store fuglekasser",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Sings «hoo...kokk ho'o'o'o'»",
   "no": "Synger «hoo...kokk ho'o'o'o'»",
   "verified": true
  },
  "female": {
   "en": "Calls «ku'vitt»",
   "no": "Roper «ku'vitt»",
   "verified": true
  }
 },
 "song_notes": {
  "en": "The male: a deep, drawn-out “hoo”, about five seconds later a marked “kokk”, at once followed by a trembling, falling series of 1 to 2 seconds: “hoo..........kokk ho'o'o'o'o'o'o'”. Carries 2 to 3 km in calm weather. Sings from January, most from the second half of February, often in autumn too; almost only active at night. The female has a sharp “ku'vitt” or “i' vitt”.",
  "no": "Hannen: et dypt, langtrukkent «hoo», omtrent fem sekunder senere en markert «kokk», straks fulgt av en skjelvende, fallende rekke på 1 til 2 sekunder: «hoo..........kokk ho'o'o'o'o'o'o'». Høres 2 til 3 km i stille vær. Synger fra januar, mest fra andre halvdel av februar, gjerne også om høsten; nesten bare aktiv om natten. Hunnen har et skarpt «ku'vitt» eller «i' vitt».",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "The male's “hoo..........kokk ho'o'o'o'o'o'o'”.",
   "no": "Hannens «hoo..........kokk ho'o'o'o'o'o'o'».",
   "verified": true
  },
  "call": {
   "en": "The female's sharp “ku'vitt” or “i' vitt”.",
   "no": "Hunnens skarpe «ku'vitt» eller «i' vitt».",
   "verified": true
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "parts": {
  "hoo": {
   "en": "HOO",
   "no": "HOO",
   "verified": true
  },
  "kokk": {
   "en": "KOKK",
   "no": "KOKK",
   "verified": true
  },
  "tremolo": {
   "en": "TREMBLING SERIES",
   "no": "SKJELVENDE REKKE",
   "verified": true
  }
 },
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "yyy?????yyy?",
  "note": {
   "en": "Very sedentary, in its territory all year. Sings from January, most from the second half of February, often in autumn too. The sources do not say which autumn months.",
   "no": "Svært stedbunden, i reviret hele året. Synger fra januar, mest fra andre halvdel av februar, gjerne også om høsten. Kildene sier ikke hvilke høstmåneder.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "name": {
    "en": "Ural owl",
    "no": "Slagugle"
   },
   "text": {
    "en": "Much larger; the only other Norwegian owl with all-black eyes.",
    "no": "Betydelig større; den eneste andre norske ugla med helt sorte øyne.",
    "verified": true
   }
  }
 ]
}`,Yi=`{
 "_note": "Tawny owl ink plate in a 280x240 box, drawn in M10, not from a design: perched, facing out, large round head, pale even face with two pale bands meeting over the bill, black eyes, mottled with dark streaks, pale streaked underside, short tail (birds.md, SNL). Male and female are drawn the same; the female is larger. The juvenile is not described and is drawn like the adults.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M140 40 C112 40 98 60 100 84 C92 104 92 140 104 168 C114 188 128 194 140 194 C152 194 166 188 176 168 C188 140 188 104 180 84 C182 60 168 40 140 40 Z",
  "wing": "M104 116 C98 146 106 176 124 190 C118 164 116 138 112 116 Z M176 116 C182 146 174 176 156 190 C162 164 164 138 168 116 Z"
 },
 "hatch": {
  "body": {
   "rect": [
    92,
    38,
    190,
    196
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    96,
    114,
    184,
    192
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    140,
    88
   ],
   "deg": -6
  },
  "lower": {
   "at": [
    140,
    92
   ],
   "deg": 8
  },
  "tail": {
   "at": [
    140,
    190
   ],
   "deg": 4
  }
 },
 "layers": [
  {
   "path": "M14 204 C80 200 160 198 268 194",
   "stroke": 4
  },
  {
   "path": "M214 199 l20 -20 M224 189 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M130 188 L126 214 L154 214 L150 188 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M134 196 l-1 14 M146 196 l1 14",
   "stroke": 1,
   "part": "tail"
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "path": "M140 112 C124 112 112 124 110 140 C108 160 118 182 140 186 C162 182 172 160 170 140 C168 124 156 112 140 112 Z",
   "fill": "face",
   "within": "body"
  },
  {
   "path": "M130 124 l0 9 M148 126 l0 9 M138 144 l0 10 M124 152 l0 9 M156 150 l0 9 M140 166 l0 9 M128 170 l0 8 M152 170 l0 8",
   "stroke": 1.3,
   "within": "body"
  },
  {
   "path": "M140 50 C118 50 108 66 110 84 C112 100 126 108 140 108 C154 108 168 100 170 84 C172 66 162 50 140 50 Z",
   "fill": "face",
   "stroke": 1.2,
   "within": "body"
  },
  {
   "path": "M126 56 C132 64 137 74 140 82 C143 74 148 64 154 56",
   "stroke": 1.2,
   "within": "body"
  },
  {
   "clip": "wing",
   "fill": "face"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    127,
    80
   ],
   "pupil": 5.5
  },
  {
   "eye": [
    153,
    80
   ],
   "pupil": 5.5
  },
  {
   "path": "M136 86 L144 86 L140 97 Z",
   "fill": "bill",
   "stroke": 1.3,
   "part": "upper"
  },
  {
   "path": "M137.5 92 L142.5 92 L140 98 Z",
   "fill": "bill",
   "stroke": 1.1,
   "part": "lower"
  },
  {
   "path": "M126 194 l-5 7 M131 195 l-1 8 M149 195 l1 8 M154 194 l5 7",
   "stroke": 1.5
  },
  {
   "path": "M198 66 A16 16 0 0 1 198 96 M205 58 A26 26 0 0 1 205 104 M212 50 A36 36 0 0 1 212 112",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "variants": {
  "male": {
   "body_pitch": 7,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow"
  },
  "female": {
   "body_pitch": 7,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow"
  },
  "juvenile": {
   "body_pitch": 7,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow"
  }
 },
 "callouts": [
  {
   "id": "head",
   "leader": "M118 66 L74 40",
   "at": [
    70,
    34
   ],
   "align": "right",
   "male": {
    "en": "BLACK EYES",
    "no": "SORTE ØYNE",
    "verified": true
   },
   "female": {
    "en": "BLACK EYES",
    "no": "SORTE ØYNE",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M104 132 L74 120",
   "at": [
    70,
    114
   ],
   "align": "right",
   "male": {
    "en": "GREY- TO RED-BROWN",
    "no": "GRÅ- TIL RØDBRUN",
    "verified": true
   },
   "female": {
    "en": "GREY- TO RED-BROWN",
    "no": "GRÅ- TIL RØDBRUN",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "breast",
   "leader": "M166 160 L232 214",
   "at": [
    276,
    226
   ],
   "align": "right",
   "male": {
    "en": "PALE, DARK STREAKS",
    "no": "LYS, MØRKE STREKER",
    "verified": true
   },
   "female": {
    "en": "PALE, DARK STREAKS",
    "no": "LYS, MØRKE STREKER",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Male calling at night. Beak and tail follow the sound.",
   "no": "Hann som roper om natten. Nebb og hale følger lyden.",
   "verified": true
  },
  "female": {
   "en": "Female. Same plumage, somewhat larger and heavier.",
   "no": "Hunn. Samme drakt, noe større og tyngre.",
   "verified": true
  },
  "juvenile": {
   "en": "Juvenile. Not described in the sources, so drawn like the adults.",
   "no": "Ungfugl. Ikke beskrevet i kildene, så tegnet som de voksne.",
   "verified": false
  }
 }
}`,$i=`{
 "_note": "Tawny owl, M10. Verified (birds.md, SNL): the male's song «hoo..........kokk ho'o'o'o'o'o'o'»: a deep drawn-out hoot, about five seconds later a marked 'kokk', at once followed by a trembling falling series of 1 to 2 s; from January, most from late February, also in autumn; almost only at night. The female's call: a sharp «ku'vitt» or «i' vitt». Sound design choices: the pitches (hoot about 500 Hz), the 4,5 to 5,5 s gap, the tremolo rate, the shape of «ku'vitt». The song is inactive for the female and by day. The call template is marked female; the male, who has no described call, falls back to it.",
 "syllables": {
  "hoo": {
   "dur_ms": 1100,
   "pitch": [
    [
     0,
     470
    ],
    [
     0.15,
     520
    ],
    [
     0.8,
     500
    ],
    [
     1,
     460
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     0.9
    ],
    [
     0.7,
     1
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.95,
   "breath": 8
  },
  "kokk": {
   "dur_ms": 180,
   "pitch": [
    [
     0,
     430
    ],
    [
     0.3,
     560
    ],
    [
     1,
     500
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     1
    ],
    [
     0.6,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.9
  },
  "tremolo": {
   "dur_ms": 1500,
   "pitch": [
    [
     0,
     560
    ],
    [
     0.4,
     520
    ],
    [
     1,
     430
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.06,
     1
    ],
    [
     0.75,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.95,
   "trill": {
    "hz": 9,
    "depth_st": 0.6,
    "am": 0.8
   }
  },
  "tremolo2": {
   "dur_ms": 1900,
   "pitch": [
    [
     0,
     550
    ],
    [
     0.5,
     500
    ],
    [
     1,
     420
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.06,
     1
    ],
    [
     0.75,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.95,
   "trill": {
    "hz": 8,
    "depth_st": 0.6,
    "am": 0.8
   }
  },
  "kuvitt": {
   "dur_ms": 420,
   "pitch": [
    [
     0,
     900
    ],
    [
     0.25,
     1100
    ],
    [
     0.35,
     1050
    ],
    [
     0.45,
     1300
    ],
    [
     0.8,
     1450
    ],
    [
     1,
     1250
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.06,
     0.8
    ],
    [
     0.28,
     0.6
    ],
    [
     0.38,
     0.2
    ],
    [
     0.46,
     1
    ],
    [
     0.85,
     0.9
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.9,
   "tension": 25,
   "rough": 10,
   "breath": -10
  }
 },
 "types": {
  "song": {
   "pause_s": [
    8.0,
    20.0
   ],
   "length_s": [
    7.0,
    9.5
   ],
   "transpose_st": 0.4,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.99,
     1.01
    ],
    "vo_breath": [
     24,
     36
    ],
    "vo_tension": [
     3,
     10
    ],
    "vo_rough": [
     2,
     6
    ],
    "ph_tempo": [
     97,
     103
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "part": "hoo",
       "pool": [
        "hoo"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.2,
       "gap_ms": [
        50,
        50
       ]
      },
      {
       "part": "kokk",
       "pool": [
        "kokk"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.05,
       "gap_ms": [
        50,
        50
       ],
       "lead_gap_ms": [
        4500,
        5500
       ]
      },
      {
       "part": "tremolo",
       "pool": [
        "tremolo",
        "tremolo2"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.3,
       "gap_ms": [
        50,
        50
       ],
       "lead_gap_ms": [
        30,
        60
       ]
      }
     ]
    }
   ],
   "overrides": [
    {
     "_note": "The male sings (SNL).",
     "when": {
      "sex": "female"
     },
     "active": false
    },
    {
     "_note": "Almost only active at night (SNL).",
     "when": {
      "time": "day"
     },
     "active": false
    }
   ]
  },
  "call": {
   "pause_s": [
    3.0,
    10.0
   ],
   "length_s": [
    0.4,
    2.0
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     14,
     26
    ],
    "vo_tension": [
     20,
     32
    ],
    "vo_rough": [
     6,
     14
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sex": "female",
     "sections": [
      {
       "pool": [
        "kuvitt"
       ],
       "count": [
        1,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        600,
        1400
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}`,Ji=`{
  "_note": "Sound design starting values for the tawny owl, M10. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 500,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 30,
    "vo_tension": 6,
    "vo_trill": 0,
    "vo_rough": 4,
    "ph_tempo": 100,
    "ph_pause": 12.0,
    "ph_length": 8.0,
    "ph_variation": 50,
    "su_distance": 50,
    "su_wind": 1.5,
    "su_space": 55
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}`,Xi=`{
 "_note": "Field guide text for this bird, both languages. Facts come from birds.md. A field with verified false is not shown as a fact: empty means not described, and the text says what the sources leave out. Norwegian wording is mine, Eirik to check. calendar rows: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/parus-major",
 "facts": {
  "length": {
   "en": "15 cm, 15 to 22 g",
   "no": "15 cm, 15 til 22 g",
   "verified": true
  },
  "broods": {
   "en": "Usually 2, April to July",
   "no": "Vanligvis 2, april til juli",
   "verified": true
  },
  "range": {
   "en": "The whole country, in forest",
   "no": "Hele landet, i skog",
   "verified": true
  },
  "habitat": {
   "en": "All forest, gardens with nest boxes",
   "no": "All slags skog, hager med fuglekasser",
   "verified": true
  },
  "food": {
   "en": "Insects; seeds and feeders in winter",
   "no": "Insekter; frø og fôringsbrett om vinteren",
   "verified": true
  },
  "status": {
   "en": "LC, viable, Norwegian red list",
   "no": "LC, livskraftig, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "Tree holes and nest boxes, 6 to 13 eggs",
   "no": "Trehull og fuglekasser, 6 til 13 egg",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Sings",
   "no": "Synger",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "Repeated whistled phrases of 1 to about 6 syllables, most often 2 or 3, such as “tu-ti tu-ti tu-ti”. A large repertoire. Can start singing as early as January; territories are set up in February and March.",
  "no": "Gjentatte, plystrende fraser på 1 til rundt 6 stavelser, oftest 2 eller 3, som «tu-ti tu-ti tu-ti». Stort repertoar. Kan begynne å synge allerede i januar; reviret etableres i februar og mars.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "Repeated “tu-ti tu-ti tu-ti”, sometimes from January.",
   "no": "Gjentatt «tu-ti tu-ti tu-ti», noen ganger fra januar.",
   "verified": true
  },
  "call": {
   "en": "“ping ping”, like the chaffinch. Also “huit huit” and “ti tuui”.",
   "no": "«ping ping», som bokfinken. Også «huit huit» og «ti tuui».",
   "verified": true
  },
  "alarm": {
   "en": "A sharp startle call, “pist! pist!”",
   "no": "Et skarpt skremmerop, «pist! pist!»",
   "verified": true
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "parts": {
  "motif": {
   "en": "REPEATED MOTIF",
   "no": "GJENTATT MOTIV",
   "verified": true
  }
 },
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "yyy?????????",
  "note": {
   "en": "Mostly resident. Some move in September and October, mostly within Scandinavia. The sources do not give its singing months after March.",
   "no": "For det meste standfugl. Noen trekker i september og oktober, mest innen Skandinavia. Kildene oppgir ikke månedene med sang etter mars.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "id": "blameis",
   "text": {
    "en": "Smaller, blue crown. Sings a trill, “sit-sitt-sirrrrr”.",
    "no": "Mindre, blå isse. Synger en trille, «sit-sitt-sirrrrr».",
    "verified": true
   }
  },
  {
   "id": "bokfink",
   "text": {
    "en": "Its call is like the great tit's “ping ping”.",
    "no": "Lokkelyden ligner kjøttmeisens «ping ping».",
    "verified": true
   }
  }
 ]
}
`,Qi=`{
 "_note": "Great tit ink plate in a 280x240 box, drawn in M3 (not from the design). Same composition as the blackbird: perched, facing right. Callout values are from birds.md (SNL); bill colour and juvenile cheek are not verified.",
 "box": [280, 240],
 "clips": {
  "body": "M198 70 C196 56 180 50 166 56 C152 62 142 76 132 92 C120 110 110 130 108 150 C110 160 118 168 126 172 C146 182 170 174 180 156 C192 136 199 108 199 90 C200 86 201 82 200 80 Z",
  "wing": "M156 92 C164 118 148 148 112 160 C118 138 130 110 156 92 Z"
 },
 "layers": [
  { "path": "M14 206 C80 202 150 199 268 194", "stroke": 4 },
  { "path": "M214 197 l20 -20 M224 187 l16 3", "stroke": 1.5 },
  { "path": "M234 177 q10 -10 18 -2 q-9 8 -18 2 Z M240 190 q11 -5 16 3 q-10 4 -16 -3 Z", "fill": "face", "stroke": 1 },
  { "path": "M114 146 L62 204 L74 214 L126 166 Z", "fill": "face", "stroke": 1.5, "part": "tail" },
  { "path": "M118 152 L66 207 M122 159 L70 211", "stroke": 1, "part": "tail" },
  { "path": "M142 176 L144 199 M156 175 L159 198 M136 201 L144 199 L152 201 M151 199 L159 198 L167 200", "stroke": 1.5 },
  { "clip": "body", "fill": "face", "stroke": 1.5 },
  { "hatch": "body" },
  { "hatch": "wing" },
  { "clip": "wing", "stroke": 1.5 },
  { "path": "M126 101 L163 123 L161 128 L124 106 Z", "fill": "face", "stroke": 1, "within": "wing" },
  { "path": "M200 66 L200 82 C200 96 198 104 194 110 C184 110 172 104 160 98 C152 94 144 92 136 90 C142 76 152 60 168 54 C184 50 198 56 200 66 Z", "fill": "cap", "within": "body" },
  { "path": "M190 80 C184 82 172 82 160 78 C156 84 162 94 174 98 C184 100 190 94 192 86 Z", "fill": "face", "stroke": 1, "within": "body" },
  { "variant": "stripe", "fill": "cap", "within": "body" },
  { "variant": "patch", "fill": "cap", "within": "body" },
  { "clip": "body", "stroke": 1.5 },
  { "eye": [182, 68], "pupil": 2.4 },
  { "path": "M182.4 66.8 m-0.9 0 a0.9 0.9 0 1 0 1.8 0 a0.9 0.9 0 1 0 -1.8 0", "fill": "face" },
  { "path": "M198 70 L214 76 L200 78 Z", "fill": "bill", "stroke": 1.5, "part": "upper" },
  { "path": "M200 78 L213 78 L200 82 Z", "fill": "bill", "stroke": 1.5, "part": "lower" },
  { "path": "M226 64 A14 14 0 0 1 226 88 M233 56 A24 24 0 0 1 233 96 M240 48 A34 34 0 0 1 240 104", "stroke": 1.5, "part": "arcs" }
 ],
 "hatch": {
  "body": { "rect": [104, 50, 204, 184], "up": true, "clip": "body" },
  "wing": { "rect": [108, 88, 166, 164], "up": false, "clip": "wing" }
 },
 "pivots": {
  "upper": { "at": [200, 74], "deg": -14 },
  "lower": { "at": [200, 79], "deg": 10 },
  "tail": { "at": [120, 156], "deg": -5 }
 },
 "variants": {
  "male": {
   "body_pitch": 8, "wing_pitch": 4, "eye_ring": 0, "bill": "shadow", "cap": "ink",
   "stripe": "M191 104 C187 122 177 148 163 176 L147 178 C161 150 173 124 181 106 Z",
   "patch": "M166 160 C172 166 168 176 156 180 C146 182 136 180 130 176 C142 172 152 168 158 158 Z"
  },
  "female": {
   "body_pitch": 9, "wing_pitch": 5, "eye_ring": 0, "bill": "shadow", "cap": "ink",
   "stripe": "M190 106 C185 124 176 150 161 176 L155 177 C167 150 177 124 184 108 Z",
   "patch": ""
  },
  "juvenile": {
   "body_pitch": 10, "wing_pitch": 5, "eye_ring": 0, "bill": "shadow", "cap": "shadow",
   "stripe": "M190 106 C185 124 176 150 161 176 L155 177 C167 150 177 124 184 108 Z",
   "patch": ""
  }
 },
 "callouts": [
  { "id": "bill", "leader": "M206 70 L206 23", "at": [206, 10], "align": "centre",
    "male": { "en": "", "no": "", "verified": false },
    "female": { "en": "", "no": "", "verified": false },
    "juvenile": { "en": "", "no": "", "verified": false } },
  { "id": "head", "leader": "M166 60 L122 36", "at": [120, 30], "align": "right",
    "male": { "en": "GLOSSY BLACK", "no": "BLANKT SVART", "verified": true },
    "female": { "en": "BLACK, LESS GLOSS", "no": "SVART, MINDRE BLANKT", "verified": true },
    "juvenile": { "en": "DULLER", "no": "MATTERE", "verified": true } },
  { "id": "cheek", "leader": "M164 86 L74 86", "at": [70, 80], "align": "right",
    "male": { "en": "WHITE", "no": "HVITE", "verified": true },
    "female": { "en": "WHITE", "no": "HVITE", "verified": true },
    "juvenile": { "en": "", "no": "", "verified": false } },
  { "id": "breast", "leader": "M186 146 L232 212", "at": [276, 224], "align": "right",
    "male": { "en": "YELLOW, BLACK STRIPE", "no": "GULT, SVART STRIPE", "verified": true },
    "female": { "en": "NARROWER STRIPE", "no": "SMALERE STRIPE", "verified": true },
    "juvenile": { "en": "DULLER", "no": "MATTERE", "verified": true } }
 ],
 "captions": {
  "male": {
   "en": "Male, singing. Black patch between the legs.",
   "no": "Hann som synger. Svart flekk mellom beina.",
   "verified": true
  },
  "female": {
   "en": "Female. Less intense colours, no black belly patch.",
   "no": "Hunn. Svakere farger, ingen svart bukflekk.",
   "verified": true
  },
  "juvenile": {
   "en": "Juvenile. Like the adults, duller.",
   "no": "Ungfugl. Som de voksne, men mattere.",
   "verified": true
  }
 }
}
`,ns=`{
  "_note": "Great tit, M3 round 1. Shapes, pitches, timings and bout lengths are sound design guesses, not verified, not yet tuned against recordings. Verified (birds.md, SNL): song is repeated whistled phrases of 1 to about 6 syllables, 2 or 3 most common, like 'tu-ti tu-ti tu-ti', with a large repertoire; calls 'ping ping' like the chaffinch, also 'huit huit' and 'ti tuui'. Each song syllable below is a whole motif (2 or 3 notes with silence between them), so one section repeats it. The bout (same motif for several phrases in a row) is a design choice.",

  "syllables": {
    "m_titu":  { "dur_ms": 240, "pitch": [[0, 6100], [0.33, 5500], [0.45, 3900], [1, 3500]], "amp": [[0, 0], [0.04, 1], [0.28, 0.85], [0.34, 0], [0.46, 0], [0.52, 1], [0.88, 0.75], [1, 0]] },
    "m_tuti":  { "dur_ms": 250, "pitch": [[0, 3700], [0.5, 3500], [0.62, 5900], [1, 5600]], "amp": [[0, 0], [0.05, 0.9], [0.45, 0.8], [0.52, 0], [0.62, 0], [0.67, 1], [0.93, 0.8], [1, 0]] },
    "m_titiu": { "dur_ms": 260, "pitch": [[0, 5200], [0.3, 5100], [0.42, 5000], [1, 3200]], "amp": [[0, 0], [0.05, 1], [0.26, 0.8], [0.32, 0], [0.42, 0], [0.48, 1], [0.9, 0.6], [1, 0]] },
    "m_tititu": { "dur_ms": 330, "pitch": [[0, 6000], [0.22, 5700], [0.3, 6000], [0.52, 5700], [0.62, 3900], [1, 3600]], "amp": [[0, 0], [0.03, 1], [0.19, 0.8], [0.24, 0], [0.3, 0], [0.33, 1], [0.49, 0.8], [0.54, 0], [0.62, 0], [0.66, 1], [0.92, 0.7], [1, 0]] },
    "m_situtu": { "dur_ms": 360, "pitch": [[0, 7000], [0.15, 6400], [0.25, 3800], [0.58, 3600], [0.66, 3700], [1, 3500]], "amp": [[0, 0], [0.03, 0.8], [0.13, 0.6], [0.17, 0], [0.25, 0], [0.29, 1], [0.54, 0.8], [0.58, 0], [0.66, 0], [0.7, 1], [0.94, 0.7], [1, 0]] },
    "m_tiu":   { "dur_ms": 150, "pitch": [[0, 5600], [0.2, 5300], [1, 3400]], "amp": [[0, 0], [0.08, 1], [0.6, 0.8], [1, 0]] },

    "ping":  { "dur_ms": 40, "pitch": [[0, 5200], [0.15, 5600], [1, 4300]], "amp": [[0, 0], [0.06, 1], [0.3, 0.6], [1, 0]], "gain": 0.7, "tension": 30, "rough": 6 },
    "ping2": { "dur_ms": 38, "pitch": [[0, 5000], [0.15, 5400], [1, 4200]], "amp": [[0, 0], [0.06, 1], [0.3, 0.55], [1, 0]], "gain": 0.65, "tension": 30, "rough": 6 },
    "huit":  { "dur_ms": 110, "pitch": [[0, 3400], [0.6, 4300], [1, 4700]], "amp": [[0, 0], [0.15, 0.8], [0.6, 1], [1, 0]], "gain": 0.7 },
    "ti":    { "dur_ms": 50, "pitch": [[0, 6200], [1, 5900]], "amp": [[0, 0], [0.15, 1], [0.7, 0.7], [1, 0]], "gain": 0.6 },
    "tuui":  { "dur_ms": 170, "pitch": [[0, 3600], [0.4, 3500], [1, 4600]], "amp": [[0, 0], [0.12, 0.9], [0.5, 0.8], [0.8, 1], [1, 0]], "gain": 0.7 }
  },

  "types": {
    "song": {
      "pause_s": [2.5, 6.0],
      "length_s": [1.4, 2.6],
      "transpose_st": 0.8,
      "avoid_repeat": false,
      "bout": [3, 8],
      "auto": {
        "vo_pitch": [0.98, 1.02],
        "vo_breath": [4, 10],
        "vo_tension": [34, 48],
        "vo_rough": [2, 6],
        "ph_tempo": [94, 106]
      },
      "phrases": [
        { "weight": 3, "sections": [ { "part": "motif", "pool": ["m_titu"],   "count": [3, 9], "share": 1.0, "gap_ms": [45, 75], "no_adjacent_repeat": false } ] },
        { "weight": 3, "sections": [ { "part": "motif", "pool": ["m_tuti"],   "count": [3, 9], "share": 1.0, "gap_ms": [45, 75], "no_adjacent_repeat": false } ] },
        { "weight": 2, "sections": [ { "part": "motif", "pool": ["m_titiu"],  "count": [3, 8], "share": 1.0, "gap_ms": [50, 80], "no_adjacent_repeat": false } ] },
        { "weight": 2, "sections": [ { "part": "motif", "pool": ["m_tititu"], "count": [2, 7], "share": 1.0, "gap_ms": [50, 85], "no_adjacent_repeat": false } ] },
        { "weight": 1, "sections": [ { "part": "motif", "pool": ["m_situtu"], "count": [2, 6], "share": 1.0, "gap_ms": [55, 90], "no_adjacent_repeat": false } ] },
        { "weight": 1, "sections": [ { "part": "motif", "pool": ["m_tiu"],    "count": [4, 12], "share": 1.0, "gap_ms": [70, 110], "no_adjacent_repeat": false } ] }
      ],
      "overrides": []
    },

    "call": {
      "pause_s": [1.0, 3.5],
      "length_s": [0.4, 2.0],
      "avoid_repeat": false,
      "auto": {
        "vo_pitch": [0.98, 1.02],
        "vo_breath": [10, 18],
        "vo_tension": [45, 60],
        "vo_rough": [6, 12]
      },
      "phrases": [
        { "weight": 3, "sections": [ { "pool": ["ping", "ping2"], "count": [2, 5], "share": 1.0, "gap_ms": [200, 380], "no_adjacent_repeat": false } ] },
        { "weight": 2, "sections": [ { "pool": ["huit"], "count": [2, 4], "share": 1.0, "gap_ms": [180, 320], "no_adjacent_repeat": false } ] },
        { "weight": 2, "sections": [
          { "pool": ["ti"], "count": [1, 1], "share": 0.3, "gap_ms": [0, 0] },
          { "pool": ["tuui"], "count": [1, 1], "share": 0.7, "gap_ms": [0, 0], "lead_gap_ms": [40, 80] }
        ] }
      ],
      "overrides": []
    }
  }
}
`,es=`{
  "_note": "Sound design starting values for the great tit, M3 round 1. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 4000,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 6,
    "vo_tension": 40,
    "vo_trill": 0,
    "vo_rough": 4,
    "ph_tempo": 100,
    "ph_pause": 4.0,
    "ph_length": 2.0,
    "ph_variation": 50,
    "su_distance": 15,
    "su_wind": 1.5,
    "su_space": 35
  },
  "ranges": {
    "vo_pitch": [0.5, 2.0],
    "vo_breath": [0, 100],
    "vo_tension": [0, 100],
    "vo_trill": [0, 40],
    "vo_rough": [0, 100],
    "ph_tempo": [50, 200],
    "ph_pause": [0.2, 20],
    "ph_length": [0.2, 8],
    "ph_variation": [0, 100],
    "su_distance": [1, 200],
    "su_wind": [0, 15],
    "su_space": [0, 100]
  }
}
`,ts=`{
 "_note": "Field guide text for this bird, both languages. Facts come from birds.md (M11 batch 1, SNL). A field with verified false is not shown as a fact: empty means not described, and the text says what the sources leave out. Norwegian wording is mine, Eirik to check. calendar rows: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/corvus-cornix",
 "facts": {
  "length": {
   "en": "Nearly 50 cm, 500 to 600 g",
   "no": "Nesten 50 cm, 500 til 600 g",
   "verified": true
  },
  "broods": {
   "en": "",
   "no": "",
   "verified": false
  },
  "range": {
   "en": "Coast, inland and mountains",
   "no": "Kyst, innland og fjell",
   "verified": true
  },
  "habitat": {
   "en": "Mostly near people; open and treeless land too",
   "no": "Mest nær folk; også åpent og treløst land",
   "verified": true
  },
  "food": {
   "en": "Omnivore; robs nests, drops shellfish on rocks",
   "no": "Altetende; plyndrer reir, slipper skjell på stein",
   "verified": true
  },
  "status": {
   "en": "LC, least concern",
   "no": "LC, livskraftig",
   "verified": true
  },
  "nest": {
   "en": "Twig nest in a tree, bush or cliff, 4 to 5 eggs",
   "no": "Kvistreir i tre, busk eller berg, 4 til 5 egg",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Calls «krra krra krra»",
   "no": "Roper «krra krra krra»",
   "verified": true
  },
  "female": {
   "en": "Calls; begs from her mate when incubating",
   "no": "Roper; tigger mat av make når hun ruger",
   "verified": true
  }
 },
 "song_notes": {
  "en": "The main call is a harsh, hoarse, rolling «krra krra krra» that varies in tone and loudness; a perched bird bows with each call. No separate song is described.",
  "no": "Hovedlyden er et hardt, hest, rullende «krra krra krra» som varierer i tone og styrke; en sittende fugl bukker for hvert rop. Ingen egen sang er beskrevet.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "The main call, «krra krra krra». No separate song is described, so this slot plays the call.",
   "no": "Hovedlyden, «krra krra krra». Ingen egen sang er beskrevet, så her spilles ropet.",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "parts": {},
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "????????????",
  "note": {
   "en": "Resident and migrant: many winter on the coast, others abroad and back in March to April. The sources do not give its calling months.",
   "no": "Stand- og trekkfugl: mange overvintrer langs kysten, andre i utlandet og kommer tilbake i mars til april. Kildene oppgir ikke månedene med rop.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "id": "ravn",
   "text": {
    "en": "The raven has a wedge-shaped tail and often glides; the crow's tail is square-cut, its wingbeats slow and calm.",
    "no": "Ravnen har kileformet hale og glir ofte; kråkas hale er tverrskåret, vingeslagene rolige.",
    "verified": true
   }
  }
 ]
}
`,is=`{
 "_note": "Hooded crow ink plate in a 280x240 box, drawn in M11 from the blackbird plate, not from a design: grey body in shadow tone, black head, breast, wings and tail (dense hatching and ink), heavier bill. The female is somewhat smaller and the juvenile duller (SNL); both are drawn as the adult.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M190 60 C184 44 158 42 150 62 C134 80 104 106 90 136 C92 146 98 154 106 158 C128 180 162 178 178 152 C192 130 198 104 192 80 C194 74 194 66 190 60 Z",
  "wing": "M152 90 C156 118 136 146 98 152 C106 136 118 110 152 90 Z",
  "hood": "M190 60 C184 44 158 42 150 62 C144 72 146 84 156 92 C168 102 178 118 184 136 C192 118 196 100 192 80 C194 74 194 66 190 60 Z"
 },
 "layers": [
  {
   "path": "M14 211 C80 205 150 201 268 193",
   "stroke": 4
  },
  {
   "path": "M214 196 l20 -20 M224 186 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 176 q10 -10 18 -2 q-9 8 -18 2 Z M240 189 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M90 136 L42 194 L54 206 L106 158 Z",
   "fill": "ink",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M94 142 L46 198 M98 147 L49 202 M102 153 L52 205",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M136 172 L139 199 M152 173 L157 198 M131 201 L139 199 L148 202 M149 200 L157 198 L166 201",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "shadow",
   "stroke": 1.5
  },
  {
   "hatch": "hood"
  },
  {
   "path": "M150 62 C144 72 146 84 156 92 C168 102 178 118 184 136",
   "stroke": 1,
   "within": "body"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "eye": [
    177,
    65
   ],
   "pupil": 2.4
  },
  {
   "path": "M177.6 64.4 m-1.2 0 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0",
   "fill": "face"
  },
  {
   "path": "M188 57 L224 64 L192 71 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M192 71 L219 69 L189 80 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M230 52 A16 16 0 0 1 230 76 M237 44 A26 26 0 0 1 237 84 M243 36 A36 36 0 0 1 243 92",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "hatch": {
  "body": {
   "rect": [
    86,
    42,
    200,
    182
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    96,
    88,
    158,
    154
   ],
   "up": false,
   "clip": "wing"
  },
  "hood": {
   "rect": [
    140,
    40,
    200,
    140
   ],
   "up": false,
   "clip": "hood"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    192,
    67
   ],
   "deg": -16
  },
  "lower": {
   "at": [
    192,
    72
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    98,
    147
   ],
   "deg": -5
  }
 },
 "variants": {
  "male": {
   "body_pitch": 0,
   "wing_pitch": 3,
   "hood_pitch": 3,
   "eye_ring": 0,
   "bill": "ink"
  },
  "female": {
   "body_pitch": 0,
   "wing_pitch": 3,
   "hood_pitch": 3,
   "eye_ring": 0,
   "bill": "ink"
  },
  "juvenile": {
   "body_pitch": 0,
   "wing_pitch": 3,
   "hood_pitch": 3,
   "eye_ring": 0,
   "bill": "ink"
  }
 },
 "callouts": [
  {
   "id": "head",
   "leader": "M170 56 L122 36",
   "at": [
    120,
    30
   ],
   "align": "right",
   "male": {
    "en": "BLACK",
    "no": "SVART",
    "verified": true
   },
   "female": {
    "en": "BLACK",
    "no": "SVART",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M130 132 L72 96",
   "at": [
    70,
    80
   ],
   "align": "right",
   "male": {
    "en": "GREY",
    "no": "GRÅ",
    "verified": true
   },
   "female": {
    "en": "GREY",
    "no": "GRÅ",
    "verified": true
   },
   "juvenile": {
    "en": "DULLER",
    "no": "MATTERE",
    "verified": true
   }
  },
  {
   "id": "breast",
   "leader": "M186 112 L236 142",
   "at": [
    276,
    150
   ],
   "align": "right",
   "male": {
    "en": "BLACK",
    "no": "SVART",
    "verified": true
   },
   "female": {
    "en": "BLACK",
    "no": "SVART",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Adult. Grey, with black head, breast, wings and tail.",
   "no": "Voksen. Grå, med svart hode, bryst, vinger og hale.",
   "verified": true
  },
  "female": {
   "en": "Female. Like the male, somewhat smaller.",
   "no": "Hunn. Som hannen, noe mindre.",
   "verified": true
  },
  "juvenile": {
   "en": "Juvenile. A little duller than the adults.",
   "no": "Ungfugl. Litt mattere enn de voksne.",
   "verified": true
  }
 }
}
`,ss=`{
 "_note": "Hooded crow, M11 batch 1. Verified (birds.md, SNL): a harsh, hoarse, rolling «krra krra krra», varying in tone and loudness. SNL describes no song, so the song slot plays this call (Play and the quiz need a song). Pitch, length and spacing are sound design guesses: 2 to 5 rough notes of 250 to 380 ms around 0,7 to 1 kHz, a rolling texture from a slow trill in the amplitude.",
 "syllables": {
  "krra": {
   "dur_ms": 330,
   "pitch": [
    [
     0,
     780
    ],
    [
     0.25,
     980
    ],
    [
     0.7,
     900
    ],
    [
     1,
     700
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.7,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "rough": 14,
   "trill": {
    "hz": 28,
    "depth_st": 0.6,
    "am": 0.35
   }
  },
  "krra2": {
   "dur_ms": 280,
   "pitch": [
    [
     0,
     850
    ],
    [
     0.3,
     1050
    ],
    [
     1,
     760
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.7,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "rough": 14,
   "trill": {
    "hz": 32,
    "depth_st": 0.5,
    "am": 0.35
   }
  },
  "krra3": {
   "dur_ms": 380,
   "pitch": [
    [
     0,
     700
    ],
    [
     0.3,
     880
    ],
    [
     1,
     650
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     1
    ],
    [
     0.7,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.65,
   "rough": 18,
   "trill": {
    "hz": 24,
    "depth_st": 0.7,
    "am": 0.4
   }
  }
 },
 "types": {
  "song": {
   "pause_s": [
    3.0,
    10.0
   ],
   "length_s": [
    1.2,
    3.0
   ],
   "transpose_st": 1.2,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     16,
     24
    ],
    "vo_tension": [
     64,
     76
    ],
    "vo_rough": [
     52,
     64
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "krra",
        "krra2",
        "krra3"
       ],
       "count": [
        2,
        5
       ],
       "share": 1.0,
       "gap_ms": [
        220,
        420
       ]
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,as=`{
  "_note": "Sound design starting values for the hooded crow, M11 batch 1. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 900,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 20,
    "vo_tension": 70,
    "vo_trill": 0,
    "vo_rough": 58,
    "ph_tempo": 100,
    "ph_pause": 6.0,
    "ph_length": 2.5,
    "ph_variation": 40,
    "su_distance": 30,
    "su_wind": 1.5,
    "su_space": 35
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}
`,os=`{
 "_note": "Field guide text for the barn swallow, both languages. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/hirundo-rustica",
 "facts": {
  "length": {
   "en": "About 18 cm, 16 to 24 g",
   "no": "Rundt 18 cm, 16 til 24 g",
   "verified": true
  },
  "broods": {
   "en": "2 to 7 eggs, usually 4 to 5; often a second brood in July, sometimes three",
   "no": "2 til 7 egg, oftest 4 til 5; ofte et andrekull i juli, noen ganger tre",
   "verified": true
  },
  "range": {
   "en": "Much of the country, fewer in Finnmark and high up; 30 000 to 50 000 pairs",
   "no": "Store deler av landet, færre i Finnmark og høyt til fjells; 30 000 til 50 000 par",
   "verified": true
  },
  "habitat": {
   "en": "Open farmland, often near water",
   "no": "Åpent kulturlandskap, ofte nær vann",
   "verified": true
  },
  "food": {
   "en": "Insects caught on the wing, low over the ground",
   "no": "Insekter tatt i lufta, lavt over bakken",
   "verified": true
  },
  "status": {
   "en": "LC, least concern, Norwegian red list",
   "no": "LC, livskraftig, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "Mostly indoors in barns: clay with straw and hair, lined with grass and white feathers",
   "no": "Mest innendørs i låver: leire med strå og hår, fôret med gress og hvite fjær",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "",
   "no": "",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "The song is a quick twittering. SNL gives nothing more, so the notes Pipp plays are a stand-in. Blue-black above, white below, a rust-red forehead and throat with a blue-black breast band; long tail streamers, longest in the male.",
  "no": "Sangen er en rask kvitring. SNL sier ikke mer, så tonene Pipp spiller er en stedfortreder. Svartblå over, hvit under, rustrød panne og strupe med svartblått brystbånd; lange stjertspyd, lengst hos hannen.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "A quick twittering.",
   "no": "En rask kvitring.",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "calendar": {
  "present": "???yyyyy????",
  "sings": "????????????",
  "note": {
   "en": "Arrives April to May; long-distance migrant, winters in Africa south of the Sahara. Eggs May to June, often a second brood in July. The sources do not say when it leaves.",
   "no": "Kommer april til mai; langtrekker, overvintrer i Afrika sør for Sahara. Egg mai til juni, ofte et andrekull i juli. Kildene sier ikke når den drar.",
   "verified": true
  }
 },
 "lookalikes": []
}
`,rs=`{
 "_note": "Barn swallow ink plate in a 280x240 box, M11 batch 7, built from the willow warbler plate: blue-black above (dense hatching), white below, rust-red forehead and throat (shadow), blue-black breast band (ink), long tail streamers in ink, the female's shorter (birds.md, SNL). Juvenile not described, drawn like the female, [TO VERIFY].",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M198 70 C196 56 180 50 166 56 C152 62 142 76 132 92 C120 110 110 130 108 150 C110 160 118 168 126 172 C146 182 170 174 180 156 C192 136 199 108 199 90 C200 86 201 82 200 80 Z",
  "wing": "M156 92 C164 118 148 148 112 160 C118 138 130 110 156 92 Z"
 },
 "layers": [
  {
   "path": "M14 206 C80 202 150 199 268 194",
   "stroke": 4
  },
  {
   "path": "M214 197 l20 -20 M224 187 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 177 q10 -10 18 -2 q-9 8 -18 2 Z M240 190 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "variant": "streamers",
   "fill": "ink",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M142 176 L144 199 M156 175 L159 198 M136 201 L144 199 L152 201 M151 199 L159 198 L167 200",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "variant": "under",
   "fill": "face",
   "within": "body"
  },
  {
   "variant": "rust",
   "fill": "shadow",
   "stroke": 1,
   "within": "body"
  },
  {
   "variant": "band",
   "fill": "ink",
   "within": "body"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    182,
    68
   ],
   "pupil": 2.4
  },
  {
   "path": "M182.4 66.8 m-0.9 0 a0.9 0.9 0 1 0 1.8 0 a0.9 0.9 0 1 0 -1.8 0",
   "fill": "face"
  },
  {
   "path": "M198 69 L218 75 L200 77 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M200 77 L216 76 L200 80 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M226 64 A14 14 0 0 1 226 88 M233 56 A24 24 0 0 1 233 96 M240 48 A34 34 0 0 1 240 104",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "hatch": {
  "body": {
   "rect": [
    104,
    50,
    204,
    184
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    108,
    88,
    166,
    164
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    200,
    74
   ],
   "deg": -14
  },
  "lower": {
   "at": [
    200,
    79
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    120,
    156
   ],
   "deg": -5
  }
 },
 "variants": {
  "male": {
   "body_pitch": 3.5,
   "wing_pitch": 3,
   "eye_ring": 0,
   "bill": "ink",
   "under": "M199 84 C196 108 190 134 180 156 C170 174 146 182 126 172 C140 170 156 160 166 144 C178 124 188 102 192 84 Z",
   "rust": "M200 80 C199 88 197 94 193 98 C188 94 187 86 190 79 Z M188 56 C193 57 197 62 199 68 L194 69 C192 64 190 60 186 58 Z",
   "band": "M193 98 C190 106 186 112 182 116 C178 110 182 102 188 96 Z",
   "streamers": "M114 146 L38 222 L44 225 L110 162 L60 230 L67 231 L126 166 Z"
  },
  "female": {
   "body_pitch": 3.5,
   "wing_pitch": 3,
   "eye_ring": 0,
   "bill": "ink",
   "under": "M199 84 C196 108 190 134 180 156 C170 174 146 182 126 172 C140 170 156 160 166 144 C178 124 188 102 192 84 Z",
   "rust": "M200 80 C199 88 197 94 193 98 C188 94 187 86 190 79 Z M188 56 C193 57 197 62 199 68 L194 69 C192 64 190 60 186 58 Z",
   "band": "M193 98 C190 106 186 112 182 116 C178 110 182 102 188 96 Z",
   "streamers": "M114 146 L56 206 L62 209 L112 162 L74 214 L81 215 L126 166 Z"
  },
  "juvenile": {
   "body_pitch": 3.5,
   "wing_pitch": 3,
   "eye_ring": 0,
   "bill": "ink",
   "under": "M199 84 C196 108 190 134 180 156 C170 174 146 182 126 172 C140 170 156 160 166 144 C178 124 188 102 192 84 Z",
   "rust": "M200 80 C199 88 197 94 193 98 C188 94 187 86 190 79 Z M188 56 C193 57 197 62 199 68 L194 69 C192 64 190 60 186 58 Z",
   "band": "M193 98 C190 106 186 112 182 116 C178 110 182 102 188 96 Z",
   "streamers": "M114 146 L56 206 L62 209 L112 162 L74 214 L81 215 L126 166 Z"
  }
 },
 "callouts": [
  {
   "id": "throat",
   "leader": "M196 88 L232 60",
   "at": [
    236,
    48
   ],
   "align": "centre",
   "male": {
    "en": "RUST-RED, AS THE FOREHEAD",
    "no": "RUSTRØD, SOM PANNA",
    "verified": true
   },
   "female": {
    "en": "RUST-RED, AS THE FOREHEAD",
    "no": "RUSTRØD, SOM PANNA",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M150 90 L74 86",
   "at": [
    70,
    80
   ],
   "align": "right",
   "male": {
    "en": "BLUE-BLACK ABOVE",
    "no": "SVARTBLÅ OVER",
    "verified": true
   },
   "female": {
    "en": "BLUE-BLACK ABOVE",
    "no": "SVARTBLÅ OVER",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "breast",
   "leader": "M186 108 L232 160",
   "at": [
    236,
    172
   ],
   "align": "centre",
   "male": {
    "en": "DARK BAND, WHITE BELOW",
    "no": "MØRKT BÅND, HVIT UNDER",
    "verified": true
   },
   "female": {
    "en": "DARK BAND, WHITE BELOW",
    "no": "MØRKT BÅND, HVIT UNDER",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "tail",
   "leader": "M70 200 L40 150",
   "at": [
    40,
    138
   ],
   "align": "centre",
   "male": {
    "en": "LONG STREAMERS",
    "no": "LANGE SPYD",
    "verified": true
   },
   "female": {
    "en": "SHORTER STREAMERS",
    "no": "KORTERE SPYD",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Male. Beak and tail follow the sound.",
   "no": "Hann. Nebb og hale følger lyden.",
   "verified": true
  },
  "female": {
   "en": "Female. Shorter tail streamers.",
   "no": "Hunn. Kortere stjertspyd.",
   "verified": true
  },
  "juvenile": {
   "en": "Juvenile. Not described in the sources, so drawn like the female.",
   "no": "Ungfugl. Ikke beskrevet i kildene, så tegnet som hunnen.",
   "verified": false
  }
 }
}
`,ls=`{
 "_note": "Barn swallow, M11 batch 7. SNL says only that the song is a quick twittering. Every note shape, pitch and timing here is a sound design guess: 12 to 30 short varied notes between 2,5 and 6 kHz, close together.",
 "syllables": {
  "tw1": {
   "dur_ms": 70,
   "pitch": [
    [
     0,
     3200
    ],
    [
     0.5,
     4200
    ],
    [
     1,
     3600
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7
  },
  "tw2": {
   "dur_ms": 55,
   "pitch": [
    [
     0,
     4800
    ],
    [
     1,
     4000
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.65
  },
  "tw3": {
   "dur_ms": 90,
   "pitch": [
    [
     0,
     2600
    ],
    [
     0.4,
     3400
    ],
    [
     1,
     3000
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7
  },
  "tw4": {
   "dur_ms": 45,
   "pitch": [
    [
     0,
     5600
    ],
    [
     1,
     5000
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.2,
     1
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.6
  },
  "tw5": {
   "dur_ms": 110,
   "pitch": [
    [
     0,
     3600
    ],
    [
     0.3,
     3200
    ],
    [
     0.7,
     4400
    ],
    [
     1,
     3800
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "trill": {
    "hz": 40,
    "depth_st": 1.5,
    "am": 0.4
   }
  },
  "tw6": {
   "dur_ms": 65,
   "pitch": [
    [
     0,
     4200
    ],
    [
     0.5,
     4600
    ],
    [
     1,
     3900
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.65
  }
 },
 "types": {
  "song": {
   "pause_s": [
    2.0,
    7.0
   ],
   "length_s": [
    2.0,
    5.0
   ],
   "transpose_st": 0.8,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     12,
     22
    ],
    "vo_tension": [
     70,
     84
    ],
    "vo_rough": [
     2,
     8
    ],
    "ph_tempo": [
     96,
     104
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "tw1",
        "tw2",
        "tw3",
        "tw4",
        "tw5",
        "tw6"
       ],
       "count": [
        12,
        30
       ],
       "share": 1.0,
       "gap_ms": [
        15,
        55
       ]
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,hs=`{
 "_note": "Sound design starting values for the barn swallow, M11 batch 7. Not bird facts.",
 "pitch_ref_hz": 3800,
 "base": {
  "vo_pitch": 1.0,
  "vo_breath": 16,
  "vo_tension": 78,
  "vo_trill": 0,
  "vo_rough": 4,
  "ph_tempo": 100,
  "ph_pause": 4.0,
  "ph_length": 3.5,
  "ph_variation": 50,
  "su_distance": 20,
  "su_wind": 1.5,
  "su_space": 35
 },
 "ranges": {
  "vo_pitch": [
   0.5,
   2.0
  ],
  "vo_breath": [
   0,
   100
  ],
  "vo_tension": [
   0,
   100
  ],
  "vo_trill": [
   0,
   40
  ],
  "vo_rough": [
   0,
   100
  ],
  "ph_tempo": [
   50,
   200
  ],
  "ph_pause": [
   0.2,
   20
  ],
  "ph_length": [
   0.2,
   8
  ],
  "ph_variation": [
   0,
   100
  ],
  "su_distance": [
   1,
   200
  ],
  "su_wind": [
   0,
   15
  ],
  "su_space": [
   0,
   100
  ]
 }
}
`,ds=`{
 "_note": "Field guide text for this bird, both languages. Facts come from birds.md (M11 batch 1, SNL). A field with verified false is not shown as a fact: empty means not described, and the text says what the sources leave out. Norwegian wording is mine, Eirik to check. calendar rows: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/motacilla-alba",
 "facts": {
  "length": {
   "en": "16,5 to 19 cm, 17 to 28 g",
   "no": "16,5 til 19 cm, 17 til 28 g",
   "verified": true
  },
  "broods": {
   "en": "Usually 2 or 3",
   "no": "Vanligvis 2 eller 3",
   "verified": true
  },
  "range": {
   "en": "The whole country, coast to mountains",
   "no": "Hele landet, fra kyst til fjell",
   "verified": true
  },
  "habitat": {
   "en": "Open land, often by buildings, bridges and water",
   "no": "Åpent land, ofte ved bygninger, bruer og vann",
   "verified": true
  },
  "food": {
   "en": "Insects and other small animals",
   "no": "Insekter og andre smådyr",
   "verified": true
  },
  "status": {
   "en": "LC, least concern",
   "no": "LC, livskraftig",
   "verified": true
  },
  "nest": {
   "en": "Cavities and covered places, 3 to 8 eggs",
   "no": "Hulrom og overdekte steder, 3 til 8 egg",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "",
   "no": "",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "SNL describes no song or calls of the white wagtail. Every sound Pipp plays here is a stand-in.",
  "no": "SNL beskriver ingen sang eller lyder fra linerla. Alle lydene Pipp spiller her er stedfortredere.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "Placeholder twitter. No source describes its sounds.",
   "no": "Plassholder-kvitter. Ingen kilde beskriver lydene.",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "parts": {},
 "calendar": {
  "present": "???yyyy?????",
  "sings": "????????????",
  "note": {
   "en": "Migrant: arrives in early April in the south to early May in the north, winters in southern Europe, North Africa and the Middle East. The sources do not say when it leaves, or give its singing months.",
   "no": "Trekkfugl: kommer i begynnelsen av april i sør til begynnelsen av mai i nord, overvintrer i Sør-Europa, Nord-Afrika og Midtøsten. Kildene sier ikke når den drar, og oppgir ikke månedene med sang.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "name": {
    "en": "Pied wagtail",
    "no": "Svartryggerle"
   },
   "text": {
    "en": "A subspecies with a black or dark grey back and flanks; a few pairs breed in Sørlandet and Vestlandet.",
    "no": "En underart med svart eller mørkegrå rygg og sider; noen få par hekker på Sørlandet og Vestlandet.",
    "verified": true
   }
  }
 ]
}
`,ps=`{
 "_note": "White wagtail ink plate in a 280x240 box, drawn in M11 from the great tit plate, not from a design: black crown, nape and throat (ink), a white mask (face), grey back as light hatching, white belly, long tail. SNL describes the species, not the sexes or the juvenile, so the female shows the species' marks and the juvenile is drawn alike with [TO VERIFY]. Bill colour not in SNL.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M198 70 C196 56 180 50 166 56 C152 62 142 76 132 92 C120 110 110 130 108 150 C110 160 118 168 126 172 C146 182 170 174 180 156 C192 136 199 108 199 90 C200 86 201 82 200 80 Z",
  "wing": "M156 92 C164 118 148 148 112 160 C118 138 130 110 156 92 Z"
 },
 "layers": [
  {
   "path": "M14 206 C80 202 150 199 268 194",
   "stroke": 4
  },
  {
   "path": "M214 197 l20 -20 M224 187 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 177 q10 -10 18 -2 q-9 8 -18 2 Z M240 190 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M114 146 L36 208 L48 220 L126 166 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M118 152 L40 211 M122 159 L44 215",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M142 176 L144 199 M156 175 L159 198 M136 201 L144 199 L152 201 M151 199 L159 198 L167 200",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "path": "M126 101 L163 123 L161 128 L124 106 Z",
   "fill": "face",
   "stroke": 1,
   "within": "wing"
  },
  {
   "path": "M194 112 C186 132 172 152 150 168 C164 180 178 170 186 152 C194 136 198 120 199 106 Z",
   "fill": "face",
   "within": "body"
  },
  {
   "path": "M200 66 L200 82 C200 96 198 104 194 110 C184 110 172 104 160 98 C152 94 144 92 136 90 C142 76 152 60 168 54 C184 50 198 56 200 66 Z",
   "fill": "cap",
   "within": "body"
  },
  {
   "path": "M200 86 C198 80 192 76 184 76 C176 74 166 74 158 76 C154 86 160 98 172 102 C184 104 194 100 200 92 Z",
   "fill": "face",
   "stroke": 1,
   "within": "body"
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    182,
    68
   ],
   "pupil": 2.4
  },
  {
   "path": "M182.4 66.8 m-0.9 0 a0.9 0.9 0 1 0 1.8 0 a0.9 0.9 0 1 0 -1.8 0",
   "fill": "face"
  },
  {
   "path": "M198 71 L216 75 L200 77 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M200 77 L214 77 L200 80 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M226 64 A14 14 0 0 1 226 88 M233 56 A24 24 0 0 1 233 96 M240 48 A34 34 0 0 1 240 104",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "hatch": {
  "body": {
   "rect": [
    104,
    50,
    204,
    184
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    108,
    88,
    166,
    164
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    200,
    74
   ],
   "deg": -14
  },
  "lower": {
   "at": [
    200,
    79
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    120,
    156
   ],
   "deg": -7
  }
 },
 "variants": {
  "male": {
   "body_pitch": 10,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow",
   "cap": "ink"
  },
  "female": {
   "body_pitch": 10,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow",
   "cap": "ink"
  },
  "juvenile": {
   "body_pitch": 10,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow",
   "cap": "ink"
  }
 },
 "callouts": [
  {
   "id": "head",
   "leader": "M170 88 L122 36",
   "at": [
    120,
    30
   ],
   "align": "right",
   "male": {
    "en": "WHITE MASK",
    "no": "HVIT MASKE",
    "verified": true
   },
   "female": {
    "en": "WHITE MASK",
    "no": "HVIT MASKE",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M150 112 L112 104",
   "at": [
    108,
    98
   ],
   "align": "right",
   "male": {
    "en": "WHITE, BLACK AND GREY",
    "no": "HVIT, SVART OG GRÅ",
    "verified": true
   },
   "female": {
    "en": "WHITE, BLACK AND GREY",
    "no": "HVIT, SVART OG GRÅ",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "tail",
   "leader": "M80 184 L72 160",
   "at": [
    68,
    144
   ],
   "align": "right",
   "male": {
    "en": "LONG, WAGGING",
    "no": "LANG, VIPPENDE",
    "verified": true
   },
   "female": {
    "en": "LONG, WAGGING",
    "no": "LANG, VIPPENDE",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Adult. White mask, long wagging tail.",
   "no": "Voksen. Hvit maske, lang vippende hale.",
   "verified": true
  },
  "female": {
   "en": "Female. Not described in the sources.",
   "no": "Hunn. Ikke beskrevet i kildene.",
   "verified": false
  },
  "juvenile": {
   "en": "Juvenile. Not described in the sources.",
   "no": "Ungfugl. Ikke beskrevet i kildene.",
   "verified": false
  }
 }
}
`,cs=`{
 "_note": "White wagtail, M11 batch 1. No source in hand describes its song or calls (SNL says nothing), so the whole song is a placeholder, like the herring gull's: a loose twitter of short two-part chirps and thin notes, 3,5 to 6 kHz. Replace when a source is found.",
 "syllables": {
  "chi": {
   "dur_ms": 70,
   "pitch": [
    [
     0,
     4600
    ],
    [
     0.4,
     5600
    ],
    [
     1,
     4800
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.5
  },
  "tsli": {
   "dur_ms": 120,
   "pitch": [
    [
     0,
     4200
    ],
    [
     0.45,
     5400
    ],
    [
     0.55,
     5300
    ],
    [
     1,
     4400
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     1
    ],
    [
     0.42,
     0.6
    ],
    [
     0.5,
     0.2
    ],
    [
     0.6,
     0.9
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.5
  },
  "tsri": {
   "dur_ms": 90,
   "pitch": [
    [
     0,
     5800
    ],
    [
     1,
     4600
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.45,
   "tension": -10
  },
  "twit": {
   "dur_ms": 80,
   "pitch": [
    [
     0,
     3800
    ],
    [
     0.5,
     4900
    ],
    [
     1,
     4300
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.5
  }
 },
 "types": {
  "song": {
   "pause_s": [
    2.0,
    6.0
   ],
   "length_s": [
    1.2,
    3.0
   ],
   "transpose_st": 0.6,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     12,
     20
    ],
    "vo_tension": [
     44,
     56
    ],
    "vo_rough": [
     10,
     18
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "chi",
        "tsli",
        "tsri",
        "twit"
       ],
       "count": [
        4,
        12
       ],
       "share": 1.0,
       "gap_ms": [
        50,
        160
       ],
       "no_adjacent_repeat": true
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,gs=`{
  "_note": "Sound design starting values for the white wagtail, M11 batch 1. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 4500,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 16,
    "vo_tension": 50,
    "vo_trill": 0,
    "vo_rough": 14,
    "ph_tempo": 100,
    "ph_pause": 3.0,
    "ph_length": 2.0,
    "ph_variation": 50,
    "su_distance": 15,
    "su_wind": 1.5,
    "su_space": 40
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}
`,us=`{
 "_note": "Field guide text for the willow ptarmigan, both languages. SNL describes no sounds, so every sound text is [TO VERIFY]. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/lagopus-lagopus",
 "facts": {
  "length": {
   "en": "",
   "no": "",
   "verified": false
  },
  "broods": {
   "en": "6 to 12 eggs, May to June; the hen sits about 21 days",
   "no": "6 til 12 egg, mai til juni; høna ruger i rundt 21 dager",
   "verified": true
  },
  "range": {
   "en": "Mountain forest and bare mountain; in the north out to the coast and islands",
   "no": "Fjellskog og snaufjell; i nord helt ut til kysten og på øyer",
   "verified": true
  },
  "habitat": {
   "en": "Mountain birch forest and bare mountain, also large bogs in lower conifer forest",
   "no": "Fjellbjørkeskog og snaufjell, også store myrer i lavereliggende barskog",
   "verified": true
  },
  "food": {
   "en": "Mostly on the ground; in late winter also in birch and willow",
   "no": "Mest på bakken; på senvinteren også i bjørk og selje",
   "verified": true
  },
  "status": {
   "en": "LC, least concern, Norwegian red list",
   "no": "LC, livskraftig, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "A shallow scrape on the ground, well hidden in low shrubs",
   "no": "En grunn grop på bakken, godt skjult i lav kratt",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "",
   "no": "",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "SNL describes no sounds of the willow ptarmigan. Pipp plays a low cackling series here as a stand-in. Winter plumage all white with a black tail; summer plumage mottled brown; the wings are white in every plumage.",
  "no": "SNL beskriver ingen lyder fra liryper. Pipp spiller en lav, kaklende serie her som stedfortreder. Vinterdrakten er helt hvit med svart stjert; sommerdrakten brunspraglete; vingene er hvite i alle drakter.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "",
   "no": "",
   "verified": false
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "????????????",
  "note": {
   "en": "Normally resident; icing over its food can send it down to the lowlands and in flocks to islands in the south and east. Eggs May to June.",
   "no": "Vanligvis standfugl; nedising av maten kan få den til å trekke ned i lavlandet og i flokker til øyer i sør og øst. Egg mai til juni.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "name": {
    "en": "Rock ptarmigan",
    "no": "Fjellrype"
   },
   "text": {
    "en": "A little smaller, with a bill under 1 cm deep at the base (the willow ptarmigan's is over 1 cm); its sexes differ in winter plumage.",
    "no": "Litt mindre, med nebb under 1 cm høyt ved roten (lirypas er over 1 cm); kjønnene er ulike i vinterdrakt.",
    "verified": true
   }
  }
 ]
}
`,fs=`{
 "_note": "Willow ptarmigan ink plate in a 280x240 box, M11 batch 6, built from the woodcock plate: compact on the ground, summer plumage mottled brown (hatching; the male a little denser for his redder brown), white wings in every plumage, a short deep bill (birds.md, SNL). Winter plumage (all white, black tail) is in the caption only. The red comb, feet and juvenile are not described.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M190 96 C190 80 178 70 164 72 C150 74 142 86 140 98 C116 102 92 112 76 126 C70 132 74 140 84 146 C108 160 140 166 164 160 C182 154 192 140 192 124 C192 114 190 104 190 96 Z",
  "wing": "M154 106 C130 108 104 116 82 128 C104 138 132 142 158 134 C164 124 162 112 154 106 Z"
 },
 "hatch": {
  "body": {
   "rect": [
    70,
    68,
    194,
    168
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    80,
    104,
    164,
    144
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    188,
    94
   ],
   "deg": -5
  },
  "lower": {
   "at": [
    188,
    98
   ],
   "deg": 4
  },
  "tail": {
   "at": [
    80,
    130
   ],
   "deg": -3
  }
 },
 "layers": [
  {
   "path": "M14 196 C70 186 150 184 268 190",
   "stroke": 2.5
  },
  {
   "path": "M40 190 q10 -12 22 -2 q-12 6 -22 2 Z M210 186 q12 -10 22 0 q-12 6 -22 0 Z M120 192 q8 -8 16 0",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M138 160 L136 186 M154 162 L156 186 M128 187 L136 186 L144 188 M148 187 L156 186 L164 188",
   "stroke": 1.5
  },
  {
   "path": "M80 126 L58 128 L62 138 L84 136 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "clip": "wing",
   "fill": "face"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    170,
    92
   ],
   "pupil": 3.2
  },
  {
   "path": "M188 88 C196 88 202 92 204 96 L189 98 Z",
   "fill": "bill",
   "stroke": 1.3,
   "part": "upper"
  },
  {
   "path": "M189 98 L203 97 C200 101 194 103 188 102 Z",
   "fill": "bill",
   "stroke": 1.3,
   "part": "lower"
  },
  {
   "path": "M132 60 A16 16 0 0 0 132 88 M125 52 A26 26 0 0 0 125 96",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "variants": {
  "male": {
   "body_pitch": 4,
   "wing_pitch": 0,
   "eye_ring": 0,
   "bill": "ink"
  },
  "female": {
   "body_pitch": 5,
   "wing_pitch": 0,
   "eye_ring": 0,
   "bill": "ink"
  },
  "juvenile": {
   "body_pitch": 5,
   "wing_pitch": 0,
   "eye_ring": 0,
   "bill": "ink"
  }
 },
 "callouts": [
  {
   "id": "bill",
   "leader": "M198 94 L218 50",
   "at": [
    222,
    37
   ],
   "align": "centre",
   "male": {
    "en": "OVER 1 CM DEEP",
    "no": "OVER 1 CM HØYT",
    "verified": true
   },
   "female": {
    "en": "OVER 1 CM DEEP",
    "no": "OVER 1 CM HØYT",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M110 116 L80 82",
   "at": [
    76,
    76
   ],
   "align": "right",
   "male": {
    "en": "REDDER BROWN, MOTTLED",
    "no": "RØDBRUNERE, SPRAGLETE",
    "verified": true
   },
   "female": {
    "en": "MOTTLED BROWN",
    "no": "BRUNSPRAGLETE",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "wing",
   "leader": "M120 130 L110 202",
   "at": [
    110,
    214
   ],
   "align": "centre",
   "male": {
    "en": "WHITE ALL YEAR",
    "no": "HVIT HELE ÅRET",
    "verified": true
   },
   "female": {
    "en": "WHITE ALL YEAR",
    "no": "HVIT HELE ÅRET",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Male in summer. White in winter.",
   "no": "Hann om sommeren. Hvit om vinteren.",
   "verified": true
  },
  "female": {
   "en": "Hen in summer, a little smaller.",
   "no": "Høne om sommeren, litt mindre.",
   "verified": true
  },
  "juvenile": {
   "en": "Young bird. Not described in the sources, so drawn like the hen.",
   "no": "Ungfugl. Ikke beskrevet i kildene, så tegnet som høna.",
   "verified": false
  }
 }
}
`,ms=`{
 "_note": "Willow ptarmigan, M11 batch 6. Placeholder: SNL describes no sounds. The song slot holds a rough, low cackling series that speeds up; every shape is a sound design guess. Rework once a source is found.",
 "syllables": {
  "kok": {
   "dur_ms": 110,
   "pitch": [
    [
     0,
     720
    ],
    [
     0.3,
     800
    ],
    [
     1,
     640
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8,
   "rough": 55,
   "tension": -15
  },
  "kok2": {
   "dur_ms": 95,
   "pitch": [
    [
     0,
     680
    ],
    [
     0.3,
     760
    ],
    [
     1,
     610
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75,
   "rough": 55,
   "tension": -15
  },
  "kaaw": {
   "dur_ms": 320,
   "pitch": [
    [
     0,
     600
    ],
    [
     0.3,
     760
    ],
    [
     1,
     560
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     1
    ],
    [
     0.7,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.85,
   "rough": 50,
   "tension": -15
  }
 },
 "types": {
  "song": {
   "pause_s": [
    6.0,
    16.0
   ],
   "length_s": [
    1.5,
    3.5
   ],
   "transpose_st": 0.8,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     18,
     28
    ],
    "vo_tension": [
     16,
     28
    ],
    "vo_rough": [
     44,
     56
    ],
    "ph_tempo": [
     96,
     104
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "kaaw"
       ],
       "count": [
        1,
        2
       ],
       "share": 0.3,
       "gap_ms": [
        200,
        300
       ],
       "no_adjacent_repeat": false
      },
      {
       "pool": [
        "kok",
        "kok2"
       ],
       "count": [
        4,
        8
       ],
       "share": 0.35,
       "gap_ms": [
        120,
        180
       ]
      },
      {
       "pool": [
        "kok",
        "kok2"
       ],
       "count": [
        6,
        12
       ],
       "share": 0.35,
       "gap_ms": [
        40,
        70
       ]
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,vs=`{
 "_note": "Sound design starting values for the willow ptarmigan, M11 batch 6. Not bird facts.",
 "pitch_ref_hz": 720,
 "base": {
  "vo_pitch": 1.0,
  "vo_breath": 22,
  "vo_tension": 20,
  "vo_trill": 0,
  "vo_rough": 50,
  "ph_tempo": 100,
  "ph_pause": 10.0,
  "ph_length": 2.5,
  "ph_variation": 50,
  "su_distance": 40,
  "su_wind": 1.5,
  "su_space": 35
 },
 "ranges": {
  "vo_pitch": [
   0.5,
   2.0
  ],
  "vo_breath": [
   0,
   100
  ],
  "vo_tension": [
   0,
   100
  ],
  "vo_trill": [
   0,
   40
  ],
  "vo_rough": [
   0,
   100
  ],
  "ph_tempo": [
   50,
   200
  ],
  "ph_pause": [
   0.2,
   20
  ],
  "ph_length": [
   0.2,
   8
  ],
  "ph_variation": [
   0,
   100
  ],
  "su_distance": [
   1,
   200
  ],
  "su_wind": [
   0,
   15
  ],
  "su_space": [
   0,
   100
  ]
 }
}
`,bs=`{
 "_note": "Field guide text for the willow warbler, both languages. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/phylloscopus-trochilus",
 "facts": {
  "length": {
   "en": "About 11 cm, 7 to 11 g",
   "no": "Omtrent 11 cm, 7 til 11 g",
   "verified": true
  },
  "broods": {
   "en": "",
   "no": "",
   "verified": false
  },
  "range": {
   "en": "Norway's most common bird, 4,5 to 11 million pairs",
   "no": "Norges vanligste fugl, 4,5 til 11 millioner par",
   "verified": true
  },
  "habitat": {
   "en": "Skerries to bare mountain, most in mountain birch",
   "no": "Fra skjærgården til snaufjellet, mest i fjellbjørkeskog",
   "verified": true
  },
  "food": {
   "en": "Insects and spiders, some berries in autumn",
   "no": "Insekter og edderkopper, litt bær om høsten",
   "verified": true
  },
  "status": {
   "en": "LC, viable, Norwegian red list",
   "no": "LC, livskraftig, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "On the ground, 6 to 8 eggs",
   "no": "På bakken, 6 til 8 egg",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Sings",
   "no": "Synger",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "A melodic, slightly melancholy row of notes, different from the chiffchaff's. One of the smallest birds in Norway, and counted as the most common. The sources do not say how the row is built, so Pipp's version is a stand-in.",
  "no": "En melodisk, litt vemodig tonerekke, ulik gransangerens. En av de minste fuglene i Norge, og regnet som den vanligste. Kildene sier ikke hvordan rekken er bygd, så Pipps versjon er en stedfortreder.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "A melodic, slightly melancholy row of notes.",
   "no": "En melodisk, litt vemodig tonerekke.",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "calendar": {
  "present": "???yyyyy????",
  "sings": "????????????",
  "note": {
   "en": "Arrives at the turn of April and May, leaves mainly in August. Northern birds winter in East Africa, southern birds in West Africa. The sources do not give its singing months.",
   "no": "Kommer i overgangen april–mai og drar hovedsakelig i august. Fugler fra nord overvintrer i Øst-Afrika, fra sør i Vest-Afrika. Kildene oppgir ikke månedene med sang.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "text": {
    "en": "Looks confusingly alike; the song is different.",
    "no": "Ligner til forveksling; sangen er ulik.",
    "verified": true
   },
   "id": "gransanger"
  }
 ]
}
`,_s=`{
 "_note": "Willow warbler ink plate in a 280x240 box, drawn in M10 from the great tit plate (same small perched bird), not from a design. No cap, cheek or wing bar; pale underside; thinner bill. Callout values from birds.md (SNL); no sex or age difference is known, so female and juvenile values are not verified.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M198 70 C196 56 180 50 166 56 C152 62 142 76 132 92 C120 110 110 130 108 150 C110 160 118 168 126 172 C146 182 170 174 180 156 C192 136 199 108 199 90 C200 86 201 82 200 80 Z",
  "wing": "M156 92 C164 118 148 148 112 160 C118 138 130 110 156 92 Z"
 },
 "layers": [
  {
   "path": "M14 206 C80 202 150 199 268 194",
   "stroke": 4
  },
  {
   "path": "M214 197 l20 -20 M224 187 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 177 q10 -10 18 -2 q-9 8 -18 2 Z M240 190 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M114 146 L62 204 L74 214 L126 166 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M118 152 L66 207 M122 159 L70 211",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M142 176 L144 199 M156 175 L159 198 M136 201 L144 199 L152 201 M151 199 L159 198 L167 200",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "variant": "under",
   "fill": "face",
   "within": "body"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    182,
    68
   ],
   "pupil": 2.4
  },
  {
   "path": "M182.4 66.8 m-0.9 0 a0.9 0.9 0 1 0 1.8 0 a0.9 0.9 0 1 0 -1.8 0",
   "fill": "face"
  },
  {
   "path": "M198 69 L218 75 L200 77 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M200 77 L216 76 L200 80 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M226 64 A14 14 0 0 1 226 88 M233 56 A24 24 0 0 1 233 96 M240 48 A34 34 0 0 1 240 104",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "hatch": {
  "body": {
   "rect": [
    104,
    50,
    204,
    184
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    108,
    88,
    166,
    164
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    200,
    74
   ],
   "deg": -14
  },
  "lower": {
   "at": [
    200,
    79
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    120,
    156
   ],
   "deg": -5
  }
 },
 "variants": {
  "male": {
   "body_pitch": 9,
   "wing_pitch": 6,
   "eye_ring": 0,
   "bill": "shadow",
   "under": "M199 84 C196 108 190 134 180 156 C170 174 146 182 126 172 C140 170 156 160 166 144 C178 124 188 102 192 84 Z"
  },
  "female": {
   "body_pitch": 9,
   "wing_pitch": 6,
   "eye_ring": 0,
   "bill": "shadow",
   "under": "M199 84 C196 108 190 134 180 156 C170 174 146 182 126 172 C140 170 156 160 166 144 C178 124 188 102 192 84 Z"
  },
  "juvenile": {
   "body_pitch": 9,
   "wing_pitch": 6,
   "eye_ring": 0,
   "bill": "shadow",
   "under": "M199 84 C196 108 190 134 180 156 C170 174 146 182 126 172 C140 170 156 160 166 144 C178 124 188 102 192 84 Z"
  }
 },
 "callouts": [
  {
   "id": "bill",
   "leader": "M208 72 L208 23",
   "at": [
    208,
    10
   ],
   "align": "centre",
   "male": {
    "en": "",
    "no": "",
    "verified": false
   },
   "female": {
    "en": "",
    "no": "",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M140 100 L74 86",
   "at": [
    70,
    80
   ],
   "align": "right",
   "male": {
    "en": "GREY-GREEN",
    "no": "GRÅGRØNN",
    "verified": true
   },
   "female": {
    "en": "GREY-GREEN",
    "no": "GRÅGRØNN",
    "verified": false
   },
   "juvenile": {
    "en": "GREY-GREEN",
    "no": "GRÅGRØNN",
    "verified": false
   }
  },
  {
   "id": "breast",
   "leader": "M184 130 L232 200",
   "at": [
    276,
    212
   ],
   "align": "right",
   "male": {
    "en": "GREY-WHITE",
    "no": "GRÅHVIT",
    "verified": true
   },
   "female": {
    "en": "GREY-WHITE",
    "no": "GRÅHVIT",
    "verified": false
   },
   "juvenile": {
    "en": "GREY-WHITE",
    "no": "GRÅHVIT",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Singing. Beak and tail follow the sound.",
   "no": "Synger. Nebb og hale følger lyden.",
   "verified": true
  },
  "female": {
   "en": "Female. No difference from the male is known.",
   "no": "Hunn. Ingen kjent forskjell fra hannen.",
   "verified": false
  },
  "juvenile": {
   "en": "Juvenile. Not described in the sources, so drawn like the adult.",
   "no": "Ungfugl. Ikke beskrevet i kildene, så tegnet som de voksne.",
   "verified": false
  }
 }
}`,ks=`{
 "_note": "Willow warbler, M10. The shape is a sound design reading of SNL's 'a melodic, slightly melancholy row of notes': soft high notes falling through the middle to lower, fuller notes, sometimes with a small rising end. Every pitch, timing and the ending are guesses, not tuned against recordings. The call 'huiit' is a placeholder; SNL describes no call. No part names: the shape is a guess, so the field guide draws no brackets (as for the chaffinch).",
 "syllables": {
  "h1": {
   "dur_ms": 90,
   "pitch": [
    [
     0,
     5300
    ],
    [
     0.5,
     5500
    ],
    [
     1,
     5100
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.2,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.6
  },
  "h2": {
   "dur_ms": 80,
   "pitch": [
    [
     0,
     5600
    ],
    [
     1,
     5000
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.2,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.6
  },
  "h3": {
   "dur_ms": 100,
   "pitch": [
    [
     0,
     5100
    ],
    [
     0.4,
     5400
    ],
    [
     1,
     4900
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.2,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.62
  },
  "m1": {
   "dur_ms": 110,
   "pitch": [
    [
     0,
     4800
    ],
    [
     0.5,
     4900
    ],
    [
     1,
     4300
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.2,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75
  },
  "m2": {
   "dur_ms": 100,
   "pitch": [
    [
     0,
     4500
    ],
    [
     1,
     4000
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.2,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75
  },
  "m3": {
   "dur_ms": 120,
   "pitch": [
    [
     0,
     4300
    ],
    [
     0.3,
     4500
    ],
    [
     1,
     3900
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.2,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.78
  },
  "m4": {
   "dur_ms": 95,
   "pitch": [
    [
     0,
     4100
    ],
    [
     1,
     3700
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.2,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75
  },
  "l1": {
   "dur_ms": 130,
   "pitch": [
    [
     0,
     3700
    ],
    [
     0.4,
     3800
    ],
    [
     1,
     3300
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.2,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.85
  },
  "l2": {
   "dur_ms": 120,
   "pitch": [
    [
     0,
     3500
    ],
    [
     1,
     3100
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.2,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.85
  },
  "l3": {
   "dur_ms": 140,
   "pitch": [
    [
     0,
     3400
    ],
    [
     0.5,
     3550
    ],
    [
     1,
     3150
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.2,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.85
  },
  "e1": {
   "dur_ms": 170,
   "pitch": [
    [
     0,
     3100
    ],
    [
     0.35,
     3600
    ],
    [
     0.7,
     3300
    ],
    [
     1,
     3500
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.2,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.85
  },
  "e2": {
   "dur_ms": 150,
   "pitch": [
    [
     0,
     3200
    ],
    [
     0.5,
     3700
    ],
    [
     1,
     3400
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.2,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8
  },
  "huit": {
   "dur_ms": 160,
   "pitch": [
    [
     0,
     3000
    ],
    [
     0.6,
     3900
    ],
    [
     1,
     4200
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     0.7
    ],
    [
     0.6,
     1
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.6,
   "breath": 18
  }
 },
 "types": {
  "song": {
   "pause_s": [
    2.5,
    6.0
   ],
   "length_s": [
    1.8,
    3.2
   ],
   "transpose_st": 1.0,
   "avoid_repeat": true,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     10,
     18
    ],
    "vo_tension": [
     24,
     36
    ],
    "vo_rough": [
     1,
     5
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 3,
     "sections": [
      {
       "pool": [
        "h1",
        "h2",
        "h3"
       ],
       "count": [
        2,
        3
       ],
       "share": 0.25,
       "gap_ms": [
        25,
        50
       ]
      },
      {
       "pool": [
        "m1",
        "m2",
        "m3",
        "m4"
       ],
       "count": [
        3,
        5
       ],
       "share": 0.4,
       "gap_ms": [
        25,
        55
       ]
      },
      {
       "pool": [
        "l1",
        "l2",
        "l3"
       ],
       "count": [
        2,
        4
       ],
       "share": 0.25,
       "gap_ms": [
        30,
        60
       ]
      },
      {
       "pool": [
        "e1",
        "e2"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.1,
       "gap_ms": [
        40,
        80
       ],
       "chance": 0.6
      }
     ]
    },
    {
     "weight": 2,
     "sections": [
      {
       "pool": [
        "h1",
        "h2",
        "h3"
       ],
       "count": [
        2,
        3
       ],
       "share": 0.25,
       "gap_ms": [
        25,
        50
       ]
      },
      {
       "pool": [
        "m1",
        "m2",
        "m3",
        "m4"
       ],
       "count": [
        2,
        4
       ],
       "share": 0.4,
       "gap_ms": [
        25,
        55
       ]
      },
      {
       "pool": [
        "l1",
        "l2",
        "l3"
       ],
       "count": [
        2,
        4
       ],
       "share": 0.25,
       "gap_ms": [
        30,
        60
       ]
      },
      {
       "pool": [
        "e1",
        "e2"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.1,
       "gap_ms": [
        40,
        80
       ],
       "chance": 0.6
      }
     ]
    }
   ],
   "overrides": []
  },
  "call": {
   "pause_s": [
    1.5,
    4.5
   ],
   "length_s": [
    0.2,
    1.0
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     14,
     22
    ],
    "vo_tension": [
     30,
     40
    ],
    "vo_rough": [
     1,
     4
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "huit"
       ],
       "count": [
        1,
        2
       ],
       "share": 1.0,
       "gap_ms": [
        400,
        800
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}`,ys=`{
  "_note": "Sound design starting values for the willow warbler, M10. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 4000,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 14,
    "vo_tension": 30,
    "vo_trill": 0,
    "vo_rough": 3,
    "ph_tempo": 100,
    "ph_pause": 4.0,
    "ph_length": 2.6,
    "ph_variation": 50,
    "su_distance": 15,
    "su_wind": 1.5,
    "su_space": 35
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}`,ws=`{
 "_note": "Field guide text for the common tern, both languages. Facts from birds.md (SNL, checked 2026-11-26). SNL describes its sounds only against the Arctic tern's, so the shapes and every type text are [TO VERIFY]. Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/sterna-hirundo",
 "facts": {
  "length": {
   "en": "",
   "no": "",
   "verified": false
  },
  "broods": {
   "en": "Usually 2 to 3 eggs, May to June",
   "no": "Vanligvis 2 til 3 egg, mai til juni",
   "verified": true
  },
  "range": {
   "en": "The commonest tern on the coast of southern Norway, fewer to the north; about 11 000 pairs",
   "no": "Den vanligste ternen langs kysten av Sør-Norge, færre nordover; rundt 11 000 par",
   "verified": true
  },
  "habitat": {
   "en": "Coast and fresh water inland, in colonies",
   "no": "Kysten og ferskvann i innlandet, i kolonier",
   "verified": true
  },
  "food": {
   "en": "Mainly small fish, also crustaceans and insects; hovers and dives",
   "no": "Mest småfisk, også krepsdyr og insekter; står stille i lufta og stupdykker",
   "verified": true
  },
  "status": {
   "en": "EN, endangered, Norwegian red list",
   "no": "EN, sterkt truet, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "A shallow scrape on the ground, often lined with dry grass",
   "no": "En grunn grop på bakken, ofte fôret med tørre strå",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "",
   "no": "",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "Its sounds are like the Arctic tern's, but harder, more grating and deeper, and it is usually very noisy at the colony. SNL gives no transcription, so the notes Pipp plays are a stand-in. Grey and white with a black cap, a forked tail and an orange-red bill with a black tip in the breeding season.",
  "no": "Lydene ligner rødnebbternas, men er hardere, mer skurrende og dypere, og den er som regel svært lydelig ved kolonien. SNL gir ingen gjengivelse, så tonene Pipp spiller er en stedfortreder. Grå og hvit med svart hette, kløftet stjert og oransjerødt nebb med svart spiss i hekketiden.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "",
   "no": "",
   "verified": false
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "calendar": {
  "present": "nnnnyyyyynnn",
  "sings": "????????????",
  "note": {
   "en": "Arrives in May and leaves July to September; most Norwegian birds winter on the coasts of West and South Africa. Eggs in May and June.",
   "no": "Kommer i mai og drar juli til september; de fleste norske fuglene overvintrer langs kysten av Vest- og Sør-Afrika. Egg i mai og juni.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "name": {
    "en": "Arctic tern",
    "no": "Rødnebbterne"
   },
   "text": {
    "en": "Hard to tell apart. The Arctic tern has shorter legs, an all-red bill and longer tail streamers.",
    "no": "Vanskelige å skille. Rødnebbterna har kortere bein, helrødt nebb og lengre stjertspyd.",
    "verified": true
   }
  }
 ]
}
`,Ls=`{
 "_note": "Common tern ink plate in a 280x240 box, drawn in M11 batch 4, not from a design: standing on a rock, slim grey and white body (light hatching), black cap (ink), long pointed wings past the forked tail, short legs, orange-red bill (shadow) with a black tip (birds.md, SNL, breeding season). Sexes alike as far as known; juvenile and winter plumage not described, so the juvenile is drawn like the adult and marked [TO VERIFY].",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M200 88 C200 74 190 66 178 66 C166 66 158 74 157 86 C136 94 104 110 72 130 C102 142 128 164 152 166 C176 168 192 156 194 138 C196 120 200 104 200 88 Z",
  "wing": "M172 106 C142 106 106 118 72 130 C46 140 24 150 8 156 C36 156 80 148 114 140 C144 132 166 120 172 106 Z",
  "cap": "M156 86 C157 72 167 63 180 63 C192 63 200 72 201 84 C192 81 181 81 172 83 C165 84 160 86 156 86 Z"
 },
 "hatch": {
  "body": {
   "rect": [
    64,
    60,
    202,
    170
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    6,
    100,
    174,
    160
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    199,
    83
   ],
   "deg": -12
  },
  "lower": {
   "at": [
    199,
    89
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    72,
    128
   ],
   "deg": -3
  }
 },
 "layers": [
  {
   "path": "M14 216 C50 198 110 192 170 194 C214 196 246 204 268 216 Z",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "path": "M60 210 l14 -6 M150 202 l18 2 M214 206 l12 4",
   "stroke": 1
  },
  {
   "path": "M148 164 L146 193 M162 165 L164 193 M138 194 L146 193 L154 195 M156 194 L164 193 L172 195",
   "stroke": 1.5
  },
  {
   "path": "M74 124 L22 128 L42 134 L18 144 L76 134 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "clip": "wing",
   "fill": "face"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "variant": "capfill",
   "fill": "ink"
  },
  {
   "eye": [
    184,
    77
   ],
   "pupil": 2.2
  },
  {
   "path": "M199 79 L234 85 L199 88 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "variant": "tip_u",
   "fill": "ink",
   "part": "upper"
  },
  {
   "path": "M199 88 L229 87 L199 92 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "variant": "tip_l",
   "fill": "ink",
   "part": "lower"
  },
  {
   "path": "M242 70 A16 16 0 0 1 242 98 M249 62 A26 26 0 0 1 249 106 M256 54 A36 36 0 0 1 256 114",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "variants": {
  "male": {
   "body_pitch": 0,
   "wing_pitch": 10,
   "eye_ring": 0,
   "bill": "shadow",
   "capfill": "M156 86 C157 72 167 63 180 63 C192 63 200 72 201 84 C192 81 181 81 172 83 C165 84 160 86 156 86 Z",
   "tip_u": "M224 83.3 L234 85 L224 86.6 Z",
   "tip_l": "M221 87.3 L229 87 L221 89.4 Z"
  },
  "female": {
   "body_pitch": 0,
   "wing_pitch": 10,
   "eye_ring": 0,
   "bill": "shadow",
   "capfill": "M156 86 C157 72 167 63 180 63 C192 63 200 72 201 84 C192 81 181 81 172 83 C165 84 160 86 156 86 Z",
   "tip_u": "M224 83.3 L234 85 L224 86.6 Z",
   "tip_l": "M221 87.3 L229 87 L221 89.4 Z"
  },
  "juvenile": {
   "body_pitch": 0,
   "wing_pitch": 10,
   "eye_ring": 0,
   "bill": "shadow",
   "capfill": "M156 86 C157 72 167 63 180 63 C192 63 200 72 201 84 C192 81 181 81 172 83 C165 84 160 86 156 86 Z",
   "tip_u": "M224 83.3 L234 85 L224 86.6 Z",
   "tip_l": "M221 87.3 L229 87 L221 89.4 Z"
  }
 },
 "callouts": [
  {
   "id": "bill",
   "leader": "M218 84 L218 33",
   "at": [
    218,
    20
   ],
   "align": "centre",
   "male": {
    "en": "ORANGE-RED, BLACK TIP",
    "no": "ORANSJERØDT, SVART SPISS",
    "verified": true
   },
   "female": {
    "en": "ORANGE-RED, BLACK TIP",
    "no": "ORANSJERØDT, SVART SPISS",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "head",
   "leader": "M170 70 L134 50",
   "at": [
    130,
    44
   ],
   "align": "right",
   "male": {
    "en": "BLACK CAP",
    "no": "SVART HETTE",
    "verified": true
   },
   "female": {
    "en": "BLACK CAP",
    "no": "SVART HETTE",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M120 116 L86 80",
   "at": [
    82,
    74
   ],
   "align": "right",
   "male": {
    "en": "GREY AND WHITE",
    "no": "GRÅ OG HVIT",
    "verified": true
   },
   "female": {
    "en": "GREY AND WHITE",
    "no": "GRÅ OG HVIT",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "tail",
   "leader": "M40 140 L76 172",
   "at": [
    80,
    184
   ],
   "align": "centre",
   "male": {
    "en": "FORKED, SHORT STREAMERS",
    "no": "KLØFTET, KORTE SPYD",
    "verified": true
   },
   "female": {
    "en": "FORKED, SHORT STREAMERS",
    "no": "KLØFTET, KORTE SPYD",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Summer adult. Red legs.",
   "no": "Voksen om sommeren. Røde bein.",
   "verified": true
  },
  "female": {
   "en": "Female. No difference from the male is known.",
   "no": "Hunn. Ingen kjent forskjell fra hannen.",
   "verified": false
  },
  "juvenile": {
   "en": "Young bird. Not described in the sources.",
   "no": "Ungfugl. Ikke beskrevet i kildene.",
   "verified": false
  }
 }
}
`,Ms=`{
 "_note": "Common tern, M11 batch 4. SNL says only that its sounds are like the Arctic tern's but harder, more grating and deeper, and that it is very vocal at the colony (birds.md). Every shape here is a sound design guess: the 'song' slot holds a series of grating falling 'kriiah' notes, sometimes led in by short 'kik' notes; 'call' short 'kik' and 'kyik' series. Rework once a source is found.",
 "syllables": {
  "kriiah": {
   "dur_ms": 340,
   "pitch": [
    [
     0,
     2500
    ],
    [
     0.25,
     2900
    ],
    [
     0.6,
     2450
    ],
    [
     1,
     1850
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     0.9
    ],
    [
     0.5,
     1
    ],
    [
     0.85,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75,
   "rough": 35
  },
  "kriah2": {
   "dur_ms": 300,
   "pitch": [
    [
     0,
     2400
    ],
    [
     0.25,
     2750
    ],
    [
     1,
     1800
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75,
   "rough": 35
  },
  "kik": {
   "dur_ms": 70,
   "pitch": [
    [
     0,
     2900
    ],
    [
     1,
     2550
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "rough": 15
  },
  "kyik": {
   "dur_ms": 110,
   "pitch": [
    [
     0,
     2600
    ],
    [
     0.4,
     3000
    ],
    [
     1,
     2500
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "rough": 20
  }
 },
 "types": {
  "song": {
   "pause_s": [
    3.0,
    9.0
   ],
   "length_s": [
    1.2,
    3.0
   ],
   "transpose_st": 1.0,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     12,
     22
    ],
    "vo_tension": [
     70,
     86
    ],
    "vo_rough": [
     28,
     42
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 2,
     "sections": [
      {
       "pool": [
        "kriiah",
        "kriah2"
       ],
       "count": [
        2,
        6
       ],
       "share": 1.0,
       "gap_ms": [
        140,
        320
       ]
      }
     ]
    },
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "kik"
       ],
       "count": [
        2,
        5
       ],
       "share": 0.3,
       "gap_ms": [
        60,
        110
       ],
       "no_adjacent_repeat": false
      },
      {
       "pool": [
        "kriiah",
        "kriah2"
       ],
       "count": [
        1,
        4
       ],
       "share": 0.7,
       "gap_ms": [
        140,
        320
       ]
      }
     ]
    }
   ],
   "overrides": []
  },
  "call": {
   "pause_s": [
    1.2,
    4.0
   ],
   "length_s": [
    0.2,
    1.2
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     12,
     22
    ],
    "vo_tension": [
     70,
     86
    ],
    "vo_rough": [
     28,
     42
    ]
   },
   "phrases": [
    {
     "weight": 2,
     "sections": [
      {
       "pool": [
        "kik"
       ],
       "count": [
        2,
        8
       ],
       "share": 1.0,
       "gap_ms": [
        60,
        120
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "kyik"
       ],
       "count": [
        1,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        150,
        300
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,xs=`{
 "_note": "Sound design starting values for the common tern, M11 batch 4. Not bird facts.",
 "pitch_ref_hz": 2500,
 "base": {
  "vo_pitch": 1.0,
  "vo_breath": 16,
  "vo_tension": 78,
  "vo_trill": 0,
  "vo_rough": 34,
  "ph_tempo": 100,
  "ph_pause": 4.0,
  "ph_length": 2.0,
  "ph_variation": 50,
  "su_distance": 30,
  "su_wind": 1.5,
  "su_space": 35
 },
 "ranges": {
  "vo_pitch": [
   0.5,
   2.0
  ],
  "vo_breath": [
   0,
   100
  ],
  "vo_tension": [
   0,
   100
  ],
  "vo_trill": [
   0,
   40
  ],
  "vo_rough": [
   0,
   100
  ],
  "ph_tempo": [
   50,
   200
  ],
  "ph_pause": [
   0.2,
   20
  ],
  "ph_length": [
   0.2,
   8
  ],
  "ph_variation": [
   0,
   100
  ],
  "su_distance": [
   1,
   200
  ],
  "su_wind": [
   0,
   15
  ],
  "su_space": [
   0,
   100
  ]
 }
}
`,Ss=`{
 "_note": "Field guide text for the song thrush, both languages. Facts from birds.md (SNL, checked 2026-11-26). A field with verified false is not shown as a fact: empty means not described, and the text says what the sources leave out. Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/turdus-philomelos",
 "facts": {
  "length": {
   "en": "About 21 cm, 60 to 100 g",
   "no": "Omtrent 21 cm, 60 til 100 g",
   "verified": true
  },
  "broods": {
   "en": "",
   "no": "",
   "verified": false
  },
  "range": {
   "en": "Most of the country, scarcer in Finnmark",
   "no": "Det meste av landet, færre i Finnmark",
   "verified": true
  },
  "habitat": {
   "en": "Conifer and mixed forest, also parks in the south",
   "no": "Bar- og blandingsskog, også parker i sør",
   "verified": true
  },
  "food": {
   "en": "Insects, earthworms, snails; berries in autumn",
   "no": "Insekter, meitemark, snegler; bær om høsten",
   "verified": true
  },
  "status": {
   "en": "LC, viable, Norwegian red list",
   "no": "LC, livskraftig, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "Near the trunk, wood-pulp base, 4 to 6 eggs",
   "no": "Inntil stammen, bunn av tremasse, 4 til 6 egg",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Sings",
   "no": "Synger",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "One of the forest's best singers. A mix of chirping trills and clear, melodic whistled notes, sung staccato. Each phrase is repeated 2 to 3 times. Shy; usually seen singing in the top of a tree in spring.",
  "no": "En av skogens beste sangere. En blanding av kvitrende triller og klare, melodiske fløytetoner, sunget stakkato. Hver strofe gjentas to til tre ganger. Sky; ses helst syngende i toppen av et tre om våren.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "Whistles and trills, each phrase 2 to 3 times.",
   "no": "Fløytetoner og triller, hver strofe to til tre ganger.",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "parts": {
  "repeat": {
   "en": "REPEATED PHRASE",
   "no": "GJENTATT STROFE",
   "verified": true
  }
 },
 "calendar": {
  "present": "??yyyyyyyy??",
  "sings": "??yyy???????",
  "note": {
   "en": "Migrant. Most winter in Iberia and north-west Africa, some on the coast north to Nordland. Returns in March to April. The sources do not say when it leaves, or give its singing months after spring.",
   "no": "Trekkfugl. De fleste overvintrer på Den iberiske halvøy og i Nordvest-Afrika, noen langs kysten nord til Nordland. Kommer tilbake i mars til april. Kildene sier ikke når den drar, og oppgir ikke sangmånedene etter våren.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "id": "svarttrost",
   "text": {
    "en": "The blackbird does not repeat its phrases; the song thrush repeats each one.",
    "no": "Svarttrosten gjentar ikke strofene; måltrosten gjentar hver strofe.",
    "verified": true
   }
  },
  {
   "text": {
    "en": "Like the redwing, which has a clear pale stripe over the eye and a rust-red patch under the wing.",
    "no": "Ligner rødvingetrosten, som har en tydelig lys stripe over øyet og en rustrød flekk under vingen.",
    "verified": true
   },
   "id": "rodvingetrost"
  }
 ]
}
`,Es=`{
 "_note": "Song thrush ink plate in a 280x240 box, drawn in M10 from the blackbird plate (same thrush posture), not from a design. Shorter tail. Callout values from birds.md (SNL); no sex or age difference is known, so female and juvenile values are not verified.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M190 60 C184 44 158 42 150 62 C134 80 104 106 90 136 C92 146 98 154 106 158 C128 180 162 178 178 152 C192 130 198 104 192 80 C194 74 194 66 190 60 Z",
  "wing": "M152 90 C156 118 136 146 98 152 C106 136 118 110 152 90 Z"
 },
 "layers": [
  {
   "path": "M14 211 C80 205 150 201 268 193",
   "stroke": 4
  },
  {
   "path": "M214 196 l20 -20 M224 186 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 176 q10 -10 18 -2 q-9 8 -18 2 Z M240 189 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M90 136 L58 178 L70 190 L106 158 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M94 142 L61 182 M98 147 L64 186 M102 153 L67 189",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M136 172 L139 199 M152 173 L157 198 M131 201 L139 199 L148 202 M149 200 L157 198 L166 201",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "variant": "throat",
   "fill": "face",
   "within": "body"
  },
  {
   "variant": "spots",
   "stroke": 1.5,
   "within": "body"
  },
  {
   "eye": [
    177,
    65
   ],
   "pupil": 2.4
  },
  {
   "path": "M190 60 L220 66 L193 70 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M193 70 L216 69 L191 79 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M230 52 A16 16 0 0 1 230 76 M237 44 A26 26 0 0 1 237 84 M243 36 A36 36 0 0 1 243 92",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "hatch": {
  "body": {
   "rect": [
    86,
    42,
    200,
    182
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    96,
    88,
    158,
    154
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    192,
    67
   ],
   "deg": -16
  },
  "lower": {
   "at": [
    192,
    72
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    98,
    147
   ],
   "deg": -5
  }
 },
 "variants": {
  "male": {
   "body_pitch": 9,
   "wing_pitch": 7,
   "eye_ring": 0,
   "bill": "shadow",
   "throat": "M188 76 C180 96 168 120 150 140 C138 152 124 162 112 166 C130 178 162 176 178 152 C192 130 198 104 192 80 Z",
   "spots": "M176 104 l2 3 M179 101 l2 3 M185 92 l2 3 M187 134 l2 3 M180 88 l2 3 M139 131 l2 3 M194 101 l2 3 M187 93 l2 3 M176 138 l2 3 M131 124 l2 3 M178 116 l2 3 M193 121 l2 3 M127 131 l2 3 M177 120 l2 3 M193 126 l2 3 M136 120 l2 3 M181 128 l2 3 M189 134 l2 3 M193 119 l2 3 M186 142 l2 3 M178 150 l2 3 M179 141 l2 3 M180 130 l2 3 M191 91 l2 3 M186 95 l2 3 M192 143 l2 3 M188 85 l2 3 M185 94 l2 3 M185 132 l2 3 M185 102 l2 3 M184 138 l2 3 M176 130 l2 3 M181 91 l2 3 M178 111 l2 3"
  },
  "female": {
   "body_pitch": 9,
   "wing_pitch": 7,
   "eye_ring": 0,
   "bill": "shadow",
   "throat": "M188 76 C180 96 168 120 150 140 C138 152 124 162 112 166 C130 178 162 176 178 152 C192 130 198 104 192 80 Z",
   "spots": "M176 104 l2 3 M179 101 l2 3 M185 92 l2 3 M187 134 l2 3 M180 88 l2 3 M139 131 l2 3 M194 101 l2 3 M187 93 l2 3 M176 138 l2 3 M131 124 l2 3 M178 116 l2 3 M193 121 l2 3 M127 131 l2 3 M177 120 l2 3 M193 126 l2 3 M136 120 l2 3 M181 128 l2 3 M189 134 l2 3 M193 119 l2 3 M186 142 l2 3 M178 150 l2 3 M179 141 l2 3 M180 130 l2 3 M191 91 l2 3 M186 95 l2 3 M192 143 l2 3 M188 85 l2 3 M185 94 l2 3 M185 132 l2 3 M185 102 l2 3 M184 138 l2 3 M176 130 l2 3 M181 91 l2 3 M178 111 l2 3"
  },
  "juvenile": {
   "body_pitch": 9,
   "wing_pitch": 7,
   "eye_ring": 0,
   "bill": "shadow",
   "throat": "M188 76 C180 96 168 120 150 140 C138 152 124 162 112 166 C130 178 162 176 178 152 C192 130 198 104 192 80 Z",
   "spots": "M176 104 l2 3 M179 101 l2 3 M185 92 l2 3 M187 134 l2 3 M180 88 l2 3 M139 131 l2 3 M194 101 l2 3 M187 93 l2 3 M176 138 l2 3 M131 124 l2 3 M178 116 l2 3 M193 121 l2 3 M127 131 l2 3 M177 120 l2 3 M193 126 l2 3 M136 120 l2 3 M181 128 l2 3 M189 134 l2 3 M193 119 l2 3 M186 142 l2 3 M178 150 l2 3 M179 141 l2 3 M180 130 l2 3 M191 91 l2 3 M186 95 l2 3 M192 143 l2 3 M188 85 l2 3 M185 94 l2 3 M185 132 l2 3 M185 102 l2 3 M184 138 l2 3 M176 130 l2 3 M181 91 l2 3 M178 111 l2 3"
  }
 },
 "callouts": [
  {
   "id": "bill",
   "leader": "M200 58 L200 23",
   "at": [
    200,
    10
   ],
   "align": "centre",
   "male": {
    "en": "",
    "no": "",
    "verified": false
   },
   "female": {
    "en": "",
    "no": "",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M120 112 L72 86",
   "at": [
    70,
    80
   ],
   "align": "right",
   "male": {
    "en": "GREY-BROWN",
    "no": "GRÅBRUN",
    "verified": true
   },
   "female": {
    "en": "GREY-BROWN",
    "no": "GRÅBRUN",
    "verified": false
   },
   "juvenile": {
    "en": "GREY-BROWN",
    "no": "GRÅBRUN",
    "verified": false
   }
  },
  {
   "id": "breast",
   "leader": "M182 130 L236 150",
   "at": [
    276,
    158
   ],
   "align": "right",
   "male": {
    "en": "WHITE, BROWN SPOTS",
    "no": "HVIT, BRUNE FLEKKER",
    "verified": true
   },
   "female": {
    "en": "WHITE, BROWN SPOTS",
    "no": "HVIT, BRUNE FLEKKER",
    "verified": false
   },
   "juvenile": {
    "en": "WHITE, BROWN SPOTS",
    "no": "HVIT, BRUNE FLEKKER",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Singing from a treetop. Beak and tail follow the sound.",
   "no": "Synger fra en tretopp. Nebb og hale følger lyden.",
   "verified": true
  },
  "female": {
   "en": "Female. No difference from the male is known.",
   "no": "Hunn. Ingen kjent forskjell fra hannen.",
   "verified": false
  },
  "juvenile": {
   "en": "Juvenile. Not described in the sources, so drawn like the adult.",
   "no": "Ungfugl. Ikke beskrevet i kildene, så tegnet som de voksne.",
   "verified": false
  }
 }
}`,Cs=`{
 "_note": "Song thrush, M10. Shapes, pitches and timings are sound design guesses, not tuned against recordings. Verified (birds.md, SNL): a mix of chirping trills and clear melodic whistled notes, sung staccato, each phrase repeated 2 to 3 times; sings from a treetop in spring. Each syllable here is a whole motif (notes with silence between them), and a phrase repeats one motif 2 or 3 times. Short pauses between phrases are a design choice. The call is a placeholder: SNL describes no call, so the thin 'sip' is a guess.",
 "syllables": {
  "w_tiuu": {
   "dur_ms": 260,
   "pitch": [
    [
     0,
     3200
    ],
    [
     0.15,
     3200
    ],
    [
     0.5,
     3600
    ],
    [
     0.85,
     2900
    ],
    [
     1,
     2900
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.04,
     1
    ],
    [
     0.78,
     0.8
    ],
    [
     1,
     0
    ]
   ]
  },
  "w_tuip": {
   "dur_ms": 220,
   "pitch": [
    [
     0,
     2300
    ],
    [
     0.25,
     2300
    ],
    [
     0.575,
     3100
    ],
    [
     0.925,
     3500
    ],
    [
     1,
     3500
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.03,
     1
    ],
    [
     0.39,
     0.8
    ],
    [
     0.44,
     0
    ],
    [
     0.53,
     0
    ],
    [
     0.57,
     1
    ],
    [
     0.89,
     0.8
    ],
    [
     1,
     0
    ]
   ]
  },
  "w_kyss": {
   "dur_ms": 300,
   "pitch": [
    [
     0,
     3800
    ],
    [
     0.075,
     3800
    ],
    [
     0.425,
     3400
    ],
    [
     0.575,
     3800
    ],
    [
     0.925,
     3400
    ],
    [
     1,
     3400
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.03,
     1
    ],
    [
     0.39,
     0.8
    ],
    [
     0.44,
     0
    ],
    [
     0.53,
     0
    ],
    [
     0.57,
     1
    ],
    [
     0.89,
     0.8
    ],
    [
     1,
     0
    ]
   ]
  },
  "w_fisk": {
   "dur_ms": 330,
   "pitch": [
    [
     0,
     2600
    ],
    [
     0.05,
     2600
    ],
    [
     0.283,
     3000
    ],
    [
     0.383,
     3300
    ],
    [
     0.617,
     2800
    ],
    [
     0.833,
     2600
    ],
    [
     1,
     2600
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.027,
     1
    ],
    [
     0.26,
     0.8
    ],
    [
     0.293,
     0
    ],
    [
     0.353,
     0
    ],
    [
     0.38,
     1
    ],
    [
     0.593,
     0.8
    ],
    [
     0.627,
     0
    ],
    [
     0.687,
     0
    ],
    [
     0.713,
     1
    ],
    [
     0.927,
     0.8
    ],
    [
     1,
     0
    ]
   ]
  },
  "w_tiloo": {
   "dur_ms": 280,
   "pitch": [
    [
     0,
     4200
    ],
    [
     0.075,
     4200
    ],
    [
     0.425,
     4000
    ],
    [
     0.575,
     2700
    ],
    [
     0.925,
     2400
    ],
    [
     1,
     2400
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.03,
     1
    ],
    [
     0.39,
     0.8
    ],
    [
     0.44,
     0
    ],
    [
     0.53,
     0
    ],
    [
     0.57,
     1
    ],
    [
     0.89,
     0.8
    ],
    [
     1,
     0
    ]
   ]
  },
  "w_dudu": {
   "dur_ms": 240,
   "pitch": [
    [
     0,
     2100
    ],
    [
     0.075,
     2100
    ],
    [
     0.425,
     2300
    ],
    [
     0.575,
     2200
    ],
    [
     0.925,
     2400
    ],
    [
     1,
     2400
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.03,
     1
    ],
    [
     0.39,
     0.8
    ],
    [
     0.44,
     0
    ],
    [
     0.53,
     0
    ],
    [
     0.57,
     1
    ],
    [
     0.89,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.9
  },
  "w_wee": {
   "dur_ms": 200,
   "pitch": [
    [
     0,
     2800
    ],
    [
     0.15,
     2800
    ],
    [
     0.85,
     4400
    ],
    [
     1,
     4400
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.04,
     1
    ],
    [
     0.78,
     0.8
    ],
    [
     1,
     0
    ]
   ]
  },
  "c_chip3": {
   "dur_ms": 210,
   "pitch": [
    [
     0,
     4600
    ],
    [
     0.05,
     4600
    ],
    [
     0.283,
     4200
    ],
    [
     0.383,
     4600
    ],
    [
     0.617,
     4200
    ],
    [
     0.717,
     4600
    ],
    [
     0.95,
     4200
    ],
    [
     1,
     4200
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.027,
     1
    ],
    [
     0.26,
     0.8
    ],
    [
     0.293,
     0
    ],
    [
     0.353,
     0
    ],
    [
     0.38,
     1
    ],
    [
     0.593,
     0.8
    ],
    [
     0.627,
     0
    ],
    [
     0.687,
     0
    ],
    [
     0.713,
     1
    ],
    [
     0.927,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.85,
   "tension": 50
  },
  "c_tsik": {
   "dur_ms": 150,
   "pitch": [
    [
     0,
     6200
    ],
    [
     0.075,
     6200
    ],
    [
     0.425,
     5200
    ],
    [
     0.575,
     5800
    ],
    [
     0.925,
     4800
    ],
    [
     1,
     4800
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.03,
     1
    ],
    [
     0.39,
     0.8
    ],
    [
     0.44,
     0
    ],
    [
     0.53,
     0
    ],
    [
     0.57,
     1
    ],
    [
     0.89,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.6,
   "tension": 55,
   "breath": 12
  },
  "c_chak": {
   "dur_ms": 180,
   "pitch": [
    [
     0,
     3400
    ],
    [
     0.075,
     3400
    ],
    [
     0.425,
     3000
    ],
    [
     0.575,
     3900
    ],
    [
     0.925,
     3300
    ],
    [
     1,
     3300
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.03,
     1
    ],
    [
     0.39,
     0.8
    ],
    [
     0.44,
     0
    ],
    [
     0.53,
     0
    ],
    [
     0.57,
     1
    ],
    [
     0.89,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.85,
   "rough": 22
  },
  "c_pippi": {
   "dur_ms": 240,
   "pitch": [
    [
     0,
     5200
    ],
    [
     0.125,
     5200
    ],
    [
     0.375,
     5400
    ],
    [
     0.625,
     5200
    ],
    [
     0.875,
     5400
    ],
    [
     1,
     5400
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.025,
     1
    ],
    [
     0.195,
     0.8
    ],
    [
     0.22,
     0
    ],
    [
     0.265,
     0
    ],
    [
     0.285,
     1
    ],
    [
     0.445,
     0.8
    ],
    [
     0.47,
     0
    ],
    [
     0.515,
     0
    ],
    [
     0.535,
     1
    ],
    [
     0.695,
     0.8
    ],
    [
     0.72,
     0
    ],
    [
     0.765,
     0
    ],
    [
     0.785,
     1
    ],
    [
     0.945,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75,
   "tension": 48
  },
  "t_trrr": {
   "dur_ms": 300,
   "pitch": [
    [
     0,
     4300
    ],
    [
     1,
     3900
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.85,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75,
   "trill": {
    "hz": 28,
    "depth_st": 2.5,
    "am": 0.6
   }
  },
  "t_sirr": {
   "dur_ms": 260,
   "pitch": [
    [
     0,
     6000
    ],
    [
     1,
     5400
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     1
    ],
    [
     0.8,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.55,
   "breath": 14,
   "trill": {
    "hz": 34,
    "depth_st": 3,
    "am": 0.7
   }
  },
  "t_churr": {
   "dur_ms": 280,
   "pitch": [
    [
     0,
     2900
    ],
    [
     1,
     3200
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     0.9
    ],
    [
     0.85,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8,
   "rough": 25,
   "trill": {
    "hz": 22,
    "depth_st": 1.5,
    "am": 0.55
   }
  },
  "sip": {
   "dur_ms": 60,
   "pitch": [
    [
     0,
     6800
    ],
    [
     0.4,
     7200
    ],
    [
     1,
     6300
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.5,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.55,
   "breath": 16,
   "tension": 60
  }
 },
 "types": {
  "song": {
   "pause_s": [
    0.5,
    1.6
   ],
   "length_s": [
    0.6,
    1.6
   ],
   "transpose_st": 1.0,
   "avoid_repeat": true,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     5,
     12
    ],
    "vo_tension": [
     28,
     42
    ],
    "vo_rough": [
     3,
     9
    ],
    "ph_tempo": [
     94,
     106
    ]
   },
   "phrases": [
    {
     "weight": 3,
     "sections": [
      {
       "part": "repeat",
       "pool": [
        "w_tiuu"
       ],
       "count": [
        2,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        70,
        140
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 3,
     "sections": [
      {
       "part": "repeat",
       "pool": [
        "w_tuip"
       ],
       "count": [
        2,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        70,
        140
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 3,
     "sections": [
      {
       "part": "repeat",
       "pool": [
        "w_kyss"
       ],
       "count": [
        2,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        70,
        140
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 3,
     "sections": [
      {
       "part": "repeat",
       "pool": [
        "w_fisk"
       ],
       "count": [
        2,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        70,
        140
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 3,
     "sections": [
      {
       "part": "repeat",
       "pool": [
        "w_tiloo"
       ],
       "count": [
        2,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        70,
        140
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 3,
     "sections": [
      {
       "part": "repeat",
       "pool": [
        "w_dudu"
       ],
       "count": [
        2,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        70,
        140
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 3,
     "sections": [
      {
       "part": "repeat",
       "pool": [
        "w_wee"
       ],
       "count": [
        2,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        70,
        140
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 2,
     "sections": [
      {
       "part": "repeat",
       "pool": [
        "c_chip3"
       ],
       "count": [
        2,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        70,
        140
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 2,
     "sections": [
      {
       "part": "repeat",
       "pool": [
        "c_tsik"
       ],
       "count": [
        2,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        70,
        140
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 2,
     "sections": [
      {
       "part": "repeat",
       "pool": [
        "c_chak"
       ],
       "count": [
        2,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        70,
        140
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 2,
     "sections": [
      {
       "part": "repeat",
       "pool": [
        "c_pippi"
       ],
       "count": [
        2,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        70,
        140
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 2,
     "sections": [
      {
       "part": "repeat",
       "pool": [
        "t_trrr"
       ],
       "count": [
        2,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        70,
        140
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 2,
     "sections": [
      {
       "part": "repeat",
       "pool": [
        "t_sirr"
       ],
       "count": [
        2,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        70,
        140
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 2,
     "sections": [
      {
       "part": "repeat",
       "pool": [
        "t_churr"
       ],
       "count": [
        2,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        70,
        140
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": [
    {
     "_note": "Song in spring is verified; quieter by day is a design choice.",
     "when": {
      "time": "day"
     },
     "pause_s": [
      1.5,
      4.0
     ]
    }
   ]
  },
  "call": {
   "pause_s": [
    1.5,
    5.0
   ],
   "length_s": [
    0.1,
    0.6
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     14,
     20
    ],
    "vo_tension": [
     55,
     70
    ],
    "vo_rough": [
     4,
     10
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "sip"
       ],
       "count": [
        1,
        2
       ],
       "share": 1.0,
       "gap_ms": [
        300,
        600
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}`,Ts=`{
  "_note": "Sound design starting values for the song thrush, M10. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 3000,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 8,
    "vo_tension": 34,
    "vo_trill": 0,
    "vo_rough": 6,
    "ph_tempo": 100,
    "ph_pause": 1.0,
    "ph_length": 1.4,
    "ph_variation": 50,
    "su_distance": 15,
    "su_wind": 1.5,
    "su_space": 35
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}`,Ns=`{
 "_note": "Field guide text for the thrush nightingale, both languages. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/luscinia-luscinia",
 "facts": {
  "length": {
   "en": "16 cm",
   "no": "16 cm",
   "verified": true
  },
  "broods": {
   "en": "4 to 6 eggs, 13 days",
   "no": "4 til 6 egg, 13 dager",
   "verified": true
  },
  "range": {
   "en": "Agder to the Oslofjord, southern Innlandet; 500 to 1000 pairs",
   "no": "Agder til Oslofjorden, sørlige Innlandet; 500 til 1000 par",
   "verified": true
  },
  "habitat": {
   "en": "Deciduous thickets near farmland and water",
   "no": "Løvskog med tett kratt nær kulturmark og vann",
   "verified": true
  },
  "food": {
   "en": "Insects, earthworms, snails; some berries",
   "no": "Insekter, meitemark, snegler; litt bær",
   "verified": true
  },
  "status": {
   "en": "NT, near threatened, Norwegian red list",
   "no": "NT, nær truet, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "Well hidden on or by the ground",
   "no": "Godt skjult på eller ved bakken",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Sings",
   "no": "Synger",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "Whistled notes repeated the way the song thrush repeats its phrases, plus smacking and drumming sounds. Sung at night, and also in early mornings; in good conditions it carries up to two kilometres. Male and female look alike.",
  "no": "Fløytetoner som gjentas på måltrostvis, og smattende og trommende lyder. Synger om natten, men også tidlig om morgenen; under gode forhold høres sangen opptil to kilometer unna. Hann og hunn er like.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "Repeated whistles, smacking and drumming sounds, at night.",
   "no": "Gjentatte fløytetoner, smattende og trommende lyder, om natten.",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "parts": {
  "whistle": {
   "en": "REPEATED WHISTLE",
   "no": "GJENTATT FLØYTETONE",
   "verified": true
  },
  "smack": {
   "en": "SMACKING",
   "no": "SMATTING",
   "verified": true
  },
  "drum": {
   "en": "DRUMMING",
   "no": "TROMMING",
   "verified": true
  }
 },
 "calendar": {
  "present": "????yyyy????",
  "sings": "????????????",
  "note": {
   "en": "Back in the first half of May; probably winters in eastern Africa. The sources do not say when it leaves, or give its singing months.",
   "no": "Kommer tilbake i første halvdel av mai; overvintrer trolig i Øst-Afrika. Kildene sier ikke når den drar, og oppgir ikke sangmånedene.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "id": "maltrost",
   "text": {
    "en": "The nightingale repeats its whistled notes the way the song thrush repeats its phrases.",
    "no": "Nattergalen gjentar fløytetonene på måltrostvis.",
    "verified": true
   }
  },
  {
   "name": {
    "en": "Common nightingale",
    "no": "Sørnattergal"
   },
   "text": {
    "en": "More red-brown above and paler below; very rare in Norway.",
    "no": "Mer rødbrun på oversiden og lysere under; svært sjelden i Norge.",
    "verified": true
   }
  }
 ]
}`,Rs=`{
 "_note": "Thrush nightingale ink plate in a 280x240 box, drawn in M10 from the robin plate (same small perched bird), not from a design: brown above (hatching), grey-white below, rust-brown tail in shadow tone (birds.md, SNL). Male and female are alike; the juvenile is not described and is drawn like the adults.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M198 72 C196 58 182 52 168 56 C152 60 140 74 132 92 C120 112 114 132 116 150 C120 166 132 176 148 178 C166 180 182 170 190 152 C198 134 200 108 199 92 C200 86 201 82 200 80 Z",
  "wing": "M158 94 C164 120 150 148 120 160 C124 138 134 112 158 94 Z"
 },
 "layers": [
  {
   "path": "M14 206 C80 202 150 199 268 194",
   "stroke": 4
  },
  {
   "path": "M214 197 l20 -20 M224 187 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 177 q10 -10 18 -2 q-9 8 -18 2 Z M240 190 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M120 150 L84 194 L96 202 L132 166 Z",
   "fill": "shadow",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M124 156 L88 198 M128 162 L92 201",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M148 178 L148 199 M162 176 L163 198 M140 201 L148 199 L156 201 M155 199 L163 198 L171 200",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "path": "M194 58 C184 58 176 64 172 74 C168 88 160 102 160 118 C160 136 168 150 182 164 L216 164 L216 50 Z",
   "fill": "breast",
   "within": "body"
  },
  {
   "path": "M194 58 C184 58 176 64 172 74 C168 88 160 102 160 118 C160 136 168 150 182 164",
   "stroke": 1,
   "within": "body"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    184,
    72
   ],
   "pupil": 2.4
  },
  {
   "path": "M184.6 71.4 m-1.2 0 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0",
   "fill": "face"
  },
  {
   "path": "M198 72 L214 77 L200 79 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M200 79 L212 79 L200 82 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M226 66 A14 14 0 0 1 226 90 M233 58 A24 24 0 0 1 233 98 M240 50 A34 34 0 0 1 240 106",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "hatch": {
  "body": {
   "rect": [
    112,
    50,
    204,
    182
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    118,
    90,
    166,
    164
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    200,
    76
   ],
   "deg": -14
  },
  "lower": {
   "at": [
    200,
    80
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    126,
    158
   ],
   "deg": -6
  }
 },
 "variants": {
  "male": {
   "body_pitch": 8,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow",
   "breast": "face"
  },
  "female": {
   "body_pitch": 8,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow",
   "breast": "face"
  },
  "juvenile": {
   "body_pitch": 8,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow",
   "breast": "face"
  }
 },
 "callouts": [
  {
   "id": "bill",
   "leader": "M206 74 L206 23",
   "at": [
    206,
    10
   ],
   "align": "centre",
   "male": {
    "en": "",
    "no": "",
    "verified": false
   },
   "female": {
    "en": "",
    "no": "",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M140 100 L112 116",
   "at": [
    108,
    110
   ],
   "align": "right",
   "male": {
    "en": "BROWN ABOVE",
    "no": "BRUN OVERSIDE",
    "verified": true
   },
   "female": {
    "en": "BROWN ABOVE",
    "no": "BRUN OVERSIDE",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "breast",
   "leader": "M186 130 L232 212",
   "at": [
    276,
    224
   ],
   "align": "right",
   "male": {
    "en": "GREY-WHITE",
    "no": "GRÅHVIT",
    "verified": true
   },
   "female": {
    "en": "GREY-WHITE",
    "no": "GRÅHVIT",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Singing at night. Rust-brown tail.",
   "no": "Synger om natten. Rustbrun hale.",
   "verified": true
  },
  "female": {
   "en": "Female. Male and female are alike.",
   "no": "Hunn. Hann og hunn er like.",
   "verified": true
  },
  "juvenile": {
   "en": "Juvenile. Not described in the sources, so drawn like the adults.",
   "no": "Ungfugl. Ikke beskrevet i kildene, så tegnet som de voksne.",
   "verified": false
  }
 }
}`,As=`{
 "_note": "Thrush nightingale, M10. Verified (birds.md, SNL): whistled notes repeated the way the song thrush repeats its phrases, plus smacking and drumming sounds; sung at night and in early mornings; carries up to two kilometres. Sound design choices: five whistled motifs repeated 2 to 4 times, 'smacking' notes in series of 3 to 7, a 'drumming' fast hard rattle of 0,7 to 0,9 s; pitches and timings; short pauses. Inactive by day and at dusk (SNL names night and early morning). No call type: SNL describes none.",
 "syllables": {
  "w_piu": {
   "dur_ms": 240,
   "pitch": [
    [
     0,
     2600
    ],
    [
     0.15,
     2600
    ],
    [
     0.5,
     3300
    ],
    [
     0.85,
     2900
    ],
    [
     1,
     2900
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.14,
     1
    ],
    [
     0.8,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.95
  },
  "w_tyy": {
   "dur_ms": 300,
   "pitch": [
    [
     0,
     3400
    ],
    [
     0.075,
     3400
    ],
    [
     0.425,
     3100
    ],
    [
     0.575,
     3400
    ],
    [
     0.925,
     3100
    ],
    [
     1,
     3100
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.07,
     1
    ],
    [
     0.4,
     0.8
    ],
    [
     0.45,
     0
    ],
    [
     0.53,
     0
    ],
    [
     0.57,
     1
    ],
    [
     0.9,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.95
  },
  "w_fluu": {
   "dur_ms": 320,
   "pitch": [
    [
     0,
     2200
    ],
    [
     0.25,
     2200
    ],
    [
     0.575,
     2800
    ],
    [
     0.925,
     3200
    ],
    [
     1,
     3200
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.07,
     1
    ],
    [
     0.4,
     0.8
    ],
    [
     0.45,
     0
    ],
    [
     0.53,
     0
    ],
    [
     0.57,
     1
    ],
    [
     0.9,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.95
  },
  "w_tiiu": {
   "dur_ms": 260,
   "pitch": [
    [
     0,
     4000
    ],
    [
     0.15,
     4000
    ],
    [
     0.5,
     4200
    ],
    [
     0.85,
     3300
    ],
    [
     1,
     3300
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.14,
     1
    ],
    [
     0.8,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.95
  },
  "w_dlu": {
   "dur_ms": 280,
   "pitch": [
    [
     0,
     2500
    ],
    [
     0.075,
     2500
    ],
    [
     0.425,
     2700
    ],
    [
     0.575,
     3600
    ],
    [
     0.925,
     3200
    ],
    [
     1,
     3200
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.07,
     1
    ],
    [
     0.4,
     0.8
    ],
    [
     0.45,
     0
    ],
    [
     0.53,
     0
    ],
    [
     0.57,
     1
    ],
    [
     0.9,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.95
  },
  "smack": {
   "dur_ms": 120,
   "pitch": [
    [
     0,
     3200
    ],
    [
     0.075,
     3200
    ],
    [
     0.425,
     2600
    ],
    [
     0.575,
     3300
    ],
    [
     0.925,
     2700
    ],
    [
     1,
     2700
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.07,
     1
    ],
    [
     0.4,
     0.8
    ],
    [
     0.45,
     0
    ],
    [
     0.53,
     0
    ],
    [
     0.57,
     1
    ],
    [
     0.9,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.9,
   "rough": 35,
   "tension": 35,
   "breath": -4
  },
  "tsjokk": {
   "dur_ms": 90,
   "pitch": [
    [
     0,
     2400
    ],
    [
     0.15,
     2400
    ],
    [
     0.85,
     1900
    ],
    [
     1,
     1900
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.14,
     1
    ],
    [
     0.8,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.9,
   "rough": 40,
   "tension": 40
  },
  "drum": {
   "dur_ms": 700,
   "pitch": [
    [
     0,
     1700
    ],
    [
     1,
     1550
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.04,
     1
    ],
    [
     0.85,
     0.9
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.95,
   "rough": 35,
   "tension": 40,
   "trill": {
    "hz": 16,
    "depth_st": 2,
    "am": 1.0
   }
  },
  "drum2": {
   "dur_ms": 900,
   "pitch": [
    [
     0,
     1500
    ],
    [
     1,
     1400
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.04,
     1
    ],
    [
     0.85,
     0.9
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.95,
   "rough": 35,
   "tension": 40,
   "trill": {
    "hz": 18,
    "depth_st": 2,
    "am": 1.0
   }
  }
 },
 "types": {
  "song": {
   "pause_s": [
    0.6,
    2.0
   ],
   "length_s": [
    0.6,
    1.6
   ],
   "transpose_st": 1.0,
   "avoid_repeat": true,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     5,
     12
    ],
    "vo_tension": [
     28,
     42
    ],
    "vo_rough": [
     4,
     12
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 3,
     "sections": [
      {
       "part": "whistle",
       "pool": [
        "w_piu"
       ],
       "count": [
        2,
        4
       ],
       "share": 1.0,
       "gap_ms": [
        60,
        120
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 3,
     "sections": [
      {
       "part": "whistle",
       "pool": [
        "w_tyy"
       ],
       "count": [
        2,
        4
       ],
       "share": 1.0,
       "gap_ms": [
        60,
        120
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 3,
     "sections": [
      {
       "part": "whistle",
       "pool": [
        "w_fluu"
       ],
       "count": [
        2,
        4
       ],
       "share": 1.0,
       "gap_ms": [
        60,
        120
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 3,
     "sections": [
      {
       "part": "whistle",
       "pool": [
        "w_tiiu"
       ],
       "count": [
        2,
        4
       ],
       "share": 1.0,
       "gap_ms": [
        60,
        120
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 3,
     "sections": [
      {
       "part": "whistle",
       "pool": [
        "w_dlu"
       ],
       "count": [
        2,
        4
       ],
       "share": 1.0,
       "gap_ms": [
        60,
        120
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 2,
     "sections": [
      {
       "part": "smack",
       "pool": [
        "smack"
       ],
       "count": [
        3,
        7
       ],
       "share": 1.0,
       "gap_ms": [
        50,
        110
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 2,
     "sections": [
      {
       "part": "smack",
       "pool": [
        "tsjokk"
       ],
       "count": [
        3,
        7
       ],
       "share": 1.0,
       "gap_ms": [
        50,
        110
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 2,
     "sections": [
      {
       "part": "drum",
       "pool": [
        "tsjokk"
       ],
       "count": [
        1,
        2
       ],
       "share": 0.3,
       "gap_ms": [
        60,
        100
       ],
       "no_adjacent_repeat": false
      },
      {
       "part": "drum",
       "pool": [
        "drum"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.7,
       "gap_ms": [
        40,
        60
       ]
      }
     ]
    },
    {
     "weight": 2,
     "sections": [
      {
       "part": "drum",
       "pool": [
        "tsjokk"
       ],
       "count": [
        1,
        2
       ],
       "share": 0.3,
       "gap_ms": [
        60,
        100
       ],
       "no_adjacent_repeat": false
      },
      {
       "part": "drum",
       "pool": [
        "drum2"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.7,
       "gap_ms": [
        40,
        60
       ]
      }
     ]
    }
   ],
   "overrides": [
    {
     "_note": "At night and in early mornings (SNL).",
     "when": {
      "time": "day"
     },
     "active": false
    },
    {
     "when": {
      "time": "dusk"
     },
     "active": false
    }
   ]
  }
 }
}`,js=`{
  "_note": "Sound design starting values for the thrush nightingale, M10. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 3000,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 8,
    "vo_tension": 34,
    "vo_trill": 0,
    "vo_rough": 8,
    "ph_tempo": 100,
    "ph_pause": 1.2,
    "ph_length": 1.6,
    "ph_variation": 50,
    "su_distance": 25,
    "su_wind": 1.5,
    "su_space": 45
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}`,Is=`{
 "_note": "Field guide text for the nightjar, both languages. SNL gives no pitch or length, so the note shapes are [TO VERIFY]. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/caprimulgus-europaeus",
 "facts": {
  "length": {
   "en": "24 to 28 cm, 60 to 90 g",
   "no": "24 til 28 cm, 60 til 90 g",
   "verified": true
  },
  "broods": {
   "en": "2 white eggs with grey-blue and beige marks; mostly the female sits 17 to 18 days",
   "no": "2 hvite egg med gråblå og beige flekker; mest hunnen ruger 17 til 18 dager",
   "verified": true
  },
  "range": {
   "en": "Mainly lowland around the Oslofjord and down the Sørlandet coast; 715 to 1225 pairs",
   "no": "Mest i lavlandet rundt Oslofjorden og nedover sørlandskysten; 715 til 1225 par",
   "verified": true
  },
  "habitat": {
   "en": "Hilly forest with sparse, open pine",
   "no": "Småkupert skog med glissen, åpen furuskog",
   "verified": true
  },
  "food": {
   "en": "Insects caught in flight at night: cockchafers, dung beetles, moths",
   "no": "Insekter tatt i flukt om natten: oldenborrer, tordivler, nattsvermere",
   "verified": true
  },
  "status": {
   "en": "LC, least concern, Norwegian red list",
   "no": "LC, livskraftig, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "A scrape in the ground",
   "no": "En grop på bakken",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "",
   "no": "",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "A very special whirring song, like a spinning wheel; hence the local name huldrerokk. The call is a frog-like but plaintive «kruit». It flies silently except in courtship, when it claps its wings over its back. SNL gives no pitch or length, so the notes Pipp plays are a stand-in.",
  "no": "En svært spesiell surrende sang, som en rokk; derav navnet huldrerokk. Lokkelyden er en froskeaktig, men klagende «kruit». Flukten er lydløs unntatt under kurtise, da den klapper vingene sammen over kroppen. SNL gir ingen tonehøyde eller lengde, så tonene Pipp spiller er en stedfortreder.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "A whirring song, like a spinning wheel.",
   "no": "En surrende sang, som en rokk.",
   "verified": true
  },
  "call": {
   "en": "A frog-like but plaintive «kruit».",
   "no": "En froskeaktig, men klagende «kruit».",
   "verified": true
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "Wing claps in courtship; otherwise silent in flight.",
   "no": "Vingeklapp under kurtise; ellers lydløs i flukt.",
   "verified": true
  }
 },
 "calendar": {
  "present": "nnnnyyyy?nnn",
  "sings": "nnnn????nnnn",
  "note": {
   "en": "Arrives late in May, leaves early, in August to September, for tropical Africa.",
   "no": "Kommer sist i mai og drar tidlig, i august til september, til det tropiske Afrika.",
   "verified": true
  }
 },
 "lookalikes": []
}
`,Bs=`{
 "_note": "Nightjar ink plate in a 280x240 box, M11 batch 8, built from the cuckoo plate: grey-brown and mottled, fairly long tail, long wings, small weak bill with a very wide gape and bristles (birds.md, SNL). Sexes and juvenile are not described: drawn alike, [TO VERIFY].",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M206 86 C204 70 188 62 174 66 C150 72 126 96 106 128 C102 138 108 146 120 148 C150 152 182 140 196 118 C204 106 208 96 206 86 Z",
  "wing": "M180 92 C174 118 146 142 92 162 C112 134 140 108 180 92 Z"
 },
 "hatch": {
  "body": {
   "rect": [
    100,
    60,
    210,
    152
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    90,
    90,
    182,
    164
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    204,
    84
   ],
   "deg": -14
  },
  "lower": {
   "at": [
    204,
    90
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    116,
    140
   ],
   "deg": -4
  }
 },
 "layers": [
  {
   "path": "M14 206 C80 202 150 199 268 194",
   "stroke": 4
  },
  {
   "path": "M214 197 l20 -20 M224 187 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 177 q10 -10 18 -2 q-9 8 -18 2 Z M240 190 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M112 134 L28 190 L38 202 L124 148 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M150 150 L152 199 M164 148 L168 198 M144 201 L152 199 L160 201 M159 199 L168 198 L176 200",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "path": "M190 90 l-6 3 M176 100 l-6 4 M160 112 l-5 4 M140 126 l-6 3 M184 110 l-5 4 M166 124 l-6 3 M150 134 l-5 3 M126 136 l-5 3",
   "stroke": 1.6,
   "within": "body"
  },
  {
   "clip": "wing",
   "fill": "face"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    194,
    78
   ],
   "pupil": 2.4
  },
  {
   "path": "M205 80 L214 85 L206 88 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M206 88 L212 87 L205 92 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M207 85 l12 -8 M207 86 l14 -4 M207 87 l13 1",
   "stroke": 0.8,
   "part": "upper"
  },
  {
   "path": "M232 74 A14 14 0 0 1 232 98 M239 66 A24 24 0 0 1 239 106 M246 58 A34 34 0 0 1 246 114",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "variants": {
  "male": {
   "body_pitch": 5,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow"
  },
  "female": {
   "body_pitch": 5,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow"
  },
  "juvenile": {
   "body_pitch": 5,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow"
  }
 },
 "callouts": [
  {
   "id": "bill",
   "leader": "M214 82 L232 28",
   "at": [
    276,
    18
   ],
   "align": "right",
   "male": {
    "en": "SMALL BILL, WIDE GAPE",
    "no": "LITE NEBB, VID GAP",
    "verified": true
   },
   "female": {
    "en": "SMALL BILL, WIDE GAPE",
    "no": "LITE NEBB, VID GAP",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M150 90 L84 60",
   "at": [
    80,
    54
   ],
   "align": "right",
   "male": {
    "en": "GREY-BROWN, MOTTLED",
    "no": "GRÅBRUN, SPRAGLET",
    "verified": true
   },
   "female": {
    "en": "GREY-BROWN, MOTTLED",
    "no": "GRÅBRUN, SPRAGLET",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "tail",
   "leader": "M70 172 L52 140",
   "at": [
    52,
    130
   ],
   "align": "centre",
   "male": {
    "en": "FAIRLY LONG",
    "no": "GANSKE LANG",
    "verified": true
   },
   "female": {
    "en": "FAIRLY LONG",
    "no": "GANSKE LANG",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Whirring. Beak and tail follow the sound.",
   "no": "Surrer. Nebb og hale følger lyden.",
   "verified": true
  },
  "female": {
   "en": "Female. No difference from the male is described.",
   "no": "Hunn. Ingen forskjell fra hannen er beskrevet.",
   "verified": false
  },
  "juvenile": {
   "en": "Juvenile. Not described in the sources, so drawn like the adult.",
   "no": "Ungfugl. Ikke beskrevet i kildene, så tegnet som de voksne.",
   "verified": false
  }
 }
}
`,Os=`{
 "_note": "Nightjar, M11 batch 8. Verified by SNL: a very special whirring song like a spinning wheel (local name huldrerokk); the call a frog-like, plaintive «kruit»; silent in flight except in courtship, when it claps its wings over its back. No pitch, length or time given, so all shapes are sound design guesses: the song long breathy notes pulsed at 30 Hz, now and then a step down in pitch; the call a short rising and falling 'kruit'; flight 1 to 3 wing claps from the drum source.",
 "syllables": {
  "churr": {
   "dur_ms": 2000,
   "pitch": [
    [
     0,
     1250
    ],
    [
     1,
     1250
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.04,
     1
    ],
    [
     0.96,
     1
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.65,
   "breath": 40,
   "rough": 30,
   "trill": {
    "hz": 30,
    "depth_st": 0.8,
    "am": 0.9
   }
  },
  "churr_lo": {
   "dur_ms": 1600,
   "pitch": [
    [
     0,
     1050
    ],
    [
     1,
     1050
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.05,
     1
    ],
    [
     0.95,
     1
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.65,
   "breath": 40,
   "rough": 30,
   "trill": {
    "hz": 27,
    "depth_st": 0.8,
    "am": 0.9
   }
  },
  "kruit": {
   "dur_ms": 200,
   "pitch": [
    [
     0,
     900
    ],
    [
     0.5,
     1400
    ],
    [
     1,
     1100
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75,
   "rough": 25,
   "tension": -10
  },
  "clap": {
   "dur_ms": 90,
   "pitch": [
    [
     0,
     1600
    ],
    [
     1,
     1550
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.02,
     1
    ],
    [
     0.5,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.9,
   "drum": {
    "rate": [
     12.0,
     12.0
    ]
   }
  }
 },
 "types": {
  "song": {
   "pause_s": [
    1.0,
    4.0
   ],
   "length_s": [
    4.0,
    10.0
   ],
   "transpose_st": 0.3,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.99,
     1.01
    ],
    "vo_breath": [
     36,
     46
    ],
    "vo_tension": [
     40,
     52
    ],
    "vo_rough": [
     24,
     34
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "churr"
       ],
       "count": [
        2,
        4
       ],
       "share": 0.75,
       "gap_ms": [
        0,
        20
       ]
      },
      {
       "pool": [
        "churr_lo"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.25,
       "gap_ms": [
        0,
        20
       ],
       "lead_gap_ms": [
        0,
        20
       ]
      }
     ]
    }
   ],
   "overrides": [
    {
     "_note": "Arrives late May (SNL).",
     "when": {
      "season": "winter"
     },
     "active": false
    },
    {
     "_note": "Leaves in August to September (SNL).",
     "when": {
      "season": "autumn"
     },
     "active": false
    }
   ]
  },
  "call": {
   "pause_s": [
    2.0,
    6.0
   ],
   "length_s": [
    0.2,
    1.4
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     16,
     26
    ],
    "vo_tension": [
     40,
     52
    ],
    "vo_rough": [
     20,
     30
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "kruit"
       ],
       "count": [
        1,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        500,
        900
       ]
      }
     ]
    }
   ],
   "overrides": []
  },
  "flight": {
   "pause_s": [
    2.0,
    6.0
   ],
   "length_s": [
    0.1,
    1.0
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     16,
     26
    ],
    "vo_tension": [
     20,
     32
    ],
    "vo_rough": [
     20,
     32
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "clap"
       ],
       "count": [
        1,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        250,
        450
       ]
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,Hs=`{
 "_note": "Sound design starting values for the nightjar, M11 batch 8. Not bird facts.",
 "pitch_ref_hz": 1200,
 "base": {
  "vo_pitch": 1.0,
  "vo_breath": 40,
  "vo_tension": 46,
  "vo_trill": 0,
  "vo_rough": 28,
  "ph_tempo": 100,
  "ph_pause": 2.5,
  "ph_length": 6.0,
  "ph_variation": 50,
  "su_distance": 50,
  "su_wind": 1.5,
  "su_space": 50
 },
 "ranges": {
  "vo_pitch": [
   0.5,
   2.0
  ],
  "vo_breath": [
   0,
   100
  ],
  "vo_tension": [
   0,
   100
  ],
  "vo_trill": [
   0,
   40
  ],
  "vo_rough": [
   0,
   100
  ],
  "ph_tempo": [
   50,
   200
  ],
  "ph_pause": [
   0.2,
   20
  ],
  "ph_length": [
   0.2,
   20
  ],
  "ph_variation": [
   0,
   100
  ],
  "su_distance": [
   1,
   200
  ],
  "su_wind": [
   0,
   15
  ],
  "su_space": [
   0,
   100
  ]
 }
}
`,Gs=`{
 "_note": "Field guide text for Tengmalm's owl, both languages. SNL gives no transcription, so the note shapes are [TO VERIFY]. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/aegolius-funereus",
 "facts": {
  "length": {
   "en": "25 to 27 cm, wingspan 50 to 62 cm, 100 to 150 g; the female heaviest",
   "no": "25 til 27 cm, vingespenn 50 til 62 cm, 100 til 150 g; hunnen tyngst",
   "verified": true
  },
  "broods": {
   "en": "3 to 7 white eggs, usually March to April; the female alone sits 25 to 32 days",
   "no": "3 til 7 hvite egg, oftest mars til april; hunnen alene ruger 25 til 32 dager",
   "verified": true
  },
  "range": {
   "en": "Most numerous in Østlandet and Trøndelag; numbers swing with the small-rodent years",
   "no": "Mest tallrik på Østlandet og i Trøndelag; bestanden svinger med smågnagerårene",
   "verified": true
  },
  "habitat": {
   "en": "Coniferous forest",
   "no": "Barskog",
   "verified": true
  },
  "food": {
   "en": "Mainly small rodents, hunted by ear from a low perch",
   "no": "Mest smågnagere, jaktet etter hørselen fra en lav post",
   "verified": true
  },
  "status": {
   "en": "LC, least concern, Norwegian red list",
   "no": "LC, livskraftig, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "In hollow trees; takes nest boxes filled with wood chips",
   "no": "I hule trær; tar nestekasser fylt med flis",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "A rapid series of clear, deep notes",
   "no": "En rask serie klare, dype toner",
   "verified": true
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "Males sing in the winter forest from January to February: a rapid series of clear, deep notes that can carry 2 to 3 km on quiet nights. SNL gives no transcription or note count, so the notes Pipp plays are a stand-in. Brown above with many round white spots, the pearls that give it its Norwegian name.",
  "no": "Hannene synger i vinterskogen fra januar til februar: en rask serie klare, dype toner som kan høres 2 til 3 km stille netter. SNL gir ingen gjengivelse eller antall toner, så tonene Pipp spiller er en stedfortreder. Brun ovenpå med mange runde hvite flekker, perlene som gir den navnet.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "A rapid series of clear, deep notes.",
   "no": "En rask serie klare, dype toner.",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "yy??????????",
  "note": {
   "en": "In Norway all year: the males mostly stay, females and young wander. Song from January to February; eggs March to April.",
   "no": "I Norge hele året: hannene blir som regel, hunner og unge streifer. Sang fra januar til februar; egg mars til april.",
   "verified": true
  }
 },
 "lookalikes": []
}
`,Ds=`{
 "_note": "Tengmalm's owl ink plate in a 280x240 box, M11 batch 8, built from the tawny owl plate: brown back and crown with many round white spots (the pearls), pale underside with brown streaks; the juvenile uniformly chocolate-brown (dense hatching, no pale parts, no spots) (birds.md, SNL). Eye and bill colour are not described: the eyes are drawn plain. Male and female are drawn the same; SNL names only weight.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M140 40 C112 40 98 60 100 84 C92 104 92 140 104 168 C114 188 128 194 140 194 C152 194 166 188 176 168 C188 140 188 104 180 84 C182 60 168 40 140 40 Z",
  "wing": "M104 116 C98 146 106 176 124 190 C118 164 116 138 112 116 Z M176 116 C182 146 174 176 156 190 C162 164 164 138 168 116 Z"
 },
 "hatch": {
  "body": {
   "rect": [
    92,
    38,
    190,
    196
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    96,
    114,
    184,
    192
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    140,
    88
   ],
   "deg": -6
  },
  "lower": {
   "at": [
    140,
    92
   ],
   "deg": 8
  },
  "tail": {
   "at": [
    140,
    190
   ],
   "deg": 4
  }
 },
 "layers": [
  {
   "path": "M14 204 C80 200 160 198 268 194",
   "stroke": 4
  },
  {
   "path": "M214 199 l20 -20 M224 189 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M130 188 L126 214 L154 214 L150 188 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M134 196 l-1 14 M146 196 l1 14",
   "stroke": 1,
   "part": "tail"
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "variant": "pale",
   "fill": "face",
   "within": "body"
  },
  {
   "variant": "streaks",
   "stroke": 1.3,
   "within": "body"
  },
  {
   "path": "M140 50 C118 50 108 66 110 84 C112 100 126 108 140 108 C154 108 168 100 170 84 C172 66 162 50 140 50 Z",
   "fill": "disc",
   "stroke": 1.2,
   "within": "body"
  },
  {
   "variant": "spots",
   "fill": "face",
   "stroke": 0.8,
   "within": "body"
  },
  {
   "clip": "wing",
   "fill": "face"
  },
  {
   "hatch": "wing"
  },
  {
   "variant": "wspots",
   "fill": "face",
   "stroke": 0.8,
   "within": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    127,
    80
   ],
   "pupil": 4.0
  },
  {
   "eye": [
    153,
    80
   ],
   "pupil": 4.0
  },
  {
   "path": "M136 86 L144 86 L140 97 Z",
   "fill": "bill",
   "stroke": 1.3,
   "part": "upper"
  },
  {
   "path": "M137.5 92 L142.5 92 L140 98 Z",
   "fill": "bill",
   "stroke": 1.1,
   "part": "lower"
  },
  {
   "path": "M126 194 l-5 7 M131 195 l-1 8 M149 195 l1 8 M154 194 l5 7",
   "stroke": 1.5
  },
  {
   "path": "M198 66 A16 16 0 0 1 198 96 M205 58 A26 26 0 0 1 205 104 M212 50 A36 36 0 0 1 212 112",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "variants": {
  "male": {
   "body_pitch": 6,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow",
   "disc": "face",
   "pale": "M140 112 C124 112 112 124 110 140 C108 160 118 182 140 186 C162 182 172 160 170 140 C168 124 156 112 140 112 Z",
   "streaks": "M130 124 l0 9 M148 126 l0 9 M138 144 l0 10 M124 152 l0 9 M156 150 l0 9 M140 166 l0 9 M128 170 l0 8 M152 170 l0 8",
   "spots": "M119.8 46 a2.2 2.2 0 1 0 4.4 0 a2.2 2.2 0 1 0 -4.4 0 Z M129.8 43 a2.2 2.2 0 1 0 4.4 0 a2.2 2.2 0 1 0 -4.4 0 Z M145.8 43 a2.2 2.2 0 1 0 4.4 0 a2.2 2.2 0 1 0 -4.4 0 Z M155.8 46 a2.2 2.2 0 1 0 4.4 0 a2.2 2.2 0 1 0 -4.4 0 Z M103.8 96 a2.2 2.2 0 1 0 4.4 0 a2.2 2.2 0 1 0 -4.4 0 Z M107.8 108 a2.2 2.2 0 1 0 4.4 0 a2.2 2.2 0 1 0 -4.4 0 Z M171.8 96 a2.2 2.2 0 1 0 4.4 0 a2.2 2.2 0 1 0 -4.4 0 Z M167.8 108 a2.2 2.2 0 1 0 4.4 0 a2.2 2.2 0 1 0 -4.4 0 Z M100.8 84 a2.2 2.2 0 1 0 4.4 0 a2.2 2.2 0 1 0 -4.4 0 Z M174.8 84 a2.2 2.2 0 1 0 4.4 0 a2.2 2.2 0 1 0 -4.4 0 Z ",
   "wspots": "M106.0 132 a2.0 2.0 0 1 0 4.0 0 a2.0 2.0 0 1 0 -4.0 0 Z M109.0 150 a2.0 2.0 0 1 0 4.0 0 a2.0 2.0 0 1 0 -4.0 0 Z M114.0 168 a2.0 2.0 0 1 0 4.0 0 a2.0 2.0 0 1 0 -4.0 0 Z M170.0 132 a2.0 2.0 0 1 0 4.0 0 a2.0 2.0 0 1 0 -4.0 0 Z M167.0 150 a2.0 2.0 0 1 0 4.0 0 a2.0 2.0 0 1 0 -4.0 0 Z M162.0 168 a2.0 2.0 0 1 0 4.0 0 a2.0 2.0 0 1 0 -4.0 0 Z "
  },
  "female": {
   "body_pitch": 6,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow",
   "disc": "face",
   "pale": "M140 112 C124 112 112 124 110 140 C108 160 118 182 140 186 C162 182 172 160 170 140 C168 124 156 112 140 112 Z",
   "streaks": "M130 124 l0 9 M148 126 l0 9 M138 144 l0 10 M124 152 l0 9 M156 150 l0 9 M140 166 l0 9 M128 170 l0 8 M152 170 l0 8",
   "spots": "M119.8 46 a2.2 2.2 0 1 0 4.4 0 a2.2 2.2 0 1 0 -4.4 0 Z M129.8 43 a2.2 2.2 0 1 0 4.4 0 a2.2 2.2 0 1 0 -4.4 0 Z M145.8 43 a2.2 2.2 0 1 0 4.4 0 a2.2 2.2 0 1 0 -4.4 0 Z M155.8 46 a2.2 2.2 0 1 0 4.4 0 a2.2 2.2 0 1 0 -4.4 0 Z M103.8 96 a2.2 2.2 0 1 0 4.4 0 a2.2 2.2 0 1 0 -4.4 0 Z M107.8 108 a2.2 2.2 0 1 0 4.4 0 a2.2 2.2 0 1 0 -4.4 0 Z M171.8 96 a2.2 2.2 0 1 0 4.4 0 a2.2 2.2 0 1 0 -4.4 0 Z M167.8 108 a2.2 2.2 0 1 0 4.4 0 a2.2 2.2 0 1 0 -4.4 0 Z M100.8 84 a2.2 2.2 0 1 0 4.4 0 a2.2 2.2 0 1 0 -4.4 0 Z M174.8 84 a2.2 2.2 0 1 0 4.4 0 a2.2 2.2 0 1 0 -4.4 0 Z ",
   "wspots": "M106.0 132 a2.0 2.0 0 1 0 4.0 0 a2.0 2.0 0 1 0 -4.0 0 Z M109.0 150 a2.0 2.0 0 1 0 4.0 0 a2.0 2.0 0 1 0 -4.0 0 Z M114.0 168 a2.0 2.0 0 1 0 4.0 0 a2.0 2.0 0 1 0 -4.0 0 Z M170.0 132 a2.0 2.0 0 1 0 4.0 0 a2.0 2.0 0 1 0 -4.0 0 Z M167.0 150 a2.0 2.0 0 1 0 4.0 0 a2.0 2.0 0 1 0 -4.0 0 Z M162.0 168 a2.0 2.0 0 1 0 4.0 0 a2.0 2.0 0 1 0 -4.0 0 Z "
  },
  "juvenile": {
   "body_pitch": 3,
   "wing_pitch": 3,
   "eye_ring": 0,
   "bill": "shadow",
   "disc": "shadow",
   "pale": "",
   "streaks": "",
   "spots": "",
   "wspots": ""
  }
 },
 "callouts": [
  {
   "id": "head",
   "leader": "M126 44 L96 30",
   "at": [
    74,
    22
   ],
   "align": "centre",
   "male": {
    "en": "WHITE SPOTS, THE PEARLS",
    "no": "HVITE FLEKKER, PERLENE",
    "verified": true
   },
   "female": {
    "en": "WHITE SPOTS, THE PEARLS",
    "no": "HVITE FLEKKER, PERLENE",
    "verified": true
   },
   "juvenile": {
    "en": "CHOCOLATE-BROWN",
    "no": "SJOKOLADEBRUN",
    "verified": true
   }
  },
  {
   "id": "plumage",
   "leader": "M104 132 L74 120",
   "at": [
    70,
    114
   ],
   "align": "right",
   "male": {
    "en": "BROWN BACK AND CROWN",
    "no": "BRUN RYGG OG ISSE",
    "verified": true
   },
   "female": {
    "en": "BROWN BACK AND CROWN",
    "no": "BRUN RYGG OG ISSE",
    "verified": true
   },
   "juvenile": {
    "en": "UNIFORM",
    "no": "ENSFARGET",
    "verified": true
   }
  },
  {
   "id": "breast",
   "leader": "M166 160 L232 214",
   "at": [
    276,
    226
   ],
   "align": "right",
   "male": {
    "en": "PALE, BROWN STREAKS",
    "no": "LYS, BRUNE LENGDESTREKER",
    "verified": true
   },
   "female": {
    "en": "PALE, BROWN STREAKS",
    "no": "LYS, BRUNE LENGDESTREKER",
    "verified": true
   },
   "juvenile": {
    "en": "CHOCOLATE-BROWN",
    "no": "SJOKOLADEBRUN",
    "verified": true
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Male singing. Beak and tail follow the sound.",
   "no": "Hann som synger. Nebb og hale følger lyden.",
   "verified": true
  },
  "female": {
   "en": "Female. The heaviest; no plumage difference given.",
   "no": "Hunn. Tyngst; ingen draktforskjell oppgitt.",
   "verified": true
  },
  "juvenile": {
   "en": "Juvenile. Uniformly chocolate-brown.",
   "no": "Ungfugl. Ensfarget sjokoladebrun.",
   "verified": true
  }
 }
}
`,Ps=`{
 "_note": "Tengmalm's owl, M11 batch 8. Verified by SNL: the male's song in the winter forest, a rapid series of clear, deep notes, from January to February, heard 2 to 3 km on quiet nights. No transcription or note count, so pitch, rate and count are sound design guesses: 6 to 14 pure notes near 680 Hz, about 5 a second.",
 "syllables": {
  "po": {
   "dur_ms": 110,
   "pitch": [
    [
     0,
     650
    ],
    [
     0.3,
     690
    ],
    [
     1,
     670
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.6,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8,
   "breath": 12,
   "tension": -10
  },
  "po2": {
   "dur_ms": 120,
   "pitch": [
    [
     0,
     640
    ],
    [
     0.3,
     680
    ],
    [
     1,
     660
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.6,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8,
   "breath": 12,
   "tension": -10
  }
 },
 "types": {
  "song": {
   "pause_s": [
    2.0,
    6.0
   ],
   "length_s": [
    1.2,
    3.0
   ],
   "transpose_st": 0.5,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     14,
     24
    ],
    "vo_tension": [
     10,
     20
    ],
    "vo_rough": [
     0,
     4
    ],
    "ph_tempo": [
     96,
     104
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "po",
        "po2"
       ],
       "count": [
        6,
        14
       ],
       "share": 1.0,
       "gap_ms": [
        70,
        100
       ]
      }
     ]
    }
   ],
   "overrides": [
    {
     "_note": "Males sing (SNL).",
     "when": {
      "sex": "female"
     },
     "active": false
    },
    {
     "_note": "Heard on quiet nights (SNL).",
     "when": {
      "time": "day"
     },
     "active": false
    }
   ]
  }
 }
}
`,zs=`{
 "_note": "Sound design starting values for Tengmalm's owl, M11 batch 8. Not bird facts.",
 "pitch_ref_hz": 670,
 "base": {
  "vo_pitch": 1.0,
  "vo_breath": 18,
  "vo_tension": 14,
  "vo_trill": 0,
  "vo_rough": 2,
  "ph_tempo": 100,
  "ph_pause": 4.0,
  "ph_length": 2.0,
  "ph_variation": 50,
  "su_distance": 60,
  "su_wind": 1.5,
  "su_space": 55
 },
 "ranges": {
  "vo_pitch": [
   0.5,
   2.0
  ],
  "vo_breath": [
   0,
   100
  ],
  "vo_tension": [
   0,
   100
  ],
  "vo_trill": [
   0,
   40
  ],
  "vo_rough": [
   0,
   100
  ],
  "ph_tempo": [
   50,
   200
  ],
  "ph_pause": [
   0.2,
   20
  ],
  "ph_length": [
   0.2,
   8
  ],
  "ph_variation": [
   0,
   100
  ],
  "su_distance": [
   1,
   200
  ],
  "su_wind": [
   0,
   15
  ],
  "su_space": [
   0,
   100
  ]
 }
}
`,Zs=`{
 "_note": "Field guide text for the raven, both languages. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/corvus-corax",
 "facts": {
  "length": {
   "en": "65 to 70 cm, about 1,5 kg, wingspan up to 1,3 m",
   "no": "65 til 70 cm, rundt 1,5 kg, vingespenn opptil 1,3 m",
   "verified": true
  },
  "broods": {
   "en": "1 to 8 eggs, usually 4 to 6; usually March to April, from February on the coast",
   "no": "1 til 8 egg, oftest 4 til 6; vanligvis mars til april, fra februar ved kysten",
   "verified": true
  },
  "range": {
   "en": "Most of Norway; 20 000 to 80 000 pairs",
   "no": "Det meste av landet; 20 000 til 80 000 par",
   "verified": true
  },
  "habitat": {
   "en": "Forest and mountains, also coastal mountains",
   "no": "Skog og fjell, også kystfjell",
   "verified": true
  },
  "food": {
   "en": "Omnivore, mainly animal food and carrion; caches food all year",
   "no": "Altetende, mest animalsk føde og åtsler; gjemmer mat hele året",
   "verified": true
  },
  "status": {
   "en": "LC, least concern, Norwegian red list",
   "no": "LC, livskraftig, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "A large stick nest on a cliff ledge, built up over years",
   "no": "Et stort reir av kvister på en hylle i bratt berg, bygd på i årevis",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "",
   "no": "",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "A deep “prruk” or “korp”, a hoarse, grating “rrå” and a coarse “ærr ærr ærr”; the alarm is a persistent “arrk-arrk-arrk”. A hollow “klong”, like two wooden blocks struck together, carries several kilometres and is given often in the pair's display flights. 79 different sounds have been mapped. No song is described, so Pipp plays the deep calls in the song slot.",
  "no": "Et dypt «prruk» eller «korp», et hest, skurrende «rrå» og et grovt «ærr ærr ærr»; varselet er et iherdig «arrk-arrk-arrk». Et hult «klong», som to treklosser slått mot hverandre, bærer flere kilometer og høres ofte i parets fluktlek. 79 ulike lyder er kartlagt. Ingen sang er beskrevet, så Pipp spiller de dype lydene på sangens plass.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "No song; a deep “prruk” or “korp”.",
   "no": "Ingen sang; et dypt «prruk» eller «korp».",
   "verified": true
  },
  "call": {
   "en": "A hoarse, grating “rrå”; a coarse “ærr ærr ærr”.",
   "no": "Et hest, skurrende «rrå»; et grovt «ærr ærr ærr».",
   "verified": true
  },
  "alarm": {
   "en": "A persistent “arrk-arrk-arrk”.",
   "no": "Et iherdig «arrk-arrk-arrk».",
   "verified": true
  },
  "flight": {
   "en": "A hollow “klong”, like wooden blocks, in display flight.",
   "no": "Et hult «klong», som treklosser, i fluktlek.",
   "verified": true
  }
 },
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "????????????",
  "note": {
   "en": "Resident, now and then wandering; most pairs stay near the nest all their lives. Eggs usually March to April.",
   "no": "Standfugl, av og til streifende; de fleste par holder seg nær reiret hele livet. Egg vanligvis mars til april.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "id": "krake",
   "text": {
    "en": "The crow's tail is square-cut and its wingbeats slow and calm; the raven has a wedge-shaped tail and often glides.",
    "no": "Kråkas hale er tverrskåret og vingeslagene rolige; ravnen har kileformet hale og glir ofte.",
    "verified": true
   }
  },
  {
   "name": {
    "en": "Birds of prey",
    "no": "Rovfugler"
   },
   "text": {
    "en": "Soaring, it can look like a bird of prey; long narrow fingered wings, a long neck and the wedge tail tell it apart.",
    "no": "I seilflukt kan den ligne en rovfugl; lange, smale, fingrete vinger, lang hals og kilehale skiller den.",
    "verified": true
   }
  }
 ]
}
`,Fs=`{
 "_note": "Raven ink plate in a 280x240 box, M11 batch 6, built from the hooded crow plate: all black with gloss (shadow tone under dense hatching), heavy head and bill, long throat feathers (strokes), wedge-shaped tail (birds.md, SNL). The juvenile has no gloss drawn and a small pale patch at the bill base (yellow, turning black in the first year).",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M190 60 C184 44 158 42 150 62 C134 80 104 106 90 136 C92 146 98 154 106 158 C128 180 162 178 178 152 C192 130 198 104 192 80 C194 74 194 66 190 60 Z",
  "wing": "M152 90 C156 118 136 146 98 152 C106 136 118 110 152 90 Z",
  "hood": "M190 60 C184 44 158 42 150 62 C144 72 146 84 156 92 C168 102 178 118 184 136 C192 118 196 100 192 80 C194 74 194 66 190 60 Z"
 },
 "layers": [
  {
   "path": "M14 211 C80 205 150 201 268 193",
   "stroke": 4
  },
  {
   "path": "M214 196 l20 -20 M224 186 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 176 q10 -10 18 -2 q-9 8 -18 2 Z M240 189 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M90 136 L48 184 L44 206 L64 204 L106 158 Z",
   "fill": "ink",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M94 142 L52 192 M98 147 L56 200 M102 153 L62 202",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M136 172 L139 199 M152 173 L157 198 M131 201 L139 199 L148 202 M149 200 L157 198 L166 201",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "shadow",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "path": "M150 62 C144 72 146 84 156 92 C168 102 178 118 184 136",
   "stroke": 1,
   "within": "body"
  },
  {
   "hatch": "wing"
  },
  {
   "path": "M184 82 l4 7 M180 88 l4 7 M176 94 l4 6 M188 88 l3 7 M184 96 l3 6",
   "stroke": 1.3,
   "within": "body"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "eye": [
    177,
    65
   ],
   "pupil": 2.4
  },
  {
   "path": "M177.6 64.4 m-1.2 0 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0",
   "fill": "face"
  },
  {
   "path": "M186 54 C204 54 222 60 230 66 L192 72 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M192 72 L226 69 C214 76 200 80 189 81 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "variant": "gape",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M230 52 A16 16 0 0 1 230 76 M237 44 A26 26 0 0 1 237 84 M243 36 A36 36 0 0 1 243 92",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "hatch": {
  "body": {
   "rect": [
    86,
    42,
    200,
    182
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    96,
    88,
    158,
    154
   ],
   "up": false,
   "clip": "wing"
  },
  "hood": {
   "rect": [
    140,
    40,
    200,
    140
   ],
   "up": false,
   "clip": "hood"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    192,
    67
   ],
   "deg": -16
  },
  "lower": {
   "at": [
    192,
    72
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    98,
    147
   ],
   "deg": -5
  }
 },
 "variants": {
  "male": {
   "body_pitch": 2.5,
   "wing_pitch": 2.5,
   "hood_pitch": 0,
   "eye_ring": 0,
   "bill": "ink",
   "gape": ""
  },
  "female": {
   "body_pitch": 2.5,
   "wing_pitch": 2.5,
   "hood_pitch": 0,
   "eye_ring": 0,
   "bill": "ink",
   "gape": ""
  },
  "juvenile": {
   "body_pitch": 3.5,
   "wing_pitch": 2.5,
   "hood_pitch": 0,
   "eye_ring": 0,
   "bill": "ink",
   "gape": "M187 70 L195 69 L195 75 L188 76 Z"
  }
 },
 "callouts": [
  {
   "id": "bill",
   "leader": "M210 62 L214 30",
   "at": [
    214,
    17
   ],
   "align": "centre",
   "male": {
    "en": "HEAVY",
    "no": "KRAFTIG",
    "verified": true
   },
   "female": {
    "en": "HEAVY",
    "no": "KRAFTIG",
    "verified": true
   },
   "juvenile": {
    "en": "YELLOW AT THE BASE",
    "no": "GULT VED ROTEN",
    "verified": true
   }
  },
  {
   "id": "throat",
   "leader": "M184 92 L236 126",
   "at": [
    240,
    138
   ],
   "align": "centre",
   "male": {
    "en": "LONG FEATHERS",
    "no": "LANGE FJÆR",
    "verified": true
   },
   "female": {
    "en": "LONG FEATHERS",
    "no": "LANGE FJÆR",
    "verified": true
   },
   "juvenile": {
    "en": "LONG FEATHERS",
    "no": "LANGE FJÆR",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M136 100 L96 44",
   "at": [
    92,
    32
   ],
   "align": "centre",
   "male": {
    "en": "GLOSSY BLACK",
    "no": "GLANSENDE SVART",
    "verified": true
   },
   "female": {
    "en": "GLOSSY BLACK",
    "no": "GLANSENDE SVART",
    "verified": true
   },
   "juvenile": {
    "en": "OFTEN NO GLOSS",
    "no": "OFTE UTEN GLANS",
    "verified": true
   }
  },
  {
   "id": "tail",
   "leader": "M62 196 L104 214",
   "at": [
    140,
    222
   ],
   "align": "centre",
   "male": {
    "en": "WEDGE-SHAPED",
    "no": "KILEFORMET",
    "verified": true
   },
   "female": {
    "en": "WEDGE-SHAPED",
    "no": "KILEFORMET",
    "verified": true
   },
   "juvenile": {
    "en": "WEDGE-SHAPED",
    "no": "KILEFORMET",
    "verified": true
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Adult. The male is considerably larger.",
   "no": "Voksen. Hannen er en god del større.",
   "verified": true
  },
  "female": {
   "en": "Female. Like the male, smaller.",
   "no": "Hunn. Som hannen, mindre.",
   "verified": true
  },
  "juvenile": {
   "en": "Young bird. Yellow bill base.",
   "no": "Ungfugl. Gul nebbrot.",
   "verified": true
  }
 }
}
`,Ks=`{
 "_note": "Raven, M11 batch 6. Verified by SNL: a deep «prruk» or «korp», a hoarse grating «rrå», a coarse «ærr ærr ærr», a persistent alarm «arrk-arrk-arrk», and a hollow «klong» like two wooden blocks struck together, often in display flight over the territory. No song is described, so the song slot plays the deep calls. Pitches, lengths and spacing are sound design guesses. The «klong» uses the drum source (one stroke per note), since SNL compares it to wooden blocks.",
 "syllables": {
  "korp": {
   "dur_ms": 300,
   "pitch": [
    [
     0,
     380
    ],
    [
     0.3,
     450
    ],
    [
     1,
     350
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.7,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.85,
   "rough": 30,
   "tension": -10,
   "trill": {
    "hz": 30,
    "depth_st": 0.4,
    "am": 0.25
   }
  },
  "prruk": {
   "dur_ms": 280,
   "pitch": [
    [
     0,
     400
    ],
    [
     0.4,
     470
    ],
    [
     1,
     360
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.06,
     0.9
    ],
    [
     0.4,
     1
    ],
    [
     0.8,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.85,
   "rough": 30,
   "tension": -10,
   "trill": {
    "hz": 34,
    "depth_st": 0.6,
    "am": 0.8
   }
  },
  "rraa": {
   "dur_ms": 420,
   "pitch": [
    [
     0,
     480
    ],
    [
     0.3,
     560
    ],
    [
     1,
     440
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.7,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75,
   "rough": 70,
   "tension": -10
  },
  "aerr": {
   "dur_ms": 200,
   "pitch": [
    [
     0,
     600
    ],
    [
     0.3,
     660
    ],
    [
     1,
     540
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.7,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "rough": 60,
   "tension": -5
  },
  "arrk": {
   "dur_ms": 180,
   "pitch": [
    [
     0,
     650
    ],
    [
     0.3,
     700
    ],
    [
     1,
     560
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.7,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "rough": 55
  },
  "klong": {
   "dur_ms": 90,
   "pitch": [
    [
     0,
     1150
    ],
    [
     1,
     1100
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.02,
     1
    ],
    [
     0.5,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.9,
   "drum": {
    "rate": [
     12.0,
     12.0
    ]
   }
  }
 },
 "types": {
  "song": {
   "pause_s": [
    3.0,
    10.0
   ],
   "length_s": [
    0.8,
    3.0
   ],
   "transpose_st": 1.0,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     16,
     26
    ],
    "vo_tension": [
     20,
     32
    ],
    "vo_rough": [
     28,
     40
    ],
    "ph_tempo": [
     96,
     104
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "korp",
        "prruk"
       ],
       "count": [
        1,
        4
       ],
       "share": 1.0,
       "gap_ms": [
        350,
        750
       ]
      }
     ]
    }
   ],
   "overrides": []
  },
  "call": {
   "pause_s": [
    3.0,
    9.0
   ],
   "length_s": [
    0.4,
    1.6
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     16,
     26
    ],
    "vo_tension": [
     20,
     32
    ],
    "vo_rough": [
     50,
     66
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "rraa"
       ],
       "count": [
        1,
        2
       ],
       "share": 1.0,
       "gap_ms": [
        400,
        700
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "aerr"
       ],
       "count": [
        3,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        140,
        220
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": []
  },
  "alarm": {
   "pause_s": [
    1.0,
    3.0
   ],
   "length_s": [
    1.5,
    3.5
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     16,
     26
    ],
    "vo_tension": [
     20,
     32
    ],
    "vo_rough": [
     46,
     60
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "arrk"
       ],
       "count": [
        6,
        14
       ],
       "share": 1.0,
       "gap_ms": [
        110,
        190
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": []
  },
  "flight": {
   "pause_s": [
    2.0,
    7.0
   ],
   "length_s": [
    0.1,
    1.0
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     16,
     26
    ],
    "vo_tension": [
     20,
     32
    ],
    "vo_rough": [
     28,
     40
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "klong"
       ],
       "count": [
        1,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        350,
        600
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,Us=`{
 "_note": "Sound design starting values for the raven, M11 batch 6. Not bird facts.",
 "pitch_ref_hz": 420,
 "base": {
  "vo_pitch": 1.0,
  "vo_breath": 20,
  "vo_tension": 26,
  "vo_trill": 0,
  "vo_rough": 34,
  "ph_tempo": 100,
  "ph_pause": 6.0,
  "ph_length": 2.0,
  "ph_variation": 50,
  "su_distance": 50,
  "su_wind": 1.5,
  "su_space": 50
 },
 "ranges": {
  "vo_pitch": [
   0.5,
   2.0
  ],
  "vo_breath": [
   0,
   100
  ],
  "vo_tension": [
   0,
   100
  ],
  "vo_trill": [
   0,
   40
  ],
  "vo_rough": [
   0,
   100
  ],
  "ph_tempo": [
   50,
   200
  ],
  "ph_pause": [
   0.2,
   20
  ],
  "ph_length": [
   0.2,
   8
  ],
  "ph_variation": [
   0,
   100
  ],
  "su_distance": [
   1,
   200
  ],
  "su_wind": [
   0,
   15
  ],
  "su_space": [
   0,
   100
  ]
 }
}
`,qs=`{
 "_note": "Field guide text for this bird, both languages. Facts come from birds.md (M11 batch 1, SNL). A field with verified false is not shown as a fact: empty means not described, and the text says what the sources leave out. Norwegian wording is mine, Eirik to check. calendar rows: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/columba-palumbus",
 "facts": {
  "length": {
   "en": "38 to 42 cm, 300 to 600 g",
   "no": "38 til 42 cm, 300 til 600 g",
   "verified": true
  },
  "broods": {
   "en": "Often 2 a year",
   "no": "Ofte 2 kull i året",
   "verified": true
  },
  "range": {
   "en": "Most of the country, spreading in Finnmark",
   "no": "Det meste av landet, sprer seg i Finnmark",
   "verified": true
  },
  "habitat": {
   "en": "Forest and farmland, also parks and gardens",
   "no": "Skog og kulturlandskap, også parker og hager",
   "verified": true
  },
  "food": {
   "en": "Seeds, grain, berries, nuts, acorns",
   "no": "Frø, korn, bær, nøtter, eikenøtter",
   "verified": true
  },
  "status": {
   "en": "LC, least concern",
   "no": "LC, livskraftig",
   "verified": true
  },
  "nest": {
   "en": "Twig platform in a tree, 1 to 2 eggs",
   "no": "Plattform av kvister i et tre, 1 til 2 egg",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Sings, more than the female",
   "no": "Synger, mer enn hunnen",
   "verified": true
  },
  "female": {
   "en": "Sings, less than the male",
   "no": "Synger, mindre enn hannen",
   "verified": true
  }
 },
 "song_notes": {
  "en": "A repeated rhythmic phrase of five syllables of unequal length, «ho-hoo-hoo-ho-ho», that can remind of an owl; mostly by day. Can clap its wings on take-off.",
  "no": "En gjentatt rytmisk frase på fem stavelser av ulik lengde, «ho-hoo-hoo-ho-ho», som kan minne om en ugle; mest om dagen. Kan klappe med vingene når den letter.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "«ho-hoo-hoo-ho-ho», repeated, by day.",
   "no": "«ho-hoo-hoo-ho-ho», gjentatt, om dagen.",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "parts": {},
 "calendar": {
  "present": "???yyyy?????",
  "sings": "????????????",
  "note": {
   "en": "Migrant; some winter on the coast of southern Norway. First brood in April to May. The sources do not say when it comes and leaves, or give its singing months.",
   "no": "Trekkfugl; noen overvintrer langs kysten av Sør-Norge. Første kull i april til mai. Kildene sier ikke når den kommer og drar, og oppgir ikke månedene med sang.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "name": {
    "en": "Feral pigeon",
    "no": "Bydue"
   },
   "text": {
    "en": "Similar build, differs somewhat in colour pattern and size. Only the wood pigeon has the white neck patch.",
    "no": "Lik kroppsbygning, noe ulik i fargemønster og størrelse. Bare ringdua har den hvite halsflekken.",
    "verified": true
   }
  },
  {
   "name": {
    "en": "Stock dove",
    "no": "Skogdue"
   },
   "text": {
    "en": "Similar build, differs somewhat in colour pattern and size. Only the wood pigeon has the white neck patch.",
    "no": "Lik kroppsbygning, noe ulik i fargemønster og størrelse. Bare ringdua har den hvite halsflekken.",
    "verified": true
   }
  }
 ]
}
`,Vs=`{
 "_note": "Wood pigeon ink plate in a 280x240 box, drawn in M11 from the blackbird plate, not from a design: grey-blue in shadow tone, white neck patch and white wing band (face), short bill. Sexes alike (SNL). The juvenile has no neck patch until its first autumn (SNL). Bill colour not in SNL, so no bill callout.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M190 60 C184 44 158 42 150 62 C134 80 104 106 90 136 C92 146 98 154 106 158 C128 180 162 178 178 152 C192 130 198 104 192 80 C194 74 194 66 190 60 Z",
  "wing": "M152 90 C156 118 136 146 98 152 C106 136 118 110 152 90 Z"
 },
 "layers": [
  {
   "path": "M14 211 C80 205 150 201 268 193",
   "stroke": 4
  },
  {
   "path": "M214 196 l20 -20 M224 186 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 176 q10 -10 18 -2 q-9 8 -18 2 Z M240 189 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M90 136 L42 194 L54 206 L106 158 Z",
   "fill": "shadow",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M94 142 L46 198 M98 147 L49 202 M102 153 L52 205",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M136 172 L139 199 M152 173 L157 198 M131 201 L139 199 L148 202 M149 200 L157 198 L166 201",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "shadow",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "path": "M148 96 L104 144 L111 149 L152 102 Z",
   "fill": "face",
   "stroke": 1,
   "within": "wing"
  },
  {
   "variant": "neck",
   "fill": "face",
   "stroke": 1,
   "within": "body"
  },
  {
   "eye": [
    177,
    65
   ],
   "pupil": 2.4
  },
  {
   "path": "M190 61 L206 65 L192 68 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M192 68 L204 68 L191 72 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M230 52 A16 16 0 0 1 230 76 M237 44 A26 26 0 0 1 237 84 M243 36 A36 36 0 0 1 243 92",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "hatch": {
  "body": {
   "rect": [
    86,
    42,
    200,
    182
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    96,
    88,
    158,
    154
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    192,
    67
   ],
   "deg": -16
  },
  "lower": {
   "at": [
    192,
    72
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    98,
    147
   ],
   "deg": -5
  }
 },
 "variants": {
  "male": {
   "body_pitch": 0,
   "wing_pitch": 9,
   "eye_ring": 0,
   "bill": "shadow",
   "neck": "M158 80 C155 84 156 90 160 91 C167 90 172 86 172 80 C168 77 162 77 158 80 Z"
  },
  "female": {
   "body_pitch": 0,
   "wing_pitch": 9,
   "eye_ring": 0,
   "bill": "shadow",
   "neck": "M158 80 C155 84 156 90 160 91 C167 90 172 86 172 80 C168 77 162 77 158 80 Z"
  },
  "juvenile": {
   "body_pitch": 0,
   "wing_pitch": 9,
   "eye_ring": 0,
   "bill": "shadow",
   "neck": ""
  }
 },
 "callouts": [
  {
   "id": "plumage",
   "leader": "M130 132 L72 96",
   "at": [
    70,
    80
   ],
   "align": "right",
   "male": {
    "en": "GREY-BLUE",
    "no": "GRÅBLÅ",
    "verified": true
   },
   "female": {
    "en": "GREY-BLUE",
    "no": "GRÅBLÅ",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "neck",
   "leader": "M168 86 L236 112",
   "at": [
    276,
    120
   ],
   "align": "right",
   "male": {
    "en": "WHITE PATCH",
    "no": "HVIT FLEKK",
    "verified": true
   },
   "female": {
    "en": "WHITE PATCH",
    "no": "HVIT FLEKK",
    "verified": true
   },
   "juvenile": {
    "en": "NONE UNTIL AUTUMN",
    "no": "FØRST TIL HØSTEN",
    "verified": true
   }
  },
  {
   "id": "wing",
   "leader": "M122 126 L74 124",
   "at": [
    70,
    118
   ],
   "align": "right",
   "male": {
    "en": "WHITE BAND",
    "no": "HVITT BÅND",
    "verified": true
   },
   "female": {
    "en": "WHITE BAND",
    "no": "HVITT BÅND",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Adult. Grey-blue, white neck patch and wing band.",
   "no": "Voksen. Gråblå, hvit halsflekk og hvitt vingebånd.",
   "verified": true
  },
  "female": {
   "en": "Female. Like the male.",
   "no": "Hunn. Som hannen.",
   "verified": true
  },
  "juvenile": {
   "en": "Juvenile. No neck patch until its first autumn.",
   "no": "Ungfugl. Ingen halsflekk før den første høsten.",
   "verified": true
  }
 }
}
`,Ws=`{
 "_note": "Wood pigeon, M11 batch 1. Verified (birds.md, SNL): a repeated rhythmic phrase of five syllables of unequal length, «ho-hoo-hoo-ho-ho», owl-like, mostly by day, the male more than the female. Design: one syllable holds the whole five-note motif (short, long, long, short, short) around 340 to 410 Hz with soft breathy onsets; a phrase repeats it 3 to 5 times. Pitches and timings are guesses. Wing claps (verified) are not made: the engine has no source for them.",
 "syllables": {
  "motif": {
   "dur_ms": 2100,
   "pitch": [
    [
     0,
     360
    ],
    [
     0.12,
     350
    ],
    [
     0.18,
     380
    ],
    [
     0.3,
     410
    ],
    [
     0.42,
     380
    ],
    [
     0.48,
     390
    ],
    [
     0.68,
     375
    ],
    [
     0.75,
     360
    ],
    [
     0.86,
     355
    ],
    [
     0.9,
     350
    ],
    [
     1,
     340
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.03,
     0.8
    ],
    [
     0.09,
     0.7
    ],
    [
     0.12,
     0
    ],
    [
     0.18,
     0
    ],
    [
     0.22,
     1
    ],
    [
     0.38,
     0.85
    ],
    [
     0.42,
     0
    ],
    [
     0.48,
     0
    ],
    [
     0.52,
     0.95
    ],
    [
     0.64,
     0.8
    ],
    [
     0.68,
     0
    ],
    [
     0.75,
     0
    ],
    [
     0.78,
     0.8
    ],
    [
     0.83,
     0.65
    ],
    [
     0.86,
     0
    ],
    [
     0.9,
     0
    ],
    [
     0.93,
     0.75
    ],
    [
     0.98,
     0.6
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8,
   "breath": 6,
   "tension": -4
  },
  "motif2": {
   "dur_ms": 1900,
   "pitch": [
    [
     0,
     374.40000000000003
    ],
    [
     0.12,
     364.0
    ],
    [
     0.18,
     395.2
    ],
    [
     0.3,
     426.40000000000003
    ],
    [
     0.42,
     395.2
    ],
    [
     0.48,
     405.6
    ],
    [
     0.68,
     390.0
    ],
    [
     0.75,
     374.40000000000003
    ],
    [
     0.86,
     369.2
    ],
    [
     0.9,
     364.0
    ],
    [
     1,
     353.6
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.03,
     0.8
    ],
    [
     0.09,
     0.7
    ],
    [
     0.12,
     0
    ],
    [
     0.18,
     0
    ],
    [
     0.22,
     1
    ],
    [
     0.38,
     0.85
    ],
    [
     0.42,
     0
    ],
    [
     0.48,
     0
    ],
    [
     0.52,
     0.95
    ],
    [
     0.64,
     0.8
    ],
    [
     0.68,
     0
    ],
    [
     0.75,
     0
    ],
    [
     0.78,
     0.8
    ],
    [
     0.83,
     0.65
    ],
    [
     0.86,
     0
    ],
    [
     0.9,
     0
    ],
    [
     0.93,
     0.75
    ],
    [
     0.98,
     0.6
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8,
   "breath": 6,
   "tension": -4
  }
 },
 "types": {
  "song": {
   "pause_s": [
    5.0,
    14.0
   ],
   "length_s": [
    6.0,
    12.0
   ],
   "transpose_st": 0.6,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     22,
     30
    ],
    "vo_tension": [
     6,
     14
    ],
    "vo_rough": [
     2,
     6
    ],
    "ph_tempo": [
     96,
     104
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "motif",
        "motif2"
       ],
       "count": [
        3,
        5
       ],
       "share": 1.0,
       "gap_ms": [
        350,
        650
       ]
      }
     ]
    }
   ],
   "overrides": [
    {
     "_note": "Mostly by day (birds.md); longer pauses at dawn, dusk and night are a design choice.",
     "when": {
      "time": "night"
     },
     "active": false
    },
    {
     "when": {
      "sex": "female"
     },
     "pause_s": [
      12.0,
      30.0
     ]
    }
   ]
  }
 }
}
`,Ys=`{
  "_note": "Sound design starting values for the wood pigeon, M11 batch 1. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 380,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 26,
    "vo_tension": 10,
    "vo_trill": 0,
    "vo_rough": 4,
    "ph_tempo": 100,
    "ph_pause": 8.0,
    "ph_length": 7.0,
    "ph_variation": 35,
    "su_distance": 25,
    "su_wind": 1.5,
    "su_space": 50
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}
`,$s=`{
 "_note": "Field guide text for this bird, both languages. Facts come from birds.md. A field with verified false is not shown as a fact: empty means not described, and the text says what the sources leave out. Norwegian wording is mine, Eirik to check. calendar rows: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/erithacus-rubecula",
 "facts": {
  "length": {
   "en": "14 cm, 16 to 22 g",
   "no": "14 cm, 16 til 22 g",
   "verified": true
  },
  "broods": {
   "en": "",
   "no": "",
   "verified": false
  },
  "range": {
   "en": "Up to Troms, scarce in Finnmark",
   "no": "Opp til Troms, fåtallig i Finnmark",
   "verified": true
  },
  "habitat": {
   "en": "Shady, dense forest, also gardens",
   "no": "Skyggefull, tett skog, også hager",
   "verified": true
  },
  "food": {
   "en": "Insects in summer, berries in winter",
   "no": "Insekter om sommeren, bær om vinteren",
   "verified": true
  },
  "status": {
   "en": "LC, viable, Norwegian red list",
   "no": "LC, livskraftig, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "In a cavity on the ground, 6 to 7 eggs",
   "no": "I et hulrom på bakken, 6 til 7 egg",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Sings",
   "no": "Synger",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "Very beautiful, compared to a trickling brook. Sings early at dawn and in the evening. Starts at or a little before the capercaillie, hence the nickname “tiurklokke”.",
  "no": "Svært vakker, sammenlignet med en sildrende bekk. Synger tidlig i grålysningen og om kvelden. Starter samtidig med eller litt før tiuren, derav kallenavnet «tiurklokke».",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "Early at dawn and in the evening.",
   "no": "Tidlig i grålysningen og om kvelden.",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "parts": {},
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "????????????",
  "note": {
   "en": "Mostly migrants, wintering in south-west Europe and the Mediterranean. Some winter in coastal south Norway. The sources do not give its singing months.",
   "no": "For det meste trekkfugl som overvintrer i sørvest-Europa og Middelhavsområdet. Noen overvintrer langs kysten av Sør-Norge. Kildene oppgir ikke månedene med sang.",
   "verified": true
  }
 },
 "lookalikes": []
}
`,Js=`{
 "_note": "Robin ink plate in a 280x240 box, drawn in M3 (not from the design). Same composition as the other plates: perched, facing right. The rust-red forehead, throat and breast are drawn in shadow, the olive-brown back as hatching. Callout values are from birds.md (SNL); bill colour and every juvenile fact are not verified, so the juvenile is drawn like the adults.",
 "box": [280, 240],
 "clips": {
  "body": "M198 72 C196 58 182 52 168 56 C152 60 140 74 132 92 C120 112 114 132 116 150 C120 166 132 176 148 178 C166 180 182 170 190 152 C198 134 200 108 199 92 C200 86 201 82 200 80 Z",
  "wing": "M158 94 C164 120 150 148 120 160 C124 138 134 112 158 94 Z"
 },
 "layers": [
  { "path": "M14 206 C80 202 150 199 268 194", "stroke": 4 },
  { "path": "M214 197 l20 -20 M224 187 l16 3", "stroke": 1.5 },
  { "path": "M234 177 q10 -10 18 -2 q-9 8 -18 2 Z M240 190 q11 -5 16 3 q-10 4 -16 -3 Z", "fill": "face", "stroke": 1 },
  { "path": "M120 150 L84 194 L96 202 L132 166 Z", "fill": "face", "stroke": 1.5, "part": "tail" },
  { "path": "M124 156 L88 198 M128 162 L92 201", "stroke": 1, "part": "tail" },
  { "path": "M148 178 L148 199 M162 176 L163 198 M140 201 L148 199 L156 201 M155 199 L163 198 L171 200", "stroke": 1.5 },
  { "clip": "body", "fill": "face", "stroke": 1.5 },
  { "hatch": "body" },
  { "path": "M194 58 C184 58 176 64 172 74 C168 88 160 102 160 118 C160 136 168 150 182 164 L216 164 L216 50 Z", "fill": "breast", "within": "body" },
  { "path": "M194 58 C184 58 176 64 172 74 C168 88 160 102 160 118 C160 136 168 150 182 164", "stroke": 1, "within": "body" },
  { "hatch": "wing" },
  { "clip": "wing", "stroke": 1.5 },
  { "clip": "body", "stroke": 1.5 },
  { "eye": [184, 72], "pupil": 2.4 },
  { "path": "M184.6 71.4 m-1.2 0 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0", "fill": "face" },
  { "path": "M198 72 L214 77 L200 79 Z", "fill": "bill", "stroke": 1.5, "part": "upper" },
  { "path": "M200 79 L212 79 L200 82 Z", "fill": "bill", "stroke": 1.5, "part": "lower" },
  { "path": "M226 66 A14 14 0 0 1 226 90 M233 58 A24 24 0 0 1 233 98 M240 50 A34 34 0 0 1 240 106", "stroke": 1.5, "part": "arcs" }
 ],
 "hatch": {
  "body": { "rect": [112, 50, 204, 182], "up": true, "clip": "body" },
  "wing": { "rect": [118, 90, 166, 164], "up": false, "clip": "wing" }
 },
 "pivots": {
  "upper": { "at": [200, 76], "deg": -14 },
  "lower": { "at": [200, 80], "deg": 10 },
  "tail": { "at": [126, 158], "deg": -6 }
 },
 "variants": {
  "male": { "body_pitch": 8, "wing_pitch": 5, "eye_ring": 0, "bill": "shadow", "breast": "shadow" },
  "female": { "body_pitch": 8, "wing_pitch": 5, "eye_ring": 0, "bill": "shadow", "breast": "shadow" },
  "juvenile": { "body_pitch": 8, "wing_pitch": 5, "eye_ring": 0, "bill": "shadow", "breast": "shadow" }
 },
 "callouts": [
  { "id": "bill", "leader": "M206 74 L206 23", "at": [206, 10], "align": "centre",
    "male": { "en": "", "no": "", "verified": false },
    "female": { "en": "", "no": "", "verified": false },
    "juvenile": { "en": "", "no": "", "verified": false } },
  { "id": "head", "leader": "M188 60 L122 36", "at": [120, 30], "align": "right",
    "male": { "en": "RUST-RED FOREHEAD", "no": "RUSTRØD PANNE", "verified": true },
    "female": { "en": "RUST-RED FOREHEAD", "no": "RUSTRØD PANNE", "verified": true },
    "juvenile": { "en": "", "no": "", "verified": false } },
  { "id": "plumage", "leader": "M140 100 L112 116", "at": [108, 110], "align": "right",
    "male": { "en": "OLIVE-BROWN BACK", "no": "OLIVENBRUN RYGG", "verified": true },
    "female": { "en": "OLIVE-BROWN BACK", "no": "OLIVENBRUN RYGG", "verified": true },
    "juvenile": { "en": "", "no": "", "verified": false } },
  { "id": "breast", "leader": "M186 130 L232 212", "at": [276, 224], "align": "right",
    "male": { "en": "RUST-RED THROAT, BREAST", "no": "RUSTRØD STRUPE, BRYST", "verified": true },
    "female": { "en": "RUST-RED THROAT, BREAST", "no": "RUSTRØD STRUPE, BRYST", "verified": true },
    "juvenile": { "en": "", "no": "", "verified": false } }
 ],
 "captions": {
  "male": { "en": "Male, singing. The sexes look alike.", "no": "Hann som synger. Kjønnene er like.", "verified": true },
  "female": { "en": "Female. Like the male.", "no": "Hunn. Som hannen.", "verified": true },
  "juvenile": { "en": "Juvenile. Not described in the sources.", "no": "Ungfugl. Ikke beskrevet i kildene.", "verified": false }
 }
}
`,Xs=`{
  "_note": "Robin, M3. Shapes, pitches, timings and the call are sound design guesses, not verified, not tuned against recordings. Verified (birds.md, SNL): the song is very beautiful and compared to a trickling brook; sings early at dawn and in the evening. Design: each phrase opens with 1 or 2 thin high notes, then a quick run of varied notes jumping between high and low, sometimes ending in a short rattle or a sizzling note. birds.md has no call description or transcription for the robin, so the call type (short 'tick' notes, a thin high drawn-out note) is a pure placeholder to check.",

  "syllables": {
    "h1": { "dur_ms": 220, "pitch": [[0, 7200], [1, 7000]], "amp": [[0, 0], [0.2, 0.9], [0.7, 1], [1, 0]], "gain": 0.45 },
    "h2": { "dur_ms": 180, "pitch": [[0, 6000], [0.8, 7500], [1, 7600]], "amp": [[0, 0], [0.25, 0.8], [0.7, 1], [1, 0]], "gain": 0.45 },
    "h3": { "dur_ms": 260, "pitch": [[0, 7900], [1, 7300]], "amp": [[0, 0], [0.15, 1], [0.6, 0.8], [1, 0]], "gain": 0.42 },
    "h4": { "dur_ms": 200, "pitch": [[0, 5400], [1, 5300]], "amp": [[0, 0], [0.2, 0.9], [0.7, 1], [1, 0]], "gain": 0.5, "trill": { "hz": 9, "depth_st": 0.4, "am": 0.1 } },

    "m1": { "dur_ms": 60, "pitch": [[0, 5200], [1, 3200]], "amp": [[0, 0], [0.15, 1], [0.6, 0.8], [1, 0]], "gain": 0.6 },
    "m2": { "dur_ms": 50, "pitch": [[0, 3000], [1, 5800]], "amp": [[0, 0], [0.3, 1], [1, 0]], "gain": 0.6 },
    "m3": { "dur_ms": 80, "pitch": [[0, 4400], [0.5, 6200], [1, 3800]], "amp": [[0, 0], [0.2, 1], [0.7, 0.8], [1, 0]], "gain": 0.6 },
    "m4": { "dur_ms": 90, "pitch": [[0, 3500], [1, 3300]], "amp": [[0, 0], [0.15, 1], [0.8, 0.7], [1, 0]], "gain": 0.6, "trill": { "hz": 40, "depth_st": 2, "am": 0.3 } },
    "m5": { "dur_ms": 45, "pitch": [[0, 6800], [1, 4800]], "amp": [[0, 0], [0.1, 1], [1, 0]], "gain": 0.5 },
    "m6": { "dur_ms": 70, "pitch": [[0, 2600], [0.6, 3200], [1, 3100]], "amp": [[0, 0], [0.2, 1], [0.7, 0.9], [1, 0]], "gain": 0.65 },
    "m7": { "dur_ms": 110, "pitch": [[0, 5600], [1, 5700]], "amp": [[0, 0], [0.15, 0.9], [0.7, 1], [1, 0]], "gain": 0.5, "trill": { "hz": 25, "depth_st": 1, "am": 0.2 } },
    "m8": { "dur_ms": 65, "pitch": [[0, 4000], [0.3, 4800], [1, 2900]], "amp": [[0, 0], [0.2, 1], [0.6, 0.7], [1, 0]], "gain": 0.6 },

    "e1": { "dur_ms": 25, "pitch": [[0, 4800], [1, 3800]], "amp": [[0, 0], [0.2, 1], [1, 0]], "gain": 0.55 },
    "e2": { "dur_ms": 140, "pitch": [[0, 7600], [1, 6600]], "amp": [[0, 0], [0.15, 1], [0.6, 0.7], [1, 0]], "gain": 0.4, "breath": 10, "trill": { "hz": 60, "depth_st": 3, "am": 0.5 } },

    "tick": { "dur_ms": 18, "pitch": [[0, 6500], [1, 4800]], "amp": [[0, 0], [0.15, 1], [1, 0]], "gain": 0.55, "breath": 20, "rough": 15 },
    "tsii": { "dur_ms": 320, "pitch": [[0, 8000], [1, 7700]], "amp": [[0, 0], [0.3, 1], [0.7, 0.9], [1, 0]], "gain": 0.3, "breath": 15 }
  },

  "types": {
    "song": {
      "pause_s": [2.5, 6.0],
      "length_s": [1.6, 3.0],
      "transpose_st": 2.0,
      "avoid_repeat": true,
      "auto": {
        "vo_pitch": [0.97, 1.03],
        "vo_breath": [4, 10],
        "vo_tension": [24, 36],
        "vo_rough": [2, 6],
        "ph_tempo": [92, 108]
      },
      "phrases": [
        { "weight": 3, "sections": [
          { "pool": ["h1", "h2", "h3", "h4"], "count": [1, 2], "share": 0.25, "gap_ms": [60, 140] },
          { "pool": ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8"], "count": [4, 14], "share": 0.6, "gap_ms": [12, 45], "lead_gap_ms": [60, 120] },
          { "pool": ["e1"], "count": [3, 8], "share": 0.15, "chance": 0.5, "gap_ms": [10, 16], "lead_gap_ms": [30, 60], "no_adjacent_repeat": false }
        ] },
        { "weight": 2, "sections": [
          { "pool": ["h1", "h2", "h3", "h4"], "count": [1, 1], "share": 0.15, "gap_ms": [60, 140] },
          { "pool": ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8"], "count": [6, 16], "share": 0.75, "gap_ms": [12, 45], "lead_gap_ms": [50, 110] },
          { "pool": ["e2"], "count": [1, 1], "share": 0.1, "chance": 0.6, "gap_ms": [0, 0], "lead_gap_ms": [30, 70] }
        ] },
        { "weight": 1, "sections": [
          { "pool": ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8"], "count": [3, 9], "share": 0.7, "gap_ms": [12, 45] },
          { "pool": ["h1", "h2", "h3"], "count": [1, 2], "share": 0.3, "gap_ms": [60, 140], "lead_gap_ms": [60, 120] }
        ] }
      ],
      "overrides": [
        { "_note": "Sings early at dawn and in the evening (birds.md). Longer pauses by day are a design choice.", "when": { "time": "day" }, "pause_s": [5.0, 11.0] }
      ]
    },

    "call": {
      "pause_s": [1.5, 5.0],
      "length_s": [0.3, 1.5],
      "avoid_repeat": false,
      "auto": {
        "vo_pitch": [0.98, 1.02],
        "vo_breath": [10, 18],
        "vo_tension": [36, 50],
        "vo_rough": [4, 10]
      },
      "phrases": [
        { "weight": 3, "sections": [ { "pool": ["tick"], "count": [2, 6], "share": 1.0, "gap_ms": [70, 160], "no_adjacent_repeat": false } ] },
        { "weight": 1, "sections": [ { "pool": ["tsii"], "count": [1, 1], "share": 1.0, "gap_ms": [0, 0] } ] }
      ],
      "overrides": []
    }
  }
}
`,Qs=`{
  "_note": "Sound design starting values for the robin, M3 round 1. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 5000,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 7,
    "vo_tension": 30,
    "vo_trill": 0,
    "vo_rough": 4,
    "ph_tempo": 100,
    "ph_pause": 4.0,
    "ph_length": 2.2,
    "ph_variation": 60,
    "su_distance": 15,
    "su_wind": 1.5,
    "su_space": 40
  },
  "ranges": {
    "vo_pitch": [0.5, 2.0],
    "vo_breath": [0, 100],
    "vo_tension": [0, 100],
    "vo_trill": [0, 40],
    "vo_rough": [0, 100],
    "ph_tempo": [50, 200],
    "ph_pause": [0.2, 20],
    "ph_length": [0.2, 8],
    "ph_variation": [0, 100],
    "su_distance": [1, 200],
    "su_wind": [0, 15],
    "su_space": [0, 100]
  }
}
`,na=`{
 "_note": "Field guide text for this bird, both languages. Facts come from birds.md (M11, SNL). A field with verified false is not shown as a fact: empty means not described, and the text says what the sources leave out. Norwegian wording is mine, Eirik to check. calendar rows: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/turdus-iliacus",
 "facts": {
  "length": {
   "en": "21 cm, 60 to 80 g",
   "no": "21 cm, 60 til 80 g",
   "verified": true
  },
  "broods": {
   "en": "",
   "no": "",
   "verified": false
  },
  "range": {
   "en": "Forest over the whole country",
   "no": "Skog over hele landet",
   "verified": true
  },
  "habitat": {
   "en": "Forest from towns to mountain forest, also willow and juniper scrub",
   "no": "Skog fra by til fjellskog, også vierkratt og einerkratt",
   "verified": true
  },
  "food": {
   "en": "Snails, worms, insects; berries in autumn",
   "no": "Snegler, meitemark, insekter; bær om høsten",
   "verified": true
  },
  "status": {
   "en": "LC, least concern",
   "no": "LC, livskraftig",
   "verified": true
  },
  "nest": {
   "en": "Low and open, by a trunk or in a bush, 4 to 6 eggs",
   "no": "Lavt og åpent, inntil en stamme eller i en busk, 4 til 6 egg",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Sings",
   "no": "Synger",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "A descending, melodic phrase followed by a faint twitter. The song varies in regional dialects. Flocks migrating at night are heard by a thin «siiip».",
  "no": "En fallende, melodisk strofe fulgt av en svak kvitring. Sangen varierer i dialekter i ulike deler av landet. Flokker som trekker om natten høres på et tynt «siiip».",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "A falling phrase, then a faint twitter.",
   "no": "En fallende strofe, så en svak kvitring.",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "A thin «siiip», heard from night flocks.",
   "no": "Et tynt «siiip», hørt fra trekkflokker om natten.",
   "verified": true
  }
 },
 "parts": {
  "phrase": {
   "en": "FALLING PHRASE",
   "no": "FALLENDE STROFE",
   "verified": true
  },
  "twitter": {
   "en": "FAINT TWITTER",
   "no": "SVAK KVITRING",
   "verified": true
  }
 },
 "calendar": {
  "present": "???yyyyyy???",
  "sings": "????????????",
  "note": {
   "en": "Migrant, winters in south-west Europe; returns in March to April, leaves in September to November. The sources do not give its singing months.",
   "no": "Trekkfugl, overvintrer i Sørvest-Europa; kommer i mars til april, drar i september til november. Kildene oppgir ikke månedene med sang.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "id": "maltrost",
   "text": {
    "en": "Like the song thrush; the redwing has a clear pale stripe over the eye and a rust-red patch under the wing.",
    "no": "Ligner måltrosten; rødvingetrosten har en tydelig lys stripe over øyet og en rustrød flekk under vingen.",
    "verified": true
   }
  }
 ]
}
`,ea=`{
 "_note": "Redwing ink plate in a 280x240 box, drawn in M11 from the song thrush plate, not from a design: brown (hatching), a pale stripe over the eye (face) and the rust-red patch under the wing (shadow tone). SNL gives only those two marks, so no breast spots are drawn. Sexes and juvenile are not described; the female shows the species' marks, the juvenile is drawn alike with [TO VERIFY].",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M190 60 C184 44 158 42 150 62 C134 80 104 106 90 136 C92 146 98 154 106 158 C128 180 162 178 178 152 C192 130 198 104 192 80 C194 74 194 66 190 60 Z",
  "wing": "M152 90 C156 118 136 146 98 152 C106 136 118 110 152 90 Z"
 },
 "layers": [
  {
   "path": "M14 211 C80 205 150 201 268 193",
   "stroke": 4
  },
  {
   "path": "M214 196 l20 -20 M224 186 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 176 q10 -10 18 -2 q-9 8 -18 2 Z M240 189 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M90 136 L58 178 L70 190 L106 158 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M94 142 L61 182 M98 147 L64 186 M102 153 L67 189",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M136 172 L139 199 M152 173 L157 198 M131 201 L139 199 L148 202 M149 200 L157 198 L166 201",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "path": "M152 126 C142 140 128 150 110 156 C124 164 142 162 156 150 C162 142 160 132 152 126 Z",
   "fill": "shadow",
   "stroke": 1,
   "within": "body"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "path": "M148 72 C158 61 175 56 192 59 L191 64 C176 60.5 162 63 152 76 Z",
   "fill": "face",
   "stroke": 1,
   "within": "body"
  },
  {
   "eye": [
    177,
    65
   ],
   "pupil": 2.4
  },
  {
   "path": "M177.6 64.4 m-1.2 0 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0",
   "fill": "face"
  },
  {
   "path": "M190 60 L220 66 L193 70 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M193 70 L216 69 L191 79 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M230 52 A16 16 0 0 1 230 76 M237 44 A26 26 0 0 1 237 84 M243 36 A36 36 0 0 1 243 92",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "hatch": {
  "body": {
   "rect": [
    86,
    42,
    200,
    182
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    96,
    88,
    158,
    154
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    192,
    67
   ],
   "deg": -16
  },
  "lower": {
   "at": [
    192,
    72
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    98,
    147
   ],
   "deg": -5
  }
 },
 "variants": {
  "male": {
   "body_pitch": 8,
   "wing_pitch": 6,
   "eye_ring": 0,
   "bill": "shadow"
  },
  "female": {
   "body_pitch": 8,
   "wing_pitch": 6,
   "eye_ring": 0,
   "bill": "shadow"
  },
  "juvenile": {
   "body_pitch": 8,
   "wing_pitch": 6,
   "eye_ring": 0,
   "bill": "shadow"
  }
 },
 "callouts": [
  {
   "id": "eye_stripe",
   "leader": "M172 56 L122 36",
   "at": [
    120,
    30
   ],
   "align": "right",
   "male": {
    "en": "PALE",
    "no": "LYS",
    "verified": true
   },
   "female": {
    "en": "PALE",
    "no": "LYS",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "wing",
   "leader": "M150 140 L236 150",
   "at": [
    276,
    158
   ],
   "align": "right",
   "male": {
    "en": "RUST-RED BELOW",
    "no": "RUSTRØD UNDER",
    "verified": true
   },
   "female": {
    "en": "RUST-RED BELOW",
    "no": "RUSTRØD UNDER",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Adult. Pale stripe over the eye, rust-red under the wing.",
   "no": "Voksen. Lys stripe over øyet, rustrødt under vingen.",
   "verified": true
  },
  "female": {
   "en": "Female. Not described in the sources.",
   "no": "Hunn. Ikke beskrevet i kildene.",
   "verified": false
  },
  "juvenile": {
   "en": "Juvenile. Not described in the sources.",
   "no": "Ungfugl. Ikke beskrevet i kildene.",
   "verified": false
  }
 }
}
`,ta=`{
 "_note": "Redwing, M11 batch 2. Verified (birds.md, SNL): a descending, melodic phrase followed by a faint twitter (parts named); dialects exist but are not modelled; a thin «siiip» from flocks migrating at night. Design: the phrase is 3 to 6 clear notes stepping down from about 4,2 to 2,4 kHz, the twitter 4 to 10 short soft notes at 4,5 to 7 kHz; pauses 3 to 8 s. The 'siiip' is a thin 7 kHz note of 0,25 to 0,35 s, falling a little. Pitches and timings are guesses.",
 "syllables": {
  "n1": {
   "dur_ms": 220,
   "pitch": [
    [
     0,
     4300
    ],
    [
     1,
     4000
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.25,
     1
    ],
    [
     0.7,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8,
   "tension": -12
  },
  "n2": {
   "dur_ms": 200,
   "pitch": [
    [
     0,
     3800
    ],
    [
     1,
     3500
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.25,
     1
    ],
    [
     0.7,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8,
   "tension": -12
  },
  "n3": {
   "dur_ms": 240,
   "pitch": [
    [
     0,
     3300
    ],
    [
     1,
     3050
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.25,
     1
    ],
    [
     0.7,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8,
   "tension": -12
  },
  "n4": {
   "dur_ms": 260,
   "pitch": [
    [
     0,
     2900
    ],
    [
     1,
     2500
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.25,
     1
    ],
    [
     0.7,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75,
   "tension": -12
  },
  "tw1": {
   "dur_ms": 45,
   "pitch": [
    [
     0,
     5200
    ],
    [
     1,
     6200
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.25,
   "rough": 6
  },
  "tw2": {
   "dur_ms": 40,
   "pitch": [
    [
     0,
     6600
    ],
    [
     1,
     5600
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.22,
   "rough": 6
  },
  "tw3": {
   "dur_ms": 55,
   "pitch": [
    [
     0,
     4600
    ],
    [
     0.5,
     5600
    ],
    [
     1,
     5000
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.24,
   "rough": 6
  },
  "siip": {
   "dur_ms": 300,
   "pitch": [
    [
     0,
     7400
    ],
    [
     0.6,
     7100
    ],
    [
     1,
     6700
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.2,
     1
    ],
    [
     0.8,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.55,
   "tension": -20,
   "breath": 8
  }
 },
 "types": {
  "song": {
   "pause_s": [
    3.0,
    8.0
   ],
   "length_s": [
    1.6,
    3.0
   ],
   "transpose_st": 1.0,
   "avoid_repeat": true,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     10,
     18
    ],
    "vo_tension": [
     24,
     36
    ],
    "vo_rough": [
     2,
     6
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 2,
     "sections": [
      {
       "pool": [
        "n1"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.12,
       "gap_ms": [
        60,
        60
       ],
       "part": "phrase"
      },
      {
       "pool": [
        "n2"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.12,
       "gap_ms": [
        60,
        60
       ],
       "lead_gap_ms": [
        50,
        90
       ],
       "part": "phrase"
      },
      {
       "pool": [
        "n3"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.12,
       "gap_ms": [
        60,
        60
       ],
       "lead_gap_ms": [
        50,
        90
       ],
       "part": "phrase"
      },
      {
       "pool": [
        "n4"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.14,
       "gap_ms": [
        60,
        60
       ],
       "lead_gap_ms": [
        50,
        90
       ],
       "part": "phrase"
      },
      {
       "pool": [
        "tw1",
        "tw2",
        "tw3"
       ],
       "count": [
        4,
        10
       ],
       "share": 0.5,
       "gap_ms": [
        25,
        60
       ],
       "lead_gap_ms": [
        120,
        220
       ],
       "no_adjacent_repeat": true,
       "part": "twitter"
      }
     ]
    },
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "n1"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.15,
       "gap_ms": [
        60,
        60
       ],
       "part": "phrase"
      },
      {
       "pool": [
        "n2"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.15,
       "gap_ms": [
        60,
        60
       ],
       "lead_gap_ms": [
        50,
        90
       ],
       "part": "phrase"
      },
      {
       "pool": [
        "n4"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.15,
       "gap_ms": [
        60,
        60
       ],
       "lead_gap_ms": [
        50,
        90
       ],
       "part": "phrase"
      },
      {
       "pool": [
        "tw1",
        "tw2",
        "tw3"
       ],
       "count": [
        3,
        8
       ],
       "share": 0.55,
       "gap_ms": [
        25,
        60
       ],
       "lead_gap_ms": [
        120,
        220
       ],
       "no_adjacent_repeat": true,
       "part": "twitter"
      }
     ]
    }
   ],
   "overrides": []
  },
  "flight": {
   "pause_s": [
    1.5,
    6.0
   ],
   "length_s": [
    0.3,
    0.4
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.96,
     1.04
    ],
    "vo_breath": [
     14,
     20
    ],
    "vo_tension": [
     18,
     26
    ],
    "vo_rough": [
     0,
     4
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "siip"
       ],
       "count": [
        1,
        1
       ],
       "share": 1.0,
       "gap_ms": [
        100,
        100
       ]
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,ia=`{
  "_note": "Sound design starting values for the redwing, M11 batch 2. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 3200,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 14,
    "vo_tension": 30,
    "vo_trill": 0,
    "vo_rough": 4,
    "ph_tempo": 100,
    "ph_pause": 5.0,
    "ph_length": 2.2,
    "ph_variation": 45,
    "su_distance": 20,
    "su_wind": 1.5,
    "su_space": 50
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}
`,sa=`{
 "_note": "Field guide text for the woodcock, both languages. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known; the sings row is roding.",
 "xeno_canto": "https://xeno-canto.org/species/scolopax-rusticola",
 "facts": {
  "length": {
   "en": "About 300 g; compact, short legs",
   "no": "Omkring 300 g; kompakt, korte bein",
   "verified": true
  },
  "broods": {
   "en": "Usually 4 eggs, late April to May",
   "no": "Vanligvis 4 egg, sent i april til mai",
   "verified": true
  },
  "range": {
   "en": "Damp forest over most of the country",
   "no": "Fuktig skog i det meste av landet",
   "verified": true
  },
  "habitat": {
   "en": "Damp forest",
   "no": "Fuktig skog",
   "verified": true
  },
  "food": {
   "en": "Earthworms and insect larvae, probed for",
   "no": "Meitemark og insektlarver, som den sonderer etter",
   "verified": true
  },
  "status": {
   "en": "LC, viable, Norwegian red list",
   "no": "LC, livskraftig, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "Scrape by a tree, lined with leaves and moss",
   "no": "Grop ved et tre, foret med løv og mose",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Rodes in spring",
   "no": "Trekker om våren",
   "verified": true
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "In spring the males fly regular routes just above the treetops at dusk or shortly before sunrise, grunting and squeaking: “orrt-orrt” followed by a sharp “pisst”. This roding is called «rugdetrekket». Mainly active at night; large eyes set far back see almost all round.",
  "no": "Om våren flyr hannene faste ruter like over tretoppene i skumringen eller like før soloppgang, og knorter og pistrer: «orrt-orrt» fulgt av et skarpt «pisst». Dette kalles rugdetrekket. Mest nattaktiv; de store øynene sitter langt bak og ser nesten hele veien rundt.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "Roding: “orrt-orrt”, then a sharp “pisst”, at dusk and dawn.",
   "no": "Rugdetrekk: «orrt-orrt», så et skarpt «pisst», i skumring og grålysning.",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "parts": {
  "orrt": {
   "en": "ORRT-ORRT",
   "no": "ORRT-ORRT",
   "verified": true
  },
  "pisst": {
   "en": "PISST",
   "no": "PISST",
   "verified": true
  }
 },
 "calendar": {
  "present": "??yyyyyyyy??",
  "sings": "??yyy???????",
  "note": {
   "en": "Arrives in March and April, leaves in September and October; some stay on the south coast in winter. Roding in spring. The sources do not give the months.",
   "no": "Kommer i mars og april, drar i september og oktober; noen blir på sørlandskysten om vinteren. Rugdetrekk om våren. Kildene oppgir ikke månedene.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "id": "enkeltbekkasin",
   "text": {
    "en": "Snipes also have a very long, straight bill.",
    "no": "Bekkasiner har også svært langt, rett nebb.",
    "verified": true
   }
  }
 ]
}
`,aa=`{
 "_note": "Woodcock ink plate in a 280x240 box, drawn in M10, not from a design: on the forest floor, compact with short legs, very long straight bill, large eye set far back, strongly mottled (dense hatching and bars on the head) (birds.md, SNL). No sex difference in plumage is described; the juvenile is not described.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M190 96 C190 80 178 70 164 72 C150 74 142 86 140 98 C116 102 92 112 76 126 C70 132 74 140 84 146 C108 160 140 166 164 160 C182 154 192 140 192 124 C192 114 190 104 190 96 Z",
  "wing": "M154 106 C130 108 104 116 82 128 C104 138 132 142 158 134 C164 124 162 112 154 106 Z"
 },
 "hatch": {
  "body": {
   "rect": [
    70,
    68,
    194,
    168
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    80,
    104,
    164,
    144
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    188,
    94
   ],
   "deg": -5
  },
  "lower": {
   "at": [
    188,
    98
   ],
   "deg": 4
  },
  "tail": {
   "at": [
    80,
    130
   ],
   "deg": -3
  }
 },
 "layers": [
  {
   "path": "M14 196 C70 186 150 184 268 190",
   "stroke": 2.5
  },
  {
   "path": "M40 190 q10 -12 22 -2 q-12 6 -22 2 Z M210 186 q12 -10 22 0 q-12 6 -22 0 Z M120 192 q8 -8 16 0",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M138 160 L136 186 M154 162 L156 186 M128 187 L136 186 L144 188 M148 187 L156 186 L164 188",
   "stroke": 1.5
  },
  {
   "path": "M80 126 L58 128 L62 138 L84 136 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "path": "M150 78 l6 18 M162 74 l4 18 M174 74 l2 14",
   "stroke": 2.4,
   "within": "body"
  },
  {
   "clip": "wing",
   "fill": "face"
  },
  {
   "hatch": "wing"
  },
  {
   "path": "M96 126 l10 -6 M112 130 l10 -6 M128 132 l10 -6 M144 130 l8 -5",
   "stroke": 1.2,
   "within": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    170,
    92
   ],
   "pupil": 3.2
  },
  {
   "path": "M188 92 L250 100 L250 102 L189 98 Z",
   "fill": "bill",
   "stroke": 1.3,
   "part": "upper"
  },
  {
   "path": "M189 98 L250 102 L248 104 L188 102 Z",
   "fill": "bill",
   "stroke": 1.3,
   "part": "lower"
  },
  {
   "path": "M130 62 A16 16 0 0 0 130 90 M123 54 A26 26 0 0 0 123 98",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "variants": {
  "male": {
   "body_pitch": 4,
   "wing_pitch": 4,
   "eye_ring": 3.6,
   "bill": "shadow"
  },
  "female": {
   "body_pitch": 4,
   "wing_pitch": 4,
   "eye_ring": 3.6,
   "bill": "shadow"
  },
  "juvenile": {
   "body_pitch": 4,
   "wing_pitch": 4,
   "eye_ring": 3.6,
   "bill": "shadow"
  }
 },
 "callouts": [
  {
   "id": "bill",
   "leader": "M226 100 L226 44",
   "at": [
    226,
    31
   ],
   "align": "centre",
   "male": {
    "en": "VERY LONG, STRAIGHT",
    "no": "SVÆRT LANGT, RETT",
    "verified": true
   },
   "female": {
    "en": "VERY LONG, STRAIGHT",
    "no": "SVÆRT LANGT, RETT",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M110 116 L80 82",
   "at": [
    76,
    76
   ],
   "align": "right",
   "male": {
    "en": "MOTTLED RED-BROWN",
    "no": "SPRAGLETE RØDBRUN",
    "verified": true
   },
   "female": {
    "en": "MOTTLED RED-BROWN",
    "no": "SPRAGLETE RØDBRUN",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Male on the forest floor. Beak and tail follow the sound.",
   "no": "Hann på skogbunnen. Nebb og hale følger lyden.",
   "verified": true
  },
  "female": {
   "en": "Female. No plumage difference is described.",
   "no": "Hunn. Ingen forskjell i drakten er beskrevet.",
   "verified": true
  },
  "juvenile": {
   "en": "Juvenile. Not described in the sources, so drawn like the adults.",
   "no": "Ungfugl. Ikke beskrevet i kildene, så tegnet som de voksne.",
   "verified": false
  }
 }
}`,oa=`{
 "_note": "Woodcock, M10. Verified (birds.md, SNL): in spring the males fly regular routes just above the treetops at dusk or shortly before sunrise, grunting and squeaking «orrt-orrt» followed by a sharp «pisst». Sound design choices: the grunt as a low rough rattle at about 340 to 440 Hz, 2 or 3 of them, then the «pisst» at 5 to 6,4 kHz, repeated every 1,5 to 4 s. Active only at dawn and dusk, and not for the female. No call type: SNL describes no other sound.",
 "syllables": {
  "orrt": {
   "dur_ms": 260,
   "pitch": [
    [
     0,
     340
    ],
    [
     0.3,
     420
    ],
    [
     1,
     320
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     0.9
    ],
    [
     0.6,
     1
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8,
   "rough": 40,
   "breath": 10,
   "tension": 10,
   "trill": {
    "hz": 38,
    "depth_st": 1.5,
    "am": 0.8
   }
  },
  "orrt2": {
   "dur_ms": 240,
   "pitch": [
    [
     0,
     360
    ],
    [
     0.35,
     440
    ],
    [
     1,
     330
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     0.9
    ],
    [
     0.6,
     1
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8,
   "rough": 40,
   "breath": 10,
   "tension": 10,
   "trill": {
    "hz": 34,
    "depth_st": 1.5,
    "am": 0.8
   }
  },
  "pisst": {
   "dur_ms": 130,
   "pitch": [
    [
     0,
     5200
    ],
    [
     0.3,
     6400
    ],
    [
     1,
     5600
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.06,
     1
    ],
    [
     0.5,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75,
   "rough": -20,
   "breath": 15,
   "tension": 20
  }
 },
 "types": {
  "song": {
   "pause_s": [
    1.5,
    4.0
   ],
   "length_s": [
    0.9,
    1.6
   ],
   "transpose_st": 0.5,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     24,
     36
    ],
    "vo_tension": [
     34,
     46
    ],
    "vo_rough": [
     32,
     48
    ],
    "ph_tempo": [
     96,
     104
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "part": "orrt",
       "pool": [
        "orrt",
        "orrt2"
       ],
       "count": [
        2,
        3
       ],
       "share": 0.75,
       "gap_ms": [
        120,
        200
       ]
      },
      {
       "part": "pisst",
       "pool": [
        "pisst"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.25,
       "gap_ms": [
        50,
        50
       ],
       "lead_gap_ms": [
        150,
        260
       ]
      }
     ]
    }
   ],
   "overrides": [
    {
     "_note": "Roding is the males' (SNL).",
     "when": {
      "sex": "female"
     },
     "active": false
    },
    {
     "_note": "At dusk or shortly before sunrise (SNL).",
     "when": {
      "time": "day"
     },
     "active": false
    },
    {
     "when": {
      "time": "night"
     },
     "active": false
    }
   ]
  }
 }
}`,ra=`{
  "_note": "Sound design starting values for the woodcock, M10. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 1000,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 30,
    "vo_tension": 40,
    "vo_trill": 0,
    "vo_rough": 40,
    "ph_tempo": 100,
    "ph_pause": 3.0,
    "ph_length": 1.6,
    "ph_variation": 50,
    "su_distance": 30,
    "su_wind": 1.5,
    "su_space": 35
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}`,la=`{
 "_note": "Field guide text for the skylark, both languages. SNL gives the song flight but no transcription. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/alauda-arvensis",
 "facts": {
  "length": {
   "en": "16 to 18 cm, a little larger than a house sparrow",
   "no": "16 til 18 cm, litt større enn gråspurven",
   "verified": true
  },
  "broods": {
   "en": "2 to 6 eggs, the female sits 11 to 12 days; usually 2 to 3 broods",
   "no": "2 til 6 egg, hunnen ruger i 11 til 12 dager; vanligvis 2 til 3 kull",
   "verified": true
  },
  "range": {
   "en": "Mainly the lowlands of the east and the south coast, common to Trøndelag, sparse in the far north; 100 000 to 300 000 pairs",
   "no": "Mest flatbygdene på Østlandet og langs Sørlandskysten, vanlig til Trøndelag, spredt i nord; 100 000 til 300 000 par",
   "verified": true
  },
  "habitat": {
   "en": "Open farmland with some cover",
   "no": "Åpent kulturlandskap med litt skjul",
   "verified": true
  },
  "food": {
   "en": "Insects and small animals; seeds and grain in winter",
   "no": "Insekter og smådyr; frø og korn om vinteren",
   "verified": true
  },
  "status": {
   "en": "NT, near threatened, Norwegian red list (the text of SNL says vulnerable)",
   "no": "NT, nær truet, norsk rødliste (SNL-teksten sier sårbar)",
   "verified": true
  },
  "nest": {
   "en": "A hollow on the ground, of grass, lined with fine straw and hair",
   "no": "En grop på bakken, av gress, fôret med fine strå og hår",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "",
   "no": "",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "The song flight is well known: whirring, the bird climbs higher and higher while pouring out a continuous stream of trills and whistles. After a long display it glides slowly down and drops to the ground like a stone. SNL gives no transcription, so the notes Pipp plays are a stand-in.",
  "no": "Sangflukten er velkjent: svirrende stiger fuglen høyere og høyere mens den lar en uavbrutt strøm av triller og fløytetoner strømme ut. Etter lang tids oppvisning glir den langsomt ned og faller mot bakken som en stein. SNL gir ingen gjengivelse, så tonene Pipp spiller er en stedfortreder.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "Song flight: a long, continuous stream of trills and whistles.",
   "no": "Sangflukt: en lang, uavbrutt strøm av triller og fløytetoner.",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "calendar": {
  "present": "??yyyyy?????",
  "sings": "????????????",
  "note": {
   "en": "One of the first migrants back: February to March in the south, April in the far north. Most winter on the west coast of the continent to Iberia. The sources do not say when it leaves.",
   "no": "En av de første trekkfuglene tilbake: februar til mars i sør, april i nord. De fleste overvintrer langs kontinentets vestkyst til Den iberiske halvøy. Kildene sier ikke når den drar.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "id": "heipiplerke",
   "text": {
    "en": "The meadow pipit has a similar colour pattern but is smaller.",
    "no": "Heipiplerka har lignende fargemønster, men er mindre.",
    "verified": true
   }
  },
  {
   "name": {
    "en": "Tree pipit",
    "no": "Trepiplerke"
   },
   "text": {
    "en": "Similar colour pattern, smaller.",
    "no": "Lignende fargemønster, mindre.",
    "verified": true
   }
  }
 ]
}
`,ha=`{
 "_note": "Skylark ink plate in a 280x240 box, M11 batch 7, built from the meadow pipit plate (SNL: a similar colour pattern), with the hint of a crest and without the white outer tail feathers, which SNL does not mention for the skylark. Sexes and juvenile are not described.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M198 70 C196 56 180 50 166 56 C152 62 142 76 132 92 C120 110 110 130 108 150 C110 160 118 168 126 172 C146 182 170 174 180 156 C192 136 199 108 199 90 C200 86 201 82 200 80 Z",
  "wing": "M156 92 C164 118 148 148 112 160 C118 138 130 110 156 92 Z"
 },
 "layers": [
  {
   "path": "M14 206 C80 202 150 199 268 194",
   "stroke": 4
  },
  {
   "path": "M214 197 l20 -20 M224 187 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 177 q10 -10 18 -2 q-9 8 -18 2 Z M240 190 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M114 146 L62 204 L74 214 L126 166 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M118 152 L66 207 M122 159 L70 211",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M142 176 L144 199 M156 175 L159 198 M136 201 L144 199 L152 201 M151 199 L159 198 L167 200",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "variant": "under",
   "fill": "face",
   "within": "body"
  },
  {
   "path": "M186 96 l2 5 M180 108 l2 5 M190 112 l2 5 M174 122 l2 5 M184 128 l2 5 M168 136 l2 5 M178 142 l2 4",
   "stroke": 1.4,
   "within": "body"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "path": "M170 58 L166 40 L176 50 L178 56 Z",
   "fill": "face",
   "stroke": 1.3
  },
  {
   "eye": [
    182,
    68
   ],
   "pupil": 2.4
  },
  {
   "path": "M182.4 66.8 m-0.9 0 a0.9 0.9 0 1 0 1.8 0 a0.9 0.9 0 1 0 -1.8 0",
   "fill": "face"
  },
  {
   "path": "M198 69 L218 75 L200 77 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M200 77 L216 76 L200 80 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M226 64 A14 14 0 0 1 226 88 M233 56 A24 24 0 0 1 233 96 M240 48 A34 34 0 0 1 240 104",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "hatch": {
  "body": {
   "rect": [
    104,
    50,
    204,
    184
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    108,
    88,
    166,
    164
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    200,
    74
   ],
   "deg": -14
  },
  "lower": {
   "at": [
    200,
    79
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    120,
    156
   ],
   "deg": -5
  }
 },
 "variants": {
  "male": {
   "body_pitch": 7,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow",
   "under": "M199 84 C196 108 190 134 180 156 C170 174 146 182 126 172 C140 170 156 160 166 144 C178 124 188 102 192 84 Z"
  },
  "female": {
   "body_pitch": 7,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow",
   "under": "M199 84 C196 108 190 134 180 156 C170 174 146 182 126 172 C140 170 156 160 166 144 C178 124 188 102 192 84 Z"
  },
  "juvenile": {
   "body_pitch": 7,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow",
   "under": "M199 84 C196 108 190 134 180 156 C170 174 146 182 126 172 C140 170 156 160 166 144 C178 124 188 102 192 84 Z"
  }
 },
 "callouts": [
  {
   "id": "head",
   "leader": "M168 46 L126 30",
   "at": [
    122,
    24
   ],
   "align": "right",
   "male": {
    "en": "HINT OF A CREST",
    "no": "ANTYDNING TIL TOPP",
    "verified": true
   },
   "female": {
    "en": "HINT OF A CREST",
    "no": "ANTYDNING TIL TOPP",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M140 100 L74 86",
   "at": [
    70,
    80
   ],
   "align": "right",
   "male": {
    "en": "LIKE THE PIPITS",
    "no": "SOM PIPLERKENE",
    "verified": true
   },
   "female": {
    "en": "LIKE THE PIPITS",
    "no": "SOM PIPLERKENE",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Singing. Beak and tail follow the sound.",
   "no": "Synger. Nebb og hale følger lyden.",
   "verified": true
  },
  "female": {
   "en": "Female. No difference from the male is known.",
   "no": "Hunn. Ingen kjent forskjell fra hannen.",
   "verified": false
  },
  "juvenile": {
   "en": "Juvenile. Not described in the sources, so drawn like the adult.",
   "no": "Ungfugl. Ikke beskrevet i kildene, så tegnet som de voksne.",
   "verified": false
  }
 }
}
`,da=`{
 "_note": "Skylark, M11 batch 7. Verified by SNL: in its song flight it climbs higher and higher with a whirring sound and a continuous stream of trills and whistles, then glides down and drops like a stone. The engine holds 64 notes a phrase, so each note here is a short motif: warbled trills (fast pitch and amplitude trill) and clear whistles, 2,4 to 5 kHz, with very short gaps, 40 to 64 of them, 15 to 35 s. Pitches, shapes and lengths are sound design guesses.",
 "syllables": {
  "trA": {
   "dur_ms": 520,
   "pitch": [
    [
     0,
     3600
    ],
    [
     0.5,
     4200
    ],
    [
     1,
     3800
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.05,
     0.9
    ],
    [
     0.9,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.65,
   "trill": {
    "hz": 26,
    "depth_st": 2.5,
    "am": 0.6
   }
  },
  "trB": {
   "dur_ms": 440,
   "pitch": [
    [
     0,
     4300
    ],
    [
     0.5,
     3700
    ],
    [
     1,
     4100
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.05,
     0.9
    ],
    [
     0.9,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.65,
   "trill": {
    "hz": 32,
    "depth_st": 2.0,
    "am": 0.6
   }
  },
  "trC": {
   "dur_ms": 380,
   "pitch": [
    [
     0,
     3000
    ],
    [
     1,
     3500
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.05,
     0.9
    ],
    [
     0.9,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.65,
   "trill": {
    "hz": 22,
    "depth_st": 3.0,
    "am": 0.6
   }
  },
  "wh1": {
   "dur_ms": 220,
   "pitch": [
    [
     0,
     2800
    ],
    [
     0.4,
     3600
    ],
    [
     1,
     3300
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.65
  },
  "wh2": {
   "dur_ms": 260,
   "pitch": [
    [
     0,
     4600
    ],
    [
     0.5,
     4000
    ],
    [
     1,
     4400
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.65
  },
  "wh3": {
   "dur_ms": 180,
   "pitch": [
    [
     0,
     2500
    ],
    [
     1,
     3100
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.6
  },
  "chir": {
   "dur_ms": 300,
   "pitch": [
    [
     0,
     4000
    ],
    [
     0.25,
     4800
    ],
    [
     0.5,
     3800
    ],
    [
     0.75,
     4600
    ],
    [
     1,
     3900
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.05,
     1
    ],
    [
     0.22,
     0
    ],
    [
     0.28,
     0
    ],
    [
     0.33,
     1
    ],
    [
     0.48,
     0
    ],
    [
     0.55,
     0
    ],
    [
     0.6,
     1
    ],
    [
     0.75,
     0
    ],
    [
     0.8,
     0
    ],
    [
     0.85,
     1
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.6
  }
 },
 "types": {
  "song": {
   "pause_s": [
    4.0,
    12.0
   ],
   "length_s": [
    15.0,
    35.0
   ],
   "transpose_st": 0.8,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     14,
     24
    ],
    "vo_tension": [
     70,
     84
    ],
    "vo_rough": [
     2,
     8
    ],
    "ph_tempo": [
     96,
     104
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "trA",
        "trB",
        "trC",
        "wh1",
        "wh2",
        "wh3",
        "chir"
       ],
       "count": [
        40,
        64
       ],
       "share": 1.0,
       "gap_ms": [
        10,
        45
       ]
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,pa=`{
 "_note": "Sound design starting values for the skylark, M11 batch 7. Not bird facts. Length reaches 60 s because the song flight is long.",
 "pitch_ref_hz": 3600,
 "base": {
  "vo_pitch": 1.0,
  "vo_breath": 18,
  "vo_tension": 78,
  "vo_trill": 0,
  "vo_rough": 4,
  "ph_tempo": 100,
  "ph_pause": 8.0,
  "ph_length": 24.0,
  "ph_variation": 50,
  "su_distance": 50,
  "su_wind": 1.5,
  "su_space": 50
 },
 "ranges": {
  "vo_pitch": [
   0.5,
   2.0
  ],
  "vo_breath": [
   0,
   100
  ],
  "vo_tension": [
   0,
   100
  ],
  "vo_trill": [
   0,
   40
  ],
  "vo_rough": [
   0,
   100
  ],
  "ph_tempo": [
   50,
   200
  ],
  "ph_pause": [
   0.2,
   20
  ],
  "ph_length": [
   0.2,
   60
  ],
  "ph_variation": [
   0,
   100
  ],
  "su_distance": [
   1,
   200
  ],
  "su_wind": [
   0,
   15
  ],
  "su_space": [
   0,
   100
  ]
 }
}
`,ca=`{
 "_note": "Field guide text for the whooper swan, both languages. SNL gives no transcription, so the shape of the call is [TO VERIFY]. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/cygnus-cygnus",
 "facts": {
  "length": {
   "en": "",
   "no": "",
   "verified": false
  },
  "broods": {
   "en": "Usually 4 to 6 dirty white eggs; the female sits about 35 days",
   "no": "Vanligvis 4 til 6 skittenhvite egg; hunnen ruger i rundt 35 dager",
   "verified": true
  },
  "range": {
   "en": "Most in the two northernmost counties, now also in the south; 350 to 600 pairs, rising",
   "no": "Flest i de to nordligste fylkene, nå også i sør; 350 til 600 par, økende",
   "verified": true
  },
  "habitat": {
   "en": "Near water, often an islet or a large bog with open water; winters on shallow lakes",
   "no": "Ved vann, ofte en holme eller ei stor myr med åpent vann; overvintrer på grunne innsjøer",
   "verified": true
  },
  "food": {
   "en": "Mainly water plants such as eelgrass and pondweed; stubble fields in winter",
   "no": "Mest vannplanter som ålegras og tjønnaks; stubbåkrer om vinteren",
   "verified": true
  },
  "status": {
   "en": "LC, least concern, Norwegian red list",
   "no": "LC, livskraftig, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "Moss, water plants and soil, lined with straw and down; used year after year",
   "no": "Mose, vannplanter og jord, fôret med strå og dun; brukes år etter år",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "",
   "no": "",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "Usually very vocal, both in flight and on the ground. The call is loud and often compared to a trumpet blast. SNL gives no transcription, so the notes Pipp plays are a stand-in. All white, with a lemon-yellow bill with a black tip; swims with its neck straight.",
  "no": "Som regel svært lydelig, både i lufta og på bakken. Lydene er kraftige og sammenlignes ofte med trompetstøt. SNL gir ingen gjengivelse, så tonene Pipp spiller er en stedfortreder. Helt hvit, med sitrongult nebb med svart spiss; svømmer med rett hals.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "A loud call, often compared to a trumpet blast.",
   "no": "Kraftige lyder, ofte sammenlignet med trompetstøt.",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "????????????",
  "note": {
   "en": "Breeds mainly in the north; birds wintering here come mostly from northern Scandinavia and the Kola Peninsula. Tame in winter, very shy when breeding.",
   "no": "Hekker mest i nord; fuglene som overvintrer her kommer mest fra Nord-Skandinavia og Kola. Tam om vinteren, svært sky i hekketiden.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "name": {
    "en": "Mute swan",
    "no": "Knoppsvane"
   },
   "text": {
    "en": "The mute swan is larger, with a red-orange bill and a big black knob, and usually swims with an S-curved neck.",
    "no": "Knoppsvanen er større, har rødoransje nebb med stor svart knopp og svømmer oftest med S-formet hals.",
    "verified": true
   }
  }
 ]
}
`,ga=`{
 "_note": "Whooper swan ink plate in a 280x240 box, drawn in M11 batch 5, not from a design: swimming with the neck held straight, all white, lemon-yellow bill (face) with a black tip (ink) (birds.md, SNL). Juvenile grey-brown (hatching); its bill is not described.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M202 120 C206 134 198 150 180 157 C140 165 92 163 66 150 C54 144 52 132 60 124 C80 110 120 106 160 110 C168 111 174 112 180 112 L180 64 C180 50 186 40 196 40 C206 40 212 46 212 52 L210 60 C204 62 198 68 198 78 L198 112 C200 114 201 117 202 120 Z",
  "wing": "M188 122 C150 112 110 114 74 128 C106 142 150 144 190 134 Z"
 },
 "hatch": {
  "body": {
   "rect": [
    50,
    36,
    214,
    166
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    72,
    110,
    192,
    146
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    210,
    50
   ],
   "deg": -8
  },
  "lower": {
   "at": [
    210,
    58
   ],
   "deg": 6
  },
  "tail": {
   "at": [
    60,
    126
   ],
   "deg": -4
  }
 },
 "layers": [
  {
   "path": "M62 124 L44 118 L48 132 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "clip": "wing",
   "fill": "face"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.2
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    200,
    50
   ],
   "pupil": 2.2
  },
  {
   "path": "M210 46 L238 54 C241 56 240 59 236 59 L210 57 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "variant": "tip_u",
   "fill": "ink",
   "part": "upper"
  },
  {
   "path": "M210 57 L235 59 L232 62 L210 61 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "variant": "tip_l",
   "fill": "ink",
   "part": "lower"
  },
  {
   "path": "M12 160 C60 154 110 162 160 158 C200 155 236 160 270 156",
   "fill": "none",
   "stroke": 2
  },
  {
   "path": "M30 172 q12 -4 24 0 M90 176 q12 -4 24 0 M170 172 q12 -4 24 0 M230 176 q10 -3 20 0",
   "stroke": 1
  },
  {
   "path": "M250 40 A16 16 0 0 1 250 68 M257 32 A26 26 0 0 1 257 76",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "variants": {
  "male": {
   "body_pitch": 0,
   "wing_pitch": 0,
   "eye_ring": 0,
   "bill": "face",
   "tip_u": "M230 56 L238 54 C241 56 240 59 236 59 L230 58.5 Z",
   "tip_l": "M228 59.3 L235 59 L232 62 L228 61.8 Z"
  },
  "female": {
   "body_pitch": 0,
   "wing_pitch": 0,
   "eye_ring": 0,
   "bill": "face",
   "tip_u": "M230 56 L238 54 C241 56 240 59 236 59 L230 58.5 Z",
   "tip_l": "M228 59.3 L235 59 L232 62 L228 61.8 Z"
  },
  "juvenile": {
   "body_pitch": 7,
   "wing_pitch": 6,
   "eye_ring": 0,
   "bill": "shadow",
   "tip_u": "",
   "tip_l": ""
  }
 },
 "callouts": [
  {
   "id": "bill",
   "leader": "M226 54 L226 30",
   "at": [
    226,
    17
   ],
   "align": "centre",
   "male": {
    "en": "LEMON YELLOW, BLACK TIP",
    "no": "SITRONGULT, SVART SPISS",
    "verified": true
   },
   "female": {
    "en": "LEMON YELLOW, BLACK TIP",
    "no": "SITRONGULT, SVART SPISS",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "neck",
   "leader": "M182 90 L140 70",
   "at": [
    136,
    64
   ],
   "align": "right",
   "male": {
    "en": "HELD STRAIGHT",
    "no": "HOLDES RETT",
    "verified": true
   },
   "female": {
    "en": "HELD STRAIGHT",
    "no": "HOLDES RETT",
    "verified": true
   },
   "juvenile": {
    "en": "HELD STRAIGHT",
    "no": "HOLDES RETT",
    "verified": true
   }
  },
  {
   "id": "plumage",
   "leader": "M110 140 L76 198",
   "at": [
    72,
    210
   ],
   "align": "centre",
   "male": {
    "en": "ALL WHITE",
    "no": "HELT HVIT",
    "verified": true
   },
   "female": {
    "en": "ALL WHITE",
    "no": "HELT HVIT",
    "verified": true
   },
   "juvenile": {
    "en": "GREY-BROWN",
    "no": "GRÅBRUN",
    "verified": true
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Adult. The male is a little larger.",
   "no": "Voksen. Hannen er litt større.",
   "verified": true
  },
  "female": {
   "en": "Female. Plumage as the male's.",
   "no": "Hunn. Drakt som hannens.",
   "verified": true
  },
  "juvenile": {
   "en": "Young bird, grey-brown into its second autumn.",
   "no": "Ungfugl, gråbrun til andre høst.",
   "verified": true
  }
 }
}
`,ua=`{
 "_note": "Whooper swan, M11 batch 5. SNL: very vocal in flight and on the ground; a loud call often compared to a trumpet blast. No transcription, so the shapes are sound design guesses: brassy two-part 'ahng-ho' notes in short series. Low tension and some roughness give the brass.",
 "syllables": {
  "ahng": {
   "dur_ms": 420,
   "pitch": [
    [
     0,
     480
    ],
    [
     0.15,
     560
    ],
    [
     0.6,
     590
    ],
    [
     1,
     520
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     0.9
    ],
    [
     0.5,
     1
    ],
    [
     0.85,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.95,
   "rough": 18,
   "tension": -5
  },
  "ho": {
   "dur_ms": 300,
   "pitch": [
    [
     0,
     600
    ],
    [
     0.2,
     650
    ],
    [
     1,
     560
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     1
    ],
    [
     0.7,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.9,
   "rough": 18,
   "tension": -5
  },
  "ahng2": {
   "dur_ms": 380,
   "pitch": [
    [
     0,
     520
    ],
    [
     0.2,
     610
    ],
    [
     0.7,
     620
    ],
    [
     1,
     540
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     0.9
    ],
    [
     0.5,
     1
    ],
    [
     0.85,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.9,
   "rough": 18,
   "tension": -5
  }
 },
 "types": {
  "song": {
   "pause_s": [
    2.5,
    9.0
   ],
   "length_s": [
    0.8,
    3.0
   ],
   "transpose_st": 0.8,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     16,
     26
    ],
    "vo_tension": [
     16,
     28
    ],
    "vo_rough": [
     16,
     26
    ],
    "ph_tempo": [
     96,
     104
    ]
   },
   "phrases": [
    {
     "weight": 2,
     "sections": [
      {
       "pool": [
        "ahng",
        "ho"
       ],
       "count": [
        2,
        6
       ],
       "share": 1.0,
       "gap_ms": [
        140,
        320
       ]
      }
     ]
    },
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "ahng2"
       ],
       "count": [
        1,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        300,
        600
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,fa=`{
 "_note": "Sound design starting values for the whooper swan, M11 batch 5. Not bird facts.",
 "pitch_ref_hz": 560,
 "base": {
  "vo_pitch": 1.0,
  "vo_breath": 20,
  "vo_tension": 22,
  "vo_trill": 0,
  "vo_rough": 20,
  "ph_tempo": 100,
  "ph_pause": 5.0,
  "ph_length": 1.8,
  "ph_variation": 50,
  "su_distance": 60,
  "su_wind": 1.5,
  "su_space": 35
 },
 "ranges": {
  "vo_pitch": [
   0.5,
   2.0
  ],
  "vo_breath": [
   0,
   100
  ],
  "vo_tension": [
   0,
   100
  ],
  "vo_trill": [
   0,
   40
  ],
  "vo_rough": [
   0,
   100
  ],
  "ph_tempo": [
   50,
   200
  ],
  "ph_pause": [
   0.2,
   20
  ],
  "ph_length": [
   0.2,
   8
  ],
  "ph_variation": [
   0,
   100
  ],
  "su_distance": [
   1,
   200
  ],
  "su_wind": [
   0,
   15
  ],
  "su_space": [
   0,
   100
  ]
 }
}
`,ma=`{
 "_note": "Field guide text for the lesser black-backed gull, both languages. Facts from birds.md (SNL, checked 2026-11-26). SNL describes no sounds, so every sound text is [TO VERIFY]. Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/larus-fuscus",
 "facts": {
  "length": {
   "en": "",
   "no": "",
   "verified": false
  },
  "broods": {
   "en": "2 to 3 eggs, May to June",
   "no": "2 til 3 egg, mai til juni",
   "verified": true
  },
  "range": {
   "en": "The whole country, patchy in the north; most in Vest-Agder. Northern subspecies about 2000 pairs (2015), intermedius about 28 000",
   "no": "Hele landet, flekkvis i Nord-Norge; flest i Vest-Agder. Nordlig sildemåke rundt 2000 par (2015), intermedius rundt 28 000",
   "verified": true
  },
  "habitat": {
   "en": "Skerries, in colonies with herring and great black-backed gulls; roofs in towns from the Swedish border to Bergen",
   "no": "Skjærgården, i kolonier med gråmåke og svartbak; tak i byer fra svenskegrensen til Bergen",
   "verified": true
  },
  "food": {
   "en": "Shoaling fish such as sand eel, saithe and herring; also worms, insects and waste",
   "no": "Stimfisk som sil, sei og sild; også meitemark, insekter og avfall",
   "verified": true
  },
  "status": {
   "en": "LC, least concern, Norwegian red list",
   "no": "LC, livskraftig, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "In colonies, often on lower, boggy ground",
   "no": "I kolonier, ofte på lavere, myrlendt grunn",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "",
   "no": "",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "SNL describes no sounds of the lesser black-backed gull. Pipp plays a long laughing call series here as a stand-in, deeper than the herring gull's. Dark grey to black back, yellow bill with a red spot, yellow legs and a red eye-ring.",
  "no": "SNL beskriver ingen lyder fra sildemåken. Pipp spiller en lang, lattermild ropserie her som stedfortreder, dypere enn gråmåkens. Mørk grå til svart rygg, gult nebb med rød flekk, gule bein og rød øyering.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "",
   "no": "",
   "verified": false
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "calendar": {
  "present": "nnyyyyyyyynn",
  "sings": "????????????",
  "note": {
   "en": "Arrives from March, leaves mostly August to October; winters from the British Isles to Guinea. Eggs in May and June.",
   "no": "Kommer fra mars, trekker sørover mest august til oktober; overvintrer fra De britiske øyer til Guinea. Egg i mai og juni.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "id": "gramake",
   "text": {
    "en": "Smaller. Young birds have evenly dark primaries; young herring gulls paler inner ones.",
    "no": "Mindre. Unge fugler har jevnt mørke håndsvingfjær; unge gråmåker lysere innerst.",
    "verified": true
   }
  },
  {
   "name": {
    "en": "Great black-backed gull",
    "no": "Svartbak"
   },
   "text": {
    "en": "The great black-backed gull is about twice as heavy, with grey-pink legs and much white in the wingtip.",
    "no": "Svartbaken er omtrent dobbelt så tung, med grårosa bein og mye hvitt i vingetuppen.",
    "verified": true
   }
  }
 ]
}
`,va=`{
 "_note": "Lesser black-backed gull ink plate in a 280x240 box, M11 batch 4, built from the herring gull plate: dark back (dense hatching), black wingtips with one small white spot at the tip, yellow bill with a red spot (shadow), red eye-ring (birds.md, SNL). The juvenile is hatched all over with evenly dark primaries.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M198 80 C198 64 186 56 172 58 C160 60 152 70 152 82 C126 88 96 104 66 124 C98 138 126 158 150 162 C174 166 192 152 194 130 C196 112 198 96 198 80 Z",
  "wing": "M166 100 C138 100 104 110 70 124 C46 132 28 138 16 142 C40 146 80 142 112 136 C140 130 160 118 166 100 Z"
 },
 "hatch": {
  "body": {
   "rect": [
    64,
    54,
    200,
    168
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    14,
    98,
    168,
    148
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    198,
    82
   ],
   "deg": -10
  },
  "lower": {
   "at": [
    198,
    88
   ],
   "deg": 8
  },
  "tail": {
   "at": [
    70,
    126
   ],
   "deg": -3
  }
 },
 "layers": [
  {
   "path": "M14 216 C50 198 110 192 170 194 C214 196 246 204 268 216 Z",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "path": "M60 210 l14 -6 M150 202 l18 2 M214 206 l12 4",
   "stroke": 1
  },
  {
   "path": "M140 160 L138 196 M158 162 L160 195 M128 197 L138 196 L148 198 M150 196 L160 195 L170 197",
   "stroke": 1.5
  },
  {
   "path": "M70 120 L40 128 L44 136 L74 130 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "clip": "wing",
   "fill": "face"
  },
  {
   "hatch": "wing"
  },
  {
   "variant": "tips",
   "fill": "ink"
  },
  {
   "variant": "mirrors",
   "fill": "face"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    184,
    72
   ],
   "pupil": 2.2
  },
  {
   "path": "M197 76 L222 79 C226 81 225 84 220 85 L198 86 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M198 86 L219 85 L222 90 L198 91 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "variant": "spot",
   "fill": "shadow",
   "part": "lower"
  },
  {
   "path": "M234 70 A16 16 0 0 1 234 98 M241 62 A26 26 0 0 1 241 106 M248 54 A36 36 0 0 1 248 114",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "variants": {
  "male": {
   "body_pitch": 0,
   "wing_pitch": 3.5,
   "eye_ring": 3.5,
   "bill": "face",
   "tips": "M60 128 C40 134 26 139 16 142 C34 145 54 143 70 138 Z",
   "mirrors": "M18 142 a3 1.6 0 1 0 6 0 a3 1.6 0 1 0 -6 0 Z",
   "spot": "M212 86 L218 86 L219 90 L212 90 Z"
  },
  "female": {
   "body_pitch": 0,
   "wing_pitch": 3.5,
   "eye_ring": 3.5,
   "bill": "face",
   "tips": "M60 128 C40 134 26 139 16 142 C34 145 54 143 70 138 Z",
   "mirrors": "M18 142 a3 1.6 0 1 0 6 0 a3 1.6 0 1 0 -6 0 Z",
   "spot": "M212 86 L218 86 L219 90 L212 90 Z"
  },
  "juvenile": {
   "body_pitch": 6,
   "wing_pitch": 4,
   "eye_ring": 0,
   "bill": "shadow",
   "tips": "M60 128 C40 134 26 139 16 142 C34 145 54 143 70 138 Z",
   "mirrors": "",
   "spot": ""
  }
 },
 "callouts": [
  {
   "id": "bill",
   "leader": "M214 80 L214 33",
   "at": [
    214,
    20
   ],
   "align": "centre",
   "male": {
    "en": "YELLOW, RED SPOT",
    "no": "GULT, RØD FLEKK",
    "verified": true
   },
   "female": {
    "en": "YELLOW, RED SPOT",
    "no": "GULT, RØD FLEKK",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "eye_ring",
   "leader": "M182 68 L142 36",
   "at": [
    140,
    30
   ],
   "align": "right",
   "male": {
    "en": "RED",
    "no": "RØD",
    "verified": true
   },
   "female": {
    "en": "RED",
    "no": "RØD",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M120 112 L86 80",
   "at": [
    82,
    74
   ],
   "align": "right",
   "male": {
    "en": "DARK BACK",
    "no": "MØRK RYGG",
    "verified": true
   },
   "female": {
    "en": "DARK BACK",
    "no": "MØRK RYGG",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "wing",
   "leader": "M40 140 L80 172",
   "at": [
    84,
    184
   ],
   "align": "centre",
   "male": {
    "en": "LITTLE WHITE IN THE TIP",
    "no": "LITE HVITT I TUPPEN",
    "verified": true
   },
   "female": {
    "en": "LITTLE WHITE IN THE TIP",
    "no": "LITE HVITT I TUPPEN",
    "verified": false
   },
   "juvenile": {
    "en": "EVENLY DARK PRIMARIES",
    "no": "JEVNT MØRKE HÅNDSVINGFJÆR",
    "verified": true
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Adult. Yellow legs.",
   "no": "Voksen. Gule bein.",
   "verified": true
  },
  "female": {
   "en": "Female. No difference from the male is known.",
   "no": "Hunn. Ingen kjent forskjell fra hannen.",
   "verified": false
  },
  "juvenile": {
   "en": "Young bird. Two to four years to adult plumage.",
   "no": "Ungfugl. To til fire år til voksendrakt.",
   "verified": true
  }
 }
}
`,ba=`{
 "_note": "Lesser black-backed gull, M11 batch 4. Placeholder sounds: SNL describes none (birds.md). The 'song' slot holds a long laughing call series, deeper and rougher than the herring gull's (my choice), and 'call' deep 'kjow' notes and a 'gag-ag-ag' series. All shapes are sound design guesses. Rework once a source is found.",
 "syllables": {
  "kaaow": {
   "dur_ms": 460,
   "pitch": [
    [
     0,
     1050
    ],
    [
     0.3,
     1400
    ],
    [
     0.7,
     1320
    ],
    [
     1,
     1000
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     0.9
    ],
    [
     0.5,
     1
    ],
    [
     0.85,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.85
  },
  "kyow": {
   "dur_ms": 380,
   "pitch": [
    [
     0,
     1100
    ],
    [
     0.35,
     1450
    ],
    [
     1,
     1020
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.85
  },
  "ha": {
   "dur_ms": 130,
   "pitch": [
    [
     0,
     1200
    ],
    [
     0.4,
     1330
    ],
    [
     1,
     1080
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.85
  },
  "ha2": {
   "dur_ms": 120,
   "pitch": [
    [
     0,
     1120
    ],
    [
     0.4,
     1250
    ],
    [
     1,
     1000
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8
  },
  "kjow": {
   "dur_ms": 300,
   "pitch": [
    [
     0,
     1080
    ],
    [
     0.4,
     1500
    ],
    [
     1,
     960
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8
  },
  "gag": {
   "dur_ms": 95,
   "pitch": [
    [
     0,
     1250
    ],
    [
     1,
     1080
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75,
   "rough": 14
  }
 },
 "types": {
  "song": {
   "pause_s": [
    5.0,
    12.0
   ],
   "length_s": [
    2.4,
    3.8
   ],
   "transpose_st": 1.0,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     12,
     22
    ],
    "vo_tension": [
     60,
     76
    ],
    "vo_rough": [
     24,
     36
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "kaaow",
        "kyow"
       ],
       "count": [
        1,
        3
       ],
       "share": 0.5,
       "gap_ms": [
        120,
        220
       ]
      },
      {
       "pool": [
        "ha",
        "ha2"
       ],
       "count": [
        5,
        11
       ],
       "share": 0.5,
       "gap_ms": [
        35,
        70
       ]
      }
     ]
    }
   ],
   "overrides": []
  },
  "call": {
   "pause_s": [
    1.5,
    5.0
   ],
   "length_s": [
    0.3,
    1.6
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     12,
     22
    ],
    "vo_tension": [
     60,
     76
    ],
    "vo_rough": [
     24,
     36
    ]
   },
   "phrases": [
    {
     "weight": 2,
     "sections": [
      {
       "pool": [
        "kjow"
       ],
       "count": [
        1,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        220,
        420
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "gag"
       ],
       "count": [
        3,
        6
       ],
       "share": 1.0,
       "gap_ms": [
        80,
        140
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,_a=`{
 "_note": "Sound design starting values for the lesser black-backed gull, M11 batch 4. Not bird facts.",
 "pitch_ref_hz": 1250,
 "base": {
  "vo_pitch": 1.0,
  "vo_breath": 16,
  "vo_tension": 68,
  "vo_trill": 0,
  "vo_rough": 30,
  "ph_tempo": 100,
  "ph_pause": 5.0,
  "ph_length": 3.0,
  "ph_variation": 50,
  "su_distance": 30,
  "su_wind": 1.5,
  "su_space": 35
 },
 "ranges": {
  "vo_pitch": [
   0.5,
   2.0
  ],
  "vo_breath": [
   0,
   100
  ],
  "vo_tension": [
   0,
   100
  ],
  "vo_trill": [
   0,
   40
  ],
  "vo_rough": [
   0,
   100
  ],
  "ph_tempo": [
   50,
   200
  ],
  "ph_pause": [
   0.2,
   20
  ],
  "ph_length": [
   0.2,
   8
  ],
  "ph_variation": [
   0,
   100
  ],
  "su_distance": [
   1,
   200
  ],
  "su_wind": [
   0,
   15
  ],
  "su_space": [
   0,
   100
  ]
 }
}
`,ka=`{
 "_note": "Field guide text for this bird, both languages. Facts come from birds.md (M11 batch 1, SNL). A field with verified false is not shown as a fact: empty means not described, and the text says what the sources leave out. Norwegian wording is mine, Eirik to check. calendar rows: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/pica-pica",
 "facts": {
  "length": {
   "en": "About 50 cm, the tail 20 to 30 cm",
   "no": "Omtrent 50 cm, halen 20 til 30 cm",
   "verified": true
  },
  "broods": {
   "en": "",
   "no": "",
   "verified": false
  },
  "range": {
   "en": "The whole country",
   "no": "Hele landet",
   "verified": true
  },
  "habitat": {
   "en": "Near people, strongly tied to settlement",
   "no": "Nær folk, sterkt knyttet til bebyggelse",
   "verified": true
  },
  "food": {
   "en": "Omnivore: insects, worms, carrion, eggs, berries, grain",
   "no": "Altetende: insekter, mark, åtsler, egg, bær, korn",
   "verified": true
  },
  "status": {
   "en": "LC, least concern",
   "no": "LC, livskraftig",
   "verified": true
  },
  "nest": {
   "en": "Roofed stick nest in a tree, 6 to 8 eggs",
   "no": "Kuppelformet kvistreir i et tre, 6 til 8 egg",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Sings: a low chattering creak",
   "no": "Synger: en lav, skvatrende knirking",
   "verified": true
  },
  "female": {
   "en": "Yes, a pair babble together",
   "no": "Ja, paret babler sammen",
   "verified": true
  }
 },
 "song_notes": {
  "en": "Mostly hoarse, rasping, not very musical sounds. The song is a low, slightly chattering creak, heard even on cold winter days. Calls a chattering «sjakk-sjakk-sjakk»; alarm a fast «tsje-tsje-tsje».",
  "no": "Mest hese, raspende, lite musikalske lyder. Sangen er en lav, litt skvatrende knirking, som høres selv på kalde vinterdager. Lokker med skvatrende «sjakk-sjakk-sjakk», varsler med raske «tsje-tsje-tsje».",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "A low, chattering creak.",
   "no": "En lav, skvatrende knirking.",
   "verified": true
  },
  "call": {
   "en": "Chattering «sjakk-sjakk-sjakk».",
   "no": "Skvatrende «sjakk-sjakk-sjakk».",
   "verified": true
  },
  "alarm": {
   "en": "Fast staccato «tsje-tsje-tsje»; very intense at a cat.",
   "no": "Raske, staccato «tsje-tsje-tsje»; svært intense mot katt.",
   "verified": true
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "parts": {},
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "????????????",
  "note": {
   "en": "Resident and very sedentary. The song is heard even on cold winter days. The sources do not give its singing months.",
   "no": "Standfugl, svært stedbunden. Sangen høres selv på kalde vinterdager. Kildene oppgir ikke månedene med sang.",
   "verified": true
  }
 },
 "lookalikes": []
}
`,ya=`{
 "_note": "Magpie ink plate in a 280x240 box, drawn in M11 from the blackbird plate, not from a design. Black is dense hatching, with a white belly and white shoulder patch (face) and a very long tail in shadow tone for the green gloss. Sexes alike (SNL), so the female is drawn as the male. The juvenile has a shorter tail without gloss (SNL). Bill colour not in SNL, so no bill callout.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M190 60 C184 44 158 42 150 62 C134 80 104 106 90 136 C92 146 98 154 106 158 C128 180 162 178 178 152 C192 130 198 104 192 80 C194 74 194 66 190 60 Z",
  "wing": "M152 90 C156 118 136 146 98 152 C106 136 118 110 152 90 Z"
 },
 "layers": [
  {
   "path": "M14 211 C80 205 150 201 268 193",
   "stroke": 4
  },
  {
   "path": "M214 196 l20 -20 M224 186 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 176 q10 -10 18 -2 q-9 8 -18 2 Z M240 189 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "variant": "tail",
   "fill": "tailfill",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "variant": "tail_lines",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M136 172 L139 199 M152 173 L157 198 M131 201 L139 199 L148 202 M149 200 L157 198 L166 201",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "path": "M184 138 C178 126 164 118 150 120 C134 124 120 140 110 156 C130 178 164 176 180 150 Z",
   "fill": "face",
   "stroke": 1,
   "within": "body"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "path": "M150 92 C140 100 128 112 118 126 L128 130 C136 116 144 106 152 99 Z",
   "fill": "face",
   "stroke": 1,
   "within": "wing"
  },
  {
   "eye": [
    177,
    65
   ],
   "pupil": 2.4
  },
  {
   "path": "M177.6 64.4 m-1.2 0 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0",
   "fill": "face"
  },
  {
   "path": "M190 60 L220 66 L193 70 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M193 70 L216 69 L191 79 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M230 52 A16 16 0 0 1 230 76 M237 44 A26 26 0 0 1 237 84 M243 36 A36 36 0 0 1 243 92",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "hatch": {
  "body": {
   "rect": [
    86,
    42,
    200,
    182
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    96,
    88,
    158,
    154
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    192,
    67
   ],
   "deg": -16
  },
  "lower": {
   "at": [
    192,
    72
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    98,
    147
   ],
   "deg": -4
  }
 },
 "variants": {
  "male": {
   "body_pitch": 3,
   "wing_pitch": 3,
   "eye_ring": 0,
   "bill": "ink",
   "tail": "M90 136 L18 204 L30 214 L106 158 Z",
   "tail_lines": "M94 142 L22 207 M98 147 L26 210 M102 153 L29 212",
   "tailfill": "shadow"
  },
  "female": {
   "body_pitch": 3,
   "wing_pitch": 3,
   "eye_ring": 0,
   "bill": "ink",
   "tail": "M90 136 L18 204 L30 214 L106 158 Z",
   "tail_lines": "M94 142 L22 207 M98 147 L26 210 M102 153 L29 212",
   "tailfill": "shadow"
  },
  "juvenile": {
   "body_pitch": 3,
   "wing_pitch": 3,
   "eye_ring": 0,
   "bill": "ink",
   "tail": "M90 136 L50 180 L62 190 L106 158 Z",
   "tail_lines": "M94 142 L53 184 M98 147 L56 187 M102 153 L59 189",
   "tailfill": "face"
  }
 },
 "callouts": [
  {
   "id": "plumage",
   "leader": "M150 146 L72 96",
   "at": [
    70,
    80
   ],
   "align": "right",
   "male": {
    "en": "BLACK AND WHITE",
    "no": "SVART OG HVIT",
    "verified": true
   },
   "female": {
    "en": "BLACK AND WHITE",
    "no": "SVART OG HVIT",
    "verified": true
   },
   "juvenile": {
    "en": "LIKE THE ADULTS",
    "no": "SOM DE VOKSNE",
    "verified": true
   }
  },
  {
   "id": "tail",
   "leader": "M40 200 L30 214",
   "at": [
    10,
    222
   ],
   "align": "left",
   "male": {
    "en": "VERY LONG, GREEN GLOSS",
    "no": "SVÆRT LANG, GRØNN GLANS",
    "verified": true
   },
   "female": {
    "en": "VERY LONG, GREEN GLOSS",
    "no": "SVÆRT LANG, GRØNN GLANS",
    "verified": true
   },
   "juvenile": {
    "en": "SHORTER, NO GLOSS",
    "no": "KORTERE, UTEN GLANS",
    "verified": true
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Adult. Sexes alike; the male is a little larger.",
   "no": "Voksen. Kjønnene er like; hannen er litt større.",
   "verified": true
  },
  "female": {
   "en": "Female. Like the male, a little smaller.",
   "no": "Hunn. Som hannen, litt mindre.",
   "verified": true
  },
  "juvenile": {
   "en": "Juvenile. Shorter tail without gloss.",
   "no": "Ungfugl. Kortere hale uten glans.",
   "verified": true
  }
 }
}
`,wa=`{
 "_note": "Magpie, M11 batch 1. Verified (birds.md, SNL): hoarse, rasping sounds; the song is a low, slightly chattering creak; call «sjakk-sjakk-sjakk», chattering; alarm a fast staccato «tsje-tsje-tsje», very intense at a cat. Shapes, pitches and timings are sound design guesses: the song is a loose run of low rough creaks and chatters around 1 to 2,5 kHz; the call a run of 3 to 7 harsh 'sjakk' notes about 7 a second; the alarm a faster, longer rattle of shorter notes.",
 "syllables": {
  "creak": {
   "dur_ms": 160,
   "pitch": [
    [
     0,
     1100
    ],
    [
     0.4,
     1500
    ],
    [
     1,
     1200
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.7,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.5,
   "rough": 16,
   "tension": -6
  },
  "creak2": {
   "dur_ms": 120,
   "pitch": [
    [
     0,
     1300
    ],
    [
     0.5,
     1050
    ],
    [
     1,
     1150
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.7,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.5,
   "rough": 18,
   "tension": -8
  },
  "chit": {
   "dur_ms": 60,
   "pitch": [
    [
     0,
     2200
    ],
    [
     0.4,
     2500
    ],
    [
     1,
     2000
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.42,
   "rough": 10
  },
  "babble": {
   "dur_ms": 90,
   "pitch": [
    [
     0,
     1700
    ],
    [
     0.3,
     2100
    ],
    [
     0.6,
     1800
    ],
    [
     1,
     1900
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.42,
   "rough": 8,
   "tension": -10
  },
  "sjakk": {
   "dur_ms": 85,
   "pitch": [
    [
     0,
     1500
    ],
    [
     0.25,
     2100
    ],
    [
     1,
     1700
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.5,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.55,
   "rough": 30
  },
  "tsje": {
   "dur_ms": 60,
   "pitch": [
    [
     0,
     1800
    ],
    [
     0.3,
     2300
    ],
    [
     1,
     1900
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.5,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.5,
   "rough": 32
  }
 },
 "types": {
  "song": {
   "pause_s": [
    2.0,
    6.0
   ],
   "length_s": [
    1.5,
    3.5
   ],
   "transpose_st": 0.8,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     14,
     22
    ],
    "vo_tension": [
     52,
     64
    ],
    "vo_rough": [
     40,
     52
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 3,
     "sections": [
      {
       "pool": [
        "creak",
        "creak2",
        "chit",
        "babble"
       ],
       "count": [
        6,
        16
       ],
       "share": 1.0,
       "gap_ms": [
        40,
        140
       ],
       "no_adjacent_repeat": true
      }
     ]
    },
    {
     "weight": 2,
     "sections": [
      {
       "pool": [
        "creak",
        "creak2"
       ],
       "count": [
        2,
        4
       ],
       "share": 0.4,
       "gap_ms": [
        90,
        180
       ]
      },
      {
       "pool": [
        "babble",
        "chit"
       ],
       "count": [
        5,
        12
       ],
       "share": 0.6,
       "gap_ms": [
        30,
        80
       ]
      }
     ]
    }
   ],
   "overrides": []
  },
  "call": {
   "pause_s": [
    2.0,
    7.0
   ],
   "length_s": [
    0.4,
    1.2
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     16,
     22
    ],
    "vo_tension": [
     58,
     68
    ],
    "vo_rough": [
     50,
     62
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "sjakk"
       ],
       "count": [
        3,
        7
       ],
       "share": 1.0,
       "gap_ms": [
        55,
        90
       ]
      }
     ]
    }
   ],
   "overrides": []
  },
  "alarm": {
   "pause_s": [
    0.8,
    3.0
   ],
   "length_s": [
    0.8,
    2.4
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     16,
     22
    ],
    "vo_tension": [
     60,
     72
    ],
    "vo_rough": [
     54,
     66
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "tsje"
       ],
       "count": [
        8,
        22
       ],
       "share": 1.0,
       "gap_ms": [
        25,
        45
       ]
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,La=`{
  "_note": "Sound design starting values for the magpie, M11 batch 1. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 1800,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 18,
    "vo_tension": 58,
    "vo_trill": 0,
    "vo_rough": 46,
    "ph_tempo": 100,
    "ph_pause": 3.0,
    "ph_length": 2.4,
    "ph_variation": 55,
    "su_distance": 15,
    "su_wind": 1.5,
    "su_space": 40
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}
`,Ma=`{
 "_note": "Field guide text for this bird, both languages. Facts come from birds.md (M11 batch 1, SNL). A field with verified false is not shown as a fact: empty means not described, and the text says what the sources leave out. Norwegian wording is mine, Eirik to check. calendar rows: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/sturnus-vulgaris",
 "facts": {
  "length": {
   "en": "About 22 cm, short tail",
   "no": "Omtrent 22 cm, kort hale",
   "verified": true
  },
  "broods": {
   "en": "Often 2",
   "no": "Ofte 2",
   "verified": true
  },
  "range": {
   "en": "Every county, most on the coast north to Troms",
   "no": "Alle fylker, flest langs kysten nord til Troms",
   "verified": true
  },
  "habitat": {
   "en": "Near people and farmland; nests in cavities and boxes",
   "no": "Nær folk og kulturlandskap; hekker i hulrom og kasser",
   "verified": true
  },
  "food": {
   "en": "Worms, snails, insects, seeds, fruit, berries",
   "no": "Meitemark, snegler, insekter, frø, frukt, bær",
   "verified": true
  },
  "status": {
   "en": "NT, near threatened, Norwegian red list",
   "no": "NT, nær truet, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "In cavities, buildings and nest boxes, 3 to 7 eggs",
   "no": "I hulrom, bygninger og fuglekasser, 3 til 7 egg",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "",
   "no": "",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "A very good mimic: the song often holds songs and sounds of many other birds, and whistles, sirens and other man-made signal sounds. The sources do not say how the song is built.",
  "no": "En svært god hermer: sangen inneholder ofte sang og lyder fra mange andre fugler, og plystring, sirener og andre menneskeskapte signallyder. Kildene sier ikke hvordan sangen er bygd opp.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "Whistles, clicks and rattles. A stand-in: Pipp does not mimic other birds.",
   "no": "Plystring, klikk og skrall. En stedfortreder: Pipp hermer ikke andre fugler.",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "parts": {},
 "calendar": {
  "present": "????????????",
  "sings": "????????????",
  "note": {
   "en": "Mostly a migrant; most Norwegian birds winter in Britain, some stay. The sources do not say when it comes and leaves, or give its singing months.",
   "no": "For det meste trekkfugl; de fleste norske overvintrer på De britiske øyer, noen blir. Kildene sier ikke når den kommer og drar, og oppgir ikke månedene med sang.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "id": "svarttrost",
   "text": {
    "en": "Both have yellow bills. The starling has a short tail and walks; the blackbird has a long tail and mostly hops.",
    "no": "Begge har gult nebb. Stæren har kort hale og går; svarttrosten har lang hale og hopper mest.",
    "verified": true
   }
  }
 ]
}
`,xa=`{
 "_note": "Starling ink plate in a 280x240 box, drawn in M11 from the song thrush plate, not from a design: shorter tail, glossy black in summer plumage as dense hatching, yellow bill (face). SNL describes adults, not sexes, so the female is drawn as the male. The juvenile is plain brown in autumn (SNL), light hatching and a dark bill (bill colour [TO VERIFY]). Winter spots are not drawn.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M190 60 C184 44 158 42 150 62 C134 80 104 106 90 136 C92 146 98 154 106 158 C128 180 162 178 178 152 C192 130 198 104 192 80 C194 74 194 66 190 60 Z",
  "wing": "M152 90 C156 118 136 146 98 152 C106 136 118 110 152 90 Z"
 },
 "layers": [
  {
   "path": "M14 211 C80 205 150 201 268 193",
   "stroke": 4
  },
  {
   "path": "M214 196 l20 -20 M224 186 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 176 q10 -10 18 -2 q-9 8 -18 2 Z M240 189 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M90 136 L66 168 L78 178 L106 158 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M94 142 L69 172 M98 147 L72 175 M102 153 L75 177",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M136 172 L139 199 M152 173 L157 198 M131 201 L139 199 L148 202 M149 200 L157 198 L166 201",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "eye": [
    177,
    65
   ],
   "pupil": 2.4
  },
  {
   "path": "M177.6 64.4 m-1.2 0 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0",
   "fill": "face"
  },
  {
   "path": "M189 60 L224 66 L193 70 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M193 70 L219 69 L191 77 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M230 52 A16 16 0 0 1 230 76 M237 44 A26 26 0 0 1 237 84 M243 36 A36 36 0 0 1 243 92",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "hatch": {
  "body": {
   "rect": [
    86,
    42,
    200,
    182
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    96,
    88,
    158,
    154
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    192,
    67
   ],
   "deg": -16
  },
  "lower": {
   "at": [
    192,
    72
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    98,
    147
   ],
   "deg": -5
  }
 },
 "variants": {
  "male": {
   "body_pitch": 3,
   "wing_pitch": 3,
   "eye_ring": 0,
   "bill": "face"
  },
  "female": {
   "body_pitch": 3,
   "wing_pitch": 3,
   "eye_ring": 0,
   "bill": "face"
  },
  "juvenile": {
   "body_pitch": 8,
   "wing_pitch": 6,
   "eye_ring": 0,
   "bill": "shadow"
  }
 },
 "callouts": [
  {
   "id": "bill",
   "leader": "M204 58 L204 23",
   "at": [
    204,
    10
   ],
   "align": "centre",
   "male": {
    "en": "YELLOW",
    "no": "GUL",
    "verified": true
   },
   "female": {
    "en": "YELLOW",
    "no": "GUL",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M120 112 L72 86",
   "at": [
    70,
    80
   ],
   "align": "right",
   "male": {
    "en": "GLOSSY BLACK",
    "no": "GLANSENDE SVART",
    "verified": true
   },
   "female": {
    "en": "GLOSSY BLACK",
    "no": "GLANSENDE SVART",
    "verified": true
   },
   "juvenile": {
    "en": "PLAIN BROWN",
    "no": "ENSFARGET BRUN",
    "verified": true
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Adult in summer. In winter heavily white-spotted.",
   "no": "Voksen om sommeren. Om vinteren tett hvitprikket.",
   "verified": true
  },
  "female": {
   "en": "Adult in summer. In winter heavily white-spotted.",
   "no": "Voksen om sommeren. Om vinteren tett hvitprikket.",
   "verified": true
  },
  "juvenile": {
   "en": "Juvenile in autumn: plain brown.",
   "no": "Ungfugl om høsten: ensfarget brun.",
   "verified": true
  }
 }
}
`,Sa=`{
 "_note": "Starling, M11 batch 1. Verified (birds.md, SNL): a very good mimic, its song often holding other birds' songs and sounds and whistles, sirens and other man-made signals. Pipp does not mimic (MIMICS dropped for version 1), so the whole song is a stand-in guess: a long varied run of clear falling and rising whistles, dry clicks, a creaky rattle and short squeaks, 2 to 4 kHz with whistles up to 6 kHz, no element repeated back to back. No call type: SNL describes none.",
 "syllables": {
  "whfall": {
   "dur_ms": 420,
   "pitch": [
    [
     0,
     5200
    ],
    [
     0.3,
     4800
    ],
    [
     1,
     2400
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.25,
     1
    ],
    [
     0.7,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.55,
   "rough": -12,
   "tension": -18,
   "breath": -6
  },
  "whrise": {
   "dur_ms": 380,
   "pitch": [
    [
     0,
     2600
    ],
    [
     0.7,
     4600
    ],
    [
     1,
     4900
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.25,
     1
    ],
    [
     0.7,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.55,
   "rough": -12,
   "tension": -18,
   "breath": -6
  },
  "wolf": {
   "dur_ms": 700,
   "pitch": [
    [
     0,
     2600
    ],
    [
     0.25,
     4200
    ],
    [
     0.35,
     4300
    ],
    [
     0.43,
     2400
    ],
    [
     0.7,
     4600
    ],
    [
     1,
     2300
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.35,
     0.8
    ],
    [
     0.4,
     0
    ],
    [
     0.45,
     0
    ],
    [
     0.55,
     1
    ],
    [
     0.9,
     0.6
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.5,
   "rough": -12,
   "tension": -18
  },
  "click": {
   "dur_ms": 25,
   "pitch": [
    [
     0,
     3800
    ],
    [
     1,
     3000
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.2,
     1
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.4,
   "rough": 30,
   "tension": 20
  },
  "rattle": {
   "dur_ms": 500,
   "pitch": [
    [
     0,
     2900
    ],
    [
     1,
     2600
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     0.9
    ],
    [
     0.8,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.45,
   "rough": 26,
   "trill": {
    "hz": 40,
    "depth_st": 1.5,
    "am": 0.7
   }
  },
  "squeak": {
   "dur_ms": 140,
   "pitch": [
    [
     0,
     3600
    ],
    [
     0.5,
     4400
    ],
    [
     1,
     3800
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.45,
   "rough": 8
  },
  "creak": {
   "dur_ms": 260,
   "pitch": [
    [
     0,
     1600
    ],
    [
     0.5,
     2000
    ],
    [
     1,
     1500
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     0.7,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.4,
   "rough": 34,
   "tension": -6
  }
 },
 "types": {
  "song": {
   "pause_s": [
    0.6,
    3.0
   ],
   "length_s": [
    3.0,
    8.0
   ],
   "transpose_st": 1.5,
   "avoid_repeat": true,
   "auto": {
    "vo_pitch": [
     0.95,
     1.05
    ],
    "vo_breath": [
     14,
     24
    ],
    "vo_tension": [
     44,
     60
    ],
    "vo_rough": [
     14,
     30
    ],
    "ph_tempo": [
     90,
     110
    ]
   },
   "phrases": [
    {
     "weight": 2,
     "sections": [
      {
       "pool": [
        "whfall",
        "whrise",
        "wolf",
        "squeak"
       ],
       "count": [
        2,
        5
       ],
       "share": 0.4,
       "gap_ms": [
        120,
        300
       ],
       "no_adjacent_repeat": true
      },
      {
       "pool": [
        "click",
        "rattle",
        "creak",
        "squeak"
       ],
       "count": [
        4,
        12
       ],
       "share": 0.6,
       "gap_ms": [
        40,
        160
       ],
       "no_adjacent_repeat": true
      }
     ]
    },
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "click",
        "squeak",
        "creak"
       ],
       "count": [
        3,
        8
       ],
       "share": 0.4,
       "gap_ms": [
        40,
        120
       ],
       "no_adjacent_repeat": true
      },
      {
       "pool": [
        "wolf",
        "whfall",
        "rattle"
       ],
       "count": [
        2,
        4
       ],
       "share": 0.6,
       "gap_ms": [
        150,
        350
       ],
       "no_adjacent_repeat": true
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,Ea=`{
  "_note": "Sound design starting values for the starling, M11 batch 1. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 3200,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 18,
    "vo_tension": 52,
    "vo_trill": 0,
    "vo_rough": 22,
    "ph_tempo": 100,
    "ph_pause": 2.0,
    "ph_length": 4.0,
    "ph_variation": 85,
    "su_distance": 12,
    "su_wind": 1.5,
    "su_space": 40
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}
`,Ca=`{
 "_note": "Field guide text for the mallard, both languages. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/anas-platyrhynchos",
 "facts": {
  "length": {
   "en": "50 to 60 cm, 800 to 1400 g",
   "no": "50 til 60 cm, 800 til 1400 g",
   "verified": true
  },
  "broods": {
   "en": "7 to 13 eggs, the female alone sits 28 to 29 days",
   "no": "7 til 13 egg, hunnen ruger alene i 28 til 29 dager",
   "verified": true
  },
  "range": {
   "en": "Very common in the whole country; more than 50 000 pairs (2015)",
   "no": "Svært vanlig i hele landet; mer enn 50 000 par (2015)",
   "verified": true
  },
  "habitat": {
   "en": "Gardens, parks, farmland and wetlands up to the tree line",
   "no": "Hager, parker, kulturlandskap og våtmark opp til tregrensen",
   "verified": true
  },
  "food": {
   "en": "Mainly plants, seeds and berries; at times many small animals",
   "no": "Mest planter, frø og bær; i perioder mange smådyr",
   "verified": true
  },
  "status": {
   "en": "LC, least concern, Norwegian red list",
   "no": "LC, livskraftig, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "On the ground, well hidden, lined with feathers and down",
   "no": "På bakken, godt skjult, fôret med fjær og dun",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "«væph, væph, væph»",
   "no": "«væph, væph, væph»",
   "verified": true
  },
  "female": {
   "en": "«kvæh-kvæh-kvah-kvah-kvah»",
   "no": "«kvæh-kvæh-kvah-kvah-kvah»",
   "verified": true
  }
 },
 "song_notes": {
  "en": "Often noisy, and the sexes sound clearly different. The male has a nasal chatter and a repeated “væph, væph, væph”; the female is usually louder, stressed at the start: “kvæh-kvæh-kvah-kvah-kvah”. The sources give no pitch or timing, so Pipp's version is a stand-in.",
  "no": "Ofte lydelig, og kjønnene låter tydelig ulikt. Hannen har en nasal, småpratende lyd og et gjentatt «væph, væph, væph»; hunnen er som regel kraftigere, med trykk i starten: «kvæh-kvæh-kvah-kvah-kvah». Kildene gir ingen tonehøyde eller tempo, så Pipps versjon er en stedfortreder.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "Male: nasal chatter and “væph, væph, væph”. Female: “kvæh-kvæh-kvah-kvah-kvah”.",
   "no": "Hann: nasal småprat og «væph, væph, væph». Hunn: «kvæh-kvæh-kvah-kvah-kvah».",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "????????????",
  "note": {
   "en": "Resident over much of Europe and hardy; many Norwegian birds winter in Central Europe, many stay on the coast and in fjords.",
   "no": "Standfugl i store deler av Europa og hardfør; mange norske fugler overvintrer i Mellom-Europa, mange blir langs kysten og i fjordene.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "name": {
    "en": "Other dabbling ducks",
    "no": "Andre gressender"
   },
   "text": {
    "en": "The blue speculum with white edges, the same in both sexes, sets the mallard apart.",
    "no": "Det blå vingespeilet med hvite kanter, likt hos begge kjønn, skiller stokkanda fra dem.",
    "verified": true
   }
  }
 ]
}
`,Ta=`{
 "_note": "Mallard ink plate in a 280x240 box, M11 batch 5, built from the eider plate: swimming. Drake: green head (shadow), white neck ring, rust-brown breast (shadow), light body, black rear (ink), yellow bill. Female: brown-mottled (dense hatching), orange and black bill (shadow). Both: blue speculum with white edges (shadow patch on the wing). Eclipse and juvenile are not drawn; the juvenile is drawn like the female, [TO VERIFY] (birds.md, SNL).",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M210 92 C210 76 198 66 184 66 C170 66 162 76 162 88 L160 104 C130 104 90 110 66 124 C60 130 64 140 76 146 C100 160 150 166 190 158 C206 152 214 138 210 120 C208 110 206 100 210 92 Z",
  "wing": "M184 112 C150 108 110 112 80 124 C110 132 152 134 186 126 Z"
 },
 "hatch": {
  "body": {
   "rect": [
    58,
    62,
    216,
    166
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    78,
    104,
    188,
    136
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    208,
    90
   ],
   "deg": -8
  },
  "lower": {
   "at": [
    208,
    96
   ],
   "deg": 6
  },
  "tail": {
   "at": [
    66,
    126
   ],
   "deg": -4
  }
 },
 "layers": [
  {
   "path": "M66 124 L46 118 L48 130 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "variant": "rear",
   "fill": "ink",
   "within": "body"
  },
  {
   "variant": "breast",
   "fill": "shadow",
   "within": "body"
  },
  {
   "variant": "hood",
   "fill": "shadow",
   "within": "body"
  },
  {
   "variant": "ring",
   "fill": "face",
   "stroke": 1,
   "within": "body"
  },
  {
   "clip": "wing",
   "fill": "face"
  },
  {
   "hatch": "wing"
  },
  {
   "path": "M146 117 L176 114 L178 122 L148 125 Z",
   "fill": "shadow",
   "stroke": 1,
   "within": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.2
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    190,
    80
   ],
   "pupil": 2.4
  },
  {
   "path": "M208 86 L234 92 C238 94 236 98 232 98 L208 95 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M208 95 L231 98 L229 101 L207 99 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M12 160 C60 154 110 162 160 158 C200 155 236 160 270 156",
   "fill": "none",
   "stroke": 2
  },
  {
   "path": "M30 172 q12 -4 24 0 M90 176 q12 -4 24 0 M170 172 q12 -4 24 0 M230 176 q10 -3 20 0",
   "stroke": 1
  },
  {
   "path": "M246 84 A16 16 0 0 1 246 112 M253 76 A26 26 0 0 1 253 120",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "variants": {
  "male": {
   "body_pitch": 0,
   "wing_pitch": 9,
   "eye_ring": 0,
   "bill": "face",
   "hood": "M160 104 L162 88 C162 76 170 66 184 66 C198 66 210 76 210 92 C208 98 206 102 206 106 C190 103 174 103 160 104 Z",
   "ring": "M160 104 C174 103 190 103 206 106 L206 111 C190 108 174 108 160 109 Z",
   "breast": "M206 111 C212 124 210 142 196 152 C186 140 186 124 192 109 Z",
   "rear": "M60 122 C58 132 64 140 76 146 C82 138 82 128 78 120 Z"
  },
  "female": {
   "body_pitch": 4,
   "wing_pitch": 4,
   "eye_ring": 0,
   "bill": "shadow",
   "hood": "",
   "ring": "",
   "breast": "",
   "rear": ""
  },
  "juvenile": {
   "body_pitch": 4,
   "wing_pitch": 4,
   "eye_ring": 0,
   "bill": "shadow",
   "hood": "",
   "ring": "",
   "breast": "",
   "rear": ""
  }
 },
 "callouts": [
  {
   "id": "head",
   "leader": "M176 70 L130 34",
   "at": [
    128,
    28
   ],
   "align": "right",
   "male": {
    "en": "GREEN, WHITE NECK RING",
    "no": "GRØNT, HVIT HALSRING",
    "verified": true
   },
   "female": {
    "en": "BROWN-MOTTLED",
    "no": "BRUNSPRAGLETE",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "bill",
   "leader": "M226 96 L226 44",
   "at": [
    226,
    31
   ],
   "align": "centre",
   "male": {
    "en": "YELLOW",
    "no": "GULT",
    "verified": true
   },
   "female": {
    "en": "ORANGE AND BLACK",
    "no": "ORANSJE OG SVART",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "breast",
   "leader": "M206 132 L240 184",
   "at": [
    242,
    198
   ],
   "align": "centre",
   "male": {
    "en": "RUST-BROWN",
    "no": "RUSTBRUNT",
    "verified": true
   },
   "female": {
    "en": "",
    "no": "",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "wing",
   "leader": "M160 120 L110 198",
   "at": [
    100,
    210
   ],
   "align": "centre",
   "male": {
    "en": "BLUE SPECULUM, WHITE EDGES",
    "no": "BLÅTT SPEIL, HVITE KANTER",
    "verified": true
   },
   "female": {
    "en": "BLUE SPECULUM, WHITE EDGES",
    "no": "BLÅTT SPEIL, HVITE KANTER",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Drake in breeding plumage. Orange feet.",
   "no": "Hann i prakt. Oransje føtter.",
   "verified": true
  },
  "female": {
   "en": "Female. Brown-mottled, good camouflage.",
   "no": "Hunn. Brunspraglete, godt kamuflert.",
   "verified": true
  },
  "juvenile": {
   "en": "Young bird. Not described in the sources, so drawn like the female.",
   "no": "Ungfugl. Ikke beskrevet i kildene, så tegnet som hunnen.",
   "verified": false
  }
 }
}
`,Na=`{
 "_note": "Mallard, M11 batch 5. Verified by SNL: the male's nasal chatter and repeated «væph, væph, væph»; the female's louder «kvæh-kvæh-kvah-kvah-kvah», stressed at the start. Pitches, lengths and timing are sound design guesses. The quack is the syrinx with high roughness and low tension, no new source.",
 "syllables": {
  "vaeph": {
   "dur_ms": 190,
   "pitch": [
    [
     0,
     500
    ],
    [
     0.3,
     590
    ],
    [
     1,
     470
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8,
   "rough": 50,
   "tension": -10
  },
  "vaeph2": {
   "dur_ms": 170,
   "pitch": [
    [
     0,
     520
    ],
    [
     0.3,
     600
    ],
    [
     1,
     480
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75,
   "rough": 50,
   "tension": -10
  },
  "rab": {
   "dur_ms": 60,
   "pitch": [
    [
     0,
     470
    ],
    [
     1,
     430
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     1
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.65,
   "rough": 55,
   "tension": -10
  },
  "kvaeh": {
   "dur_ms": 260,
   "pitch": [
    [
     0,
     680
    ],
    [
     0.25,
     780
    ],
    [
     0.6,
     720
    ],
    [
     1,
     600
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 1.0,
   "rough": 60,
   "tension": -8
  },
  "kvah": {
   "dur_ms": 180,
   "pitch": [
    [
     0,
     640
    ],
    [
     0.3,
     690
    ],
    [
     1,
     540
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8,
   "rough": 60,
   "tension": -8
  },
  "kvah2": {
   "dur_ms": 170,
   "pitch": [
    [
     0,
     600
    ],
    [
     0.3,
     650
    ],
    [
     1,
     510
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "rough": 60,
   "tension": -8
  }
 },
 "types": {
  "song": {
   "pause_s": [
    2.5,
    8.0
   ],
   "length_s": [
    0.8,
    2.4
   ],
   "transpose_st": 0.6,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     24,
     36
    ],
    "vo_tension": [
     10,
     20
    ],
    "vo_rough": [
     40,
     52
    ],
    "ph_tempo": [
     96,
     104
    ]
   },
   "phrases": [
    {
     "weight": 2,
     "sex": "male",
     "sections": [
      {
       "pool": [
        "vaeph",
        "vaeph2"
       ],
       "count": [
        2,
        5
       ],
       "share": 1.0,
       "gap_ms": [
        260,
        460
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 1,
     "sex": "male",
     "sections": [
      {
       "pool": [
        "rab"
       ],
       "count": [
        4,
        10
       ],
       "share": 1.0,
       "gap_ms": [
        40,
        90
       ],
       "no_adjacent_repeat": false
      }
     ]
    },
    {
     "weight": 1,
     "sex": "female",
     "sections": [
      {
       "pool": [
        "kvaeh"
       ],
       "count": [
        1,
        2
       ],
       "share": 0.35,
       "gap_ms": [
        90,
        140
       ],
       "no_adjacent_repeat": false
      },
      {
       "pool": [
        "kvah",
        "kvah2"
       ],
       "count": [
        3,
        6
       ],
       "share": 0.65,
       "gap_ms": [
        90,
        150
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,Ra=`{
 "_note": "Sound design starting values for the mallard, M11 batch 5. Not bird facts.",
 "pitch_ref_hz": 600,
 "base": {
  "vo_pitch": 1.0,
  "vo_breath": 30,
  "vo_tension": 15,
  "vo_trill": 0,
  "vo_rough": 46,
  "ph_tempo": 100,
  "ph_pause": 4.0,
  "ph_length": 1.6,
  "ph_variation": 50,
  "su_distance": 25,
  "su_wind": 1.5,
  "su_space": 35
 },
 "ranges": {
  "vo_pitch": [
   0.5,
   2.0
  ],
  "vo_breath": [
   0,
   100
  ],
  "vo_tension": [
   0,
   100
  ],
  "vo_trill": [
   0,
   40
  ],
  "vo_rough": [
   0,
   100
  ],
  "ph_tempo": [
   50,
   200
  ],
  "ph_pause": [
   0.2,
   20
  ],
  "ph_length": [
   0.2,
   8
  ],
  "ph_variation": [
   0,
   100
  ],
  "su_distance": [
   1,
   200
  ],
  "su_wind": [
   0,
   15
  ],
  "su_space": [
   0,
   100
  ]
 }
}
`,Aa=`{
 "_note": "Field guide text for the black-throated diver, both languages. SNL describes no sounds, so every sound text is [TO VERIFY]. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/gavia-arctica",
 "facts": {
  "length": {
   "en": "Up to 68 cm, 2,5 to 3,5 kg",
   "no": "Opptil 68 cm, 2,5 til 3,5 kg",
   "verified": true
  },
  "broods": {
   "en": "2 eggs, both sit 28 to 30 days",
   "no": "2 egg, begge ruger i 28 til 30 dager",
   "verified": true
  },
  "range": {
   "en": "Most of the country",
   "no": "Det meste av landet",
   "verified": true
  },
  "habitat": {
   "en": "Fresh water",
   "no": "Ferskvann",
   "verified": true
  },
  "food": {
   "en": "Fish",
   "no": "Fisk",
   "verified": true
  },
  "status": {
   "en": "LC, least concern, Norwegian red list",
   "no": "LC, livskraftig, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "At the water's edge, often on a small islet",
   "no": "Ved vannkanten, ofte på en liten holme",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "",
   "no": "",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "SNL describes no sounds of the black-throated diver. Pipp plays a long wail here as a stand-in. Grey-black above with white cross stripes and spots, and a black throat patch.",
  "no": "SNL beskriver ingen lyder fra storlommen. Pipp spiller et langt hyl her som stedfortreder. Gråsvart overside med hvite tverrstriper og flekker, og svart strupeflekk.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "",
   "no": "",
   "verified": false
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "????????????",
  "note": {
   "en": "Partial migrant: some winter on the coast of southern Norway, others go south to Biscay.",
   "no": "Delvis trekkfugl: noen overvintrer langs kysten av Sør-Norge, andre trekker sør til Biscaya.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "name": {
    "en": "Red-throated diver",
    "no": "Smålom"
   },
   "text": {
    "en": "The black-throated diver is told by its black throat patch.",
    "no": "Storlommen kjennes på den svarte strupeflekken.",
    "verified": true
   }
  }
 ]
}
`,ja=`{
 "_note": "Black-throated diver ink plate in a 280x240 box, M11 batch 5, built from the eider plate: swimming low. Grey-black above (dense hatching) with white cross stripes and spots (face), black throat patch (ink) (birds.md, SNL). Bill shape, head, winter plumage and juvenile are not described; the bill is drawn as a pointed dagger, [TO VERIFY].",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M210 92 C210 76 198 66 184 66 C170 66 162 76 162 88 L160 106 C130 108 92 114 66 126 C60 132 64 140 76 146 C100 158 150 162 190 156 C206 150 214 138 210 122 C208 112 206 102 210 92 Z",
  "wing": "M184 112 C150 108 110 112 80 124 C110 132 152 134 186 126 Z"
 },
 "hatch": {
  "body": {
   "rect": [
    58,
    62,
    216,
    166
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    78,
    104,
    188,
    136
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    208,
    90
   ],
   "deg": -8
  },
  "lower": {
   "at": [
    208,
    96
   ],
   "deg": 6
  },
  "tail": {
   "at": [
    66,
    126
   ],
   "deg": -4
  }
 },
 "layers": [
  {
   "path": "M66 126 L50 124 L54 132 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "variant": "spots",
   "fill": "face",
   "within": "body"
  },
  {
   "variant": "throat",
   "fill": "ink",
   "within": "body"
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    190,
    80
   ],
   "pupil": 2.4
  },
  {
   "path": "M208 84 L244 92 L208 94 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M208 94 L240 93 L208 99 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M12 160 C60 154 110 162 160 158 C200 155 236 160 270 156",
   "fill": "none",
   "stroke": 2
  },
  {
   "path": "M30 172 q12 -4 24 0 M90 176 q12 -4 24 0 M170 172 q12 -4 24 0 M230 176 q10 -3 20 0",
   "stroke": 1
  },
  {
   "path": "M252 80 A16 16 0 0 1 252 108 M259 72 A26 26 0 0 1 259 116",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "variants": {
  "male": {
   "body_pitch": 4,
   "wing_pitch": 0,
   "eye_ring": 0,
   "bill": "face",
   "spots": "M80 124 h7 v3 h-7 Z M92 120 h7 v3 h-7 Z M104 117 h7 v3 h-7 Z M116 114 h7 v3 h-7 Z M128 112 h7 v3 h-7 Z M140 111 h7 v3 h-7 Z M152 110 h7 v3 h-7 Z M86 131 h7 v3 h-7 Z M98 127 h7 v3 h-7 Z M110 124 h7 v3 h-7 Z M122 121 h7 v3 h-7 Z M134 119 h7 v3 h-7 Z M146 118 h7 v3 h-7 Z M158 117 h7 v3 h-7 Z",
   "throat": "M200 98 C206 106 208 118 206 128 C200 122 196 110 196 100 Z"
  },
  "female": {
   "body_pitch": 4,
   "wing_pitch": 0,
   "eye_ring": 0,
   "bill": "face",
   "spots": "M80 124 h7 v3 h-7 Z M92 120 h7 v3 h-7 Z M104 117 h7 v3 h-7 Z M116 114 h7 v3 h-7 Z M128 112 h7 v3 h-7 Z M140 111 h7 v3 h-7 Z M152 110 h7 v3 h-7 Z M86 131 h7 v3 h-7 Z M98 127 h7 v3 h-7 Z M110 124 h7 v3 h-7 Z M122 121 h7 v3 h-7 Z M134 119 h7 v3 h-7 Z M146 118 h7 v3 h-7 Z M158 117 h7 v3 h-7 Z",
   "throat": "M200 98 C206 106 208 118 206 128 C200 122 196 110 196 100 Z"
  },
  "juvenile": {
   "body_pitch": 4,
   "wing_pitch": 0,
   "eye_ring": 0,
   "bill": "face",
   "spots": "M80 124 h7 v3 h-7 Z M92 120 h7 v3 h-7 Z M104 117 h7 v3 h-7 Z M116 114 h7 v3 h-7 Z M128 112 h7 v3 h-7 Z M140 111 h7 v3 h-7 Z M152 110 h7 v3 h-7 Z M86 131 h7 v3 h-7 Z M98 127 h7 v3 h-7 Z M110 124 h7 v3 h-7 Z M122 121 h7 v3 h-7 Z M134 119 h7 v3 h-7 Z M146 118 h7 v3 h-7 Z M158 117 h7 v3 h-7 Z",
   "throat": "M200 98 C206 106 208 118 206 128 C200 122 196 110 196 100 Z"
  }
 },
 "callouts": [
  {
   "id": "throat",
   "leader": "M204 116 L238 184",
   "at": [
    240,
    198
   ],
   "align": "centre",
   "male": {
    "en": "BLACK PATCH",
    "no": "SVART FLEKK",
    "verified": true
   },
   "female": {
    "en": "BLACK PATCH",
    "no": "SVART FLEKK",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "bill",
   "leader": "M226 90 L226 44",
   "at": [
    226,
    31
   ],
   "align": "centre",
   "male": {
    "en": "",
    "no": "",
    "verified": false
   },
   "female": {
    "en": "",
    "no": "",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M120 120 L76 198",
   "at": [
    72,
    210
   ],
   "align": "centre",
   "male": {
    "en": "GREY-BLACK, WHITE STRIPES",
    "no": "GRÅSVART, HVITE STRIPER",
    "verified": true
   },
   "female": {
    "en": "GREY-BLACK, WHITE STRIPES",
    "no": "GRÅSVART, HVITE STRIPER",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Adult in summer. Beak and tail follow the sound.",
   "no": "Voksen om sommeren. Nebb og hale følger lyden.",
   "verified": true
  },
  "female": {
   "en": "Female. No difference from the male is known.",
   "no": "Hunn. Ingen kjent forskjell fra hannen.",
   "verified": false
  },
  "juvenile": {
   "en": "Young bird. Not described in the sources, so drawn like the adults.",
   "no": "Ungfugl. Ikke beskrevet i kildene, så tegnet som de voksne.",
   "verified": false
  }
 }
}
`,Ia=`{
 "_note": "Black-throated diver, M11 batch 5. Placeholder: SNL describes no sounds. The song slot holds a long rising and falling wail in a short series; every shape is a sound design guess. Rework once a source is found.",
 "syllables": {
  "wail": {
   "dur_ms": 1500,
   "pitch": [
    [
     0,
     620
    ],
    [
     0.2,
     760
    ],
    [
     0.35,
     1080
    ],
    [
     0.75,
     1100
    ],
    [
     1,
     880
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     0.7
    ],
    [
     0.4,
     1
    ],
    [
     0.85,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.85,
   "tension": 10
  },
  "wail2": {
   "dur_ms": 1200,
   "pitch": [
    [
     0,
     680
    ],
    [
     0.3,
     980
    ],
    [
     0.7,
     1000
    ],
    [
     1,
     820
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     0.7
    ],
    [
     0.4,
     1
    ],
    [
     0.85,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8,
   "tension": 10
  },
  "ko": {
   "dur_ms": 260,
   "pitch": [
    [
     0,
     820
    ],
    [
     0.4,
     900
    ],
    [
     1,
     760
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75
  }
 },
 "types": {
  "song": {
   "pause_s": [
    6.0,
    16.0
   ],
   "length_s": [
    2.4,
    6.0
   ],
   "transpose_st": 1.0,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     20,
     32
    ],
    "vo_tension": [
     56,
     70
    ],
    "vo_rough": [
     2,
     8
    ],
    "ph_tempo": [
     96,
     104
    ]
   },
   "phrases": [
    {
     "weight": 2,
     "sections": [
      {
       "pool": [
        "wail",
        "wail2"
       ],
       "count": [
        1,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        300,
        700
       ]
      }
     ]
    },
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "wail"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.6,
       "gap_ms": [
        300,
        500
       ]
      },
      {
       "pool": [
        "ko"
       ],
       "count": [
        2,
        5
       ],
       "share": 0.4,
       "gap_ms": [
        120,
        220
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,Ba=`{
 "_note": "Sound design starting values for the black-throated diver, M11 batch 5. Not bird facts.",
 "pitch_ref_hz": 900,
 "base": {
  "vo_pitch": 1.0,
  "vo_breath": 26,
  "vo_tension": 62,
  "vo_trill": 0,
  "vo_rough": 5,
  "ph_tempo": 100,
  "ph_pause": 9.0,
  "ph_length": 4.0,
  "ph_variation": 50,
  "su_distance": 80,
  "su_wind": 1.5,
  "su_space": 55
 },
 "ranges": {
  "vo_pitch": [
   0.5,
   2.0
  ],
  "vo_breath": [
   0,
   100
  ],
  "vo_tension": [
   0,
   100
  ],
  "vo_trill": [
   0,
   40
  ],
  "vo_rough": [
   0,
   100
  ],
  "ph_tempo": [
   50,
   200
  ],
  "ph_pause": [
   0.2,
   20
  ],
  "ph_length": [
   0.2,
   8
  ],
  "ph_variation": [
   0,
   100
  ],
  "su_distance": [
   1,
   200
  ],
  "su_wind": [
   0,
   15
  ],
  "su_space": [
   0,
   100
  ]
 }
}
`,Oa=`{
 "_note": "Field guide text for the curlew, both languages. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/numenius-arquata",
 "facts": {
  "length": {
   "en": "50 to 60 cm, bill 10 to 15 cm",
   "no": "50 til 60 cm, nebb 10 til 15 cm",
   "verified": true
  },
  "broods": {
   "en": "Usually 4 eggs, 26 to 30 days",
   "no": "Vanligvis 4 egg, 26 til 30 dager",
   "verified": true
  },
  "range": {
   "en": "Much of the country, most on the coast; 2000 to 3000 pairs",
   "no": "Store deler av landet, mest ved kysten; 2000 til 3000 par",
   "verified": true
  },
  "habitat": {
   "en": "Farmland, heaths, bogs, salt marshes",
   "no": "Dyrket mark, lyngheier, myrer, strandenger",
   "verified": true
  },
  "food": {
   "en": "Worms, insects, crustaceans; berries in summer",
   "no": "Mark, insekter, krepsdyr; bær om sommeren",
   "verified": true
  },
  "status": {
   "en": "EN, endangered, Norwegian red list",
   "no": "EN, sterkt truet, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "Scrape in open ground, lined with dry grass",
   "no": "Grop i åpent terreng, foret med tørt gress",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "",
   "no": "",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "In the display flight, long, clear whistled notes speed up and end in a powerful bubbling sound. The call is powerful and easy to recognise. Slow, calm wingbeats, like a gull at a distance. Halved since around 2000.",
  "no": "I spillflukten går lange, klare fløytetoner raskere og raskere og ender i en kraftig boblende lyd. Lokkelyden er kraftig og lett å kjenne igjen. Rolige vingeslag, som en måke på avstand. Halvert siden rundt 2000.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "Display flight: whistles speeding up into a powerful bubbling.",
   "no": "Spillflukt: fløytetoner som går raskere og ender i kraftig bobling.",
   "verified": true
  },
  "call": {
   "en": "Powerful and easy to recognise. The sources do not describe how it sounds.",
   "no": "Kraftig og lett å kjenne igjen. Kildene beskriver ikke hvordan den låter.",
   "verified": true
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "parts": {
  "whistles": {
   "en": "LONG WHISTLES",
   "no": "LANGE FLØYTETONER",
   "verified": true
  },
  "faster": {
   "en": "SPEEDING UP",
   "no": "RASKERE",
   "verified": true
  },
  "bubbling": {
   "en": "BUBBLING",
   "no": "BOBLING",
   "verified": true
  }
 },
 "calendar": {
  "present": "??yyyyyyy???",
  "sings": "??y?????????",
  "note": {
   "en": "Arrives in March to May. Females leave from late June, males in July and August, the young in August and September. Winters mostly on the coasts of the British Isles. The sources do not give its singing months.",
   "no": "Kommer i mars til mai. Hunnene drar fra slutten av juni, hannene i juli og august, ungene i august og september. Overvintrer mest langs kysten av De britiske øyer. Kildene oppgir ikke sangmånedene.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "name": {
    "en": "Whimbrel",
    "no": "Småspove"
   },
   "text": {
    "en": "Clearly smaller with a shorter bill. Young curlews can have a much shorter bill too.",
    "no": "Tydelig mindre med kortere nebb. Unge storspover kan også ha mye kortere nebb.",
    "verified": true
   }
  }
 ]
}`,Ha=`{
 "_note": "Curlew ink plate in a 280x240 box, drawn in M10, not from a design: standing, grey-brown streaked (hatching and streaks), very long down-curved bill, long blue-grey legs (birds.md, SNL). The female's bill is drawn longer and the juvenile's shorter, as SNL describes.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M178 74 C178 62 168 56 158 58 C148 60 144 68 144 78 C120 86 96 98 76 114 C100 128 124 138 146 140 C166 142 176 130 176 114 C176 100 178 88 178 74 Z",
  "wing": "M150 92 C126 94 100 104 76 114 C60 120 48 124 40 128 C60 130 90 128 116 122 C138 116 150 106 150 92 Z"
 },
 "hatch": {
  "body": {
   "rect": [
    74,
    54,
    180,
    144
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    38,
    88,
    152,
    132
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    176,
    72
   ],
   "deg": -6
  },
  "lower": {
   "at": [
    176,
    76
   ],
   "deg": 4
  },
  "tail": {
   "at": [
    78,
    116
   ],
   "deg": -3
  }
 },
 "layers": [
  {
   "path": "M14 214 C70 206 150 204 268 208",
   "stroke": 2.5
  },
  {
   "path": "M40 214 q8 -5 16 0 M210 210 q8 -4 16 0",
   "stroke": 1
  },
  {
   "path": "M124 138 L118 206 M140 140 L144 206 M108 207 L118 206 L128 208 M134 207 L144 206 L154 208",
   "stroke": 1.5
  },
  {
   "path": "M78 112 L52 118 L56 126 L82 122 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "path": "M150 70 l3 5 M160 80 l2 5 M166 92 l2 5 M158 104 l2 5 M168 112 l2 5 M152 122 l2 5 M162 128 l2 4 M146 90 l2 5",
   "stroke": 1.2,
   "within": "body"
  },
  {
   "clip": "wing",
   "fill": "face"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    164,
    68
   ],
   "pupil": 2.2
  },
  {
   "variant": "upper_bill",
   "fill": "bill",
   "stroke": 1.4,
   "part": "upper"
  },
  {
   "variant": "lower_bill",
   "fill": "bill",
   "stroke": 1.4,
   "part": "lower"
  },
  {
   "path": "M120 40 A14 14 0 0 0 120 66 M113 32 A24 24 0 0 0 113 74",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "variants": {
  "male": {
   "body_pitch": 7,
   "wing_pitch": 6,
   "eye_ring": 0,
   "bill": "shadow",
   "upper_bill": "M176 70 C208 70 228 86 235 107 L234 109 C225 91 206 75 176 75 Z",
   "lower_bill": "M176 75 C206 75 225 91 234 109 L232 109 C221 94 205 78 176 78 Z"
  },
  "female": {
   "body_pitch": 7,
   "wing_pitch": 6,
   "eye_ring": 0,
   "bill": "shadow",
   "upper_bill": "M176 70 C215 70 238 89 247 113 L246 115 C234 94 212 75 176 75 Z",
   "lower_bill": "M176 75 C212 75 234 94 246 115 L244 115 C229 97 210 78 176 78 Z"
  },
  "juvenile": {
   "body_pitch": 7,
   "wing_pitch": 6,
   "eye_ring": 0,
   "bill": "shadow",
   "upper_bill": "M176 70 C198 70 212 82 217 96 L216 98 C210 86 197 75 176 75 Z",
   "lower_bill": "M176 75 C197 75 210 86 216 98 L214 98 C207 89 196 78 176 78 Z"
  }
 },
 "callouts": [
  {
   "id": "bill",
   "leader": "M226 90 L250 60",
   "at": [
    250,
    47
   ],
   "align": "centre",
   "male": {
    "en": "LONG, CURVED",
    "no": "LANGT, BUET",
    "verified": true
   },
   "female": {
    "en": "CLEARLY LONGER",
    "no": "TYDELIG LENGRE",
    "verified": true
   },
   "juvenile": {
    "en": "MUCH SHORTER",
    "no": "MYE KORTERE",
    "verified": true
   }
  },
  {
   "id": "plumage",
   "leader": "M110 104 L78 70",
   "at": [
    74,
    64
   ],
   "align": "right",
   "male": {
    "en": "GREY-BROWN, STREAKED",
    "no": "GRÅBRUN, STRIPETE",
    "verified": true
   },
   "female": {
    "en": "GREY-BROWN, STREAKED",
    "no": "GRÅBRUN, STRIPETE",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Male. Beak and tail follow the sound.",
   "no": "Hann. Nebb og hale følger lyden.",
   "verified": true
  },
  "female": {
   "en": "Female. A little larger, with a clearly longer bill.",
   "no": "Hunn. Litt større, med tydelig lengre nebb.",
   "verified": true
  },
  "juvenile": {
   "en": "Young bird. The bill can be much shorter.",
   "no": "Ungfugl. Nebbet kan være mye kortere.",
   "verified": true
  }
 }
}`,Ga=`{
 "_note": "Curlew, M10. Verified (birds.md, SNL): the display flight starts with long, clear whistled notes that speed up and end in a powerful bubbling sound; the call is powerful and easy to recognise. Sound design choices: the pitches, 3 to 5 long whistles then 3 to 6 shorter, closer ones, and a bubbling trill of 1,5 to 1,8 s; the call's two-part rising whistle is a placeholder, as SNL gives no shape or transcription.",
 "syllables": {
  "long1": {
   "dur_ms": 700,
   "pitch": [
    [
     0,
     1700
    ],
    [
     0.6,
     2300
    ],
    [
     1,
     2350
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     0.9
    ],
    [
     0.7,
     1
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.9
  },
  "long2": {
   "dur_ms": 650,
   "pitch": [
    [
     0,
     1800
    ],
    [
     0.6,
     2400
    ],
    [
     1,
     2400
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     0.9
    ],
    [
     0.7,
     1
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.9
  },
  "long3": {
   "dur_ms": 560,
   "pitch": [
    [
     0,
     1900
    ],
    [
     0.6,
     2450
    ],
    [
     1,
     2450
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     0.9
    ],
    [
     0.7,
     1
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.9
  },
  "mid1": {
   "dur_ms": 380,
   "pitch": [
    [
     0,
     2000
    ],
    [
     0.6,
     2500
    ],
    [
     1,
     2450
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     0.9
    ],
    [
     0.7,
     1
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.9
  },
  "mid2": {
   "dur_ms": 320,
   "pitch": [
    [
     0,
     2100
    ],
    [
     0.6,
     2550
    ],
    [
     1,
     2500
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.15,
     0.9
    ],
    [
     0.7,
     1
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.9
  },
  "bubble": {
   "dur_ms": 1800,
   "pitch": [
    [
     0,
     2600
    ],
    [
     0.3,
     2800
    ],
    [
     0.8,
     2500
    ],
    [
     1,
     2200
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.05,
     1
    ],
    [
     0.8,
     0.9
    ],
    [
     1,
     0
    ]
   ],
   "gain": 1.0,
   "trill": {
    "hz": 17,
    "depth_st": 4,
    "am": 0.85
   }
  },
  "bubble2": {
   "dur_ms": 1500,
   "pitch": [
    [
     0,
     2500
    ],
    [
     0.4,
     2750
    ],
    [
     1,
     2300
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.06,
     1
    ],
    [
     0.8,
     0.9
    ],
    [
     1,
     0
    ]
   ],
   "gain": 1.0,
   "trill": {
    "hz": 15,
    "depth_st": 3.5,
    "am": 0.85
   }
  },
  "kurli": {
   "dur_ms": 520,
   "pitch": [
    [
     0,
     1700
    ],
    [
     0.4,
     1950
    ],
    [
     0.5,
     1950
    ],
    [
     0.6,
     2100
    ],
    [
     1,
     2500
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.42,
     0.8
    ],
    [
     0.48,
     0.2
    ],
    [
     0.56,
     1
    ],
    [
     0.9,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.95
  }
 },
 "types": {
  "song": {
   "pause_s": [
    6.0,
    14.0
   ],
   "length_s": [
    5.0,
    8.0
   ],
   "transpose_st": 0.6,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     10,
     18
    ],
    "vo_tension": [
     14,
     24
    ],
    "vo_rough": [
     2,
     6
    ],
    "ph_tempo": [
     96,
     104
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "part": "whistles",
       "pool": [
        "long1",
        "long2",
        "long3"
       ],
       "count": [
        3,
        5
       ],
       "share": 0.4,
       "gap_ms": [
        260,
        380
       ]
      },
      {
       "part": "faster",
       "pool": [
        "mid1",
        "mid2"
       ],
       "count": [
        3,
        6
       ],
       "share": 0.3,
       "gap_ms": [
        90,
        150
       ]
      },
      {
       "part": "bubbling",
       "pool": [
        "bubble",
        "bubble2"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.3,
       "gap_ms": [
        60,
        100
       ]
      }
     ]
    }
   ],
   "overrides": []
  },
  "call": {
   "pause_s": [
    3.0,
    9.0
   ],
   "length_s": [
    0.6,
    2.0
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     10,
     18
    ],
    "vo_tension": [
     14,
     26
    ],
    "vo_rough": [
     2,
     6
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "kurli"
       ],
       "count": [
        1,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        300,
        600
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}`,Da=`{
  "_note": "Sound design starting values for the curlew, M10. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 2200,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 14,
    "vo_tension": 18,
    "vo_trill": 0,
    "vo_rough": 4,
    "ph_tempo": 100,
    "ph_pause": 8.0,
    "ph_length": 7.0,
    "ph_variation": 50,
    "su_distance": 35,
    "su_wind": 1.5,
    "su_space": 35
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}`,Pa=`{
 "_note": "Field guide text for this bird, both languages. Facts come from birds.md (M11, SNL). A field with verified false is not shown as a fact: empty means not described, and the text says what the sources leave out. Norwegian wording is mine, Eirik to check. calendar rows: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/ficedula-hypoleuca",
 "facts": {
  "length": {
   "en": "About 13 cm",
   "no": "Omtrent 13 cm",
   "verified": true
  },
  "broods": {
   "en": "",
   "no": "",
   "verified": false
  },
  "range": {
   "en": "Large parts of the country",
   "no": "Store deler av landet",
   "verified": true
  },
  "habitat": {
   "en": "Gardens and forest up into the birch belt",
   "no": "Hager og skog opp i bjørkebeltet",
   "verified": true
  },
  "food": {
   "en": "Insects",
   "no": "Insekter",
   "verified": true
  },
  "status": {
   "en": "LC, least concern",
   "no": "LC, livskraftig",
   "verified": true
  },
  "nest": {
   "en": "Tree holes and nest boxes, 4 to 7 eggs",
   "no": "Hull i trær og fuglekasser, 4 til 7 egg",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Sings",
   "no": "Synger",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "A short but loud and rhythmic song of about 2 s, with repetitions and sudden changes of rhythm and pitch.",
  "no": "En kort, men kraftig og rytmisk sang på omtrent 2 sekunder, med gjentakelser og brå skifter i rytme og tonehøyde.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "Short, loud, rhythmic, about 2 s, sudden changes.",
   "no": "Kort, kraftig, rytmisk, omtrent 2 s, brå skifter.",
   "verified": true
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "parts": {},
 "calendar": {
  "present": "????yyy?????",
  "sings": "????????????",
  "note": {
   "en": "Migrant, winters in Africa south of the Sahara; returns around the turn of April and May. The sources do not say when it leaves, or give its singing months.",
   "no": "Trekkfugl, overvintrer i Afrika sør for Sahara; kommer rundt overgangen april–mai. Kildene sier ikke når den drar, og oppgir ikke månedene med sang.",
   "verified": true
  }
 },
 "lookalikes": []
}
`,za=`{
 "_note": "Pied flycatcher ink plate in a 280x240 box, drawn in M11 from the great tit plate, not from a design. Male: black above (dense hatching), white below and a white wing patch (face). Female: grey-brown above (light hatching), white below (SNL). Some males are brown like the female (SNL); the caption says so. The juvenile is not described and is drawn as the female with [TO VERIFY].",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M198 70 C196 56 180 50 166 56 C152 62 142 76 132 92 C120 110 110 130 108 150 C110 160 118 168 126 172 C146 182 170 174 180 156 C192 136 199 108 199 90 C200 86 201 82 200 80 Z",
  "wing": "M156 92 C164 118 148 148 112 160 C118 138 130 110 156 92 Z"
 },
 "layers": [
  {
   "path": "M14 206 C80 202 150 199 268 194",
   "stroke": 4
  },
  {
   "path": "M214 197 l20 -20 M224 187 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 177 q10 -10 18 -2 q-9 8 -18 2 Z M240 190 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M114 146 L62 204 L74 214 L126 166 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M118 152 L66 207 M122 159 L70 211",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M142 176 L144 199 M156 175 L159 198 M136 201 L144 199 L152 201 M151 199 L159 198 L167 200",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "path": "M200 82 C194 86 186 86 180 84 C172 90 166 100 163 112 C160 128 162 144 170 156 C158 168 142 174 124 172 L124 186 L216 186 L216 78 Z",
   "fill": "face",
   "stroke": 1,
   "within": "body"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "path": "M126 101 L163 123 L161 128 L124 106 Z",
   "fill": "face",
   "stroke": 1,
   "within": "wing"
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    182,
    68
   ],
   "pupil": 2.4
  },
  {
   "path": "M182.4 66.8 m-0.9 0 a0.9 0.9 0 1 0 1.8 0 a0.9 0.9 0 1 0 -1.8 0",
   "fill": "face"
  },
  {
   "path": "M198 70 L214 76 L200 78 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M200 78 L213 78 L200 82 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M226 64 A14 14 0 0 1 226 88 M233 56 A24 24 0 0 1 233 96 M240 48 A34 34 0 0 1 240 104",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "hatch": {
  "body": {
   "rect": [
    104,
    50,
    204,
    184
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    108,
    88,
    166,
    164
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    200,
    74
   ],
   "deg": -14
  },
  "lower": {
   "at": [
    200,
    79
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    120,
    156
   ],
   "deg": -5
  }
 },
 "variants": {
  "male": {
   "body_pitch": 3,
   "wing_pitch": 3,
   "eye_ring": 0,
   "bill": "shadow"
  },
  "female": {
   "body_pitch": 8,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow"
  },
  "juvenile": {
   "body_pitch": 8,
   "wing_pitch": 5,
   "eye_ring": 0,
   "bill": "shadow"
  }
 },
 "callouts": [
  {
   "id": "plumage",
   "leader": "M150 80 L122 36",
   "at": [
    120,
    30
   ],
   "align": "right",
   "male": {
    "en": "BLACK AND WHITE",
    "no": "SVART OG HVIT",
    "verified": true
   },
   "female": {
    "en": "GREY-BROWN ABOVE",
    "no": "GRÅBRUN OVERSIDE",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "breast",
   "leader": "M186 146 L232 212",
   "at": [
    276,
    224
   ],
   "align": "right",
   "male": {
    "en": "WHITE",
    "no": "HVIT",
    "verified": true
   },
   "female": {
    "en": "WHITE",
    "no": "HVIT",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Male. Black and white; some males are brown like the female.",
   "no": "Hann. Svart og hvit; noen hanner er brune som hunnen.",
   "verified": true
  },
  "female": {
   "en": "Female. Grey-brown above, white below.",
   "no": "Hunn. Gråbrun overside, hvit underside.",
   "verified": true
  },
  "juvenile": {
   "en": "Juvenile. Not described in the sources.",
   "no": "Ungfugl. Ikke beskrevet i kildene.",
   "verified": false
  }
 }
}
`,Za=`{
 "_note": "Pied flycatcher, M11 batch 2. Verified (birds.md, SNL): short but loud and rhythmic, about 2 s, with repetitions and sudden changes of rhythm and pitch. Design: two or three blocks, each repeating one motif 2 to 4 times, the blocks at clearly different pitches and speeds (high two-note motif, lower quicker one, sometimes a high end note). Pitches and motifs are guesses. No call type: SNL describes none.",
 "syllables": {
  "hi": {
   "dur_ms": 150,
   "pitch": [
    [
     0,
     5200
    ],
    [
     0.35,
     5600
    ],
    [
     0.45,
     5600
    ],
    [
     0.5,
     4400
    ],
    [
     1,
     4700
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     1
    ],
    [
     0.4,
     0.8
    ],
    [
     0.47,
     0.15
    ],
    [
     0.55,
     0.9
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75
  },
  "hi2": {
   "dur_ms": 140,
   "pitch": [
    [
     0,
     5800
    ],
    [
     0.4,
     5000
    ],
    [
     0.5,
     5000
    ],
    [
     0.55,
     6000
    ],
    [
     1,
     5600
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     1
    ],
    [
     0.4,
     0.8
    ],
    [
     0.47,
     0.15
    ],
    [
     0.55,
     0.9
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75
  },
  "lo": {
   "dur_ms": 90,
   "pitch": [
    [
     0,
     3600
    ],
    [
     0.5,
     4100
    ],
    [
     1,
     3500
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75
  },
  "lo2": {
   "dur_ms": 80,
   "pitch": [
    [
     0,
     3900
    ],
    [
     1,
     3300
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75
  },
  "end": {
   "dur_ms": 160,
   "pitch": [
    [
     0,
     6200
    ],
    [
     1,
     5400
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.25,
     1
    ],
    [
     0.7,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.6,
   "tension": -8
  }
 },
 "types": {
  "song": {
   "pause_s": [
    3.0,
    8.0
   ],
   "length_s": [
    1.6,
    2.4
   ],
   "transpose_st": 0.8,
   "avoid_repeat": true,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     10,
     18
    ],
    "vo_tension": [
     38,
     50
    ],
    "vo_rough": [
     5,
     11
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "hi"
       ],
       "count": [
        2,
        4
       ],
       "share": 0.5,
       "gap_ms": [
        50,
        80
       ]
      },
      {
       "pool": [
        "lo"
       ],
       "count": [
        2,
        4
       ],
       "share": 0.35,
       "gap_ms": [
        30,
        50
       ],
       "lead_gap_ms": [
        60,
        90
       ]
      },
      {
       "pool": [
        "end"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.15,
       "gap_ms": [
        50,
        50
       ],
       "chance": 0.5
      }
     ]
    },
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "lo2"
       ],
       "count": [
        2,
        4
       ],
       "share": 0.35,
       "gap_ms": [
        30,
        50
       ]
      },
      {
       "pool": [
        "hi2"
       ],
       "count": [
        2,
        3
       ],
       "share": 0.45,
       "gap_ms": [
        50,
        80
       ],
       "lead_gap_ms": [
        60,
        90
       ]
      },
      {
       "pool": [
        "lo"
       ],
       "count": [
        1,
        3
       ],
       "share": 0.2,
       "gap_ms": [
        30,
        50
       ],
       "chance": 0.6
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,Fa=`{
  "_note": "Sound design starting values for the pied flycatcher, M11 batch 2. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 4500,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 14,
    "vo_tension": 44,
    "vo_trill": 0,
    "vo_rough": 8,
    "ph_tempo": 100,
    "ph_pause": 5.0,
    "ph_length": 2.0,
    "ph_variation": 40,
    "su_distance": 15,
    "su_wind": 1.5,
    "su_space": 45
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}
`,Ka=`{
 "_note": "Field guide text for this bird, both languages. Facts come from birds.md (M11, SNL). A field with verified false is not shown as a fact: empty means not described, and the text says what the sources leave out. Norwegian wording is mine, Eirik to check. calendar rows: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/dryocopus-martius",
 "facts": {
  "length": {
   "en": "45 to 48 cm, 250 to 370 g, Europe's largest woodpecker",
   "no": "45 til 48 cm, 250 til 370 g, Europas største hakkespett",
   "verified": true
  },
  "broods": {
   "en": "One",
   "no": "Ett kull",
   "verified": true
  },
  "range": {
   "en": "Østlandet, Sørlandet and Trøndelag; few in the north, rare in the west",
   "no": "Østlandet, Sørlandet og Trøndelag; få i nord, sjelden på Vestlandet",
   "verified": true
  },
  "habitat": {
   "en": "Conifer forest with large trees, stumps and logging debris",
   "no": "Barskog med store trær, stubber og hogstavfall",
   "verified": true
  },
  "food": {
   "en": "Tree-living insects, above all carpenter ants",
   "no": "Insekter i trær, fremfor alt stokkmaur",
   "verified": true
  },
  "status": {
   "en": "LC, least concern",
   "no": "LC, livskraftig",
   "verified": true
  },
  "nest": {
   "en": "An oval hole in a large aspen or pine, 7 to 8 m up, 3 to 6 eggs",
   "no": "Et ovalt hull i en stor osp eller furu, 7 til 8 m opp, 3 til 6 egg",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Drums",
   "no": "Trommer",
   "verified": true
  },
  "female": {
   "en": "Drums now and then",
   "no": "Trommer av og til",
   "verified": true
  }
 },
 "song_notes": {
  "en": "Drumming very powerful, heard up to 4 km: long and even, about 20 strokes in 2 seconds, sometimes slowing a little at the end; stronger and longer than other woodpeckers'. In flight a powerful «kri-kri-kri-kri»; after landing a long, plaintive «kliii-æ»; in spring often «kly-kly-kly-kly». Alarm a hard «krykk krykk krykk».",
  "no": "Trommingen er svært kraftig og høres opptil 4 km: lang og jevn, omtrent 20 slag på 2 sekunder, av og til litt langsommere mot slutten; sterkere og lengre enn hos andre spetter. I flukt et kraftig «kri-kri-kri-kri»; etter landing et langt, klagende «kliii-æ»; om våren ofte «kly-kly-kly-kly». Varsler med et hardt «krykk krykk krykk».",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "Drumming: about 20 strokes in 2 seconds, heard up to 4 km.",
   "no": "Tromming: omtrent 20 slag på 2 sekunder, høres opptil 4 km.",
   "verified": true
  },
  "call": {
   "en": "A long, plaintive «kliii-æ»; in spring «kly-kly-kly-kly».",
   "no": "Et langt, klagende «kliii-æ»; om våren «kly-kly-kly-kly».",
   "verified": true
  },
  "alarm": {
   "en": "A hard «krykk krykk krykk».",
   "no": "Et hardt «krykk krykk krykk».",
   "verified": true
  },
  "flight": {
   "en": "A powerful «kri-kri-kri-kri».",
   "no": "Et kraftig «kri-kri-kri-kri».",
   "verified": true
  }
 },
 "parts": {},
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "yyyyyy??yyyy",
  "note": {
   "en": "Resident, irruptive in some years. Drums mainly from February through the breeding season, often in the morning; also heard in autumn and winter. The sources say nothing about July and August.",
   "no": "Standfugl, i noen år streifer mange langt. Trommer mest fra februar og gjennom hekketiden, ofte om morgenen; høres også om høsten og vinteren. Kildene sier ikke noe om juli og august.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "name": {
    "en": "Green woodpecker",
    "no": "Grønnspett"
   },
   "text": {
    "en": "The spring call «kly-kly-kly-kly» can sound like the green woodpecker's.",
    "no": "Vårlåten «kly-kly-kly-kly» kan ligne grønnspettens.",
    "verified": true
   }
  }
 ]
}
`,Ua=`{
 "_note": "Black woodpecker ink plate in a 280x240 box, drawn in M11 from the great spotted woodpecker plate, not from a design: clinging to a trunk, glossy black all over (dense hatching), whitish bill. Red is drawn as shadow tone: the male's whole crown, the female's small patch at the back of the head (SNL). The juvenile is browner (lighter hatching); its red is not described and is not drawn.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M178 52 C164 52 154 66 152 86 C148 116 150 150 160 172 C168 186 186 186 194 170 C202 150 204 118 202 90 C200 68 192 52 178 52 Z",
  "wing": "M158 92 C150 118 150 150 162 176 C170 150 172 118 168 94 Z"
 },
 "hatch": {
  "body": {
   "rect": [
    148,
    50,
    206,
    188
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    148,
    90,
    174,
    180
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    197,
    67
   ],
   "deg": -10
  },
  "lower": {
   "at": [
    197,
    71
   ],
   "deg": 8
  },
  "tail": {
   "at": [
    184,
    176
   ],
   "deg": 4
  }
 },
 "layers": [
  {
   "path": "M206 0 L246 0 L246 240 L206 240 Z",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "path": "M214 20 l4 30 M232 50 l-3 40 M218 110 l3 36 M236 150 l-4 40 M212 192 l3 30 M238 6 l-2 22",
   "stroke": 1
  },
  {
   "path": "M176 174 L198 226 L208 222 L190 170 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M186 186 l10 26 M192 182 l10 28",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M196 122 l10 -4 M196 128 l10 2 M194 152 l12 -2 M194 158 l12 4",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "variant": "nape",
   "fill": "shadow",
   "stroke": 1,
   "within": "body"
  },
  {
   "variant": "crown",
   "fill": "shadow",
   "stroke": 1,
   "within": "body"
  },
  {
   "clip": "wing",
   "fill": "face"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    188,
    66
   ],
   "pupil": 2.2
  },
  {
   "path": "M196 64 L215 63 L198 69 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M198 69 L214 66 L197 72 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M146 50 A16 16 0 0 0 146 80 M139 42 A26 26 0 0 0 139 88 M132 34 A36 36 0 0 0 132 96",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "variants": {
  "male": {
   "body_pitch": 2,
   "wing_pitch": 2,
   "eye_ring": 0,
   "bill": "face",
   "nape": "",
   "crown": "M160 64 C164 52 180 46 194 56 C188 60 176 60 162 70 Z"
  },
  "female": {
   "body_pitch": 2,
   "wing_pitch": 2,
   "eye_ring": 0,
   "bill": "face",
   "nape": "M160 62 C163 56 170 54 174 56 C172 64 166 68 160 68 Z",
   "crown": ""
  },
  "juvenile": {
   "body_pitch": 4,
   "wing_pitch": 4,
   "eye_ring": 0,
   "bill": "face",
   "nape": "",
   "crown": ""
  }
 },
 "callouts": [
  {
   "id": "head",
   "leader": "M164 60 L118 30",
   "at": [
    116,
    24
   ],
   "align": "right",
   "male": {
    "en": "RED CROWN",
    "no": "RØD ISSE",
    "verified": true
   },
   "female": {
    "en": "SMALL RED PATCH BEHIND",
    "no": "LITEN RØD FLEKK BAK",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M158 108 L96 116",
   "at": [
    92,
    110
   ],
   "align": "right",
   "male": {
    "en": "GLOSSY BLACK",
    "no": "BLANK SVART",
    "verified": true
   },
   "female": {
    "en": "GLOSSY BLACK",
    "no": "BLANK SVART",
    "verified": true
   },
   "juvenile": {
    "en": "BROWNER",
    "no": "BRUNERE",
    "verified": true
   }
  },
  {
   "id": "bill",
   "leader": "M200 62 L180 26",
   "at": [
    180,
    13
   ],
   "align": "centre",
   "male": {
    "en": "WHITISH",
    "no": "HVITAKTIG",
    "verified": true
   },
   "female": {
    "en": "WHITISH",
    "no": "HVITAKTIG",
    "verified": true
   },
   "juvenile": {
    "en": "WHITISH",
    "no": "HVITAKTIG",
    "verified": true
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Male drumming. Glossy black, red crown.",
   "no": "Hann som trommer. Blank svart, rød isse.",
   "verified": true
  },
  "female": {
   "en": "Female. Only a small red patch at the back of the head.",
   "no": "Hunn. Bare en liten rød flekk bak på hodet.",
   "verified": true
  },
  "juvenile": {
   "en": "Juvenile. Not described in the sources.",
   "no": "Ungfugl. Ikke beskrevet i kildene.",
   "verified": false
  }
 }
}
`,qa=`{
 "_note": "Black woodpecker, M11 batch 3. Verified (birds.md, SNL): drumming long and even, about 20 strokes in 2 s, may slow a little at the end, stronger and longer than other woodpeckers'; females drum now and then; flight «kri-kri-kri-kri»; after landing «kliii-æ»; in spring «kly-kly-kly-kly»; alarm «krykk krykk krykk». Design: rolls of 1,8 to 2,3 s at a steady 9,5 to 10,5 strokes a second (the slowing at the end is not modelled: core takes only a rising or steady rate); resonance 620 to 900 Hz (larger trees than the great spotted woodpecker's, my choice); pauses 8 to 25 s, longer for the female. Call shapes, pitches and timings are guesses; 'kly' series are in the call type all year, not only in spring.",
 "syllables": {
  "roll_a": {
   "dur_ms": 2000,
   "pitch": [
    [
     0,
     760
    ],
    [
     1,
     720
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.01,
     1
    ],
    [
     0.85,
     0.95
    ],
    [
     0.97,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8,
   "drum": {
    "rate": [
     10.0,
     10.0
    ]
   }
  },
  "roll_b": {
   "dur_ms": 2300,
   "pitch": [
    [
     0,
     640
    ],
    [
     1,
     620
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.01,
     1
    ],
    [
     0.85,
     0.95
    ],
    [
     0.97,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.8,
   "drum": {
    "rate": [
     9.5,
     9.5
    ]
   }
  },
  "roll_c": {
   "dur_ms": 1800,
   "pitch": [
    [
     0,
     900
    ],
    [
     1,
     860
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.01,
     1
    ],
    [
     0.85,
     0.95
    ],
    [
     0.97,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75,
   "drum": {
    "rate": [
     10.0,
     10.5
    ]
   }
  },
  "kri": {
   "dur_ms": 90,
   "pitch": [
    [
     0,
     2400
    ],
    [
     0.3,
     2800
    ],
    [
     1,
     2200
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     1
    ],
    [
     0.6,
     0.75
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "rough": 24
  },
  "kliii": {
   "dur_ms": 650,
   "pitch": [
    [
     0,
     2600
    ],
    [
     0.65,
     2500
    ],
    [
     0.72,
     2350
    ],
    [
     1,
     1800
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.06,
     1
    ],
    [
     0.66,
     0.85
    ],
    [
     0.7,
     0.3
    ],
    [
     0.76,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "tension": -4,
   "rough": 12
  },
  "kly": {
   "dur_ms": 110,
   "pitch": [
    [
     0,
     2200
    ],
    [
     0.4,
     2500
    ],
    [
     1,
     2100
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.12,
     1
    ],
    [
     0.6,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.65,
   "rough": 10
  },
  "krykk": {
   "dur_ms": 120,
   "pitch": [
    [
     0,
     1900
    ],
    [
     0.3,
     2300
    ],
    [
     1,
     1700
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.06,
     1
    ],
    [
     0.5,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.65,
   "rough": 40,
   "tension": 12
  }
 },
 "types": {
  "song": {
   "pause_s": [
    8.0,
    25.0
   ],
   "length_s": [
    1.8,
    2.4
   ],
   "transpose_st": 0.4,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "ph_tempo": [
     98,
     102
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "roll_a",
        "roll_b",
        "roll_c"
       ],
       "count": [
        1,
        1
       ],
       "share": 1.0,
       "gap_ms": [
        50,
        50
       ]
      }
     ]
    }
   ],
   "overrides": [
    {
     "_note": "Females drum now and then (birds.md); the longer pause is a design choice.",
     "when": {
      "sex": "female"
     },
     "pause_s": [
      30.0,
      90.0
     ]
    }
   ]
  },
  "call": {
   "pause_s": [
    3.0,
    10.0
   ],
   "length_s": [
    0.6,
    1.6
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     10,
     18
    ],
    "vo_tension": [
     40,
     54
    ],
    "vo_rough": [
     10,
     18
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "kliii"
       ],
       "count": [
        1,
        1
       ],
       "share": 1.0,
       "gap_ms": [
        100,
        100
       ]
      }
     ]
    },
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "kly"
       ],
       "count": [
        6,
        12
       ],
       "share": 1.0,
       "gap_ms": [
        60,
        100
       ]
      }
     ]
    }
   ],
   "overrides": []
  },
  "alarm": {
   "pause_s": [
    1.0,
    4.0
   ],
   "length_s": [
    0.6,
    1.0
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     10,
     16
    ],
    "vo_tension": [
     44,
     56
    ],
    "vo_rough": [
     34,
     46
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "krykk"
       ],
       "count": [
        3,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        150,
        250
       ]
      }
     ]
    }
   ],
   "overrides": []
  },
  "flight": {
   "pause_s": [
    1.5,
    5.0
   ],
   "length_s": [
    0.4,
    1.0
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.97,
     1.03
    ],
    "vo_breath": [
     10,
     18
    ],
    "vo_tension": [
     40,
     52
    ],
    "vo_rough": [
     20,
     30
    ],
    "ph_tempo": [
     95,
     105
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "kri"
       ],
       "count": [
        4,
        7
       ],
       "share": 1.0,
       "gap_ms": [
        70,
        110
       ]
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,Va=`{
  "_note": "Sound design starting values for the black woodpecker, M11 batch 3. For drum syllables the pitch knob moves the knock's resonance; breath, tension, rough and trill only touch the calls. Not bird facts.",
  "pitch_ref_hz": 750,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 10,
    "vo_tension": 50,
    "vo_trill": 0,
    "vo_rough": 20,
    "ph_tempo": 100,
    "ph_pause": 12.0,
    "ph_length": 2.0,
    "ph_variation": 40,
    "su_distance": 40,
    "su_wind": 1.5,
    "su_space": 40
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}
`,Wa=`{
 "_note": "Field guide text for this bird, both languages. Facts come from birds.md. A field with verified false is not shown as a fact: empty means not described, and the text says what the sources leave out. Norwegian wording is mine, Eirik to check. calendar rows: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/turdus-merula",
 "facts": {
  "length": {
   "en": "About 25 cm",
   "no": "Omtrent 25 cm",
   "verified": true
  },
  "broods": {
   "en": "Often 2 in a season",
   "no": "Ofte 2 kull i sesongen",
   "verified": true
  },
  "range": {
   "en": "Common north to Trøndelag",
   "no": "Vanlig nord til Trøndelag",
   "verified": true
  },
  "habitat": {
   "en": "Woods with undergrowth, also towns",
   "no": "Skog med underskog, også byer",
   "verified": true
  },
  "food": {
   "en": "Insects, snails, earthworms, berries",
   "no": "Insekter, snegler, meitemark, bær",
   "verified": true
  },
  "status": {
   "en": "LC, viable, Norwegian red list",
   "no": "LC, livskraftig, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "Cup in a bush or low tree, 4 to 6 eggs",
   "no": "Skål i busk eller lavt tre, 4 til 6 egg",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Sings",
   "no": "Synger",
   "verified": true
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "Mellow, melodious song of fluting tones, often at a slow pace. Unlike the song thrush, the blackbird does not repeat its phrases, and the song varies a lot from bird to bird. The sources give no phrase length and do not describe the twitter at the end.",
  "no": "Myk, melodiøs sang med fløytende toner, ofte i rolig tempo. I motsetning til måltrosten gjentar ikke svarttrosten frasene sine, og sangen varierer mye fra fugl til fugl. Kildene oppgir ikke fraselengden og beskriver ikke kvitringen på slutten.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "Often from a treetop, mostly early morning and late evening, from February.",
   "no": "Ofte fra en tretopp, mest tidlig morgen og sent på kvelden, fra februar.",
   "verified": true
  },
  "call": {
   "en": "A metallic, monotonous “pink pink pink” at dusk before roosting, or when disturbed.",
   "no": "Et metallisk, ensformig «pink pink pink» i skumringen før natten, eller når den blir forstyrret.",
   "verified": true
  },
  "alarm": {
   "en": "A loud alarm call. The sources do not describe how it sounds.",
   "no": "Et høyt varselrop. Kildene beskriver ikke hvordan den låter.",
   "verified": true
  },
  "flight": {
   "en": "Migrates alone at night. No flight call in the sources checked.",
   "no": "Trekker alene om natten. Ingen fluktlyd i kildene som er lest.",
   "verified": true
  }
 },
 "parts": {
  "motifs": {
   "en": "FLUTED MOTIFS",
   "no": "FLØYTENDE MOTIV",
   "verified": true
  },
  "twitter": {
   "en": "TWITTER",
   "no": "KVITRING",
   "verified": false
  }
 },
 "calendar": {
  "present": "yyyyyyyyyyyy",
  "sings": "ny??????????",
  "note": {
   "en": "Most leave in autumn and return in late March. Many males winter in the lowlands on berries and fruit. The sources do not give its last singing month.",
   "no": "De fleste drar om høsten og kommer tilbake i slutten av mars. Mange hanner overvintrer i lavlandet på bær og frukt. Kildene oppgir ikke siste måned med sang.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "id": "maltrost",
   "text": {
    "en": "Repeats its phrases. The blackbird does not.",
    "no": "Gjentar frasene sine. Svarttrosten gjør det ikke.",
    "verified": true
   }
  },
  {
   "name": {
    "en": "Mistle thrush",
    "no": "Duetrost"
   },
   "text": {
    "en": "The sources do not compare their songs.",
    "no": "Kildene sammenligner ikke sangen deres.",
    "verified": true
   }
  },
  {
   "name": {
    "en": "Starling",
    "no": "Stær"
   },
   "text": {
    "en": "A good mimic: its song holds sounds of other birds and man-made signals.",
    "no": "En god hermer: sangen har lyder fra andre fugler og menneskeskapte signaler.",
    "verified": true
   }
  }
 ]
}
`,Ya=`{
 "_note": "Ink plate in a 280x240 box, from design/Main.dc.html. Callout values are bird facts: verified only where birds.md says so.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M190 60 C184 44 158 42 150 62 C134 80 104 106 90 136 C92 146 98 154 106 158 C128 180 162 178 178 152 C192 130 198 104 192 80 C194 74 194 66 190 60 Z",
  "wing": "M152 90 C156 118 136 146 98 152 C106 136 118 110 152 90 Z"
 },
 "layers": [
  {
   "path": "M14 211 C80 205 150 201 268 193",
   "stroke": 4
  },
  {
   "path": "M214 196 l20 -20 M224 186 l16 3",
   "stroke": 1.5
  },
  {
   "path": "M234 176 q10 -10 18 -2 q-9 8 -18 2 Z M240 189 q11 -5 16 3 q-10 4 -16 -3 Z",
   "fill": "face",
   "stroke": 1
  },
  {
   "path": "M90 136 L42 194 L54 206 L106 158 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "path": "M94 142 L46 198 M98 147 L49 202 M102 153 L52 205",
   "stroke": 1,
   "part": "tail"
  },
  {
   "path": "M136 172 L139 199 M152 173 L157 198 M131 201 L139 199 L148 202 M149 200 L157 198 L166 201",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "variant": "throat",
   "fill": "face",
   "within": "body"
  },
  {
   "variant": "spots",
   "stroke": 1.5,
   "within": "body"
  },
  {
   "eye": [
    177,
    65
   ],
   "pupil": 2.4
  },
  {
   "path": "M190 60 L220 66 L193 70 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M193 70 L216 69 L191 79 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M230 52 A16 16 0 0 1 230 76 M237 44 A26 26 0 0 1 237 84 M243 36 A36 36 0 0 1 243 92",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "hatch": {
  "body": {
   "rect": [
    86,
    42,
    200,
    182
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    96,
    88,
    158,
    154
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    192,
    67
   ],
   "deg": -16
  },
  "lower": {
   "at": [
    192,
    72
   ],
   "deg": 10
  },
  "tail": {
   "at": [
    98,
    147
   ],
   "deg": -5
  }
 },
 "variants": {
  "male": {
   "body_pitch": 5,
   "wing_pitch": 4,
   "eye_ring": 5,
   "bill": "face",
   "throat": "",
   "spots": ""
  },
  "female": {
   "body_pitch": 10,
   "wing_pitch": 8,
   "eye_ring": 0,
   "bill": "shadow",
   "throat": "M186 80 C176 96 174 118 182 136 C194 122 198 100 194 80 Z",
   "spots": "M183 96 l2 3 M188 104 l2 3 M181 108 l2 3 M186 116 l2 3 M182 124 l2 3 M189 92 l1 3"
  },
  "juvenile": {
   "body_pitch": 7,
   "wing_pitch": 6,
   "eye_ring": 0,
   "bill": "shadow",
   "throat": "",
   "spots": ""
  }
 },
 "callouts": [
  {
   "id": "bill",
   "leader": "M200 58 L200 23",
   "at": [
    200,
    10
   ],
   "align": "centre",
   "male": {
    "en": "ORANGE-YELLOW",
    "no": "ORANSJEGUL",
    "verified": true
   },
   "female": {
    "en": "DULLER THAN MALE",
    "no": "MATTERE ENN HANN",
    "verified": true
   },
   "juvenile": {
    "en": "DARK",
    "no": "MØRK",
    "verified": false
   }
  },
  {
   "id": "eye_ring",
   "leader": "M172 62 L122 36",
   "at": [
    120,
    30
   ],
   "align": "right",
   "male": {
    "en": "YELLOW",
    "no": "GUL",
    "verified": true
   },
   "female": {
    "en": "NONE",
    "no": "INGEN",
    "verified": false
   },
   "juvenile": {
    "en": "NONE",
    "no": "INGEN",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M120 112 L72 86",
   "at": [
    70,
    80
   ],
   "align": "right",
   "male": {
    "en": "BLACK",
    "no": "SVART",
    "verified": true
   },
   "female": {
    "en": "DARK BROWN",
    "no": "MØRK BRUN",
    "verified": true
   },
   "juvenile": {
    "en": "BROWN-BLACK",
    "no": "BRUNSVART",
    "verified": true
   }
  },
  {
   "id": "throat",
   "leader": "M192 116 L236 142",
   "at": [
    276,
    150
   ],
   "align": "right",
   "male": {
    "en": "BLACK",
    "no": "SVART",
    "verified": true
   },
   "female": {
    "en": "PALER, SPOTTED",
    "no": "LYSERE, FLEKKETE",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Male, singing. Beak and tail follow the sound.",
   "no": "Hann som synger. Nebb og hale følger lyden.",
   "verified": true
  },
  "female": {
   "en": "Female. Dark brown, paler spotted throat and breast.",
   "no": "Hunn. Mørk brun, lysere flekkete strupe og bryst.",
   "verified": true
  },
  "juvenile": {
   "en": "Juvenile. Brown-black.",
   "no": "Ungfugl. Brunsvart.",
   "verified": true
  }
 }
}`,$a=`{
  "_note": "Syllable shapes, timings and pitches are sound design starting points, tuned by ear against recordings. They are not verified facts. Verified (birds.md): mellow fluting song with no repeated phrases; call is a metallic monotonous 'pink pink pink', at dusk before roosting. To verify: phrase length and the thin twitter ending.",

  "syllables": {
    "fa": { "dur_ms": 280, "pitch": [[0, 1650], [0.35, 2150], [1, 1900]], "amp": [[0, 0], [0.12, 0.85], [0.4, 1], [0.8, 0.75], [1, 0]] },
    "fb": { "dur_ms": 220, "pitch": [[0, 2400], [0.2, 2350], [1, 1700]], "amp": [[0, 0], [0.1, 0.9], [0.5, 0.85], [0.85, 0.5], [1, 0]] },
    "fc": { "dur_ms": 200, "pitch": [[0, 1500], [0.7, 1980], [1, 2040]], "amp": [[0, 0], [0.18, 0.8], [0.6, 1], [1, 0]] },
    "fd": { "dur_ms": 330, "pitch": [[0, 1420], [0.3, 1500], [1, 1460]], "amp": [[0, 0], [0.15, 0.9], [0.7, 0.85], [1, 0]], "trill": { "hz": 7, "depth_st": 0.35, "am": 0.15 } },
    "fe": { "dur_ms": 300, "pitch": [[0, 2100], [0.4, 1750], [1, 2300]], "amp": [[0, 0], [0.1, 0.8], [0.45, 0.7], [0.75, 1], [1, 0]] },
    "ff": { "dur_ms": 260, "pitch": [[0, 1800], [0.25, 2500], [0.6, 2300], [1, 2000]], "amp": [[0, 0], [0.1, 0.9], [0.4, 0.5], [0.55, 0.95], [1, 0]] },
    "fg": { "dur_ms": 180, "pitch": [[0, 2700], [1, 2550]], "amp": [[0, 0], [0.15, 0.85], [0.7, 0.8], [1, 0]], "gain": 0.85 },
    "fh": { "dur_ms": 90, "pitch": [[0, 2000], [1, 2250]], "amp": [[0, 0], [0.3, 1], [1, 0]], "gain": 0.8 },
    "fi": { "dur_ms": 240, "pitch": [[0, 1950], [1, 1850]], "amp": [[0, 0], [0.15, 0.9], [0.8, 0.8], [1, 0]], "trill": { "hz": 18, "depth_st": 1.1, "am": 0.3 } },
    "fj": { "dur_ms": 340, "pitch": [[0, 1300], [0.45, 1900], [1, 1600]], "amp": [[0, 0], [0.2, 0.75], [0.5, 1], [0.85, 0.7], [1, 0]] },

    "ta": { "dur_ms": 45, "pitch": [[0, 7000], [1, 4500]], "amp": [[0, 0], [0.15, 1], [1, 0]], "gain": 0.4, "breath": 14, "tension": 20, "rough": 18 },
    "tb": { "dur_ms": 40, "pitch": [[0, 4200], [1, 6800]], "amp": [[0, 0], [0.4, 1], [1, 0]], "gain": 0.38, "breath": 14, "tension": 18, "rough": 18 },
    "tc": { "dur_ms": 90, "pitch": [[0, 5600], [1, 5300]], "amp": [[0, 0], [0.2, 1], [0.8, 0.7], [1, 0]], "gain": 0.32, "breath": 20, "tension": 25, "rough": 25, "trill": { "hz": 35, "depth_st": 3, "am": 0.5 } },
    "td": { "dur_ms": 60, "pitch": [[0, 6500], [0.5, 5200], [1, 6000]], "amp": [[0, 0], [0.2, 1], [0.6, 0.6], [1, 0]], "gain": 0.38, "breath": 12, "tension": 15, "rough": 15 },
    "te": { "dur_ms": 70, "pitch": [[0, 3800], [1, 5000]], "amp": [[0, 0], [0.3, 1], [1, 0]], "gain": 0.32, "breath": 35, "tension": 30, "rough": 30 },

    "pink": { "dur_ms": 45, "pitch": [[0, 4300], [0.15, 4600], [1, 3600]], "amp": [[0, 0], [0.06, 1], [0.3, 0.6], [1, 0]], "gain": 0.7 },
    "pink2": { "dur_ms": 40, "pitch": [[0, 4100], [0.15, 4400], [1, 3500]], "amp": [[0, 0], [0.06, 1], [0.3, 0.55], [1, 0]], "gain": 0.65 }
  },

  "types": {
    "song": {
      "pause_s": [2.0, 4.5],
      "length_s": [1.6, 2.8],
      "transpose_st": 1.5,
      "avoid_repeat": true,
      "auto": {
        "vo_pitch": [0.97, 1.03],
        "vo_breath": [8, 18],
        "vo_tension": [15, 32],
        "vo_rough": [3, 10],
        "ph_tempo": [92, 108]
      },
      "phrases": [
        { "weight": 3, "sections": [
          { "part": "motifs", "pool": ["fa", "fb", "fc", "fd", "fe", "ff", "fg", "fh", "fi", "fj"], "count": [2, 6], "share": 0.7, "gap_ms": [30, 110] },
          { "part": "twitter", "pool": ["ta", "tb", "tc", "td", "te"], "count": [2, 8], "share": 0.3, "chance": 0.8, "gap_ms": [8, 35], "lead_gap_ms": [60, 150] }
        ] },
        { "weight": 1, "sections": [
          { "part": "motifs", "pool": ["fa", "fb", "fc", "fd", "fe", "ff", "fg", "fh", "fi", "fj"], "count": [3, 7], "share": 1.0, "gap_ms": [30, 110] }
        ] }
      ],
      "overrides": [
        { "_note": "Sings mostly early morning and late evening (birds.md). Longer pauses by day are a design choice.", "when": { "time": "day" }, "pause_s": [4.0, 9.0] }
      ]
    },

    "call": {
      "pause_s": [0.8, 3.0],
      "length_s": [0.6, 3.0],
      "avoid_repeat": false,
      "auto": {
        "vo_pitch": [0.98, 1.02],
        "vo_breath": [18, 26],
        "vo_tension": [72, 88],
        "vo_rough": [10, 18]
      },
      "phrases": [
        { "weight": 1, "sections": [
          { "pool": ["pink", "pink2"], "count": [2, 7], "share": 1.0, "gap_ms": [230, 420], "no_adjacent_repeat": false }
        ] }
      ],
      "overrides": [
        { "_note": "Calls at dusk before roosting (birds.md). Shorter pauses then are a design choice.", "when": { "time": "dusk" }, "pause_s": [0.4, 1.5] }
      ]
    }
  }
}
`,Ja=`{
  "_note": "Sound design values tuned by ear in M1. Not bird facts.",
  "pitch_ref_hz": 2000,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 12,
    "vo_tension": 22,
    "vo_trill": 0,
    "vo_rough": 6,
    "ph_tempo": 100,
    "ph_pause": 3.0,
    "ph_length": 2.2,
    "ph_variation": 50,
    "su_distance": 15,
    "su_wind": 1.5,
    "su_space": 35
  },
  "ranges": {
    "vo_pitch": [0.5, 2.0],
    "vo_breath": [0, 100],
    "vo_tension": [0, 100],
    "vo_trill": [0, 40],
    "vo_rough": [0, 100],
    "ph_tempo": [50, 200],
    "ph_pause": [0.2, 20],
    "ph_length": [0.2, 8],
    "ph_variation": [0, 100],
    "su_distance": [1, 200],
    "su_wind": [0, 15],
    "su_space": [0, 100]
  }
}
`,Xa=`{
 "_note": "Field guide text for the oystercatcher, both languages. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/haematopus-ostralegus",
 "facts": {
  "length": {
   "en": "40 to 45 cm, 450 to 650 g",
   "no": "40 til 45 cm, 450 til 650 g",
   "verified": true
  },
  "broods": {
   "en": "Usually 3 eggs, second half of May",
   "no": "Vanligvis 3 egg, siste halvdel av mai",
   "verified": true
  },
  "range": {
   "en": "The whole coast, inland in Trøndelag and Østlandet",
   "no": "Hele kysten, i innlandet i Trøndelag og Østlandet",
   "verified": true
  },
  "habitat": {
   "en": "Soft shores; rivers, lakes and farmland inland",
   "no": "Bløtbunnsfjærer; elver, innsjøer og kulturlandskap",
   "verified": true
  },
  "food": {
   "en": "Mussels, snails, worms, crustaceans; inland earthworms",
   "no": "Skjell, snegler, mark, krepsdyr; meitemark i innlandet",
   "verified": true
  },
  "status": {
   "en": "NT, near threatened, Norwegian red list",
   "no": "NT, nær truet, norsk rødliste",
   "verified": true
  },
  "nest": {
   "en": "Scrape on sand or gravel, lined with stones or shell",
   "no": "Grop i sand eller grus, foret med stein eller skjell",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "",
   "no": "",
   "verified": false
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "A lively bird that calls often, and very vocal when mating. The flight call is loud, penetrating and easy to recognise. The sources do not describe how the calls sound, so Pipp's shapes are guesses.",
  "no": "En livlig fugl som lager mye lyd, og svært lydytrende under parring. Fluktlyden er høylytt, gjennomtrengende og lett å kjenne igjen. Kildene beskriver ikke hvordan lydene låter, så Pipps former er gjetninger.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "",
   "no": "",
   "verified": false
  },
  "call": {
   "en": "",
   "no": "",
   "verified": false
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "Loud, penetrating and easy to recognise.",
   "no": "Høylytt, gjennomtrengende og lett å kjenne igjen.",
   "verified": true
  }
 },
 "calendar": {
  "present": "?yyyyyyyyy??",
  "sings": "????????????",
  "note": {
   "en": "Short-distance migrant. Back in late February in the south, March to mid-April further north; leaves mainly in August and September. Some winter on the coast north to Lofoten, and 150 to 200 every winter in the inner Trondheimsfjord.",
   "no": "Kortdistansetrekker. Tilbake i slutten av februar i sør, mars til midten av april lenger nord; drar mest i august og september. Noen overvintrer langs kysten nord til Lofoten, og 150 til 200 hver vinter i indre Trondheimsfjord.",
   "verified": true
  }
 },
 "lookalikes": []
}`,Qa=`{
 "_note": "Oystercatcher ink plate in a 280x240 box, drawn in M10, not from a design: standing on the shore, black head, neck and back (ink), white underside, long straight orange-red bill, red eye, fairly short pink legs (birds.md, SNL). No sex difference or juvenile is described, so female and juvenile are drawn the same and not verified.",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M192 78 C192 64 180 56 168 58 C156 60 150 70 150 80 C124 86 96 98 74 114 C100 130 126 144 150 148 C172 152 186 140 188 122 C190 106 192 92 192 78 Z",
  "wing": "M160 96 C134 98 104 108 74 114 C54 120 40 124 30 128 C52 132 86 130 114 124 C140 118 156 108 160 96 Z"
 },
 "hatch": {
  "body": {
   "rect": [
    72,
    54,
    194,
    154
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    28,
    94,
    162,
    134
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    190,
    74
   ],
   "deg": -8
  },
  "lower": {
   "at": [
    190,
    78
   ],
   "deg": 6
  },
  "tail": {
   "at": [
    76,
    116
   ],
   "deg": -3
  }
 },
 "layers": [
  {
   "path": "M14 214 C70 204 150 200 268 206",
   "stroke": 2.5
  },
  {
   "path": "M40 212 q8 -4 16 0 M180 206 q8 -4 16 0 M220 208 q6 -3 12 0",
   "stroke": 1
  },
  {
   "path": "M138 146 L136 202 M156 146 L158 202 M126 203 L136 202 L146 204 M148 203 L158 202 L168 204",
   "stroke": 2
  },
  {
   "path": "M76 110 L48 116 L52 124 L80 122 Z",
   "fill": "ink",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "path": "M192 78 C192 64 180 56 168 58 C156 60 150 70 150 80 C124 86 96 98 74 114 C96 112 128 106 156 104 C176 104 190 100 192 92 Z",
   "fill": "ink",
   "within": "body"
  },
  {
   "clip": "wing",
   "fill": "ink"
  },
  {
   "path": "M60 120 C80 118 104 116 124 112",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "eye": [
    178,
    70
   ],
   "pupil": 2.4
  },
  {
   "path": "M190 72 L240 76 L240 79 L191 78 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "upper"
  },
  {
   "path": "M191 78 L240 79 L238 82 L190 83 Z",
   "fill": "bill",
   "stroke": 1.5,
   "part": "lower"
  },
  {
   "path": "M248 60 A16 16 0 0 1 248 92 M255 52 A26 26 0 0 1 255 100",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "variants": {
  "male": {
   "body_pitch": 0,
   "wing_pitch": 0,
   "eye_ring": 3.6,
   "bill": "face"
  },
  "female": {
   "body_pitch": 0,
   "wing_pitch": 0,
   "eye_ring": 3.6,
   "bill": "face"
  },
  "juvenile": {
   "body_pitch": 0,
   "wing_pitch": 0,
   "eye_ring": 3.6,
   "bill": "face"
  }
 },
 "callouts": [
  {
   "id": "bill",
   "leader": "M222 76 L222 34",
   "at": [
    222,
    21
   ],
   "align": "centre",
   "male": {
    "en": "ORANGE-RED, 7 TO 9 CM",
    "no": "ORANSJERØDT, 7 TIL 9 CM",
    "verified": true
   },
   "female": {
    "en": "ORANGE-RED, 7 TO 9 CM",
    "no": "ORANSJERØDT, 7 TIL 9 CM",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M120 100 L84 70",
   "at": [
    80,
    64
   ],
   "align": "right",
   "male": {
    "en": "BLACK ABOVE",
    "no": "SVART OVERSIDE",
    "verified": true
   },
   "female": {
    "en": "BLACK ABOVE",
    "no": "SVART OVERSIDE",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "breast",
   "leader": "M170 130 L232 152",
   "at": [
    276,
    160
   ],
   "align": "right",
   "male": {
    "en": "CHALK-WHITE",
    "no": "KRITHVIT",
    "verified": true
   },
   "female": {
    "en": "CHALK-WHITE",
    "no": "KRITHVIT",
    "verified": false
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Adult on the shore. Beak and tail follow the sound.",
   "no": "Voksen i fjæra. Nebb og hale følger lyden.",
   "verified": true
  },
  "female": {
   "en": "Female. No difference from the male is described.",
   "no": "Hunn. Ingen forskjell fra hannen er beskrevet.",
   "verified": false
  },
  "juvenile": {
   "en": "Juvenile. Not described in the sources, so drawn like the adults.",
   "no": "Ungfugl. Ikke beskrevet i kildene, så tegnet som de voksne.",
   "verified": false
  }
 }
}`,no=`{
 "_note": "Oystercatcher, M10. Verified (birds.md, SNL): a lively bird that calls often; the flight call is loud, penetrating and easy to recognise; very vocal when mating. No source gives a transcription or how any call is built, so the shapes are sound design guesses: the flight call as loud, piercing two-part 'kliip' notes in series; the song slot (needed by the quiz and Play) as a placeholder piping series that runs from separate notes into a fast trill.",
 "syllables": {
  "kliip": {
   "dur_ms": 230,
   "pitch": [
    [
     0,
     2700
    ],
    [
     0.25,
     3500
    ],
    [
     0.7,
     3300
    ],
    [
     1,
     2900
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.06,
     1
    ],
    [
     0.6,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.95
  },
  "kliip2": {
   "dur_ms": 210,
   "pitch": [
    [
     0,
     2800
    ],
    [
     0.3,
     3600
    ],
    [
     1,
     3100
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.06,
     1
    ],
    [
     0.6,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.95
  },
  "kip": {
   "dur_ms": 80,
   "pitch": [
    [
     0,
     3200
    ],
    [
     0.4,
     3500
    ],
    [
     1,
     3000
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.06,
     1
    ],
    [
     0.6,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.95
  },
  "pi": {
   "dur_ms": 70,
   "pitch": [
    [
     0,
     3300
    ],
    [
     1,
     3000
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.06,
     1
    ],
    [
     0.6,
     0.85
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.9
  }
 },
 "types": {
  "song": {
   "pause_s": [
    3.0,
    8.0
   ],
   "length_s": [
    2.5,
    5.0
   ],
   "transpose_st": 0.8,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     5,
     12
    ],
    "vo_tension": [
     34,
     48
    ],
    "vo_rough": [
     3,
     9
    ],
    "ph_tempo": [
     96,
     104
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "kip"
       ],
       "count": [
        3,
        6
       ],
       "share": 0.3,
       "gap_ms": [
        120,
        200
       ]
      },
      {
       "pool": [
        "pi"
       ],
       "count": [
        10,
        24
       ],
       "share": 0.7,
       "gap_ms": [
        20,
        40
       ]
      }
     ]
    }
   ],
   "overrides": []
  },
  "flight": {
   "pause_s": [
    1.0,
    4.0
   ],
   "length_s": [
    0.4,
    2.5
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     5,
     12
    ],
    "vo_tension": [
     38,
     52
    ],
    "vo_rough": [
     3,
     9
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "kliip",
        "kliip2"
       ],
       "count": [
        1,
        5
       ],
       "share": 1.0,
       "gap_ms": [
        180,
        320
       ],
       "no_adjacent_repeat": false
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}`,eo=`{
  "_note": "Sound design starting values for the oystercatcher, M10. Not tuned by ear yet. Not bird facts.",
  "pitch_ref_hz": 3000,
  "base": {
    "vo_pitch": 1.0,
    "vo_breath": 8,
    "vo_tension": 40,
    "vo_trill": 0,
    "vo_rough": 6,
    "ph_tempo": 100,
    "ph_pause": 3.0,
    "ph_length": 3.0,
    "ph_variation": 50,
    "su_distance": 30,
    "su_wind": 1.5,
    "su_space": 35
  },
  "ranges": {
    "vo_pitch": [
      0.5,
      2.0
    ],
    "vo_breath": [
      0,
      100
    ],
    "vo_tension": [
      0,
      100
    ],
    "vo_trill": [
      0,
      40
    ],
    "vo_rough": [
      0,
      100
    ],
    "ph_tempo": [
      50,
      200
    ],
    "ph_pause": [
      0.2,
      20
    ],
    "ph_length": [
      0.2,
      8
    ],
    "ph_variation": [
      0,
      100
    ],
    "su_distance": [
      1,
      200
    ],
    "su_wind": [
      0,
      15
    ],
    "su_space": [
      0,
      100
    ]
  }
}`,to=`{
 "_note": "Field guide text for the lapwing, both languages. SNL gives no transcription, so the shapes are [TO VERIFY]. Facts from birds.md (SNL, checked 2026-11-26). Norwegian wording is mine, Eirik to check. calendar: one letter per month from January, y yes, n no, ? not known.",
 "xeno_canto": "https://xeno-canto.org/species/vanellus-vanellus",
 "facts": {
  "length": {
   "en": "32 cm",
   "no": "32 cm",
   "verified": true
  },
  "broods": {
   "en": "Usually 4 eggs; both sit 23 to 30 days",
   "no": "Vanligvis 4 egg; begge ruger i 23 til 30 dager",
   "verified": true
  },
  "range": {
   "en": "Farmland, mostly in the south; 7500 to 10 000 pairs (2015), probably fewer now",
   "no": "Kulturlandskap, mest i Sør-Norge; 7500 til 10 000 par (2015), trolig færre nå",
   "verified": true
  },
  "habitat": {
   "en": "Moist grassland in farmland, coastal meadows, wetlands",
   "no": "Fuktig gressmark i kulturlandskapet, strandenger, våtmark",
   "verified": true
  },
  "food": {
   "en": "Almost only animal food, mainly earthworms and insects",
   "no": "Nesten bare animalsk føde, mest meitemark og insekter",
   "verified": true
  },
  "status": {
   "en": "CR, critically endangered, Norwegian red list; about 90 % decline since the 1970s",
   "no": "CR, kritisk truet, norsk rødliste; rundt 90 % nedgang siden 1970-tallet",
   "verified": true
  },
  "nest": {
   "en": "A simple scrape on the ground, on damp ground lined with dry grass",
   "no": "En enkel grop på bakken, på fuktig grunn fôret med tørt gress",
   "verified": true
  }
 },
 "sings": {
  "male": {
   "en": "Hoarse song in display flight",
   "no": "Hes sang i fluktspill",
   "verified": true
  },
  "female": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "song_notes": {
  "en": "Very vocal in the breeding season, with high, penetrating, plaintive calls. Early in spring the male tumbles low over the nest site in an acrobatic display flight; its characteristic hoarse song comes with humming sounds from the wings. SNL gives no transcription, so the notes Pipp plays are a stand-in.",
  "no": "Svært lydelig i hekketiden, med høye, gjennomtrengende, klagende lyder. Tidlig om våren kaster hannen seg lavt over hekkeplassen i et akrobatisk fluktspill; den karakteristiske hese sangen følges av summende lyder fra vingene. SNL gir ingen gjengivelse, så tonene Pipp spiller er en stedfortreder.",
  "verified": true
 },
 "mnemonic": {
  "en": "",
  "no": "",
  "verified": false
 },
 "types": {
  "song": {
   "en": "The male's hoarse song in display flight, with humming wings.",
   "no": "Hannens hese sang i fluktspill, med summende vinger.",
   "verified": true
  },
  "call": {
   "en": "High, penetrating, plaintive calls.",
   "no": "Høye, gjennomtrengende, klagende lyder.",
   "verified": true
  },
  "alarm": {
   "en": "",
   "no": "",
   "verified": false
  },
  "flight": {
   "en": "",
   "no": "",
   "verified": false
  }
 },
 "calendar": {
  "present": "?yyyyyyyyy??",
  "sings": "????????????",
  "note": {
   "en": "One of the first migrants back, February to March in the south; leaves July to October, wintering mainly in France and Iberia. A few winter on the south-west coast.",
   "no": "En av de første trekkfuglene tilbake, februar til mars i sør; drar juli til oktober og overvintrer mest i Frankrike og på Den iberiske halvøy. Noen få overvintrer på sørvestkysten.",
   "verified": true
  }
 },
 "lookalikes": [
  {
   "name": {
    "en": "Other waders",
    "no": "Andre vadefugler"
   },
   "text": {
    "en": "In flight the broad, rounded wingtips set it apart from every other Norwegian wader.",
    "no": "I flukt skiller de brede, avrundede vingespissene den fra alle andre norske vadefugler.",
    "verified": true
   }
  }
 ]
}
`,io=`{
 "_note": "Lapwing ink plate in a 280x240 box, M11 batch 7, built from the golden plover plate: very long crest (ink; the female's shorter), dark green glossy back (dense hatching), black face, throat and breast (ink; the female's mottled with white, drawn in shadow), white belly, rust-red under the tail (shadow), black bill (birds.md, SNL). Juvenile and winter plumage are not described; the juvenile is drawn like the female, [TO VERIFY].",
 "box": [
  280,
  240
 ],
 "clips": {
  "body": "M178 74 C178 62 168 56 158 58 C148 60 144 68 144 78 C120 86 96 98 76 114 C100 128 124 138 146 140 C166 142 176 130 176 114 C176 100 178 88 178 74 Z",
  "wing": "M150 92 C126 94 100 104 76 114 C60 120 48 124 40 128 C60 130 90 128 116 122 C138 116 150 106 150 92 Z"
 },
 "hatch": {
  "body": {
   "rect": [
    74,
    54,
    180,
    144
   ],
   "up": true,
   "clip": "body"
  },
  "wing": {
   "rect": [
    38,
    88,
    152,
    132
   ],
   "up": false,
   "clip": "wing"
  }
 },
 "pivots": {
  "upper": {
   "at": [
    176,
    72
   ],
   "deg": -6
  },
  "lower": {
   "at": [
    176,
    76
   ],
   "deg": 4
  },
  "tail": {
   "at": [
    78,
    116
   ],
   "deg": -3
  }
 },
 "layers": [
  {
   "path": "M14 214 C70 206 150 204 268 208",
   "stroke": 2.5
  },
  {
   "path": "M40 214 q8 -5 16 0 M210 210 q8 -4 16 0",
   "stroke": 1
  },
  {
   "path": "M124 138 L118 206 M140 140 L144 206 M108 207 L118 206 L128 208 M134 207 L144 206 L154 208",
   "stroke": 1.5
  },
  {
   "path": "M78 112 L52 118 L56 126 L82 122 Z",
   "fill": "face",
   "stroke": 1.5,
   "part": "tail"
  },
  {
   "clip": "body",
   "fill": "face",
   "stroke": 1.5
  },
  {
   "hatch": "body"
  },
  {
   "variant": "belly",
   "fill": "black",
   "within": "body"
  },
  {
   "variant": "vent",
   "fill": "shadow",
   "within": "body"
  },
  {
   "clip": "wing",
   "fill": "face"
  },
  {
   "hatch": "wing"
  },
  {
   "clip": "wing",
   "stroke": 1.5
  },
  {
   "clip": "body",
   "stroke": 1.5
  },
  {
   "variant": "crest",
   "fill": "ink"
  },
  {
   "eye": [
    164,
    68
   ],
   "pupil": 2.2
  },
  {
   "path": "M176 70 L198 73 L176 75 Z",
   "fill": "bill",
   "stroke": 1.4,
   "part": "upper"
  },
  {
   "path": "M176 75 L196 74 L176 78 Z",
   "fill": "bill",
   "stroke": 1.4,
   "part": "lower"
  },
  {
   "path": "M120 40 A14 14 0 0 0 120 66 M113 32 A24 24 0 0 0 113 74",
   "stroke": 1.5,
   "part": "arcs"
  }
 ],
 "variants": {
  "male": {
   "body_pitch": 4,
   "wing_pitch": 4,
   "eye_ring": 0,
   "bill": "ink",
   "belly": "M178 62 C178 80 176 94 172 106 C164 106 156 100 152 92 C160 88 168 80 172 66 Z",
   "vent": "M80 116 C86 121 94 124 102 126 C96 130 86 128 80 122 Z",
   "black": "ink",
   "crest": "M154 62 C146 48 134 40 118 38 C134 46 144 54 150 64 Z"
  },
  "female": {
   "body_pitch": 4,
   "wing_pitch": 4,
   "eye_ring": 0,
   "bill": "ink",
   "belly": "M178 62 C178 80 176 94 172 106 C164 106 156 100 152 92 C160 88 168 80 172 66 Z",
   "vent": "M80 116 C86 121 94 124 102 126 C96 130 86 128 80 122 Z",
   "black": "shadow",
   "crest": "M154 62 C149 54 142 50 132 48 C142 52 148 58 150 64 Z"
  },
  "juvenile": {
   "body_pitch": 4,
   "wing_pitch": 4,
   "eye_ring": 0,
   "bill": "ink",
   "belly": "M178 62 C178 80 176 94 172 106 C164 106 156 100 152 92 C160 88 168 80 172 66 Z",
   "vent": "M80 116 C86 121 94 124 102 126 C96 130 86 128 80 122 Z",
   "black": "shadow",
   "crest": "M154 62 C149 54 142 50 132 48 C142 52 148 58 150 64 Z"
  }
 },
 "callouts": [
  {
   "id": "head",
   "leader": "M128 40 L100 30",
   "at": [
    96,
    24
   ],
   "align": "right",
   "male": {
    "en": "VERY LONG CREST",
    "no": "SVÆRT LANG TOPP",
    "verified": true
   },
   "female": {
    "en": "SHORTER CREST",
    "no": "KORTERE TOPP",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "plumage",
   "leader": "M112 118 L80 160",
   "at": [
    76,
    172
   ],
   "align": "centre",
   "male": {
    "en": "DARK GREEN, GLOSSY",
    "no": "MØRK GRØNN, GLINSENDE",
    "verified": true
   },
   "female": {
    "en": "DARK GREEN, GLOSSY",
    "no": "MØRK GRØNN, GLINSENDE",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  },
  {
   "id": "breast",
   "leader": "M170 96 L222 160",
   "at": [
    226,
    172
   ],
   "align": "centre",
   "male": {
    "en": "BLACK, WHITE BELLY",
    "no": "SVART, HVIT BUK",
    "verified": true
   },
   "female": {
    "en": "MOTTLED WITH WHITE",
    "no": "VATRET MED HVITT",
    "verified": true
   },
   "juvenile": {
    "en": "",
    "no": "",
    "verified": false
   }
  }
 ],
 "captions": {
  "male": {
   "en": "Male. Beak and tail follow the sound.",
   "no": "Hann. Nebb og hale følger lyden.",
   "verified": true
  },
  "female": {
   "en": "Female. Shorter crest.",
   "no": "Hunn. Kortere topp.",
   "verified": true
  },
  "juvenile": {
   "en": "Young bird. Not described in the sources, so drawn like the female.",
   "no": "Ungfugl. Ikke beskrevet i kildene, så tegnet som hunnen.",
   "verified": false
  }
 }
}
`,so=`{
 "_note": "Lapwing, M11 batch 7. Verified by SNL: very vocal in the breeding season with high, penetrating plaintive calls; early in spring the male's display flight with its characteristic hoarse song and humming sounds from the wings. No transcription, so all shapes are sound design guesses: the song slot is a wing hum (low breathy note pulsing at the wingbeat) around hoarse slurred notes; the call slot a high plaintive slurred note.",
 "syllables": {
  "hum": {
   "dur_ms": 1100,
   "pitch": [
    [
     0,
     240
    ],
    [
     0.5,
     260
    ],
    [
     1,
     230
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.2,
     0.8
    ],
    [
     0.7,
     1
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.6,
   "breath": 45,
   "tension": -20,
   "trill": {
    "hz": 5.5,
    "depth_st": 0.3,
    "am": 1.0
   }
  },
  "hoarse": {
   "dur_ms": 380,
   "pitch": [
    [
     0,
     1800
    ],
    [
     0.35,
     2700
    ],
    [
     0.7,
     2400
    ],
    [
     1,
     1600
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.7,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75,
   "rough": 45
  },
  "hoarse2": {
   "dur_ms": 300,
   "pitch": [
    [
     0,
     2200
    ],
    [
     0.4,
     2900
    ],
    [
     1,
     1900
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.08,
     1
    ],
    [
     0.7,
     0.8
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "rough": 45
  },
  "plaint": {
   "dur_ms": 460,
   "pitch": [
    [
     0,
     2400
    ],
    [
     0.35,
     3400
    ],
    [
     0.7,
     3200
    ],
    [
     1,
     2500
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     0.9
    ],
    [
     0.5,
     1
    ],
    [
     0.85,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.75,
   "tension": 10
  },
  "plaint2": {
   "dur_ms": 380,
   "pitch": [
    [
     0,
     2600
    ],
    [
     0.4,
     3300
    ],
    [
     1,
     2400
    ]
   ],
   "amp": [
    [
     0,
     0
    ],
    [
     0.1,
     0.9
    ],
    [
     0.5,
     1
    ],
    [
     0.85,
     0.7
    ],
    [
     1,
     0
    ]
   ],
   "gain": 0.7,
   "tension": 10
  }
 },
 "types": {
  "song": {
   "pause_s": [
    4.0,
    10.0
   ],
   "length_s": [
    2.4,
    4.4
   ],
   "transpose_st": 0.6,
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     20,
     30
    ],
    "vo_tension": [
     50,
     64
    ],
    "vo_rough": [
     20,
     32
    ],
    "ph_tempo": [
     96,
     104
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "hum"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.3,
       "gap_ms": [
        80,
        80
       ]
      },
      {
       "pool": [
        "hoarse",
        "hoarse2"
       ],
       "count": [
        2,
        4
       ],
       "share": 0.4,
       "gap_ms": [
        90,
        180
       ]
      },
      {
       "pool": [
        "hum"
       ],
       "count": [
        1,
        1
       ],
       "share": 0.3,
       "gap_ms": [
        80,
        80
       ],
       "lead_gap_ms": [
        80,
        160
       ]
      }
     ]
    }
   ],
   "overrides": [
    {
     "_note": "The male's display (SNL).",
     "when": {
      "sex": "female"
     },
     "active": false
    },
    {
     "_note": "Early in spring, breeding season (SNL).",
     "when": {
      "season": "autumn"
     },
     "active": false
    },
    {
     "when": {
      "season": "winter"
     },
     "active": false
    }
   ]
  },
  "call": {
   "pause_s": [
    2.0,
    6.0
   ],
   "length_s": [
    0.4,
    2.0
   ],
   "avoid_repeat": false,
   "auto": {
    "vo_pitch": [
     0.98,
     1.02
    ],
    "vo_breath": [
     16,
     26
    ],
    "vo_tension": [
     60,
     74
    ],
    "vo_rough": [
     6,
     14
    ]
   },
   "phrases": [
    {
     "weight": 1,
     "sections": [
      {
       "pool": [
        "plaint",
        "plaint2"
       ],
       "count": [
        1,
        3
       ],
       "share": 1.0,
       "gap_ms": [
        400,
        800
       ]
      }
     ]
    }
   ],
   "overrides": []
  }
 }
}
`,ao=`{
 "_note": "Sound design starting values for the lapwing, M11 batch 7. Not bird facts.",
 "pitch_ref_hz": 2600,
 "base": {
  "vo_pitch": 1.0,
  "vo_breath": 24,
  "vo_tension": 60,
  "vo_trill": 0,
  "vo_rough": 20,
  "ph_tempo": 100,
  "ph_pause": 6.0,
  "ph_length": 3.0,
  "ph_variation": 50,
  "su_distance": 40,
  "su_wind": 1.5,
  "su_space": 45
 },
 "ranges": {
  "vo_pitch": [
   0.5,
   2.0
  ],
  "vo_breath": [
   0,
   100
  ],
  "vo_tension": [
   0,
   100
  ],
  "vo_trill": [
   0,
   40
  ],
  "vo_rough": [
   0,
   100
  ],
  "ph_tempo": [
   50,
   200
  ],
  "ph_pause": [
   0.2,
   20
  ],
  "ph_length": [
   0.2,
   8
  ],
  "ph_variation": [
   0,
   100
  ],
  "su_distance": [
   1,
   200
  ],
  "su_wind": [
   0,
   15
  ],
  "su_space": [
   0,
   100
  ]
 }
}
`,oo=`{
 "_note": "Dawn chorus setup. Entry minutes are relative to sunrise. Robin, blackbird, song thrush and great tit are the placeholders from design/Chorus.dc.html; birds.md says they have no source. Every other bird has no number at all and enters at default_entry_min, also a placeholder. Eirik supplies the real times. Lane 3 is the song thrush, as in the design (it was the chaffinch until the song thrush had sound in M10). Distances are the design's 20, 12 and 45 m; the fourth lane is muted in the design and shows no distance, 30 m is mine.",
 "verified": false,
 "default_entry_min": -40,
 "entry_min": {
  "rodstrupe": -70,
  "svarttrost": -60,
  "maltrost": -50,
  "kjottmeis": -25
 },
 "lanes": [
  { "bird": "rodstrupe", "distance_m": 20 },
  { "bird": "svarttrost", "distance_m": 12 },
  { "bird": "maltrost", "distance_m": 45 },
  { "bird": "kjottmeis", "distance_m": 30 }
 ]
}
`,ro=`{
 "tab.play": "PLAY",
 "tab.guide": "FIELD GUIDE",
 "tab.quiz": "QUIZ",
 "tab.chorus": "CHORUS",
 "tab.log": "LOG",
 "tab.collection": "COLLECTION",
 "header.language": "LANGUAGE",
 "header.out": "OUT",
 "list.birds": "BIRDS",
 "group.garden": "GARDEN",
 "group.forest": "FOREST",
 "group.coast": "COAST AND WATER",
 "group.wetland": "WETLAND AND LAKE",
 "group.mountain": "MOUNTAIN",
 "group.farmland": "FARMLAND",
 "group.night": "NIGHT",
 "plate.male": "MALE",
 "plate.female": "FEMALE",
 "plate.adult": "ADULT",
 "plate.juv": "JUV",
 "plate.bill": "BILL",
 "plate.eye_ring": "EYE-RING",
 "plate.plumage": "PLUMAGE",
 "plate.throat": "THROAT",
 "plate.head": "HEAD",
 "plate.cheek": "CHEEK",
 "plate.breast": "BREAST",
 "plate.eye_stripe": "EYE STRIPE",
 "plate.wing": "WING",
 "plate.tail": "TAIL",
 "plate.neck": "NECK",
 "fig": "FIG.",
 "not_described": "Not described",
 "song.title": "Song",
 "song.draw": "DRAW",
 "song.speed": "SPEED",
 "song.shift": "HEARING SHIFT",
 "song.shift_off": "OFF",
 "song.shift_oct": "−1 OCT",
 "song.phrase": "PHRASE",
 "song.length": "LENGTH",
 "song.now": "NOW",
 "song.by_hand": "BY HAND",
 "song.caption": "{bird} {type}, {season}, {time}, in kHz. Ink is sung. Grey is what autoplay sings next.",
 "song.erase": "ERASE",
 "song.clear": "CLEAR",
 "song.sing_it": "SING IT",
 "song.keep": "KEEP AS PHRASE",
 "song.your_phrase": "YOUR PHRASE STARTS",
 "song.draw_caption": "Draw mode. Autoplay waits. The bird sings your line in its own voice. Grey is the last phrase it sang.",
 "scene": "SCENE",
 "scene.season": "SEASON",
 "scene.time": "TIME OF DAY",
 "scene.type": "SONG TYPE",
 "scene.place": "PLACE",
 "scene.dialect": "DIALECT",
 "scene.mimics": "MIMICS",
 "scene.dialect_none": "NONE",
 "scene.mimics_none": "NO ONE",
 "season.spring": "SPRING",
 "season.summer": "SUMMER",
 "season.autumn": "AUTUMN",
 "season.winter": "WINTER",
 "time.dawn": "DAWN",
 "time.day": "DAY",
 "time.dusk": "DUSK",
 "time.night": "NIGHT",
 "type.song": "SONG",
 "type.call": "CALL",
 "type.alarm": "ALARM",
 "type.flight": "FLIGHT",
 "place.garden": "GARDEN",
 "place.forest": "FOREST",
 "place.open": "OPEN",
 "place.shore": "SHORE",
 "group.voice": "VOICE",
 "group.phrasing": "PHRASING",
 "group.surroundings": "SURROUNDINGS",
 "knob.vo_pitch": "PITCH",
 "knob.vo_breath": "BREATH",
 "knob.vo_tension": "TENSION",
 "knob.vo_trill": "TRILL",
 "knob.vo_rough": "ROUGH",
 "knob.ph_tempo": "TEMPO",
 "knob.ph_pause": "PAUSE",
 "knob.ph_length": "LENGTH",
 "knob.ph_variation": "VARIATION",
 "knob.su_distance": "DISTANCE",
 "knob.su_wind": "WIND",
 "knob.su_space": "SPACE",
 "knob.hand": "HAND",
 "ap.title": "Autoplay",
 "ap.on": "AUTOPLAY ON",
 "ap.off": "AUTOPLAY OFF",
 "ap.hold": "HOLD AFTER RELEASE",
 "ap.latch": "LATCH",
 "ap.return_all": "RETURN ALL",
 "ap.sing_once": "SING ONCE",
 "ap.reroll": "REROLL",
 "ap.legend_auto": "SUNG BY AUTOPLAY",
 "ap.legend_hand": "{knob} HELD BY HAND",
 "ap.latched": "LATCHED",
 "ap.stays": "STAYS",
 "status.playing": "PLAYING",
 "status.stopped": "STOPPED",
 "status.keys_play": "SPACE PLAY",
 "status.keys_bird": "UP DOWN BIRD",
 "status.keys_screen": "F1 TO F6 SCREEN",
 "status.not_yet": "NOT IN THIS BUILD YET",
 "error.load": "CANNOT LOAD {bird}: {error}",
 "ap.legend_hand_any": "HELD BY HAND",
 "lang.en": "EN",
 "lang.no": "NO",
 "guide.male_female": "MALE AND FEMALE",
 "guide.facts": "FIELD FACTS",
 "guide.song_notes": "SONG NOTES",
 "guide.year": "YEAR IN NORWAY",
 "guide.lookalikes": "LOOKALIKES",
 "guide.compare": "COMPARE",
 "guide.xeno": "REAL RECORDINGS AT XENO-CANTO",
 "guide.mnemonic": "MNEMONIC",
 "guide.no_lookalikes": "The sources name none.",
 "guide.fig_phrase": "One phrase, {s} s, in kHz.",
 "guide.song_row": "SONG",
 "fact.norwegian": "NORWEGIAN",
 "fact.english": "ENGLISH",
 "fact.latin": "LATIN",
 "fact.length": "LENGTH",
 "fact.broods": "BROODS",
 "fact.range": "RANGE",
 "fact.habitat": "HABITAT",
 "fact.food": "FOOD",
 "fact.status": "STATUS",
 "fact.nest": "NEST",
 "cal.season": "SEASON",
 "cal.present": "IN NORWAY",
 "cal.sings": "SINGS",
 "cal.months": "J|F|M|A|M|J|J|A|S|O|N|D",
 "season.winter_short": "WIN",
 "status.comparing": "COMPARING: {a}, THEN {b}",
 "unit.s": "s",
 "unit.db": "dB",
 "axis.khz": "{n}k",
 "error.index": "CANNOT READ data/birds/index.json",
 "_note": "Interface strings, English. Keys are shared with no.json.",
 "quiz.question": "QUESTION {n} OF {total}",
 "quiz.question_none": "QUIZ",
 "quiz.title": "Who is singing?",
 "quiz.play_again": "PLAY AGAIN",
 "quiz.half": "HALF SPEED",
 "quiz.hint": "HINT",
 "quiz.correct": "CORRECT",
 "quiz.your_answer": "YOUR ANSWER",
 "quiz.compare": "COMPARE BOTH",
 "quiz.open_guide": "OPEN IN FIELD GUIDE",
 "quiz.next": "NEXT",
 "quiz.again": "START AGAIN",
 "quiz.birds": "BIRDS IN THE QUIZ",
 "quiz.set.pairs": "LOOKALIKE PAIRS",
 "quiz.set.garden": "GARDEN",
 "quiz.set.forest": "FOREST",
 "quiz.set.coast": "COAST AND WATER",
 "quiz.set.wetland": "WETLAND AND LAKE",
 "quiz.set.mountain": "MOUNTAIN",
 "quiz.set.farmland": "FARMLAND",
 "quiz.set.night": "NIGHT",
 "quiz.set.all": "ALL {n} BIRDS",
 "quiz.ask": "ASK FOR",
 "quiz.ask_both": "BOTH",
 "quiz.hints": "HINTS",
 "quiz.hints_none": "NONE",
 "quiz.score": "SCORE",
 "quiz.score_correct": "CORRECT",
 "quiz.score_missed": "MISSED",
 "quiz.score_left": "LEFT",
 "quiz.practise": "Missed birds come back sooner. Practise next: {birds}.",
 "quiz.practise_none": "Missed birds come back sooner.",
 "quiz.and": " and ",
 "quiz.fig": "Mystery {type}, {season}, {time}, in kHz. The plate and the bird name stay hidden until you answer.",
 "quiz.fig_answered": "{bird}, {type}, {season}, {time}, in kHz.",
 "quiz.prompt": "Listen, then pick one of the four. Keys 1 to 4.",
 "quiz.hint_mnemonic": "Mnemonic: {text}",
 "quiz.hint_season": "Sings in: {months}",
 "quiz.months_unknown": "not given in the sources",
 "quiz.explain_right": "{bird}. {text}",
 "quiz.explain_wrong": "{bird}, not {pick}. {text}",
 "quiz.differs": "{bird}: {text}",
 "quiz.done": "Done: {correct} of {total} right.",
 "quiz.length": "QUESTIONS",
 "quiz.see_result": "SEE RESULT",
 "quiz.result": "RESULT",
 "quiz.result_score": "{correct} of {total}",
 "quiz.result_pct": "{pct} % right",
 "quiz.result_missed": "MISSED",
 "quiz.result_taken": "taken for {bird}",
 "quiz.result_times": "{n} times",
 "quiz.result_none": "No birds missed.",
 "quiz.no_birds": "No bird in this set has sound in this build yet.",
 "quiz.status_keys_answer": "1 2 3 4 ANSWER",
 "quiz.status_keys_again": "SPACE PLAY AGAIN",
 "quiz.status_keys_next": "ENTER NEXT",
 "cal.month_names": "January|February|March|April|May|June|July|August|September|October|November|December",
 "chorus.morning": "MORNING",
 "chorus.dawn_speed": "DAWN SPEED",
 "chorus.speed_real": "REAL TIME",
 "chorus.speed_loop": "LOOP",
 "chorus.title": "Dawn chorus",
 "chorus.now": "NOW",
 "chorus.before": "{n} min before sunrise",
 "chorus.after": "{n} min after sunrise",
 "chorus.at": "at sunrise",
 "chorus.singing": "SINGING",
 "chorus.of": "{n} of {total}",
 "chorus.mute": "MUTE",
 "chorus.solo": "SOLO",
 "chorus.change": "CHANGE BIRD",
 "chorus.muted": "MUTED",
 "chorus.sunrise": "SUNRISE",
 "chorus.axis_min": "{n} min",
 "chorus.caption": "Who starts when, in minutes from sunrise. The order and times are Pipp's estimates, not from a source.",
 "chorus.note": "Up to 4 birds, one per track colour. Each bird keeps the voice and phrasing you set on the Play screen. The right-hand figure is the distance to the listener.",
 "chorus.status": "DAWN CHORUS, {season}, {place}, {speed}",
 "chorus.status_done": "DAWN CHORUS DONE",
 "chorus.keys_mute": "1 2 3 4 MUTE",
 "status.keys_screen_web": "F1 TO F6 SCREEN",
 "log.form": "I HEARD IT",
 "log.bird": "BIRD",
 "log.date": "DATE",
 "log.time": "TIME",
 "log.place": "PLACE",
 "log.place_hint": "Where were you?",
 "log.heard": "HEARD",
 "log.saw": "SAW",
 "log.saw_juvenile": "JUVENILE",
 "log.saw_none": "ONLY HEARD",
 "log.note": "NOTE",
 "log.note_hint": "Anything worth remembering",
 "log.add": "ADD TO LOG",
 "log.report": "REPORT AT ARTSOBSERVASJONER",
 "log.manners": "FIELD MANNERS",
 "log.manners_text": "Use Pipp to learn, then go out and listen. Playing song outdoors to draw birds in stresses them, most of all in the breeding season. Keep the volume down outside and never play near a nest.",
 "log.list": "LOG",
 "log.heard_count": "{n} OF {total} BIRDS HEARD",
 "log.col_place_note": "PLACE AND NOTE",
 "log.open": "OPEN BIRD",
 "log.delete": "DELETE ENTRY",
 "log.export": "EXPORT CSV",
 "log.entries": "{n} ENTRIES, KEPT ON THIS DEVICE",
 "log.entries_one": "1 ENTRY, KEPT ON THIS DEVICE",
 "log.keys_entry": "UP DOWN ENTRY",
 "log.keys_open": "ENTER OPEN BIRD",
 "log.bad_date": "DATE MUST READ YYYY-MM-DD",
 "log.bad_time": "TIME MUST READ HH:MM",
 "log.added": "ADDED: {bird}",
 "log.deleted": "DELETED: {bird}",
 "log.csv_bird_latin": "LATIN",
 "phone.tab.play": "PLAY",
 "phone.tab.guide": "GUIDE",
 "phone.tab.listen": "LISTEN",
 "phone.tab.quiz": "QUIZ",
 "phone.tab.chorus": "CHORUS",
 "phone.tab.collection": "COLLECTION",
 "phone.scene.time": "TIME",
 "phone.scene.type": "TYPE",
 "phone.ap.hold": "HOLD",
 "phone.pick_bird": "Choose bird",
 "phone.close": "CLOSE",
 "phone.quiz.setup": "SETUP",
 "phone.quiz.correct": "{n} CORRECT",
 "phone.quiz.change": "CHANGE",
 "phone.chorus.change_all": "CHANGE BIRDS",
 "phone.log.new": "I HEARD IT: NEW LINE",
 "phone.coll.media": "RECORDINGS AND PICTURES",
 "phone.coll.log": "LOG",
 "phone.coll.empty_title": "The collection is empty",
 "phone.coll.empty_text": "Recordings you save from Listen and pictures you take end up here, sorted by bird.",
 "phone.coll.go_listen": "GO TO LISTEN",
 "phone.coll.new_picture": "NEW PICTURE",
 "phone.coll.note": "Everything stays on the phone. No account, no upload.",
 "phone.coll.status_empty": "0 RECORDINGS, 0 PICTURES",
 "phone.guide.status": "FIELD GUIDE",
 "phone.quiz.open_guide": "OPEN IN GUIDE",
 "listen.start": "START LISTENING",
 "listen.listening": "LISTENING",
 "listen.mic": "Microphone",
 "listen.mic_short": "MIC",
 "listen.last_4s": "LAST 4 s",
 "listen.off": "OFF",
 "listen.caption": "What the microphone hears.",
 "listen.who": "Who is singing?",
 "listen.suggestions": "{n} SUGGESTIONS",
 "listen.song": "song",
 "listen.unsure": "unsure",
 "listen.not_in_pipp": "NOT IN PIPP",
 "listen.save": "SAVE RECORDING",
 "listen.picture": "TAKE PICTURE",
 "listen.compare": "COMPARE",
 "listen.open_collection": "OPEN COLLECTION",
 "listen.note": "Compare plays the recording, then Pipp's bird. Save recording puts the sound in your collection under the bird, and in the log. Nothing is saved until you ask. Below 50 % shows as unsure. Recognition is a test stand-in for now and always gives the same answer.",
 "listen.which": "Which bird was it?",
 "listen.file_under": "FILE UNDER",
 "listen.note_record": "Pipp does not recognise birds yet. Choose the bird you heard: Save recording puts the sound in your collection under it, and in the log, and Compare plays the recording, then Pipp's bird. Nothing is saved until you ask.",
 "listen.denied_title": "Pipp may not use the microphone",
 "listen.denied_text": "Turn on the microphone for Pipp in the phone's settings, so Pipp can record the birds you hear. The sound is handled on the phone, and nothing is saved until you ask.",
 "listen.unsupported_title": "No microphone here",
 "listen.unsupported_text": "This browser does not let Pipp use a microphone. Try the phone app, or Safari or Chrome.",
 "listen.settings": "OPEN SETTINGS",
 "listen.denied_note": "Play, Guide, Quiz and Chorus work without the microphone.",
 "listen.status_listening": "LISTENING",
 "listen.status_off": "MICROPHONE OFF",
 "listen.offline": "NO NETWORK USED",
 "listen.saved": "SAVED: {bird}",
 "listen.picture_saved": "PICTURE SAVED: {bird}",
 "coll.all_birds": "ALL BIRDS",
 "coll.one_bird": "One bird",
 "coll.change_bird": "CHANGE BIRD",
 "coll.recordings": "RECORDINGS",
 "coll.pictures": "PICTURES",
 "coll.select": "SELECT",
 "coll.done": "DONE",
 "coll.share": "SHARE",
 "coll.export": "EXPORT",
 "coll.play": "Play recording",
 "coll.note": "Recordings and pictures stay on the phone, sorted by bird. The percentage is how sure the recognition was.",
 "coll.counts": "{r} RECORDINGS, {p} PICTURES",
 "coll.share_unavailable": "SHARING IS NOT AVAILABLE HERE",
 "coll.delete": "DELETE",
 "coll.delete_confirm": "DELETE {n}?",
 "coll.deleted": "{n} DELETED",
 "coll.close": "CLOSE",
 "coll.prev_picture": "Previous picture",
 "coll.next_picture": "Next picture",
 "coll.exporting": "MAKING THE EXPORT",
 "coll.export_saved": "{file} SAVED",
 "coll.import": "IMPORT FROM PHONE EXPORT",
 "coll.add_files": "ADD FILES",
 "coll.add_picture": "ADD PICTURE",
 "coll.rec_pic": "REC · PIC",
 "coll.all_birds_row": "All birds",
 "coll.outside": "Not in Pipp",
 "coll.col_sonogram": "SONOGRAM",
 "coll.col_heard": "HEARD",
 "coll.col_length": "LENGTH",
 "coll.col_date": "DATE",
 "coll.col_match": "MATCH",
 "coll.col_from": "FROM",
 "coll.from_phone": "Phone",
 "coll.from_file": "File",
 "coll.compare_pipp": "COMPARE WITH PIPP",
 "coll.open_play": "OPEN IN PLAY",
 "coll.show_finder": "SHOW IN FINDER",
 "coll.finder_web": "Not available in a browser",
 "coll.desk_note": "The Mac has no microphone recognition. Recordings and pictures arrive here from the phone app's export, or from files you add. Nothing syncs by itself.",
 "coll.cannot_play": "THIS BROWSER CANNOT PLAY THE RECORDING",
 "coll.importing": "READING THE EXPORT",
 "coll.imported": "IMPORTED {r} RECORDINGS, {p} PICTURES; {k} ALREADY HERE",
 "coll.import_broken": "{n} MISSING IN THE FILE",
 "coll.import_failed": "NOT IMPORTED: {why}",
 "coll.added": "ADDED {n} FILES",
 "coll.added_skipped": "ADDED {n} FILES, SKIPPED {k} THAT ARE NOT SOUND OR PICTURES",
 "coll.err_zip": "NOT A READABLE ZIP FILE",
 "coll.err_read": "THE FILE COULD NOT BE READ",
 "coll.err_manifest": "NO MANIFEST.JSON IN THE ZIP",
 "coll.err_format": "NOT A PIPP EXPORT",
 "coll.col_bird": "BIRD",
 "coll.cannot_play_mac": "THE RECORDING CANNOT BE PLAYED",
 "coll.cannot_show": "THIS PICTURE CANNOT BE SHOWN HERE",
 "coll.export_failed": "THE EXPORT COULD NOT BE SAVED"
}
`,lo=`{
 "tab.play": "SPILL",
 "tab.guide": "FELTGUIDE",
 "tab.quiz": "QUIZ",
 "tab.chorus": "KOR",
 "tab.log": "LOGG",
 "tab.collection": "SAMLING",
 "header.language": "SPRÅK",
 "header.out": "UT",
 "list.birds": "FUGLER",
 "group.garden": "HAGE",
 "group.forest": "SKOG",
 "group.coast": "KYST OG VANN",
 "group.wetland": "VÅTMARK OG INNSJØ",
 "group.mountain": "FJELL",
 "group.farmland": "KULTURLANDSKAP",
 "group.night": "NATT",
 "plate.male": "HANN",
 "plate.female": "HUNN",
 "plate.adult": "VOKSEN",
 "plate.juv": "UNG",
 "plate.bill": "NEBB",
 "plate.eye_ring": "ØYERING",
 "plate.plumage": "FJÆRDRAKT",
 "plate.throat": "STRUPE",
 "plate.head": "HODE",
 "plate.cheek": "KINN",
 "plate.breast": "BRYST",
 "plate.eye_stripe": "ØYESTRIPE",
 "plate.wing": "VINGE",
 "plate.tail": "HALE",
 "plate.neck": "HALS",
 "fig": "FIG.",
 "not_described": "Ikke beskrevet",
 "song.title": "Sang",
 "song.draw": "TEGN",
 "song.speed": "FART",
 "song.shift": "HØRSELSSKIFT",
 "song.shift_off": "AV",
 "song.shift_oct": "−1 OKT",
 "song.phrase": "FRASE",
 "song.length": "LENGDE",
 "song.now": "NÅ",
 "song.by_hand": "FOR HÅND",
 "song.caption": "{bird}, {type}, {season}, {time}, i kHz. Blekk er sunget. Grått er det autospill synger videre.",
 "song.erase": "VISK UT",
 "song.clear": "TØM",
 "song.sing_it": "SYNG DEN",
 "song.keep": "BEHOLD SOM FRASE",
 "song.your_phrase": "FRASEN DIN STARTER",
 "song.draw_caption": "Tegnemodus. Autospill venter. Fuglen synger streken din med sin egen stemme. Grått er den siste frasen den sang.",
 "scene": "SCENE",
 "scene.season": "ÅRSTID",
 "scene.time": "TID PÅ DØGNET",
 "scene.type": "LÅTTYPE",
 "scene.place": "STED",
 "scene.dialect": "DIALEKT",
 "scene.mimics": "HERMER",
 "scene.dialect_none": "INGEN",
 "scene.mimics_none": "INGEN",
 "season.spring": "VÅR",
 "season.summer": "SOMMER",
 "season.autumn": "HØST",
 "season.winter": "VINTER",
 "time.dawn": "GRY",
 "time.day": "DAG",
 "time.dusk": "SKUMRING",
 "time.night": "NATT",
 "type.song": "SANG",
 "type.call": "LOKKE",
 "type.alarm": "VARSEL",
 "type.flight": "FLUKT",
 "place.garden": "HAGE",
 "place.forest": "SKOG",
 "place.open": "ÅPENT",
 "place.shore": "STRAND",
 "group.voice": "STEMME",
 "group.phrasing": "FRASERING",
 "group.surroundings": "OMGIVELSER",
 "knob.vo_pitch": "TONEHØYDE",
 "knob.vo_breath": "PUST",
 "knob.vo_tension": "SPENNING",
 "knob.vo_trill": "TRILLE",
 "knob.vo_rough": "RU",
 "knob.ph_tempo": "TEMPO",
 "knob.ph_pause": "PAUSE",
 "knob.ph_length": "LENGDE",
 "knob.ph_variation": "VARIASJON",
 "knob.su_distance": "AVSTAND",
 "knob.su_wind": "VIND",
 "knob.su_space": "ROM",
 "knob.hand": "HÅND",
 "ap.title": "Autospill",
 "ap.on": "AUTOSPILL PÅ",
 "ap.off": "AUTOSPILL AV",
 "ap.hold": "HOLD ETTER SLIPP",
 "ap.latch": "LÅS",
 "ap.return_all": "TILBAKE ALLE",
 "ap.sing_once": "SYNG ÉN GANG",
 "ap.reroll": "NYTT FRØ",
 "ap.legend_auto": "SUNGET AV AUTOSPILL",
 "ap.legend_hand": "{knob} HOLDT FOR HÅND",
 "ap.latched": "LÅST",
 "ap.stays": "BLIR",
 "status.playing": "SPILLER",
 "status.stopped": "STOPPET",
 "status.keys_play": "MELLOMROM SPILL",
 "status.keys_bird": "OPP NED FUGL",
 "status.keys_screen": "F1 TIL F6 SKJERM",
 "status.not_yet": "IKKE I DENNE VERSJONEN ENNÅ",
 "error.load": "KAN IKKE LASTE {bird}: {error}",
 "ap.legend_hand_any": "HOLDT FOR HÅND",
 "lang.en": "EN",
 "lang.no": "NO",
 "guide.male_female": "HANN OG HUNN",
 "guide.facts": "FELTFAKTA",
 "guide.song_notes": "OM SANGEN",
 "guide.year": "ÅRET I NORGE",
 "guide.lookalikes": "FORVEKSLINGSARTER",
 "guide.compare": "SAMMENLIGN",
 "guide.xeno": "EKTE OPPTAK PÅ XENO-CANTO",
 "guide.mnemonic": "HUSKEREGEL",
 "guide.no_lookalikes": "Kildene nevner ingen.",
 "guide.fig_phrase": "Én frase, {s} s, i kHz.",
 "guide.song_row": "SANG",
 "fact.norwegian": "NORSK",
 "fact.english": "ENGELSK",
 "fact.latin": "LATIN",
 "fact.length": "LENGDE",
 "fact.broods": "KULL",
 "fact.range": "UTBREDELSE",
 "fact.habitat": "LEVESTED",
 "fact.food": "FØDE",
 "fact.status": "STATUS",
 "fact.nest": "REIR",
 "cal.season": "ÅRSTID",
 "cal.present": "I NORGE",
 "cal.sings": "SYNGER",
 "cal.months": "J|F|M|A|M|J|J|A|S|O|N|D",
 "season.winter_short": "VIN",
 "status.comparing": "SAMMENLIGNER: {a}, SÅ {b}",
 "unit.s": "s",
 "unit.db": "dB",
 "axis.khz": "{n}k",
 "error.index": "KAN IKKE LESE data/birds/index.json",
 "_note": "Grensesnittstrenger, bokmål. Norwegian uses a decimal comma. Wording to be checked by Eirik.",
 "quiz.question": "SPØRSMÅL {n} AV {total}",
 "quiz.question_none": "QUIZ",
 "quiz.title": "Hvem synger?",
 "quiz.play_again": "SPILL IGJEN",
 "quiz.half": "HALV FART",
 "quiz.hint": "HINT",
 "quiz.correct": "RIKTIG",
 "quiz.your_answer": "DITT SVAR",
 "quiz.compare": "HØR BEGGE",
 "quiz.open_guide": "ÅPNE I FELTGUIDE",
 "quiz.next": "NESTE",
 "quiz.again": "START PÅ NYTT",
 "quiz.birds": "FUGLER I QUIZEN",
 "quiz.set.pairs": "FORVEKSLINGSPAR",
 "quiz.set.garden": "HAGE",
 "quiz.set.forest": "SKOG",
 "quiz.set.coast": "KYST OG VANN",
 "quiz.set.wetland": "VÅTMARK OG INNSJØ",
 "quiz.set.mountain": "FJELL",
 "quiz.set.farmland": "KULTURLANDSKAP",
 "quiz.set.night": "NATT",
 "quiz.set.all": "ALLE {n} FUGLER",
 "quiz.ask": "SPØR OM",
 "quiz.ask_both": "BEGGE",
 "quiz.hints": "HINT",
 "quiz.hints_none": "INGEN",
 "quiz.score": "POENG",
 "quiz.score_correct": "RIKTIG",
 "quiz.score_missed": "BOM",
 "quiz.score_left": "IGJEN",
 "quiz.practise": "Fugler du bommer på, kommer tilbake raskere. Øv neste gang på: {birds}.",
 "quiz.practise_none": "Fugler du bommer på, kommer tilbake raskere.",
 "quiz.and": " og ",
 "quiz.fig": "Ukjent {type}, {season}, {time}, i kHz. Bildet og navnet på fuglen er skjult til du svarer.",
 "quiz.fig_answered": "{bird}, {type}, {season}, {time}, i kHz.",
 "quiz.prompt": "Lytt, og velg ett av de fire svarene. Tastene 1 til 4.",
 "quiz.hint_mnemonic": "Huskeregel: {text}",
 "quiz.hint_season": "Synger i: {months}",
 "quiz.months_unknown": "ikke oppgitt i kildene",
 "quiz.explain_right": "{bird}. {text}",
 "quiz.explain_wrong": "{bird}, ikke {pick}. {text}",
 "quiz.differs": "{bird}: {text}",
 "quiz.done": "Ferdig: {correct} av {total} riktig.",
 "quiz.length": "SPØRSMÅL",
 "quiz.see_result": "SE RESULTAT",
 "quiz.result": "RESULTAT",
 "quiz.result_score": "{correct} av {total}",
 "quiz.result_pct": "{pct} % riktig",
 "quiz.result_missed": "BOM",
 "quiz.result_taken": "tatt for {bird}",
 "quiz.result_times": "{n} ganger",
 "quiz.result_none": "Ingen bom.",
 "quiz.no_birds": "Ingen fugl i dette utvalget har lyd i denne versjonen ennå.",
 "quiz.status_keys_answer": "1 2 3 4 SVAR",
 "quiz.status_keys_again": "MELLOMROM SPILL IGJEN",
 "quiz.status_keys_next": "ENTER NESTE",
 "cal.month_names": "januar|februar|mars|april|mai|juni|juli|august|september|oktober|november|desember",
 "chorus.morning": "MORGEN",
 "chorus.dawn_speed": "FART",
 "chorus.speed_real": "SANNTID",
 "chorus.speed_loop": "SLØYFE",
 "chorus.title": "Morgenkor",
 "chorus.now": "NÅ",
 "chorus.before": "{n} min før soloppgang",
 "chorus.after": "{n} min etter soloppgang",
 "chorus.at": "ved soloppgang",
 "chorus.singing": "SYNGER",
 "chorus.of": "{n} av {total}",
 "chorus.mute": "DEMP",
 "chorus.solo": "SOLO",
 "chorus.change": "BYTT FUGL",
 "chorus.muted": "DEMPET",
 "chorus.sunrise": "SOL OPP",
 "chorus.axis_min": "{n} min",
 "chorus.caption": "Hvem begynner når, i minutter fra soloppgang. Rekkefølgen og tidene er Pipps anslag, ikke fra en kilde.",
 "chorus.note": "Opptil 4 fugler, én per sporfarge. Hver fugl beholder stemmen og fraseringen du har satt i Spill. Tallet til høyre er avstanden til lytteren.",
 "chorus.status": "MORGENKOR, {season}, {place}, {speed}",
 "chorus.status_done": "MORGENKOR FERDIG",
 "chorus.keys_mute": "1 2 3 4 DEMP",
 "status.keys_screen_web": "F1 TIL F6 SKJERM",
 "log.form": "JEG HØRTE DEN",
 "log.bird": "FUGL",
 "log.date": "DATO",
 "log.time": "TID",
 "log.place": "STED",
 "log.place_hint": "Hvor var du?",
 "log.heard": "HØRTE",
 "log.saw": "SÅ",
 "log.saw_juvenile": "UNGFUGL",
 "log.saw_none": "BARE HØRT",
 "log.note": "NOTAT",
 "log.note_hint": "Noe verdt å huske",
 "log.add": "LEGG I LOGGEN",
 "log.report": "MELD INN PÅ ARTSOBSERVASJONER",
 "log.manners": "FELTSKIKK",
 "log.manners_text": "Bruk Pipp til å lære, og gå så ut og lytt. Å spille sang ute for å lokke fugler stresser dem, mest i hekketiden. Hold lyden lav ute, og spill aldri nær et reir.",
 "log.list": "LOGG",
 "log.heard_count": "{n} AV {total} FUGLER HØRT",
 "log.col_place_note": "STED OG NOTAT",
 "log.open": "ÅPNE FUGL",
 "log.delete": "SLETT",
 "log.export": "EKSPORTER CSV",
 "log.entries": "{n} LINJER, PÅ DENNE ENHETEN",
 "log.entries_one": "1 LINJE, PÅ DENNE ENHETEN",
 "log.keys_entry": "OPP NED LINJE",
 "log.keys_open": "ENTER ÅPNE FUGL",
 "log.bad_date": "DATO MÅ SKRIVES ÅÅÅÅ-MM-DD",
 "log.bad_time": "TID MÅ SKRIVES TT:MM",
 "log.added": "LAGT TIL: {bird}",
 "log.deleted": "SLETTET: {bird}",
 "log.csv_bird_latin": "LATIN",
 "phone.tab.play": "SPILL",
 "phone.tab.guide": "BOK",
 "phone.tab.listen": "LYTT",
 "phone.tab.quiz": "QUIZ",
 "phone.tab.chorus": "KOR",
 "phone.tab.collection": "SAMLING",
 "phone.scene.time": "TID",
 "phone.scene.type": "TYPE",
 "phone.ap.hold": "HOLD",
 "phone.pick_bird": "Velg fugl",
 "phone.close": "LUKK",
 "phone.quiz.setup": "OPPSETT",
 "phone.quiz.correct": "{n} RIKTIGE",
 "phone.quiz.change": "BYTT",
 "phone.chorus.change_all": "BYTT FUGLER",
 "phone.log.new": "JEG HØRTE DEN: NY LINJE",
 "phone.coll.media": "OPPTAK OG BILDER",
 "phone.coll.log": "LOGG",
 "phone.coll.empty_title": "Samlingen er tom",
 "phone.coll.empty_text": "Opptak du lagrer fra Lytt og bilder du tar havner her, sortert per fugl.",
 "phone.coll.go_listen": "GÅ TIL LYTT",
 "phone.coll.new_picture": "NYTT BILDE",
 "phone.coll.note": "Alt ligger på telefonen. Ingen konto, ingen opplasting.",
 "phone.coll.status_empty": "0 OPPTAK, 0 BILDER",
 "phone.guide.status": "FUGLEBOK",
 "phone.quiz.open_guide": "ÅPNE I BOK",
 "listen.start": "START LYTTING",
 "listen.listening": "LYTTER",
 "listen.mic": "Mikrofon",
 "listen.mic_short": "MIK",
 "listen.last_4s": "SISTE 4 s",
 "listen.off": "AV",
 "listen.caption": "Det mikrofonen hører.",
 "listen.who": "Hvem synger?",
 "listen.suggestions": "{n} FORSLAG",
 "listen.song": "sang",
 "listen.unsure": "usikker",
 "listen.not_in_pipp": "IKKE I PIPP",
 "listen.save": "LAGRE OPPTAK",
 "listen.picture": "TA BILDE",
 "listen.compare": "SAMMENLIGN",
 "listen.open_collection": "ÅPNE SAMLING",
 "listen.note": "Sammenlign spiller opptaket og Pipps fugl etter hverandre. Lagre opptak legger lyden i samlingen din under fuglen, og i loggen. Ingenting lagres før du ber om det. Under 50 % vises som usikker. Gjenkjenningen er foreløpig en prøveutgave og gir alltid samme svar.",
 "listen.which": "Hvilken fugl var det?",
 "listen.file_under": "LEGG UNDER",
 "listen.note_record": "Pipp kjenner ikke igjen fugler ennå. Velg fuglen du hørte: Lagre opptak legger lyden i samlingen din under den, og i loggen, og Sammenlign spiller opptaket og så Pipps fugl. Ingenting lagres før du ber om det.",
 "listen.denied_title": "Pipp får ikke bruke mikrofonen",
 "listen.denied_text": "Slå på mikrofon for Pipp i telefonens innstillinger, så kan Pipp ta opp fuglene du hører. Lyden behandles på telefonen, og ingenting lagres før du ber om det.",
 "listen.unsupported_title": "Ingen mikrofon her",
 "listen.unsupported_text": "Denne nettleseren lar ikke Pipp bruke mikrofonen. Prøv appen, eller Safari eller Chrome.",
 "listen.settings": "ÅPNE INNSTILLINGER",
 "listen.denied_note": "Spill, Bok, Quiz og Kor virker uten mikrofon.",
 "listen.status_listening": "LYTTER",
 "listen.status_off": "MIKROFON AV",
 "listen.offline": "UTEN NETT",
 "listen.saved": "LAGRET: {bird}",
 "listen.picture_saved": "BILDE LAGRET: {bird}",
 "coll.all_birds": "ALLE FUGLER",
 "coll.one_bird": "Én fugl",
 "coll.change_bird": "BYTT FUGL",
 "coll.recordings": "OPPTAK",
 "coll.pictures": "BILDER",
 "coll.select": "VELG",
 "coll.done": "FERDIG",
 "coll.share": "DEL",
 "coll.export": "EKSPORTER",
 "coll.play": "Spill opptak",
 "coll.note": "Opptak og bilder ligger på telefonen, sortert per fugl. Prosenten er hvor sikker gjenkjenningen var.",
 "coll.counts": "{r} OPPTAK, {p} BILDER",
 "coll.share_unavailable": "DELING ER IKKE MULIG HER",
 "coll.delete": "SLETT",
 "coll.delete_confirm": "SLETT {n}?",
 "coll.deleted": "{n} SLETTET",
 "coll.close": "LUKK",
 "coll.prev_picture": "Forrige bilde",
 "coll.next_picture": "Neste bilde",
 "coll.exporting": "LAGER EKSPORTEN",
 "coll.export_saved": "{file} LAGRET",
 "coll.import": "IMPORTER FRA TELEFONEKSPORT",
 "coll.add_files": "LEGG TIL FILER",
 "coll.add_picture": "LEGG TIL BILDE",
 "coll.rec_pic": "OPPT · BILD",
 "coll.all_birds_row": "Alle fugler",
 "coll.outside": "Ikke i Pipp",
 "coll.col_sonogram": "SONOGRAM",
 "coll.col_heard": "HØRTE",
 "coll.col_length": "LENGDE",
 "coll.col_date": "DATO",
 "coll.col_match": "TREFF",
 "coll.col_from": "FRA",
 "coll.from_phone": "Telefon",
 "coll.from_file": "Fil",
 "coll.compare_pipp": "SAMMENLIGN MED PIPP",
 "coll.open_play": "ÅPNE I SPILL",
 "coll.show_finder": "VIS I FINDER",
 "coll.finder_web": "Ikke mulig i en nettleser",
 "coll.desk_note": "Macen har ingen gjenkjenning fra mikrofonen. Opptak og bilder kommer hit fra eksporten i telefonappen, eller fra filer du legger til. Ingenting synkroniseres av seg selv.",
 "coll.cannot_play": "DENNE NETTLESEREN KAN IKKE SPILLE OPPTAKET",
 "coll.importing": "LESER EKSPORTEN",
 "coll.imported": "IMPORTERTE {r} OPPTAK, {p} BILDER; {k} FANTES FRA FØR",
 "coll.import_broken": "{n} MANGLET I FILA",
 "coll.import_failed": "IKKE IMPORTERT: {why}",
 "coll.added": "LA TIL {n} FILER",
 "coll.added_skipped": "LA TIL {n} FILER, HOPPET OVER {k} SOM IKKE ER LYD ELLER BILDER",
 "coll.err_zip": "IKKE EN LESBAR ZIP-FIL",
 "coll.err_read": "FILA KUNNE IKKE LESES",
 "coll.err_manifest": "INGEN MANIFEST.JSON I ZIP-FILA",
 "coll.err_format": "IKKE EN PIPP-EKSPORT",
 "coll.col_bird": "FUGL",
 "coll.cannot_play_mac": "OPPTAKET KAN IKKE SPILLES",
 "coll.cannot_show": "BILDET KAN IKKE VISES HER",
 "coll.export_failed": "EKSPORTEN KUNNE IKKE LAGRES"
}
`,ho=Object.assign({"../../data/birds/aerfugl/bird.json":yt,"../../data/birds/aerfugl/plate.json":wt,"../../data/birds/aerfugl/songs.json":Lt,"../../data/birds/aerfugl/voice.json":Mt,"../../data/birds/akerrikse/bird.json":xt,"../../data/birds/akerrikse/plate.json":St,"../../data/birds/akerrikse/songs.json":Et,"../../data/birds/akerrikse/voice.json":Ct,"../../data/birds/bjorkefink/bird.json":Tt,"../../data/birds/bjorkefink/plate.json":Nt,"../../data/birds/bjorkefink/songs.json":Rt,"../../data/birds/bjorkefink/voice.json":At,"../../data/birds/blameis/bird.json":jt,"../../data/birds/blameis/plate.json":It,"../../data/birds/blameis/songs.json":Bt,"../../data/birds/blameis/voice.json":Ot,"../../data/birds/bokfink/bird.json":Ht,"../../data/birds/bokfink/plate.json":Gt,"../../data/birds/bokfink/songs.json":Dt,"../../data/birds/bokfink/voice.json":Pt,"../../data/birds/enkeltbekkasin/bird.json":zt,"../../data/birds/enkeltbekkasin/plate.json":Zt,"../../data/birds/enkeltbekkasin/songs.json":Ft,"../../data/birds/enkeltbekkasin/voice.json":Kt,"../../data/birds/fiskemake/bird.json":Ut,"../../data/birds/fiskemake/plate.json":qt,"../../data/birds/fiskemake/songs.json":Vt,"../../data/birds/fiskemake/voice.json":Wt,"../../data/birds/flaggspett/bird.json":Yt,"../../data/birds/flaggspett/plate.json":$t,"../../data/birds/flaggspett/songs.json":Jt,"../../data/birds/flaggspett/voice.json":Xt,"../../data/birds/fuglekonge/bird.json":Qt,"../../data/birds/fuglekonge/plate.json":ni,"../../data/birds/fuglekonge/songs.json":ei,"../../data/birds/fuglekonge/voice.json":ti,"../../data/birds/gjerdesmett/bird.json":ii,"../../data/birds/gjerdesmett/plate.json":si,"../../data/birds/gjerdesmett/songs.json":ai,"../../data/birds/gjerdesmett/voice.json":oi,"../../data/birds/gjok/bird.json":ri,"../../data/birds/gjok/plate.json":li,"../../data/birds/gjok/songs.json":hi,"../../data/birds/gjok/voice.json":di,"../../data/birds/gramake/bird.json":pi,"../../data/birds/gramake/plate.json":ci,"../../data/birds/gramake/songs.json":gi,"../../data/birds/gramake/voice.json":ui,"../../data/birds/granmeis/bird.json":fi,"../../data/birds/granmeis/plate.json":mi,"../../data/birds/granmeis/songs.json":vi,"../../data/birds/granmeis/voice.json":bi,"../../data/birds/gransanger/bird.json":_i,"../../data/birds/gransanger/plate.json":ki,"../../data/birds/gransanger/songs.json":yi,"../../data/birds/gransanger/voice.json":wi,"../../data/birds/graspurv/bird.json":Li,"../../data/birds/graspurv/plate.json":Mi,"../../data/birds/graspurv/songs.json":xi,"../../data/birds/graspurv/voice.json":Si,"../../data/birds/gratrost/bird.json":Ei,"../../data/birds/gratrost/plate.json":Ci,"../../data/birds/gratrost/songs.json":Ti,"../../data/birds/gratrost/voice.json":Ni,"../../data/birds/gronnfink/bird.json":Ri,"../../data/birds/gronnfink/plate.json":Ai,"../../data/birds/gronnfink/songs.json":ji,"../../data/birds/gronnfink/voice.json":Ii,"../../data/birds/gulspurv/bird.json":Bi,"../../data/birds/gulspurv/plate.json":Oi,"../../data/birds/gulspurv/songs.json":Hi,"../../data/birds/gulspurv/voice.json":Gi,"../../data/birds/heilo/bird.json":Di,"../../data/birds/heilo/plate.json":Pi,"../../data/birds/heilo/songs.json":zi,"../../data/birds/heilo/voice.json":Zi,"../../data/birds/heipiplerke/bird.json":Fi,"../../data/birds/heipiplerke/plate.json":Ki,"../../data/birds/heipiplerke/songs.json":Ui,"../../data/birds/heipiplerke/voice.json":qi,"../../data/birds/index.json":Vi,"../../data/birds/kattugle/bird.json":Wi,"../../data/birds/kattugle/plate.json":Yi,"../../data/birds/kattugle/songs.json":$i,"../../data/birds/kattugle/voice.json":Ji,"../../data/birds/kjottmeis/bird.json":Xi,"../../data/birds/kjottmeis/plate.json":Qi,"../../data/birds/kjottmeis/songs.json":ns,"../../data/birds/kjottmeis/voice.json":es,"../../data/birds/krake/bird.json":ts,"../../data/birds/krake/plate.json":is,"../../data/birds/krake/songs.json":ss,"../../data/birds/krake/voice.json":as,"../../data/birds/lavesvale/bird.json":os,"../../data/birds/lavesvale/plate.json":rs,"../../data/birds/lavesvale/songs.json":ls,"../../data/birds/lavesvale/voice.json":hs,"../../data/birds/linerle/bird.json":ds,"../../data/birds/linerle/plate.json":ps,"../../data/birds/linerle/songs.json":cs,"../../data/birds/linerle/voice.json":gs,"../../data/birds/lirype/bird.json":us,"../../data/birds/lirype/plate.json":fs,"../../data/birds/lirype/songs.json":ms,"../../data/birds/lirype/voice.json":vs,"../../data/birds/lovsanger/bird.json":bs,"../../data/birds/lovsanger/plate.json":_s,"../../data/birds/lovsanger/songs.json":ks,"../../data/birds/lovsanger/voice.json":ys,"../../data/birds/makrellterne/bird.json":ws,"../../data/birds/makrellterne/plate.json":Ls,"../../data/birds/makrellterne/songs.json":Ms,"../../data/birds/makrellterne/voice.json":xs,"../../data/birds/maltrost/bird.json":Ss,"../../data/birds/maltrost/plate.json":Es,"../../data/birds/maltrost/songs.json":Cs,"../../data/birds/maltrost/voice.json":Ts,"../../data/birds/nattergal/bird.json":Ns,"../../data/birds/nattergal/plate.json":Rs,"../../data/birds/nattergal/songs.json":As,"../../data/birds/nattergal/voice.json":js,"../../data/birds/nattravn/bird.json":Is,"../../data/birds/nattravn/plate.json":Bs,"../../data/birds/nattravn/songs.json":Os,"../../data/birds/nattravn/voice.json":Hs,"../../data/birds/perleugle/bird.json":Gs,"../../data/birds/perleugle/plate.json":Ds,"../../data/birds/perleugle/songs.json":Ps,"../../data/birds/perleugle/voice.json":zs,"../../data/birds/ravn/bird.json":Zs,"../../data/birds/ravn/plate.json":Fs,"../../data/birds/ravn/songs.json":Ks,"../../data/birds/ravn/voice.json":Us,"../../data/birds/ringdue/bird.json":qs,"../../data/birds/ringdue/plate.json":Vs,"../../data/birds/ringdue/songs.json":Ws,"../../data/birds/ringdue/voice.json":Ys,"../../data/birds/rodstrupe/bird.json":$s,"../../data/birds/rodstrupe/plate.json":Js,"../../data/birds/rodstrupe/songs.json":Xs,"../../data/birds/rodstrupe/voice.json":Qs,"../../data/birds/rodvingetrost/bird.json":na,"../../data/birds/rodvingetrost/plate.json":ea,"../../data/birds/rodvingetrost/songs.json":ta,"../../data/birds/rodvingetrost/voice.json":ia,"../../data/birds/rugde/bird.json":sa,"../../data/birds/rugde/plate.json":aa,"../../data/birds/rugde/songs.json":oa,"../../data/birds/rugde/voice.json":ra,"../../data/birds/sanglerke/bird.json":la,"../../data/birds/sanglerke/plate.json":ha,"../../data/birds/sanglerke/songs.json":da,"../../data/birds/sanglerke/voice.json":pa,"../../data/birds/sangsvane/bird.json":ca,"../../data/birds/sangsvane/plate.json":ga,"../../data/birds/sangsvane/songs.json":ua,"../../data/birds/sangsvane/voice.json":fa,"../../data/birds/sildemake/bird.json":ma,"../../data/birds/sildemake/plate.json":va,"../../data/birds/sildemake/songs.json":ba,"../../data/birds/sildemake/voice.json":_a,"../../data/birds/skjaere/bird.json":ka,"../../data/birds/skjaere/plate.json":ya,"../../data/birds/skjaere/songs.json":wa,"../../data/birds/skjaere/voice.json":La,"../../data/birds/staer/bird.json":Ma,"../../data/birds/staer/plate.json":xa,"../../data/birds/staer/songs.json":Sa,"../../data/birds/staer/voice.json":Ea,"../../data/birds/stokkand/bird.json":Ca,"../../data/birds/stokkand/plate.json":Ta,"../../data/birds/stokkand/songs.json":Na,"../../data/birds/stokkand/voice.json":Ra,"../../data/birds/storlom/bird.json":Aa,"../../data/birds/storlom/plate.json":ja,"../../data/birds/storlom/songs.json":Ia,"../../data/birds/storlom/voice.json":Ba,"../../data/birds/storspove/bird.json":Oa,"../../data/birds/storspove/plate.json":Ha,"../../data/birds/storspove/songs.json":Ga,"../../data/birds/storspove/voice.json":Da,"../../data/birds/svarthvitfluesnapper/bird.json":Pa,"../../data/birds/svarthvitfluesnapper/plate.json":za,"../../data/birds/svarthvitfluesnapper/songs.json":Za,"../../data/birds/svarthvitfluesnapper/voice.json":Fa,"../../data/birds/svartspett/bird.json":Ka,"../../data/birds/svartspett/plate.json":Ua,"../../data/birds/svartspett/songs.json":qa,"../../data/birds/svartspett/voice.json":Va,"../../data/birds/svarttrost/bird.json":Wa,"../../data/birds/svarttrost/plate.json":Ya,"../../data/birds/svarttrost/songs.json":$a,"../../data/birds/svarttrost/voice.json":Ja,"../../data/birds/tjeld/bird.json":Xa,"../../data/birds/tjeld/plate.json":Qa,"../../data/birds/tjeld/songs.json":no,"../../data/birds/tjeld/voice.json":eo,"../../data/birds/vipe/bird.json":to,"../../data/birds/vipe/plate.json":io,"../../data/birds/vipe/songs.json":so,"../../data/birds/vipe/voice.json":ao,"../../data/chorus.json":oo,"../../data/strings/en.json":ro,"../../data/strings/no.json":lo});function zn(c){return ho[`../../data/${c}`]}const N=JSON.parse(zn("birds/index.json")??'{"groups":[],"birds":[]}');function en(c,n){return zn(`birds/${c}/${n}.json`)}function q(c){return en(c,"voice")!==void 0&&en(c,"songs")!==void 0}function me(c){return JSON.parse(zn(`strings/${c}.json`)??"{}")}function po(){const c=zn("chorus.json");return c?JSON.parse(c):null}const pn=4096;class de{pipp;birds=new Map;ctx=null;node=null;pending=[];wasm;ready=!1;error="";sampleRate=48e3;knobs=new Float32Array(vt*4);status=new Float32Array(10);seed=1;birdInUse="";phrase=null;sonoRate=375;sonoWritten=0;sonoHz=new Float32Array(pn);sonoAmp=new Float32Array(pn);sonoMask=new Uint16Array(pn);compare={running:!1,stage:0};qvoice={started:!1,startFrame:0,sung:0};chorus=new Float32Array(23);chorusSang=new Uint8Array(4*960);peakL=0;peakR=0;onState=null;static async create(){const n=await fetch("./pipp.wasm");if(!n.ok)throw new Error(`pipp.wasm: ${n.status}`);const e=await n.arrayBuffer(),t=await he.load(e);return new de(t,e)}constructor(n,e){this.pipp=n,this.wasm=e;for(const t of N.birds)q(t.id)&&this.birds.set(t.id,n.parseBird(t.id,en(t.id,"voice"),en(t.id,"songs")))}get running(){return this.ctx?.state==="running"}async start(){if(this.ctx){this.ctx.state!=="running"&&await this.ctx.resume();return}const n=navigator.audioSession;n&&(n.type="playback");const e=new AudioContext({latencyHint:"interactive"});this.ctx=e;const t=e.resume();await e.audioWorklet.addModule(mt);const i=new AudioWorkletNode(e,"pipp",{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[2]});i.port.onmessage=o=>this.receive(o.data),i.connect(e.destination),this.node=i;const s=[...this.birds.keys()].map(o=>({id:o,voice:en(o,"voice"),songs:en(o,"songs")}));i.port.postMessage({t:"init",wasm:this.wasm.slice(0),birds:s});for(const o of this.pending)this.post(o);this.pending=[],await t}post(n){if(!this.node){this.pending.push(n);return}n.t==="drawn"?this.node.port.postMessage(n,[n.pts.buffer]):this.node.port.postMessage(n)}param(n,e){this.post({t:"param",id:n,v:e})}trigger(n){this.post({t:"trigger",id:n})}receive(n){if(n.t==="ready"){this.ready=!0,this.sampleRate=n.sampleRate;return}if(n.t==="error"){this.error=n.message;return}this.knobs=n.knobs,this.status=n.status,this.seed=n.seed,this.birdInUse=n.birdInUse,n.phrase&&(this.phrase=n.phrase),this.sonoRate=n.sonoRate;const e=n.sono.length/3;for(let t=0;t<e;t++){const i=n.sonoFrom+t&pn-1;this.sonoHz[i]=n.sono[3*t],this.sonoAmp[i]=n.sono[3*t+1],this.sonoMask[i]=n.sono[3*t+2]}this.sonoWritten=n.sonoFrom+e,this.compare=n.compare,this.qvoice=n.qvoice,this.chorus=n.chorus,n.chorusSang&&(this.chorusSang=n.chorusSang),this.peakL=Math.max(this.peakL,n.status[1],n.chorus[2]),this.peakR=Math.max(this.peakR,n.status[2],n.chorus[2]),this.onState?.(n)}sonoFrame(n){const e=n&pn-1;return{hz:this.sonoHz[e],amp:this.sonoAmp[e],mask:this.sonoMask[e]}}knobValue(n){return this.knobs[4*n]}knobMode(n){return this.knobs[4*n+1]}holdLeft(n){return this.knobs[4*n+2]}knobOverridden(n){return this.knobs[4*n+3]!==0}get level(){return this.status[0]}get singing(){return this.status[3]!==0}get phrasePosMs(){return this.status[4]}get phraseTempo(){return this.status[5]}get phrasesStarted(){return this.status[7]}takePeaks(){const n=[this.peakL,this.peakR];return this.peakL=this.peakR=0,n}}const M={face:"#efe8d6",shadow:"#a3967a",ink:"#221c14",inkSoft:"#4f4634",faint:"#b5a98b",onInk:"#ddd3bd",paper:"#fff8ec",rule:"#d8ccb0",ruleMajor:"#c4b796",clay:"#936255",khaki:"#b5a37a",sage:"#809a8c",plum:"#5e4458",hatch:"rgba(34, 28, 20, 0.10)"},rn="−";function l(c,n="",e,t){const i=document.createElement(c);return n&&(i.className=n),t!==void 0&&(i.textContent=t),e?.appendChild(i),i}function h(c,n,e=""){const t=l("div",e,c);return Object.assign(t.style,n),t}const co={play:'<polygon points="4,2 13,8 4,14"/>',stop:'<rect x="3" y="3" width="10" height="10"/>',prev:'<polygon points="11,3 4,8 11,13"/>',next:'<polygon points="5,3 12,8 5,13"/>'};class y{e;constructor(n,e="",t,i){this.e=l("button","btn",n,e),this.e.type="button",this.e.tabIndex=-1,i&&Object.assign(this.e.style,i),this.e.addEventListener("mousedown",s=>s.preventDefault()),t&&this.e.addEventListener("click",()=>{this.e.disabled||t()})}glyph(n,e=""){return e&&this.e.setAttribute("aria-label",e),this.e.innerHTML=`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">${co[n]}</svg>`,this}text(n){return this.e.textContent!==n&&(this.e.textContent=n),this}on(n){return this.e.classList.toggle("on",n),this}disabled(n){return this.e.disabled=n,this}show(n){return this.e.style.display=n?"":"none",this}}function D(c,n,e=20){const t=l("div",n.some(i=>!i.width)?"joined fill":"joined",c);return n.map(i=>new y(t,i.text,i.onClick,{height:`${e}px`,...i.width?{width:`${i.width}px`}:{flex:"1"}}))}class Z{c;g;w;h;ratio=1;stageScale=1;constructor(n,e,t){this.c=l("canvas","",n),this.g=this.c.getContext("2d"),this.w=e,this.h=t,this.c.style.width=`${e}px`,this.c.style.height=`${t}px`,this.resize(1)}setSize(n,e,t){this.w=n,this.h=e,this.c.style.width=`${n}px`,this.c.style.height=`${e}px`,this.resize(t)}resize(n){this.stageScale=n,this.ratio=Math.max(1,Math.min(4,(window.devicePixelRatio||1)*n)),this.c.width=Math.round(this.w*this.ratio),this.c.height=Math.round(this.h*this.ratio)}begin(){const n=this.g;return n.setTransform(this.ratio,0,0,this.ratio,0,0),n.clearRect(0,0,this.w,this.h),n}}const go=[];function C(c,n,e,t,i){Object.assign(c.style,{position:"absolute",left:`${n}px`,top:`${e}px`,width:`${t}px`,height:`${i}px`})}let Vn=null;function Cn(c,n,e=0){return Vn??=document.createElement("canvas").getContext("2d"),Vn.font=c,Math.ceil(Vn.measureText(n).width+e*[...n].length)}function ae(c,n,e,t,i,s=M.hatch,o=7){c.save(),c.beginPath(),c.rect(n,e,t,i),c.clip(),c.strokeStyle=s,c.lineWidth=1,c.beginPath();const a=o*Math.SQRT2;for(let r=0;r<t+i;r+=a)c.moveTo(n+r,e),c.lineTo(n+r-i,e+i);c.stroke(),c.restore()}function j(c,n=400,e=!1){return e?`400 ${c}px 'Instrument Serif', Georgia, serif`:`${n} ${c}px 'Plex Mono', Menlo, monospace`}function wn(c,n,e){c.fillStyle=M.face,c.fillRect(0,0,n,e);for(const[t,i]of[[8,M.rule],[40,M.ruleMajor]]){c.fillStyle=i;for(let s=0;s<n;s+=t)c.fillRect(s,0,1,e);for(let s=0;s<e;s+=t)c.fillRect(0,s,n,1)}}function A(c,n,e){let t=n<=0?String(Math.round(c)):c.toFixed(n);return t==="-0"&&(t="0"),e&&(t=t.replace(".",",")),t.startsWith("-")&&(t=rn+t.slice(1)),t}class Ke{lang="en";table=me("en");set(n){this.lang=n,this.table=me(n)}get no(){return this.lang==="no"}t(n,e){let t=this.table[n]??`<${n}>`;if(e)for(const[i,s]of Object.entries(e))t=t.split(`{${i}}`).join(s);return t}field(n){return(n?.[this.lang]??"")||this.t("not_described")}}const U=c=>c.toLocaleUpperCase("nb"),ln=c=>c.toLocaleLowerCase("nb"),ve=["spring","summer","autumn","winter"],be=["garden","forest","open","shore"],An=-90,Wn=302,sn=96,Yn=8,an=xn,uo=9,jn=[M.clay,M.khaki,M.sage,M.plum],_e=[M.paper,M.ink,M.ink,M.paper];class Ue{constructor(n,e,t,i,s,o,a=!1){this.host=e,this.s=t,this.ids=i,this.ptrs=s,this.on=o,this.phone=a;const r=a?h(n,{display:"none",flexDirection:"column",gap:"12px"}):h(n,{position:"absolute",left:"8px",top:"8px",width:"1264px",height:"664px",display:"none"});if(this.root=r,a){this.buildPhone(r);return}this.morningLabel=l("div","section",r),C(this.morningLabel,0,0,1264,14);const d=Math.floor(1232/3),u=[];for(let f=0;f<3;f++){const m=f*(d+16),_=h(r,{});C(_,m,18,f===2?1264-m:d,38);const w=l("div","field",_);this.fieldLabels.push(w);const b=h(_,{marginTop:"2px"});u.push(D(b,[0,1,2,3].map(L=>({text:"",onClick:()=>this.setChoice(f,L)})),24))}[this.seasonBtns,this.placeBtns,this.speedBtns]=u,this.speedBtns[1].text("10×"),this.speedBtns[2].text("60×");const g=h(r,{border:"1px solid var(--ink)"});C(g,0,68,1264,29+4*sn+16+18+1);const p=l("div","panelhead",g);this.title=l("div","title",p),this.title.style.flex="1",this.nowEl=l("div","chorusnow",p);for(let f=0;f<tn;f++){const m=h(g,{},`lane${f<3?" rule":""}`);C(m,0,28+f*sn,Wn-1,sn);const _=h(m,{background:jn[f],color:_e[f]},"chip");_.textContent=String(f+1);const w=l("div","lanename",m),b=l("div","lanedist",m),L=h(m,{position:"absolute",left:"46px",top:"51px",display:"flex",gap:"6px"}),k=new y(L,"",()=>this.toggleMute(f)),x=new y(L,"",()=>this.toggleSolo(f)),S=new y(L,"",()=>this.changeBird(f));this.lanes.push({e:m,name:w,dist:b,mute:k,solo:x,change:S})}const v=h(g,{});C(v,Wn,28,an,4*sn+16),this.timeline=new Z(v,an,4*sn+16),h(g,{background:"var(--ink)"}).style.cssText+=`position:absolute;left:${Wn-1}px;top:28px;width:1px;height:${4*sn}px;`,this.caption=h(g,{borderTop:"1px solid var(--ink)",padding:"0 8px"},"cap"),C(this.caption,0,28+4*sn+16,1262,18),this.note=h(r,{font:"400 11px/16px var(--mono)",color:"var(--inkSoft)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}),C(this.note,0,528,1264,16)}host;s;ids;ptrs;on;phone;root;season=0;place=0;speed=1;playing=!1;error="";loaded=!1;setup={};laneBird=[-1,-1,-1,-1];laneEntry=[0,0,0,0];laneDistance=[15,15,15,15];laneMute=[!1,!1,!1,!1];laneSolo=[!1,!1,!1,!1];morningLabel;fieldLabels=[];seasonBtns;placeBtns;speedBtns;title;nowEl;lanes=[];timeline;caption;note;strips=[];nowShort=null;buildPhone(n){const e=h(n,{display:"flex",flexDirection:"column",gap:"6px"});this.morningLabel=l("div","section",e);const t=h(e,{display:"grid",gridTemplateColumns:"60px minmax(0, 1fr)",rowGap:"4px",alignItems:"center"}),i=[];for(let d=0;d<3;d++)this.fieldLabels.push(l("div","field",t)),i.push(D(h(t,{}),[0,1,2,3].map(u=>({text:"",onClick:()=>this.setChoice(d,u)})),44));[this.seasonBtns,this.placeBtns,this.speedBtns]=i,this.speedBtns[1].text("10×"),this.speedBtns[2].text("60×");const s=h(n,{border:"1px solid var(--ink)",display:"flex",flexDirection:"column"}),o=h(s,{justifyContent:"space-between"},"panelhead");this.title=l("div","title",o),this.nowEl=l("div","",o),this.nowShort=l("span","",this.nowEl),Object.assign(this.nowShort.style,{font:"500 10px var(--mono)",letterSpacing:"0.06em"});const a=h(n,{display:"none"});for(let d=0;d<tn;d++){const u=h(s,{display:"flex",flexDirection:"column",borderBottom:"1px solid var(--ink)"},"plane"),g=h(u,{height:"48px",display:"flex",alignItems:"center",gap:"8px",padding:"0 6px"}),p=h(g,{background:jn[d],color:_e[d]},"pchip");p.textContent=String(d+1);const v=h(g,{flex:"1",minWidth:"0",font:"400 22px/1 var(--serif)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}),f=h(g,{font:"500 10px var(--mono)",letterSpacing:"0.06em",whiteSpace:"nowrap"}),m=h(g,{display:"flex"}),_=new y(m,"",()=>this.toggleMute(d),{height:"44px",padding:"0 8px"}),w=new y(m,"",()=>this.toggleSolo(d),{height:"44px",padding:"0 8px",marginLeft:"-1px"}),b=new y(a,"",()=>this.changeBird(d)),L=h(u,{height:"36px",borderTop:"1px solid var(--divider)"});this.strips.push(new Z(L,356,35)),this.lanes.push({e:u,name:v,dist:f,mute:_,solo:w,change:b})}this.timeline=new Z(h(s,{}),356,16),this.caption=h(s,{borderTop:"1px solid var(--ink)",padding:"0 8px",height:"18px"},"cap");const r=new y(n,"",()=>{for(let d=0;d<tn;d++)this.changeBird(d)},{height:"44px"});this.changeAllBtn=r,this.note=h(n,{font:"400 11px/16px var(--mono)",color:"var(--inkSoft)"})}changeAllBtn=null;get visible(){return this.root.style.display!=="none"}show(n){this.root.style.display=n?this.phone?"flex":"":"none"}resize(n){this.timeline.resize(n);for(const e of this.strips)e.resize(n)}load(){if(this.loaded)return;this.loaded=!0;const n=po();n||(this.error=this.s.t("error.load",{bird:"CHORUS",error:"chorus.json"})),this.setup=n??{};const e=this.setup.lanes??[];for(let i=0;i<tn;i++){const s=e[i]??{};this.laneDistance[i]=s.distance_m??15;let o=this.ids.indexOf(s.bird??"");if(o<0)for(let a=0;a<this.ids.length&&o<0;a++)this.laneBird.includes(a)||(o=a);this.laneBird[i]=o}const t=this.host;t.post({t:"chorus",op:"season",v:this.season}),t.post({t:"chorus",op:"place",v:this.place}),t.post({t:"chorus",op:"speed",v:this.speed}),t.post({t:"chorus",op:"seed",v:Math.random()*4294967296>>>0})}setLaneBird(n,e){this.laneBird[n]=e;const t=e>=0?this.ids[e]:"",i=this.setup.entry_min??{};if(this.laneEntry[n]=t in i?i[t]:this.setup.default_entry_min??-40,this.host.post({t:"chorus",op:"lane",lane:n,bird:t,entry:this.laneEntry[n],distance:this.laneDistance[n]}),e<0)return;const s=this.host,o=this.on.playBird()===t;for(let a=0;a<uo;a++)o&&s.ready&&s.knobOverridden(a)&&s.holdLeft(a)<0&&s.knobMode(a)===bt.Hold?s.post({t:"chorus",op:"hold",lane:n,k:a,v:s.knobValue(a)}):s.post({t:"chorus",op:"release",lane:n,k:a})}changeBird(n){const e=this.ids.length,t=this.laneBird[n];for(let i=1;i<e;i++){const s=((t<0?0:t)+i)%e;if(!this.laneBird.includes(s)){this.setLaneBird(n,s);break}}this.update()}toggleMute(n){this.laneMute[n]=!this.laneMute[n],this.host.post({t:"chorus",op:"mute",lane:n,on:this.laneMute[n]}),this.update()}toggleSolo(n){this.laneSolo[n]=!this.laneSolo[n],this.host.post({t:"chorus",op:"solo",lane:n,on:this.laneSolo[n]}),this.update()}setChoice(n,e){n===0?this.season=e:n===1?this.place=e:this.speed=e,this.host.post({t:"chorus",op:["season","place","speed"][n],v:e}),this.update()}enter(){this.host.start(),this.load(),this.host.param("pb_play",0);for(let n=0;n<tn;n++)this.setLaneBird(n,this.laneBird[n]);this.update()}leave(){this.setPlaying(!1)}get minute(){return this.host.ready?this.host.chorus[0]:An}get finished(){return this.host.ready&&this.host.chorus[1]!==0}setPlaying(n){n&&this.host.start(),n&&this.finished&&this.host.post({t:"chorus",op:"seek",minute:An}),this.playing=n,this.host.post({t:"chorus",op:"play",on:n}),this.update()}inSeason(n){const e=this.laneBird[n];return e>=0&&this.host.pipp.x.pipp_bird_type_active(this.ptrs[e],0,this.season,0,0,0)!==0}name(n){const e=N.birds.find(t=>t.id===this.ids[n]);return e?this.s.no?e.name.no:e.name.en:""}applyStrings(){const n=this.s;this.morningLabel.textContent=n.t("chorus.morning"),["scene.season","scene.place","chorus.dawn_speed"].forEach((e,t)=>this.fieldLabels[t].textContent=n.t(e)),this.seasonBtns.forEach((e,t)=>e.text(n.t(`season.${ve[t]}`))),this.placeBtns.forEach((e,t)=>e.text(n.t(`place.${be[t]}`))),this.speedBtns[0].text(n.t("chorus.speed_real")),this.speedBtns[3].text(n.t("chorus.speed_loop")),this.title.textContent=n.t("chorus.title");for(const e of this.lanes)e.mute.text(n.t("chorus.mute")),e.solo.text(n.t("chorus.solo")),e.change.text(n.t("chorus.change"));this.changeAllBtn?.text(n.t("phone.chorus.change_all")),this.caption.replaceChildren(),l("b","",this.caption,`${n.t("fig")} 1`),this.caption.append(n.t("chorus.caption")),this.note.textContent=n.t("chorus.note"),this.update()}update(){const n=this.s;this.seasonBtns.forEach((t,i)=>t.on(this.season===i)),this.placeBtns.forEach((t,i)=>t.on(this.place===i)),this.speedBtns.forEach((t,i)=>t.on(this.speed===i));const e=this.ids.length>tn;this.changeAllBtn?.disabled(!e),this.lanes.forEach((t,i)=>{t.mute.on(this.laneMute[i]),t.solo.on(this.laneSolo[i]),t.change.disabled(!e),t.e.classList.toggle("muted",this.laneMute[i]);const s=this.laneBird[i];t.name.textContent=s>=0?this.name(s):"",t.dist.textContent=this.laneMute[i]?n.t("chorus.muted"):`${A(this.laneDistance[i],0,n.no)} m`,this.phone||(t.name.style.right=`${8+Cn(j(10,500),t.dist.textContent,.6)+2+10}px`)}),this.on.refresh()}statusText(){const n=this.s;if(this.error)return this.error;if(this.finished)return n.t("chorus.status_done");const e=[n.t("chorus.speed_real"),"10×","60×",n.t("chorus.speed_loop")];return n.t("chorus.status",{season:n.t(`season.${ve[this.season]}`),place:n.t(`place.${be[this.place]}`),speed:e[this.speed]})}poll(){this.playing&&this.finished&&(this.playing=!1,this.host.post({t:"chorus",op:"play",on:!1}),this.on.refresh()),this.paintHead(),this.phone?this.paintStrips():this.paintTimeline()}paintStrips(){const n=this.s,e=356,t=35,i=e/120,s=g=>(g-An)*i,o=this.host.chorusSang,a=Math.round(s(0)),r=Math.floor(s(this.minute));for(let g=0;g<tn;g++){const p=this.strips[g].begin();if(this.laneMute[g]||wn(p,e,t),this.inSeason(g)){const v=Math.round(s(this.laneEntry[g])),f=7,m=20;p.fillStyle=jn[g];for(let _=Math.max(0,v);_<e;_++){const w=Math.floor(_/i*Yn),b=Math.min(xn,Math.floor((_+1)/i*Yn));let L=!1;for(let k=w;k<b&&!L;k++)L=o[g*xn+k]!==0;L&&p.fillRect(_,f+1,1,m-2)}p.fillStyle=M.ink,p.fillRect(v,f,e+1-v,1),p.fillRect(v,f+m-1,e+1-v,1),p.fillRect(v,f,1,m)}this.laneMute[g]&&ae(p,0,0,e,t),p.fillStyle=M.ink,p.fillRect(a,0,1,t),p.fillStyle=M.plum,p.fillRect(r,0,1,t)}const d=this.timeline.begin();d.font=j(9,400),d.fillStyle=M.inkSoft,d.textBaseline="middle",d.textAlign="left",[n.t("chorus.axis_min",{n:`${rn}90`}),`${rn}60`,`${rn}30`,n.t("chorus.sunrise")].forEach((g,p)=>d.fillText(g,2+Math.round(s(-90+30*p)),8))}paintHead(){const n=this.s,e=this.host.chorus,t=this.minute,i=Math.round(Math.abs(t)),s=i===0?n.t("chorus.at"):n.t(t<0?"chorus.before":"chorus.after",{n:String(i)});if(this.nowShort){this.nowShort.textContent!==U(s)&&(this.nowShort.textContent=U(s));return}let o=0;for(let r=0;r<tn;r++)this.host.ready&&e[3+5*r]!==0&&e[4+5*r]!==0&&o++;const a=`${n.t("chorus.now")}|${s}|${n.t("chorus.singing")}|${n.t("chorus.of",{n:String(o),total:String(tn)})}`;this.nowEl.dataset.text!==a&&(this.nowEl.dataset.text=a,this.nowEl.replaceChildren(),a.split("|").forEach((r,d)=>l("span",d%2===0?"soft":"",this.nowEl,r)))}paintTimeline(){const n=this.timeline.begin(),e=this.s,t=4*sn;wn(n,an,t),n.fillStyle=M.shadow,n.fillRect(0,0,an,1),n.fillRect(0,0,1,t);const i=u=>(u-An)*Yn,s=this.host.chorusSang;for(let u=0;u<tn;u++){const g=u*sn;if(this.inSeason(u)){const p=Math.round(i(this.laneEntry[u])),v=g+34,f=28;n.fillStyle=jn[u];for(let m=Math.max(0,p);m<xn&&m<an;m++)s[u*xn+m]&&n.fillRect(m,v+1,1,f-2);n.fillStyle=M.ink,n.fillRect(p,v,an+1-p,1),n.fillRect(p,v+f-1,an+1-p,1),n.fillRect(p,v,1,f)}this.laneMute[u]&&ae(n,0,g,an,sn),u>0&&(n.fillStyle=M.ink,n.fillRect(0,g,an,1))}const o=Math.round(i(0));n.fillStyle=M.ink,n.fillRect(o,0,1,t),n.font=j(8,600),n.letterSpacing="0.48px",n.textBaseline="middle",n.textAlign="left";const a=e.t("chorus.sunrise");n.fillRect(o+4,2,Math.ceil(n.measureText(a).width)+6,10),n.fillStyle=M.onInk,n.fillText(a,o+7,7.5);const r=Math.floor(i(this.minute));n.fillStyle=M.plum,n.fillRect(r,0,1,t);const d=e.t("chorus.now");n.fillRect(r+1,0,Math.ceil(n.measureText(d).width)+8,12),n.fillStyle=M.paper,n.fillText(d,r+5,6.5),n.letterSpacing="0px",n.fillStyle=M.ink,n.fillRect(0,t,an,1),n.font=j(9,400),n.fillStyle=M.inkSoft;for(let u=0;u<4;u++){const g=-90+30*u,p=u===0?e.t("chorus.axis_min",{n:`${rn}${-g}`}):g<0?`${rn}${-g}`:String(g);n.fillText(p,2+240*u,t+8.5)}}}const fo="pipp",$n="tipp";let ke=null;const mo=c=>new Promise((n,e)=>{c.onsuccess=()=>n(c.result),c.onerror=()=>e(c.error)});function qe(c,n){return new Promise((e,t)=>{const i=indexedDB.open(c,1);i.onupgradeneeded=()=>{n&&(i.result.createObjectStore("recordings",{keyPath:"id"}),i.result.createObjectStore("pictures",{keyPath:"id"}))},i.onsuccess=()=>e(i.result),i.onerror=()=>t(i.error)})}async function vo(c){if(!(await indexedDB.databases?.().catch(()=>[]))?.some(i=>i.name===$n))return;const e=await qe($n,!1),t=["recordings","pictures"].filter(i=>e.objectStoreNames.contains(i));for(const i of t){const s=await mo(e.transaction(i,"readonly").objectStore(i).getAll()),o=c.transaction(i,"readwrite");for(const a of s)o.objectStore(i).put(a);await new Promise((a,r)=>{o.oncomplete=()=>a(),o.onerror=()=>r(o.error)})}e.close(),indexedDB.deleteDatabase($n)}function bo(){return ke??=qe(fo,!0).then(async c=>(await vo(c).catch(n=>console.warn("Could not move the old Tipp store:",n)),c)),navigator.storage?.persist?.(),ke}async function cn(c,n,e){const t=await bo();return new Promise((i,s)=>{const o=e(t.transaction(c,n).objectStore(c));o.onsuccess=()=>i(o.result),o.onerror=()=>s(o.error)})}const Tn=()=>`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`,pe=c=>cn("recordings","readwrite",n=>n.put(c)),Zn=c=>cn("pictures","readwrite",n=>n.put(c)),Ve=(c,n)=>c.date<n.date?1:c.date>n.date?-1:0,We=async()=>(await cn("recordings","readonly",c=>c.getAll())).sort(Ve),Ye=async()=>(await cn("pictures","readonly",c=>c.getAll())).sort(Ve);function Dn(){const c=new Date,n=e=>String(e).padStart(2,"0");return`${c.getFullYear()}-${n(c.getMonth()+1)}-${n(c.getDate())} ${n(c.getHours())}:${n(c.getMinutes())}`}const _o=async()=>new Set(await cn("recordings","readonly",c=>c.getAllKeys())),ko=async()=>new Set(await cn("pictures","readonly",c=>c.getAllKeys())),$e=c=>cn("recordings","readwrite",n=>n.delete(c)),oe=c=>cn("pictures","readwrite",n=>n.delete(c)),yo=(()=>{const c=new Uint32Array(256);for(let n=0;n<256;n++){let e=n;for(let t=0;t<8;t++)e=e&1?3988292384^e>>>1:e>>>1;c[n]=e>>>0}return c})();function Je(c){let n=4294967295;for(let e=0;e<c.length;e++)n=yo[(n^c[e])&255]^n>>>8;return(n^4294967295)>>>0}function wo(c){const n=c.getHours()<<11|c.getMinutes()<<5|c.getSeconds()>>1,e=Math.max(1980,c.getFullYear())-1980<<9|c.getMonth()+1<<5|c.getDate();return[n,e]}function Lo(c,n=new Date){const e=new TextEncoder,[t,i]=wo(n),s=[],o=[];let a=0;for(const u of c){const g=new Uint8Array(e.encode(u.name)),p=Je(u.data),v=u.data.length,f=new DataView(new ArrayBuffer(30));f.setUint32(0,67324752,!0),f.setUint16(4,20,!0),f.setUint16(6,2048,!0),f.setUint16(8,0,!0),f.setUint16(10,t,!0),f.setUint16(12,i,!0),f.setUint32(14,p,!0),f.setUint32(18,v,!0),f.setUint32(22,v,!0),f.setUint16(26,g.length,!0),f.setUint16(28,0,!0),s.push(f.buffer,g,u.data);const m=new DataView(new ArrayBuffer(46));m.setUint32(0,33639248,!0),m.setUint16(4,20,!0),m.setUint16(6,20,!0),m.setUint16(8,2048,!0),m.setUint16(10,0,!0),m.setUint16(12,t,!0),m.setUint16(14,i,!0),m.setUint32(16,p,!0),m.setUint32(20,v,!0),m.setUint32(24,v,!0),m.setUint16(28,g.length,!0),m.setUint32(42,a,!0);const _=new Uint8Array(46+g.length);_.set(new Uint8Array(m.buffer),0),_.set(g,46),o.push(_),a+=30+g.length+v}const r=o.reduce((u,g)=>u+g.length,0),d=new DataView(new ArrayBuffer(22));return d.setUint32(0,101010256,!0),d.setUint16(8,c.length,!0),d.setUint16(10,c.length,!0),d.setUint32(12,r,!0),d.setUint32(16,a,!0),new Blob([...s,...o,d.buffer],{type:"application/zip"})}const Xe="pipp-export",Mo=1,xo=["song","call","alarm","flight"];function So(c){return c.includes("mp4")||c.includes("aac")?"m4a":c.includes("webm")?"webm":c.includes("ogg")?"ogg":c.includes("wav")?"wav":"bin"}function Eo(c){return c.includes("png")?"png":c.includes("heic")?"heic":c.includes("heif")?"heif":c.includes("webp")?"webp":"jpg"}function Co(c){const n=c.indexOf(";base64,");if(!c.startsWith("data:")||n<0)return new Uint8Array(0);const e=atob(c.slice(n+8)),t=new Uint8Array(e.length);for(let i=0;i<e.length;i++)t[i]=e.charCodeAt(i);return t}const ye=async c=>new Uint8Array(await c.arrayBuffer());async function Qe(c,n){const e=[],t=[];for(const a of c){const r=`recordings/${a.id}.${So(a.mime)}`;e.push({name:r,data:await ye(a.audio)});const d=Co(a.thumb),u=d.length?`recordings/${a.id}.png`:"";u&&e.push({name:u,data:d}),t.push({id:a.id,bird:a.bird,latin:a.latin,type:xo[a.type]??"song",seconds:a.seconds,date:a.date,confidence:a.confidence,mime:a.mime,audio:r,thumb:u})}const i=[];for(const a of n){const r=a.image.type||"image/jpeg",d=`pictures/${a.id}.${Eo(r)}`;e.push({name:d,data:await ye(a.image)}),i.push({id:a.id,bird:a.bird,date:a.date,mime:r,image:d})}const s=Dn(),o={format:Xe,version:Mo,exported:s,recordings:t,pictures:i};return e.unshift({name:"manifest.json",data:new Uint8Array(new TextEncoder().encode(JSON.stringify(o,null,2)))}),new File([Lo(e)],`pipp-export-${s.slice(0,10)}.zip`,{type:"application/zip"})}class dn extends Error{}async function To(c){if(typeof DecompressionStream>"u")throw new dn("deflate not supported");const n=new Blob([c]).stream().pipeThrough(new DecompressionStream("deflate-raw"));return new Uint8Array(await new Response(n).arrayBuffer())}async function No(c){const n=new Uint8Array(await c.arrayBuffer()),e=new DataView(n.buffer);let t=-1;for(let r=n.length-22;r>=Math.max(0,n.length-22-65535);r--)if(e.getUint32(r,!0)===101010256){t=r;break}if(t<0)throw new dn("not a zip file");const i=e.getUint16(t+10,!0);let s=e.getUint32(t+16,!0);const o=new TextDecoder,a=new Map;for(let r=0;r<i;r++){if(s+46>n.length||e.getUint32(s,!0)!==33639248)throw new dn("bad central directory");const d=e.getUint16(s+10,!0),u=e.getUint32(s+16,!0),g=e.getUint32(s+20,!0),p=e.getUint32(s+24,!0),v=e.getUint16(s+28,!0),f=e.getUint16(s+30,!0),m=e.getUint16(s+32,!0),_=e.getUint32(s+42,!0),w=o.decode(n.subarray(s+46,s+46+v));if(s+=46+v+f+m,w.endsWith("/"))continue;if(_+30>n.length||e.getUint32(_,!0)!==67324752)throw new dn(`bad entry ${w}`);const b=_+30+e.getUint16(_+26,!0)+e.getUint16(_+28,!0);if(b+g>n.length)throw new dn(`entry ${w} runs past the end`);const L=n.slice(b,b+g),k=d===0?L:d===8?await To(L):null;if(!k)throw new dn(`entry ${w} uses method ${d}`);if(k.length!==p||Je(k)!==u)throw new dn(`entry ${w} is damaged`);a.set(w,k)}return a}const Ro=["song","call","alarm","flight"];class Sn extends Error{constructor(n,e=""){super(e||n),this.key=n}key}const K=c=>typeof c=="string"?c:"",Jn=(c,n)=>typeof c=="number"&&Number.isFinite(c)?c:n;function Ao(c){let n="";for(let e=0;e<c.length;e+=32768)n+=String.fromCharCode(...c.subarray(e,e+32768));return`data:image/png;base64,${btoa(n)}`}const Xn=c=>N.birds.some(n=>n.id===c);async function jo(c){let n;try{n=await No(c)}catch(a){throw new Sn(a instanceof dn?"coll.err_zip":"coll.err_read",a instanceof Error?a.message:String(a))}const e=n.get("manifest.json");if(!e)throw new Sn("coll.err_manifest");let t;try{t=JSON.parse(new TextDecoder().decode(e))}catch{throw new Sn("coll.err_format")}if(!t||t.format!==Xe)throw new Sn("coll.err_format");const i={recordings:0,pictures:0,known:0,broken:0},s=await _o(),o=await ko();for(const a of Array.isArray(t.recordings)?t.recordings:[]){const r=K(a?.id);if(!r){i.broken++;continue}if(s.has(r)){i.known++;continue}const d=n.get(K(a.audio));if(!d){i.broken++;continue}const u=n.get(K(a.thumb)),g=K(a.bird),p={id:r,bird:Xn(g)?g:"",latin:K(a.latin)||(Xn(g)?"":g),type:Math.max(0,Ro.indexOf(K(a.type))),seconds:Math.max(0,Math.round(Jn(a.seconds,0))),date:K(a.date),confidence:Jn(a.confidence,0)<0?-1:Math.min(1,Jn(a.confidence,0)),mime:K(a.mime)||"audio/mp4",audio:new Blob([d],{type:K(a.mime)||"audio/mp4"}),thumb:u?Ao(u):"",from:"phone"};await pe(p),s.add(r),i.recordings++}for(const a of Array.isArray(t.pictures)?t.pictures:[]){const r=K(a?.id);if(!r){i.broken++;continue}if(o.has(r)){i.known++;continue}const d=n.get(K(a.image));if(!d){i.broken++;continue}const u=K(a.bird),g={id:r,bird:Xn(u)?u:"",date:K(a.date),image:new Blob([d],{type:K(a.mime)||"image/jpeg"}),from:"phone"};await Zn(g),o.add(r),i.pictures++}return i}function Io(c){const n=new Date(c),e=t=>String(t).padStart(2,"0");return`${n.getFullYear()}-${e(n.getMonth()+1)}-${e(n.getDate())} ${e(n.getHours())}:${e(n.getMinutes())}`}function Bo(c,n){const e=c.length;for(let t=1,i=0;t<e;t++){let s=e>>1;for(;i&s;s>>=1)i^=s;i^=s,t<i&&([c[t],c[i]]=[c[i],c[t]],[n[t],n[i]]=[n[i],n[t]])}for(let t=2;t<=e;t<<=1){const i=-2*Math.PI/t,s=Math.cos(i),o=Math.sin(i);for(let a=0;a<e;a+=t){let r=1,d=0;for(let u=0;u<t/2;u++){const g=c[a+u],p=n[a+u],v=c[a+u+t/2]*r-n[a+u+t/2]*d,f=c[a+u+t/2]*d+n[a+u+t/2]*r;c[a+u]=g+v,n[a+u]=p+f,c[a+u+t/2]=g-v,n[a+u+t/2]=p-f;const m=r*s-d*o;d=r*o+d*s,r=m}}}}function Oo(c){const i=c.sampleRate,s=c.getChannelData(0),o=Math.min(s.length,Math.round(30*i)),a=document.createElement("canvas");a.width=120,a.height=40;const r=a.getContext("2d");if(!r)return"";r.fillStyle="#efe8d6",r.fillRect(0,0,120,40);const d=r.getImageData(0,0,120,40),u=new Float32Array(1024),g=new Float32Array(1024),p=Math.min(1024/2,Math.round(8e3/i*1024)),v=[];let f=1e-9;for(let m=0;m<120;m++){const _=Math.floor(m/120*Math.max(0,o-1024));for(let b=0;b<1024;b++)u[b]=(s[_+b]??0)*(.5-.5*Math.cos(2*Math.PI*b/1024)),g[b]=0;Bo(u,g);const w=new Float32Array(40);for(let b=0;b<40;b++){const L=Math.floor(b/40*p),k=Math.max(L+1,Math.floor((b+1)/40*p));let x=0;for(let S=L;S<k;S++)x=Math.max(x,Math.hypot(u[S],g[S]));w[b]=x,f=Math.max(f,x)}v.push(w)}for(let m=0;m<120;m++)for(let _=0;_<40;_++){const w=20*Math.log10(v[m][_]/f+1e-9),b=Math.min(1,Math.max(0,(w+50)/40)),L=((39-_)*120+m)*4;d.data[L]=239+-205*b,d.data[L+1]=232+-204*b,d.data[L+2]=214+-194*b}return r.putImageData(d,0,0),a.toDataURL("image/png")}async function Ho(c,n){const e={added:0,skipped:0};let t=null;for(const i of Array.from(c)){const s=Io(i.lastModified||Date.now());if(i.type.startsWith("image/")){await Zn({id:Tn(),bird:n,date:s,image:i,from:"file"}),e.added++;continue}if(!i.type.startsWith("audio/")&&!/\.(m4a|mp3|wav|aac|webm|ogg|flac|aif|aiff|caf)$/i.test(i.name)){e.skipped++;continue}let o=0,a="";try{t??=new OfflineAudioContext(1,1,48e3);const r=await t.decodeAudioData(await i.arrayBuffer());o=Math.round(r.duration),a=Oo(r)}catch{}await pe({id:Tn(),bird:n,latin:"",type:0,seconds:o,date:s,confidence:-1,mime:i.type||"audio/mp4",audio:i,thumb:a,from:"file"}),e.added++}return e}const Go=50,Do=4e3;class nt{constructor(n,e,t){this.s=e,this.on=t;const i=h(n,{position:"absolute",inset:"0",zIndex:"50",display:"none",flexDirection:"column",background:"var(--sheet)"});this.root=i;const s=h(i,{height:"56px",flex:"none",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px",padding:"0 16px",borderBottom:"1px solid var(--ink)",background:"var(--ground)"});this.title=h(s,{font:"400 26px/1 var(--serif)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",minWidth:"0"}),this.date=l("span","label",s),this.date.style.flex="none";const o=h(i,{flex:"1",minHeight:"0",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",padding:"12px 16px",touchAction:"pan-y"});this.img=l("img","",o),Object.assign(this.img.style,{maxWidth:"100%",maxHeight:"100%",objectFit:"contain",border:"1px solid var(--ink)",display:"block"}),this.img.alt="",this.img.draggable=!1;const a={position:"absolute",bottom:"20px",width:"44px",height:"44px",padding:"0"};this.prev=new y(o,"",()=>this.step(-1),{...a,left:"16px"}).glyph("prev"),this.next=new y(o,"",()=>this.step(1),{...a,right:"16px"}).glyph("next"),o.addEventListener("pointerdown",u=>{this.downX=u.clientX}),o.addEventListener("pointerup",u=>{if(this.downX===null)return;const g=u.clientX-this.downX;this.downX=null,Math.abs(g)>=Go&&this.step(g<0?1:-1)}),o.addEventListener("pointercancel",()=>{this.downX=null});const r=h(i,{flex:"none",display:"grid",gridTemplateColumns:"repeat(3, minmax(0, 1fr))",gap:"6px",padding:"10px 16px 16px",borderTop:"1px solid var(--ink)",background:"var(--ground)"}),d={height:"44px",padding:"0",minWidth:"0"};this.closeBtn=new y(r,"",()=>this.close(),d),this.shareBtn=new y(r,"",()=>{const u=this.list[this.i];u&&this.on.share(u)},d),this.delBtn=new y(r,"",()=>{this.remove()},d),window.addEventListener("keydown",u=>{if(this.isOpen){if(u.key==="Escape")this.close();else if(u.key==="ArrowLeft")this.step(-1);else if(u.key==="ArrowRight")this.step(1);else return;u.preventDefault(),u.stopPropagation()}},!0)}s;on;root;title;date;img;prev;next;closeBtn;shareBtn;delBtn;list=[];i=0;url="";armed=0;downX=null;get isOpen(){return this.root.style.display!=="none"}open(n,e){this.list=n,this.i=Math.max(0,n.findIndex(t=>t.id===e)),this.root.style.display="flex",this.render()}close(){this.disarm(),this.root.style.display="none",this.img.removeAttribute("src"),this.url&&URL.revokeObjectURL(this.url),this.url=""}step(n){const e=this.i+n;e<0||e>=this.list.length||(this.i=e,this.disarm(),this.render())}disarm(){this.armed&&clearTimeout(this.armed),this.armed=0,this.delBtn.text(this.s.t("coll.delete")).on(!1)}async remove(){const n=this.list[this.i];if(n){if(!this.armed){this.delBtn.text(this.s.t("coll.delete_confirm",{n:"1"})).on(!0),this.armed=window.setTimeout(()=>this.disarm(),Do);return}if(this.disarm(),await this.on.remove(n),this.list.splice(this.i,1),!this.list.length){this.close();return}this.i=Math.min(this.i,this.list.length-1),this.render()}}applyStrings(){this.closeBtn.text(this.s.t("coll.close")),this.shareBtn.text(this.s.t("coll.share")),this.prev.e.setAttribute("aria-label",this.s.t("coll.prev_picture")),this.next.e.setAttribute("aria-label",this.s.t("coll.next_picture")),this.disarm(),this.isOpen&&this.render()}render(){const n=this.list[this.i];n&&(this.url&&URL.revokeObjectURL(this.url),this.url=URL.createObjectURL(n.image),this.img.src=this.url,this.title.textContent=this.on.name(n.bird),this.date.textContent=n.date,this.prev.disabled(this.i===0),this.next.disabled(this.i>=this.list.length-1))}}const Po=["song","call","alarm","flight"],we="24px 160px 56px 44px 126px 40px minmax(0, 1fr)",zo=4e3;class Zo{constructor(n,e,t){this.s=e,this.on=t;const i=h(n,{position:"absolute",left:"0",top:"0",width:"1280px",height:"100%",display:"none"});this.root=i;const s=(b,L,k)=>{const x=l("input","",i);return Object.assign(x,{type:"file",accept:b,multiple:L}),x.style.display="none",x.addEventListener("change",()=>{k(x)}),x};this.zipIn=s(".zip,application/zip",!1,b=>{this.importZip(b)}),this.filesIn=s("audio/*,image/*,.m4a,.webm",!0,b=>{this.add(b)}),this.picIn=s("image/*",!0,b=>{this.add(b)});const o=l("div","aside",i),a=h(o,{display:"flex",alignItems:"center",gap:"6px",height:"14px"});this.listLabel=l("span","",a),Object.assign(this.listLabel.style,{font:"600 10px/14px var(--mono)",letterSpacing:"0.14em",color:"var(--inkSoft)"}),h(a,{flex:"1",height:"1px",background:"var(--ink)"}),this.listCounts=l("span","",a),Object.assign(this.listCounts.style,{font:"500 10px/14px var(--mono)",letterSpacing:"0.06em"}),this.list=l("div","birdlist sheet",o);const r=h(i,{flex:"1",minWidth:"0",display:"flex",flexDirection:"column",gap:"8px",padding:"8px"}),d=h(r,{display:"flex",alignItems:"center",gap:"12px"});this.title=l("span","",d),Object.assign(this.title.style,{font:"400 28px/1 var(--serif)",whiteSpace:"nowrap"}),this.sub=l("span","",d),Object.assign(this.sub.style,{color:"var(--inkSoft)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",minWidth:"0"}),h(d,{flex:"1"});const u={height:"24px",padding:"0 10px"};this.importBtn=new y(d,"",()=>this.zipIn.click(),u),this.addBtn=new y(d,"",()=>this.filesIn.click(),u),this.exportBtn=new y(d,"",()=>{this.exportZip()},u);const g=h(r,{flex:"1",minHeight:"0",display:"flex",gap:"12px"}),p=h(g,{flex:"1",minWidth:"0",display:"flex",flexDirection:"column",gap:"6px"}),v=h(p,{display:"flex",alignItems:"center",gap:"6px",height:"14px"});this.recLabel=l("span","",v),Object.assign(this.recLabel.style,{font:"600 10px/14px var(--mono)",letterSpacing:"0.14em",color:"var(--inkSoft)"}),h(v,{flex:"1",height:"1px",background:"var(--ink)"}),this.recCount=l("span","",v),Object.assign(this.recCount.style,{font:"500 10px/14px var(--mono)",letterSpacing:"0.06em"});const f=h(p,{flex:"1",minHeight:"0",display:"flex",flexDirection:"column",fontSize:"13px"},"sheet");this.recHead=h(f,{height:"24px",flex:"none",display:"grid",gridTemplateColumns:we,columnGap:"10px",alignItems:"center",padding:"0 8px",background:"var(--panel)",borderBottom:"1px solid var(--ink)",font:"600 9px/12px var(--mono)",letterSpacing:"0.14em",color:"var(--inkSoft)"}),this.recRows=h(f,{flex:"1",minHeight:"0",overflowY:"auto",scrollbarWidth:"thin"});const m=h(p,{display:"flex",gap:"6px"});this.compareBtn=new y(m,"",()=>this.compare(),u),this.openBtn=new y(m,"",()=>{const b=this.chosenRec();b&&this.on.openPlay(b.bird)},u),this.finderBtn=new y(m,"",void 0,u).disabled(!0),this.deleteBtn=new y(m,"",()=>{this.remove()},u);const _=h(g,{width:"404px",flex:"none",display:"flex",flexDirection:"column",gap:"6px",minHeight:"0"}),w=h(_,{display:"flex",alignItems:"center",gap:"6px",height:"14px"});this.picLabel=l("span","",w),Object.assign(this.picLabel.style,{font:"600 10px/14px var(--mono)",letterSpacing:"0.14em",color:"var(--inkSoft)"}),h(w,{flex:"1",height:"1px",background:"var(--ink)"}),this.picCount=l("span","",w),Object.assign(this.picCount.style,{font:"500 10px/14px var(--mono)",letterSpacing:"0.06em"}),this.picGrid=h(_,{display:"grid",gridTemplateColumns:"repeat(3, minmax(0, 1fr))",gridAutoRows:"124px",gap:"6px",overflowY:"auto",minHeight:"0",scrollbarWidth:"thin"}),this.note=l("p","",r),Object.assign(this.note.style,{margin:"0",color:"var(--inkSoft)"}),this.viewer=new nt(i,e,{name:b=>this.name(b),share:b=>this.download(new File([b.image],`pipp-${b.bird||"bird"}-${b.date.replace(/[: ]/g,"-")}.${b.image.type.includes("png")?"png":"jpg"}`,{type:b.image.type})),remove:async b=>{await oe(b.id),await this.load()}})}s;on;root;recs=[];pics=[];bird="";chosen="";player=null;playing="";urls=[];message="";busy=!1;armed=0;viewer;listLabel;listCounts;list;title;sub;importBtn;addBtn;exportBtn;recLabel;recCount;recHead;recRows;compareBtn;openBtn;finderBtn;deleteBtn;picLabel;picCount;picGrid;note;zipIn;filesIn;picIn;show(n){this.root.style.display=n?"flex":"none",n?this.load():(this.stopAudio(),this.viewer.close(),this.disarm(),this.message="")}async load(){try{[this.recs,this.pics]=await Promise.all([We(),Ye()])}catch(n){this.message=String(n)}this.recs.some(n=>n.id===this.chosen)||(this.chosen=""),this.render()}entry(n){return N.birds.find(e=>e.id===n)}name(n,e=""){const t=this.entry(n);return t?this.s.no?t.name.no:t.name.en:e||this.s.t("coll.outside")}shownRecs(){return this.recs.filter(n=>!this.bird||n.bird===this.bird)}shownPics(){return this.pics.filter(n=>!this.bird||n.bird===this.bird)}chosenRec(){return this.shownRecs().find(n=>n.id===this.chosen)}step(n){const e=["",...N.birds.map(s=>s.id)],t=e.indexOf(this.bird),i=Math.min(e.length-1,Math.max(0,t+n));i!==t&&this.setBird(e[i])}setBird(n){this.bird=n,this.message="",this.disarm(),this.chosenRec()||(this.chosen=""),this.render(!0)}stopAudio(){this.player?.pause(),this.player=null,this.playing=""}play(n,e){const t=this.playing===n.id&&!e;if(this.stopAudio(),t){this.render();return}const i=URL.createObjectURL(n.audio),s=new Audio(i);this.player=s,this.playing=n.id;const o=()=>{URL.revokeObjectURL(i),this.player===s&&(this.playing="",this.render(),e?.())};s.onended=o,s.play().catch(()=>{this.message=this.s.t("coll.cannot_play"),o()}),this.render()}compare(){const n=this.chosenRec();!n||!q(n.bird)||this.play(n,()=>this.on.sing(n.bird,n.type))}disarm(){this.armed&&clearTimeout(this.armed),this.armed=0}async remove(){const n=this.chosenRec();if(n){if(!this.armed){this.armed=window.setTimeout(()=>{this.armed=0,this.render()},zo),this.render();return}this.disarm(),this.playing===n.id&&this.stopAudio(),await $e(n.id),this.chosen="",this.message=this.s.t("coll.deleted",{n:"1"}),await this.load()}}async importZip(n){const e=n.files?.[0];if(n.value="",!(!e||this.busy)){this.busy=!0,this.message=this.s.t("coll.importing"),this.render();try{const t=await jo(e);this.message=this.s.t("coll.imported",{r:String(t.recordings),p:String(t.pictures),k:String(t.known)}),t.broken&&(this.message+=`; ${this.s.t("coll.import_broken",{n:String(t.broken)})}`)}catch(t){const i=t instanceof Sn?this.s.t(t.key):t instanceof Error?t.message:String(t);this.message=this.s.t("coll.import_failed",{why:i})}finally{this.busy=!1}await this.load()}}async add(n){const e=n.files?Array.from(n.files):[];if(n.value="",!(!e.length||this.busy)){this.busy=!0;try{const t=await Ho(e,this.bird||this.on.playBird());this.message=this.s.t(t.skipped?"coll.added_skipped":"coll.added",{n:String(t.added),k:String(t.skipped)})}catch(t){this.message=String(t)}finally{this.busy=!1}await this.load()}}download(n){const e=URL.createObjectURL(n),t=l("a","",document.body);t.href=e,t.download=n.name,t.click(),t.remove(),setTimeout(()=>URL.revokeObjectURL(e),1e4),this.message=this.s.t("coll.export_saved",{file:n.name}),this.render()}async exportZip(){const n=this.shownRecs(),e=this.shownPics();if(!(this.busy||n.length+e.length===0)){this.busy=!0,this.message=this.s.t("coll.exporting"),this.render();try{this.download(await Qe(n,e))}catch(t){this.message=String(t)}finally{this.busy=!1,this.render()}}}applyStrings(){const n=this.s;this.listLabel.textContent=n.t("list.birds"),this.listCounts.textContent=n.t("coll.rec_pic"),this.importBtn.text(n.t("coll.import")),this.addBtn.text(n.t("coll.add_files")),this.exportBtn.text(n.t("coll.export")),this.recLabel.textContent=n.t("coll.recordings"),this.picLabel.textContent=n.t("coll.pictures"),this.recHead.replaceChildren();for(const e of["","coll.col_sonogram","coll.col_heard","coll.col_length","coll.col_date","coll.col_match","coll.col_from"])l("span","",this.recHead,e?n.t(e):"");this.compareBtn.text(n.t("coll.compare_pipp")),this.openBtn.text(n.t("coll.open_play")),this.finderBtn.text(n.t("coll.show_finder")),this.finderBtn.e.title=n.t("coll.finder_web"),this.note.textContent=n.t("coll.desk_note"),this.viewer.applyStrings(),this.render()}counts(n){const e=this.recs.filter(i=>!n||i.bird===n).length,t=this.pics.filter(i=>!n||i.bird===n).length;return e+t?`${e} · ${t}`:""}render(n=!1){const e=this.s;for(const p of this.urls)URL.revokeObjectURL(p);this.urls=[];const t=this.list.scrollTop;this.list.replaceChildren();const i=(p,v,f)=>{const m=l("div",`row${p===this.bird?" sel":""}`,this.list);m.style.paddingRight="8px",v&&l("span","n",m,v);const _=l("span","",m,f);Object.assign(_.style,{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",minWidth:"0"});const w=l("span","",m,this.counts(p));return Object.assign(w.style,{marginLeft:"auto",paddingLeft:"8px",fontSize:"11px",flex:"none",color:p===this.bird?"var(--onInk)":"var(--inkSoft)"}),m.addEventListener("click",()=>this.setBird(p)),m},s=i("","",e.t("coll.all_birds_row"));s.style.borderBottom="1px solid var(--divider)";for(const p of N.groups){l("div","gh",this.list,e.t(`group.${p}`));for(const v of N.birds)v.group===p&&i(v.id,v.number,this.name(v.id))}if(this.list.scrollTop=t,n){const p=this.list.querySelector(".row.sel");if(p){const v=p.offsetTop-this.list.offsetTop,f=this.list.clientHeight;v<this.list.scrollTop+24?this.list.scrollTop=Math.max(0,v-24):v+24>this.list.scrollTop+f&&(this.list.scrollTop=v+24-f)}}const o=this.entry(this.bird);this.title.textContent=o?this.name(o.id):e.t("coll.all_birds_row"),this.sub.textContent=o?`${e.no?o.name.en:o.name.no} · ${o.latin}`:"";const a=this.shownRecs(),r=this.shownPics(),d=this.recHead.lastElementChild;d&&(d.textContent=e.t(this.bird?"coll.col_from":"coll.col_bird")),this.importBtn.disabled(this.busy),this.addBtn.disabled(this.busy),this.exportBtn.disabled(this.busy||a.length+r.length===0),this.recCount.textContent=String(a.length),this.recRows.replaceChildren();for(const p of a){const v=p.id===this.chosen,f=h(this.recRows,{height:"32px",display:"grid",gridTemplateColumns:we,columnGap:"10px",alignItems:"center",padding:"0 8px",borderBottom:"1px solid var(--divider)",cursor:"pointer",...v?{background:"var(--ink)",color:"var(--onInk)"}:{}});f.addEventListener("click",()=>{this.chosen=p.id,this.disarm(),this.render()});const m=new y(f,"",()=>this.play(p),{width:"24px",height:"24px",padding:"0"}).glyph(this.playing===p.id?"stop":"play",e.t("coll.play"));m.on(this.playing===p.id),m.e.addEventListener("click",L=>{this.chosen=p.id,L.stopPropagation()});const _=h(f,{width:"160px",height:"24px",border:"1px solid var(--ink)",backgroundColor:"var(--face)",boxSizing:"border-box",overflow:"hidden"});if(p.thumb){const L=l("img","",_);Object.assign(L.style,{width:"158px",height:"22px",display:"block"}),L.src=p.thumb,L.alt=""}else _.classList.add("hatched");l("span","",f,e.t(`type.${Po[p.type]??"song"}`)),l("span","",f,p.seconds?`${Math.floor(p.seconds/60)}:${String(p.seconds%60).padStart(2,"0")}`:"–"),l("span","",f,p.date),l("span","",f,p.confidence>=0?`${A(Math.round(p.confidence*100),0,e.no)} %`:"–");const w=e.t(p.from==="file"?"coll.from_file":"coll.from_phone"),b=l("span","",f,this.bird?w:this.name(p.bird,p.latin));Object.assign(b.style,{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"})}const u=this.chosenRec();this.compareBtn.disabled(!u||!q(u.bird)),this.openBtn.disabled(!u||!q(u.bird)),this.deleteBtn.text(e.t(this.armed?"coll.delete_confirm":"coll.delete",{n:"1"})).on(!!this.armed).disabled(!u),this.picCount.textContent=String(r.length),this.picGrid.replaceChildren();for(const p of r){const v=l("button","pictile",this.picGrid);v.type="button",v.style.height="124px";const f=URL.createObjectURL(p.image);this.urls.push(f),v.style.backgroundImage=`url("${f}")`;const m=l("span","",v,this.bird?p.date.slice(0,10):`${p.date.slice(0,10)} ${this.name(p.bird)}`);Object.assign(m.style,{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}),v.addEventListener("click",()=>this.viewer.open(r.slice(),p.id))}const g=l("button","btn newpic",this.picGrid);g.type="button",g.style.height="124px",g.disabled=this.busy,l("span","plus",g,"+"),l("span","",g,e.t("coll.add_picture")),g.addEventListener("click",()=>this.picIn.click()),this.on.refresh()}statusText(){if(this.message)return this.message;const n=this.s.t("coll.counts",{r:String(this.shownRecs().length),p:String(this.shownPics().length)}),e=this.entry(this.bird);return e?`${U(this.name(e.id))}, ${n}`:n}}class ce{constructor(n,e,t,i){this.strings=i,this.cv=new Z(n,e,t)}strings;cv;variant="male";open=0;doc={};clips=new Map;drawnKey="";load(n){const e=en(n,"plate");if(this.doc={},this.clips.clear(),this.drawnKey="",!e)return"plate.json missing";try{this.doc=JSON.parse(e)}catch{return"plate.json is not JSON"}for(const[t,i]of Object.entries(this.doc.clips??{}))this.clips.set(t,new Path2D(i));return""}caption(){const n=this.doc.captions?.[this.variant];return n?n[this.strings.lang]??"":""}paint(n=!1){const e=`${this.variant}|${this.open.toFixed(3)}|${this.strings.lang}`;if(!n&&e===this.drawnKey)return;this.drawnKey=e;const t=this.cv.begin(),[i,s]=this.doc.box??[280,240],o=this.cv.w,a=this.cv.h,r=Math.min(o/i,a/s),d=(o-i*r)/2,u=(a-s*r)/2,g=this.doc.variants?.[this.variant]??{};for(const p of this.doc.layers??[]){t.save(),this.base(t,d,u,r);const v=p.within?this.clips.get(p.within):void 0;if(v&&!p.eye&&!p.hatch&&t.clip(v),this.pivot(t,p.part),p.part==="arcs"){this.open>.05&&p.path&&(t.globalAlpha=Math.min(1,this.open*1.6),t.strokeStyle=M.ink,t.lineWidth=p.stroke??1,t.stroke(new Path2D(p.path))),t.restore();continue}if(p.hatch){this.paintHatch(t,p.hatch,Number(g[`${p.hatch}_pitch`]??0)),t.restore();continue}if(p.eye){const m=Number(g.eye_ring??0),[_,w]=p.eye;t.lineWidth=1,m>0&&(t.beginPath(),t.arc(_,w,m,0,2*Math.PI),t.fillStyle=M.face,t.fill(),t.strokeStyle=M.ink,t.stroke()),t.beginPath(),t.arc(_,w,p.pupil??2,0,2*Math.PI),t.fillStyle=M.ink,t.fill(),t.restore();continue}let f=p.path?new Path2D(p.path):p.clip?this.clips.get(p.clip):void 0;if(p.variant){const m=String(g[p.variant]??"");if(!m){t.restore();continue}f=new Path2D(m)}if(!f){t.restore();continue}p.fill&&(t.fillStyle=Fo(p.fill,g),t.fill(f)),p.stroke&&p.stroke>0&&(t.strokeStyle=M.ink,t.lineWidth=p.stroke,t.lineJoin="round",t.stroke(f)),t.restore()}this.paintCallouts(t,d,u,r)}base(n,e,t,i){const s=this.cv.c.width/this.cv.w;n.setTransform(s*i,0,0,s*i,s*e,s*t)}pivot(n,e){const t=e?this.doc.pivots?.[e]:void 0;if(!t)return;const i=t.deg*this.open*Math.PI/180;n.translate(t.at[0],t.at[1]),n.rotate(i),n.translate(-t.at[0],-t.at[1])}paintHatch(n,e,t){const i=this.doc.hatch?.[e];if(!i||t<=0)return;const s=this.clips.get(i.clip);s&&n.clip(s);const[o,a,r,d]=i.rect,u=d-a;n.beginPath();for(let g=o-u;g<r;g+=t)i.up?(n.moveTo(g,d),n.lineTo(g+u,a)):(n.moveTo(g,a),n.lineTo(g+u,d));n.strokeStyle=M.ink,n.lineWidth=1,n.stroke()}paintCallouts(n,e,t,i){const s=this.cv.c.width/this.cv.w;for(const o of this.doc.callouts??[]){const a=o[this.variant]??{};if(!a.verified||!a[this.strings.lang])continue;n.save(),this.base(n,e,t,i),n.strokeStyle=M.inkSoft,n.lineWidth=1,n.stroke(new Path2D(o.leader)),n.restore(),n.setTransform(s,0,0,s,0,0);const d=(o[this.variant]??{})[this.strings.lang]??"",u=o.align==="centre"?"center":o.align==="right"?"right":"left",g=e+o.at[0]*i,p=t+o.at[1]*i;n.textAlign=u,n.textBaseline="middle",n.letterSpacing="0.5px";const v=m=>p-8+10*m+5;n.font=j(8,600),n.fillStyle=M.inkSoft,n.fillText(this.strings.t(`plate.${o.id}`),g,v(0)),n.font=j(8,500),n.fillStyle=M.ink,n.fillText(d,g,v(1)),n.letterSpacing="0px"}}}function Fo(c,n){const e=c in n?String(n[c]):c;return e==="shadow"?M.shadow:e==="ink"?M.ink:M.face}const Le=["song","call","alarm","flight"],Ko=["length","broods","range","habitat","food","status","nest"],In=22,Me=28,Qn=46,xe=96,Bn=88,Mn=16,et=1024,On=664,un=360,nn=372,Q=et-nn,Se=[0,2,5,8,11],Uo=[2,3,3,3,1],Ee=[3,0,1,2,3],qo=["season.winter","season.spring","season.summer","season.autumn","season.winter_short"];function Vo(c){if(!c)return c;const n=ln(c);return U(n.slice(0,1))+n.slice(1)}function Wo(c,n,e){const t=[];for(const i of n.split(`
`)){let s="";for(const o of i.split(" ").filter(a=>a)){const a=s?`${s} ${o}`:o;s&&Cn(c,a)>e?(t.push(s),s=o):s=a}t.push(s)}return t}const Yo=j(11,400);class tt{constructor(n,e,t,i,s=!1){this.host=e,this.s=t,this.on=i,this.phone=s,s&&(this.yearW=358,this.yearLabelCol=64,this.seasonH=44);const o=s?h(n,{display:"none",flexDirection:"column",gap:"12px"},"pguide"):h(n,{position:"absolute",left:"8px",top:"8px",width:`${et}px`,height:`${On}px`,display:"none"});this.root=o,this.platePanel=h(o,{border:"1px solid var(--ink)",display:"flex",flexDirection:"column"});const a=l("div","panelhead",this.platePanel);a.style.gap="8px",this.nameEl=l("div","title",a),this.nameEl.style.flex="1",this.sexBtns=D(a,[0,1].map(f=>({text:"",width:56,onClick:()=>i.sex(f)}))),this.ageBtns=D(a,[{text:"",width:44,onClick:()=>i.age(0)},{text:"",width:36,onClick:()=>i.age(1)}]),this.plateWell=h(this.platePanel,s?{height:"216px",padding:"2px",boxShadow:"var(--inset)"}:{flex:"1",padding:"2px",boxShadow:"var(--inset)"},"paper"),this.plate=new ce(this.plateWell,s?352:354,s?212:200,t),this.plateCap=h(this.platePanel,{height:"18px",flex:"none",borderTop:"1px solid var(--ink)",padding:"0 8px"},"cap");const r=()=>s?h(o,{display:"flex",flexDirection:"column",gap:"6px"}):o;let d=r();this.mfLabel=l("div","section",d),this.mfTable=l("div","gtable well",d),d=r(),this.factsLabel=l("div","section",d),this.factsTable=l("div","gtable well",d),d=r(),this.notesLabel=l("div","section",d);const u=h(d,s?{alignSelf:"center"}:{});this.fig=new Z(u,350,180),this.figCap=h(d,{},"cap"),Object.assign(this.figCap.style,{lineHeight:"12px",display:"flex",alignItems:"center"}),this.notesText=h(d,{font:`400 11px/${Mn}px var(--mono)`,overflow:"hidden",whiteSpace:"pre-wrap"}),this.typesTable=l("div","gtable well",d),s||(C(this.notesLabel,nn,0,Q,14),C(u,nn,20,350,180),C(this.figCap,nn,204,Q,12),C(this.notesText,nn+366,20,Q-366,196),C(this.typesTable,nn,222,Q,2+4*Me));for(let f=0;f<4;f++){const m=h(this.typesTable,{height:`${s?56:Me}px`},`grow${f<3?" rule":""}`),_=new y(m,"",()=>i.playType(f),s?{width:"44px",height:"44px",padding:"0",margin:"0 8px 0 6px"}:{width:"24px",height:"24px",padding:"0",margin:"0 8px 0 2px"}).glyph("play","Play");this.typeBtns.push(_),l("span","tname",m),l("span","tval",m)}d=r(),this.yearLabel=l("div","section",d);const g=80+this.seasonH-24,p=h(d,s?{position:"relative",height:`${g}px`}:{});s||(C(this.yearLabel,nn,348,Q,14),C(p,nn,368,Q,80)),this.year=new Z(p,this.yearW,g);const v=(this.yearW-1-this.yearLabelCol)/12;for(let f=0;f<5;f++){const m=this.yearLabelCol+Math.round(Se[f]*v),_=this.yearLabelCol+Math.round((Se[f]+Uo[f])*v)+1,w=new y(p,"",()=>i.season(Ee[f]));C(w.e,m,0,_-m,this.seasonH),s&&(w.e.style.letterSpacing="0"),this.seasonBtns.push(w)}this.yearNote=h(d,{font:`400 11px/${Mn}px var(--mono)`,overflow:"hidden"}),s&&(this.yearNote.style.paddingLeft=`${this.yearLabelCol}px`),d=r(),this.lookLabel=l("div","section",d),this.lookArea=h(d,{}),this.layoutLeft(0)}host;s;on;phone;root;plate;info={};plateDoc={};entry;bird=0;example=null;examples=new Map;state={sex:0,age:0,season:0,type:0,comparing:""};platePanel;nameEl;sexBtns;ageBtns;plateWell;plateCap;mfLabel;mfTable;factsLabel;factsTable;notesLabel;fig;figCap;notesText;typesTable;typeBtns=[];yearLabel;year;seasonBtns=[];yearNote;lookLabel;lookArea;compareBtns=[];yearW=Q;yearLabelCol=Bn;seasonH=24;get visible(){return this.root.style.display!=="none"}show(n){this.root.style.display=n?this.phone?"flex":"":"none",n&&this.paint()}resize(n){this.plate.cv.resize(n),this.fig.resize(n),this.year.resize(n),this.plate.paint(!0),this.paint()}layoutLeft(n){if(this.phone)return;const e=2+In*10;let t=On-e;C(this.factsTable,0,t,un,e),t-=20,C(this.factsLabel,0,t,un,14),t-=8;const i=2+In*(n+2);t-=i,C(this.mfTable,0,t,un,i),t-=20,C(this.mfLabel,0,t,un,14),t-=8,C(this.platePanel,0,0,un,t),this.plate.cv.setSize(un-2-4,Math.max(40,t-2-28-18-4),this.plate.cv.stageScale)}examplePhrase(n,e){if(this.examples.has(n))return this.examples.get(n);const t=this.host.pipp,i=t.x,s=i.pipp_engine_new();i.pipp_engine_prepare(s,48e3),i.pipp_engine_set_seed(s,1),i.pipp_engine_set_bird(s,e),i.pipp_engine_set_param(s,t.index("sc_type"),0),i.pipp_engine_set_param(s,t.index("pb_play"),1);const o=t.alloc(512*4);let a=null;for(let r=0;r<400&&!a;r++)i.pipp_engine_process(s,o,o,512),i.pipp_engine_phrases(s)>0&&(a=t.phrase(s));return t.free(o),i.pipp_engine_free(s),this.examples.set(n,a),a}setBird(n){this.entry=N.birds.find(t=>t.id===n),this.bird=this.host.birds.get(n)??0;try{this.info=JSON.parse(en(n,"bird")??"{}")}catch{this.info={}}try{this.plateDoc=JSON.parse(en(n,"plate")??"{}")}catch{this.plateDoc={}}this.plate.load(n),this.example=this.bird?this.examplePhrase(n,this.bird):null,this.layoutLeft(this.plateDoc.callouts?.length??0),this.lookArea.replaceChildren(),this.compareBtns=[];const e=this.info.lookalikes??[];e.forEach((t,i)=>{const s=h(this.lookArea,this.phone?{}:{height:`${Qn}px`},`look${i+1<e.length?" rule":""}`);l("div","lname",s),l("div","lother",s),l("div","ltext",s);const o=t.id??"",a=new y(s,"",()=>this.on.compare(o),this.phone?{height:"44px",padding:"0 10px",gridArea:"btn"}:{position:"absolute",right:"0",top:`${(Qn-1-24)/2}px`,width:"84px",height:"24px"});a.disabled(!o||!q(o)),this.compareBtns.push({id:o,b:a})}),this.applyStrings()}setState(n){this.state=n,this.refresh()}field(n){return this.s.field(n)}calloutValue(n,e){const t=n[e]??{},i=Vo(t[this.s.lang]??"");return t.verified&&i?i:this.s.t("not_described")}otherName(n,e){const t=N.birds.find(i=>i.id===n.id);return t?e?t.name.no:t.name.en:(e?n.name?.no:n.name?.en)??""}row(n,e,t,i){const s=h(n,this.phone?{}:{height:`${In}px`},`grow${i?"":" rule"}`),o=l("span","tkey",s,e);o.style.width=`${this.phone&&t.length>1?84:xe}px`;for(const a of t)l("span","tcell",s,a).title=a}applyStrings(){const n=this.s;this.sexBtns[0].text(n.t("plate.male")),this.sexBtns[1].text(n.t("plate.female")),this.ageBtns[0].text(n.t("plate.adult")),this.ageBtns[1].text(n.t("plate.juv")),this.seasonBtns.forEach((k,x)=>k.text(n.t(qo[x])));for(const k of this.compareBtns)k.b.text(n.t("guide.compare"));if(this.mfLabel.textContent=n.t("guide.male_female"),this.factsLabel.textContent=n.t("guide.facts"),this.notesLabel.textContent=n.t("guide.song_notes"),this.yearLabel.textContent=n.t("guide.year"),this.lookLabel.textContent=n.t("guide.lookalikes"),!this.entry)return;const e=n.no,t=this.info,i=e?this.entry.name.no:this.entry.name.en;this.nameEl.textContent=i;let s=22;const o=(this.phone?358:un)-2-16-111-8-79-8;for(;s>13&&Cn(j(s,400,!0),i)>o;)s--;this.nameEl.style.fontSize=`${s}px`;const a=this.mfTable;a.replaceChildren();const r=h(a,{height:`${this.phone?28:In}px`},"grow ghead");h(r,{width:`${this.phone?84:xe}px`,flex:"none"}),l("span","tcell",r,n.t("plate.male")),l("span","tcell",r,n.t("plate.female"));for(const k of this.plateDoc.callouts??[])this.row(a,n.t(`plate.${k.id}`),[this.calloutValue(k,"male"),this.calloutValue(k,"female")],!1);this.row(a,n.t("guide.song_row"),[this.field(t.sings?.male),this.field(t.sings?.female)],!0);const d=this.factsTable;d.replaceChildren(),this.row(d,n.t("fact.norwegian"),[this.entry.name.no],!1),this.row(d,n.t("fact.english"),[this.entry.name.en],!1),this.row(d,n.t("fact.latin"),[this.entry.latin],!1),Ko.forEach((k,x)=>this.row(d,n.t(`fact.${k}`),[this.field(t.facts?.[k])],x===6)),this.figCap.replaceChildren(),l("b","",this.figCap,`${n.t("fig")} 2`);const u=this.bird?Math.max(.25,this.host.pipp.x.pipp_bird_base(this.bird,5)/100):1,g=this.example,p=l("span","",this.figCap,g&&g.notes.length?n.t("guide.fig_phrase",{s:A(g.lengthMs/u/1e3,1,e)}):"");p.style.flex="1";const v=String(t.xeno_canto??""),f=l("a","xeno",this.figCap,n.t("guide.xeno"));v.startsWith("https://")&&(f.href=v,f.target="_blank",f.rel="noopener"),this.notesText.replaceChildren(),this.notesText.append(this.field(t.song_notes));const m=t.mnemonic?.[n.lang]??"";m&&(this.notesText.append(`

`),l("span","tkey",this.notesText,n.t("guide.mnemonic")).style.display="block",this.notesText.append(m)),[...this.typesTable.children].forEach((k,x)=>{k.children[1].textContent=n.t(`type.${Le[x]}`);const S=this.field(t.types?.[Le[x]]);k.children[2].textContent=S,k.children[2].title=S});const _=this.field(t.calendar?.note),w=Wo(Yo,_,Q-Bn).length;this.phone||C(this.yearNote,nn+Bn,454,Q-Bn,Mn*w),this.yearNote.textContent=_;const b=454+Mn*w+12;this.phone||(C(this.lookLabel,nn,b,Q,14),C(this.lookArea,nn,b+20,Q,On-b-20),this.lookArea.style.overflow="hidden");const L=t.lookalikes??[];L.length===0&&(this.lookArea.replaceChildren(),h(this.lookArea,{font:`400 11px/${Mn}px var(--mono)`}).textContent=n.t("guide.no_lookalikes")),[...this.lookArea.querySelectorAll(".look")].forEach((k,x)=>{const S=L[x];k.children[0].textContent=this.otherName(S,e),k.children[1].textContent=this.otherName(S,!e),k.children[2].textContent=this.field(S.text),this.phone||(k.style.visibility=b+20+(x+1)*Qn<=On+8?"":"hidden")}),this.refresh(),this.plate.paint(!0),this.paint()}refresh(){const n=this.state,e=this.s;this.sexBtns[0].on(n.sex===0),this.sexBtns[1].on(n.sex===1),this.ageBtns[0].on(n.age===0),this.ageBtns[1].on(n.age===1),this.plate.variant=n.age===1?"juvenile":n.sex===1?"female":"male",this.plate.paint(),this.plateCap.replaceChildren(),l("b","",this.plateCap,`${e.t("fig")} 1`),this.plateCap.append(this.plate.caption());const t=this.host.pipp.x;this.typeBtns.forEach((i,s)=>{const o=this.bird!==0&&t.pipp_bird_type_present(this.bird,s)!==0;i.disabled(!o).on(o&&n.type===s)}),this.seasonBtns.forEach((i,s)=>i.on(Ee[s]===n.season));for(const i of this.compareBtns)i.b.on(i.id!==""&&i.id===n.comparing)}poll(n){this.plate.open=n,this.plate.paint()}paint(){this.paintFigure(),this.paintYear()}paintFigure(){const n=this.fig.begin(),e=this.host.pipp,t=e.x;n.fillStyle=M.ink,n.fillRect(0,0,350,1),n.fillRect(0,161,350,1),n.fillRect(0,0,1,162),n.fillRect(349,0,1,162),n.fillRect(27,0,1,162),n.font=j(9,400),n.fillStyle=M.inkSoft,n.textAlign="right",n.textBaseline="middle",n.fillText(this.s.t("axis.khz",{n:"8"}),24,8),n.fillText(this.s.t("axis.khz",{n:"4"}),24,88),n.fillText("0",24,154);const i=28,s=1,o=320,a=160;n.save(),n.translate(i,s),wn(n,o,a),n.fillStyle=M.shadow,n.fillRect(0,0,o,1),n.fillRect(0,0,1,a),n.restore();const r=this.example,d=this.bird;if(!d||!r||r.notes.length===0||r.lengthMs<=0)return;const u=8,g=(o-2*u)/r.lengthMs,p=t.pipp_bird_base(d,0),v=S=>i+u+S*g,f=S=>s+a-Math.min(1,Math.max(0,S/8e3))*a,m=e.alloc(8);n.save(),n.beginPath(),n.rect(i+1,s+1,o-2,a-2),n.clip(),n.strokeStyle=M.ink,n.lineCap="round";const _=t.pipp_bird_syllable_count(d);for(const S of r.notes){if(S.syl<0||S.syl>=_||S.durMs<=0)continue;const T=Math.max(4,Math.floor(S.durMs*g/1.5));let P=0,H=0,B=!1;for(let F=0;F<=T;F++){const W=F/T;t.pipp_bird_syllable_at(d,S.syl,W,m);const[Y,z]=e.f32(m,2),R=v(S.startMs+W*S.durMs),I=f(Y*S.pitchMul*p),G=z>.08;G&&B&&(n.lineWidth=1+Math.min(1,z),n.beginPath(),n.moveTo(P,H),n.lineTo(R,I),n.stroke()),P=R,H=I,B=G}}n.restore(),e.free(m);const w=j(9,600);n.font=w,n.letterSpacing="1.26px",n.textAlign="left",n.textBaseline="middle";const b=166,L=t.pipp_bird_part_count(d);let k=0,x=i;for(;k<r.notes.length;){const S=r.notes[k].part;let T=k;for(;T+1<r.notes.length&&r.notes[T+1].part===S;)T++;if(S>=0&&S<L){const P=r.notes[k],H=r.notes[T],B=i+8+Math.round(P.startMs*g),F=i+8+Math.round((H.startMs+H.durMs)*g),W=this.field(this.info.parts?.[e.str(t.pipp_bird_part(d,S))]);n.fillStyle=M.ink,n.fillRect(B,b,Math.max(2,F-B),1);let Y=i+o;T+1<r.notes.length&&(Y=i+8+Math.round(r.notes[T+1].startMs*g)-6);const z=Math.ceil(n.measureText(W).width),R=Math.max(F,Y),I=Math.max(x+8,Math.min(B,R-z)),G=R-I;n.fillStyle=M.inkSoft,n.save(),z>G?(n.translate(I,0),n.scale(Math.max(.7,G/z),1),n.fillText(W,0,b+8)):n.fillText(W,I,b+8),n.restore(),x=I+Math.min(G,z)}k=T+1}n.letterSpacing="0px"}paintYear(){const n=this.year.begin(),e=this.s,t=this.yearLabelCol,i=(this.yearW-1-this.yearLabelCol)/12,s=this.seasonH-24,o=(d,u,g)=>{n.font=j(9,600),n.letterSpacing="1.26px",n.fillStyle=M.inkSoft,n.textAlign="left",n.textBaseline="middle",n.fillText(g,0,d+u/2),n.letterSpacing="0px"};o(0,this.seasonH,e.t("cal.season"));const a=e.t("cal.months").split("|");n.font=j(10,500),n.fillStyle=M.ink,n.textAlign="center";for(let d=0;d<12&&d<a.length;d++)n.fillText(a[d],t+Math.round(d*i)+i/2,36+s);const r=[[48+s,"cal.present",this.info.calendar?.present??""],[66+s,"cal.sings",this.info.calendar?.sings??""]];for(const[d,u,g]of r){o(d,14,e.t(u));let p=0;for(let v=1;v<=12;v++){const f=g[p]??"?",m=g[v]??"?";if(v<12&&m===f)continue;const _=t+Math.round(p*i),w=t+Math.round(v*i)+1;f==="y"?(n.fillStyle=M.ink,n.fillRect(_,d,w-_,14)):(n.fillStyle=M.face,n.fillRect(_,d,w-_,14),f==="n"&&ae(n,_,d,w-_,14,"rgba(34, 28, 20, 0.18)",5),n.strokeStyle=M.ink,n.lineWidth=1,n.strokeRect(_+.5,d+.5,w-_-1,13)),p=v}}}}const it="pipp.log",_n=["song","call","alarm","flight"],En=["male","female","juvenile","none"],$o="https://www.artsobservasjoner.no",ne="110px 60px 200px 80px 90px minmax(0, 1fr)",vn=c=>String(c).padStart(2,"0");function Jo(){try{const c=JSON.parse(localStorage.getItem(it)??"[]");return Array.isArray(c)?c.filter(n=>n&&typeof n.bird=="string"&&typeof n.date=="string"&&typeof n.time=="string"&&_n.includes(n.heard)&&En.includes(n.saw)):[]}catch{return[]}}function ee(c,n){const e=`${c.date} ${c.time}`,t=`${n.date} ${n.time}`;return e<t?1:e>t?-1:n.added-c.added}function Xo(c){const n=/^(\d{4})-(\d{2})-(\d{2})$/.exec(c);if(!n)return!1;const e=new Date(Number(n[1]),Number(n[2])-1,Number(n[3]));return e.getFullYear()===Number(n[1])&&e.getMonth()===Number(n[2])-1&&e.getDate()===Number(n[3])}function Qo(c){const n=/^(\d{2}):(\d{2})$/.exec(c);return!!n&&Number(n[1])<24&&Number(n[2])<60}function nr(c){return/[",\n\r;]/.test(c)?`"${c.replace(/"/g,'""')}"`:c}class st{constructor(n,e,t,i=!1){this.s=e,this.on=t,this.phone=i;const s=i?h(n,{display:"none",flexDirection:"column",gap:"12px"}):h(n,{position:"absolute",left:"8px",top:"8px",width:"1264px",height:"664px",display:"none"});this.root=s;const o=i?44:24;i&&(this.newBtn=new y(s,"",()=>this.openForm(!this.formOpen),{height:"44px"}));const a=h(s,{display:"flex",flexDirection:"column",gap:"12px"});i||C(a,0,0,360,664);const r=h(a,{display:"flex",flexDirection:"column",gap:"8px"});this.form=i?a:r,i&&(a.style.display="none"),this.formLabel=l("div","section",r);const d=(S,T,P)=>{const H=h(S,{display:"flex",flexDirection:"column",gap:"2px",minWidth:"0"});if(P){const B=l("label","field",H);B.htmlFor=P.id,this.labels[T]=B,H.appendChild(P)}else this.labels[T]=l("span","field",H);return H},u=S=>S.addEventListener("keydown",T=>{T.key==="Enter"&&(this.add(),T.preventDefault()),T.stopPropagation(),/^F[1-6]$/.test(T.key)&&(T.preventDefault(),window.dispatchEvent(new KeyboardEvent("keydown",{key:T.key})))}),g=S=>{const T=l("input","input");return T.id=S,T.type="text",T.autocomplete="off",T.spellcheck=!1,u(T),T};this.birdSel=l("select","input"),this.birdSel.id="log-bird",u(this.birdSel),d(r,"bird",this.birdSel);const p=h(r,{display:"grid",gridTemplateColumns:"repeat(2, minmax(0, 1fr))",gap:"8px"});this.dateIn=g("log-date"),this.timeIn=g("log-time"),d(p,"date",this.dateIn),d(p,"time",this.timeIn),this.placeIn=g("log-place"),d(r,"place",this.placeIn);const v=d(r,"heard",null);this.heardBtns=D(v,_n.map(S=>({text:"",onClick:()=>{this.heard=S,this.update()}})),o);const f=d(r,"saw",null);this.sawBtns=D(f,En.map(S=>({text:"",onClick:()=>{this.saw=S,this.update()}})),o),this.noteIn=g("log-note"),d(r,"note",this.noteIn);const m=h(r,{display:"flex",gap:"6px"});this.addBtn=new y(m,"",()=>this.add(),{flex:"1",height:i?"44px":"32px",fontSize:"11px"}),this.report=l("a","btn"),i||m.appendChild(this.report),Object.assign(this.report.style,{flex:"1",height:i?"44px":"32px",textDecoration:"none"}),this.report.href=$o,this.report.target="_blank",this.report.rel="noopener noreferrer";const _=h(i?h(s,{display:"contents"}):a,{display:"flex",flexDirection:"column",gap:"6px"});this.mannersLabel=l("div","section",_),this.mannersText=l("p","",_),Object.assign(this.mannersText.style,{margin:"0",font:"400 11px/16px var(--mono)"});const w=h(s,{display:"flex",flexDirection:"column",gap:i?"12px":"6px"});i?(w.style.order="0",s.insertBefore(w,_.parentElement)):C(w,372,0,892,664);const b=h(w,{display:"flex",alignItems:"center",gap:"6px",height:"14px",flex:"none"});this.listLabel=l("span","field",b),Object.assign(this.listLabel.style,{fontSize:"10px",lineHeight:"14px",height:"14px"}),h(b,{flex:"1",height:"1px",background:"var(--ink)"}),this.countLabel=l("span","",b),Object.assign(this.countLabel.style,{font:"500 10px var(--mono)",letterSpacing:"0.06em"});const L=h(w,{flex:"1",minHeight:"0",display:"flex",flexDirection:"column"},"sheet logsheet");i&&(b.style.marginBottom="-6px"),this.listHead=h(L,{gridTemplateColumns:ne,display:i?"none":""},"logrow loghead"),this.rows=h(L,i?{}:{flex:"1",minHeight:"0",overflowY:"auto"},"logrows");const k=h(w,i?{display:"grid",gridTemplateColumns:"repeat(3, minmax(0, 1fr))",gap:"6px"}:{display:"flex",gap:"6px",flex:"none"}),x=i?{height:"44px",padding:"0",minWidth:"0"}:{height:"24px",padding:"0 10px"};this.openBtn=new y(k,"",()=>this.open(),x),this.deleteBtn=new y(k,"",()=>this.remove(),x),this.exportBtn=new y(k,"",()=>this.exportCsv(),x),i&&(w.appendChild(this.report),this.report.style.flex="none")}s;on;phone;root;entries=Jo().sort(ee);selected=0;message="";formLabel;labels={};birdSel;dateIn;timeIn;placeIn;noteIn;heardBtns;sawBtns;heard="song";saw="none";addBtn;report;mannersLabel;mannersText;listLabel;countLabel;listHead;rows;openBtn;deleteBtn;exportBtn;newBtn=null;form;formOpen=!1;show(n){this.root.style.display=n?this.phone?"flex":"":"none"}openForm(n){this.formOpen=n,n&&this.enter(),this.form.style.display=n?"flex":"none",this.update()}enter(){const n=new Date;this.birdSel.value=this.on.playBird(),this.dateIn.value=`${n.getFullYear()}-${vn(n.getMonth()+1)}-${vn(n.getDate())}`,this.timeIn.value=`${vn(n.getHours())}:${vn(n.getMinutes())}`,this.heard=_n[this.on.playType()]??"song",this.message="",this.update()}name(n){return n?this.s.no?n.name.no:n.name.en:""}bird(n){return N.birds.find(e=>e.id===n)}heardText(n){return this.s.t(`type.${n}`)}sawText(n){return n==="male"?this.s.t("plate.male"):n==="female"?this.s.t("plate.female"):n==="juvenile"?this.s.t("log.saw_juvenile"):"---"}applyStrings(){const n=this.s;this.formLabel.textContent=n.t("log.form");for(const t of["bird","date","time","place","heard","saw","note"])this.labels[t].textContent=n.t(`log.${t}`);const e=this.birdSel.value;this.birdSel.replaceChildren();for(const t of N.birds){const i=l("option","",this.birdSel,`${t.number} ${this.name(t)}`);i.value=t.id}this.birdSel.value=e||this.on.playBird(),this.placeIn.placeholder=n.t("log.place_hint"),this.noteIn.placeholder=n.t("log.note_hint"),_n.forEach((t,i)=>this.heardBtns[i].text(this.heardText(t))),this.sawBtns.forEach((t,i)=>t.text(En[i]==="none"?n.t("log.saw_none"):this.sawText(En[i]))),this.addBtn.text(n.t("log.add")),this.report.textContent=n.t("log.report"),this.mannersLabel.textContent=n.t("log.manners"),this.mannersText.textContent=n.t("log.manners_text"),this.listLabel.textContent=n.t("log.list"),this.listHead.replaceChildren();for(const t of["log.date","log.time","log.bird","log.heard","log.saw","log.col_place_note"])l("span","",this.listHead,n.t(t));this.openBtn.text(n.t("log.open")),this.deleteBtn.text(n.t("log.delete")),this.exportBtn.text(n.t("log.export")),this.newBtn?.text(n.t("phone.log.new")),this.update()}update(){const n=this.s;this.heardBtns.forEach((i,s)=>i.on(_n[s]===this.heard)),this.sawBtns.forEach((i,s)=>i.on(En[s]===this.saw));const e=new Set(this.entries.map(i=>i.bird)).size;if(this.countLabel.textContent=n.t("log.heard_count",{n:String(e),total:String(N.birds.length)}),this.rows.replaceChildren(),this.newBtn?.on(this.formOpen),this.entries.forEach((i,s)=>{const o=[i.place,i.note].filter(r=>r.trim()).join(", ");if(this.phone){const r=h(this.rows,{},s===this.selected?"plogrow sel":"plogrow"),d=l("span","",r),u=l("span","soft",r);l("span","pbird",d,this.name(this.bird(i.bird))||i.bird),l("span","ptag",d,`${this.heardText(i.heard)} · ${this.sawText(i.saw)}`),l("span","",u,`${i.date} ${i.time}`),l("span","",u,o),r.addEventListener("click",()=>{this.selected=s,this.message="",this.update(),this.on.refresh()});return}const a=h(this.rows,{gridTemplateColumns:ne},s===this.selected?"logrow sel":"logrow");for(const r of[i.date,i.time,this.name(this.bird(i.bird))||i.bird,this.heardText(i.heard),this.sawText(i.saw),o])l("span","",a,r);a.addEventListener("click",()=>{this.selected=s,this.message="",this.update(),this.on.refresh()}),a.addEventListener("dblclick",()=>this.open())}),!this.phone||this.entries.length===0){const i=h(this.rows,{gridTemplateColumns:ne},this.phone?"plogrow blank":"logrow blank");if(this.phone)i.textContent="---";else for(const s of["----------","-----","---","---","---","---"])l("span","",i,s)}const t=this.entries[this.selected];this.openBtn.disabled(!t||!q(t.bird)),this.deleteBtn.disabled(!t),this.exportBtn.disabled(this.entries.length===0)}save(){localStorage.setItem(it,JSON.stringify(this.entries))}add(){const n=this.dateIn.value.trim(),e=this.timeIn.value.trim();if(!Xo(n)){this.message=this.s.t("log.bad_date"),this.on.refresh(),this.dateIn.focus();return}if(!Qo(e)){this.message=this.s.t("log.bad_time"),this.on.refresh(),this.timeIn.focus();return}const t={bird:this.birdSel.value,date:n,time:e,place:this.placeIn.value.trim(),heard:this.heard,saw:this.saw,note:this.noteIn.value.trim(),added:Date.now()};this.entries.push(t),this.entries.sort(ee),this.selected=this.entries.indexOf(t),this.save(),this.noteIn.value="",this.phone&&(this.formOpen=!1,this.form.style.display="none"),this.message=this.s.t("log.added",{bird:this.name(this.bird(t.bird))}),this.update(),this.scrollToSelected(),this.on.refresh()}addHeard(n,e){const t=new Date,i=o=>String(o).padStart(2,"0"),s={bird:n,date:`${t.getFullYear()}-${i(t.getMonth()+1)}-${i(t.getDate())}`,time:`${i(t.getHours())}:${i(t.getMinutes())}`,place:"",heard:_n[e]??"song",saw:"none",note:"",added:Date.now()};this.entries.push(s),this.entries.sort(ee),this.selected=this.entries.indexOf(s),this.save(),this.update()}remove(){const n=this.entries[this.selected];n&&(this.entries.splice(this.selected,1),this.selected=Math.min(this.selected,Math.max(0,this.entries.length-1)),this.save(),this.message=this.s.t("log.deleted",{bird:this.name(this.bird(n.bird))}),this.update(),this.on.refresh())}open(){const n=this.entries[this.selected];n&&q(n.bird)&&this.on.openBird(n.bird)}step(n){this.entries.length!==0&&(this.selected=Math.max(0,Math.min(this.entries.length-1,this.selected+n)),this.message="",this.update(),this.scrollToSelected(),this.on.refresh())}scrollToSelected(){this.rows.children[this.selected]?.scrollIntoView({block:"nearest"})}exportCsv(){const n=this.s,t=[["log.date","log.time","log.bird","log.csv_bird_latin","log.heard","log.saw","log.place","log.note"].map(a=>n.t(a)),...this.entries.map(a=>{const r=this.bird(a.bird);return[a.date,a.time,this.name(r)||a.bird,r?.latin??"",this.heardText(a.heard),a.saw==="none"?"":this.sawText(a.saw),a.place,a.note]})].map(a=>a.map(nr).join(",")),i=new Blob(["\uFEFF"+t.join(`\r
`)+`\r
`],{type:"text/csv;charset=utf-8"}),s=new Date,o=l("a");o.href=URL.createObjectURL(i),o.download=`pipp-log-${s.getFullYear()}-${vn(s.getMonth()+1)}-${vn(s.getDate())}.csv`,o.click(),setTimeout(()=>URL.revokeObjectURL(o.href),1e3)}statusText(){if(this.message)return this.message;const n=this.entries.length;return n===1?this.s.t("log.entries_one"):this.s.t("log.entries",{n:String(n)})}}const Ln=["vo_pitch","vo_breath","vo_tension","vo_trill","vo_rough","ph_tempo","ph_pause","ph_length","ph_variation","su_distance","su_wind","su_space"],Ce=0,er=3,Te=6,Ne=7,Re=9,tr=10;class at{constructor(n,e,t,i){this.host=e,this.strings=t,this.k=i,this.cv=new Z(n,78,104);const s=this.cv.c;s.style.cursor="ns-resize",s.style.touchAction="none",s.addEventListener("pointerenter",()=>{this.hover=!0,this.dirty=!0}),s.addEventListener("pointerleave",()=>{this.hover=!1,this.dirty=!0}),s.addEventListener("pointerdown",a=>{s.setPointerCapture(a.pointerId),this.startNorm=this.toNorm(this.value()),this.dragging=!0,this.startY=a.clientY,this.send(this.startNorm),e.post({t:"hand",k:i,down:!0}),a.preventDefault()}),s.addEventListener("pointermove",a=>{if(!this.dragging)return;const r=s.getBoundingClientRect().height/104,d=(a.shiftKey?800:200)*r;this.send(Math.min(1,Math.max(0,this.startNorm+(this.startY-a.clientY)/d)))});const o=()=>{this.dragging&&(this.dragging=!1,e.post({t:"hand",k:i,down:!1}),this.dirty=!0)};s.addEventListener("pointerup",o),s.addEventListener("pointercancel",o),s.addEventListener("wheel",a=>{a.preventDefault(),this.send(Math.min(1,Math.max(0,this.toNorm(this.value())-Math.sign(a.deltaY)*.03))),e.post({t:"hand",k:i,down:!0}),e.post({t:"hand",k:i,down:!1})},{passive:!1})}host;strings;k;cv;bird=0;shown=NaN;shownHand=!1;hover=!1;dragging=!1;startNorm=0;startY=0;dirty=!0;setBird(n){this.bird=n,this.host.ready||(this.shown=NaN),this.dirty=!0}invalidate(){this.dirty=!0}value(){return this.dragging?this.shown:this.host.ready?this.host.knobValue(this.k):Number.isNaN(this.shown)?this.bird?this.host.pipp.x.pipp_bird_base(this.bird,this.k):this.host.pipp.params[this.k].def:this.shown}range(){const n=this.host.pipp.x;if(this.bird)return[n.pipp_bird_range_lo(this.bird,this.k),n.pipp_bird_range_hi(this.bird,this.k)];const e=this.host.pipp.params[this.k];return[e.min,e.max]}logScale(){return[Ce,Te,Ne,Re].includes(this.k)}toNorm(n){const[e,t]=this.range();return t<=e?0:(n=Math.min(t,Math.max(e,n)),this.logScale()&&e>0?Math.log(n/e)/Math.log(t/e):(n-e)/(t-e))}fromNorm(n){const[e,t]=this.range();return this.logScale()&&e>0?e*Math.pow(t/e,n):e+n*(t-e)}send(n){const e=this.fromNorm(n);this.host.param(Ln[this.k],e),this.shown=e,this.dirty=!0}format(n,e){const t=this.strings.no;switch(this.k){case Ce:{const i=this.bird?this.host.pipp.x.pipp_bird_pitch_ref(this.bird):2e3;return`${A(n*i/1e3,e?3:1,t)} kHz`}case er:return`${A(n,e?1:0,t)} Hz`;case Te:case Ne:return`${A(n,e?2:1,t)} s`;case Re:return`${A(n,e?1:0,t)} m`;case tr:return`${A(n,1,t)} m/s`;default:return`${A(n,e?1:0,t)} %`}}poll(){const n=this.value(),e=this.dragging||this.host.ready&&this.host.knobOverridden(this.k);!this.dragging&&this.host.ready&&(this.shown=n),(Math.abs(n-this.drawnValue)>1e-5||e!==this.shownHand)&&(this.dirty=!0),this.shownHand=e,this.dirty&&this.draw(n)}drawnValue=NaN;draw(n){this.dirty=!1,this.drawnValue=n;const e=this.cv.begin(),t=this.toNorm(n),i=36,s=54,o=-.75*Math.PI,a=1.5*Math.PI;e.font=j(10,600),e.letterSpacing="1.4px",e.fillStyle=M.inkSoft,e.textAlign="center",e.textBaseline="middle",e.fillText(this.strings.t(`knob.${Ln[this.k]}`),36,7),e.strokeStyle=M.inkSoft,e.lineWidth=1;for(let u=0;u<11;u++){const g=o+a*u/10,p=Math.sin(g),v=-Math.cos(g);e.beginPath(),e.moveTo(i+30*p,s+30*v),e.lineTo(i+34*p,s+34*v),e.stroke()}const r=(u,g,p)=>{e.strokeStyle=p,e.lineWidth=3,e.beginPath(),e.arc(i,s,26.5,u-Math.PI/2,g-Math.PI/2),e.stroke()};r(o,o+a,M.faint),t>.001&&r(o,o+a*t,this.shownHand?M.ink:M.plum),e.fillStyle=M.face,e.beginPath(),e.arc(i,s,22,0,2*Math.PI),e.fill(),e.strokeStyle=M.ink,e.lineWidth=1,e.stroke();const d=o+a*t;if(e.lineWidth=2,e.beginPath(),e.moveTo(i+6*Math.sin(d),s-6*Math.cos(d)),e.lineTo(i+19*Math.sin(d),s-19*Math.cos(d)),e.stroke(),e.font=j(10,500),e.letterSpacing="0.6px",this.hover||this.dragging){const u=this.format(n,!0),g=Math.ceil(e.measureText(u).width)+8;e.fillStyle=M.ink,e.fillRect(Math.round(36-g/2),90,g,14),e.fillStyle=M.onInk,e.fillText(u,36,97.5)}else e.fillStyle=M.ink,e.fillText(this.format(n,!1),36,97.5);if(this.shownHand){const u=this.strings.t("knob.hand");e.font=j(8,600),e.letterSpacing="0.5px";const g=Math.ceil(e.measureText(u).width)+6;e.fillStyle=M.ink,e.fillRect(78-g,12,g,10),e.fillStyle=M.onInk,e.fillText(u,78-g/2,17.5)}e.letterSpacing="0px"}}const on=80,J=on/1e3,Ae=2.5,je=7,ir=250,sr=8e3,ar=90,Ie=.03;class ot{constructor(n,e,t={w:680,h:320,pxPerKHz:40,playheadX:456}){this.host=e,this.W=t.w,this.H=t.h,this.px=t.playheadX,this.phz=t.pxPerKHz/1e3,this.cv=new Z(n,this.W,this.H),this.line=e.pipp.x.pipp_line_new(),this.at=e.pipp.alloc(8);const i=this.cv.c;i.style.touchAction="none";const s=o=>{const a=i.getBoundingClientRect();return{x:(o.clientX-a.left)/a.width*this.W,y:(o.clientY-a.top)/a.height*this.H}};i.addEventListener("pointerdown",o=>{this.drawMode&&(i.setPointerCapture(o.pointerId),this.pointer=s(o),this.hover=!0,this.stroke=[],this.erasing?this.eraseAt(this.pointer):this.stroke.push(...this.pointFor(this.pointer)))}),i.addEventListener("pointermove",o=>{if(this.drawMode&&(this.pointer=s(o),this.hover=!0,o.buttons!==0)){if(this.erasing)this.eraseAt(this.pointer);else if(this.stroke.length){const a=this.pointFor(this.pointer);a[0]>=this.stroke[this.stroke.length-3]+1&&this.stroke.push(...a)}}}),i.addEventListener("pointerup",()=>{if(!this.drawMode||this.erasing||!this.stroke.length)return;const o=this.host.pipp,a=this.stroke.length/3,r=o.buf(this.stroke.length*4);o.f32(r,this.stroke.length).set(this.stroke),o.x.pipp_line_add_stroke(this.line,r,a,J,this.phz,Ae),this.stroke=[],this.onLineChanged()}),i.addEventListener("pointerleave",()=>{this.hover=!1})}host;cv;bird=0;nowText="NOW";yourPhraseText="YOUR PHRASE STARTS";handLabel=()=>"";flagText=()=>"";onLineChanged=()=>{};line;erasing=!1;drawMode=!1;frozen=[];frozenRate=0;frozenReady=!1;hover=!1;pointer={x:0,y:0};stroke=[];phrase=null;startNumber=0;phraseStartFrame=0;at;W;H;px;phz;y(n){return this.H-n*this.phz}get lastPhrase(){return this.phrase}get frozenNow(){return this.frozenReady}setDrawMode(n){this.drawMode=n,this.frozen=[],this.frozenReady=!1,this.hover=!1,this.stroke=[],this.cv.c.style.cursor=n?"crosshair":"default"}linePoints(){const n=this.host.pipp,e=n.x.pipp_line_count(this.line),t=n.buf(Math.max(1,e)*12);return n.x.pipp_line_points(this.line,t),n.f32(t,e*3).slice()}lineCount(){return this.host.pipp.x.pipp_line_count(this.line)}clearLine(){this.host.pipp.x.pipp_line_clear(this.line),this.onLineChanged()}addStroke(n){const e=n.flatMap(([s,o])=>[s,o,0]),t=this.host.pipp,i=t.buf(e.length*4);t.f32(i,e.length).set(e),t.x.pipp_line_add_stroke(this.line,i,n.length,J,this.phz,Ae),this.onLineChanged()}hoverAt(n,e){this.hover=!0,this.pointer={x:n,y:e}}pointFor(n){return[Math.max(0,n.x)/J,Math.min(sr,Math.max(ir,(this.H-n.y)/this.phz)),0]}eraseAt(n){const[e,t]=this.pointFor(n);this.host.pipp.x.pipp_line_erase(this.line,e,t,J,this.phz,je)&&this.onLineChanged()}drawnAt(n){const e=this.host.pipp;e.x.pipp_line_at(this.line,n,this.at);const t=e.f32(this.at,2);return[t[0],t[1]]}poll(){const n=this.host;n.phrase&&(this.phrase=n.phrase);const e=this.phrase?.number??0;if(e!==this.startNumber){this.startNumber=e;const t=Math.floor(n.sonoRate/30);this.phraseStartFrame=n.sonoWritten>t?n.sonoWritten-t:0}this.drawMode&&!this.frozenReady&&!(n.singing&&!this.phrase?.drawn)&&this.freeze(),this.paint()}freeze(){const n=this.host;this.frozen=[],this.frozenRate=n.sonoRate;const e=n.sonoWritten,t=Math.min(e,pn-64),i=e-t,s=Math.floor(.35*this.frozenRate);if(this.startNumber>0&&this.phraseStartFrame>=i+s){const o=Math.floor(this.W/on*this.frozenRate),a=this.phraseStartFrame-s;for(let r=a;r<e&&r-a<o;r++)this.frozen.push(n.sonoFrame(r))}this.frozenReady=!0}paint(){const n=this.cv.begin();if(wn(n,this.W,this.H),n.fillStyle=M.shadow,n.fillRect(0,0,this.W,1),n.fillRect(0,0,1,this.H),n.lineCap="round",this.drawMode&&this.frozenReady){this.paintFrozen(n),this.paintLine(n),this.paintCursor(n);return}this.paintSung(n),this.paintNext(n),n.fillStyle=M.plum,n.fillRect(this.px,0,1,this.H),n.fillRect(this.px+1,0,26,12),n.fillStyle=M.paper,n.font=j(8,600),n.letterSpacing="0.5px",n.textBaseline="middle",n.textAlign="left",n.fillText(this.nowText,this.px+5,6.5),n.letterSpacing="0px"}seg(n,e,t,i,s,o){n.lineWidth=o,n.beginPath(),n.moveTo(e,t),n.lineTo(i,s),n.stroke()}joins(n,e){return n.amp>Ie&&e.amp>Ie&&n.hz>0&&e.hz>0&&Math.abs(Math.log2(n.hz/e.hz))<.35}paintFrozen(n){if(!(this.frozen.length<2||this.frozenRate<=0)){n.strokeStyle=M.shadow;for(let e=1;e<this.frozen.length;e++){const t=this.frozen[e],i=this.frozen[e-1];if(!this.joins(t,i))continue;const s=Math.min(1,.5*(t.amp+i.amp)/.35);this.seg(n,(e-1)/this.frozenRate*on,this.y(i.hz),e/this.frozenRate*on,this.y(t.hz),1.5+1.5*s)}}}paintLine(n){const e=this.host.pipp,t=e.x,i=t.pipp_line_count(this.line),s=this.linePoints();if(i>0){const o=Math.floor(t.pipp_line_start(this.line)*J)+.5;n.strokeStyle=M.ink,n.lineWidth=1,n.setLineDash([2,4]),n.beginPath(),n.moveTo(o,0),n.lineTo(o,this.H),n.stroke(),n.setLineDash([]),n.fillStyle=M.ink,n.font=j(8,600),n.letterSpacing="0.5px",n.textBaseline="middle",n.textAlign="left",n.fillText(this.yourPhraseText,o+5.5,8.5),n.letterSpacing="0px"}n.strokeStyle=M.ink,n.lineWidth=3,n.lineCap="butt",n.lineJoin="miter";for(let o=0;o<i;){let a=o;for(;a+1<i&&s[3*(a+1)+2]!==0;)a++;const r=s[3*o],d=o===a?r+ar:s[3*a],u=Math.max(1,Math.floor((d-r)*J/2));n.beginPath();for(let g=0;g<=u;g++){const p=r+(d-r)*g/u,[v]=this.drawnAt(Math.min(d-.01,Math.max(r+.01,p)));g===0?n.moveTo(p*J,this.y(v)):n.lineTo(p*J,this.y(v))}n.stroke(),o=a+1}if(this.stroke.length){n.beginPath();for(let o=0;o<this.stroke.length;o+=3){const a=this.stroke[o]*J,r=this.y(this.stroke[o+1]);o===0?n.moveTo(a,r):n.lineTo(a,r)}n.stroke()}n.lineWidth=1;for(let o=0;o<i;o++){const a=Math.round(s[3*o]*J)-3,r=Math.round(this.y(s[3*o+1]))-3;n.fillStyle=M.face,n.fillRect(a,r,6,6),n.strokeStyle=M.ink,n.strokeRect(a+.5,r+.5,5,5)}this.host.singing&&this.phrase?.drawn&&(n.fillStyle=M.plum,n.fillRect((this.phrase.drawnStartMs+this.host.phrasePosMs)*J,0,1,this.H)),n.lineCap="round"}paintCursor(n){if(!this.hover)return;const e=Math.round(this.pointer.x),t=Math.round(this.pointer.y);if(n.fillStyle=M.ink,n.fillRect(e,t-14,1,28),n.fillRect(e-14,t,28,1),this.erasing){n.strokeStyle=M.ink,n.lineWidth=1,n.beginPath(),n.arc(e,t,je,0,2*Math.PI),n.stroke();return}const[i,s]=this.pointFor(this.pointer),o=this.flagText(s,i/1e3);n.font=j(9,500);const a=Math.ceil(n.measureText(o).width)+12;let r=e+6,d=t-24;r+a>this.W&&(r=e-6-a),d<0&&(d=t+10),n.fillRect(r,d,a,14),n.fillStyle=M.onInk,n.textBaseline="middle",n.textAlign="left",n.fillText(o,r+5,d+7.5)}paintSung(n){const e=this.host,t=e.sonoWritten,i=e.sonoRate;if(t<2||i<=0)return;const s=Math.ceil(this.px/on*i)+2,o=Math.min(s,Math.min(t,pn-64)),a=t-o,r=f=>this.px-(t-1-f)/i*on;let d=e.sonoFrame(a),u=r(a),g=-1,p=0;const v=f=>{if(g<0)return;n.fillStyle=M.ink,n.fillRect(p,4,Math.max(1,f-p),4);const m=this.handLabel(g);n.font=j(8,600),n.letterSpacing="0.5px";const _=n.measureText(m).width;n.textBaseline="middle",n.textAlign="left",n.fillText(m,p-6-_>=2?p-6-_:f+6,7),n.letterSpacing="0px",g=-1};n.strokeStyle=M.ink;for(let f=a+1;f<t;f++){const m=e.sonoFrame(f),_=r(f);if(this.joins(m,d)){const b=Math.min(1,.5*(m.amp+d.amp)/.35);this.seg(n,u,this.y(d.hz),_,this.y(m.hz),1.5+1.5*b)}const w=m.mask!==0?or(m.mask):-1;w!==g&&(v(_),w>=0&&(g=w,p=_)),d=m,u=_}v(this.px)}paintNext(n){const e=this.host,t=this.phrase;if(!this.bird||!e.singing||!t)return;const i=e.pipp.x,s=e.phrasePosMs,o=Math.max(.01,e.phraseTempo);if(n.strokeStyle=M.shadow,t.drawn){const u=e.knobValue(0)/Math.max(.01,i.pipp_bird_base(this.bird,0)),g=t.drawnStartMs+s,p=i.pipp_line_end(this.line);let v=0,f=0,m=!1;for(let _=g;_<=p;_+=3/on*1e3*o){const[w,b]=this.drawnAt(_),L=this.px+(_-g)/o*J,k=this.y(w*u),x=b>.08;x&&m&&this.seg(n,v,f,L,k,3),v=L,f=k,m=x}return}const a=e.knobValue(0),r=i.pipp_bird_syllable_count(this.bird),d=e.pipp;for(const u of t.notes){if(u.syl<0||u.syl>=r||u.durMs<=0||u.startMs+u.durMs<=s)continue;if(this.px+(Math.max(u.startMs,s)-s)/o/1e3*on>this.W)break;const p=Math.max(0,(s-u.startMs)/u.durMs),v=Math.max(2,Math.floor(u.durMs/o/1e3*on/3));let f=0,m=0,_=!1;for(let w=0;w<=v;w++){const b=p+(1-p)*w/v,L=u.startMs+b*u.durMs;i.pipp_bird_syllable_at(this.bird,u.syl,b,this.at);const k=d.f32(this.at,2),x=this.px+(L-s)/o/1e3*on,S=this.y(k[0]*u.pitchMul*a),T=k[1]>.08;T&&_&&this.seg(n,f,m,x,S,1.5+1.5*Math.min(1,k[1])),f=x,m=S,_=T}}}}function or(c){for(let n=0;n<16;n++)if(c>>n&1)return n;return-1}const rt=["sc_season","sc_time","sc_type","sc_place"],yn=["season","time","type","place"],hn=[["spring","summer","autumn","winter"],["dawn","day","dusk","night"],["song","call","alarm","flight"],["garden","forest","open","shore"]];class rr{constructor(n,e,t,i,s){this.host=e,this.s=t,this.st=i,this.app=s;const o=h(n,{position:"absolute",left:"8px",top:"8px",width:"1022px",height:"664px"});this.root=o;const a=h(o,{position:"absolute",left:"0",top:"0",width:"304px",height:"384px",border:"1px solid var(--ink)",display:"flex",flexDirection:"column"}),r=l("div","panelhead",a);r.style.gap="0",this.nameEl=l("div","title",r),this.nameEl.style.flex="1",this.sexBtns=D(r,[{text:"",width:56,onClick:()=>this.setChoice("sc_sex","sex",0)},{text:"",width:56,onClick:()=>this.setChoice("sc_sex","sex",1)}]),h(r,{width:"6px",flex:"none"}),this.ageBtns=D(r,[{text:"",width:44,onClick:()=>this.setChoice("sc_age","age",0)},{text:"",width:36,onClick:()=>this.setChoice("sc_age","age",1)}]);const d=h(a,{flex:"1",padding:"2px",boxShadow:"var(--inset)"},"paper");this.plate=new ce(d,298,332,t),this.plateCap=h(a,{height:"18px",borderTop:"1px solid var(--ink)",padding:"0 8px"},"cap");const u=h(o,{position:"absolute",left:"312px",top:"0",width:"710px",height:"384px",border:"1px solid var(--ink)",display:"flex",flexDirection:"column"}),g=l("div","panelhead",u);this.songTitle=l("div","title",g),this.songTitle.style.flex="1",this.tools=l("div","",g),Object.assign(this.tools.style,{display:"flex",alignItems:"center",gap:"12px"}),this.drawBtn=new y(this.tools,"",()=>this.setDraw(!i.draw)),this.labels.push({e:l("span","label",this.tools),key:"song.speed"}),this.speedBtns=D(this.tools,["1×","½×","¼×"].map((R,I)=>({text:R,width:32,onClick:()=>this.setSpeed(I)}))),this.labels.push({e:l("span","label",this.tools),key:"song.shift"}),this.shiftBtns=D(this.tools,[{text:"",width:40,onClick:()=>this.setShift(!1)},{text:"",width:56,onClick:()=>this.setShift(!0)}]),this.labels.push({e:l("span","label",this.tools),key:"song.phrase"}),this.phraseVal=l("span","value",this.tools),this.phraseVal.style.width="24px",this.labels.push({e:l("span","label",this.tools),key:"song.length"}),this.lengthVal=l("span","value",this.tools),this.lengthVal.style.width="44px",this.drawTools=l("div","",g),Object.assign(this.drawTools.style,{display:"none",alignItems:"center",gap:"6px"});const p=new y(this.drawTools,"",()=>this.setDraw(!1)).on(!0);this.eraseBtn=new y(this.drawTools,"",()=>{this.sono.erasing=!this.sono.erasing,this.refresh()}),this.clearBtn=new y(this.drawTools,"",()=>this.sono.clearLine()),this.singBtn=new y(this.drawTools,"",()=>{i.playing||s.setPlaying(!0),e.trigger("ap_sing_once")}),this.keepBtn=new y(this.drawTools,"",()=>{i.kept=!i.kept,e.post({t:"keep",on:i.kept}),this.refresh()}),this.drawBtn2=p;const v=h(u,{display:"flex",height:"320px",flex:"none"}),f=h(v,{width:"28px",flex:"none",borderRight:"1px solid var(--ink)"});this.axis=new Z(f,27,320),this.sono=new ot(v,e),this.sono.onLineChanged=()=>{e.post({t:"drawn",pts:this.sono.linePoints()}),this.sono.lineCount()===0&&i.kept&&(i.kept=!1,e.post({t:"keep",on:!1})),this.refresh()},this.sono.handLabel=R=>`${t.t(`knob.${Ln[R]}`)} ${t.t("song.by_hand")}`,this.sono.flagText=(R,I)=>`${A(R/1e3,1,t.no)} kHz  ${A(I,1,t.no)} ${t.t("unit.s")}`;const m=h(u,{height:"16px",flex:"none",marginLeft:"28px",borderTop:"1px solid var(--ink)",position:"relative"});this.timeAxis=m,this.songCap=h(u,{flex:"1",borderTop:"1px solid var(--ink)",padding:"0 8px"},"cap");const _=h(o,{position:"absolute",left:"0",top:"392px",width:"1022px",height:"56px"});this.sceneLabel=l("div","section",_);const w=h(_,{display:"flex",gap:"12px",marginTop:"4px"}),b=Math.floor(778/4);this.fieldLabels=[];for(let R=0;R<6;R++){const I=h(w,{width:`${R<4?b:92}px`,display:"flex",flexDirection:"column",gap:"2px"});if(this.fieldLabels.push(l("div","field",I)),R<4)this.scene.push(D(I,hn[R].map((G,gn)=>({text:"",onClick:()=>this.setScene(R,gn)})),24));else{const G=new y(I,"",void 0,{height:"24px",width:"92px"}).disabled(!0);R===4?this.dialectBtn=G:this.mimicsBtn=G}}this.dialectBtn??=new y(w),this.mimicsBtn??=new y(w);const L=h(o,{position:"absolute",left:"0",top:"456px",width:"1022px",height:"128px"}),k=[400,318,236],x=[0,5,9],S=[5,4,3],T=68/2;this.groupLabels=[];let P=0;for(let R=0;R<3;R++){const I=h(L,{position:"absolute",left:`${P}px`,top:"0",width:`${k[R]}px`},"section");this.groupLabels.push(I);for(let G=0;G<S[R];G++){const gn=h(L,{position:"absolute",left:`${P+G*82}px`,top:"20px"});this.knobs.push(new at(gn,e,t,x[R]+G))}P+=k[R]+T}const H=h(o,{position:"absolute",left:"0",top:"592px",width:"1022px",height:"64px",background:"var(--panel)",border:"1px solid var(--ink)",display:"flex",alignItems:"center",padding:"0 12px",gap:"16px"});this.apTitle=h(H,{font:"400 22px/24px var(--serif)",whiteSpace:"nowrap"}),this.apOnBtn=new y(H,"",()=>{i.apOn=!i.apOn,e.param("ap_on",i.apOn?1:0),this.refresh()},{height:"32px",fontSize:"11px",padding:"0 14px"});const B=h(H,{display:"flex",flexDirection:"column",gap:"2px",alignSelf:"flex-start",marginTop:"13px"});this.holdLabel=l("div","field",B);const F=h(B,{display:"flex"});this.holdVal=h(F,{width:"64px",height:"24px",display:"flex",alignItems:"center",justifyContent:"flex-end",padding:"0 6px",font:"500 12px var(--mono)"},"well");const W=R=>{i.hold=Math.min(20,Math.max(.5,i.hold+R)),e.param("ap_hold",i.hold),this.refresh()};new y(F,rn,()=>W(-.5),{width:"24px",height:"24px",marginLeft:"-1px",fontSize:"12px",padding:"0"}),new y(F,"+",()=>W(.5),{width:"24px",height:"24px",marginLeft:"-1px",fontSize:"12px",padding:"0"});const Y=h(H,{display:"flex",gap:"6px",alignSelf:"flex-end",marginBottom:"11px"});this.apBtns=[new y(Y,"",()=>{i.latch=!i.latch,e.param("ap_latch",i.latch?1:0),this.refresh()},{height:"24px",padding:"0 10px"}),new y(Y,"",()=>e.trigger("ap_return_all"),{height:"24px",padding:"0 10px"}),new y(Y,"",()=>e.trigger("ap_sing_once"),{height:"24px",padding:"0 10px"}),new y(Y,"",()=>e.trigger("ap_reroll"),{height:"24px",padding:"0 10px"})];const z=h(H,{flex:"1",display:"flex",justifyContent:"flex-end"});this.legend=new Z(z,300,34)}host;s;st;app;root;plate;sono;knobs=[];nameEl;sexBtns;ageBtns;plateCap;songCap;songTitle;tools;drawTools;drawBtn;speedBtns;shiftBtns;labels=[];phraseVal;lengthVal;eraseBtn;clearBtn;singBtn;keepBtn;axis;scene=[];dialectBtn;mimicsBtn;apTitle;apOnBtn;holdVal;apBtns;legend;legendKnob=-1;lastModes=new Array(12).fill(0);error="";drawBtn2;timeAxis;sceneLabel;fieldLabels;groupLabels;holdLabel;setBird(n,e){this.sono.bird=n;for(const t of this.knobs)t.setBird(n);this.error=this.plate.load(e),this.plate.paint(!0)}typeAvailable(n){const e=this.sono.bird;if(!e)return!1;const t=this.st;return this.host.pipp.x.pipp_bird_type_active(e,n,t.season,t.time,t.sex,t.age)!==0}setChoice(n,e,t){this.st[e]=t,this.host.param(n,t),this.app.refresh()}setScene(n,e){const t=["season","time","type","place"];this.st[t[n]]=e,this.host.param(rt[n],e),this.app.refresh()}setSpeed(n){this.st.speed=n,this.host.param("pb_speed",n),this.refresh()}setShift(n){this.st.shift=n,this.host.param("pb_shift",n?1:0),this.refresh()}setDraw(n){this.st.draw=n,this.sono.erasing=!1,this.sono.setDrawMode(n),this.host.param("pb_draw",n?1:0),this.refresh()}applyStrings(){const n=this.s;this.sexBtns[0].text(n.t("plate.male")),this.sexBtns[1].text(n.t("plate.female")),this.ageBtns[0].text(n.t("plate.adult")),this.ageBtns[1].text(n.t("plate.juv")),this.songTitle.textContent=n.t("song.title"),this.drawBtn.text(n.t("song.draw")),this.drawBtn2.text(n.t("song.draw"));for(const t of this.labels)t.e.textContent=n.t(t.key);this.shiftBtns[0].text(n.t("song.shift_off")),this.shiftBtns[1].text(n.t("song.shift_oct")),this.eraseBtn.text(n.t("song.erase")),this.clearBtn.text(n.t("song.clear")),this.singBtn.text(n.t("song.sing_it")),this.keepBtn.text(n.t("song.keep")),this.sono.yourPhraseText=n.t("song.your_phrase"),this.sono.nowText=n.t("song.now"),this.sceneLabel.textContent=n.t("scene"),["scene.season","scene.time","scene.type","scene.place","scene.dialect","scene.mimics"].forEach((t,i)=>this.fieldLabels[i].textContent=n.t(t)),this.scene.forEach((t,i)=>t.forEach((s,o)=>s.text(n.t(`${yn[i]}.${hn[i][o]}`)))),this.dialectBtn.text(n.t("scene.dialect_none")),this.mimicsBtn.text(n.t("scene.mimics_none")),["group.voice","group.phrasing","group.surroundings"].forEach((t,i)=>this.groupLabels[i].textContent=n.t(t)),this.apTitle.textContent=n.t("ap.title"),this.holdLabel.textContent=n.t("ap.hold"),["ap.latch","ap.return_all","ap.sing_once","ap.reroll"].forEach((t,i)=>this.apBtns[i].text(n.t(t))),this.timeAxis.replaceChildren();for(let t=0;t<=8;t++)h(this.timeAxis,{position:"absolute",left:`${2+80*t}px`,top:"0",font:"400 9px/15px var(--mono)",color:"var(--inkSoft)"}).textContent=t===0?`0 ${n.t("unit.s")}`:String(t);const e=this.axis.begin();e.font=j(9,400),e.fillStyle=M.inkSoft,e.textAlign="right",e.textBaseline="middle";for(let t=0;t<5;t++){const i=t<4?2+80*t+6:312;e.fillText(t<4?n.t("axis.khz",{n:String(8-2*t)}):"0",23,i)}for(const t of this.knobs)t.invalidate();this.plate.paint(!0),this.refresh()}refresh(){const n=this.st,e=this.s;this.sexBtns[0].on(n.sex===0),this.sexBtns[1].on(n.sex===1),this.ageBtns[0].on(n.age===0),this.ageBtns[1].on(n.age===1),this.plate.variant=n.age===1?"juvenile":n.sex===1?"female":"male",this.plate.paint(),this.plateCap.innerHTML="",l("b","",this.plateCap,`${e.t("fig")} 1`),this.plateCap.append(this.plate.caption()),this.tools.style.display=n.draw?"none":"flex",this.drawTools.style.display=n.draw?"flex":"none",this.speedBtns.forEach((s,o)=>s.on(n.speed===o)),this.shiftBtns[0].on(!n.shift),this.shiftBtns[1].on(n.shift);const t=this.sono.lineCount()>0;this.eraseBtn.on(this.sono.erasing).disabled(!t),this.clearBtn.disabled(!t),this.singBtn.disabled(!t),this.keepBtn.disabled(!t).on(n.kept);const i=[n.season,n.time,n.type,n.place];this.scene.forEach((s,o)=>s.forEach((a,r)=>a.on(i[o]===r).disabled(o===2&&!this.typeAvailable(r)))),this.apOnBtn.on(n.apOn).text(e.t(n.apOn?"ap.on":"ap.off")),this.apBtns[0].on(n.latch),this.holdVal.textContent=`${A(n.hold,1,e.no)} ${e.t("unit.s")}`,this.updateCaption()}setName(n){this.nameEl.textContent=n;let e=22;this.nameEl.style.fontSize=`${e}px`;const t=82,i=this.legend.g;for(i.font=j(e,400,!0);e>13&&i.measureText(n).width>t;)e--,i.font=j(e,400,!0);this.nameEl.style.fontSize=`${e}px`}birdName="";updateCaption(){const n=this.st,e=this.s;this.songCap.innerHTML="",l("b","",this.songCap,`${e.t("fig")} 2`);const t=(s,o)=>ln(e.t(`${yn[s]}.${hn[s][o]}`)),i=this.error?this.error:n.draw?e.t("song.draw_caption"):e.t("song.caption",{bird:this.birdName,type:t(2,n.type),season:t(0,n.season),time:t(1,n.time)});this.songCap.append(i)}poll(){const n=this.host;for(const a of this.knobs)a.poll();for(let a=0;a<12;a++){const r=n.ready?n.knobMode(a):0;r===1&&this.lastModes[a]!==r&&(this.legendKnob=a),this.lastModes[a]=r}if(this.legendKnob>=0&&this.lastModes[this.legendKnob]===0){this.legendKnob=-1;for(let a=0;a<12;a++)(this.lastModes[a]===1||this.lastModes[a]===2)&&(this.legendKnob=a)}this.sono.poll();const e=Math.min(1,Math.max(0,n.level/.35));this.plate.open+=(e-this.plate.open)*.3,this.plate.paint();const t=this.sono.lastPhrase,i=Math.max(.01,n.phraseTempo),s=t&&t.number>0?String(t.number):"-";this.phraseVal.textContent!==s&&(this.phraseVal.textContent=s);const o=t&&t.number>0?`${A(t.lengthMs/i/1e3,1,this.s.no)} ${this.s.t("unit.s")}`:"-";this.lengthVal.textContent!==o&&(this.lengthVal.textContent=o),this.paintLegend()}paintLegend(){const n=this.legend.begin(),e=this.s,t=this.st;if(n.font=j(10,500),n.letterSpacing="0.6px",n.textBaseline="middle",n.textAlign="left",n.fillStyle=M.plum,n.fillRect(0,6,18,3),n.fillStyle=M.ink,n.fillText(e.t("ap.legend_auto"),26,7.5),n.fillRect(0,26,18,3),this.legendKnob<0){n.fillText(e.t("ap.legend_hand_any"),26,27.5);return}const i=e.t("ap.legend_hand",{knob:e.t(`knob.${Ln[this.legendKnob]}`)});n.fillText(i,26,27.5);const s=Math.round(26+n.measureText(i).width+8),o=this.host.holdLeft(this.legendKnob);if(n.fillStyle=M.face,n.fillRect(s,23,72,8),n.strokeStyle=M.ink,n.lineWidth=1,n.strokeRect(s+.5,23.5,71,7),n.fillStyle=M.ink,o>=0){const a=t.hold>0?Math.min(1,Math.max(0,o/t.hold)):0;n.fillRect(s,23,Math.round(72*a),8),n.fillText(`${A(o,1,e.no)} ${e.t("unit.s")}`,s+80,27.5)}else n.fillRect(s,23,72,8),n.fillText(e.t(t.latch?"ap.latched":"ap.stays"),s+80,27.5);n.letterSpacing="0px"}}const lt=["pairs","garden","forest","coast","wetland","mountain","farmland","night","all"],Be=["type.song","type.call","quiz.ask_both"],lr=["guide.mnemonic","scene.season","quiz.hints_none"],hr=["song","call","alarm","flight"],dr=["spring","summer","autumn","winter"],pr=["dawn","day","dusk","night"],Hn=[10,20,50],Gn=lt.length,te=Math.ceil(Gn/2),bn=950,V=962,X=1264-V;class ht{constructor(n,e,t,i,s=!1){this.host=e,this.s=t,this.on=i,this.phone=s;const o=s?h(n,{display:"none",flexDirection:"column",gap:"12px"}):h(n,{position:"absolute",left:"8px",top:"8px",width:"1264px",height:"664px",display:"none"});if(this.root=o,this.buildBirds(),s){this.buildPhone(o);return}this.counter=l("div","section",o),C(this.counter,0,0,bn,14);const a=h(o,{border:"1px solid var(--ink)",display:"flex",flexDirection:"column"});C(a,0,22,bn,288);const r=l("div","panelhead",a);r.style.gap="6px",this.figTitle=l("div","title",r),this.figTitle.style.flex="1",this.againBtn=new y(r,"",()=>this.playAgain()),this.halfBtn=new y(r,"",()=>this.toggleHalf()),this.hintBtn=new y(r,"",()=>{this.hintShown=!0,this.update()});const d=h(a,{display:"flex",height:`${this.wellH}px`,flex:"none"}),u=h(d,{width:"28px",flex:"none",borderRight:"1px solid var(--ink)"});this.axis=new Z(u,27,this.wellH),this.well=new Z(d,this.wellW,this.wellH),this.caption=h(a,{height:"18px",flex:"none",borderTop:"1px solid var(--ink)",padding:"0 8px"},"cap");const g=(bn-8)/2;for(let b=0;b<4;b++){const L=h(o,{},"answer");C(L,b%2*(Math.floor(g)+8),318+Math.floor(b/2)*52,b%2?bn-Math.floor(g)-8:Math.floor(g),44);const k=l("span","aname",L),x=l("span","atag",L);L.addEventListener("click",()=>this.answer(b)),this.answers.push({e:L,name:k,tag:x})}this.band=h(o,{background:"var(--panel)",border:"1px solid var(--ink)",display:"flex",alignItems:"center",padding:"0 12px",gap:"16px"}),C(this.band,0,422,bn,68),this.bandText=h(this.band,{flex:"1",minWidth:"0",font:"400 11px/16px var(--mono)",overflow:"hidden",display:"-webkit-box",webkitLineClamp:"3",webkitBoxOrient:"vertical"}),this.compareBtn=new y(this.band,"",()=>this.compare(),{height:"24px",padding:"0 10px"}),this.guideBtn=new y(this.band,"",()=>this.openGuide(),{height:"24px",padding:"0 10px"}),this.nextBtn=new y(this.band,"",()=>this.next_(),{height:"24px",padding:"0 14px"}),this.questionEls=[a,...this.answers.map(b=>b.e),this.band],this.result=this.buildResult(o),C(this.result,0,22,bn,468);let p=0;this.setLabel=l("div","section",o),C(this.setLabel,V,p,X,14),p+=20;const v=Math.ceil((X+1)/2);for(let b=0;b<Gn;b++){const L=new y(o,"",()=>{this.set=b,this.start()}),k=Math.floor(b/te),x=b%te,S=V+k*(v-1);C(L.e,S,p+x*23,k===0?v:V+X-S,24),L.e.style.justifyContent="flex-start",this.setBtns.push(L)}p+=te*23+1+12,this.askLabel=l("div","section",o),C(this.askLabel,V,p,X,14);const f=h(o,{});C(f,V,p+20,X,24),this.askBtns=D(f,[0,1,2].map(b=>({text:"",onClick:()=>{this.ask=b,this.start()}})),24),p+=56,this.hintsLabel=l("div","section",o),C(this.hintsLabel,V,p,X,14);const m=h(o,{});C(m,V,p+20,X,24),this.hintBtns=D(m,[0,1,2].map(b=>({text:"",onClick:()=>{this.hints=b,this.update()}})),24),p+=56,this.lengthLabel=l("div","section",o),C(this.lengthLabel,V,p,X,14);const _=h(o,{});C(_,V,p+20,X,24),this.lengthBtns=D(_,Hn.map((b,L)=>({text:"",onClick:()=>this.setLength(L)})),24),p+=56,this.scoreLabel=l("div","section",o),C(this.scoreLabel,V,p,X,14);const w=l("div","gtable well",o);C(w,V,p+20,X,68);for(let b=0;b<3;b++){const L=h(w,{height:"22px"},`grow${b<2?" rule":""}`),k=l("span","tkey",L);k.style.flex="1";const x=l("span","",L);Object.assign(x.style,{font:"500 12px var(--mono)",padding:"0 8px",width:"56px",textAlign:"right"}),this.scoreRows.push({key:k,val:x})}this.practise=h(o,{font:"400 11px/15px var(--mono)",color:"var(--inkSoft)",overflow:"hidden"}),C(this.practise,V,p+20+68+6,X,64)}host;s;on;phone;root;ids=[];ptrs=[];infos=[];lookalikes=[];q=0;stateBuf=0;practiseBuf=0;sceneBuf=0;set=0;ask=0;hints=0;length=0;showResult=!1;half=!1;hintShown=!1;playing=!1;comparing="";compareSeen=!1;compareAt=0;asks=-1;frames=[];next=0;dirty=!0;counter;figTitle;againBtn;halfBtn;hintBtn;axis;well;caption;answers=[];band;bandText;compareBtn;guideBtn;nextBtn;setLabel;askLabel;hintsLabel;scoreLabel;setBtns=[];askBtns;hintBtns;scoreRows=[];practise;lengthLabel;lengthBtns;missBuf=0;questionEls=[];result;resLabel;resScore;resPct;resMissLabel;resList;resAgain;wellW=920;wellH=240;pxPerKHz=30;pxPerSecond=80;leftPx=20;axisW=27;scoreRight=null;setCycle=null;buildPhone(n){Object.assign(this,{wellW:320,wellH:160,pxPerKHz:20,pxPerSecond:40,leftPx:10,axisW:35});const e=(m="6px")=>h(n,{display:"flex",flexDirection:"column",gap:m}),t=h(n,{display:"flex",alignItems:"center",gap:"6px"});this.counter=l("div","section",t),this.counter.style.flex="1",this.scoreRight=l("span","",t),Object.assign(this.scoreRight.style,{font:"500 10px var(--mono)",letterSpacing:"0.06em",whiteSpace:"nowrap"});const i=h(n,{border:"1px solid var(--ink)",display:"flex",flexDirection:"column"}),s=l("div","panelhead",i);this.figTitle=l("div","title",s);const o=h(i,{display:"flex",height:`${this.wellH}px`,flex:"none"}),a=h(o,{flex:"1",minWidth:"0",borderRight:"1px solid var(--ink)"});this.axis=new Z(a,this.axisW,this.wellH),this.well=new Z(o,this.wellW,this.wellH),this.caption=h(i,{display:"none"});const r=h(i,{},"ph-tools"),d=m=>new y(r,"",m,{flex:"1 1 0",height:"44px",padding:"0",minWidth:"0"});this.againBtn=d(()=>this.playAgain()),this.halfBtn=d(()=>this.toggleHalf()),this.hintBtn=d(()=>{this.hintShown=!0,this.update()}),this.result=this.buildResult(n);const u=e();for(let m=0;m<4;m++){const _=h(u,{height:"44px"},"answer"),w=l("span","aname",_),b=l("span","atag",_);_.addEventListener("click",()=>this.answer(m)),this.answers.push({e:_,name:w,tag:b})}this.band=h(n,{display:"flex",flexDirection:"column",gap:"8px",padding:"10px",border:"1px solid var(--ink)",background:"var(--panel)"}),this.bandText=h(this.band,{font:"400 11px/16px var(--mono)"});const g=h(this.band,{display:"grid",gridTemplateColumns:"repeat(3, minmax(0, 1fr))",gap:"6px"}),p={height:"44px",padding:"0",minWidth:"0"};this.compareBtn=new y(g,"",()=>this.compare(),p),this.guideBtn=new y(g,"",()=>this.openGuide(),p),this.nextBtn=new y(g,"",()=>this.next_(),p);const v=e();this.scoreLabel=l("div","section",v);const f=h(v,{display:"grid",gridTemplateColumns:"60px minmax(0, 1fr)",rowGap:"4px",alignItems:"center"});this.setLabel=l("div","field",f),this.setCycle=new y(f,"",()=>{const m=this.host.pipp.x;for(let _=1;_<=Gn;_++){const w=(this.set+_)%Gn;if(m.pipp_quiz_pool_size(this.q,w)>0){this.set=w;break}}this.start()},{height:"44px",padding:"0 10px",justifyContent:"flex-start",minWidth:"0"}),this.askLabel=l("div","field",f),this.askBtns=D(h(f,{}),[0,1,2].map(m=>({text:"",onClick:()=>{this.ask=m,this.start()}})),44),this.hintsLabel=l("div","field",f),this.hintBtns=D(h(f,{}),[0,1,2].map(m=>({text:"",onClick:()=>{this.hints=m,this.update()}})),44),this.lengthLabel=l("div","field",f),this.lengthBtns=D(h(f,{}),Hn.map((m,_)=>({text:"",onClick:()=>this.setLength(_)})),44),this.questionEls=[i,u,this.band],this.practise=h(n,{font:"400 11px/16px var(--mono)",color:"var(--inkSoft)"})}buildResult(n){const e=this.phone,t=h(n,{display:"none",flexDirection:"column",gap:"8px",border:"1px solid var(--ink)",background:"var(--panel)",padding:e?"12px":"16px 20px",boxSizing:"border-box"});this.resLabel=l("div","section",t),this.resScore=l("div","serif",t),this.resScore.style.font=`400 ${e?44:64}px/${e?48:68}px var(--serif)`,this.resPct=h(t,{font:"500 12px var(--mono)",letterSpacing:"0.06em"}),this.resMissLabel=l("div","section",t),this.resMissLabel.style.marginTop="8px",this.resList=h(t,e?{display:"flex",flexDirection:"column"}:{display:"flex",flexDirection:"column",flex:"1",minHeight:"0",overflowY:"auto"},"gtable well");const i=h(t,{display:"flex",justifyContent:e?"stretch":"flex-end",marginTop:"4px"});return this.resAgain=new y(i,"",()=>this.start(),e?{height:"44px",flex:"1"}:{height:"24px",padding:"0 14px"}),t}fillResult(n){const e=this.s,t=this.host.pipp,i=t.x,s=i.pipp_quiz_length(this.q);this.resLabel.textContent=e.t("quiz.result"),this.resScore.textContent=e.t("quiz.result_score",{correct:A(n.correct,0,e.no),total:A(s,0,e.no)}),this.resPct.textContent=e.t("quiz.result_pct",{pct:A(Math.round(100*n.correct/Math.max(1,s)),0,e.no)}),this.resMissLabel.textContent=e.t("quiz.result_missed"),this.resAgain.text(e.t("quiz.again"));const o=i.pipp_quiz_misses(this.q,this.missBuf,64),a=t.i32(this.missBuf,3*o);if(this.resList.replaceChildren(),o===0){const r=h(this.resList,{height:this.phone?"44px":"28px"},"grow"),d=l("span","tkey",r,e.t("quiz.result_none"));d.style.flex="1";return}for(let r=0;r<o;r++){const d=a[3*r],u=a[3*r+1],g=a[3*r+2],p=h(this.resList,{minHeight:this.phone?"56px":"34px",flex:"none",gap:"8px",padding:"0 0 0 8px"},`grow${r<o-1?" rule":""}`),v=h(p,{flex:"1",minWidth:"0",display:"flex",flexDirection:this.phone?"column":"row",alignItems:this.phone?"flex-start":"baseline",gap:this.phone?"0":"12px"}),f=l("span","",v,this.name(d));Object.assign(f.style,{font:"400 20px/24px var(--serif)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"100%"});let m=e.t("quiz.result_taken",{bird:ln(this.name(u))});g>1&&(m+=`, ${e.t("quiz.result_times",{n:A(g,0,e.no)})}`);const _=l("span","",v,m);Object.assign(_.style,{font:"400 11px/15px var(--mono)",color:"var(--inkSoft)"});const w=this.ids[d];new y(p,e.t(this.phone?"phone.quiz.open_guide":"quiz.open_guide"),()=>this.on.openGuide(w),this.phone?{height:"44px",padding:"0 10px",flex:"none",margin:"4px 4px 4px 0"}:{height:"24px",padding:"0 10px",flex:"none",marginRight:"6px"})}}setLength(n){this.length=n,this.start()}buildBirds(){const n=this.host.pipp,e=n.x;for(const i of N.birds){const s=this.host.birds.get(i.id);if(!s||!q(i.id))continue;this.ids.push(i.id),this.ptrs.push(s);let o={};try{o=JSON.parse(en(i.id,"bird")??"{}")}catch{}this.infos.push(o)}for(let i=0;i<this.ids.length;i++){const s=[];for(const o of this.infos[i].lookalikes??[]){const a=this.ids.indexOf(o.id);a>=0&&a!==i&&s.push(a)}this.lookalikes.push(s)}this.q=e.pipp_quiz_new(),this.stateBuf=n.alloc(52),this.practiseBuf=n.alloc(256),this.sceneBuf=n.alloc(8),this.missBuf=n.alloc(768);const t=n.alloc(256);for(let i=0;i<this.ids.length;i++){const s=N.birds.find(o=>o.id===this.ids[i]);n.i32(t,this.lookalikes[i].length).set(this.lookalikes[i]),e.pipp_quiz_add_bird(this.q,N.groups.indexOf(s.group),e.pipp_bird_type_present(this.ptrs[i],1),t,this.lookalikes[i].length)}n.free(t)}question(){const n=this.host.pipp;n.x.pipp_quiz_state(this.q,this.stateBuf);const e=n.i32(this.stateBuf,13);return{bird:e[0],type:e[1],count:e[2],answers:[e[3],e[4],e[5],e[6]],correctSlot:e[7],picked:e[8],number:e[9],correct:e[10],missed:e[11],left:e[12]}}get active(){return this.question().number>0}get answered(){return this.question().picked>=0}get finished(){return this.host.pipp.x.pipp_quiz_finished(this.q)!==0}name(n){const e=N.birds.find(t=>t.id===this.ids[n]);return e?this.s.no?e.name.no:e.name.en:""}headerBird(){const n=this.question();return n.number>0&&n.picked>=0?this.ids[n.bird]:null}get visible(){return this.root.style.display!=="none"}show(n){this.root.style.display=n?this.phone?"flex":"":"none"}resize(n){this.axis.resize(n),this.well.resize(n),this.dirty=!0,this.applyStrings()}enter(){this.stopCompare(),this.host.start(),this.active?this.stage():this.start()}leave(){this.stopCompare(),this.host.post({t:"qvoice",op:"stop"}),this.playing=!1}start(){this.stopCompare();const n=Math.random()*4294967296>>>0;this.showResult=!1,this.host.pipp.x.pipp_quiz_start(this.q,this.set,this.ask,n,Hn[this.length])?this.stage():(this.host.post({t:"qvoice",op:"stop"}),this.playing=!1,this.host.param("pb_play",0),this.clearTrace(),this.update())}stage(){const n=this.question();this.hintShown=!1,this.clearTrace(),this.host.post({t:"qvoice",op:"start",bird:this.ids[n.bird],type:n.type,half:this.half}),this.playing=!0,this.update()}answer(n){const e=this.question();e.number<=0||e.picked>=0||n>=e.count||(this.host.pipp.x.pipp_quiz_answer(this.q,n),this.update())}next_(){!this.active||!this.answered||(this.stopCompare(),this.showResult?this.start():this.finished?(this.showResult=!0,this.host.post({t:"qvoice",op:"stop"}),this.playing=!1,this.host.param("pb_play",0),this.update()):this.host.pipp.x.pipp_quiz_next(this.q)&&this.stage())}playAgain(){!this.active||this.showResult||(this.host.start(),this.stopCompare(),this.playing=!0,this.host.post({t:"qvoice",op:"again"}),this.update())}stop(){this.stopCompare(),this.playing=!1,this.host.param("pb_play",0),this.update()}toggleHalf(){this.half=!this.half,this.host.post({t:"qvoice",op:"half",half:this.half}),this.update()}compare(){if(this.comparing){this.stopCompare(),this.update();return}const n=this.question();if(n.number<=0||n.picked<0)return;let e=-1;n.picked!==n.correctSlot&&(e=n.answers[n.picked]);for(let s=0;s<n.count&&e<0;s++){const o=n.answers[s];o!==n.bird&&(this.lookalikes[n.bird].includes(o)||this.lookalikes[o].includes(n.bird))&&(e=o)}e<0&&(e=n.answers[(n.correctSlot+1)%n.count]);const i=this.host.pipp.x.pipp_bird_type_present(this.ptrs[e],n.type)?n.type:0;this.comparing=this.ids[e],this.compareSeen=!1,this.compareAt=performance.now(),this.playing=!0,this.host.start(),this.host.post({t:"compare",first:this.ids[n.bird],second:this.ids[e],restore:{autoplay:!1,play:!0,type:n.type},type:i}),this.restartTrace(this.host.sonoWritten),this.update()}stopCompare(){this.comparing&&(this.host.post({t:"compareCancel"}),this.comparing="")}openGuide(){const n=this.question();n.number<=0||n.picked<0||this.on.openGuide(this.ids[n.bird])}explain(n){const e=this.s,t=this.infos[n.bird],i=e.field(t.types?.[n.type===1?"call":"song"]),s=this.name(n.bird);if(n.picked===n.correctSlot)return e.t("quiz.explain_right",{bird:s,text:i});const o=n.answers[n.picked],a=e.t("quiz.explain_wrong",{bird:s,pick:this.name(o),text:i}),r=(u,g,p)=>{for(const v of u.lookalikes??[])if(v.id===this.ids[g])return e.t("quiz.differs",{bird:p,text:e.field(v.text)});return""},d=r(t,o,this.name(o))||r(this.infos[o],n.bird,s);return d?`${a} ${d}`:a}hint(n){const e=this.s,t=this.infos[n.bird],i=t.mnemonic?.[e.lang]??"";if(this.hints===0&&i)return e.t("quiz.hint_mnemonic",{text:i});const s=t.calendar?.sings??"",o=e.t("cal.month_names").split("|"),a=[];for(let r=0;r<s.length&&r<12;r++)s[r]==="y"&&a.push(o[r]);return e.t("quiz.hint_season",{months:a.join(", ")||e.t("quiz.months_unknown")})}applyStrings(){const n=this.s;this.figTitle.textContent=n.t("quiz.title"),this.againBtn.text(n.t("quiz.play_again")),this.halfBtn.text(n.t("quiz.half")),this.hintBtn.text(n.t("quiz.hint")),this.compareBtn.text(n.t("quiz.compare")),this.guideBtn.text(n.t(this.phone?"phone.quiz.open_guide":"quiz.open_guide"));const e=j(10,500);this.phone||(this.nextBtn.e.style.width=`${Math.max(Cn(e,n.t("quiz.next"),.6),Cn(e,n.t("quiz.see_result"),.6))+28}px`),this.lengthBtns.forEach((s,o)=>s.text(A(Hn[o],0,n.no))),this.lengthLabel.textContent=n.t("quiz.length"),this.setBtns.forEach((s,o)=>s.text(this.setName(o))),this.askBtns.forEach((s,o)=>s.text(n.t(Be[o]))),this.hintBtns.forEach((s,o)=>s.text(n.t(lr[o]))),this.setLabel.textContent=n.t("quiz.birds"),this.askLabel.textContent=n.t("quiz.ask"),this.hintsLabel.textContent=n.t("quiz.hints"),this.scoreLabel.textContent=n.t(this.phone?"phone.quiz.setup":"quiz.score"),this.scoreRows.forEach((s,o)=>s.key.textContent=n.t(["quiz.score_correct","quiz.score_missed","quiz.score_left"][o]));const t=this.axis.begin();t.font=j(9,400),t.fillStyle=M.inkSoft,t.textAlign="right",t.textBaseline="middle";const i=this.axisW-4;t.fillText(n.t("axis.khz",{n:"8"}),i,8),t.fillText(n.t("axis.khz",{n:"4"}),i,this.wellH-4*this.pxPerKHz+8),t.fillText("0",i,this.wellH-8),this.update()}update(){const n=this.s,e=this.host.pipp.x,t=this.question(),i=t.number>0,s=i&&t.picked>=0,o=s&&this.finished,a=e.pipp_quiz_length(this.q);this.counter.textContent=i?n.t("quiz.question",{n:String(t.number),total:String(a)}):n.t("quiz.question_none"),this.nextBtn.text(n.t(o?"quiz.see_result":"quiz.next"));const r=this.showResult&&o;this.questionEls.forEach(L=>{L.classList.contains("answer")||(L.style.visibility=r?"hidden":"")}),this.phone&&this.questionEls.forEach(L=>L.style.display=r?"none":"flex"),this.result.style.display=r?"flex":"none",r&&this.fillResult(t),this.halfBtn.on(this.half).disabled(!i),this.againBtn.disabled(!i),this.hintBtn.disabled(!i||this.hints===2||s).on(this.hintShown&&!s&&this.hints!==2),this.compareBtn.disabled(!s).on(this.comparing!==""),this.guideBtn.disabled(!s),this.nextBtn.disabled(!s),this.answers.forEach((L,k)=>{L.e.style.display=i&&k<t.count&&!r?this.phone?"flex":"":"none",L.name.textContent=i&&k<t.count?this.name(t.answers[k]):"";const x=s&&k===t.correctSlot,S=s&&!x&&k===t.picked;L.e.className=`answer${x?" correct":S?" wrong":""}${i&&!s?" live":""}`,L.tag.textContent=x?n.t("quiz.correct"):S?n.t("quiz.your_answer"):""}),this.setBtns.forEach((L,k)=>{L.on(this.set===k).disabled(e.pipp_quiz_pool_size(this.q,k)===0)}),this.askBtns.forEach((L,k)=>L.on(this.ask===k)),this.hintBtns.forEach((L,k)=>L.on(this.hints===k)),this.lengthBtns.forEach((L,k)=>L.on(this.length===k));const d=i?[t.correct,t.missed,t.left]:[0,0,0];if(this.scoreRight&&(this.scoreRight.textContent=n.t("phone.quiz.correct",{n:A(d[0],0,n.no)})),this.setCycle?.text(`${this.setName(this.set)} · ${n.t("phone.quiz.change")}`),this.scoreRows.forEach((L,k)=>L.val.textContent=A(d[k],0,n.no)),!i){this.bandText.textContent=n.t("quiz.no_birds"),this.practise.textContent=n.t("quiz.practise_none"),this.caption.replaceChildren(),l("b","",this.caption,`${n.t("fig")} 1`),this.on.refresh();return}const u=e.pipp_quiz_practise(this.q,this.practiseBuf,64),g=[...this.host.pipp.i32(this.practiseBuf,u)].map(L=>ln(this.name(L)));this.practise.textContent=g.length===0?n.t("quiz.practise_none"):n.t("quiz.practise",{birds:g.length>1?g.slice(0,-1).join(", ")+n.t("quiz.and")+g[g.length-1]:g[0]});const p=this.host.pipp.i32(this.sceneBuf,2);p[0]=0,p[1]=0,e.pipp_quiz_scene_for(this.ptrs[t.bird],t.type,this.sceneBuf);const[v,f]=this.host.pipp.i32(this.sceneBuf,2),m=ln(n.t(`type.${hr[t.type]}`)),_=ln(n.t(`season.${dr[v]??"spring"}`)),w=ln(n.t(`time.${pr[f]??"dawn"}`));this.caption.replaceChildren(),l("b","",this.caption,`${n.t("fig")} 1`),this.caption.append(s?n.t("quiz.fig_answered",{bird:this.name(t.bird),type:m,season:_,time:w}):n.t("quiz.fig",{type:m,season:_,time:w}));let b;s?(b=this.explain(t),o&&(b+=` ${n.t("quiz.done",{correct:String(t.correct),total:String(a)})}`)):b=this.hintShown&&this.hints!==2?this.hint(t):n.t("quiz.prompt"),this.bandText.textContent=b,this.on.refresh()}clearTrace(){this.restartTrace(this.host.sonoWritten)}restartTrace(n){this.frames=[],this.next=n,this.dirty=!0}poll(){const n=this.host;this.comparing&&(n.compare.running?this.compareSeen=!0:(this.compareSeen||performance.now()-this.compareAt>1500)&&(this.comparing="",this.update())),n.qvoice.sung!==this.asks&&(this.asks=n.qvoice.sung,n.qvoice.started&&this.restartTrace(n.qvoice.startFrame));const e=n.sonoWritten,t=pn-64;e-this.next>t&&(this.next=e-t);const i=n.sonoRate,s=Math.floor((this.wellW-this.leftPx)/this.pxPerSecond*i)+2;for(;this.next<e;){if(this.frames.length<s){const o=n.sonoFrame(this.next);this.frames.push({hz:o.hz,amp:o.amp}),this.dirty=!0}this.next++}this.dirty&&this.paintTrace()}paintTrace(){this.dirty=!1;const n=this.well.begin();wn(n,this.wellW,this.wellH),n.fillStyle=M.shadow,n.fillRect(0,0,this.wellW,1),n.fillRect(0,0,1,this.wellH);const e=this.host.sonoRate,t=this.frames;if(t.length<2||e<=0)return;const i=a=>this.wellH-a/1e3*this.pxPerKHz,s=a=>this.leftPx+a/e*this.pxPerSecond,o=.03;n.strokeStyle=M.ink,n.lineCap="round";for(let a=1;a<t.length;a++){const r=t[a-1],d=t[a];if(r.amp>o&&d.amp>o&&r.hz>0&&d.hz>0&&Math.abs(Math.log2(d.hz/r.hz))<.35){const u=Math.min(1,.5*(r.amp+d.amp)/.35);n.lineWidth=1.5+1.5*u,n.beginPath(),n.moveTo(s(a-1),i(r.hz)),n.lineTo(s(a),i(d.hz)),n.stroke()}}}setName(n){return this.s.t(`quiz.set.${lt[n]}`,{n:String(N.birds.length)})}statusText(){return`${this.setName(this.set)}, ${this.s.t(Be[this.ask])}`}}function dt(){return{bird:"svarttrost",sex:0,age:0,season:0,time:0,type:0,place:0,apOn:!0,latch:!0,hold:3,speed:0,shift:!1,draw:!1,kept:!1,playing:!1}}const Oe=["play","guide","quiz","chorus","log","collection"],He="pipp.lang",Ge=6;class cr{constructor(n,e){this.host=e;const t=localStorage.getItem(He);(t==="no"||t==="en")&&this.s.set(t);const i=h(n,{},"stage");this.stage=i;const s=l("div","header",i),o=l("div","wordmark",s);l("span","",o,"Pipp");const a=l("i","",o);for(const k of["clay","khaki","sage","plum"])l("b","",a).style.background=`var(--${k})`;const r=l("div","joined",s);this.transportRow=r,this.playBtn=new y(r,"",()=>this.transport(!0),{width:"44px",height:"32px"}).glyph("play","Play"),this.stopBtn=new y(r,"",()=>this.transport(!1),{width:"44px",height:"32px"}).glyph("stop","Stop");const d=h(s,{display:"flex",alignItems:"center"});this.prevBtn=new y(d,"",()=>this.stepBird(-1),{width:"32px",height:"32px"}).glyph("prev","Previous bird"),this.readout=l("div","readout well",d),this.nextBtn=new y(d,"",()=>this.stepBird(1),{width:"32px",height:"32px"}).glyph("next","Next bird"),h(s,{flex:"1"});const u=l("div","hgroup",s);this.langLabel=l("div","field",u);const g=l("div","row joined",u);this.enBtn=new y(g,"",()=>this.setLanguage("en"),{width:"36px",height:"24px"}),this.noBtn=new y(g,"",()=>this.setLanguage("no"),{width:"36px",height:"24px"});const p=l("div","hgroup",s);this.outGroup=p,this.outLabel=l("div","field",p);const v=l("div","row",p);this.outVal=l("div","out well",v);const f=l("div","meter well",v);this.meterL=l("i","",f),this.meterR=l("i","",f),this.meterL.style.top="4px",this.meterR.style.top="12px";const m=l("div","tabs",i);Oe.forEach((k,x)=>{const S=l("div",x===0?"tab active":x<Ge?"tab":"tab disabled",m);S.addEventListener("click",()=>this.setTab(x)),this.tabs.push(S)});const _=l("div","body",i);_.style.position="relative";const w=l("div","aside",_);this.aside=w,this.listLabel=l("div","section",w),this.list=l("div","birdlist sheet",w);const b=h(_,{position:"relative",flex:"1"});this.play=new rr(b,e,this.s,this.st,{refresh:()=>this.refresh(),setPlaying:k=>this.setPlaying(k),sendScene:()=>this.sendScene()}),this.guide=new tt(b,e,this.s,{sex:k=>this.setScene("sc_sex","sex",k),age:k=>this.setScene("sc_age","age",k),season:k=>this.setScene("sc_season","season",k),playType:k=>this.playType(k),compare:k=>this.startCompare(k)});const L=h(_,{position:"absolute",left:"0",top:"0",width:"1280px",height:"100%",pointerEvents:"none"});this.quiz=new ht(L,e,this.s,{refresh:()=>this.refresh(),openGuide:k=>{this.setTab(1),this.selectBird(k)}}),this.chorus=new Ue(L,e,this.s,this.quiz.ids,this.quiz.ids.map(k=>e.birds.get(k)),{refresh:()=>this.refresh(),playBird:()=>this.st.bird}),this.log=new st(L,this.s,{refresh:()=>this.refresh(),openBird:k=>{this.setTab(1),this.selectBird(k)},playBird:()=>this.st.bird,playType:()=>this.st.type}),this.collection=new Zo(L,this.s,{refresh:()=>this.refresh(),playBird:()=>this.st.bird,openPlay:k=>{this.setTab(0),this.selectBird(k)},sing:(k,x)=>this.singOnce(k,x)});for(const k of[this.quiz.root,this.chorus.root,this.log.root,this.collection.root])k.style.pointerEvents="auto";this.status=l("div","status",i),window.addEventListener("resize",()=>this.fit()),window.addEventListener("keydown",k=>this.key(k)),document.fonts?.ready.then(()=>this.applyStrings()),this.selectBird(this.st.bird),this.sendScene(),this.applyStrings(),this.fit(),requestAnimationFrame(()=>this.frame())}host;s=new Ke;st=dt();stage;playBtn;stopBtn;prevBtn;nextBtn;readout;langLabel;outLabel;enBtn;noBtn;outVal;meterL;meterR;tabs=[];listLabel;list;play;guide;quiz;chorus;log;collection;oneShot=null;transportRow;outGroup;aside;status;tab=0;comparing="";compareSeen=!1;compareAt=0;meter={l:0,r:0,peak:0};scale=1;fit(){const n=Math.min(window.innerWidth/1280,window.innerHeight/800);this.scale=n;const e=(window.innerWidth-1280*n)/2,t=(window.innerHeight-800*n)/2;this.stage.style.transform=`translate(${e}px, ${t}px) scale(${n})`;for(const i of[...go])i.resize(n);for(const i of this.play.knobs)i.cv.resize(n),i.invalidate();this.guide.resize(n),this.quiz.resize(n),this.chorus.resize(n),this.play.sono.cv.resize(n),this.play.plate.cv.resize(n),this.play.plate.paint(!0),this.play.applyStrings()}birdEntry(n){return N.birds.find(e=>e.id===n)}name(n){return this.s.no?n.name.no:n.name.en}selectBird(n){const e=this.host.birds.get(n);e&&(this.stopCompare(),this.st.bird=n,this.host.post({t:"bird",id:n}),this.play.setBird(e,n),this.guide.setBird(n),this.refresh())}neighbour(n){const e=N.birds.findIndex(t=>t.id===this.st.bird);for(let t=e+n;t>=0&&t<N.birds.length;t+=n)if(q(N.birds[t].id))return N.birds[t].id;return null}stepBird(n){const e=this.neighbour(n);e&&this.selectBird(e)}sendScene(){const n=this.st,e=this.host;e.post({t:"bird",id:n.bird}),e.param("sc_season",n.season),e.param("sc_time",n.time),e.param("sc_type",n.type),e.param("sc_place",n.place),e.param("sc_sex",n.sex),e.param("sc_age",n.age),e.param("ap_on",n.apOn?1:0),e.param("ap_latch",n.latch?1:0),e.param("ap_hold",n.hold),e.param("pb_speed",n.speed),e.param("pb_shift",n.shift?1:0),e.param("pb_draw",n.draw?1:0),e.post({t:"keep",on:n.kept}),e.param("pb_play",n.playing?1:0)}setPlaying(n){this.stopCompare(),this.endOneShot(),this.st.playing=n,n&&this.host.start(),this.host.param("pb_play",n?1:0),this.refresh()}setLanguage(n){this.s.set(n),localStorage.setItem(He,n),this.applyStrings()}transport(n){this.tab===2?n?this.quiz.playAgain():this.quiz.stop():this.tab===3?this.chorus.setPlaying(n):this.setPlaying(n)}setScene(n,e,t){this.st[e]=t,this.host.param(n,t),this.refresh()}playType(n){this.st.type=n,this.host.param("sc_type",n),this.setPlaying(!0),this.host.trigger("ap_sing_once")}singOnce(n,e){this.selectBird(n),this.st.type=e,this.host.param("sc_type",e),this.host.param("ap_on",0),this.st.playing=!0,this.host.start(),this.host.param("pb_play",1),this.host.trigger("ap_sing_once"),this.oneShot={base:this.host.phrasesStarted,seen:!1,at:performance.now()},this.refresh()}endOneShot(){this.oneShot&&(this.oneShot=null,this.host.param("ap_on",this.st.apOn?1:0))}startCompare(n){const e=this.comparing===n;if(this.stopCompare(),this.st.draw&&this.play.setDraw(!1),e)return;this.host.start(),this.comparing=n,this.compareSeen=!1,this.compareAt=performance.now();const t=this.st;this.host.post({t:"compare",first:t.bird,second:n,restore:{autoplay:t.apOn,play:t.playing,type:t.type},type:0}),this.refresh()}stopCompare(){this.comparing&&(this.host.post({t:"compareCancel"}),this.comparing="",this.refresh())}setTab(n){if(n<0||n>=Ge||n===this.tab)return;const e=this.tab;this.tab=n,this.stopCompare(),e===2&&(this.quiz.leave(),this.sendScene()),e===3&&(this.chorus.leave(),this.sendScene()),this.tabs.forEach((t,i)=>t.classList.toggle("active",i===n)),this.play.root.style.display=n===0?"":"none",this.guide.show(n===1),this.quiz.show(n===2),this.chorus.show(n===3),this.log.show(n===4),this.collection.show(n===5),n>=4&&this.st.playing&&this.setPlaying(!1),this.aside.style.visibility=n<2?"":"hidden",n===2&&this.quiz.enter(),n===3&&this.chorus.enter(),n===4&&this.log.enter(),n!==4&&document.activeElement instanceof HTMLElement&&document.activeElement.blur(),this.refresh()}key(n){const e=["F1","F2","F3","F4","F5","F6"].indexOf(n.key);if(e>=0){this.setTab(e),n.preventDefault();return}if(this.tab===5){(n.key==="ArrowUp"||n.key==="ArrowDown")&&(this.collection.step(n.key==="ArrowUp"?-1:1),n.preventDefault());return}if(this.tab===4){n.key==="ArrowUp"||n.key==="ArrowDown"?(this.log.step(n.key==="ArrowUp"?-1:1),n.preventDefault()):n.key==="Enter"&&(this.log.open(),n.preventDefault());return}const t=n.key>="1"&&n.key<="4"&&!n.metaKey&&!n.ctrlKey?Number(n.key)-1:-1;if(this.tab===3){t>=0?(this.chorus.toggleMute(t),n.preventDefault()):n.key===" "&&(this.chorus.setPlaying(!this.chorus.playing),n.preventDefault());return}if(this.tab===2){t>=0?(this.quiz.answer(t),n.preventDefault()):n.key===" "?(this.quiz.playAgain(),n.preventDefault()):n.key==="Enter"&&(this.quiz.next_(),n.preventDefault());return}n.key===" "?(this.setPlaying(!this.st.playing),n.preventDefault()):(n.key==="ArrowUp"||n.key==="ArrowDown")&&(this.stepBird(n.key==="ArrowUp"?-1:1),n.preventDefault())}applyStrings(){const n=this.s;this.stage.lang=n.lang==="no"?"nb":"en",this.enBtn.text(n.t("lang.en")).on(!n.no),this.noBtn.text(n.t("lang.no")).on(n.no),this.langLabel.textContent=n.t("header.language"),this.outLabel.textContent=n.t("header.out"),this.tabs.forEach((e,t)=>{e.replaceChildren(),e.append(n.t(`tab.${Oe[t]}`)),l("kbd","",e,`F${t+1}`)}),this.listLabel.textContent=n.t("list.birds"),this.play.applyStrings(),this.guide.applyStrings(),this.quiz.applyStrings(),this.chorus.applyStrings(),this.log.applyStrings(),this.collection.applyStrings(),this.refresh()}refresh(){const n=this.st,e=this.s,t=this.tab,i=t===2?this.quiz.playing:t===3?this.chorus.playing:n.playing;this.transportRow.style.display=t>=4?"none":"",this.outGroup.style.display=t>=4?"none":"",this.playBtn.on(i),this.stopBtn.on(!i);const s=t<2;this.prevBtn.show(s).disabled(this.neighbour(-1)===null),this.nextBtn.show(s).disabled(this.neighbour(1)===null);const o=this.birdEntry(n.bird),a=t>=3?void 0:t===2?this.birdEntry(this.quiz.headerBird()??""):o;this.readout.replaceChildren(),this.readout.classList.toggle("empty",!a),a&&(l("span","num",this.readout,a.number),l("span","name",this.readout,this.name(a)),l("span","latin",this.readout,a.latin)),o&&(this.play.setName(this.name(o)),this.play.birdName=this.name(o)),this.renderList(),this.play.refresh(),this.guide.setState({sex:n.sex,age:n.age,season:n.season,type:n.type,comparing:this.comparing}),this.status.replaceChildren();const r=this.host.error?`AUDIO: ${this.host.error}`:"";if(t===5){l("span","",this.status,e.t("tab.collection")),l("span","summary",this.status,r||this.collection.statusText());for(const p of["status.keys_bird","status.keys_screen_web"])l("span","keys",this.status,e.t(p));return}if(t===4){l("span","",this.status,e.t("tab.log")),l("span","summary",this.status,r||this.log.statusText());for(const p of["log.keys_entry","log.keys_open"])l("span","keys",this.status,e.t(p));return}if(t===3){l("span","",this.status,e.t(this.chorus.playing?"status.playing":"status.stopped")),l("span","summary",this.status,r||this.chorus.statusText());for(const p of["status.keys_play","chorus.keys_mute"])l("span","keys",this.status,e.t(p));return}if(t===2){l("span","",this.status,e.t("tab.quiz")),l("span","summary",this.status,r||this.quiz.statusText());for(const p of["quiz.status_keys_answer","quiz.status_keys_again","quiz.status_keys_next"])l("span","keys",this.status,e.t(p));return}l("span","",this.status,e.t(n.playing?"status.playing":"status.stopped"));const d=[n.season,n.time,n.type,n.place].map((p,v)=>e.t(`${yn[v]}.${hn[v][p]}`));o&&d.unshift(U(this.name(o)));const u=this.birdEntry(this.comparing);let g=this.play.error||r||d.join(", ");u&&o&&!this.play.error&&!r&&(g=e.t("status.comparing",{a:U(this.name(o)),b:U(this.name(u))})),l("span","summary",this.status,g);for(const p of["status.keys_play","status.keys_bird","status.keys_screen_web"])l("span","keys",this.status,e.t(p))}renderList(){this.list.replaceChildren();for(const e of N.groups){l("div","gh",this.list,this.s.t(`group.${e}`));for(const t of N.birds){if(t.group!==e)continue;const i=q(t.id),s=l("div",`row${t.id===this.st.bird?" sel":i?"":" off"}`,this.list);l("span","n",s,t.number),l("span","",s,this.name(t)),i&&s.addEventListener("click",()=>this.selectBird(t.id))}}const n=this.list.querySelector(".row.sel");if(n){const e=n.offsetTop-this.list.offsetTop,t=e+n.offsetHeight,i=this.list.clientHeight;e<this.list.scrollTop+24?this.list.scrollTop=Math.max(0,e-24):t>this.list.scrollTop+i&&(this.list.scrollTop=t-i)}}frame(){this.play.poll(),this.tab===1&&this.guide.poll(this.play.plate.open),this.tab===2&&this.quiz.poll(),this.tab===3&&this.chorus.poll();const n=this.oneShot;n&&(this.host.phrasesStarted>n.base&&(n.seen=!0),(n.seen&&!this.host.singing||!n.seen&&performance.now()-n.at>3e3)&&(this.endOneShot(),this.setPlaying(!1))),this.comparing&&(this.host.compare.running?this.compareSeen=!0:(this.compareSeen||performance.now()-this.compareAt>1500)&&(this.comparing="",this.refresh()));const[e,t]=this.host.takePeaks(),i=this.meter;i.l=Math.max(e,i.l*.85),i.r=Math.max(t,i.r*.85),i.peak=Math.max(Math.max(e,t),i.peak*.97);const s=i.peak>1e-5?20*Math.log10(i.peak):-100,o=`${s<=-99?`${rn}∞`:A(s,1,this.s.no)} ${this.s.t("unit.db")}`;this.outVal.textContent!==o&&(this.outVal.textContent=o);const a=r=>{const d=r>1e-5?20*Math.log10(r):-60;return`${Math.round(86*Math.min(1,Math.max(0,(d+60)/60)))}px`};this.meterL.style.width=a(i.l),this.meterR.style.width=a(i.r),requestAnimationFrame(()=>this.frame())}get stageScale(){return this.scale}}const gr=["song","call","alarm","flight"],ur=4e3;class Pn{constructor(n,e,t){this.s=e,this.on=t;const i=h(n,{display:"flex",flexDirection:"column",gap:"12px"});this.root=i,this.fileIn=l("input","",i),Object.assign(this.fileIn,{type:"file",accept:"image/*"}),this.fileIn.setAttribute("capture","environment"),this.fileIn.style.display="none",this.fileIn.addEventListener("change",()=>{this.addPicture()}),this.viewer=new nt(n.closest(".ph")??document.body,e,{name:m=>this.name(m),share:m=>{this.shareFiles([this.pictureFile(m)])},remove:async m=>{await oe(m.id),this.selected.delete(m.id),await this.load()}}),this.empty=h(i,{display:"flex",flexDirection:"column",gap:"12px"});const s=h(this.empty,{border:"1px solid var(--ink)"}),o=h(s,{display:"flex",flexDirection:"column",gap:"10px",padding:"16px 10px",background:"var(--sheet)",boxShadow:"var(--inset)"});this.emptyTitle=h(o,{font:"400 28px/1.05 var(--serif)"}),this.emptyText=l("p","",o),this.emptyText.style.margin="0";const a=h(o,{display:"grid",gridTemplateColumns:"repeat(2, minmax(0, 1fr))",gap:"6px"});this.emptyBtns=[new y(a,"",()=>t.openListen(),{height:"44px",minWidth:"0"}),new y(a,"",()=>this.fileIn.click(),{height:"44px",minWidth:"0"})],this.emptyNote=l("p","",this.empty),Object.assign(this.emptyNote.style,{margin:"0",color:"var(--inkSoft)"}),this.full=h(i,{display:"none",flexDirection:"column",gap:"12px"});const r=h(this.full,{display:"flex"});this.allBtn=new y(r,"",()=>{this.bird="",this.render()},{flex:"1 1 0",height:"44px",minWidth:"0"}),this.birdBtn=l("button","btn",r),this.birdBtn.type="button",Object.assign(this.birdBtn.style,{flex:"2 1 0",height:"44px",marginLeft:"-1px",padding:"0 10px",justifyContent:"space-between",minWidth:"0"}),this.birdName=l("span","",this.birdBtn),Object.assign(this.birdName.style,{font:"400 22px/1 var(--serif)",letterSpacing:"0"}),this.birdChange=l("span","",this.birdBtn),this.birdBtn.addEventListener("click",()=>this.stepBird());const d=h(this.full,{display:"flex",flexDirection:"column",gap:"6px"}),u=h(d,{display:"flex",alignItems:"center",gap:"6px"});this.recLabel=l("div","section",u),this.recLabel.style.flex="1",this.recCount=l("span","label",u),this.recList=h(d,{},"sheet");const g=h(this.full,{display:"flex",flexDirection:"column",gap:"6px"}),p=h(g,{display:"flex",alignItems:"center",gap:"6px"});this.picLabel=l("div","section",p),this.picLabel.style.flex="1",this.picCount=l("span","label",p),this.picGrid=h(g,{display:"grid",gridTemplateColumns:"repeat(3, minmax(0, 1fr))",gap:"6px"});const v=h(this.full,{display:"grid",gridTemplateColumns:"repeat(3, minmax(0, 1fr))",gap:"6px"});this.actRow=v;const f={height:"44px",padding:"0",minWidth:"0"};this.actions=[new y(v,"",()=>{this.selecting=!this.selecting,this.selected.clear(),this.disarm(),this.render()},f),new y(v,"",()=>{this.share()},f),new y(v,"",()=>{this.exportZip()},f),new y(v,"",()=>{this.selecting&&this.removeSelected()},f)],this.note=l("p","",this.full),Object.assign(this.note.style,{margin:"0",color:"var(--inkSoft)"})}s;on;root;recs=[];pics=[];bird="";selecting=!1;selected=new Set;player=null;playing="";urls=[];message="";armed=0;viewer;empty;emptyTitle;emptyText;emptyBtns;emptyNote;full;allBtn;birdBtn;birdName;birdChange;recLabel;recCount;recList;picLabel;picCount;picGrid;actions;actRow;exporting=!1;note;fileIn;show(n){this.root.style.display=n?"flex":"none",n?this.load():(this.player?.pause(),this.playing="",this.viewer.close(),this.disarm())}async load(){try{[this.recs,this.pics]=await Promise.all([We(),Ye()])}catch(n){this.message=String(n)}this.bird&&!this.birds().includes(this.bird)&&(this.bird=""),this.render()}get isEmpty(){return this.recs.length===0&&this.pics.length===0}entry(n){return N.birds.find(e=>e.id===n)}name(n,e=""){const t=this.entry(n);return t?this.s.no?t.name.no:t.name.en:e}birds(){const n=new Set([...this.recs.map(e=>e.bird),...this.pics.map(e=>e.bird)].filter(e=>e));return N.birds.map(e=>e.id).filter(e=>n.has(e))}stepBird(){const n=this.birds();if(!n.length)return;const e=n.indexOf(this.bird);this.bird=e<0?n.includes(this.on.playBird())?this.on.playBird():n[0]:n[(e+1)%n.length],this.render()}async addPicture(){const n=this.fileIn.files?.[0];this.fileIn.value="",n&&(await Zn({id:Tn(),bird:this.bird||this.on.playBird(),date:Dn(),image:n}),await this.load())}play(n){if(this.player?.pause(),this.playing===n.id){this.playing="",this.render();return}const e=URL.createObjectURL(n.audio),t=new Audio(e);this.player=t,this.playing=n.id,t.onended=()=>{URL.revokeObjectURL(e),this.playing="",this.render()},t.play().catch(()=>{this.playing="",this.render()}),this.render()}toggleSelect(n){this.selected.has(n)?this.selected.delete(n):this.selected.add(n),this.disarm(),this.render()}disarm(){this.armed&&clearTimeout(this.armed),this.armed=0}async removeSelected(){const n=this.selected.size;if(n){if(!this.armed){this.armed=window.setTimeout(()=>{this.armed=0,this.render()},ur),this.render();return}this.disarm();for(const e of this.recs)this.selected.has(e.id)&&(this.playing===e.id&&(this.player?.pause(),this.playing=""),await $e(e.id));for(const e of this.pics)this.selected.has(e.id)&&await oe(e.id);this.selected.clear(),this.selecting=!1,this.message=this.s.t("coll.deleted",{n:String(n)}),await this.load()}}static ext(n){return n.includes("mp4")?"m4a":n.includes("webm")?"webm":n.includes("png")?"png":"jpg"}pictureFile(n){return new File([n.image],`pipp-${n.bird}-${n.date.replace(/[: ]/g,"-")}.${Pn.ext(n.image.type)}`,{type:n.image.type})}async share(){const n=[];for(const e of this.recs)this.selected.has(e.id)&&n.push(new File([e.audio],`pipp-${e.bird||"bird"}-${e.date.replace(/[: ]/g,"-")}.${Pn.ext(e.mime)}`,{type:e.mime}));for(const e of this.pics)this.selected.has(e.id)&&n.push(this.pictureFile(e));await this.shareFiles(n)}async shareFiles(n,e=!1){if(n.length){try{navigator.canShare?.({files:n})?await navigator.share({files:n}):e?this.download(n[0]):this.message=this.s.t("coll.share_unavailable")}catch{}this.render()}}download(n){const e=URL.createObjectURL(n),t=l("a","",document.body);t.href=e,t.download=n.name,t.click(),t.remove(),setTimeout(()=>URL.revokeObjectURL(e),1e4),this.message=this.s.t("coll.export_saved",{file:n.name})}exportSet(){return this.selecting?{recs:this.recs.filter(n=>this.selected.has(n.id)),pics:this.pics.filter(n=>this.selected.has(n.id))}:{recs:this.recs.filter(n=>!this.bird||n.bird===this.bird),pics:this.pics.filter(n=>!this.bird||n.bird===this.bird)}}async exportZip(){const{recs:n,pics:e}=this.exportSet();if(!(this.exporting||n.length+e.length===0)){this.exporting=!0,this.message=this.s.t("coll.exporting"),this.render();try{const t=await Qe(n,e);this.message="",await this.shareFiles([t],!0)}catch(t){this.message=String(t)}finally{this.exporting=!1,this.render()}}}applyStrings(){const n=this.s;this.emptyTitle.textContent=n.t("phone.coll.empty_title"),this.emptyText.textContent=n.t("phone.coll.empty_text"),this.emptyBtns[0].text(n.t("phone.coll.go_listen")),this.emptyBtns[1].text(n.t("phone.coll.new_picture")),this.emptyNote.textContent=n.t("phone.coll.note"),this.allBtn.text(n.t("coll.all_birds")),this.birdChange.textContent=n.t("coll.change_bird"),this.recLabel.textContent=n.t("coll.recordings"),this.picLabel.textContent=n.t("coll.pictures"),this.actions[1].text(n.t("coll.share")),this.viewer.applyStrings(),this.note.textContent=n.t("coll.note"),this.render()}render(){const n=this.s;for(const a of this.urls)URL.revokeObjectURL(a);this.urls=[],this.empty.style.display=this.isEmpty?"flex":"none",this.full.style.display=this.isEmpty?"none":"flex",this.allBtn.on(!this.bird),this.birdBtn.classList.toggle("on",!!this.bird),this.birdName.textContent=this.bird?this.name(this.bird):this.s.t("coll.one_bird"),this.birdBtn.disabled=this.birds().length===0,this.actions[0].text(n.t(this.selecting?"coll.done":"coll.select")).on(this.selecting),this.actions[1].disabled(this.selected.size===0);const e=this.selected.size,t=this.exportSet();this.actRow.style.gridTemplateColumns=`repeat(${this.selecting?4:3}, minmax(0, 1fr))`,this.actions[2].text(n.t("coll.export")).disabled(this.exporting||t.recs.length+t.pics.length===0),this.actions[3].show(this.selecting).text(n.t(this.armed?"coll.delete_confirm":"coll.delete",{n:String(e)})).on(!!this.armed).disabled(e===0);const i=this.recs.filter(a=>!this.bird||a.bird===this.bird),s=this.pics.filter(a=>!this.bird||a.bird===this.bird);this.recCount.textContent=String(i.length),this.picCount.textContent=String(s.length),this.recList.replaceChildren(),this.recList.style.display=i.length?"":"none",i.forEach((a,r)=>{const d=h(this.recList,{height:"56px",display:"flex",alignItems:"center",gap:"8px",padding:"0 6px"},"recrow");r+1<i.length&&(d.style.borderBottom="1px solid var(--divider)"),this.selected.has(a.id)&&d.classList.add("sel"),new y(d,"",()=>{this.selecting||this.play(a)},{width:"44px",height:"44px",padding:"0"}).glyph(this.playing===a.id?"stop":"play",n.t("coll.play")).on(this.playing===a.id);const g=l("img","",d);Object.assign(g.style,{width:"120px",height:"40px",flex:"none",border:"1px solid var(--ink)",backgroundColor:"var(--face)"}),a.thumb?g.src=a.thumb:g.classList.add("hatched"),g.alt="";const p=h(d,{flex:"1",minWidth:"0",display:"flex",flexDirection:"column"}),v=n.t(`type.${gr[a.type]??"song"}`),f=`${Math.floor(a.seconds/60)}:${String(a.seconds%60).padStart(2,"0")}`,m=[this.bird?"":this.name(a.bird,a.latin),v.charAt(0)+v.slice(1).toLocaleLowerCase("nb"),f].filter(_=>_).join(" · ");h(p,{font:"500 12px var(--mono)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}).textContent=m,h(p,{color:"var(--inkSoft)"}).textContent=a.date,h(d,{font:"500 12px var(--mono)",flex:"none"}).textContent=a.confidence>=0?`${A(Math.round(a.confidence*100),0,n.no)} %`:"–",this.selecting&&(d.style.cursor="pointer",d.addEventListener("click",()=>this.toggleSelect(a.id)))}),this.picGrid.replaceChildren();for(const a of s){const r=l("button","pictile",this.picGrid);r.type="button",this.selected.has(a.id)&&r.classList.add("sel");const d=URL.createObjectURL(a.image);this.urls.push(d),r.style.backgroundImage=`url("${d}")`;const[,u,g]=a.date.slice(0,10).split("-");l("span","",r,`${g}.${u}`),r.addEventListener("click",()=>{this.selecting?this.toggleSelect(a.id):this.viewer.open(s.slice(),a.id)})}const o=l("button","btn newpic",this.picGrid);o.type="button",l("span","plus",o,"+"),l("span","",o,n.t("phone.coll.new_picture")),o.addEventListener("click",()=>this.fileIn.click()),this.on.refresh()}statusText(){const n=this.s;if(this.message)return this.message;const e=this.recs.filter(s=>!this.bird||s.bird===this.bird).length,t=this.pics.filter(s=>!this.bird||s.bird===this.bird).length,i=n.t("coll.counts",{r:String(e),p:String(t)});return this.bird?`${U(this.name(this.bird))}, ${i}`:i}}const kn=320,fn=160,fr=80,De=8e3,Pe=()=>navigator.audioSession;class mr{state="idle";level=0;startedAt=0;stoppedAt=0;image=new ImageData(kn,fn);ctx=null;stream=null;analyser=null;freq=new Uint8Array(0);time=new Float32Array(0);recorder=null;chunks=[];colDebt=0;lastFrame=0;mime="";constructor(){navigator.mediaDevices?.getUserMedia||(this.state="unsupported"),this.clear()}get seconds(){return this.startedAt?((this.state==="listening"?performance.now():this.stoppedAt)-this.startedAt)/1e3:0}get canSave(){return this.chunks.length>0}clear(){const n=this.image.data;for(let e=0;e<n.length;e+=4)n[e]=34,n[e+1]=28,n[e+2]=20,n[e+3]=0}async start(){if(this.state==="listening"||this.state==="unsupported")return;const n=Pe();n&&(n.type="play-and-record");try{this.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}})}catch(s){n&&(n.type="playback");const o=s.name;this.state=o==="NotAllowedError"||o==="SecurityError"?"denied":"unsupported";return}const e=new AudioContext;this.ctx=e,await e.resume();const t=e.createMediaStreamSource(this.stream),i=e.createAnalyser();if(i.fftSize=2048,i.smoothingTimeConstant=0,i.minDecibels=-95,i.maxDecibels=-25,t.connect(i),this.analyser=i,this.freq=new Uint8Array(i.frequencyBinCount),this.time=new Float32Array(i.fftSize),this.chunks=[],this.mime="",typeof MediaRecorder<"u"){const o=["audio/mp4","audio/webm;codecs=opus","audio/webm"].find(a=>MediaRecorder.isTypeSupported(a))??"";try{const a=new MediaRecorder(this.stream,o?{mimeType:o}:void 0);a.ondataavailable=r=>{r.data.size>0&&this.chunks.push(r.data)},a.start(500),this.recorder=a,this.mime=a.mimeType||o}catch{this.recorder=null}}this.clear(),this.startedAt=performance.now(),this.lastFrame=this.startedAt,this.state="listening"}async stop(){if(this.state!=="listening")return;this.stoppedAt=performance.now(),this.state="idle";const n=this.recorder;this.recorder=null,n&&n.state!=="inactive"&&await new Promise(t=>{n.onstop=()=>t(),n.stop()});for(const t of this.stream?.getTracks()??[])t.stop();this.stream=null,await this.ctx?.close(),this.ctx=null,this.analyser=null,this.level=0;const e=Pe();e&&(e.type="playback")}async recording(){return this.recorder&&this.recorder.state==="recording"&&await new Promise(n=>{const e=this.recorder,t=()=>{e.removeEventListener("dataavailable",t),n()};e.addEventListener("dataavailable",t),e.requestData()}),this.chunks.length?new Blob(this.chunks,{type:this.mime||"audio/mp4"}):null}window(){return this.analyser&&this.analyser.getFloatTimeDomainData(this.time),{samples:this.time.slice(),sampleRate:this.ctx?.sampleRate??48e3}}poll(){const n=this.analyser;if(!n||this.state!=="listening"||!this.ctx)return;const e=performance.now();this.colDebt+=(e-this.lastFrame)/1e3*fr,this.lastFrame=e,n.getFloatTimeDomainData(this.time);let t=0;for(const v of this.time)t+=v*v;const i=Math.sqrt(t/this.time.length),s=i>1e-6?20*Math.log10(i):-100,o=Math.min(1,Math.max(0,(s+60)/60));this.level=Math.max(o,this.level*.9);const a=Math.floor(this.colDebt);if(a<=0)return;this.colDebt-=a,n.getByteFrequencyData(this.freq);const r=this.ctx.sampleRate/n.fftSize,d=this.image.data,u=kn,g=fn,p=Math.min(a,u);for(let v=0;v<g;v++){const f=v*u*4;d.copyWithin(f,f+p*4,f+u*4)}for(let v=0;v<g;v++){const f=(g-1-v)/g*De,m=(g-v)/g*De;let _=0;for(let b=Math.floor(f/r);b<=Math.ceil(m/r)&&b<this.freq.length;b++)_=Math.max(_,this.freq[b]);const w=Math.max(0,Math.min(255,(_-110)*2.2));for(let b=u-p;b<u;b++)d[(v*u+b)*4+3]=w}}}const vr="#c2331a",br=2,_r=.5;class kr{constructor(n,e,t){this.s=e,this.on=t;const i=h(n,{display:"none",flexDirection:"column",gap:"12px"});this.root=i;const s=h(i,{display:"flex",alignItems:"center",gap:"8px"});this.mainBtn=l("button","btn listenbtn",s),this.mainBtn.type="button",this.mainBtn.addEventListener("click",()=>{this.toggle()}),this.dot=l("span","recdot",this.mainBtn),this.dot.style.background=vr,this.mainLabel=l("span","mlabel",this.mainBtn),this.timer=l("span","mtimer",this.mainBtn);const o=h(s,{width:"96px",height:"56px",flex:"none",display:"flex",flexDirection:"column",justifyContent:"center",gap:"4px",padding:"0 6px"},"well");this.levelLabel=l("span","field",o);const a=l("span","",o);Object.assign(a.style,{height:"8px",display:"block",background:"rgb(34 28 20 / 0.08)"}),this.levelBar=l("span","",a),Object.assign(this.levelBar.style,{height:"8px",display:"block",width:"0",background:"var(--ink)"}),this.sonoSec=h(i,{display:"flex",flexDirection:"column",border:"1px solid var(--ink)"});const r=h(this.sonoSec,{justifyContent:"space-between"},"panelhead");this.sonoTitle=l("div","title",r),this.sonoNote=l("span","label",r);const d=h(this.sonoSec,{display:"flex",height:`${fn}px`});this.axis=h(d,{flex:"1",minWidth:"0",position:"relative",font:"400 9px/12px var(--mono)",color:"var(--inkSoft)"});const u=h(d,{borderLeft:"1px solid var(--ink)",flex:"none"});this.canvas=new Z(u,kn,fn),this.off.width=kn,this.off.height=fn,this.timeAxis=h(this.sonoSec,{height:"16px",display:"flex",justifyContent:"flex-end",borderTop:"1px solid var(--ink)",font:"400 9px/14px var(--mono)",color:"var(--inkSoft)"}),this.caption=h(this.sonoSec,{height:"18px",borderTop:"1px solid var(--ink)",padding:"0 8px"},"cap"),this.deniedSec=h(i,{display:"none",flexDirection:"column",border:"1px solid var(--ink)"});const g=h(this.deniedSec,{justifyContent:"space-between"},"panelhead");this.deniedTitle=l("div","title",g),this.deniedHeadNote=l("span","label",g);const p=h(this.deniedSec,{display:"flex",flexDirection:"column",gap:"10px",padding:"12px 10px",background:"var(--face)"});this.deniedBig=h(p,{font:"400 28px/1.05 var(--serif)"}),this.deniedText=l("p","",p),this.deniedText.style.margin="0",this.settingsBtn=new y(p,"",()=>{window.location.href="app-settings:"},{height:"44px"}),this.resultSec=h(i,{display:"none",flexDirection:"column",border:"1px solid var(--ink)"});const v=h(this.resultSec,{justifyContent:"space-between"},"panelhead");this.resultTitle=l("div","title",v),this.resultCount=l("span","label",v),this.resultBody=h(this.resultSec,{display:"flex",flexDirection:"column"}),this.chooseSec=h(i,{display:"none",flexDirection:"column",border:"1px solid var(--ink)"});const f=h(this.chooseSec,{justifyContent:"space-between"},"panelhead");this.chooseTitle=l("div","title",f),this.chooseNote=l("span","label",f);const m=h(this.chooseSec,{display:"flex",alignItems:"center",gap:"8px",padding:"10px 8px",background:"var(--face)"});new y(m,"",()=>this.step(-1),{width:"44px",height:"44px",padding:"0",flex:"none"}).glyph("prev","Previous bird");const _=h(m,{flex:"1",minWidth:"0",display:"flex",flexDirection:"column",alignItems:"center",gap:"4px"});this.chooseName=h(_,{font:"400 28px/1.05 var(--serif)",textAlign:"center"}),this.chooseLatin=h(_,{color:"var(--inkSoft)",fontStyle:"italic"}),new y(m,"",()=>this.step(1),{width:"44px",height:"44px",padding:"0",flex:"none"}).glyph("next","Next bird");const w=h(i,{display:"grid",gridTemplateColumns:"repeat(2, minmax(0, 1fr))",gap:"6px"}),b=L=>new y(w,"",L,{height:"44px",padding:"0",minWidth:"0"});this.actions=[b(()=>{this.save()}),b(()=>this.fileIn.click()),b(()=>{this.compare()}),b(()=>{const L=this.bestId();L&&this.on.openGuide(L)}),b(()=>this.on.openCollection())],this.fileIn=l("input","",i),Object.assign(this.fileIn,{type:"file",accept:"image/*"}),this.fileIn.setAttribute("capture","environment"),this.fileIn.style.display="none",this.fileIn.addEventListener("change",()=>{this.picture()}),this.note=l("p","",i),Object.assign(this.note.style,{margin:"0",color:"var(--inkSoft)"})}s;on;root;mic=new mr;matches=[];nextGuess=0;message="";player=null;mainBtn;dot;mainLabel;timer;levelLabel;levelBar;sonoSec;sonoTitle;sonoNote;axis;canvas;off=document.createElement("canvas");timeAxis;caption;deniedSec;deniedTitle;deniedHeadNote;deniedBig;deniedText;settingsBtn;resultSec;resultTitle;resultCount;resultBody;actions=[];note;fileIn;chosen="";chooseSec;chooseTitle;chooseNote;chooseName;chooseLatin;show(n){this.root.style.display=n?"flex":"none",n||this.stop()}resize(n){this.canvas.resize(n)}name(n){return n?this.s.no?n.name.no:n.name.en:""}entry(n){return N.birds.find(e=>e.id===n)}bestId(){return this.chosenId()}chosenId(){return this.chosen||this.on.playBird()}step(n){const e=N.birds.map(i=>i.id),t=e.indexOf(this.chosenId());this.chosen=e[(t+n+e.length)%e.length],this.update()}async toggle(){this.mic.state==="listening"?await this.stop():(this.player?.pause(),this.matches=[],this.message="",await this.mic.start(),this.nextGuess=br),this.update()}async stop(){this.mic.state==="listening"&&(await this.mic.stop(),this.update())}async save(){const n=await this.mic.recording();if(!n)return;const e={birdId:this.chosenId(),confidence:-1},t=document.createElement("canvas");t.width=120,t.height=40;const i=t.getContext("2d");i.fillStyle=M.face,i.fillRect(0,0,120,40),i.drawImage(this.off,0,0,120,40),await pe({id:Tn(),bird:e?.birdId??"",latin:e?.latinName??"",type:0,seconds:Math.round(this.mic.seconds),date:Dn(),confidence:e?.confidence??0,mime:n.type,audio:n,thumb:t.toDataURL("image/png")}),e?.birdId&&this.on.logHeard(e.birdId,0),this.message=this.s.t("listen.saved",{bird:U(this.name(this.entry(e?.birdId))||e?.latinName||"")}),this.update()}async picture(){const n=this.fileIn.files?.[0];if(this.fileIn.value="",!n)return;const e=this.bestId()||this.on.playBird();await Zn({id:Tn(),bird:e,date:Dn(),image:n}),this.message=this.s.t("listen.picture_saved",{bird:U(this.name(this.entry(e)))}),this.update()}async compare(){const n=this.bestId();await this.stop();const e=await this.mic.recording();if(!e||!n)return;this.player?.pause();const t=new Audio(URL.createObjectURL(e));this.player=t,t.onended=()=>{URL.revokeObjectURL(t.src),q(n)&&this.on.singBird(n)},await t.play().catch(()=>t.onended?.(new Event("ended")))}applyStrings(){const n=this.s;this.levelLabel.textContent=n.t("listen.mic_short"),this.sonoTitle.textContent=n.t("listen.mic"),this.sonoNote.textContent=n.t("listen.last_4s"),this.axis.replaceChildren();for(const[e,t]of[[n.t("axis.khz",{n:"8"}),"top: 2px"],[n.t("axis.khz",{n:"4"}),"top: 74px"],["0","bottom: 2px"]])l("span","",this.axis,e).style.cssText=`position: absolute; right: 4px; ${t}`;this.timeAxis.replaceChildren();for(let e=4;e>=1;e--)h(this.timeAxis,{width:"80px",paddingLeft:"2px"}).textContent=e===4?`−4 ${n.t("unit.s")}`:`−${e}`;this.caption.replaceChildren(),l("b","",this.caption,`${n.t("fig")} 1`),this.caption.append(n.t("listen.caption")),this.deniedTitle.textContent=n.t("listen.mic"),this.deniedHeadNote.textContent=n.t("listen.off"),this.settingsBtn.text(n.t("listen.settings")),this.resultTitle.textContent=n.t("listen.who"),["listen.save","listen.picture","listen.compare","phone.quiz.open_guide","listen.open_collection"].forEach((e,t)=>this.actions[t].text(n.t(e))),this.update()}update(){const n=this.s,e=this.mic.state,t=e==="listening",i=e==="denied"||e==="unsupported";this.mainBtn.classList.toggle("on",t),this.mainBtn.disabled=i,this.dot.style.display=t?"":"none",this.mainLabel.textContent=n.t(t?"listen.listening":"listen.start"),this.sonoSec.style.display=i?"none":"flex",this.deniedSec.style.display=i?"flex":"none",this.deniedBig.textContent=n.t(e==="unsupported"?"listen.unsupported_title":"listen.denied_title"),this.deniedText.textContent=n.t(e==="unsupported"?"listen.unsupported_text":"listen.denied_text");const s=!!window.Capacitor?.isNativePlatform?.();this.settingsBtn.show(e==="denied"&&s),this.note.textContent=n.t(i?"listen.denied_note":"listen.note_record"),this.chooseSec.style.display=i?"none":"flex";const o=this.entry(this.chosenId());this.chooseTitle.textContent=n.t("listen.which"),this.chooseNote.textContent=n.t("listen.file_under"),this.chooseName.textContent=this.name(o),this.chooseLatin.textContent=o?.latin??"",this.renderResult();const a=this.bestId();this.actions[0].disabled(!this.mic.canSave),this.actions[1].disabled(!1),this.actions[2].disabled(!this.mic.canSave||!a||!q(a)),this.actions[3].disabled(!a||!en(a,"bird")),this.on.refresh()}renderResult(){const n=this.s,e=this.matches;if(this.resultSec.style.display=e.length?"flex":"none",this.resultBody.replaceChildren(),!e.length)return;this.resultCount.textContent=n.t("listen.suggestions",{n:String(e.length)});const t=g=>`${A(Math.round(g*100),0,n.no)} %`,i=g=>this.name(this.entry(g.birdId))||g.latinName||"",s=e[0],o=h(this.resultBody,{display:"flex",flexDirection:"column",gap:"6px",padding:"10px 8px",background:"var(--face)",borderBottom:"1px solid var(--ink)"});s.birdId||(o.style.backgroundImage="var(--hatching)");const a=h(o,{display:"flex",alignItems:"baseline",justifyContent:"space-between",gap:"8px"});h(a,{font:"400 32px/1 var(--serif)"}).textContent=i(s),h(a,{font:"500 12px var(--mono)",whiteSpace:"nowrap"}).textContent=t(s.confidence);const r=[this.entry(s.birdId)?.latin??s.latinName??"",n.t("listen.song")];s.confidence<_r&&r.push(n.t("listen.unsure"));const d=h(o,{color:"var(--inkSoft)"});d.textContent=r.filter(g=>g).join(" · "),s.birdId||l("span","notinpipp",d,n.t("listen.not_in_pipp"));const u=h(o,{height:"8px",display:"flex",border:"1px solid var(--ink)",background:"var(--sheet)"});h(u,{width:`${Math.round(s.confidence*100)}%`,background:"var(--ink)"}),e.slice(1).forEach((g,p)=>{const v=h(this.resultBody,{height:"44px",display:"flex",alignItems:"center",gap:"8px",padding:"0 8px"});p+2<e.length&&(v.style.borderBottom="1px solid var(--divider)"),g.birdId||(v.style.backgroundImage="var(--hatching)");const f=h(v,{flex:"1",minWidth:"0",fontSize:"13px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"});f.textContent=i(g),g.birdId||l("span","notinpipp",f,n.t("listen.not_in_pipp"));const m=h(v,{width:"96px",height:"8px",display:"flex",border:"1px solid var(--ink)",background:"var(--face)",flex:"none"});h(m,{width:`${Math.round(g.confidence*100)}%`,background:"var(--ink)"}),h(v,{width:"36px",textAlign:"right",font:"500 12px var(--mono)",flex:"none"}).textContent=t(g.confidence)})}statusLeft(){return this.s.t(this.mic.state==="listening"?"listen.status_listening":this.mic.state==="denied"?"listen.status_off":"phone.tab.listen")}statusText(){return this.message||(this.mic.state==="denied"?"":this.s.t("listen.offline"))}poll(){const n=this.mic;n.poll();const e=n.seconds,t=n.startedAt?`${Math.floor(e/60)}:${String(Math.floor(e%60)).padStart(2,"0")}`:"";this.timer.textContent!==t&&(this.timer.textContent=t),this.levelBar.style.width=`${Math.round(n.level*100)}%`;const i=this.canvas.begin();wn(i,kn,fn),i.fillStyle=M.shadow,i.fillRect(0,0,kn,1),i.fillRect(0,0,1,fn),this.off.getContext("2d").putImageData(n.image,0,0),i.drawImage(this.off,0,0)}}const re=390,yr=re-32,ze=["play","guide","listen","quiz","chorus","collection"],Ze="pipp.lang",Fe=64/72,ie={w:320,h:160,pxPerKHz:20,playheadX:200};class wr{constructor(n,e){this.host=e;const t=localStorage.getItem(Ze);(t==="no"||t==="en")&&this.s.set(t);const i=this.st,s=this.s,o=h(n,{},"ph");this.col=o;const a=l("div","ph-header",o),r=l("div","wordmark",a);l("span","",r,"Pipp");const d=l("i","",r);for(const E of["clay","khaki","sage","plum"])l("b","",d).style.background=`var(--${E})`;h(a,{flex:"1"});const u=l("div","joined",a),g={width:"44px",height:"44px",fontSize:"11px",padding:"0"};this.noBtn=new y(u,"",()=>this.setLanguage("no"),g),this.enBtn=new y(u,"",()=>this.setLanguage("en"),g);const p=l("div","joined",a);this.playBtn=new y(p,"",()=>this.transport(!0),g).glyph("play","Play"),this.stopBtn=new y(p,"",()=>this.transport(!1),g).glyph("stop","Stop");const v=l("div","ph-tabs",o);ze.forEach((E,O)=>{const $=l("div",O===0?"ph-tab active":"ph-tab",v);O===5&&($.style.flex="1.3"),$.addEventListener("click",()=>this.setTab(O)),this.tabs.push($)}),this.main=l("div","ph-main",o),this.status=l("div","status ph-status",o);const f=h(this.main,{display:"flex",alignItems:"center",marginBottom:"12px"});this.stepper=f;const m=h(this.main,{display:"flex",flexDirection:"column",gap:"12px"});this.play=m,this.prevBtn=new y(f,"",()=>this.stepBird(-1),g).glyph("prev","Previous bird"),this.readout=h(f,{},"ph-readout well"),this.readout.addEventListener("click",()=>this.showPicker(!0)),this.nextBtn=new y(f,"",()=>this.stepBird(1),{...g,marginLeft:"-1px"}).glyph("next","Next bird");const _=h(m,{display:"flex",flexDirection:"column",border:"1px solid var(--ink)"}),w=h(_,{justifyContent:"space-between"},"panelhead");this.nameEl=l("div","title",w),this.nameEl.style.flex="1";const b=l("div","joined",w);this.sexBtns=[0,1].map(E=>new y(b,"",()=>this.setChoice("sc_sex","sex",E),{width:"56px",height:"22px",padding:"0"}));const L=l("div","joined",w);this.ageBtns=[0,1].map(E=>new y(L,"",()=>this.setChoice("sc_age","age",E),{width:E?"40px":"56px",height:"22px",padding:"0"}));const k=h(_,{height:"216px",padding:"2px",boxShadow:"var(--inset)"},"paper");this.plate=new ce(k,yr-2-4,212,s),this.plateCap=h(_,{height:"18px",borderTop:"1px solid var(--ink)",padding:"0 8px"},"cap");const x=h(m,{display:"flex",flexDirection:"column",border:"1px solid var(--ink)"}),S=h(x,{justifyContent:"space-between"},"panelhead");this.songTitle=l("div","title",S);const T=l("span","",S);Object.assign(T.style,{display:"flex",gap:"8px"}),this.lengthLabel=l("span","label",T),this.lengthVal=l("span","value",T);const P=h(x,{display:"flex",height:`${ie.h}px`,flex:"none"});this.axis=h(P,{flex:"1",minWidth:"0",position:"relative",font:"400 9px/12px var(--mono)",color:"var(--inkSoft)"});const H=h(P,{borderLeft:"1px solid var(--ink)",flex:"none"});this.sono=new ot(H,e,ie),this.sono.onLineChanged=()=>{e.post({t:"drawn",pts:this.sono.linePoints()}),this.sono.lineCount()===0&&i.kept&&(i.kept=!1,e.post({t:"keep",on:!1})),this.refresh()},this.sono.handLabel=E=>`${s.t(`knob.${Ln[E]}`)} ${s.t("song.by_hand")}`,this.sono.flagText=(E,O)=>`${A(E/1e3,1,s.no)} kHz  ${A(O,1,s.no)} ${s.t("unit.s")}`,this.timeAxis=h(x,{height:"16px",flex:"none",display:"flex",justifyContent:"flex-end",borderTop:"1px solid var(--ink)",font:"400 9px/14px var(--mono)",color:"var(--inkSoft)"}),this.songCap=h(x,{height:"18px",flex:"none",borderTop:"1px solid var(--ink)",padding:"0 8px"},"cap"),this.tools=h(x,{},"ph-tools");const B=(E,O,$,mn="")=>new y(E,mn,$,{flex:`${O} 1 0`,height:"44px",padding:"0",fontSize:"11px"});this.drawBtn=B(this.tools,1.4,()=>this.setDraw(!0)),this.speedBtns=["1×","½×","¼×"].map((E,O)=>B(this.tools,1,()=>this.setSpeed(O),E)),this.shiftBtn=B(this.tools,1.6,()=>this.setShift(!i.shift)),this.drawTools=h(x,{display:"none",flexDirection:"column"});const F=h(this.drawTools,{},"ph-tools");this.drawOffBtn=B(F,1,()=>this.setDraw(!1)).on(!0),this.eraseBtn=B(F,1,()=>{this.sono.erasing=!this.sono.erasing,this.refresh()}),this.clearBtn=B(F,1,()=>this.sono.clearLine());const W=h(this.drawTools,{},"ph-tools");this.singBtn=B(W,1,()=>{i.playing||this.setPlaying(!0),e.trigger("ap_sing_once")}),this.keepBtn=B(W,1.6,()=>{i.kept=!i.kept,e.post({t:"keep",on:i.kept}),this.refresh()});const Y=h(m,{display:"flex",flexDirection:"column",gap:"6px"});this.sceneLabel=l("div","section",Y);const z=h(Y,{display:"grid",gridTemplateColumns:"60px repeat(4, minmax(0, 1fr))",rowGap:"4px",alignItems:"center"}),R={height:"44px",padding:"0",minWidth:"0"};for(let E=0;E<6;E++){const O=l("span","field",z);if(O.style.whiteSpace="normal",O.style.height="auto",this.sceneFieldLabels.push(O),E<4)this.scene.push(hn[E].map(($,mn)=>new y(z,"",()=>this.setScene(E,mn),{...R,marginLeft:mn?"-1px":"0"})));else{const $=new y(z,"",void 0,{...R,gridColumn:"span 4"}).disabled(!0);E===4?this.dialectBtn=$:this.mimicsBtn=$}}this.dialectBtn??=new y(z),this.mimicsBtn??=new y(z);const I=h(m,{display:"flex",flexDirection:"column",gap:"6px",padding:"8px",border:"1px solid var(--ink)",background:"var(--panel)"}),G=h(I,{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px"});this.apTitle=l("span","serif",G),Object.assign(this.apTitle.style,{fontSize:"22px",lineHeight:"1"}),this.apOnBtn=new y(G,"",()=>{i.apOn=!i.apOn,e.param("ap_on",i.apOn?1:0),this.refresh()},{height:"44px",padding:"0 16px",fontSize:"11px"});const gn=h(I,{display:"flex",alignItems:"center",gap:"8px"});this.holdLabel=l("span","field",gn);const Fn=h(gn,{display:"flex",flex:"1",minWidth:"0"});this.holdVal=h(Fn,{flex:"1",minWidth:"0",height:"44px",display:"flex",alignItems:"center",justifyContent:"flex-end",padding:"0 8px",font:"500 12px var(--mono)"},"well");const ge=E=>{i.hold=Math.min(20,Math.max(.5,i.hold+E)),e.param("ap_hold",i.hold),this.refresh()};new y(Fn,rn,()=>ge(-.5),{width:"44px",height:"44px",marginLeft:"-1px",fontSize:"14px",padding:"0"}),new y(Fn,"+",()=>ge(.5),{width:"44px",height:"44px",marginLeft:"-1px",fontSize:"14px",padding:"0"}),this.latchBtn=new y(gn,"",()=>{i.latch=!i.latch,e.param("ap_latch",i.latch?1:0),this.refresh()},{width:"64px",height:"44px",padding:"0"});const ct=h(I,{display:"grid",gridTemplateColumns:"repeat(3, minmax(0, 1fr))",gap:"6px"});this.apBtns=["ap_return_all","ap_sing_once","ap_reroll"].map(E=>new y(ct,"",()=>e.trigger(E),{height:"44px",padding:"0",minWidth:"0"}));const Nn=h(I,{display:"flex",alignItems:"center",gap:"8px",font:"500 10px/14px var(--mono)",letterSpacing:"0.06em",whiteSpace:"nowrap"});h(Nn,{width:"18px",height:"3px",flex:"none",background:"var(--ink)"}),this.legendText=l("span","",Nn);const ue=l("span","",Nn);Object.assign(ue.style,{flex:"1",minWidth:"24px",height:"8px",display:"flex",border:"1px solid var(--ink)",background:"var(--face)"}),this.legendFill=l("span","",ue),this.legendFill.style.background="var(--ink)",this.legendVal=l("span","",Nn);const gt=[[0,5],[5,4],[9,3]];for(const[E,O]of gt){const $=h(m,{display:"flex",flexDirection:"column",gap:"6px"});this.groupLabels.push(l("div","section",$));const mn=h($,{display:"flex",justifyContent:O===3?"flex-start":"space-between",gap:O===3?"34px":"0"});for(let Un=0;Un<O;Un++){const ft=h(mn,{flex:"none"}),qn=new at(ft,e,s,E+Un);qn.cv.c.style.width=`${Math.round(78*Fe)}px`,qn.cv.c.style.height=`${Math.round(104*Fe)}px`,this.knobs.push(qn)}}const Kn=h(this.main,{display:"none",flexDirection:"column",gap:"12px"});this.picker=Kn;const fe=h(Kn,{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px"});this.pickerTitle=h(fe,{font:"400 28px/1 var(--serif)"}),this.pickerClose=new y(fe,"",()=>this.showPicker(!1),{height:"44px",padding:"0 16px"}),this.pickerList=h(Kn,{},"sheet ph-birds"),this.guide=new tt(this.main,e,s,{sex:E=>this.setChoice("sc_sex","sex",E),age:E=>this.setChoice("sc_age","age",E),season:E=>{i.season=E,e.param("sc_season",E),this.refresh()},playType:E=>{i.type=E,e.param("sc_type",E),this.setPlaying(!0),e.trigger("ap_sing_once")},compare:E=>this.startCompare(E)},!0),this.quiz=new ht(this.main,e,s,{refresh:()=>this.refresh(),openGuide:E=>{this.setTab(1),this.selectBird(E)}},!0),this.chorus=new Ue(this.main,e,s,this.quiz.ids,this.quiz.ids.map(E=>e.birds.get(E)),{refresh:()=>this.refresh(),playBird:()=>i.bird},!0);const Rn=h(this.main,{display:"none",flexDirection:"column",gap:"12px"});this.coll=Rn;const ut=l("div","joined fill",Rn);this.collSwitch=[!1,!0].map(E=>new y(ut,"",()=>{this.collLog=E,this.refresh()},{flex:"1",height:"44px"})),this.collection=new Pn(Rn,s,{refresh:()=>this.refresh(),openListen:()=>this.setTab(2),playBird:()=>i.bird}),this.log=new st(Rn,s,{refresh:()=>this.refresh(),openBird:E=>{this.setTab(1),this.selectBird(E)},playBird:()=>i.bird,playType:()=>i.type},!0),this.listen=new kr(this.main,s,{refresh:()=>this.refresh(),openGuide:E=>{this.setTab(1),this.selectBird(E)},openCollection:()=>{this.collLog=!1,this.setTab(5)},singBird:E=>{this.setTab(0),this.selectBird(E),this.setPlaying(!0),this.host.trigger("ap_sing_once")},logHeard:(E,O)=>this.log.addHeard(E,O),playBird:()=>i.bird}),window.addEventListener("resize",()=>this.fit()),window.addEventListener("keydown",E=>{E.key===" "&&(this.transport(!this.transportOn()),E.preventDefault())}),document.fonts?.ready.then(()=>this.applyStrings()),this.selectBird(i.bird),this.sendScene(),this.applyStrings(),this.fit(),requestAnimationFrame(()=>this.frame())}host;s=new Ke;st=dt();zoom=1;col;main;enBtn;noBtn;playBtn;stopBtn;tabs=[];status;play;picker;pickerTitle;pickerClose;pickerList;pickerOpen=!1;tab=0;stepper;guide;quiz;chorus;log;coll;collSwitch=[];collection;listen;collLog=!1;comparing="";compareSeen=!1;compareAt=0;prevBtn;nextBtn;readout;nameEl;sexBtns=[];ageBtns=[];plate;plateCap;songTitle;lengthLabel;lengthVal;axis;sono;timeAxis;songCap;tools;drawBtn;speedBtns=[];shiftBtn;drawTools;drawOffBtn;eraseBtn;clearBtn;singBtn;keepBtn;sceneLabel;sceneFieldLabels=[];scene=[];dialectBtn;mimicsBtn;apTitle;apOnBtn;holdLabel;holdVal;latchBtn;apBtns=[];legendText;legendFill;legendVal;groupLabels=[];knobs=[];lastModes=new Array(12).fill(0);legendKnob=-1;error="";fit(){const n=Math.min(1.4,window.innerWidth/re);this.zoom=n,this.col.style.zoom=String(n),this.col.style.height=`${window.innerHeight/n}px`,this.col.style.left=`${Math.max(0,(window.innerWidth-re*n)/2)/n}px`;const e=[this.plate.cv,this.sono.cv,...this.knobs.map(t=>t.cv)];for(const t of e)t.resize(n);this.guide.resize(n),this.quiz.resize(n),this.chorus.resize(n),this.listen.resize(n),this.plate.paint(!0);for(const t of this.knobs)t.invalidate()}birdEntry(n){return N.birds.find(e=>e.id===n)}name(n){return this.s.no?n.name.no:n.name.en}otherName(n){return this.s.no?n.name.en:n.name.no}selectBird(n){const e=this.host.birds.get(n);if(e){this.st.bird=n,this.host.post({t:"bird",id:n}),this.sono.bird=e;for(const t of this.knobs)t.setBird(e);this.error=this.plate.load(n),this.plate.paint(!0),this.guide.setBird(n),this.refresh()}}setTab(n){if(n===this.tab)return;const e=this.tab;this.tab=n,this.stopCompare(),e===3&&(this.quiz.leave(),this.sendScene()),e===4&&(this.chorus.leave(),this.sendScene()),this.pickerOpen&&this.showPicker(!1),this.tabs.forEach((t,i)=>t.classList.toggle("active",i===n)),this.stepper.style.display=n<=1?"flex":"none",this.play.style.display=n===0?"flex":"none",this.guide.show(n===1),this.quiz.show(n===3),this.chorus.show(n===4),this.coll.style.display=n===5?"flex":"none",this.listen.show(n===2),this.collection.show(n===5&&!this.collLog),(n===2||n===5)&&this.st.playing&&this.setPlaying(!1),n===3&&this.quiz.enter(),n===4&&this.chorus.enter(),n===5&&this.log.enter(),this.main.scrollTop=0,this.refresh()}transportOn(){return this.tab===3?this.quiz.playing:this.tab===4?this.chorus.playing:this.st.playing}transport(n){this.tab===3?n?this.quiz.playAgain():this.quiz.stop():this.tab===4?this.chorus.setPlaying(n):this.setPlaying(n)}startCompare(n){const e=this.comparing===n;if(this.stopCompare(),this.st.draw&&this.setDraw(!1),e)return;this.host.start(),this.comparing=n,this.compareSeen=!1,this.compareAt=performance.now();const t=this.st;this.host.post({t:"compare",first:t.bird,second:n,restore:{autoplay:t.apOn,play:t.playing,type:t.type},type:0}),this.refresh()}stopCompare(){this.comparing&&(this.host.post({t:"compareCancel"}),this.comparing="",this.refresh())}neighbour(n){const e=N.birds.findIndex(t=>t.id===this.st.bird);for(let t=e+n;t>=0&&t<N.birds.length;t+=n)if(q(N.birds[t].id))return N.birds[t].id;return null}stepBird(n){const e=this.neighbour(n);e&&this.selectBird(e)}showPicker(n){this.pickerOpen=n,this.stepper.style.display=n?"none":"flex",this.play.style.display=n||this.tab!==0?"none":"flex",this.guide.show(!n&&this.tab===1),this.picker.style.display=n?"flex":"none",this.main.scrollTop=0,n&&this.renderPicker()}renderPicker(){this.pickerList.replaceChildren();for(const n of N.groups){l("div","gh",this.pickerList,this.s.t(`group.${n}`));for(const e of N.birds){if(e.group!==n)continue;const t=q(e.id),i=l("div",`row${e.id===this.st.bird?" sel":t?"":" off"}`,this.pickerList);l("span","n",i,e.number),l("span","",i,this.name(e)),l("span","other",i,this.otherName(e)),t&&i.addEventListener("click",()=>{this.selectBird(e.id),this.showPicker(!1)})}}}sendScene(){const n=this.st,e=this.host;e.post({t:"bird",id:n.bird}),e.param("sc_season",n.season),e.param("sc_time",n.time),e.param("sc_type",n.type),e.param("sc_place",n.place),e.param("sc_sex",n.sex),e.param("sc_age",n.age),e.param("ap_on",n.apOn?1:0),e.param("ap_latch",n.latch?1:0),e.param("ap_hold",n.hold),e.param("pb_speed",n.speed),e.param("pb_shift",n.shift?1:0),e.param("pb_draw",n.draw?1:0),e.post({t:"keep",on:n.kept}),e.param("pb_play",n.playing?1:0)}setPlaying(n){this.stopCompare(),this.st.playing=n,n&&this.host.start(),this.host.param("pb_play",n?1:0),this.refresh()}setLanguage(n){this.s.set(n),localStorage.setItem(Ze,n),this.applyStrings()}setChoice(n,e,t){this.st[e]=t,this.host.param(n,t),this.refresh()}setScene(n,e){const t=["season","time","type","place"];this.st[t[n]]=e,this.host.param(rt[n],e),this.refresh()}setSpeed(n){this.st.speed=n,this.host.param("pb_speed",n),this.refresh()}setShift(n){this.st.shift=n,this.host.param("pb_shift",n?1:0),this.refresh()}setDraw(n){this.st.draw=n,this.sono.erasing=!1,this.sono.setDrawMode(n),this.host.param("pb_draw",n?1:0),this.refresh()}typeAvailable(n){const e=this.sono.bird,t=this.st;return!!e&&this.host.pipp.x.pipp_bird_type_active(e,n,t.season,t.time,t.sex,t.age)!==0}applyStrings(){const n=this.s;this.col.lang=n.no?"nb":"en",document.documentElement.lang=n.no?"nb":"en",this.enBtn.text(n.t("lang.en")),this.noBtn.text(n.t("lang.no")),this.tabs.forEach((e,t)=>e.textContent=n.t(`phone.tab.${ze[t]}`)),this.sexBtns[0].text(n.t("plate.male")),this.sexBtns[1].text(n.t("plate.female")),this.ageBtns[0].text(n.t("plate.adult")),this.ageBtns[1].text(n.t("plate.juv")),this.lengthLabel.textContent=n.t("song.length"),this.drawBtn.text(n.t("song.draw")),this.drawOffBtn.text(n.t("song.draw")),this.shiftBtn.text(n.t("song.shift_oct")),this.eraseBtn.text(n.t("song.erase")),this.clearBtn.text(n.t("song.clear")),this.singBtn.text(n.t("song.sing_it")),this.keepBtn.text(n.t("song.keep")),this.sono.yourPhraseText=n.t("song.your_phrase"),this.sono.nowText=n.t("song.now"),this.sceneLabel.textContent=n.t("scene"),["scene.season","phone.scene.time","phone.scene.type","scene.place","scene.dialect","scene.mimics"].forEach((e,t)=>this.sceneFieldLabels[t].textContent=n.t(e)),this.scene.forEach((e,t)=>e.forEach((i,s)=>i.text(n.t(`${yn[t]}.${hn[t][s]}`)))),this.dialectBtn.text(n.t("scene.dialect_none")),this.mimicsBtn.text(n.t("scene.mimics_none")),this.apTitle.textContent=n.t("ap.title"),this.holdLabel.textContent=n.t("phone.ap.hold"),this.latchBtn.text(n.t("ap.latch")),["ap.return_all","ap.sing_once","ap.reroll"].forEach((e,t)=>this.apBtns[t].text(n.t(e))),["group.voice","group.phrasing","group.surroundings"].forEach((e,t)=>this.groupLabels[t].textContent=n.t(e)),this.pickerTitle.textContent=n.t("phone.pick_bird"),this.pickerClose.text(n.t("phone.close")),this.collSwitch[0].text(n.t("phone.coll.media")),this.collSwitch[1].text(n.t("phone.coll.log")),this.collection.applyStrings(),this.listen.applyStrings(),this.guide.applyStrings(),this.quiz.applyStrings(),this.chorus.applyStrings(),this.log.applyStrings(),this.axis.replaceChildren();for(const[e,t]of[[n.t("axis.khz",{n:"8"}),"top: 2px"],[n.t("axis.khz",{n:"4"}),"top: 74px"],["0","bottom: 2px"]]){const i=l("span","",this.axis,e);i.style.cssText=`position: absolute; right: 4px; ${t}`}this.timeAxis.replaceChildren();for(let e=0;e<ie.w/80;e++)h(this.timeAxis,{width:"80px",paddingLeft:"2px"}).textContent=e===0?`0 ${n.t("unit.s")}`:String(e);for(const e of this.knobs)e.invalidate();this.plate.paint(!0),this.pickerOpen&&this.renderPicker(),this.refresh()}refresh(){const n=this.st,e=this.s,t=this.tab;this.enBtn.on(!e.no),this.noBtn.on(e.no);const i=this.transportOn();this.playBtn.on(i),this.stopBtn.on(!i),this.guide.setState({sex:n.sex,age:n.age,season:n.season,type:n.type,comparing:this.comparing}),this.collSwitch[0].on(!this.collLog),this.collSwitch[1].on(this.collLog),t===5&&this.collection.root.style.display!==(this.collLog?"none":"flex")&&this.collection.show(!this.collLog),this.log.show(t===5&&this.collLog),this.prevBtn.disabled(this.neighbour(-1)===null),this.nextBtn.disabled(this.neighbour(1)===null);const s=this.birdEntry(n.bird);this.readout.replaceChildren(),s&&(l("span","num",this.readout,s.number),l("span","name",this.readout,this.name(s)),l("span","latin",this.readout,s.latin),this.nameEl.textContent=this.name(s)),this.sexBtns.forEach((f,m)=>f.on(n.sex===m)),this.ageBtns.forEach((f,m)=>f.on(n.age===m)),this.plate.variant=n.age===1?"juvenile":n.sex===1?"female":"male",this.plate.paint(),this.plateCap.replaceChildren(),l("b","",this.plateCap,`${e.t("fig")} 1`),this.plateCap.append(this.plate.caption());const o=e.t(`type.${hn[2][n.type]}`);this.songTitle.textContent=o.charAt(0)+ln(o.slice(1)),this.tools.style.display=n.draw?"none":"flex",this.drawTools.style.display=n.draw?"flex":"none",this.speedBtns.forEach((f,m)=>f.on(n.speed===m)),this.shiftBtn.on(n.shift);const a=this.sono.lineCount()>0;this.eraseBtn.on(this.sono.erasing).disabled(!a),this.clearBtn.disabled(!a),this.singBtn.disabled(!a),this.keepBtn.disabled(!a).on(n.kept),this.songCap.replaceChildren(),l("b","",this.songCap,`${e.t("fig")} 2`);const r=(f,m)=>ln(e.t(`${yn[f]}.${hn[f][m]}`));this.songCap.append(this.error||(n.draw?e.t("song.draw_caption"):e.t("song.caption",{bird:s?this.name(s):"",type:r(2,n.type),season:r(0,n.season),time:r(1,n.time)})));const d=[n.season,n.time,n.type,n.place];this.scene.forEach((f,m)=>f.forEach((_,w)=>_.on(d[m]===w).disabled(m===2&&!this.typeAvailable(w)))),this.apOnBtn.on(n.apOn).text(e.t(n.apOn?"ap.on":"ap.off")),this.latchBtn.on(n.latch),this.holdVal.textContent=`${A(n.hold,1,e.no)} ${e.t("unit.s")}`,this.status.replaceChildren();const u=this.host.error?`AUDIO: ${this.host.error}`:"",g=(f,m)=>{l("span","",this.status,f),l("span","summary",this.status,u||m)};if(t===3)return g(e.t("tab.quiz"),this.quiz.statusText());if(t===4)return g(e.t(this.chorus.playing?"status.playing":"status.stopped"),this.chorus.statusText());if(t===5)return g(e.t("phone.tab.collection"),this.collLog?this.log.statusText():this.collection.statusText());if(t===2)return g(this.listen.statusLeft(),this.listen.statusText());if(t===1&&s){const f=e.t(n.sex===1?"plate.female":"plate.male"),m=e.t(n.age===1?"plate.juv":"plate.adult");return g(e.t("phone.guide.status"),`${U(this.name(s))}, ${f}, ${m}`)}const p=[n.season,n.time,n.type,n.place].map((f,m)=>e.t(`${yn[m]}.${hn[m][f]}`));s&&p.unshift(U(this.name(s)));const v=this.birdEntry(this.comparing);g(e.t(n.playing?"status.playing":"status.stopped"),this.error||(v&&s?e.t("status.comparing",{a:U(this.name(s)),b:U(this.name(v))}):p.join(", ")))}frame(){const n=this.host,e=this.s,t=this.st;for(const p of this.knobs)p.poll();for(let p=0;p<12;p++){const v=n.ready?n.knobMode(p):0;v===1&&this.lastModes[p]!==v&&(this.legendKnob=p),this.lastModes[p]=v}if(this.legendKnob>=0&&this.lastModes[this.legendKnob]===0){this.legendKnob=-1;for(let p=0;p<12;p++)(this.lastModes[p]===1||this.lastModes[p]===2)&&(this.legendKnob=p)}this.sono.poll();const i=Math.min(1,Math.max(0,n.level/.35));this.plate.open+=(i-this.plate.open)*.3,this.plate.paint(),this.tab===1&&this.guide.poll(this.plate.open),this.tab===3&&this.quiz.poll(),this.tab===4&&this.chorus.poll(),this.tab===2&&this.listen.poll(),this.comparing&&(n.compare.running?this.compareSeen=!0:(this.compareSeen||performance.now()-this.compareAt>1500)&&(this.comparing="",this.refresh()));const s=this.sono.lastPhrase,o=Math.max(.01,n.phraseTempo),a=s&&s.number>0?`${A(s.lengthMs/o/1e3,1,e.no)} ${e.t("unit.s")}`:"-";this.lengthVal.textContent!==a&&(this.lengthVal.textContent=a);const r=this.legendKnob,d=r<0?e.t("ap.legend_hand_any"):e.t("ap.legend_hand",{knob:e.t(`knob.${Ln[r]}`)});this.legendText.textContent!==d&&(this.legendText.textContent=d);let u=0,g="";if(r>=0){const p=n.holdLeft(r);p>=0?(u=t.hold>0?Math.min(1,Math.max(0,p/t.hold)):0,g=`${A(p,1,e.no)} ${e.t("unit.s")}`):(u=1,g=e.t(t.latch?"ap.latched":"ap.stays"))}this.legendFill.style.width=`${Math.round(u*100)}%`,this.legendVal.textContent!==g&&(this.legendVal.textContent=g),requestAnimationFrame(()=>this.frame())}get stageZoom(){return this.zoom}}try{for(const c of["lang","log"]){const n=localStorage.getItem(`tipp.${c}`);n!==null&&localStorage.getItem(`pipp.${c}`)===null&&localStorage.setItem(`pipp.${c}`,n),localStorage.removeItem(`tipp.${c}`)}}catch{}const se=document.getElementById("app"),le=new URLSearchParams(location.search).get("layout"),pt=window.matchMedia("(max-width: 699px)"),Lr=le?le==="phone":pt.matches;le||pt.addEventListener("change",()=>location.reload());de.create().then(c=>{const n=Lr?new wr(se,c):new cr(se,c);window.pipp={app:n,host:c}}).catch(c=>{const n=document.createElement("div");n.className="error",n.textContent=`Pipp could not start: ${String(c)}`,se.appendChild(n)});
