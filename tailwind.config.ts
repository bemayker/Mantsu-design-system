import type { Config } from 'tailwindcss';
import preset from './src/tailwind-preset';

// This repo renders Storybook from the same preset the apps consume, so the
// theme has exactly one definition: src/tailwind-preset.ts, which mirrors
// src/tokens/tokens.ts. Do not re-declare colours or type scale here.
export default {
  presets: [preset as Partial<Config>],
  content: ['./src/**/*.{ts,tsx,mdx}', './.storybook/**/*.{ts,tsx}'],
} satisfies Config;
