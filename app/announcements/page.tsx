"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Megaphone, Pin, Calendar, Filter } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
    "ข่าวด่วน": "bg-red-500/20 text-red-400 border-red-500/30",
    "กิจกรรม": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "ประกาศทั่วไป": "bg-gray-500/20 text-gray-400 border-gray-500/30",
    "ผลงานสภา": "bg-green-500/20 text-green-400 border-green-500/30",
};

const CATEGORIES = ["ทั้งหมด", "ข่าวด่วน", "กิจกรรม", "ประกาศทั่วไป", "ผลงานสภา"];

interface Announcement {
    id: string;
    title: string;
    content: string;
    category: string;
    image_url?: string;
    is_pinned: boolean;
    created_at: string;
}

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("ทั้งหมด");

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const { data } = await supabase
                    .from("announcements")
                    .select("*")
                    .order("is_pinned", { ascending: false })
                    .order("created_at", { ascending: false });

                if (data && data.length > 0) {
                    setAnnouncements(data);
                } else {
                    // Mock data fallback
                    setAnnouncements([
                        {
                            id: "1",
                            title: "🎉 สภานักเรียน GenZ Ignite เปิดทำการแล้ว!",
                            content: "พวกเราพร้อมทำงานเพื่อเพื่อนนักเรียนทุกคน ติดตามข่าวสาร นโยบาย และแจ้งเรื่องร้องเรียนได้ที่เว็บไซต์นี้ สภานักเรียนชุดใหม่จะเริ่มปฏิบัติหน้าที่ตั้งแต่วันนี้เป็นต้นไป โดยมีเป้าหมายในการพัฒนาคุณภาพชีวิตของนักเรียนทุกคนในโรงเรียน",
                            category: "ข่าวด่วน",
                            is_pinned: true,
                            created_at: new Date().toISOString(),
                        },
                        {
                            id: "2",
                            title: "กำหนดการ Sport Day 2569",
                            content: "งานกีฬาสีประจำปีจะจัดขึ้นวันที่ 15-17 มีนาคม 2569 นักเรียนทุกคนสามารถลงทะเบียนได้ที่ห้องสภาฯ ตั้งแต่วันนี้ถึง 10 มีนาคม กีฬาที่เปิดรับสมัคร: ฟุตบอล, บาสเก็ตบอล, วอลเลย์บอล, แบดมินตัน, E-Sport",
                            category: "กิจกรรม",
                            is_pinned: false,
                            created_at: new Date(Date.now() - 86400000).toISOString(),
                        },
                        {
                            id: "3",
                            title: "ซ่อมพัดลมอาคาร 5 เสร็จเรียบร้อย",
                            content: "สภานักเรียนได้ประสานงานกับฝ่ายอาคารสถานที่ ดำเนินการซ่อมพัดลมชำรุดทั้ง 12 ตัวเรียบร้อยแล้ว ขอบคุณทุกเสียงที่แจ้งเข้ามา",
                            category: "ผลงานสภา",
                            is_pinned: false,
                            created_at: new Date(Date.now() - 172800000).toISOString(),
                        },
                        {
                            id: "4",
                            title: "เปิดรับสมัครตัวแทนห้องเรียน",
                            content: "สภานักเรียนเปิดรับสมัครตัวแทนห้องเรียนเพื่อร่วมประชุมสภาฯ ประจำเดือน ห้องเรียนละ 2 คน สมัครได้ที่ห้องสภาฯ หรือแจ้งผ่านเว็บไซต์",
                            category: "ประกาศทั่วไป",
                            is_pinned: false,
                            created_at: new Date(Date.now() - 259200000).toISOString(),
                        },
                    ]);
                }
            } catch {
                setAnnouncements([]);
            }
            setLoading(false);
        };

        fetchAnnouncements();
    }, []);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("th-TH", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const filteredAnnouncements =
        activeCategory === "ทั้งหมด"
            ? announcements
            : announcements.filter((a) => a.category === activeCategory);

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <section className="pt-32 pb-16 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent z-0" />
                <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold mb-6 uppercase tracking-widest"
                    >
                        <Megaphone size={16} />
                        ข่าวสาร & ประชาสัมพันธ์
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-white mb-6"
                    >
                        ข่าวสาร<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">สภานักเรียน</span>
                    </motion.h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto font-medium">
                        ประชาสัมพันธ์ไว! อัปเดตข่าวสาร กิจกรรม และผลงานของสภานักเรียนแบบ Real-time
                    </p>
                </div>
            </section>

            {/* Category Filter */}
            <section className="max-w-6xl mx-auto px-4 mb-12">
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    <Filter size={16} className="text-gray-500 shrink-0" />
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat
                                    ? "bg-primary text-white"
                                    : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            {/* Content */}
            <main className="max-w-6xl mx-auto px-4 pb-32">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-gray-500 font-bold animate-pulse">กำลังโหลดข่าวสาร...</p>
                    </div>
                ) : filteredAnnouncements.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
                        <p className="text-gray-400">ยังไม่มีข่าวสารในหมวดนี้</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredAnnouncements.map((item, index) => (
                            <motion.article
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`group bg-white/5 border rounded-[2rem] p-8 backdrop-blur-xl hover:bg-white/[0.08] transition-all duration-500 ${item.is_pinned
                                        ? "border-primary/30"
                                        : "border-white/10 hover:border-primary/20"
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row md:items-start gap-6">
                                    <div className="flex-1 space-y-4">
                                        {/* Top badges */}
                                        <div className="flex items-center gap-3 flex-wrap">
                                            {item.is_pinned && (
                                                <div className="flex items-center gap-1.5">
                                                    <Pin size={14} className="text-primary fill-primary" />
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.15em]">ปักหมุด</span>
                                                </div>
                                            )}
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-wider ${CATEGORY_COLORS[item.category] || "bg-white/10 text-gray-400 border-white/10"
                                                }`}>
                                                {item.category}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h2 className="text-2xl md:text-3xl font-bold text-white group-hover:text-primary transition-colors">
                                            {item.title}
                                        </h2>

                                        {/* Content */}
                                        <p className="text-gray-400 leading-relaxed">
                                            {item.content}
                                        </p>

                                        {/* Date */}
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <Calendar size={14} />
                                            <span className="font-medium">{formatDate(item.created_at)}</span>
                                        </div>
                                    </div>

                                    {/* Optional Image */}
                                    {item.image_url && (
                                        <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden shrink-0">
                                            <img
                                                src={item.image_url}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    )}
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
