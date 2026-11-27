// LYTT on the phone, from design/Listen.dc.html and ListenDenied.dc.html: a
// 56px listen button with the red dot and a timer beside the microphone
// level, the sonogram of the last 4 s, the recognised bird with runners-up,
// then LAGRE OPPTAK, TA BILDE, SAMMENLIGN, ÅPNE I BOK and ÅPNE SAMLING.
//
// Red is used here and nowhere else: it means recording. Recognition is the
// stub in listen/recognise.ts until the engine is chosen. While it is a stub
// (Eirik, 2026-11-27: version 1 records only) the result panel is replaced by
// a bird chooser: you say which bird it was, and the recording, the picture,
// COMPARE and OPEN IN GUIDE use that bird. A recording saved this way has no
// match (confidence -1, shown as –).

import { birdFile, hasSound, index, type IndexBird } from '../data.ts';
import { Mic, kSonoH, kSonoW } from '../listen/mic.ts';
import { isStub, recognise, type Match } from '../listen/recognise.ts';
import { newId, now, savePicture, saveRecording } from '../listen/store.ts';
import { Btn, Canvas, box, colour, el, graphPaper, number } from './dom.ts';
import { upper, type Strings } from './strings.ts';

const kRecRed = '#c2331a'; // design/Listen.dc.html, the recording dot
const kFirstGuessS = 2;
const kGuessEveryS = 3;
const kUnsure = 0.5;

export interface ListenHandlers {
  refresh(): void;
  openGuide(id: string): void;
  openCollection(): void;
  singBird(id: string): void;          // Pipp's own bird, one phrase
  logHeard(id: string, type: number): void;
  playBird(): string;
}

export class ListenScreen {
  readonly root: HTMLDivElement;
  readonly mic = new Mic();
  private matches: Match[] = [];
  private nextGuess = 0;
  private message = '';
  private player: HTMLAudioElement | null = null;

  private mainBtn: HTMLButtonElement;
  private dot: HTMLSpanElement;
  private mainLabel: HTMLSpanElement;
  private timer: HTMLSpanElement;
  private levelLabel: HTMLSpanElement;
  private levelBar: HTMLSpanElement;
  private sonoSec: HTMLDivElement;
  private sonoTitle: HTMLDivElement;
  private sonoNote: HTMLSpanElement;
  private axis: HTMLDivElement;
  private canvas: Canvas;
  private off = document.createElement('canvas');
  private timeAxis: HTMLDivElement;
  private caption: HTMLDivElement;
  private deniedSec: HTMLDivElement;
  private deniedTitle: HTMLDivElement;
  private deniedHeadNote: HTMLSpanElement;
  private deniedBig: HTMLDivElement;
  private deniedText: HTMLParagraphElement;
  private settingsBtn: Btn;
  private resultSec: HTMLDivElement;
  private resultTitle: HTMLDivElement;
  private resultCount: HTMLSpanElement;
  private resultBody: HTMLDivElement;
  private actions: Btn[] = [];
  private note: HTMLParagraphElement;
  private fileIn: HTMLInputElement;
  private chosen = '';               // the bird the user says it was (record-only mode)
  private chooseSec: HTMLDivElement;
  private chooseTitle: HTMLDivElement;
  private chooseNote: HTMLSpanElement;
  private chooseName: HTMLDivElement;
  private chooseLatin: HTMLDivElement;

