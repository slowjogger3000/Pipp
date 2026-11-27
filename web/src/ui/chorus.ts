// The Dawn chorus (F4), the whole body width. Layout follows
// standalone/Source/UI/ChorusScreen.cpp and design/Chorus.dc.html: a
// morning row (season, place, dawn speed), then one panel with 4 lanes of
// 96px. A lane head is 302px: number chip in the track colour, bird name,
// MUTE, SOLO, CHANGE BIRD and distance. The timeline is 8px per minute from
// 90 minutes before sunrise to 30 after; a lane's band starts at its entry
// minute and fills where the bird sang.
//
// The clock, entries and mix are pipp::Chorus in core, in the worklet. This
// class holds what MainComponent holds for the chorus and sends it there.

import type { AudioHost } from '../audio/host.ts';
import { kChorusColumns, kLanes, KnobMode, type Ptr } from '../core/pipp.ts';
import { chorusSetup, index } from '../data.ts';
import { Btn, Canvas, box, colour, el, font, graphPaper, hatch, joined, number, place, MINUS, textWidth } from './dom.ts';
import { upper, type Strings } from './strings.ts';

const kSeasonIds = ['spring', 'summer', 'autumn', 'winter'] as const;
const kPlaceIds = ['garden', 'forest', 'open', 'shore'] as const;
const kStartMin = -90;
const kHeadW = 302;
const kLaneH = 96;
const kPxPerMin = 8;
const kTimelineW = kChorusColumns; // 120 minutes at 8px
const kDistanceKnob = 9;           // voice and phrasing knobs come before it
const kTrack = [colour.clay, colour.khaki, colour.sage, colour.plum];
// Text on clay and plum is paper, on khaki and sage ink.
const kOnTrack = [colour.paper, colour.ink, colour.ink, colour.paper];

interface Setup {
  default_entry_min?: number;
  entry_min?: Record<string, number>;
  lanes?: { bird?: string; distance_m?: number }[];
}

export class ChorusScreen {
  readonly root: HTMLDivElement;
  season = 0;
  place = 0;
  speed = 1; // 10x
  playing = false;
  error = '';
  private loaded = false;
  private setup: Setup = {};
  private laneBird = [-1, -1, -1, -1];
  private laneEntry = [0, 0, 0, 0];
  private laneDistance = [15, 15, 15, 15];
  private laneMute = [false, false, false, false];
  private laneSolo = [false, false, false, false];

  private morningLabel!: HTMLDivElement;
  private fieldLabels: HTMLDivElement[] = [];
  private seasonBtns!: Btn[];
  private placeBtns!: Btn[];
  private speedBtns!: Btn[];
  private title!: HTMLDivElement;
  private nowEl!: HTMLDivElement;
  private lanes: { e: HTMLDivElement; name: HTMLDivElement; dist: HTMLDivElement; mute: Btn; solo: Btn; change: Btn }[] = [];
  private timeline!: Canvas;
  private caption!: HTMLDivElement;
  private note!: HTMLDivElement;

  private strips: Canvas[] = [];
  private nowShort: HTMLSpanElement | null = null;

