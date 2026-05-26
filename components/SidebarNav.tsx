"use client";

import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "New Deal", href: "/deals/new" },
];

const comingSoon = ["Uploads", "Investment Memo"];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1.5">
      {navItems.map(({ label, href }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <a
            key={href}
            href={href}
            className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
              ${isActive
                ? "border border-[#c9a861]/25 bg-[#c9a861]/10 text-[#f3ddb0]"
                : "border border-transparent text-white/55 hover:border-white/8 hover:bg-white/[0.04] hover:text-white/90"
              }`}
          >
            <span>{label}</span>
            <span
              className={`text-sm transition-all duration-200 ${
                isActive ? "text-[#c9a861]" : "text-white/20"
              }`}
            >
              {label === "New Deal" ? "+" : "→"}
            </span>
          </a>
        );
      })}

      {comingSoon.map((label) => (
        <div
          key={label}
          className="flex items-center justify-between rounded-xl border border-dashed border-white/8 px-4 py-3 text-sm text-white/25"
        >
          <span>{label}</span>
          <span className="text-[10px] uppercase tracking-wider text-white/15">Soon</span>
        </div>
      ))}
    </nav>
  );
}