import React from 'react';
import { getNextExpectedDate, getStatusInfo, formatDate } from '../utils';
import { CalendarClock } from 'lucide-react';

export function NextExpected({ cycles }) {
  const nextDate = getNextExpectedDate(cycles);
  const { label, colorClass } = getStatusInfo(nextDate);

  return (
    <section className="mx-4 mt-4 p-5 glass rounded-2xl anim-fade-in-up relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <CalendarClock
          className="w-16 h-16 transform rotate-12"
          style={{ color: 'var(--luna-text-3)' }}
        />
      </div>

      <p
        className="text-xs uppercase tracking-widest font-semibold mb-3 relative z-10"
        style={{ color: 'var(--luna-text-3)' }}
      >
        Next Expected
      </p>

      {nextDate ? (
        <div className="flex flex-col gap-3 relative z-10">
          <p className="text-3xl font-bold tracking-tight shimmer-text">{formatDate(nextDate)}</p>
          <div className="self-start">
            <span className={`text-sm font-semibold px-3 py-1.5 rounded-full whitespace-nowrap shadow-sm border border-transparent backdrop-blur-md ${colorClass} bg-opacity-20`}>
              {label}
            </span>
          </div>
        </div>
      ) : (
        <p
          className="text-sm relative z-10 p-3 rounded-lg"
          style={{
            color: 'var(--luna-text-2)',
            background: 'var(--luna-glass-bg)',
            border: '1px solid var(--luna-glass-border)',
          }}
        >
          Add your first entry to see a prediction.
        </p>
      )}
    </section>
  );
}
