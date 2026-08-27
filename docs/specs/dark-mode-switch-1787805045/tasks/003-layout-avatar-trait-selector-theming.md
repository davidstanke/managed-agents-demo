# Task 003: Dark Mode Theming for Application Layout, Hero Banner, Avatar Preview & Trait Selector

## 1. Problem to Solve
When dark mode is active, the global background, top navigation header, hero banner, cat preview container, and trait selector options currently retain light-mode backgrounds and text colors, leading to severe glare and contrast violations. This task implements full Tailwind dark mode variant styling (`dark:*`) across the layout container, header, hero section, cat avatar preview card, and trait selector panels while preserving WCAG 2.1 AA contrast compliance.

## 2. Technical Parameters & Scope
- **Target Files**:
  - [`src/App.tsx`](file:///tmp/implementer_ws_cxo_ykg6/src/App.tsx)
  - [`src/components/Header.tsx`](file:///tmp/implementer_ws_cxo_ykg6/src/components/Header.tsx)
  - [`src/components/CatPreviewAvatar.tsx`](file:///tmp/implementer_ws_cxo_ykg6/src/components/CatPreviewAvatar.tsx)
  - [`src/components/TraitSelector.tsx`](file:///tmp/implementer_ws_cxo_ykg6/src/components/TraitSelector.tsx)
- **Interfaces / Data Contracts**:
  - Tailwind dark classes: `dark:bg-slate-950`, `dark:bg-slate-900/90`, `dark:border-slate-800`, `dark:text-slate-100`, `dark:text-slate-300`, `dark:text-slate-400`
  - Trait Selection State Styles: Ensure active and hover borders, background fills, and text maintain clear contrast (> 4.5:1 text, > 3:1 controls) in both light and dark modes
  - Footer & Header backdrop filters and borders updated for dark mode
- **Non-Goals / Out-of-Scope**:
  - Theming of the Suggestions view, NameCards, and Favorites drawer (handled in Task 004).
  - Central theme engine and toggle button logic (handled in Tasks 001 and 002).

## 3. Acceptance Criteria
- [ ] Root application container in [`App.tsx`](file:///tmp/implementer_ws_cxo_ykg6/src/App.tsx) and footer apply dark-mode background gradients, borders, and text colors without visual clipping.
- [ ] [`Header.tsx`](file:///tmp/implementer_ws_cxo_ykg6/src/components/Header.tsx) background, borders, logo text, badge, and action buttons render with appropriate dark styling and contrast.
- [ ] Hero banner and [`CatPreviewAvatar.tsx`](file:///tmp/implementer_ws_cxo_ykg6/src/components/CatPreviewAvatar.tsx) container apply dark translucent surfaces (`dark:bg-slate-900/70`, `dark:border-slate-800`) and updated badge backgrounds.
- [ ] All four trait selector sections in [`TraitSelector.tsx`](file:///tmp/implementer_ws_cxo_ykg6/src/components/TraitSelector.tsx) (Coat Appearance, Personality Vibes, Name Themes, Gender Preference) render dark card backgrounds, legible descriptions, and distinct unselected/selected button states.
- [ ] All text-to-background contrast ratios across modified views satisfy WCAG 2.1 AA standards (minimum 4.5:1 for body/label text and 3:1 for borders/icons).
- [ ] Interactive hover, active, and focus states remain visible and distinct in both dark and light modes.

## 4. Verification Command
`npm run build`
