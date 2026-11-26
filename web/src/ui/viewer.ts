// The picture viewer in SAMLING. Not in design/: agreed with Eirik
// 2026-11-26. It covers the phone column on the paper colour: a head row with
// the bird and date, the picture whole and as large as it fits, ‹ and › to
// step through the pictures the collection shows (or a swipe), then LUKK,
// DEL, SLETT at 44px. SLETT asks once more (SLETT 1?) before it deletes.

import type { Picture } from '../listen/store.ts';
import { Btn, box, el } from './dom.ts';
import type { Strings } from './strings.ts';

export interface ViewerHandlers {
  name(bird: string): string;
  share(p: Picture): void;
  remove(p: Picture): Promise<void>;
}

const kSwipePx = 50;
const kArmMs = 4000;

export class PictureViewer {
  private root: HTMLDivElement;
  private title: HTMLDivElement;
  private date: HTMLSpanElement;
  private img: HTMLImageElement;
  private prev: Btn;
  private next: Btn;
  private closeBtn: Btn;
  private shareBtn: Btn;
  private delBtn: Btn;
  private list: Picture[] = [];
  private i = 0;
  private url = '';
  private armed = 0;   // timer id while SLETT waits for its second press
  private downX: number | null = null;

  constructor(host: HTMLElement, private s: Strings, private on: ViewerHandlers) {
    const root = box(host, { position: 'absolute', inset: '0', zIndex: '50', display: 'none', flexDirection: 'column', background: 'var(--sheet)' });
    this.root = root;
    const head = box(root, { height: '56px', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '0 16px', borderBottom: '1px solid var(--ink)', background: 'var(--ground)' });
    this.title = box(head, { font: '400 26px/1 var(--serif)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: '0' });
    this.date = el('span', 'label', head);
    this.date.style.flex = 'none';

    const stage = box(root, { flex: '1', minHeight: '0', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 16px', touchAction: 'pan-y' });
    this.img = el('img', '', stage);
    Object.assign(this.img.style, { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', border: '1px solid var(--ink)', display: 'block' });
    this.img.alt = '';
    this.img.draggable = false;
    const side = { position: 'absolute', bottom: '20px', width: '44px', height: '44px', padding: '0' };
    this.prev = new Btn(stage, '', () => this.step(-1), { ...side, left: '16px' }).glyph('prev');
    this.next = new Btn(stage, '', () => this.step(1), { ...side, right: '16px' }).glyph('next');
    stage.addEventListener('pointerdown', (e) => { this.downX = e.clientX; });
    stage.addEventListener('pointerup', (e) => {
      if (this.downX === null) return;
      const dx = e.clientX - this.downX;
      this.downX = null;
      if (Math.abs(dx) >= kSwipePx) this.step(dx < 0 ? 1 : -1);
    });
    stage.addEventListener('pointercancel', () => { this.downX = null; });

    const act = box(root, { flex: 'none', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '6px', padding: '10px 16px 16px', borderTop: '1px solid var(--ink)', background: 'var(--ground)' });
    const style = { height: '44px', padding: '0', minWidth: '0' };
    this.closeBtn = new Btn(act, '', () => this.close(), style);
    this.shareBtn = new Btn(act, '', () => { const p = this.list[this.i]; if (p) this.on.share(p); }, style);
    this.delBtn = new Btn(act, '', () => void this.remove(), style);

    window.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      if (e.key === 'Escape') this.close();
      else if (e.key === 'ArrowLeft') this.step(-1);
      else if (e.key === 'ArrowRight') this.step(1);
      else return;
      e.preventDefault();
      e.stopPropagation();
    }, true);
  }

  get isOpen(): boolean { return this.root.style.display !== 'none'; }

  open(list: Picture[], id: string) {
    this.list = list;
    this.i = Math.max(0, list.findIndex((p) => p.id === id));
    this.root.style.display = 'flex';
    this.render();
  }

  close() {
    this.disarm();
    this.root.style.display = 'none';
    this.img.removeAttribute('src');
    if (this.url) URL.revokeObjectURL(this.url);
    this.url = '';
  }

  private step(d: number) {
    const n = this.i + d;
    if (n < 0 || n >= this.list.length) return;
    this.i = n;
    this.disarm();
    this.render();
  }

  private disarm() {
    if (this.armed) clearTimeout(this.armed);
    this.armed = 0;
    this.delBtn.text(this.s.t('coll.delete')).on(false);
  }

  private async remove() {
    const p = this.list[this.i];
    if (!p) return;
    if (!this.armed) {
      this.delBtn.text(this.s.t('coll.delete_confirm', { n: '1' })).on(true);
      this.armed = window.setTimeout(() => this.disarm(), kArmMs);
      return;
    }
    this.disarm();
    await this.on.remove(p);
    this.list.splice(this.i, 1);
    if (!this.list.length) { this.close(); return; }
    this.i = Math.min(this.i, this.list.length - 1);
    this.render();
  }

  applyStrings() {
    this.closeBtn.text(this.s.t('coll.close'));
    this.shareBtn.text(this.s.t('coll.share'));
    this.prev.e.setAttribute('aria-label', this.s.t('coll.prev_picture'));
    this.next.e.setAttribute('aria-label', this.s.t('coll.next_picture'));
    this.disarm();
    if (this.isOpen) this.render();
  }

  private render() {
    const p = this.list[this.i];
    if (!p) return;
    if (this.url) URL.revokeObjectURL(this.url);
    this.url = URL.createObjectURL(p.image);
    this.img.src = this.url;
    this.title.textContent = this.on.name(p.bird);
    this.date.textContent = p.date;
    this.prev.disabled(this.i === 0);
    this.next.disabled(this.i >= this.list.length - 1);
  }
}
