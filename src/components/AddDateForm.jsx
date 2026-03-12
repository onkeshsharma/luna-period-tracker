import React, { useState, useEffect } from 'react';
import { getTodayISO } from '../utils';
import { Check, X, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

export function AddDateForm({ isOpen, onClose, defaultDate, onSave, averageDuration, cycles = [] }) {
  const [date, setDate] = useState();
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [warnOverride, setWarnOverride] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDate(defaultDate || undefined);
      setSelectedDuration(null);
      setSelectedFlow(null);
      setSelectedMood(null);
      setSelectedSymptoms([]);
      setErrorMessage('');
      setWarnOverride(false);
    }
  }, [isOpen, defaultDate]);

  const MIN_CYCLE_GAP = 15; // shortest realistic cycle in days

  function handleSubmit() {
    if (!date) { setErrorMessage('Please select a date.'); return; }
    const isoDate = date.toISOString().split('T')[0];
    const today = getTodayISO();
    if (isoDate > today) { setErrorMessage('Date cannot be in the future.'); return; }

    // 1. Duplicate check
    if (cycles.some(c => c.date === isoDate)) {
      setErrorMessage('An entry already exists for this date.');
      return;
    }

    // 2. Proximity check — skipped on 2nd tap (warnOverride = true)
    if (!warnOverride) {
      const newMs = new Date(isoDate).getTime();
      const tooClose = cycles.find(c => {
        const diff = Math.abs(newMs - new Date(c.date).getTime());
        return diff / (1000 * 60 * 60 * 24) < MIN_CYCLE_GAP;
      });
      if (tooClose) {
        const days = Math.round(
          Math.abs(newMs - new Date(tooClose.date).getTime()) / (1000 * 60 * 60 * 24)
        );
        setErrorMessage(
          `Only ${days} day${days !== 1 ? 's' : ''} from another entry. Cycles are usually ${MIN_CYCLE_GAP}+ days apart. Tap Save again to confirm.`
        );
        setWarnOverride(true);
        return;
      }
    }

    const trackingData = {
      flow: selectedFlow,
      mood: selectedMood,
      symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : undefined,
    };
    onSave(isoDate, selectedDuration, trackingData);
    onClose();
  }

  /* ── Shared chip styles ── */
  const chipBase = 'px-4 py-2 rounded-xl text-sm font-semibold transition-all border focus:outline-none focus:ring-2 focus:ring-[var(--luna-accent)]/40 cursor-pointer';
  const chipIdle = {
    background: 'var(--luna-glass-bg)',
    borderColor: 'var(--luna-glass-border)',
    color: 'var(--luna-text-1)',
  };
  const chipActive = {
    background: 'var(--luna-accent)',
    borderColor: 'var(--luna-accent)',
    color: '#fff',
    boxShadow: '0 4px 12px color-mix(in srgb, var(--luna-accent), transparent 60%)',
  };

  const pillBase = 'px-3 py-1.5 rounded-full text-sm font-medium transition-all border flex items-center gap-1 cursor-pointer';
  const tagBase  = 'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border cursor-pointer';

  const sectionLabel = { color: 'var(--luna-text-1)', fontWeight: 600, fontSize: '0.875rem' };
  const optionalLabel = { color: 'var(--luna-text-3)', fontSize: '0.75rem' };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent
        className="sm:max-w-[425px] glass rounded-3xl w-[92vw] shadow-2xl p-6"
        style={{ borderColor: 'var(--luna-glass-border)' }}
        showCloseButton={false}
      >
        <DialogHeader className="mb-4">
          <DialogTitle
            className="text-xl font-bold tracking-tight"
            style={{ color: 'var(--luna-text-1)' }}
          >
            Track your cycle
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* ── Date picker ── */}
          <div className="space-y-2">
            <label style={sectionLabel}>Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 justify-start text-left font-normal border"
                  style={{
                    background: 'var(--luna-glass-bg)',
                    borderColor: 'var(--luna-glass-border)',
                    color: date ? 'var(--luna-text-1)' : 'var(--luna-text-3)',
                  }}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" style={{ color: 'var(--luna-text-3)' }} />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 rounded-xl"
                align="center"
                style={{
                  background: 'var(--luna-glass-bg)',
                  backdropFilter: 'blur(20px)',
                  borderColor: 'var(--luna-glass-border)',
                }}
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d > new Date()}
                  initialFocus
                  className="p-3 bg-transparent rounded-xl"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* ── Duration ── */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label style={sectionLabel}>Duration</label>
              <span style={optionalLabel}>Optional</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[2, 3, 4, 5, 6, 7, 8].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setSelectedDuration(prev => prev === n ? null : n)}
                  className={chipBase}
                  style={selectedDuration === n ? chipActive : chipIdle}
                >
                  {n}
                </button>
              ))}
            </div>
            <p
              className="text-xs flex items-center gap-1.5 mt-2 px-3 py-2 rounded-lg inline-flex"
              style={{ background: 'var(--luna-glass-bg)', color: 'var(--luna-text-2)' }}
            >
              <span style={{ opacity: 0.7 }}>Your average is</span>
              <strong style={{ color: 'var(--luna-text-1)' }}>{averageDuration} days</strong>
            </p>
          </div>

          {/* ── Flow ── */}
          <div className="space-y-3">
            <label style={sectionLabel}>Flow</label>
            <div className="flex flex-wrap gap-2">
              {['Light', 'Medium', 'Heavy', 'Spotting'].map(f => (
                <button
                  key={f} type="button"
                  onClick={() => setSelectedFlow(prev => prev === f ? null : f)}
                  className={chipBase}
                  style={selectedFlow === f ? chipActive : chipIdle}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* ── Mood ── */}
          <div className="space-y-3">
            <label style={sectionLabel}>Mood</label>
            <div className="flex flex-wrap gap-2">
              {[
                {k:'Happy', e:'😊'}, {k:'Sensitive', e:'🥺'},
                {k:'Sad', e:'😢'}, {k:'Anxious', e:'😰'}, {k:'Energized', e:'✨'}
              ].map(m => (
                <button
                  key={m.k} type="button"
                  onClick={() => setSelectedMood(prev => prev === m.k ? null : m.k)}
                  className={pillBase}
                  style={selectedMood === m.k ? chipActive : chipIdle}
                >
                  <span>{m.e}</span> {m.k}
                </button>
              ))}
            </div>
          </div>

          {/* ── Symptoms ── */}
          <div className="space-y-3">
            <label style={sectionLabel}>Symptoms</label>
            <div className="flex flex-wrap gap-2">
              {['Cramps', 'Headache', 'Fatigue', 'Bloating', 'Acne', 'Tender'].map(s => {
                const isSel = selectedSymptoms.includes(s);
                return (
                  <button
                    key={s} type="button"
                    onClick={() => setSelectedSymptoms(prev =>
                      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
                    )}
                    className={tagBase}
                    style={isSel ? chipActive : chipIdle}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Error ── */}
          {errorMessage && (
            <div
              className="p-3 rounded-lg"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          {/* ── Actions ── */}
          <div
            className="flex gap-3 pt-4"
            style={{ borderTop: '1px solid var(--luna-glass-border)' }}
          >
            <button
              onClick={handleSubmit}
              className="flex-1 h-12 font-bold tracking-wide rounded-xl gap-2 flex items-center justify-center transition-opacity hover:opacity-90"
              style={{ background: 'var(--luna-accent)', color: '#fff' }}
            >
              <Check className="h-5 w-5" />
              Save Entry
            </button>
            <button
              onClick={() => onClose()}
              className="h-12 w-12 p-0 rounded-xl flex items-center justify-center border transition-opacity hover:opacity-80"
              style={{
                background: 'var(--luna-glass-bg)',
                borderColor: 'var(--luna-glass-border)',
                color: 'var(--luna-text-2)',
              }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
