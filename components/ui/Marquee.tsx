"use client";

import { motion } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
    items: string[];
    direction?: "left" | "right";
    speed?: number; // duration in seconds
    className?: string;
}

export default function Marquee({
    items,
    direction = "left",
    speed = 20,
    className,
}: MarqueeProps) {
    // Create duplicate content for seamless looping
    const content = [...items, ...items, ...items, ...items];

    return (
        <div className={cn("relative flex overflow-hidden w-full", className)}>
            {/* Fade Edge Layers - Adjusted for Dark Mode by default */}
            <div className="absolute top-0 left-0 w-16 h-full z-10 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-16 h-full z-10 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>

            <motion.div
                className="flex whitespace-nowrap py-3"
                initial={{ x: direction === "left" ? 0 : "-50%" }}
                animate={{ x: direction === "left" ? "-50%" : 0 }}
                transition={{
                    ease: "linear",
                    duration: speed,
                    repeat: Infinity,
                }}
            >
                {content.map((item, index) => (
                    <span
                        key={index}
                        className="mx-6 text-sm font-semibold tracking-wide uppercase flex items-center gap-2 text-white"
                    >
                        {/* Live Indicator */}
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        {item}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
