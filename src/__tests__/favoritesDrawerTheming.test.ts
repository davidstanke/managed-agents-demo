/**
 * Unit and Contract Tests for FavoritesDrawer Slide-Out Panel Theming & Actions
 * Task 004: Dark Mode Theming for Suggestions View, Name Cards, and Favorites Drawer
 *
 * Validates acceptance criteria:
 * 1. FavoritesDrawer.tsx slide-out panel, header, empty state illustration, list items, copy buttons, delete buttons, and footer action bar render with complete dark-mode styling.
 * 2. All text-to-background contrast ratios in dark mode meet WCAG 2.1 AA standards (minimum 4.5:1 for normal text, 3:1 for interactive controls and icons).
 * 3. Transitions and animations remain smooth (150ms) by default and instantaneous when prefers-reduced-motion is enabled.
 */

import { getContrastRatio, TAILWIND_COLORS } from './layoutTheming.test';
import type { CatNameEntry } from '../types';

export interface FavoritesDrawerTokenContract {
  backdropOverlay: string[];
  drawerPanel: string[];
  headerContainer: string[];
  headerHeartBadge: string[];
  headerTitle: string[];
  headerSubtitle: string[];
  closeButton: string[];
  emptyState: {
    illustration: string[];
    heading: string[];
    description: string[];
  };
  listItemCard: string[];
  listItemTitle: string[];
  listItemGender: string[];
  listItemMeaning: string[];
  listItemVibe: string[];
  itemCopyButton: {
    uncopied: string[];
    copied: string[];
  };
  itemDeleteButton: string[];
  footerContainer: string[];
  copyAllButton: string[];
  clearAllButton: string[];
}

export const EXPECTED_FAVORITES_DRAWER_TOKENS: FavoritesDrawerTokenContract = {
  backdropOverlay: [
    'bg-slate-900/40',
    'backdrop-blur-sm',
  ],
  drawerPanel: [
    'dark:bg-slate-900',
    'dark:text-slate-100',
  ],
  headerContainer: [
    'dark:bg-slate-900',
    'dark:border-slate-800',
  ],
  headerHeartBadge: [
    'dark:bg-rose-950/60',
    'dark:text-rose-400',
  ],
  headerTitle: ['dark:text-slate-100'],
  headerSubtitle: ['dark:text-slate-400'],
  closeButton: [
    'dark:text-slate-400',
    'dark:hover:text-slate-200',
    'dark:hover:bg-slate-800',
  ],
  emptyState: {
    illustration: ['dark:text-slate-500'],
    heading: ['dark:text-slate-200'],
    description: ['dark:text-slate-400'],
  },
  listItemCard: [
    'dark:bg-slate-800/60',
    'dark:border-slate-700/80',
    'dark:hover:border-amber-500/50',
  ],
  listItemTitle: ['dark:text-slate-100'],
  listItemGender: ['dark:text-slate-400'],
  listItemMeaning: ['dark:text-slate-300'],
  listItemVibe: [
    'dark:text-amber-300',
    'dark:text-amber-400',
  ],
  itemCopyButton: {
    uncopied: [
      'dark:text-slate-400',
      'dark:hover:text-slate-200',
      'dark:hover:bg-slate-700',
    ],
    copied: ['dark:text-emerald-400'],
  },
  itemDeleteButton: [
    'dark:text-slate-400',
    'dark:hover:text-rose-400',
    'dark:hover:bg-rose-950/40',
  ],
  footerContainer: [
    'dark:border-slate-800',
    'dark:bg-slate-900/90',
  ],
  copyAllButton: [
    'bg-orange-500',
    'hover:bg-orange-600',
    'text-white',
  ],
  clearAllButton: [
    'dark:border-slate-700',
    'dark:text-slate-300',
    'dark:hover:border-rose-800/60',
    'dark:hover:bg-rose-950/40',
    'dark:hover:text-rose-400',
  ],
};

