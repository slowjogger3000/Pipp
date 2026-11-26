// Interface strings from data/strings/<lang>.json. A missing key shows as
// <key> so it is easy to spot.

import { strings as load } from '../data.ts';

export type Lang = 'en' | 'no';

export class Strings {
  lang: Lang = 'en';
  private table: Record<string, string> = load('en');

  set(lang: Lang) {
    this.lang = lang;
    this.table = load(lang);
  }

  get no(): boolean { return this.lang === 'no'; }

  t(key: string, fields?: Record<string, string>): string {
    let s = this.table[key] ?? `<${key}>`;
    if (fields) for (const [k, v] of Object.entries(fields)) s = s.split(`{${k}}`).join(v);
    return s;
  }

  // A {en, no, verified} text from bird.json. Not verified: [TO VERIFY]
  // after it, or alone when the text is empty.
  field(f: { en?: string; no?: string; verified?: boolean } | undefined): string {
    const marker = this.t('to_verify');
    const text = f?.[this.lang] ?? '';
    if (f?.verified) return text;
    if (!text) return marker;
    return text.includes(marker) ? text : `${text} ${marker}`;
  }
}

// JavaScript's case mapping handles æ, ø and å, unlike JUCE's.
export const upper = (s: string) => s.toLocaleUpperCase('nb');
export const lower = (s: string) => s.toLocaleLowerCase('nb');
