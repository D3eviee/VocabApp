import React from "react";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isPending: boolean;
  children: React.ReactNode;
}

export default function SubmitButton({ isPending, children, className, ...props }: SubmitButtonProps) {
    return (
        <button
            {...props}
            type="submit"
            disabled={isPending || props.disabled}
            className={`mt-2 w-full flex items-center justify-center gap-2 bg-gray-950 hover:bg-black text-white py-3.5 rounded-xl text-[15px] font-semibold transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none ${className || ""}`}
        >
            {isPending ? <Loader2 size={18} className="animate-spin text-white/80" /> : children }
        </button>
    );
}