  // ids and ptrs: every bird with sound, in index order (the quiz's list).
  constructor(parent: HTMLElement, private host: AudioHost, private s: Strings, private ids: string[], private ptrs: Ptr[],
              private on: { refresh(): void; playBird(): string }, readonly phone = false) {
    const root = phone ? box(parent, { display: 'none', flexDirection: 'column', gap: '12px' })
      : box(parent, { position: 'absolute', left: '8px', top: '8px', width: '1264px', height: '664px', display: 'none' });
    this.root = root;
    if (phone) {
      this.buildPhone(root);
      return;
    }

    // ---------------------------------------------------------- morning
    this.morningLabel = el('div', 'section', root);
    place(this.morningLabel, 0, 0, 1264, 14);
    const w = Math.floor((1264 - 32) / 3);
    const groups: Btn[][] = [];
    for (let i = 0; i < 3; i++) {
      const x = i * (w + 16);
      const f = box(root, {});
      place(f, x, 18, i === 2 ? 1264 - x : w, 38);
      const lab = el('div', 'field', f);
      this.fieldLabels.push(lab);
      const row = box(f, { marginTop: '2px' });
      groups.push(joined(row, [0, 1, 2, 3].map((v) => ({ text: '', onClick: () => this.setChoice(i, v) })), 24));
    }
    [this.seasonBtns, this.placeBtns, this.speedBtns] = groups;
    // Speed glyphs read the same in both languages.
    this.speedBtns[1].text('10×');
    this.speedBtns[2].text('60×');

    // ---------------------------------------------------------- panel
    const panel = box(root, { border: '1px solid var(--ink)' });
    place(panel, 0, 68, 1264, 1 + 28 + 4 * kLaneH + 16 + 18 + 1);
    const head = el('div', 'panelhead', panel);
    this.title = el('div', 'title', head);
    this.title.style.flex = '1';
    this.nowEl = el('div', 'chorusnow', head);
    for (let i = 0; i < kLanes; i++) {
      const e = box(panel, {}, `lane${i < 3 ? ' rule' : ''}`);
      place(e, 0, 28 + i * kLaneH, kHeadW - 1, kLaneH);
      const chip = box(e, { background: kTrack[i], color: kOnTrack[i] }, 'chip');
      chip.textContent = String(i + 1);
      const name = el('div', 'lanename', e);
      const dist = el('div', 'lanedist', e);
      const btns = box(e, { position: 'absolute', left: '46px', top: '51px', display: 'flex', gap: '6px' });
      const mute = new Btn(btns, '', () => this.toggleMute(i));
      const solo = new Btn(btns, '', () => this.toggleSolo(i));
      const change = new Btn(btns, '', () => this.changeBird(i));
      this.lanes.push({ e, name, dist, mute, solo, change });
    }
    const tl = box(panel, {});
    place(tl, kHeadW, 28, kTimelineW, 4 * kLaneH + 16);
    this.timeline = new Canvas(tl, kTimelineW, 4 * kLaneH + 16);
    box(panel, { background: 'var(--ink)' }).style.cssText += `position:absolute;left:${kHeadW - 1}px;top:28px;width:1px;height:${4 * kLaneH}px;`;
    this.caption = box(panel, { borderTop: '1px solid var(--ink)', padding: '0 8px' }, 'cap');
    place(this.caption, 0, 28 + 4 * kLaneH + 16, 1262, 18);
    this.note = box(root, { font: '400 11px/16px var(--mono)', color: 'var(--inkSoft)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' });
    place(this.note, 0, 68 + 448 + 12, 1264, 16);
  }

