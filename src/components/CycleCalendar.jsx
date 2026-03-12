import React, { useState } from 'react';
import { getTodayISO, getCalendarDaySets } from '../utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function CycleCalendar({ cycles, onDateClick }) {
  const today = getTodayISO();
  const todayY = parseInt(today.slice(0, 4), 10);
  const todayM = parseInt(today.slice(5, 7), 10) - 1;
  const [viewYear,  setViewYear]  = useState(todayY);
  const [viewMonth, setViewMonth] = useState(todayM);

  const { periodDays, predictedDays } = getCalendarDaySets(cycles);

  const MONTH_NAMES = ['January','February','March','April','May','June',
                       'July','August','September','October','November','December'];
  const DAY_LABELS  = ['Mo','Tu','We','Th','Fr','Sa','Su'];

  function prevMonth() {
    const minY = todayY - 2, minM = todayM;
    let y = viewYear, m = viewMonth - 1;
    if (m < 0) { m = 11; y--; }
    if (y < minY || (y === minY && m < minM)) return;
    setViewYear(y); setViewMonth(m);
  }

  function nextMonth() {
    const maxY = todayY, maxM = (todayM + 12) % 12;
    const maxYAdj = todayM + 12 >= 12 ? todayY + 1 : todayY;
    let y = viewYear, m = viewMonth + 1;
    if (m > 11) { m = 0; y++; }
    if (y > maxYAdj || (y === maxYAdj && m > maxM)) return;
    setViewYear(y); setViewMonth(m);
  }

  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const leadingNulls = (firstDow + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [
    ...Array(leadingNulls).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function isoFor(day) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  }

  function getCellStyle(day) {
    if (!day) return {};
    const iso = isoFor(day);
    if (periodDays.has(iso)) return null; // handled by className
    if (predictedDays.has(iso)) return {
      background: 'var(--luna-glass-bg)',
      borderColor: 'var(--luna-text-3)',
      color: 'var(--luna-text-2)',
    };
    if (iso === today) return {
      background: 'var(--luna-accent)',
      color: '#fff',
    };
    return { color: 'var(--luna-text-2)' };
  }

  function cellClasses(day) {
    if (!day) return '';
    const iso = isoFor(day);
    const base = 'w-9 h-9 flex items-center justify-center text-sm font-medium mx-auto transition-transform hover:scale-110 cursor-pointer rounded-full';
    if (periodDays.has(iso)) return base + ' bg-rose-500 shadow-md shadow-rose-500/30 text-white';
    if (predictedDays.has(iso)) return base + ' border border-dashed';
    if (iso === today) return base + ' anim-pulse-dot';
    return base;
  }

  return (
    <section
      className="mx-4 mt-4 p-5 glass rounded-2xl anim-fade-in-up shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p
          className="text-xs uppercase tracking-widest font-semibold"
          style={{ color: 'var(--luna-text-3)' }}
        >
          Calendar
        </p>
        <div
          className="flex rounded-lg p-1 border"
          style={{
            background: 'var(--luna-glass-bg)',
            borderColor: 'var(--luna-glass-border)',
          }}
        >
          <button
            onClick={prevMonth}
            className="p-1 rounded-md transition-colors hover:opacity-80"
            style={{ color: 'var(--luna-text-2)' }}
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span
            className="w-36 text-center text-sm font-semibold"
            style={{ color: 'var(--luna-text-1)' }}
          >
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 rounded-md transition-colors hover:opacity-80"
            style={{ color: 'var(--luna-text-2)' }}
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-y-2 mb-2">
        {DAY_LABELS.map(d => (
          <div
            key={d}
            className="text-center text-xs font-medium pb-1 tracking-wide"
            style={{ color: 'var(--luna-text-3)' }}
          >
            {d}
          </div>
        ))}
        {cells.map((day, i) => (
          <button
            key={i}
            className={cellClasses(day)}
            style={getCellStyle(day) || undefined}
            onClick={() => day && onDateClick(isoFor(day))}
            disabled={!day}
          >
            {day || ''}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div
        className="flex gap-5 mt-4 pt-4 justify-center"
        style={{ borderTop: '1px solid var(--luna-glass-border)' }}
      >
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
          <span className="text-xs font-medium tracking-wide" style={{ color: 'var(--luna-text-2)' }}>Period</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full border border-dashed"
            style={{ borderColor: 'var(--luna-text-3)', background: 'var(--luna-glass-bg)' }}
          />
          <span className="text-xs font-medium tracking-wide" style={{ color: 'var(--luna-text-2)' }}>Predicted</span>
        </div>
      </div>
    </section>
  );
}
