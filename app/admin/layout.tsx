"use client";

import Link from "next/link";
import { Users, FileText, Settings, LayoutDashboard, MessageSquare, LogOut, Search, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { clsx } from "clsx";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const navItems = [
        { name: "ภาพรวม", path: "/admin", icon: LayoutDashboard },
        { name: "จัดการนโยบาย", path: "/admin/policies", icon: FileText },
        { name: "จัดการสมาชิก", path: "/admin/members", icon: Users },
        { name: "เรื่องร้องเรียน", path: "/admin/complaints", icon: MessageSquare },
    ];

    return (
        <div className="flex min-h-screen bg-[#020617] text-white font-sans selection:bg-primary/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] opacity-50" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] opacity-50" />
            </div>

            {/* Sidebar */}
            <aside
                className={clsx(
                    "relative z-50 border-r border-white/5 bg-black/40 backdrop-blur-3xl transition-all duration-300 ease-in-out flex flex-col pt-8",
                    isSidebarOpen ? "w-72" : "w-20"
                )}
            >
                {/* Logo Section */}
                <div className="px-6 mb-10 flex items-center gap-3">
                    <Link href="/admin" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                            <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                        </div>
                        <AnimatePresence mode="wait">
                            {isSidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="font-black text-xl tracking-tighter"
                                >
                                    GENZ <span className="text-primary italic">ADMIN</span>
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={clsx(
                                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-primary/10 text-primary border border-primary/20"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon size={22} className={clsx("transition-transform group-hover:scale-110", isActive && "text-primary")} />
                                <AnimatePresence mode="wait">
                                    {isSidebarOpen && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -5 }}
                                            className="font-bold text-sm tracking-tight"
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-full"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 mt-auto border-t border-white/5 bg-black/20">
                    <Link
                        href="/admin/settings"
                        className={clsx(
                            "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all mb-2",
                            pathname === "/admin/settings" && "bg-white/5 text-white"
                        )}
                    >
                        <Settings size={22} />
                        {isSidebarOpen && <span className="font-bold text-sm">ตั้งค่าระบบ</span>}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all font-bold text-sm"
                    >
                        <LogOut size={22} />
                        {isSidebarOpen && <span>ออกจากระบบ</span>}
                    </button>

                    {/* User Profile Hook */}
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3 px-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 border-2 border-white/10 overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="User" />
                        </div>
                        {isSidebarOpen && (
                            <div className="flex flex-col">
                                <span className="text-xs font-black">Admin User</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Administrator</span>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-screen">
                {/* Header/Toolbar */}
                <header className="h-20 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-8 z-40">
                    <div className="flex items-center gap-4 max-w-lg w-full">
                        <div className="relative w-full group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="ค้นหาข้อมูล..."
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                        </button>
                    </div>
                </header>

                {/* Dynamic Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
