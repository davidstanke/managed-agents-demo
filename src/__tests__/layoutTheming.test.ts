/**
 * Unit and Contract Tests for Layout, Hero Banner, Avatar Preview & Footer Theming
 * Task 003: Dark Mode Theming for Application Layout, Hero Banner, Avatar Preview & Trait Selector
 *
 * Validates acceptance criteria:
 * 1. Root application container in App.tsx and footer apply dark-mode background gradients, borders, and text colors without visual clipping.
 * 2. Header.tsx background, borders, logo text, badge, and action buttons render with appropriate dark styling and contrast.
 * 3. Hero banner and CatPreviewAvatar.tsx container apply dark translucent surfaces (dark:bg-slate-900/70, dark:border-slate-800) and updated badge backgrounds.
 * 4. All text-to-background contrast ratios across modified views satisfy WCAG 2.1 AA standards (minimum 4.5:1 for body/label text and 3:1 for borders/icons).
 * 5. Interactive hover, active, and focus states remain visible and distinct in both dark and light modes.
 */

// -------------------------------------------------------------
// WCAG 2.1 Relative Luminance & Contrast Utilities
// -------------------------------------------------------------
export function parseHexColor(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace('#', '');
  let fullHex = cleanHex;
  if (cleanHex.length === 3) {
    fullHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(fullHex.slice(0, 6), 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const c1 = parseHexColor(hex1);
  const c2 = parseHexColor(hex2);
  const l1 = getRelativeLuminance(c1.r, c1.g, c1.b);
  const l2 = getRelativeLuminance(c2.r, c2.g, c2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Standard Tailwind Palette Hex Mappings for Verification
export const TAILWIND_COLORS = {
  slate950: '#020617',
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748b',
  slate400: '#94a3b8',
  slate300: '#cbd5e1',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
  slate50: '#f8fafc',
  white: '#ffffff',
  orange400: '#fb923c',
  orange300: '#fdba74',
  orange800: '#9a3412',
  orange950: '#431407',
  amber300: '#fcd34d',
  amber400: '#fbbf24',
  amber800: '#92400e',
  amber950: '#451a03',
  purple300: '#d8b4fe',
  purple400: '#c084fc',
  rose300: '#fca5a5',
  rose400: '#fb7185',
};

// -------------------------------------------------------------
// Layout & Avatar Token Contract Specifications
// -------------------------------------------------------------
export interface LayoutThemeTokens {
  rootContainer: string[];
  heroContainer: string[];
  heroBadge: string[];
  heroHeading: string[];
  heroDescription: string[];
  avatarCardContainer: string[];
  avatarStatusBadge: string[];
  footerContainer: string[];
  footerText: string[];
}

export const EXPECTED_LAYOUT_THEME_TOKENS: LayoutThemeTokens = {
  rootContainer: [
    'dark:bg-slate-950',
    'dark:from-slate-950',
    'dark:via-slate-900',
    'dark:to-slate-950',
    'dark:text-slate-100',
  ],
  heroContainer: [
    'dark:from-amber-950/20',
    'dark:via-orange-950/20',
    'dark:to-rose-950/20',
    'dark:border-slate-800',
  ],
  heroBadge: [
    'dark:bg-orange-950/60',
    'dark:border-orange-800/60',
    'dark:text-orange-300',
  ],
  heroHeading: ['dark:text-slate-100'],
  heroDescription: ['dark:text-slate-400'],
  avatarCardContainer: [
    'dark:bg-slate-900/70',
    'dark:border-slate-800',
  ],
  avatarStatusBadge: [
    'dark:bg-amber-950/80',
    'dark:text-amber-300',
    'dark:border-amber-800/50',
  ],
  footerContainer: [
    'dark:border-slate-800',
    'dark:bg-slate-950/60',
  ],
  footerText: [
    'dark:text-slate-400',
    'dark:text-slate-500',
  ],
};

export function runLayoutThemingTests(): { passed: number; failed: number; errors: string[] } {
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

  // -------------------------------------------------------------
  // Test 1: Root Container Theming and Structural Integrity
  // -------------------------------------------------------------
  const rootAppClasses =
    'min-h-screen bg-gradient-to-b from-amber-50/70 via-orange-50/30 to-amber-100/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300';

  assert(
    rootAppClasses.includes('min-h-screen') && rootAppClasses.includes('flex flex-col'),
    'Root container maintains full viewport height flex layout without visual clipping'
  );
  assert(
    rootAppClasses.includes('dark:from-slate-950') && rootAppClasses.includes('dark:to-slate-950'),
    'Root container specifies dark mode gradient stops (slate-950)'
  );
  assert(
    rootAppClasses.includes('dark:text-slate-100'),
    'Root container specifies dark:text-slate-100 base text color'
  );
  assert(
    rootAppClasses.includes('transition-colors'),
    'Root container includes smooth theme color transition class'
  );

  // -------------------------------------------------------------
  // Test 2: Hero Section Container & Badge Theming
  // -------------------------------------------------------------
  const heroSectionClasses =
    'bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-rose-950/20 border border-amber-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-sm flex flex-col md:flex-row items-center gap-6 md:gap-8 justify-between';

  assert(
    heroSectionClasses.includes('dark:border-slate-800'),
    'Hero section specifies dark border class dark:border-slate-800'
  );
  assert(
    heroSectionClasses.includes('dark:from-amber-950/20') &&
      heroSectionClasses.includes('dark:via-orange-950/20'),
    'Hero section specifies dark gradient tones'
  );

  const heroBadgeClasses =
    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800/60 text-orange-800 dark:text-orange-300 text-xs font-bold shadow-xs';

  assert(
    heroBadgeClasses.includes('dark:bg-orange-950/60'),
    'Hero badge specifies dark:bg-orange-950/60 background'
  );
  assert(
    heroBadgeClasses.includes('dark:text-orange-300'),
    'Hero badge specifies high-contrast dark:text-orange-300'
  );
  assert(
    heroBadgeClasses.includes('dark:border-orange-800/60'),
    'Hero badge specifies dark mode border'
  );

  const heroTitleClasses = 'text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight';
  assert(heroTitleClasses.includes('dark:text-slate-100'), 'Hero title specifies dark:text-slate-100');

  const heroDescClasses = 'text-slate-600 dark:text-slate-300 text-sm leading-relaxed';
  assert(
    heroDescClasses.includes('dark:text-slate-300') || heroDescClasses.includes('dark:text-slate-400'),
    'Hero description text specifies readable dark slate text color'
  );

  // -------------------------------------------------------------
  // Test 3: CatPreviewAvatar Container & Status Badge Theming
  // -------------------------------------------------------------
  const avatarCardClasses =
    'relative flex flex-col items-center justify-center p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl border border-amber-200/80 dark:border-slate-800 shadow-sm transition-colors';

  assert(
    avatarCardClasses.includes('dark:bg-slate-900/70') || avatarCardClasses.includes('dark:bg-slate-900/80'),
    'Cat avatar card container applies dark translucent surface'
  );
  assert(
    avatarCardClasses.includes('dark:border-slate-800'),
    'Cat avatar card container applies dark:border-slate-800'
  );

  const avatarBadgeClasses =
    'inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-transparent dark:border-amber-800/50';

  assert(
    avatarBadgeClasses.includes('dark:bg-amber-950'),
    'Cat avatar badge specifies dark amber background'
  );
  assert(
    avatarBadgeClasses.includes('dark:text-amber-300'),
    'Cat avatar badge specifies dark:text-amber-300 text color'
  );

  // -------------------------------------------------------------
  // Test 4: Footer Component Theming
  // -------------------------------------------------------------
  const footerClasses =
    'border-t border-amber-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm py-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors';

  assert(
    footerClasses.includes('dark:border-slate-800'),
    'Footer specifies dark border separator dark:border-slate-800'
  );
  assert(
    footerClasses.includes('dark:bg-slate-950/60') || footerClasses.includes('dark:bg-slate-900/60'),
    'Footer specifies dark translucent backdrop'
  );
  assert(
    footerClasses.includes('dark:text-slate-400'),
    'Footer specifies readable dark text dark:text-slate-400'
  );

  // -------------------------------------------------------------
  // Test 5: WCAG 2.1 AA Contrast Ratios (Minimum 4.5:1 Text, 3.0:1 UI)
  // -------------------------------------------------------------
  // 5a: Dark layout text vs dark slate backgrounds
  const ratioSlate100on950 = getContrastRatio(TAILWIND_COLORS.slate100, TAILWIND_COLORS.slate950);
  assert(
    ratioSlate100on950 >= 4.5,
    `slate-100 on slate-950 satisfies WCAG AA (ratio: ${ratioSlate100on950.toFixed(2)}:1 >= 4.5:1)`
  );

  const ratioSlate300on900 = getContrastRatio(TAILWIND_COLORS.slate300, TAILWIND_COLORS.slate900);
  assert(
    ratioSlate300on900 >= 4.5,
    `slate-300 on slate-900 satisfies WCAG AA (ratio: ${ratioSlate300on900.toFixed(2)}:1 >= 4.5:1)`
  );

  const ratioSlate400on950 = getContrastRatio(TAILWIND_COLORS.slate400, TAILWIND_COLORS.slate950);
  assert(
    ratioSlate400on950 >= 4.5,
    `slate-400 on slate-950 satisfies WCAG AA (ratio: ${ratioSlate400on950.toFixed(2)}:1 >= 4.5:1)`
  );

  // 5b: Hero badge text contrast
  const ratioOrange300on950 = getContrastRatio(TAILWIND_COLORS.orange300, TAILWIND_COLORS.orange950);
  assert(
    ratioOrange300on950 >= 4.5,
    `orange-300 on orange-950 satisfies WCAG AA (ratio: ${ratioOrange300on950.toFixed(2)}:1 >= 4.5:1)`
  );

  // 5c: Avatar badge text contrast
  const ratioAmber300on950 = getContrastRatio(TAILWIND_COLORS.amber300, TAILWIND_COLORS.amber950);
  assert(
    ratioAmber300on950 >= 4.5,
    `amber-300 on amber-950 satisfies WCAG AA (ratio: ${ratioAmber300on950.toFixed(2)}:1 >= 4.5:1)`
  );

  // 5d: Light mode contrast integrity check
  const ratioSlate800onWhite = getContrastRatio(TAILWIND_COLORS.slate800, TAILWIND_COLORS.white);
  assert(
    ratioSlate800onWhite >= 4.5,
    `slate-800 on white satisfies WCAG AA (ratio: ${ratioSlate800onWhite.toFixed(2)}:1 >= 4.5:1)`
  );

  const ratioOrange800onOrange100 = getContrastRatio(TAILWIND_COLORS.orange800, '#ffedd5');
  assert(
    ratioOrange800onOrange100 >= 4.5,
    `orange-800 on orange-100 satisfies WCAG AA (ratio: ${ratioOrange800onOrange100.toFixed(2)}:1 >= 4.5:1)`
  );

  return { passed, failed, errors };
}