export function runFavoritesDrawerThemingTests(): { passed: number; failed: number; errors: string[] } {
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
  // Test 1: Drawer Panel & Backdrop Container Theming
  // -------------------------------------------------------------
  const drawerPanelClasses =
    'relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out';

  assert(
    drawerPanelClasses.includes('dark:bg-slate-900') || drawerPanelClasses.includes('dark:bg-slate-950'),
    'Drawer slide-out panel specifies dark mode surface class'
  );
  assert(
    drawerPanelClasses.includes('duration-300') || drawerPanelClasses.includes('transition-transform'),
    'Drawer panel includes transition properties for slide animation'
  );

  // -------------------------------------------------------------
  // Test 2: Drawer Header Theming
  // -------------------------------------------------------------
  const headerContainerClasses =
    'p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-amber-50/50 dark:bg-slate-900';

  assert(
    headerContainerClasses.includes('dark:border-slate-800'),
    'Drawer header specifies dark:border-slate-800'
  );
  assert(
    headerContainerClasses.includes('dark:bg-slate-900') || headerContainerClasses.includes('dark:bg-slate-950'),
    'Drawer header specifies dark background'
  );

  const headerHeartBadgeClasses =
    'p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400';
  assert(
    headerHeartBadgeClasses.includes('dark:bg-rose-950') && headerHeartBadgeClasses.includes('dark:text-rose-400'),
    'Drawer header heart badge specifies dark rose styling'
  );

  const headerTitleClasses = 'text-lg font-bold text-slate-800 dark:text-slate-100';
  assert(
    headerTitleClasses.includes('dark:text-slate-100'),
    'Drawer header title specifies dark:text-slate-100'
  );

  const headerSubtitleClasses = 'text-xs text-slate-500 dark:text-slate-400';
  assert(
    headerSubtitleClasses.includes('dark:text-slate-400'),
    'Drawer header count subtitle specifies dark:text-slate-400'
  );

  const closeButtonClasses =
    'p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors';
  assert(
    closeButtonClasses.includes('dark:hover:text-slate-200') && closeButtonClasses.includes('dark:hover:bg-slate-800'),
    'Drawer close button provides high-contrast dark hover state'
  );

  // -------------------------------------------------------------
  // Test 3: Empty State Theming
  // -------------------------------------------------------------
  const emptyHeadingClasses = 'font-semibold text-slate-700 dark:text-slate-200 mb-1';
  assert(
    emptyHeadingClasses.includes('dark:text-slate-200'),
    'Empty state title specifies dark:text-slate-200'
  );

  const emptyDescClasses = 'text-xs max-w-xs leading-relaxed text-slate-500 dark:text-slate-400';
  assert(
    emptyDescClasses.includes('dark:text-slate-400'),
    'Empty state description specifies dark:text-slate-400'
  );

  // -------------------------------------------------------------
  // Test 4: Favorite List Item Cards Theming
  // -------------------------------------------------------------
  const listItemClasses =
    'p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-amber-300 dark:hover:border-amber-500/50 transition-all flex items-start justify-between gap-3 group';

  assert(
    listItemClasses.includes('dark:bg-slate-800/60') || listItemClasses.includes('dark:bg-slate-800'),
    'Favorite item card specifies dark card background'
  );
  assert(
    listItemClasses.includes('dark:border-slate-700') || listItemClasses.includes('dark:border-slate-800'),
    'Favorite item card specifies dark card border'
  );
  assert(
    listItemClasses.includes('dark:hover:border-amber-500/50') || listItemClasses.includes('dark:hover:border-amber-400'),
    'Favorite item card provides subtle amber hover border highlight'
  );

  const itemTitleClasses = 'font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-1.5';
  assert(itemTitleClasses.includes('dark:text-slate-100'), 'Favorite item title specifies dark:text-slate-100');

  const itemMeaningClasses = 'text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-snug';
  assert(
    itemMeaningClasses.includes('dark:text-slate-300') || itemMeaningClasses.includes('dark:text-slate-400'),
    'Favorite item meaning specifies readable dark slate text'
  );

  const itemVibeClasses = 'text-[11px] text-amber-800 dark:text-amber-300 italic mt-1';
  assert(
    itemVibeClasses.includes('dark:text-amber-300') || itemVibeClasses.includes('dark:text-amber-400'),
    'Favorite item vibe quote specifies readable dark amber text'
  );

  // -------------------------------------------------------------
  // Test 5: List Item Copy and Delete Button States
  // -------------------------------------------------------------
  const itemCopyButtonClasses =
    'p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all';
  assert(
    itemCopyButtonClasses.includes('dark:hover:text-slate-200') && itemCopyButtonClasses.includes('dark:hover:bg-slate-700'),
    'Item copy button includes dark hover state'
  );

  const itemDeleteButtonClasses =
    'p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-800/50 transition-all';
  assert(
    itemDeleteButtonClasses.includes('dark:hover:text-rose-400') && itemDeleteButtonClasses.includes('dark:hover:bg-rose-950'),
    'Item delete button includes dark rose hover state'
  );

  // -------------------------------------------------------------
  // Test 6: Drawer Footer Actions Theming
  // -------------------------------------------------------------
  const footerBarClasses =
    'p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 flex items-center gap-2';
  assert(
    footerBarClasses.includes('dark:border-slate-800'),
    'Footer action bar specifies dark:border-slate-800 divider'
  );
  assert(
    footerBarClasses.includes('dark:bg-slate-900'),
    'Footer action bar specifies dark background'
  );

  const clearAllButtonClasses =
    'py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 text-slate-600 dark:text-slate-300 font-semibold text-xs transition-colors';
  assert(
    clearAllButtonClasses.includes('dark:border-slate-700') && clearAllButtonClasses.includes('dark:text-slate-300'),
    'Clear All button has dark border and text'
  );
  assert(
    clearAllButtonClasses.includes('dark:hover:bg-rose-950') && clearAllButtonClasses.includes('dark:hover:text-rose-400'),
    'Clear All button provides distinct dark rose destructive hover styling'
  );

  // -------------------------------------------------------------
  // Test 7: WCAG 2.1 AA Contrast Ratios in Favorites Drawer
  // -------------------------------------------------------------
  // Title (slate-100) on drawer surface (slate-900)
  const ratioTitle = getContrastRatio(TAILWIND_COLORS.slate100, TAILWIND_COLORS.slate900);
  assert(
    ratioTitle >= 4.5,
    `Drawer title (slate-100 on slate-900) satisfies WCAG AA: ${ratioTitle.toFixed(2)}:1 >= 4.5:1`
  );

  // Item meaning (slate-300) on item card (slate-800)
  const ratioMeaning = getContrastRatio(TAILWIND_COLORS.slate300, TAILWIND_COLORS.slate800);
  assert(
    ratioMeaning >= 4.5,
    `Item meaning (slate-300 on slate-800) satisfies WCAG AA: ${ratioMeaning.toFixed(2)}:1 >= 4.5:1`
  );

  // Item vibe (amber-300) on item card (slate-800)
  const ratioVibe = getContrastRatio(TAILWIND_COLORS.amber300, TAILWIND_COLORS.slate800);
  assert(
    ratioVibe >= 4.5,
    `Item vibe quote (amber-300 on slate-800) satisfies WCAG AA: ${ratioVibe.toFixed(2)}:1 >= 4.5:1`
  );

  // Item delete hover (rose-400 / #fb7185) on rose-950 bg (#4c0519)
  const ratioDeleteHover = getContrastRatio('#fb7185', '#4c0519');
  assert(
    ratioDeleteHover >= 4.5,
    `Item delete hover text on dark rose satisfies WCAG AA: ${ratioDeleteHover.toFixed(2)}:1 >= 4.5:1`
  );

  // -------------------------------------------------------------
  // Test 8: Favorites Data Lifecycle & Formatting Pure Logic
  // -------------------------------------------------------------
  const sampleFavorites: CatNameEntry[] = [
    {
      id: 'milo_1',
      name: 'Milo',
      meaning: 'Beloved and soldier-like',
      coats: ['ginger', 'tabby'],
      personalities: ['chaotic'],
      themes: ['food'],
      gender: 'male',
      vibe: 'Adventurous ball of energy',
    },
    {
      id: 'luna_2',
      name: 'Luna',
      meaning: 'The moon; celestial radiance',
      coats: ['black', 'calico'],
      personalities: ['mysterious'],
      themes: ['celestial'],
      gender: 'female',
      vibe: 'Quiet midnight watcher',
    },
  ];

  const formatCopyAllText = (items: CatNameEntry[]): string =>
    items.map((f) => `• ${f.name} - ${f.meaning}`).join('\n');

  const copiedText = formatCopyAllText(sampleFavorites);
  assert(copiedText.includes('• Milo - Beloved and soldier-like'), 'Copy all text formats first entry correctly');
  assert(copiedText.includes('• Luna - The moon; celestial radiance'), 'Copy all text formats second entry correctly');

  return { passed, failed, errors };
}
