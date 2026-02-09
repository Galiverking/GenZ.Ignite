export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-white">ภาพรวมระบบ (Overview)</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-primary/50 transition-colors group">
                    <h3 className="text-lg font-medium text-gray-400 mb-2">นโยบายทั้งหมด</h3>
                    <p className="text-5xl font-black text-primary italic">15</p>
                    <p className="text-xs text-gray-500 mt-2 uppercase font-bold tracking-widest">Policies active</p>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-secondary/50 transition-colors group">
                    <h3 className="text-lg font-medium text-gray-400 mb-2">ทีมงานพรรค</h3>
                    <p className="text-5xl font-black text-secondary italic">15</p>
                    <p className="text-xs text-gray-500 mt-2 uppercase font-bold tracking-widest">Candidates total</p>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-accent/50 transition-colors group">
                    <h3 className="text-lg font-medium text-gray-400 mb-2">คะแนนโหวตรวม</h3>
                    <p className="text-5xl font-black text-accent italic">3,420</p>
                    <p className="text-xs text-gray-500 mt-2 uppercase font-bold tracking-widest">Student upvotes</p>
                </div>
            </div>

            <div className="mt-8 p-8 bg-white/5 border border-white/10 rounded-3xl">
                <h2 className="text-xl font-bold mb-4 text-white">กิจกรรมล่าสุด</h2>
                <div className="flex flex-col gap-4">
                    <p className="text-gray-500 italic">ยังไม่มีกิจกรรมใหม่ในขณะนี้...</p>
                </div>
            </div>
        </div>
    );
}
