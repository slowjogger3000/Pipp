// The phone layout of the web app, 390 wide, from design/Phone.dc.html and
// PhoneBirds.dc.html. One column: header (wordmark, NO/EN, transport), 6
// tabs, the screen, a status bar. Only SPILL and its bird picker are built;
// the other tabs are hatched until their phone screens exist.
//
// The column is laid out at 390 css px and zoomed to the window width, so
// the design's sizes hold on every phone. The engine, worklet and drawing
// classes (Plate, Sonogram, Knob) are the desktop's; this file is layout.

import type { AudioHost } from '../audio/host.ts';
import { index, hasSound, type IndexBird } from '../data.ts';
import { Btn, Canvas, box, el, number, MINUS } from './dom.ts';
import { Knob, kKnobIds } from './knob.ts';
import { kSceneIds, kSceneKeys, kSceneOptions } from './play.ts';
import { Plate } from './plate.ts';
import { Sonogram } from './sonogram.ts';
import { initialState, type State } from './state.ts';
import { Strings, lower, upper, type Lang } from './strings.ts';

const kWidth = 390;
const kInner = kWidth - 32;
const kTabKeys = ['play', 'guide', 'listen', 'quiz', 'chorus', 'collection'] as const;
const kLangKey = 'tipp.lang';
const kKnobScale = 64 / 72; // the phone dial is 64px, the desktop's 72px
const kSono = { w: 320, h: 160, pxPerKHz: 20, playheadX: 200 };

export class PhoneApp {
  readonly s = new Strings();
  readonly st: State = initialState();
  private zoom = 1;
  private col: HTMLDivElement;
  private main: HTMLDivElement;
  private enBtn: Btn;
  private noBtn: Btn;
  private playBtn: Btn;
  private stopBtn: Btn;
  private tabs: HTMLDivElement[] = [];
  private status: HTMLDivElement;
  private play: HTMLDivElement;
  private picker: HTMLDivElement;
  private pickerTitle: HTMLDivElement;
  private pickerClose: Btn;
  private pickerList: HTMLDivElement;
  private pickerOpen = false;

  // SPILL
  private prevBtn: Btn;
  private nextBtn: Btn;
  private readout: HTMLDivElement;
  private nameEl: HTMLDivElement;
  private sexBtns: Btn[] = [];
  private ageBtns: Btn[] = [];
  private plate: Plate;
  private plateCap: HTMLDivElement;
  private songTitle: HTMLDivElement;
  private lengthLabel: HTMLSpanElement;
  private lengthVal: HTMLSpanElement;
  private axis: HTMLDivElement;
  private sono: Sonogram;
  private timeAxis: HTMLDivElement;
  private songCap: HTMLDivElement;
  private tools: HTMLDivElement;
  private drawBtn: Btn;
  private speedBtns: Btn[] = [];
  private shiftBtn: Btn;
  private drawTools: HTMLDivElement;
  private drawOffBtn: Btn;
  private eraseBtn: Btn;
  private clearBtn: Btn;
  private singBtn: Btn;
  private keepBtn: Btn;
  private sceneLabel: HTMLDivElement;
  private sceneFieldLabels: HTMLSpanElement[] = [];
  private scene: Btn[][] = [];
  private dialectBtn: Btn;
  private mimicsBtn: Btn;
  private apTitle: HTMLSpanElement;
  private apOnBtn: Btn;
  private holdLabel: HTMLSpanElement;
  private holdVal: HTMLDivElement;
  private latchBtn: Btn;
  private apBtns: Btn[] = [];
  private legendText: HTMLSpanElement;
  private legendFill: HTMLSpanElement;
  private legendVal: HTMLSpanElement;
  private groupLabels: HTMLDivElement[] = [];
  private knobs: Knob[] = [];
  private lastModes: number[] = new Array(12).fill(0);
  private legendKnob = -1;
  private error = '';

