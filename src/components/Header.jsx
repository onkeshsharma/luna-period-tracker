import React from 'react';
import { CalendarHeart, Bell, BellOff, Settings, Download, Upload, BarChart2, Cpu, Cat, Moon, Flower2 } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function Header({
  notificationsEnabled, onToggleNotifications,
  onCycleTheme, theme,
  onExportData, onImportData,
  showChart, onToggleChart,
  showPhase, onTogglePhase,
  showPet, onTogglePet,
}) {
  const themeIcon = theme === 'sakura'
    ? <Flower2 className="h-5 w-5" style={{ color: '#db2777' }} />
    : <Moon className="h-5 w-5" style={{ color: '#c084fc' }} />;

  const themeLabel = theme === 'sakura' ? 'Sakura' : 'Cosmic';

  function ToggleRow({ icon, label, value, onToggle }) {
    return (
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-left hover:bg-white/10"
        style={{ color: 'var(--luna-text-1)' }}
      >
        <span className="flex items-center gap-3">
          {icon}
          {label}
        </span>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors"
          style={{
            background: value ? 'rgba(244,63,94,0.18)' : 'rgba(255,255,255,0.1)',
            color: value ? 'var(--luna-accent)' : 'var(--luna-text-3)',
          }}
        >
          {value ? 'ON' : 'OFF'}
        </span>
      </button>
    );
  }

  return (
    <header
      className="flex items-center justify-between px-4 py-4 z-10 relative"
      style={{ borderBottom: '1px solid var(--luna-glass-border)' }}
    >
      <div className="flex items-center gap-2.5">
        <CalendarHeart className="h-6 w-6" style={{ color: 'var(--luna-accent)' }} />
        <h1 className="text-xl font-bold tracking-tight shimmer-text">Luna</h1>
      </div>

      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onCycleTheme}
          title={`Theme: ${themeLabel} — tap to switch`}
          className="hover:bg-white/10 transition-colors"
        >
          {themeIcon}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleNotifications}
          title={notificationsEnabled ? 'Disable reminders' : 'Enable reminders'}
          className="hover:bg-white/10 transition-colors"
          style={{ color: 'var(--luna-text-3)' }}
        >
          {notificationsEnabled
            ? <Bell className="h-5 w-5" />
            : <BellOff className="h-5 w-5" />}
        </Button>

        {/* Settings popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              title="Settings"
              className="hover:bg-white/10 transition-colors"
              style={{ color: 'var(--luna-text-3)' }}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-60 p-2 rounded-2xl shadow-2xl border"
            align="end"
            style={{
              background: 'var(--luna-glass-bg)',
              backdropFilter: 'blur(20px)',
              borderColor: 'var(--luna-glass-border)',
            }}
          >
            {/* Display toggles */}
            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--luna-text-3)' }}>
              Display
            </p>
            <ToggleRow
              icon={<BarChart2 className="h-4 w-4" style={{ color: 'var(--luna-accent-soft)' }} />}
              label="Cycle Trends"
              value={showChart}
              onToggle={onToggleChart}
            />
            <ToggleRow
              icon={<Cpu className="h-4 w-4" style={{ color: 'var(--luna-accent-soft)' }} />}
              label="Phase Wheel"
              value={showPhase}
              onToggle={onTogglePhase}
            />
            <ToggleRow
              icon={<Cat className="h-4 w-4" style={{ color: 'var(--luna-accent-soft)' }} />}
              label="Pet Companion"
              value={showPet}
              onToggle={onTogglePet}
            />

            <div className="h-px my-1" style={{ background: 'var(--luna-glass-border)' }} />

            {/* Data management */}
            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--luna-text-3)' }}>
              Data
            </p>

            <button
              onClick={onExportData}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-left hover:bg-white/10"
              style={{ color: 'var(--luna-text-1)' }}
            >
              <Download className="h-4 w-4 text-emerald-400" />
              Backup to JSON
            </button>

            <label
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer hover:bg-white/10"
              style={{ color: 'var(--luna-text-1)' }}
            >
              <Upload className="h-4 w-4 text-blue-400" />
              Restore from JSON
              <input type="file" accept=".json" className="hidden" onChange={onImportData} />
            </label>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
