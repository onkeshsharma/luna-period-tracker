import { isValidCycle } from './dateUtils';

export const KEY_CYCLES     = 'cycle-data';
export const KEY_NOTIF      = 'notifications-enabled';
export const KEY_LAST_NOTIF = 'last-notified-date';
export const KEY_NOTIF_DAYS = 'notif-days-before';

export function saveCycles(cycles) {
  try { localStorage.setItem(KEY_CYCLES, JSON.stringify(cycles)); } catch (e) {}
}
export function loadCycles() {
  try {
    const raw = localStorage.getItem(KEY_CYCLES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isValidCycle) : [];
  } catch (e) { return []; }
}
export function saveNotificationPreference(v) {
  try { localStorage.setItem(KEY_NOTIF, String(v)); } catch (e) {}
}
export function loadNotificationPreference() {
  try { return localStorage.getItem(KEY_NOTIF) === 'true'; } catch (e) { return false; }
}
export function saveLastNotifiedDate(d) {
  try { localStorage.setItem(KEY_LAST_NOTIF, d); } catch (e) {}
}
export function loadLastNotifiedDate() {
  try { return localStorage.getItem(KEY_LAST_NOTIF) || null; } catch (e) { return null; }
}
export function saveNotifDaysBefore(n) { try { localStorage.setItem(KEY_NOTIF_DAYS, String(n)); } catch(e) {} }
export function loadNotifDaysBefore() { try { return Number(localStorage.getItem(KEY_NOTIF_DAYS) ?? 1); } catch(e) { return 1; } }
