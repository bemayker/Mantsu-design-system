import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ColorSwatchPicker } from '../components/ColorSwatchPicker';
import { contrastRatio, readableForeground } from '../components/contrast';

const meta: Meta = { title: 'Components/ColorSwatchPicker', tags: ['autodocs'] };
export default meta;

const PALETTE: readonly (readonly string[])[] = [
  ['#2a4365', '#2b6cb0', '#4299e1', '#63b3ed', '#90cdf4', '#bee3f8'],
  ['#702459', '#b83280', '#ed64a6', '#f687b3', '#fbb6ce', '#fed7e2'],
  ['#22543d', '#2f855a', '#48bb78', '#68d391', '#9ae6b4', '#c6f6d5'],
  ['#7b341e', '#c05621', '#ed8936', '#f6ad55', '#fbd38d', '#feebc8'],
  ['#44337a', '#6b46c1', '#9f7aea', '#b794f4', '#d6bcfa', '#e9d8fd'],
];

const LABELS = {
  swatch: (hex: string) => `Use colour ${hex}`,
  hex: 'Hex',
  preview: 'Selected colour preview',
  invalidHex: 'Enter a 3- or 6-digit hex colour.',
  contrastWarning: 'This colour may be hard to read at small sizes.',
};

function Controlled({ initial = '#4299e1' as string | null, ...rest }) {
  const [value, setValue] = React.useState<string | null>(initial);
  return (
    <div className="w-[28rem]">
      <ColorSwatchPicker
        value={value}
        onChange={setValue}
        swatchRows={PALETTE}
        labels={LABELS}
        {...rest}
      />
      <p className="mt-4 text-body-sm text-slate-600">
        Value: <code>{value ?? 'null (not a valid hex)'}</code>
      </p>
    </div>
  );
}

export const Default: StoryObj = {
  render: () => <Controlled />,
};

/** A palette whose default colour is not one of its own swatches gets a
 * separate captioned slot, rather than being smuggled into the grid. */
export const WithDefaultSwatch: StoryObj = {
  render: () => (
    <Controlled defaultSwatch={{ color: '#24cbad', caption: 'Default' }} initial="#24cbad" />
  ),
};

/** When the stored colour is outside the palette, show the person what is
 * actually saved today rather than silently rendering nothing selected. */
export const WithCustomSwatch: StoryObj = {
  render: () => (
    <Controlled
      initial="#8b5cf6"
      defaultSwatch={{ color: '#24cbad', caption: 'Default' }}
      customSwatch={{ color: '#8b5cf6', caption: 'Current' }}
    />
  ),
};

/** The free field accepts 3-character shorthand and normalises it: type
 * `2ca` and the value becomes `#22cccc`. Anything else yields `null` and an
 * inline error, and the consumer disables its own confirm control. */
export const InvalidHex: StoryObj = {
  render: () => <Controlled initial={null} />,
};

/** Plain chips, for a consumer picking a colour with no text on it. */
export const WithoutSampleGlyph: StoryObj = {
  render: () => <Controlled sampleGlyph={null} />,
};

/**
 * The point of the component, made visible. Every swatch paints its glyph
 * in `readableForeground(fill)`, so a consumer cannot ship illegible swatch
 * text by forgetting to think about it. The naive Rec. 601 brightness
 * heuristic picks white on `#3b82f6` (3.68:1, fails AA) where this picks
 * black (5.07:1, passes).
 */
export const ContrastIsComputedNotGuessed: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-2">
      {['#3b82f6', '#2772f9', '#fbd38d', '#22543d', '#ffffff', '#000000'].map((fill) => (
        <div key={fill} className="flex items-center gap-3">
          <span
            className="flex h-11 w-24 items-center justify-center rounded-md text-body-xs-emphasis"
            style={{ backgroundColor: fill, color: readableForeground(fill) }}
          >
            {fill}
          </span>
          <span className="text-body-sm text-slate-600">
            foreground <code>{readableForeground(fill)}</code>, ratio{' '}
            {contrastRatio(fill, readableForeground(fill)).toFixed(2)}:1
          </span>
        </div>
      ))}
    </div>
  ),
};
