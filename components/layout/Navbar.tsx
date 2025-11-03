"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-5 px-6 md:px-12 border-b border-gray-200 bg-[#F9F5EC]/70 backdrop-blur-md sticky top-0 z-10">
      <Link href="/" className="font-playfair text-2xl text-[#A67C52] tracking-wide">
        PhiloVibes
      </Link>
      <div className="flex gap-6 text-sm font-medium">
         <Link href="/books" className="hover:text-[#A67C52] transition-colors">
          Books
        </Link>
        <Link href="/explore" className="hover:text-[#A67C52] transition-colors">
          Explore
        </Link>
        <Link href="/playground" className="hover:text-[#A67C52] transition-colors">
          Playground
        </Link>
        <Link href="/about" className="hover:text-[#A67C52] transition-colors">
          About
        </Link>
      </div>
    </nav>
  );
}
