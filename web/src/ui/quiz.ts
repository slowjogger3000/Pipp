// The Quiz (F3), the whole body width. Layout follows
// standalone/Source/UI/QuizScreen.cpp and design/Quiz.dc.html. Left, 950px:
// question counter, the mystery sonogram with PLAY AGAIN, HALF SPEED and
// HINT, four answers in a 2x2 grid, then a band with the hint or
// explanation, COMPARE BOTH, OPEN IN FIELD GUIDE and NEXT. Right: birds in
// the quiz, what to ask for, hints, how many questions and the score.
// After the last answer NEXT reads SEE RESULT, and the result panel takes
// the place of the question: the score, the share right and the birds
// missed (agreed with Eirik 2026-11-27; not in design/).
//
// Which bird is asked, the answers and the score come from tipp::Quiz in
// core (on this thread's wasm instance); the quiz voice and COMPARE run in
// the worklet. This class holds what MainComponent holds for the quiz.

import type { AudioHost } from '../audio/host.ts';
import { kSonoFrames } from '../audio/host.ts';
import type { Ptr } from '../core/tipp.ts';
import { birdFile, hasSound, index } from '../data.ts';
import { Btn, Canvas, box, colour, el, font, graphPaper, joined, number, place, textWidth } from './dom.ts';
import { lower, type Strings } from './strings.ts';

type Info = Record<string, any>; // bird.json

// tipp::Quiz::Set: pairs, the groups in index.json's order, all.
const kSetKeys = ['pairs', 'garden', 'forest', 'coast', 'wetland', 'mountain', 'farmland', 'night', 'all'] as const;
const kAskKeys = ['type.song', 'type.call', 'quiz.ask_both'] as const;
const kHintKeys = ['guide.mnemonic', 'scene.season', 'quiz.hints_none'] as const;
const kTypeIds = ['song', 'call', 'alarm', 'flight'] as const;
const kSeasonIds = ['spring', 'summer', 'autumn', 'winter'] as const;
const kTimeIds = ['dawn', 'day', 'dusk', 'night'] as const;
const kLengths = [10, 20, 50]; // tipp::Quiz::kLengths
const kNumSets = kSetKeys.length;
const kSetRows = Math.ceil(kNumSets / 2);
const kLeftW = 950, kRightX = 962, kRightW = 1264 - kRightX;

interface Question {
  bird: number; type: number; count: number; answers: number[]; correctSlot: number; picked: number;
  number: number; correct: number; missed: number; left: number;
}

export interface QuizHandlers {
  refresh(): void;           // header, transport, status
  openGuide(id: string): void;
}

export class QuizScreen {
  readonly root: HTMLDivElement;
  // Birds with sound, in index order, as MainComponent::buildQuizBirds.
  readonly ids: string[] = [];
  private ptrs: Ptr[] = [];
  private infos: Info[] = [];
  private lookalikes: number[][] = [];
  private q: Ptr = 0;
  private stateBuf: Ptr = 0;
  private practiseBuf: Ptr = 0;
  private sceneBuf: Ptr = 0;

  set = 0;
  ask = 0;
  hints = 0;
  length = 0; // index in kLengths
  showResult = false;
  half = false;
  hintShown = false;
  playing = false;
  comparing = '';
  private compareSeen = false;
  private compareAt = 0;
  private asks = -1;

  // Trace of the mystery song: frames copied from the feed.
  private frames: { hz: number; amp: number }[] = [];
  private next = 0;
  private dirty = true;

  private counter!: HTMLDivElement;
  private figTitle!: HTMLDivElement;
  private againBtn!: Btn;
  private halfBtn!: Btn;
  private hintBtn!: Btn;
  private axis!: Canvas;
  private well!: Canvas;
  private caption!: HTMLDivElement;
  private answers: { e: HTMLDivElement; name: HTMLSpanElement; tag: HTMLSpanElement }[] = [];
  private band!: HTMLDivElement;
  private bandText!: HTMLDivElement;
  private compareBtn!: Btn;
  private guideBtn!: Btn;
  private nextBtn!: Btn;
  private setLabel!: HTMLDivElement;
  private askLabel!: HTMLDivElement;
  private hintsLabel!: HTMLDivElement;
  private scoreLabel!: HTMLDivElement;
  private setBtns: Btn[] = [];
  private askBtns!: Btn[];
  private hintBtns!: Btn[];
  private scoreRows: { key: HTMLSpanElement; val: HTMLSpanElement }[] = [];
  private practise!: HTMLDivElement;
  private lengthLabel!: HTMLDivElement;
  private lengthBtns!: Btn[];
  private missBuf: Ptr = 0;
  // What the result panel replaces, and the panel itself.
  private questionEls: HTMLElement[] = [];
  private result!: HTMLDivElement;
  private resLabel!: HTMLDivElement;
  private resScore!: HTMLDivElement;
  private resPct!: HTMLDivElement;
  private resMissLabel!: HTMLDivElement;
  private resList!: HTMLDivElement;
  private resAgain!: Btn;

