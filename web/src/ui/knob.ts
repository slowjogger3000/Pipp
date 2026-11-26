// A knob, 72 wide and 104 high: caps label, dial, value. The value ring is
// plum while autoplay sings it and ink while the hand has it, with a HAND
// tag at the top right. Hover shows the exact value in an ink flag. Same
// drawing as standalone/Source/UI/Knob.h.
//
// The knob only sends hand values and hand-down and hand-up events. The
// override sequence runs in the engine.

import type { AudioHost } from '../audio/host.ts';
import { Canvas, colour, font, number } from './dom.ts';
import type { Strings } from './strings.ts';

export const kKnobIds = ['vo_pitch', 'vo_breath', 'vo_tension', 'vo_trill', 'vo_rough', 'ph_tempo', 'ph_pause', 'ph_length',
  'ph_variation', 'su_distance', 'su_wind', 'su_space'] as const;
const kPitch = 0, kTrill = 3, kPause = 6, kLength = 7, kDistance = 9, kWind = 10;

export class Knob {
  readonly cv: Canvas;
  private bird = 0;
  private shown = NaN;
  private shownHand = false;
  private hover = false;
  private dragging = false;
  private startNorm = 0;
  private startY = 0;
  private dirty = true;

  constructor(parent: HTMLElement, private host: AudioHost, private strings: Strings, readonly k: number) {
    this.cv = new Canvas(parent, 78, 104);
    const c = this.cv.c;
    c.style.cursor = 'ns-resize';
    c.style.touchAction = 'none';
    c.addEventListener('pointerenter', () => { this.hover = true; this.dirty = true; });
    c.addEventListener('pointerleave', () => { this.hover = false; this.dirty = true; });
    c.addEventListener('pointerdown', (e) => {
      c.setPointerCapture(e.pointerId);
      this.dragging = true;
      this.startNorm = this.toNorm(this.value());
      this.startY = e.clientY;
      this.send(this.startNorm);
      host.post({ t: 'hand', k, down: true });
      e.preventDefault();
    });
    c.addEventListener('pointermove', (e) => {
      if (!this.dragging) return;
      const scale = c.getBoundingClientRect().height / 104; // the stage may be scaled
      const pixelsForRange = (e.shiftKey ? 800 : 200) * scale;
      this.send(Math.min(1, Math.max(0, this.startNorm + (this.startY - e.clientY) / pixelsForRange)));
    });
    const up = () => {
      if (!this.dragging) return;
      this.dragging = false;
      host.post({ t: 'hand', k, down: false });
      this.dirty = true;
    };
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
    c.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.send(Math.min(1, Math.max(0, this.toNorm(this.value()) - Math.sign(e.deltaY) * 0.03)));
      host.post({ t: 'hand', k, down: true });
      host.post({ t: 'hand', k, down: false });
    }, { passive: false });
  }

  setBird(b: number) { this.bird = b; if (!this.host.ready) this.shown = NaN; this.dirty = true; }
  invalidate() { this.dirty = true; }

  // The engine's effective value, or the bird's base before audio runs.
  private value(): number {
    if (this.dragging) return this.shown;
    if (this.host.ready) return this.host.knobValue(this.k);
    if (!Number.isNaN(this.shown)) return this.shown;
    return this.bird ? this.host.tipp.x.tipp_bird_base(this.bird, this.k) : this.host.tipp.params[this.k].def;
  }

  private range(): [number, number] {
    const x = this.host.tipp.x;
    if (this.bird) return [x.tipp_bird_range_lo(this.bird, this.k), x.tipp_bird_range_hi(this.bird, this.k)];
    const p = this.host.tipp.params[this.k];
    return [p.min, p.max];
  }

  // Pitch, pause, length and distance turn in equal ratios.
  private logScale() { return [kPitch, kPause, kLength, kDistance].includes(this.k); }

  private toNorm(v: number): number {
    const [lo, hi] = this.range();
    if (hi <= lo) return 0;
    v = Math.min(hi, Math.max(lo, v));
    if (this.logScale() && lo > 0) return Math.log(v / lo) / Math.log(hi / lo);
    return (v - lo) / (hi - lo);
  }
  private fromNorm(n: number): number {
    const [lo, hi] = this.range();
    if (this.logScale() && lo > 0) return lo * Math.pow(hi / lo, n);
    return lo + n * (hi - lo);
  }

  // The hand value goes before the hand-down, so the engine never takes a stale one.
  private send(n: number) {
    const v = this.fromNorm(n);
    this.host.param(kKnobIds[this.k], v);
    this.shown = v;
    this.dirty = true;
  }

  format(v: number, exact: boolean): string {
    const c = this.strings.no;
    switch (this.k) {
      case kPitch: {
        const ref = this.bird ? this.host.tipp.x.tipp_bird_pitch_ref(this.bird) : 2000;
        return `${number((v * ref) / 1000, exact ? 3 : 1, c)} kHz`;
      }
      case kTrill: return `${number(v, exact ? 1 : 0, c)} Hz`;
      case kPause:
      case kLength: return `${number(v, exact ? 2 : 1, c)} s`;
      case kDistance: return `${number(v, exact ? 1 : 0, c)} m`;
      case kWind: return `${number(v, 1, c)} m/s`;
      default: return `${number(v, exact ? 1 : 0, c)} %`;
    }
  }

  // From the interface frame. Draws only on change.
  poll() {
    const v = this.value();
    const hand = this.dragging || (this.host.ready && this.host.knobOverridden(this.k));
    if (!this.dragging && this.host.ready) this.shown = v;
    if (Math.abs(v - this.drawnValue) > 1e-5 || hand !== this.shownHand) this.dirty = true;
    this.shownHand = hand;
    if (this.dirty) this.draw(v);
  }
  private drawnValue = NaN;

  private draw(v: number) {
    this.dirty = false;
    this.drawnValue = v;
    const g = this.cv.begin();
    const norm = this.toNorm(v);
    const cx = 36, cy = 54;
    const a0 = -0.75 * Math.PI, span = 1.5 * Math.PI;

    g.font = font(10, 600);
    g.letterSpacing = '1.4px';
    g.fillStyle = colour.inkSoft;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(this.strings.t(`knob.${kKnobIds[this.k]}`), 36, 7);

    g.strokeStyle = colour.inkSoft;
    g.lineWidth = 1;
    for (let i = 0; i < 11; i++) {
      const a = a0 + (span * i) / 10, s = Math.sin(a), c = -Math.cos(a);
      g.beginPath();
      g.moveTo(cx + 30 * s, cy + 30 * c);
      g.lineTo(cx + 34 * s, cy + 34 * c);
      g.stroke();
    }
    // Canvas angles start at 3 o'clock; ours at 12.
    const arc = (from: number, to: number, c: string) => {
      g.strokeStyle = c;
      g.lineWidth = 3;
      g.beginPath();
      g.arc(cx, cy, 26.5, from - Math.PI / 2, to - Math.PI / 2);
      g.stroke();
    };
    arc(a0, a0 + span, colour.faint);
    if (norm > 0.001) arc(a0, a0 + span * norm, this.shownHand ? colour.ink : colour.plum);

    g.fillStyle = colour.face;
    g.beginPath();
    g.arc(cx, cy, 22, 0, 2 * Math.PI);
    g.fill();
    g.strokeStyle = colour.ink;
    g.lineWidth = 1;
    g.stroke();
    const a = a0 + span * norm;
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(cx + 6 * Math.sin(a), cy - 6 * Math.cos(a));
    g.lineTo(cx + 19 * Math.sin(a), cy - 19 * Math.cos(a));
    g.stroke();

    g.font = font(10, 500);
    g.letterSpacing = '0.6px';
    if (this.hover || this.dragging) {
      const text = this.format(v, true);
      const w = Math.ceil(g.measureText(text).width) + 8;
      g.fillStyle = colour.ink;
      g.fillRect(Math.round(36 - w / 2), 90, w, 14);
      g.fillStyle = colour.onInk;
      g.fillText(text, 36, 97.5);
    } else {
      g.fillStyle = colour.ink;
      g.fillText(this.format(v, false), 36, 97.5);
    }

    if (this.shownHand) {
      const tag = this.strings.t('knob.hand');
      g.font = font(8, 600);
      g.letterSpacing = '0.5px';
      const w = Math.ceil(g.measureText(tag).width) + 6;
      g.fillStyle = colour.ink;
      g.fillRect(78 - w, 12, w, 10);
      g.fillStyle = colour.onInk;
      g.fillText(tag, 78 - w / 2, 17.5);
    }
    g.letterSpacing = '0px';
  }
}
