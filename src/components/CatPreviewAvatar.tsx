import React from 'react';
import { CoatType, PersonalityTrait } from '../types';

interface CatPreviewAvatarProps {
  coat: CoatType | null;
  personalities: PersonalityTrait[];
}

export const CatPreviewAvatar: React.FC<CatPreviewAvatarProps> = ({ coat, personalities }) => {
  // Determine base coat colors
  let bodyFill = '#FDE68A'; // default amber/cream
  let innerEarFill = '#FBCFE8';
  let eyeColor = '#10B981'; // green
  let noseFill = '#F472B6';
  let snoutFill = '#FEF3C7';
  let markings: React.ReactNode = null;

  switch (coat) {
    case 'ginger':
      bodyFill = '#FB923C';
      snoutFill = '#FED7AA';
      markings = (
        <g stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" opacity="0.75">
          <path d="M42 22 L50 28 L58 22" />
          <path d="M40 16 L50 23 L60 16" />
          <path d="M22 45 L32 48" />
          <path d="M78 45 L68 48" />
        </g>
      );
      break;
    case 'black':
      bodyFill = '#1E293B';
      snoutFill = '#334155';
      innerEarFill = '#475569';
      eyeColor = '#FACC15'; // bright golden eyes
      noseFill = '#0F172A';
      break;
    case 'white':
      bodyFill = '#FFFFFF';
      snoutFill = '#F8FAFC';
      innerEarFill = '#FCE7F3';
      eyeColor = '#38BDF8'; // ice blue
      break;
    case 'calico':
      bodyFill = '#FFFFFF';
      snoutFill = '#FFF7ED';
      markings = (
        <g>
          {/* Orange patch over right ear */}
          <path d="M55 20 Q70 20 82 32 Q78 48 60 40 Z" fill="#FB923C" opacity="0.9" />
          {/* Black patch over left eye */}
          <circle cx="34" cy="46" r="14" fill="#334155" opacity="0.9" />
        </g>
      );
      break;
    case 'tuxedo':
      bodyFill = '#0F172A';
      snoutFill = '#FFFFFF';
      innerEarFill = '#334155';
      eyeColor = '#4ADE80';
      noseFill = '#F472B6';
      markings = (
        <g>
          {/* White chest blaze & blaze between eyes */}
          <path d="M47 36 L53 36 L56 60 L44 60 Z" fill="#FFFFFF" />
          <circle cx="50" cy="74" r="12" fill="#FFFFFF" />
        </g>
      );
      break;
    case 'tabby':
      bodyFill = '#A8A29E';
      snoutFill = '#E7E5E4';
      markings = (
        <g stroke="#57534E" strokeWidth="2.5" strokeLinecap="round">
          {/* Tabby 'M' marking */}
          <path d="M38 25 L44 32 L50 25 L56 32 L62 25" fill="none" />
          <path d="M20 44 L32 46" />
          <path d="M80 44 L68 46" />
        </g>
      );
      break;
    case 'grey':
      bodyFill = '#94A3B8';
      snoutFill = '#CBD5E1';
      innerEarFill = '#E2E8F0';
      eyeColor = '#FBBF24'; // amber
      break;
    case 'fluffy':
      bodyFill = '#E2E8F0';
      snoutFill = '#F1F5F9';
      innerEarFill = '#FBCFE8';
      eyeColor = '#60A5FA';
      break;
    case 'tortoiseshell':
      bodyFill = '#3E2723';
      snoutFill = '#5D4037';
      markings = (
        <g opacity="0.75">
          <ellipse cx="38" cy="35" rx="12" ry="8" fill="#F97316" />
          <ellipse cx="64" cy="50" rx="10" ry="12" fill="#FB923C" />
          <ellipse cx="50" cy="65" rx="8" ry="6" fill="#D97706" />
        </g>
      );
      break;
    case 'siamese':
      bodyFill = '#FAF7F2';
      snoutFill = '#473327';
      innerEarFill = '#473327';
      eyeColor = '#2563EB'; // sapphire blue
      noseFill = '#291C14';
      markings = (
        <g>
          {/* Siamese mask */}
          <ellipse cx="50" cy="50" rx="20" ry="16" fill="#473327" opacity="0.85" />
        </g>
      );
      break;
  }

  // Accessories / mood based on personality traits
  const isRoyal = personalities.includes('regal');
  const isChaotic = personalities.includes('chaotic');
  const isLazy = personalities.includes('lazy');
  const isDerpy = personalities.includes('derpy');
  const isFoodie = personalities.includes('foodie');
  const isCuddly = personalities.includes('cuddly');

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl border border-amber-200/80 dark:border-slate-800 shadow-sm transition-colors">
      <div className="relative w-36 h-36">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md transition-all duration-500 ease-out"
        >
          {/* Floof background fluff if fluffy */}
          {coat === 'fluffy' && (
            <g fill={bodyFill} opacity="0.85">
              <circle cx="20" cy="50" r="14" />
              <circle cx="80" cy="50" r="14" />
              <circle cx="24" cy="30" r="12" />
              <circle cx="76" cy="30" r="12" />
              <circle cx="35" cy="74" r="12" />
              <circle cx="65" cy="74" r="12" />
            </g>
          )}

          {/* Ears */}
          <path d="M22 42 L28 12 L50 28 Z" fill={bodyFill} stroke="#CBD5E1" strokeWidth="0.5" />
          <path d="M78 42 L72 12 L50 28 Z" fill={bodyFill} stroke="#CBD5E1" strokeWidth="0.5" />
          {/* Inner Ears */}
          <path d="M26 38 L31 18 L46 29 Z" fill={innerEarFill} />
          <path d="M74 38 L69 18 L54 29 Z" fill={innerEarFill} />

          {/* Head Body */}
          <circle cx="50" cy="50" r="32" fill={bodyFill} stroke="#CBD5E1" strokeWidth="0.5" />

          {/* Custom Coat Markings */}
          {markings}

          {/* Snout Area */}
          <ellipse cx="50" cy="58" rx="16" ry="12" fill={snoutFill} />

          {/* Eyes */}
          {isLazy ? (
            // Sleepy closed eye curves
            <g stroke="#334155" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M32 46 Q38 52 44 46" />
              <path d="M56 46 Q62 52 68 46" />
            </g>
          ) : isDerpy ? (
            // Cross-eyed / mismatched pupils
            <g>
              <ellipse cx="37" cy="45" rx="7" ry="8" fill="#FFFFFF" stroke="#334155" strokeWidth="1" />
              <ellipse cx="63" cy="45" rx="7" ry="8" fill="#FFFFFF" stroke="#334155" strokeWidth="1" />
              <circle cx="39" cy="45" r="4.5" fill={eyeColor} />
              <circle cx="61" cy="45" r="4.5" fill={eyeColor} />
              <circle cx="40" cy="45" r="2.5" fill="#0F172A" />
              <circle cx="60" cy="45" r="2.5" fill="#0F172A" />
            </g>
          ) : (
            // Regular big expressive anime-style cat eyes
            <g>
              <ellipse cx="36" cy="45" rx="6" ry="7.5" fill={eyeColor} />
              <ellipse cx="64" cy="45" rx="6" ry="7.5" fill={eyeColor} />
              {/* Pupils */}
              <ellipse cx="36" cy="45" rx="3.5" ry="5.5" fill="#0F172A" />
              <ellipse cx="64" cy="45" rx="3.5" ry="5.5" fill="#0F172A" />
              {/* Highlights */}
              <circle cx="34" cy="42" r="2" fill="#FFFFFF" />
              <circle cx="62" cy="42" r="2" fill="#FFFFFF" />
              <circle cx="37" cy="47" r="1" fill="#FFFFFF" />
              <circle cx="65" cy="47" r="1" fill="#FFFFFF" />
            </g>
          )}

          {/* Nose */}
          <polygon points="47,54 53,54 50,58" fill={noseFill} />

          {/* Mouth */}
          <path
            d="M50 58 Q46 64 42 62 M50 58 Q54 64 58 62"
            fill="none"
            stroke="#334155"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Derpy Tongue */}
          {isDerpy && (
            <path
              d="M48 62 C48 66 52 66 52 62 Z"
              fill="#F472B6"
              stroke="#DB2777"
              strokeWidth="0.8"
            />
          )}

          {/* Whiskers */}
          <g stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" opacity="0.85">
            <line x1="28" y1="56" x2="10" y2="53" />
            <line x1="28" y1="59" x2="11" y2="61" />
            <line x1="72" y1="56" x2="90" y2="53" />
            <line x1="72" y1="59" x2="89" y2="61" />
          </g>

          {/* Cheeks Blush if cuddly */}
          {isCuddly && (
            <g fill="#FB7185" opacity="0.45">
              <circle cx="28" cy="54" r="5" />
              <circle cx="72" cy="54" r="5" />
            </g>
          )}

          {/* Royal Crown Accessory */}
          {isRoyal && (
            <g transform="translate(35, 2) scale(0.3)">
              <polygon
                points="10,60 25,10 50,45 75,10 90,60"
                fill="#FBBF24"
                stroke="#D97706"
                strokeWidth="3"
              />
              <circle cx="25" cy="10" r="5" fill="#EF4444" />
              <circle cx="50" cy="45" r="4" fill="#3B82F6" />
              <circle cx="75" cy="10" r="5" fill="#10B981" />
            </g>
          )}
        </svg>

        {/* Personality Floating Badges */}
        {isChaotic && (
          <span className="absolute -top-1 -right-2 text-xl animate-bounce" title="Chaotic Energy">
            ⚡
          </span>
        )}
        {isLazy && (
          <span className="absolute top-2 -right-3 text-lg animate-pulse font-mono font-bold text-indigo-400">
            zZz
          </span>
        )}
        {isFoodie && (
          <span className="absolute bottom-0 -left-2 text-xl animate-bounce" title="Always Hungry">
            🐟
          </span>
        )}
        {isCuddly && (
          <span className="absolute top-0 -left-2 text-xl animate-pulse text-rose-500" title="Pure Love">
            💖
          </span>
        )}
      </div>

      <div className="mt-2 text-center">
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-transparent dark:border-amber-800/50">
          <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 animate-ping"></span>
          Live Cat Persona
        </span>
      </div>
    </div>
  );
};
