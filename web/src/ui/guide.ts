// The Field guide (F2), right of the bird list. On the phone (BOK) the same
// parts stack in one 358px column, as design/PhoneGuide.dc.html. Layout follows
// standalone/Source/UI/GuideScreen.cpp and design/Guide.dc.html. Left,
// 360px: plate with sex and age toggles, the male and female table, field
// facts. Right: song notes with an example phrase and the four song types,
// the year in Norway, lookalikes with COMPARE.
//
// Text comes from data/birds/<id>/bird.json and the plate callouts in
// plate.json. A field that is not verified carries [TO VERIFY]. The screen
// only draws and reports clicks; the app sends everything to the engine.

import type { AudioHost } from '../audio/host.ts';
import type { PhraseView, Ptr } from '../core/pipp.ts';
import { birdFile, index, hasSound, type IndexBird } from '../data.ts';
import { Btn, Canvas, box, colour, el, font, graphPaper, hatch, joined, number, place, textWidth } from './dom.ts';
import { Plate } from './plate.ts';
import { lower, upper, type Strings } from './strings.ts';

type Text = { en?: string; no?: string; verified?: boolean };
type Info = Record<string, any>; // bird.json

const kTypeIds = ['song', 'call', 'alarm', 'flight'] as const;
const kFactIds = ['length', 'broods', 'range', 'habitat', 'food', 'status', 'nest'] as const;
const kRowH = 22;
const kTypeRowH = 28;
const kLookRowH = 46;
const kLabelCol = 96;
const kYearLabelCol = 88;
const kLine = 16;
const kW = 1024, kH = 664, kLeftW = 360, kRightX = 372, kRightW = kW - kRightX;
// Season buttons: first month and month count. Winter is split over the
// year's two ends, as in the design.
const kSeasonStart = [0, 2, 5, 8, 11];
const kSeasonSpan = [2, 3, 3, 3, 1];
const kSeasonValue = [3, 0, 1, 2, 3]; // sc_season: spring, summer, autumn, winter
const kSeasonKeys = ['season.winter', 'season.spring', 'season.summer', 'season.autumn', 'season.winter_short'];

export interface GuideState {
  sex: number;
  age: number;
  season: number;
  type: number;
  comparing: string; // id of the lookalike being compared, empty if none
}

export interface GuideHandlers {
  sex(v: number): void;
  age(v: number): void;
  season(v: number): void;
  playType(t: number): void;
  compare(id: string): void;
}

function sentenceCase(s: string): string {
  if (!s) return s;
  const l = lower(s);
  return upper(l.slice(0, 1)) + l.slice(1);
}

// Greedy word wrap in a canvas font. Keeps explicit line breaks.
function wrap(f: string, text: string, width: number): string[] {
  const lines: string[] = [];
  for (const para of text.split('\n')) {
    let line = '';
    for (const word of para.split(' ').filter((w) => w)) {
      const c = line ? `${line} ${word}` : word;
      if (line && textWidth(f, c) > width) {
        lines.push(line);
        line = word;
      } else line = c;
    }
    lines.push(line);
  }
  return lines;
}

const kBody = font(11, 400);

export class GuideScreen {
  readonly root: HTMLDivElement;
  readonly plate: Plate;
  private info: Info = {};
  private plateDoc: { callouts?: { id: string; [v: string]: unknown }[] } = {};
  private entry: IndexBird | undefined;
  private bird: Ptr = 0;
  private example: PhraseView | null = null;
  private examples = new Map<string, PhraseView | null>();
  private state: GuideState = { sex: 0, age: 0, season: 0, type: 0, comparing: '' };

  // Left column.
  private platePanel: HTMLDivElement;
  private nameEl: HTMLDivElement;
  private sexBtns: Btn[];
  private ageBtns: Btn[];
  private plateWell: HTMLDivElement;
  private plateCap: HTMLDivElement;
  private mfLabel: HTMLDivElement;
  private mfTable: HTMLDivElement;
  private factsLabel: HTMLDivElement;
  private factsTable: HTMLDivElement;