  // The phone column, as design/PhoneChorus.dc.html: morning rows, then 4
  // lanes, each a 48px head over a 36px strip; 356px span the 120 minutes.
  // One CHANGE BIRDS button under the panel moves every lane on.
  private buildPhone(root: HTMLDivElement) {
    const morning = box(root, { display: 'flex', flexDirection: 'column', gap: '6px' });
    this.morningLabel = el('div', 'section', morning);
    const grid = box(morning, { display: 'grid', gridTemplateColumns: '60px minmax(0, 1fr)', rowGap: '4px', alignItems: 'center' });
    const groups: Btn[][] = [];
    for (let i = 0; i < 3; i++) {
      this.fieldLabels.push(el('div', 'field', grid));
      groups.push(joined(box(grid, {}), [0, 1, 2, 3].map((v) => ({ text: '', onClick: () => this.setChoice(i, v) })), 44));
    }
    [this.seasonBtns, this.placeBtns, this.speedBtns] = groups;
    this.speedBtns[1].text('10×');
    this.speedBtns[2].text('60×');

    const panel = box(root, { border: '1px solid var(--ink)', display: 'flex', flexDirection: 'column' });
    const head = box(panel, { justifyContent: 'space-between' }, 'panelhead');
    this.title = el('div', 'title', head);
    this.nowEl = el('div', '', head);
    this.nowShort = el('span', '', this.nowEl);
    Object.assign(this.nowShort.style, { font: '500 10px var(--mono)', letterSpacing: '0.06em' });
    const hidden = box(root, { display: 'none' });
    for (let i = 0; i < kLanes; i++) {
      const e = box(panel, { display: 'flex', flexDirection: 'column', borderBottom: '1px solid var(--ink)' }, 'plane');
      const top = box(e, { height: '48px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 6px' });
      const chip = box(top, { background: kTrack[i], color: kOnTrack[i] }, 'pchip');
      chip.textContent = String(i + 1);
      const name = box(top, { flex: '1', minWidth: '0', font: '400 22px/1 var(--serif)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' });
      const dist = box(top, { font: '500 10px var(--mono)', letterSpacing: '0.06em', whiteSpace: 'nowrap' });
      const btns = box(top, { display: 'flex' });
      const mute = new Btn(btns, '', () => this.toggleMute(i), { height: '44px', padding: '0 8px' });
      const solo = new Btn(btns, '', () => this.toggleSolo(i), { height: '44px', padding: '0 8px', marginLeft: '-1px' });
      const change = new Btn(hidden, '', () => this.changeBird(i));
      const stripWrap = box(e, { height: '36px', borderTop: '1px solid var(--divider)' });
      this.strips.push(new Canvas(stripWrap, 356, 35));
      this.lanes.push({ e, name, dist, mute, solo, change });
    }
    this.timeline = new Canvas(box(panel, {}), 356, 16); // the minute axis
    this.caption = box(panel, { borderTop: '1px solid var(--ink)', padding: '0 8px', height: '18px' }, 'cap');
    const changeAll = new Btn(root, '', () => { for (let i = 0; i < kLanes; i++) this.changeBird(i); }, { height: '44px' });
    this.changeAllBtn = changeAll;
    this.note = box(root, { font: '400 11px/16px var(--mono)', color: 'var(--inkSoft)' });
  }

  private changeAllBtn: Btn | null = null;

  get visible(): boolean { return this.root.style.display !== 'none'; }
  show(on: boolean) { this.root.style.display = on ? (this.phone ? 'flex' : '') : 'none'; }
  resize(scale: number) {
    this.timeline.resize(scale);
    for (const c of this.strips) c.resize(scale);
  }

  // ------------------------------------------------------------ setup

  // Lanes, entry minutes and distances from data/chorus.json, once.
  private load() {
    if (this.loaded) return;
    this.loaded = true;
    const doc = chorusSetup() as Setup | null;
    if (!doc) this.error = this.s.t('error.load', { bird: 'CHORUS', error: 'chorus.json' });
    this.setup = doc ?? {};
    const lanes = this.setup.lanes ?? [];
    for (let i = 0; i < kLanes; i++) {
      const lane = lanes[i] ?? {};
      this.laneDistance[i] = lane.distance_m ?? 15;
      let k = this.ids.indexOf(lane.bird ?? '');
      if (k < 0) for (let j = 0; j < this.ids.length && k < 0; j++) if (!this.laneBird.includes(j)) k = j;
      this.laneBird[i] = k;
    }
    const h = this.host;
    h.post({ t: 'chorus', op: 'season', v: this.season });
    h.post({ t: 'chorus', op: 'place', v: this.place });
    h.post({ t: 'chorus', op: 'speed', v: this.speed });
    h.post({ t: 'chorus', op: 'seed', v: (Math.random() * 0x100000000) >>> 0 });
  }

  private setLaneBird(lane: number, k: number) {
    this.laneBird[lane] = k;
    const id = k >= 0 ? this.ids[k] : '';
    const entries = this.setup.entry_min ?? {};
    this.laneEntry[lane] = id in entries ? entries[id] : this.setup.default_entry_min ?? -40;
    this.host.post({ t: 'chorus', op: 'lane', lane, bird: id, entry: this.laneEntry[lane], distance: this.laneDistance[lane] });
    if (k < 0) return;
    // The Play bird keeps the voice and phrasing knobs latched there.
    const h = this.host;
    const playBird = this.on.playBird() === id;
    for (let knob = 0; knob < kDistanceKnob; knob++) {
      const latched = playBird && h.ready && h.knobOverridden(knob) && h.holdLeft(knob) < 0 && h.knobMode(knob) === KnobMode.Hold;
      if (latched) h.post({ t: 'chorus', op: 'hold', lane, k: knob, v: h.knobValue(knob) });
      else h.post({ t: 'chorus', op: 'release', lane, k: knob });
    }
  }

