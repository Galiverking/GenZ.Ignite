"use client";

import { motion } from "framer-motion";
import {
    TrendingUp,
    Users,
    FileText,
    MessageSquare,
    ArrowUpRight,
    Clock,
    Activity
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const data = [
    { name: 'Mon', votes: 400 },
    { name: 'Tue', votes: 300 },
    { name: 'Wed', votes: 200 },
    { name: 'Thu', votes: 278 },
    { name: 'Fri', votes: 189 },
    { name: 'Sat', votes: 239 },
    { name: 'Sun', votes: 349 },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">
                        ภาพรวมระบบ <span className="text-primary italic">DASHBOARD</span>
                    </h1>
                    <p className="text-gray-500 font-medium">ยินดีต้อนรับกลับมา, พรุ่งนี้รวย! 🚀</p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-2xl">
                    <div className="bg-primary/20 text-primary p-2 rounded-xl">
                        <TrendingUp size={20} />
                    </div>
                    <div className="pr-4">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">Status</p>
                        <p className="text-sm font-black text-white leading-none">Healthy System</p>
                    </div>
                </div>
            </div>

            {/* Stat Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="นโยบายทั้งหมด"
                    value="15"
                    trend="+2"
                    icon={FileText}
                    color="primary"
                    label="Policies Active"
                />
                <StatCard
                    title="ทีมงานสมาชิก"
                    value="12"
                    trend="0"
                    icon={Users}
                    color="secondary"
                    label="Active Members"
                />
                <StatCard
                    title="คะแนนโหวตสะสม"
                    value="3,420"
                    trend="+124"
                    icon={TrendingUp}
                    color="accent"
                    label="Total Votes"
                />
                <StatCard
                    title="เรื่องร้องเรียน"
                    value="8"
                    trend="+3"
                    icon={MessageSquare}
                    color="red"
                    label="Unresolved Issues"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-gray-800 pointer-events-none group-hover:text-primary/20 transition-colors">
                        <Activity size={120} strokeWidth={1} />
                    </div>

                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight">สถิติคะแนนโหวตรายสัปดาห์</h2>
                            <p className="text-gray-500 text-sm">การเติบโตของการมีส่วนร่วมของนักเรียน</p>
                        </div>
                        <select className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:border-primary transition-all">
                            <option>7 วันล่าสุด</option>
                            <option>30 วันล่าสุด</option>
                        </select>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#ffffff20"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#ffffff20"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0d1117',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '16px',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}
                                    itemStyle={{ color: 'var(--primary)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="votes"
                                    stroke="var(--primary)"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorVotes)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-white tracking-tight">กิจกรรมล่าสุด</h2>
                        <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">ดูทั้งหมด</button>
                    </div>

                    <div className="space-y-6">
                        <ActivityItem
                            icon={MessageSquare}
                            color="bg-primary/20 text-primary"
                            title="เรื่องร้องเรียนใหม่"
                            time="2 นาทีที่แล้ว"
                            desc="มีคนแจ้งเรื่องแอร์ห้องสมุดไม่เย็น"
                        />
                        <ActivityItem
                            icon={TrendingUp}
                            color="bg-accent/20 text-accent"
                            title="ยอดโหวตพุ่ง!"
                            time="15 นาทีที่แล้ว"
                            desc="นโยบาย 'เพิ่มเวลาพัก' มียอดโหวตครบ 500"
                        />
                        <ActivityItem
                            icon={Users}
                            color="bg-secondary/20 text-secondary"
                            title="อัปเดตสมาชิก"
                            time="1 ชม. ที่แล้ว"
                            desc="คุณได้แก้ไขข้อมูลของ 'กัปตัน ทีมอีสปอร์ต'"
                        />
                        <ActivityItem
                            icon={Clock}
                            color="bg-gray-500/20 text-gray-400"
                            title="ระบบสำรองข้อมูล"
                            time="4 ชม. ที่แล้ว"
                            desc="Auto backup สำเร็จแล้ว (345MB)"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, trend, icon: Icon, color, label }: any) {
    const colors: any = {
        primary: "from-primary/20 to-transparent text-primary",
        secondary: "from-secondary/20 to-transparent text-secondary",
        accent: "from-accent/20 to-transparent text-accent",
        red: "from-red-500/20 to-transparent text-red-500"
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl relative overflow-hidden group"
        >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colors[color]} opacity-50 blur-2xl group-hover:scale-150 transition-transform duration-500`} />

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${colors[color].split(' ').pop()}`}>
                    <Icon size={24} />
                </div>
                {trend !== "0" && (
                    <div className="flex items-center gap-1 text-[10px] font-black text-green-400 bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">
                        <ArrowUpRight size={10} />
                        {trend}
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <h3 className="text-gray-500 text-sm font-bold">{title}</h3>
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-white tracking-tighter italic">{value}</p>
                </div>
                <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest mt-1">{label}</p>
            </div>
        </motion.div>
    );
}

function ActivityItem({ icon: Icon, color, title, time, desc }: any) {
    return (
        <div className="flex gap-4 group">
            <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5 transition-transform group-hover:scale-110 ${color}`}>
                <Icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-bold text-white truncate">{title}</h4>
                    <span className="text-[10px] text-gray-600 font-bold shrink-0">{time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{desc}</p>
            </div>
        </div>
    );
}
