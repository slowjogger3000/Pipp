// SAMLING, recordings and pictures, from design/Collection.dc.html and
// CollectionEmpty.dc.html: a filter between all birds and one bird,
// recordings as 56px rows (play, 120x40 sonogram, type and length, date,
// confidence), pictures in a 3-column grid of 112px tiles with NYTT BILDE
// last, then VELG, DEL, EKSPORTER. Everything comes from listen/store.ts.
//
// Agreed with Eirik 2026-11-26, not in design/: while VELG is on, the action
// row reads FERDIG, DEL, SLETT (SLETT takes EKSPORTER's place), and SLETT
// asks once more (SLETT 3?) before it deletes. A tap on a picture opens the
// viewer (viewer.ts). Not built: the recording detail view. EKSPORTER waits
// for the phone export format.

import { index, type IndexBird } from '../data.ts';
import { deletePicture, deleteRecording, newId, now, pictures, recordings, savePicture, type Picture, type Recording } from '../listen/store.ts';
import { Btn, box, el, number } from './dom.ts';
import { upper, type Strings } from './strings.ts';
import { PictureViewer } from './viewer.ts';

const kTypeIds = ['song', 'call', 'alarm', 'flight'] as const;
const kArmMs = 4000;

export interface CollectionHandlers {
  refresh(): void;
  openListen(): void;
  playBird(): string;
}

export class CollectionScreen {
  readonly root: HTMLDivElement;
  private recs: Recording[] = [];
  private pics: Picture[] = [];
  private bird = '';        // '' shows all birds
  private selecting = false;
  private selected = new Set<string>();
  private player: HTMLAudioElement | null = null;
  private playing = '';
  private urls: string[] = [];
  private message = '';
  private armed = 0;   // timer id while SLETT waits for its second press
  private viewer: PictureViewer;

  private empty: HTMLDivElement;
  private emptyTitle: HTMLDivElement;
  private emptyText: HTMLParagraphElement;
  private emptyBtns: Btn[];
  private emptyNote: HTMLParagraphElement;
  private full: HTMLDivElement;
  private allBtn: Btn;
  private birdBtn: HTMLButtonElement;
  private birdName: HTMLSpanElement;
  private birdChange: HTMLSpanElement;
  private recLabel: HTMLDivElement;
  private recCount: HTMLSpanElement;
  private recList: HTMLDivElement;
  private picLabel: HTMLDivElement;
  private picCount: HTMLSpanElement;
  private picGrid: HTMLDivElement;
  private actions: Btn[];
  private note: HTMLParagraphElement;
  private fileIn: HTMLInputElement;

