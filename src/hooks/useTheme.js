import { useState, useEffect } from 'react';

const THEME_NAMES = ['cosmic', 'sakura'];

export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    try { return localStorage.getItem('luna-theme') || 'cosmic'; } catch { return 'cosmic'; }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
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
