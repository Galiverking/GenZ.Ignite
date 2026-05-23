"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SettingsAdmin() {
    const [partyName, setPartyName] = useState("");
    const [electionDate, setElectionDate] = useState("");
    const [slogan, setSlogan] = useState("");
    const [sloganAccent, setSloganAccent] = useState("");
    const [candidateNumber, setCandidateNumber] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data, error } = await supabase
                    .from("site_settings")
                    .select("*")
                    .eq("id", 1)
                    .single();

                if (error) throw error;

                if (data) {
                    setPartyName(data.party_name || "");
                    setElectionDate(data.election_date ? data.election_date.split("T")[0] : "");
                    setSlogan(data.slogan || "");
                    setSloganAccent(data.slogan_accent || "");
                    setCandidateNumber(data.candidate_number || "");
                }
            } catch (err: any) {
                console.error("Error fetching site settings:", err);
                setErrorMsg(err.message || "ไม่สามารถดึงข้อมูลตั้งค่าระบบได้");
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setStatus("idle");
        setErrorMsg("");

        try {
            const formattedDate = electionDate ? `${electionDate}T08:00:00+07:00` : null;

            const { error } = await supabase
                .from("site_settings")
                .update({
                    party_name: partyName,
                    election_date: formattedDate,
                    slogan: slogan,
                    slogan_accent: sloganAccent,
                    candidate_number: candidateNumber,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", 1);

            if (error) throw error;

            setStatus("success");
            setTimeout(() => setStatus("idle"), 3000);
        } catch (err: any) {
            console.error("Error saving site settings:", err);
            setStatus("error");
            setErrorMsg(err.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-8 pb-12">
            <div>
                <h1 className="text-4xl font-black text-white tracking-tighter">
                    ตั้งค่า<span className="text-primary italic">ระบบ</span>
                </h1>
                <p className="text-gray-500 font-medium">
                    กำหนดข้อมูลพื้นฐานของสภาและแคมเปญหาเสียงสภานักเรียน ⚡
                </p>
            </div>

            {/* Theme Info */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <h2 className="text-xl font-bold text-white mb-4">Theme Configuration (CSS Variables)</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    เว็บไซต์สภานักเรียน GenZ Ignite ออกแบบด้วยตัวแปรสีระบบ CSS variables หากแอดมินต้องการปรับเปลี่ยนโทนสีหลักของแบรนด์พรรค สามารถเข้าไปแก้ไขค่าตัวแปรได้ในไฟล์ 
                    <code className="bg-black/40 px-2.5 py-1 rounded-md mx-1.5 text-primary font-mono text-xs border border-white/5">app/globals.css</code>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex gap-4 items-center bg-black/30 border border-white/5 p-4 rounded-2xl">
                        <div className="w-12 h-12 rounded-xl bg-[var(--primary)] border border-white/10 shadow-lg shadow-[var(--primary)]/20 shrink-0"></div>
                        <div className="min-w-0">
                            <code className="block text-xs text-gray-300 font-mono truncate">--primary</code>
                            <span className="text-[10px] text-gray-500 font-medium block">สีแดงส้มหลัก เน้นปุ่ม ลิงก์</span>
                        </div>
                    </div>

                    <div className="flex gap-4 items-center bg-black/30 border border-white/5 p-4 rounded-2xl">
                        <div className="w-12 h-12 rounded-xl bg-[var(--secondary)] border border-white/10 shadow-lg shadow-[var(--secondary)]/20 shrink-0"></div>
                        <div className="min-w-0">
                            <code className="block text-xs text-gray-300 font-mono truncate">--secondary</code>
                            <span className="text-[10px] text-gray-500 font-medium block">สีกรมท่าเข้ม พื้นหลังหลัก</span>
                        </div>
                    </div>

                    <div className="flex gap-4 items-center bg-black/30 border border-white/5 p-4 rounded-2xl">
                        <div className="w-12 h-12 rounded-xl bg-[var(--accent)] border border-white/10 shadow-lg shadow-[var(--accent)]/20 shrink-0"></div>
                        <div className="min-w-0">
                            <code className="block text-xs text-gray-300 font-mono truncate">--accent</code>
                            <span className="text-[10px] text-gray-500 font-medium block">สีส้มทอง ตัดตกแต่ง</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings Form */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                <h2 className="text-xl font-bold text-white mb-6">ข้อมูลทั่วไป & เมทาดาตาแคมเปญ</h2>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <Loader2 size={36} className="animate-spin text-primary" />
                        <p className="text-gray-500 text-sm font-bold">กำลังโหลดการตั้งค่า...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-6">
                        {status === "success" && (
                            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-xl text-sm font-bold">
                                <CheckCircle2 size={20} className="shrink-0" />
                                <span>บันทึกข้อมูลการตั้งค่าระบบเรียบร้อยแล้ว! ✨</span>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-xl text-sm font-bold">
                                <AlertCircle size={20} className="shrink-0" />
                                <span>ล้มเหลว: {errorMsg}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-300 mb-2">ชื่อพรรค / ชื่อสภา</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="เช่น GenZ Ignite"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    value={partyName}
                                    onChange={(e) => setPartyName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">หมายเลขพรรค</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="เช่น 03"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-bold text-center text-xl"
                                    value={candidateNumber}
                                    onChange={(e) => setCandidateNumber(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">สโลแกนหลัก (Slogan)</label>
                                <textarea
                                    rows={2}
                                    required
                                    placeholder="เช่น สภา GenZ คิดนอกกรอบ ตอบโจทย์ทุกไลฟ์สไตล์"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none text-sm"
                                    value={slogan}
                                    onChange={(e) => setSlogan(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">สโลแกนรอง / จุดเด่น (Accent Slogan)</label>
                                <textarea
                                    rows={2}
                                    required
                                    placeholder="เช่น เสียงของคุณ คือภารกิจของเรา"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none text-sm"
                                    value={sloganAccent}
                                    onChange={(e) => setSloganAccent(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2">วันที่เลือกตั้ง (Election Date)</label>
                            <input
                                type="date"
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                value={electionDate}
                                onChange={(e) => setElectionDate(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-primary hover:bg-red-600 text-white font-bold py-3.5 px-8 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 w-full md:w-auto"
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>กำลังบันทึกข้อมูล...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>บันทึกการเปลี่ยนแปลง</span>
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
