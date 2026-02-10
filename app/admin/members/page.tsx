"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Trash2, Edit, Plus, X, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MembersAdmin() {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingMember, setEditingMember] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Upload States
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("members")
            .select("*")
            .order("order", { ascending: true });

        if (error) {
            console.error("Error fetching members:", error);
        } else {
            setMembers(data || []);
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
            const filePath = `members/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
            return null;
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("คุณต้องการลบสมาชิกท่านนี้ใช่หรือไม่?")) return;

        const { error } = await supabase.from("members").delete().eq("id", id);
        if (error) {
            alert("Error deleting member");
            console.error(error);
        } else {
            fetchMembers();
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        let imageUrl = editingMember?.image_url;

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

        const memberData = {
            name: formData.get("name"),
            nickname: formData.get("nickname"),
            role: formData.get("role"),
            quote: formData.get("quote"),
            instagram: formData.get("instagram"),
            image_url: imageUrl,
            order: parseInt(formData.get("order") as string) || 0,
        };

        if (editingMember?.id) {
            const { error } = await supabase
                .from("members")
                .update(memberData)
                .eq("id", editingMember.id);

            if (error) console.error("Update error:", error);
        } else {
            const { error } = await supabase.from("members").insert([memberData]);
            if (error) console.error("Insert error:", error);
        }

        setUploading(false);
        setIsModalOpen(false);
        setEditingMember(null);
        setSelectedFile(null);
        setPreviewUrl(null);
        fetchMembers();
    };

    const openCreate = () => {
        setEditingMember(null);
        setPreviewUrl(null);
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const openEdit = (member: any) => {
        setEditingMember(member);
        setPreviewUrl(member.image_url);
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">
                        จัดการ <span className="text-primary italic">สมาชิกทีมงาน</span>
                    </h1>
                    <p className="text-gray-500 font-medium">จัดการข้อมูลผู้สมัครและคณะทำงานของพรรค 👥</p>
                </div>
                <button
                    onClick={openCreate}
                    className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 font-black italic active:scale-95"
                >
                    <Plus size={20} />
                    เพิ่มสมาชิกใหม่
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                    <Loader2 size={48} className="animate-spin mb-4 text-primary" />
                    <p className="text-xs font-black uppercase tracking-widest">กำลังดึงข้อมูลทีมงาน...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {members.map((member, idx) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white/5 border border-white/10 rounded-[2rem] p-6 relative group hover:border-primary/50 transition-all backdrop-blur-3xl overflow-hidden"
                            >
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <button
                                        onClick={() => openEdit(member)}
                                        className="p-2 bg-black/50 hover:bg-primary text-white rounded-xl backdrop-blur-md border border-white/5 transition-colors"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member.id)}
                                        className="p-2 bg-black/50 hover:bg-red-500 text-white rounded-xl backdrop-blur-md border border-white/5 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="flex flex-col items-center text-center">
                                    <div className="relative w-24 h-24 mb-4">
                                        <div className="w-24 h-24 rounded-3xl bg-gray-800 overflow-hidden border-2 border-white/10 group-hover:border-primary/50 transition-colors">
                                            <img
                                                src={member.image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 bg-primary text-white text-[10px] font-black w-8 h-8 flex items-center justify-center rounded-xl shadow-lg ring-4 ring-[#020617]">
                                            #{member.order}
                                        </div>
                                    </div>

                                    <h3 className="font-black text-xl text-white tracking-tight leading-none mb-1">{member.nickname}</h3>
                                    <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 opacity-80">{member.role}</p>

                                    <div className="w-full py-4 border-t border-white/5">
                                        <p className="text-gray-400 text-xs italic line-clamp-2 min-h-[2rem]">
                                            "{member.quote}"
                                        </p>
                                    </div>

                                    <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                                        ID: {member.id.toString().substring(0, 8)}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
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
                            className="bg-[#0d1117] border border-white/10 rounded-[3rem] w-full max-w-lg p-10 shadow-2xl relative"
                        >
                            <button
                                onClick={() => {
                                    if (!uploading) setIsModalOpen(false);
                                }}
                                className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={28} />
                            </button>

                            <h2 className="text-3xl font-black mb-8 text-white italic tracking-tighter">
                                {editingMember ? "แก้ไขข้อมูล" : "เพิ่มสมาชิก"} <span className="text-primary">TEAM</span>
                            </h2>

                            <form onSubmit={handleSave} className="space-y-6">
                                {/* Image Upload Component */}
                                <div className="flex flex-col items-center gap-4 py-4">
                                    <div
                                        onClick={() => !uploading && fileInputRef.current?.click()}
                                        className="relative w-32 h-32 group cursor-pointer"
                                    >
                                        <div className="w-full h-full rounded-[2.5rem] bg-black/50 border-2 border-dashed border-white/10 group-hover:border-primary transition-all overflow-hidden flex items-center justify-center">
                                            {previewUrl ? (
                                                <>
                                                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Upload className="text-white" size={24} />
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center text-gray-500 group-hover:text-primary transition-colors">
                                                    <ImageIcon size={32} strokeWidth={1.5} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest mt-2">Upload Photo</span>
                                                </div>
                                            )}
                                        </div>
                                        {uploading && (
                                            <div className="absolute inset-0 bg-black/80 rounded-[2.5rem] flex items-center justify-center z-10">
                                                <Loader2 className="animate-spin text-primary" size={32} />
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
                                        {selectedFile ? selectedFile.name : (editingMember ? "คลิกเพื่อเปลี่ยนรูปภาพ" : "เลือกรูปภาพสมาชิก (.jpg, .png)")}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">ชื่อ-นามสกุลจริง</label>
                                        <input
                                            name="name"
                                            defaultValue={editingMember?.name}
                                            required
                                            className="w-full bg-black/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-all text-sm"
                                            placeholder="นายบุญฤทธิ์ ปิ่นคง"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">ชื่อเล่น / ชื่อเรียก</label>
                                        <input
                                            name="nickname"
                                            defaultValue={editingMember?.nickname}
                                            required
                                            className="w-full bg-black/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-all text-sm"
                                            placeholder="แดน"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">ตำแหน่งในพรรค</label>
                                    <input
                                        name="role"
                                        defaultValue={editingMember?.role}
                                        required
                                        className="w-full bg-black/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-all text-sm"
                                        placeholder="ประธานนักเรียน / เหรัญญิก"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">คำนิยาม / คำคมประจำตัว</label>
                                    <textarea
                                        name="quote"
                                        rows={2}
                                        defaultValue={editingMember?.quote}
                                        className="w-full bg-black/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-all text-sm resize-none"
                                        placeholder="คิดจะพัก คิดถึงภาระงาน..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Instagram (@)</label>
                                        <input
                                            name="instagram"
                                            defaultValue={editingMember?.instagram}
                                            className="w-full bg-black/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-all text-sm"
                                            placeholder="dan.luminair"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">ลำดับการแสดงผล</label>
                                        <input
                                            name="order"
                                            type="number"
                                            defaultValue={editingMember?.order || 0}
                                            className="w-full bg-black/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-all text-sm"
                                        />
                                    </div>
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
                                        className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-black italic shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {uploading ? "กำลังบันทึก..." : "บันทึกข้อมูลสมาชิก"}
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
