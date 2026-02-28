"use client";

import { useEffect, useState } from "react";
import CouncilHero from "@/components/council/CouncilHero";
import AnnouncementsSection from "@/components/council/AnnouncementsSection";

import WhyVoteSection from "@/components/home/WhyVoteSection";
import TeamSection from "@/components/team/TeamSection";
import PolicyVoting from "@/components/campaign/PolicyVoting";
import LivePoll from "@/components/campaign/LivePoll";
import ComplaintForm from "@/components/home/ComplaintForm";
import { supabase } from "@/lib/supabase";

export default function Home() {
    const [policies, setPolicies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolicies = async () => {
            const { data } = await supabase
                .from("policies")
                .select("*")
                .order("id", { ascending: true });

            if (data && data.length > 0) {
                setPolicies(data);
            } else {
                setPolicies([
                    { id: 1, title: "ซ่อมพัดลมอาคาร 5", description: "ดำเนินการซ่อมพัดลมที่ชำรุด 12 ตัว", category: "อาคารสถานที่", votes: 45 },
                    { id: 2, title: "เพิ่มปลั๊กไฟโรงอาหาร", description: "ติดตั้งจุดชาร์จไฟเพิ่ม 20 จุด", category: "โครงสร้างพื้นฐาน", votes: 82 },
                    { id: 3, title: "จัดงาน Sport Day 2024", description: "เตรียมงานกีฬาสีประจำปี", category: "กิจกรรม", votes: 12 },
                ]);
            }
            setLoading(false);
        };

        fetchPolicies();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            {/* 1. Hero Section — สภานักเรียนอย่างเป็นทางการ */}
            <CouncilHero />

            {/* 2. ข่าวสาร/ประชาสัมพันธ์ล่าสุด */}
            <AnnouncementsSection />

            {/* 3. พันธกิจของเรา */}
            <WhyVoteSection />

            {/* 4. คณะกรรมการสภานักเรียน */}
            <TeamSection />

            {/* 5. นโยบายที่กำลังดำเนินงาน */}
            {loading ? (
                <div className="py-24 text-center">กำลังโหลดนโยบาย...</div>
            ) : (
                <PolicyVoting policies={policies} />
            )}

            {/* 6. โพลสำรวจความคิดเห็น */}
            <LivePoll />

            {/* 7. แจ้งเรื่องร้องเรียน */}
            <ComplaintForm />
        </div>
    );
}
