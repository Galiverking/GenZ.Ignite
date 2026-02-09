"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    // Detect scroll to adjust Navbar style
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: "หน้าแรก", path: "/" },
        { name: "นโยบาย", path: "/policy" },
        { name: "ทีมงาน", path: "/team" },
    ];

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none"
        >
            <nav
                className={clsx(
                    "flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300 pointer-events-auto",
                    scrolled
                        ? "bg-white/10 backdrop-blur-md shadow-lg w-[95%] md:w-[70%] border border-white/20"
                        : "bg-transparent w-full max-w-6xl"
                )}
            >
                <Link href="/" className="font-bold text-2xl tracking-tighter text-white flex items-center gap-3 group">
                    <div className="w-12 h-12 relative flex items-center justify-center transition-transform group-hover:scale-110">
                        <img src="/logo.png" alt="GenZ Ignite Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-white font-black">GenZ Ignite</span>
                </Link>

                {/* Menu (Desktop) */}
                <ul className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                href={item.path}
                                className={clsx(
                                    "hover:text-white cursor-pointer transition-colors",
                                    pathname === item.path ? "text-white font-bold" : ""
                                )}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* CTA Button */}
                <Link
                    href="/report"
                    className="bg-primary text-white border border-secondary/20 px-5 py-2 rounded-full text-sm font-bold hover:bg-secondary hover:shadow-lg hover:shadow-secondary/20 transition-all active:scale-95"
                >
                    แจ้งเรื่องร้องเรียน
                </Link>
            </nav>
        </motion.header>
    );
}