  // Right column.
  private notesLabel: HTMLDivElement;
  private fig: Canvas;
  private figCap: HTMLDivElement;
  private notesText: HTMLDivElement;
  private typesTable: HTMLDivElement;
  private typeBtns: Btn[] = [];
  private yearLabel: HTMLDivElement;
  private year: Canvas;
  private seasonBtns: Btn[] = [];
  private yearNote: HTMLDivElement;
  private lookLabel: HTMLDivElement;
  private lookArea: HTMLDivElement;
  private compareBtns: { id: string; b: Btn }[] = [];
  private yearW = kRightW;
  private yearLabelCol = kYearLabelCol;
  private seasonH = 24;

  constructor(parent: HTMLElement, private host: AudioHost, private s: Strings, private on: GuideHandlers, readonly phone = false) {
    if (phone) {
      this.yearW = 358;
      this.yearLabelCol = 64;
      this.seasonH = 44;
    }
    const root = phone ? box(parent, { display: 'none', flexDirection: 'column', gap: '12px' }, 'pguide')
      : box(parent, { position: 'absolute', left: '8px', top: '8px', width: `${kW}px`, height: `${kH}px`, display: 'none' });
    this.root = root;

    // ---------------------------------------------------------- plate panel
    this.platePanel = box(root, { border: '1px solid var(--ink)', display: 'flex', flexDirection: 'column' });
    const ph = el('div', 'panelhead', this.platePanel);
    ph.style.gap = '8px';
    this.nameEl = el('div', 'title', ph);
    this.nameEl.style.flex = '1';
    this.sexBtns = joined(ph, [0, 1].map((v) => ({ text: '', width: 56, onClick: () => on.sex(v) })));
    this.ageBtns = joined(ph, [{ text: '', width: 44, onClick: () => on.age(0) }, { text: '', width: 36, onClick: () => on.age(1) }]);
    this.plateWell = box(this.platePanel, phone ? { height: '216px', padding: '2px', boxShadow: 'var(--inset)' } : { flex: '1', padding: '2px', boxShadow: 'var(--inset)' }, 'paper');
    this.plate = new Plate(this.plateWell, phone ? 352 : 354, phone ? 212 : 200, s);
    this.plateCap = box(this.platePanel, { height: '18px', flex: 'none', borderTop: '1px solid var(--ink)', padding: '0 8px' }, 'cap');
    const sec = () => (phone ? box(root, { display: 'flex', flexDirection: 'column', gap: '6px' }) : root);
    let at = sec();
    this.mfLabel = el('div', 'section', at);
    this.mfTable = el('div', 'gtable well', at);
    at = sec();
    this.factsLabel = el('div', 'section', at);
    this.factsTable = el('div', 'gtable well', at);

    // ---------------------------------------------------------- song notes
    at = sec();
    this.notesLabel = el('div', 'section', at);
    const figWrap = box(at, phone ? { alignSelf: 'center' } : {});
    this.fig = new Canvas(figWrap, 350, 180);
    this.figCap = box(at, {}, 'cap');
    Object.assign(this.figCap.style, { lineHeight: '12px', display: 'flex', alignItems: 'center' });
    this.notesText = box(at, { font: `400 11px/${kLine}px var(--mono)`, overflow: 'hidden', whiteSpace: 'pre-wrap' });
    this.typesTable = el('div', 'gtable well', at);
    if (!phone) {
      place(this.notesLabel, kRightX, 0, kRightW, 14);
      place(figWrap, kRightX, 20, 350, 180);
      place(this.figCap, kRightX, 20 + 184, kRightW, 12);
      place(this.notesText, kRightX + 366, 20, kRightW - 366, 196);
      place(this.typesTable, kRightX, 222, kRightW, 2 + 4 * kTypeRowH);
    }
    for (let i = 0; i < 4; i++) {
      const row = box(this.typesTable, { height: `${phone ? 56 : kTypeRowH}px` }, `grow${i < 3 ? ' rule' : ''}`);
      const b = new Btn(row, '', () => on.playType(i), phone ? { width: '44px', height: '44px', padding: '0', margin: '0 8px 0 6px' }
        : { width: '24px', height: '24px', padding: '0', margin: '0 8px 0 2px' }).glyph('play', 'Play');
      this.typeBtns.push(b);
      el('span', 'tname', row);
      el('span', 'tval', row);
    }

    // ---------------------------------------------------------- year
    at = sec();
    this.yearLabel = el('div', 'section', at);
    const yh = 80 + this.seasonH - 24;
    const yearWrap = box(at, phone ? { position: 'relative', height: `${yh}px` } : {});
    if (!phone) {
      place(this.yearLabel, kRightX, 348, kRightW, 14);
      place(yearWrap, kRightX, 368, kRightW, 80);
    }
    this.year = new Canvas(yearWrap, this.yearW, yh);
    const monthW = (this.yearW - 1 - this.yearLabelCol) / 12;
    for (let i = 0; i < 5; i++) {
      const xa = this.yearLabelCol + Math.round(kSeasonStart[i] * monthW);
      const xb = this.yearLabelCol + Math.round((kSeasonStart[i] + kSeasonSpan[i]) * monthW) + 1;
      const b = new Btn(yearWrap, '', () => on.season(kSeasonValue[i]));
      place(b.e, xa, 0, xb - xa, this.seasonH);
      if (phone) b.e.style.letterSpacing = '0';
      this.seasonBtns.push(b);
    }
    this.yearNote = box(at, { font: `400 11px/${kLine}px var(--mono)`, overflow: 'hidden' });
    if (phone) this.yearNote.style.paddingLeft = `${this.yearLabelCol}px`;

    // ---------------------------------------------------------- lookalikes
    at = sec();
    this.lookLabel = el('div', 'section', at);
    this.lookArea = box(at, {});

    this.layoutLeft(0);
  }

