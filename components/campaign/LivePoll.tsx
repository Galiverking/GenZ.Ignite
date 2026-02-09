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
import { motion } from "framer-motion";

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

export default function LivePoll() {
    const [data, setData] = useState<any[]>([]);

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
        await supabase
            .from("polls")
            .update({ votes: currentVotes + 1 })
            .eq("id", id);
    };

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Live Poll! <br />
                        <span className="text-primary text-2xl uppercase tracking-widest">
                            คุณอยากให้แก้ปัญหาอะไรเป็นอันดับ 1?
                        </span>
                    </h2>
                    <p className="text-gray-500">
                        กราฟวิ่งสดๆ โชว์ความโปร่งใส ไม่มีการพักหลังโรงเรือน
                    </p>
                </div>

                {/* Chart Area */}
                <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 mb-12">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="option_name"
                                    type="category"
                                    width={150}
                                    tick={{ fontSize: 14, fontWeight: "bold" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: "transparent" }}
                                    contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                                />
                                <Bar
                                    dataKey="votes"
                                    radius={[0, 10, 10, 0]}
                                    animationDuration={1500}
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            fillOpacity={0.8}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Voting Buttons for Poll */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {data.map((item, index) => (
                        <button
                            key={item.id}
                            onClick={() => handleVote(item.id, item.votes)}
                            className="bg-white border border-gray-100 px-4 py-4 rounded-2xl hover:shadow-lg transition-all active:scale-95 text-sm font-bold flex flex-col items-center gap-2 group"
                        >
                            <div
                                className="w-3 h-3 rounded-full group-hover:scale-150 transition-transform"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            {item.option_name}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
