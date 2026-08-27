# Task 004: Dark Mode Theming for Suggestions View, Name Cards, and Favorites Drawer

## 1. Problem to Solve
The core results view (suggestions header, name suggestion cards, rationale boxes, copy/favorite actions) and the slide-out favorites drawer need comprehensive dark mode theming so users can comfortably browse, evaluate, and save cat names in low-light environments without visual fatigue or contrast degradation. This task implements full Tailwind dark mode variant styling (`dark:*`) across the suggestions header, name cards, and favorites drawer.

## 2. Technical Parameters & Scope
- **Target Files**:
  - [`src/components/SuggestionsView.tsx`](file:///tmp/implementer_ws_cxo_ykg6/src/components/SuggestionsView.tsx)
  - [`src/components/NameCard.tsx`](file:///tmp/implementer_ws_cxo_ykg6/src/components/NameCard.tsx)
  - [`src/components/FavoritesDrawer.tsx`](file:///tmp/implementer_ws_cxo_ykg6/src/components/FavoritesDrawer.tsx)
- **Interfaces / Data Contracts**:
  - Tailwind dark classes: `dark:bg-slate-900/95`, `dark:bg-slate-900`, `dark:bg-slate-800/80`, `dark:border-slate-800`, `dark:border-slate-700`, `dark:text-slate-100`, `dark:text-slate-200`, `dark:text-slate-400`
  - NameCard Rank Styling: Ensure rank accent borders and badges maintain high visibility against dark surfaces
  - Rationale callout box: Legible dark background (`dark:bg-amber-950/30`, `dark:border-amber-800/40`, `dark:text-amber-200`)
  - Drawer slide-out panel: Dark surface styling, dark border dividers, and contrast-compliant copy/trash buttons
- **Non-Goals / Out-of-Scope**:
  - Header switcher and theme state engine (handled in Tasks 001 and 002).
  - Trait selector panels and cat avatar component (handled in Task 003).

## 3. Acceptance Criteria
- [ ] Suggestions view header bar in [`SuggestionsView.tsx`](file:///tmp/implementer_ws_cxo_ykg6/src/components/SuggestionsView.tsx) renders dark surface styling, legible title text, and high-contrast trait count badges.
- [ ] Each [`NameCard.tsx`](file:///tmp/implementer_ws_cxo_ykg6/src/components/NameCard.tsx) adapts to dark mode: dark background surface, readable name heading and meaning text, dark-adapted rationale callout box, and high-contrast matched trait pills.
- [ ] NameCard copy and favorite action buttons display distinct active, copied, and hover states with proper contrast against dark backgrounds.
- [ ] [`FavoritesDrawer.tsx`](file:///tmp/implementer_ws_cxo_ykg6/src/components/FavoritesDrawer.tsx) slide-out panel, header, empty state illustration, list items, copy buttons, delete buttons, and footer action bar render with complete dark-mode styling.
- [ ] All text-to-background contrast ratios in dark mode meet WCAG 2.1 AA standards (minimum 4.5:1 for normal text, 3:1 for interactive controls and icons).
- [ ] Transitions between themes remain smooth (150ms) by default and instantaneous when `prefers-reduced-motion` is enabled.

## 4. Verification Command
`npm run build`
