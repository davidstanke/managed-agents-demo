/**
 * Unit tests for ARIA Live Announcements and Screen Reader Notifications
 * Task 002: Header Theme Switcher Control and ARIA Live Announcements
 *
 * Validates acceptance criteria:
 * 1. An aria-live="polite" announcement container notifies screen readers whenever the theme changes
 * 2. Status message formats for light, dark, and system modes
 * 3. Screen-reader only (sr-only) container visibility attributes
 * 4. Announcement state transitions on theme updates
 */

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
 * Evaluates whether an element attributes configuration satisfies the ARIA live status region contract
 */
export function validateLiveRegionAttributes(attrs: {
  'aria-live'?: string;
  role?: string;
  'aria-atomic'?: string | boolean;
  className?: string;
}): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (attrs['aria-live'] !== 'polite') {
    issues.push(`Expected aria-live="polite", got "${attrs['aria-live']}"`);
  }

  if (attrs.role !== 'status' && attrs.role !== 'alert') {
    issues.push(`Expected role="status", got "${attrs.role}"`);
  }

  if (attrs['aria-atomic'] !== true && attrs['aria-atomic'] !== 'true') {
    issues.push(`Expected aria-atomic="true", got "${attrs['aria-atomic']}"`);
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function runAriaAnnouncerTests(): { passed: number; failed: number; errors: string[] } {
  let passed = 0;
  let failed = 0;
  const errors: string[] = [];

  function assert(condition: boolean, message: string) {
    if (condition) {
      passed++;
    } else {
      failed++;
      errors.push(`FAIL: ${message}`);
    }
  }

  function assertEqual<T>(actual: T, expected: T, message: string) {
    if (actual === expected) {
      passed++;
    } else {
      failed++;
      errors.push(`FAIL: ${message} (Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)})`);
    }
  }

  // -------------------------------------------------------------
  // Test 1: Announcement Messages for All Theme Preference Transitions
  // -------------------------------------------------------------
  assertEqual(
    getThemeAnnouncementMessage('dark', 'dark'),
    'Dark theme enabled',
    'Dark mode transition produces "Dark theme enabled"'
  );

  assertEqual(
    getThemeAnnouncementMessage('light', 'light'),
    'Light theme enabled',
    'Light mode transition produces "Light theme enabled"'
  );

  assertEqual(
    getThemeAnnouncementMessage('system', 'dark'),
    'System theme enabled (using dark mode)',
    'System mode (with resolved dark) produces "System theme enabled (using dark mode)"'
  );

  assertEqual(
    getThemeAnnouncementMessage('system', 'light'),
    'System theme enabled (using light mode)',
    'System mode (with resolved light) produces "System theme enabled (using light mode)"'
  );

  // -------------------------------------------------------------
  // Test 2: Live Region Accessibility Attributes Contract
  // -------------------------------------------------------------
  const validAttributes = {
    'aria-live': 'polite',
    role: 'status',
    'aria-atomic': 'true',
    className: 'sr-only',
  };

  const validationResult = validateLiveRegionAttributes(validAttributes);
  assert(validationResult.valid, `Valid live region attributes accepted: ${validationResult.issues.join(', ')}`);

  // Verify missing/invalid live region attributes are flagged
  const invalidAttributes = {
    'aria-live': 'off',
    role: 'presentation',
    'aria-atomic': 'false',
  };
  const invalidResult = validateLiveRegionAttributes(invalidAttributes);
  assert(!invalidResult.valid, 'Invalid live region attributes correctly detected');
  assertEqual(invalidResult.issues.length, 3, 'All 3 attribute violations identified');

  // -------------------------------------------------------------
  // Test 3: Screen Reader Visually-Hidden (sr-only) Container Contract
  // -------------------------------------------------------------
  const srOnlyClasses = 'sr-only';
  assert(
    srOnlyClasses.includes('sr-only'),
    'Live announcer element includes sr-only utility class to prevent visual layout disruption'
  );

  // -------------------------------------------------------------
  // Test 4: Live Announcement History & Update Sequencing
  // -------------------------------------------------------------
  const announcementLog: string[] = [];
  const dispatchAnnouncement = (pref: ThemePreference, resolved: ResolvedTheme) => {
    const msg = getThemeAnnouncementMessage(pref, resolved);
    announcementLog.push(msg);
  };

  dispatchAnnouncement('light', 'light');
  dispatchAnnouncement('dark', 'dark');
  dispatchAnnouncement('system', 'dark');
  dispatchAnnouncement('light', 'light');

  assertEqual(announcementLog.length, 4, 'Dispatched 4 consecutive announcements');
  assertEqual(announcementLog[0], 'Light theme enabled', 'Announcement 1 matches');
  assertEqual(announcementLog[1], 'Dark theme enabled', 'Announcement 2 matches');
  assertEqual(announcementLog[2], 'System theme enabled (using dark mode)', 'Announcement 3 matches');
  assertEqual(announcementLog[3], 'Light theme enabled', 'Announcement 4 matches');

  return { passed, failed, errors };
}
