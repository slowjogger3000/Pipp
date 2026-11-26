// Same seed, same song: runs a bird in tipp.wasm exactly as tipp-render
// does (48 kHz, 512-sample blocks, play off 100 ms before the end) and
// compares the phrase log with the native one, bit for bit.
//
//   node web/scripts/check-seed.ts [--seconds 120] [--seeds 1,7,4242]
//
// Needs build/Release/tipp-render and web/public/tipp.wasm. Exits 0 when
// every bird, type and seed matches, 1 when one differs.

import { execFileSync } from 'node:child_process';
import { readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Tipp } from '../src/core/tipp.ts';

const root = new URL('../../', import.meta.url).pathname;
const args = process.argv.slice(2);
const opt = (name: string, def: string) => {
  const i = args.indexOf(name);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : def;
};
const seconds = Number(opt('--seconds', '120'));
const seeds = opt('--seeds', '1,7,4242').split(',').map(Number);
const kSr = 48000, kBlock = 512;

const tipp = await Tipp.load(readFileSync(join(root, 'web/public/tipp.wasm')));
const x = tipp.x;
const index = JSON.parse(readFileSync(join(root, 'data/birds/index.json'), 'utf8'));
const ids: string[] = [];
for (const b of index.birds) ids.push(b.id);

function hex(f: number): string {
  const a = new Float32Array([f]);
  return new Uint32Array(a.buffer)[0].toString(16).padStart(8, '0');
}

function wasmLog(bird: number, type: number, seed: number): string {
  const e = x.tipp_engine_new();
  x.tipp_engine_set_seed(e, seed);
  x.tipp_engine_set_param(e, tipp.index('sc_type'), type);
  x.tipp_engine_prepare(e, kSr);
  x.tipp_engine_set_bird(e, bird);
  x.tipp_engine_set_param(e, tipp.index('pb_play'), 1);
  const l = tipp.alloc(kBlock * 4), r = tipp.alloc(kBlock * 4);
  const frames = Math.floor(seconds * kSr);
  const stopAt = frames - Math.floor(0.1 * kSr);
  let out = '', last = 0;
  for (let pos = 0; pos < frames; pos += kBlock) {
    if (pos >= stopAt) x.tipp_engine_set_param(e, tipp.index('pb_play'), 0);
    x.tipp_engine_process(e, l, r, Math.min(kBlock, frames - pos));
    const v = tipp.phrase(e);
    if (!v || v.number === 0 || v.number === last) continue;
    last = v.number;
    out += `${v.number} len ${hex(v.lengthMs)}:`;
    for (const n of v.notes) out += ` ${n.syl}@${hex(n.startMs)}*${hex(n.pitchMul)}`;
    out += '\n';
  }
  tipp.free(l); tipp.free(r);
  x.tipp_engine_free(e);
  return out;
}

const tmp = mkdtempSync(join(tmpdir(), 'tipp-seed-'));
let failed = 0, checked = 0;
for (const id of ids) {
  let voice: string, songs: string;
  try {
    voice = readFileSync(join(root, `data/birds/${id}/voice.json`), 'utf8');
    songs = readFileSync(join(root, `data/birds/${id}/songs.json`), 'utf8');
  } catch { continue; } // no sound data yet
  const bird = tipp.parseBird(id, voice, songs);
  for (const [type, name] of [[0, 'song'], [1, 'call']] as const) {
    if (!x.tipp_bird_type_present(bird, type)) continue;
    for (const seed of seeds) {
      const logPath = join(tmp, `${id}-${name}-${seed}.txt`);
      execFileSync(join(root, 'build/Release/tipp-render'), ['--bird', id, '--type', name, '--seed', String(seed),
        '--seconds', String(seconds), '--phrase-log', logPath, '--out', join(tmp, 'x.wav')], { cwd: root });
      const native = readFileSync(logPath, 'utf8');
      const wasm = wasmLog(bird, type, seed);
      const nLines = native.trim().split('\n'), wLines = wasm.trim().split('\n');
      checked++;
      if (native === wasm) {
        console.log(`ok   ${id} ${name} seed ${seed}: ${nLines.length} phrases identical`);
      } else {
        failed++;
        const at = nLines.findIndex((s, i) => s !== wLines[i]);
        console.log(`FAIL ${id} ${name} seed ${seed}: first difference at phrase ${at + 1}`);
        console.log(`     native ${nLines[at]?.slice(0, 120)}`);
        console.log(`     wasm   ${wLines[at]?.slice(0, 120)}`);
      }
    }
  }
}
console.log(failed === 0 ? `seed check passed (${checked} runs, ${seconds} s each)` : `seed check FAILED (${failed} of ${checked})`);
process.exit(failed === 0 ? 0 : 1);
