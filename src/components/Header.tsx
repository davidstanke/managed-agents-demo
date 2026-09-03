import React from 'react';
import { Heart, RotateCcw, Cat, Dices } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../hooks/useTheme';
import type { ThemePreference, ResolvedTheme } from '../types';

export interface HeaderProps {
  favoritesCount: number;
  onOpenFavorites: () => void;
  onSurpriseMe: () => void;
  onReset: () => void;
  hasFilters: boolean;
  themePreference?: ThemePreference;
  resolvedTheme?: ResolvedTheme;
  onCycleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  favoritesCount,
  onOpenFavorites,
  onSurpriseMe,
  onReset,
  hasFilters,
  themePreference,
  resolvedTheme,
  onCycleTheme,
}) => {
  const defaultTheme = useTheme();
  const currentPreference = themePreference ?? defaultTheme.themePreference;
  const currentResolved = resolvedTheme ?? defaultTheme.resolvedTheme;
  const handleCycleTheme = onCycleTheme ?? defaultTheme.cycleTheme;

  return (
    <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-amber-200 dark:border-slate-800 sticky top-0 z-30 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20 transform hover:scale-105 transition-transform">
            <Cat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 bg-clip-text text-transparent dark:text-slate-100">
                PurrfectName
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/50 rounded-full border border-orange-200">
                100% Client-Side
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Smart cat name generator driven by your cat's exact personality & looks
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {hasFilters && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-xl transition-colors active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:focus-visible:ring-amber-400"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <ThemeToggle
            preference={currentPreference}
            resolvedTheme={currentResolved}
            onCycleTheme={handleCycleTheme}
          />

          <button
            onClick={onSurpriseMe}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200/90 dark:bg-amber-950/60 dark:text-amber-300 dark:hover:bg-amber-900/60 rounded-xl transition-all shadow-sm active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:focus-visible:ring-amber-400"
            title="Randomize traits"
          >
            <Dices className="w-4 h-4 text-amber-700 dark:text-amber-300" />
            <span>Surprise Me!</span>
          </button>

          <button
            onClick={onOpenFavorites}
            className="relative inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-xl shadow-sm shadow-rose-500/25 transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:focus-visible:ring-rose-400"
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[11px] font-bold bg-white text-rose-600 rounded-full shadow-inner">
                {favoritesCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
