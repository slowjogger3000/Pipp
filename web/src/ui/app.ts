// The desktop shell, 1280x800 scaled to the window: header, tabs, body and
// status bar, as in design-handover.md "Shared layout, desktop". This round
// builds PLAY; the other tabs are hatched until their screens exist.

import type { AudioHost } from '../audio/host.ts';
import { index, hasSound, type IndexBird } from '../data.ts';
import { Btn, box, canvases, el, number, MINUS } from './dom.ts';
import { PlayScreen, kSceneKeys, kSceneOptions } from './play.ts';
import { initialState, type State } from './state.ts';
import { Strings, upper, type Lang } from './strings.ts';

const kTabKeys = ['play', 'guide', 'quiz', 'chorus', 'log', 'collection'] as const;
const kLangKey = 'tipp.lang';

export class App {
  readonly s = new Strings();
  readonly st: State = initialState();
  private stage: HTMLDivElement;
  private playBtn: Btn;
  private stopBtn: Btn;
  private prevBtn: Btn;
  private nextBtn: Btn;
  private readout: HTMLDivElement;
  private langLabel: HTMLDivElement;
  private outLabel: HTMLDivElement;
  private enBtn: Btn;
  private noBtn: Btn;
  private outVal: HTMLDivElement;
  private meterL: HTMLElement;
  private meterR: HTMLElement;
  private tabs: HTMLDivElement[] = [];
  private listLabel: HTMLDivElement;
  private list: HTMLDivElement;
  private play: PlayScreen;
  private status: HTMLDivElement;
  private meter = { l: 0, r: 0, peak: 0 };
  private scale = 1;

  constructor(root: HTMLElement, private host: AudioHost) {
    const saved = localStorage.getItem(kLangKey);
    if (saved === 'no' || saved === 'en') this.s.set(saved);
    const stage = box(root, {}, 'stage');
    this.stage = stage;

    // ---------------------------------------------------------- header
    const header = el('div', 'header', stage);
    const mark = el('div', 'wordmark', header);
    el('span', '', mark, 'Tipp');
    const bar = el('i', '', mark);
    for (const c of ['clay', 'khaki', 'sage', 'plum']) el('b', '', bar).style.background = `var(--${c})`;
    const transport = el('div', 'joined', header);
    this.playBtn = new Btn(transport, '', () => this.setPlaying(true), { width: '44px', height: '32px' }).glyph('play', 'Play');
    this.stopBtn = new Btn(transport, '', () => this.setPlaying(false), { width: '44px', height: '32px' }).glyph('stop', 'Stop');
    const stepper = box(header, { display: 'flex', alignItems: 'center' });
    this.prevBtn = new Btn(stepper, '', () => this.stepBird(-1), { width: '32px', height: '32px' }).glyph('prev', 'Previous bird');
    this.readout = el('div', 'readout well', stepper);
    this.nextBtn = new Btn(stepper, '', () => this.stepBird(1), { width: '32px', height: '32px' }).glyph('next', 'Next bird');
    box(header, { flex: '1' });
    const lang = el('div', 'hgroup', header);
    this.langLabel = el('div', 'field', lang);
    const langRow = el('div', 'row joined', lang);
    this.enBtn = new Btn(langRow, '', () => this.setLanguage('en'), { width: '36px', height: '24px' });
    this.noBtn = new Btn(langRow, '', () => this.setLanguage('no'), { width: '36px', height: '24px' });
    const out = el('div', 'hgroup', header);
    this.outLabel = el('div', 'field', out);
    const outRow = el('div', 'row', out);
    this.outVal = el('div', 'out well', outRow);
    const meter = el('div', 'meter well', outRow);
    this.meterL = el('i', '', meter);
    this.meterR = el('i', '', meter);
    this.meterL.style.top = '4px';
    this.meterR.style.top = '12px';

    // ---------------------------------------------------------- tabs
    const tabs = el('div', 'tabs', stage);
    kTabKeys.forEach((_, i) => {
      const t = el('div', i === 0 ? 'tab active' : 'tab disabled', tabs);
      t.addEventListener('click', () => this.setTab(i));
      this.tabs.push(t);
    });

    // ---------------------------------------------------------- body
    const body = el('div', 'body', stage);
    const aside = el('div', 'aside', body);
    this.listLabel = el('div', 'section', aside);
    this.list = el('div', 'birdlist sheet', aside);
    const main = box(body, { position: 'relative', flex: '1' });
    this.play = new PlayScreen(main, host, this.s, this.st, {
      refresh: () => this.refresh(),
      setPlaying: (on) => this.setPlaying(on),
      sendScene: () => this.sendScene(),
    });
    this.status = el('div', 'status', stage);

    window.addEventListener('resize', () => this.fit());
    window.addEventListener('keydown', (e) => this.key(e));
    document.fonts?.ready.then(() => this.applyStrings());

    this.selectBird(this.st.bird);
    this.sendScene();
    this.applyStrings();
    this.fit();
    requestAnimationFrame(() => this.frame());
  }

