// COLLECTION (F6) on the desktop, from design/DeskCollection.dc.html. The
// whole body: a bird list on the left with recording and picture counts,
// then the bird's name, IMPORT FROM PHONE EXPORT, ADD FILES and EXPORT; the
// recordings as a list on sheet (play, sonogram, heard, length, date, match,
// from) with COMPARE WITH PIPP, OPEN IN PLAY, SHOW IN FINDER and DELETE under
// it; the pictures in a 3-column grid with ADD PICTURE last.
//
// The Mac has no recognition, so everything here comes from the phone export
// (prd.md, Phone export) or from files added by hand. Same store as the
// phone (listen/store.ts): in a browser, the browser's IndexedDB.
//
// My choices, not in the design: ALL BIRDS shows every bird, and the last
// column (FROM) then reads BIRD and names it. A row is chosen by a click; the buttons under the list
// act on it. DELETE asks once more (DELETE 1?) as on the phone. SHOW IN
// FINDER is hatched in a browser. COMPARE WITH PIPP plays the recording, then
// Pipp's bird sings one phrase of the same type. A picture opens the viewer
// from the phone. ADD FILES and ADD PICTURE file what they add under the
// bird shown, or the Play bird under ALL BIRDS.

import { hasSound, index, type IndexBird } from '../data.ts';
import { buildExport } from '../listen/export.ts';
import { addFiles, importExport, ImportError } from '../listen/import.ts';
import { deletePicture, deleteRecording, pictures, recordings, type Picture, type Recording } from '../listen/store.ts';
import { Btn, box, el, number } from './dom.ts';
import { upper, type Strings } from './strings.ts';
import { PictureViewer } from './viewer.ts';

const kTypeIds = ['song', 'call', 'alarm', 'flight'] as const;
// The design's columns (32 168 70 60 150 60 and FROM, gap 12) add up to more
// than the 608px the list has, so FROM had no room: narrower here, same order.
const kCols = '24px 160px 56px 44px 126px 40px minmax(0, 1fr)';
const kArmMs = 4000;

export interface DeskCollectionHandlers {
  refresh(): void;
  playBird(): string;
  openPlay(id: string): void;
  sing(id: string, type: number): void;
}

export class DeskCollectionScreen {
  readonly root: HTMLDivElement;
  private recs: Recording[] = [];
  private pics: Picture[] = [];
  private bird = '';            // '' shows all birds
  private chosen = '';          // the chosen recording's id
  private player: HTMLAudioElement | null = null;
  private playing = '';
  private urls: string[] = [];
  private message = '';
  private busy = false;
  private armed = 0;            // timer id while DELETE waits for its second press
  private viewer: PictureViewer;

  private listLabel: HTMLSpanElement;
  private listCounts: HTMLSpanElement;
  private list: HTMLDivElement;
  private title: HTMLSpanElement;
  private sub: HTMLSpanElement;
  private importBtn: Btn;
  private addBtn: Btn;
  private exportBtn: Btn;
  private recLabel: HTMLSpanElement;
  private recCount: HTMLSpanElement;
  private recHead: HTMLDivElement;
  private recRows: HTMLDivElement;
  private compareBtn: Btn;
  private openBtn: Btn;
  private finderBtn: Btn;
  private deleteBtn: Btn;
  private picLabel: HTMLSpanElement;
  private picCount: HTMLSpanElement;
  private picGrid: HTMLDivElement;
  private note: HTMLParagraphElement;
  private zipIn: HTMLInputElement;
  private filesIn: HTMLInputElement;
  private picIn: HTMLInputElement;

