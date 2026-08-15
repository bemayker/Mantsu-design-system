import React from 'react';
import { cn } from './cn';
import { meetsAaOnFill, normalizeHex, readableForeground } from './contrast';

/**
 * ColorSwatchPicker — a swatch grid, an optional labelled default slot, a
 * free hex field and a live preview, for picking one colour.
 *
 * **Presentational and controlled.** It renders no chrome of its own: no
 * modal, no header, no confirm button. Consumers already have a `Modal`,
 * and colours get picked inside drawers and inline panels too, so owning
 * the chrome here would force every consumer into one shape. The parent
 * owns the value and decides what "confirm" means.
 *
 * **The contrast helper is the reason this component exists**, more than
 * the grid is. Every swatch, and the preview, paints a sample glyph in
 * `readableForeground(fill)`, so a consumer gets WCAG-checked swatch text
 * by construction instead of re-deriving it per app and getting it wrong
 * (the usual mistake, Rec. 601 brightness on gamma-encoded channels, is
 * documented in `contrast.ts`). It also warns, without blocking, when a
 * typed colour would not clear AA.
 *
 * **Every label is a prop.** The design system carries no i18n runtime, and
 * a consumer that does must be able to translate what it renders. Nothing
 * here is a hardcoded English string.
 */
export interface ColorSwatchPickerProps {
  /** The current value: a lowercase, `#`-prefixed 6-digit hex, or `null`
   * while the free field holds something that does not parse. The parent
   * typically disables its own confirm control on `null`. */
  value: string | null;
  /** Called on every change with the normalised hex, or `null` when the
   * typed text does not parse. */
  onChange: (hex: string | null) => void;
  /** The swatch grid, as rows. Rendered in order, one grid cell per entry;
   * `columns` controls the layout, not this shape. */
  swatchRows: readonly (readonly string[])[];
  /** Grid columns. Defaults to 6, which fits the common 6x5 palette. */
  columns?: number;
  /** An optional colour rendered as a separate captioned swatch beside the
   * grid, for a palette whose default is not one of its own entries. */
  defaultSwatch?: { color: string; caption: string };
  /** An optional second captioned swatch, for showing the consumer what is
   * currently stored when that value is outside the palette. Render it or
   * not; this component does not decide "outside the palette" for you,
   * because only the consumer knows what its palette is. */
  customSwatch?: { color: string; caption: string };
  labels: {
    /** Accessible name for one swatch. Receives the hex so a consumer can
     * interpolate it. */
    swatch: (hex: string) => string;
    /** Label for the hex field. */
    hex: string;
    /** Accessible name for the live preview. */
    preview: string;
    /** Shown when the typed text does not parse as a 3- or 6-digit hex. */
    invalidHex: string;
    /** Shown, without blocking, when the colour would not clear WCAG AA. */
    contrastWarning: string;
  };
  /** Prefix for every `data-testid` this component renders, so a consumer's
   * existing test ids survive adopting it. `${testIdPrefix}-swatch-24cbad`,
   * `-default`, `-custom`, `-hex`, `-hex-error`, `-preview`,
   * `-contrast-warning`. */
  testIdPrefix?: string;
  /** The glyph previewed inside each swatch, so the foreground contrast is
   * visible rather than merely computed. Defaults to `Aa`. Pass `null` for
   * plain colour chips. */
  sampleGlyph?: string | null;
}

