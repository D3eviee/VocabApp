import { InputHTMLAttributes, forwardRef, useId } from 'react';
interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const FloatingInputField = forwardRef<HTMLInputElement, FloatingInputProps>(({ label, id, className = '', disabled, autoFocus=true, placeholder, ...props }, ref) => {
  const uniqueId = useId();
  const inputId = id || uniqueId;
  
  return (
    <div 
      className={`relative w-full elative transition-colors ${disabled ? 'opacity-60 bg-gray-50' : ''}`}
    >
      <input
          {...props}
          id={inputId}
          ref={ref}
          autoFocus={autoFocus}
          disabled={disabled}
          placeholder={placeholder || " "}
          className={`${className} peer block w-full outline-none appearance-none bg-transparent border border-hover-border rounded-2xl px-4 pb-2 pt-6 text-15 text-heading focus:border-gray-500 disabled:cursor-not-allowed`}
        />
        <label
          htmlFor={inputId}
          className="pointer-events-none absolute left-4 top-4.5 z-10 origin-left -translate-y-3 text-15 scale-75 transform  text-subheading duration-200  peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-disabled:cursor-not-allowed"
        >{label}</label>
      </div>
    );
  }
);