  // Scale the 1280x800 stage to the window, keeping its proportions.
  private fit() {
    const s = Math.min(window.innerWidth / 1280, window.innerHeight / 800);
    this.scale = s;
    const x = (window.innerWidth - 1280 * s) / 2, y = (window.innerHeight - 800 * s) / 2;
    this.stage.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
    for (const c of [...canvases]) c.resize(s);
    for (const k of this.play.knobs) { k.cv.resize(s); k.invalidate(); }
    this.play.sono.cv.resize(s);
    this.play.plate.cv.resize(s);
    this.play.plate.paint(true);
    this.play.applyStrings();
  }

  private birdEntry(id: string): IndexBird | undefined { return index.birds.find((b) => b.id === id); }
  private name(b: IndexBird): string { return this.s.no ? b.name.no : b.name.en; }

  private selectBird(id: string) {
    const ptr = this.host.birds.get(id);
    if (!ptr) return;
    this.st.bird = id;
    this.host.post({ t: 'bird', id });
    this.play.setBird(ptr, id);
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

  // Everything the host has set, sent again, as MainComponent::sendScene().
  sendScene() {
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

  setPlaying(on: boolean) {
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

  private setTab(i: number) {
    // Only PLAY is built in this round; the other tabs are hatched.
    void i;
  }

  private key(e: KeyboardEvent) {
    if (e.key === ' ') { this.setPlaying(!this.st.playing); e.preventDefault(); }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { this.stepBird(e.key === 'ArrowUp' ? -1 : 1); e.preventDefault(); }
    else if (e.key === 'F1') { this.setTab(0); e.preventDefault(); }
  }

  applyStrings() {
    const s = this.s;
    this.stage.lang = s.lang === 'no' ? 'nb' : 'en';
    this.enBtn.text(s.t('lang.en')).on(!s.no);
    this.noBtn.text(s.t('lang.no')).on(s.no);
    this.langLabel.textContent = s.t('header.language');
    this.outLabel.textContent = s.t('header.out');
    this.tabs.forEach((t, i) => {
      t.replaceChildren();
      t.append(s.t(`tab.${kTabKeys[i]}`));
      el('kbd', '', t, `F${i + 1}`);
    });
    this.listLabel.textContent = s.t('list.birds');
    this.play.applyStrings();
    this.refresh();
  }

  refresh() {
    const st = this.st, s = this.s;
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
      this.play.setName(this.name(b));
      this.play.birdName = this.name(b);
    }
    this.renderList();
    this.play.refresh();

    // Status bar: state, scene, keys.
    this.status.replaceChildren();
    el('span', '', this.status, s.t(st.playing ? 'status.playing' : 'status.stopped'));
    const parts = [st.season, st.time, st.type, st.place].map((v, r) => s.t(`${kSceneKeys[r]}.${kSceneOptions[r][v]}`));
    if (b) parts.unshift(upper(this.name(b)));
    const summary = this.play.error || (this.host.error ? `AUDIO: ${this.host.error}` : parts.join(', '));
    el('span', 'summary', this.status, summary);
    for (const k of ['status.keys_play', 'status.keys_bird', 'status.keys_screen']) el('span', 'keys', this.status, s.t(k));
  }

  private renderList() {
    this.list.replaceChildren();
    for (const g of index.groups) {
      el('div', 'gh', this.list, this.s.t(`group.${g}`));
      for (const b of index.birds) {
        if (b.group !== g) continue;
        const ok = hasSound(b.id);
        const row = el('div', `row${b.id === this.st.bird ? ' sel' : ok ? '' : ' off'}`, this.list);
        el('span', 'n', row, b.number);
        el('span', '', row, this.name(b));
        if (ok) row.addEventListener('click', () => this.selectBird(b.id));
      }
    }
  }

  private frame() {
    this.play.poll();
    const [l, r] = this.host.takePeaks();
    const m = this.meter;
    m.l = Math.max(l, m.l * 0.85);
    m.r = Math.max(r, m.r * 0.85);
    m.peak = Math.max(Math.max(l, r), m.peak * 0.97);
    const db = m.peak > 1e-5 ? 20 * Math.log10(m.peak) : -100;
    const text = `${db <= -99 ? `${MINUS}∞` : number(db, 1, this.s.no)} ${this.s.t('unit.db')}`;
    if (this.outVal.textContent !== text) this.outVal.textContent = text;
    const w = (v: number) => {
      const d = v > 1e-5 ? 20 * Math.log10(v) : -60;
      return `${Math.round(86 * Math.min(1, Math.max(0, (d + 60) / 60)))}px`;
    };
    this.meterL.style.width = w(m.l);
    this.meterR.style.width = w(m.r);
    requestAnimationFrame(() => this.frame());
  }

  get stageScale(): number { return this.scale; }
}
