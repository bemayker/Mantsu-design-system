import React from 'react';
import { cn } from './cn';

/** Checkbox — supports checked, indeterminate, disabled. */
export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, indeterminate, className, disabled, id, ...props }, ref) => {
    const inputId = id || React.useId();
    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);
    React.useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = !!indeterminate;
    }, [indeterminate]);
    return (
      <label className={cn('inline-flex items-center gap-2', disabled && 'opacity-50', !disabled && 'cursor-pointer')}>
        <input
          ref={innerRef}
          id={inputId}
          type="checkbox"
          disabled={disabled}
          className={cn(
            'h-5 w-5 rounded border-slate-200 text-primary-blue',
            'focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-2',
            'accent-[#155799]',
            className
          )}
          {...props}
        />
        {label && <span className="text-body text-midnight">{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';
export default Checkbox;
