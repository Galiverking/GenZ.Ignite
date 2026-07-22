"use client";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <div className="flex gap-2 mb-6">
                <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                <div className="w-4 h-4 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
            </div>
            <p className="text-gray-500 text-sm font-black uppercase tracking-widest animate-pulse">
                กำลังโหลด...
            </p>
        </div>
    );
}
