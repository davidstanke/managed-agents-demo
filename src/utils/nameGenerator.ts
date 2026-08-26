import { CatProfile, ScoredCatName, CatNameEntry } from '../types';
import { CAT_NAMES_DATABASE, COAT_OPTIONS, PERSONALITY_OPTIONS, THEME_OPTIONS } from '../data/namesData';

export function generateCatNameSuggestions(
  profile: CatProfile,
  count = 4,
  salt = 0
): ScoredCatName[] {
  // If no attributes selected at all, pick a diverse randomized set with fun defaults
  const isProfileEmpty =
    !profile.coat &&
    profile.personalities.length === 0 &&
    profile.themes.length === 0 &&
    profile.gender === 'any';

  const scoredEntries: ScoredCatName[] = CAT_NAMES_DATABASE.map((entry) => {
    let score = 0;
    const matchedTraits: string[] = [];

    // 1. Coat Matching (Weight: 40)
    if (profile.coat) {
      if (entry.coats.includes(profile.coat)) {
        score += 40;
        const coatLabel = COAT_OPTIONS.find((c) => c.id === profile.coat)?.label.split(' ')[0] || profile.coat;
        matchedTraits.push(`${coatLabel} Coat`);
      }
    }

    // 2. Personality Matching (Weight: 25 per match)
    profile.personalities.forEach((trait) => {
      if (entry.personalities.includes(trait)) {
        score += 25;
        const traitLabel = PERSONALITY_OPTIONS.find((p) => p.id === trait)?.label || trait;
        matchedTraits.push(traitLabel);
      }
    });

    // 3. Theme Matching (Weight: 20 per match)
    profile.themes.forEach((theme) => {
      if (entry.themes.includes(theme)) {
        score += 20;
        const themeLabel = THEME_OPTIONS.find((t) => t.id === theme)?.label || theme;
        matchedTraits.push(`${themeLabel}`);
      }
    });

    // 4. Gender Filtering & Scoring (Weight: 10)
    if (profile.gender !== 'any') {
      if (entry.gender === profile.gender) {
        score += 15;
      } else if (entry.gender === 'unisex') {
        score += 10;
      } else {
        score -= 30; // Deprioritize opposite gender when strict
      }
    }

    // Add controlled pseudo-random jitter for reroll diversity
    const pseudoRandom = Math.sin(entry.id.length * 13 + salt * 7 + score * 3) * 12;
    const finalScore = isProfileEmpty ? Math.random() * 100 : score + pseudoRandom;

    // Craft dynamic rationale
    const rationale = buildRationale(entry, profile, matchedTraits);

    return {
      nameEntry: entry,
      score: finalScore,
      matchedTraits,
      rationale,
    };
  });

  // Sort descending by score
  scoredEntries.sort((a, b) => b.score - a.score);

  // Take top `count` unique names
  return scoredEntries.slice(0, count);
}

function buildRationale(
  entry: CatNameEntry,
  profile: CatProfile,
  matchedTraits: string[]
): string {
  if (matchedTraits.length >= 3) {
    return `Triple match! Aligns effortlessly with your cat's ${matchedTraits.slice(0, 2).join(', ')} and ${matchedTraits[2]}.`;
  }

  if (profile.coat && entry.coats.includes(profile.coat) && profile.personalities.some(p => entry.personalities.includes(p))) {
    const pMatch = profile.personalities.find(p => entry.personalities.includes(p));
    const pLabel = PERSONALITY_OPTIONS.find(p => p.id === pMatch)?.label || 'playful';
    return `Tailored for that ${profile.coat} coat with distinct ${pLabel.toLowerCase()} vibes!`;
  }

  if (profile.themes.some(t => entry.themes.includes(t))) {
    const tMatch = profile.themes.find(t => entry.themes.includes(t));
    const tLabel = THEME_OPTIONS.find(t => t.id === tMatch)?.label || 'classic';
    return `A standout ${tLabel.toLowerCase()} inspired pick with charm and attitude.`;
  }

  if (entry.vibe) {
    return entry.vibe;
  }

  return entry.meaning;
}

export function getRandomProfile(): CatProfile {
  const allCoats = COAT_OPTIONS.map((c) => c.id);
  const allPersonalities = PERSONALITY_OPTIONS.map((p) => p.id);
  const allThemes = THEME_OPTIONS.map((t) => t.id);

  // Pick 1 coat
  const randomCoat = allCoats[Math.floor(Math.random() * allCoats.length)];

  // Pick 1-2 personalities
  const shuffledPersonalities = [...allPersonalities].sort(() => 0.5 - Math.random());
  const randomPersonalities = shuffledPersonalities.slice(0, Math.floor(Math.random() * 2) + 1);

  // Pick 1-2 themes
  const shuffledThemes = [...allThemes].sort(() => 0.5 - Math.random());
  const randomThemes = shuffledThemes.slice(0, Math.floor(Math.random() * 2) + 1);

  return {
    coat: randomCoat,
    personalities: randomPersonalities,
    themes: randomThemes,
    gender: 'any',
  };
}
