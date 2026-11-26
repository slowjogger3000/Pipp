// The AudioWorklet host: runs tipp.wasm's Engine and Chorus on the audio
// thread, ticks COMPARE and the quiz voice, and posts state to the main
// thread about 30 times a second. No allocation in process() once ready,
// apart from the state message itself.

import { Tipp, kNumKnobs, kLanes, kChorusColumns, type Ptr } from '../core/tipp.ts';
import type { ToWorklet, FromWorklet, WorkletState } from './protocol.ts';

declare const sampleRate: number;
declare const currentTime: number;
declare class AudioWorkletProcessor {
  readonly port: MessagePort;
}
declare function registerProcessor(name: string, ctor: unknown): void;

const kPostEvery = 1 / 30; // s
const kMaxSonoPost = 512;  // frames per message, more than 1/30 s holds

class TippProcessor extends AudioWorkletProcessor {
  private tipp: Tipp | null = null;
  private engine: Ptr = 0;
  private chorus: Ptr = 0;
  private compare: Ptr = 0;
  private qvoice: Ptr = 0;
  private line: Ptr = 0;
  private birds = new Map<string, Ptr>();
  private ids = new Map<Ptr, string>();
  private left: Ptr = 0;
  private right: Ptr = 0;
  private knobBuf: Ptr = 0;
  private statusBuf: Ptr = 0;
  private sonoBuf: Ptr = 0;
  private chorusBuf: Ptr = 0;
  private sangBuf: Ptr = 0;
  private sonoSent = 0;
  private lastPost = 0;
  private posts = 0;
  private queue: ToWorklet[] = [];

  constructor() {
    super();
    this.port.onmessage = (e: MessageEvent<ToWorklet>) => {
      if (e.data.t === 'init') void this.init(e.data.wasm, e.data.birds);
      else if (this.tipp) this.handle(e.data);
      else this.queue.push(e.data);
    };
  }

  private post(m: FromWorklet, transfer: Transferable[] = []) { this.port.postMessage(m, transfer); }

  private async init(wasm: ArrayBuffer, birds: { id: string; voice: string; songs: string }[]) {
    try {
      const t = await Tipp.load(wasm);
      const x = t.x;
      for (const b of birds) {
        const p = t.parseBird(b.id, b.voice, b.songs);
        this.birds.set(b.id, p);
        this.ids.set(p, b.id);
      }
      this.engine = x.tipp_engine_new();
      x.tipp_engine_prepare(this.engine, sampleRate);
      this.chorus = x.tipp_chorus_new();
      x.tipp_chorus_prepare(this.chorus, sampleRate);
      this.compare = x.tipp_compare_new();
      this.qvoice = x.tipp_qvoice_new();
      this.line = x.tipp_line_new();
      this.left = t.alloc(128 * 4);
      this.right = t.alloc(128 * 4);
      this.knobBuf = t.alloc(kNumKnobs * 4 * 4);
      this.statusBuf = t.alloc(10 * 4);
      this.sonoBuf = t.alloc(kMaxSonoPost * 3 * 4);
      this.chorusBuf = t.alloc((3 + 5 * kLanes) * 4);
      this.sangBuf = t.alloc(kLanes * kChorusColumns);
      this.tipp = t;
      for (const m of this.queue) this.handle(m);
      this.queue = [];
      this.post({ t: 'ready', sampleRate });
    } catch (err) {
      this.post({ t: 'error', message: String(err) });
    }
  }