  constructor(root: HTMLElement, private host: AudioHost) {
    const saved = localStorage.getItem(kLangKey);
    if (saved === 'no' || saved === 'en') this.s.set(saved);
    const st = this.st, s = this.s;
    const col = box(root, {}, 'ph');
    this.col = col;

    // ---------------------------------------------------------- header
    const header = el('div', 'ph-header', col);
    const mark = el('div', 'wordmark', header);
    el('span', '', mark, 'Tipp');
    const bar = el('i', '', mark);
    for (const c of ['clay', 'khaki', 'sage', 'plum']) el('b', '', bar).style.background = `var(--${c})`;
    box(header, { flex: '1' });
    const lang = el('div', 'joined', header);
    const big = { width: '44px', height: '44px', fontSize: '11px', padding: '0' };
    this.noBtn = new Btn(lang, '', () => this.setLanguage('no'), big);
    this.enBtn = new Btn(lang, '', () => this.setLanguage('en'), big);
    const transport = el('div', 'joined', header);
    this.playBtn = new Btn(transport, '', () => this.setPlaying(true), big).glyph('play', 'Play');
    this.stopBtn = new Btn(transport, '', () => this.setPlaying(false), big).glyph('stop', 'Stop');

    // ---------------------------------------------------------- tabs
    const tabs = el('div', 'ph-tabs', col);
    kTabKeys.forEach((_, i) => {
      const t = el('div', i === 0 ? 'ph-tab active' : 'ph-tab disabled', tabs);
      if (i === 5) t.style.flex = '1.3';
      this.tabs.push(t);
    });

    this.main = el('div', 'ph-main', col);
    this.status = el('div', 'status ph-status', col);

    // ---------------------------------------------------------- SPILL
    const play = box(this.main, { display: 'flex', flexDirection: 'column', gap: '12px' });
    this.play = play;

    const stepper = box(play, { display: 'flex', alignItems: 'center' });
    this.prevBtn = new Btn(stepper, '', () => this.stepBird(-1), big).glyph('prev', 'Previous bird');
    this.readout = box(stepper, {}, 'ph-readout well');
    this.readout.addEventListener('click', () => this.showPicker(true));
    this.nextBtn = new Btn(stepper, '', () => this.stepBird(1), { ...big, marginLeft: '-1px' }).glyph('next', 'Next bird');

    // Plate
    const plateSec = box(play, { display: 'flex', flexDirection: 'column', border: '1px solid var(--ink)' });
    const ph = box(plateSec, { justifyContent: 'space-between' }, 'panelhead');
    this.nameEl = el('div', 'title', ph);
    this.nameEl.style.flex = '1';
    const sex = el('div', 'joined', ph);
    this.sexBtns = [0, 1].map((v) => new Btn(sex, '', () => this.setChoice('sc_sex', 'sex', v), { width: '56px', height: '22px', padding: '0' }));
    const age = el('div', 'joined', ph);
    this.ageBtns = [0, 1].map((v) => new Btn(age, '', () => this.setChoice('sc_age', 'age', v), { width: v ? '40px' : '56px', height: '22px', padding: '0' }));
    const well = box(plateSec, { height: '216px', padding: '2px', boxShadow: 'var(--inset)' }, 'paper');
    this.plate = new Plate(well, kInner - 2 - 4, 212, s);
    this.plateCap = box(plateSec, { height: '18px', borderTop: '1px solid var(--ink)', padding: '0 8px' }, 'cap');

    // Song
    const songSec = box(play, { display: 'flex', flexDirection: 'column', border: '1px solid var(--ink)' });
    const sh = box(songSec, { justifyContent: 'space-between' }, 'panelhead');
    this.songTitle = el('div', 'title', sh);
    const len = el('span', '', sh);
    Object.assign(len.style, { display: 'flex', gap: '8px' });
    this.lengthLabel = el('span', 'label', len);
    this.lengthVal = el('span', 'value', len);
    const graph = box(songSec, { display: 'flex', height: `${kSono.h}px`, flex: 'none' });
    this.axis = box(graph, { flex: '1', minWidth: '0', position: 'relative', font: '400 9px/12px var(--mono)', color: 'var(--inkSoft)' });
    const sonoWrap = box(graph, { borderLeft: '1px solid var(--ink)', flex: 'none' });
    this.sono = new Sonogram(sonoWrap, host, kSono);
    this.sono.onLineChanged = () => {
      host.post({ t: 'drawn', pts: this.sono.linePoints() });
      if (this.sono.lineCount() === 0 && st.kept) {
        st.kept = false;
        host.post({ t: 'keep', on: false });
      }
      this.refresh();
    };
    this.sono.handLabel = (k) => `${s.t(`knob.${kKnobIds[k]}`)} ${s.t('song.by_hand')}`;
    this.sono.flagText = (hz, secs) => `${number(hz / 1000, 1, s.no)} kHz  ${number(secs, 1, s.no)} ${s.t('unit.s')}`;
    this.timeAxis = box(songSec, { height: '16px', flex: 'none', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--ink)', font: '400 9px/14px var(--mono)', color: 'var(--inkSoft)' });
    this.songCap = box(songSec, { height: '18px', flex: 'none', borderTop: '1px solid var(--ink)', padding: '0 8px' }, 'cap');
    this.tools = box(songSec, {}, 'ph-tools');
    const tool = (parent: HTMLElement, grow: number, onClick: () => void, text = '') =>
      new Btn(parent, text, onClick, { flex: `${grow} 1 0`, height: '44px', padding: '0', fontSize: '11px' });
    this.drawBtn = tool(this.tools, 1.4, () => this.setDraw(true));
    this.speedBtns = ['1×', '½×', '¼×'].map((t, i) => tool(this.tools, 1, () => this.setSpeed(i), t));
    this.shiftBtn = tool(this.tools, 1.6, () => this.setShift(!st.shift));
    this.drawTools = box(songSec, { display: 'none', flexDirection: 'column' });
    const dt1 = box(this.drawTools, {}, 'ph-tools');
    this.drawOffBtn = tool(dt1, 1, () => this.setDraw(false)).on(true);
    this.eraseBtn = tool(dt1, 1, () => { this.sono.erasing = !this.sono.erasing; this.refresh(); });
    this.clearBtn = tool(dt1, 1, () => this.sono.clearLine());
    const dt2 = box(this.drawTools, {}, 'ph-tools');
    this.singBtn = tool(dt2, 1, () => { if (!st.playing) this.setPlaying(true); host.trigger('ap_sing_once'); });
    this.keepBtn = tool(dt2, 1.6, () => { st.kept = !st.kept; host.post({ t: 'keep', on: st.kept }); this.refresh(); });

    // Scene: 6 rows of 44px buttons.
    const sceneSec = box(play, { display: 'flex', flexDirection: 'column', gap: '6px' });
    this.sceneLabel = el('div', 'section', sceneSec);
    const grid = box(sceneSec, { display: 'grid', gridTemplateColumns: '60px repeat(4, minmax(0, 1fr))', rowGap: '4px', alignItems: 'center' });
    const btnStyle = { height: '44px', padding: '0', minWidth: '0' };
    for (let r = 0; r < 6; r++) {
      const lab = el('span', 'field', grid);
      lab.style.whiteSpace = 'normal';
      lab.style.height = 'auto';
      this.sceneFieldLabels.push(lab);
      if (r < 4) {
        this.scene.push(kSceneOptions[r].map((_, i) => new Btn(grid, '', () => this.setScene(r, i), { ...btnStyle, marginLeft: i ? '-1px' : '0' })));
      } else {
        const b = new Btn(grid, '', undefined, { ...btnStyle, gridColumn: 'span 4' }).disabled(true); // no bird here has a dialect or mimics
        if (r === 4) this.dialectBtn = b;
        else this.mimicsBtn = b;
      }
    }
    this.dialectBtn ??= new Btn(grid);
    this.mimicsBtn ??= new Btn(grid);

    // Autoplay band.
    const band = box(play, { display: 'flex', flexDirection: 'column', gap: '6px', padding: '8px', border: '1px solid var(--ink)', background: 'var(--panel)' });
    const bandHead = box(band, { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' });
    this.apTitle = el('span', 'serif', bandHead);
    Object.assign(this.apTitle.style, { fontSize: '22px', lineHeight: '1' });
    this.apOnBtn = new Btn(bandHead, '', () => { st.apOn = !st.apOn; host.param('ap_on', st.apOn ? 1 : 0); this.refresh(); }, { height: '44px', padding: '0 16px', fontSize: '11px' });
    const holdRow = box(band, { display: 'flex', alignItems: 'center', gap: '8px' });
    this.holdLabel = el('span', 'field', holdRow);
    const holdBox = box(holdRow, { display: 'flex', flex: '1', minWidth: '0' });
    this.holdVal = box(holdBox, { flex: '1', minWidth: '0', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 8px', font: '500 12px var(--mono)' }, 'well');
    const stepHold = (d: number) => { st.hold = Math.min(20, Math.max(0.5, st.hold + d)); host.param('ap_hold', st.hold); this.refresh(); };
    new Btn(holdBox, MINUS, () => stepHold(-0.5), { width: '44px', height: '44px', marginLeft: '-1px', fontSize: '14px', padding: '0' });
    new Btn(holdBox, '+', () => stepHold(0.5), { width: '44px', height: '44px', marginLeft: '-1px', fontSize: '14px', padding: '0' });
    this.latchBtn = new Btn(holdRow, '', () => { st.latch = !st.latch; host.param('ap_latch', st.latch ? 1 : 0); this.refresh(); }, { width: '64px', height: '44px', padding: '0' });
    const apRow = box(band, { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '6px' });
    this.apBtns = ['ap_return_all', 'ap_sing_once', 'ap_reroll'].map((id) => new Btn(apRow, '', () => host.trigger(id), { height: '44px', padding: '0', minWidth: '0' }));
    const legend = box(band, { display: 'flex', alignItems: 'center', gap: '8px', font: '500 10px/14px var(--mono)', letterSpacing: '0.06em', whiteSpace: 'nowrap' });
    box(legend, { width: '18px', height: '3px', flex: 'none', background: 'var(--ink)' });
    this.legendText = el('span', '', legend);
    const meter = el('span', '', legend);
    Object.assign(meter.style, { flex: '1', minWidth: '24px', height: '8px', display: 'flex', border: '1px solid var(--ink)', background: 'var(--face)' });
    this.legendFill = el('span', '', meter);
    this.legendFill.style.background = 'var(--ink)';
    this.legendVal = el('span', '', legend);

    // Knobs: voice 5, phrasing 4, surroundings 3.
    const groups = [[0, 5], [5, 4], [9, 3]];
    for (const [first, count] of groups) {
      const sec = box(play, { display: 'flex', flexDirection: 'column', gap: '6px' });
      this.groupLabels.push(el('div', 'section', sec));
      const row = box(sec, { display: 'flex', justifyContent: count === 3 ? 'flex-start' : 'space-between', gap: count === 3 ? '34px' : '0' });
      for (let i = 0; i < count; i++) {
        const holder = box(row, { flex: 'none' });
        const k = new Knob(holder, host, s, first + i);
        k.cv.c.style.width = `${Math.round(78 * kKnobScale)}px`;
        k.cv.c.style.height = `${Math.round(104 * kKnobScale)}px`;
        this.knobs.push(k);
      }
    }

    // ---------------------------------------------------------- picker
    const picker = box(this.main, { display: 'none', flexDirection: 'column', gap: '12px' });
    this.picker = picker;
    const pHead = box(picker, { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' });
    this.pickerTitle = box(pHead, { font: '400 28px/1 var(--serif)' });
    this.pickerClose = new Btn(pHead, '', () => this.showPicker(false), { height: '44px', padding: '0 16px' });
    this.pickerList = box(picker, {}, 'sheet ph-birds');

    window.addEventListener('resize', () => this.fit());
    window.addEventListener('keydown', (e) => {
      if (e.key === ' ') { this.setPlaying(!st.playing); e.preventDefault(); }
    });
    document.fonts?.ready.then(() => this.applyStrings());

    this.selectBird(st.bird);
    this.sendScene();
    this.applyStrings();
    this.fit();
    requestAnimationFrame(() => this.frame());
  }

  // The column is 390 css px, zoomed to the window width (at most 1.4x).
  private fit() {
    const z = Math.min(1.4, window.innerWidth / kWidth);
    this.zoom = z;
    this.col.style.zoom = String(z);
    this.col.style.height = `${window.innerHeight / z}px`;
    this.col.style.left = `${Math.max(0, (window.innerWidth - kWidth * z) / 2) / z}px`;
    const canvases: Canvas[] = [this.plate.cv, this.sono.cv, ...this.knobs.map((k) => k.cv)];
    for (const c of canvases) c.resize(z);
    this.plate.paint(true);
    for (const k of this.knobs) k.invalidate();
  }

  private birdEntry(id: string): IndexBird | undefined { return index.birds.find((b) => b.id === id); }
  private name(b: IndexBird): string { return this.s.no ? b.name.no : b.name.en; }
  private otherName(b: IndexBird): string { return this.s.no ? b.name.en : b.name.no; }

  private selectBird(id: string) {
    const ptr = this.host.birds.get(id);
    if (!ptr) return;
    this.st.bird = id;
    this.host.post({ t: 'bird', id });
    this.sono.bird = ptr;
    for (const k of this.knobs) k.setBird(ptr);
    this.error = this.plate.load(id);
    this.plate.paint(true);
    this.refresh();
  }

  private neighbour(dir: number): string | null {
    const i = index.birds.findIndex((b) => b.id === this.st.bird);
    for (let j = i + dir; j >= 0 && j < index.birds.length; j += dir) if (hasSound(index.birds[j].id)) return index.birds[j].id;
    return null;
  }

  private stepBird(dir: number) {
    const id = this.neighbour(dir);
    if (id) this.selectBird(id);
  }

  private showPicker(on: boolean) {
    this.pickerOpen = on;
    this.play.style.display = on ? 'none' : 'flex';
    this.picker.style.display = on ? 'flex' : 'none';
    this.main.scrollTop = 0;
    if (on) this.renderPicker();
  }

  private renderPicker() {
    this.pickerList.replaceChildren();
    for (const g of index.groups) {
      el('div', 'gh', this.pickerList, this.s.t(`group.${g}`));
      for (const b of index.birds) {
        if (b.group !== g) continue;
        const ok = hasSound(b.id);
        const row = el('div', `row${b.id === this.st.bird ? ' sel' : ok ? '' : ' off'}`, this.pickerList);
        el('span', 'n', row, b.number);
        el('span', '', row, this.name(b));
        el('span', 'other', row, this.otherName(b));
        if (ok) row.addEventListener('click', () => { this.selectBird(b.id); this.showPicker(false); });
      }
    }
  }

  // Everything the host has set, sent again, as App.sendScene().
  private sendScene() {
    const st = this.st, h = this.host;
    h.post({ t: 'bird', id: st.bird });
    h.param('sc_season', st.season);
    h.param('sc_time', st.time);
    h.param('sc_type', st.type);
    h.param('sc_place', st.place);
    h.param('sc_sex', st.sex);
    h.param('sc_age', st.age);
    h.param('ap_on', st.apOn ? 1 : 0);
    h.param('ap_latch', st.latch ? 1 : 0);
    h.param('ap_hold', st.hold);
    h.param('pb_speed', st.speed);
    h.param('pb_shift', st.shift ? 1 : 0);
    h.param('pb_draw', st.draw ? 1 : 0);
    h.post({ t: 'keep', on: st.kept });
    h.param('pb_play', st.playing ? 1 : 0);
  }

  private setPlaying(on: boolean) {
    this.st.playing = on;
    // Audio starts on the first press: browsers need a user gesture.
    if (on) void this.host.start();
    this.host.param('pb_play', on ? 1 : 0);
    this.refresh();
  }

  private setLanguage(lang: Lang) {
    this.s.set(lang);
    localStorage.setItem(kLangKey, lang);
    this.applyStrings();
  }

  private setChoice(id: 'sc_sex' | 'sc_age', key: 'sex' | 'age', v: number) {
    this.st[key] = v;
    this.host.param(id, v);
    this.refresh();
  }

  private setScene(row: number, i: number) {
    const keys = ['season', 'time', 'type', 'place'] as const;
    this.st[keys[row]] = i;
    this.host.param(kSceneIds[row], i);
    this.refresh();
  }

  private setSpeed(i: number) { this.st.speed = i; this.host.param('pb_speed', i); this.refresh(); }
  private setShift(on: boolean) { this.st.shift = on; this.host.param('pb_shift', on ? 1 : 0); this.refresh(); }

  private setDraw(on: boolean) {
    this.st.draw = on;
    this.sono.erasing = false;
    this.sono.setDrawMode(on);
    this.host.param('pb_draw', on ? 1 : 0);
    this.refresh();
  }

  private typeAvailable(type: number): boolean {
    const b = this.sono.bird, st = this.st;
    return !!b && this.host.tipp.x.tipp_bird_type_active(b, type, st.season, st.time, st.sex, st.age) !== 0;
  }

  applyStrings() {
    const s = this.s;
    this.col.lang = s.no ? 'nb' : 'en';
    document.documentElement.lang = s.no ? 'nb' : 'en';
    this.enBtn.text(s.t('lang.en'));
    this.noBtn.text(s.t('lang.no'));
    this.tabs.forEach((t, i) => (t.textContent = s.t(`phone.tab.${kTabKeys[i]}`)));
    this.sexBtns[0].text(s.t('plate.male'));
    this.sexBtns[1].text(s.t('plate.female'));
    this.ageBtns[0].text(s.t('plate.adult'));
    this.ageBtns[1].text(s.t('plate.juv'));
    this.lengthLabel.textContent = s.t('song.length');
    this.drawBtn.text(s.t('song.draw'));
    this.drawOffBtn.text(s.t('song.draw'));
    this.shiftBtn.text(s.t('song.shift_oct'));
    this.eraseBtn.text(s.t('song.erase'));
    this.clearBtn.text(s.t('song.clear'));
    this.singBtn.text(s.t('song.sing_it'));
    this.keepBtn.text(s.t('song.keep'));
    this.sono.yourPhraseText = s.t('song.your_phrase');
    this.sono.nowText = s.t('song.now');
    this.sceneLabel.textContent = s.t('scene');
    ['scene.season', 'phone.scene.time', 'phone.scene.type', 'scene.place', 'scene.dialect', 'scene.mimics']
      .forEach((k, i) => (this.sceneFieldLabels[i].textContent = s.t(k)));
    this.scene.forEach((row, r) => row.forEach((b, i) => b.text(s.t(`${kSceneKeys[r]}.${kSceneOptions[r][i]}`))));
    this.dialectBtn.text(s.t('scene.dialect_none'));
    this.mimicsBtn.text(s.t('scene.mimics_none'));
    this.apTitle.textContent = s.t('ap.title');
    this.holdLabel.textContent = s.t('phone.ap.hold');
    this.latchBtn.text(s.t('ap.latch'));
    ['ap.return_all', 'ap.sing_once', 'ap.reroll'].forEach((k, i) => this.apBtns[i].text(s.t(k)));
    ['group.voice', 'group.phrasing', 'group.surroundings'].forEach((k, i) => (this.groupLabels[i].textContent = s.t(k)));
    this.pickerTitle.textContent = s.t('phone.pick_bird');
    this.pickerClose.text(s.t('phone.close'));

    // kHz axis right of the labels, seconds under the sonogram.
    this.axis.replaceChildren();
    for (const [text, pos] of [[s.t('axis.khz', { n: '8' }), 'top: 2px'], [s.t('axis.khz', { n: '4' }), 'top: 74px'], ['0', 'bottom: 2px']]) {
      const a = el('span', '', this.axis, text);
      a.style.cssText = `position: absolute; right: 4px; ${pos}`;
    }
    this.timeAxis.replaceChildren();
    for (let sec = 0; sec < kSono.w / 80; sec++)
      box(this.timeAxis, { width: '80px', paddingLeft: '2px' }).textContent = sec === 0 ? `0 ${s.t('unit.s')}` : String(sec);

    for (const k of this.knobs) k.invalidate();
    this.plate.paint(true);
    if (this.pickerOpen) this.renderPicker();
    this.refresh();
  }

  private refresh() {
    const st = this.st, s = this.s;
    this.enBtn.on(!s.no);
    this.noBtn.on(s.no);
    this.playBtn.on(st.playing);
    this.stopBtn.on(!st.playing);
    this.prevBtn.disabled(this.neighbour(-1) === null);
    this.nextBtn.disabled(this.neighbour(1) === null);
    const b = this.birdEntry(st.bird);
    this.readout.replaceChildren();
    if (b) {
      el('span', 'num', this.readout, b.number);
      el('span', 'name', this.readout, this.name(b));
      el('span', 'latin', this.readout, b.latin);
      this.nameEl.textContent = this.name(b);
    }

    this.sexBtns.forEach((x, i) => x.on(st.sex === i));
    this.ageBtns.forEach((x, i) => x.on(st.age === i));
    this.plate.variant = st.age === 1 ? 'juvenile' : st.sex === 1 ? 'female' : 'male';
    this.plate.paint();
    this.plateCap.replaceChildren();
    el('b', '', this.plateCap, `${s.t('fig')} 1`);
    this.plateCap.append(this.plate.caption());

    // The song panel is titled with the song type, as in the design.
    const typeText = s.t(`type.${kSceneOptions[2][st.type]}`);
    this.songTitle.textContent = typeText.charAt(0) + lower(typeText.slice(1));
    this.tools.style.display = st.draw ? 'none' : 'flex';
    this.drawTools.style.display = st.draw ? 'flex' : 'none';
    this.speedBtns.forEach((x, i) => x.on(st.speed === i));
    this.shiftBtn.on(st.shift);
    const hasLine = this.sono.lineCount() > 0;
    this.eraseBtn.on(this.sono.erasing).disabled(!hasLine);
    this.clearBtn.disabled(!hasLine);
    this.singBtn.disabled(!hasLine);
    this.keepBtn.disabled(!hasLine).on(st.kept);
    this.songCap.replaceChildren();
    el('b', '', this.songCap, `${s.t('fig')} 2`);
    const part = (r: number, v: number) => lower(s.t(`${kSceneKeys[r]}.${kSceneOptions[r][v]}`));
    this.songCap.append(this.error || (st.draw ? s.t('song.draw_caption')
      : s.t('song.caption', { bird: b ? this.name(b) : '', type: part(2, st.type), season: part(0, st.season), time: part(1, st.time) })));

    const values = [st.season, st.time, st.type, st.place];
    this.scene.forEach((row, r) => row.forEach((x, i) => x.on(values[r] === i).disabled(r === 2 && !this.typeAvailable(i))));
    this.apOnBtn.on(st.apOn).text(s.t(st.apOn ? 'ap.on' : 'ap.off'));
    this.latchBtn.on(st.latch);
    this.holdVal.textContent = `${number(st.hold, 1, s.no)} ${s.t('unit.s')}`;

    this.status.replaceChildren();
    el('span', '', this.status, s.t(st.playing ? 'status.playing' : 'status.stopped'));
    const parts = [st.season, st.time, st.type, st.place].map((v, r) => s.t(`${kSceneKeys[r]}.${kSceneOptions[r][v]}`));
    if (b) parts.unshift(upper(this.name(b)));
    const audio = this.host.error ? `AUDIO: ${this.host.error}` : '';
    el('span', 'summary', this.status, this.error || audio || parts.join(', '));
  }

  private frame() {
    const h = this.host, s = this.s, st = this.st;
    for (const k of this.knobs) k.poll();
    for (let k = 0; k < 12; k++) {
      const m = h.ready ? h.knobMode(k) : 0;
      if (m === 1 && this.lastModes[k] !== m) this.legendKnob = k;
      this.lastModes[k] = m;
    }
    if (this.legendKnob >= 0 && this.lastModes[this.legendKnob] === 0) {
      this.legendKnob = -1;
      for (let k = 0; k < 12; k++) if (this.lastModes[k] === 1 || this.lastModes[k] === 2) this.legendKnob = k;
    }
    this.sono.poll();
    const target = Math.min(1, Math.max(0, h.level / 0.35));
    this.plate.open += (target - this.plate.open) * 0.3;
    this.plate.paint();

    const ph = this.sono.lastPhrase;
    const tempo = Math.max(0.01, h.phraseTempo);
    const len = ph && ph.number > 0 ? `${number(ph.lengthMs / tempo / 1000, 1, s.no)} ${s.t('unit.s')}` : '-';
    if (this.lengthVal.textContent !== len) this.lengthVal.textContent = len;

    // The hand legend: which knob the hand holds and the time left.
    const k = this.legendKnob;
    const text = k < 0 ? s.t('ap.legend_hand_any') : s.t('ap.legend_hand', { knob: s.t(`knob.${kKnobIds[k]}`) });
    if (this.legendText.textContent !== text) this.legendText.textContent = text;
    let frac = 0, val = '';
    if (k >= 0) {
      const left = h.holdLeft(k);
      if (left >= 0) {
        frac = st.hold > 0 ? Math.min(1, Math.max(0, left / st.hold)) : 0;
        val = `${number(left, 1, s.no)} ${s.t('unit.s')}`;
      } else {
        frac = 1;
        val = s.t(st.latch ? 'ap.latched' : 'ap.stays');
      }
    }
    this.legendFill.style.width = `${Math.round(frac * 100)}%`;
    if (this.legendVal.textContent !== val) this.legendVal.textContent = val;
    requestAnimationFrame(() => this.frame());
  }

  get stageZoom(): number { return this.zoom; }
}
