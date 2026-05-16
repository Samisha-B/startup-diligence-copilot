import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0b0b0c] text-[#f5f1e8]">
      <section className="relative isolate min-h-screen">
        <div className="absolute inset-0">
          <Image
            src="/reference/b24.jpg"
            alt="Luxury corporate boardroom"
            fill
            priority
            className="hero-image object-cover object-center opacity-28"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,168,97,0.18),transparent_25%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,11,12,0.35),rgba(11,11,12,0.92))]" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-6 py-8 md:px-10 lg:px-16">
          <header className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#c9a861]" />
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                AURELIAN CAPITAL
              </p>
            </div>

            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Diligence Copilot v1
            </p>
          </header>

          <div className="grid items-end gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
            <div>
              <p className="mb-5 text-xs uppercase tracking-[0.35em] text-[#c9a861]">
                Investor Intelligence System
              </p>

              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] md:text-7xl">
                Startup
                <span className="block text-white/68">Diligence</span>
                <span className="font-script block translate-x-1 text-[#e6d6b2] text-[1.12em] leading-[0.88] tracking-normal">
                  Copilot
                </span>
              </h1>

              <p className="mt-8 max-w-2xl text-sm leading-7 text-white/62 md:text-base">
                A cinematic workspace for angels and micro-VCs to analyze startup
                documents, surface risk, ask evidence-backed questions, and draft
                investment memos with traceable citations.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/dashboard"
                  className="luxury-btn rounded-full border border-[#c9a861]/40 bg-[#c9a861] px-6 py-3 text-sm font-medium text-black"
                >
                  Enter Workspace
                </Link>

                <Link
                  href="/deals/new"
                  className="luxury-btn-secondary rounded-full border border-white/15 px-6 py-3 text-sm text-white/80"
                >
                  Create New Deal
                </Link>
              </div>
            </div>

            <div className="deal-card rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
              <div className="rounded-[22px] border border-white/10 bg-black/30 p-5">
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                    Active Deal
                  </p>
                  <span className="rounded-full border border-[#c9a861]/30 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#d8c7a1]">
                    In Review
                  </span>
                </div>

                <div className="space-y-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/35">
                      Company
                    </p>
                    <h2 className="mt-2 text-2xl font-medium text-white">
                      Northstar Labs
                    </h2>
                    <p className="mt-1 text-sm text-white/50">
                      Seed • B2B SaaS • Workflow Intelligence
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <div className="info-card rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-white/35">
                        Sources
                      </p>
                      <p className="mt-2 text-sm text-white/80">
                        12 files ingested, 8 public sources enriched
                      </p>
                    </div>

                    <div className="info-card rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-white/35">
                        Risk signal
                      </p>
                      <p className="mt-2 text-sm text-white/80">
                        Cap table mismatch flagged, missing IP assignment evidence
                      </p>
                    </div>

                    <div className="info-card rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-white/35">
                        Memo status
                      </p>
                      <p className="mt-2 text-sm text-white/80">
                        Draft memo ready with citations across deck and web data
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-[11px] uppercase tracking-[0.22em] text-white/35">
            <p>Boardroom-grade diligence</p>
            <p>Traceable • Structured • Quietly premium</p>
          </footer>
        </div>
      </section>
    </main>
  );
}