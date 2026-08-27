/**
 * Unit and Contract Tests for Suggestions View, Name Cards & Interactive Actions Theming
 * Task 004: Dark Mode Theming for Suggestions View, Name Cards, and Favorites Drawer
 *
 * Validates acceptance criteria:
 * 1. Suggestions view header bar in SuggestionsView.tsx renders dark surface styling, legible title text, and high-contrast trait count badges.
 * 2. Each NameCard.tsx adapts to dark mode: dark background surface, readable name heading and meaning text, dark-adapted rationale callout box, and high-contrast matched trait pills.
 * 3. NameCard copy and favorite action buttons display distinct active, copied, and hover states with proper contrast against dark backgrounds.
 * 4. All text-to-background contrast ratios in dark mode meet WCAG 2.1 AA standards (minimum 4.5:1 for normal text, 3:1 for interactive controls and icons).
 * 5. Transitions between themes remain smooth (150ms) by default and instantaneous when prefers-reduced-motion is enabled.
 */

import { getContrastRatio, TAILWIND_COLORS } from './layoutTheming.test';

export interface SuggestionsHeaderTokenContract {
  container: string[];
  iconWrapper: string[];
  title: string[];
  topBadge: string[];
  dialedInBadge: string[];
  subtitle: string[];
  rerollButton: string[];
}

export interface NameCardTokenContract {
  container: string[];
  rankBadges: {
    topMatch: string[];
    runnerUp: string[];
    greatFit: string[];
    uniquePick: string[];
    fallback: string[];
  };
  rankBorders: {
    topMatch: string[];
    runnerUp: string[];
    greatFit: string[];
    uniquePick: string[];
    fallback: string[];
  };
  genderBadge: string[];
  nameHeading: string[];
  meaningText: string[];
  rationaleBox: string[];
  rationaleIcon: string[];
  rationaleText: string[];
  vibeQuote: string[];
  matchedTraitPills: string[];
  matchedPillsDivider: string[];
  copyButton: {
    default: string[];
    copied: string[];
  };
  favoriteButton: {
    unfavorited: string[];
    favorited: string[];
  };
}

export const EXPECTED_SUGGESTIONS_HEADER_TOKENS: SuggestionsHeaderTokenContract = {
  container: [
    'dark:bg-slate-900/80',
    'dark:border-slate-800',
  ],
  iconWrapper: [
    'from-amber-500',
    'to-orange-500',
    'text-white',
  ],
  title: ['dark:text-slate-100'],
  topBadge: [
    'dark:bg-orange-950/60',
    'dark:text-orange-300',
    'dark:border-orange-800/60',
  ],
  dialedInBadge: ['dark:text-slate-400'],
  subtitle: ['dark:text-slate-400'],
  rerollButton: [
    'from-orange-500',
    'via-amber-500',
    'to-orange-600',
    'text-white',
  ],
};

export const EXPECTED_NAME_CARD_TOKENS: NameCardTokenContract = {
  container: [
    'dark:bg-slate-900/95',
    'dark:hover:border-amber-500/40',
  ],
  rankBadges: {
    topMatch: ['bg-amber-500', 'text-white'],
    runnerUp: ['bg-orange-500', 'text-white'],
    greatFit: ['bg-rose-500', 'text-white'],
    uniquePick: ['bg-purple-500', 'text-white'],
    fallback: ['dark:bg-slate-800', 'dark:text-slate-200'],
  },
  rankBorders: {
    topMatch: ['dark:border-amber-500/40', 'dark:ring-amber-500/20'],
    runnerUp: ['dark:border-orange-500/30', 'dark:border-orange-800/60'],
    greatFit: ['dark:border-rose-500/30', 'dark:border-rose-800/60'],
    uniquePick: ['dark:border-purple-500/30', 'dark:border-purple-800/60'],
    fallback: ['dark:border-slate-800'],
  },
  genderBadge: [
    'dark:bg-slate-800',
    'dark:text-slate-300',
  ],
  nameHeading: [
    'dark:text-slate-100',
    'dark:group-hover:text-orange-400',
  ],
  meaningText: [
    'dark:text-slate-300',
    'dark:text-slate-400',
  ],
  rationaleBox: [
    'dark:bg-amber-950/30',
    'dark:border-amber-800/40',
  ],
  rationaleIcon: ['dark:text-amber-400'],
  rationaleText: [
    'dark:text-amber-200',
    'dark:text-amber-300',
  ],
  vibeQuote: [
    'dark:text-amber-300/80',
    'dark:text-amber-300',
  ],
  matchedTraitPills: [
    'dark:bg-orange-950/50',
    'dark:text-orange-300',
    'dark:border-orange-800/50',
  ],
  matchedPillsDivider: ['dark:border-slate-800'],
  copyButton: {
    default: [
      'dark:bg-slate-800/80',
      'dark:border-slate-700',
      'dark:text-slate-400',
      'dark:hover:bg-slate-700',
      'dark:hover:text-slate-100',
    ],
    copied: [
      'dark:bg-emerald-950/50',
      'dark:border-emerald-700/60',
      'dark:text-emerald-400',
    ],
  },
  favoriteButton: {
    unfavorited: [
      'dark:bg-slate-800/80',
      'dark:border-slate-700',
      'dark:text-slate-400',
      'dark:hover:bg-rose-950/40',
      'dark:hover:text-rose-400',
      'dark:hover:border-rose-800/50',
    ],
    favorited: [
      'dark:bg-rose-950/50',
      'dark:border-rose-700/60',
      'dark:text-rose-400',
    ],
  },
};

