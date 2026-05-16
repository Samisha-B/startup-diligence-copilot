import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b0b0c] text-[#f5f1e8]">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-6 md:px-10 lg:px-16">
        <aside className="hidden w-64 shrink-0 rounded-[28px] border border-white/10 bg-white/[0.03] p-5 lg:block">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#c9a861]">
            Workspace
          </p>

          <nav className="space-y-3 text-sm text-white/70">
            <a
              href="/dashboard"
              className="block rounded-2xl border border-white/10 px-4 py-3 transition hover:bg-white/[0.04]"
            >
              Dashboard
            </a>
            <a
              href="/deals/new"
              className="block rounded-2xl border border-white/10 px-4 py-3 transition hover:bg-white/[0.04]"
            >
              New Deal
            </a>
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-3 text-white/30">
              Uploads
            </div>
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-3 text-white/30">
              Memo
            </div>
          </nav>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}