"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, MessageSquare, ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Complaint } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";

export default function NotificationBell() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchPendingComplaints = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("complaints")
                .select("*")
                .eq("status", "pending")
                .order("created_at", { ascending: false })
                .limit(5); // Show only top 5 recent

            if (error) throw error;
            if (data) setComplaints(data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingComplaints();

        // Optional: Set up an interval or real-time listener here if desired.
        // For now, refreshing on mount is requested.
        const intervalId = setInterval(fetchPendingComplaints, 60000); // refresh every minute

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            clearInterval(intervalId);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            fetchPendingComplaints(); // Refresh when opening
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
                <Bell size={20} className={complaints.length > 0 ? "animate-pulse text-white" : ""} />
                {complaints.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-primary text-[9px] font-bold text-white items-center justify-center border border-[#020617]">
                            {complaints.length > 9 ? '9+' : complaints.length}
                        </span>
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 bg-[#0f172a] border border-white/10 rounded-2xl shadow-xl shadow-black/50 overflow-hidden z-50 backdrop-blur-xl"
                    >
                        <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                            <h3 className="font-bold text-sm text-white flex items-center gap-2">
                                <Bell size={16} className="text-primary" />
                                การแจ้งเตือน
                            </h3>
                            <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-gray-300">
                                {complaints.length} รายการใหม่
                            </span>
                        </div>

                        <div className="max-h-80 overflow-y-auto no-scrollbar">
                            {loading ? (
                                <div className="p-6 flex justify-center items-center">
                                    <Loader2 className="animate-spin text-primary" size={24} />
                                </div>
                            ) : complaints.length === 0 ? (
                                <div className="p-6 text-center text-sm text-gray-400 font-medium">
                                    <div className="bg-white/5 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Bell size={20} className="text-gray-500" />
                                    </div>
                                    ไม่มีการแจ้งเตือนใหม่
                                </div>
                            ) : (
                                <ul className="divide-y divide-white/5">
                                    {complaints.map((complaint) => (
                                        <li key={complaint.id} className="hover:bg-white/5 transition-colors">
                                            <Link href={`/admin/complaints`} className="p-4 flex gap-3 items-start" onClick={() => setIsOpen(false)}>
                                                <div className="shrink-0 mt-1">
                                                    <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
                                                        <MessageSquare size={14} />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">
                                                        {complaint.topic}
                                                    </p>
                                                    <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                                                        {complaint.message}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500 mt-2 font-medium">
                                                        {formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true, locale: th })}
                                                    </p>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="p-3 border-t border-white/10 bg-black/20">
                            <Link
                                href="/admin/complaints"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center gap-2 w-full py-2 text-xs font-bold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors group"
                            >
                                ดูเรื่องร้องเรียนทั้งหมด
                                <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
