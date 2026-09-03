# Task [003]: Header Theme Switcher Control and Accessible Announcements

## 1. Problem to Solve
Users need a visible, accessible 3-way theme switcher control in the top navigation header to toggle between Light, Dark, and System modes. The control must display distinct visual icons (Sun, Moon, Laptop/Monitor), provide keyboard focus indicators with >= 3:1 contrast, and dispatch screen reader announcements via an `aria-live="polite"` region on state changes.

## 2. Technical Parameters & Scope
- **Target Files**:
  - `src/components/ThemeToggle.tsx`
  - `src/components/Header.tsx`
- **Interfaces / Data Contracts**:
  ```typescript
  export interface ThemeToggleProps {
    preference: 'light' | 'dark' | 'system';
    resolvedTheme: 'light' | 'dark';
    onCycleTheme: () => void;
  }
  ```
  - Icons from `lucide-react`: `Sun`, `Moon`, `Monitor` (or `Laptop`)
  - Accessible attributes: `aria-label`, `title`, and an `aria-live="polite"` container announcing e.g. `"Light theme enabled"`, `"Dark theme enabled"`, `"System theme enabled"`.
- **Non-Goals / Out-of-Scope**:
  - Theming trait selector or suggestion cards (handled in Tasks 004 & 005).

## 3. Acceptance Criteria
- [ ] Criterion 1: `ThemeToggle` renders in the `Header` next to "Surprise Me" and "Favorites", displaying the correct icon and label corresponding to the active preference (`light`, `dark`, or `system`).
- [ ] Criterion 2: Activating the toggle (via click, Space, or Enter) cycles through themes in sequence (`light` -> `dark` -> `system` -> `light`).
- [ ] Criterion 3: A screen reader polite live region announces the new theme name upon state change.
- [ ] Criterion 4: The toggle button features a visible focus ring meeting at least 3:1 contrast against both light and dark header backgrounds.
- [ ] Criterion 5: `Header.tsx` container, logo text, subtitle, and action buttons include dark styling variants (`dark:bg-slate-900/80`, `dark:border-slate-800`, `dark:text-slate-100`, etc.).

## 4. Verification Command
`npm run build`
