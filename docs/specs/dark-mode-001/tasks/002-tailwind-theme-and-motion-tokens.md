# Task [002]: Tailwind Dark Mode Configuration and Motion Accessibility Tokens

## 1. Problem to Solve
Tailwind CSS needs to be configured for class-based dark mode (`darkMode: 'class'`), and global CSS must define dark mode base background/text colors, dark scrollbar styling, 150ms smooth color transitions, and an instant transition override when `prefers-reduced-motion` is enabled.

## 2. Technical Parameters & Scope
- **Target Files**:
  - `tailwind.config.js`
  - `src/index.css`
- **Interfaces / Data Contracts**:
  - Tailwind config: `darkMode: 'class'`
  - CSS Custom rules:
    - Root and body dark theme base background and text styling.
    - Dark mode scrollbar rules (`::-webkit-scrollbar-track`, `::-webkit-scrollbar-thumb` in dark mode).
    - Global color transition rules: `transition-colors duration-150` on interactive and themed elements.
    - Reduced motion media query: `@media (prefers-reduced-motion: reduce)` disabling transitions (`transition-duration: 0ms !important; animation-duration: 0ms !important;`).
- **Non-Goals / Out-of-Scope**:
  - Direct component markup or toggle button implementation.
  - State persistence logic.

## 3. Acceptance Criteria
- [ ] Criterion 1: `tailwind.config.js` includes `darkMode: 'class'` enabling `dark:` variant utilities when the `.dark` class is present on `<html>`.
- [ ] Criterion 2: `src/index.css` styles base dark mode colors on `body` (e.g. `dark:bg-slate-950 dark:text-slate-100`) and custom scrollbars for dark mode.
- [ ] Criterion 3: Smooth 150ms transition effects are applied to color and background property changes.
- [ ] Criterion 4: When `prefers-reduced-motion` is active, theme transitions and animations execute with zero delay (0ms) to prevent motion sickness.

## 4. Verification Command
`npm run build`
