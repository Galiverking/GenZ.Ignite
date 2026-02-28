"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight } from "lucide-react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Detect scroll to adjust Navbar style
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    const navItems = [
        { name: "หน้าแรก", path: "/" },
        { name: "ข่าวสาร", path: "/announcements" },
        { name: "นโยบาย", path: "/policy" },
        { name: "ทีมงาน", path: "/team" },
    ];

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-6 px-4 pointer-events-none"
            >
                <nav
                    className={clsx(
                        "flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500 pointer-events-auto",
                        scrolled || isOpen
                            ? "bg-black/60 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] w-[95%] md:w-[70%] border border-white/10"
                            : "bg-transparent w-full max-w-6xl"
                    )}
                >
                    <Link href="/" onClick={() => setIsOpen(false)} className="font-bold text-2xl tracking-tighter text-white flex items-center gap-3 group">
                        <div className="w-10 h-10 relative flex items-center justify-center transition-transform group-hover:scale-110">
                            <img src="/logo.png" alt="GenZ Ignite Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-white font-black text-xl md:text-2xl">สภา GenZ Ignite</span>
                    </Link>

                    {/* Menu (Desktop) */}
                    <ul className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={clsx(
                                        "hover:text-white cursor-pointer transition-colors relative py-1",
                                        pathname === item.path ? "text-white font-bold" : ""
                                    )}
                                >
                                    {item.name}
                                    {pathname === item.path && (
                                        <motion.div
                                            layoutId="nav-underline"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                                        />
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Right Side Items */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/report"
                            className="hidden md:block bg-primary text-white border border-primary/20 px-5 py-2 rounded-full text-sm font-bold hover:bg-red-600 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all active:scale-95"
                        >
                            แจ้งเรื่องร้องเรียน
                        </Link>

                        {/* Hamburger Button (Mobile) */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                        >
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </nav>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-2xl md:hidden flex flex-col pt-32 px-6"
                    >
                        <ul className="space-y-6">
                            {navItems.map((item, index) => (
                                <motion.li
                                    key={item.path}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 + index * 0.1 }}
                                >
                                    <Link
                                        href={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className={clsx(
                                            "flex items-center justify-between text-3xl font-black transition-colors uppercase tracking-tight",
                                            pathname === item.path ? "text-primary" : "text-white/60 hover:text-white"
                                        )}
                                    >
                                        {item.name}
                                        <ChevronRight size={28} className={pathname === item.path ? "opacity-100" : "opacity-0"} />
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-12 pt-12 border-t border-white/10"
                        >
                            <Link
                                href="/report"
                                onClick={() => setIsOpen(false)}
                                className="w-full flex items-center justify-center bg-primary text-white p-5 rounded-3xl text-lg font-black shadow-2xl shadow-primary/30"
                            >
                                แจ้งเรื่องร้องเรียน
                            </Link>
                        </motion.div>

                        <div className="mt-auto pb-12 text-center text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">
                            สภานักเรียน GenZ Ignite © 2026 • Student Council Official
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
