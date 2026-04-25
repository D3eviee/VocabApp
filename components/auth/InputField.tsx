import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  action?: React.ReactNode;
}

export default function InputField({ label, action, className, ...props }: InputFieldProps) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    {label}
                </label>

                {action && <div>{action}</div>}
            </div>
            <input
                {...props}
                className={`w-full bg-gray-50/50 border border-gray-200/60 rounded-xl px-4 py-3 text-[15px] font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-400 ${className || ""}`}
            />
        </div>
    );
}