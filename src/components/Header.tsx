import React from 'react';
import { Heart, RotateCcw, Cat, Dices } from 'lucide-react';

interface HeaderProps {
  favoritesCount: number;
  onOpenFavorites: () => void;
  onSurpriseMe: () => void;
  onReset: () => void;
  hasFilters: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  favoritesCount,
  onOpenFavorites,
  onSurpriseMe,
  onReset,
  hasFilters,
}) => {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-amber-200 sticky top-0 z-30 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20 transform hover:scale-105 transition-transform">
            <Cat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 bg-clip-text text-transparent">
                PurrfectName
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 rounded-full border border-orange-200">
                100% Client-Side
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Smart cat name generator driven by your cat's exact personality & looks
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {hasFilters && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors active:scale-95"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            onClick={onSurpriseMe}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200/90 rounded-xl transition-all shadow-sm active:scale-95"
            title="Randomize traits"
          >
            <Dices className="w-4 h-4 text-amber-700" />
            <span>Surprise Me!</span>
          </button>

          <button
            onClick={onOpenFavorites}
            className="relative inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-xl shadow-sm shadow-rose-500/25 transition-all active:scale-95"
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
