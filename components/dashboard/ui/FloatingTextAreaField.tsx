import { TextareaHTMLAttributes, forwardRef, useId, useEffect, useRef } from 'react';

interface FloatingTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const FloatingTextAreaField = forwardRef<HTMLTextAreaElement, FloatingTextAreaProps>(
  ({ label, id, className = '', disabled, placeholder, onChange, value, ...props }, ref) => {
    const uniqueId = useId();
    const textareaId = id || uniqueId;
    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    // REFERENCE CONNECTION
    const setRefs = (element: HTMLTextAreaElement | null) => {
      internalRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    // AUTO RESIZING 
    const adjustHeight = () => {
      const textarea = internalRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };

    useEffect(() => {
      adjustHeight();
    }, [value]);

    return (
      <div className={`relative transition-colors ${disabled ? 'opacity-60 bg-gray-50' : ''} ${className}`}>
        <textarea
          {...props}
          id={textareaId}
          ref={setRefs}
          value={value}
          disabled={disabled}
          placeholder={placeholder || " "}
          rows={1}
          onChange={(e) => {
            adjustHeight();
            if (onChange) onChange(e);
          }}
          className="peer block w-full outline-none appearance-none bg-transparent border border-hover-border rounded-2xl px-4 pb-2 pt-6 text-15 text-heading focus:border-gray-500 disabled:cursor-not-allowed resize-none overflow-hidden min-h-14"
        />
        <label
          htmlFor={textareaId}
          className="pointer-events-none absolute left-4 top-4.5 z-10 origin-left -translate-y-3 text-15 scale-75 transform text-subheading duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-disabled:cursor-not-allowed"
        >
          {label}
        </label>
      </div>
    );
  }
);