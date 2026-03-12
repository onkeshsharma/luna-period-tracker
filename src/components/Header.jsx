import React from 'react';
import { Icon, ICONS } from './Icons';

export function Header({ notificationsEnabled, onToggleNotifications, onCycleTheme, theme }) {
  const themeLabels = { dark: '🌑', blossom: '🌸', 'night-sky': '🌌' };
  return (
    <header className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
      <div className="flex items-center gap-2">
        <Icon d={ICONS.calendar} cls="text-slate-400" />
        <h1 className="text-lg font-semibold tracking-tight shimmer-text">Luna</h1>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onCycleTheme}
          aria-label="Change theme"
          title="Change theme"
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors text-base leading-none"
        >
          {themeLabels[theme] || '🌑'}
        </button>
        <button
          onClick={onToggleNotifications}
          aria-label={notificationsEnabled ? 'Disable reminders' : 'Enable reminders'}
          title={notificationsEnabled ? 'Disable reminders' : 'Enable reminders'}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
        >
          <Icon d={notificationsEnabled ? ICONS.bell : ICONS.bellOff} />
        </button>
      </div>
    </header>
  );
}