  private handle(m: ToWorklet) {
    const t = this.tipp!, x = t.x, e = this.engine;
    switch (m.t) {
      case 'init': break;
      case 'param': x.tipp_engine_set_param(e, t.index(m.id), m.v); break;
      case 'hand': (m.down ? x.tipp_engine_hand_down : x.tipp_engine_hand_up)(e, m.k); break;
      case 'trigger': x.tipp_engine_trigger(e, t.index(m.id)); break;
      case 'seed': x.tipp_engine_set_seed(e, m.seed >>> 0); break;
      case 'bird': x.tipp_engine_set_bird(e, this.birds.get(m.id) ?? 0); break;
      case 'drawn': {
        const n = m.pts.length / 3;
        const p = t.buf(Math.max(1, m.pts.length) * 4);
        t.f32(p, m.pts.length).set(m.pts);
        x.tipp_line_set(this.line, p, n);
        x.tipp_engine_set_drawn(e, this.line);
        break;
      }
      case 'keep': x.tipp_engine_keep_drawn(e, m.on ? 1 : 0); break;
      case 'compare':
        x.tipp_compare_start(this.compare, e, this.birds.get(m.first) ?? 0, this.birds.get(m.second) ?? 0,
          m.restore.autoplay ? 1 : 0, m.restore.play ? 1 : 0, m.restore.type, currentTime, m.type);
        break;
      case 'compareCancel': x.tipp_compare_cancel(this.compare, e); break;
      case 'qvoice':
        if (m.op === 'start') x.tipp_qvoice_start(this.qvoice, e, this.birds.get(m.bird) ?? 0, m.type, m.half ? 1 : 0);
        else if (m.op === 'again') x.tipp_qvoice_again(this.qvoice, e);
        else if (m.op === 'half') x.tipp_qvoice_half(this.qvoice, e, m.half ? 1 : 0);
        else x.tipp_qvoice_stop(this.qvoice);
        break;
      case 'chorus': {
        const c = this.chorus;
        switch (m.op) {
          case 'lane':
            x.tipp_chorus_set_lane_bird(c, m.lane, this.birds.get(m.bird) ?? 0);
            x.tipp_chorus_set_entry(c, m.lane, m.entry);
            x.tipp_chorus_set_distance(c, m.lane, m.distance);
            break;
          case 'mute': x.tipp_chorus_set_mute(c, m.lane, m.on ? 1 : 0); break;
          case 'solo': x.tipp_chorus_set_solo(c, m.lane, m.on ? 1 : 0); break;
          case 'hold': x.tipp_chorus_hold_knob(c, m.lane, m.k, m.v); break;
          case 'release': x.tipp_chorus_release_knob(c, m.lane, m.k); break;
          case 'season': x.tipp_chorus_set_season(c, m.v); break;
          case 'place': x.tipp_chorus_set_place(c, m.v); break;
          case 'speed': x.tipp_chorus_set_speed(c, m.v); break;
          case 'seed': x.tipp_chorus_set_seed(c, m.v >>> 0); break;
          case 'play': x.tipp_chorus_set_playing(c, m.on ? 1 : 0); break;
          case 'seek': x.tipp_chorus_seek(c, m.minute); break;
        }
        break;
      }
    }
  }

  process(_in: Float32Array[][], outputs: Float32Array[][]): boolean {
    const out = outputs[0];
    const t = this.tipp;
    if (!t || !out || out.length === 0) return true;
    const x = t.x;
    const n = Math.min(128, out[0].length);
    x.tipp_engine_process(this.engine, this.left, this.right, n);
    x.tipp_chorus_process_add(this.chorus, this.left, this.right, n);
    out[0].set(t.f32(this.left, n));
    if (out.length > 1) out[1].set(t.f32(this.right, n));

    if (currentTime - this.lastPost >= kPostEvery) {
      this.lastPost = currentTime;
      if (x.tipp_compare_running(this.compare)) x.tipp_compare_tick(this.compare, this.engine, currentTime);
      x.tipp_qvoice_tick(this.qvoice, this.engine);
      this.postState();
    }
    return true;
  }

  private postState() {
    const t = this.tipp!, x = t.x, e = this.engine;
    x.tipp_engine_knobs(e, this.knobBuf);
    x.tipp_engine_status(e, this.statusBuf);
    x.tipp_chorus_status(this.chorus, this.chorusBuf);

    const written = x.tipp_engine_sono_written(e) >>> 0;
    let from = this.sonoSent;
    if (written - from > kMaxSonoPost) from = written - kMaxSonoPost;
    const count = written - from;
    if (count > 0) x.tipp_engine_sono_read(e, from, count, this.sonoBuf);
    this.sonoSent = written;

    let sang: Uint8Array | null = null;
    if (this.posts++ % 8 === 0) {
      x.tipp_chorus_sang(this.chorus, this.sangBuf);
      sang = t.u8(this.sangBuf, kLanes * kChorusColumns).slice();
    }

    const knobs = t.f32(this.knobBuf, kNumKnobs * 4).slice();
    const status = t.f32(this.statusBuf, 10).slice();
    const sono = t.f32(this.sonoBuf, count * 3).slice();
    const chorus = t.f32(this.chorusBuf, 3 + 5 * kLanes).slice();
    const state: WorkletState = {
      t: 'state',
      knobs, status, sono, chorus,
      seed: x.tipp_engine_seed(e) >>> 0,
      birdInUse: this.ids.get(x.tipp_engine_bird_in_use(e)) ?? '',
      phrase: t.phrase(e) ?? t.phrase(e),
      sonoRate: x.tipp_engine_sono_rate(e),
      sonoFrom: from,
      compare: { running: x.tipp_compare_running(this.compare) !== 0, stage: x.tipp_compare_stage(this.compare) },
      qvoice: {
        started: x.tipp_qvoice_started(this.qvoice) !== 0,
        startFrame: x.tipp_qvoice_start_frame(this.qvoice) >>> 0,
        sung: x.tipp_qvoice_sung(this.qvoice) >>> 0,
      },
      chorusSang: sang,
    };
    const transfer: Transferable[] = [knobs.buffer, status.buffer, sono.buffer, chorus.buffer];
    if (sang) transfer.push(sang.buffer);
    this.post(state, transfer);
  }
}

registerProcessor('tipp', TippProcessor);
