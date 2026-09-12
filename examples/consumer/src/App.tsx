import { useState } from 'react';
import { Button, Tree, tokens } from '@bemayker/mantsu-design-system';
import type { TreeNode } from '@bemayker/mantsu-design-system';

// Two components from the package, styled only by the Tailwind preset. Tree is
// here because it is the component the apps vendor today: rendering it from the
// package is what shows the package route is a real alternative to vendoring.
const nodes: TreeNode[] = [
  {
    id: 'line-1',
    label: 'Line 1',
    children: [
      { id: 'mixer', label: 'Mixer' },
      { id: 'filler', label: 'Filler' },
    ],
  },
  { id: 'line-2', label: 'Line 2' },
];

export function App() {
  const [clicks, setClicks] = useState(0);

  return (
    <main className="min-h-screen bg-frost p-8 font-sans">
      <h1 className="text-h2 text-midnight">Consumer smoke test</h1>
      <p className="text-body-sm text-slate-600 mt-1">
        No tokens are declared in this app. Every colour below comes from the preset, so an
        unstyled page means the preset is incomplete.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Button onClick={() => setClicks((c) => c + 1)}>Clicked {clicks}×</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="gradient">Gradient</Button>
      </div>

      <div className="mt-8 max-w-sm rounded-md bg-white p-4 shadow-mantsu-sm">
        <Tree nodes={nodes} defaultExpanded={['line-1']} />
      </div>

      <p className="mt-8 text-body-xs text-slate-500">
        midnight from tokens.ts: <code>{tokens.colors.midnight}</code>
      </p>
    </main>
  );
}
