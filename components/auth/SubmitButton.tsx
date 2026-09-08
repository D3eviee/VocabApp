"use client";
import { Loader } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isPending: boolean;
}

export const SubmitButton = ({  isPending, disabled, children, className = "", ...props }: SubmitButtonProps) => {
    return (
        <button
            {...props}
            type="submit"
            disabled={isPending || disabled}
            className={`bg-main-gradient border border-light-border shadow-2xs shadow-gray-200 w-full flex items-center justify-center font-semibold text-white py-3 rounded-2xl text-sm cursor-pointer hover:bg-linear-to-tl active:scale-95 transition-all duration-75 ${className}`}
        >
            {isPending ? <Loader size={18} className="animate-spin text-white/80" />
            : (
                <span className="">{children}</span>
            )}
        </button>
    );
}