  // CHANGE BIRD: the next bird with sound that no other lane has.
  private changeBird(lane: number) {
    const n = this.ids.length;
    const from = this.laneBird[lane];
    for (let step = 1; step < n; step++) {
      const k = ((from < 0 ? 0 : from) + step) % n;
      if (!this.laneBird.includes(k)) {
        this.setLaneBird(lane, k);
        break;
      }
    }
    this.update();
  }

  toggleMute(i: number) {
    this.laneMute[i] = !this.laneMute[i];
    this.host.post({ t: 'chorus', op: 'mute', lane: i, on: this.laneMute[i] });
    this.update();
  }

  private toggleSolo(i: number) {
    this.laneSolo[i] = !this.laneSolo[i];
    this.host.post({ t: 'chorus', op: 'solo', lane: i, on: this.laneSolo[i] });
    this.update();
  }

  private setChoice(group: number, v: number) {
    if (group === 0) this.season = v;
    else if (group === 1) this.place = v;
    else this.speed = v;
    this.host.post({ t: 'chorus', op: (['season', 'place', 'speed'] as const)[group], v });
    this.update();
  }

  // ------------------------------------------------------------ flow

  enter() {
    void this.host.start(); // F4 or a click is a gesture
    this.load();
    this.host.param('pb_play', 0); // the Play bird rests
    for (let i = 0; i < kLanes; i++) this.setLaneBird(i, this.laneBird[i]); // picks up latched knobs
    this.update();
  }

  leave() { this.setPlaying(false); }

  get minute(): number { return this.host.ready ? this.host.chorus[0] : kStartMin; }
  get finished(): boolean { return this.host.ready && this.host.chorus[1] !== 0; }

  setPlaying(on: boolean) {
    if (on) void this.host.start();
    if (on && this.finished) this.host.post({ t: 'chorus', op: 'seek', minute: kStartMin });
    this.playing = on;
    this.host.post({ t: 'chorus', op: 'play', on });
    this.update();
  }

  // ------------------------------------------------------------ view

  private inSeason(lane: number): boolean {
    const k = this.laneBird[lane];
    return k >= 0 && this.host.pipp.x.pipp_bird_type_active(this.ptrs[k], 0, this.season, 0, 0, 0) !== 0;
  }

  private name(k: number): string {
    const e = index.birds.find((b) => b.id === this.ids[k]);
    return e ? (this.s.no ? e.name.no : e.name.en) : '';
  }

  applyStrings() {
    const s = this.s;
    this.morningLabel.textContent = s.t('chorus.morning');
    ['scene.season', 'scene.place', 'chorus.dawn_speed'].forEach((k, i) => (this.fieldLabels[i].textContent = s.t(k)));
    this.seasonBtns.forEach((b, i) => b.text(s.t(`season.${kSeasonIds[i]}`)));
    this.placeBtns.forEach((b, i) => b.text(s.t(`place.${kPlaceIds[i]}`)));
    this.speedBtns[0].text(s.t('chorus.speed_real'));
    this.speedBtns[3].text(s.t('chorus.speed_loop'));
    this.title.textContent = s.t('chorus.title');
    for (const l of this.lanes) {
      l.mute.text(s.t('chorus.mute'));
      l.solo.text(s.t('chorus.solo'));
      l.change.text(s.t('chorus.change'));
    }
    this.changeAllBtn?.text(s.t('phone.chorus.change_all'));
    this.caption.replaceChildren();
    el('b', '', this.caption, `${s.t('fig')} 1`);
    this.caption.append(s.t('chorus.caption'));
    this.note.textContent = s.t('chorus.note');
    this.update();
  }

