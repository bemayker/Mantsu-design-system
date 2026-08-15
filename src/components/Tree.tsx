import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from './cn';
import { Checkbox } from './Checkbox';

/**
 * Tree — hierarchical navigation (e.g. Site → Building → Floor → Zone → Equipment).
 *
 * Hybrid of the Mantsu Figma "Tree" component (file kN9ZMAZ7NrhNp0iu8gpzEC, page
 * 42:626) and the shipping product tree (`LocationTreeNode`): chevron caret + 14px
 * text + 20px indent like the product, with the Figma hierarchy/connector lines
 * available as an opt-in (`showLines`).
 *
 * Features: title + optional subtitle, optional custom-colour status circle, optional
 * leading icon, optional selection checkboxes (tri-state), built-in search/filter,
 * right-click context menu, native drag-and-drop reordering, scroll-to-selected, full
 * keyboard navigation and ARIA (tree / treeitem / group, aria-expanded/selected/level).
 */
export interface TreeNode {
  id: string;
  /** Primary line. */
  label: string;
  /** Optional secondary line beneath the label. */
  subtitle?: string;
  /** Optional leading icon, rendered after the status circle. */
  icon?: React.ReactNode;
  /** Optional status circle colour (any CSS colour). Omit for no circle. */
  color?: string;
  /**
   * Inert: not selectable, not checkable, not draggable, and never swept up by a
   * parent's cascade check.
   *
   * This is the "this node is not a thing you can act on" flag. If what you mean is
   * "this node still exists but is retired", use `archived` — it stays selectable, which
   * is what a restore flow needs.
   */
  disabled?: boolean;
  /**
   * Retired but still real: rendered muted, and neither draggable nor a drop target,
   * but still selectable and checkable.
   *
   * Separate from `disabled` on purpose (DS-1/DS-8). An archived node must stay
   * selectable, because selecting it is how a user restores it — so an app cannot express
   * "archived" by setting `disabled`, and before this existed the only way to get the
   * muted styling was to leave the node fully draggable.
   *
   * Ordering to `disabled` is: `disabled` wins wherever they overlap.
   */
  archived?: boolean;
  children?: TreeNode[];
}

export interface TreeContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: (node: TreeNode) => void;
  /** Render in the error colour for destructive actions. */
  danger?: boolean;
}

export type DropPosition = 'before' | 'inside' | 'after';

export interface TreeProps {
  nodes: TreeNode[];

  /** Single selection. */
  selectedId?: string;
  onSelect?: (id: string) => void;

  /** Multi-selection checkboxes (tri-state on parents). */
  checkable?: boolean;
  checkedIds?: string[];
  defaultCheckedIds?: string[];
  onCheckedChange?: (ids: string[]) => void;

  /** Expansion (uncontrolled via defaultExpanded, or controlled via expandedIds). */
  defaultExpanded?: string[];
  expandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;

  /** Draw Figma-style connector / guide lines. Defaults to false (clean product look). */
  showLines?: boolean;

  /** Built-in search field that filters the tree and expands matching branches. */
  searchable?: boolean;
  searchPlaceholder?: string;

  /** Right-click context menu. Return the items for a given node (or [] to suppress). */
  contextMenuItems?: (node: TreeNode) => TreeContextMenuItem[];

  /** Enable native drag-and-drop. `onMove` receives the drag source, target and position. */
  draggable?: boolean;
  onMove?: (move: { dragId: string; targetId: string; position: DropPosition }) => void;

  /** Scroll this node into view on mount / when it changes. */
  scrollToId?: string;

  className?: string;
}

const INDENT = 20; // px per depth level

/* ------------------------------------------------------------------ icons */

const Chevron: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={cn('transition-transform duration-150', open && 'rotate-90')}
    aria-hidden
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

/* ------------------------------------------------------------- trail lines */

type TrailVariant = 'vertical' | 'tee' | 'elbow' | 'empty';

