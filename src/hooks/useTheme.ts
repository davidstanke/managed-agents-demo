import { useState, useEffect, useCallback } from 'react';
import type { ThemePreference, ResolvedTheme } from '../types';
import {
  getStoredThemePreference,
  setStoredThemePreference,
  resolveEffectiveTheme,
  applyThemeClass,
} from '../utils/themeStorage';

export interface UseThemeReturn {
  themePreference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setThemePreference: (pref: ThemePreference) => void;
  cycleTheme: () => void;
}

export function useTheme(): UseThemeReturn {
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>(() => {
    return getStoredThemePreference();
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    return resolveEffectiveTheme(themePreference);
  });

  const setThemePreference = useCallback((newPref: ThemePreference) => {
    setThemePreferenceState(newPref);
    setStoredThemePreference(newPref);
    const resolved = resolveEffectiveTheme(newPref);
    setResolvedTheme(resolved);
    applyThemeClass(resolved);
  }, []);

  const cycleTheme = useCallback(() => {
    setThemePreferenceState((currentPref) => {
      let nextPref: ThemePreference;
      if (currentPref === 'light') {
        nextPref = 'dark';
      } else if (currentPref === 'dark') {
        nextPref = 'system';
      } else {
        nextPref = 'light';
      }
      setStoredThemePreference(nextPref);
      const resolved = resolveEffectiveTheme(nextPref);
      setResolvedTheme(resolved);
      applyThemeClass(resolved);
      return nextPref;
    });
  }, []);

  // Sync DOM and subscribe to OS prefers-color-scheme changes when in system mode
  useEffect(() => {
    const currentResolved = resolveEffectiveTheme(themePreference);
    setResolvedTheme(currentResolved);
    applyThemeClass(currentResolved);

    if (themePreference !== 'system') {
      return;
    }

    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const newResolved: ResolvedTheme = e.matches ? 'dark' : 'light';
      setResolvedTheme(newResolved);
      applyThemeClass(newResolved);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange as EventListener);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleMediaChange as (e: MediaQueryListEvent) => void);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange as EventListener);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleMediaChange as (e: MediaQueryListEvent) => void);
      }
    };
  }, [themePreference]);

  return {
    themePreference,
    resolvedTheme,
    setThemePreference,
    cycleTheme,
  };
}
