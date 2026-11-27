// Recordings and pictures, kept on the device in IndexedDB (in the browser
// and in the phone app's web view alike). Nothing leaves the device.

export interface Recording {
  id: string;
  bird: string;        // index.json id, or '' for a bird outside Pipp
  latin: string;       // for a bird outside Pipp
  type: number;        // 0 song, 1 call, 2 alarm, 3 flight
  seconds: number;
  date: string;        // YYYY-MM-DD HH:MM
  confidence: number;  // 0 to 1
  mime: string;
  audio: Blob;
  thumb: string;       // 120x40 sonogram as a PNG data URL, or '' when there is none
  from?: 'phone' | 'file'; // where the desktop got it; missing means recorded here
}

export interface Picture {
  id: string;
  bird: string;
  date: string;
  image: Blob;
  from?: 'phone' | 'file';
}

const kDb = 'pipp';
const kOldDb = 'tipp'; // the app was called Tipp until 2026-11-27
let dbp: Promise<IDBDatabase> | null = null;

const done = (r: IDBRequest) => new Promise<unknown>((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });

function open(name: string, create: boolean): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open(name, 1);
    r.onupgradeneeded = () => {
      if (!create) return;
      r.result.createObjectStore('recordings', { keyPath: 'id' });
      r.result.createObjectStore('pictures', { keyPath: 'id' });
    };
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

// Copies the old store into the new one once, then deletes the old one.
// Only when the browser can list its databases, so nothing is created by
// asking for a store that is not there.
async function migrate(to: IDBDatabase): Promise<void> {
  const list = await indexedDB.databases?.().catch(() => []);
  if (!list?.some((d) => d.name === kOldDb)) return;
  const from = await open(kOldDb, false);
  const names = ['recordings', 'pictures'].filter((n) => from.objectStoreNames.contains(n));
  for (const n of names) {
    const items = (await done(from.transaction(n, 'readonly').objectStore(n).getAll())) as unknown[];
    const tx = to.transaction(n, 'readwrite');
    for (const it of items) tx.objectStore(n).put(it);
    await new Promise<void>((res, rej) => { tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); });
  }
  from.close();
  indexedDB.deleteDatabase(kOldDb);
}

function db(): Promise<IDBDatabase> {
  dbp ??= open(kDb, true).then(async (d) => {
    await migrate(d).catch((e) => console.warn('Could not move the old Tipp store:', e));
    return d;
  });
  // Ask the browser not to clear the store under storage pressure.
  void navigator.storage?.persist?.();
  return dbp;
}

async function run<T>(store: string, mode: IDBTransactionMode, f: (s: IDBObjectStore) => IDBRequest): Promise<T> {
  const d = await db();
  return new Promise((resolve, reject) => {
    const req = f(d.transaction(store, mode).objectStore(store));
    req.onsuccess = () => resolve(req.result as T);
    req.onerror = () => reject(req.error);
  });
}

export const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const saveRecording = (r: Recording) => run<IDBValidKey>('recordings', 'readwrite', (s) => s.put(r));
export const savePicture = (p: Picture) => run<IDBValidKey>('pictures', 'readwrite', (s) => s.put(p));

const byDate = <T extends { date: string }>(a: T, b: T) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0);
export const recordings = async () => (await run<Recording[]>('recordings', 'readonly', (s) => s.getAll())).sort(byDate);
export const pictures = async () => (await run<Picture[]>('pictures', 'readonly', (s) => s.getAll())).sort(byDate);

export function now(): string {
  const d = new Date(), p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

// The ids already stored, so an import can skip what it has (prd.md).
export const recordingIds = async () => new Set(await run<IDBValidKey[]>('recordings', 'readonly', (s) => s.getAllKeys()));
export const pictureIds = async () => new Set(await run<IDBValidKey[]>('pictures', 'readonly', (s) => s.getAllKeys()));

export const deleteRecording = (id: string) => run<undefined>('recordings', 'readwrite', (s) => s.delete(id));
export const deletePicture = (id: string) => run<undefined>('pictures', 'readwrite', (s) => s.delete(id));
