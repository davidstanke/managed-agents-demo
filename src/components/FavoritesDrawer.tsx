import React, { useState } from 'react';
import { CatNameEntry } from '../types';
import { X, Trash2, Copy, Check, Heart } from 'lucide-react';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: CatNameEntry[];
  onRemoveFavorite: (id: string) => void;
  onClearAll: () => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onClearAll,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyAll = () => {
    const text = favorites.map((f) => `• ${f.name} - ${f.meaning}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopySingle = (entry: CatNameEntry) => {
    navigator.clipboard.writeText(entry.name);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/40 backdrop-blur-sm transition-opacity">
      <div
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Saved Favorites</h2>
              <p className="text-xs text-slate-500">
                {favorites.length} {favorites.length === 1 ? 'name' : 'names'} saved
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {favorites.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="text-5xl mb-3">🐾</div>
              <p className="font-semibold text-slate-700 mb-1">No favorite names yet!</p>
              <p className="text-xs max-w-xs leading-relaxed text-slate-500">
                Click the heart icon on any suggested cat name to bookmark it here for your shortlist.
              </p>
            </div>
          ) : (
            favorites.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-300 transition-all flex items-start justify-between gap-3 group"
              >
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                    {entry.name}
                    {entry.gender !== 'unisex' && (
                      <span className="text-[10px] font-semibold text-slate-400">({entry.gender})</span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-snug">{entry.meaning}</p>
                  {entry.vibe && (
                    <p className="text-[11px] text-amber-800 italic mt-1">"{entry.vibe}"</p>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleCopySingle(entry)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 transition-all"
                    title="Copy name"
                  >
                    {copiedId === entry.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => onRemoveFavorite(entry.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {favorites.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="flex-1 py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-orange-500/20 transition-all"
            >
              {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedAll ? 'Copied Full List!' : 'Copy All Names'}</span>
            </button>
            <button
              onClick={onClearAll}
              className="py-2.5 px-3 rounded-xl border border-slate-300 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-semibold text-xs transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
