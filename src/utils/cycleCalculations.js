import { getDaysBetween, getDaysUntil, isValidDate } from './dateUtils';

export const DEFAULT_CYCLE_DURATION = 5;
export const DEFAULT_CYCLE_LENGTH   = 28;

export function calculateAverageDuration(cycles) {
  const withDur = cycles.filter(c => c.duration && c.duration > 0);
  if (!withDur.length) return DEFAULT_CYCLE_DURATION;
  return Math.round(withDur.reduce((s, c) => s + c.duration, 0) / withDur.length);
}

export function getCycleIntervals(cycles) {
  if (!cycles || cycles.length < 2) return [];
  const sorted = [...cycles].sort((a, b) => a.date.localeCompare(b.date));
  const intervals = [];
  for (let i = 1; i < sorted.length; i++) {
    const gap = getDaysBetween(sorted[i - 1].date, sorted[i].date);
    if (gap > 0) intervals.push(gap);
  }
  return intervals;
}

export function calculateAverageCycleLength(cycles) {
  const intervals = getCycleIntervals(cycles);
  if (!intervals.length) return DEFAULT_CYCLE_LENGTH;
  const recent = intervals.slice(-3);
  return Math.round(recent.reduce((s, d) => s + d, 0) / recent.length);
}

export function getShortestCycle(cycles) {
  const intervals = getCycleIntervals(cycles);
  if (!intervals.length) return null;
  return Math.min(...intervals);
}

export function getLongestCycle(cycles) {
  const intervals = getCycleIntervals(cycles);
  if (!intervals.length) return null;
  return Math.max(...intervals);
}

export function getNextExpectedDate(cycles) {
  if (!cycles || !cycles.length) return null;
  const sorted = [...cycles].sort((a, b) => a.date.localeCompare(b.date));
  const mostRecent = sorted[sorted.length - 1];
  if (!isValidDate(mostRecent.date)) return null;
  const d = new Date(mostRecent.date + 'T00:00:00');
  d.setDate(d.getDate() + calculateAverageCycleLength(cycles));
  return d.toISOString().split('T')[0];
}

export function getStatusInfo(nextExpectedDate) {
  if (!nextExpectedDate) return { label: 'No data yet', colorClass: 'bg-slate-700 text-slate-300' };
  const daysUntil = getDaysUntil(nextExpectedDate);
  if (daysUntil > 0)  return { label: `In ${daysUntil} day${daysUntil === 1 ? '' : 's'}`, colorClass: 'bg-slate-600 text-slate-200' };
  if (daysUntil === 0) return { label: 'Expected today', colorClass: 'bg-amber-600 text-amber-100' };
  const late = Math.abs(daysUntil);
  if (late < 4) return { label: `${late} day${late === 1 ? '' : 's'} late`, colorClass: 'bg-amber-500 text-amber-100' };
  return { label: 'Might want to check', colorClass: 'bg-red-600 text-red-100' };
}

export function getCalendarDaySets(cycles) {
  const periodDays    = new Set();
  const predictedDays = new Set();

  const avgDur = calculateAverageDuration(cycles);
  for (const c of cycles) {
    const dur = c.duration || avgDur;
    for (let i = 0; i < dur; i++) {
      const d = new Date(c.date + 'T00:00:00');
      d.setDate(d.getDate() + i);
      periodDays.add(d.toISOString().split('T')[0]);
    }
  }

  const nextDate = getNextExpectedDate(cycles);
  if (nextDate) {
    for (let i = 0; i < avgDur; i++) {
      const d = new Date(nextDate + 'T00:00:00');
      d.setDate(d.getDate() + i);
      predictedDays.add(d.toISOString().split('T')[0]);
    }
  }

  return { periodDays, predictedDays };
}
