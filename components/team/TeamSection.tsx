"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import MemberCard from "./MemberCard";

export default function TeamSection() {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            const { data } = await supabase
                .from("members")
                .select("*")
                .order("order", { ascending: true });

            if (data && data.length > 0) {
                setMembers(data);
            } else {
                // Mock data for 15 members if DB is empty
                const mockMembers = Array.from({ length: 15 }).map((_, i) => ({
                    id: i + 1,
                    name: `ชื่อ-นามสกุล จริง คนที่ ${i + 1}`,
                    nickname: `สมาชิก ${i + 1}`,
                    role: i === 0 ? "หัวหน้าพรรค (เบอร์ 03)" : i < 3 ? "รองหัวหน้าพรรค" : "กรรมการพรรค",
                    quote: "สภา GenZ คิดนอกกรอบ ตอบโจทย์ทุกไลฟ์สไตล์",
                    instagram: `genz_ignite_${i + 1}`,
                    image_url: `/team/member-${i + 1}.jpg`,
                    order: i
                }));
                setMembers(mockMembers);
            }
            setLoading(false);
        };

        fetchMembers();
    }, []);

    return (
        <section id="team" className="py-24 bg-[var(--background)]">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold mb-4 uppercase tracking-widest"
                    >
                        The Team
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                    >
                        ทำความรู้จัก <span className="text-primary italic">ทีม GenZ Ignite</span>
                    </motion.h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        กลุ่มคนรุ่นใหม่ไฟแรง 15 คน ที่พร้อมจะเปลี่ยนแปลงโรงเรียนของเราให้ก้าวไกลไปกว่าเดิม
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {members.map((member, index) => (
                            <MemberCard key={member.id} member={member} index={index} />
                        ))}
                    </div>
                )}

                <div className="mt-16 text-center">
                    <p className="text-gray-500 text-sm">
                        * ทีมงานพรรค GenZ Ignite ทุกคนพร้อมรับฟังคำแนะนำจากเพื่อนสมาชิกทุกคน
                    </p>
                </div>
            </div>
        </section>
    );
}
