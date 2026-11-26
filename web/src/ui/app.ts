// The desktop shell, 1280x800 scaled to the window: header, tabs, body and
// status bar, as in design-handover.md "Shared layout, desktop". PLAY, FIELD
// GUIDE, QUIZ, CHORUS and LOG are built; COLLECTION is hatched until its
// screen exists. Same tab rules as MainComponent::setTab().

import type { AudioHost } from '../audio/host.ts';
import { index, hasSound, type IndexBird } from '../data.ts';
import { Btn, box, canvases, el, number, MINUS } from './dom.ts';
import { ChorusScreen } from './chorus.ts';
import { GuideScreen } from './guide.ts';
import { LogScreen } from './log.ts';
import { PlayScreen, kSceneKeys, kSceneOptions } from './play.ts';
import { QuizScreen } from './quiz.ts';
import { initialState, type State } from './state.ts';
import { Strings, upper, type Lang } from './strings.ts';

const kTabKeys = ['play', 'guide', 'quiz', 'chorus', 'log', 'collection'] as const;
const kLangKey = 'tipp.lang';
const kBuiltTabs = 5;

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
  private guide: GuideScreen;
  private quiz: QuizScreen;
  private chorus: ChorusScreen;
  private log: LogScreen;
  private transportRow: HTMLDivElement;
  private outGroup: HTMLDivElement;
  private aside: HTMLDivElement;
  private status: HTMLDivElement;
  private tab = 0;
  // COMPARE from the field guide: the lookalike being compared.
  private comparing = '';
  private compareSeen = false;
  private compareAt = 0;
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
    this.transportRow = transport;
    this.playBtn = new Btn(transport, '', () => this.transport(true), { width: '44px', height: '32px' }).glyph('play', 'Play');
    this.stopBtn = new Btn(transport, '', () => this.transport(false), { width: '44px', height: '32px' }).glyph('stop', 'Stop');
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
    this.outGroup = out;
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
      const t = el('div', i === 0 ? 'tab active' : i < kBuiltTabs ? 'tab' : 'tab disabled', tabs);
      t.addEventListener('click', () => this.setTab(i));
      this.tabs.push(t);
    });

    // ---------------------------------------------------------- body
    const body = el('div', 'body', stage);
    body.style.position = 'relative';
    const aside = el('div', 'aside', body);
    this.aside = aside;
    this.listLabel = el('div', 'section', aside);
    this.list = el('div', 'birdlist sheet', aside);
    const main = box(body, { position: 'relative', flex: '1' });
    this.play = new PlayScreen(main, host, this.s, this.st, {
      refresh: () => this.refresh(),
      setPlaying: (on) => this.setPlaying(on),
      sendScene: () => this.sendScene(),
    });
    this.guide = new GuideScreen(main, host, this.s, {
      sex: (v) => this.setScene('sc_sex', 'sex', v),
      age: (v) => this.setScene('sc_age', 'age', v),
      season: (v) => this.setScene('sc_season', 'season', v),
      playType: (t) => this.playType(t),
      compare: (id) => this.startCompare(id),
    });
    // Quiz and chorus take the whole body: no bird list.
    const full = box(body, { position: 'absolute', left: '0', top: '0', width: '1280px', height: '100%', pointerEvents: 'none' });
    this.quiz = new QuizScreen(full, host, this.s, {
      refresh: () => this.refresh(),
      openGuide: (id) => { this.setTab(1); this.selectBird(id); },
    });
    this.chorus = new ChorusScreen(full, host, this.s, this.quiz.ids, this.quiz.ids.map((id) => host.birds.get(id)!), {
      refresh: () => this.refresh(),
      playBird: () => this.st.bird,
    });
    this.log = new LogScreen(full, this.s, {
      refresh: () => this.refresh(),
      openBird: (id) => { this.setTab(1); this.selectBird(id); },
      playBird: () => this.st.bird,
      playType: () => this.st.type,
    });
    for (const r of [this.quiz.root, this.chorus.root, this.log.root]) r.style.pointerEvents = 'auto';
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
    this.guide.resize(s);
    this.quiz.resize(s);
    this.chorus.resize(s);
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
    this.stopCompare();
    this.st.bird = id;
    this.host.post({ t: 'bird', id });
    this.play.setBird(ptr, id);
    this.guide.setBird(id);
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
    this.stopCompare();
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

  // Play and Stop in the header act on the screen shown.
  private transport(on: boolean) {
    if (this.tab === 2) { if (on) this.quiz.playAgain(); else this.quiz.stop(); }
    else if (this.tab === 3) this.chorus.setPlaying(on);
    else this.setPlaying(on);
  }

  // Sex, age and season are shared by PLAY and the field guide.
  private setScene(id: 'sc_sex' | 'sc_age' | 'sc_season', key: 'sex' | 'age' | 'season', v: number) {
    this.st[key] = v;
    this.host.param(id, v);
    this.refresh();
  }

  // A song type's play button in the field guide: that type, playing, one
  // phrase now. Autoplay goes on as it was set.
  private playType(type: number) {
    this.st.type = type;
    this.host.param('sc_type', type);
    this.setPlaying(true);
    this.host.trigger('ap_sing_once');
  }

  private startCompare(otherId: string) {
    const again = this.comparing === otherId;
    this.stopCompare();
    if (this.st.draw) this.play.setDraw(false); // COMPARE needs autoplay's sing once
    if (again) return; // a second click on the same COMPARE stops it
    void this.host.start();
    this.comparing = otherId;
    this.compareSeen = false;
    this.compareAt = performance.now();
    const st = this.st;
    this.host.post({ t: 'compare', first: st.bird, second: otherId, restore: { autoplay: st.apOn, play: st.playing, type: st.type }, type: 0 });
    this.refresh();
  }

  private stopCompare() {
    if (!this.comparing) return;
    this.host.post({ t: 'compareCancel' });
    this.comparing = '';
    this.refresh();
  }

  setTab(i: number) {
    if (i < 0 || i >= kBuiltTabs || i === this.tab) return;
    const was = this.tab;
    this.tab = i;
    this.stopCompare();
    if (was === 2) { this.quiz.leave(); this.sendScene(); }
    if (was === 3) { this.chorus.leave(); this.sendScene(); }
    this.tabs.forEach((t, k) => t.classList.toggle('active', k === i));
    this.play.root.style.display = i === 0 ? '' : 'none';
    this.guide.show(i === 1);
    this.quiz.show(i === 2);
    this.chorus.show(i === 3);
    this.log.show(i === 4);
    // The log has no transport (Log.dc.html), so the Play bird stops there.
    if (i === 4 && this.st.playing) this.setPlaying(false);
    this.aside.style.visibility = i < 2 ? '' : 'hidden';
    if (i === 2) this.quiz.enter();
    if (i === 3) this.chorus.enter();
    if (i === 4) this.log.enter();
    if (i !== 4 && document.activeElement instanceof HTMLElement) document.activeElement.blur();
    this.refresh();
  }

  private key(e: KeyboardEvent) {
    const fn = ['F1', 'F2', 'F3', 'F4', 'F5'].indexOf(e.key);
    if (fn >= 0) { this.setTab(fn); e.preventDefault(); return; }
    if (this.tab === 4) {
      // Log: Up and Down move through the entries, Enter opens the bird.
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { this.log.step(e.key === 'ArrowUp' ? -1 : 1); e.preventDefault(); }
      else if (e.key === 'Enter') { this.log.open(); e.preventDefault(); }
      return;
    }
    const digit = e.key >= '1' && e.key <= '4' && !e.metaKey && !e.ctrlKey ? Number(e.key) - 1 : -1;
    if (this.tab === 3) {
      // Chorus: 1 to 4 mute a lane, Space plays and stops.
      if (digit >= 0) { this.chorus.toggleMute(digit); e.preventDefault(); }
      else if (e.key === ' ') { this.chorus.setPlaying(!this.chorus.playing); e.preventDefault(); }
      return;
    }
    if (this.tab === 2) {
      // Quiz: 1 to 4 answer, Space plays again, Enter goes on.
      if (digit >= 0) { this.quiz.answer(digit); e.preventDefault(); }
      else if (e.key === ' ') { this.quiz.playAgain(); e.preventDefault(); }
      else if (e.key === 'Enter') { this.quiz.next_(); e.preventDefault(); }
      return;
    }
    if (e.key === ' ') { this.setPlaying(!this.st.playing); e.preventDefault(); }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { this.stepBird(e.key === 'ArrowUp' ? -1 : 1); e.preventDefault(); }
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
    this.guide.applyStrings();
    this.quiz.applyStrings();
    this.chorus.applyStrings();
    this.log.applyStrings();
    this.refresh();
  }

  refresh() {
    const st = this.st, s = this.s, tab = this.tab;
    const on = tab === 2 ? this.quiz.playing : tab === 3 ? this.chorus.playing : st.playing;
    this.transportRow.style.display = tab === 4 ? 'none' : '';
    this.outGroup.style.display = tab === 4 ? 'none' : '';
    this.playBtn.on(on);
    this.stopBtn.on(!on);
    // Play and the field guide have the list and stepper.
    const ownBird = tab < 2;
    this.prevBtn.show(ownBird).disabled(this.neighbour(-1) === null);
    this.nextBtn.show(ownBird).disabled(this.neighbour(1) === null);
    const b = this.birdEntry(st.bird);
    // The header readout: none in the chorus, in the quiz only once answered.
    const shown = tab >= 3 ? undefined : tab === 2 ? this.birdEntry(this.quiz.headerBird() ?? '') : b;
    this.readout.replaceChildren();
    this.readout.classList.toggle('empty', !shown);
    if (shown) {
      el('span', 'num', this.readout, shown.number);
      el('span', 'name', this.readout, this.name(shown));
      el('span', 'latin', this.readout, shown.latin);
    }
    if (b) {
      this.play.setName(this.name(b));
      this.play.birdName = this.name(b);
    }
    this.renderList();
    this.play.refresh();
    this.guide.setState({ sex: st.sex, age: st.age, season: st.season, type: st.type, comparing: this.comparing });

    // Status bar: state, summary, keys.
    this.status.replaceChildren();
    const audio = this.host.error ? `AUDIO: ${this.host.error}` : '';
    if (tab === 4) {
      el('span', '', this.status, s.t('tab.log'));
      el('span', 'summary', this.status, audio || this.log.statusText());
      for (const k of ['log.keys_entry', 'log.keys_open']) el('span', 'keys', this.status, s.t(k));
      return;
    }
    if (tab === 3) {
      el('span', '', this.status, s.t(this.chorus.playing ? 'status.playing' : 'status.stopped'));
      el('span', 'summary', this.status, audio || this.chorus.statusText());
      for (const k of ['status.keys_play', 'chorus.keys_mute']) el('span', 'keys', this.status, s.t(k));
      return;
    }
    if (tab === 2) {
      el('span', '', this.status, s.t('tab.quiz'));
      el('span', 'summary', this.status, audio || this.quiz.statusText());
      for (const k of ['quiz.status_keys_answer', 'quiz.status_keys_again', 'quiz.status_keys_next']) el('span', 'keys', this.status, s.t(k));
      return;
    }
    el('span', '', this.status, s.t(st.playing ? 'status.playing' : 'status.stopped'));
    const parts = [st.season, st.time, st.type, st.place].map((v, r) => s.t(`${kSceneKeys[r]}.${kSceneOptions[r][v]}`));
    if (b) parts.unshift(upper(this.name(b)));
    const other = this.birdEntry(this.comparing);
    let summary = this.play.error || audio || parts.join(', ');
    if (other && b && !this.play.error && !audio) summary = s.t('status.comparing', { a: upper(this.name(b)), b: upper(this.name(other)) });
    el('span', 'summary', this.status, summary);
    for (const k of ['status.keys_play', 'status.keys_bird', 'status.keys_screen_web']) el('span', 'keys', this.status, s.t(k));
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
    // The list scrolls (50 birds, agreed with Eirik 2026-11-26): keep the
    // chosen bird in view without scrolling the page around it.
    const sel = this.list.querySelector<HTMLElement>('.row.sel');
    if (sel) {
      const top = sel.offsetTop - this.list.offsetTop, bottom = top + sel.offsetHeight, view = this.list.clientHeight;
      if (top < this.list.scrollTop + 24) this.list.scrollTop = Math.max(0, top - 24);
      else if (bottom > this.list.scrollTop + view) this.list.scrollTop = bottom - view;
    }
  }

  private frame() {
    this.play.poll();
    if (this.tab === 1) this.guide.poll(this.play.plate.open);
    if (this.tab === 2) this.quiz.poll();
    if (this.tab === 3) this.chorus.poll();
    // COMPARE ends on its own; clear the button once the worklet says so.
    if (this.comparing) {
      if (this.host.compare.running) this.compareSeen = true;
      else if (this.compareSeen || performance.now() - this.compareAt > 1500) { this.comparing = ''; this.refresh(); }
    }
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
