"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "New Deal", href: "/deals/new" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="border-b border-white/[0.07] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-10 lg:px-16">
        <Link href="/" className="group flex items-center gap-3 transition-opacity duration-200 hover:opacity-80">
          <div className="h-2 w-2 rounded-full bg-[#c9a861] shadow-[0_0_6px_rgba(201,168,97,0.5)]" />
          <p className="text-xs uppercase tracking-[0.25em] text-white/60">Samisha Boywar</p>
        </Link>
        <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-1">
          {navLinks.map(({ label, href }) => {
            const isActive = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} href={href} aria-current={isActive ? "page" : undefined} className={`relative rounded-lg px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-all duration-200 ${isActive ? "text-[#f3ddb0]" : "text-white/50 hover:text-white/80"}`}>
                {label}
                {isActive && <span className="absolute bottom-0 left-1/2 h-px w-4 -translate-x-1/2 rounded-full bg-[#c9a861]/60" />}
              </Link>
            );
          })}
          <Link href="/deals/new" className="ml-3 hidden rounded-full border border-[#c9a861]/30 bg-[#c9a861]/10 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#f3ddb0] transition-all duration-200 hover:bg-[#c9a861]/20 sm:block">+ New Deal</Link>
        </nav>
      </div>
    </header>
  );
}