export const ColorSwatchPicker: React.FC<ColorSwatchPickerProps> = ({
  value,
  onChange,
  swatchRows,
  columns = 6,
  defaultSwatch,
  customSwatch,
  labels,
  testIdPrefix = 'color-swatch-picker',
  sampleGlyph = 'Aa',
}) => {
  // The field holds raw text, not the parsed value: a partially typed hex
  // is a legitimate transient state, and echoing the parsed value back
  // would fight the person typing.
  const [hexInput, setHexInput] = React.useState(() => (value ?? '').replace('#', ''));
  // Re-seed only when the parent replaces the value from outside (a fresh
  // open, a reset), never on the change this component itself emitted.
  const lastEmitted = React.useRef<string | null>(value);
  React.useEffect(() => {
    if (value !== lastEmitted.current) {
      setHexInput((value ?? '').replace('#', ''));
      lastEmitted.current = value;
    }
  }, [value]);

  const emit = (raw: string) => {
    setHexInput(raw);
    const parsed = normalizeHex(raw);
    lastEmitted.current = parsed;
    onChange(parsed);
  };

  const selectSwatch = (hex: string) => emit(hex.replace('#', ''));

  const valid = value !== null;
  const hexErrorId = `${testIdPrefix}-hex-error`;

  const swatch = (hex: string, testId: string, label: string) => (
    <button
      key={testId}
      type="button"
      data-testid={testId}
      aria-label={label}
      aria-pressed={value === hex}
      onClick={() => selectSwatch(hex)}
      className={cn(
        'flex h-11 w-11 items-center justify-center rounded-full text-body-xs-emphasis transition-transform hover:scale-110',
        value === hex && 'ring-2 ring-slate-600 ring-offset-1',
      )}
      style={{ backgroundColor: hex, color: readableForeground(hex) }}
    >
      {sampleGlyph}
    </button>
  );

  const captionedSwatch = (hex: string, testId: string, caption: string) => (
    <div key={testId} className="flex flex-col items-center gap-1">
      {swatch(hex, testId, caption)}
      <span className="text-body-xs text-slate-600">{caption}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {swatchRows
          .flat()
          .map((hex) =>
            swatch(hex, `${testIdPrefix}-swatch-${hex.replace('#', '')}`, labels.swatch(hex)),
          )}
      </div>

      {(defaultSwatch || customSwatch) && (
        <div className="flex items-center gap-4">
          {defaultSwatch &&
            captionedSwatch(
              defaultSwatch.color,
              `${testIdPrefix}-default`,
              defaultSwatch.caption,
            )}
          {customSwatch &&
            captionedSwatch(customSwatch.color, `${testIdPrefix}-custom`, customSwatch.caption)}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="rounded-md border border-slate-200 px-3 py-2 text-body-sm-emphasis text-slate-400">
          {labels.hex}
        </div>
        <div className="flex flex-1 items-center gap-1 rounded-md border border-slate-200 px-3 py-2">
          <span className="text-body-sm-emphasis text-slate-400">#</span>
          <input
            data-testid={`${testIdPrefix}-hex`}
            value={hexInput}
            onChange={(event) => emit(event.target.value)}
            maxLength={6}
            aria-label={labels.hex}
            aria-invalid={!valid}
            aria-describedby={!valid ? hexErrorId : undefined}
            className="w-full flex-1 border-none text-body-sm text-midnight outline-none focus:outline-none"
          />
        </div>
        <div
          data-testid={`${testIdPrefix}-preview`}
          aria-label={labels.preview}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-body-xs-emphasis"
          style={value ? { backgroundColor: value, color: readableForeground(value) } : undefined}
        >
          {value ? sampleGlyph : null}
        </div>
      </div>

      {!valid && (
        <p
          id={hexErrorId}
          data-testid={hexErrorId}
          role="alert"
          className="text-body-xs text-error"
        >
          {labels.invalidHex}
        </p>
      )}

      {/* Non-blocking on purpose: a free hex field is the point of having
          one, so this warns rather than refuses. With the true-black
          fallback in `readableForeground` no valid hex reaches this branch
          today; it is here so that a change to the foreground candidates
          surfaces to the person choosing the colour instead of shipping
          illegible text downstream. */}
      {valid && !meetsAaOnFill(value) && (
        <p
          data-testid={`${testIdPrefix}-contrast-warning`}
          role="status"
          className="text-body-xs text-warning"
        >
          {labels.contrastWarning}
        </p>
      )}
    </div>
  );
};

export default ColorSwatchPicker;