const Trail: React.FC<{ variant: TrailVariant }> = ({ variant }) => (
  <span className="relative w-5 self-stretch shrink-0" aria-hidden>
    {variant !== 'empty' && (
      <>
        <span
          className={cn(
            'absolute left-1/2 w-px -translate-x-1/2 bg-slate-400',
            variant === 'elbow' ? 'top-0 h-1/2' : 'inset-y-0'
          )}
        />
        {(variant === 'tee' || variant === 'elbow') && (
          <span className="absolute left-1/2 right-0 top-1/2 h-px -translate-y-1/2 bg-slate-400" />
        )}
      </>
    )}
  </span>
);

/* ------------------------------------------------------------------ helpers */

interface FlatNode {
  id: string;
  hasChildren: boolean;
  depth: number;
  parentId: string | null;
}

function flatten(nodes: TreeNode[], expanded: Set<string>): FlatNode[] {
  const out: FlatNode[] = [];
  const walk = (list: TreeNode[], depth: number, parentId: string | null) => {
    for (const n of list) {
      const hasChildren = !!n.children?.length;
      out.push({ id: n.id, hasChildren, depth, parentId });
      if (hasChildren && expanded.has(n.id)) walk(n.children!, depth + 1, n.id);
    }
  };
  walk(nodes, 0, null);
  return out;
}

/** Filter the tree to nodes matching `query` (or with a matching descendant). */
function filterTree(nodes: TreeNode[], query: string): { nodes: TreeNode[]; expand: Set<string> } {
  const q = query.trim().toLowerCase();
  const expand = new Set<string>();
  if (!q) return { nodes, expand };

  const matches = (n: TreeNode) =>
    n.label.toLowerCase().includes(q) || (n.subtitle?.toLowerCase().includes(q) ?? false);

  const walk = (list: TreeNode[]): TreeNode[] => {
    const kept: TreeNode[] = [];
    for (const n of list) {
      const childResult = n.children ? walk(n.children) : [];
      if (matches(n) || childResult.length) {
        if (childResult.length) expand.add(n.id);
        kept.push({ ...n, children: childResult.length ? childResult : n.children });
      }
    }
    return kept;
  };
  return { nodes: walk(nodes), expand };
}

/**
 * Every id in `node`'s subtree that a cascade check may touch, `node` included.
 *
 * A `disabled` node is skipped AND not descended into (DS-9). Before this, a direct
 * check on a disabled node was correctly refused by `Checkbox`/`TreeItem` while a check
 * on its PARENT swept it up anyway — the guard held at the point a user could see it and
 * failed everywhere else, which is the worst shape for that bug.
 *
 * Not descending is deliberate rather than incidental: a subtree hanging under a disabled
 * node is not reachable for checking by any other route either, so including its children
 * while excluding their parent would produce a state the user cannot undo from the UI.
 *
 * `archived` is NOT skipped. An archived node is still checkable; that is the whole
 * distinction between the two flags.
 */
function collectDescendantIds(node: TreeNode, into: Set<string>) {
  if (node.disabled) return;
  into.add(node.id);
  node.children?.forEach((c) => collectDescendantIds(c, into));
}

/* -------------------------------------------------------------- context menu */

const ContextMenu: React.FC<{
  x: number; y: number; items: TreeContextMenuItem[]; node: TreeNode; onClose: () => void;
}> = ({ x, y, items, node, onClose }) => {
  const ref = React.useRef<HTMLUListElement>(null);
  const [pos, setPos] = React.useState({ x, y });

  // Flip / clamp so the menu never overflows the viewport.
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const pad = 8;
    const nx = x + width > window.innerWidth - pad ? Math.max(pad, window.innerWidth - width - pad) : x;
    const ny = y + height > window.innerHeight - pad ? Math.max(pad, window.innerHeight - height - pad) : y;
    setPos({ x: nx, y: ny });
  }, [x, y]);

  React.useEffect(() => {
    const close = () => onClose();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('click', close);
    window.addEventListener('contextmenu', close);
    window.addEventListener('scroll', close, true);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('click', close);
      window.removeEventListener('contextmenu', close);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  // Portal to <body> so no ancestor transform/overflow shifts or clips a `position: fixed` menu.
  return createPortal(
    <ul
      ref={ref}
      role="menu"
      className="fixed z-50 min-w-[180px] overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-mantsu-lg"
      style={{ top: pos.y, left: pos.x }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item, i) => (
        <li key={i}>
          <button
            type="button"
            role="menuitem"
            className={cn(
              'flex w-full items-center gap-3 px-3 py-2 text-left text-body-sm hover:bg-frost',
              item.danger ? 'text-error' : 'text-midnight'
            )}
            onClick={() => { item.onClick(node); onClose(); }}
          >
            {item.icon && <span className="flex size-4 shrink-0 items-center justify-center">{item.icon}</span>}
            {item.label}
          </button>
        </li>
      ))}
    </ul>,
    document.body
  );
};

