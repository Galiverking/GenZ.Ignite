"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Send, CheckCircle2 } from "lucide-react";

export default function ComplaintForm() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    // Form State
    const [formData, setFormData] = useState({
        topic: "",
        category: "ทั่วไป",
        message: "",
        contact: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Send data to Supabase
        const { error } = await supabase.from("complaints").insert([formData]);

        setLoading(false);

        if (error) {
            console.error(error);
            setStatus("error");
        } else {
            setStatus("success");
            // Reset form
            setFormData({ topic: "", category: "ทั่วไป", message: "", contact: "" });
            // Return to idle state after 3 seconds
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    return (
        <section className="py-20 px-4 bg-black text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gray-800 via-black to-black opacity-50" />

            <div className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row gap-12 items-center">
                {/* Left Side: Text Copy */}
                <div className="flex-1 text-center md:text-left">
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
                    >
                        เสียงของคุณ <br />
                        <span className="text-primary">คือภารกิจของเรา</span>
                    </motion.h2>
                    <p className="text-gray-400 text-lg mb-8">
                        เจอปัญหา? มีไอเดีย? หรืออยากระบาย? <br />
                        ส่งตรงถึงสภานักเรียนได้ทันที ไม่ต้องผ่านครู ข้อมูลเป็นความลับ
                    </p>
                </div>

                {/* Right Side: The Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="flex-1 w-full bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl"
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
                                <h3 className="text-2xl font-bold">ได้รับเรื่องแล้ว!</h3>
                                <p className="text-gray-300">
                                    ขอบคุณที่ช่วยกันทำให้โรงเรียนดีขึ้น
                                </p>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        เรื่องที่แจ้ง
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="เช่น แอร์ห้องสมุดไม่เย็น, น้ำไม่ไหล"
                                        className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                        value={formData.topic}
                                        onChange={(e) =>
                                            setFormData({ ...formData, topic: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            หมวดหมู่
                                        </label>
                                        <select
                                            className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                            value={formData.category}
                                            onChange={(e) =>
                                                setFormData({ ...formData, category: e.target.value })
                                            }
                                        >
                                            <option value="ทั่วไป">ทั่วไป</option>
                                            <option value="อาคารสถานที่">อาคารสถานที่</option>
                                            <option value="วิชาการ">วิชาการ</option>
                                            <option value="กิจกรรม">กิจกรรม</option>
                                            <option value="ความปลอดภัย">ความปลอดภัย</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            ติดต่อกลับ (ไม่บังคับ)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="IG / Line ID"
                                            className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                                            value={formData.contact}
                                            onChange={(e) =>
                                                setFormData({ ...formData, contact: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        รายละเอียด
                                    </label>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="อธิบายเพิ่มเติม..."
                                        className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                        value={formData.message}
                                        onChange={(e) =>
                                            setFormData({ ...formData, message: e.target.value })
                                        }
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary hover:bg-secondary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
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
            </div>
        </section>
    );
}
