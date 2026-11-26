// data/ is shared with the standalone. Vite bundles every JSON file as text
// at build time, so the web and phone apps work offline.

const files = import.meta.glob('../../data/**/*.json', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

function text(path: string): string | undefined {
  return files[`../../data/${path}`];
}

export interface IndexBird {
  id: string;
  number: string;
  group: string;
  name: { en: string; no: string };
  latin: string;
}

export interface Index {
  verified_names: boolean;
  groups: string[];
  birds: IndexBird[];
}

export const index: Index = JSON.parse(text('birds/index.json') ?? '{"groups":[],"birds":[]}');

export function birdFile(id: string, file: 'voice' | 'songs' | 'plate' | 'bird'): string | undefined {
  return text(`birds/${id}/${file}.json`);
}

export function hasSound(id: string): boolean {
  return birdFile(id, 'voice') !== undefined && birdFile(id, 'songs') !== undefined;
}

export function strings(lang: 'en' | 'no'): Record<string, string> {
  return JSON.parse(text(`strings/${lang}.json`) ?? '{}');
}

export function chorusSetup(): unknown {
  const t = text('chorus.json');
  return t ? JSON.parse(t) : null;
}
