// The desktop's IMPORT FROM PHONE EXPORT and ADD FILES. The export format is
// in prd.md (Phone export): manifest.json, recordings/<id>.<ext> plus <id>.png
// thumbnails, pictures/<id>.<ext>. An id already stored is skipped, and
// fields the reader does not know are ignored, so later versions still read.

import { index } from '../data.ts';
import { kExportFormat } from './export.ts';
import { newId, pictureIds, recordingIds, savePicture, saveRecording, type Picture, type Recording } from './store.ts';
import { unzip, ZipError } from './unzip.ts';

const kTypeIds = ['song', 'call', 'alarm', 'flight'];

export interface ImportResult {
  recordings: number;
  pictures: number;
  known: number;    // already in the collection, skipped
  broken: number;   // listed in the manifest but missing or unreadable
}

// key is a string id in data/strings (coll.err_*), so the reason shows in both languages.
export class ImportError extends Error {
  constructor(readonly key: string, detail = '') { super(detail || key); }
}

const str = (v: unknown) => (typeof v === 'string' ? v : '');
const num = (v: unknown, d: number) => (typeof v === 'number' && Number.isFinite(v) ? v : d);

// Bytes of a PNG to a data URL, as the phone keeps its thumbnails.
function pngUrl(b: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < b.length; i += 0x8000) bin += String.fromCharCode(...b.subarray(i, i + 0x8000));
  return `data:image/png;base64,${btoa(bin)}`;
}

const knownBird = (id: string) => index.birds.some((b) => b.id === id);

export async function importExport(file: Blob): Promise<ImportResult> {
  let files: Map<string, Uint8Array<ArrayBuffer>>;
  try {
    files = await unzip(file);
  } catch (e) {
    throw new ImportError(e instanceof ZipError ? 'coll.err_zip' : 'coll.err_read', e instanceof Error ? e.message : String(e));
  }
  const raw = files.get('manifest.json');
  if (!raw) throw new ImportError('coll.err_manifest');
  let m: Record<string, unknown>;
  try { m = JSON.parse(new TextDecoder().decode(raw)); } catch { throw new ImportError('coll.err_format'); }
  if (!m || m.format !== kExportFormat) throw new ImportError('coll.err_format');

  const res: ImportResult = { recordings: 0, pictures: 0, known: 0, broken: 0 };
  const haveRec = await recordingIds(), havePic = await pictureIds();
  for (const r of Array.isArray(m.recordings) ? m.recordings : []) {
    const id = str(r?.id);
    if (!id) { res.broken++; continue; }
    if (haveRec.has(id)) { res.known++; continue; }
    const audio = files.get(str(r.audio));
    if (!audio) { res.broken++; continue; }
    const thumb = files.get(str(r.thumb));
    const bird = str(r.bird);
    const rec: Recording = {
      id,
      bird: knownBird(bird) ? bird : '',
      latin: str(r.latin) || (knownBird(bird) ? '' : bird),
      type: Math.max(0, kTypeIds.indexOf(str(r.type))),
      seconds: Math.max(0, Math.round(num(r.seconds, 0))),
      date: str(r.date),
      confidence: Math.min(1, Math.max(0, num(r.confidence, 0))),
      mime: str(r.mime) || 'audio/mp4',
      audio: new Blob([audio], { type: str(r.mime) || 'audio/mp4' }),
      thumb: thumb ? pngUrl(thumb) : '',
      from: 'phone',
    };
    await saveRecording(rec);
    haveRec.add(id);
    res.recordings++;
  }
  for (const p of Array.isArray(m.pictures) ? m.pictures : []) {
    const id = str(p?.id);
    if (!id) { res.broken++; continue; }
    if (havePic.has(id)) { res.known++; continue; }
    const image = files.get(str(p.image));
    if (!image) { res.broken++; continue; }
    const bird = str(p.bird);
    const pic: Picture = {
      id, bird: knownBird(bird) ? bird : '', date: str(p.date),
      image: new Blob([image], { type: str(p.mime) || 'image/jpeg' }), from: 'phone',
    };
    await savePicture(pic);
    havePic.add(id);
    res.pictures++;
  }
  return res;
}

