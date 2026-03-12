import React, { useState, useEffect } from 'react';
import { getTodayISO } from '../utils';
import { Icon, ICONS } from './Icons';

export function AddDateForm({ onSave, averageDuration }) {
  const [isVisible, setIsVisible]         = useState(false);
  const [selectedDate, setSelectedDate]   = useState('');
  const [errorMessage, setErrorMessage]   = useState('');
  const [selectedDuration, setSelectedDuration] = useState(null);
  const today = getTodayISO();

  useEffect(() => { if (isVisible) setSelectedDuration(null); }, [isVisible]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedDate) { setErrorMessage('Please select a date.'); return; }
    if (selectedDate > today) { setErrorMessage('Date cannot be in the future.'); return; }
    onSave(selectedDate, selectedDuration);
    setSelectedDate(''); setErrorMessage(''); setIsVisible(false);
  }

  function handleCancel() {
    setSelectedDate(''); setErrorMessage(''); setIsVisible(false);
  }

  if (!isVisible) return (
    <div className="mx-4 mt-4">
      <button
        onClick={() => setIsVisible(true)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200 transition-colors"
      >
        <Icon d={ICONS.plus} />
        <span className="text-sm font-medium">Add cycle date</span>
      </button>
    </div>
  );

  return (
    <div className="mx-4 mt-4 p-4 glass rounded-xl">
      <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">New Entry</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="cycle-date" className="block text-xs text-slate-400 mb-1">Start Date</label>
          <input
            id="cycle-date" type="date"
            value={selectedDate} max={today}
            onChange={e => { setSelectedDate(e.target.value); setErrorMessage(''); }}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-slate-400"
          />
        </div>
        <div className="mb-3">
          <label className="block text-xs text-slate-400 mb-2">Duration <span className="text-slate-600">(optional — set later)</span></label>
          <div className="flex flex-wrap gap-1.5">
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <button key={n} type="button" onClick={() => setSelectedDuration(prev => prev === n ? null : n)}
                className={'px-3 py-1.5 rounded-full text-xs font-medium transition-colors ' +
                  (selectedDuration === n ? 'bg-rose-500 text-white' : 'glass text-slate-400 hover:text-slate-200')}
              >{n}</button>
            ))}
          </div>
          <p className="text-xs text-slate-600 mt-1.5">Your average: {averageDuration}d — you can always set this after</p>
        </div>
        {errorMessage && <p className="text-red-400 text-xs mb-3">{errorMessage}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-600 hover:bg-slate-500 text-slate-100 rounded-lg text-sm font-medium transition-colors"
          >
            <Icon d={ICONS.check} />
            Save
          </button>
          <button
            type="button" onClick={handleCancel}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-400 rounded-lg text-sm transition-colors"
          >
            <Icon d={ICONS.x} />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
