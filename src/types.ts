export type CoatType =
  | 'ginger'
  | 'black'
  | 'white'
  | 'calico'
  | 'tuxedo'
  | 'tabby'
  | 'grey'
  | 'fluffy'
  | 'tortoiseshell'
  | 'siamese';

export type PersonalityTrait =
  | 'chaotic'
  | 'regal'
  | 'cuddly'
  | 'lazy'
  | 'fierce'
  | 'derpy'
  | 'vocal'
  | 'mysterious'
  | 'adventurous'
  | 'foodie';

export type NameTheme =
  | 'food'
  | 'mythology'
  | 'human'
  | 'punny'
  | 'nature'
  | 'celestial'
  | 'pop-culture';

export type GenderVibe = 'any' | 'male' | 'female' | 'unisex';

export interface CatProfile {
  coat: CoatType | null;
  personalities: PersonalityTrait[];
  themes: NameTheme[];
  gender: GenderVibe;
}

export interface CatNameEntry {
  id: string;
  name: string;
  meaning: string;
  coats: CoatType[];
  personalities: PersonalityTrait[];
  themes: NameTheme[];
  gender: GenderVibe;
  vibe: string;
  funFact?: string;
}

export interface ScoredCatName {
  nameEntry: CatNameEntry;
  score: number;
  matchedTraits: string[];
  rationale: string;
}
