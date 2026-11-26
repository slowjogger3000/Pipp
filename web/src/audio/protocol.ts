// Messages between the main thread and the AudioWorklet. The worklet owns
// the engine, the chorus, COMPARE and the quiz voice; the main thread sends
// values and events, and draws what the worklet publishes about 30 times a
// second. Same split as the standalone: behaviour stays in core.

export interface BirdText {
  id: string;
  voice: string;
  songs: string;
}

export type ToWorklet =
  | { t: 'init'; wasm: ArrayBuffer; birds: BirdText[] }
  | { t: 'param'; id: string; v: number }
  | { t: 'hand'; k: number; down: boolean }
  | { t: 'trigger'; id: string }
  | { t: 'seed'; seed: number }
  | { t: 'bird'; id: string }
  | { t: 'drawn'; pts: Float32Array } // 3 floats per point: t ms, Hz, joinPrev
  | { t: 'keep'; on: boolean }
  | { t: 'compare'; first: string; second: string; restore: { autoplay: boolean; play: boolean; type: number }; type: number }
  | { t: 'compareCancel' }
  | { t: 'qvoice'; op: 'start'; bird: string; type: number; half: boolean }
  | { t: 'qvoice'; op: 'again' | 'stop' }
  | { t: 'qvoice'; op: 'half'; half: boolean }
  | { t: 'chorus'; op: 'lane'; lane: number; bird: string; entry: number; distance: number }
  | { t: 'chorus'; op: 'mute' | 'solo'; lane: number; on: boolean }
  | { t: 'chorus'; op: 'hold'; lane: number; k: number; v: number }
  | { t: 'chorus'; op: 'release'; lane: number; k: number }
  | { t: 'chorus'; op: 'season' | 'place' | 'speed' | 'seed'; v: number }
  | { t: 'chorus'; op: 'play'; on: boolean }
  | { t: 'chorus'; op: 'seek'; minute: number };

export interface WorkletState {
  t: 'state';
  knobs: Float32Array;  // 4 per knob: value, mode, hold left, overridden
  status: Float32Array; // see tipp_engine_status
  seed: number;
  birdInUse: string;
  phrase: import('../core/tipp.ts').PhraseView | null;
  sonoRate: number;
  sonoFrom: number;      // index of the first frame in sono
  sono: Float32Array;    // 3 per frame: Hz, amp, hand mask
  compare: { running: boolean; stage: number };
  qvoice: { started: boolean; startFrame: number; sung: number };
  chorus: Float32Array;  // see tipp_chorus_status
  chorusSang: Uint8Array | null; // 4 x 960, about 4 times a second
}

export type FromWorklet = { t: 'ready'; sampleRate: number } | { t: 'error'; message: string } | WorkletState;
