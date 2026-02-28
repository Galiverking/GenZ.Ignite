"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import MemberCard from "@/components/team/MemberCard";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function TeamPage() {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            // Mock data for initial render/fallback
            const mockMembers = [
                {
                    id: 1,
                    nickname: "Boom",
                    name: "Thanakorn",
                    role: "President",
                    quote: "Make school great again",
                    image_url: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=800&auto=format&fit=crop&q=60",
                    instagram: "boom_th",
                },
                {
                    id: 2,
                    nickname: "Jane",
                    name: "Jiraporn",
                    role: "Vice President",
                    quote: "Listening to every voice",
                    image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60",
                    instagram: "jane.jira",
                },
                {
                    id: 3,
                    nickname: "Kop",
                    name: "Kittipong",
                    role: "Secretary",
                    quote: "Transparency is key",
                    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
                    instagram: "kop.kitti",
                },
                {
                    id: 4,
                    nickname: "Pun",
                    name: "Punpun",
                    role: "Activity Lead",
                    quote: "Fun & Knowledge",
                    image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60",
                    instagram: "punpun.act",
                }
            ];

            const { data, error } = await supabase
                .from("members")
                .select("*")
                .order("order", { ascending: true });

            if (data && data.length > 0) {
                setMembers(data);
            } else {
                console.warn("Using mock member data");
                setMembers(mockMembers);
            }
            setLoading(false);
        };

        fetchMembers();
    }, []);

    return (
        <main className="min-h-screen bg-secondary">
            <Navbar />

            {/* Header Section */}
            <section className="pt-32 pb-16 px-4 bg-white rounded-b-[3rem] shadow-sm mb-12">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold text-black tracking-tight mb-6"
                    >
                        ทีมงาน<span className="text-primary">สภานักเรียน</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-500 max-w-2xl mx-auto"
                    >
                        คณะกรรมการสภานักเรียนที่ได้รับเลือกตั้ง พร้อมทำงานเพื่อเพื่อนนักเรียนทุกคน
                    </motion.p>
                </div>
            </section>

            {/* Grid */}
            <section className="max-w-7xl mx-auto px-4 pb-20">
                {loading ? (
                    // Skeleton Loading
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="aspect-[4/5] bg-gray-200 rounded-3xl animate-pulse"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {members.map((member, index) => (
                            <MemberCard key={member.id} member={member} index={index} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
