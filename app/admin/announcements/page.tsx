"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    Megaphone,
    Plus,
    Pin,
    PinOff,
    Trash2,
    Calendar,
    Edit3,
    X,
    Save,
    Loader2,
} from "lucide-react";

const CATEGORIES = ["ข่าวด่วน", "กิจกรรม", "ประกาศทั่วไป", "ผลงานสภา"];
const CATEGORY_COLORS: Record<string, string> = {
    "ข่าวด่วน": "bg-red-500/20 text-red-400 border-red-500/30",
    "กิจกรรม": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "ประกาศทั่วไป": "bg-gray-500/20 text-gray-400 border-gray-500/30",
    "ผลงานสภา": "bg-green-500/20 text-green-400 border-green-500/30",
};

interface Announcement {
    id: string;
    title: string;
    content: string;
    category: string;
    image_url?: string;
    is_pinned: boolean;
    created_at: string;
}

export default function AdminAnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: "ประกาศทั่วไป",
        image_url: "",
        is_pinned: false,
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await supabase
                .from("announcements")
                .select("*")
                .order("is_pinned", { ascending: false })
                .order("created_at", { ascending: false });

            setAnnouncements(data || []);
        } catch {
            setAnnouncements([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setFormData({ title: "", content: "", category: "ประกาศทั่วไป", image_url: "", is_pinned: false });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (item: Announcement) => {
        setFormData({
            title: item.title,
            content: item.content,
            category: item.category,
            image_url: item.image_url || "",
            is_pinned: item.is_pinned,
        });
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const payload = {
            title: formData.title,
            content: formData.content,
            category: formData.category,
            image_url: formData.image_url || null,
            is_pinned: formData.is_pinned,
        };

        if (editingId) {
            await supabase.from("announcements").update(payload).eq("id", editingId);
        } else {
            await supabase.from("announcements").insert([payload]);
        }

        setSaving(false);
        resetForm();
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("ต้องการลบข่าวนี้จริงหรือไม่?")) return;
        await supabase.from("announcements").delete().eq("id", id);
        fetchData();
    };

    const handleTogglePin = async (id: string, currentPin: boolean) => {
        await supabase.from("announcements").update({ is_pinned: !currentPin }).eq("id", id);
        fetchData();
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("th-TH", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">
                        จัดการ<span className="text-primary italic">ข่าวสาร</span>
                    </h1>
                    <p className="text-gray-500 font-medium">
                        ประชาสัมพันธ์ไว! เพิ่ม แก้ไข หรือลบข่าวสารได้ทันที ⚡
                    </p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-primary/20"
                >
                    <Plus size={20} />
                    เพิ่มข่าวใหม่
                </button>
            </div>

            {/* Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-white">
                                {editingId ? "แก้ไขข่าว" : "เพิ่มข่าวใหม่"}
                            </h2>
                            <button
                                onClick={resetForm}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">หัวข้อข่าว</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="เช่น กำหนดการ Sport Day 2569"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">หมวดหมู่</label>
                                    <select
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">รูปภาพ URL (ไม่บังคับ)</label>
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">เนื้อหา</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="รายละเอียดข่าวสาร..."
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_pinned}
                                        onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-600 text-primary focus:ring-primary bg-black/50"
                                    />
                                    <span className="text-sm font-bold text-gray-300 flex items-center gap-1.5">
                                        <Pin size={14} className="text-primary" />
                                        ปักหมุดข่าวนี้
                                    </span>
                                </label>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-primary hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                >
                                    {saving ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            {editingId ? "บันทึกการแก้ไข" : "เผยแพร่ข่าว"}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="bg-white/5 border border-white/10 text-gray-400 hover:text-white font-bold py-3 px-6 rounded-xl transition-all"
                                >
                                    ยกเลิก
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Announcements List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
            ) : announcements.length === 0 ? (
                <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
                    <Megaphone size={48} className="text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 font-bold">ยังไม่มีข่าวสาร</p>
                    <p className="text-gray-600 text-sm mt-1">กดปุ่ม &quot;เพิ่มข่าวใหม่&quot; เพื่อเริ่มประชาสัมพันธ์</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {announcements.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className={`bg-white/5 border rounded-[1.5rem] p-6 group hover:bg-white/[0.08] transition-all ${item.is_pinned ? "border-primary/30" : "border-white/10"
                                }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    {/* Badges */}
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        {item.is_pinned && (
                                            <span className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-wider">
                                                <Pin size={12} className="fill-current" /> ปักหมุด
                                            </span>
                                        )}
                                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${CATEGORY_COLORS[item.category] || "bg-white/10 text-gray-400 border-white/10"
                                            }`}>
                                            {item.category}
                                        </span>
                                        <span className="text-[10px] text-gray-600 font-bold flex items-center gap-1">
                                            <Calendar size={10} />
                                            {formatDate(item.created_at)}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-lg font-bold text-white truncate">{item.title}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.content}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleTogglePin(item.id, item.is_pinned)}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-primary transition-colors"
                                        title={item.is_pinned ? "เลิกปักหมุด" : "ปักหมุด"}
                                    >
                                        {item.is_pinned ? <PinOff size={16} /> : <Pin size={16} />}
                                    </button>
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
                                        title="แก้ไข"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                                        title="ลบ"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
