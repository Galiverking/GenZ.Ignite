"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowRight, FileText, Users, CheckCircle2, Megaphone } from "lucide-react";

function AnimatedCounter({ target, duration = 2 }: { target: number; duration?: number }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (v) => Math.round(v));
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        const controls = animate(count, target, { duration });
        const unsub = rounded.on("change", (v) => setDisplay(v));
        return () => {
            controls.stop();
            unsub();
        };
    }, [target]);

    return <span>{display}</span>;
}

export default function CouncilHero() {
    const [stats, setStats] = useState({
        policies: 0,
        members: 0,
        completedPolicies: 0,
        announcements: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [policiesRes, membersRes, completedRes] = await Promise.all([
                    supabase.from("policies").select("*", { count: "exact", head: true }),
                    supabase.from("members").select("*", { count: "exact", head: true }),
                    supabase.from("policies").select("*", { count: "exact", head: true }).eq("status", "completed"),
                ]);

                // Try to get announcements count (table may not exist yet)
                let announcementsCount = 0;
                try {
                    const { count } = await supabase.from("announcements").select("*", { count: "exact", head: true });
                    announcementsCount = count || 0;
                } catch {
                    announcementsCount = 0;
                }

                setStats({
                    policies: policiesRes.count || 0,
                    members: membersRes.count || 0,
                    completedPolicies: completedRes.count || 0,
                    announcements: announcementsCount,
                });
            } catch (err) {
                console.error("Error fetching stats:", err);
                // Fallback to zeros (already default, but good to be explicit)
                setStats({
                    policies: 0,
                    members: 0,
                    completedPolicies: 0,
                    announcements: 0,
                });
            }
        };

        fetchStats();
    }, []);

    const statItems = [
        { label: "นโยบายทั้งหมด", value: stats.policies, icon: FileText },
        { label: "สมาชิกสภา", value: stats.members, icon: Users },
        { label: "นโยบายสำเร็จ", value: stats.completedPolicies, icon: CheckCircle2 },
        { label: "ข่าวประชาสัมพันธ์", value: stats.announcements, icon: Megaphone },
    ];

    return (
        <section className="min-h-screen flex flex-col justify-center items-center bg-black text-white px-4 text-center relative overflow-hidden">
            {/* Background Graphic */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-secondary/30 to-black z-0 opacity-80" />

            {/* Floating orbs */}
            <motion.div
                animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute top-20 right-[15%] w-72 h-72 bg-primary/10 rounded-full blur-[100px]"
            />
            <motion.div
                animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute bottom-32 left-[10%] w-96 h-96 bg-secondary/20 rounded-full blur-[120px]"
            />

            <div className="z-10 max-w-5xl mx-auto">
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8 w-32 h-32 mx-auto relative"
                >
                    <img
                        src="/logo.png"
                        alt="สภานักเรียน GenZ Ignite Logo"
                        className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(255,102,0,0.4)]"
                    />
                </motion.div>

                {/* Official badge */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-full font-bold text-sm tracking-widest uppercase border border-white/20"
                >
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    สภานักเรียนอย่างเป็นทางการ
                </motion.div>

                {/* Main Title */}
                <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                    className="text-5xl md:text-8xl font-black leading-tight tracking-tighter mb-6"
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-300 to-white">
                        สภานักเรียน
                    </span>
                    <br />
                    <span className="text-white">GenZ Ignite</span>
                </motion.h1>

                {/* Tagline */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xl md:text-2xl text-gray-400 mb-12 font-medium max-w-2xl mx-auto"
                >
                    สภา GenZ คิดนอกกรอบ ตอบโจทย์ทุกไลฟ์สไตล์
                    <br />
                    <span className="text-primary italic font-bold">&ldquo;เสียงของคุณ คือภารกิจของเรา&rdquo;</span>
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
                >
                    <Link
                        href="/policy"
                        className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-red-600 hover:shadow-[0_0_30px_rgba(255,69,0,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2 group"
                    >
                        ดูนโยบายของเรา
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/report"
                        className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all active:scale-95"
                    >
                        แจ้งเรื่องร้องเรียน
                    </Link>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto"
                >
                    {statItems.map((item, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-3xl group hover:border-primary/30 transition-all"
                        >
                            <div className="flex justify-center mb-3">
                                <item.icon size={24} className="text-primary group-hover:scale-110 transition-transform" />
                            </div>
                            <p className="text-3xl md:text-4xl font-black text-white mb-1">
                                <AnimatedCounter target={item.value} />
                            </p>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                                {item.label}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
