"use client";

import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

interface MemberProps {
    member: any;
    index: number;
}

export default function MemberCard({ member, index }: MemberProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-black border border-white/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500"
        >
            {/* Image Wrapper */}
            <div className="aspect-[4/5] overflow-hidden relative bg-gray-200">
                {/* Actual Image */}
                <img
                    src={member.image_url || "/placeholder-user.jpg"}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            </div>

            {/* Text Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-primary font-bold text-xs uppercase tracking-wider mb-1">
                    {member.role}
                </p>
                <h3 className="text-2xl font-bold leading-tight mb-2">
                    {member.nickname}{" "}
                    <span className="text-base font-normal opacity-80 block">
                        {member.name}
                    </span>
                </h3>

                <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-300">
                    <p className="text-gray-300 text-sm italic border-l-2 border-primary pl-3 mb-3">
                        "{member.quote}"
                    </p>
                    {member.instagram && (
                        <a
                            href={`https://instagram.com/${member.instagram}`}
                            target="_blank"
                            className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                        >
                            <Instagram size={16} /> IG: {member.instagram}
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
