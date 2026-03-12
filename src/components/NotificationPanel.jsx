import React from 'react';
import { getTodayISO, formatDate } from '../utils';

export function NotificationPanel({ notifDaysBefore, onChangeDaysBefore, nextExpectedDate }) {
  const options = [
    { value: 0, label: 'Day of' },
    { value: 1, label: '1 day before' },
    { value: 3, label: '3 days before' },
    { value: 5, label: '5 days before' },
    { value: 7, label: '1 week before' },
  ];

  let reminderText;
  if (!nextExpectedDate) {
    reminderText = 'No data yet';
  } else {
    const d = new Date(nextExpectedDate + 'T00:00:00');
    d.setDate(d.getDate() - notifDaysBefore);
    const reminderISO = d.toISOString().split('T')[0];
    const today = getTodayISO();
    if (reminderISO < today) {
      reminderText = 'Passed — will show at next cycle';
    } else {
      reminderText = formatDate(reminderISO);
    }
  }

  return (
    <section className="mx-4 mt-4 p-4 glass rounded-xl anim-fade-in-up">
      <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">Reminders</p>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
        <label className="text-sm text-slate-300" htmlFor="notif-days-select">Remind me starting</label>
        <select
          id="notif-days-select"
          value={notifDaysBefore}
          onChange={e => onChangeDaysBefore(Number(e.target.value))}
          className="bg-slate-700 border border-slate-600 rounded-lg px-2 py-1 text-slate-100 text-sm focus:outline-none focus:border-slate-400"
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <p className="text-xs text-slate-400">
        <span className="text-slate-500">Next reminder: </span>{reminderText}
      </p>
    </section>
  );
}
