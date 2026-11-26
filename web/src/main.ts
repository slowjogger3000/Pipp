import './ui/theme.css';
import { AudioHost } from './audio/host.ts';
import { App } from './ui/app.ts';

const root = document.getElementById('app')!;

AudioHost.create()
  .then((host) => {
    const app = new App(root, host);
    (window as unknown as { tipp: unknown }).tipp = { app, host }; // for checks from the console
  })
  .catch((err) => {
    const e = document.createElement('div');
    e.className = 'error';
    e.textContent = `Tipp could not start: ${String(err)}`;
    root.appendChild(e);
  });