  update() {
    const s = this.s;
    this.seasonBtns.forEach((b, i) => b.on(this.season === i));
    this.placeBtns.forEach((b, i) => b.on(this.place === i));
    this.speedBtns.forEach((b, i) => b.on(this.speed === i));
    const canChange = this.ids.length > kLanes;
    this.changeAllBtn?.disabled(!canChange);
    this.lanes.forEach((l, i) => {
      l.mute.on(this.laneMute[i]);
      l.solo.on(this.laneSolo[i]);
      l.change.disabled(!canChange);
      l.e.classList.toggle('muted', this.laneMute[i]);
      const k = this.laneBird[i];
      l.name.textContent = k >= 0 ? this.name(k) : '';
      l.dist.textContent = this.laneMute[i] ? s.t('chorus.muted') : `${number(this.laneDistance[i], 0, s.no)} m`;
      if (!this.phone) l.name.style.right = `${8 + textWidth(font(10, 500), l.dist.textContent, 0.6) + 2 + 10}px`;
    });
    this.on.refresh();
  }

  statusText(): string {
    const s = this.s;
    if (this.error) return this.error;
    if (this.finished) return s.t('chorus.status_done');
    const speeds = [s.t('chorus.speed_real'), '10×', '60×', s.t('chorus.speed_loop')];
    return s.t('chorus.status', { season: s.t(`season.${kSeasonIds[this.season]}`), place: s.t(`place.${kPlaceIds[this.place]}`), speed: speeds[this.speed] });
  }

  // Once per frame while shown.
  poll() {
    if (this.playing && this.finished) {
      this.playing = false;
      this.host.post({ t: 'chorus', op: 'play', on: false });
      this.on.refresh();
    }
    this.paintHead();
    if (this.phone) this.paintStrips();
    else this.paintTimeline();
  }

  // Phone: one strip per lane and the minute axis under them.
  private paintStrips() {
    const s = this.s, W = 356, H = 35;
    const ppm = W / 120;
    const xFor = (minute: number) => (minute - kStartMin) * ppm;
    const sang = this.host.chorusSang;
    const sx = Math.round(xFor(0)), nx = Math.floor(xFor(this.minute));
    for (let i = 0; i < kLanes; i++) {
      const g = this.strips[i].begin();
      if (!this.laneMute[i]) graphPaper(g, W, H);
      if (this.inSeason(i)) {
        const bx = Math.round(xFor(this.laneEntry[i]));
        const by = 7, bh = 20;
        g.fillStyle = kTrack[i];
        for (let px = Math.max(0, bx); px < W; px++) {
          const c0 = Math.floor(px / ppm * kPxPerMin), c1 = Math.min(kChorusColumns, Math.floor((px + 1) / ppm * kPxPerMin));
          let on = false;
          for (let c = c0; c < c1 && !on; c++) on = sang[i * kChorusColumns + c] !== 0;
          if (on) g.fillRect(px, by + 1, 1, bh - 2);
        }
        g.fillStyle = colour.ink;
        g.fillRect(bx, by, W + 1 - bx, 1);
        g.fillRect(bx, by + bh - 1, W + 1 - bx, 1);
        g.fillRect(bx, by, 1, bh);
      }
      if (this.laneMute[i]) hatch(g, 0, 0, W, H);
      g.fillStyle = colour.ink;
      g.fillRect(sx, 0, 1, H);
      g.fillStyle = colour.plum;
      g.fillRect(nx, 0, 1, H);
    }
    const g = this.timeline.begin();
    g.font = font(9, 400);
    g.fillStyle = colour.inkSoft;
    g.textBaseline = 'middle';
    g.textAlign = 'left';
    const labels = [s.t('chorus.axis_min', { n: `${MINUS}90` }), `${MINUS}60`, `${MINUS}30`, s.t('chorus.sunrise')];
    labels.forEach((t, k) => g.fillText(t, 2 + Math.round(xFor(-90 + 30 * k)), 8));
  }

