"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Megaphone, FileText, MessageSquare, Users } from 'lucide-react';
import { clsx } from "clsx";

export default function AdminSidebar() {
    const pathname = usePathname();
    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/announcements', label: 'การประกาศ', icon: Megaphone },
        { href: '/admin/policies', label: 'นโยบาย', icon: FileText },
        { href: '/admin/complaints', label: 'เสียงสะท้อน', icon: MessageSquare },
        { href: '/admin/members', label: 'สมาชิกสภา', icon: Users },
    ];

    return (
        <aside className="w-72 bg-white/5 border-r border-white/10 p-6 min-h-screen hidden lg:block shrink-0">
            <h2 className="text-xl font-black mb-8 text-white uppercase tracking-wider flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <LayoutDashboard size={18} className="text-white" />
                </div>
                Admin<span className="text-primary">Panel</span>
            </h2>
            <nav className="space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group",
                                isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-gray-400 hover:text-white hover:bg-white/10"
                            )}>
                            <item.icon size={20} className={isActive ? "text-white" : "group-hover:scale-110 transition-transform"} />
                            <span className="font-bold text-sm tracking-wide">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </aside>
    );
}