  get visible(): boolean { return this.root.style.display !== 'none'; }
  show(on: boolean) {
    this.root.style.display = on ? (this.phone ? 'flex' : '') : 'none';
    if (on) this.paint();
  }

  resize(scale: number) {
    this.plate.cv.resize(scale);
    this.fig.resize(scale);
    this.year.resize(scale);
    this.plate.paint(true);
    this.paint();
  }

  // The left column from the bottom: facts, then male and female, then
  // the plate takes the rest.
  private layoutLeft(callouts: number) {
    if (this.phone) return;
    const factsH = 2 + kRowH * 10;
    let y = kH - factsH;
    place(this.factsTable, 0, y, kLeftW, factsH);
    y -= 6 + 14;
    place(this.factsLabel, 0, y, kLeftW, 14);
    y -= 8;
    const mfH = 2 + kRowH * (callouts + 2);
    y -= mfH;
    place(this.mfTable, 0, y, kLeftW, mfH);
    y -= 6 + 14;
    place(this.mfLabel, 0, y, kLeftW, 14);
    y -= 8;
    place(this.platePanel, 0, 0, kLeftW, y);
    this.plate.cv.setSize(kLeftW - 2 - 4, Math.max(40, y - 2 - 28 - 18 - 4), this.plate.cv.stageScale);
  }

  // An example phrase of the song for the figure, from a throwaway engine
  // with seed 1 at the bird's own knob values, as GuideScreen::examplePhrase.
  private examplePhrase(id: string, bird: Ptr): PhraseView | null {
    if (this.examples.has(id)) return this.examples.get(id)!;
    const t = this.host.pipp, x = t.x;
    const e = x.pipp_engine_new();
    x.pipp_engine_prepare(e, 48000);
    x.pipp_engine_set_seed(e, 1);
    x.pipp_engine_set_bird(e, bird);
    x.pipp_engine_set_param(e, t.index('sc_type'), 0);
    x.pipp_engine_set_param(e, t.index('pb_play'), 1);
    const buf = t.alloc(512 * 4);
    let view: PhraseView | null = null;
    for (let block = 0; block < 400 && !view; block++) { // about 4 s
      x.pipp_engine_process(e, buf, buf, 512);
      if (x.pipp_engine_phrases(e) > 0) view = t.phrase(e);
    }
    t.free(buf);
    x.pipp_engine_free(e);
    this.examples.set(id, view);
    return view;
  }

