# Task 002: Header Theme Switcher Control and ARIA Live Announcements

## 1. Problem to Solve
Users need an intuitive, accessible visual control in the navigation header to switch between light, dark, and system themes, with clear icon indicators and screen reader announcements for assistive technology users. This task implements the theme switcher component in the header navigation, interactive cycling (`light` -> `dark` -> `system`), accessible keyboard navigation, and polite ARIA live status announcements.

## 2. Technical Parameters & Scope
- **Target Files**:
  - [`src/components/ThemeToggle.tsx`](file:///tmp/implementer_ws_cxo_ykg6/src/components/ThemeToggle.tsx)
  - [`src/components/Header.tsx`](file:///tmp/implementer_ws_cxo_ykg6/src/components/Header.tsx)
  - [`src/components/AriaLiveAnnouncer.tsx`](file:///tmp/implementer_ws_cxo_ykg6/src/components/AriaLiveAnnouncer.tsx) (or integrated live region in layout)
- **Interfaces / Data Contracts**:
  - `ThemeToggleProps`: `{ themePreference: ThemePreference, resolvedTheme: ResolvedTheme, onCycleTheme: () => void }`
  - Visual Icons: [`Sun`](file:///tmp/implementer_ws_cxo_ykg6/src/components/ThemeToggle.tsx) (light), [`Moon`](file:///tmp/implementer_ws_cxo_ykg6/src/components/ThemeToggle.tsx) (dark), [`Laptop`](file:///tmp/implementer_ws_cxo_ykg6/src/components/ThemeToggle.tsx) or [`Monitor`](file:///tmp/implementer_ws_cxo_ykg6/src/components/ThemeToggle.tsx) (system) from `lucide-react`
  - Screen Reader Announcement Contract: Dispatches string messages like `"Dark theme enabled"`, `"Light theme enabled"`, `"System theme enabled (using dark mode)"` into an `aria-live="polite"` element with `role="status"`
  - Updated [`HeaderProps`](file:///tmp/implementer_ws_cxo_ykg6/src/components/Header.tsx): Includes theme toggle callbacks/props or consumes theme context
- **Non-Goals / Out-of-Scope**:
  - Deep theming of inner body content, trait cards, or name suggestions (handled in Tasks 003 and 004).
  - Storage persistence logic and media query subscription lifecycle (handled in Task 001).

## 3. Acceptance Criteria
- [ ] Theme switcher button is rendered in [`Header.tsx`](file:///tmp/implementer_ws_cxo_ykg6/src/components/Header.tsx) alongside "Surprise Me" and "Favorites" action buttons.
- [ ] The toggle displays distinct icons reflecting the active mode: Sun for `light`, Moon for `dark`, and Display/Monitor/Laptop for `system`.
- [ ] Activating the toggle button cycles the theme in the sequence `light` -> `dark` -> `system` -> `light`.
- [ ] The toggle button includes an accessible `aria-label` describing current state and next action (e.g., `Current theme: Light. Click to switch to Dark mode.`).
- [ ] The button is fully keyboard accessible via Tab navigation, and triggers on Space or Enter keypress.
- [ ] A visible focus indicator with at least 3:1 contrast ratio against the header background is rendered when focused via keyboard.
- [ ] An `aria-live="polite"` announcement container notifies screen readers whenever the theme changes.

## 4. Verification Command
`npm run build`
