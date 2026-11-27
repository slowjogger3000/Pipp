// The Play screen (F1), right of the bird list: plate and song panels, the
// scene row, 12 knobs and the autoplay band. Layout and sizes follow
// MainComponent::resized() in the standalone and design/Main.dc.html.

import type { AudioHost } from '../audio/host.ts';
import { Btn, Canvas, box, colour, el, font, joined, number, MINUS } from './dom.ts';
import { Knob, kKnobIds } from './knob.ts';
import { Plate } from './plate.ts';
import { Sonogram } from './sonogram.ts';
import { lower, type Strings } from './strings.ts';
import type { State } from './state.ts';

export const kSceneIds = ['sc_season', 'sc_time', 'sc_type', 'sc_place'] as const;
export const kSceneKeys = ['season', 'time', 'type', 'place'] as const;
export const kSceneOptions = [
  ['spring', 'summer', 'autumn', 'winter'],
  ['dawn', 'day', 'dusk', 'night'],
  ['song', 'call', 'alarm', 'flight'],
  ['garden', 'forest', 'open', 'shore'],
] as const;

export class PlayScreen {
  readonly root: HTMLDivElement;
  readonly plate: Plate;
  readonly sono: Sonogram;
  readonly knobs: Knob[] = [];
  private nameEl: HTMLDivElement;
  private sexBtns: Btn[];
  private ageBtns: Btn[];
  private plateCap: HTMLDivElement;
  private songCap: HTMLDivElement;
  private songTitle: HTMLDivElement;
  private tools: HTMLDivElement;
  private drawTools: HTMLDivElement;
  private drawBtn: Btn;
  private speedBtns: Btn[];
  private shiftBtns: Btn[];
  private labels: { e: HTMLElement; key: string }[] = [];
  private phraseVal: HTMLSpanElement;
  private lengthVal: HTMLSpanElement;
  private eraseBtn: Btn;
  private clearBtn: Btn;
  private singBtn: Btn;
  private keepBtn: Btn;
  private axis: Canvas;
  private scene: Btn[][] = [];
  private dialectBtn: Btn;
  private mimicsBtn: Btn;
  private apTitle: HTMLDivElement;
  private apOnBtn: Btn;
  private holdVal: HTMLDivElement;
  private apBtns: Btn[];
  private legend: Canvas;
  private legendKnob = -1;
  private lastModes: number[] = new Array(12).fill(0);
  error = '';

