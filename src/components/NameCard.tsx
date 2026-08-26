import React, { useState } from 'react';
import { ScoredCatName, CatNameEntry } from '../types';
import { Heart, Copy, Check, Sparkles, Quote } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NameCardProps {
  scoredItem: ScoredCatName;
  rank: number;
  isFavorite: boolean;
  onToggleFavorite: (entry: CatNameEntry) => void;
}

export const NameCard: React.FC<NameCardProps> = ({
  scoredItem,
  rank,
  isFavorite,
  onToggleFavorite,
}) => {
  const [copied, setCopied] = useState(false);
  const { nameEntry, matchedTraits, rationale } = scoredItem;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(nameEntry.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFavorite) {
      // Trigger mini confetti celebration near the button!
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { x, y },
        colors: ['#F43F5E', '#FB923C', '#FBBF24', '#A855F7'],
        disableForReducedMotion: true,
      });
    }
    onToggleFavorite(nameEntry);
  };

  // Visual accent styles based on rank
  const rankColors = [
    { badge: 'bg-amber-500 text-white shadow-amber-500/30', border: 'border-amber-300 ring-2 ring-amber-400/20', star: '✨ Top Match' },
    { badge: 'bg-orange-500 text-white shadow-orange-500/30', border: 'border-orange-200', star: 'Runner Up' },
    { badge: 'bg-rose-500 text-white shadow-rose-500/30', border: 'border-rose-200', star: 'Great Fit' },
    { badge: 'bg-purple-500 text-white shadow-purple-500/30', border: 'border-purple-200', star: 'Unique Pick' },
  ];

  const rankStyle = rankColors[rank] || {
    badge: 'bg-slate-700 text-white',
    border: 'border-slate-200',
    star: 'Suggestion',
  };

  return (
    <div
      className={`relative group bg-white/95 backdrop-blur-sm rounded-3xl p-5 sm:p-6 border ${rankStyle.border} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between animate-popIn`}
      style={{ animationDelay: `${rank * 80}ms` }}
    >
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 text-[11px] font-bold rounded-full shadow-sm flex items-center gap-1 ${rankStyle.badge}`}
            >
              <span>#{rank + 1}</span>
              <span>•</span>
              <span>{rankStyle.star}</span>
            </span>
            {nameEntry.gender !== 'unisex' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium capitalize">
                {nameEntry.gender}
              </span>
            )}
          </div>

          {/* Action Buttons: Copy & Favorite */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className={`p-2 rounded-xl border transition-all active:scale-90 flex items-center justify-center ${
                copied
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title="Copy name to clipboard"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleFavorite}
              className={`p-2 rounded-xl border transition-all active:scale-90 flex items-center justify-center ${
                isFavorite
                  ? 'bg-rose-50 border-rose-300 text-rose-500 shadow-sm shadow-rose-200'
                  : 'bg-slate-50 hover:bg-rose-50 border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Big Name */}
        <div className="mb-2">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight group-hover:text-orange-600 transition-colors">
            {nameEntry.name}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mt-1">
            {nameEntry.meaning}
          </p>
        </div>

        {/* Why it matches rationale */}
        <div className="mt-3.5 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/50">
          <div className="flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-950 font-medium leading-normal">
              {rationale}
            </p>
          </div>
          {nameEntry.vibe && (
            <div className="mt-2 text-[11px] text-amber-900/80 italic flex items-center gap-1.5">
              <Quote className="w-3 h-3 text-amber-500/70 shrink-0" />
              <span>"{nameEntry.vibe}"</span>
            </div>
          )}
        </div>
      </div>

      {/* Matched Badges Footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
        {matchedTraits.length > 0 ? (
          matchedTraits.map((trait, idx) => (
            <span
              key={idx}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-orange-100/70 text-orange-800 border border-orange-200/50"
            >
              ✓ {trait}
            </span>
          ))
        ) : (
          <span className="text-[10px] font-medium text-slate-400">
            Universal crowd favorite
          </span>
        )}
      </div>
    </div>
  );
};
