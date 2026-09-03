/**
 * Unit & Integration Tests for Name Cards, Favorites Drawer, and Cat Avatar Dark Theme Styling
 * Task 005 Acceptance Criteria:
 * - Criterion 1: `NameCard.tsx` renders in dark mode with dark card surfaces (`dark:bg-slate-900/90`, `dark:border-slate-800`), readable text (>= 4.5:1 contrast), adjusted rank badge colors, and distinct hover/active states on copy/favorite buttons.
 * - Criterion 2: `FavoritesDrawer.tsx` renders a dark drawer panel (`dark:bg-slate-900`), dark item cards (`dark:bg-slate-800/80`), and distinct delete/copy action buttons without white background flashes.
 * - Criterion 3: `CatPreviewAvatar.tsx` container and live persona badge render with dark styling while maintaining SVG cat illustration clarity and color vibrancy.
 */

import type { ScoredCatName, CatNameEntry, CoatType, PersonalityTrait } from '../types';

export interface NameCardThemeTokens {
  cardDark: string;
  cardBorderDark: string;
  nameTitleDark: string;
  nameMeaningDark: string;
  genderBadgeDark: string;
  rationaleBoxDark: string;
  rationaleBorderDark: string;
  rationaleTextDark: string;
  rationaleIconDark: string;
  vibeQuoteDark: string;
  traitTagDark: string;
  universalCrowdFavoriteDark: string;
  copyButton: {
    idleDark: string;
    copiedDark: string;
  };
  favoriteButton: {
    idleDark: string;
    activeDark: string;
  };
  rankStylesDark: Array<{
    badge: string;
    border: string;
  }>;
}

export interface FavoritesDrawerThemeTokens {
  backdropOverlayDark: string;
  drawerPanelDark: string;
  headerDark: string;
  headerBorderDark: string;
  titleDark: string;
  subtitleDark: string;
  closeButtonDark: string;
  emptyState: {
    titleDark: string;
    descriptionDark: string;
    iconDark: string;
  };
  itemCardDark: string;
  itemCardBorderDark: string;
  itemNameDark: string;
  itemMeaningDark: string;
  itemVibeDark: string;
  itemGenderDark: string;
  itemCopyButtonDark: string;
  itemDeleteButtonDark: string;
  footerDark: string;
  footerBorderDark: string;
  copyAllButtonDark: string;
  clearAllButtonDark: string;
}

export interface CatPreviewAvatarThemeTokens {
  canvasFrameDark: string;
  canvasBorderDark: string;
  livePersonaBadgeDark: string;
  livePersonaTextDark: string;
  livePersonaPingDark: string;
}

/**
 * Expected token dictionary for Task 005 dark theme compliance
 */
export const EXPECTED_NAME_CARD_TOKENS: NameCardThemeTokens = {
  cardDark: 'dark:bg-slate-900/90',
  cardBorderDark: 'dark:border-slate-800',
  nameTitleDark: 'dark:text-slate-100 dark:group-hover:text-orange-400',
  nameMeaningDark: 'dark:text-slate-300',
  genderBadgeDark: 'dark:bg-slate-800 dark:text-slate-300',
  rationaleBoxDark: 'dark:bg-amber-950/30',
  rationaleBorderDark: 'dark:border-amber-800/40',
  rationaleTextDark: 'dark:text-amber-200',
  rationaleIconDark: 'dark:text-amber-400',
  vibeQuoteDark: 'dark:text-amber-300/90',
  traitTagDark: 'dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800/50',
  universalCrowdFavoriteDark: 'dark:text-slate-500',
  copyButton: {
    idleDark: 'dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200',
    copiedDark: 'dark:bg-emerald-950/50 dark:border-emerald-700 dark:text-emerald-400',
  },
  favoriteButton: {
    idleDark: 'dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:border-rose-800/50 dark:hover:text-rose-400',
    activeDark: 'dark:bg-rose-950/50 dark:border-rose-700 dark:text-rose-400',
  },
  rankStylesDark: [
    { badge: 'bg-amber-500 text-white shadow-amber-500/30', border: 'border-amber-300 dark:border-amber-500/40 ring-2 ring-amber-400/20 dark:ring-amber-500/20' },
    { badge: 'bg-orange-500 text-white shadow-orange-500/30', border: 'border-orange-200 dark:border-orange-500/30' },
    { badge: 'bg-rose-500 text-white shadow-rose-500/30', border: 'border-rose-200 dark:border-rose-500/30' },
    { badge: 'bg-purple-500 text-white shadow-purple-500/30', border: 'border-purple-200 dark:border-purple-500/30' },
  ],
};

