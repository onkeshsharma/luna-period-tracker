import React from 'react';
import { getTodayISO, formatDate } from '../utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function NotificationPanel({ notifDaysBefore, onChangeDaysBefore, nextExpectedDate }) {
  const options = [
    { value: '0', label: 'Day of' },
    { value: '1', label: '1 day before' },
    { value: '3', label: '3 days before' },
    { value: '5', label: '5 days before' },
    { value: '7', label: '1 week before' },
  ];

  let reminderText;
  if (!nextExpectedDate) {
    reminderText = 'No data yet';
  } else {
    const d = new Date(nextExpectedDate + 'T00:00:00');
    d.setDate(d.getDate() - parseInt(notifDaysBefore));
    const reminderISO = d.toISOString().split('T')[0];
    const today = getTodayISO();
    reminderText = reminderISO < today
      ? 'Passed — will show at next cycle'
      : formatDate(reminderISO);
  }

  return (
    <section className="mx-4 mt-4 p-5 glass rounded-2xl anim-fade-in-up shadow-lg">
      <p
        className="text-xs uppercase tracking-widest font-semibold mb-3"
        style={{ color: 'var(--luna-text-3)' }}
      >
        Reminders
      </p>

      <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
        <label
          className="text-sm font-medium"
          style={{ color: 'var(--luna-text-1)' }}
        >
          Remind me starting
        </label>
        <Select
          value={String(notifDaysBefore)}
          onValueChange={(val) => onChangeDaysBefore(Number(val))}
        >
          <SelectTrigger
            className="w-[140px] border"
            style={{
              background: 'var(--luna-glass-bg)',
              borderColor: 'var(--luna-glass-border)',
              color: 'var(--luna-text-1)',
            }}
          >
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent
            style={{
              background: 'var(--luna-glass-bg)',
              backdropFilter: 'blur(20px)',
              borderColor: 'var(--luna-glass-border)',
              color: 'var(--luna-text-1)',
            }}
          >
            {options.map(o => (
              <SelectItem
                key={o.value}
                value={o.value}
                className="cursor-pointer"
                style={{ color: 'var(--luna-text-1)' }}
              >
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg"
        style={{
          background: 'var(--luna-glass-bg)',
          border: '1px solid var(--luna-glass-border)',
        }}
      >
        <span className="text-xs font-medium" style={{ color: 'var(--luna-text-3)' }}>
          Next reminder:
        </span>
        <span className="text-xs" style={{ color: 'var(--luna-text-1)' }}>
          {reminderText}
        </span>
      </div>
    </section>
  );
}
