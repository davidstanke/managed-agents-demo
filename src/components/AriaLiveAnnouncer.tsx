import React from 'react';
import type { ThemePreference, ResolvedTheme } from '../types';

export interface AriaLiveAnnouncerProps {
  message: string;
  politeness?: 'polite' | 'assertive' | 'off';
  role?: string;
}

/**
 * Pure helper generating the screen reader announcement string for theme transitions
 */
export function getThemeAnnouncementMessage(
  themePreference: ThemePreference,
  resolvedTheme: ResolvedTheme
): string {
  switch (themePreference) {
    case 'dark':
      return 'Dark theme enabled';
    case 'light':
      return 'Light theme enabled';
    case 'system':
      return `System theme enabled (using ${resolvedTheme} mode)`;
    default:
      return 'Theme updated';
  }
}

/**
 * ARIA Live polite announcement region for screen readers
 */
export const AriaLiveAnnouncer: React.FC<AriaLiveAnnouncerProps> = ({
  message,
  politeness = 'polite',
  role = 'status',
}) => {
  return (
    <div
      aria-live={politeness}
      role={role}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};
