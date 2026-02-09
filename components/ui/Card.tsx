import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface CardProps {
    children: ReactNode;
    className?: string;
    variant?: "default" | "glass" | "outline";
}

export default function Card({
    children,
    className,
    variant = "default"
}: CardProps) {
    const variants = {
        default: "bg-white/5 border border-white/10 shadow-lg",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 shadow-xl",
        outline: "bg-transparent border border-white/30"
    };

    return (
        <div className={twMerge(
            "rounded-xl p-6 transition-all hover:translate-y-[-2px]",
            variants[variant],
            className
        )}>
            {children}
        </div>
    );
}