  constructor(parent: HTMLElement, private host: AudioHost, private s: Strings, private st: State, private app: {
    refresh: () => void; setPlaying: (on: boolean) => void; sendScene: () => void;
  }) {
    const root = box(parent, { position: 'absolute', left: '8px', top: '8px', width: '1022px', height: '664px' });
    this.root = root;

    // ---------------------------------------------------------- plate panel
    const platePanel = box(root, { position: 'absolute', left: '0', top: '0', width: '304px', height: '384px', border: '1px solid var(--ink)', display: 'flex', flexDirection: 'column' });
    const ph = el('div', 'panelhead', platePanel);
    ph.style.gap = '0';
    this.nameEl = el('div', 'title', ph);
    this.nameEl.style.flex = '1';
    this.sexBtns = joined(ph, [{ text: '', width: 56, onClick: () => this.setChoice('sc_sex', 'sex', 0) }, { text: '', width: 56, onClick: () => this.setChoice('sc_sex', 'sex', 1) }]);
    box(ph, { width: '6px', flex: 'none' });
    this.ageBtns = joined(ph, [{ text: '', width: 44, onClick: () => this.setChoice('sc_age', 'age', 0) }, { text: '', width: 36, onClick: () => this.setChoice('sc_age', 'age', 1) }]);
    const well = box(platePanel, { flex: '1', padding: '2px', boxShadow: 'var(--inset)' }, 'paper');
    this.plate = new Plate(well, 298, 332, s);
    this.plateCap = box(platePanel, { height: '18px', borderTop: '1px solid var(--ink)', padding: '0 8px' }, 'cap');

    // ---------------------------------------------------------- song panel
    const songPanel = box(root, { position: 'absolute', left: '312px', top: '0', width: '710px', height: '384px', border: '1px solid var(--ink)', display: 'flex', flexDirection: 'column' });
    const sh = el('div', 'panelhead', songPanel);
    this.songTitle = el('div', 'title', sh);
    this.songTitle.style.flex = '1';
    this.tools = el('div', '', sh);
    Object.assign(this.tools.style, { display: 'flex', alignItems: 'center', gap: '12px' });
    this.drawBtn = new Btn(this.tools, '', () => this.setDraw(!st.draw));
    this.labels.push({ e: el('span', 'label', this.tools), key: 'song.speed' });
    this.speedBtns = joined(this.tools, ['1×', '½×', '¼×'].map((t, i) => ({ text: t, width: 32, onClick: () => this.setSpeed(i) })));
    this.labels.push({ e: el('span', 'label', this.tools), key: 'song.shift' });
    this.shiftBtns = joined(this.tools, [{ text: '', width: 40, onClick: () => this.setShift(false) }, { text: '', width: 56, onClick: () => this.setShift(true) }]);
    this.labels.push({ e: el('span', 'label', this.tools), key: 'song.phrase' });
    this.phraseVal = el('span', 'value', this.tools);
    this.phraseVal.style.width = '24px';
    this.labels.push({ e: el('span', 'label', this.tools), key: 'song.length' });
    this.lengthVal = el('span', 'value', this.tools);
    this.lengthVal.style.width = '44px';
    this.drawTools = el('div', '', sh);
    Object.assign(this.drawTools.style, { display: 'none', alignItems: 'center', gap: '6px' });
    const drawBtn2 = new Btn(this.drawTools, '', () => this.setDraw(false)).on(true);
    this.eraseBtn = new Btn(this.drawTools, '', () => { this.sono.erasing = !this.sono.erasing; this.refresh(); });
    this.clearBtn = new Btn(this.drawTools, '', () => this.sono.clearLine());
    this.singBtn = new Btn(this.drawTools, '', () => { if (!st.playing) app.setPlaying(true); host.trigger('ap_sing_once'); });
    this.keepBtn = new Btn(this.drawTools, '', () => { st.kept = !st.kept; host.post({ t: 'keep', on: st.kept }); this.refresh(); });
    this.drawBtn2 = drawBtn2;

    const graph = box(songPanel, { display: 'flex', height: '320px', flex: 'none' });
    const axisWrap = box(graph, { width: '28px', flex: 'none', borderRight: '1px solid var(--ink)' });
    this.axis = new Canvas(axisWrap, 27, 320);
    this.sono = new Sonogram(graph, host);
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
    const timeAxis = box(songPanel, { height: '16px', flex: 'none', marginLeft: '28px', borderTop: '1px solid var(--ink)', position: 'relative' });
    this.timeAxis = timeAxis;
    this.songCap = box(songPanel, { flex: '1', borderTop: '1px solid var(--ink)', padding: '0 8px' }, 'cap');

    // ---------------------------------------------------------- scene row
    const sceneRow = box(root, { position: 'absolute', left: '0', top: '392px', width: '1022px', height: '56px' });
    this.sceneLabel = el('div', 'section', sceneRow);
    const fields = box(sceneRow, { display: 'flex', gap: '12px', marginTop: '4px' });
    const flex = Math.floor((1022 - 2 * 92 - 5 * 12) / 4);
    this.fieldLabels = [];
    for (let row = 0; row < 6; row++) {
      const f = box(fields, { width: `${row < 4 ? flex : 92}px`, display: 'flex', flexDirection: 'column', gap: '2px' });
      this.fieldLabels.push(el('div', 'field', f));
      if (row < 4) {
        this.scene.push(joined(f, kSceneOptions[row].map((_, i) => ({ text: '', onClick: () => this.setScene(row, i) })), 24));
      } else {
        const b = new Btn(f, '', undefined, { height: '24px', width: '92px' }).disabled(true); // no bird here has a dialect or mimics
        if (row === 4) this.dialectBtn = b;
        else this.mimicsBtn = b;
      }
    }
    this.dialectBtn ??= new Btn(fields);
    this.mimicsBtn ??= new Btn(fields);

    // ---------------------------------------------------------- knobs
    const knobRow = box(root, { position: 'absolute', left: '0', top: '456px', width: '1022px', height: '128px' });
    const widths = [400, 318, 236], first = [0, 5, 9], count = [5, 4, 3];
    const gap = (1022 - 954) / 2;
    this.groupLabels = [];
    let x = 0;
    for (let gi = 0; gi < 3; gi++) {
      const lab = box(knobRow, { position: 'absolute', left: `${x}px`, top: '0', width: `${widths[gi]}px` }, 'section');
      this.groupLabels.push(lab);
      for (let i = 0; i < count[gi]; i++) {
        const holder = box(knobRow, { position: 'absolute', left: `${x + i * 82}px`, top: '20px' });
        this.knobs.push(new Knob(holder, host, s, first[gi] + i));
      }
      x += widths[gi] + gap;
    }

    // ---------------------------------------------------------- autoplay band
    const band = box(root, { position: 'absolute', left: '0', top: '592px', width: '1022px', height: '64px', background: 'var(--panel)', border: '1px solid var(--ink)', display: 'flex', alignItems: 'center', padding: '0 12px', gap: '16px' });
    this.apTitle = box(band, { font: '400 22px/24px var(--serif)', whiteSpace: 'nowrap' });
    this.apOnBtn = new Btn(band, '', () => { st.apOn = !st.apOn; host.param('ap_on', st.apOn ? 1 : 0); this.refresh(); }, { height: '32px', fontSize: '11px', padding: '0 14px' });
    const hold = box(band, { display: 'flex', flexDirection: 'column', gap: '2px', alignSelf: 'flex-start', marginTop: '13px' });
    this.holdLabel = el('div', 'field', hold);
    const holdRow = box(hold, { display: 'flex' });
    this.holdVal = box(holdRow, { width: '64px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 6px', font: '500 12px var(--mono)' }, 'well');
    const stepHold = (d: number) => { st.hold = Math.min(20, Math.max(0.5, st.hold + d)); host.param('ap_hold', st.hold); this.refresh(); };
    new Btn(holdRow, MINUS, () => stepHold(-0.5), { width: '24px', height: '24px', marginLeft: '-1px', fontSize: '12px', padding: '0' });
    new Btn(holdRow, '+', () => stepHold(0.5), { width: '24px', height: '24px', marginLeft: '-1px', fontSize: '12px', padding: '0' });
    const btns = box(band, { display: 'flex', gap: '6px', alignSelf: 'flex-end', marginBottom: '11px' });
    this.apBtns = [
      new Btn(btns, '', () => { st.latch = !st.latch; host.param('ap_latch', st.latch ? 1 : 0); this.refresh(); }, { height: '24px', padding: '0 10px' }),
      new Btn(btns, '', () => host.trigger('ap_return_all'), { height: '24px', padding: '0 10px' }),
      new Btn(btns, '', () => host.trigger('ap_sing_once'), { height: '24px', padding: '0 10px' }),
      new Btn(btns, '', () => host.trigger('ap_reroll'), { height: '24px', padding: '0 10px' }),
    ];
    const legendWrap = box(band, { flex: '1', display: 'flex', justifyContent: 'flex-end' });
    this.legend = new Canvas(legendWrap, 300, 34);
  }