  setBird(id: string) {
    this.entry = index.birds.find((b) => b.id === id);
    this.bird = this.host.birds.get(id) ?? 0;
    try { this.info = JSON.parse(birdFile(id, 'bird') ?? '{}'); } catch { this.info = {}; }
    try { this.plateDoc = JSON.parse(birdFile(id, 'plate') ?? '{}'); } catch { this.plateDoc = {}; }
    this.plate.load(id);
    this.example = this.bird ? this.examplePhrase(id, this.bird) : null;
    this.layoutLeft(this.plateDoc.callouts?.length ?? 0);

    this.lookArea.replaceChildren();
    this.compareBtns = [];
    const looks: { id?: string; name?: Text; text?: Text }[] = this.info.lookalikes ?? [];
    looks.forEach((l, i) => {
      const row = box(this.lookArea, this.phone ? {} : { height: `${kLookRowH}px` }, `look${i + 1 < looks.length ? ' rule' : ''}`);
      el('div', 'lname', row);
      el('div', 'lother', row);
      el('div', 'ltext', row);
      const id = l.id ?? '';
      const b = new Btn(row, '', () => this.on.compare(id), this.phone ? { height: '44px', padding: '0 10px', gridArea: 'btn' }
        : { position: 'absolute', right: '0', top: `${(kLookRowH - 1 - 24) / 2}px`, width: '84px', height: '24px' });
      b.disabled(!id || !hasSound(id));
      this.compareBtns.push({ id, b });
    });
    this.applyStrings();
  }

  setState(st: GuideState) {
    this.state = st;
    this.refresh();
  }

  private field(f: Text | undefined): string { return this.s.field(f); }

  private calloutValue(c: Record<string, unknown>, variant: string): string {
    const v = (c[variant] ?? {}) as Text;
    const text = sentenceCase(v[this.s.lang] ?? '');
    if (v.verified) return text;
    const m = this.s.t('to_verify');
    return text ? `${text} ${m}` : m;
  }

  private otherName(l: { id?: string; name?: Text }, no: boolean): string {
    const b = index.birds.find((e) => e.id === l.id);
    if (b) return no ? b.name.no : b.name.en;
    return (no ? l.name?.no : l.name?.en) ?? '';
  }

  // A table row: label column, then one or more values.
  private row(table: HTMLElement, key: string, values: string[], last: boolean) {
    const r = box(table, this.phone ? {} : { height: `${kRowH}px` }, `grow${last ? '' : ' rule'}`);
    const k = el('span', 'tkey', r, key);
    k.style.width = `${this.phone && values.length > 1 ? 84 : kLabelCol}px`;
    for (const v of values) el('span', 'tcell', r, v).title = v;
  }

