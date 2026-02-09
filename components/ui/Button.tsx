import { ButtonHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "outline";
}

export default function Button({
    children,
    variant = "primary",
    className,
    ...props
}: ButtonProps) {
    const variants = {
        primary: "bg-primary hover:bg-red-600 text-white bg-primary",
        secondary: "bg-white text-black hover:bg-gray-200",
        outline: "border border-white/20 text-white hover:bg-white/10"
    };

    return (
        <button
            className={twMerge(
                "px-6 py-2 rounded-lg font-bold transition-transform active:scale-95 disabled:opacity-50",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