  // NOW and SINGING on the right of the panel head.
  private paintHead() {
    const s = this.s, c = this.host.chorus, m = this.minute;
    const mins = Math.round(Math.abs(m));
    const nowText = mins === 0 ? s.t('chorus.at') : s.t(m < 0 ? 'chorus.before' : 'chorus.after', { n: String(mins) });
    if (this.nowShort) {
      if (this.nowShort.textContent !== upper(nowText)) this.nowShort.textContent = upper(nowText);
      return;
    }
    let singing = 0;
    for (let i = 0; i < kLanes; i++) if (this.host.ready && c[3 + 5 * i] !== 0 && c[4 + 5 * i] !== 0) singing++;
    const text = `${s.t('chorus.now')}|${nowText}|${s.t('chorus.singing')}|${s.t('chorus.of', { n: String(singing), total: String(kLanes) })}`;
    if (this.nowEl.dataset.text === text) return;
    this.nowEl.dataset.text = text;
    this.nowEl.replaceChildren();
    text.split('|').forEach((p, i) => el('span', i % 2 === 0 ? 'soft' : '', this.nowEl, p));
  }

  private paintTimeline() {
    const g = this.timeline.begin(), s = this.s;
    const H = 4 * kLaneH;
    graphPaper(g, kTimelineW, H);
    g.fillStyle = colour.shadow;
    g.fillRect(0, 0, kTimelineW, 1);
    g.fillRect(0, 0, 1, H);
    const xFor = (minute: number) => (minute - kStartMin) * kPxPerMin;
    const sang = this.host.chorusSang;

    for (let i = 0; i < kLanes; i++) {
      const top = i * kLaneH;
      if (this.inSeason(i)) {
        // The band from the entry minute to the right edge, filled in the
        // track colour where the bird sang.
        const bx = Math.round(xFor(this.laneEntry[i]));
        const by = top + 34, bh = 28;
        g.fillStyle = kTrack[i];
        for (let col = Math.max(0, bx); col < kChorusColumns && col < kTimelineW; col++)
          if (sang[i * kChorusColumns + col]) g.fillRect(col, by + 1, 1, bh - 2);
        g.fillStyle = colour.ink;
        g.fillRect(bx, by, kTimelineW + 1 - bx, 1);
        g.fillRect(bx, by + bh - 1, kTimelineW + 1 - bx, 1);
        g.fillRect(bx, by, 1, bh);
      }
      if (this.laneMute[i]) hatch(g, 0, top, kTimelineW, kLaneH);
      if (i > 0) {
        g.fillStyle = colour.ink;
        g.fillRect(0, top, kTimelineW, 1);
      }
    }

    // Sunrise line and flag.
    const sx = Math.round(xFor(0));
    g.fillStyle = colour.ink;
    g.fillRect(sx, 0, 1, H);
    g.font = font(8, 600);
    g.letterSpacing = '0.48px';
    g.textBaseline = 'middle';
    g.textAlign = 'left';
    const sun = s.t('chorus.sunrise');
    g.fillRect(sx + 4, 2, Math.ceil(g.measureText(sun).width) + 6, 10);
    g.fillStyle = colour.onInk;
    g.fillText(sun, sx + 7, 7.5);

    // Playhead and NOW flag.
    const nx = Math.floor(xFor(this.minute));
    g.fillStyle = colour.plum;
    g.fillRect(nx, 0, 1, H);
    const now = s.t('chorus.now');
    g.fillRect(nx + 1, 0, Math.ceil(g.measureText(now).width) + 8, 12);
    g.fillStyle = colour.paper;
    g.fillText(now, nx + 5, 6.5);
    g.letterSpacing = '0px';

    // Minute axis under the timeline, labels every 30 minutes.
    g.fillStyle = colour.ink;
    g.fillRect(0, H, kTimelineW, 1);
    g.font = font(9, 400);
    g.fillStyle = colour.inkSoft;
    for (let k = 0; k < 4; k++) {
      const n = -90 + 30 * k;
      const text = k === 0 ? s.t('chorus.axis_min', { n: `${MINUS}${-n}` }) : n < 0 ? `${MINUS}${-n}` : String(n);
      g.fillText(text, 2 + 240 * k, H + 8.5);
    }
  }
}
