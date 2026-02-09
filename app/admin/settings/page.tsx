"use client";

import { useState } from "react";
import { Save } from "lucide-react";

export default function SettingsAdmin() {
    // Controlled inputs state to avoid React warnings and prepare for future functionality
    const [partyName, setPartyName] = useState("GenZ Ignite");
    const [electionDate, setElectionDate] = useState("");

    return (
        <div className="max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Site Settings</h1>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
                <h2 className="text-xl font-bold mb-4">Theme Configuration</h2>
                <p className="text-gray-400 mb-6">
                    The website uses modern CSS variables for theming. You can modify these values in
                    <code className="bg-black/30 px-2 py-1 rounded mx-1 text-yellow-500">app/globals.css</code>
                    to instantly update the look of the entire site.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Primary Color (Orange)</label>
                        <div className="flex gap-4 items-center">
                            <div className="w-16 h-16 rounded-xl bg-[var(--primary)] border border-white/20 shadow-lg shadow-[var(--primary)]/20"></div>
                            <div className="space-y-1">
                                <code className="block bg-black/30 px-3 py-1 rounded text-sm text-gray-300">var(--primary)</code>
                                <span className="text-xs text-gray-500">Used for highlights, buttons, and gradients.</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Secondary Color (Navy Blue)</label>
                        <div className="flex gap-4 items-center">
                            <div className="w-16 h-16 rounded-xl bg-[var(--secondary)] border border-white/20 shadow-lg shadow-[var(--secondary)]/20"></div>
                            <div className="space-y-1">
                                <code className="block bg-black/30 px-3 py-1 rounded text-sm text-gray-300">var(--secondary)</code>
                                <span className="text-xs text-gray-500">Used for backgrounds, deep accents, and text.</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Accent Color (Gold)</label>
                        <div className="flex gap-4 items-center">
                            <div className="w-16 h-16 rounded-xl bg-[var(--accent)] border border-white/20 shadow-lg shadow-[var(--accent)]/20"></div>
                            <div className="space-y-1">
                                <code className="block bg-black/30 px-3 py-1 rounded text-sm text-gray-300">var(--accent)</code>
                                <span className="text-xs text-gray-500">Used for special highlights and awards.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 opacity-50 pointer-events-none">
                <h2 className="text-xl font-bold mb-4">Election Metadata (Coming Soon)</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Party Name</label>
                        <input
                            type="text"
                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2"
                            value={partyName}
                            onChange={(e) => setPartyName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Election Date</label>
                        <input
                            type="date"
                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2"
                            value={electionDate}
                            onChange={(e) => setElectionDate(e.target.value)}
                        />
                    </div>
                    <button className="bg-white/10 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <Save size={18} />
                        <span>Save Changes</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
