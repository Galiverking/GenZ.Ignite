"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Loader2, CheckCircle2, Clock, AlertCircle, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function TrackComplaintPage() {
    const [trackId, setTrackId] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!trackId.trim()) {
            setError("กรุณากรอกรหัสอ้างอิง");
            return;
        }

        // Basic UUID format validation
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(trackId.trim())) {
            setError("รูปแบบรหัสอ้างอิงไม่ถูกต้อง (ต้องเป็น UUID)");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const { data, error: fetchError } = await supabase
                .from("complaints")
                .select("*")
                .eq("track_id", trackId.trim())
                .single();

            if (fetchError || !data) {
                setError("ไม่พบเรื่องร้องเรียนจากรหัสอ้างอิงนี้");
            } else {
                setResult(data);
            }
        } catch (err) {
            setError("เกิดข้อผิดพลาดในการเชื่อมต่อระบบ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white pt-32 pb-20 px-4 relative flex items-center justify-center">
            {/* Background effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-xl w-full relative z-10">
                <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 font-bold text-sm">
                    <ArrowLeft size={16} /> กลับหน้าหลัก
                </Link>

                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
                        ติดตามสถานะ <span className="text-primary italic">เรื่องร้องเรียน</span>
                    </h1>
                    <p className="text-gray-400">
                        นำรหัสอ้างอิง (Track ID) ที่ได้รับจากการแจ้งเรื่องร้องเรียน<br />มาตรวจสอบความคืบหน้าได้ที่นี่
                    </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 pointer-events-none" />

                    <form onSubmit={handleSearch} className="relative z-10">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="ใส่รหัสอ้างอิง (UUID)..."
                                    value={trackId}
                                    onChange={(e) => setTrackId(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-mono text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary hover:bg-secondary text-white px-8 py-4 rounded-2xl font-black italic tracking-wider transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center min-w-[140px]"
                            >
                                {loading ? <Loader2 size={24} className="animate-spin" /> : "ค้นหา"}
                            </button>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mt-4 flex items-center gap-2 text-red-400 text-sm font-bold bg-red-500/10 p-3 rounded-xl border border-red-500/20"
                                >
                                    <AlertCircle size={16} />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    <AnimatePresence mode="wait">
                        {result && (
                            <motion.div
                                key={result.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-8 pt-8 border-t border-white/10 relative z-10"
                            >
                                <div className="flex items-start justify-between gap-4 mb-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">
                                                {result.category}
                                            </span>
                                            <span className="text-[10px] text-gray-500 font-bold">
                                                แจ้งเมื่อ {new Date(result.created_at).toLocaleDateString('th-TH')}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white">{result.topic}</h3>
                                    </div>
                                    <div className="shrink-0 flex flex-col items-end">
                                        {result.status === "resolved" ? (
                                            <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-1.5 rounded-full text-xs font-black uppercase italic tracking-wider shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                                                <CheckCircle2 size={16} strokeWidth={3} /> แก้ไขแล้ว
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-4 py-1.5 rounded-full text-xs font-black uppercase italic tracking-wider">
                                                <Clock size={16} strokeWidth={3} /> รอดำเนินการ
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-black/40 rounded-2xl p-5 border border-white/5 mb-6">
                                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                        {result.message}
                                    </p>
                                </div>

                                {result.status === "resolved" && result.admin_reply && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-primary/10 rounded-2xl p-5 border border-primary/20 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                                        <div className="relative z-10">
                                            <h4 className="text-primary font-black text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                                                ตอบกลับจากสภานักเรียน
                                            </h4>
                                            <p className="text-white text-sm leading-relaxed whitespace-pre-wrap font-medium">
                                                {result.admin_reply}
                                            </p>
                                            {result.resolved_at && (
                                                <p className="text-xs text-primary/60 mt-3 font-bold">
                                                    ทำรายการเมื่อ: {new Date(result.resolved_at).toLocaleString('th-TH')}
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
