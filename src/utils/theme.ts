import type { ThemePreference, ResolvedTheme } from '../types';

export const THEME_STORAGE_KEY = 'theme-preference';
export const VALID_THEMES: readonly ThemePreference[] = ['light', 'dark', 'system'] as const;

export function getStoredThemePreference(): ThemePreference {
  if (typeof window === 'undefined' || !window.localStorage) {
    return 'system';
  }
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && VALID_THEMES.includes(stored as ThemePreference)) {
      return stored as ThemePreference;
    }
    if (stored !== null) {
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, 'system');
      } catch {
        // Ignore storage write error
      }
    }
    return 'system';
  } catch {
    return 'system';
  }
}

export function setStoredThemePreference(preference: ThemePreference): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    if (VALID_THEMES.includes(preference)) {
      window.localStorage.setItem(THEME_STORAGE_KEY, preference);
    }
  } catch {
    // Gracefully handle storage exceptions (e.g., sandbox or private browsing)
  }
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light';
  }
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference === 'dark') return 'dark';
  if (preference === 'light') return 'light';
  return getSystemTheme();
}

export function applyThemeToDocument(theme: ResolvedTheme): void {
  if (typeof document === 'undefined' || !document.documentElement) {
    return;
  }
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
