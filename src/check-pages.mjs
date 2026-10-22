import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';
import { chapters } from './navigation.js';

// Server-render smoke check; visual browser checks remain separate.
const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
try {
  const { default: App } = await vite.ssrLoadModule('/src/App.jsx');
  for (const [id] of chapters) {
    globalThis.window = Object.assign(new EventTarget(), { location: { hash: '#/' + id } });
    const html = renderToString(React.createElement(App));
    const scenes = [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(m => m[1]);
    assert.deepEqual(scenes, [id], `only ${id} should be visible`);
    assert.ok(!new RegExp('Oh' + 'hh|\\u2122', 'i').test(html), 'removed nickname decorations must not return');
    console.log(`PASS ${id}: one visible scene`);
  }
  delete globalThis.window;
  const images = (await readdir(new URL('../img/', import.meta.url))).filter(f => /\.(jpe?g|png|webp|avif)$/i.test(f));
  assert.equal(images.length, 50);
  const results = await Promise.all(images.map(async name => ({ name, status: (await fetch('http://127.0.0.1:5173/img/' + encodeURIComponent(name))).status })));
  assert.deepEqual(results.filter(r => r.status !== 200), []);
  console.log('PASS all 50 original images are served by the live preview');
} finally { delete globalThis.window; await vite.close(); }
