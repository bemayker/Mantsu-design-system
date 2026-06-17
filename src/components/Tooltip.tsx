import React from 'react';
import { cn } from './cn';

/** Tooltip — hover/focus hint. CSS-only show/hide via group. */
export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}
const pos: Record<string, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};
export const Tooltip: React.FC<TooltipProps> = ({ content, children, side = 'top', className }) => (
  <span className="relative inline-flex group">
    {children}
    <span
      role="tooltip"
      className={cn(
        'pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-midnight px-2.5 py-1.5 text-body-xs text-white',
        'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity',
        pos[side], className
      )}
    >
      {content}
    </span>
  </span>
);
export default Tooltip;
