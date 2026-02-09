import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, Anuphan } from "next/font/google"; // Requested fonts
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
    weight: ['300', '400', '500', '700'],
    subsets: ["thai", "latin"],
    variable: "--font-ibm"
});

const anuphan = Anuphan({
    subsets: ["thai", "latin"],
    variable: "--font-anuphan"
});

export const metadata: Metadata = {
    title: "GenZ Ignite",
    description: "Empowering Gen Z to shape the future.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${ibmPlexSansThai.variable} ${anuphan.variable} font-sans antialiased text-white bg-secondary`}>
                <Navbar />
                <main className="min-h-screen pt-20">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
