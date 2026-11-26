// The microphone for LYTT: level, a scrolling sonogram of the last 4 s
// (0 to 8 kHz, 80 px per second, 160 rows), and a recording of the whole
// listening session that LAGRE OPPTAK can keep. Nothing is stored until the
// screen asks for it. The microphone has its own AudioContext, apart from
// the engine's output.

export type MicState = 'idle' | 'listening' | 'denied' | 'unsupported';

export const kSonoW = 320;
export const kSonoH = 160;
const kColsPerSecond = 80;
const kMaxHz = 8000;

type Session = { type: string };
const audioSession = () => (navigator as unknown as { audioSession?: Session }).audioSession;

export class Mic {
  state: MicState = 'idle';
  level = 0;          // 0 to 1, smoothed
  startedAt = 0;      // ms, performance.now()
  stoppedAt = 0;
  // Sonogram columns, oldest first: kSonoH bytes each, row 0 at 8 kHz.
  readonly image: ImageData = new ImageData(kSonoW, kSonoH);
  private ctx: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private freq = new Uint8Array(0);
  private time = new Float32Array(0);
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private colDebt = 0;
  private lastFrame = 0;
  mime = '';

  constructor() {
    if (!navigator.mediaDevices?.getUserMedia) this.state = 'unsupported';
    this.clear();
  }

  get seconds(): number {
    if (!this.startedAt) return 0;
    return ((this.state === 'listening' ? performance.now() : this.stoppedAt) - this.startedAt) / 1000;
  }

  get canSave(): boolean { return this.chunks.length > 0; }

  private clear() {
    const d = this.image.data;
    for (let i = 0; i < d.length; i += 4) { d[i] = 0x22; d[i + 1] = 0x1c; d[i + 2] = 0x14; d[i + 3] = 0; }
  }

  async start(): Promise<void> {
    if (this.state === 'listening' || this.state === 'unsupported') return;
    // iOS: recording needs the play-and-record session.
    const session = audioSession();
    if (session) session.type = 'play-and-record';
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
    } catch (e) {
      if (session) session.type = 'playback';
      const name = (e as DOMException).name;
      this.state = name === 'NotAllowedError' || name === 'SecurityError' ? 'denied' : 'unsupported';
      return;
    }
    const ctx = new AudioContext();
    this.ctx = ctx;
    await ctx.resume();
    const src = ctx.createMediaStreamSource(this.stream);
    const an = ctx.createAnalyser();
    an.fftSize = 2048;
    an.smoothingTimeConstant = 0;
    an.minDecibels = -95;
    an.maxDecibels = -25;
    src.connect(an);
    this.analyser = an;
    this.freq = new Uint8Array(an.frequencyBinCount);
    this.time = new Float32Array(an.fftSize);

    this.chunks = [];
    this.mime = '';
    if (typeof MediaRecorder !== 'undefined') {
      const types = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm'];
      const type = types.find((t) => MediaRecorder.isTypeSupported(t)) ?? '';
      try {
        const rec = new MediaRecorder(this.stream, type ? { mimeType: type } : undefined);
        rec.ondataavailable = (e) => { if (e.data.size > 0) this.chunks.push(e.data); };
        rec.start(500);
        this.recorder = rec;
        this.mime = rec.mimeType || type;
      } catch { this.recorder = null; }
    }
    this.clear();
    this.startedAt = performance.now();
    this.lastFrame = this.startedAt;
    this.state = 'listening';
  }

  async stop(): Promise<void> {
    if (this.state !== 'listening') return;
    this.stoppedAt = performance.now();
    this.state = 'idle';
    const rec = this.recorder;
    this.recorder = null;
    if (rec && rec.state !== 'inactive') {
      await new Promise<void>((resolve) => { rec.onstop = () => resolve(); rec.stop(); });
    }
    for (const t of this.stream?.getTracks() ?? []) t.stop();
    this.stream = null;
    await this.ctx?.close();
    this.ctx = null;
    this.analyser = null;
    this.level = 0;
    const session = audioSession();
    if (session) session.type = 'playback';
  }

  // The session so far as one file. Chunks from the start form a valid file.
  async recording(): Promise<Blob | null> {
    if (this.recorder && this.recorder.state === 'recording') {
      await new Promise<void>((resolve) => {
        const r = this.recorder!;
        const done = () => { r.removeEventListener('dataavailable', done); resolve(); };
        r.addEventListener('dataavailable', done);
        r.requestData();
      });
    }
    return this.chunks.length ? new Blob(this.chunks, { type: this.mime || 'audio/mp4' }) : null;
  }

  // The last fftSize samples, for recognise().
  window(): { samples: Float32Array; sampleRate: number } {
    if (this.analyser) this.analyser.getFloatTimeDomainData(this.time);
    return { samples: this.time.slice(), sampleRate: this.ctx?.sampleRate ?? 48000 };
  }

  // Once per animation frame: level and new sonogram columns.
  poll() {
    const an = this.analyser;
    if (!an || this.state !== 'listening' || !this.ctx) return;
    const now = performance.now();
    this.colDebt += ((now - this.lastFrame) / 1000) * kColsPerSecond;
    this.lastFrame = now;

    an.getFloatTimeDomainData(this.time);
    let sum = 0;
    for (const v of this.time) sum += v * v;
    const rms = Math.sqrt(sum / this.time.length);
    const db = rms > 1e-6 ? 20 * Math.log10(rms) : -100;
    const target = Math.min(1, Math.max(0, (db + 60) / 60));
    this.level = Math.max(target, this.level * 0.9);

    const cols = Math.floor(this.colDebt);
    if (cols <= 0) return;
    this.colDebt -= cols;
    an.getByteFrequencyData(this.freq);
    const binHz = this.ctx.sampleRate / an.fftSize;
    const d = this.image.data, W = kSonoW, H = kSonoH;
    const n = Math.min(cols, W);
    // Scroll left by n columns.
    for (let y = 0; y < H; y++) {
      const row = y * W * 4;
      d.copyWithin(row, row + n * 4, row + W * 4);
    }
    // The new columns all show this spectrum.
    for (let y = 0; y < H; y++) {
      const hz0 = ((H - 1 - y) / H) * kMaxHz, hz1 = ((H - y) / H) * kMaxHz;
      let v = 0;
      for (let b = Math.floor(hz0 / binHz); b <= Math.ceil(hz1 / binHz) && b < this.freq.length; b++) v = Math.max(v, this.freq[b]);
      // Quiet bins stay clear; louder ones darken towards ink.
      const a = Math.max(0, Math.min(255, (v - 110) * 2.2));
      for (let x = W - n; x < W; x++) d[(y * W + x) * 4 + 3] = a;
    }
  }
}
