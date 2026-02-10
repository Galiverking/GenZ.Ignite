"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Zap, CheckCircle2 } from "lucide-react";

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

export default function LivePoll() {
    const [data, setData] = useState<any[]>([]);
    const [isVoted, setIsVoted] = useState(false);

    const fetchPolls = async () => {
        const { data: polls } = await supabase
            .from("polls")
            .select("*")
            .order("id", { ascending: true });

        if (polls && polls.length > 0) {
            setData(polls);
        } else {
            // Mock data for fallback
            setData([
                { id: 1, option_name: "วิชาการ", votes: 12 },
                { id: 2, option_name: "สถานที่", votes: 25 },
                { id: 3, option_name: "กิจกรรม", votes: 18 },
                { id: 4, option_name: "โปร่งใส", votes: 40 },
            ]);
        }
    };

    useEffect(() => {
        fetchPolls();

        // Set up Realtime listener
        const channel = supabase
            .channel("live_polls")
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "polls" },
                (payload) => {
                    setData((prev) =>
                        prev.map((item) =>
                            item.id === payload.new.id ? payload.new : item
                        )
                    );
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleVote = async (id: number, currentVotes: number) => {
        if (isVoted) return;
        setIsVoted(true);
        await supabase
            .from("polls")
            .update({ votes: currentVotes + 1 })
            .eq("id", id);
    };

    return (
        <section className="py-24 bg-[#020617] relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
            <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none opacity-50" />

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-black uppercase tracking-[0.3em] mb-6"
                    >
                        <Zap size={14} className="fill-primary" />
                        Live Poll Tracking
                    </motion.div>

                    <h2 className="text-5xl font-black text-white mb-6 tracking-tighter italic">
                        คุณอยากให้แก้ปัญหาอะไร <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">เป็นอันดับ 1?</span>
                    </h2>

                    <p className="text-gray-500 font-medium max-w-xl mx-auto">
                        กราฟแสดงผลแบบเรียลไทม์ โชว์ความโปร่งใสของเสียงนักเรียนทุกคน
                        <span className="text-primary ml-1 font-bold italic">ร่วมกำหนดทิศทางโรงเรียนไปกับเรา</span>
                    </p>
                </div>

                {/* Chart Area - Glassmorphism Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] mb-12 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-10 text-white/5 pointer-events-none group-hover:text-primary/10 transition-colors duration-500">
                        <Activity size={180} strokeWidth={1} />
                    </div>

                    <div className="h-[350px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} layout="vertical" margin={{ left: 20, right: 40 }}>
                                <defs>
                                    {COLORS.map((color, i) => (
                                        <linearGradient key={`grad-${i}`} id={`colorBars-${i}`} x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="5%" stopColor={color} stopOpacity={0.9} />
                                            <stop offset="95%" stopColor={color} stopOpacity={0.4} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="option_name"
                                    type="category"
                                    width={100}
                                    tick={{ fontSize: 14, fontWeight: "900", fill: "#94a3b8", fontFamily: "inherit" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: "rgba(255,255,255,0.03)", radius: 16 }}
                                    contentStyle={{
                                        backgroundColor: '#0d1117',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '20px',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
                                        color: '#fff',
                                        fontWeight: 'bold'
                                    }}
                                    itemStyle={{ color: 'var(--primary)' }}
                                />
                                <Bar
                                    dataKey="votes"
                                    radius={[0, 16, 16, 0]}
                                    animationDuration={2000}
                                    barSize={40}
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={`url(#colorBars-${index % COLORS.length})`}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Voting Buttons for Poll */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <AnimatePresence>
                        {data.map((item, index) => (
                            <motion.button
                                key={item.id}
                                whileHover={{ y: -5, scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleVote(item.id, item.votes)}
                                disabled={isVoted}
                                className={`
                                    relative p-6 rounded-[2rem] border transition-all duration-300 flex flex-col items-center gap-3 group
                                    ${isVoted
                                        ? "bg-white/5 border-white/5 opacity-50 cursor-default"
                                        : "bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/10"
                                    }
                                `}
                            >
                                <div
                                    className="w-4 h-4 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:scale-125 transition-transform"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className="text-sm font-black text-white uppercase tracking-tight italic">
                                    {item.option_name}
                                </span>
                                {isVoted && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full border-4 border-[#020617]"
                                    >
                                        <CheckCircle2 size={12} />
                                    </motion.div>
                                )}
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>

                {isVoted && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center mt-8 text-primary font-black italic text-sm tracking-widest animate-pulse"
                    >
                        ขอบคุณที่ร่วมเป็นส่วนหนึ่งของเสียงแห่งความเปลี่ยนแปลง! 🗳️✨
                    </motion.p>
                )}
            </div>
        </section>
    );
}