  applyStrings() {
    const s = this.s;
    this.sexBtns[0].text(s.t('plate.male'));
    this.sexBtns[1].text(s.t('plate.female'));
    this.ageBtns[0].text(s.t('plate.adult'));
    this.ageBtns[1].text(s.t('plate.juv'));
    this.seasonBtns.forEach((b, i) => b.text(s.t(kSeasonKeys[i])));
    for (const c of this.compareBtns) c.b.text(s.t('guide.compare'));
    this.mfLabel.textContent = s.t('guide.male_female');
    this.factsLabel.textContent = s.t('guide.facts');
    this.notesLabel.textContent = s.t('guide.song_notes');
    this.yearLabel.textContent = s.t('guide.year');
    this.lookLabel.textContent = s.t('guide.lookalikes');
    if (!this.entry) return;
    const no = s.no, info = this.info;

    // Name, shrunk to fit the head.
    const name = no ? this.entry.name.no : this.entry.name.en;
    this.nameEl.textContent = name;
    let size = 22;
    const avail = (this.phone ? 358 : kLeftW) - 2 - 16 - 111 - 8 - 79 - 8;
    while (size > 13 && textWidth(font(size, 400, true), name) > avail) size--;
    this.nameEl.style.fontSize = `${size}px`;

    // Male and female, adults. Rows are the plate's callouts plus song.
    const mf = this.mfTable;
    mf.replaceChildren();
    const head = box(mf, { height: `${this.phone ? 28 : kRowH}px` }, 'grow ghead');
    box(head, { width: `${this.phone ? 84 : kLabelCol}px`, flex: 'none' });
    el('span', 'tcell', head, s.t('plate.male'));
    el('span', 'tcell', head, s.t('plate.female'));
    for (const c of this.plateDoc.callouts ?? [])
      this.row(mf, s.t(`plate.${c.id}`), [this.calloutValue(c, 'male'), this.calloutValue(c, 'female')], false);
    this.row(mf, s.t('guide.song_row'), [this.field(info.sings?.male), this.field(info.sings?.female)], true);

    // Field facts. The names are not checked against Artsdatabanken yet.
    const ft = this.factsTable;
    ft.replaceChildren();
    const mark = index.verified_names ? '' : ` ${s.t('to_verify')}`;
    this.row(ft, s.t('fact.norwegian'), [this.entry.name.no + mark], false);
    this.row(ft, s.t('fact.english'), [this.entry.name.en + mark], false);
    this.row(ft, s.t('fact.latin'), [this.entry.latin + mark], false);
    kFactIds.forEach((id, i) => this.row(ft, s.t(`fact.${id}`), [this.field(info.facts?.[id])], i === 6));

    // Figure caption and the link to real recordings.
    this.figCap.replaceChildren();
    el('b', '', this.figCap, `${s.t('fig')} 2`);
    const tempo = this.bird ? Math.max(0.25, this.host.pipp.x.pipp_bird_base(this.bird, 5) / 100) : 1;
    const ex = this.example;
    const capText = el('span', '', this.figCap, ex && ex.notes.length ? s.t('guide.fig_phrase', { s: number(ex.lengthMs / tempo / 1000, 1, no) }) : '');
    capText.style.flex = '1';
    const url = String(info.xeno_canto ?? '');
    const link = el('a', 'xeno', this.figCap, s.t('guide.xeno'));
    if (url.startsWith('https://')) { link.href = url; link.target = '_blank'; link.rel = 'noopener'; }

    // Description and mnemonic.
    this.notesText.replaceChildren();
    this.notesText.append(this.field(info.song_notes), '\n\n');
    el('span', 'tkey', this.notesText, s.t('guide.mnemonic')).style.display = 'block';
    this.notesText.append(this.field(info.mnemonic));

    // The four song types.
    [...this.typesTable.children].forEach((r, i) => {
      r.children[1].textContent = s.t(`type.${kTypeIds[i]}`);
      const v = this.field(info.types?.[kTypeIds[i]]);
      r.children[2].textContent = v;
      (r.children[2] as HTMLElement).title = v;
    });

    // Year note, under the calendar, after the label column.
    const noteText = this.field(info.calendar?.note);
    const lines = wrap(kBody, noteText, kRightW - kYearLabelCol).length;
    if (!this.phone) place(this.yearNote, kRightX + kYearLabelCol, 454, kRightW - kYearLabelCol, kLine * lines);
    this.yearNote.textContent = noteText;

    // Lookalikes, under the note.
    const lookY = 454 + kLine * lines + 12;
    if (!this.phone) {
      place(this.lookLabel, kRightX, lookY, kRightW, 14);
      place(this.lookArea, kRightX, lookY + 20, kRightW, kH - lookY - 20);
      this.lookArea.style.overflow = 'hidden';
    }
    const looks: { id?: string; name?: Text; text?: Text }[] = info.lookalikes ?? [];
    if (looks.length === 0) {
      this.lookArea.replaceChildren();
      box(this.lookArea, { font: `400 11px/${kLine}px var(--mono)` }).textContent = s.t('to_verify');
    }
    [...this.lookArea.querySelectorAll('.look')].forEach((r, i) => {
      const l = looks[i];
      r.children[0].textContent = this.otherName(l, no);
      r.children[1].textContent = this.otherName(l, !no);
      r.children[2].textContent = this.field(l.text);
      // Rows that do not fit are left out, as in the standalone.
      if (!this.phone) (r as HTMLElement).style.visibility = lookY + 20 + (i + 1) * kLookRowH <= kH + 8 ? '' : 'hidden';
    });

    this.refresh();
    this.plate.paint(true);
    this.paint();
  }

