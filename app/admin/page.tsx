"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    TrendingUp,
    Users,
    FileText,
    MessageSquare,
    ArrowUpRight,
    Clock,
    Activity,
    RefreshCcw
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

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        policies: 0,
        members: 0,
        votes: 0,
        complaints: 0,
        pendingComplaints: 0
    });
    const [activities, setActivities] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Policies & Total Votes
            const { data: policiesData } = await supabase.from("policies").select("votes");
            const totalPolicies = policiesData?.length || 0;
            const totalVotes = policiesData?.reduce((acc, curr) => acc + (curr.votes || 0), 0) || 0;

            // 2. Fetch Members
            const { count: membersCount } = await supabase.from("members").select("*", { count: 'exact', head: true });

            // 3. Fetch Complaints
            const { data: complaintsData } = await supabase
                .from("complaints")
                .select("*")
                .order("id", { ascending: false });

            const totalComplaints = complaintsData?.length || 0;
            const pendingComplaints = complaintsData?.filter(c => c.status === 'pending').length || 0;

            // 4. Update Stats State
            setStats({
                policies: totalPolicies,
                members: membersCount || 0,
                votes: totalVotes,
                complaints: totalComplaints,
                pendingComplaints: pendingComplaints
            });

            // 5. Recent Activities (from complaints)
            const recentActivities = complaintsData?.slice(0, 5).map(c => ({
                id: c.id,
                icon: MessageSquare,
                color: c.status === 'pending' ? "bg-primary/20 text-primary" : "bg-green-500/20 text-green-400",
                title: c.status === 'pending' ? "เรื่องร้องเรียนใหม่" : "เรื่องร้องเรียนถูกแก้ไข",
                time: getTimeAgo(new Date(c.created_at)),
                desc: c.topic
            })) || [];
            setActivities(recentActivities);

            // 6. Chart Data (Logic: Top 7 Policies by Votes)
            const { data: topPolicies } = await supabase
                .from("policies")
                .select("title, votes")
                .order("votes", { ascending: false })
                .limit(7);

            const formattedChartData = topPolicies?.map(p => ({
                name: p.title.substring(0, 10) + (p.title.length > 10 ? "..." : ""),
                votes: p.votes
            })).reverse() || [];

            setChartData(formattedChartData);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getTimeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        if (seconds < 60) return `${seconds} วินาทีที่แล้ว`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} ชม. ที่แล้ว`;
        return date.toLocaleDateString("th-TH");
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">
                        ภาพรวมระบบ <span className="text-primary italic">DASHBOARD</span>
                    </h1>
                    <p className="text-gray-500 font-medium">ข้อมูลอัปเดตวินาทีต่อวินาทีจากระบบ Supabase ⚡</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="bg-white/5 border border-white/10 p-3 rounded-2xl text-gray-400 hover:text-white transition-all flex items-center gap-2 group"
                    >
                        <RefreshCcw size={18} className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Update Realtime</span>
                    </button>
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
            </div>

            {/* Stat Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="นโยบายทั้งหมด"
                    value={loading ? "..." : stats.policies.toString()}
                    icon={FileText}
                    color="primary"
                    label="Policies Active"
                />
                <StatCard
                    title="ทีมงานสมาชิก"
                    value={loading ? "..." : stats.members.toString()}
                    icon={Users}
                    color="secondary"
                    label="Active Members"
                />
                <StatCard
                    title="คะแนนโหวตสะสม"
                    value={loading ? "..." : stats.votes.toLocaleString()}
                    icon={TrendingUp}
                    color="accent"
                    label="Total Votes"
                />
                <StatCard
                    title="เรื่องร้องเรียน"
                    value={loading ? "..." : stats.pendingComplaints.toString()}
                    icon={MessageSquare}
                    color="red"
                    label="Pending Issues"
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
                            <h2 className="text-xl font-black text-white tracking-tight">อันดับความนิยมรายนโยบาย</h2>
                            <p className="text-gray-500 text-sm">เปรียบเทียบคะแนนโหวตของ 7 นโยบายที่ติดเทรนด์</p>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        {loading ? (
                            <div className="h-full w-full flex items-center justify-center text-gray-500 text-xs font-black uppercase tracking-widest">
                                Loading Data...
                            </div>
                        ) : chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
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
                                        fontSize={10}
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
                                            fontSize: '11px',
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
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-700">ไม่มีข้อมูลแสดงผล</div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-white tracking-tight">กิจกรรมล่าสุด</h2>
                        <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">ดูทั้งหมด</button>
                    </div>

                    <div className="space-y-6">
                        {loading ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="flex gap-4 animate-pulse opacity-50">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-white/5 rounded w-1/2" />
                                        <div className="h-3 bg-white/5 rounded w-full" />
                                    </div>
                                </div>
                            ))
                        ) : activities.length > 0 ? (
                            activities.map((act) => (
                                <ActivityItem
                                    key={act.id}
                                    icon={act.icon}
                                    color={act.color}
                                    title={act.title}
                                    time={act.time}
                                    desc={act.desc}
                                />
                            ))
                        ) : (
                            <p className="text-center py-12 text-gray-600 text-xs font-bold italic">ยังไม่มีกิจกรรมใหม่...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, label }: any) {
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
