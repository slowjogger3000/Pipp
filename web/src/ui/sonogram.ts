// The live sonogram well, 680x320 on the desktop: 40px per kHz from 0 to
// 8 kHz, 80px per second. The phone uses 320x160, 20px per kHz. The playhead is fixed and the song scrolls under it. Ink is the
// engine's sonogram feed; grey is the rest of the phrase the engine
// published, drawn with the engine's own contour maths. Same drawing as
// standalone/Source/UI/Sonogram.h, including draw mode.

import type { AudioHost, SonoFrame } from '../audio/host.ts';
import { kSonoFrames } from '../audio/host.ts';
import type { PhraseView } from '../core/pipp.ts';
import { Canvas, colour, font, graphPaper } from './dom.ts';

export const kPxPerSecond = 80;
const kPxPerMs = kPxPerSecond / 1000;
const kStrokeTolPx = 2.5;
const kEraseRadiusPx = 7;
const kDrawMinHz = 250, kDrawMaxHz = 8000, kDotMs = 90;
const kGate = 0.03;

export class Sonogram {
  readonly cv: Canvas;
  bird = 0;
  nowText = 'NOW';
  yourPhraseText = 'YOUR PHRASE STARTS';
  handLabel: (k: number) => string = () => '';
  flagText: (hz: number, s: number) => string = () => '';
  onLineChanged: () => void = () => {};

  // Draw mode. The line lives in the main thread's wasm instance.
  readonly line: number;
  erasing = false;
  private drawMode = false;
  private frozen: SonoFrame[] = [];
  private frozenRate = 0;
  private frozenReady = false;
  private hover = false;
  private pointer = { x: 0, y: 0 };
  private stroke: number[] = []; // 3 floats per point
  private phrase: PhraseView | null = null;
  private startNumber = 0;
  private phraseStartFrame = 0;
  private readonly at: number; // 2 floats scratch in wasm memory

  // Size of the well and where the playhead sits, in css px.
  readonly W: number;
  readonly H: number;
  readonly px: number;
  private readonly phz: number;

