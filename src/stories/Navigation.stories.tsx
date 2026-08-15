import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tabs } from '../components/Tabs';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Sidebar } from '../components/Sidebar';
import { TopNavBar } from '../components/TopNavBar';
import { Tree, filterTree, type TreeNode } from '../components/Tree';

const meta: Meta = { title: 'Components/Navigation', tags: ['autodocs'] };
export default meta;

/** Small square icon used to evoke an equipment/asset node, matching the Figma demo. */
const NodeIcon = () => (
  <span className="flex size-5 items-center justify-center rounded-sm bg-primary-neutral text-white">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </svg>
  </span>
);

const plantHierarchy: TreeNode[] = [
  {
    id: 'site', label: 'Site Bruges', icon: <NodeIcon />,
    children: [
      {
        id: 'b1', label: 'Building 1', icon: <NodeIcon />,
        children: [
          {
            id: 'f1', label: 'Floor 1',
            children: [
              {
                id: 'z1', label: 'Zone A',
                children: [
                  { id: 'e1', label: 'Mixer M-101', icon: <NodeIcon /> },
                  { id: 'e2', label: 'Conveyor C-204', icon: <NodeIcon /> },
                ],
              },
              { id: 'z2', label: 'Zone B' },
            ],
          },
          { id: 'f2', label: 'Floor 2' },
        ],
      },
      {
        id: 'b2', label: 'Building 2', icon: <NodeIcon />,
        children: [
          { id: 'z3', label: 'Zone C' },
          { id: 'z4', label: 'Zone D' },
        ],
      },
    ],
  },
];

/** Same hierarchy enriched with subtitles and custom-colour status circles. */
const assetStatus: TreeNode[] = [
  {
    id: 'site', label: 'Site Bruges', subtitle: '3 lines · 12 assets', color: '#155799',
    children: [
      {
        id: 'l1', label: 'Line 1 — Packaging', subtitle: 'Running', color: '#10b981',
        children: [
          { id: 'm1', label: 'Mixer M-101', subtitle: 'OEE 92%', color: '#10b981' },
          { id: 'm2', label: 'Conveyor C-204', subtitle: 'Maintenance due', color: '#f59e0b' },
        ],
      },
      {
        id: 'l2', label: 'Line 2 — Filling', subtitle: 'Stopped', color: '#f43f5e',
        children: [
          { id: 'm3', label: 'Filler F-300', subtitle: 'Fault: E-12', color: '#f43f5e' },
          { id: 'm4', label: 'Capper K-110', subtitle: 'Idle', color: '#94a3b8' },
        ],
      },
    ],
  },
];

export const TabsExample: StoryObj = {
  render: () => (
    <Tabs items={[
      { id: 'config', label: 'Configuration' },
      { id: 'exec', label: 'Execution' },
      { id: 'report', label: 'Reporting' },
      { id: 'archive', label: 'Archive', disabled: true },
    ]} defaultValue="config" />
  ),
};
export const BreadcrumbsExample: StoryObj = {
  render: () => (
    <Breadcrumbs items={[
      { label: 'Plant A', href: '#' },
      { label: 'Lines', href: '#' },
      { label: 'Line 3' },
    ]} />
  ),
};
export const SidebarExample: StoryObj = {
  render: () => (
    <div className="h-[420px]">
      <Sidebar
        header={<span className="text-h4 text-white">Mantsu</span>}
        items={[
          { id: 'dash', label: 'Dashboard' },
          { id: 'recipes', label: 'Recipes' },
          { id: 'templates', label: 'Templates' },
        ]}
        activeId="recipes"
      />
    </div>
  ),
};
export const TopNavBarExample: StoryObj = {
  render: () => (
    <TopNavBar title="Production Orders"
      right={<span className="h-9 w-9 rounded-full bg-frost" />} />
  ),
};
/** Default hybrid look: chevron caret, no connector lines, single selection. */
export const TreeExample: StoryObj = {
  render: () => {
    const [selected, setSelected] = useState('e1');
    return (
      <div className="w-72">
        <Tree
          defaultExpanded={['site', 'b1', 'f1', 'z1', 'b2']}
          selectedId={selected}
          onSelect={setSelected}
          nodes={plantHierarchy}
        />
      </div>
    );
  },
};

