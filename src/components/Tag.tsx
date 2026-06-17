import React from 'react';
import { cn } from './cn';

/** Tag — removable label / chip. */
export interface TagProps {
  children: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}
export const Tag: React.FC<TagProps> = ({ children, onRemove, className }) => (
  <span className={cn(
    'inline-flex items-center gap-1.5 rounded-md bg-frost px-2 py-1 text-body-sm text-midnight',
    className
  )}>
    {children}
    {onRemove && (
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove"
        className="text-slate-400 hover:text-midnight leading-none"
      >
        ×
      </button>
    )}
  </span>
);
export default Tag;
