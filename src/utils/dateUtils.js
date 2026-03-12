export function getTodayISO() {
  return new Date().toISOString().split('T')[0];
}

export function isValidDate(dateString) {
  if (!dateString || typeof dateString !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
  const date = new Date(dateString + 'T00:00:00');
  if (isNaN(date.getTime())) return false;
  // Guard against overflow (e.g. Feb 30 rolls over to March)
  const y = date.getFullYear(), m = String(date.getMonth() + 1).padStart(2, '0'), d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}` === dateString;
}

export function isValidCycle(cycle) {
  if (!cycle || typeof cycle !== 'object') return false;
  if (!isValidDate(cycle.date)) return false;
  if (cycle.duration !== undefined && (typeof cycle.duration !== 'number' || cycle.duration <= 0)) return false;
  if (cycle.notes !== undefined && typeof cycle.notes !== 'string') return false;
  return true;
}

export function formatDate(dateString) {
  if (!isValidDate(dateString)) return 'Invalid date';
  return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function getDaysBetween(date1, date2) {
  const MS = 1000 * 60 * 60 * 24;
  return Math.round(
    (new Date(date2 + 'T00:00:00') - new Date(date1 + 'T00:00:00')) / MS
  );
}

export function getDaysUntil(dateString) {
  const MS = 1000 * 60 * 60 * 24;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((new Date(dateString + 'T00:00:00') - today) / MS);
}
