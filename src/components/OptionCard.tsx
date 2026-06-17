import React from 'react';
import { cn } from './cn';

/** OptionCard — selectable card (radio-like selection of a larger surface). */
export interface OptionCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  className?: string;
}
export const OptionCard: React.FC<OptionCardProps> = ({
  title, description, icon, selected, disabled, onSelect, className,
}) => (
  <button
    type="button"
    onClick={() => !disabled && onSelect?.()}
    disabled={disabled}
    aria-pressed={selected}
    className={cn(
      'flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-2',
      selected ? 'border-primary-blue bg-selected-blue' : 'border-slate-200 bg-white hover:border-slate-400',
      disabled && 'opacity-50 cursor-not-allowed',
      className
    )}
  >
    {icon && <span className="mt-0.5 text-primary-blue">{icon}</span>}
    <span className="flex flex-col gap-1">
      <span className="text-body-emphasis text-midnight">{title}</span>
      {description && <span className="text-body-sm text-slate-500">{description}</span>}
    </span>
  </button>
);
export default OptionCard;
