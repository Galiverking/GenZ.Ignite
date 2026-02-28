"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/shared/Navbar";
import { CheckCircle2, Circle, Clock, Heart } from "lucide-react";

export default function PolicyPage() {
    const [policies, setPolicies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [votedIds, setVotedIds] = useState<any[]>([]);

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const { data, error } = await supabase
                    .from("policies")
                    .select("*")
                    .order("votes", { ascending: false });

                if (error) throw error;

                if (data && data.length > 0) {
                    setPolicies(data);
                } else {
                    setPolicies([
                        { id: 1, title: "ซ่อมพัดลมอาคาร 5", description: "ดำเนินการซ่อมพัดลมที่ชำรุด 12 ตัว", category: "อาคารสถานที่", votes: 45, status: "completed", progress: 100 },
                        { id: 2, title: "เพิ่มปลั๊กไฟโรงอาหาร", description: "ติดตั้งจุดชาร์จไฟเพิ่ม 20 จุด", category: "โครงสร้างพื้นฐาน", votes: 82, status: "in_progress", progress: 60 },
                    ]);
                }
            } catch (err) {
                console.error("Error fetching policies:", err);
                setPolicies([
                    { id: 1, title: "ซ่อมพัดลมอาคาร 5 (Offline Mode)", description: "ดำเนินการซ่อมพัดลมที่ชำรุด 12 ตัว", category: "อาคารสถานที่", votes: 45, status: "completed", progress: 100 },
                ]);
            } finally {
                setLoading(false);
            }
        };

        const savedVotes = localStorage.getItem("genz_voted_policies");
        if (savedVotes) setVotedIds(JSON.parse(savedVotes));

        fetchPolicies();
    }, []);

    const handleVote = async (id: any, currentVotes: number) => {
        if (votedIds.includes(id)) return;

        // Optimistic UI
        setPolicies((prev) =>
            prev.map((p) => (p.id === id ? { ...p, votes: (p.votes || 0) + 1 } : p))
        );
        const newVotedIds = [...votedIds, id];
        setVotedIds(newVotedIds);
        localStorage.setItem("genz_voted_policies", JSON.stringify(newVotedIds));

        // DB Update
        await supabase
            .from("policies")
            .update({ votes: (currentVotes || 0) + 1 })
            .eq("id", id);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed": return <CheckCircle2 className="text-green-400" size={20} />;
            case "in_progress": return <Clock className="text-secondary" size={20} />;
            default: return <Circle className="text-gray-500" size={20} />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "completed": return "สำเร็จแล้ว";
            case "in_progress": return "กำลังดำเนินการ";
            default: return "รอดำเนินการ";
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col">
            <Navbar />

            {/* Header Section */}
            <section className="pt-40 pb-20 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent z-0" />
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold mb-6 uppercase tracking-widest"
                    >
                        Policy Tracker
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-white mb-6"
                    >
                        ติดตาม <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">นโยบายสภานักเรียน</span>
                    </motion.h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto font-medium">
                        ติดตามสถานะการดำเนินงานของสภานักเรียนได้แบบ Real-time ทุกนโยบายโปร่งใส ตรวจสอบได้
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 pb-32 w-full">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-gray-500 font-bold animate-pulse">กำลังโหลดข้อมูลนโยบาย...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {policies.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
                                <p className="text-gray-400">ยังไม่มีนโยบายในระบบขณะนี้</p>
                            </div>
                        ) : (
                            policies.map((policy, index) => (
                                <motion.div
                                    key={policy.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 hover:bg-white/[0.08] hover:border-primary/30 transition-all duration-500"
                                >
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-tighter border border-primary/20">
                                                {policy.category}
                                            </span>
                                            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                                {getStatusIcon(policy.status)}
                                                <span className="text-xs font-bold text-gray-300">
                                                    {getStatusText(policy.status)}
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                                            {policy.title}
                                        </h3>

                                        <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                                            {policy.description}
                                        </p>
                                    </div>

                                    <div className="w-full md:w-auto flex flex-col items-end gap-6 pt-6 md:pt-0">
                                        <div className="w-full md:w-64 space-y-2">
                                            <div className="flex justify-between text-xs font-bold mb-1">
                                                <span className="text-gray-500 uppercase tracking-widest">Progress</span>
                                                <span className="text-white font-mono">{policy.progress || 0}%</span>
                                            </div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${policy.progress || 0}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className="h-full bg-gradient-to-r from-primary to-secondary"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 w-full justify-between md:justify-end">
                                            <button
                                                onClick={() => handleVote(policy.id, policy.votes)}
                                                disabled={votedIds.includes(policy.id)}
                                                className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all font-bold ${votedIds.includes(policy.id)
                                                    ? "bg-primary/20 text-primary border border-primary/30"
                                                    : "bg-white/5 border border-white/10 text-white hover:bg-primary hover:border-primary group/vote"
                                                    }`}
                                            >
                                                <div className="relative">
                                                    <Heart
                                                        size={20}
                                                        className={votedIds.includes(policy.id) ? "fill-current" : "group-hover/vote:fill-current"}
                                                    />
                                                </div>
                                                <div className="text-left leading-none">
                                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">
                                                        {votedIds.includes(policy.id) ? "ขอบคุณที่โหวต" : "โหวตนโยบายนี้"}
                                                    </p>
                                                    <p className="text-xl font-mono mt-1">{policy.votes || 0}</p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </main>

            {/* Footer / Back Link */}
            <footer className="py-12 border-t border-white/5 bg-black/50">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-sm">© 2026 สภานักเรียน GenZ Ignite. สภา GenZ คิดนอกกรอบ ตอบโจทย์ทุกไลฟ์สไตล์</p>
                    <div className="flex gap-8">
                        <a href="/" className="text-gray-400 hover:text-primary transition-colors text-sm font-bold italic">Back to Home</a>
                        <a href="/report" className="text-gray-400 hover:text-secondary transition-colors text-sm font-bold italic">Report Issue</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
