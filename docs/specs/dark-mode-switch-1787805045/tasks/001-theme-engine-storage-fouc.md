# Task 001: Theme Engine, Storage Safelist Validation, OS Preference Sync, and Zero-FOUC Setup

## 1. Problem to Solve
The application currently lacks a centralized theme management infrastructure, dark mode Tailwind configuration, storage persistence mechanism, and operating system color scheme detection. This task implements the foundational theme state management, safe local storage persistence under key `theme-preference`, OS `prefers-color-scheme` listener with clean unsubscription lifecycle, pre-render inline zero-FOUC initialization script, safe DOM class list operations, and motion-reduced transition styling.

## 2. Technical Parameters & Scope
- **Target Files**:
  - [`src/types.ts`](file:///tmp/implementer_ws_cxo_ykg6/src/types.ts)
  - [`src/hooks/useTheme.ts`](file:///tmp/implementer_ws_cxo_ykg6/src/hooks/useTheme.ts) (or [`src/context/ThemeContext.tsx`](file:///tmp/implementer_ws_cxo_ykg6/src/context/ThemeContext.tsx))
  - [`src/utils/themeStorage.ts`](file:///tmp/implementer_ws_cxo_ykg6/src/utils/themeStorage.ts)
  - [`tailwind.config.js`](file:///tmp/implementer_ws_cxo_ykg6/tailwind.config.js)
  - [`src/index.css`](file:///tmp/implementer_ws_cxo_ykg6/src/index.css)
  - [`index.html`](file:///tmp/implementer_ws_cxo_ykg6/index.html)
- **Interfaces / Data Contracts**:
  - `ThemePreference`: `'light' | 'dark' | 'system'`
  - `ResolvedTheme`: `'light' | 'dark'`
  - `STORAGE_KEY`: `'theme-preference'`
  - `VALID_THEMES`: `['light', 'dark', 'system'] as const`
  - `getStoredThemePreference(): ThemePreference` (safelist validation, falls back to `'system'` on invalid/corrupt string or storage exception)
  - `setStoredThemePreference(pref: ThemePreference): void` (try/catch wrapped for private/sandboxed iframe resiliency)
  - `resolveEffectiveTheme(pref: ThemePreference): ResolvedTheme` (queries `window.matchMedia('(prefers-color-scheme: dark)')` when `pref === 'system'`)
  - `applyThemeClass(theme: ResolvedTheme): void` (uses safe `document.documentElement.classList.add('dark')` / `remove('dark')` API)
  - Hook / Provider contract: `{ themePreference: ThemePreference, resolvedTheme: ResolvedTheme, setThemePreference: (pref: ThemePreference) => void, cycleTheme: () => void }`
- **Non-Goals / Out-of-Scope**:
  - Building header switcher UI icons or visual toggle buttons (handled in Task 002).
  - Theming trait selector, name cards, or favorites drawer components (handled in Tasks 003 and 004).

## 3. Acceptance Criteria
- [ ] Tailwind is configured with `darkMode: 'class'` in [`tailwind.config.js`](file:///tmp/implementer_ws_cxo_ykg6/tailwind.config.js).
- [ ] Reading from localStorage key `theme-preference` validates values strictly against the safelist `['light', 'dark', 'system']`. Any missing, null, or corrupted value safely defaults to `'system'`.
- [ ] Storage operations are wrapped in try/catch blocks so sandboxed iframes or private browsing exceptions do not throw uncaught errors.
- [ ] When theme preference is `'system'`, a media query change listener on `(prefers-color-scheme: dark)` updates the resolved theme in real time.
- [ ] When theme preference switches from `'system'` to `'light'` or `'dark'`, or when the component unmounts, the media query listener is cleanly unsubscribed to prevent memory leaks.
- [ ] DOM class manipulation on `document.documentElement` strictly uses `classList.add('dark')` / `classList.remove('dark')` without `innerHTML` or raw string concatenation.
- [ ] [`index.html`](file:///tmp/implementer_ws_cxo_ykg6/index.html) includes a lightweight blocking script in `<head>` to inspect `localStorage.getItem('theme-preference')` and OS preference prior to initial render, preventing Flash of Unstyled Content (FOUC).
- [ ] [`src/index.css`](file:///tmp/implementer_ws_cxo_ykg6/src/index.css) defines smooth 150ms transitions for colors/backgrounds and disables transitions when `@media (prefers-reduced-motion: reduce)` is active.

## 4. Verification Command
`npm run build`
