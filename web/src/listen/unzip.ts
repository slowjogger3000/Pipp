// A minimal zip reader for the phone export (prd.md, Phone export). It reads
// the central directory, so it does not depend on what the local headers say
// about sizes. Stored entries are what Tipp writes; deflated entries (a zip
// made again by another tool) are inflated with DecompressionStream where the
// browser has it. No dependency.

import { crc32 } from './zip.ts';

export interface UnzipEntry { name: string; data: Uint8Array<ArrayBuffer> }

export class ZipError extends Error {}

async function inflate(raw: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
  if (typeof DecompressionStream === 'undefined') throw new ZipError('deflate not supported');
  const stream = new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

export async function unzip(file: Blob): Promise<Map<string, Uint8Array<ArrayBuffer>>> {
  const buf = new Uint8Array(await file.arrayBuffer());
  const v = new DataView(buf.buffer);
  // The end of central directory record: 22 bytes plus a comment of at most 64 KiB.
  let end = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 22 - 0xffff); i--) {
    if (v.getUint32(i, true) === 0x06054b50) { end = i; break; }
  }
  if (end < 0) throw new ZipError('not a zip file');
  const count = v.getUint16(end + 10, true);
  let p = v.getUint32(end + 16, true);
  const dec = new TextDecoder();
  const out = new Map<string, Uint8Array<ArrayBuffer>>();
  for (let k = 0; k < count; k++) {
    if (p + 46 > buf.length || v.getUint32(p, true) !== 0x02014b50) throw new ZipError('bad central directory');
    const method = v.getUint16(p + 10, true);
    const crc = v.getUint32(p + 16, true);
    const csize = v.getUint32(p + 20, true);
    const size = v.getUint32(p + 24, true);
    const nlen = v.getUint16(p + 28, true), xlen = v.getUint16(p + 30, true), clen = v.getUint16(p + 32, true);
    const local = v.getUint32(p + 42, true);
    const name = dec.decode(buf.subarray(p + 46, p + 46 + nlen));
    p += 46 + nlen + xlen + clen;
    if (name.endsWith('/')) continue; // a folder
    if (local + 30 > buf.length || v.getUint32(local, true) !== 0x04034b50) throw new ZipError(`bad entry ${name}`);
    const start = local + 30 + v.getUint16(local + 26, true) + v.getUint16(local + 28, true);
    if (start + csize > buf.length) throw new ZipError(`entry ${name} runs past the end`);
    const raw = buf.slice(start, start + csize);
    const data = method === 0 ? raw : method === 8 ? await inflate(raw) : null;
    if (!data) throw new ZipError(`entry ${name} uses method ${method}`);
    if (data.length !== size || crc32(data) !== crc) throw new ZipError(`entry ${name} is damaged`);
    out.set(name, data);
  }
  return out;
}
