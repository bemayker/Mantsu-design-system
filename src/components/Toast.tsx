import React from 'react';
import { cn } from './cn';

/** Toast — transient notification message. */
export type ToastVariant = 'info' | 'success' | 'warning' | 'error';
export interface ToastProps {
  variant?: ToastVariant;
  title: string;
  description?: string;
  onClose?: () => void;
  className?: string;
}
const styles: Record<ToastVariant, { bg: string; bar: string; text: string }> = {
  info: { bg: 'bg-info-bg', bar: 'bg-info', text: 'text-info' },
  success: { bg: 'bg-success-bg', bar: 'bg-success', text: 'text-success' },
  warning: { bg: 'bg-warning-bg', bar: 'bg-warning', text: 'text-warning' },
  error: { bg: 'bg-error-bg', bar: 'bg-error', text: 'text-error' },
};
export const Toast: React.FC<ToastProps> = ({ variant = 'info', title, description, onClose, className }) => {
  const s = styles[variant];
  return (
    <div className={cn('relative flex gap-3 overflow-hidden rounded-md bg-white shadow-mantsu-md border border-slate-200 p-4 min-w-[320px]', className)} role="status">
      <span className={cn('absolute left-0 top-0 h-full w-1', s.bar)} />
      <div className="flex flex-col gap-0.5 pl-2">
        <span className="text-body-sm-emphasis text-midnight">{title}</span>
        {description && <span className="text-body-sm text-slate-500">{description}</span>}
      </div>
      {onClose && (
        <button onClick={onClose} aria-label="Dismiss" className="ml-auto text-slate-400 hover:text-midnight leading-none">×</button>
      )}
    </div>
  );
};
export default Toast;