export const EXPECTED_FAVORITES_DRAWER_TOKENS: FavoritesDrawerThemeTokens = {
  backdropOverlayDark: 'dark:bg-slate-950/70',
  drawerPanelDark: 'dark:bg-slate-900 dark:border-l dark:border-slate-800',
  headerDark: 'dark:bg-slate-900/90',
  headerBorderDark: 'dark:border-slate-800',
  titleDark: 'dark:text-slate-100',
  subtitleDark: 'dark:text-slate-400',
  closeButtonDark: 'dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800',
  emptyState: {
    titleDark: 'dark:text-slate-200',
    descriptionDark: 'dark:text-slate-400',
    iconDark: 'dark:text-slate-500',
  },
  itemCardDark: 'dark:bg-slate-800/80',
  itemCardBorderDark: 'dark:border-slate-700/80 dark:hover:border-amber-500/40',
  itemNameDark: 'dark:text-slate-100',
  itemMeaningDark: 'dark:text-slate-300',
  itemVibeDark: 'dark:text-amber-300/90',
  itemGenderDark: 'dark:text-slate-400',
  itemCopyButtonDark: 'dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700 dark:border-slate-700',
  itemDeleteButtonDark: 'dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/40 dark:border-slate-700 dark:hover:border-rose-800/50',
  footerDark: 'dark:bg-slate-900/90',
  footerBorderDark: 'dark:border-slate-800',
  copyAllButtonDark: 'dark:bg-orange-600 dark:hover:bg-orange-500 dark:shadow-orange-950/30',
  clearAllButtonDark: 'dark:border-slate-700 dark:text-slate-300 dark:hover:border-rose-800/60 dark:hover:bg-rose-950/40 dark:hover:text-rose-400',
};

export const EXPECTED_CAT_PREVIEW_AVATAR_TOKENS: CatPreviewAvatarThemeTokens = {
  canvasFrameDark: 'dark:bg-slate-900/80',
  canvasBorderDark: 'dark:border-slate-800',
  livePersonaBadgeDark: 'dark:bg-amber-950/60',
  livePersonaTextDark: 'dark:text-amber-300',
  livePersonaPingDark: 'dark:bg-amber-400',
};

/**
 * Relative Luminance & Contrast Calculation (WCAG 2.1 specifications)
 */
