/**
 * Unit tests for Theme State Management & Storage Utilities
 * Task 001 Acceptance Criteria:
 * - Criterion 1: getStoredThemePreference reads theme-preference from localStorage & validates against ['light', 'dark', 'system']. Fallback to 'system' & sanitizes storage.
 * - Criterion 2: Gracefully handles localStorage exceptions (e.g. sandbox, private browsing) without crashing.
 * - Criterion 4: applyThemeToDocument safely updates document.documentElement.classList without raw string interpolation or window pollution.
 * - Criterion 5: Pre-render inline anti-FOUC theme resolution logic.
 */

import {
  THEME_STORAGE_KEY,
  VALID_THEMES,
  getStoredThemePreference,
  setStoredThemePreference,
  getSystemTheme,
  resolveTheme,
  applyThemeToDocument,
} from './theme';
import type { ThemePreference } from '../types';

// Mock helpers for localStorage and matchMedia
function createMockLocalStorage(initialStore: Record<string, string> = {}, shouldThrow = false) {
  let store: Record<string, string> = { ...initialStore };
  return {
    getItem(key: string): string | null {
      if (shouldThrow) {
        throw new Error('SecurityError: The operation is insecure.');
      }
      return key in store ? store[key] : null;
    },
    setItem(key: string, value: string): void {
      if (shouldThrow) {
        throw new Error('QuotaExceededError: Storage quota exceeded.');
      }
      store[key] = value;
    },
    removeItem(key: string): void {
      if (shouldThrow) {
        throw new Error('SecurityError: Access denied.');
      }
      delete store[key];
    },
    clear(): void {
      if (shouldThrow) {
        throw new Error('SecurityError: Access denied.');
      }
      store = {};
    },
    get _store() {
      return store;
    },
  };
}

function mockMatchMedia(matchesDark: boolean) {
  const listeners = new Set<(e: { matches: boolean }) => void>();
  return {
    mediaQueryList: {
      matches: matchesDark,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: (fn: (e: { matches: boolean }) => void) => listeners.add(fn),
      removeListener: (fn: (e: { matches: boolean }) => void) => listeners.delete(fn),
      addEventListener: (_type: string, fn: (e: { matches: boolean }) => void) => listeners.add(fn),
      removeEventListener: (_type: string, fn: (e: { matches: boolean }) => void) => listeners.delete(fn),
      dispatchEvent: (e: { matches: boolean }) => {
        listeners.forEach((fn) => fn(e));
        return true;
      },
    },
    triggerChange: (matches: boolean) => {
      listeners.forEach((fn) => fn({ matches }));
    },
    listenerCount: () => listeners.size,
  };
}

