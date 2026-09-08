import Link from "next/link";
import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "gradient";

interface ButtonLinkProps {
    href: string;
    variant?: ButtonVariant;
    children: ReactNode;
    className?: string;
}

export const ButtonLink = ({ href, variant = "primary", children, className = "" }: ButtonLinkProps) => {
    const baseStyles = "w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-13 font-semibold transition-all active:scale-95";
    
    // STYLE VARIANTS
    const variants = {
        primary: "bg-[#1A1A1A] hover:bg-[#333] text-white",
        secondary: "bg-white border-2 border-light-border hover:bg-light-border text-heading",
        gradient: "outline-light-border text-white  bg-main-gradient hover:bg-linear-to-tl"

    };

    return (
        <Link href={href} className={`${baseStyles} ${variants[variant]} ${className}`}>
            {children}
        </Link>
    );
}
