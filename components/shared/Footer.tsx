export default function Footer() {
    return (
        <footer className="w-full border-t border-white/10 bg-black py-8 mt-12">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-500">
                    © {new Date().getFullYear()} GenZ Ignite. All rights reserved.
                </div>
                <div className="flex gap-6">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
                </div>
            </div>
        </footer>
    );
}
