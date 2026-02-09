"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Edit, Plus, Save, X } from "lucide-react";

export default function PoliciesAdmin() {
    const [policies, setPolicies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPolicy, setEditingPolicy] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleDelete = async (id: number) => {
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
        const formData = new FormData(e.target as HTMLFormElement);
        const policyData = {
            title: formData.get("title"),
            description: formData.get("description"),
            category: formData.get("category"),
            status: formData.get("status") || "pending",
            progress: parseInt(formData.get("progress") as string) || 0,
            votes: parseInt(formData.get("votes") as string) || 0,
            image_url: formData.get("image_url"),
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

        setIsModalOpen(false);
        setEditingPolicy(null);
        fetchPolicies();
    };

    const openEdit = (policy: any) => {
        setEditingPolicy(policy);
        setIsModalOpen(true);
    };

    const openCreate = () => {
        setEditingPolicy(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">จัดการนโยบายหาเสียง</h1>
                <button
                    onClick={openCreate}
                    className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-primary/20"
                >
                    <Plus size={20} />
                    เพิ่มนโยบายใหม่
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">กำลังโหลดข้อมูล...</div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 font-medium border-b border-white/10">
                            <tr>
                                <th className="p-4">หัวข้อนโยบาย</th>
                                <th className="p-4">หมวดหมู่</th>
                                <th className="p-4">สถานะ</th>
                                <th className="p-4">ความคืบหน้า</th>
                                <th className="p-4">คะแนนโหวต</th>
                                <th className="p-4 text-right">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {policies.map((policy) => (
                                <tr key={policy.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-white">{policy.title}</div>
                                        <div className="text-xs text-gray-500 line-clamp-1 truncate max-w-[200px]">{policy.description}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-xs font-bold px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/10">
                                            {policy.category}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${policy.status === "completed"
                                                ? "bg-green-500/20 text-green-400"
                                                : policy.status === "in_progress"
                                                    ? "bg-secondary/20 text-secondary"
                                                    : "bg-gray-500/20 text-gray-400"
                                                }`}
                                        >
                                            {policy.status === "completed" ? "สำเร็จแล้ว" : policy.status === "in_progress" ? "กำลังทำ" : "รอดำเนินการ"}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-white/10 rounded-full h-1.5 min-w-[80px]">
                                                <div
                                                    className="bg-primary h-1.5 rounded-full"
                                                    style={{ width: `${policy.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-mono text-gray-400">{policy.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-primary font-black text-xl italic leading-none">{policy.votes || 0}</span>
                                            <span className="text-[10px] text-gray-500 uppercase font-bold">Votes</span>
                                        </div>
                                    </td>
                                    <td className="p-4 flex justify-end gap-2">
                                        <button
                                            onClick={() => openEdit(policy)}
                                            className="p-2 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(policy.id)}
                                            className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                    <div className="bg-[#0d1117] border border-white/10 rounded-2xl w-full max-w-lg p-8 shadow-2xl relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold mb-6 text-primary italic">
                            {editingPolicy ? "แก้ไขข้อมูลนโยบาย" : "เพิ่มนโยบายใหม่"}
                        </h2>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-1">หัวข้อนโยบาย (Title)</label>
                                <input
                                    name="title"
                                    defaultValue={editingPolicy?.title}
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                                    placeholder="เช่น เพิ่มพื้นที่สีเขียวในโรงเรียน"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-1">หมวดหมู่</label>
                                    <select
                                        name="category"
                                        defaultValue={editingPolicy?.category || "อาคารสถานที่"}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                                    >
                                        <option value="อาคารสถานที่">อาคารสถานที่</option>
                                        <option value="วิชาการ">วิชาการ</option>
                                        <option value="กิจกรรม">กิจกรรม</option>
                                        <option value="สวัสดิการ">สวัสดิการ</option>
                                        <option value="โครงสร้างพื้นฐาน">โครงสร้างพื้นฐาน</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-1">สถานะ</label>
                                    <select
                                        name="status"
                                        defaultValue={editingPolicy?.status || "pending"}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                                    >
                                        <option value="pending">รอดำเนินการ (Pending)</option>
                                        <option value="in_progress">กำลังทำ (In Progress)</option>
                                        <option value="completed">สำเร็จแล้ว (Completed)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-1">ความคืบหน้า (%)</label>
                                    <input
                                        name="progress"
                                        type="number"
                                        min="0"
                                        max="100"
                                        defaultValue={editingPolicy?.progress || 0}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-1">คะแนนโหวต (Votes)</label>
                                    <input
                                        name="votes"
                                        type="number"
                                        min="0"
                                        defaultValue={editingPolicy?.votes || 0}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary font-mono text-primary font-bold"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-1">รายละเอียด</label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    defaultValue={editingPolicy?.description}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary resize-none"
                                    placeholder="อธิบายรายละเอียดของนโยบาย..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-1">URL รูปภาพ (Image URL)</label>
                                <input
                                    name="image_url"
                                    defaultValue={editingPolicy?.image_url}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                                    placeholder="/policies/image.jpg หรือ https://..."
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-black shadow-lg shadow-primary/20 transition-all active:scale-95"
                                >
                                    บันทึกข้อมูล
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
