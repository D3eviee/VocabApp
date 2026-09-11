"use client";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "danger" ;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    isLoading?: boolean;
    children: ReactNode;
}

export const Button = ({ variant = "primary", isLoading = false, disabled, children, className = "", ...props }: ButtonProps) => {
  const baseStyles = "w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-13 font-semibold shadow-xs transition-all active:scale-95 hover:cursor-pointer disabled:opacity-50";
  
  const variants = {
        primary: "outline-light-border text-white bg-main-gradient hover:bg-linear-to-tl",
        secondary: "bg-light-border text-subheading border border-[#D4D4D4] hover:bg-[#D4D4D4]",
        danger: "bg-red-600 border-red-700 shadow-red-200 text-white hover:bg-red-700", 
    };
  
  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {isLoading ? (
        <Loader2 size={18} className="animate-spin text-white opacity-80" />
      ) : ( children )}
    </button>
    );
};