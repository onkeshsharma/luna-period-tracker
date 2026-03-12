import React, { useState } from 'react';
import { getDaysBetween, formatDate, getTodayISO } from '../utils';
import { ChevronDown, ChevronUp, Pencil, Trash2, Check, X } from 'lucide-react';

/* ── shared inline style helpers ── */
const labelStyle = { color: 'var(--luna-text-3)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' };
const chipIdle   = { background: 'var(--luna-glass-bg)', borderColor: 'var(--luna-glass-border)', color: 'var(--luna-text-1)', border: '1px solid' };
const chipActive = { background: 'var(--luna-accent)', borderColor: 'var(--luna-accent)', color: '#fff', border: '1px solid' };
const chipBase   = 'rounded-xl text-xs font-semibold transition-all cursor-pointer focus:outline-none';

function ViewMode({ cycle, deleteArmed, onEdit, onDeleteFirstTap, onDeleteSecondTap, onDeleteBlur, onQuickDuration, onQuickNotes, onPeriodEnded }) {
  const [notesOpen, setNotesOpen]   = useState(false);
  const [notesDraft, setNotesDraft] = useState('');

  const hasTrackingData = cycle.flow || cycle.mood || (cycle.symptoms && cycle.symptoms.length > 0);

  return (
    <>
      <div className="space-y-4 mb-5">
        {/* Duration */}
        <div>
          <p style={labelStyle} className="mb-2">Duration</p>
          {!cycle.duration && (
            <button
              onClick={onPeriodEnded}
              className="w-full mb-3 py-2 px-4 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--luna-accent)' }}
            >
              Period ended today
            </button>
          )}
          <div className="flex flex-wrap gap-2">
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <button
                key={n}
                onClick={() => onQuickDuration(n)}
                className={`w-10 h-10 ${chipBase}`}
                style={cycle.duration === n ? chipActive : chipIdle}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <p style={labelStyle} className="mb-2">Notes</p>
          {cycle.notes && !notesOpen && (
            <p
              className="text-sm leading-relaxed p-3 rounded-xl"
              style={{ color: 'var(--luna-text-1)', background: 'var(--luna-glass-bg)', border: '1px solid var(--luna-glass-border)' }}
            >
              {cycle.notes}
            </p>
          )}
          {!cycle.notes && !notesOpen && (
            <button
              onClick={() => { setNotesDraft(''); setNotesOpen(true); }}
              className="text-sm italic transition-colors"
              style={{ color: 'var(--luna-text-3)' }}
            >
              + Add a note...
            </button>
          )}
          {notesOpen && (
            <div className="space-y-2 mt-2">
              <textarea
                value={notesDraft}
                rows={3}
                autoFocus
                placeholder="How are you feeling?"
                onChange={e => setNotesDraft(e.target.value)}
                className="w-full rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2"
                style={{
                  background: 'var(--luna-glass-bg)',
                  border: '1px solid var(--luna-glass-border)',
                  color: 'var(--luna-text-1)',
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => { onQuickNotes(notesDraft.trim()); setNotesOpen(false); }}
                  className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-opacity hover:opacity-90"
                  style={{ background: 'var(--luna-accent)', color: '#fff' }}
                >
                  Save Note
                </button>
                <button
                  onClick={() => setNotesOpen(false)}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-80"
                  style={{ color: 'var(--luna-text-3)', background: 'var(--luna-glass-bg)', border: '1px solid var(--luna-glass-border)' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tracking pills */}
        {hasTrackingData && (
          <div className="pt-2 mt-4" style={{ borderTop: '1px solid var(--luna-glass-border)' }}>
            <p style={labelStyle} className="mb-3 mt-4">Logged Symptoms</p>
            <div className="flex flex-wrap gap-2">
              {cycle.flow && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(244,63,94,0.12)', color: 'var(--luna-accent)', border: '1px solid rgba(244,63,94,0.25)' }}>
                  🩸 {cycle.flow} Flow
                </span>
              )}
              {cycle.mood && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(139,92,246,0.12)', color: 'var(--luna-accent-soft)', border: '1px solid rgba(139,92,246,0.25)' }}>
                  {cycle.mood === 'Happy' ? '😊' : cycle.mood === 'Sensitive' ? '🥺' : cycle.mood === 'Sad' ? '😢' : cycle.mood === 'Anxious' ? '😰' : '✨'} {cycle.mood}
                </span>
              )}
              {cycle.symptoms && cycle.symptoms.map(s => (
                <span key={s} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'var(--luna-glass-bg)', color: 'var(--luna-text-2)', border: '1px solid var(--luna-glass-border)' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4" style={{ borderTop: '1px solid var(--luna-glass-border)' }}>
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ background: 'var(--luna-glass-bg)', color: 'var(--luna-text-1)', border: '1px solid var(--luna-glass-border)' }}
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>
        <button
          onClick={deleteArmed ? onDeleteSecondTap : onDeleteFirstTap}
          onBlur={onDeleteBlur}
          className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={deleteArmed
            ? { background: '#ef4444', color: '#fff', border: '1px solid #ef4444' }
            : { background: 'var(--luna-glass-bg)', color: 'var(--luna-text-3)', border: '1px solid var(--luna-glass-border)' }
          }
        >
          <Trash2 className="h-4 w-4" />
          {deleteArmed ? 'Confirm Delete' : 'Delete'}
        </button>
      </div>
    </>
  );
}

function EditMode({ editValues, today, onChange, onSave, onCancel }) {
  const upd = (field, value) => onChange(prev => ({ ...prev, [field]: value }));

  return (
    <>
      <div className="space-y-4 mb-6">
        {/* Date */}
        <div className="space-y-2">
          <p style={labelStyle}>Start Date</p>
          <input
            type="date"
            value={editValues.date}
            max={today}
            onChange={e => upd('date', e.target.value)}
            className="w-full h-11 px-3 rounded-xl text-sm focus:outline-none focus:ring-2"
            style={{
              background: 'var(--luna-glass-bg)',
              border: '1px solid var(--luna-glass-border)',
              color: 'var(--luna-text-1)',
            }}
          />
        </div>

        {/* Duration number */}
        <div className="space-y-2">
          <p style={labelStyle}>Duration (days)</p>
          <input
            type="number"
            value={editValues.duration}
            min="1" max="14"
            placeholder="e.g. 5"
            onChange={e => upd('duration', e.target.value)}
            className="w-full h-11 px-3 rounded-xl text-sm focus:outline-none focus:ring-2"
            style={{
              background: 'var(--luna-glass-bg)',
              border: '1px solid var(--luna-glass-border)',
              color: 'var(--luna-text-1)',
            }}
          />
        </div>

        {/* Flow */}
        <div className="space-y-2">
          <p style={labelStyle}>Flow</p>
          <div className="flex flex-wrap gap-2">
            {['Light', 'Medium', 'Heavy', 'Spotting'].map(f => (
              <button
                key={f} type="button"
                onClick={() => upd('flow', editValues.flow === f ? null : f)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                style={editValues.flow === f ? chipActive : chipIdle}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Mood */}
        <div className="space-y-2">
          <p style={labelStyle}>Mood</p>
          <div className="flex flex-wrap gap-2">
            {[
              {k:'Happy', e:'😊'}, {k:'Sensitive', e:'🥺'},
              {k:'Sad', e:'😢'}, {k:'Anxious', e:'😰'}, {k:'Energized', e:'✨'}
            ].map(m => (
              <button
                key={m.k} type="button"
                onClick={() => upd('mood', editValues.mood === m.k ? null : m.k)}
                className="px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-all"
                style={editValues.mood === m.k ? chipActive : chipIdle}
              >
                <span>{m.e}</span> {m.k}
              </button>
            ))}
          </div>
        </div>

        {/* Symptoms */}
        <div className="space-y-2">
          <p style={labelStyle}>Symptoms</p>
          <div className="flex flex-wrap gap-2">
            {['Cramps', 'Headache', 'Fatigue', 'Bloating', 'Acne', 'Tender'].map(s => {
              const isSel = editValues.symptoms.includes(s);
              return (
                <button
                  key={s} type="button"
                  onClick={() => upd('symptoms', isSel
                    ? editValues.symptoms.filter(x => x !== s)
                    : [...editValues.symptoms, s]
                  )}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                  style={isSel ? chipActive : chipIdle}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <p style={labelStyle}>Notes</p>
          <textarea
            value={editValues.notes}
            placeholder="Additional details..."
            rows={2}
            onChange={e => upd('notes', e.target.value)}
            className="w-full rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2"
            style={{
              background: 'var(--luna-glass-bg)',
              border: '1px solid var(--luna-glass-border)',
              color: 'var(--luna-text-1)',
            }}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4" style={{ borderTop: '1px solid var(--luna-glass-border)' }}>
        <button
          onClick={onSave}
          className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl font-bold tracking-wide text-sm transition-opacity hover:opacity-90"
          style={{ background: 'var(--luna-accent)', color: '#fff' }}
        >
          <Check className="h-4 w-4" />
          Save Changes
        </button>
        <button
          onClick={onCancel}
          className="h-11 w-11 flex items-center justify-center rounded-xl transition-opacity hover:opacity-80"
          style={{ background: 'var(--luna-glass-bg)', border: '1px solid var(--luna-glass-border)', color: 'var(--luna-text-2)' }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}

export function HistoryCard({ cycle, previousCycle, onUpdate, onDelete, isExpanded, onToggle }) {
  const [mode, setMode]               = useState('view');
  const [deleteArmed, setDeleteArmed] = useState(false);
  const [editValues, setEditValues]   = useState({
    date:     cycle.date,
    duration: cycle.duration || '',
    notes:    cycle.notes    || '',
    flow:     cycle.flow     || null,
    mood:     cycle.mood     || null,
    symptoms: cycle.symptoms || [],
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
      flow:     editValues.flow     ? editValues.flow              : undefined,
      mood:     editValues.mood     ? editValues.mood              : undefined,
      symptoms: editValues.symptoms && editValues.symptoms.length > 0 ? editValues.symptoms : undefined,
    });
    setMode('view');
  }

  function handleEditCancel() {
    setEditValues({
      date: cycle.date,
      duration: cycle.duration || '',
      notes: cycle.notes || '',
      flow: cycle.flow || null,
      mood: cycle.mood || null,
      symptoms: cycle.symptoms || [],
    });
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
    <article
      className="mx-4 mt-3 glass rounded-2xl overflow-hidden shadow-md"
      style={{ border: '1px solid var(--luna-glass-border)' }}
    >
      {/* Header row */}
      <button
        onClick={handleToggleExpand}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:opacity-90"
        style={isExpanded ? { background: 'var(--luna-glass-bg)', opacity: 1 } : {}}
      >
        <div>
          <div className="flex items-center gap-3">
            <p className="text-base font-semibold tracking-tight" style={{ color: 'var(--luna-text-1)' }}>
              {formatDate(cycle.date)}
            </p>
            {cycle.duration && (
              <span
                className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                style={{ background: 'var(--luna-glass-bg)', color: 'var(--luna-text-2)', border: '1px solid var(--luna-glass-border)' }}
              >
                {cycle.duration} days
              </span>
            )}
          </div>
          {daysSincePrev !== null && (
            <p className="text-sm mt-1 flex items-center gap-1.5 font-medium" style={{ color: 'var(--luna-text-3)' }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--luna-text-3)' }} />
              {daysSincePrev} days from previous
            </p>
          )}
        </div>
        {isExpanded
          ? <ChevronUp  className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--luna-text-3)' }} />
          : <ChevronDown className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--luna-text-3)' }} />}
      </button>

      {/* Expanded body */}
      {isExpanded && (
        <div
          className="px-5 pt-5 pb-4"
          style={{ borderTop: '1px solid var(--luna-glass-border)' }}
        >
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
      )}
    </article>
  );
}
