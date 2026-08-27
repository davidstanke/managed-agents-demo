import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import type { ThemePreference, ResolvedTheme } from '../types';

export interface ThemeToggleProps {
  themePreference: ThemePreference;
  resolvedTheme?: ResolvedTheme;
  onCycleTheme: () => void;
  className?: string;
}

/**
 * Pure helper defining the canonical theme cycling sequence
 */
export function getNextThemePreference(current: ThemePreference): ThemePreference {
  switch (current) {
    case 'light':
      return 'dark';
    case 'dark':
      return 'system';
    case 'system':
      return 'light';
    default:
      return 'light';
  }
}

/**
 * Pure helper generating the accessible label describing current state and next action
 */
export function getThemeToggleAriaLabel(
  themePreference: ThemePreference,
  resolvedTheme?: ResolvedTheme
): string {
  const next = getNextThemePreference(themePreference);
  const nextCapitalized = next.charAt(0).toUpperCase() + next.slice(1);
  const currentCapitalized = themePreference.charAt(0).toUpperCase() + themePreference.slice(1);

  if (themePreference === 'system' && resolvedTheme) {
    const resolvedCap = resolvedTheme.charAt(0).toUpperCase() + resolvedTheme.slice(1);
    return `Current theme: System (${resolvedCap}). Click to switch to ${nextCapitalized} mode.`;
  }

  return `Current theme: ${currentCapitalized}. Click to switch to ${nextCapitalized} mode.`;
}

/**
 * Pure helper returning the icon identifier corresponding to active theme preference
 */
export function getThemeIconType(themePreference: ThemePreference): 'sun' | 'moon' | 'system' {
  switch (themePreference) {
    case 'light':
      return 'sun';
    case 'dark':
      return 'moon';
    case 'system':
      return 'system';
  }
}

/**
 * Keyboard activation handler for theme switcher button
 */
export function handleThemeToggleKeyDown(
  event: { key: string; preventDefault?: () => void },
  onCycle: () => void
): boolean {
  if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
    if (event.preventDefault) {
      event.preventDefault();
    }
    onCycle();
    return true;
  }
  return false;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  themePreference,
  resolvedTheme,
  onCycleTheme,
  className = '',
}) => {
  const iconType = getThemeIconType(themePreference);
  const ariaLabel = getThemeToggleAriaLabel(themePreference, resolvedTheme);

  return (
    <button
      type="button"
      role="button"
      tabIndex={0}
      onClick={onCycleTheme}
      onKeyDown={(e) => handleThemeToggleKeyDown(e, onCycleTheme)}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus:outline-none dark:focus-visible:ring-amber-400 dark:focus-visible:ring-offset-slate-900 ${className}`}
    >
      {iconType === 'sun' && <Sun className="w-4 h-4 text-amber-500 transition-transform" />}
      {iconType === 'moon' && <Moon className="w-4 h-4 text-indigo-400 transition-transform" />}
      {iconType === 'system' && <Laptop className="w-4 h-4 text-slate-600 dark:text-slate-300 transition-transform" />}
    </button>
  );
};
