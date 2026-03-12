import React, { useState } from 'react';
import { getTodayISO, getCalendarDaySets } from '../utils';

export function CycleCalendar({ cycles }) {
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
  // Adjust so Monday is 0
  const leadingNulls = (firstDow + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [
    ...Array(leadingNulls).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function isoFor(day) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  }

  function cellClasses(day) {
    if (!day) return '';
    const iso = isoFor(day);
    const base = 'w-8 h-8 flex items-center justify-center text-xs mx-auto';
    if (periodDays.has(iso))    return base + ' bg-rose-500 text-white rounded-full';
    if (predictedDays.has(iso)) return base + ' border border-rose-400 text-rose-300 rounded-full';
    if (iso === today)          return base + ' bg-slate-600 text-white rounded-full anim-pulse-dot';
    return base + ' text-slate-400';
  }

  return (
    <section className="mx-4 mt-4 p-4 glass rounded-xl anim-fade-in-up">
      <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">Calendar</p>
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
          aria-label="Previous month"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="text-sm font-medium text-slate-100">{MONTH_NAMES[viewMonth]} {viewYear}</span>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
          aria-label="Next month"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-1 mb-1">
        {DAY_LABELS.map(d => (
          <div key={d} className="text-center text-xs text-slate-500 font-medium pb-1">{d}</div>
        ))}
        {cells.map((day, i) => (
          <div key={i} className={cellClasses(day)}>
            {day || ''}
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-3 pt-3 border-t border-slate-700">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
          <span className="text-xs text-slate-400">Period</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full border border-rose-400 inline-block"></span>
          <span className="text-xs text-slate-400">Predicted</span>
        </div>
      </div>
    </section>
  );
}