/** Figma-style connector / guide lines enabled via `showLines`. */
export const TreeWithLines: StoryObj = {
  render: () => {
    const [selected, setSelected] = useState('z1');
    return (
      <div className="w-72">
        <Tree
          showLines
          defaultExpanded={['site', 'b1', 'f1', 'z1', 'b2']}
          selectedId={selected}
          onSelect={setSelected}
          nodes={plantHierarchy}
        />
      </div>
    );
  },
};

/** Title + subtitle rows with custom-colour status circles. */
export const TreeWithSubtitlesAndStatus: StoryObj = {
  render: () => {
    const [selected, setSelected] = useState('m1');
    return (
      <div className="w-80">
        <Tree
          defaultExpanded={['site', 'l1', 'l2']}
          selectedId={selected}
          onSelect={setSelected}
          nodes={assetStatus}
        />
      </div>
    );
  },
};

/**
 * A downtime reason tree: three levels, so `'cascade'` has a real subtree to sweep and
 * `'self'` has a real parent-without-children state to express.
 */
const reasonCodes: TreeNode[] = [
  {
    id: 'technical', label: 'Technical',
    children: [
      {
        id: 'mechanical', label: 'Mechanical',
        children: [
          { id: 'belt-slip', label: 'Belt slip' },
          { id: 'bearing', label: 'Bearing failure' },
        ],
      },
      { id: 'electrical', label: 'Electrical' },
    ],
  },
  {
    id: 'organisational', label: 'Organisational',
    children: [
      { id: 'no-material', label: 'No material' },
      { id: 'no-operator', label: 'No operator' },
    ],
  },
];

/** Multi-selection with tri-state checkboxes. */
export const TreeWithCheckboxes: StoryObj = {
  render: () => {
    const [checked, setChecked] = useState<string[]>(['m1']);
    return (
      <div className="w-72">
        <Tree
          checkable
          checkedIds={checked}
          onCheckedChange={setChecked}
          defaultExpanded={['site', 'b1', 'f1', 'z1', 'b2']}
          nodes={plantHierarchy}
        />
      </div>
    );
  },
};

/**
 * `checkStrategy` (DS-6): the same tree, the same clicks, two different meanings.
 *
 * **Left, `'cascade'` (the default).** The tree is a hierarchy of containment. Check
 * `Mechanical` and its whole subtree comes with it; uncheck one child and the parent
 * drops to `indeterminate`. Right for "select this branch and everything under it".
 *
 * **Right, `'self'`.** The tree is a browsing structure over a flat set. Check
 * `Mechanical` and *only* `Mechanical` is checked — its children stay exactly as they
 * were, and no node ever renders `indeterminate`. Right when a parent and its children
 * are independently meaningful choices.
 *
 * The concrete case that forced this prop: mantsu-downtimes assigns reason codes to a
 * machine, and a machine may be assigned a parent reason WITHOUT its children. Under
 * `'cascade'` that state cannot be expressed at all. Click `Mechanical` on both sides
 * and compare the two id lists underneath to see it.
 *
 * `'cascade'` is the default, so nothing changes for a consumer that does not pass the
 * prop.
 */
export const TreeCheckStrategy: StoryObj = {
  render: () => {
    const [cascadeChecked, setCascadeChecked] = useState<string[]>([]);
    const [selfChecked, setSelfChecked] = useState<string[]>([]);
    const expanded = ['technical', 'mechanical', 'organisational'];

    return (
      <div className="flex gap-8">
        <div className="w-72 space-y-2">
          <p className="text-body-sm-emphasis text-primary-neutral">
            checkStrategy="cascade" (default)
          </p>
          <Tree
            checkable
            checkStrategy="cascade"
            checkedIds={cascadeChecked}
            onCheckedChange={setCascadeChecked}
            defaultExpanded={expanded}
            nodes={reasonCodes}
          />
          <p className="text-body-xs text-slate-500">
            checked: {cascadeChecked.length ? cascadeChecked.join(', ') : '(none)'}
          </p>
        </div>

        <div className="w-72 space-y-2">
          <p className="text-body-sm-emphasis text-primary-neutral">checkStrategy="self"</p>
          <Tree
            checkable
            checkStrategy="self"
            checkedIds={selfChecked}
            onCheckedChange={setSelfChecked}
            defaultExpanded={expanded}
            nodes={reasonCodes}
          />
          <p className="text-body-xs text-slate-500">
            checked: {selfChecked.length ? selfChecked.join(', ') : '(none)'}
          </p>
        </div>
      </div>
    );
  },
};