  private drawBtn2: Btn;
  private timeAxis: HTMLDivElement;
  private sceneLabel: HTMLDivElement;
  private fieldLabels: HTMLDivElement[];
  private groupLabels: HTMLDivElement[];
  private holdLabel!: HTMLDivElement;

  setBird(ptr: number, plateId: string) {
    this.sono.bird = ptr;
    for (const k of this.knobs) k.setBird(ptr);
    this.error = this.plate.load(plateId);
    this.plate.paint(true);
  }

  typeAvailable(type: number): boolean {
    const b = this.sono.bird;
    if (!b) return false;
    const st = this.st;
    return this.host.pipp.x.pipp_bird_type_active(b, type, st.season, st.time, st.sex, st.age) !== 0;
  }

  private setChoice(id: 'sc_sex' | 'sc_age', key: 'sex' | 'age', v: number) {
    this.st[key] = v;
    this.host.param(id, v);
    this.app.refresh();
  }

  private setScene(row: number, i: number) {
    const keys = ['season', 'time', 'type', 'place'] as const;
    this.st[keys[row]] = i;
    this.host.param(kSceneIds[row], i);
    this.app.refresh();
  }

  private setSpeed(i: number) { this.st.speed = i; this.host.param('pb_speed', i); this.refresh(); }
  private setShift(on: boolean) { this.st.shift = on; this.host.param('pb_shift', on ? 1 : 0); this.refresh(); }

