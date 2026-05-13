"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Edit, Plus, Save, X, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PoliciesAdmin() {
    const [policies, setPolicies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPolicy, setEditingPolicy] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Upload States
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch Policies
    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("policies")
            .select("*")
            .order("votes", { ascending: false });

        if (error) {
            console.error("Error fetching policies:", error);
        } else {
            setPolicies(data || []);
        }
        setLoading(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `policies/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error: any) {
            console.error('Error uploading image:', error);
            alert(`เกิดข้อผิดพลาดในการอัปโหลด: ${error.message || 'ไม่ทราบสาเหตุ'} (โปรดตรวจสอบว่าสร้าง Bucket ชื่อ "images" ใน Supabase แล้ว)`);
            return null;
        }
    };

    const handleDelete = async (id: string | number) => {
        if (!confirm("Are you sure you want to delete this policy?")) return;

        const { error } = await supabase.from("policies").delete().eq("id", id);
        if (error) {
            alert("Error deleting policy");
            console.error(error);
        } else {
            fetchPolicies();
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        let imageUrl = editingPolicy?.image_url;

        // 1. Upload new image if selected
        if (selectedFile) {
            const uploadedUrl = await uploadImage(selectedFile);
            if (uploadedUrl) {
                imageUrl = uploadedUrl;
            } else {
                setUploading(false);
                return;
            }
        }

        const policyData = {
            title: formData.get("title"),
            description: formData.get("description"),
            category: formData.get("category"),
            status: formData.get("status") || "pending",
            progress: parseInt(formData.get("progress") as string) || 0,
            votes: parseInt(formData.get("votes") as string) || 0,
            image_url: imageUrl,
        };

        if (editingPolicy?.id) {
            // Update
            const { error } = await supabase
                .from("policies")
                .update(policyData)
                .eq("id", editingPolicy.id);

            if (error) console.error("Update error:", error);
        } else {
            // Create
            const { error } = await supabase.from("policies").insert([policyData]);
            if (error) console.error("Insert error:", error);
        }

        setUploading(false);
        setIsModalOpen(false);
        setEditingPolicy(null);
        setSelectedFile(null);
        setPreviewUrl(null);
        fetchPolicies();
    };

    const openEdit = (policy: any) => {
        setEditingPolicy(policy);
        setPreviewUrl(policy.image_url);
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const openCreate = () => {
        setEditingPolicy(null);
        setPreviewUrl(null);
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">
                        จัดการ <span className="text-secondary italic">นโยบายหาเสียง</span>
                    </h1>
                    <p className="text-gray-500 font-medium">จัดการรายละเอียดและความคืบหน้าของนโยบายทั้งหมด 🏛️</p>
                </div>
                <button
                    onClick={openCreate}
                    className="bg-secondary hover:bg-blue-900 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-secondary/20 font-black italic active:scale-95"
                >
                    <Plus size={20} />
                    เพิ่มนโยบายใหม่
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-gray-500 text-center">
                    <Loader2 size={48} className="animate-spin mb-4 text-secondary" />
                    <p className="text-xs font-black uppercase tracking-widest">กำลังดึงข้อมูลนโยบาย...</p>
                </div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white/5 border-b border-white/5">
                                <tr>
                                    <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">หัวข้อนโยบาย</th>
                                    <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">หมวดหมู่</th>
                                    <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">สถานะ</th>
                                    <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">ความคืบหน้า</th>
                                    <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">โหวต</th>
                                    <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">ดำเนินการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <AnimatePresence>
                                    {policies.map((policy, idx) => (
                                        <motion.tr
                                            key={policy.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="hover:bg-white/5 transition-colors group"
                                        >
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-gray-800 border border-white/10 overflow-hidden flex-shrink-0">
                                                        <img src={policy.image_url || "/avatar-placeholder.png"} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-black text-white truncate group-hover:text-secondary transition-colors italic">{policy.title}</div>
                                                        <div className="text-[10px] text-gray-500 line-clamp-1 italic">{policy.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className="text-[10px] font-black px-3 py-1 rounded-lg bg-white/5 text-gray-400 border border-white/5 uppercase tracking-widest font-mono">
                                                    {policy.category}
                                                </span>
                                            </td>
                                            <td className="p-6 text-center">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter italic ${policy.status === "completed"
                                                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                                        : policy.status === "in_progress"
                                                            ? "bg-secondary/10 text-secondary border border-secondary/20"
                                                            : "bg-gray-500/10 text-gray-400 border border-white/5"
                                                        }`}
                                                >
                                                    {policy.status === "completed" ? "สำเร็จแล้ว" : policy.status === "in_progress" ? "กำลังทำ" : "รอดำเนินการ"}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-4 min-w-[120px]">
                                                    <div className="flex-1 bg-white/5 border border-white/5 rounded-full h-2">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${policy.progress}%` }}
                                                            className="bg-secondary h-full rounded-full shadow-[0_0_10px_rgba(var(--secondary-rgb),0.5)]"
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-black text-gray-400 italic font-mono">{policy.progress}%</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-center font-black text-xl italic text-secondary">
                                                {policy.votes || 0}
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => openEdit(policy)}
                                                        className="p-2 border border-white/5 hover:bg-secondary text-gray-400 hover:text-white rounded-xl transition-all"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(policy.id)}
                                                        className="p-2 border border-white/5 hover:bg-red-500 text-gray-400 hover:text-white rounded-xl transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex justify-center items-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0b0f14] border border-white/10 rounded-[3rem] w-full max-w-lg p-10 shadow-2xl relative"
                        >
                            <button
                                onClick={() => {
                                    if (!uploading) setIsModalOpen(false);
                                }}
                                className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={28} />
                            </button>

                            <h2 className="text-3xl font-black mb-8 text-white italic tracking-tighter uppercase">
                                {editingPolicy ? "แก้ไขข้อมูล" : "เพิ่มนโยบาย"} <span className="text-secondary">POLICY</span>
                            </h2>

                            <form onSubmit={handleSave} className="space-y-6">
                                {/* Image Upload Component */}
                                <div className="flex flex-col items-center gap-4 py-4">
                                    <div
                                        onClick={() => !uploading && fileInputRef.current?.click()}
                                        className="relative w-full h-48 group cursor-pointer"
                                    >
                                        <div className="w-full h-full rounded-[2.5rem] bg-black/50 border-2 border-dashed border-white/10 group-hover:border-secondary transition-all overflow-hidden flex items-center justify-center">
                                            {previewUrl ? (
                                                <>
                                                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Upload className="text-white" size={32} />
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center text-gray-500 group-hover:text-secondary transition-colors">
                                                    <ImageIcon size={48} strokeWidth={1} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest mt-3">Upload Banner</span>
                                                </div>
                                            )}
                                        </div>
                                        {uploading && (
                                            <div className="absolute inset-0 bg-black/80 rounded-[2.5rem] flex items-center justify-center z-10">
                                                <Loader2 className="animate-spin text-secondary" size={40} />
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center">
                                        {selectedFile ? selectedFile.name : (editingPolicy ? "คลิกเพื่อเปลี่ยนรูปภาพ" : "เลือกรูปแบนเนอร์นโยบาย (.jpg, .png)")}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">ชื่อนโยบาย (Title)</label>
                                    <input
                                        name="title"
                                        defaultValue={editingPolicy?.title}
                                        required
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-secondary transition-all text-sm italic font-bold"
                                        placeholder="เช่น เพิ่มพื้นที่สีเขียวในโรงเรียน..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">หมวดหมู่</label>
                                        <select
                                            name="category"
                                            defaultValue={editingPolicy?.category || "อาคารสถานที่"}
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-secondary transition-all text-sm appearance-none"
                                        >
                                            <option value="อาคารสถานที่" className="bg-[#0b0f14]">อาคารสถานที่</option>
                                            <option value="วิชาการ" className="bg-[#0b0f14]">วิชาการ</option>
                                            <option value="กิจกรรม" className="bg-[#0b0f14]">กิจกรรม</option>
                                            <option value="สวัสดิการ" className="bg-[#0b0f14]">สวัสดิการ</option>
                                            <option value="โครงสร้างพื้นฐาน" className="bg-[#0b0f14]">โครงสร้างพื้นฐาน</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">สถานะ</label>
                                        <select
                                            name="status"
                                            defaultValue={editingPolicy?.status || "pending"}
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-secondary transition-all text-sm appearance-none"
                                        >
                                            <option value="pending" className="bg-[#0b0f14]">รอดำเนินการ</option>
                                            <option value="in_progress" className="bg-[#0b0f14]">กำลังทำ</option>
                                            <option value="completed" className="bg-[#0b0f14]">สำเร็จแล้ว</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">ความคืบหน้า (%)</label>
                                        <input
                                            name="progress"
                                            type="number"
                                            min="0"
                                            max="100"
                                            defaultValue={editingPolicy?.progress || 0}
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-secondary transition-all text-sm font-mono"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">ยอดโหวต (Votes)</label>
                                        <input
                                            name="votes"
                                            type="number"
                                            min="0"
                                            defaultValue={editingPolicy?.votes || 0}
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-secondary focus:outline-none focus:border-secondary transition-all text-sm font-black italic"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">รายละเอียดนโยบาย</label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        defaultValue={editingPolicy?.description}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-secondary transition-all text-sm resize-none italic"
                                        placeholder="อธิบายรายละเอียดของสิ่งที่พรรคจะทำให้เพื่อนๆ..."
                                    />
                                </div>

                                <div className="pt-6 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => !uploading && setIsModalOpen(false)}
                                        className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 font-bold transition-all"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-secondary to-blue-600 text-white font-black italic shadow-lg shadow-secondary/20 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {uploading ? "กำลังบันทึก..." : "บันทึกนโยบาย"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