  constructor(parent: HTMLElement, private s: Strings, private on: DeskCollectionHandlers) {
    const root = box(parent, { position: 'absolute', left: '0', top: '0', width: '1280px', height: '100%', display: 'none' });
    this.root = root;
    const input = (accept: string, multiple: boolean, f: (i: HTMLInputElement) => void) => {
      const i = el('input', '', root);
      Object.assign(i, { type: 'file', accept, multiple });
      i.style.display = 'none';
      i.addEventListener('change', () => { f(i); });
      return i;
    };
    this.zipIn = input('.zip,application/zip', false, (i) => void this.importZip(i));
    this.filesIn = input('audio/*,image/*,.m4a,.webm', true, (i) => void this.add(i));
    this.picIn = input('image/*', true, (i) => void this.add(i));

    // ---------------------------------------------------------- bird list
    const aside = el('div', 'aside', root);
    const lh = box(aside, { display: 'flex', alignItems: 'center', gap: '6px', height: '14px' });
    this.listLabel = el('span', '', lh);
    Object.assign(this.listLabel.style, { font: '600 10px/14px var(--mono)', letterSpacing: '0.14em', color: 'var(--inkSoft)' });
    box(lh, { flex: '1', height: '1px', background: 'var(--ink)' });
    this.listCounts = el('span', '', lh);
    Object.assign(this.listCounts.style, { font: '500 10px/14px var(--mono)', letterSpacing: '0.06em' });
    this.list = el('div', 'birdlist sheet', aside);

    // ---------------------------------------------------------- main
    const main = box(root, { flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px' });
    const head = box(main, { display: 'flex', alignItems: 'center', gap: '12px' });
    this.title = el('span', '', head);
    Object.assign(this.title.style, { font: '400 28px/1 var(--serif)', whiteSpace: 'nowrap' });
    this.sub = el('span', '', head);
    Object.assign(this.sub.style, { color: 'var(--inkSoft)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: '0' });
    box(head, { flex: '1' });
    const hb = { height: '24px', padding: '0 10px' };
    this.importBtn = new Btn(head, '', () => this.zipIn.click(), hb);
    this.addBtn = new Btn(head, '', () => this.filesIn.click(), hb);
    this.exportBtn = new Btn(head, '', () => void this.exportZip(), hb);

    const cols = box(main, { flex: '1', minHeight: '0', display: 'flex', gap: '12px' });
    const recSec = box(cols, { flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '6px' });
    const rh = box(recSec, { display: 'flex', alignItems: 'center', gap: '6px', height: '14px' });
    this.recLabel = el('span', '', rh);
    Object.assign(this.recLabel.style, { font: '600 10px/14px var(--mono)', letterSpacing: '0.14em', color: 'var(--inkSoft)' });
    box(rh, { flex: '1', height: '1px', background: 'var(--ink)' });
    this.recCount = el('span', '', rh);
    Object.assign(this.recCount.style, { font: '500 10px/14px var(--mono)', letterSpacing: '0.06em' });
    const sheet = box(recSec, { flex: '1', minHeight: '0', display: 'flex', flexDirection: 'column', fontSize: '13px' }, 'sheet');
    this.recHead = box(sheet, {
      height: '24px', flex: 'none', display: 'grid', gridTemplateColumns: kCols, columnGap: '10px', alignItems: 'center', padding: '0 8px',
      background: 'var(--panel)', borderBottom: '1px solid var(--ink)', font: '600 9px/12px var(--mono)', letterSpacing: '0.14em', color: 'var(--inkSoft)',
    });
    this.recRows = box(sheet, { flex: '1', minHeight: '0', overflowY: 'auto', scrollbarWidth: 'thin' });
    const acts = box(recSec, { display: 'flex', gap: '6px' });
    this.compareBtn = new Btn(acts, '', () => this.compare(), hb);
    this.openBtn = new Btn(acts, '', () => { const r = this.chosenRec(); if (r) this.on.openPlay(r.bird); }, hb);
    this.finderBtn = new Btn(acts, '', undefined, hb).disabled(true); // no Finder from a browser
    this.deleteBtn = new Btn(acts, '', () => void this.remove(), hb);

    const picSec = box(cols, { width: '404px', flex: 'none', display: 'flex', flexDirection: 'column', gap: '6px', minHeight: '0' });
    const ph = box(picSec, { display: 'flex', alignItems: 'center', gap: '6px', height: '14px' });
    this.picLabel = el('span', '', ph);
    Object.assign(this.picLabel.style, { font: '600 10px/14px var(--mono)', letterSpacing: '0.14em', color: 'var(--inkSoft)' });
    box(ph, { flex: '1', height: '1px', background: 'var(--ink)' });
    this.picCount = el('span', '', ph);
    Object.assign(this.picCount.style, { font: '500 10px/14px var(--mono)', letterSpacing: '0.06em' });
    this.picGrid = box(picSec, { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gridAutoRows: '124px', gap: '6px', overflowY: 'auto', minHeight: '0', scrollbarWidth: 'thin' });

    this.note = el('p', '', main);
    Object.assign(this.note.style, { margin: '0', color: 'var(--inkSoft)' });

    this.viewer = new PictureViewer(root, s, {
      name: (bird) => this.name(bird),
      share: (p) => this.download(new File([p.image], `pipp-${p.bird || 'bird'}-${p.date.replace(/[: ]/g, '-')}.${p.image.type.includes('png') ? 'png' : 'jpg'}`, { type: p.image.type })),
      remove: async (p) => { await deletePicture(p.id); await this.load(); },
    });
  }

  show(on: boolean) {
    this.root.style.display = on ? 'flex' : 'none';
    if (on) void this.load();
    else { this.stopAudio(); this.viewer.close(); this.disarm(); this.message = ''; }
  }

  async load() {
    try {
      [this.recs, this.pics] = await Promise.all([recordings(), pictures()]);
    } catch (e) {
      this.message = String(e);
    }
    if (!this.recs.some((r) => r.id === this.chosen)) this.chosen = '';
    this.render();
  }

  private entry(id: string): IndexBird | undefined { return index.birds.find((b) => b.id === id); }
  private name(id: string, latin = ''): string {
    const b = this.entry(id);
    return b ? (this.s.no ? b.name.no : b.name.en) : latin || this.s.t('coll.outside');
  }
  private shownRecs(): Recording[] { return this.recs.filter((r) => !this.bird || r.bird === this.bird); }
  private shownPics(): Picture[] { return this.pics.filter((p) => !this.bird || p.bird === this.bird); }
  private chosenRec(): Recording | undefined { return this.shownRecs().find((r) => r.id === this.chosen); }

  // Up and Down in the bird list: ALL BIRDS, then every bird in index order.
  step(dir: number) {
    const ids = ['', ...index.birds.map((b) => b.id)];
    const i = ids.indexOf(this.bird);
    const n = Math.min(ids.length - 1, Math.max(0, i + dir));
    if (n !== i) this.setBird(ids[n]);
  }

  private setBird(id: string) {
    this.bird = id;
    this.message = '';
    this.disarm();
    if (!this.chosenRec()) this.chosen = '';
    this.render(true);
  }

  private stopAudio() {
    this.player?.pause();
    this.player = null;
    this.playing = '';
  }

  private play(r: Recording, then?: () => void) {
    const again = this.playing === r.id && !then;
    this.stopAudio();
    if (again) { this.render(); return; }
    const url = URL.createObjectURL(r.audio);
    const p = new Audio(url);
    this.player = p;
    this.playing = r.id;
    const end = () => {
      URL.revokeObjectURL(url);
      if (this.player !== p) return;
      this.playing = '';
      this.render();
      then?.();
    };
    p.onended = end;
    void p.play().catch(() => { this.message = this.s.t('coll.cannot_play'); end(); });
    this.render();
  }

  // COMPARE WITH PIPP: the recording, then Pipp's bird, one phrase.
  private compare() {
    const r = this.chosenRec();
    if (!r || !hasSound(r.bird)) return;
    this.play(r, () => this.on.sing(r.bird, r.type));
  }

  private disarm() {
    if (this.armed) clearTimeout(this.armed);
    this.armed = 0;
  }

  // DELETE: the first press asks (DELETE 1?), the second deletes. No undo.
  private async remove() {
    const r = this.chosenRec();
    if (!r) return;
    if (!this.armed) {
      this.armed = window.setTimeout(() => { this.armed = 0; this.render(); }, kArmMs);
      this.render();
      return;
    }
    this.disarm();
    if (this.playing === r.id) this.stopAudio();
    await deleteRecording(r.id);
    this.chosen = '';
    this.message = this.s.t('coll.deleted', { n: '1' });
    await this.load();
  }

  private async importZip(i: HTMLInputElement) {
    const f = i.files?.[0];
    i.value = '';
    if (!f || this.busy) return;
    this.busy = true;
    this.message = this.s.t('coll.importing');
    this.render();
    try {
      const r = await importExport(f);
      this.message = this.s.t('coll.imported', { r: String(r.recordings), p: String(r.pictures), k: String(r.known) });
      if (r.broken) this.message += `; ${this.s.t('coll.import_broken', { n: String(r.broken) })}`;
    } catch (e) {
      const why = e instanceof ImportError ? this.s.t(e.key) : e instanceof Error ? e.message : String(e);
      this.message = this.s.t('coll.import_failed', { why });
    } finally {
      this.busy = false;
    }
    await this.load();
  }

  private async add(i: HTMLInputElement) {
    const files = i.files ? Array.from(i.files) : [];
    i.value = '';
    if (!files.length || this.busy) return;
    this.busy = true;
    try {
      const r = await addFiles(files, this.bird || this.on.playBird());
      this.message = this.s.t(r.skipped ? 'coll.added_skipped' : 'coll.added', { n: String(r.added), k: String(r.skipped) });
    } catch (e) {
      this.message = String(e);
    } finally {
      this.busy = false;
    }
    await this.load();
  }

  private download(f: File) {
    const url = URL.createObjectURL(f);
    const a = el('a', '', document.body);
    a.href = url;
    a.download = f.name;
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    this.message = this.s.t('coll.export_saved', { file: f.name });
    this.render();
  }

  // EXPORT: the same zip as the phone's, of what is shown.
  private async exportZip() {
    const recs = this.shownRecs(), pics = this.shownPics();
    if (this.busy || recs.length + pics.length === 0) return;
    this.busy = true;
    this.message = this.s.t('coll.exporting');
    this.render();
    try {
      this.download(await buildExport(recs, pics));
    } catch (e) {
      this.message = String(e);
    } finally {
      this.busy = false;
      this.render();
    }
  }

  applyStrings() {
    const s = this.s;
    this.listLabel.textContent = s.t('list.birds');
    this.listCounts.textContent = s.t('coll.rec_pic');
    this.importBtn.text(s.t('coll.import'));
    this.addBtn.text(s.t('coll.add_files'));
    this.exportBtn.text(s.t('coll.export'));
    this.recLabel.textContent = s.t('coll.recordings');
    this.picLabel.textContent = s.t('coll.pictures');
    this.recHead.replaceChildren();
    for (const k of ['', 'coll.col_sonogram', 'coll.col_heard', 'coll.col_length', 'coll.col_date', 'coll.col_match', 'coll.col_from']) el('span', '', this.recHead, k ? s.t(k) : '');
    this.compareBtn.text(s.t('coll.compare_pipp'));
    this.openBtn.text(s.t('coll.open_play'));
    this.finderBtn.text(s.t('coll.show_finder'));
    this.finderBtn.e.title = s.t('coll.finder_web');
    this.note.textContent = s.t('coll.desk_note');
    this.viewer.applyStrings();
    this.render();
  }

  private counts(id: string): string {
    const r = this.recs.filter((x) => !id || x.bird === id).length, p = this.pics.filter((x) => !id || x.bird === id).length;
    return r + p ? `${r} · ${p}` : '';
  }

  private render(scrollList = false) {
    const s = this.s;
    for (const u of this.urls) URL.revokeObjectURL(u);
    this.urls = [];

    // Bird list.
    const top = this.list.scrollTop;
    this.list.replaceChildren();
    const row = (id: string, num: string, label: string) => {
      const r = el('div', `row${id === this.bird ? ' sel' : ''}`, this.list);
      r.style.paddingRight = '8px';
      if (num) el('span', 'n', r, num);
      const n = el('span', '', r, label);
      Object.assign(n.style, { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: '0' });
      const c = el('span', '', r, this.counts(id));
      Object.assign(c.style, { marginLeft: 'auto', paddingLeft: '8px', fontSize: '11px', flex: 'none', color: id === this.bird ? 'var(--onInk)' : 'var(--inkSoft)' });
      r.addEventListener('click', () => this.setBird(id));
      return r;
    };
    const all = row('', '', s.t('coll.all_birds_row'));
    all.style.borderBottom = '1px solid var(--divider)';
    for (const g of index.groups) {
      el('div', 'gh', this.list, s.t(`group.${g}`));
      for (const b of index.birds) if (b.group === g) row(b.id, b.number, this.name(b.id));
    }
    this.list.scrollTop = top;
    if (scrollList) {
      const sel = this.list.querySelector<HTMLElement>('.row.sel');
      if (sel) {
        const y = sel.offsetTop - this.list.offsetTop, view = this.list.clientHeight;
        if (y < this.list.scrollTop + 24) this.list.scrollTop = Math.max(0, y - 24);
        else if (y + 24 > this.list.scrollTop + view) this.list.scrollTop = y + 24 - view;
      }
    }

    // Head.
    const b = this.entry(this.bird);
    this.title.textContent = b ? this.name(b.id) : s.t('coll.all_birds_row');
    this.sub.textContent = b ? `${s.no ? b.name.en : b.name.no} · ${b.latin}` : '';
    const recs = this.shownRecs(), pics = this.shownPics();
    // Under ALL BIRDS the last column names the bird instead of the source.
    const last = this.recHead.lastElementChild;
    if (last) last.textContent = s.t(this.bird ? 'coll.col_from' : 'coll.col_bird');
    this.importBtn.disabled(this.busy);
    this.addBtn.disabled(this.busy);
    this.exportBtn.disabled(this.busy || recs.length + pics.length === 0);

    // Recordings.
    this.recCount.textContent = String(recs.length);
    this.recRows.replaceChildren();
    for (const r of recs) {
      const sel = r.id === this.chosen;
      const line = box(this.recRows, {
        height: '32px', display: 'grid', gridTemplateColumns: kCols, columnGap: '10px', alignItems: 'center', padding: '0 8px',
        borderBottom: '1px solid var(--divider)', cursor: 'pointer', ...(sel ? { background: 'var(--ink)', color: 'var(--onInk)' } : {}),
      });
      line.addEventListener('click', () => { this.chosen = r.id; this.disarm(); this.render(); });
      const pb = new Btn(line, '', () => this.play(r), { width: '24px', height: '24px', padding: '0' })
        .glyph(this.playing === r.id ? 'stop' : 'play', s.t('coll.play'));
      pb.on(this.playing === r.id);
      pb.e.addEventListener('click', (e) => { this.chosen = r.id; e.stopPropagation(); });
      const well = box(line, { width: '160px', height: '24px', border: '1px solid var(--ink)', backgroundColor: 'var(--face)', boxSizing: 'border-box', overflow: 'hidden' });
      if (r.thumb) {
        const img = el('img', '', well);
        Object.assign(img.style, { width: '158px', height: '22px', display: 'block' });
        img.src = r.thumb;
        img.alt = '';
      } else well.classList.add('hatched');
      el('span', '', line, s.t(`type.${kTypeIds[r.type] ?? 'song'}`));
      el('span', '', line, r.seconds ? `${Math.floor(r.seconds / 60)}:${String(r.seconds % 60).padStart(2, '0')}` : '–');
      el('span', '', line, r.date);
      el('span', '', line, r.confidence >= 0 ? `${number(Math.round(r.confidence * 100), 0, s.no)} %` : '–');
      const from = s.t(r.from === 'file' ? 'coll.from_file' : 'coll.from_phone');
      const fc = el('span', '', line, this.bird ? from : this.name(r.bird, r.latin));
      Object.assign(fc.style, { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' });
    }
    const c = this.chosenRec();
    this.compareBtn.disabled(!c || !hasSound(c.bird));
    this.openBtn.disabled(!c || !hasSound(c.bird));
    this.deleteBtn.text(s.t(this.armed ? 'coll.delete_confirm' : 'coll.delete', { n: '1' })).on(!!this.armed).disabled(!c);

    // Pictures.
    this.picCount.textContent = String(pics.length);
    this.picGrid.replaceChildren();
    for (const p of pics) {
      const t = el('button', 'pictile', this.picGrid);
      t.type = 'button';
      t.style.height = '124px';
      const url = URL.createObjectURL(p.image);
      this.urls.push(url);
      t.style.backgroundImage = `url("${url}")`;
      const cap = el('span', '', t, this.bird ? p.date.slice(0, 10) : `${p.date.slice(0, 10)} ${this.name(p.bird)}`);
      Object.assign(cap.style, { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' });
      t.addEventListener('click', () => this.viewer.open(pics.slice(), p.id));
    }
    const add = el('button', 'btn newpic', this.picGrid);
    add.type = 'button';
    add.style.height = '124px';
    add.disabled = this.busy;
    el('span', 'plus', add, '+');
    el('span', '', add, s.t('coll.add_picture'));
    add.addEventListener('click', () => this.picIn.click());
    this.on.refresh();
  }

  statusText(): string {
    if (this.message) return this.message;
    const counts = this.s.t('coll.counts', { r: String(this.shownRecs().length), p: String(this.shownPics().length) });
    const b = this.entry(this.bird);
    return b ? `${upper(this.name(b.id))}, ${counts}` : counts;
  }
}
