"use client";

export function ActivityItem({ icon: Icon, color, title, time, desc }: any) {
    return (
        <div className="flex gap-4 group">
            <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5 transition-transform group-hover:scale-110 ${color}`}>
                <Icon size={20} />
            </div>
            <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-bold text-white truncate">{title}</h4>
                    <span className="text-[10px] text-gray-600 font-bold shrink-0">{time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{desc}</p>
            </div>
        </div>
    );
}
