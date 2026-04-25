import { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export default function Button({ children, isLoading = false, variant = "primary", className = "", disabled, ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all active:scale-95";
  
  const variants = {
    primary: "bg-gray-900 hover:bg-black text-white shadow-sm",
    secondary: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100"
  };

  const isDisabled = disabled || isLoading;
  
  const activeStyles = isDisabled 
    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-transparent shadow-none" 
    : variants[variant];

  return (
    <button
      disabled={isDisabled}
      className={`${baseStyles} ${activeStyles} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin" size={16} />}
      {children}
    </button>
  );
}