/**
 * WCAG 2.1 relative luminance, contrast ratio, and a correct "best of
 * near-black or white" foreground picker.
 *
 * This exists in the design system because every consumer that paints text
 * on a user-chosen fill needs the same answer, and the naive version is
 * wrong in a way that is invisible until someone on a shop floor cannot
 * read a tile. The common mistake is computing Rec. 601 broadcast
 * brightness on gamma-encoded sRGB channels and calling it luminance. That
 * heuristic gets `#3b82f6` wrong: it picks white (3.68:1, fails AA) where
 * black scores 5.07:1 (passes).
 *
 * `ColorSwatchPicker` calls `readableForeground` for every swatch, so a
 * consumer gets legible swatch text by construction rather than deriving
 * it again, and getting it wrong again, in each app.
 *
 * **The near-black band.** `#0c1222` is the `neutral-950` token, and its
 * real relative luminance is `~0.00626`, not zero. Re-deriving the
 * black-vs-white tie point with that value gives a worst case of `~4.32:1`,
 * below the 4.5:1 AA threshold, for fills whose own luminance sits in
 * `~0.183-0.203` (e.g. `#2772f9`). Inside that band, and only there,
 * `readableForeground` falls back to true black, which restores the full
 * 4.583:1 worst case and makes "no fill can produce illegible text" exactly
 * true rather than nearly true. The fallback swaps `#0c1222` for `#000000`
 * on roughly 2% of the luminance range: indistinguishable to the eye, not
 * indistinguishable to the contrast ratio. Darkening the token itself would
 * repaint surfaces that have nothing to do with colour fills, so it is not
 * the fix.
 */

const NEAR_BLACK = '#0c1222';
const BLACK = '#000000';
const WHITE = '#ffffff';

/** WCAG 2.1 AA for normal-size text. */
export const AA_CONTRAST_THRESHOLD = 4.5;

function hexToRgb(hex: string): [number, number, number] {
  const normalised = hex.startsWith('#') ? hex.slice(1) : hex;
  const r = Number.parseInt(normalised.slice(0, 2), 16);
  const g = Number.parseInt(normalised.slice(2, 4), 16);
  const b = Number.parseInt(normalised.slice(4, 6), 16);
  return [r, g, b];
}

/** WCAG 2.1 gamma-decoding of one sRGB channel (0-255) into linear light. */
function linearise(channel: number): number {
  const fraction = channel / 255;
  return fraction <= 0.03928 ? fraction / 12.92 : Math.pow((fraction + 0.055) / 1.055, 2.4);
}

/** WCAG 2.1 relative luminance of a 6-digit hex colour (`#`-prefix
 * optional), `0` (black) to `1` (white). */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * linearise(r) + 0.7152 * linearise(g) + 0.0722 * linearise(b);
}

/** WCAG 2.1 contrast ratio between two colours, `1` (no contrast) to `21`
 * (black on white). Symmetric: argument order does not matter. */
export function contrastRatio(a: string, b: string): number {
  const luminanceA = relativeLuminance(a);
  const luminanceB = relativeLuminance(b);
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * The foreground that yields the highest WCAG contrast ratio against
 * `fill`: near-black `#0c1222`, white `#ffffff`, or true black `#000000`
 * as the tie-breaker in the narrow band where neither of the first two
 * clears AA (see the module docstring).
 *
 * The guarantee: **no syntactically valid hex fill produces sub-AA text.**
 * The worst case over the whole sRGB cube is 4.583:1.
 */
export function readableForeground(fill: string): string {
  const nearBlackContrast = contrastRatio(fill, NEAR_BLACK);
  const whiteContrast = contrastRatio(fill, WHITE);
  const best = nearBlackContrast >= whiteContrast ? NEAR_BLACK : WHITE;

  if (Math.max(nearBlackContrast, whiteContrast) >= AA_CONTRAST_THRESHOLD) {
    return best;
  }
  // Only reachable in the ~0.183-0.203 luminance band. True black beats
  // `#0c1222` by just enough to clear AA there, and only there.
  return contrastRatio(fill, BLACK) > Math.max(nearBlackContrast, whiteContrast) ? BLACK : best;
}

/**
 * Whether `fill` renders AA-compliant text with the foreground
 * `readableForeground` picks for it.
 *
 * `true` for every valid hex today, which is the point: `ColorSwatchPicker`
 * calls it so that a future change to the foreground candidates surfaces as
 * a visible warning to the person choosing the colour, instead of as
 * silently illegible text downstream. A check that can no longer fire is
 * cheap; discovering that it should have been there is not.
 */
export function meetsAaOnFill(fill: string): boolean {
  return contrastRatio(readableForeground(fill), fill) >= AA_CONTRAST_THRESHOLD;
}

const THREE_CHAR = /^#?([0-9a-fA-F]{3})$/;
const SIX_CHAR = /^#?([0-9a-fA-F]{6})$/;

/**
 * Normalises a hex colour typed with or without a leading `#`, in 3- or
 * 6-character shorthand, in any case, into a lowercase, `#`-prefixed
 * 6-character hex. `normalizeHex('abc')`, `normalizeHex('#ABC')` and
 * `normalizeHex('#AABBCC')` all return `'#aabbcc'`. Anything of the wrong
 * length or containing a non-hex character, including blank or
 * whitespace-only input, returns `null`.
 *
 * Lives beside the contrast helpers rather than in its own module because
 * `ColorSwatchPicker` is the only thing that needs it, and it needs both.
 */
export function normalizeHex(input: string): string | null {
  const trimmed = input.trim();

  const threeCharMatch = THREE_CHAR.exec(trimmed);
  if (threeCharMatch) {
    const [r, g, b] = threeCharMatch[1].toLowerCase().split('');
    return `#${r}${r}${g}${g}${b}${b}`;
  }

  const sixCharMatch = SIX_CHAR.exec(trimmed);
  if (sixCharMatch) {
    return `#${sixCharMatch[1].toLowerCase()}`;
  }

  return null;
}
