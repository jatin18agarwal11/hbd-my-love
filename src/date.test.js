import test from 'node:test';
import assert from 'node:assert/strict';
import { calendarDays, todayInZone, resolveInstants, validateInvitation, prettyDate } from './date.js';

test('October 2026 starts on Thursday in a Monday-first calendar; birthday is Friday', () => {
  const days = calendarDays(2026, 9);
  assert.deepEqual(days.slice(0, 4), [null, null, null, '2026-10-01']);
  assert.equal(days.indexOf('2026-10-23') % 7, 4);
  assert.match(prettyDate('2026-10-23'), /Friday/);
  assert.equal(days.filter(Boolean).length, 31);
});
test('calendar handles leap years, year boundaries, and full-week padding', () => {
  assert.equal(calendarDays(2028, 1).filter(Boolean).length, 29);
  assert.equal(calendarDays(2026, 1).filter(Boolean).length, 28);
  assert.equal(calendarDays(2026, 12).filter(Boolean)[0], '2027-01-01');
  for (let m = 0; m < 12; m++) assert.equal(calendarDays(2026, m).length % 7, 0);
});
test('today follows the selected timezone across midnight', () => {
  const now = new Date('2026-10-23T00:30:00Z');
  assert.equal(todayInZone('America/Los_Angeles', now), '2026-10-22');
  assert.equal(todayInZone('Asia/Kolkata', now), '2026-10-23');
});
test('wall time resolves fractional offsets and daylight saving correctly', () => {
  assert.deepEqual(resolveInstants('2026-10-23', '20:00', 'Asia/Kolkata'), [Date.parse('2026-10-23T14:30:00Z')]);
  assert.deepEqual(resolveInstants('2026-10-23', '20:00', 'Asia/Kathmandu'), [Date.parse('2026-10-23T14:15:00Z')]);
  assert.deepEqual(resolveInstants('2026-10-23', '20:00', 'America/New_York'), [Date.parse('2026-10-24T00:00:00Z')]);
  assert.deepEqual(resolveInstants('2026-12-23', '20:00', 'America/New_York'), [Date.parse('2026-12-24T01:00:00Z')]);
});
test('DST skipped and repeated hours cannot silently schedule the wrong instant', () => {
  assert.equal(resolveInstants('2027-03-14', '02:30', 'America/New_York').length, 0);
  assert.equal(resolveInstants('2026-11-01', '01:30', 'America/New_York').length, 2);
  assert.match(validateInvitation({ date:'2026-11-01', time:'01:30', zone:'America/New_York', activities:['Anime night'] }, 0), /repeat/);
});
test('invitation requires all selections and a future instant', () => {
  const now = Date.parse('2026-10-21T17:00:00Z');
  const valid = { date:'2026-10-23', time:'20:00', zone:'Asia/Kolkata', activities:['Anime night'] };
  assert.equal(validateInvitation(valid, now), '');
  for (const field of ['date', 'time', 'zone']) assert.ok(validateInvitation({ ...valid, [field]: '' }, now));
  assert.ok(validateInvitation({ ...valid, activities: [] }, now));
  assert.match(validateInvitation({ ...valid, zone: 'invalid' }, now), /valid timezone/);
  assert.match(validateInvitation({ ...valid, date: '2026-10-20' }, now), /future/);
  assert.match(validateInvitation({ ...valid, date:'2026-10-21', time:'20:00' }, now), /future/);
  assert.equal(validateInvitation({ ...valid, date:'2026-10-21', time:'23:30' }, now), '');
});
