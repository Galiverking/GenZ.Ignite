"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Megaphone, Pin, Calendar, ArrowRight, Sparkles } from "lucide-react";

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

export default function AnnouncementsSection() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const { data, error } = await supabase
                    .from("announcements")
                    .select("*")
                    .order("is_pinned", { ascending: false })
                    .order("created_at", { ascending: false })
                    .limit(5);

                if (error) throw error;

                if (data && data.length > 0) {
                    setAnnouncements(data);
                } else {
                    // Mock data fallback
                    setAnnouncements([
                        {
                            id: "1",
                            title: "🎉 สภานักเรียน GenZ Ignite เปิดทำการแล้ว!",
                            content: "พวกเราพร้อมทำงานเพื่อเพื่อนนักเรียนทุกคน ติดตามข่าวสาร นโยบาย และแจ้งเรื่องร้องเรียนได้ที่เว็บไซต์นี้",
                            category: "ข่าวด่วน",
                            is_pinned: true,
                            created_at: new Date().toISOString(),
                        },
                        {
                            id: "2",
                            title: "กำหนดการ Sport Day 2569",
                            content: "งานกีฬาสีประจำปีจะจัดขึ้นวันที่ 15-17 มีนาคม 2569 นักเรียนทุกคนสามารถลงทะเบียนได้ที่ห้องสภาฯ",
                            category: "กิจกรรม",
                            is_pinned: false,
                            created_at: new Date(Date.now() - 86400000).toISOString(),
                        },
                    ]);
                }
            } catch (err) {
                console.error("Error fetching announcements:", err);
                // Table might not exist yet, use mock data
                setAnnouncements([
                    {
                        id: "1",
                        title: "🎉 สภานักเรียน GenZ Ignite เปิดทำการแล้ว!",
                        content: "พวกเราพร้อมทำงานเพื่อเพื่อนนักเรียนทุกคน ติดตามข่าวสาร นโยบาย และแจ้งเรื่องร้องเรียนได้ที่เว็บไซต์นี้",
                        category: "ข่าวด่วน",
                        is_pinned: true,
                        created_at: new Date().toISOString(),
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("th-TH", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <section className="py-20 bg-[var(--background)]">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-center py-16">
                        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-[var(--background)] relative overflow-hidden">
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Megaphone size={20} className="text-primary" />
                            <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">ข่าวสาร & ประชาสัมพันธ์</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            อัปเดต<span className="text-primary italic">ล่าสุด</span>
                        </h2>
                    </motion.div>

                    <Link
                        href="/announcements"
                        className="group flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors font-bold"
                    >
                        ดูข่าวทั้งหมด
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Announcements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {announcements.map((item, index) => (
                        <motion.article
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`group relative bg-white/5 border rounded-[2rem] p-6 backdrop-blur-xl hover:bg-white/[0.08] transition-all duration-500 ${item.is_pinned
                                ? "border-primary/30 col-span-1 md:col-span-2 lg:col-span-2"
                                : "border-white/10 hover:border-primary/20"
                                }`}
                        >
                            {/* Pinned indicator */}
                            {item.is_pinned && (
                                <div className="flex items-center gap-1.5 mb-3">
                                    <Pin size={14} className="text-primary fill-primary" />
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.15em]">ปักหมุด</span>
                                </div>
                            )}

                            {/* Category Badge */}
                            <div className="flex items-center gap-2 mb-4">
                                <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-wider ${CATEGORY_COLORS[item.category] || "bg-white/10 text-gray-400 border-white/10"
                                    }`}>
                                    {item.category}
                                </span>
                                <span className="flex items-center gap-1 text-[10px] text-gray-600 font-bold">
                                    <Calendar size={10} />
                                    {formatDate(item.created_at)}
                                </span>
                            </div>

                            {/* Content */}
                            <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors leading-snug">
                                {item.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                                {item.content}
                            </p>

                            {/* Hover glow */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-tr-[2rem] blur-2xl" />
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
