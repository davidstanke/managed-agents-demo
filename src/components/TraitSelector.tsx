import React from 'react';
import { CoatType, PersonalityTrait, NameTheme, GenderVibe, CatProfile } from '../types';
import { COAT_OPTIONS, PERSONALITY_OPTIONS, THEME_OPTIONS, GENDER_OPTIONS } from '../data/namesData';
import { Sparkles, Palette, Smile, BookOpen, Compass } from 'lucide-react';

interface TraitSelectorProps {
  profile: CatProfile;
  onChangeProfile: (profile: CatProfile) => void;
}

export const TraitSelector: React.FC<TraitSelectorProps> = ({ profile, onChangeProfile }) => {
  const toggleCoat = (coatId: CoatType) => {
    onChangeProfile({
      ...profile,
      coat: profile.coat === coatId ? null : coatId,
    });
  };

  const togglePersonality = (traitId: PersonalityTrait) => {
    const exists = profile.personalities.includes(traitId);
    let newPersonalities: PersonalityTrait[];
    if (exists) {
      newPersonalities = profile.personalities.filter((p) => p !== traitId);
    } else {
      // Limit to max 3 personality traits for clean matching
      newPersonalities = [...profile.personalities, traitId].slice(-3);
    }
    onChangeProfile({
      ...profile,
      personalities: newPersonalities,
    });
  };

  const toggleTheme = (themeId: NameTheme) => {
    const exists = profile.themes.includes(themeId);
    let newThemes: NameTheme[];
    if (exists) {
      newThemes = profile.themes.filter((t) => t !== themeId);
    } else {
      newThemes = [...profile.themes, themeId].slice(-2);
    }
    onChangeProfile({
      ...profile,
      themes: newThemes,
    });
  };

  const setGender = (gender: GenderVibe) => {
    onChangeProfile({
      ...profile,
      gender,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. COAT APPEARANCE */}
      <section className="bg-white/90 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border border-amber-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <Palette className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-800">1. Coat Appearance & Pattern</h2>
              <p className="text-xs text-slate-500">Pick your kitty's color or fur pattern</p>
            </div>
          </div>
          {profile.coat && (
            <button
              onClick={() => onChangeProfile({ ...profile, coat: null })}
              className="text-[11px] font-semibold text-orange-600 hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {COAT_OPTIONS.map((item) => {
            const isSelected = profile.coat === item.id;
            return (
              <button
                key={item.id}
                onClick={() => toggleCoat(item.id)}
                className={`group relative flex flex-col items-start p-3 rounded-2xl border text-left transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/80 ring-2 ring-orange-400/40 shadow-sm'
                    : 'border-slate-200 hover:border-amber-300 bg-white hover:bg-amber-50/40'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="text-2xl transform group-hover:scale-110 transition-transform">{item.icon}</span>
                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm animate-pulse" />
                  )}
                </div>
                <div className="font-semibold text-xs text-slate-800 leading-tight mb-0.5">
                  {item.label}
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  {item.desc.split(',')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. PERSONALITY VIBES */}
      <section className="bg-white/90 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border border-amber-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-600">
              <Smile className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-800">2. Personality & Behavior Vibe</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Select up to 3
                </span>
              </div>
              <p className="text-xs text-slate-500">How does your cat act on an everyday basis?</p>
            </div>
          </div>
          {profile.personalities.length > 0 && (
            <button
              onClick={() => onChangeProfile({ ...profile, personalities: [] })}
              className="text-[11px] font-semibold text-amber-700 hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {PERSONALITY_OPTIONS.map((trait) => {
            const isSelected = profile.personalities.includes(trait.id);
            return (
              <button
                key={trait.id}
                onClick={() => togglePersonality(trait.id)}
                className={`group flex items-start gap-2.5 p-3 rounded-2xl border text-left transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-400/40 shadow-sm'
                    : 'border-slate-200 hover:border-amber-300 bg-white hover:bg-amber-50/40'
                }`}
              >
                <span className="text-xl shrink-0 mt-0.5 transform group-hover:scale-110 transition-transform">
                  {trait.emoji}
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-slate-800 leading-tight">
                    {trait.label}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight truncate mt-0.5">
                    {trait.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. NAME THEMES & GENDER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Themes (2 cols on large) */}
        <section className="lg:col-span-2 bg-white/90 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border border-amber-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-100 text-purple-600">
                <BookOpen className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-800">3. Name Style & Theme</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    Select up to 2
                  </span>
                </div>
                <p className="text-xs text-slate-500">What flavor of names do you gravitate toward?</p>
              </div>
            </div>
            {profile.themes.length > 0 && (
              <button
                onClick={() => onChangeProfile({ ...profile, themes: [] })}
                className="text-[11px] font-semibold text-purple-700 hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {THEME_OPTIONS.map((theme) => {
              const isSelected = profile.themes.includes(theme.id);
              return (
                <button
                  key={theme.id}
                  onClick={() => toggleTheme(theme.id)}
                  className={`group flex items-start gap-2.5 p-3 rounded-2xl border text-left transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-400/40 shadow-sm'
                      : 'border-slate-200 hover:border-purple-200 bg-white hover:bg-purple-50/30'
                  }`}
                >
                  <span className="text-xl shrink-0 mt-0.5 transform group-hover:scale-110 transition-transform">
                    {theme.emoji}
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold text-xs text-slate-800 leading-tight">
                      {theme.label}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight truncate mt-0.5">
                      {theme.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Gender Preference */}
        <section className="bg-white/90 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border border-amber-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <span className="p-2 rounded-xl bg-pink-100 text-pink-600">
                <Compass className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-800">4. Gender Preference</h2>
                <p className="text-xs text-slate-500">Optional vibe filter</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {GENDER_OPTIONS.map((g) => {
                const isSelected = profile.gender === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setGender(g.id)}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-400/40'
                        : 'border-slate-200 hover:border-rose-200 bg-white text-slate-700'
                    }`}
                  >
                    <span>{g.icon}</span>
                    <span>{g.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 leading-relaxed flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Selections update the name suggestions in real time!</span>
          </div>
        </section>
      </div>
    </div>
  );
};
