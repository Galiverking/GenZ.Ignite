"use client";

import { motion } from "framer-motion";

export function StatCard({ title, value, icon: Icon, color, label }: any) {
    const colors: any = {
        primary: "from-primary/20 to-transparent text-primary",
        secondary: "from-secondary/20 to-transparent text-secondary",
        accent: "from-accent/20 to-transparent text-accent",
        red: "from-red-500/20 to-transparent text-red-500"
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl relative overflow-hidden group"
        >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colors[color]} opacity-50 blur-2xl group-hover:scale-150 transition-transform duration-500`} />

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${colors[color].split(' ').pop()}`}>
                    <Icon size={24} />
                </div>
            </div>

            <div className="relative z-10">
                <h3 className="text-gray-500 text-sm font-bold">{title}</h3>
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-white tracking-tighter italic">{value}</p>
                </div>
                <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest mt-1">{label}</p>
            </div>
        </motion.div>
    );
}
