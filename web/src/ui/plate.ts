// The ink plate from data/birds/<id>/plate.json, a 280x240 box scaled to the
// well. Beak, tail and sound arcs follow the voice level. Same drawing as
// standalone/Source/UI/Plate.h. Canvas Path2D reads the SVG paths directly.

import { birdFile } from '../data.ts';
import { Canvas, colour, font } from './dom.ts';
import type { Strings } from './strings.ts';

interface Text { en: string; no: string; verified?: boolean }
interface Layer {
  path?: string; clip?: string; fill?: string; stroke?: number; part?: string; hatch?: string;
  variant?: string; within?: string; eye?: [number, number]; pupil?: number;
}
interface PlateDoc {
  box?: [number, number];
  clips?: Record<string, string>;
  layers?: Layer[];
  hatch?: Record<string, { rect: [number, number, number, number]; up: boolean; clip: string }>;
  pivots?: Record<string, { at: [number, number]; deg: number }>;
  variants?: Record<string, Record<string, string | number>>;
  callouts?: { id: string; leader: string; at: [number, number]; align?: string; [variant: string]: unknown }[];
  captions?: Record<string, Text>;
}

export const kCalloutIds = ['bill', 'eye_ring', 'plumage', 'throat', 'head', 'cheek', 'breast', 'eye_stripe', 'wing', 'tail', 'neck'];

export class Plate {
  readonly cv: Canvas;
  variant = 'male';
  open = 0;
  private doc: PlateDoc = {};
  private clips = new Map<string, Path2D>();
  private drawnKey = '';

  constructor(parent: HTMLElement, w: number, h: number, private strings: Strings) {
    this.cv = new Canvas(parent, w, h);
  }

  // Returns an error text, empty on success.
  load(id: string): string {
    const text = birdFile(id, 'plate');
    this.doc = {};
    this.clips.clear();
    this.drawnKey = '';
    if (!text) return 'plate.json missing';
    try { this.doc = JSON.parse(text); } catch { return 'plate.json is not JSON'; }
    for (const [k, d] of Object.entries(this.doc.clips ?? {})) this.clips.set(k, new Path2D(d));
    return '';
  }

  caption(): string {
    const c = this.doc.captions?.[this.variant];
    if (!c) return '';
    const s = c[this.strings.lang] ?? '';
    return c.verified ? s : `${s} ${this.strings.t('to_verify')}`;
  }

  // Draws when the variant, opening or language changed.
  paint(force = false) {
    const key = `${this.variant}|${this.open.toFixed(3)}|${this.strings.lang}`;
    if (!force && key === this.drawnKey) return;
    this.drawnKey = key;
    const g = this.cv.begin();
    const [bw, bh] = this.doc.box ?? [280, 240];
    const W = this.cv.w, H = this.cv.h;
    const s = Math.min(W / bw, H / bh);
    const ox = (W - bw * s) / 2, oy = (H - bh * s) / 2;
    const vdata = this.doc.variants?.[this.variant] ?? {};
    for (const l of this.doc.layers ?? []) {
      g.save();
      this.base(g, ox, oy, s);
      // A within clip is in plate space, before the part's rotation.
      const within = l.within ? this.clips.get(l.within) : undefined;
      if (within && !l.eye && !l.hatch) g.clip(within);
      this.pivot(g, l.part);
      if (l.part === 'arcs') {
        if (this.open > 0.05 && l.path) {
          g.globalAlpha = Math.min(1, this.open * 1.6);
          g.strokeStyle = colour.ink;
          g.lineWidth = l.stroke ?? 1;
          g.stroke(new Path2D(l.path));
        }
        g.restore();
        continue;
      }
      if (l.hatch) {
        this.paintHatch(g, l.hatch, Number(vdata[`${l.hatch}_pitch`] ?? 0));
        g.restore();
        continue;
      }
      if (l.eye) {
        const ring = Number(vdata.eye_ring ?? 0);
        const [ex, ey] = l.eye;
        g.lineWidth = 1;
        if (ring > 0) {
          g.beginPath();
          g.arc(ex, ey, ring, 0, 2 * Math.PI);
          g.fillStyle = colour.face;
          g.fill();
          g.strokeStyle = colour.ink;
          g.stroke();
        }
        g.beginPath();
        g.arc(ex, ey, l.pupil ?? 2, 0, 2 * Math.PI);
        g.fillStyle = colour.ink;
        g.fill();
        g.restore();
        continue;
      }
      let path: Path2D | undefined = l.path ? new Path2D(l.path) : l.clip ? this.clips.get(l.clip) : undefined;
      if (l.variant) {
        const d = String(vdata[l.variant] ?? '');
        if (!d) { g.restore(); continue; }
        path = new Path2D(d);
      }
      if (!path) { g.restore(); continue; }
      if (l.fill) {
        g.fillStyle = fillColour(l.fill, vdata);
        g.fill(path);
      }
      if (l.stroke && l.stroke > 0) {
        g.strokeStyle = colour.ink;
        g.lineWidth = l.stroke;
        g.lineJoin = 'round';
        g.stroke(path);
      }
      g.restore();
    }
    this.paintCallouts(g, ox, oy, s);
  }

