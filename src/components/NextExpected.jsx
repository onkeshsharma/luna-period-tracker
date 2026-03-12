import React from 'react';
import { getNextExpectedDate, getStatusInfo, formatDate } from '../utils';

export function NextExpected({ cycles }) {
  const nextDate = getNextExpectedDate(cycles);
  const { label, colorClass } = getStatusInfo(nextDate);
  return (
    <section className="mx-4 mt-4 p-4 glass rounded-xl anim-fade-in-up">
      <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Next Expected</p>
      {nextDate ? (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-lg font-medium text-slate-100">{formatDate(nextDate)}</p>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${colorClass}`}>
            {label}
          </span>
        </div>
      ) : (
        <p className="text-sm text-slate-400">Add your first entry to see a prediction.</p>
      )}
    </section>
  );
}
