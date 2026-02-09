"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function CampaignHero() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    // Target election date: 18 กุมภาพันธ์ 2569 (2026-02-18)
    useEffect(() => {
        const electionDate = new Date("2026-02-18T08:00:00");

        const timer = setInterval(() => {
            const now = new Date();
            const difference = electionDate.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="h-screen flex flex-col justify-center items-center bg-black text-white px-4 text-center relative overflow-hidden">
            {/* Background Graphic */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/30 via-secondary/20 to-black z-0 opacity-80" />

            <div className="z-10">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8 w-32 h-32 mx-auto relative"
                >
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,102,0,0.3)]" />
                </motion.div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-6 inline-block bg-primary text-white px-6 py-2 rounded-full font-bold text-xl tracking-widest uppercase shadow-lg shadow-primary/20"
                >
                    Vote Number
                </motion.div>

                {/* Big Candidate Number */}
                <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-[12rem] md:text-[18rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary to-white drop-shadow-[0_20px_50px_rgba(255,102,0,0.3)] select-none"
                >
                    03
                </motion.h1>

                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl md:text-5xl font-bold mb-12 text-gray-200 tracking-tight"
                >
                    พรรค GenZ Ignite <br />
                    <span className="text-primary italic">"สภา GenZ คิดนอกกรอบ ตอบโจทย์ทุกไลฟ์สไตล์"</span>
                </motion.h2>

                {/* Countdown Timer */}
                <div className="grid grid-cols-4 gap-4 md:gap-12 max-w-4xl mx-auto backdrop-blur-sm bg-white/5 p-8 rounded-3xl border border-white/10">
                    {[
                        { label: "วัน", value: timeLeft.days },
                        { label: "ชั่วโมง", value: timeLeft.hours },
                        { label: "นาที", value: timeLeft.minutes },
                        { label: "วินาที", value: timeLeft.seconds },
                    ].map((item, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <motion.span
                                key={item.value}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-4xl md:text-7xl font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-white"
                            >
                                {String(item.value).padStart(2, "0")}
                            </motion.span>
                            <span className="text-xs md:text-sm text-gray-500 uppercase mt-2 tracking-widest font-bold">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
