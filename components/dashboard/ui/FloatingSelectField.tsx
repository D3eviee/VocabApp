import { SelectHTMLAttributes, forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';

interface FloatingSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export const FloatingSelectField = forwardRef<HTMLSelectElement, FloatingSelectProps>(
  ({ label, id, className = '', disabled, children, ...props }, ref) => {
    const uniqueId = useId();
    const selectId = id || uniqueId;
    
    return (
      <div 
        className={`relative transition-colors ${disabled ? 'opacity-60 bg-gray-50' : ''} ${className}`}
      >
        <select
          {...props}
          id={selectId}
          ref={ref}
          disabled={disabled}
          className="peer block w-full outline-none appearance-none bg-transparent border border-hover-border rounded-2xl px-4 pr-10 pb-2 pt-6 text-15 text-heading focus:border-gray-500 disabled:cursor-not-allowed cursor-pointer"
        >
          {children}
        </select>
        
        {/* ARROW */}
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-subheading peer-focus:text-gray-500 transition-colors duration-200">
          <ChevronDown size={20} />
        </div>

        <label
          htmlFor={selectId}
          className="pointer-events-none absolute left-4 top-4.5 z-10 origin-left -translate-y-3 text-15 scale-75 transform text-subheading duration-200 peer-focus:-translate-y-3 peer-focus:scale-75 peer-disabled:cursor-not-allowed"
        >
          {label}
        </label>
      </div>
    );
  }
);