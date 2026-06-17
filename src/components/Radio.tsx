import React from 'react';
import { cn } from './cn';

/** Radio — single radio button, typically used within a group. */
export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className, disabled, id, ...props }, ref) => {
    const inputId = id || React.useId();
    return (
      <label className={cn('inline-flex items-center gap-2', disabled && 'opacity-50', !disabled && 'cursor-pointer')}>
        <input
          ref={ref}
          id={inputId}
          type="radio"
          disabled={disabled}
          className={cn(
            'h-5 w-5 border-slate-200 text-primary-blue accent-[#155799]',
            'focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-2',
            className
          )}
          {...props}
        />
        {label && <span className="text-body text-midnight">{label}</span>}
      </label>
    );
  }
);
Radio.displayName = 'Radio';
export default Radio;
