"use client";

import { motion } from "framer-motion";
import { Policy } from "@/types";

// Function to select color based on status
const getStatusClasses = (status: string) => {
    switch (status) {
        case "completed":
            return {
                bg: "bg-green-100",
                text: "text-green-700",
                dot: "bg-green-500",
            };
        case "in_progress":
            return {
                bg: "bg-yellow-100",
                text: "text-yellow-700",
                dot: "bg-yellow-500",
            };
        default:
            return {
                bg: "bg-gray-100",
                text: "text-gray-600",
                dot: "bg-gray-400",
            };
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case "completed":
            return "สำเร็จแล้ว";
        case "in_progress":
            return "กำลังดำเนินการ";
        default:
            return "รออนุมัติ";
    }
};

interface PolicyCardProps {
    policy: Policy;
    index: number;
}

export default function PolicyCard({ policy, index }: PolicyCardProps) {
    const statusClasses = getStatusClasses(policy.status);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }} // Stagger Effect
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:bg-white/10 transition-all duration-300 flex flex-col justify-between h-full group"
        >
            <div>
                {/* Header: Category + Status */}
                <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
                        {policy.category}
                    </span>
                    <span
                        className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${statusClasses.bg} ${statusClasses.text}`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusClasses.dot}`} />
                        {getStatusLabel(policy.status)}
                    </span>
                </div>

                {/* Title & Desc */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {policy.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                    {policy.description}
                </p>
            </div>

            {/* Footer: Progress Bar */}
            <div className="mt-auto">
                <div className="flex justify-between text-xs mb-1 font-medium text-gray-500">
                    <span>ความคืบหน้า</span>
                    <span>{policy.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${policy.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className={`h-2.5 rounded-full ${policy.status === "completed" ? "bg-green-500" : "bg-primary"
                            }`}
                    />
                </div>
            </div>
        </motion.div>
    );
}
