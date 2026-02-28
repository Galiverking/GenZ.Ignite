"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Check, Clock, RefreshCcw, Search, Filter, MessageCircle, User, Calendar, MoreHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

export default function ComplaintsManage() {
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [replyingTo, setReplyingTo] = useState<any | null>(null);
    const [replyText, setReplyText] = useState("");

    // Fetch data
    const fetchComplaints = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("complaints")
            .select("*")
            .order("id", { ascending: false });

        if (error) {
            console.error("Error fetching complaints:", error);
            // Fallback mock check removed for production readiness, usually you'd show an error UI
        }

        setComplaints(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    // Update status function
    const submitReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyingTo) return;

        const updatedData = {
            status: "resolved",
            admin_reply: replyText,
            resolved_at: new Date().toISOString()
        };

        setComplaints((prev) =>
            prev.map((c) => (c.id === replyingTo.id ? { ...c, ...updatedData } : c))
        );

        const { error } = await supabase.from("complaints").update(updatedData).eq("id", replyingTo.id);

        if (error) {
            console.error("Error updating status:", error);
            fetchComplaints(); // Revert on error
        }

        setReplyingTo(null);
        setReplyText("");
    };

    const updateStatus = async (id: number, newStatus: string) => {
        // Optimistic Update
        setComplaints((prev) =>
            prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );

        // Send to Database
        const { error } = await supabase.from("complaints").update({ status: newStatus }).eq("id", id);
        if (error) {
            console.error("Error updating status:", error);
            fetchComplaints(); // Revert on error
        }
    };

    const filteredComplaints = complaints.filter(c => {
        const matchesStatus = filterStatus === "all" || c.status === filterStatus;
        const matchesSearch = c.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.message.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">
                        จัดการเรื่อง <span className="text-secondary italic font-black">ร้องเรียน</span>
                    </h1>
                    <p className="text-gray-500 font-medium">รับฟังและแก้ไขปัญหาของเพื่อนร่วมโรงเรียน 🤝</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchComplaints}
                        disabled={loading}
                        className="bg-white/5 border border-white/10 p-3 rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 group"
                    >
                        <RefreshCcw size={18} className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
                        <span className="text-xs font-black uppercase tracking-widest">Refresh</span>
                    </button>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-secondary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="ค้นหาตามหัวข้อหรือรายละเอียด..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10 transition-all"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-secondary/50 appearance-none transition-all"
                    >
                        <option value="all" className="bg-[#0d1117]">ทั้งหมด</option>
                        <option value="pending" className="bg-[#0d1117]">รอดำเนินการ</option>
                        <option value="resolved" className="bg-[#0d1117]">เสร็จสิ้นแล้ว</option>
                    </select>
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 border-b border-white/5">
                            <tr>
                                <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] w-48">วันที่แจ้ง</th>
                                <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">หมวดหมู่ / หัวข้อ</th>
                                <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">ผู้ติดต่อ</th>
                                <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">สถานะ</th>
                                <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">ดำเนินการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {filteredComplaints.map((c, idx) => (
                                    <motion.tr
                                        key={c.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Calendar size={14} className="text-secondary" />
                                                <span className="text-xs font-bold font-mono">
                                                    {new Date(c.created_at).toLocaleDateString("th-TH", {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col gap-1 max-w-sm">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/5 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                        {c.category}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-white group-hover:text-secondary transition-colors truncate">
                                                    {c.topic}
                                                </h3>
                                                <p className="text-xs text-gray-500 line-clamp-1 italic">
                                                    {c.message}
                                                </p>
                                                {c.status === 'resolved' && c.admin_reply && (
                                                    <div className="mt-2 bg-white/5 border border-white/10 p-2 rounded-lg text-xs">
                                                        <span className="text-secondary font-bold">ตอบกลับ: </span>
                                                        <span className="text-gray-300">{c.admin_reply}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-gray-500">
                                                    <User size={14} />
                                                </div>
                                                <span className="text-xs font-medium text-gray-400">{c.contact || "ไม่ระบุ"}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            {c.status === "resolved" ? (
                                                <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase italic tracking-tighter">
                                                    <Check size={12} strokeWidth={3} /> เสร็จสิ้น
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase italic tracking-tighter">
                                                    <Clock size={12} strokeWidth={3} /> รอการแก้ไข
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {c.status === "pending" ? (
                                                    <button
                                                        onClick={() => setReplyingTo(c)}
                                                        className="bg-secondary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-wider hover:bg-red-600 transition-all shadow-lg shadow-secondary/20 active:scale-95"
                                                    >
                                                        ตอบกลับ
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => updateStatus(c.id, "pending")}
                                                        className="bg-white/5 text-gray-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-wider hover:text-white hover:bg-white/10 transition-all active:scale-95"
                                                    >
                                                        ย้อนกลับ
                                                    </button>
                                                )}
                                                <button className="p-2 text-gray-600 hover:text-white transition-colors">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {!loading && filteredComplaints.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mb-4 text-gray-700">
                            <MessageCircle size={40} />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">ไม่พบเรื่องร้องเรียน</h4>
                        <p className="text-gray-500 text-sm max-w-xs">ขณะนี้ไม่มีข้อมูลที่ตรงกับเงื่อนไขการค้นหาของคุณ หรือยังไม่มีนักเรียนแจ้งเรื่องเข้ามา</p>
                    </div>
                )}

                {loading && (
                    <div className="py-24 flex flex-col items-center justify-center grayscale opacity-50">
                        <RefreshCcw size={40} className="animate-spin mb-4 text-secondary" />
                        <p className="text-xs font-black uppercase tracking-widest text-gray-500">กำลังเชื่อมต่อฐานข้อมูล...</p>
                    </div>
                )}
            </div>

            {/* Reply Modal */}
            <AnimatePresence>
                {replyingTo && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex justify-center items-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0b0f14] border border-white/10 rounded-[3rem] w-full max-w-lg p-10 shadow-2xl relative"
                        >
                            <button
                                onClick={() => setReplyingTo(null)}
                                className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={28} />
                            </button>

                            <h2 className="text-xl font-black mb-2 text-white italic tracking-tighter uppercase">
                                ตอบกลับเรื่องร้องเรียน
                            </h2>
                            <p className="text-sm text-gray-400 mb-6 font-bold">{replyingTo.topic}</p>

                            <form onSubmit={submitReply} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">ข้อความตอบกลับเพื่ออัปเดตผู้ร้องเรียน</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-secondary transition-all text-sm resize-none"
                                        placeholder="ดำเนินการซ่อมแซมและประสานงานอาจารย์เรียบร้อยแล้วค่ะ..."
                                    />
                                </div>

                                <div className="pt-2 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setReplyingTo(null)}
                                        className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 font-bold transition-all"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] py-4 rounded-2xl bg-secondary hover:bg-red-600 text-white font-black italic shadow-lg shadow-secondary/20 transition-all active:scale-95"
                                    >
                                        เปลี่ยนสถานะเป็น "แก้ไขแล้ว"
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
