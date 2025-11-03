import type { Metadata } from "next";
import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "PhiloVibes",
  description: "Where words breathe art — explore philosophy through calm aesthetics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} bg-[#F9F5EC] text-[#1A1A1A] min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 px-6 md:px-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
