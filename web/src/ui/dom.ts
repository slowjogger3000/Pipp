// Small DOM and canvas helpers shared by the screens.

export const colour = {
  ground: '#ddd3bd', panel: '#cec2a6', face: '#efe8d6', sheet: '#e3d9c2', hilite: '#fbf7ec', shadow: '#a3967a',
  ink: '#221c14', inkSoft: '#4f4634', faint: '#b5a98b', onInk: '#ddd3bd', paper: '#fff8ec', rule: '#d8ccb0',
  ruleMajor: '#c4b796', divider: '#bdb093', clay: '#936255', khaki: '#b5a37a', sage: '#809a8c', plum: '#5e4458',
  hatch: 'rgba(34, 28, 20, 0.10)',
} as const;

export const MINUS = '−';

export function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', parent?: HTMLElement, text?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  parent?.appendChild(e);
  return e;
}

export function box(parent: HTMLElement, style: Partial<CSSStyleDeclaration>, cls = ''): HTMLDivElement {
  const d = el('div', cls, parent);
  Object.assign(d.style, style);
  return d;
}

export type Glyph = 'play' | 'stop' | 'prev' | 'next';

const glyphs: Record<Glyph, string> = {
  play: '<polygon points="4,2 13,8 4,14"/>',
  stop: '<rect x="3" y="3" width="10" height="10"/>',
  prev: '<polygon points="11,3 4,8 11,13"/>',
  next: '<polygon points="5,3 12,8 5,13"/>',
};

export class Btn {
  readonly e: HTMLButtonElement;
  constructor(parent: HTMLElement, text = '', onClick?: () => void, style?: Partial<CSSStyleDeclaration>) {
    this.e = el('button', 'btn', parent, text);
    this.e.type = 'button';
    this.e.tabIndex = -1; // the keyboard belongs to the app's own keys
    if (style) Object.assign(this.e.style, style);
    this.e.addEventListener('mousedown', (e) => e.preventDefault()); // keep focus off buttons: keys belong to the app
    if (onClick) this.e.addEventListener('click', () => { if (!this.e.disabled) onClick(); });
  }
  glyph(g: Glyph, label = ''): this {
    if (label) this.e.setAttribute('aria-label', label);
    this.e.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">${glyphs[g]}</svg>`;
    return this;
  }
  text(t: string): this { if (this.e.textContent !== t) this.e.textContent = t; return this; }
  on(b: boolean): this { this.e.classList.toggle('on', b); return this; }
  disabled(b: boolean): this { this.e.disabled = b; return this; }
  show(b: boolean): this { this.e.style.display = b ? '' : 'none'; return this; }
}

export function joined(parent: HTMLElement, buttons: { text: string; width?: number; onClick: () => void }[], height = 20): Btn[] {
  const row = el('div', buttons.some((b) => !b.width) ? 'joined fill' : 'joined', parent);
  return buttons.map((b) => new Btn(row, b.text, b.onClick, { height: `${height}px`, ...(b.width ? { width: `${b.width}px` } : { flex: '1' }) }));
}

// A canvas drawn at device resolution for a css size. scale is the stage's
// own CSS scale, so the pixels stay sharp when the stage is shrunk or grown.
export class Canvas {
  readonly c: HTMLCanvasElement;
  readonly g: CanvasRenderingContext2D;
  w: number;
  h: number;
  private ratio = 1;
  constructor(parent: HTMLElement, w: number, h: number) {
    this.c = el('canvas', '', parent);
    this.g = this.c.getContext('2d')!;
    this.w = w;
    this.h = h;
    this.c.style.width = `${w}px`;
    this.c.style.height = `${h}px`;
    this.resize(1);
  }
  resize(stageScale: number) {
    this.ratio = Math.max(1, Math.min(4, (window.devicePixelRatio || 1) * stageScale));
    this.c.width = Math.round(this.w * this.ratio);
    this.c.height = Math.round(this.h * this.ratio);
  }
  begin(): CanvasRenderingContext2D {
    const g = this.g;
    g.setTransform(this.ratio, 0, 0, this.ratio, 0, 0);
    g.clearRect(0, 0, this.w, this.h);
    return g;
  }
}

export const canvases: Canvas[] = [];

export function font(px: number, weight = 400, serif = false): string {
  return serif ? `400 ${px}px 'Instrument Serif', Georgia, serif` : `${weight} ${px}px 'Plex Mono', Menlo, monospace`;
}

export function graphPaper(g: CanvasRenderingContext2D, w: number, h: number) {
  g.fillStyle = colour.face;
  g.fillRect(0, 0, w, h);
  for (const [step, c] of [[8, colour.rule], [40, colour.ruleMajor]] as const) {
    g.fillStyle = c;
    for (let x = 0; x < w; x += step) g.fillRect(x, 0, 1, h);
    for (let y = 0; y < h; y += step) g.fillRect(0, y, w, 1);
  }
}

// Values carry units with a real minus sign. Norwegian uses a decimal comma.
export function number(v: number, decimals: number, comma: boolean): string {
  let s = decimals <= 0 ? String(Math.round(v)) : v.toFixed(decimals);
  if (s === '-0') s = '0';
  if (comma) s = s.replace('.', ',');
  if (s.startsWith('-')) s = MINUS + s.slice(1);
  return s;
}
