// app/(app)/layout.tsx

import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import SidebarNav from "@/components/SidebarNav";

async function getPipelineCount(): Promise<number> {
  try {
    const res = await fetch("http://localhost:3000/api/deals", {
      cache: "no-store",
    });
    const data = await res.json();
    return (data.deals || []).length;
  } catch {
    return 0;
  }
}

export default async function AppLayout({ children }: { children: ReactNode }) {
  const pipelineCount = await getPipelineCount();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0b0c] text-[#f5f1e8]">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-[#c9a861]/8 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[420px] w-[420px] rounded-full bg-white/[0.03] blur-3xl" />
      </div>

      {/* Navbar — outside and above the sidebar/content row */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Sidebar + page content */}
      <div className="relative z-10 mx-auto flex max-w-7xl gap-6 px-4 py-6 md:px-8 lg:px-12">
        {/* Sidebar */}
        <aside className="sticky top-24 hidden h-fit w-64 shrink-0 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl lg:block">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c9a861]/50 to-transparent" />

          <div className="p-5">
            {/* Workspace label */}
            <div className="mb-6">
              <p className="mb-1.5 text-[10px] uppercase tracking-[0.45em] text-[#c9a861]">
                Workspace
              </p>
              <h2 className="text-base font-semibold tracking-tight text-white">
                Investor Console
              </h2>
              <p className="mt-1 text-xs leading-5 text-white/40">
                Manage pipelines, diligence, and investment activity.
              </p>
            </div>

            {/* Navigation */}
            <SidebarNav />

            {/* Pipeline count */}
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/8 bg-black/20">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c9a861]/30 to-transparent" />
              <div className="p-4">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#c9a861]">
                  Pipeline
                </p>
                <p className="mt-2 text-3xl font-semibold tabular-nums text-white">
                  {pipelineCount}
                </p>
                <p className="mt-1 text-xs leading-5 text-white/40">
                  Active startups under diligence review.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Page content */}
        <div className="min-w-0 flex-1">
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-sm md:p-7">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}