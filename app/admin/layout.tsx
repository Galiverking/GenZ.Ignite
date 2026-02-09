import Link from "next/link";
import { Users, FileText, Settings, LayoutDashboard } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-black/50 backdrop-blur-md sticky top-0 h-screen p-6">
                <div className="mb-8 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg"></div>
                    <span className="font-bold text-xl tracking-tight text-white px-2">GenZ Admin</span>
                </div>

                <nav className="space-y-2">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
                    >
                        <LayoutDashboard size={20} />
                        <span>ภาพรวม (Dashboard)</span>
                    </Link>
                    <Link
                        href="/admin/policies"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
                    >
                        <FileText size={20} />
                        <span>จัดการนโยบาย</span>
                    </Link>
                    <Link
                        href="/admin/members"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
                    >
                        <Users size={20} />
                        <span>ทีมงานสมาชิก</span>
                    </Link>
                    <div className="pt-4 mt-4 border-t border-white/10">
                        <Link
                            href="/admin/settings"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
                        >
                            <Settings size={20} />
                            <span>ตั้งค่าระบบ</span>
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