// ------------------------------------------------------------ ADD FILES

function stamp(ms: number): string {
  const d = new Date(ms), p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

// In-place radix-2 FFT on re and im.
function fft(re: Float32Array, im: Float32Array) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const a = (-2 * Math.PI) / len, wr = Math.cos(a), wi = Math.sin(a);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const ur = re[i + k], ui = im[i + k];
        const vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci;
        const vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr;
        re[i + k] = ur + vr; im[i + k] = ui + vi;
        re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi;
        const t = cr * wr - ci * wi;
        ci = cr * wi + ci * wr;
        cr = t;
      }
    }
  }
}

// A 120x40 sonogram thumbnail of the first 30 s, 0 to 8 kHz, ink on face,
// like the ones the phone draws while it listens.
function thumbnail(buf: AudioBuffer): string {
  const W = 120, H = 40, N = 1024;
  const sr = buf.sampleRate, ch = buf.getChannelData(0);
  const len = Math.min(ch.length, Math.round(30 * sr));
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  if (!g) return '';
  g.fillStyle = '#efe8d6';
  g.fillRect(0, 0, W, H);
  const img = g.getImageData(0, 0, W, H);
  const re = new Float32Array(N), im = new Float32Array(N);
  const top = Math.min(N / 2, Math.round((8000 / sr) * N));
  const cols: Float32Array[] = [];
  let peak = 1e-9;
  for (let x = 0; x < W; x++) {
    const at = Math.floor((x / W) * Math.max(0, len - N));
    for (let i = 0; i < N; i++) { re[i] = (ch[at + i] ?? 0) * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / N)); im[i] = 0; }
    fft(re, im);
    const col = new Float32Array(H);
    for (let y = 0; y < H; y++) {
      const b0 = Math.floor((y / H) * top), b1 = Math.max(b0 + 1, Math.floor(((y + 1) / H) * top));
      let m = 0;
      for (let b = b0; b < b1; b++) m = Math.max(m, Math.hypot(re[b], im[b]));
      col[y] = m;
      peak = Math.max(peak, m);
    }
    cols.push(col);
  }
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) {
      const db = 20 * Math.log10(cols[x][y] / peak + 1e-9);
      const a = Math.min(1, Math.max(0, (db + 50) / 40));
      const o = ((H - 1 - y) * W + x) * 4;
      // Mix face (#efe8d6) towards ink (#221c14).
      img.data[o] = 0xef + (0x22 - 0xef) * a;
      img.data[o + 1] = 0xe8 + (0x1c - 0xe8) * a;
      img.data[o + 2] = 0xd6 + (0x14 - 0xd6) * a;
    }
  }
  g.putImageData(img, 0, 0);
  return c.toDataURL('image/png');
}

export interface AddResult { added: number; skipped: number }

// ADD FILES: audio becomes a recording of `bird` (song, no match), a picture
// a picture of `bird`. The date is the file's own. Anything else is skipped.
export async function addFiles(list: FileList | File[], bird: string): Promise<AddResult> {
  const res: AddResult = { added: 0, skipped: 0 };
  let ctx: OfflineAudioContext | null = null;
  for (const f of Array.from(list)) {
    const date = stamp(f.lastModified || Date.now());
    if (f.type.startsWith('image/')) {
      await savePicture({ id: newId(), bird, date, image: f, from: 'file' });
      res.added++;
      continue;
    }
    if (!f.type.startsWith('audio/') && !/\.(m4a|mp3|wav|aac|webm|ogg|flac|aif|aiff|caf)$/i.test(f.name)) { res.skipped++; continue; }
    let seconds = 0, thumb = '';
    try {
      ctx ??= new OfflineAudioContext(1, 1, 48000);
      const buf = await ctx.decodeAudioData(await f.arrayBuffer());
      seconds = Math.round(buf.duration);
      thumb = thumbnail(buf);
    } catch { /* the browser cannot decode it: keep it, without length and thumbnail */ }
    await saveRecording({
      id: newId(), bird, latin: '', type: 0, seconds, date, confidence: -1,
      mime: f.type || 'audio/mp4', audio: f, thumb, from: 'file',
    });
    res.added++;
  }
  return res;
}