/** Built-in search/filter that expands matching branches. */
export const TreeSearchable: StoryObj = {
  render: () => {
    const [selected, setSelected] = useState('');
    return (
      <div className="w-72">
        <Tree
          searchable
          searchPlaceholder="Search locations…"
          selectedId={selected}
          onSelect={setSelected}
          nodes={plantHierarchy}
        />
      </div>
    );
  },
};

/**
 * `searchQuery` / `onSearchQueryChange` (DS-5): the search box lives outside the tree.
 *
 * `searchable` only decides whether the component renders its OWN input. Filtering runs
 * off `searchQuery` either way — so a consumer can put the search box in its own toolbar,
 * next to unrelated controls, and still get identical ancestor-preserving filtering.
 * Note this tree has `searchable` OFF and still filters.
 *
 * Because the query is now the consumer's state, it can also be reset from outside, which
 * is what an app needs when the thing being browsed is swapped out underneath the tree.
 * `filterTree` is exported alongside, so the count below is the component's own matcher
 * rather than a second, subtly different one.
 */
export const TreeControlledSearch: StoryObj = {
  render: () => {
    const [query, setQuery] = useState('bel');
    const matches = filterTree(reasonCodes, query).nodes;

    return (
      <div className="w-72 space-y-2">
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="My own toolbar input…"
            className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-body-sm outline-none"
          />
          <button
            onClick={() => setQuery('')}
            className="shrink-0 rounded-md border border-slate-200 px-2.5 text-body-sm"
          >
            Clear
          </button>
        </div>
        <Tree
          searchQuery={query}
          onSearchQueryChange={setQuery}
          defaultExpanded={['technical', 'mechanical', 'organisational']}
          nodes={reasonCodes}
        />
        <p className="text-body-xs text-slate-500">
          filterTree(): {matches.length} root branch(es) kept
        </p>
      </div>
    );
  },
};

/**
 * `expandOnSelect` (DS-4) and `labels` (DS-3).
 *
 * **Left, the default.** Clicking a row both selects it and toggles it open, which is
 * right when opening a branch IS the point of clicking it.
 *
 * **Right, `expandOnSelect={false}`.** Clicking a row only selects it; the chevron is the
 * only way to expand. Right when selecting a node and opening it are different
 * intentions — a master/detail screen where selecting a branch loads it into a form.
 * The keyboard `Enter`/`Space` path follows the mouse, so the two do not disagree.
 *
 * The right-hand tree also passes `labels`, so its chevron reads "Ouvrir"/"Fermer" to a
 * screen reader and its empty state is French. Every key is optional and falls back to
 * the English literal that used to be hardcoded — search for "gibberish" on the left tree
 * to see the untranslated default.
 */
export const TreeExpandOnSelectAndLabels: StoryObj = {
  render: () => {
    const [defaultSelected, setDefaultSelected] = useState('');
    const [decoupledSelected, setDecoupledSelected] = useState('');

    return (
      <div className="flex gap-8">
        <div className="w-72 space-y-2">
          <p className="text-body-sm-emphasis text-primary-neutral">
            expandOnSelect (default: true)
          </p>
          <Tree
            searchable
            selectedId={defaultSelected}
            onSelect={setDefaultSelected}
            nodes={reasonCodes}
          />
          <p className="text-body-xs text-slate-500">selected: {defaultSelected || '(none)'}</p>
        </div>

        <div className="w-72 space-y-2">
          <p className="text-body-sm-emphasis text-primary-neutral">
            expandOnSelect={'{false}'} + French labels
          </p>
          <Tree
            searchable
            expandOnSelect={false}
            testId="reason-tree"
            labels={{
              expand: 'Ouvrir',
              collapse: 'Fermer',
              noResults: 'Aucun résultat',
              searchPlaceholder: 'Rechercher…',
            }}
            selectedId={decoupledSelected}
            onSelect={setDecoupledSelected}
            nodes={reasonCodes}
          />
          <p className="text-body-xs text-slate-500">selected: {decoupledSelected || '(none)'}</p>
        </div>
      </div>
    );
  },
};