  // The mystery sonogram: 920x240 on the desktop, 320x160 on the phone.
  private wellW = 920;
  private wellH = 240;
  private pxPerKHz = 30;
  private pxPerSecond = 80;
  private leftPx = 20;
  private axisW = 27;
  private scoreRight: HTMLSpanElement | null = null;
  private setCycle: Btn | null = null;

  constructor(parent: HTMLElement, private host: AudioHost, private s: Strings, private on: QuizHandlers, readonly phone = false) {
    const root = phone ? box(parent, { display: 'none', flexDirection: 'column', gap: '12px' })
      : box(parent, { position: 'absolute', left: '8px', top: '8px', width: '1264px', height: '664px', display: 'none' });
    this.root = root;
    this.buildBirds();
    if (phone) {
      this.buildPhone(root);
      return;
    }

    // ---------------------------------------------------------- figure
    this.counter = el('div', 'section', root);
    place(this.counter, 0, 0, kLeftW, 14);
    const fig = box(root, { border: '1px solid var(--ink)', display: 'flex', flexDirection: 'column' });
    place(fig, 0, 22, kLeftW, 288);
    const head = el('div', 'panelhead', fig);
    head.style.gap = '6px';
    this.figTitle = el('div', 'title', head);
    this.figTitle.style.flex = '1';
    this.againBtn = new Btn(head, '', () => this.playAgain());
    this.halfBtn = new Btn(head, '', () => this.toggleHalf());
    this.hintBtn = new Btn(head, '', () => { this.hintShown = true; this.update(); });
    const graph = box(fig, { display: 'flex', height: `${this.wellH}px`, flex: 'none' });
    const axisWrap = box(graph, { width: '28px', flex: 'none', borderRight: '1px solid var(--ink)' });
    this.axis = new Canvas(axisWrap, 27, this.wellH);
    this.well = new Canvas(graph, this.wellW, this.wellH);
    this.caption = box(fig, { height: '18px', flex: 'none', borderTop: '1px solid var(--ink)', padding: '0 8px' }, 'cap');

    // ---------------------------------------------------------- answers
    const w = (kLeftW - 8) / 2;
    for (let i = 0; i < 4; i++) {
      const e = box(root, {}, 'answer');
      place(e, (i % 2) * (Math.floor(w) + 8), 318 + Math.floor(i / 2) * 52, i % 2 ? kLeftW - Math.floor(w) - 8 : Math.floor(w), 44);
      const name = el('span', 'aname', e);
      const tag = el('span', 'atag', e);
      e.addEventListener('click', () => this.answer(i));
      this.answers.push({ e, name, tag });
    }

    // ---------------------------------------------------------- band
    this.band = box(root, { background: 'var(--panel)', border: '1px solid var(--ink)', display: 'flex', alignItems: 'center', padding: '0 12px', gap: '16px' });
    place(this.band, 0, 422, kLeftW, 68);
    this.bandText = box(this.band, { flex: '1', minWidth: '0', font: '400 11px/16px var(--mono)', overflow: 'hidden', display: '-webkit-box', webkitLineClamp: '3', webkitBoxOrient: 'vertical' } as Partial<CSSStyleDeclaration>);
    this.compareBtn = new Btn(this.band, '', () => this.compare(), { height: '24px', padding: '0 10px' });
    this.guideBtn = new Btn(this.band, '', () => this.openGuide(), { height: '24px', padding: '0 10px' });
    this.nextBtn = new Btn(this.band, '', () => this.next_(), { height: '24px', padding: '0 14px' });
    this.questionEls = [fig, ...this.answers.map((a) => a.e), this.band];
    this.result = this.buildResult(root);
    place(this.result, 0, 22, kLeftW, 468);

    // ---------------------------------------------------------- right column
    let y = 0;
    this.setLabel = el('div', 'section', root);
    place(this.setLabel, kRightX, y, kRightW, 14);
    y += 20;
    // Two columns, filled down the first, then the second (agreed with Eirik
    // 2026-11-26 when the sets grew from 6 to 9).
    const colW = Math.ceil((kRightW + 1) / 2);
    for (let i = 0; i < kNumSets; i++) {
      const b = new Btn(root, '', () => { this.set = i; this.start(); });
      const col = Math.floor(i / kSetRows), row = i % kSetRows;
      const x = kRightX + col * (colW - 1);
      place(b.e, x, y + row * 23, col === 0 ? colW : kRightX + kRightW - x, 24);
      b.e.style.justifyContent = 'flex-start';
      this.setBtns.push(b);
    }
    y += kSetRows * 23 + 1 + 12;
    this.askLabel = el('div', 'section', root);
    place(this.askLabel, kRightX, y, kRightW, 14);
    const askRow = box(root, {});
    place(askRow, kRightX, y + 20, kRightW, 24);
    this.askBtns = joined(askRow, [0, 1, 2].map((i) => ({ text: '', onClick: () => { this.ask = i; this.start(); } })), 24);
    y += 20 + 24 + 12;
    this.hintsLabel = el('div', 'section', root);
    place(this.hintsLabel, kRightX, y, kRightW, 14);
    const hintRow = box(root, {});
    place(hintRow, kRightX, y + 20, kRightW, 24);
    this.hintBtns = joined(hintRow, [0, 1, 2].map((i) => ({ text: '', onClick: () => { this.hints = i; this.update(); } })), 24);
    y += 20 + 24 + 12;
    this.lengthLabel = el('div', 'section', root);
    place(this.lengthLabel, kRightX, y, kRightW, 14);
    const lengthRow = box(root, {});
    place(lengthRow, kRightX, y + 20, kRightW, 24);
    this.lengthBtns = joined(lengthRow, kLengths.map((_, i) => ({ text: '', onClick: () => this.setLength(i) })), 24);
    y += 20 + 24 + 12;
    this.scoreLabel = el('div', 'section', root);
    place(this.scoreLabel, kRightX, y, kRightW, 14);
    const score = el('div', 'gtable well', root);
    place(score, kRightX, y + 20, kRightW, 3 * 22 + 2);
    for (let i = 0; i < 3; i++) {
      const r = box(score, { height: '22px' }, `grow${i < 2 ? ' rule' : ''}`);
      const key = el('span', 'tkey', r);
      key.style.flex = '1';
      const val = el('span', '', r);
      Object.assign(val.style, { font: '500 12px var(--mono)', padding: '0 8px', width: '56px', textAlign: 'right' });
      this.scoreRows.push({ key, val });
    }
    this.practise = box(root, { font: '400 11px/15px var(--mono)', color: 'var(--inkSoft)', overflow: 'hidden' });
    place(this.practise, kRightX, y + 20 + 68 + 6, kRightW, 64);
  }

