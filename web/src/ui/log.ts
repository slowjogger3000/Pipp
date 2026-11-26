// The heard-it log (F5), the whole body width, from design/Log.dc.html.
// Left, 360px: the entry form (bird, date, time, place, heard, saw, note),
// ADD TO LOG, the link to Artsobservasjoner and the field manners note.
// Right: the log list on sheet, OPEN BIRD, DELETE ENTRY, EXPORT CSV.
//
// On the phone the log lives in SAMLING (design/CollectionLog.dc.html): a
// list of two-line rows, I HEARD IT: NEW LINE opens the same form above it.
//
// Entries live in localStorage under tipp.log, newest first. Heard and saw
// are stored as ids, so the language can change after an entry is made.

import { hasSound, index, type IndexBird } from '../data.ts';
import { Btn, box, el, joined, place } from './dom.ts';
import type { Strings } from './strings.ts';

const kStoreKey = 'tipp.log';
const kHeard = ['song', 'call', 'alarm', 'flight'] as const;
const kSaw = ['male', 'female', 'juvenile', 'none'] as const;
const kReportUrl = 'https://www.artsobservasjoner.no';
const kCols = '110px 60px 200px 80px 90px minmax(0, 1fr)';

type Heard = typeof kHeard[number];
type Saw = typeof kSaw[number];

export interface LogEntry {
  bird: string;   // index.json id
  date: string;   // YYYY-MM-DD
  time: string;   // HH:MM
  place: string;
  heard: Heard;
  saw: Saw;
  note: string;
  added: number;  // ms, keeps entries with the same minute in order
}

export interface LogHandlers {
  refresh(): void;
  openBird(id: string): void;
  playBird(): string;
  playType(): number;
}

const pad = (n: number) => String(n).padStart(2, '0');

function load(): LogEntry[] {
  try {
    const v = JSON.parse(localStorage.getItem(kStoreKey) ?? '[]');
    if (!Array.isArray(v)) return [];
    return v.filter((e) => e && typeof e.bird === 'string' && typeof e.date === 'string' && typeof e.time === 'string'
      && kHeard.includes(e.heard) && kSaw.includes(e.saw));
  } catch { return []; }
}

function order(a: LogEntry, b: LogEntry): number {
  const ka = `${a.date} ${a.time}`, kb = `${b.date} ${b.time}`;
  return ka < kb ? 1 : ka > kb ? -1 : b.added - a.added;
}

function validDate(s: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return false;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return d.getFullYear() === Number(m[1]) && d.getMonth() === Number(m[2]) - 1 && d.getDate() === Number(m[3]);
}

function validTime(s: string): boolean {
  const m = /^(\d{2}):(\d{2})$/.exec(s);
  return !!m && Number(m[1]) < 24 && Number(m[2]) < 60;
}

