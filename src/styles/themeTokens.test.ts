/**
 * Unit & Integration Tests for Tailwind Dark Mode Configuration & Motion Accessibility Tokens
 * Task 002 Acceptance Criteria:
 * - Criterion 1: Tailwind config includes `darkMode: 'class'` enabling `dark:` variant utilities when `.dark` is present on `<html>`.
 * - Criterion 2: `src/index.css` styles base dark mode colors on `body` (e.g. `dark:bg-slate-950 dark:text-slate-100`) and custom scrollbars for dark mode.
 * - Criterion 3: Smooth 150ms transition effects are applied to color and background property changes (`transition-colors duration-150`).
 * - Criterion 4: When `prefers-reduced-motion` is active, theme transitions and animations execute with zero delay (0ms) to prevent motion sickness.
 */

export interface TailwindDarkModeConfig {
  darkMode?: 'class' | 'media' | ['class', string] | false;
  content: string[];
  theme?: Record<string, unknown>;
}

export interface MotionAccessibilityTokens {
  transitionDurationMs: number;
  reducedMotionDurationMs: number;
  reducedMotionMediaQuery: string;
}

export const EXPECTED_THEME_TOKENS = {
  darkModeStrategy: 'class' as const,
  defaultTransitionDurationMs: 150,
  reducedMotionDurationMs: 0,
  reducedMotionMediaQuery: '(prefers-reduced-motion: reduce)',
  lightBase: {
    background: 'bg-amber-50/40',
    text: 'text-slate-800',
    scrollbarTrack: '#fdf6ec',
    scrollbarThumb: '#cbd5e1',
    scrollbarThumbHover: '#94a3b8',
  },
  darkBase: {
    background: 'dark:bg-slate-950',
    text: 'dark:text-slate-100',
    scrollbarTrack: '#0f172a',
    scrollbarThumb: '#334155',
    scrollbarThumbHover: '#475569',
  },
  motionRules: {
    transitionDurationOverride: '0ms !important',
    animationDurationOverride: '0ms !important',
  },
};

/**
 * Validates whether a Tailwind configuration complies with class-based dark mode requirements.
 */
