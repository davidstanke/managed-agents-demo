# Task [001]: Theme State Management, Storage Persistence, and Zero-FOUC Initialization

## 1. Problem to Solve
The application currently lacks state management for theme preferences (`light`, `dark`, and `system`). We need a robust theme management module and React hook that persists the user's preference in `localStorage` under the key `theme-preference`, validates stored values with a strict safelist, safely handles storage exceptions in sandboxed/incognito contexts, listens to dynamic OS `prefers-color-scheme` media query changes with cleanup, and provides an anti-FOUC pre-render script in `index.html`.

## 2. Technical Parameters & Scope
- **Target Files**:
  - `src/types.ts`
  - `src/utils/theme.ts`
  - `src/hooks/useTheme.ts`
  - `index.html`
- **Interfaces / Data Contracts**:
  ```typescript
  export type ThemePreference = 'light' | 'dark' | 'system';
  export type ResolvedTheme = 'light' | 'dark';

  export const THEME_STORAGE_KEY = 'theme-preference';
  export const VALID_THEMES: readonly ThemePreference[] = ['light', 'dark', 'system'];

  export function getStoredThemePreference(): ThemePreference;
  export function setStoredThemePreference(preference: ThemePreference): void;
  export function getSystemTheme(): ResolvedTheme;
  export function resolveTheme(preference: ThemePreference): ResolvedTheme;
  export function applyThemeToDocument(theme: ResolvedTheme): void;

  export interface UseThemeReturn {
    themePreference: ThemePreference;
    resolvedTheme: ResolvedTheme;
    setThemePreference: (pref: ThemePreference) => void;
    cycleTheme: () => void;
  }

  export function useTheme(): UseThemeReturn;
  ```
- **Non-Goals / Out-of-Scope**:
  - UI button rendering or header component markup (handled in Task 003).
  - Tailwind dark styling across individual view components (handled in Tasks 004 & 005).

## 3. Acceptance Criteria
- [ ] Criterion 1: `getStoredThemePreference()` reads `theme-preference` from `localStorage` and validates against `['light', 'dark', 'system']`. If missing, invalid, or corrupted, it safely falls back to `'system'` and sanitizes storage.
- [ ] Criterion 2: If accessing `localStorage` throws an error (e.g. sandboxed iframe or strict private browsing), operations catch exceptions and maintain in-memory state without crashing.
- [ ] Criterion 3: When `themePreference` is `'system'`, a media query change listener on `(prefers-color-scheme: dark)` updates the document theme dynamically in real-time, and is cleanly unsubscribed when switching to `'light'` or `'dark'` or unmounting.
- [ ] Criterion 4: `applyThemeToDocument()` safely updates `document.documentElement.classList` (`add('dark')` / `remove('dark')`) without raw string interpolation or global window pollution.
- [ ] Criterion 5: `index.html` includes an inline `<script>` before `#root` to resolve and apply the initial `'dark'` class before DOM paint, eliminating flash of unstyled content (FOUC).

## 4. Verification Command
`npm run build`
