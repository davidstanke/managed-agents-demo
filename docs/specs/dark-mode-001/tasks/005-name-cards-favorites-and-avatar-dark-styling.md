# Task [005]: Name Cards, Favorites Drawer, and Cat Avatar Dark Theme Styling

## 1. Problem to Solve
Name suggestion cards, the favorites slide-over drawer, and the live cat avatar preview backdrop currently use light backgrounds and borders. When dark mode is active, these elements need appropriate dark background tokens, high-contrast text for names/meanings/rationales, dark rank badges, and dark drawer backdrop/panels that comply with WCAG AA standards.

## 2. Technical Parameters & Scope
- **Target Files**:
  - `src/components/NameCard.tsx`
  - `src/components/FavoritesDrawer.tsx`
  - `src/components/CatPreviewAvatar.tsx`
- **Interfaces / Data Contracts**:
  - Apply Tailwind `dark:...` utility classes across:
    - `NameCard.tsx`: card background, rank badge container, name title, meaning text, trait tags, rationale quote box, copy button, favorite heart button.
    - `FavoritesDrawer.tsx`: backdrop overlay, drawer panel, drawer header, saved item cards, copy-all and clear-all action buttons.
    - `CatPreviewAvatar.tsx`: avatar canvas frame, background gradient, live persona indicator pill.
- **Non-Goals / Out-of-Scope**:
  - Global theme state or header controls (handled in Tasks 001 & 003).

## 3. Acceptance Criteria
- [ ] Criterion 1: `NameCard.tsx` renders in dark mode with dark card surfaces (`dark:bg-slate-900/90`, `dark:border-slate-800`), readable text (>= 4.5:1 contrast), adjusted rank badge colors, and distinct hover/active states on copy/favorite buttons.
- [ ] Criterion 2: `FavoritesDrawer.tsx` renders a dark drawer panel (`dark:bg-slate-900`), dark item cards (`dark:bg-slate-800/80`), and distinct delete/copy action buttons without white background flashes.
- [ ] Criterion 3: `CatPreviewAvatar.tsx` container and live persona badge render with dark styling while maintaining SVG cat illustration clarity and color vibrancy.

## 4. Verification Command
`npm run build`