function csvCell(s: string): string {
  return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export class LogScreen {
  readonly root: HTMLDivElement;
  entries: LogEntry[] = load().sort(order);
  selected = 0;
  message = '';

  private formLabel: HTMLDivElement;
  private labels: Record<string, HTMLElement> = {};
  private birdSel: HTMLSelectElement;
  private dateIn: HTMLInputElement;
  private timeIn: HTMLInputElement;
  private placeIn: HTMLInputElement;
  private noteIn: HTMLInputElement;
  private heardBtns: Btn[];
  private sawBtns: Btn[];
  private heard: Heard = 'song';
  private saw: Saw = 'none';
  private addBtn: Btn;
  private report: HTMLAnchorElement;
  private mannersLabel: HTMLDivElement;
  private mannersText: HTMLParagraphElement;
  private listLabel: HTMLSpanElement;
  private countLabel: HTMLSpanElement;
  private listHead: HTMLDivElement;
  private rows: HTMLDivElement;
  private openBtn: Btn;
  private deleteBtn: Btn;
  private exportBtn: Btn;
  private newBtn: Btn | null = null;
  private form: HTMLDivElement;
  private formOpen = false;

  constructor(parent: HTMLElement, private s: Strings, private on: LogHandlers, readonly phone = false) {
    const root = phone ? box(parent, { display: 'none', flexDirection: 'column', gap: '12px' })
      : box(parent, { position: 'absolute', left: '8px', top: '8px', width: '1264px', height: '664px', display: 'none' });
    this.root = root;
    const bh = phone ? 44 : 24;

    // ---------------------------------------------------------- form
    if (phone) this.newBtn = new Btn(root, '', () => this.openForm(!this.formOpen), { height: '44px' });
    const left = box(root, { display: 'flex', flexDirection: 'column', gap: '12px' });
    if (!phone) place(left, 0, 0, 360, 664);
    const form = box(left, { display: 'flex', flexDirection: 'column', gap: '8px' });
    this.form = phone ? left : form;
    if (phone) left.style.display = 'none';
    this.formLabel = el('div', 'section', form);

    const field = (parentEl: HTMLElement, key: string, input: HTMLElement | null) => {
      const f = box(parentEl, { display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '0' });
      if (input) {
        const l = el('label', 'field', f);
        l.htmlFor = input.id;
        this.labels[key] = l;
        f.appendChild(input);
      } else this.labels[key] = el('span', 'field', f);
      return f;
    };
    // Typing in the form is not a shortcut: keys stay in the field, Enter
    // adds the entry, F keys still switch screens.
    const keys = (i: HTMLElement) => i.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { this.add(); e.preventDefault(); }
      e.stopPropagation();
      if (/^F[1-6]$/.test(e.key)) { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { key: e.key })); }
    });
    const input = (id: string) => {
      const i = el('input', 'input');
      i.id = id;
      i.type = 'text';
      i.autocomplete = 'off';
      i.spellcheck = false;
      keys(i);
      return i;
    };

    this.birdSel = el('select', 'input');
    this.birdSel.id = 'log-bird';
    keys(this.birdSel);
    field(form, 'bird', this.birdSel);
    const two = box(form, { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' });
    this.dateIn = input('log-date');
    this.timeIn = input('log-time');
    field(two, 'date', this.dateIn);
    field(two, 'time', this.timeIn);
    this.placeIn = input('log-place');
    field(form, 'place', this.placeIn);
    const heardF = field(form, 'heard', null);
    this.heardBtns = joined(heardF, kHeard.map((h) => ({ text: '', onClick: () => { this.heard = h; this.update(); } })), bh);
    const sawF = field(form, 'saw', null);
    this.sawBtns = joined(sawF, kSaw.map((v) => ({ text: '', onClick: () => { this.saw = v; this.update(); } })), bh);
    this.noteIn = input('log-note');
    field(form, 'note', this.noteIn);

    const actions = box(form, { display: 'flex', gap: '6px' });
    this.addBtn = new Btn(actions, '', () => this.add(), { flex: '1', height: phone ? '44px' : '32px', fontSize: '11px' });
    this.report = el('a', 'btn');
    if (!phone) actions.appendChild(this.report);
    Object.assign(this.report.style, { flex: '1', height: phone ? '44px' : '32px', textDecoration: 'none' });
    this.report.href = kReportUrl;
    this.report.target = '_blank';
    this.report.rel = 'noopener noreferrer';

    const manners = box(phone ? box(root, { display: 'contents' }) : left, { display: 'flex', flexDirection: 'column', gap: '6px' });
    this.mannersLabel = el('div', 'section', manners);
    this.mannersText = el('p', '', manners);
    Object.assign(this.mannersText.style, { margin: '0', font: '400 11px/16px var(--mono)' });

    // ---------------------------------------------------------- list
    const right = box(root, { display: 'flex', flexDirection: 'column', gap: phone ? '12px' : '6px' });
    if (phone) {
      right.style.order = '0';
      root.insertBefore(right, manners.parentElement);
    } else place(right, 372, 0, 1264 - 372, 664);
    const head = box(right, { display: 'flex', alignItems: 'center', gap: '6px', height: '14px', flex: 'none' });
    this.listLabel = el('span', 'field', head);
    Object.assign(this.listLabel.style, { fontSize: '10px', lineHeight: '14px', height: '14px' });
    box(head, { flex: '1', height: '1px', background: 'var(--ink)' });
    this.countLabel = el('span', '', head);
    Object.assign(this.countLabel.style, { font: '500 10px var(--mono)', letterSpacing: '0.06em' });

    const sheet = box(right, { flex: '1', minHeight: '0', display: 'flex', flexDirection: 'column' }, 'sheet logsheet');
    if (phone) head.style.marginBottom = '-6px'; // label row and sheet 6px apart, as a section
    this.listHead = box(sheet, { gridTemplateColumns: kCols, display: phone ? 'none' : '' }, 'logrow loghead');
    this.rows = box(sheet, phone ? {} : { flex: '1', minHeight: '0', overflowY: 'auto' }, 'logrows');

    const bottom = box(right, phone ? { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '6px' } : { display: 'flex', gap: '6px', flex: 'none' });
    const bstyle = phone ? { height: '44px', padding: '0', minWidth: '0' } : { height: '24px', padding: '0 10px' };
    this.openBtn = new Btn(bottom, '', () => this.open(), bstyle);
    this.deleteBtn = new Btn(bottom, '', () => this.remove(), bstyle);
    this.exportBtn = new Btn(bottom, '', () => this.exportCsv(), bstyle);
    if (phone) {
      right.appendChild(this.report);
      this.report.style.flex = 'none';
    }
  }

  show(on: boolean) { this.root.style.display = on ? (this.phone ? 'flex' : '') : 'none'; }

  // Phone: the form opens above the list.
  openForm(on: boolean) {
    this.formOpen = on;
    if (on) this.enter();
    this.form.style.display = on ? 'flex' : 'none';
    this.update();
  }

  // Entering the log: the form starts on the Play bird, now, and the Play
  // scene's song type. Place, note and saw stay as last typed.
  enter() {
    const now = new Date();
    this.birdSel.value = this.on.playBird();
    this.dateIn.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    this.timeIn.value = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    this.heard = kHeard[this.on.playType()] ?? 'song';
    this.message = '';
    this.update();
  }

  private name(b: IndexBird | undefined): string {
    return b ? (this.s.no ? b.name.no : b.name.en) : '';
  }

  private bird(id: string): IndexBird | undefined { return index.birds.find((b) => b.id === id); }

  private heardText(h: Heard): string { return this.s.t(`type.${h}`); }
  private sawText(v: Saw): string {
    return v === 'male' ? this.s.t('plate.male') : v === 'female' ? this.s.t('plate.female')
      : v === 'juvenile' ? this.s.t('log.saw_juvenile') : '---';
  }

  applyStrings() {
    const s = this.s;
    this.formLabel.textContent = s.t('log.form');
    for (const k of ['bird', 'date', 'time', 'place', 'heard', 'saw', 'note']) this.labels[k].textContent = s.t(`log.${k}`);
    const keep = this.birdSel.value;
    this.birdSel.replaceChildren();
    for (const b of index.birds) {
      const o = el('option', '', this.birdSel, `${b.number} ${this.name(b)}`);
      o.value = b.id;
    }
    this.birdSel.value = keep || this.on.playBird();
    this.placeIn.placeholder = s.t('log.place_hint');
    this.noteIn.placeholder = s.t('log.note_hint');
    kHeard.forEach((h, i) => this.heardBtns[i].text(this.heardText(h)));
    this.sawBtns.forEach((b, i) => b.text(kSaw[i] === 'none' ? s.t('log.saw_none') : this.sawText(kSaw[i])));
    this.addBtn.text(s.t('log.add'));
    this.report.textContent = s.t('log.report');
    this.mannersLabel.textContent = s.t('log.manners');
    this.mannersText.textContent = s.t('log.manners_text');
    this.listLabel.textContent = s.t('log.list');
    this.listHead.replaceChildren();
    for (const k of ['log.date', 'log.time', 'log.bird', 'log.heard', 'log.saw', 'log.col_place_note']) el('span', '', this.listHead, s.t(k));
    this.openBtn.text(s.t('log.open'));
    this.deleteBtn.text(s.t('log.delete'));
    this.exportBtn.text(s.t('log.export'));
    this.newBtn?.text(s.t('phone.log.new'));
    this.update();
  }

  update() {
    const s = this.s;
    this.heardBtns.forEach((b, i) => b.on(kHeard[i] === this.heard));
    this.sawBtns.forEach((b, i) => b.on(kSaw[i] === this.saw));
    const heardBirds = new Set(this.entries.map((e) => e.bird)).size;
    this.countLabel.textContent = s.t('log.heard_count', { n: String(heardBirds), total: String(index.birds.length) });

    this.rows.replaceChildren();
    this.newBtn?.on(this.formOpen);
    this.entries.forEach((e, i) => {
      const pn = [e.place, e.note].filter((t) => t.trim()).join(', ');
      if (this.phone) {
        // Two lines: bird and what was heard and seen, then when and where.
        const row = box(this.rows, {}, i === this.selected ? 'plogrow sel' : 'plogrow');
        const a = el('span', '', row), b = el('span', 'soft', row);
        el('span', 'pbird', a, this.name(this.bird(e.bird)) || e.bird);
        el('span', 'ptag', a, `${this.heardText(e.heard)} · ${this.sawText(e.saw)}`);
        el('span', '', b, `${e.date} ${e.time}`);
        el('span', '', b, pn);
        row.addEventListener('click', () => { this.selected = i; this.message = ''; this.update(); this.on.refresh(); });
        return;
      }
      const row = box(this.rows, { gridTemplateColumns: kCols }, i === this.selected ? 'logrow sel' : 'logrow');
      for (const t of [e.date, e.time, this.name(this.bird(e.bird)) || e.bird, this.heardText(e.heard), this.sawText(e.saw), pn]) el('span', '', row, t);
      row.addEventListener('click', () => { this.selected = i; this.message = ''; this.update(); this.on.refresh(); });
      row.addEventListener('dblclick', () => this.open());
    });
    // The faint line under the last entry, as in the design.
    if (!this.phone || this.entries.length === 0) {
      const blank = box(this.rows, { gridTemplateColumns: kCols }, this.phone ? 'plogrow blank' : 'logrow blank');
      if (this.phone) blank.textContent = '---';
      else for (const t of ['----------', '-----', '---', '---', '---', '---']) el('span', '', blank, t);
    }

    const sel = this.entries[this.selected];
    this.openBtn.disabled(!sel || !hasSound(sel.bird));
    this.deleteBtn.disabled(!sel);
    this.exportBtn.disabled(this.entries.length === 0);
  }

  private save() {
    localStorage.setItem(kStoreKey, JSON.stringify(this.entries));
  }

  add() {
    const date = this.dateIn.value.trim(), time = this.timeIn.value.trim();
    if (!validDate(date)) { this.message = this.s.t('log.bad_date'); this.on.refresh(); this.dateIn.focus(); return; }
    if (!validTime(time)) { this.message = this.s.t('log.bad_time'); this.on.refresh(); this.timeIn.focus(); return; }
    const entry: LogEntry = {
      bird: this.birdSel.value, date, time, place: this.placeIn.value.trim(), heard: this.heard, saw: this.saw,
      note: this.noteIn.value.trim(), added: Date.now(),
    };
    this.entries.push(entry);
    this.entries.sort(order);
    this.selected = this.entries.indexOf(entry);
    this.save();
    this.noteIn.value = '';
    if (this.phone) { this.formOpen = false; this.form.style.display = 'none'; }
    this.message = this.s.t('log.added', { bird: this.name(this.bird(entry.bird)) });
    this.update();
    this.scrollToSelected();
    this.on.refresh();
  }

  remove() {
    const e = this.entries[this.selected];
    if (!e) return;
    this.entries.splice(this.selected, 1);
    this.selected = Math.min(this.selected, Math.max(0, this.entries.length - 1));
    this.save();
    this.message = this.s.t('log.deleted', { bird: this.name(this.bird(e.bird)) });
    this.update();
    this.on.refresh();
  }

  open() {
    const e = this.entries[this.selected];
    if (e && hasSound(e.bird)) this.on.openBird(e.bird);
  }

  step(dir: number) {
    if (this.entries.length === 0) return;
    this.selected = Math.max(0, Math.min(this.entries.length - 1, this.selected + dir));
    this.message = '';
    this.update();
    this.scrollToSelected();
    this.on.refresh();
  }

  private scrollToSelected() {
    (this.rows.children[this.selected] as HTMLElement | undefined)?.scrollIntoView({ block: 'nearest' });
  }

  // CSV in the language shown, with the Latin name for reporting. A BOM so
  // spreadsheet apps read æ, ø and å.
  exportCsv() {
    const s = this.s;
    const head = ['log.date', 'log.time', 'log.bird', 'log.csv_bird_latin', 'log.heard', 'log.saw', 'log.place', 'log.note'].map((k) => s.t(k));
    const lines = [head, ...this.entries.map((e) => {
      const b = this.bird(e.bird);
      return [e.date, e.time, this.name(b) || e.bird, b?.latin ?? '', this.heardText(e.heard), e.saw === 'none' ? '' : this.sawText(e.saw), e.place, e.note];
    })].map((r) => r.map(csvCell).join(','));
    const blob = new Blob(['﻿' + lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const now = new Date();
    const a = el('a');
    a.href = URL.createObjectURL(blob);
    a.download = `tipp-log-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  statusText(): string {
    if (this.message) return this.message;
    const n = this.entries.length;
    return n === 1 ? this.s.t('log.entries_one') : this.s.t('log.entries', { n: String(n) });
  }
}