  setDraw(on: boolean) {
    this.st.draw = on;
    this.sono.erasing = false;
    this.sono.setDrawMode(on);
    this.host.param('pb_draw', on ? 1 : 0);
    this.refresh();
  }

  applyStrings() {
    const s = this.s;
    this.sexBtns[0].text(s.t('plate.male'));
    this.sexBtns[1].text(s.t('plate.female'));
    this.ageBtns[0].text(s.t('plate.adult'));
    this.ageBtns[1].text(s.t('plate.juv'));
    this.songTitle.textContent = s.t('song.title');
    this.drawBtn.text(s.t('song.draw'));
    this.drawBtn2.text(s.t('song.draw'));
    for (const l of this.labels) l.e.textContent = s.t(l.key);
    this.shiftBtns[0].text(s.t('song.shift_off'));
    this.shiftBtns[1].text(s.t('song.shift_oct'));
    this.eraseBtn.text(s.t('song.erase'));
    this.clearBtn.text(s.t('song.clear'));
    this.singBtn.text(s.t('song.sing_it'));
    this.keepBtn.text(s.t('song.keep'));
    this.sono.yourPhraseText = s.t('song.your_phrase');
    this.sono.nowText = s.t('song.now');
    this.sceneLabel.textContent = s.t('scene');
    ['scene.season', 'scene.time', 'scene.type', 'scene.place', 'scene.dialect', 'scene.mimics'].forEach((k, i) => (this.fieldLabels[i].textContent = s.t(k)));
    this.scene.forEach((row, r) => row.forEach((b, i) => b.text(s.t(`${kSceneKeys[r]}.${kSceneOptions[r][i]}`))));
    this.dialectBtn.text(s.t('scene.dialect_none'));
    this.mimicsBtn.text(s.t('scene.mimics_none'));
    ['group.voice', 'group.phrasing', 'group.surroundings'].forEach((k, i) => (this.groupLabels[i].textContent = s.t(k)));
    this.apTitle.textContent = s.t('ap.title');
    this.holdLabel.textContent = s.t('ap.hold');
    ['ap.latch', 'ap.return_all', 'ap.sing_once', 'ap.reroll'].forEach((k, i) => this.apBtns[i].text(s.t(k)));

    // Seconds axis and kHz axis.
    this.timeAxis.replaceChildren();
    for (let sec = 0; sec <= 8; sec++)
      box(this.timeAxis, { position: 'absolute', left: `${2 + 80 * sec}px`, top: '0', font: '400 9px/15px var(--mono)', color: 'var(--inkSoft)' }).textContent = sec === 0 ? `0 ${s.t('unit.s')}` : String(sec);
    const g = this.axis.begin();
    g.font = font(9, 400);
    g.fillStyle = colour.inkSoft;
    g.textAlign = 'right';
    g.textBaseline = 'middle';
    for (let i = 0; i < 5; i++) {
      const yy = i < 4 ? 2 + 80 * i + 6 : 320 - 14 + 6;
      g.fillText(i < 4 ? s.t('axis.khz', { n: String(8 - 2 * i) }) : '0', 23, yy);
    }
    for (const k of this.knobs) k.invalidate();
    this.plate.paint(true);
    this.refresh();
  }

  refresh() {
    const st = this.st, s = this.s;
    this.sexBtns[0].on(st.sex === 0);
    this.sexBtns[1].on(st.sex === 1);
    this.ageBtns[0].on(st.age === 0);
    this.ageBtns[1].on(st.age === 1);
    this.plate.variant = st.age === 1 ? 'juvenile' : st.sex === 1 ? 'female' : 'male';
    this.plate.paint();
    this.plateCap.innerHTML = '';
    el('b', '', this.plateCap, `${s.t('fig')} 1`);
    this.plateCap.append(this.plate.caption());

    this.tools.style.display = st.draw ? 'none' : 'flex';
    this.drawTools.style.display = st.draw ? 'flex' : 'none';
    this.speedBtns.forEach((b, i) => b.on(st.speed === i));
    this.shiftBtns[0].on(!st.shift);
    this.shiftBtns[1].on(st.shift);
    const hasLine = this.sono.lineCount() > 0;
    this.eraseBtn.on(this.sono.erasing).disabled(!hasLine);
    this.clearBtn.disabled(!hasLine);
    this.singBtn.disabled(!hasLine);
    this.keepBtn.disabled(!hasLine).on(st.kept);

    const values = [st.season, st.time, st.type, st.place];
    this.scene.forEach((row, r) => row.forEach((b, i) => b.on(values[r] === i).disabled(r === 2 && !this.typeAvailable(i))));

    this.apOnBtn.on(st.apOn).text(s.t(st.apOn ? 'ap.on' : 'ap.off'));
    this.apBtns[0].on(st.latch);
    this.holdVal.textContent = `${number(st.hold, 1, s.no)} ${s.t('unit.s')}`;
    this.updateCaption();
  }