/* ----------------------------------------------------------------- tree item */

interface TreeItemProps {
  node: TreeNode;
  depth: number;
  guides: boolean[];
  isLast: boolean;
  showLines: boolean;
  checkable: boolean;
  selectedId?: string;
  focusId?: string;
  expanded: Set<string>;
  checkState: (node: TreeNode) => 'checked' | 'unchecked' | 'indeterminate';
  dndEnabled: boolean;
  dropTarget: { id: string; position: DropPosition } | null;
  onSelect?: (id: string) => void;
  onCheck: (node: TreeNode) => void;
  toggle: (id: string) => void;
  setFocusId: (id: string) => void;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
  onContextMenu: (e: React.MouseEvent, node: TreeNode) => void;
  onDragStartNode: (id: string) => void;
  onDragOverNode: (e: React.DragEvent, node: TreeNode) => void;
  onDropNode: (node: TreeNode) => void;
  onDragEndNode: () => void;
}

const TreeItem: React.FC<TreeItemProps> = (p) => {
  const {
    node, depth, guides, isLast, showLines, checkable, selectedId, focusId, expanded,
    checkState, dndEnabled, dropTarget, onSelect, onCheck, toggle, setFocusId, registerRef,
    onContextMenu, onDragStartNode, onDragOverNode, onDropNode, onDragEndNode,
  } = p;

  const hasChildren = !!node.children?.length;
  const isOpen = expanded.has(node.id);
  const isSelected = node.id === selectedId;
  const connector: TrailVariant = isLast ? 'elbow' : 'tee';
  const drop = dropTarget?.id === node.id ? dropTarget.position : null;
  const cs = checkable ? checkState(node) : 'unchecked';

  return (
    <li role="treeitem" aria-expanded={hasChildren ? isOpen : undefined} aria-selected={isSelected} aria-level={depth + 1}>
      <div
        ref={(el) => registerRef(node.id, el)}
        tabIndex={focusId === node.id ? 0 : -1}
        draggable={dndEnabled && !node.disabled && !node.archived}
        onFocus={() => setFocusId(node.id)}
        onClick={() => { if (!node.disabled) { onSelect?.(node.id); if (hasChildren) toggle(node.id); } }}
        onContextMenu={(e) => onContextMenu(e, node)}
        onDragStart={(e) => { e.stopPropagation(); onDragStartNode(node.id); }}
        onDragOver={(e) => onDragOverNode(e, node)}
        onDrop={(e) => { e.preventDefault(); e.stopPropagation(); onDropNode(node); }}
        onDragEnd={onDragEndNode}
        className={cn(
          'group flex min-h-8 cursor-pointer items-center gap-1 rounded-sm py-1.5 pr-2 outline-none',
          'focus-visible:ring-2 focus-visible:ring-primary-blue/40',
          isSelected ? 'bg-selected-blue text-primary-blue' : 'text-primary-neutral hover:bg-slate-50',
          node.disabled && 'cursor-default opacity-50',
          // Muted, but NOT `cursor-default`: an archived node is still selectable, and
          // the cursor is what tells a user that (DS-1).
          node.archived && !node.disabled && 'opacity-60',
          drop === 'inside' && 'bg-selected-blue ring-1 ring-primary-blue/40',
          drop === 'before' && 'shadow-[inset_0_2px_0_0_#155799]',
          drop === 'after' && 'shadow-[inset_0_-2px_0_0_#155799]'
        )}
        style={!showLines ? { paddingLeft: `${depth * INDENT + 4}px` } : { paddingLeft: 4 }}
      >
        {/* Trail Zone — connector lines, one cell per ancestor level + the connector */}
        {showLines && depth > 0 && (
          <span className="flex self-stretch shrink-0">
            {guides.map((g, i) => <Trail key={i} variant={g ? 'vertical' : 'empty'} />)}
            <Trail variant={connector} />
          </span>
        )}

        {/* Chevron — toggles expansion; spacer keeps leaves aligned */}
        {hasChildren ? (
          <span
            role="button"
            tabIndex={-1}
            aria-label={isOpen ? 'Collapse' : 'Expand'}
            className="flex size-5 shrink-0 items-center justify-center rounded-sm text-slate-400 hover:bg-slate-100"
            onClick={(e) => { e.stopPropagation(); toggle(node.id); }}
          >
            <Chevron open={isOpen} />
          </span>
        ) : (
          <span className="size-5 shrink-0" aria-hidden />
        )}

        {/* Checkbox */}
        {checkable && (
          <span onClick={(e) => e.stopPropagation()} className="flex shrink-0 items-center">
            <Checkbox
              checked={cs === 'checked'}
              indeterminate={cs === 'indeterminate'}
              disabled={node.disabled}
              onChange={() => onCheck(node)}
              aria-label={node.label}
            />
          </span>
        )}

        {/* Status circle */}
        {node.color && (
          <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: node.color }} aria-hidden />
        )}

        {/* Icon */}
        {node.icon && <span className="flex shrink-0 items-center text-slate-400">{node.icon}</span>}

        {/* Title + subtitle */}
        <span className="flex min-w-0 flex-col">
          <span className={cn('truncate text-body-sm', isSelected && 'font-semibold')}>{node.label}</span>
          {node.subtitle && <span className="truncate text-body-xs text-slate-500">{node.subtitle}</span>}
        </span>
      </div>

      {hasChildren && isOpen && (
        <ul role="group">
          {node.children!.map((child, i) => (
            <TreeItem
              {...p}
              key={child.id}
              node={child}
              depth={depth + 1}
              guides={depth === 0 ? [] : [...guides, !isLast]}
              isLast={i === node.children!.length - 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

/* ---------------------------------------------------------------------- tree */

export const Tree: React.FC<TreeProps> = ({
  nodes, selectedId, onSelect,
  checkable = false, checkedIds, defaultCheckedIds = [], onCheckedChange,
  defaultExpanded = [], expandedIds, onExpandedChange,
  showLines = false, searchable = false, searchPlaceholder = 'Search…',
  contextMenuItems, draggable = false, onMove, scrollToId, className,
}) => {
  /* expansion (controlled / uncontrolled) */
  const expansionControlled = expandedIds !== undefined;
  const [internalExpanded, setInternalExpanded] = React.useState(() => new Set(defaultExpanded));

  /* search */
  const [query, setQuery] = React.useState('');
  const { nodes: viewNodes, expand: searchExpand } = React.useMemo(
    () => filterTree(nodes, query),
    [nodes, query]
  );

  const baseExpanded = expansionControlled ? new Set(expandedIds) : internalExpanded;
  const expanded = React.useMemo(
    () => (query ? new Set([...baseExpanded, ...searchExpand]) : baseExpanded),
    [baseExpanded, searchExpand, query]
  );

  const commitExpanded = (next: Set<string>) => {
    if (expansionControlled) onExpandedChange?.([...next]);
    else setInternalExpanded(next);
  };
  const toggle = React.useCallback((id: string) => {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    commitExpanded(next);
  }, [expanded]);
  const setExpanded = React.useCallback((id: string, open: boolean) => {
    const next = new Set(expanded);
    open ? next.add(id) : next.delete(id);
    commitExpanded(next);
  }, [expanded]);

  /* checking (controlled / uncontrolled) */
  const checkControlled = checkedIds !== undefined;
  const [internalChecked, setInternalChecked] = React.useState(() => new Set(defaultCheckedIds));
  const checked = checkControlled ? new Set(checkedIds) : internalChecked;

  const nodeIndex = React.useMemo(() => {
    const map = new Map<string, { node: TreeNode; parentId: string | null }>();
    const walk = (list: TreeNode[], parentId: string | null) => {
      for (const n of list) { map.set(n.id, { node: n, parentId }); walk(n.children ?? [], n.id); }
    };
    walk(nodes, null);
    return map;
  }, [nodes]);

  const checkState = React.useCallback((node: TreeNode): 'checked' | 'unchecked' | 'indeterminate' => {
    // Disabled children are excluded here for the same reason `collectDescendantIds`
    // skips them (DS-9), and the two MUST agree. If the cascade refuses to check a
    // disabled child while this function still counts it, the parent can never reach
    // `checked`: it would sit on `indeterminate` forever and clicking it would flip
    // between indeterminate and unchecked with no way to reach checked. That is a worse
    // bug than the one DS-9 fixes, and it is only avoided by changing both together.
    const relevant = node.children?.filter((child) => !child.disabled) ?? [];
    // A node whose children are ALL disabled reads as a leaf, on its own checked state.
    if (!relevant.length) return checked.has(node.id) ? 'checked' : 'unchecked';
    const states = relevant.map(checkState);
    if (states.every((s) => s === 'checked')) return 'checked';
    if (states.every((s) => s === 'unchecked')) return 'unchecked';
    return 'indeterminate';
  }, [checked]);

  const onCheck = React.useCallback((node: TreeNode) => {
    const next = new Set(checked);
    const target = checkState(node) !== 'checked';
    const subtree = new Set<string>();
    collectDescendantIds(node, subtree);
    subtree.forEach((id) => (target ? next.add(id) : next.delete(id)));
    // reconcile ancestors so parents reflect their children
    let parentId = nodeIndex.get(node.id)?.parentId ?? null;
    while (parentId) {
      const parent = nodeIndex.get(parentId)!.node;
      const allChecked = parent.children!.every((c) => next.has(c.id));
      allChecked ? next.add(parent.id) : next.delete(parent.id);
      parentId = nodeIndex.get(parentId)?.parentId ?? null;
    }
    if (checkControlled) onCheckedChange?.([...next]);
    else setInternalChecked(next);
  }, [checked, checkState, nodeIndex, checkControlled, onCheckedChange]);

  /* keyboard navigation */
  const flat = React.useMemo(() => flatten(viewNodes, expanded), [viewNodes, expanded]);
  const [focusId, setFocusId] = React.useState<string | undefined>(selectedId ?? flat[0]?.id);
  React.useEffect(() => {
    if (focusId && !flat.some((f) => f.id === focusId)) setFocusId(flat[0]?.id);
  }, [flat, focusId]);

  const refs = React.useRef(new Map<string, HTMLDivElement | null>());
  const registerRef = React.useCallback((id: string, el: HTMLDivElement | null) => {
    el ? refs.current.set(id, el) : refs.current.delete(id);
  }, []);
  const focusNode = React.useCallback((id?: string) => {
    if (!id) return;
    setFocusId(id);
    refs.current.get(id)?.focus();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!focusId) return;
    const idx = flat.findIndex((f) => f.id === focusId);
    if (idx === -1) return;
    const cur = flat[idx];
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); focusNode(flat[idx + 1]?.id); break;
      case 'ArrowUp': e.preventDefault(); focusNode(flat[idx - 1]?.id); break;
      case 'ArrowRight':
        e.preventDefault();
        if (cur.hasChildren && !expanded.has(cur.id)) setExpanded(cur.id, true);
        else if (cur.hasChildren) focusNode(flat[idx + 1]?.id);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (cur.hasChildren && expanded.has(cur.id)) setExpanded(cur.id, false);
        else if (cur.parentId) focusNode(cur.parentId);
        break;
      case 'Home': e.preventDefault(); focusNode(flat[0]?.id); break;
      case 'End': e.preventDefault(); focusNode(flat[flat.length - 1]?.id); break;
      case 'Enter': case ' ':
        e.preventDefault();
        if (checkable) onCheck(nodeIndex.get(cur.id)!.node);
        else { onSelect?.(cur.id); if (cur.hasChildren) toggle(cur.id); }
        break;
    }
  };

  /* scroll-to-selected */
  React.useEffect(() => {
    if (scrollToId) refs.current.get(scrollToId)?.scrollIntoView({ block: 'nearest' });
  }, [scrollToId]);

  /* context menu */
  const [menu, setMenu] = React.useState<{ x: number; y: number; node: TreeNode; items: TreeContextMenuItem[] } | null>(null);
  const onContextMenu = (e: React.MouseEvent, node: TreeNode) => {
    if (!contextMenuItems) return;
    const items = contextMenuItems(node);
    if (!items.length) return;
    e.preventDefault();
    e.stopPropagation();
    setMenu({ x: e.clientX, y: e.clientY, node, items });
  };

  /* drag and drop */
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [dropTarget, setDropTarget] = React.useState<{ id: string; position: DropPosition } | null>(null);

  const isDescendant = React.useCallback((ancestorId: string, maybeChildId: string) => {
    let cur: string | null = maybeChildId;
    while (cur) {
      if (cur === ancestorId) return true;
      cur = nodeIndex.get(cur)?.parentId ?? null;
    }
    return false;
  }, [nodeIndex]);

  const onDragOverNode = (e: React.DragEvent, node: TreeNode) => {
    // Returning BEFORE `preventDefault` is what makes the node a non-target: without the
    // preventDefault the browser refuses the drop, so no indicator is drawn and `onMove`
    // is never called. An archived node is excluded here as well as from `draggable`
    // above, because "cannot be moved" and "cannot be moved INTO" are both true of it
    // and only the first was covered before (DS-8).
    if (!draggable || !dragId || node.disabled || node.archived) return;
    if (dragId === node.id || isDescendant(dragId, node.id)) return; // can't drop onto self / own subtree
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const offset = e.clientY - rect.top;
    const position: DropPosition =
      offset < rect.height * 0.25 ? 'before' : offset > rect.height * 0.75 ? 'after' : 'inside';
    setDropTarget((prev) => (prev?.id === node.id && prev.position === position ? prev : { id: node.id, position }));
  };
  const onDropNode = (node: TreeNode) => {
    if (draggable && dragId && dropTarget && dragId !== node.id && !isDescendant(dragId, node.id)) {
      onMove?.({ dragId, targetId: node.id, position: dropTarget.position });
    }
    setDragId(null);
    setDropTarget(null);
  };
  const onDragEndNode = () => { setDragId(null); setDropTarget(null); };

  const itemShared = {
    showLines, checkable, selectedId, focusId, expanded, checkState,
    dndEnabled: draggable, dropTarget, onSelect, onCheck, toggle, setFocusId, registerRef,
    onContextMenu, onDragStartNode: setDragId, onDragOverNode, onDropNode, onDragEndNode,
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {searchable && (
        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-1.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-slate-400" aria-hidden>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="w-full bg-transparent text-body-sm text-primary-neutral outline-none placeholder:text-slate-500"
          />
        </div>
      )}

      <ul className="select-none" role="tree" aria-multiselectable={checkable || undefined} onKeyDown={onKeyDown}>
        {viewNodes.length === 0 ? (
          <li className="px-2 py-3 text-body-sm text-slate-500">No results</li>
        ) : (
          viewNodes.map((n, i) => (
            <TreeItem
              {...itemShared}
              key={n.id}
              node={n}
              depth={0}
              guides={[]}
              isLast={i === viewNodes.length - 1}
            />
          ))
        )}
      </ul>

      {menu && (
        <ContextMenu x={menu.x} y={menu.y} items={menu.items} node={menu.node} onClose={() => setMenu(null)} />
      )}
    </div>
  );
};

export default Tree;
