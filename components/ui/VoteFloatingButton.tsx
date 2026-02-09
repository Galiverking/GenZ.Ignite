"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function VoteFloatingButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show button after scrolling 500px
            if (window.scrollY > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 100, scale: 0.8 }}
                    className="fixed bottom-8 right-8 z-50"
                >
                    <div className="relative group">
                        {/* Pulsing Aura */}
                        <div className="absolute inset-0 bg-primary/40 rounded-full blur-xl group-hover:bg-primary/60 transition-all animate-pulse" />

                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="relative flex items-center gap-4 bg-black text-white px-8 py-4 rounded-full shadow-2xl border border-white/10 hover:bg-primary transition-colors group"
                        >
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-white/80">Vote for</span>
                                <span className="text-xl font-black italic text-primary">GenZ Ignite</span>
                            </div>
                            <div className="w-12 h-12 bg-white text-secondary rounded-full flex items-center justify-center font-black text-2xl shadow-inner italic">
                                03
                            </div>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
