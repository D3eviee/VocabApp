import React, { useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; 
}

export const PrimaryEditorInput = ({ label, ...props }: InputProps) => {
  const id = useId();

  return (
    <div className="flex flex-col w-full">
      <label htmlFor={id} className="text-[13px] font-semibold text-[#BCBCBF] uppercase tracking-wider mb-2" >{label}</label>
      <input
        id={id}
        className="w-full text-[#333] font-semibold rounded-xl px-3 py-2.5 outline-none border-[0.5px] border-transparent bg-white focus:border-[#E1E1E1]"
        {...props}
      />
    </div>
  );
}