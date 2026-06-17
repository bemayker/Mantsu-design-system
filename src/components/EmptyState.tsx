import React from 'react';
import { cn } from './cn';

/** EmptyState — used inside tables/lists when there is no content. */
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon, title, description, action, className,
}) => (
  <div className={cn('flex flex-col items-center justify-center gap-3 py-12 text-center', className)}>
    {icon && <div className="text-slate-400">{icon}</div>}
    <div className="flex flex-col gap-1">
      <span className="text-body-lg text-midnight">{title}</span>
      {description && <span className="text-body-sm text-slate-500 max-w-sm">{description}</span>}
    </div>
    {action}
  </div>
);
export default EmptyState;
