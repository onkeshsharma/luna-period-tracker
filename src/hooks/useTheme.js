import { useState, useEffect } from 'react';

const THEME_NAMES = ['dark', 'blossom', 'night-sky'];

const THEME_CSS = {
  dark: `
    body { background: linear-gradient(-45deg,#0f172a,#1e1b4b,#0f172a,#1a0f2e) !important; }
    .glass { background:rgba(30,41,59,0.72)!important; border-color:rgba(255,255,255,0.08)!important; }
  `,
  blossom: `
    body { background: linear-gradient(-45deg,#fff1f2,#fce7f3,#fff0f6,#fdf2f8) !important; }
    .glass { background:rgba(255,255,255,0.75)!important; border-color:rgba(244,114,182,0.25)!important; }
    .bg-slate-900,.bg-slate-800,.bg-slate-700,.bg-slate-600 { background-color:transparent!important; }
    .border-slate-700 { border-color:rgba(244,114,182,0.25)!important; }
    .text-slate-100 { color:#881337!important; }
    .text-slate-300 { color:#9f1239!important; }
    .text-slate-400 { color:#be185d!important; }
    .text-slate-500 { color:#db2777!important; }
    .text-slate-600 { color:#ec4899!important; }
    .bg-rose-500    { background-color:#ec4899!important; }
    .border-rose-400{ border-color:#f472b6!important; }
    .text-rose-300  { color:#f9a8d4!important; }
    .shimmer-text   { background-image:linear-gradient(90deg,#881337 0%,#ec4899 40%,#f472b6 60%,#881337 100%)!important; }
    input,select,textarea { background-color:rgba(252,231,243,0.8)!important; color:#881337!important; border-color:#fbcfe8!important; }
    header { border-color:rgba(244,114,182,0.3)!important; }
  `,
  'night-sky': `
    body { background: linear-gradient(-45deg,#1e0a3c,#0d0221,#2e1065,#1a0a2e) !important; }
    .glass { background:rgba(46,16,101,0.72)!important; border-color:rgba(139,92,246,0.2)!important; }
    .bg-slate-900,.bg-slate-800,.bg-slate-700,.bg-slate-600 { background-color:transparent!important; }
    .border-slate-700 { border-color:rgba(139,92,246,0.25)!important; }
    .text-slate-100 { color:#ede9fe!important; }
    .text-slate-300 { color:#ddd6fe!important; }
    .text-slate-400 { color:#c4b5fd!important; }
    .text-slate-500 { color:#a78bfa!important; }
    .text-slate-600 { color:#8b5cf6!important; }
    .bg-rose-500    { background-color:#7c3aed!important; }
    .border-rose-400{ border-color:#8b5cf6!important; }
    .text-rose-300  { color:#c4b5fd!important; }
    .shimmer-text   { background-image:linear-gradient(90deg,#ede9fe 0%,#a78bfa 40%,#7c3aed 60%,#ede9fe 100%)!important; }
    input,select,textarea { background-color:rgba(59,7,100,0.8)!important; color:#ede9fe!important; border-color:rgba(139,92,246,0.3)!important; }
    input[type="date"]::-webkit-calendar-picker-indicator { filter:invert(0.8) hue-rotate(200deg)!important; }
    header { border-color:rgba(139,92,246,0.25)!important; }
  `,
};

export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    try { return localStorage.getItem('luna-theme') || 'dark'; } catch { return 'dark'; }
  });

  useEffect(() => {
    let el = document.getElementById('luna-theme-override');
    if (!el) {
      el = document.createElement('style');
      el.id = 'luna-theme-override';
      document.head.appendChild(el);
    }
    el.textContent = THEME_CSS[theme] || '';
    document.body.dataset.theme = theme;
    try { localStorage.setItem('luna-theme', theme); } catch {}
  }, [theme]);

  function cycleTheme() {
    setThemeState(prev => {
      const idx = THEME_NAMES.indexOf(prev);
      return THEME_NAMES[(idx + 1) % THEME_NAMES.length];
    });
  }

  return { theme, cycleTheme };
}
