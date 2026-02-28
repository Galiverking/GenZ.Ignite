"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PolicyCard from "@/components/policy/PolicyCard";
import { Policy } from "@/types";
import FadeIn from "@/components/animations/FadeIn";

export default function PolicySection() {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolicies = async () => {
            // Mock data for initial render until Supabase is populated/connected
            // This ensures the UI looks good immediately for the user
            const mockData: Policy[] = [
                { id: '1', title: 'ซ่อมพัดลมอาคาร 5', description: 'ดำเนินการซ่อมพัดลมที่ชำรุด 12 ตัว', category: 'อาคารสถานที่', status: 'in_progress', progress: 60, image_url: '' },
                { id: '2', title: 'เพิ่มปลั๊กไฟโรงอาหาร', description: 'ติดตั้งจุดชาร์จไฟเพิ่ม 20 จุด', category: 'โครงสร้างพื้นฐาน', status: 'completed', progress: 100, image_url: '' },
                { id: '3', title: 'จัดงาน Sport Day 2024', description: 'เตรียมงานกีฬาสีประจำปี', category: 'กิจกรรม', status: 'pending', progress: 15, image_url: '' },
            ];

            const { data, error } = await supabase
                .from("policies")
                .select("*")
                .order("id", { ascending: true });

            if (data && data.length > 0) {
                setPolicies(data);
            } else {
                // Fallback to mock data if DB is empty or connection fails (for demo purposes)
                console.warn("Using mock policy data");
                setPolicies(mockData);
            }
            setLoading(false);
        };

        fetchPolicies();
    }, []);

    return (
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <FadeIn>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            นโยบายที่จับต้องได้
                        </h2>
                        <p className="text-gray-400">
                            ติดตามทุกความเคลื่อนไหว ไม่ใช่แค่คำสัญญา
                        </p>
                    </FadeIn>
                </div>

                {/* Content */}
                {loading ? (
                    // Skeleton Loading
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-64 bg-white/5 border border-white/10 rounded-2xl animate-pulse"
                            ></div>
                        ))}
                    </div>
                ) : (
                    // Real Data Grid
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {policies.map((policy, index) => (
                            <PolicyCard key={policy.id} policy={policy} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
