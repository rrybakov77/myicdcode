import { useState, useEffect, useRef } from 'react';
import styles from './ThemeSwitcher.module.css';

const THEMES = [
  { id: 'navy',    label: 'Navy',    dot: '#4A9EFF', bg: '#0A1628' },
  { id: 'white',   label: 'White',   dot: '#0066cc', bg: '#ffffff' },
  { id: 'emerald', label: 'Emerald', dot: '#34d399', bg: '#0d1f0f' },
  { id: 'crimson', label: 'Crimson', dot: '#e63946', bg: '#100a08' },
];

const STORAGE_KEY = 'myicdcode-theme';

export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) || 'navy';
    }
    return 'navy';
  });

  const setTheme = (id) => {
    setThemeState(id);
    document.documentElement.setAttribute('data-theme', id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) || 'navy';
    document.documentElement.setAttribute('data-theme', saved);
    setThemeState(saved);
  }, []);

  return { theme, setTheme };
}

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = THEMES.find(t => t.id === theme) || THEMES[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        className={styles.trigger}
        onClick={() => setOpen(o => !o)}
        aria-label="Change color theme"
        title="Change theme"
      >
        <span className={styles.triggerDot} style={{ background: current.dot }} />
        <span className={styles.triggerLabel}>{current.label}</span>
        <svg className={`${styles.chevron} ${open ? styles.open : ''}`} viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.dropHeader}>Color theme</div>
          {THEMES.map(t => (
            <button
              key={t.id}
              className={`${styles.option} ${theme === t.id ? styles.active : ''}`}
              onClick={() => { setTheme(t.id); setOpen(false); }}
            >
              <span className={styles.swatch} style={{ background: t.bg, borderColor: t.dot + '66' }}>
                <span className={styles.swatchDot} style={{ background: t.dot }} />
              </span>
              <span className={styles.optLabel}>{t.label}</span>
              {theme === t.id && (
                <svg className={styles.check} viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
