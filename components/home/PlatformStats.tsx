"use client";

import { motion } from "framer-motion";
import { FileText, MessageSquare, Users, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface StatItem {
    icon: React.ElementType;
    end: number;
    suffix: string;
    label: string;
    color: string;
    bg: string;
    /** Supabase table and optional filter to compute count */
    source: { table: string; filter?: { column: string; value: string } };
}

const STAT_DEFS: StatItem[] = [
    {
        icon: FileText,
        end: 13,
        suffix: "นโยบาย",
        label: "กำลังดำเนินการและสำเร็จแล้ว",
        color: "text-primary",
        bg: "bg-primary/10",
        source: { table: "policies" },
    },
    {
        icon: MessageSquare,
        end: 2,
        suffix: "เรื่อง",
        label: "ร้องเรียนที่ได้รับการแก้ไข",
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
        source: { table: "complaints", filter: { column: "status", value: "resolved" } },
    },
    {
        icon: Users,
        end: 4,
        suffix: "คน",
        label: "คณะกรรมการสภานักเรียน",
        color: "text-emerald-400",
        bg: "bg-emerald-400/10",
        source: { table: "members" },
    },
    {
        icon: BarChart3,
        end: 8,
        suffix: "โพล",
        label: "สำรวจความคิดเห็นที่จัดไป",
        color: "text-purple-400",
        bg: "bg-purple-400/10",
        source: { table: "polls" },
    },
];

function Counter({ end, duration = 2000 }: { end: number; duration?: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [end, duration]);

    return <span>{count.toLocaleString()}</span>;
}

export default function PlatformStats() {
    const [counts, setCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchCounts = async () => {
            const results: Record<string, number> = {};

            for (const stat of STAT_DEFS) {
                try {
                    let query = supabase.from(stat.source.table).select("*", {
                        count: "exact",
                        head: true,
                    });
                    if (stat.source.filter) {
                        query = query.eq(stat.source.filter.column, stat.source.filter.value);
                    }
                    const { count } = await query;
                    results[stat.source.table] = count ?? 0;
                } catch {
                    // keep fallback (stat.end) if table doesn't exist or query fails
                }
            }

            setCounts(results);
        };

        fetchCounts();
    }, []);

    return (
        <section className="py-24 bg-secondary overflow-hidden relative">
            {/* subtle background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        ผลงาน <span className="text-primary italic">ของเรา</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        ตัวเลขสะท้อนความตั้งใจและการทำงานของสภานักเรียน GenZ Ignite
                        ที่พร้อมขับเคลื่อนโรงเรียนไปด้วยกัน
                    </p>
                </motion.div>

                {/* Stats grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {STAT_DEFS.map((stat, index) => {
                        const realValue = counts[stat.source.table] ?? stat.end;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.12, duration: 0.5 }}
                                className="group relative p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center"
                            >
                                {/* Icon */}
                                <div
                                    className={`w-14 h-14 mx-auto mb-5 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                                >
                                    <stat.icon size={28} />
                                </div>

                                {/* Number from Supabase, fallback to hardcoded */}
                                <div className="text-5xl md:text-6xl font-black text-white mb-2 tabular-nums">
                                    <Counter end={realValue} key={realValue} />
                                    <span className="text-2xl ml-1 text-gray-400">+</span>
                                </div>

                                {/* Suffix */}
                                <div className="text-lg font-semibold text-gray-300 mb-1">
                                    {stat.suffix}
                                </div>

                                {/* Label */}
                                <div className="text-sm text-gray-500 leading-relaxed">
                                    {stat.label}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
