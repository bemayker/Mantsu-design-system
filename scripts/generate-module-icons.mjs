/**
 * Regenerates src/components/icons/Module*.tsx from the design handoff's icon
 * sheet. The paths are Mantsu's own module marks and are 9 KB of coordinates:
 * hand-transcribing them once is a typo waiting to happen, and hand-updating
 * them when the asset changes is worse. Run this instead.
 *
 *   node scripts/generate-module-icons.mjs [path-to-mantsu-module-icons.svg]
 *
 * Default source: ../design_handoff_menu_unification/assets/mantsu-module-icons.svg
 * relative to this repo, which is where the handoff sits on a dev machine.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DEFAULT_SOURCE = resolve(
  process.cwd(),
  '../design_handoff_menu_unification/assets/mantsu-module-icons.svg',
);

const COMPONENTS = {
  cockpit: { component: 'ModuleCockpit', label: 'Order cockpit' },
  downtimes: { component: 'ModuleDowntimes', label: 'Downtimes' },
  lists: { component: 'ModuleLists', label: 'Lists' },
  reporting: { component: 'ModuleReporting', label: 'Ask Mantsu' },
};

const source = resolve(process.argv[2] ?? DEFAULT_SOURCE);
// The handoff assets carry a large c2pa manifest; it is provenance for the
// asset, not part of the artwork, and must not end up in the bundle.
const svg = readFileSync(source, 'utf8').replace(/<metadata>[\s\S]*?<\/metadata>/g, '');

const found = new Set();
for (const match of svg.matchAll(/<symbol id="mod-([a-z]+)" viewBox="([^"]+)">([\s\S]*?)<\/symbol>/g)) {
  const [, key, viewBox, body] = match;
  const spec = COMPONENTS[key];
  if (!spec) {
    console.warn(`Skipping unknown symbol #mod-${key}: add it to COMPONENTS first.`);
    continue;
  }

  const paths = [...body.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
  const fills = [...body.matchAll(/<path [^>]*fill="([^"]+)"/g)].map((m) => m[1]);
  // A hardcoded fill would render invisible on the navy rail, so this is a hard
  // failure rather than a warning.
  if (paths.length === 0) throw new Error(`#mod-${key} has no paths.`);
  if (fills.length !== paths.length || fills.some((f) => f !== 'currentColor')) {
    throw new Error(`#mod-${key} has a path that is not fill="currentColor".`);
  }

  const file = `import React from 'react';
import type { IconProps } from './IconProps';

/**
 * ${spec.label} module icon.
 *
 * Generated from \`design_handoff_menu_unification/assets/mantsu-module-icons.svg\`
 * (symbol \`#mod-${key}\`) by \`scripts/generate-module-icons.mjs\`. Mantsu's own mark,
 * flattened from its gradient original to a single colour so the rail can render
 * it white. Do not hand-edit: re-run the script against a new asset instead.
 */
export const ${spec.component}: React.FC<IconProps> = ({ size = 20, className, title }) => (
  <svg
    viewBox="${viewBox}"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
    role={title ? 'img' : undefined}
    aria-hidden={title ? undefined : true}
    focusable="false"
  >
    {title ? <title>{title}</title> : null}
${paths.map((d) => `    <path d="${d}" />`).join('\n')}
  </svg>
);

export default ${spec.component};
`;

  writeFileSync(`src/components/icons/${spec.component}.tsx`, file);
  found.add(key);
  console.log(`wrote ${spec.component} (${paths.length} paths)`);
}

const missing = Object.keys(COMPONENTS).filter((key) => !found.has(key));
if (missing.length > 0) throw new Error(`Source has no symbol for: ${missing.join(', ')}`);
