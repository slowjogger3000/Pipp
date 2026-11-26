// Recordings and pictures, kept on the device in IndexedDB (in the browser
// and in the phone app's web view alike). Nothing leaves the device.

export interface Recording {
  id: string;
  bird: string;        // index.json id, or '' for a bird outside Tipp
  latin: string;       // for a bird outside Tipp
  type: number;        // 0 song, 1 call, 2 alarm, 3 flight
  seconds: number;
  date: string;        // YYYY-MM-DD HH:MM
  confidence: number;  // 0 to 1
  mime: string;
  audio: Blob;
  thumb: string;       // 120x40 sonogram as a PNG data URL
}

export interface Picture {
  id: string;
  bird: string;
  date: string;
  image: Blob;
}

const kDb = 'tipp';
let dbp: Promise<IDBDatabase> | null = null;

function db(): Promise<IDBDatabase> {
  dbp ??= new Promise((resolve, reject) => {
    const r = indexedDB.open(kDb, 1);
    r.onupgradeneeded = () => {
      r.result.createObjectStore('recordings', { keyPath: 'id' });
      r.result.createObjectStore('pictures', { keyPath: 'id' });
    };
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
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

export const deleteRecording = (id: string) => run<undefined>('recordings', 'readwrite', (s) => s.delete(id));
export const deletePicture = (id: string) => run<undefined>('pictures', 'readwrite', (s) => s.delete(id));
