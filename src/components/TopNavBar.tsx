import React from 'react';
import { cn } from './cn';

/** TopNavBar — application top bar. */
export interface TopNavBarProps {
  title?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}
export const TopNavBar: React.FC<TopNavBarProps> = ({ title, left, right, className }) => (
  <header className={cn('flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6', className)}>
    <div className="flex items-center gap-4">
      {left}
      {title && <span className="text-h4 text-midnight">{title}</span>}
    </div>
    <div className="flex items-center gap-3">{right}</div>
  </header>
);
export default TopNavBar;
