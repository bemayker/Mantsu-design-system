import React from 'react';
import { cn } from './cn';

/** Tree — hierarchical navigation (e.g. Site → Building → Floor → Zone → Equipment). */
export interface TreeNode {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
}
export interface TreeProps {
  nodes: TreeNode[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  defaultExpanded?: string[];
  className?: string;
}
const TreeItem: React.FC<{
  node: TreeNode; depth: number; selectedId?: string;
  onSelect?: (id: string) => void; expanded: Set<string>; toggle: (id: string) => void;
}> = ({ node, depth, selectedId, onSelect, expanded, toggle }) => {
  const hasChildren = !!node.children?.length;
  const isOpen = expanded.has(node.id);
  const isSelected = node.id === selectedId;
  return (
    <li>
      <div
        className={cn(
          'flex items-center gap-2 rounded-md py-1.5 pr-2 cursor-pointer text-body-sm',
          isSelected ? 'bg-selected-blue text-primary-blue font-bold' : 'text-midnight hover:bg-frost'
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => { onSelect?.(node.id); if (hasChildren) toggle(node.id); }}
      >
        {hasChildren ? (
          <span className={cn('transition-transform text-slate-400', isOpen && 'rotate-90')}>▸</span>
        ) : (
          <span className="w-[1ch]" />
        )}
        {node.icon}
        <span>{node.label}</span>
      </div>
      {hasChildren && isOpen && (
        <ul>
          {node.children!.map((c) => (
            <TreeItem key={c.id} node={c} depth={depth + 1} selectedId={selectedId}
              onSelect={onSelect} expanded={expanded} toggle={toggle} />
          ))}
        </ul>
      )}
    </li>
  );
};
export const Tree: React.FC<TreeProps> = ({ nodes, selectedId, onSelect, defaultExpanded = [], className }) => {
  const [expanded, setExpanded] = React.useState(new Set(defaultExpanded));
  const toggle = (id: string) => setExpanded((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  return (
    <ul className={cn('select-none', className)} role="tree">
      {nodes.map((n) => (
        <TreeItem key={n.id} node={n} depth={0} selectedId={selectedId}
          onSelect={onSelect} expanded={expanded} toggle={toggle} />
      ))}
    </ul>
  );
};
export default Tree;
