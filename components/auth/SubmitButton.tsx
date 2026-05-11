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
            className={`mt-8 w-full flex items-center justify-center bg-[#4F39F6] shadow-md text-white py-2 rounded-[13px] text-15 transition-all duration-75 disabled:opacity-70  active:scale-[0.98] disabled:pointer-events-none hover:cursor-pointer hover:bg-[#3E28E5] ${className}`}
        >
            {isPending ? <Loader size={18} className="animate-spin text-white/80" />
            : (
                <span className="">{children}</span>
            )}
        </button>
    );
}