/** Right-click any node for a context menu. */
export const TreeWithContextMenu: StoryObj = {
  render: () => {
    const [selected, setSelected] = useState('z1');
    const [log, setLog] = useState('Right-click a node…');
    return (
      <div className="w-72 space-y-2">
        <Tree
          defaultExpanded={['site', 'b1', 'f1', 'z1']}
          selectedId={selected}
          onSelect={setSelected}
          nodes={plantHierarchy}
          contextMenuItems={() => [
            { label: 'Rename', onClick: (n) => setLog(`Rename ${n.label}`) },
            { label: 'Add child', onClick: (n) => setLog(`Add child to ${n.label}`) },
            { label: 'Delete', danger: true, onClick: (n) => setLog(`Delete ${n.label}`) },
          ]}
        />
        <p className="text-body-xs text-slate-500">{log}</p>
      </div>
    );
  },
};

/** Drag a node onto another (top/middle/bottom = before / inside / after). */
export const TreeDraggable: StoryObj = {
  render: () => {
    const [log, setLog] = useState('Drag a node…');
    return (
      <div className="w-72 space-y-2">
        <Tree
          draggable
          showLines
          defaultExpanded={['site', 'b1', 'f1', 'z1', 'b2']}
          nodes={plantHierarchy}
          onMove={({ dragId, targetId, position }) =>
            setLog(`Move ${dragId} ${position} ${targetId}`)}
        />
        <p className="text-body-xs text-slate-500">{log}</p>
      </div>
    );
  },
};

/**
 * `archived` vs `disabled` (DS-1 / DS-8 / DS-9).
 *
 * Two flags that look interchangeable and are not. `disabled` means "not a thing you can
 * act on": no selection, no checking, no dragging, and a parent's cascade check skips it
 * and its whole subtree. `archived` means "retired but still real": muted, and neither
 * draggable nor a drop target, but still selectable — which is what a restore flow needs,
 * and the reason an app cannot express "archived" by setting `disabled`.
 *
 * Try it: `Old line B` cannot be dragged and nothing can be dropped onto it, but clicking
 * it still selects it. `Decommissioned zone` cannot be selected at all.
 */
const archivedAndDisabled: TreeNode[] = [
  {
    id: 'site',
    label: 'Ghent site',
    children: [
      { id: 'line-a', label: 'Line A' },
      { id: 'line-b', label: 'Old line B', archived: true },
      { id: 'zone-x', label: 'Decommissioned zone', disabled: true, children: [
        { id: 'zone-x-1', label: 'Mixer (unreachable)' },
      ] },
    ],
  },
];

export const TreeArchivedVsDisabled: StoryObj = {
  render: () => {
    const [log, setLog] = useState('Select or drag a node…');
    return (
      <div className="w-80 space-y-2">
        <Tree
          draggable
          showLines
          defaultExpanded={['site', 'zone-x']}
          nodes={archivedAndDisabled}
          onSelect={(id) => setLog(`Selected ${id}`)}
          onMove={({ dragId, targetId, position }) =>
            setLog(`Move ${dragId} ${position} ${targetId}`)}
        />
        <p className="text-body-xs text-slate-500">{log}</p>
      </div>
    );
  },
};

/**
 * The cascade check skips `disabled` nodes and their subtree (DS-9).
 *
 * Check `Ghent site`. `Decommissioned zone` and the mixer beneath it stay unchecked,
 * while everything else is swept up. Before this, a direct check on a disabled node was
 * refused but a check on its PARENT pulled it in anyway — the guard held exactly where a
 * user could see it and nowhere else.
 *
 * `Old line B` IS checked, because `archived` does not block checking.
 */
export const TreeCascadeSkipsDisabled: StoryObj = {
  render: () => {
    const [checked, setChecked] = useState<string[]>([]);
    return (
      <div className="w-80 space-y-2">
        <Tree
          checkable
          showLines
          defaultExpanded={['site', 'zone-x']}
          nodes={archivedAndDisabled}
          checkedIds={checked}
          onCheckedChange={setChecked}
        />
        <p className="text-body-xs text-slate-500">
          checked: {checked.length ? checked.join(', ') : '(none)'}
        </p>
      </div>
    );
  },
};