  constructor(parent: HTMLElement, private s: Strings, private on: ListenHandlers) {
    const root = box(parent, { display: 'none', flexDirection: 'column', gap: '12px' });
    this.root = root;

    // ---------------------------------------------------------- button and level
    const top = box(root, { display: 'flex', alignItems: 'center', gap: '8px' });
    this.mainBtn = el('button', 'btn listenbtn', top);
    this.mainBtn.type = 'button';
    this.mainBtn.addEventListener('click', () => void this.toggle());
    this.dot = el('span', 'recdot', this.mainBtn);
    this.dot.style.background = kRecRed;
    this.mainLabel = el('span', 'mlabel', this.mainBtn);
    this.timer = el('span', 'mtimer', this.mainBtn);
    const level = box(top, { width: '96px', height: '56px', flex: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px', padding: '0 6px' }, 'well');
    this.levelLabel = el('span', 'field', level);
    const track = el('span', '', level);
    Object.assign(track.style, { height: '8px', display: 'block', background: 'rgb(34 28 20 / 0.08)' });
    this.levelBar = el('span', '', track);
    Object.assign(this.levelBar.style, { height: '8px', display: 'block', width: '0', background: 'var(--ink)' });

    // ---------------------------------------------------------- sonogram
    this.sonoSec = box(root, { display: 'flex', flexDirection: 'column', border: '1px solid var(--ink)' });
    const sh = box(this.sonoSec, { justifyContent: 'space-between' }, 'panelhead');
    this.sonoTitle = el('div', 'title', sh);
    this.sonoNote = el('span', 'label', sh);
    const graph = box(this.sonoSec, { display: 'flex', height: `${kSonoH}px` });
    this.axis = box(graph, { flex: '1', minWidth: '0', position: 'relative', font: '400 9px/12px var(--mono)', color: 'var(--inkSoft)' });
    const wrap = box(graph, { borderLeft: '1px solid var(--ink)', flex: 'none' });
    this.canvas = new Canvas(wrap, kSonoW, kSonoH);
    this.off.width = kSonoW;
    this.off.height = kSonoH;
    this.timeAxis = box(this.sonoSec, { height: '16px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--ink)', font: '400 9px/14px var(--mono)', color: 'var(--inkSoft)' });
    this.caption = box(this.sonoSec, { height: '18px', borderTop: '1px solid var(--ink)', padding: '0 8px' }, 'cap');

    // ---------------------------------------------------------- denied
    this.deniedSec = box(root, { display: 'none', flexDirection: 'column', border: '1px solid var(--ink)' });
    const dh = box(this.deniedSec, { justifyContent: 'space-between' }, 'panelhead');
    this.deniedTitle = el('div', 'title', dh);
    this.deniedHeadNote = el('span', 'label', dh);
    const dbody = box(this.deniedSec, { display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px 10px', background: 'var(--face)' });
    this.deniedBig = box(dbody, { font: '400 28px/1.05 var(--serif)' });
    this.deniedText = el('p', '', dbody);
    this.deniedText.style.margin = '0';
    this.settingsBtn = new Btn(dbody, '', () => { window.location.href = 'app-settings:'; }, { height: '44px' });

    // ---------------------------------------------------------- result
    this.resultSec = box(root, { display: 'none', flexDirection: 'column', border: '1px solid var(--ink)' });
    const rh = box(this.resultSec, { justifyContent: 'space-between' }, 'panelhead');
    this.resultTitle = el('div', 'title', rh);
    this.resultCount = el('span', 'label', rh);
    this.resultBody = box(this.resultSec, { display: 'flex', flexDirection: 'column' });

    // ---------------------------------------------------------- bird chooser (no recognition)
    this.chooseSec = box(root, { display: 'none', flexDirection: 'column', border: '1px solid var(--ink)' });
    const ch = box(this.chooseSec, { justifyContent: 'space-between' }, 'panelhead');
    this.chooseTitle = el('div', 'title', ch);
    this.chooseNote = el('span', 'label', ch);
    const crow = box(this.chooseSec, { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 8px', background: 'var(--face)' });
    new Btn(crow, '', () => this.step(-1), { width: '44px', height: '44px', padding: '0', flex: 'none' }).glyph('prev', 'Previous bird');
    const cname = box(crow, { flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' });
    this.chooseName = box(cname, { font: '400 28px/1.05 var(--serif)', textAlign: 'center' });
    this.chooseLatin = box(cname, { color: 'var(--inkSoft)', fontStyle: 'italic' });
    new Btn(crow, '', () => this.step(1), { width: '44px', height: '44px', padding: '0', flex: 'none' }).glyph('next', 'Next bird');

    // ---------------------------------------------------------- actions
    const grid = box(root, { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '6px' });
    const act = (f: () => void) => new Btn(grid, '', f, { height: '44px', padding: '0', minWidth: '0' });
    this.actions = [
      act(() => void this.save()),
      act(() => this.fileIn.click()),
      act(() => void this.compare()),
      act(() => { const id = this.bestId(); if (id) this.on.openGuide(id); }),
      act(() => this.on.openCollection()),
    ];
    this.fileIn = el('input', '', root);
    Object.assign(this.fileIn, { type: 'file', accept: 'image/*' });
    this.fileIn.setAttribute('capture', 'environment');
    this.fileIn.style.display = 'none';
    this.fileIn.addEventListener('change', () => void this.picture());
    this.note = el('p', '', root);
    Object.assign(this.note.style, { margin: '0', color: 'var(--inkSoft)' });
  }

  show(on: boolean) {
    this.root.style.display = on ? 'flex' : 'none';
    if (!on) void this.stop();
  }

  resize(scale: number) { this.canvas.resize(scale); }

  private name(b: IndexBird | undefined): string { return b ? (this.s.no ? b.name.no : b.name.en) : ''; }
  private entry(id: string | undefined) { return index.birds.find((b) => b.id === id); }
  private bestId(): string { return isStub ? this.chosenId() : this.matches[0]?.birdId ?? ''; }
  private chosenId(): string { return this.chosen || this.on.playBird(); }

  private step(d: number) {
    const ids = index.birds.map((b) => b.id);
    const i = ids.indexOf(this.chosenId());
    this.chosen = ids[(i + d + ids.length) % ids.length];
    this.update();
  }

  private async toggle() {
    if (this.mic.state === 'listening') await this.stop();
    else {
      this.player?.pause();
      this.matches = [];
      this.message = '';
      await this.mic.start();
      this.nextGuess = kFirstGuessS;
    }
    this.update();
  }

  async stop() {
    if (this.mic.state !== 'listening') return;
    await this.mic.stop();
    this.update();
  }

  // LAGRE OPPTAK: the session so far, under the best match, and a log line.
  private async save() {
    const audio = await this.mic.recording();
    if (!audio) return;
    const m: Match | undefined = isStub ? { birdId: this.chosenId(), confidence: -1 } : this.matches[0];
    const thumb = document.createElement('canvas');
    thumb.width = 120;
    thumb.height = 40;
    const g = thumb.getContext('2d')!;
    g.fillStyle = colour.face;
    g.fillRect(0, 0, 120, 40);
    g.drawImage(this.off, 0, 0, 120, 40);
    await saveRecording({
      id: newId(), bird: m?.birdId ?? '', latin: m?.latinName ?? '', type: 0, seconds: Math.round(this.mic.seconds),
      date: now(), confidence: m?.confidence ?? 0, mime: audio.type, audio, thumb: thumb.toDataURL('image/png'),
    });
    if (m?.birdId) this.on.logHeard(m.birdId, 0);
    this.message = this.s.t('listen.saved', { bird: upper(this.name(this.entry(m?.birdId)) || m?.latinName || '') });
    this.update();
  }

  // TA BILDE: the picture goes under the best match, or the Play bird.
  private async picture() {
    const f = this.fileIn.files?.[0];
    this.fileIn.value = '';
    if (!f) return;
    const bird = this.bestId() || this.on.playBird();
    await savePicture({ id: newId(), bird, date: now(), image: f });
    this.message = this.s.t('listen.picture_saved', { bird: upper(this.name(this.entry(bird))) });
    this.update();
  }

  // SAMMENLIGN: the recording, then Pipp's bird.
  private async compare() {
    const id = this.bestId();
    await this.stop();
    const audio = await this.mic.recording();
    if (!audio || !id) return;
    this.player?.pause();
    const p = new Audio(URL.createObjectURL(audio));
    this.player = p;
    p.onended = () => {
      URL.revokeObjectURL(p.src);
      if (hasSound(id)) this.on.singBird(id);
    };
    await p.play().catch(() => p.onended?.(new Event('ended')));
  }

  applyStrings() {
    const s = this.s;
    this.levelLabel.textContent = s.t('listen.mic_short');
    this.sonoTitle.textContent = s.t('listen.mic');
    this.sonoNote.textContent = s.t('listen.last_4s');
    this.axis.replaceChildren();
    for (const [text, pos] of [[s.t('axis.khz', { n: '8' }), 'top: 2px'], [s.t('axis.khz', { n: '4' }), 'top: 74px'], ['0', 'bottom: 2px']]) {
      el('span', '', this.axis, text).style.cssText = `position: absolute; right: 4px; ${pos}`;
    }
    this.timeAxis.replaceChildren();
    for (let k = 4; k >= 1; k--) box(this.timeAxis, { width: '80px', paddingLeft: '2px' }).textContent = k === 4 ? `−4 ${s.t('unit.s')}` : `−${k}`;
    this.caption.replaceChildren();
    el('b', '', this.caption, `${s.t('fig')} 1`);
    this.caption.append(s.t('listen.caption'));
    this.deniedTitle.textContent = s.t('listen.mic');
    this.deniedHeadNote.textContent = s.t('listen.off');
    this.settingsBtn.text(s.t('listen.settings'));
    this.resultTitle.textContent = s.t('listen.who');
    ['listen.save', 'listen.picture', 'listen.compare', 'phone.quiz.open_guide', 'listen.open_collection'].forEach((k, i) => this.actions[i].text(s.t(k)));
    this.update();
  }

  update() {
    const s = this.s, st = this.mic.state;
    const listening = st === 'listening', blocked = st === 'denied' || st === 'unsupported';
    this.mainBtn.classList.toggle('on', listening);
    this.mainBtn.disabled = blocked;
    this.dot.style.display = listening ? '' : 'none';
    this.mainLabel.textContent = s.t(listening ? 'listen.listening' : 'listen.start');
    this.sonoSec.style.display = blocked ? 'none' : 'flex';
    this.deniedSec.style.display = blocked ? 'flex' : 'none';
    this.deniedBig.textContent = s.t(st === 'unsupported' ? 'listen.unsupported_title' : 'listen.denied_title');
    this.deniedText.textContent = s.t(st === 'unsupported' ? 'listen.unsupported_text' : 'listen.denied_text');
    // Only the app can open its own settings page.
    const native = !!(window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.();
    this.settingsBtn.show(st === 'denied' && native);
    this.note.textContent = s.t(blocked ? 'listen.denied_note' : isStub ? 'listen.note_record' : 'listen.note');
    this.chooseSec.style.display = isStub && !blocked ? 'flex' : 'none';
    const c = this.entry(this.chosenId());
    this.chooseTitle.textContent = s.t('listen.which');
    this.chooseNote.textContent = s.t('listen.file_under');
    this.chooseName.textContent = this.name(c);
    this.chooseLatin.textContent = c?.latin ?? '';

    this.renderResult();
    const best = this.bestId();
    this.actions[0].disabled(!this.mic.canSave);
    this.actions[1].disabled(false);
    this.actions[2].disabled(!this.mic.canSave || !best || !hasSound(best));
    this.actions[3].disabled(!best || !birdFile(best, 'bird'));
    this.on.refresh();
  }

  private renderResult() {
    const s = this.s, ms = this.matches;
    this.resultSec.style.display = ms.length ? 'flex' : 'none';
    this.resultBody.replaceChildren();
    if (!ms.length) return;
    this.resultCount.textContent = s.t('listen.suggestions', { n: String(ms.length) });
    const pct = (c: number) => `${number(Math.round(c * 100), 0, s.no)} %`;
    const title = (m: Match) => this.name(this.entry(m.birdId)) || m.latinName || '';
    const best = ms[0];
    const top = box(this.resultBody, { display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px 8px', background: 'var(--face)', borderBottom: '1px solid var(--ink)' });
    if (!best.birdId) top.style.backgroundImage = 'var(--hatching)';
    const l1 = box(top, { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px' });
    box(l1, { font: '400 32px/1 var(--serif)' }).textContent = title(best);
    box(l1, { font: '500 12px var(--mono)', whiteSpace: 'nowrap' }).textContent = pct(best.confidence);
    const sub = [this.entry(best.birdId)?.latin ?? best.latinName ?? '', s.t('listen.song')];
    if (best.confidence < kUnsure) sub.push(s.t('listen.unsure'));
    const l2 = box(top, { color: 'var(--inkSoft)' });
    l2.textContent = sub.filter((x) => x).join(' · ');
    if (!best.birdId) el('span', 'notinpipp', l2, s.t('listen.not_in_pipp'));
    const bar = box(top, { height: '8px', display: 'flex', border: '1px solid var(--ink)', background: 'var(--sheet)' });
    box(bar, { width: `${Math.round(best.confidence * 100)}%`, background: 'var(--ink)' });
    ms.slice(1).forEach((m, i) => {
      const row = box(this.resultBody, { height: '44px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px' });
      if (i + 2 < ms.length) row.style.borderBottom = '1px solid var(--divider)';
      if (!m.birdId) row.style.backgroundImage = 'var(--hatching)';
      const n = box(row, { flex: '1', minWidth: '0', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' });
      n.textContent = title(m);
      if (!m.birdId) el('span', 'notinpipp', n, s.t('listen.not_in_pipp'));
      const b = box(row, { width: '96px', height: '8px', display: 'flex', border: '1px solid var(--ink)', background: 'var(--face)', flex: 'none' });
      box(b, { width: `${Math.round(m.confidence * 100)}%`, background: 'var(--ink)' });
      box(row, { width: '36px', textAlign: 'right', font: '500 12px var(--mono)', flex: 'none' }).textContent = pct(m.confidence);
    });
  }

  statusLeft(): string { return this.s.t(this.mic.state === 'listening' ? 'listen.status_listening' : this.mic.state === 'denied' ? 'listen.status_off' : 'phone.tab.listen'); }
  statusText(): string { return this.message || (this.mic.state === 'denied' ? '' : this.s.t('listen.offline')); }

  // Once per frame while shown.
  poll() {
    const mic = this.mic;
    mic.poll();
    const secs = mic.seconds;
    const t = mic.startedAt ? `${Math.floor(secs / 60)}:${String(Math.floor(secs % 60)).padStart(2, '0')}` : '';
    if (this.timer.textContent !== t) this.timer.textContent = t;
    this.levelBar.style.width = `${Math.round(mic.level * 100)}%`;
    if (!isStub && mic.state === 'listening' && secs >= this.nextGuess) {
      this.nextGuess = secs + kGuessEveryS;
      void recognise(mic.window()).then((m) => { this.matches = m; this.update(); });
    }
    const g = this.canvas.begin();
    graphPaper(g, kSonoW, kSonoH);
    g.fillStyle = colour.shadow;
    g.fillRect(0, 0, kSonoW, 1);
    g.fillRect(0, 0, 1, kSonoH);
    this.off.getContext('2d')!.putImageData(mic.image, 0, 0);
    g.drawImage(this.off, 0, 0);
  }
}
