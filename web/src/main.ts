import './ui/theme.css';
import { AudioHost } from './audio/host.ts';
import { App } from './ui/app.ts';
import { PhoneApp } from './ui/phone.ts';

// The app was called Tipp until 2026-11-27: move its saved language and log.
try {
  for (const k of ['lang', 'log']) {
    const old = localStorage.getItem(`tipp.${k}`);
    if (old !== null && localStorage.getItem(`pipp.${k}`) === null) localStorage.setItem(`pipp.${k}`, old);
    localStorage.removeItem(`tipp.${k}`);
  }
} catch { /* storage blocked: nothing to move */ }

const root = document.getElementById('app')!;

// Narrow windows get the phone layout. Crossing the line reloads, so each
// layout starts clean. ?layout=phone or ?layout=desktop forces one.
const forced = new URLSearchParams(location.search).get('layout');
const narrow = window.matchMedia('(max-width: 699px)');
const phone = forced ? forced === 'phone' : narrow.matches;
if (!forced) narrow.addEventListener('change', () => location.reload());

AudioHost.create()
  .then((host) => {
    const app = phone ? new PhoneApp(root, host) : new App(root, host);
    (window as unknown as { pipp: unknown }).pipp = { app, host }; // for checks from the console
  })
  .catch((err) => {
    const e = document.createElement('div');
    e.className = 'error';
    e.textContent = `Pipp could not start: ${String(err)}`;
    root.appendChild(e);
  });
