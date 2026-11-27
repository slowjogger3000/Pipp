// The phone export (prd.md, Phone export): one stored zip with
// manifest.json, recordings/<id>.<ext> plus <id>.png thumbnails, and
// pictures/<id>.<ext>. The desktop's IMPORT FROM PHONE EXPORT reads it.

import { now, type Picture, type Recording } from './store.ts';
import { zip, type ZipEntry } from './zip.ts';

export const kExportFormat = 'pipp-export';
export const kExportVersion = 1;
const kTypeIds = ['song', 'call', 'alarm', 'flight'] as const;

export function audioExt(mime: string): string {
  return mime.includes('mp4') || mime.includes('aac') ? 'm4a' : mime.includes('webm') ? 'webm' : mime.includes('ogg') ? 'ogg' : mime.includes('wav') ? 'wav' : 'bin';
}

export function imageExt(mime: string): string {
  return mime.includes('png') ? 'png' : mime.includes('heic') ? 'heic' : mime.includes('heif') ? 'heif' : mime.includes('webp') ? 'webp' : 'jpg';
}

// "data:image/png;base64,...." to bytes; empty when it is not a data URL.
function dataUrlBytes(url: string): Uint8Array<ArrayBuffer> {
  const i = url.indexOf(';base64,');
  if (!url.startsWith('data:') || i < 0) return new Uint8Array(0);
  const bin = atob(url.slice(i + 8));
  const out = new Uint8Array(bin.length);
  for (let k = 0; k < bin.length; k++) out[k] = bin.charCodeAt(k);
  return out;
}

const bytes = async (b: Blob) => new Uint8Array(await b.arrayBuffer());

export async function buildExport(recs: Recording[], pics: Picture[]): Promise<File> {
  const entries: ZipEntry[] = [];
  const recordings = [];
  for (const r of recs) {
    const audio = `recordings/${r.id}.${audioExt(r.mime)}`;
    entries.push({ name: audio, data: await bytes(r.audio) });
    const png = dataUrlBytes(r.thumb);
    const thumb = png.length ? `recordings/${r.id}.png` : '';
    if (thumb) entries.push({ name: thumb, data: png });
    recordings.push({
      id: r.id, bird: r.bird, latin: r.latin, type: kTypeIds[r.type] ?? 'song', seconds: r.seconds,
      date: r.date, confidence: r.confidence, mime: r.mime, audio, thumb,
    });
  }
  const pictures = [];
  for (const p of pics) {
    const mime = p.image.type || 'image/jpeg';
    const image = `pictures/${p.id}.${imageExt(mime)}`;
    entries.push({ name: image, data: await bytes(p.image) });
    pictures.push({ id: p.id, bird: p.bird, date: p.date, mime, image });
  }
  const stamp = now();
  const manifest = { format: kExportFormat, version: kExportVersion, exported: stamp, recordings, pictures };
  entries.unshift({ name: 'manifest.json', data: new Uint8Array(new TextEncoder().encode(JSON.stringify(manifest, null, 2))) });
  return new File([zip(entries)], `pipp-export-${stamp.slice(0, 10)}.zip`, { type: 'application/zip' });
}
