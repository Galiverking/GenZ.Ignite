"use client";

import { useEffect, useState } from "react";
import CouncilHero from "@/components/council/CouncilHero";
import AnnouncementsSection from "@/components/council/AnnouncementsSection";

import WhyVoteSection from "@/components/home/WhyVoteSection";
import TeamSection from "@/components/team/TeamSection";
import PolicyVoting from "@/components/campaign/PolicyVoting";
import LivePoll from "@/components/campaign/LivePoll";
import ComplaintForm from "@/components/home/ComplaintForm";
import PlatformStats from "@/components/home/PlatformStats";
import { AlertTriangle, RefreshCw, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Home() {
    const [policies, setPolicies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPolicies = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from("policies")
                .select("*")
                .order("id", { ascending: true });

            if (error) throw error;

            setPolicies(data || []);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "ไม่สามารถโหลดข้อมูลได้";
            console.error("Error fetching policies:", err);
            setError(msg);
            setPolicies([]); // Reset — no mock data
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolicies();
    }, []);

    // ────────── Error State ──────────
    if (error) {
        return (
            <div className="flex flex-col items-center min-h-screen">
                <CouncilHero />
                <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                        <AlertTriangle size={40} className="text-red-400" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2">
                        โหลดข้อมูลไม่ได้
                    </h2>
                    <p className="text-gray-400 max-w-md mb-8">
                        {error}
                    </p>
                    <button
                        onClick={fetchPolicies}
                        className="bg-primary hover:bg-red-600 text-white font-bold px-8 py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        <RefreshCw size={18} />
                        ลองใหม่
                    </button>
                </div>
            </div>
        );
    }

    // ────────── Empty State ──────────
    const showEmpty = !loading && policies.length === 0;

    return (
        <div className="flex flex-col min-h-screen">
            {/* 1. Hero Section */}
            <CouncilHero />

            {/* 2. Announcements */}
            <AnnouncementsSection />

            {/* 3. Why Vote */}
            <WhyVoteSection />

            {/* 4. Team */}
            <TeamSection />

            {/* 5. Policies */}
            {loading ? (
                <div className="py-24 text-center">
                    <div className="flex justify-center gap-2 mb-4">
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                        <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                    </div>
                    <p className="text-gray-500 text-sm font-black uppercase tracking-widest animate-pulse">
                        กำลังโหลดนโยบาย...
                    </p>
                </div>
            ) : showEmpty ? (
                <div className="py-24 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <FileText size={32} className="text-gray-500" />
                    </div>
                    <p className="text-gray-500 text-lg font-bold">ยังไม่มีนโยบาย</p>
                    <p className="text-gray-600 text-sm">รออัปเดตจากทีมสภานักเรียน</p>
                </div>
            ) : (
                <PolicyVoting policies={policies} />
            )}

            {/* 6. Live Poll */}
            <LivePoll />

            {/* 7. Complaint Form */}
            <ComplaintForm />

            {/* 8. Platform Stats */}
            <PlatformStats />
        </div>
    );
}
