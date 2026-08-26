import React from 'react';
import { ScoredCatName, CatNameEntry, CatProfile } from '../types';
import { NameCard } from './NameCard';
import { RefreshCw, Wand2 } from 'lucide-react';

interface SuggestionsViewProps {
  suggestions: ScoredCatName[];
  favorites: CatNameEntry[];
  onToggleFavorite: (entry: CatNameEntry) => void;
  onReroll: () => void;
  profile: CatProfile;
  isRerolling: boolean;
}

export const SuggestionsView: React.FC<SuggestionsViewProps> = ({
  suggestions,
  favorites,
  onToggleFavorite,
  onReroll,
  profile,
  isRerolling,
}) => {
  const favoriteIds = new Set(favorites.map((f) => f.id));

  const activeCount =
    (profile.coat ? 1 : 0) +
    profile.personalities.length +
    profile.themes.length +
    (profile.gender !== 'any' ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Suggestions Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-sm p-4 sm:p-5 rounded-3xl border border-amber-200/90 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-sm shadow-orange-500/30">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Tailored Name Matches</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                Top {suggestions.length}
              </span>
              {activeCount > 0 && (
                <span className="hidden sm:inline-block text-[11px] font-medium text-slate-500">
                  ({activeCount} {activeCount === 1 ? 'trait' : 'traits'} dialed in)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Ranked in real time based on your selected cat traits
            </p>
          </div>
        </div>

        {/* Reroll / More Names Button */}
        <button
          onClick={onReroll}
          disabled={isRerolling}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRerolling ? 'animate-spin' : ''}`} />
          <span>Reroll / Give Me More</span>
        </button>
      </div>

      {/* Grid of Name Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((item, idx) => (
          <NameCard
            key={`${item.nameEntry.id}-${idx}`}
            scoredItem={item}
            rank={idx}
            isFavorite={favoriteIds.has(item.nameEntry.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};
