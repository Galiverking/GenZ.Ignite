"use client";

import { motion, Variants } from "framer-motion";

export default function HeroSection() {
    // Helper function for staggered animation
    const fadeUp = (delay: number): Variants => ({
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                delay: delay,
                ease: [0.2, 0.65, 0.3, 0.9] as const // Custom easing for smoothness
            },
        },
    });

    return (
        <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden text-center px-4 pt-20">

            {/* Background Decor (Blurred Circles) */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Main Content */}
            <motion.div initial="hidden" animate="visible" className="z-10 max-w-5xl mx-auto">

                {/* Small Badge */}
                <motion.div variants={fadeUp(0.1)} className="inline-block mb-4 px-3 py-1 bg-white/10 border border-white/10 rounded-full text-xs font-semibold tracking-wide text-gray-300 uppercase">
                    Student Council 2024
                </motion.div>

                {/* Giant Headline */}
                <motion.h1 variants={fadeUp(0.2)} className="text-6xl md:text-8xl font-bold tracking-tight text-white leading-[1.1] mb-6">
                    เปลี่ยนโรงเรียน <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                        ให้เป็นเรื่องของเรา
                    </span>
                </motion.h1>

                {/* Sub-headline */}
                <motion.p variants={fadeUp(0.4)} className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                    ไม่ใช่แค่กิจกรรม แต่คือการยกระดับคุณภาพชีวิต<br className="hidden md:block" />
                    พื้นที่แสดงออก และการตรวจสอบที่โปร่งใสที่สุด
                </motion.p>

                {/* Buttons Group */}
                <motion.div variants={fadeUp(0.6)} className="flex flex-col md:flex-row gap-4 justify-center items-center">
                    <button className="px-8 py-4 bg-primary text-white rounded-full text-lg font-bold hover:bg-red-600 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1">
                        ดูนโยบายหลัก
                    </button>
                    <button className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full text-lg font-medium hover:bg-white/10 transition-all hover:-translate-y-1">
                        ติดตามงบประมาณ
                    </button>
                </motion.div>

            </motion.div>
        </section>
    );
}