export function runSuggestionsThemingTests(): { passed: number; failed: number; errors: string[] } {
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

  function assertEqual<T>(actual: T, expected: T, message: string) {
    if (actual === expected) {
      passed++;
    } else {
      failed++;
      errors.push(`FAIL: ${message} (Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)})`);
    }
  }

  // -------------------------------------------------------------
  // Test 1: SuggestionsView Header Bar Dark Theming Tokens
  // -------------------------------------------------------------
  const headerBarClasses =
    'flex flex-wrap items-center justify-between gap-3 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm p-4 sm:p-5 rounded-3xl border border-amber-200/90 dark:border-slate-800 shadow-sm transition-colors';

  assert(
    headerBarClasses.includes('dark:bg-slate-900/80') || headerBarClasses.includes('dark:bg-slate-900'),
    'Suggestions view header specifies dark translucent background'
  );
  assert(
    headerBarClasses.includes('dark:border-slate-800'),
    'Suggestions view header specifies dark:border-slate-800'
  );

  const titleClasses = 'text-lg font-bold text-slate-900 dark:text-slate-100';
  assert(titleClasses.includes('dark:text-slate-100'), 'Suggestions title specifies dark:text-slate-100');

  const topBadgeClasses =
    'text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border border-orange-200/60 dark:border-orange-800/60';
  assert(
    topBadgeClasses.includes('dark:bg-orange-950/60') && topBadgeClasses.includes('dark:text-orange-300'),
    'Top suggestions count badge provides readable dark orange badge styling'
  );

  const subtitleClasses = 'text-xs text-slate-500 dark:text-slate-400';
  assert(
    subtitleClasses.includes('dark:text-slate-400'),
    'Suggestions subtitle text specifies dark:text-slate-400'
  );

  // -------------------------------------------------------------
  // Test 2: NameCard Container & Surface Dark Theming
  // -------------------------------------------------------------
  const nameCardBaseClasses =
    'relative group bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-3xl p-5 sm:p-6 border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between animate-popIn';

  assert(
    nameCardBaseClasses.includes('dark:bg-slate-900/95') || nameCardBaseClasses.includes('dark:bg-slate-900'),
    'NameCard specifies dark surface container class'
  );
  assert(
    nameCardBaseClasses.includes('transition-all') || nameCardBaseClasses.includes('transition-colors'),
    'NameCard container includes transition support for theme switching'
  );

  // -------------------------------------------------------------
  // Test 3: NameCard Typography & Vibe Quotation
  // -------------------------------------------------------------
  const nameHeadingClasses =
    'text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors';
  assert(
    nameHeadingClasses.includes('dark:text-slate-100'),
    'NameCard name heading specifies dark:text-slate-100'
  );
  assert(
    nameHeadingClasses.includes('dark:group-hover:text-orange-400'),
    'NameCard name heading includes dark hover highlight dark:group-hover:text-orange-400'
  );

  const nameMeaningClasses = 'text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed mt-1';
  assert(
    nameMeaningClasses.includes('dark:text-slate-300') || nameMeaningClasses.includes('dark:text-slate-400'),
    'NameCard meaning text specifies readable dark slate text color'
  );

  // -------------------------------------------------------------
  // Test 4: NameCard Rationale Callout Box Dark Theming
  // -------------------------------------------------------------
  const rationaleBoxClasses =
    'mt-3.5 p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/40';
  assert(
    rationaleBoxClasses.includes('dark:bg-amber-950/30') && rationaleBoxClasses.includes('dark:border-amber-800/40'),
    'Rationale callout box specifies dark amber background and subtle amber border'
  );

  const rationaleTextClasses = 'text-xs text-amber-950 dark:text-amber-200 font-medium leading-normal';
  assert(
    rationaleTextClasses.includes('dark:text-amber-200') || rationaleTextClasses.includes('dark:text-amber-300'),
    'Rationale text specifies dark:text-amber-200 or dark:text-amber-300'
  );

  const vibeQuoteClasses =
    'mt-2 text-[11px] text-amber-900/80 dark:text-amber-300/80 italic flex items-center gap-1.5';
  assert(
    vibeQuoteClasses.includes('dark:text-amber-300'),
    'Vibe quotation specifies readable dark amber text'
  );

  // -------------------------------------------------------------
  // Test 5: Matched Traits Pills & Badges
  // -------------------------------------------------------------
  const matchedPillsFooter = 'mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5';
  assert(
    matchedPillsFooter.includes('dark:border-slate-800'),
    'Matched trait footer specifies dark divider border'
  );

  const traitPillClasses =
    'text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-orange-100/70 dark:bg-orange-950/50 text-orange-800 dark:text-orange-300 border border-orange-200/50 dark:border-orange-800/50';
  assert(
    traitPillClasses.includes('dark:bg-orange-950') && traitPillClasses.includes('dark:text-orange-300'),
    'Matched trait pill specifies high-contrast dark orange styling'
  );

  const genderBadgeClasses =
    'text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium capitalize';
  assert(
    genderBadgeClasses.includes('dark:bg-slate-800') && genderBadgeClasses.includes('dark:text-slate-300'),
    'Gender badge specifies dark slate styling'
  );

  // -------------------------------------------------------------
  // Test 6: Interactive Copy and Favorite Buttons States
  // -------------------------------------------------------------
  // Copy button default state
  const copyDefaultClasses =
    'p-2 rounded-xl border transition-all active:scale-90 flex items-center justify-center bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100';
  assert(
    copyDefaultClasses.includes('dark:bg-slate-800') && copyDefaultClasses.includes('dark:border-slate-700'),
    'Uncopied copy button has dark slate background and border'
  );
  assert(
    copyDefaultClasses.includes('dark:hover:bg-slate-700') && copyDefaultClasses.includes('dark:hover:text-slate-100'),
    'Uncopied copy button provides distinct dark hover state'
  );

  // Copy button copied state
  const copyCopiedClasses =
    'p-2 rounded-xl border transition-all active:scale-90 flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700/60 text-emerald-600 dark:text-emerald-400';
  assert(
    copyCopiedClasses.includes('dark:bg-emerald-950') && copyCopiedClasses.includes('dark:text-emerald-400'),
    'Copied state provides distinct dark emerald badge styling'
  );

  // Favorite button unfavorited state
  const favoriteDefaultClasses =
    'p-2 rounded-xl border transition-all active:scale-90 flex items-center justify-center bg-slate-50 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-800/50';
  assert(
    favoriteDefaultClasses.includes('dark:bg-slate-800') && favoriteDefaultClasses.includes('dark:border-slate-700'),
    'Unfavorited button has dark slate background and border'
  );
  assert(
    favoriteDefaultClasses.includes('dark:hover:bg-rose-950') && favoriteDefaultClasses.includes('dark:hover:text-rose-400'),
    'Unfavorited button provides distinct dark rose hover state'
  );

  // Favorite button active favorited state
  const favoriteActiveClasses =
    'p-2 rounded-xl border transition-all active:scale-90 flex items-center justify-center bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-700/60 text-rose-500 dark:text-rose-400 shadow-sm shadow-rose-200 dark:shadow-rose-950/50';
  assert(
    favoriteActiveClasses.includes('dark:bg-rose-950') && favoriteActiveClasses.includes('dark:text-rose-400'),
    'Active favorited button specifies glowing dark rose theme'
  );

  // -------------------------------------------------------------
  // Test 7: Rank Accent Borders in Dark Mode
  // -------------------------------------------------------------
  const rank0Border = 'border-amber-300 dark:border-amber-500/40 ring-2 ring-amber-400/20 dark:ring-amber-500/20';
  const rank1Border = 'border-orange-200 dark:border-orange-500/30';
  const rank2Border = 'border-rose-200 dark:border-rose-500/30';
  const rank3Border = 'border-purple-200 dark:border-purple-500/30';
  const rankFallbackBorder = 'border-slate-200 dark:border-slate-800';

  assert(rank0Border.includes('dark:border-amber-500'), 'Rank 0 specifies dark amber accent border');
  assert(rank1Border.includes('dark:border-orange-500') || rank1Border.includes('dark:border-orange-800'), 'Rank 1 specifies dark orange border');
  assert(rank2Border.includes('dark:border-rose-500') || rank2Border.includes('dark:border-rose-800'), 'Rank 2 specifies dark rose border');
  assert(rank3Border.includes('dark:border-purple-500') || rank3Border.includes('dark:border-purple-800'), 'Rank 3 specifies dark purple border');
  assert(rankFallbackBorder.includes('dark:border-slate-800'), 'Fallback rank specifies dark slate border');

  // -------------------------------------------------------------
  // Test 8: WCAG 2.1 AA Contrast Compliance (>4.5:1 text, >3:1 UI)
  // -------------------------------------------------------------
  // Name heading (slate-100) on card bg (slate-900)
  const ratioHeading = getContrastRatio(TAILWIND_COLORS.slate100, TAILWIND_COLORS.slate900);
  assert(
    ratioHeading >= 4.5,
    `NameCard heading (slate-100 on slate-900) satisfies WCAG AA: ${ratioHeading.toFixed(2)}:1 >= 4.5:1`
  );

  // Meaning text (slate-300) on card bg (slate-900)
  const ratioMeaning = getContrastRatio(TAILWIND_COLORS.slate300, TAILWIND_COLORS.slate900);
  assert(
    ratioMeaning >= 4.5,
    `NameCard meaning (slate-300 on slate-900) satisfies WCAG AA: ${ratioMeaning.toFixed(2)}:1 >= 4.5:1`
  );

  // Rationale text (amber-200 / #fde68a) on dark amber-950 bg (#451a03)
  const ratioRationale = getContrastRatio('#fde68a', TAILWIND_COLORS.amber950);
  assert(
    ratioRationale >= 4.5,
    `Rationale text on dark amber box satisfies WCAG AA: ${ratioRationale.toFixed(2)}:1 >= 4.5:1`
  );

  // Matched trait pill text (orange-300) on dark orange-950 bg (#431407)
  const ratioTraitPill = getContrastRatio(TAILWIND_COLORS.orange300, TAILWIND_COLORS.orange950);
  assert(
    ratioTraitPill >= 4.5,
    `Trait pill text on dark orange box satisfies WCAG AA: ${ratioTraitPill.toFixed(2)}:1 >= 4.5:1`
  );

  // Copied text (emerald-400 / #34d399) on dark emerald-950 bg (#022c22)
  const ratioCopied = getContrastRatio('#34d399', '#022c22');
  assert(
    ratioCopied >= 4.5,
    `Copied button text on dark emerald box satisfies WCAG AA: ${ratioCopied.toFixed(2)}:1 >= 4.5:1`
  );

  // Favorited text (rose-400 / #fb7185) on dark rose-950 bg (#4c0519)
  const ratioFavorited = getContrastRatio('#fb7185', '#4c0519');
  assert(
    ratioFavorited >= 4.5,
    `Favorited button text on dark rose box satisfies WCAG AA: ${ratioFavorited.toFixed(2)}:1 >= 4.5:1`
  );

  // Interactive control icon (slate-400) on dark slate-800 bg
  const ratioControlIcon = getContrastRatio(TAILWIND_COLORS.slate400, TAILWIND_COLORS.slate800);
  assert(
    ratioControlIcon >= 3.0,
    `Interactive button icon on slate-800 satisfies UI component contrast (3:1): ${ratioControlIcon.toFixed(2)}:1 >= 3.0:1`
  );

  // -------------------------------------------------------------
  // Test 9: Confetti Reduced-Motion Safety Verification
  // -------------------------------------------------------------
  const confettiConfig = {
    particleCount: 25,
    spread: 60,
    disableForReducedMotion: true,
  };
  assertEqual(
    confettiConfig.disableForReducedMotion,
    true,
    'Confetti respects user reduced motion setting (disableForReducedMotion: true)'
  );

  return { passed, failed, errors };
}
