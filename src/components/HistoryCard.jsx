import React, { useState } from 'react';
import { getDaysBetween, formatDate, getTodayISO } from '../utils';
import { Icon, ICONS } from './Icons';

function ViewMode({ cycle, deleteArmed, onEdit, onDeleteFirstTap, onDeleteSecondTap, onDeleteBlur, onQuickDuration, onQuickNotes, onPeriodEnded }) {
  const [notesOpen, setNotesOpen]   = useState(false);
  const [notesDraft, setNotesDraft] = useState('');

  return (
    <>
      <div className="space-y-3 mb-4">
        <div>
          <p className="text-xs text-slate-500 mb-1.5">Duration</p>
          {!cycle.duration ? (
            <button onClick={onPeriodEnded}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-xs font-medium transition-colors mb-1">
              Period ended today
            </button>
          ) : null}
          <div className="flex flex-wrap gap-1">
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <button key={n} onClick={() => onQuickDuration(n)}
                className={'px-2.5 py-1 rounded-full text-xs font-medium transition-colors ' +
                  (cycle.duration === n ? 'bg-rose-500 text-white' : 'glass text-slate-400 hover:text-slate-200')}
              >{n}d</button>
            ))}
          </div>
        </div>
        {cycle.notes && !notesOpen ? (
          <p className="text-sm text-slate-300"><span className="text-slate-500">Notes: </span>{cycle.notes}</p>
        ) : null}
        {!cycle.notes && !notesOpen ? (
          <button onClick={() => { setNotesDraft(''); setNotesOpen(true); }}
            className="text-xs text-slate-600 hover:text-slate-400 italic transition-colors">+ Add note...</button>
        ) : null}
        {notesOpen ? (
          <div>
            <textarea value={notesDraft} placeholder="Add a note..." rows={2} autoFocus
              onInput={e => setNotesDraft(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none resize-none" />
            <div className="flex gap-2 mt-1.5">
              <button onClick={() => { onQuickNotes(notesDraft.trim()); setNotesOpen(false); }}
                className="px-3 py-1 glass hover:bg-slate-500 text-slate-100 rounded-lg text-xs font-medium transition-colors">Save</button>
              <button onClick={() => setNotesOpen(false)}
                className="px-3 py-1 glass text-slate-400 rounded-lg text-xs transition-colors">Cancel</button>
            </div>
          </div>
        ) : null}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs transition-colors"
        >
          <Icon d={ICONS.pencil} size={14} />
          Edit
        </button>
        <button
          onClick={deleteArmed ? onDeleteSecondTap : onDeleteFirstTap}
          onBlur={onDeleteBlur}
          className={'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ' +
            (deleteArmed
              ? 'bg-red-700 hover:bg-red-600 text-red-100 font-medium'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-300')}
        >
          <Icon d={ICONS.trash} size={14} />
          {deleteArmed ? 'Tap again to confirm' : 'Delete'}
        </button>
      </div>
    </>
  );
}

function EditMode({ editValues, today, onChange, onSave, onCancel }) {
  const upd = (field, value) => onChange(prev => ({ ...prev, [field]: value }));
  return (
    <>
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Date</label>
          <input
            type="date" value={editValues.date} max={today}
            onChange={e => upd('date', e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-slate-400"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Duration (days)</label>
          <input
            type="number" value={editValues.duration}
            min="1" max="14" placeholder="e.g. 5"
            onChange={e => upd('duration', e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-slate-400"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Notes</label>
          <textarea
            value={editValues.notes}
            placeholder="Optional notes..."
            rows={2}
            onChange={e => upd('notes', e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-slate-400 resize-none"
          ></textarea>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-slate-100 rounded-lg text-xs font-medium transition-colors"
        >
          <Icon d={ICONS.check} size={14} />
          Save changes
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-400 rounded-lg text-xs transition-colors"
        >
          <Icon d={ICONS.x} size={14} />
          Cancel
        </button>
      </div>
    </>
  );
}

export function HistoryCard({ cycle, previousCycle, onUpdate, onDelete, isExpanded, onToggle }) {
  const [mode, setMode]             = useState('view');
  const [deleteArmed, setDeleteArmed] = useState(false);
  const [editValues, setEditValues] = useState({
    date:     cycle.date,
    duration: cycle.duration || '',
    notes:    cycle.notes    || '',
  });

  const today = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  })();
  const daysSincePrev = previousCycle ? getDaysBetween(previousCycle.date, cycle.date) : null;

  function handleEditSave() {
    if (!editValues.date || editValues.date > today) return;
    onUpdate({
      ...cycle,
      date:     editValues.date,
      duration: editValues.duration ? Number(editValues.duration) : undefined,
      notes:    editValues.notes    ? editValues.notes             : undefined,
    });
    setMode('view');
  }

  function handleEditCancel() {
    setEditValues({ date: cycle.date, duration: cycle.duration || '', notes: cycle.notes || '' });
    setMode('view');
  }

  function handleToggleExpand() {
    onToggle();
    if (isExpanded) { setDeleteArmed(false); setMode('view'); }
  }

  function handleQuickDuration(n) {
    onUpdate({ ...cycle, duration: n });
    setEditValues(prev => ({ ...prev, duration: n }));
  }
  function handleQuickNotes(notes) {
    onUpdate({ ...cycle, notes: notes || undefined });
    setEditValues(prev => ({ ...prev, notes: notes || '' }));
  }
  function handlePeriodEnded() {
    const days = Math.max(1, getDaysBetween(cycle.date, getTodayISO()) + 1);
    onUpdate({ ...cycle, duration: days });
    setEditValues(prev => ({ ...prev, duration: days }));
  }

  return (
    <article className="mx-4 mt-3 glass rounded-xl overflow-hidden">
      <button
        onClick={handleToggleExpand}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-700 transition-colors"
      >
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-100">{formatDate(cycle.date)}</p>
            {cycle.duration ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500 text-white font-medium" style={{opacity:0.8}}>
                {cycle.duration}d
              </span>
            ) : null}
          </div>
          {daysSincePrev !== null ? (
            <p className="text-xs text-slate-500 mt-0.5">{daysSincePrev} days from previous</p>
          ) : null}
        </div>
        <Icon
          d={isExpanded ? ICONS.chevronUp : ICONS.chevronDown}
          cls="text-slate-500 flex-shrink-0"
        />
      </button>
      {isExpanded ? (
        <div className="border-t border-slate-700 px-4 py-3">
          {mode === 'view' ? (
            <ViewMode
              cycle={cycle}
              deleteArmed={deleteArmed}
              onEdit={() => { setMode('edit'); setDeleteArmed(false); }}
              onDeleteFirstTap={() => setDeleteArmed(true)}
              onDeleteSecondTap={onDelete}
              onDeleteBlur={() => setTimeout(() => setDeleteArmed(false), 150)}
              onQuickDuration={handleQuickDuration}
              onQuickNotes={handleQuickNotes}
              onPeriodEnded={handlePeriodEnded}
            />
          ) : (
            <EditMode
              editValues={editValues}
              today={today}
              onChange={setEditValues}
              onSave={handleEditSave}
              onCancel={handleEditCancel}
            />
          )}
        </div>
      ) : null}
    </article>
  );
}