  refresh() {
    const st = this.state, s = this.s;
    this.sexBtns[0].on(st.sex === 0);
    this.sexBtns[1].on(st.sex === 1);
    this.ageBtns[0].on(st.age === 0);
    this.ageBtns[1].on(st.age === 1);
    this.plate.variant = st.age === 1 ? 'juvenile' : st.sex === 1 ? 'female' : 'male';
    this.plate.paint();
    this.plateCap.replaceChildren();
    el('b', '', this.plateCap, `${s.t('fig')} 1`);
    this.plateCap.append(this.plate.caption());
    const x = this.host.pipp.x;
    this.typeBtns.forEach((b, i) => {
      const present = this.bird !== 0 && x.pipp_bird_type_present(this.bird, i) !== 0;
      b.disabled(!present).on(present && st.type === i);
    });
    this.seasonBtns.forEach((b, i) => b.on(kSeasonValue[i] === st.season));
    for (const c of this.compareBtns) c.b.on(c.id !== '' && c.id === st.comparing);
  }

  // Once per frame while shown: the plate follows the voice.
  poll(open: number) {
    this.plate.open = open;
    this.plate.paint();
  }

  private paint() {
    this.paintFigure();
    this.paintYear();
  }

  // Figure: kHz axis, graph paper well with the example phrase, and
  // brackets under it for each run of notes from one named part.
  private paintFigure() {
    const g = this.fig.begin(), t = this.host.pipp, x = t.x;
    g.fillStyle = colour.ink;
    g.fillRect(0, 0, 350, 1); g.fillRect(0, 161, 350, 1); g.fillRect(0, 0, 1, 162); g.fillRect(349, 0, 1, 162);
    g.fillRect(27, 0, 1, 162);
    g.font = font(9, 400);
    g.fillStyle = colour.inkSoft;
    g.textAlign = 'right';
    g.textBaseline = 'middle';
    g.fillText(this.s.t('axis.khz', { n: '8' }), 24, 8);
    g.fillText(this.s.t('axis.khz', { n: '4' }), 24, 88);
    g.fillText('0', 24, 154);

    const wx = 28, wy = 1, ww = 320, wh = 160;
    g.save();
    g.translate(wx, wy);
    graphPaper(g, ww, wh);
    g.fillStyle = colour.shadow;
    g.fillRect(0, 0, ww, 1);
    g.fillRect(0, 0, 1, wh);
    g.restore();

    const ex = this.example, b = this.bird;
    if (!b || !ex || ex.notes.length === 0 || ex.lengthMs <= 0) return;
    const pad = 8;
    const pxPerMs = (ww - 2 * pad) / ex.lengthMs;
    const pitchKnob = x.pipp_bird_base(b, 0);
    const xFor = (ms: number) => wx + pad + ms * pxPerMs;
    const yFor = (hz: number) => wy + wh - Math.min(1, Math.max(0, hz / 8000)) * wh;
    const out = t.alloc(8);
    g.save();
    g.beginPath();
    g.rect(wx + 1, wy + 1, ww - 2, wh - 2);
    g.clip();
    g.strokeStyle = colour.ink;
    g.lineCap = 'round';
    const nSyl = x.pipp_bird_syllable_count(b);
    for (const n of ex.notes) {
      if (n.syl < 0 || n.syl >= nSyl || n.durMs <= 0) continue;
      const steps = Math.max(4, Math.floor((n.durMs * pxPerMs) / 1.5));
      let px = 0, py = 0, prevOn = false;
      for (let j = 0; j <= steps; j++) {
        const u = j / steps;
        x.pipp_bird_syllable_at(b, n.syl, u, out);
        const [hz, a] = t.f32(out, 2);
        const xx = xFor(n.startMs + u * n.durMs);
        const yy = yFor(hz * n.pitchMul * pitchKnob);
        const on = a > 0.08;
        if (on && prevOn) {
          g.lineWidth = 1 + Math.min(1, a);
          g.beginPath();
          g.moveTo(px, py);
          g.lineTo(xx, yy);
          g.stroke();
        }
        px = xx; py = yy; prevOn = on;
      }
    }
    g.restore();
    t.free(out);

    // Brackets.
    const f = font(9, 600);
    g.font = f;
    g.letterSpacing = '1.26px';
    g.textAlign = 'left';
    g.textBaseline = 'middle';
    const partsY = 166;
    const nParts = x.pipp_bird_part_count(b);
    let i = 0, prevTextEnd = wx;
    while (i < ex.notes.length) {
      const part = ex.notes[i].part;
      let j = i;
      while (j + 1 < ex.notes.length && ex.notes[j + 1].part === part) j++;
      if (part >= 0 && part < nParts) {
        const a = ex.notes[i], z = ex.notes[j];
        const x0 = wx + 8 + Math.round(a.startMs * pxPerMs);
        const x1 = wx + 8 + Math.round((z.startMs + z.durMs) * pxPerMs);
        const name = this.field(this.info.parts?.[t.str(x.pipp_bird_part(b, part))]);
        g.fillStyle = colour.ink;
        g.fillRect(x0, partsY, Math.max(2, x1 - x0), 1);
        // A short bracket may lend its label the room up to the next one;
        // a label wider than its room moves left, as far as the previous
        // label allows.
        let labelRight = wx + ww;
        if (j + 1 < ex.notes.length) labelRight = wx + 8 + Math.round(ex.notes[j + 1].startMs * pxPerMs) - 6;
        const tw = Math.ceil(g.measureText(name).width);
        const right = Math.max(x1, labelRight);
        const lx = Math.max(prevTextEnd + 8, Math.min(x0, right - tw));
        const lw = right - lx;
        g.fillStyle = colour.inkSoft;
        g.save();
        if (tw > lw) {
          g.translate(lx, 0);
          g.scale(Math.max(0.7, lw / tw), 1);
          g.fillText(name, 0, partsY + 8);
        } else g.fillText(name, lx, partsY + 8);
        g.restore();
        prevTextEnd = lx + Math.min(lw, tw);
      }
      i = j + 1;
    }
    g.letterSpacing = '0px';
  }

