/**
 * Unit tests for Theme Storage Utility and Theme Engine
 * Validates acceptance criteria:
 * 1. Storage safelist validation against ['light', 'dark', 'system']
 * 2. Storage exception resiliency (sandboxed iframes / private browsing)
 * 3. System OS preference resolution via matchMedia
 * 4. Safe DOM classList operations for applying theme class
 */

import {
  STORAGE_KEY,
  VALID_THEMES,
  getStoredThemePreference,
  setStoredThemePreference,
  resolveEffectiveTheme,
  applyThemeClass,
} from '../utils/themeStorage';

// Top-level export verifying imported symbols
export const _themeStorageTestExports = {
  STORAGE_KEY,
  VALID_THEMES,
  getStoredThemePreference,
  setStoredThemePreference,
  resolveEffectiveTheme,
  applyThemeClass,
};

// Simple test harness for deterministic verification
export function runThemeStorageTests(): { passed: number; failed: number; errors: string[] } {
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

  // Preserve original globals
  const originalLocalStorage = window.localStorage;
  const originalMatchMedia = window.matchMedia;

  // Mock localStorage implementation
  let mockStorage: Record<string, string> = {};
  const mockLocalStorageInstance: Storage = {
    getItem: (key: string) => (key in mockStorage ? mockStorage[key] : null),
    setItem: (key: string, value: string) => {
      mockStorage[key] = value;
    },
    removeItem: (key: string) => {
      delete mockStorage[key];
    },
    clear: () => {
      mockStorage = {};
    },
    key: (index: number) => Object.keys(mockStorage)[index] ?? null,
    get length() {
      return Object.keys(mockStorage).length;
    },
  };

  try {
    // -------------------------------------------------------------
    // Test 1: Constants contract
    // -------------------------------------------------------------
    assertEqual(STORAGE_KEY, 'theme-preference', 'STORAGE_KEY constant must equal "theme-preference"');
    assertEqual(VALID_THEMES.length, 3, 'VALID_THEMES should contain exactly 3 themes');
    assert(VALID_THEMES.includes('light'), 'VALID_THEMES includes light');
    assert(VALID_THEMES.includes('dark'), 'VALID_THEMES includes dark');
    assert(VALID_THEMES.includes('system'), 'VALID_THEMES includes system');

    // Setup mock localStorage
    mockStorage = {};
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorageInstance,
      configurable: true,
      writable: true,
    });

    // -------------------------------------------------------------
    // Test 2: getStoredThemePreference Safelist Validation
    // -------------------------------------------------------------
    mockStorage[STORAGE_KEY] = 'light';
    assertEqual(getStoredThemePreference(), 'light', 'Returns "light" when stored value is "light"');

    mockStorage[STORAGE_KEY] = 'dark';
    assertEqual(getStoredThemePreference(), 'dark', 'Returns "dark" when stored value is "dark"');

    mockStorage[STORAGE_KEY] = 'system';
    assertEqual(getStoredThemePreference(), 'system', 'Returns "system" when stored value is "system"');

    // Invalid & corrupt values should default to 'system'
    mockStorage[STORAGE_KEY] = 'invalid-theme';
    assertEqual(getStoredThemePreference(), 'system', 'Defaults to "system" on unknown theme string');

    mockStorage[STORAGE_KEY] = 'DARK';
    assertEqual(getStoredThemePreference(), 'system', 'Defaults to "system" on uppercase invalid string');

    mockStorage[STORAGE_KEY] = '{"theme": "dark"}';
    assertEqual(getStoredThemePreference(), 'system', 'Defaults to "system" on JSON string');

    mockStorage[STORAGE_KEY] = '';
    assertEqual(getStoredThemePreference(), 'system', 'Defaults to "system" on empty string');

    delete mockStorage[STORAGE_KEY];
    assertEqual(getStoredThemePreference(), 'system', 'Defaults to "system" when key is not present');

    // -------------------------------------------------------------
    // Test 3: Exception Resiliency for LocalStorage
    // -------------------------------------------------------------
    const throwingStorage: Storage = {
      ...mockLocalStorageInstance,
      getItem: () => {
        throw new DOMException('Access denied', 'SecurityError');
      },
      setItem: () => {
        throw new DOMException('Quota exceeded', 'QuotaExceededError');
      },
    };

    Object.defineProperty(window, 'localStorage', {
      value: throwingStorage,
      configurable: true,
      writable: true,
    });

    // getStoredThemePreference should not throw and return 'system'
    try {
      const result = getStoredThemePreference();
      assertEqual(result, 'system', 'getStoredThemePreference catches storage exception and returns "system"');
    } catch (e) {
      assert(false, `getStoredThemePreference threw uncaught exception: ${e}`);
    }

    // setStoredThemePreference should not throw
    try {
      setStoredThemePreference('dark');
      assert(true, 'setStoredThemePreference handles storage set exception gracefully without throwing');
    } catch (e) {
      assert(false, `setStoredThemePreference threw uncaught exception: ${e}`);
    }

    // Restore working mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorageInstance,
      configurable: true,
      writable: true,
    });
    mockStorage = {};

    // -------------------------------------------------------------
    // Test 4: setStoredThemePreference Writes
    // -------------------------------------------------------------
    setStoredThemePreference('dark');
    assertEqual(mockStorage[STORAGE_KEY], 'dark', 'setStoredThemePreference writes dark to storage');

    setStoredThemePreference('light');
    assertEqual(mockStorage[STORAGE_KEY], 'light', 'setStoredThemePreference writes light to storage');

    setStoredThemePreference('system');
    assertEqual(mockStorage[STORAGE_KEY], 'system', 'setStoredThemePreference writes system to storage');

    // -------------------------------------------------------------
    // Test 5: resolveEffectiveTheme Resolution
    // -------------------------------------------------------------
    // Direct light/dark preferences return immediately
    assertEqual(resolveEffectiveTheme('light'), 'light', 'Explicit "light" preference resolves to "light"');
    assertEqual(resolveEffectiveTheme('dark'), 'dark', 'Explicit "dark" preference resolves to "dark"');

    // System preference queries matchMedia
    let mediaQueryDarkMatches = true;
    window.matchMedia = (query: string): MediaQueryList => ({
      matches: query.includes('prefers-color-scheme: dark') ? mediaQueryDarkMatches : false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    });

    assertEqual(resolveEffectiveTheme('system'), 'dark', 'System preference resolves to "dark" when OS prefers dark');

    mediaQueryDarkMatches = false;
    assertEqual(resolveEffectiveTheme('system'), 'light', 'System preference resolves to "light" when OS prefers light');

    // -------------------------------------------------------------
    // Test 6: applyThemeClass Safe DOM Operations
    // -------------------------------------------------------------
    document.documentElement.classList.remove('dark');

    applyThemeClass('dark');
    assert(document.documentElement.classList.contains('dark'), 'applyThemeClass("dark") adds "dark" class to documentElement');

    applyThemeClass('light');
    assert(!document.documentElement.classList.contains('dark'), 'applyThemeClass("light") removes "dark" class from documentElement');

  } finally {
    // Restore originals
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      configurable: true,
      writable: true,
    });
    window.matchMedia = originalMatchMedia;
  }

  return { passed, failed, errors };
}
