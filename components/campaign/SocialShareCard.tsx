"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Download, Share2 } from "lucide-react";

export default function SocialShareCard() {
    const [name, setName] = useState("");
    const [showCard, setShowCard] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            setShowCard(true);
        }
    };

    return (
        <section className="py-24 bg-black text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/30 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/30 blur-[120px] rounded-full" />

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Join the Movement!
                    </h2>
                    <p className="text-gray-400 text-lg">
                        พิมพ์ชื่อของคุณ เพื่อร่วมเป็นส่วนหนึ่งของการเปลี่ยนแปลง
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
                    {/* Form */}
                    <div className="w-full max-w-sm">
                        <form onSubmit={handleGenerate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    ชื่อเล่นของคุณ (Nickname)
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="ใส่ชื่อที่นี่..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <span>สร้างบัตรผู้สนับสนุน</span>
                                <Share2 size={18} />
                            </button>
                        </form>
                    </div>

                    {/* Preview Card */}
                    <AnimatePresence>
                        {showCard && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                className="w-full max-w-[320px]"
                            >
                                <div
                                    ref={cardRef}
                                    className="aspect-[3/4] bg-white rounded-[2rem] p-8 text-black flex flex-col justify-between relative shadow-2xl overflow-hidden"
                                >
                                    {/* Card Background Patterns */}
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full" />
                                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/5 rounded-full" />

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="w-14 h-14 relative flex items-center justify-center">
                                                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    Supporter ID
                                                </p>
                                                <p className="text-xs font-bold text-secondary">#TEAM-GENZ-IGNITE</p>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">
                                                Official Supporter
                                            </p>
                                            <h3 className="text-4xl font-extrabold tracking-tighter">
                                                {name}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="relative z-10">
                                        <div className="border-t border-gray-100 pt-6 mb-6">
                                            <p className="text-sm italic text-gray-600 leading-tight">
                                                "เพราะความเสียงของเรา คือพลังที่จะเปลี่ยนโรงเรียนให้ดีขึ้น"
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">Vote for Number</p>
                                                <p className="text-4xl font-black italic bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">03</p>
                                            </div>
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center p-2">
                                                {/* Fake QR for aesthetic */}
                                                <div className="w-full h-full bg-black/10 rounded-sm grid grid-cols-4 grid-rows-4 gap-1 p-1">
                                                    {[...Array(16)].map((_, i) => (
                                                        <div key={i} className={`bg-black/${Math.random() > 0.5 ? '80' : '10'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-center mt-4 text-xs text-gray-500">
                                    แคปหน้าจอ (Screenshot) เพื่อนำไปลง IG Story ได้เลย!
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
