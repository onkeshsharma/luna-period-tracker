import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'luna-pet-v2';
const MAX_TAPS_PER_DAY = 8;

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

function buildDefault() {
  return { happiness: 70, lastDate: getToday(), tapsToday: 0, tapDate: getToday() };
}

export function usePetState(cycles = []) {
  const [state, setState] = useState(() => {
    const saved = loadState();
    if (!saved) return buildDefault();

    // Apply day decay for any missed days
    const today = getToday();
    if (saved.lastDate !== today) {
      const d1 = new Date(saved.lastDate).getTime();
      const d2 = new Date(today).getTime();
      const missedDays = Math.floor((d2 - d1) / 86400000);
      // Gentle decay: -5 per missed day, floor at 20 so pet never looks sad for long
      const decayed = Math.max(20, saved.happiness - missedDays * 5);
      return { ...saved, happiness: decayed, lastDate: today };
    }
    return saved;
  });

  // Persist whenever state changes
  useEffect(() => { saveState(state); }, [state]);

  // Boost on new cycle entry logged
  useEffect(() => {
    const onLogged = () => {
      setState(s => ({ ...s, happiness: Math.min(100, s.happiness + 20), lastDate: getToday() }));
    };
    window.addEventListener('luna:periodLogged', onLogged);
    return () => window.removeEventListener('luna:periodLogged', onLogged);
  }, []);

  const tap = useCallback(() => {
    const today = getToday();
    setState(s => {
      const tapsToday = s.tapDate === today ? s.tapsToday : 0;
      if (tapsToday >= MAX_TAPS_PER_DAY) return s; // no more boost but interaction still works
      return {
        ...s,
        happiness: Math.min(100, s.happiness + 4),
        tapsToday: tapsToday + 1,
        tapDate: today,
      };
    });
  }, []);

  // Derive mood label from happiness
  const mood = state.happiness >= 80 ? 'ecstatic'
             : state.happiness >= 55 ? 'happy'
             : state.happiness >= 30 ? 'tired'
             : 'sleepy';

  return { happiness: state.happiness, mood, tap };
}
