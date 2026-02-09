"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Heart } from "lucide-react";

export default function PolicyVoting({ policies }: { policies: any[] }) {
    const [localPolicies, setLocalPolicies] = useState(policies);
    const [votedIds, setVotedIds] = useState<any[]>([]);

    const handleVote = async (id: any, currentVotes: number) => {
        if (votedIds.includes(id)) return;

        // 1. Optimistic UI Update
        setLocalPolicies((prev) =>
            prev.map((p) => (p.id === id ? { ...p, votes: (p.votes || 0) + 1 } : p))
        );
        setVotedIds([...votedIds, id]);

        // 2. Send to Database
        const { error } = await supabase
            .from("policies")
            .update({ votes: (currentVotes || 0) + 1 })
            .eq("id", id);

        if (error) {
            console.error("Error voting:", error);
        }
    };

    return (
        <section className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-black mb-4"
                    >
                        ถ้าเราได้เป็น... <br />
                        <span className="text-secondary underline decoration-secondary/30">คุณอยากเห็นอะไรเกิดขึ้นจริง?</span>
                    </motion.h2>
                    <p className="text-gray-500 text-lg">
                        ร่วมโหวตนโยบายที่โดนใจคุณที่สุด เพื่อเป็นพลังให้เราขับเคลื่อน
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {localPolicies.map((policy, index) => (
                        <motion.div
                            key={policy.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-50 border border-gray-100 rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-primary/5 transition-all relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 bg-primary/10 text-primary text-[10px] font-bold px-4 py-2 rounded-bl-2xl uppercase tracking-tighter">
                                {policy.category}
                            </div>

                            <h3 className="text-2xl font-bold mb-4 mt-2 text-gray-900">{policy.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-8">
                                {policy.description}
                            </p>

                            <button
                                onClick={() => handleVote(policy.id, policy.votes)}
                                disabled={votedIds.includes(policy.id)}
                                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 font-bold ${votedIds.includes(policy.id)
                                    ? "bg-primary/10 text-primary border border-primary/20 scale-95"
                                    : "bg-black text-white hover:bg-secondary hover:-translate-y-1 shadow-lg shadow-secondary/10"
                                    }`}
                            >
                                <span className="text-sm">
                                    {votedIds.includes(policy.id) ? "โหวตแล้ว ❤️" : "อยากได้อันนี้"}
                                </span>
                                <div className="flex items-center gap-3">
                                    <Heart
                                        className={votedIds.includes(policy.id) ? "fill-primary" : ""}
                                        size={20}
                                    />
                                    <span className="font-mono text-xl">{(policy.votes || 0)}</span>
                                </div>
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
