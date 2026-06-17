import React from 'react';
import { cn } from './cn';

/** Sidebar — primary app navigation (navy background per Mantsu app). */
export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}
export interface SidebarProps {
  items: SidebarItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}
export const Sidebar: React.FC<SidebarProps> = ({ items, activeId, onSelect, header, footer, className }) => (
  <nav className={cn('flex h-full w-60 flex-col bg-midnight text-white', className)}>
    {header && <div className="px-4 py-5">{header}</div>}
    <ul className="flex-1 space-y-1 px-3">
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <li key={item.id}>
            <button
              onClick={() => onSelect?.(item.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-body-sm-emphasis transition-colors',
                active ? 'bg-horizon text-white' : 'text-sky-mist hover:bg-atlantic'
              )}
            >
              {item.icon}
              {item.label}
            </button>
          </li>
        );
      })}
    </ul>
    {footer && <div className="px-4 py-4">{footer}</div>}
  </nav>
);
export default Sidebar;
