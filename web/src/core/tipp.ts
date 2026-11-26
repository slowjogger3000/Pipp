// Typed access to tipp.wasm (core/ plus web/wasm/bridge.cpp). Used in the
// AudioWorklet, on the main thread and by the Node check scripts, so it
// uses only erasable TypeScript and no DOM or Node API.
//
// Memory may grow, which detaches old views, so every read makes a fresh
// view over memory.buffer.

export type Ptr = number;

type Exports = Record<string, (...args: number[]) => number> & {
  memory: WebAssembly.Memory;
  _initialize?: () => void;
};

export const kNumKnobs = 12;
export const kSongTypes = ['song', 'call', 'alarm', 'flight'] as const;
export const kSonoFrameFloats = 3;
export const kLanes = 4;
export const kChorusColumns = 960;

export const KnobMode = { Auto: 0, Held: 1, Hold: 2, Return: 3 } as const;
export const ParamKind = { Knob: 0, Choice: 1, Toggle: 2, Integer: 3, Text: 4, Trigger: 5 } as const;

export interface ParamInfo {
  index: number;
  id: string;
  kind: number;
  min: number;
  max: number;
  def: number;
  unit: string;
  options: string[];
}

export interface PhraseNote {
  syl: number;
  startMs: number;
  durMs: number;
  pitchMul: number;
  part: number;
}

export interface PhraseView {
  number: number;
  lengthMs: number;
  drawn: boolean;
  drawnStartMs: number;
  notes: PhraseNote[];
}

// The AudioWorklet scope has no TextEncoder or TextDecoder in every
// browser, so these are done by hand.
export function utf8Encode(s: string): Uint8Array {
  const out: number[] = [];
  for (const ch of s) {
    let c = ch.codePointAt(0)!;
    if (c < 0x80) out.push(c);
    else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
    else if (c < 0x10000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    else { out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63)); }
  }
  return new Uint8Array(out);
}

export function utf8Decode(b: Uint8Array): string {
  let s = '';
  for (let i = 0; i < b.length;) {
    const c = b[i++];
    if (c < 0x80) s += String.fromCharCode(c);
    else if (c < 0xe0) s += String.fromCharCode(((c & 31) << 6) | (b[i++] & 63));
    else if (c < 0xf0) s += String.fromCharCode(((c & 15) << 12) | ((b[i++] & 63) << 6) | (b[i++] & 63));
    else s += String.fromCodePoint(((c & 7) << 18) | ((b[i++] & 63) << 12) | ((b[i++] & 63) << 6) | (b[i++] & 63));
  }
  return s;
}

export class Tipp {
  readonly x: Exports;
  readonly params: ParamInfo[] = [];
  private readonly byId = new Map<string, number>();
  private scratch: Ptr = 0;
  private scratchBytes = 0;

  static async load(bytes: ArrayBuffer | Uint8Array): Promise<Tipp> {
    const imports = {
      env: { emscripten_notify_memory_growth: () => {} },
      wasi_snapshot_preview1: {
        fd_close: () => 0,
        fd_seek: () => 70, // ESPIPE
        // Writes nothing; reports everything written so stdio never loops.
        fd_write: (_fd: number, iov: number, iovcnt: number, nwritten: number) => {
          const mem = new DataView(t.x.memory.buffer);
          let n = 0;
          for (let i = 0; i < iovcnt; i++) n += mem.getUint32(iov + 8 * i + 4, true);
          mem.setUint32(nwritten, n, true);
          return 0;
        },
      },
    };
    const { instance } = (await WebAssembly.instantiate(bytes as BufferSource, imports)) as unknown as WebAssembly.WebAssemblyInstantiatedSource;
    const t: Tipp = new Tipp(instance.exports as unknown as Exports);
    return t;
  }

  private constructor(x: Exports) {
    this.x = x;
    x._initialize?.();
    const n = x.tipp_param_count();
    for (let i = 0; i < n; i++) {
      const opts = this.str(x.tipp_param_options(i));
      const p: ParamInfo = {
        index: i,
        id: this.str(x.tipp_param_id(i)),
        kind: x.tipp_param_kind(i),
        min: x.tipp_param_min(i),
        max: x.tipp_param_max(i),
        def: x.tipp_param_def(i),
        unit: this.str(x.tipp_param_unit(i)),
        options: opts ? opts.split('|') : [],
      };
      this.params.push(p);
      this.byId.set(p.id, i);
    }
  }

  // ------------------------------------------------------------ memory

  f32(ptr: Ptr, n: number): Float32Array { return new Float32Array(this.x.memory.buffer, ptr, n); }
  i32(ptr: Ptr, n: number): Int32Array { return new Int32Array(this.x.memory.buffer, ptr, n); }
  u8(ptr: Ptr, n: number): Uint8Array { return new Uint8Array(this.x.memory.buffer, ptr, n); }

  str(ptr: Ptr): string {
    if (!ptr) return '';
    const mem = new Uint8Array(this.x.memory.buffer);
    let end = ptr;
    while (mem[end] !== 0) end++;
    return utf8Decode(mem.subarray(ptr, end));
  }

  alloc(bytes: number): Ptr { return this.x.tipp_alloc(bytes); }
  free(ptr: Ptr): void { this.x.tipp_free(ptr); }

  // A reusable buffer for results. Valid until the next call that uses it.
  buf(bytes: number): Ptr {
    if (bytes > this.scratchBytes) {
      if (this.scratch) this.free(this.scratch);
      this.scratchBytes = Math.max(bytes, 4096);
      this.scratch = this.alloc(this.scratchBytes);
    }
    return this.scratch;
  }

  // A NUL-terminated copy. Free it after use.
  cstr(s: string): Ptr {
    const b = utf8Encode(s);
    const p = this.alloc(b.length + 1);
    const mem = new Uint8Array(this.x.memory.buffer, p, b.length + 1);
    mem.set(b);
    mem[b.length] = 0;
    return p;
  }

  // ------------------------------------------------------------ params

  index(id: string): number {
    const i = this.byId.get(id);
    if (i === undefined) throw new Error(`unknown parameter ${id}`);
    return i;
  }

  // ------------------------------------------------------------ birds

  parseBird(id: string, voiceJson: string, songsJson: string): Ptr {
    const a = this.cstr(id), v = this.cstr(voiceJson), s = this.cstr(songsJson);
    const b = this.x.tipp_bird_parse(a, v, s);
    this.free(a); this.free(v); this.free(s);
    if (!b) throw new Error(`${id}: ${this.str(this.x.tipp_last_error())}`);
    return b;
  }

  // ------------------------------------------------------------ engine

  // The phrase being sung, or null if it changed during the copy.
  phrase(engine: Ptr): PhraseView | null {
    const max = this.x.tipp_engine_max_notes();
    const p = this.buf((5 + 5 * max) * 4);
    if (!this.x.tipp_engine_phrase(engine, p)) return null;
    const h = this.f32(p, 5);
    const count = h[1];
    const v = this.f32(p + 20, 5 * count);
    const notes: PhraseNote[] = [];
    for (let i = 0; i < count; i++)
      notes.push({ syl: v[5 * i], startMs: v[5 * i + 1], durMs: v[5 * i + 2], pitchMul: v[5 * i + 3], part: v[5 * i + 4] });
    return { number: h[0], lengthMs: h[2], drawn: h[3] !== 0, drawnStartMs: h[4], notes };
  }
}