export function runThemeUtilTests(): { total: number; passed: number; failed: number } {
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      passed++;
    } else {
      failed++;
      console.error(`FAIL: ${testName}`);
    }
  }

  const originalLocalStorage = window.localStorage;
  const originalMatchMedia = window.matchMedia;

  try {
    // 1. Constants verification
    assert(THEME_STORAGE_KEY === 'theme-preference', 'THEME_STORAGE_KEY equals "theme-preference"');
    assert(
      Array.isArray(VALID_THEMES) &&
        VALID_THEMES.includes('light') &&
        VALID_THEMES.includes('dark') &&
        VALID_THEMES.includes('system') &&
        VALID_THEMES.length === 3,
      'VALID_THEMES contains ["light", "dark", "system"]'
    );

    // 2. getStoredThemePreference & Safelist Validation (Criterion 1)
    {
      const mockStorage = createMockLocalStorage({ [THEME_STORAGE_KEY]: 'dark' });
      Object.defineProperty(window, 'localStorage', { value: mockStorage, configurable: true, writable: true });
      assert(getStoredThemePreference() === 'dark', 'getStoredThemePreference returns "dark" when stored');

      mockStorage._store[THEME_STORAGE_KEY] = 'light';
      assert(getStoredThemePreference() === 'light', 'getStoredThemePreference returns "light" when stored');

      mockStorage._store[THEME_STORAGE_KEY] = 'system';
      assert(getStoredThemePreference() === 'system', 'getStoredThemePreference returns "system" when stored');

      // Invalid / corrupted values
      mockStorage._store[THEME_STORAGE_KEY] = 'invalid-theme-value';
      const fallbackInvalid = getStoredThemePreference();
      assert(
        fallbackInvalid === 'system',
        'getStoredThemePreference safely falls back to "system" on invalid value'
      );

      mockStorage._store[THEME_STORAGE_KEY] = 'DARK'; // case-sensitive check
      assert(
        getStoredThemePreference() === 'system',
        'getStoredThemePreference falls back to "system" on case-mismatched value'
      );

      delete mockStorage._store[THEME_STORAGE_KEY];
      assert(
        getStoredThemePreference() === 'system',
        'getStoredThemePreference returns "system" when no preference is stored'
      );
    }

    // 3. Storage Error Handling / Incognito & Sandboxed Resiliency (Criterion 2)
    {
      const throwingStorage = createMockLocalStorage({}, true);
      Object.defineProperty(window, 'localStorage', { value: throwingStorage, configurable: true, writable: true });

      let getThrown = false;
      let resultPreference: ThemePreference = 'dark';
      try {
        resultPreference = getStoredThemePreference();
      } catch {
        getThrown = true;
      }
      assert(!getThrown && resultPreference === 'system', 'getStoredThemePreference handles localStorage errors gracefully');

      let setThrown = false;
      try {
        setStoredThemePreference('dark');
      } catch {
        setThrown = true;
      }
      assert(!setThrown, 'setStoredThemePreference handles localStorage errors gracefully without crashing');
    }

    // 4. setStoredThemePreference Normal Operations
    {
      const mockStorage = createMockLocalStorage({});
      Object.defineProperty(window, 'localStorage', { value: mockStorage, configurable: true, writable: true });

      setStoredThemePreference('dark');
      assert(mockStorage._store[THEME_STORAGE_KEY] === 'dark', 'setStoredThemePreference saves "dark"');

      setStoredThemePreference('light');
      assert(mockStorage._store[THEME_STORAGE_KEY] === 'light', 'setStoredThemePreference saves "light"');

      setStoredThemePreference('system');
      assert(mockStorage._store[THEME_STORAGE_KEY] === 'system', 'setStoredThemePreference saves "system"');
    }

    // 5. getSystemTheme & resolveTheme
    {
      const { mediaQueryList: darkMQ } = mockMatchMedia(true);
      window.matchMedia = () => darkMQ as unknown as MediaQueryList;
      assert(getSystemTheme() === 'dark', 'getSystemTheme returns "dark" when prefers-color-scheme matches');

      const { mediaQueryList: lightMQ } = mockMatchMedia(false);
      window.matchMedia = () => lightMQ as unknown as MediaQueryList;
      assert(getSystemTheme() === 'light', 'getSystemTheme returns "light" when prefers-color-scheme does not match');

      // resolveTheme checks
      assert(resolveTheme('light') === 'light', 'resolveTheme("light") returns "light"');
      assert(resolveTheme('dark') === 'dark', 'resolveTheme("dark") returns "dark"');
      assert(resolveTheme('system') === 'light', 'resolveTheme("system") matches light system setting');

      window.matchMedia = () => darkMQ as unknown as MediaQueryList;
      assert(resolveTheme('system') === 'dark', 'resolveTheme("system") matches dark system setting');
    }

    // 6. applyThemeToDocument (Criterion 4)
    {
      document.documentElement.classList.remove('dark');
      applyThemeToDocument('dark');
      assert(document.documentElement.classList.contains('dark'), 'applyThemeToDocument("dark") adds "dark" class');

      // Applying dark multiple times should not create duplicate classes or errors
      applyThemeToDocument('dark');
      assert(document.documentElement.classList.contains('dark'), 'applyThemeToDocument("dark") is idempotent');

      applyThemeToDocument('light');
      assert(!document.documentElement.classList.contains('dark'), 'applyThemeToDocument("light") removes "dark" class');
    }
  } finally {
    // Restore window mocks
    Object.defineProperty(window, 'localStorage', { value: originalLocalStorage, configurable: true, writable: true });
    window.matchMedia = originalMatchMedia;
  }

  return { total: passed + failed, passed, failed };
}
