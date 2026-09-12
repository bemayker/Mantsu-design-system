import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import preset from '../tailwind-preset';
import { colors, tokens } from '../tokens/tokens';

// Read from disk rather than importing: the assertions below are about what
// npm will publish, not about a bundler-resolved copy.
const pkg = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'));

// The package contract is what four apps depend on. A rename here is a
// breaking change for all of them, so it is asserted rather than assumed.
describe('package contract', () => {
  it('publishes under the scoped name to GitHub Packages', () => {
    expect(pkg.name).toBe('@bemayker/mantsu-design-system');
    expect(pkg.private).toBeUndefined();
    expect(pkg.publishConfig.registry).toBe('https://npm.pkg.github.com');
    expect(pkg.files).toEqual(['dist']);
  });

  it('keeps react out of the dependency tree of consumers', () => {
    expect(pkg.dependencies).toBeUndefined();
    expect(pkg.peerDependencies).toEqual({ react: '^18.3', 'react-dom': '^18.3' });
  });

  it('exposes the five documented entry points', () => {
    expect(Object.keys(pkg.exports).sort()).toEqual(
      ['.', './icons', './package.json', './styles.css', './tailwind-preset', './tokens'].sort(),
    );
  });
});

describe('tailwind preset', () => {
  it('carries the token colours Tailwind utilities are built from', () => {
    expect(preset.theme.extend.colors.midnight).toBe(colors.midnight);
    expect(preset.theme.extend.colors['primary-blue']).toBe(colors.primaryBlue);
    expect(preset.theme.extend.colors.frost).toBe(colors.frost);
  });

  it('mirrors tokens.ts rather than inventing values', () => {
    expect(preset.theme.extend.backgroundImage['primary-gradient']).toBe(tokens.gradients.primary);
    expect(preset.theme.extend.boxShadow['mantsu-lg']).toBe(tokens.shadows.large);
    expect(preset.theme.extend.borderRadius.md).toBe(tokens.radii.md);
  });
});
