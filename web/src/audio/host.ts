// Main-thread side of the audio: starts the AudioContext and the worklet,
// sends values and events, and keeps the latest state the worklet posted.
// Also holds a second tipp.wasm instance on this thread for bird data the
// interface draws with (ranges, contours) and for the drawn line.

import workletUrl from './worklet.ts?worker&url';
import { Tipp, kNumKnobs, type Ptr, type PhraseView } from '../core/tipp.ts';
import type { ToWorklet, FromWorklet, WorkletState } from './protocol.ts';
import { index, birdFile, hasSound } from '../data.ts';

export const kSonoFrames = 4096; // as Engine::kSonoFrames

export interface SonoFrame {
  hz: number;
  amp: number;
  mask: number;
}

export class AudioHost {
  readonly tipp: Tipp;
  readonly birds = new Map<string, Ptr>(); // parsed on this thread
  private ctx: AudioContext | null = null;
  private node: AudioWorkletNode | null = null;
  private pending: ToWorklet[] = [];
  private wasm: ArrayBuffer;

  // Latest state from the worklet.
  ready = false;
  error = '';
  sampleRate = 48000;
  knobs: Float32Array = new Float32Array(kNumKnobs * 4);
  status: Float32Array = new Float32Array(10);
  seed = 1;
  birdInUse = '';
  phrase: PhraseView | null = null;
  sonoRate = 375;
  sonoWritten = 0;
  private sonoHz = new Float32Array(kSonoFrames);
  private sonoAmp = new Float32Array(kSonoFrames);
  private sonoMask = new Uint16Array(kSonoFrames);
  compare = { running: false, stage: 0 };
  qvoice = { started: false, startFrame: 0, sung: 0 };
  chorus: Float32Array = new Float32Array(23);
  chorusSang: Uint8Array = new Uint8Array(4 * 960);
  peakL = 0;
  peakR = 0;
  onState: ((s: WorkletState) => void) | null = null;

  static async create(): Promise<AudioHost> {
    const res = await fetch(`${import.meta.env.BASE_URL}tipp.wasm`);
    if (!res.ok) throw new Error(`tipp.wasm: ${res.status}`);
    const bytes = await res.arrayBuffer();
    const tipp = await Tipp.load(bytes);
    return new AudioHost(tipp, bytes);
  }

  private constructor(tipp: Tipp, wasm: ArrayBuffer) {
    this.tipp = tipp;
    this.wasm = wasm;
    for (const b of index.birds) {
      if (!hasSound(b.id)) continue;
      this.birds.set(b.id, tipp.parseBird(b.id, birdFile(b.id, 'voice')!, birdFile(b.id, 'songs')!));
    }
  }

  get running(): boolean { return this.ctx?.state === 'running'; }

  // Builds the audio graph. Call from a user gesture the first time, as
  // Safari and Chrome only start audio after one.
  async start(): Promise<void> {
    if (this.ctx) {
      if (this.ctx.state !== 'running') await this.ctx.resume();
      return;
    }
    const ctx = new AudioContext({ latencyHint: 'interactive' });
    this.ctx = ctx;
    const resumed = ctx.resume(); // inside the gesture, before any await
    await ctx.audioWorklet.addModule(workletUrl);
    const node = new AudioWorkletNode(ctx, 'tipp', { numberOfInputs: 0, numberOfOutputs: 1, outputChannelCount: [2] });
    node.port.onmessage = (e: MessageEvent<FromWorklet>) => this.receive(e.data);
    node.connect(ctx.destination);
    this.node = node;
    const birds = [...this.birds.keys()].map((id) => ({ id, voice: birdFile(id, 'voice')!, songs: birdFile(id, 'songs')! }));
    node.port.postMessage({ t: 'init', wasm: this.wasm.slice(0), birds } satisfies ToWorklet);
    for (const m of this.pending) this.post(m);
    this.pending = [];
    await resumed;
  }

  post(m: ToWorklet): void {
    if (!this.node) {
      this.pending.push(m);
      return;
    }
    if (m.t === 'drawn') this.node.port.postMessage(m, [m.pts.buffer]);
    else this.node.port.postMessage(m);
  }

  param(id: string, v: number) { this.post({ t: 'param', id, v }); }
  trigger(id: string) { this.post({ t: 'trigger', id }); }

  private receive(m: FromWorklet) {
    if (m.t === 'ready') {
      this.ready = true;
      this.sampleRate = m.sampleRate;
      return;
    }
    if (m.t === 'error') {
      this.error = m.message;
      return;
    }
    this.knobs = m.knobs;
    this.status = m.status;
    this.seed = m.seed;
    this.birdInUse = m.birdInUse;
    if (m.phrase) this.phrase = m.phrase;
    this.sonoRate = m.sonoRate;
    const n = m.sono.length / 3;
    for (let i = 0; i < n; i++) {
      const j = (m.sonoFrom + i) & (kSonoFrames - 1);
      this.sonoHz[j] = m.sono[3 * i];
      this.sonoAmp[j] = m.sono[3 * i + 1];
      this.sonoMask[j] = m.sono[3 * i + 2];
    }
    this.sonoWritten = m.sonoFrom + n;
    this.compare = m.compare;
    this.qvoice = m.qvoice;
    this.chorus = m.chorus;
    if (m.chorusSang) this.chorusSang = m.chorusSang;
    this.peakL = Math.max(this.peakL, m.status[1]);
    this.peakR = Math.max(this.peakR, m.status[2]);
    this.onState?.(m);
  }

  // Engine::sonoFrame. Valid from sonoWritten - kSonoFrames + 64.
  sonoFrame(i: number): SonoFrame {
    const j = i & (kSonoFrames - 1);
    return { hz: this.sonoHz[j], amp: this.sonoAmp[j], mask: this.sonoMask[j] };
  }

  knobValue(k: number): number { return this.knobs[4 * k]; }
  knobMode(k: number): number { return this.knobs[4 * k + 1]; }
  holdLeft(k: number): number { return this.knobs[4 * k + 2]; }
  knobOverridden(k: number): boolean { return this.knobs[4 * k + 3] !== 0; }
  get level(): number { return this.status[0]; }
  get singing(): boolean { return this.status[3] !== 0; }
  get phrasePosMs(): number { return this.status[4]; }
  get phraseTempo(): number { return this.status[5]; }
  get phrasesStarted(): number { return this.status[7]; }

  takePeaks(): [number, number] {
    const p: [number, number] = [this.peakL, this.peakR];
    this.peakL = this.peakR = 0;
    return p;
  }
}
