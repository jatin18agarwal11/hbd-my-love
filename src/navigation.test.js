import test from 'node:test';
import assert from 'node:assert/strict';
import { chapters, nextChapter, previousChapter, parseChapter } from './navigation.js';

test('proposal and date chapters proceed directly to the final message', () => {
  assert.equal(chapters[0][0], 'welcome');
  assert.equal(chapters[1][0], 'distance');
  assert.equal(chapters[6][0], 'proposal');
  assert.equal(nextChapter('proposal'), 'coop');
  assert.equal(nextChapter('coop'), 'date');
  assert.equal(nextChapter('date'), 'final');
  assert.equal(parseChapter('#/calendar'), null);
});
test('welcome is the default opening and distance is the second chapter', () => {
  assert.equal(chapters[0][0], 'welcome');
  assert.equal(nextChapter('welcome'), 'distance');
  assert.equal(nextChapter('distance'), 'birthday');
});
test('every chapter moves forward exactly once; the last page does not wrap', () => {
  const visited = []; let current = chapters[0][0];
  while (current) { assert.ok(!visited.includes(current), 'navigation must not loop'); visited.push(current); current = nextChapter(current); }
  assert.deepEqual(visited, chapters.map(([id]) => id));
  assert.equal(nextChapter('final'), null);
  assert.equal(nextChapter('unknown'), null);
});
test('back navigation follows the same list without wrapping at the beginning', () => {
  assert.equal(previousChapter('welcome'), null);
  for (let i = 1; i < chapters.length; i++) assert.equal(previousChapter(chapters[i][0]), chapters[i - 1][0]);
});
test('direct links and legacy chapter links resolve unambiguously', () => {
  for (const [id] of chapters) {
    assert.equal(parseChapter('#/' + id), id);
    assert.equal(parseChapter('#' + id), id);
    assert.equal(parseChapter('#/' + id + '/'), id);
  }
  assert.equal(parseChapter('#main-content'), null);
  assert.equal(parseChapter('#/7'), null);
});
