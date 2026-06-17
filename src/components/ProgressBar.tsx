import React from 'react';
import { cn } from './cn';

/** ProgressBar — linear determinate progress. */
export interface ProgressBarProps {
  value: number; // 0..100
  showLabel?: boolean;
  className?: string;
}
export const ProgressBar: React.FC<ProgressBarProps> = ({ value, showLabel, className }) => {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="h-2 flex-1 rounded-full bg-slate-200 overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-primary-blue transition-all" style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <span className="text-body-sm-emphasis text-midnight tabular-nums">{pct}%</span>}
    </div>
  );
};
export default ProgressBar;
