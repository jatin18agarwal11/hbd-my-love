// One ordered route list shared by the menu, page counter, and next/back controls.
export const chapters = [
  ['distance', 'From me to you'], ['welcome', 'Hey, Bubu'],
  ['birthday', 'Your birthday'], ['character', 'How I see you'],
  ['universe', 'Pictures of you'], ['quest', 'What I want to say'],
  ['proposal', 'One little question'], ['coop', 'Still on your team'],
  ['date', 'A little time with you'],
  ['final', 'One last thing']
];
export function parseChapter(hash) {
  const id = String(hash || '').replace(/^#\/?/, '').replace(/\/$/, '');
  return chapters.some(([value]) => value === id) ? id : null;
}
export function nextChapter(id) {
  const index = chapters.findIndex(([value]) => value === id);
  return index >= 0 ? chapters[index + 1]?.[0] ?? null : null;
}
export function previousChapter(id) {
  const index = chapters.findIndex(([value]) => value === id);
  return index > 0 ? chapters[index - 1][0] : null;
}
export function readPage() { return parseChapter(window.location.hash) || 'distance'; }
export function subscribePage(listener) {
  window.addEventListener('hashchange', listener);
  return () => window.removeEventListener('hashchange', listener);
}
export function go(id) {
  if (!chapters.some(([value]) => value === id)) return;
  if (readPage() === id) window.scrollTo({ top: 0, behavior: 'instant' });
  else window.location.hash = '/' + id;
}