  // The calendar: month letters, then present and sings rows. y filled
  // ink, n hatched, ? left plain.
  private paintYear() {
    const g = this.year.begin(), s = this.s;
    const x0 = this.yearLabelCol, w = (this.yearW - 1 - this.yearLabelCol) / 12, dy = this.seasonH - 24;
    const label = (y: number, h: number, text: string) => {
      g.font = font(9, 600);
      g.letterSpacing = '1.26px';
      g.fillStyle = colour.inkSoft;
      g.textAlign = 'left';
      g.textBaseline = 'middle';
      g.fillText(text, 0, y + h / 2);
      g.letterSpacing = '0px';
    };
    label(0, this.seasonH, s.t('cal.season'));
    const months = s.t('cal.months').split('|');
    g.font = font(10, 500);
    g.fillStyle = colour.ink;
    g.textAlign = 'center';
    for (let m = 0; m < 12 && m < months.length; m++) g.fillText(months[m], x0 + Math.round(m * w) + w / 2, 28 + 8 + dy);
    const rows: [number, string, string][] = [[48 + dy, 'cal.present', this.info.calendar?.present ?? ''], [66 + dy, 'cal.sings', this.info.calendar?.sings ?? '']];
    for (const [y, key, row] of rows) {
      label(y, 14, s.t(key));
      let start = 0;
      for (let m = 1; m <= 12; m++) {
        const c = row[start] ?? '?';
        const next = row[m] ?? '?';
        if (m < 12 && next === c) continue;
        const xa = x0 + Math.round(start * w);
        const xb = x0 + Math.round(m * w) + 1;
        if (c === 'y') {
          g.fillStyle = colour.ink;
          g.fillRect(xa, y, xb - xa, 14);
        } else {
          g.fillStyle = colour.face;
          g.fillRect(xa, y, xb - xa, 14);
          if (c === 'n') hatch(g, xa, y, xb - xa, 14, 'rgba(34, 28, 20, 0.18)', 5);
          g.strokeStyle = colour.ink;
          g.lineWidth = 1;
          g.strokeRect(xa + 0.5, y + 0.5, xb - xa - 1, 13);
        }
        start = m;
      }
    }
  }
}
