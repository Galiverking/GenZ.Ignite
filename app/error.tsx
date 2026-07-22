"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("❌ Unhandled error:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                <span className="text-4xl">⚠️</span>
            </div>
            <h1 className="text-3xl font-black text-white mb-2">
                ออกซน. เกิดข้อผิดพลาด
            </h1>
            <p className="text-gray-400 max-w-md mb-8">
                ระบบมีปัญหาในการโหลดข้อมูล อย่าเพิ่งตกใจนะครับ — 
                ลองกดปุ่มด้านล่างเพื่อลองใหม่ หรือกลับไปที่หน้าแรก
            </p>
            <div className="flex gap-4">
                <button
                    onClick={reset}
                    className="bg-primary hover:bg-red-600 text-white font-bold px-8 py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-primary/20"
                >
                    🔄 ลองใหม่
                </button>
                <Link
                    href="/"
                    className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-2xl transition-all"
                >
                    🏠 กลับหน้าแรก
                </Link>
            </div>
            <p className="text-gray-600 text-xs mt-8 font-mono">
                {error.digest ? `Error ID: ${error.digest}` : ""}
            </p>
        </div>
    );
}