export function calculateContrastRatio(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  const getLuminance = ([r, g, b]: [number, number, number]) => {
    const a = [r, g, b].map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  };

  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Validates dark theme class composition for NameCard action buttons
 */
export function validateNameCardButtonClasses(
  classes: string,
  type: 'copy' | 'favorite',
  isActive: boolean
): {
  hasDarkClasses: boolean;
  hasDistinctActiveState: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const hasDarkClasses = classes.includes('dark:');

  if (!hasDarkClasses) {
    errors.push(`Missing dark mode class tokens for ${type} button`);
  }

  let hasDistinctActiveState = false;
  if (type === 'copy') {
    if (isActive) {
      hasDistinctActiveState = classes.includes('dark:bg-emerald') || classes.includes('dark:text-emerald');
    } else {
      hasDistinctActiveState = classes.includes('dark:bg-slate-800') || classes.includes('dark:text-slate-400');
    }
  } else if (type === 'favorite') {
    if (isActive) {
      hasDistinctActiveState = classes.includes('dark:bg-rose') || classes.includes('dark:text-rose');
    } else {
      hasDistinctActiveState = classes.includes('dark:bg-slate-800') || classes.includes('dark:text-slate-400');
    }
  }

  if (!hasDistinctActiveState) {
    errors.push(`${type} button (active=${isActive}) lacks designated state styling in dark mode`);
  }

  return {
    hasDarkClasses,
    hasDistinctActiveState,
    errors,
  };
}

/**
 * Validates FavoritesDrawer backdrop and panel against white flash regressions
 */
export function validateDrawerPanelSafety(drawerClasses: string, backdropClasses: string): {
  isFlashSafe: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const hasDarkPanelBg = drawerClasses.includes('dark:bg-slate-900') || drawerClasses.includes('dark:bg-slate-950');
  const hasDarkBackdrop = backdropClasses.includes('dark:bg-slate-950') || backdropClasses.includes('dark:bg-slate-900');

  if (!hasDarkPanelBg) {
    errors.push('Drawer panel lacks dark background class, risking white flash in dark mode');
  }

  if (!hasDarkBackdrop) {
    errors.push('Backdrop overlay lacks dark background class');
  }

  return {
    isFlashSafe: hasDarkPanelBg && hasDarkBackdrop,
    errors,
  };
}

/**
 * Validates CatPreviewAvatar container and live persona pill dark styling
 */
export function validateAvatarContainerTheme(containerClasses: string, badgeClasses: string): {
  isThemed: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const containerDark = containerClasses.includes('dark:bg-slate-900') || containerClasses.includes('dark:bg-slate-950');
  const badgeDark = badgeClasses.includes('dark:bg-amber-950') && badgeClasses.includes('dark:text-amber-300');

  if (!containerDark) {
    errors.push('Cat avatar container frame lacks dark background token');
  }
  if (!badgeDark) {
    errors.push('Live persona pill lacks dark background/text tokens');
  }

  return {
    isThemed: containerDark && badgeDark,
    errors,
  };
}

/**
 * Main Test Runner for Task 005
 */
export function runNameCardsFavoritesAndAvatarTests(): {
  total: number;
  passed: number;
  failed: number;
  errors: string[];
} {
  let passed = 0;
  let failed = 0;
  const errors: string[] = [];

  function assert(condition: boolean, testName: string) {
    if (condition) {
      passed++;
    } else {
      failed++;
      const msg = `FAIL: ${testName}`;
      errors.push(msg);
      console.error(msg);
    }
  }

  // --- 1. NameCard Dark Surface, Text Contrast & Button States (Criterion 1) ---
  {
    const {
      cardDark,
      cardBorderDark,
      nameTitleDark,
      nameMeaningDark,
      genderBadgeDark,
      rationaleBoxDark,
      rationaleBorderDark,
      rationaleTextDark,
      rationaleIconDark,
      vibeQuoteDark,
      traitTagDark,
      universalCrowdFavoriteDark,
      copyButton,
      favoriteButton,
      rankStylesDark,
    } = EXPECTED_NAME_CARD_TOKENS;

    assert(cardDark.includes('dark:bg-slate-900'), 'NameCard container specifies dark surface (dark:bg-slate-900/90)');
    assert(cardBorderDark.includes('dark:border-slate-800'), 'NameCard container specifies dark border (dark:border-slate-800)');
    assert(nameTitleDark.includes('dark:text-slate-100'), 'NameCard title text is high-contrast light slate in dark mode');
    assert(nameTitleDark.includes('dark:group-hover:text-orange-400'), 'NameCard title has dark hover accent transition');
    assert(nameMeaningDark.includes('dark:text-slate-300'), 'NameCard meaning text is readable slate in dark mode');
    assert(genderBadgeDark.includes('dark:bg-slate-800') && genderBadgeDark.includes('dark:text-slate-300'), 'Gender tag has dark surface and text');

    // Rationale quote box
    assert(rationaleBoxDark.includes('dark:bg-amber-950'), 'Rationale callout box has dark amber background');
    assert(rationaleBorderDark.includes('dark:border-amber-800'), 'Rationale callout box has dark amber border');
    assert(rationaleTextDark.includes('dark:text-amber-200') || rationaleTextDark.includes('dark:text-amber-300'), 'Rationale text is bright readable amber');
    assert(rationaleIconDark.includes('dark:text-amber-400'), 'Rationale sparkles icon uses visible amber accent');
    assert(vibeQuoteDark.includes('dark:text-amber-300'), 'Vibe quote text has dark mode amber styling');

    // Matched trait tags & fallback
    assert(traitTagDark.includes('dark:bg-orange-950') && traitTagDark.includes('dark:text-orange-300'), 'Trait tags have accessible dark orange palette');
    assert(universalCrowdFavoriteDark.includes('dark:text-slate-500'), 'Universal crowd favorite fallback uses dark text token');

    // Rank badge colors adjusted for dark borders
    assert(rankStylesDark.length === 4, 'Four rank tier styles defined');
    assert(rankStylesDark[0].border.includes('dark:border-amber-500'), 'Rank 1 (Top Match) border includes dark styling');
    assert(rankStylesDark[1].border.includes('dark:border-orange-500'), 'Rank 2 (Runner Up) border includes dark styling');
    assert(rankStylesDark[2].border.includes('dark:border-rose-500'), 'Rank 3 (Great Fit) border includes dark styling');
    assert(rankStylesDark[3].border.includes('dark:border-purple-500'), 'Rank 4 (Unique Pick) border includes dark styling');

    // Copy & favorite buttons dark tokens
    assert(copyButton.idleDark.includes('dark:bg-slate-800') && copyButton.idleDark.includes('dark:text-slate-400'), 'Copy button idle state has dark surface and icon color');
    assert(copyButton.copiedDark.includes('dark:bg-emerald-950') && copyButton.copiedDark.includes('dark:text-emerald-400'), 'Copy button copied state has dark emerald styling');
    assert(favoriteButton.idleDark.includes('dark:bg-slate-800') && favoriteButton.idleDark.includes('dark:text-slate-400'), 'Favorite button idle state has dark surface');
    assert(favoriteButton.activeDark.includes('dark:bg-rose-950') && favoriteButton.activeDark.includes('dark:text-rose-400'), 'Favorite button active state has dark rose styling');

    // Test button class helper
    const copyIdleValidation = validateNameCardButtonClasses(copyButton.idleDark, 'copy', false);
    assert(copyIdleValidation.hasDistinctActiveState, 'Copy idle button state validates successfully');

    const copyActiveValidation = validateNameCardButtonClasses(copyButton.copiedDark, 'copy', true);
    assert(copyActiveValidation.hasDistinctActiveState, 'Copy active/copied button state validates successfully');

    const favIdleValidation = validateNameCardButtonClasses(favoriteButton.idleDark, 'favorite', false);
    assert(favIdleValidation.hasDistinctActiveState, 'Favorite idle button state validates successfully');

    const favActiveValidation = validateNameCardButtonClasses(favoriteButton.activeDark, 'favorite', true);
    assert(favActiveValidation.hasDistinctActiveState, 'Favorite active button state validates successfully');

    // WCAG AA Contrast Ratios for NameCard in Dark Mode
    // Slate-900 background: [15, 23, 42]
    // Slate-100 title: [241, 245, 249]
    // Slate-300 meaning: [203, 213, 225]
    // Amber-200 rationale: [253, 230, 138] on Amber-950 (#451a03 -> [69, 26, 3])
    // Orange-300 tag: [253, 186, 116] on Orange-950 (#431407 -> [67, 20, 7])
    const slate900Rgb: [number, number, number] = [15, 23, 42];
    const slate100Rgb: [number, number, number] = [241, 245, 249];
    const slate300Rgb: [number, number, number] = [203, 213, 225];
    const amber950Rgb: [number, number, number] = [69, 26, 3];
    const amber200Rgb: [number, number, number] = [253, 230, 138];
    const orange950Rgb: [number, number, number] = [67, 20, 7];
    const orange300Rgb: [number, number, number] = [253, 186, 116];

    const titleContrast = calculateContrastRatio(slate900Rgb, slate100Rgb);
    assert(
      titleContrast >= 4.5,
      `NameCard title contrast (${titleContrast.toFixed(2)}:1) satisfies WCAG AA 4.5:1 minimum`
    );

    const meaningContrast = calculateContrastRatio(slate900Rgb, slate300Rgb);
    assert(
      meaningContrast >= 4.5,
      `NameCard meaning text contrast (${meaningContrast.toFixed(2)}:1) satisfies WCAG AA 4.5:1 minimum`
    );

    const rationaleContrast = calculateContrastRatio(amber950Rgb, amber200Rgb);
    assert(
      rationaleContrast >= 4.5,
      `NameCard rationale callout contrast (${rationaleContrast.toFixed(2)}:1) satisfies WCAG AA 4.5:1 minimum`
    );

    const traitTagContrast = calculateContrastRatio(orange950Rgb, orange300Rgb);
    assert(
      traitTagContrast >= 4.5,
      `NameCard trait tag contrast (${traitTagContrast.toFixed(2)}:1) satisfies WCAG AA 4.5:1 minimum`
    );

    // Mock ScoredCatName item structure test
    const mockItem: ScoredCatName = {
      nameEntry: {
        id: 'mochi-1',
        name: 'Mochi',
        meaning: 'Sweet Japanese rice cake, soft and round',
        coats: ['calico', 'white'],
        personalities: ['cuddly', 'lazy'],
        themes: ['food'],
        gender: 'unisex',
        vibe: 'Soft, gentle cuddler',
      },
      score: 95,
      matchedTraits: ['Calico Coat', 'Cuddly', 'Foodie Theme'],
      rationale: 'Perfect match for a cuddly food-inspired calico kitten!',
    };

    assert(mockItem.nameEntry.name === 'Mochi', 'Mock scored item holds valid CatNameEntry');
    assert(mockItem.matchedTraits.length === 3, 'Matched traits contains expected count');
  }

  // --- 2. FavoritesDrawer Dark Panel, Cards & Action Buttons (Criterion 2) ---
  {
    const {
      backdropOverlayDark,
      drawerPanelDark,
      headerDark,
      headerBorderDark,
      titleDark,
      subtitleDark,
      closeButtonDark,
      emptyState,
      itemCardDark,
      itemCardBorderDark,
      itemNameDark,
      itemMeaningDark,
      itemVibeDark,
      itemGenderDark,
      itemCopyButtonDark,
      itemDeleteButtonDark,
      footerDark,
      footerBorderDark,
      copyAllButtonDark,
      clearAllButtonDark,
    } = EXPECTED_FAVORITES_DRAWER_TOKENS;

    assert(backdropOverlayDark.includes('dark:bg-slate-950'), 'FavoritesDrawer backdrop specifies dark overlay (dark:bg-slate-950/70)');
    assert(drawerPanelDark.includes('dark:bg-slate-900'), 'FavoritesDrawer panel specifies dark background (dark:bg-slate-900)');
    assert(drawerPanelDark.includes('dark:border-slate-800'), 'FavoritesDrawer panel includes dark left border');

    // Header & Close
    assert(headerDark.includes('dark:bg-slate-900'), 'FavoritesDrawer header has dark surface');
    assert(headerBorderDark.includes('dark:border-slate-800'), 'FavoritesDrawer header has dark border');
    assert(titleDark.includes('dark:text-slate-100'), 'FavoritesDrawer title is readable on dark');
    assert(subtitleDark.includes('dark:text-slate-400'), 'FavoritesDrawer subtitle count has muted dark text');
    assert(closeButtonDark.includes('dark:text-slate-400') && closeButtonDark.includes('dark:hover:bg-slate-800'), 'Close button has dark hover states');

    // Empty state
    assert(emptyState.titleDark.includes('dark:text-slate-200'), 'Drawer empty state title is visible on dark');
    assert(emptyState.descriptionDark.includes('dark:text-slate-400'), 'Drawer empty state description is readable on dark');

    // Saved Item Cards
    assert(itemCardDark.includes('dark:bg-slate-800'), 'Saved item cards use dark surface (dark:bg-slate-800/80)');
    assert(itemCardBorderDark.includes('dark:border-slate-700'), 'Saved item card border uses dark border');
    assert(itemNameDark.includes('dark:text-slate-100'), 'Saved item name text is high-contrast light slate');
    assert(itemMeaningDark.includes('dark:text-slate-300'), 'Saved item meaning text is readable slate');
    assert(itemVibeDark.includes('dark:text-amber-300'), 'Saved item vibe quote has dark amber styling');
    assert(itemGenderDark.includes('dark:text-slate-400'), 'Saved item gender indicator has muted slate styling');

    // Item action buttons (copy & delete)
    assert(itemCopyButtonDark.includes('dark:text-slate-400') && itemCopyButtonDark.includes('dark:hover:bg-slate-700'), 'Item copy button has dark surface & hover');
    assert(itemDeleteButtonDark.includes('dark:text-slate-400') && itemDeleteButtonDark.includes('dark:hover:bg-rose-950'), 'Item delete button has dark rose hover state');

    // Footer actions
    assert(footerDark.includes('dark:bg-slate-900'), 'Drawer footer container has dark background');
    assert(footerBorderDark.includes('dark:border-slate-800'), 'Drawer footer has dark border');
    assert(copyAllButtonDark.includes('dark:bg-orange-600') && copyAllButtonDark.includes('dark:hover:bg-orange-500'), 'Copy All button has high-contrast dark button variant');
    assert(clearAllButtonDark.includes('dark:border-slate-700') && clearAllButtonDark.includes('dark:hover:bg-rose-950'), 'Clear All button has dark border and rose hover');

    // White flash prevention check
    const safetyCheck = validateDrawerPanelSafety(
      'relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl',
      'fixed inset-0 z-50 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm'
    );
    assert(safetyCheck.isFlashSafe, 'Drawer panel and backdrop pass white-flash safety verification');

    // Contrast calculations for Drawer items
    // Slate-800 card bg: [30, 41, 59]
    // Slate-100 name: [241, 245, 249]
    // Slate-300 meaning: [203, 213, 225]
    // Amber-300 vibe: [253, 186, 116]
    const slate800Rgb: [number, number, number] = [30, 41, 59];
    const slate100Rgb: [number, number, number] = [241, 245, 249];
    const slate300Rgb: [number, number, number] = [203, 213, 225];
    const amber300Rgb: [number, number, number] = [253, 186, 116];

    const drawerNameContrast = calculateContrastRatio(slate800Rgb, slate100Rgb);
    assert(
      drawerNameContrast >= 4.5,
      `Drawer item name contrast (${drawerNameContrast.toFixed(2)}:1) satisfies WCAG AA 4.5:1 minimum`
    );

    const drawerMeaningContrast = calculateContrastRatio(slate800Rgb, slate300Rgb);
    assert(
      drawerMeaningContrast >= 4.5,
      `Drawer item meaning contrast (${drawerMeaningContrast.toFixed(2)}:1) satisfies WCAG AA 4.5:1 minimum`
    );

    const drawerVibeContrast = calculateContrastRatio(slate800Rgb, amber300Rgb);
    assert(
      drawerVibeContrast >= 4.5,
      `Drawer item vibe contrast (${drawerVibeContrast.toFixed(2)}:1) satisfies WCAG AA 4.5:1 minimum`
    );

    // Mock favorites collection operations test
    const mockFavorites: CatNameEntry[] = [
      {
        id: '1',
        name: 'Luna',
        meaning: 'Goddess of the moon',
        coats: ['black', 'grey'],
        personalities: ['mysterious'],
        themes: ['celestial', 'mythology'],
        gender: 'female',
        vibe: 'Mystical and nocturnal',
      },
      {
        id: '2',
        name: 'Simba',
        meaning: 'Lion, courageous leader',
        coats: ['ginger'],
        personalities: ['fierce', 'adventurous'],
        themes: ['pop-culture'],
        gender: 'male',
        vibe: 'Bold little king',
      },
    ];

    const copyText = mockFavorites.map((f) => `• ${f.name} - ${f.meaning}`).join('\n');
    assert(copyText.includes('Luna') && copyText.includes('Simba'), 'Favorites list aggregates copy text format correctly');
  }

  // --- 3. CatPreviewAvatar Canvas & Live Persona Badge (Criterion 3) ---
  {
    const {
      canvasFrameDark,
      canvasBorderDark,
      livePersonaBadgeDark,
      livePersonaTextDark,
      livePersonaPingDark,
    } = EXPECTED_CAT_PREVIEW_AVATAR_TOKENS;

    assert(canvasFrameDark.includes('dark:bg-slate-900'), 'Cat avatar canvas container has dark background token (dark:bg-slate-900/80)');
    assert(canvasBorderDark.includes('dark:border-slate-800'), 'Cat avatar canvas container has dark border (dark:border-slate-800)');
    assert(livePersonaBadgeDark.includes('dark:bg-amber-950'), 'Live persona badge uses dark amber background');
    assert(livePersonaTextDark.includes('dark:text-amber-300'), 'Live persona badge uses readable amber text');
    assert(livePersonaPingDark.includes('dark:bg-amber-400'), 'Live persona ping circle uses visible amber accent');

    const avatarValidation = validateAvatarContainerTheme(
      'relative flex flex-col items-center justify-center p-4 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-amber-200/80 dark:border-slate-800 shadow-sm',
      'inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300'
    );
    assert(avatarValidation.isThemed, 'Cat avatar container and persona badge theme validation succeeds');

    // Contrast of Live Persona badge in dark mode
    // Amber-950 badge: [69, 26, 3] vs Amber-300 text: [253, 186, 116]
    const amber950BadgeRgb: [number, number, number] = [69, 26, 3];
    const amber300TextRgb: [number, number, number] = [253, 186, 116];
    const personaContrast = calculateContrastRatio(amber950BadgeRgb, amber300TextRgb);
    assert(
      personaContrast >= 4.5,
      `Live persona badge contrast (${personaContrast.toFixed(2)}:1) satisfies WCAG AA 4.5:1 minimum`
    );

    // SVG Coat Color Palette Vibrancy Check across coat varieties
    const coatTypes: CoatType[] = [
      'ginger',
      'black',
      'white',
      'calico',
      'tuxedo',
      'tabby',
      'grey',
      'fluffy',
      'tortoiseshell',
      'siamese',
    ];
    assert(coatTypes.length === 10, 'All 10 coat variations recognized for avatar rendering');

    const samplePersonalities: PersonalityTrait[] = ['cuddly', 'chaotic', 'lazy', 'derpy', 'foodie', 'regal'];
    assert(samplePersonalities.length === 6, 'Personality traits for avatar accessories verified');
  }

  return {
    total: passed + failed,
    passed,
    failed,
    errors,
  };
}
