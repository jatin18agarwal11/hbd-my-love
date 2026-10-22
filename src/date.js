export function dateKey(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
export function todayInZone(zone, now = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: zone || 'UTC', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now).map(x => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}`;
}
export function calendarDays(year, month) {
  const start = (new Date(year, month, 1).getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  return [...Array(Math.ceil((start + count) / 7) * 7)].map((_, i) => i >= start && i < start + count ? dateKey(new Date(year, month, i - start + 1)) : null);
}
export function prettyDate(value) { return value ? new Intl.DateTimeFormat('en', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value + 'T12:00:00')) : 'Choose your day'; }
// Resolve wall-clock time to instants. Zero matches = DST gap; two = ambiguous fall-back hour.
export function resolveInstants(date, time, zone) {
  if (!date || !time || !zone) return [];
  const target = Date.parse(`${date}T${time}:00Z`);
  if (!Number.isFinite(target)) return [];
  const formatter = new Intl.DateTimeFormat('en-GB', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const parts = ms => Object.fromEntries(formatter.formatToParts(new Date(ms)).map(p => [p.type, p.value]));
  const offsets = new Set([-36, -12, 0, 12, 36].map(h => { const ms = target + h * 3600000; const p = parts(ms); return Date.parse(`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:00Z`) - ms; }));
  return [...offsets].map(o => target - o).filter(ms => { const p = parts(ms); return `${p.year}-${p.month}-${p.day}` === date && `${p.hour}:${p.minute}` === time; }).sort();
}
export function validateInvitation({ date, time, zone, activities }, now = Date.now()) {
  if (!date || !time || !zone) return 'Choose a date, a time, and confirm IST.';
  let matches;
  try { matches = resolveInstants(date, time, zone); } catch { return 'Please choose a valid timezone.'; }
  if (!matches.length) return 'That time does not exist because the clocks change. Please choose another time.';
  if (matches.length > 1) return 'The clocks repeat that hour in IST. Please choose a time outside the repeated hour.';
  if (matches[0] <= now) return 'Choose a date and time that are still in the future in IST.';
  return '';
}
