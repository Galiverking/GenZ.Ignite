"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Send, CheckCircle2, AlertTriangle } from "lucide-react";

export default function ReportPage() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        topic: "",
        category: "ทั่วไป",
        message: "",
        contact: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from("complaints").insert([formData]);

        setLoading(false);

        if (error) {
            console.error(error);
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3000);
        } else {
            setStatus("success");
            setFormData({ topic: "", category: "ทั่วไป", message: "", contact: "" });
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <section className="pt-32 pb-16 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent z-0" />
                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold mb-6 uppercase tracking-widest"
                    >
                        <AlertTriangle size={16} />
                        แจ้งเรื่องร้องเรียน
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-white mb-6"
                    >
                        เสียงของคุณ <span className="text-primary italic">สำคัญ</span>
                    </motion.h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto font-medium">
                        พบปัญหา? มีไอเดีย? หรืออยากให้ปรับปรุงอะไร? ส่งตรงถึงสภานักเรียนได้ทันที ข้อมูลเป็นความลับ
                    </p>
                </div>
            </section>

            {/* Form */}
            <main className="max-w-2xl mx-auto px-4 pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem]"
                >
                    <AnimatePresence mode="wait">
                        {status === "success" ? (
                            <motion.div
                                key="success"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="flex flex-col items-center justify-center h-64 text-center"
                            >
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/30">
                                    <CheckCircle2 size={40} color="white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">ได้รับเรื่องแล้ว!</h3>
                                <p className="text-gray-300">ขอบคุณที่ช่วยกันทำให้โรงเรียนดีขึ้น</p>
                            </motion.div>
                        ) : status === "error" ? (
                            <motion.div
                                key="error"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="flex flex-col items-center justify-center h-64 text-center"
                            >
                                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-red-500/30">
                                    <AlertTriangle size={40} color="white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">เกิดข้อผิดพลาด</h3>
                                <p className="text-gray-300">กรุณาลองใหม่อีกครั้ง</p>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">เรื่องที่แจ้ง</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="เช่น แอร์ห้องสมุดไม่เย็น, น้ำไม่ไหล"
                                        className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                        value={formData.topic}
                                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-2">หมวดหมู่</label>
                                        <select
                                            className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="ทั่วไป">ทั่วไป</option>
                                            <option value="อาคารสถานที่">อาคารสถานที่</option>
                                            <option value="วิชาการ">วิชาการ</option>
                                            <option value="กิจกรรม">กิจกรรม</option>
                                            <option value="ความปลอดภัย">ความปลอดภัย</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-2">ติดต่อกลับ (ไม่บังคับ)</label>
                                        <input
                                            type="text"
                                            placeholder="IG / Line ID"
                                            className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                                            value={formData.contact}
                                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">รายละเอียด</label>
                                    <textarea
                                        required
                                        rows={4}
                                        placeholder="อธิบายเพิ่มเติม..."
                                        className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                                    ) : (
                                        <>
                                            <span>ส่งเรื่องร้องเรียน</span>
                                            <Send size={18} />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
        </div>
    );
}