  constructor(parent: HTMLElement, private s: Strings, private on: CollectionHandlers) {
    const root = box(parent, { display: 'flex', flexDirection: 'column', gap: '12px' });
    this.root = root;
    this.fileIn = el('input', '', root);
    Object.assign(this.fileIn, { type: 'file', accept: 'image/*' });
    this.fileIn.setAttribute('capture', 'environment');
    this.fileIn.style.display = 'none';
    this.fileIn.addEventListener('change', () => void this.addPicture());
    this.viewer = new PictureViewer((parent.closest('.ph') as HTMLElement | null) ?? document.body, s, {
      name: (bird) => this.name(bird),
      share: (p) => void this.shareFiles([this.pictureFile(p)]),
      remove: async (p) => { await deletePicture(p.id); this.selected.delete(p.id); await this.load(); },
    });

    // ---------------------------------------------------------- empty
    this.empty = box(root, { display: 'flex', flexDirection: 'column', gap: '12px' });
    const card = box(this.empty, { border: '1px solid var(--ink)' });
    const inner = box(card, { display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px 10px', background: 'var(--sheet)', boxShadow: 'var(--inset)' });
    this.emptyTitle = box(inner, { font: '400 28px/1.05 var(--serif)' });
    this.emptyText = el('p', '', inner);
    this.emptyText.style.margin = '0';
    const eb = box(inner, { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '6px' });
    this.emptyBtns = [
      new Btn(eb, '', () => on.openListen(), { height: '44px', minWidth: '0' }),
      new Btn(eb, '', () => this.fileIn.click(), { height: '44px', minWidth: '0' }),
    ];
    this.emptyNote = el('p', '', this.empty);
    Object.assign(this.emptyNote.style, { margin: '0', color: 'var(--inkSoft)' });

    // ---------------------------------------------------------- full
    this.full = box(root, { display: 'none', flexDirection: 'column', gap: '12px' });
    const filter = box(this.full, { display: 'flex' });
    this.allBtn = new Btn(filter, '', () => { this.bird = ''; this.render(); }, { flex: '1 1 0', height: '44px', minWidth: '0' });
    this.birdBtn = el('button', 'btn', filter);
    this.birdBtn.type = 'button';
    Object.assign(this.birdBtn.style, { flex: '2 1 0', height: '44px', marginLeft: '-1px', padding: '0 10px', justifyContent: 'space-between', minWidth: '0' });
    this.birdName = el('span', '', this.birdBtn);
    Object.assign(this.birdName.style, { font: '400 22px/1 var(--serif)', letterSpacing: '0' });
    this.birdChange = el('span', '', this.birdBtn);
    this.birdBtn.addEventListener('click', () => this.stepBird());

    const recSec = box(this.full, { display: 'flex', flexDirection: 'column', gap: '6px' });
    const rh = box(recSec, { display: 'flex', alignItems: 'center', gap: '6px' });
    this.recLabel = el('div', 'section', rh);
    this.recLabel.style.flex = '1';
    this.recCount = el('span', 'label', rh);
    this.recList = box(recSec, {}, 'sheet');
    const picSec = box(this.full, { display: 'flex', flexDirection: 'column', gap: '6px' });
    const ph = box(picSec, { display: 'flex', alignItems: 'center', gap: '6px' });
    this.picLabel = el('div', 'section', ph);
    this.picLabel.style.flex = '1';
    this.picCount = el('span', 'label', ph);
    this.picGrid = box(picSec, { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '6px' });
    const act = box(this.full, { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '6px' });
    const style = { height: '44px', padding: '0', minWidth: '0' };
    this.actions = [
      new Btn(act, '', () => { this.selecting = !this.selecting; this.selected.clear(); this.disarm(); this.render(); }, style),
      new Btn(act, '', () => void this.share(), style),
      // SLETT while VELG is on; otherwise EKSPORTER, hatched: the export format is open (prd.md)
      new Btn(act, '', () => { if (this.selecting) void this.removeSelected(); }, style),
    ];
    this.note = el('p', '', this.full);
    Object.assign(this.note.style, { margin: '0', color: 'var(--inkSoft)' });
  }

  show(on: boolean) {
    this.root.style.display = on ? 'flex' : 'none';
    if (on) void this.load();
    else { this.player?.pause(); this.playing = ''; this.viewer.close(); this.disarm(); }
  }

  async load() {
    try {
      [this.recs, this.pics] = await Promise.all([recordings(), pictures()]);
    } catch (e) {
      this.message = String(e);
    }
    if (this.bird && !this.birds().includes(this.bird)) this.bird = '';
    this.render();
  }

  get isEmpty(): boolean { return this.recs.length === 0 && this.pics.length === 0; }

  private entry(id: string): IndexBird | undefined { return index.birds.find((b) => b.id === id); }
  private name(id: string, latin = ''): string {
    const b = this.entry(id);
    return b ? (this.s.no ? b.name.no : b.name.en) : latin;
  }

  // Birds with something in the collection, in index order.
  private birds(): string[] {
    const have = new Set([...this.recs.map((r) => r.bird), ...this.pics.map((p) => p.bird)].filter((b) => b));
    return index.birds.map((b) => b.id).filter((id) => have.has(id));
  }

  private stepBird() {
    const list = this.birds();
    if (!list.length) return;
    const i = list.indexOf(this.bird);
    this.bird = i < 0 ? (list.includes(this.on.playBird()) ? this.on.playBird() : list[0]) : list[(i + 1) % list.length];
    this.render();
  }

  private async addPicture() {
    const f = this.fileIn.files?.[0];
    this.fileIn.value = '';
    if (!f) return;
    await savePicture({ id: newId(), bird: this.bird || this.on.playBird(), date: now(), image: f });
    await this.load();
  }

  private play(r: Recording) {
    this.player?.pause();
    if (this.playing === r.id) { this.playing = ''; this.render(); return; }
    const url = URL.createObjectURL(r.audio);
    const p = new Audio(url);
    this.player = p;
    this.playing = r.id;
    p.onended = () => { URL.revokeObjectURL(url); this.playing = ''; this.render(); };
    void p.play().catch(() => { this.playing = ''; this.render(); });
    this.render();
  }

  private toggleSelect(id: string) {
    if (this.selected.has(id)) this.selected.delete(id);
    else this.selected.add(id);
    this.disarm();
    this.render();
  }

  private disarm() {
    if (this.armed) clearTimeout(this.armed);
    this.armed = 0;
  }

  // SLETT: the first press asks (SLETT 3?), the second deletes. No undo.
  private async removeSelected() {
    const n = this.selected.size;
    if (!n) return;
    if (!this.armed) {
      this.armed = window.setTimeout(() => { this.armed = 0; this.render(); }, kArmMs);
      this.render();
      return;
    }
    this.disarm();
    for (const r of this.recs) {
      if (!this.selected.has(r.id)) continue;
      if (this.playing === r.id) { this.player?.pause(); this.playing = ''; }
      await deleteRecording(r.id);
    }
    for (const p of this.pics) if (this.selected.has(p.id)) await deletePicture(p.id);
    this.selected.clear();
    this.selecting = false;
    this.message = this.s.t('coll.deleted', { n: String(n) });
    await this.load();
  }

  private static ext(mime: string): string {
    return mime.includes('mp4') ? 'm4a' : mime.includes('webm') ? 'webm' : mime.includes('png') ? 'png' : 'jpg';
  }
  private pictureFile(p: Picture): File {
    return new File([p.image], `tipp-${p.bird}-${p.date.replace(/[: ]/g, '-')}.${CollectionScreen.ext(p.image.type)}`, { type: p.image.type });
  }

  // DEL: the system share sheet with the chosen files.
  private async share() {
    const files: File[] = [];
    for (const r of this.recs) if (this.selected.has(r.id)) files.push(new File([r.audio], `tipp-${r.bird || 'bird'}-${r.date.replace(/[: ]/g, '-')}.${CollectionScreen.ext(r.mime)}`, { type: r.mime }));
    for (const p of this.pics) if (this.selected.has(p.id)) files.push(this.pictureFile(p));
    await this.shareFiles(files);
  }

  private async shareFiles(files: File[]) {
    if (!files.length) return;
    try {
      if (navigator.canShare?.({ files })) await navigator.share({ files });
      else this.message = this.s.t('coll.share_unavailable');
    } catch { /* the user closed the share sheet */ }
    this.render();
  }

  applyStrings() {
    const s = this.s;
    this.emptyTitle.textContent = s.t('phone.coll.empty_title');
    this.emptyText.textContent = s.t('phone.coll.empty_text');
    this.emptyBtns[0].text(s.t('phone.coll.go_listen'));
    this.emptyBtns[1].text(s.t('phone.coll.new_picture'));
    this.emptyNote.textContent = s.t('phone.coll.note');
    this.allBtn.text(s.t('coll.all_birds'));
    this.birdChange.textContent = s.t('coll.change_bird');
    this.recLabel.textContent = s.t('coll.recordings');
    this.picLabel.textContent = s.t('coll.pictures');
    this.actions[1].text(s.t('coll.share'));
    this.viewer.applyStrings();
    this.note.textContent = s.t('coll.note');
    this.render();
  }

  private render() {
    const s = this.s;
    for (const u of this.urls) URL.revokeObjectURL(u);
    this.urls = [];
    this.empty.style.display = this.isEmpty ? 'flex' : 'none';
    this.full.style.display = this.isEmpty ? 'none' : 'flex';
    this.allBtn.on(!this.bird);
    this.birdBtn.classList.toggle('on', !!this.bird);
    this.birdName.textContent = this.bird ? this.name(this.bird) : this.s.t('coll.one_bird');
    this.birdBtn.disabled = this.birds().length === 0;
    this.actions[0].text(s.t(this.selecting ? 'coll.done' : 'coll.select')).on(this.selecting);
    this.actions[1].disabled(this.selected.size === 0);
    const n = this.selected.size;
    this.actions[2].text(s.t(!this.selecting ? 'coll.export' : this.armed ? 'coll.delete_confirm' : 'coll.delete', { n: String(n) }))
      .on(this.selecting && !!this.armed).disabled(!this.selecting || n === 0);

    const recs = this.recs.filter((r) => !this.bird || r.bird === this.bird);
    const pics = this.pics.filter((p) => !this.bird || p.bird === this.bird);
    this.recCount.textContent = String(recs.length);
    this.picCount.textContent = String(pics.length);

    this.recList.replaceChildren();
    this.recList.style.display = recs.length ? '' : 'none';
    recs.forEach((r, i) => {
      const row = box(this.recList, { height: '56px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 6px' }, 'recrow');
      if (i + 1 < recs.length) row.style.borderBottom = '1px solid var(--divider)';
      if (this.selected.has(r.id)) row.classList.add('sel');
      // Under VELG the whole row chooses (the row's own listener below).
      const pb = new Btn(row, '', () => { if (!this.selecting) this.play(r); }, { width: '44px', height: '44px', padding: '0' })
        .glyph(this.playing === r.id ? 'stop' : 'play', s.t('coll.play'));
      pb.on(this.playing === r.id);
      const img = el('img', '', row);
      Object.assign(img.style, { width: '120px', height: '40px', flex: 'none', border: '1px solid var(--ink)', background: 'var(--face)' });
      img.src = r.thumb;
      img.alt = '';
      const mid = box(row, { flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' });
      const type = s.t(`type.${kTypeIds[r.type] ?? 'song'}`);
      const len = `${Math.floor(r.seconds / 60)}:${String(r.seconds % 60).padStart(2, '0')}`;
      const head = [this.bird ? '' : this.name(r.bird, r.latin), type.charAt(0) + type.slice(1).toLocaleLowerCase('nb'), len].filter((x) => x).join(' · ');
      box(mid, { font: '500 12px var(--mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }).textContent = head;
      box(mid, { color: 'var(--inkSoft)' }).textContent = r.date;
      box(row, { font: '500 12px var(--mono)', flex: 'none' }).textContent = `${number(Math.round(r.confidence * 100), 0, s.no)} %`;
      if (this.selecting) {
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => this.toggleSelect(r.id));
      }
    });

    this.picGrid.replaceChildren();
    for (const p of pics) {
      const t = el('button', 'pictile', this.picGrid);
      t.type = 'button';
      if (this.selected.has(p.id)) t.classList.add('sel');
      const url = URL.createObjectURL(p.image);
      this.urls.push(url);
      t.style.backgroundImage = `url("${url}")`;
      const [, m, d] = p.date.slice(0, 10).split('-');
      el('span', '', t, `${d}.${m}`);
      t.addEventListener('click', () => { if (this.selecting) this.toggleSelect(p.id); else this.viewer.open(pics.slice(), p.id); });
    }
    const add = el('button', 'btn newpic', this.picGrid);
    add.type = 'button';
    el('span', 'plus', add, '+');
    el('span', '', add, s.t('phone.coll.new_picture'));
    add.addEventListener('click', () => this.fileIn.click());
    this.on.refresh();
  }

  statusText(): string {
    const s = this.s;
    if (this.message) return this.message;
    const recs = this.recs.filter((r) => !this.bird || r.bird === this.bird).length;
    const pics = this.pics.filter((p) => !this.bird || p.bird === this.bird).length;
    const counts = s.t('coll.counts', { r: String(recs), p: String(pics) });
    return this.bird ? `${upper(this.name(this.bird))}, ${counts}` : counts;
  }
}
