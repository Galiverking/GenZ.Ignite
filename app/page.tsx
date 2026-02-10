"use client";

import { useEffect, useState } from "react";
import CampaignHero from "@/components/campaign/CampaignHero";

import PolicyVoting from "@/components/campaign/PolicyVoting";
import LivePoll from "@/components/campaign/LivePoll";
import SocialShareCard from "@/components/campaign/SocialShareCard";
import WhyVoteSection from "@/components/home/WhyVoteSection";
import TeamSection from "@/components/team/TeamSection";
import ComplaintForm from "@/components/home/ComplaintForm";
import Navbar from "@/components/shared/Navbar";
import VoteFloatingButton from "@/components/ui/VoteFloatingButton";
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
                // Mock data fallback if DB empty
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
            <Navbar />

            {/* 2. Hero Section (Campaign Mode) */}
            <CampaignHero />


            {/* 4. Why Vote For Us? */}
            <WhyVoteSection />

            {/* 4.1 Meet the Team */}
            <TeamSection />

            {/* 5. Policy Section (Campaign Voting) */}
            {loading ? (
                <div className="py-24 text-center">Loading Pledges...</div>
            ) : (
                <PolicyVoting policies={policies} />
            )}

            {/* 6. Live Poll (Real-time Problem Checking) */}
            <LivePoll />

            {/* 7. Join the Movement (Support ID Card) */}
            <SocialShareCard />

            {/* 8. Student Voice (Complaint Form) */}
            <ComplaintForm />

            {/* Sticky Call to Action */}
            <VoteFloatingButton />
        </div>
    );
}
