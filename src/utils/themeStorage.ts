import type { ThemePreference, ResolvedTheme } from '../types';

export const STORAGE_KEY = 'theme-preference';
export const VALID_THEMES: readonly ThemePreference[] = ['light', 'dark', 'system'] as const;

/**
 * Safely retrieves stored theme preference from localStorage with safelist validation.
 * Falls back to 'system' on corrupt values, missing keys, or storage exceptions.
 */
export function getStoredThemePreference(): ThemePreference {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return 'system';
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (VALID_THEMES as readonly string[]).includes(stored)) {
      return stored as ThemePreference;
    }
    return 'system';
  } catch {
    return 'system';
  }
}

/**
 * Safely persists theme preference to localStorage.
 * Handles storage quota and security exceptions gracefully.
 */
export function setStoredThemePreference(pref: ThemePreference): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, pref);
    }
  } catch {
    // Ignore storage exceptions (sandboxed iframes, private browsing restrictions)
  }
}

/**
 * Resolves the effective light/dark theme based on preference and OS color scheme.
 */
export function resolveEffectiveTheme(pref: ThemePreference): ResolvedTheme {
  if (pref === 'light') {
    return 'light';
  }
  if (pref === 'dark') {
    return 'dark';
  }
  try {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  } catch {
    // Fallback if matchMedia is unavailable
  }
  return 'light';
}

/**
 * Safely adds or removes 'dark' class on documentElement without raw string manipulation.
 */
export function applyThemeClass(theme: ResolvedTheme): void {
  try {
    if (typeof document !== 'undefined' && document.documentElement) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  } catch {
    // DOM exception safety
  }
}