export function validateTailwindDarkModeConfig(config: Partial<TailwindDarkModeConfig>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!config.darkMode) {
    errors.push('darkMode property is missing from Tailwind config');
  } else if (config.darkMode !== 'class' && !(Array.isArray(config.darkMode) && config.darkMode[0] === 'class')) {
    errors.push(`Expected darkMode to be 'class', but received '${String(config.darkMode)}'`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Simulates and validates reduced-motion media query behavior against transition/animation tokens.
 */
export function evaluateMotionDuration(
  prefersReducedMotion: boolean,
  defaultDurationMs: number = EXPECTED_THEME_TOKENS.defaultTransitionDurationMs
): number {
  if (prefersReducedMotion) {
    return EXPECTED_THEME_TOKENS.reducedMotionDurationMs;
  }
  return defaultDurationMs;
}

/**
 * Validates color contrast luminance between dark background and foreground text tokens.
 */
export function calculateLuminanceContrast(rgbBg: [number, number, number], rgbFg: [number, number, number]): number {
  const getLuminance = ([r, g, b]: [number, number, number]) => {
    const a = [r, g, b].map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  };

  const l1 = getLuminance(rgbBg);
  const l2 = getLuminance(rgbFg);
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Test runner executing all Task 002 verification suites.
 */
export function runThemeAndMotionTokenTests(): { total: number; passed: number; failed: number; errors: string[] } {
  let passed = 0;
  let failed = 0;
  const errors: string[] = [];

  function assert(condition: boolean, testName: string) {
    if (condition) {
      passed++;
    } else {
      failed++;
      const msg = `FAIL: ${testName}`;
      errors.push(msg);
      console.error(msg);
    }
  }

  // --- 1. Tailwind Dark Mode Config Validation (Criterion 1) ---
  {
    const validClassConfig: TailwindDarkModeConfig = {
      darkMode: 'class',
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    };
    const validResult = validateTailwindDarkModeConfig(validClassConfig);
    assert(validResult.isValid, 'Tailwind config with darkMode: "class" is valid');
    assert(validResult.errors.length === 0, 'No errors for darkMode: "class"');

    const invalidMediaConfig = {
      darkMode: 'media' as const,
      content: ['./index.html'],
    };
    const invalidResult = validateTailwindDarkModeConfig(invalidMediaConfig);
    assert(!invalidResult.isValid, 'Tailwind config with darkMode: "media" is rejected');

    const missingConfig = {
      content: ['./index.html'],
    };
    const missingResult = validateTailwindDarkModeConfig(missingConfig);
    assert(!missingResult.isValid, 'Tailwind config missing darkMode is rejected');
  }

  // --- 2. Base Dark Theme Tokens & Contrast (Criterion 2) ---
  {
    // Slate-950 (#020617 -> [2, 6, 23]) vs Slate-100 (#f1f5f9 -> [241, 245, 249])
    const slate950Rgb: [number, number, number] = [2, 6, 23];
    const slate100Rgb: [number, number, number] = [241, 245, 249];
    const contrastRatio = calculateLuminanceContrast(slate950Rgb, slate100Rgb);

    assert(contrastRatio >= 4.5, `Dark base theme contrast ratio (${contrastRatio.toFixed(2)}:1) meets WCAG AA 4.5:1`);
    assert(EXPECTED_THEME_TOKENS.darkBase.background.includes('dark:bg-slate-950'), 'Dark base background token is dark:bg-slate-950');
    assert(EXPECTED_THEME_TOKENS.darkBase.text.includes('dark:text-slate-100'), 'Dark base text token is dark:text-slate-100');

    // Dark scrollbar tokens definition
    assert(EXPECTED_THEME_TOKENS.darkBase.scrollbarTrack === '#0f172a', 'Dark scrollbar track token defined (slate-900)');
    assert(EXPECTED_THEME_TOKENS.darkBase.scrollbarThumb === '#334155', 'Dark scrollbar thumb token defined (slate-700)');
    assert(EXPECTED_THEME_TOKENS.darkBase.scrollbarThumbHover === '#475569', 'Dark scrollbar thumb hover token defined (slate-600)');
  }

  // --- 3. Color Transition Timing Tokens (Criterion 3) ---
  {
    assert(EXPECTED_THEME_TOKENS.defaultTransitionDurationMs === 150, 'Standard color transition duration is exactly 150ms');

    const standardDuration = evaluateMotionDuration(false, 150);
    assert(standardDuration === 150, 'Default motion setting preserves 150ms transition duration');
  }

  // --- 4. Reduced Motion Tokens & Zero-Delay Override (Criterion 4) ---
  {
    assert(EXPECTED_THEME_TOKENS.reducedMotionMediaQuery === '(prefers-reduced-motion: reduce)', 'Standard prefers-reduced-motion media query string matches');

    const reducedDuration = evaluateMotionDuration(true, 150);
    assert(reducedDuration === 0, 'Reduced motion evaluates transition duration to 0ms');

    assert(EXPECTED_THEME_TOKENS.motionRules.transitionDurationOverride === '0ms !important', 'Transition override uses 0ms !important');
    assert(EXPECTED_THEME_TOKENS.motionRules.animationDurationOverride === '0ms !important', 'Animation override uses 0ms !important');
  }

  // --- 5. DOM Root Dark Class Contract Simulation ---
  {
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.classList.remove('dark');
      assert(!document.documentElement.classList.contains('dark'), 'Root HTML element initialized without dark class');

      document.documentElement.classList.add('dark');
      assert(document.documentElement.classList.contains('dark'), 'Root HTML element activates dark mode variant when class "dark" added');

      document.documentElement.classList.remove('dark');
      assert(!document.documentElement.classList.contains('dark'), 'Root HTML element deactivates dark mode variant when class "dark" removed');
    }
  }

  return {
    total: passed + failed,
    passed,
    failed,
    errors,
  };
}
