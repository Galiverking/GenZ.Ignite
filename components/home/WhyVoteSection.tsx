"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, HeartPulse, Rocket } from "lucide-react";

const REASONS = [
    {
        icon: Zap,
        title: "รวดเร็ว (Fast Action)",
        description: "ทุกปัญหาที่แจ้งผ่านระบบ จะได้รับการตอบรับและเริ่มดำเนินการภายใน 24 ชั่วโมง",
        color: "text-primary",
        bg: "bg-primary/10",
    },
    {
        icon: ShieldCheck,
        title: "โปร่งใส (Transparency)",
        description: "เปิดเผยงบประมาณและขั้นตอนการดำเนินงานนโยบายแบบ Real-time บนเว็บไซต์",
        color: "text-secondary",
        bg: "bg-secondary/10",
    },
    {
        icon: HeartPulse,
        title: "ใส่ใจ (Empathy)",
        description: "เน้นนโยบายที่พัฒนาคุณภาพชีวิตนักเรียนจริงๆ จากเสียงบ่นในโรงอาหารสู่การแก้ไข",
        color: "text-primary",
        bg: "bg-primary/10",
    },
    {
        icon: Rocket,
        title: "ล้ำสมัย (Innovation)",
        description: "ใช้เทคโนโลยีเข้ามาจัดการระบบสภานักเรียน ให้เข้าถึงง่ายและมีประสิทธิภาพที่สุด",
        color: "text-secondary",
        bg: "bg-secondary/10",
    },
];

export default function WhyVoteSection() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-black mb-4"
                    >
                        ทำไมต้องเลือก <span className="text-primary italic">เบอร์ 03?</span>
                    </motion.h2>
                    <p className="text-gray-500 text-lg">
                        เราไม่ได้มาเพื่อขายฝัน แต่เรามาเพื่อเปลี่ยนระบบให้ดีขึ้น
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {REASONS.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex gap-6 p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all group"
                        >
                            <div className={`shrink-0 w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <item.icon size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2 text-gray-900">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
