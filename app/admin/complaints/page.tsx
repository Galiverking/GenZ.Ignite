"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Check, Clock } from "lucide-react";

export default function ComplaintsManage() {
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch data
    const fetchComplaints = async () => {
        // Mock data for fallback
        const mockComplaints = [
            { id: 1, created_at: new Date().toISOString(), category: 'อาคารสถานที่', topic: 'แอร์ห้องสมุดไม่เย็น', message: 'แอร์ตัวที่ 3 ฝั่งขวาไม่เย็นเลยครับ', contact: 'IG: student1', status: 'pending' },
            { id: 2, created_at: new Date().toISOString(), category: 'วิชาการ', topic: 'ขอเพิ่มหนังสือเตรียมสอบ', message: 'อยากให้ห้องสมุดมีหนังสือเตรียมสอบ TGAT/TPAT เพิ่มครับ', contact: '', status: 'resolved' },
        ];

        const { data } = await supabase
            .from("complaints")
            .select("*")
            .order("id", { ascending: false });

        if (data && data.length > 0) {
            setComplaints(data);
        } else {
            setComplaints(mockComplaints);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    // Update status function
    const updateStatus = async (id: number, newStatus: string) => {
        // Optimistic Update
        setComplaints((prev) =>
            prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );

        // Send to Database
        await supabase.from("complaints").update({ status: newStatus }).eq("id", id);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">จัดการเรื่องร้องเรียน</h1>
                <button
                    onClick={fetchComplaints}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Refresh Data
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">
                                วันที่
                            </th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">
                                หมวดหมู่
                            </th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">
                                หัวข้อ / รายละเอียด
                            </th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">
                                ผู้แจ้ง
                            </th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-center">
                                สถานะ
                            </th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {complaints.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-sm text-gray-500">
                                    {new Date(c.created_at).toLocaleDateString("th-TH")}
                                </td>
                                <td className="p-4">
                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                                        {c.category}
                                    </span>
                                </td>
                                <td className="p-4 max-w-xs">
                                    <div className="font-bold text-gray-900">{c.topic}</div>
                                    <div className="text-sm text-gray-500 truncate">
                                        {c.message}
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    {c.contact || "-"}
                                </td>
                                <td className="p-4 text-center">
                                    {c.status === "resolved" ? (
                                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                                            <Check size={12} /> เสร็จสิ้น
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">
                                            <Clock size={12} /> รอแก้ไข
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    {/* Status Toggle Buttons */}
                                    {c.status === "pending" && (
                                        <button
                                            onClick={() => updateStatus(c.id, "resolved")}
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                        >
                                            ทำเสร็จแล้ว
                                        </button>
                                    )}
                                    {c.status === "resolved" && (
                                        <button
                                            onClick={() => updateStatus(c.id, "pending")}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                        >
                                            ย้อนกลับ
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {complaints.length === 0 && !loading && (
                    <div className="p-12 text-center text-gray-400">
                        ยังไม่มีเรื่องร้องเรียน (โรงเรียนสงบสุขมาก)
                    </div>
                )}
            </div>
        </div>
    );
}
