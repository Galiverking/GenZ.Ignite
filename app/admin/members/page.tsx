"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Trash2, Edit, Plus, X } from "lucide-react";

export default function MembersAdmin() {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingMember, setEditingMember] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this member?")) return;

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
        const formData = new FormData(e.target as HTMLFormElement);
        const memberData = {
            name: formData.get("name"),
            nickname: formData.get("nickname"),
            role: formData.get("role"),
            quote: formData.get("quote"),
            instagram: formData.get("instagram"),
            image_url: formData.get("image_url"),
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

        setIsModalOpen(false);
        setEditingMember(null);
        fetchMembers();
    };

    const openCreate = () => {
        setEditingMember(null);
        setIsModalOpen(true);
    };

    const openEdit = (member: any) => {
        setEditingMember(member);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Team Members</h1>
                <button
                    onClick={openCreate}
                    className="bg-[var(--secondary)] hover:bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add Member
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((member) => (
                        <div key={member.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 relative group hover:border-[var(--primary)] transition-colors">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => openEdit(member)}
                                    className="p-2 bg-black/50 hover:bg-[var(--primary)] text-white rounded-lg transition-colors"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(member.id)}
                                    className="p-2 bg-black/50 hover:bg-red-500 text-white rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden">
                                    <img src={member.image_url || "/avatar-placeholder.png"} alt={member.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{member.nickname}</h3>
                                    <p className="text-gray-400 text-sm">{member.role}</p>
                                </div>
                            </div>

                            <p className="text-gray-300 text-sm italic border-l-2 border-[var(--accent)] pl-3 mb-4">
                                "{member.quote}"
                            </p>

                            <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                                Order: {member.order}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                    <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold mb-6">
                            {editingMember ? "Edit Member" : "Add Team Member"}
                        </h2>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Name (Full)</label>
                                    <input
                                        name="name"
                                        defaultValue={editingMember?.name}
                                        required
                                        className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--secondary)]"
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Nickname</label>
                                    <input
                                        name="nickname"
                                        defaultValue={editingMember?.nickname}
                                        required
                                        className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--secondary)]"
                                        placeholder="Short Name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Role/Position</label>
                                <input
                                    name="role"
                                    defaultValue={editingMember?.role}
                                    required
                                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--secondary)]"
                                    placeholder="e.g. President, Treasurer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Quote</label>
                                <textarea
                                    name="quote"
                                    rows={2}
                                    defaultValue={editingMember?.quote}
                                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--secondary)]"
                                    placeholder="Inspirational quote..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Instagram (Optional)</label>
                                <input
                                    name="instagram"
                                    defaultValue={editingMember?.instagram}
                                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--secondary)]"
                                    placeholder="@username"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Image URL</label>
                                    <input
                                        name="image_url"
                                        defaultValue={editingMember?.image_url}
                                        className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--secondary)]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Display Order</label>
                                    <input
                                        name="order"
                                        type="number"
                                        defaultValue={editingMember?.order || 0}
                                        className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--secondary)]"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[var(--secondary)] to-blue-600 text-white font-bold shadow-lg transition-all active:scale-95"
                                >
                                    Save Member
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
