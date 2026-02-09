export default function ReportPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8 text-primary">Student Voice Report</h1>
            <p className="text-gray-400 mb-8">Speak up! Report issues directly to the student council.</p>

            <form className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10">
                <div>
                    <label className="block text-sm font-medium mb-2">Topic</label>
                    <input type="text" className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-primary" placeholder="What is the issue?" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea rows={5} className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-primary" placeholder="Describe the problem in detail..."></textarea>
                </div>
                <button type="button" className="w-full bg-primary hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors">
                    Submit Report
                </button>
            </form>
        </div>
    );
}
