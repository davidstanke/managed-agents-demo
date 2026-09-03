# Task [004]: App Layout, Trait Selector, and Suggestions Header Dark Theme Styling

## 1. Problem to Solve
The main application shell, hero banner, trait selector section (coat types, personality traits, themes, gender vibes), and suggestions view header must support dark mode styling that satisfies WCAG 2.1 AA contrast requirements (minimum 4.5:1 for body text, 3:1 for interactive borders and icons).

## 2. Technical Parameters & Scope
- **Target Files**:
  - `src/App.tsx`
  - `src/components/TraitSelector.tsx`
  - `src/components/SuggestionsView.tsx`
- **Interfaces / Data Contracts**:
  - Wire `useTheme` into `App.tsx` and pass theme properties down to `Header`.
  - Apply Tailwind `dark:...` utility classes across:
    - Root page container & footer in `App.tsx`
    - Hero section card & badge in `App.tsx`
    - Section headers, trait selector buttons, active/inactive pill badges, and category groups in `TraitSelector.tsx`
    - Suggestions section banner and reroll button in `SuggestionsView.tsx`
- **Non-Goals / Out-of-Scope**:
  - `NameCard.tsx`, `FavoritesDrawer.tsx`, and `CatPreviewAvatar.tsx` styling (handled in Task 005).

## 3. Acceptance Criteria
- [ ] Criterion 1: `App.tsx` background, hero card, and footer render dark styling (`dark:bg-slate-950`, `dark:border-slate-800`, `dark:text-slate-200`) with no low-contrast text.
- [ ] Criterion 2: In `TraitSelector.tsx`, coat appearance cards, personality tags, theme pills, and gender selectors maintain distinct active/selected states and meet 4.5:1 contrast against dark card backgrounds.
- [ ] Criterion 3: In `SuggestionsView.tsx`, the top suggestion header bar and reroll button render with dark background/border styles and clear hover/focus states.

## 4. Verification Command
`npm run build`
