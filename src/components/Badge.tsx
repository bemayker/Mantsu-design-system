import React from 'react';
import { cn } from './cn';

/** Status / Badge — small status indicator. */
export type BadgeStatus = 'info' | 'success' | 'warning' | 'error' | 'neutral';
export interface BadgeProps {
  status?: BadgeStatus;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}
const map: Record<BadgeStatus, string> = {
  info: 'bg-info-bg text-info',
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  error: 'bg-error-bg text-error',
  neutral: 'bg-slate-50 text-slate-600',
};
const dotMap: Record<BadgeStatus, string> = {
  info: 'bg-info', success: 'bg-success', warning: 'bg-warning',
  error: 'bg-error', neutral: 'bg-slate-400',
};
export const Badge: React.FC<BadgeProps> = ({ status = 'neutral', children, dot, className }) => (
  <span className={cn(
    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-body-xs-emphasis',
    map[status], className
  )}>
    {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotMap[status])} />}
    {children}
  </span>
);
export default Badge;
