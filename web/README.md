# web

The Pipp web app: TypeScript, Vite, and an AudioWorklet running `core/` as WebAssembly. The phone app (M9) wraps this folder.

## Run

```
cd web
npm install
npm run dev
```

`npm run dev` and `npm run build` first run `scripts/build-wasm.sh`, which compiles `core/` and `wasm/bridge.cpp` with `em++` into `public/pipp.wasm` (not checked in). The build lands in `dist/`.

## How it fits together

- `wasm/bridge.cpp`: plain C functions over `core/`. Glue only, no behaviour. Built as a standalone `.wasm` with no Emscripten JavaScript, so the same file loads in the worklet and on the main thread.
- `src/core/pipp.ts`: typed access to the module. Runs in the worklet, the browser and Node.
- `src/audio/worklet.ts`: the audio thread. Owns the `Engine`, the `Chorus`, `Compare` and `QuizVoice`, and posts state about 30 times a second (knob values and modes, the sonogram feed, the phrase).
- `src/audio/host.ts`: the main thread. Starts audio on the first Play (browsers need a gesture), sends values and events, keeps the latest state. It also has its own wasm instance for drawing data (ranges, syllable contours) and the drawn line.
- `src/ui/`: the screens. DOM for controls, canvas for the plate, knobs and sonogram. The desktop layout is a 1280x800 stage scaled to the window.
- `data/` is bundled at build time from the repo's `data/` folder, and the fonts from `standalone/Resources/fonts/`.

## Checks

- `npm run typecheck`
- `npm run check-seed`: renders every bird with sound, song and call, seeds 1, 7 and 4242, for 120 s in `pipp.wasm` under Node and with the native `pipp-render`, and compares the phrase logs bit for bit. Needs `build/Release/pipp-render`.

## Built so far (M8 round 1)

PLAY only. FIELD GUIDE, QUIZ, CHORUS, LOG and COLLECTION are hatched tabs until their screens are written. The worklet and bridge already carry everything those screens need from core.
