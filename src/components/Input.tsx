import React from 'react';
import { cn } from './cn';

/** Input — text field. States: default, focus, error, disabled. */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, leadingIcon, className, id, disabled, ...props }, ref) => {
    const inputId = id || React.useId();
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-body-sm-emphasis text-midnight">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leadingIcon && (
            <span className="absolute left-3 text-slate-400">{leadingIcon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            className={cn(
              'h-11 w-full rounded-md border bg-white text-body text-midnight',
              'placeholder:text-slate-400 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue',
              leadingIcon ? 'pl-10 pr-3' : 'px-3',
              error ? 'border-error focus:ring-error focus:border-error' : 'border-slate-200',
              disabled && 'bg-slate-50 text-slate-400 cursor-not-allowed',
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <span className="text-body-xs text-error">{error}</span>
        ) : hint ? (
          <span className="text-body-xs text-slate-500">{hint}</span>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';
export default Input;
