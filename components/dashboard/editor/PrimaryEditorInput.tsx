import React, { useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; 
}

export default function PrimaryEditorInput({ label, ...props }: InputProps) {
  const id = useId();

  return (
    <div className="flex flex-col w-full">
      <label htmlFor={id} className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2" >{label}</label>
      <input
        id={id}
        className="w-full bg-white font-semibold text-black rounded-xl px-3 py-3 outline-none"
        {...props}
      />
    </div>
  );
}