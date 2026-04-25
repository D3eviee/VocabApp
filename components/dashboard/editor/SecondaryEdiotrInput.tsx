import React, { useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; 
}

export default function SecondaryEditorInput({ label, ...props }: InputProps) {
  const id = useId();

  return (
    <div className="flex flex-col w-full">
      <label htmlFor={id} className="text-[13px] font-bold text-gray-400 uppercase tracking-wider" >{label}</label>
      <input
        id={id}
        className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-black outline-none transition-colors"
        {...props}
      />
    </div>
  );
}