  setName(name: string) {
    this.nameEl.textContent = name;
    // Long names get a smaller serif instead of an ellipsis.
    let size = 22;
    this.nameEl.style.fontSize = `${size}px`;
    const avail = 304 - 16 - 111 - 79 - 16;
    const probe = this.legend.g;
    probe.font = font(size, 400, true);
    while (size > 13 && probe.measureText(name).width > avail) {
      size--;
      probe.font = font(size, 400, true);
    }
    this.nameEl.style.fontSize = `${size}px`;
  }

  birdName = '';

  private updateCaption() {
    const st = this.st, s = this.s;
    this.songCap.innerHTML = '';
    el('b', '', this.songCap, `${s.t('fig')} 2`);
    const part = (r: number, v: number) => lower(s.t(`${kSceneKeys[r]}.${kSceneOptions[r][v]}`));
    const text = this.error ? this.error
      : st.draw ? s.t('song.draw_caption')
      : s.t('song.caption', { bird: this.birdName, type: part(2, st.type), season: part(0, st.season), time: part(1, st.time) });
    this.songCap.append(text);
  }

  // Once per frame.
  poll() {
    const h = this.host;
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
    const num = ph && ph.number > 0 ? String(ph.number) : '-';
    if (this.phraseVal.textContent !== num) this.phraseVal.textContent = num;
    const len = ph && ph.number > 0 ? `${number(ph.lengthMs / tempo / 1000, 1, this.s.no)} ${this.s.t('unit.s')}` : '-';
    if (this.lengthVal.textContent !== len) this.lengthVal.textContent = len;
    this.paintLegend();
  }

  // The two ring colours, and the countdown for the held knob.
  private paintLegend() {
    const g = this.legend.begin(), s = this.s, st = this.st;
    g.font = font(10, 500);
    g.letterSpacing = '0.6px';
    g.textBaseline = 'middle';
    g.textAlign = 'left';
    g.fillStyle = colour.plum;
    g.fillRect(0, 6, 18, 3);
    g.fillStyle = colour.ink;
    g.fillText(s.t('ap.legend_auto'), 26, 7.5);
    g.fillRect(0, 26, 18, 3);
    if (this.legendKnob < 0) {
      g.fillText(s.t('ap.legend_hand_any'), 26, 27.5);
      return;
    }
    const text = s.t('ap.legend_hand', { knob: s.t(`knob.${kKnobIds[this.legendKnob]}`) });
    g.fillText(text, 26, 27.5);
    const bx = Math.round(26 + g.measureText(text).width + 8);
    const left = this.host.holdLeft(this.legendKnob);
    g.fillStyle = colour.face;
    g.fillRect(bx, 23, 72, 8);
    g.strokeStyle = colour.ink;
    g.lineWidth = 1;
    g.strokeRect(bx + 0.5, 23.5, 71, 7);
    g.fillStyle = colour.ink;
    if (left >= 0) {
      const frac = st.hold > 0 ? Math.min(1, Math.max(0, left / st.hold)) : 0;
      g.fillRect(bx, 23, Math.round(72 * frac), 8);
      g.fillText(`${number(left, 1, s.no)} ${s.t('unit.s')}`, bx + 80, 27.5);
    } else {
      g.fillRect(bx, 23, 72, 8);
      g.fillText(s.t(st.latch ? 'ap.latched' : 'ap.stays'), bx + 80, 27.5);
    }
    g.letterSpacing = '0px';
  }
}