  // The phone column, as design/PhoneQuiz.dc.html: counter, the mystery
  // sonogram with PLAY AGAIN, HALF SPEED and HINT under it, four answers
  // stacked, the explanation band, then the setup rows.
  private buildPhone(root: HTMLDivElement) {
    Object.assign(this, { wellW: 320, wellH: 160, pxPerKHz: 20, pxPerSecond: 40, leftPx: 10, axisW: 35 });
    const sec = (gap = '6px') => box(root, { display: 'flex', flexDirection: 'column', gap });
    const head = box(root, { display: 'flex', alignItems: 'center', gap: '6px' });
    this.counter = el('div', 'section', head);
    this.counter.style.flex = '1';
    this.scoreRight = el('span', '', head);
    Object.assign(this.scoreRight.style, { font: '500 10px var(--mono)', letterSpacing: '0.06em', whiteSpace: 'nowrap' });

    const fig = box(root, { border: '1px solid var(--ink)', display: 'flex', flexDirection: 'column' });
    const ph = el('div', 'panelhead', fig);
    this.figTitle = el('div', 'title', ph);
    const graph = box(fig, { display: 'flex', height: `${this.wellH}px`, flex: 'none' });
    const axisWrap = box(graph, { flex: '1', minWidth: '0', borderRight: '1px solid var(--ink)' });
    this.axis = new Canvas(axisWrap, this.axisW, this.wellH);
    this.well = new Canvas(graph, this.wellW, this.wellH);
    this.caption = box(fig, { display: 'none' });
    const tools = box(fig, {}, 'ph-tools');
    const tool = (f: () => void) => new Btn(tools, '', f, { flex: '1 1 0', height: '44px', padding: '0', minWidth: '0' });
    this.againBtn = tool(() => this.playAgain());
    this.halfBtn = tool(() => this.toggleHalf());
    this.hintBtn = tool(() => { this.hintShown = true; this.update(); });

    this.result = this.buildResult(root);
    const answers = sec();
    for (let i = 0; i < 4; i++) {
      const e = box(answers, { height: '44px' }, 'answer');
      const name = el('span', 'aname', e);
      const tag = el('span', 'atag', e);
      e.addEventListener('click', () => this.answer(i));
      this.answers.push({ e, name, tag });
    }

    this.band = box(root, { display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', border: '1px solid var(--ink)', background: 'var(--panel)' });
    this.bandText = box(this.band, { font: '400 11px/16px var(--mono)' });
    const bb = box(this.band, { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '6px' });
    const bstyle = { height: '44px', padding: '0', minWidth: '0' };
    this.compareBtn = new Btn(bb, '', () => this.compare(), bstyle);
    this.guideBtn = new Btn(bb, '', () => this.openGuide(), bstyle);
    this.nextBtn = new Btn(bb, '', () => this.next_(), bstyle);

    const setup = sec();
    this.scoreLabel = el('div', 'section', setup); // OPPSETT on the phone
    const grid = box(setup, { display: 'grid', gridTemplateColumns: '60px minmax(0, 1fr)', rowGap: '4px', alignItems: 'center' });
    this.setLabel = el('div', 'field', grid);
    // One button steps through the sets that have birds.
    this.setCycle = new Btn(grid, '', () => {
      const x = this.host.tipp.x;
      for (let k = 1; k <= kNumSets; k++) {
        const i = (this.set + k) % kNumSets;
        if (x.tipp_quiz_pool_size(this.q, i) > 0) { this.set = i; break; }
      }
      this.start();
    }, { height: '44px', padding: '0 10px', justifyContent: 'flex-start', minWidth: '0' });
    this.askLabel = el('div', 'field', grid);
    this.askBtns = joined(box(grid, {}), [0, 1, 2].map((i) => ({ text: '', onClick: () => { this.ask = i; this.start(); } })), 44);
    this.hintsLabel = el('div', 'field', grid);
    this.hintBtns = joined(box(grid, {}), [0, 1, 2].map((i) => ({ text: '', onClick: () => { this.hints = i; this.update(); } })), 44);
    this.lengthLabel = el('div', 'field', grid);
    this.lengthBtns = joined(box(grid, {}), kLengths.map((_, i) => ({ text: '', onClick: () => this.setLength(i) })), 44);
    this.questionEls = [fig, answers, this.band];
    this.practise = box(root, { font: '400 11px/16px var(--mono)', color: 'var(--inkSoft)' });
  }

  // The result panel: RESULT, the score in serif, the share right, then the
  // birds missed, each with what it was taken for and OPEN IN GUIDE, and
  // START AGAIN. Hidden until SEE RESULT.
  private buildResult(parent: HTMLElement): HTMLDivElement {
    const phone = this.phone;
    const r = box(parent, { display: 'none', flexDirection: 'column', gap: '8px', border: '1px solid var(--ink)', background: 'var(--panel)', padding: phone ? '12px' : '16px 20px', boxSizing: 'border-box' });
    this.resLabel = el('div', 'section', r);
    this.resScore = el('div', 'serif', r);
    this.resScore.style.font = `400 ${phone ? 44 : 64}px/${phone ? 48 : 68}px var(--serif)`;
    this.resPct = box(r, { font: '500 12px var(--mono)', letterSpacing: '0.06em' });
    this.resMissLabel = el('div', 'section', r);
    this.resMissLabel.style.marginTop = '8px';
    this.resList = box(r, phone ? { display: 'flex', flexDirection: 'column' } : { display: 'flex', flexDirection: 'column', flex: '1', minHeight: '0', overflowY: 'auto' }, 'gtable well');
    const foot = box(r, { display: 'flex', justifyContent: phone ? 'stretch' : 'flex-end', marginTop: '4px' });
    this.resAgain = new Btn(foot, '', () => this.start(), phone ? { height: '44px', flex: '1' } : { height: '24px', padding: '0 14px' });
    return r;
  }

  private fillResult(q: Question) {
    const s = this.s, t = this.host.tipp, x = t.x;
    const total = x.tipp_quiz_length(this.q);
    this.resLabel.textContent = s.t('quiz.result');
    this.resScore.textContent = s.t('quiz.result_score', { correct: number(q.correct, 0, s.no), total: number(total, 0, s.no) });
    this.resPct.textContent = s.t('quiz.result_pct', { pct: number(Math.round((100 * q.correct) / Math.max(1, total)), 0, s.no) });
    this.resMissLabel.textContent = s.t('quiz.result_missed');
    this.resAgain.text(s.t('quiz.again'));
    const n = x.tipp_quiz_misses(this.q, this.missBuf, 64);
    const v = t.i32(this.missBuf, 3 * n);
    this.resList.replaceChildren();
    if (n === 0) {
      const row = box(this.resList, { height: this.phone ? '44px' : '28px' }, 'grow');
      const e = el('span', 'tkey', row, s.t('quiz.result_none'));
      e.style.flex = '1';
      return;
    }
    for (let i = 0; i < n; i++) {
      const bird = v[3 * i], taken = v[3 * i + 1], times = v[3 * i + 2];
      const row = box(this.resList, { minHeight: this.phone ? '56px' : '34px', flex: 'none', gap: '8px', padding: '0 0 0 8px' }, `grow${i < n - 1 ? ' rule' : ''}`);
      const words = box(row, { flex: '1', minWidth: '0', display: 'flex', flexDirection: this.phone ? 'column' : 'row', alignItems: this.phone ? 'flex-start' : 'baseline', gap: this.phone ? '0' : '12px' });
      const nm = el('span', '', words, this.name(bird));
      Object.assign(nm.style, { font: '400 20px/24px var(--serif)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' });
      let note = s.t('quiz.result_taken', { bird: lower(this.name(taken)) });
      if (times > 1) note += `, ${s.t('quiz.result_times', { n: number(times, 0, s.no) })}`;
      const tk = el('span', '', words, note);
      Object.assign(tk.style, { font: '400 11px/15px var(--mono)', color: 'var(--inkSoft)' });
      const id = this.ids[bird];
      new Btn(row, s.t(this.phone ? 'phone.quiz.open_guide' : 'quiz.open_guide'), () => this.on.openGuide(id),
        this.phone ? { height: '44px', padding: '0 10px', flex: 'none', margin: '4px 4px 4px 0' } : { height: '24px', padding: '0 10px', flex: 'none', marginRight: '6px' });
    }
  }

  private setLength(i: number) {
    this.length = i;
    this.start();
  }

  // Every bird with data, with its group and lookalikes, into tipp::Quiz.
  private buildBirds() {
    const t = this.host.tipp, x = t.x;
    for (const b of index.birds) {
      const p = this.host.birds.get(b.id);
      if (!p || !hasSound(b.id)) continue;
      this.ids.push(b.id);
      this.ptrs.push(p);
      let info: Info = {};
      try { info = JSON.parse(birdFile(b.id, 'bird') ?? '{}'); } catch { /* shown as [TO VERIFY] */ }
      this.infos.push(info);
    }
    for (let k = 0; k < this.ids.length; k++) {
      const looks: number[] = [];
      for (const l of this.infos[k].lookalikes ?? []) {
        const j = this.ids.indexOf(l.id);
        if (j >= 0 && j !== k) looks.push(j);
      }
      this.lookalikes.push(looks);
    }
    this.q = x.tipp_quiz_new();
    this.stateBuf = t.alloc(13 * 4);
    this.practiseBuf = t.alloc(64 * 4);
    this.sceneBuf = t.alloc(2 * 4);
    this.missBuf = t.alloc(3 * 64 * 4);
    const lk = t.alloc(64 * 4);
    for (let k = 0; k < this.ids.length; k++) {
      const entry = index.birds.find((b) => b.id === this.ids[k])!;
      t.i32(lk, this.lookalikes[k].length).set(this.lookalikes[k]);
      x.tipp_quiz_add_bird(this.q, index.groups.indexOf(entry.group), x.tipp_bird_type_present(this.ptrs[k], 1), lk, this.lookalikes[k].length);
    }
    t.free(lk);
  }

  private question(): Question {
    const t = this.host.tipp;
    t.x.tipp_quiz_state(this.q, this.stateBuf);
    const v = t.i32(this.stateBuf, 13);
    return {
      bird: v[0], type: v[1], count: v[2], answers: [v[3], v[4], v[5], v[6]], correctSlot: v[7], picked: v[8],
      number: v[9], correct: v[10], missed: v[11], left: v[12],
    };
  }

  get active(): boolean { return this.question().number > 0; }
  private get answered(): boolean { return this.question().picked >= 0; }
  private get finished(): boolean { return this.host.tipp.x.tipp_quiz_finished(this.q) !== 0; }

  private name(k: number): string {
    const e = index.birds.find((b) => b.id === this.ids[k]);
    return e ? (this.s.no ? e.name.no : e.name.en) : '';
  }

  // The bird in the header readout: only once answered.
  headerBird(): string | null {
    const q = this.question();
    return q.number > 0 && q.picked >= 0 ? this.ids[q.bird] : null;
  }

  get visible(): boolean { return this.root.style.display !== 'none'; }
  show(on: boolean) { this.root.style.display = on ? (this.phone ? 'flex' : '') : 'none'; }

  resize(scale: number) {
    this.axis.resize(scale);
    this.well.resize(scale);
    this.dirty = true;
    this.applyStrings();
  }

  // ------------------------------------------------------------ flow

  enter() {
    this.stopCompare();
    void this.host.start(); // F3 or a click is a gesture
    if (!this.active) this.start();
    else this.stage();
  }

  leave() {
    this.stopCompare();
    this.host.post({ t: 'qvoice', op: 'stop' });
    this.playing = false;
  }

  start() {
    this.stopCompare();
    const seed = (Math.random() * 0x100000000) >>> 0;
    this.showResult = false;
    if (this.host.tipp.x.tipp_quiz_start(this.q, this.set, this.ask, seed, kLengths[this.length])) this.stage();
    else {
      this.host.post({ t: 'qvoice', op: 'stop' });
      this.playing = false;
      this.host.param('pb_play', 0);
      this.clearTrace();
      this.update();
    }
  }

  private stage() {
    const q = this.question();
    this.hintShown = false;
    this.clearTrace();
    this.host.post({ t: 'qvoice', op: 'start', bird: this.ids[q.bird], type: q.type, half: this.half });
    this.playing = true;
    this.update();
  }

  answer(slot: number) {
    const q = this.question();
    if (q.number <= 0 || q.picked >= 0 || slot >= q.count) return;
    this.host.tipp.x.tipp_quiz_answer(this.q, slot);
    this.update();
  }

  next_() {
    if (!this.active || !this.answered) return;
    this.stopCompare();
    if (this.showResult) this.start();
    else if (this.finished) {
      this.showResult = true;
      this.host.post({ t: 'qvoice', op: 'stop' });
      this.playing = false;
      this.host.param('pb_play', 0);
      this.update();
    } else if (this.host.tipp.x.tipp_quiz_next(this.q)) this.stage();
  }

  playAgain() {
    if (!this.active || this.showResult) return;
    void this.host.start();
    this.stopCompare();
    this.playing = true;
    this.host.post({ t: 'qvoice', op: 'again' });
    this.update();
  }

  stop() {
    this.stopCompare();
    this.playing = false;
    this.host.param('pb_play', 0);
    this.update();
  }

  private toggleHalf() {
    this.half = !this.half;
    this.host.post({ t: 'qvoice', op: 'half', half: this.half });
    this.update();
  }

  // COMPARE BOTH: the bird asked about, then the one picked if it was
  // wrong, else a lookalike among the answers, else the next answer.
  private compare() {
    if (this.comparing) { this.stopCompare(); this.update(); return; }
    const q = this.question();
    if (q.number <= 0 || q.picked < 0) return;
    let other = -1;
    if (q.picked !== q.correctSlot) other = q.answers[q.picked];
    for (let i = 0; i < q.count && other < 0; i++) {
      const a = q.answers[i];
      if (a !== q.bird && (this.lookalikes[q.bird].includes(a) || this.lookalikes[a].includes(q.bird))) other = a;
    }
    if (other < 0) other = q.answers[(q.correctSlot + 1) % q.count];
    const x = this.host.tipp.x;
    const type = x.tipp_bird_type_present(this.ptrs[other], q.type) ? q.type : 0;
    this.comparing = this.ids[other];
    this.compareSeen = false;
    this.compareAt = performance.now();
    this.playing = true;
    void this.host.start();
    this.host.post({ t: 'compare', first: this.ids[q.bird], second: this.ids[other], restore: { autoplay: false, play: true, type: q.type }, type });
    this.restartTrace(this.host.sonoWritten);
    this.update();
  }

  private stopCompare() {
    if (!this.comparing) return;
    this.host.post({ t: 'compareCancel' });
    this.comparing = '';
  }

  private openGuide() {
    const q = this.question();
    if (q.number <= 0 || q.picked < 0) return;
    this.on.openGuide(this.ids[q.bird]);
  }

  // ------------------------------------------------------------ text

  // The bird's own text for the type asked, then how the picked bird
  // differs if the data says so. Nothing beyond bird.json.
  private explain(q: Question): string {
    const s = this.s, info = this.infos[q.bird];
    const text = s.field(info.types?.[q.type === 1 ? 'call' : 'song']);
    const name = this.name(q.bird);
    if (q.picked === q.correctSlot) return s.t('quiz.explain_right', { bird: name, text });
    const pick = q.answers[q.picked];
    const out = s.t('quiz.explain_wrong', { bird: name, pick: this.name(pick), text });
    const differs = (from: Info, about: number, described: string) => {
      for (const l of from.lookalikes ?? []) if (l.id === this.ids[about]) return s.t('quiz.differs', { bird: described, text: s.field(l.text) });
      return '';
    };
    const d = differs(info, pick, this.name(pick)) || differs(this.infos[pick], q.bird, name);
    return d ? `${out} ${d}` : out;
  }

  private hint(q: Question): string {
    const s = this.s, info = this.infos[q.bird];
    if (this.hints === 0) return s.t('quiz.hint_mnemonic', { text: s.field(info.mnemonic) });
    // Season: the months the calendar says it sings.
    const sings: string = info.calendar?.sings ?? '';
    const months = s.t('cal.month_names').split('|');
    const yes: string[] = [];
    let unknown = sings.length !== 12;
    for (let m = 0; m < sings.length && m < 12; m++) {
      if (sings[m] === 'y') yes.push(months[m]);
      unknown ||= sings[m] === '?';
    }
    let text = yes.join(', ');
    if (unknown) text = text ? `${text} ${s.t('to_verify')}` : s.t('to_verify');
    return s.t('quiz.hint_season', { months: text });
  }

  applyStrings() {
    const s = this.s;
    this.figTitle.textContent = s.t('quiz.title');
    this.againBtn.text(s.t('quiz.play_again'));
    this.halfBtn.text(s.t('quiz.half'));
    this.hintBtn.text(s.t('quiz.hint'));
    this.compareBtn.text(s.t('quiz.compare'));
    this.guideBtn.text(s.t(this.phone ? 'phone.quiz.open_guide' : 'quiz.open_guide'));
    const f = font(10, 500);
    if (!this.phone) this.nextBtn.e.style.width = `${Math.max(textWidth(f, s.t('quiz.next'), 0.6), textWidth(f, s.t('quiz.see_result'), 0.6)) + 28}px`;
    this.lengthBtns.forEach((b, i) => b.text(number(kLengths[i], 0, s.no)));
    this.lengthLabel.textContent = s.t('quiz.length');
    this.setBtns.forEach((b, i) => b.text(this.setName(i)));
    this.askBtns.forEach((b, i) => b.text(s.t(kAskKeys[i])));
    this.hintBtns.forEach((b, i) => b.text(s.t(kHintKeys[i])));
    this.setLabel.textContent = s.t('quiz.birds');
    this.askLabel.textContent = s.t('quiz.ask');
    this.hintsLabel.textContent = s.t('quiz.hints');
    this.scoreLabel.textContent = s.t(this.phone ? 'phone.quiz.setup' : 'quiz.score');
    this.scoreRows.forEach((r, i) => (r.key.textContent = s.t(['quiz.score_correct', 'quiz.score_missed', 'quiz.score_left'][i])));

    const g = this.axis.begin();
    g.font = font(9, 400);
    g.fillStyle = colour.inkSoft;
    g.textAlign = 'right';
    g.textBaseline = 'middle';
    const ax = this.axisW - 4;
    g.fillText(s.t('axis.khz', { n: '8' }), ax, 8);
    g.fillText(s.t('axis.khz', { n: '4' }), ax, this.wellH - 4 * this.pxPerKHz + 8);
    g.fillText('0', ax, this.wellH - 8);
    this.update();
  }

  // Everything that depends on the quiz state, as updateQuizView().
  update() {
    const s = this.s, x = this.host.tipp.x;
    const q = this.question();
    const active = q.number > 0, answered = active && q.picked >= 0, finished = answered && this.finished;

    const total = x.tipp_quiz_length(this.q);
    this.counter.textContent = active ? s.t('quiz.question', { n: String(q.number), total: String(total) }) : s.t('quiz.question_none');
    this.nextBtn.text(s.t(finished ? 'quiz.see_result' : 'quiz.next'));
    const result = this.showResult && finished;
    // The answers set their own display below; the figure and band keep the one they were built with.
    this.questionEls.forEach((e) => { if (!e.classList.contains('answer')) e.style.visibility = result ? 'hidden' : ''; });
    if (this.phone) this.questionEls.forEach((e) => (e.style.display = result ? 'none' : 'flex'));
    this.result.style.display = result ? 'flex' : 'none';
    if (result) this.fillResult(q);
    this.halfBtn.on(this.half).disabled(!active);
    this.againBtn.disabled(!active);
    this.hintBtn.disabled(!active || this.hints === 2 || answered).on(this.hintShown && !answered && this.hints !== 2);
    this.compareBtn.disabled(!answered).on(this.comparing !== '');
    this.guideBtn.disabled(!answered);
    this.nextBtn.disabled(!answered);

    this.answers.forEach((a, i) => {
      a.e.style.display = active && i < q.count && !result ? (this.phone ? 'flex' : '') : 'none';
      a.name.textContent = active && i < q.count ? this.name(q.answers[i]) : '';
      const correct = answered && i === q.correctSlot;
      const wrong = answered && !correct && i === q.picked;
      a.e.className = `answer${correct ? ' correct' : wrong ? ' wrong' : ''}${active && !answered ? ' live' : ''}`;
      a.tag.textContent = correct ? s.t('quiz.correct') : wrong ? s.t('quiz.your_answer') : '';
    });
    this.setBtns.forEach((b, i) => {
      // A set has birds when tipp::Quiz::poolFor finds any.
      b.on(this.set === i).disabled(x.tipp_quiz_pool_size(this.q, i) === 0);
    });
    this.askBtns.forEach((b, i) => b.on(this.ask === i));
    this.hintBtns.forEach((b, i) => b.on(this.hints === i));
    this.lengthBtns.forEach((b, i) => b.on(this.length === i));

    const scores = active ? [q.correct, q.missed, q.left] : [0, 0, 0];
    if (this.scoreRight) this.scoreRight.textContent = s.t('phone.quiz.correct', { n: number(scores[0], 0, s.no) });
    this.setCycle?.text(`${this.setName(this.set)} · ${s.t('phone.quiz.change')}`);
    this.scoreRows.forEach((r, i) => (r.val.textContent = number(scores[i], 0, s.no)));

    if (!active) {
      this.bandText.textContent = s.t('quiz.no_birds');
      this.practise.textContent = s.t('quiz.practise_none');
      this.caption.replaceChildren();
      el('b', '', this.caption, `${s.t('fig')} 1`);
      this.on.refresh();
      return;
    }

    const n = x.tipp_quiz_practise(this.q, this.practiseBuf, 64);
    const names = [...this.host.tipp.i32(this.practiseBuf, n)].map((b) => lower(this.name(b)));
    this.practise.textContent = names.length === 0 ? s.t('quiz.practise_none')
      : s.t('quiz.practise', { birds: names.length > 1 ? names.slice(0, -1).join(', ') + s.t('quiz.and') + names[names.length - 1] : names[0] });

    // The scene the quiz voice uses for this bird and type.
    const sc = this.host.tipp.i32(this.sceneBuf, 2);
    sc[0] = 0; sc[1] = 0;
    x.tipp_quiz_scene_for(this.ptrs[q.bird], q.type, this.sceneBuf);
    const [season, time] = this.host.tipp.i32(this.sceneBuf, 2);
    const type = lower(s.t(`type.${kTypeIds[q.type]}`));
    const seasonText = lower(s.t(`season.${kSeasonIds[season] ?? 'spring'}`));
    const timeText = lower(s.t(`time.${kTimeIds[time] ?? 'dawn'}`));
    this.caption.replaceChildren();
    el('b', '', this.caption, `${s.t('fig')} 1`);
    this.caption.append(answered ? s.t('quiz.fig_answered', { bird: this.name(q.bird), type, season: seasonText, time: timeText })
      : s.t('quiz.fig', { type, season: seasonText, time: timeText }));

    let band: string;
    if (answered) {
      band = this.explain(q);
      if (finished) band += ` ${s.t('quiz.done', { correct: String(q.correct), total: String(total) })}`;
    } else band = this.hintShown && this.hints !== 2 ? this.hint(q) : s.t('quiz.prompt');
    this.bandText.textContent = band;
    this.on.refresh();
  }

  // ------------------------------------------------------------ trace

  private clearTrace() { this.restartTrace(this.host.sonoWritten); }

  private restartTrace(frame: number) {
    this.frames = [];
    this.next = frame;
    this.dirty = true;
  }

  // Once per frame while shown.
  poll() {
    const h = this.host;
    // COMPARE ends on its own; clear the button once the worklet says so.
    if (this.comparing) {
      if (h.compare.running) this.compareSeen = true;
      else if (this.compareSeen || performance.now() - this.compareAt > 1500) { this.comparing = ''; this.update(); }
    }
    if (h.qvoice.sung !== this.asks) {
      this.asks = h.qvoice.sung;
      if (h.qvoice.started) this.restartTrace(h.qvoice.startFrame);
    }
    const written = h.sonoWritten;
    const keep = kSonoFrames - 64;
    if (written - this.next > keep) this.next = written - keep; // fell behind the ring
    const rate = h.sonoRate;
    const cap = Math.floor(((this.wellW - this.leftPx) / this.pxPerSecond) * rate) + 2;
    while (this.next < written) {
      if (this.frames.length < cap) {
        const f = h.sonoFrame(this.next);
        this.frames.push({ hz: f.hz, amp: f.amp });
        this.dirty = true;
      }
      this.next++;
    }
    if (this.dirty) this.paintTrace();
  }

  private paintTrace() {
    this.dirty = false;
    const g = this.well.begin();
    graphPaper(g, this.wellW, this.wellH);
    g.fillStyle = colour.shadow;
    g.fillRect(0, 0, this.wellW, 1);
    g.fillRect(0, 0, 1, this.wellH);
    const rate = this.host.sonoRate;
    const fr = this.frames;
    if (fr.length < 2 || rate <= 0) return;
    const yFor = (hz: number) => this.wellH - (hz / 1000) * this.pxPerKHz;
    const xFor = (i: number) => this.leftPx + (i / rate) * this.pxPerSecond;
    const kGate = 0.03;
    g.strokeStyle = colour.ink;
    g.lineCap = 'round';
    for (let i = 1; i < fr.length; i++) {
      const a = fr[i - 1], b = fr[i];
      if (a.amp > kGate && b.amp > kGate && a.hz > 0 && b.hz > 0 && Math.abs(Math.log2(b.hz / a.hz)) < 0.35) {
        const level = Math.min(1, (0.5 * (a.amp + b.amp)) / 0.35);
        g.lineWidth = 1.5 + 1.5 * level;
        g.beginPath();
        g.moveTo(xFor(i - 1), yFor(a.hz));
        g.lineTo(xFor(i), yFor(b.hz));
        g.stroke();
      }
    }
  }

  private setName(i: number): string {
    return this.s.t(`quiz.set.${kSetKeys[i]}`, { n: String(index.birds.length) });
  }

  // Status bar: the set and what is asked.
  statusText(): string {
    return `${this.setName(this.set)}, ${this.s.t(kAskKeys[this.ask])}`;
  }
}