  constructor(parent: HTMLElement, private host: AudioHost, geo = { w: 680, h: 320, pxPerKHz: 40, playheadX: 456 }) {
    this.W = geo.w;
    this.H = geo.h;
    this.px = geo.playheadX;
    this.phz = geo.pxPerKHz / 1000;
    this.cv = new Canvas(parent, this.W, this.H);
    this.line = host.pipp.x.pipp_line_new();
    this.at = host.pipp.alloc(8);
    const c = this.cv.c;
    c.style.touchAction = 'none';
    const pos = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      return { x: ((e.clientX - r.left) / r.width) * this.W, y: ((e.clientY - r.top) / r.height) * this.H };
    };
    c.addEventListener('pointerdown', (e) => {
      if (!this.drawMode) return;
      c.setPointerCapture(e.pointerId);
      this.pointer = pos(e);
      this.hover = true;
      this.stroke = [];
      if (this.erasing) this.eraseAt(this.pointer);
      else this.stroke.push(...this.pointFor(this.pointer));
    });
    c.addEventListener('pointermove', (e) => {
      if (!this.drawMode) return;
      this.pointer = pos(e);
      this.hover = true;
      if (e.buttons === 0) return;
      if (this.erasing) this.eraseAt(this.pointer);
      else if (this.stroke.length) {
        // Time only moves forward: a stroke is a pitch line.
        const p = this.pointFor(this.pointer);
        if (p[0] >= this.stroke[this.stroke.length - 3] + 1) this.stroke.push(...p);
      }
    });
    c.addEventListener('pointerup', () => {
      if (!this.drawMode || this.erasing || !this.stroke.length) return;
      const t = this.host.pipp;
      const n = this.stroke.length / 3;
      const p = t.buf(this.stroke.length * 4);
      t.f32(p, this.stroke.length).set(this.stroke);
      t.x.pipp_line_add_stroke(this.line, p, n, kPxPerMs, this.phz, kStrokeTolPx);
      this.stroke = [];
      this.onLineChanged();
    });
    c.addEventListener('pointerleave', () => { this.hover = false; });
  }

  private y(hz: number): number { return this.H - hz * this.phz; }

  get lastPhrase(): PhraseView | null { return this.phrase; }
  get frozenNow(): boolean { return this.frozenReady; }

  setDrawMode(on: boolean) {
    this.drawMode = on;
    this.frozen = [];
    this.frozenReady = false;
    this.hover = false;
    this.stroke = [];
    this.cv.c.style.cursor = on ? 'crosshair' : 'default';
  }

  // The line's points, 3 floats each, to send to the worklet.
  linePoints(): Float32Array {
    const t = this.host.pipp, n = t.x.pipp_line_count(this.line);
    const p = t.buf(Math.max(1, n) * 12);
    t.x.pipp_line_points(this.line, p);
    return t.f32(p, n * 3).slice();
  }
  lineCount(): number { return this.host.pipp.x.pipp_line_count(this.line); }
  clearLine() { this.host.pipp.x.pipp_line_clear(this.line); this.onLineChanged(); }

  addStroke(raw: [number, number][]) {
    const flat = raw.flatMap(([t, hz]) => [t, hz, 0]);
    const tp = this.host.pipp, p = tp.buf(flat.length * 4);
    tp.f32(p, flat.length).set(flat);
    tp.x.pipp_line_add_stroke(this.line, p, raw.length, kPxPerMs, this.phz, kStrokeTolPx);
    this.onLineChanged();
  }
  hoverAt(x: number, y: number) { this.hover = true; this.pointer = { x, y }; }

  private pointFor(p: { x: number; y: number }): [number, number, number] {
    return [Math.max(0, p.x) / kPxPerMs, Math.min(kDrawMaxHz, Math.max(kDrawMinHz, (this.H - p.y) / this.phz)), 0];
  }

  private eraseAt(p: { x: number; y: number }) {
    const [t, hz] = this.pointFor(p);
    if (this.host.pipp.x.pipp_line_erase(this.line, t, hz, kPxPerMs, this.phz, kEraseRadiusPx)) this.onLineChanged();
  }

  private drawnAt(t: number): [number, number] {
    const tp = this.host.pipp;
    tp.x.pipp_line_at(this.line, t, this.at);
    const v = tp.f32(this.at, 2);
    return [v[0], v[1]];
  }

  // Once per frame.
  poll() {
    const h = this.host;
    if (h.phrase) this.phrase = h.phrase;
    const number = this.phrase?.number ?? 0;
    if (number !== this.startNumber) {
      // About one state message after it began.
      this.startNumber = number;
      const back = Math.floor(h.sonoRate / 30);
      this.phraseStartFrame = h.sonoWritten > back ? h.sonoWritten - back : 0;
    }
    if (this.drawMode && !this.frozenReady && !(h.singing && !this.phrase?.drawn)) this.freeze();
    this.paint();
  }

  // Copies the last phrase out of the feed, from a little before it began.
  private freeze() {
    const h = this.host;
    this.frozen = [];
    this.frozenRate = h.sonoRate;
    const written = h.sonoWritten;
    const avail = Math.min(written, kSonoFrames - 64);
    const oldest = written - avail;
    const lead = Math.floor(0.35 * this.frozenRate);
    if (this.startNumber > 0 && this.phraseStartFrame >= oldest + lead) {
      const span = Math.floor((this.W / kPxPerSecond) * this.frozenRate);
      const from = this.phraseStartFrame - lead;
      for (let i = from; i < written && i - from < span; i++) this.frozen.push(h.sonoFrame(i));
    }
    this.frozenReady = true;
  }

  private paint() {
    const g = this.cv.begin();
    graphPaper(g, this.W, this.H);
    g.fillStyle = colour.shadow;
    g.fillRect(0, 0, this.W, 1);
    g.fillRect(0, 0, 1, this.H);
    g.lineCap = 'round';

    if (this.drawMode && this.frozenReady) {
      this.paintFrozen(g);
      this.paintLine(g);
      this.paintCursor(g);
      return;
    }
    this.paintSung(g);
    this.paintNext(g);

    g.fillStyle = colour.plum;
    g.fillRect(this.px, 0, 1, this.H);
    g.fillRect(this.px + 1, 0, 26, 12);
    g.fillStyle = colour.paper;
    g.font = font(8, 600);
    g.letterSpacing = '0.5px';
    g.textBaseline = 'middle';
    g.textAlign = 'left';
    g.fillText(this.nowText, this.px + 5, 6.5);
    g.letterSpacing = '0px';
  }

  private seg(g: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, w: number) {
    g.lineWidth = w;
    g.beginPath();
    g.moveTo(x0, y0);
    g.lineTo(x1, y1);
    g.stroke();
  }

  private joins(a: SonoFrame, b: SonoFrame): boolean {
    return a.amp > kGate && b.amp > kGate && a.hz > 0 && b.hz > 0 && Math.abs(Math.log2(a.hz / b.hz)) < 0.35;
  }

  private paintFrozen(g: CanvasRenderingContext2D) {
    if (this.frozen.length < 2 || this.frozenRate <= 0) return;
    g.strokeStyle = colour.shadow;
    for (let i = 1; i < this.frozen.length; i++) {
      const f = this.frozen[i], p = this.frozen[i - 1];
      if (!this.joins(f, p)) continue;
      const level = Math.min(1, (0.5 * (f.amp + p.amp)) / 0.35);
      this.seg(g, ((i - 1) / this.frozenRate) * kPxPerSecond, this.y(p.hz), (i / this.frozenRate) * kPxPerSecond, this.y(f.hz), 1.5 + 1.5 * level);
    }
  }

  private paintLine(g: CanvasRenderingContext2D) {
    const tp = this.host.pipp, x = tp.x;
    const n = x.pipp_line_count(this.line);
    const pts = this.linePoints();
    if (n > 0) {
      const sx = Math.floor(x.pipp_line_start(this.line) * kPxPerMs) + 0.5;
      g.strokeStyle = colour.ink;
      g.lineWidth = 1;
      g.setLineDash([2, 4]);
      g.beginPath();
      g.moveTo(sx, 0);
      g.lineTo(sx, this.H);
      g.stroke();
      g.setLineDash([]);
      g.fillStyle = colour.ink;
      g.font = font(8, 600);
      g.letterSpacing = '0.5px';
      g.textBaseline = 'middle';
      g.textAlign = 'left';
      g.fillText(this.yourPhraseText, sx + 5.5, 8.5);
      g.letterSpacing = '0px';
    }

    // The line, note by note, through drawnAt: what is seen is what is sung.
    g.strokeStyle = colour.ink;
    g.lineWidth = 3;
    g.lineCap = 'butt';
    g.lineJoin = 'miter';
    for (let a = 0; a < n;) {
      let b = a;
      while (b + 1 < n && pts[3 * (b + 1) + 2] !== 0) b++;
      const t0 = pts[3 * a], t1 = a === b ? t0 + kDotMs : pts[3 * b];
      const steps = Math.max(1, Math.floor(((t1 - t0) * kPxPerMs) / 2));
      g.beginPath();
      for (let j = 0; j <= steps; j++) {
        const t = t0 + ((t1 - t0) * j) / steps;
        const [hz] = this.drawnAt(Math.min(t1 - 0.01, Math.max(t0 + 0.01, t)));
        if (j === 0) g.moveTo(t * kPxPerMs, this.y(hz));
        else g.lineTo(t * kPxPerMs, this.y(hz));
      }
      g.stroke();
      a = b + 1;
    }
    if (this.stroke.length) {
      g.beginPath();
      for (let i = 0; i < this.stroke.length; i += 3) {
        const px = this.stroke[i] * kPxPerMs, py = this.y(this.stroke[i + 1]);
        if (i === 0) g.moveTo(px, py);
        else g.lineTo(px, py);
      }
      g.stroke();
    }
    g.lineWidth = 1;
    for (let i = 0; i < n; i++) {
      const sx = Math.round(pts[3 * i] * kPxPerMs) - 3, sy = Math.round(this.y(pts[3 * i + 1])) - 3;
      g.fillStyle = colour.face;
      g.fillRect(sx, sy, 6, 6);
      g.strokeStyle = colour.ink;
      g.strokeRect(sx + 0.5, sy + 0.5, 5, 5);
    }
    if (this.host.singing && this.phrase?.drawn) {
      g.fillStyle = colour.plum;
      g.fillRect((this.phrase.drawnStartMs + this.host.phrasePosMs) * kPxPerMs, 0, 1, this.H);
    }
    g.lineCap = 'round';
  }

  private paintCursor(g: CanvasRenderingContext2D) {
    if (!this.hover) return;
    const x = Math.round(this.pointer.x), yy = Math.round(this.pointer.y);
    g.fillStyle = colour.ink;
    g.fillRect(x, yy - 14, 1, 28);
    g.fillRect(x - 14, yy, 28, 1);
    if (this.erasing) {
      g.strokeStyle = colour.ink;
      g.lineWidth = 1;
      g.beginPath();
      g.arc(x, yy, kEraseRadiusPx, 0, 2 * Math.PI);
      g.stroke();
      return;
    }
    const [t, hz] = this.pointFor(this.pointer);
    const text = this.flagText(hz, t / 1000);
    g.font = font(9, 500);
    const w = Math.ceil(g.measureText(text).width) + 12;
    let fx = x + 6, fy = yy - 24;
    if (fx + w > this.W) fx = x - 6 - w;
    if (fy < 0) fy = yy + 10;
    g.fillRect(fx, fy, w, 14);
    g.fillStyle = colour.onInk;
    g.textBaseline = 'middle';
    g.textAlign = 'left';
    g.fillText(text, fx + 5, fy + 7.5);
  }

  private paintSung(g: CanvasRenderingContext2D) {
    const h = this.host;
    const written = h.sonoWritten, rate = h.sonoRate;
    if (written < 2 || rate <= 0) return;
    const visible = Math.ceil((this.px / kPxPerSecond) * rate) + 2;
    const count = Math.min(visible, Math.min(written, kSonoFrames - 64));
    const first = written - count;
    const xFor = (i: number) => this.px - ((written - 1 - i) / rate) * kPxPerSecond;

    let prev = h.sonoFrame(first), prevX = xFor(first);
    let runKnob = -1, runStart = 0;
    const closeRun = (endX: number) => {
      if (runKnob < 0) return;
      g.fillStyle = colour.ink;
      g.fillRect(runStart, 4, Math.max(1, endX - runStart), 4);
      const text = this.handLabel(runKnob);
      g.font = font(8, 600);
      g.letterSpacing = '0.5px';
      const w = g.measureText(text).width;
      g.textBaseline = 'middle';
      g.textAlign = 'left';
      g.fillText(text, runStart - 6 - w >= 2 ? runStart - 6 - w : endX + 6, 7);
      g.letterSpacing = '0px';
      runKnob = -1;
    };
    g.strokeStyle = colour.ink;
    for (let i = first + 1; i < written; i++) {
      const f = h.sonoFrame(i), x = xFor(i);
      if (this.joins(f, prev)) {
        const level = Math.min(1, (0.5 * (f.amp + prev.amp)) / 0.35);
        this.seg(g, prevX, this.y(prev.hz), x, this.y(f.hz), 1.5 + 1.5 * level);
      }
      const knob = f.mask !== 0 ? lowestBit(f.mask) : -1;
      if (knob !== runKnob) {
        closeRun(x);
        if (knob >= 0) { runKnob = knob; runStart = x; }
      }
      prev = f;
      prevX = x;
    }
    closeRun(this.px);
  }

  private paintNext(g: CanvasRenderingContext2D) {
    const h = this.host, ph = this.phrase;
    if (!this.bird || !h.singing || !ph) return;
    const x = h.pipp.x;
    const pos = h.phrasePosMs;
    const tempo = Math.max(0.01, h.phraseTempo);
    g.strokeStyle = colour.shadow;

    if (ph.drawn) {
      const pitchRatio = h.knobValue(0) / Math.max(0.01, x.pipp_bird_base(this.bird, 0));
      const from = ph.drawnStartMs + pos;
      const end = x.pipp_line_end(this.line);
      let px = 0, py = 0, prevOn = false;
      for (let t = from; t <= end; t += (3 / kPxPerSecond) * 1000 * tempo) {
        const [hz, amp] = this.drawnAt(t);
        const xx = this.px + ((t - from) / tempo) * kPxPerMs, yy = this.y(hz * pitchRatio);
        const on = amp > 0.08;
        if (on && prevOn) this.seg(g, px, py, xx, yy, 3);
        px = xx; py = yy; prevOn = on;
      }
      return;
    }
    const pitchKnob = h.knobValue(0);
    const nSyl = x.pipp_bird_syllable_count(this.bird);
    const tp = h.pipp;
    for (const n of ph.notes) {
      if (n.syl < 0 || n.syl >= nSyl || n.durMs <= 0) continue;
      if (n.startMs + n.durMs <= pos) continue;
      const startX = this.px + ((Math.max(n.startMs, pos) - pos) / tempo / 1000) * kPxPerSecond;
      if (startX > this.W) break;
      const u0 = Math.max(0, (pos - n.startMs) / n.durMs);
      const steps = Math.max(2, Math.floor((n.durMs / tempo / 1000) * kPxPerSecond / 3));
      let px = 0, py = 0, prevOn = false;
      for (let j = 0; j <= steps; j++) {
        const u = u0 + ((1 - u0) * j) / steps;
        const t = n.startMs + u * n.durMs;
        x.pipp_bird_syllable_at(this.bird, n.syl, u, this.at);
        const v = tp.f32(this.at, 2);
        const xx = this.px + ((t - pos) / tempo / 1000) * kPxPerSecond;
        const yy = this.y(v[0] * n.pitchMul * pitchKnob);
        const on = v[1] > 0.08;
        if (on && prevOn) this.seg(g, px, py, xx, yy, 1.5 + 1.5 * Math.min(1, v[1]));
        px = xx; py = yy; prevOn = on;
      }
    }
  }
}



function lowestBit(m: number): number {
  for (let b = 0; b < 16; b++) if ((m >> b) & 1) return b;
  return -1;
}
