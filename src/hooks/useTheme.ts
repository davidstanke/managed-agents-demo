import { useState, useEffect, useCallback } from 'react';
import type { ThemePreference, ResolvedTheme } from '../types';
import {
  VALID_THEMES,
  getStoredThemePreference,
  setStoredThemePreference,
  resolveTheme,
  applyThemeToDocument,
} from '../utils/theme';

export interface UseThemeReturn {
  themePreference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setThemePreference: (pref: ThemePreference) => void;
  cycleTheme: () => void;
}

export function useTheme(): UseThemeReturn {
  const [themePreference, setPreferenceState] = useState<ThemePreference>(() => getStoredThemePreference());
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(getStoredThemePreference()));

  useEffect(() => {
    const currentResolved = resolveTheme(themePreference);
    setResolvedTheme(currentResolved);
    applyThemeToDocument(currentResolved);

    if (themePreference !== 'system') {
      return;
    }

    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent | { matches: boolean }) => {
      const nextResolved: ResolvedTheme = e.matches ? 'dark' : 'light';
      setResolvedTheme(nextResolved);
      applyThemeToDocument(nextResolved);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else if ((mediaQuery as any).addListener) {
      (mediaQuery as any).addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else if ((mediaQuery as any).removeListener) {
        (mediaQuery as any).removeListener(handleChange);
      }
    };
  }, [themePreference]);

  const setThemePreference = useCallback((pref: ThemePreference) => {
    const validatedPref = VALID_THEMES.includes(pref) ? pref : 'system';
    setStoredThemePreference(validatedPref);
    setPreferenceState(validatedPref);
  }, []);

  const cycleTheme = useCallback(() => {
    setPreferenceState((current) => {
      const next: ThemePreference =
        current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
      setStoredThemePreference(next);
      return next;
    });
  }, []);

  return {
    themePreference,
    resolvedTheme,
    setThemePreference,
    cycleTheme,
  };
}
