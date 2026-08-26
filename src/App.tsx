import React, { useState, useEffect, useMemo } from 'react';
import { CatProfile, CatNameEntry } from './types';
import { generateCatNameSuggestions, getRandomProfile } from './utils/nameGenerator';
import { Header } from './components/Header';
import { TraitSelector } from './components/TraitSelector';
import { SuggestionsView } from './components/SuggestionsView';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { CatPreviewAvatar } from './components/CatPreviewAvatar';
import { Heart, PawPrint } from 'lucide-react';

const INITIAL_PROFILE: CatProfile = {
  coat: 'ginger',
  personalities: ['chaotic', 'foodie'],
  themes: ['food'],
  gender: 'any',
};

export const App: React.FC = () => {
  // Load initial favorites from localStorage if present
  const [favorites, setFavorites] = useState<CatNameEntry[]>(() => {
    try {
      const saved = localStorage.getItem('purrfect_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [profile, setProfile] = useState<CatProfile>(INITIAL_PROFILE);
  const [salt, setSalt] = useState<number>(0);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isRerolling, setIsRerolling] = useState(false);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('purrfect_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  // Generate suggestions dynamically
  const suggestions = useMemo(() => {
    return generateCatNameSuggestions(profile, 4, salt);
  }, [profile, salt]);

  const handleToggleFavorite = (entry: CatNameEntry) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === entry.id);
      if (exists) {
        return prev.filter((item) => item.id !== entry.id);
      } else {
        return [...prev, entry];
      }
    });
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllFavorites = () => {
    setFavorites([]);
  };

  const handleReroll = () => {
    setIsRerolling(true);
    setSalt((s) => s + 1);
    setTimeout(() => setIsRerolling(false), 300);
  };

  const handleSurpriseMe = () => {
    const randomProf = getRandomProfile();
    setProfile(randomProf);
    setSalt((s) => s + 1);
  };

  const handleReset = () => {
    setProfile({
      coat: null,
      personalities: [],
      themes: [],
      gender: 'any',
    });
    setSalt((s) => s + 1);
  };

  const hasFilters = Boolean(
    profile.coat ||
    profile.personalities.length > 0 ||
    profile.themes.length > 0 ||
    profile.gender !== 'any'
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/70 via-orange-50/30 to-amber-100/40 text-slate-800 flex flex-col font-sans">
      <Header
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onSurpriseMe={handleSurpriseMe}
        onReset={handleReset}
        hasFilters={hasFilters}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Hero Section with Live Avatar Banner */}
        <section className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-200/90 rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-sm flex flex-col md:flex-row items-center gap-6 md:gap-8 justify-between">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-xs font-bold shadow-xs">
              <PawPrint className="w-3.5 h-3.5 text-orange-600" />
              <span>Describe Your Feline Friend</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Find the name your cat was{' '}
              <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                destined to have.
              </span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Every cat has an unmistakable vibe. Choose your cat’s coat pattern, personality quirks, and favorite name styles below to instantly generate curated, meaningful suggestions with instant explanations!
            </p>
          </div>

          <div className="shrink-0">
            <CatPreviewAvatar
              coat={profile.coat}
              personalities={profile.personalities}
            />
          </div>
        </section>

        {/* Interactive Trait Selectors */}
        <TraitSelector profile={profile} onChangeProfile={setProfile} />

        {/* Live Suggestions Grid */}
        <SuggestionsView
          suggestions={suggestions}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onReroll={handleReroll}
          profile={profile}
          isRerolling={isRerolling}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-200/80 bg-white/60 backdrop-blur-sm py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
            <span>for cat lovers everywhere • Zero external APIs or tracking</span>
          </p>
          <p className="text-slate-400">
            PurrfectName v1.0 • React + TypeScript + Tailwind
          </p>
        </div>
      </footer>

      {/* Saved Favorites Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onRemoveFavorite={handleRemoveFavorite}
        onClearAll={handleClearAllFavorites}
      />
    </div>
  );
};
