import {InputHTMLAttributes } from 'react';

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const InputField = (({ label, id, className = '', ...props }: FloatingInputProps) => {
    const inputId = id || `floating-input-${label.replace(/\s+/g, '-').toLowerCase()}`;

    return (
      <div className={`relative ${className} border-[0.5px] rounded-2xl border-[#86868b]`}>
        <input
          {...props}
          id={inputId}
          placeholder=" "
          className="peer block w-full appearance-none bg-transparent px-4 pb-2 pt-6 text-[16px] text-gray-900 focus:outline-none focus:ring-0"
        />
        <label
          htmlFor={inputId}
          className="pointer-events-none absolute left-4 top-4 z-10 origin-left -translate-y-3 scale-75 transform text-gray-500 duration-200  peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75"
        >{label}</label>
      </div>
    );
  }
);

