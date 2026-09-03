import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import type { ThemePreference, ResolvedTheme } from '../types';

export interface ThemeToggleProps {
  preference: ThemePreference;
  resolvedTheme?: ResolvedTheme;
  onCycleTheme: () => void;
}

export interface ThemeToggleVisualDescriptor {
  icon: 'Sun' | 'Moon' | 'Monitor';
  label: string;
  ariaLabel: string;
  announcement: string;
}

/**
 * Returns the visual and accessibility descriptor for each theme preference.
 */
export function getThemeDescriptor(preference: ThemePreference): ThemeToggleVisualDescriptor {
  switch (preference) {
    case 'light':
      return {
        icon: 'Sun',
        label: 'Light',
        ariaLabel: 'Switch to dark theme (currently light)',
        announcement: 'Light theme enabled',
      };
    case 'dark':
      return {
        icon: 'Moon',
        label: 'Dark',
        ariaLabel: 'Switch to system theme (currently dark)',
        announcement: 'Dark theme enabled',
      };
    case 'system':
      return {
        icon: 'Monitor',
        label: 'System',
        ariaLabel: 'Switch to light theme (currently system)',
        announcement: 'System theme enabled',
      };
  }
}

/**
 * Computes next theme in cyclic sequence: light -> dark -> system -> light
 */
export function getNextThemePreference(current: ThemePreference): ThemePreference {
  switch (current) {
    case 'light':
      return 'dark';
    case 'dark':
      return 'system';
    case 'system':
      return 'light';
  }
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  preference,
  resolvedTheme: _resolvedTheme,
  onCycleTheme,
}) => {
  const descriptor = getThemeDescriptor(preference);

  const renderIcon = () => {
    switch (descriptor.icon) {
      case 'Sun':
        return <Sun className="w-4 h-4 text-amber-500" aria-hidden="true" />;
      case 'Moon':
        return <Moon className="w-4 h-4 text-amber-400" aria-hidden="true" />;
      case 'Monitor':
        return <Monitor className="w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />;
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={onCycleTheme}
        aria-label={descriptor.ariaLabel}
        title={descriptor.ariaLabel}
        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all bg-slate-100 hover:bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 shadow-xs active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-amber-400 dark:focus-visible:ring-offset-slate-900"
      >
        {renderIcon()}
        <span>{descriptor.label}</span>
      </button>

      {/* Screen Reader polite announcement live region */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {descriptor.announcement}
      </div>
    </div>
  );
};

export default ThemeToggle;