  private base(g: CanvasRenderingContext2D, ox: number, oy: number, s: number) {
    const r = this.cv.c.width / this.cv.w;
    g.setTransform(r * s, 0, 0, r * s, r * ox, r * oy);
  }

  private pivot(g: CanvasRenderingContext2D, part?: string) {
    const p = part ? this.doc.pivots?.[part] : undefined;
    if (!p) return;
    const a = (p.deg * this.open * Math.PI) / 180;
    g.translate(p.at[0], p.at[1]);
    g.rotate(a);
    g.translate(-p.at[0], -p.at[1]);
  }

  private paintHatch(g: CanvasRenderingContext2D, id: string, pitch: number) {
    const h = this.doc.hatch?.[id];
    if (!h || pitch <= 0) return;
    const clip = this.clips.get(h.clip);
    if (clip) g.clip(clip);
    const [x0, y0, x1, y1] = h.rect, hh = y1 - y0;
    g.beginPath();
    for (let x = x0 - hh; x < x1; x += pitch) {
      if (h.up) { g.moveTo(x, y1); g.lineTo(x + hh, y0); }
      else { g.moveTo(x, y0); g.lineTo(x + hh, y1); }
    }
    g.strokeStyle = colour.ink;
    g.lineWidth = 1;
    g.stroke();
  }

  private paintCallouts(g: CanvasRenderingContext2D, ox: number, oy: number, s: number) {
    const r = this.cv.c.width / this.cv.w;
    for (const c of this.doc.callouts ?? []) {
      g.save();
      this.base(g, ox, oy, s);
      g.strokeStyle = colour.inkSoft;
      g.lineWidth = 1;
      g.stroke(new Path2D(c.leader));
      g.restore();

      g.setTransform(r, 0, 0, r, 0, 0);
      const v = (c[this.variant] ?? {}) as Text;
      const value = v[this.strings.lang] ?? '';
      const align = c.align === 'centre' ? 'center' : c.align === 'right' ? 'right' : 'left';
      const px = ox + c.at[0] * s, py = oy + c.at[1] * s;
      g.textAlign = align;
      g.textBaseline = 'middle';
      g.letterSpacing = '0.5px';
      // The design's text y is a baseline; rows sit 10px apart.
      const rowY = (line: number) => py - 8 + 10 * line + 5;
      g.font = font(8, 600);
      g.fillStyle = colour.inkSoft;
      g.fillText(this.strings.t(`plate.${c.id}`), px, rowY(0));
      g.font = font(8, 500);
      g.fillStyle = colour.ink;
      let line = 1;
      if (value) g.fillText(value, px, rowY(line++));
      if (!v.verified) {
        g.fillStyle = colour.inkSoft;
        g.fillText(this.strings.t('to_verify'), px, rowY(line));
      }
      g.letterSpacing = '0px';
    }
  }
}

function fillColour(name: string, vdata: Record<string, string | number>): string {
  // A fill named after a variant key takes that variant's colour, as "bill" does.
  const n = name in vdata ? String(vdata[name]) : name;
  if (n === 'shadow') return colour.shadow;
  if (n === 'ink') return colour.ink;
  return colour.face;
}
