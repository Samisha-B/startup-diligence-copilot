import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0a0a0b] text-[#f5f1e8]">
      <section className="relative isolate min-h-screen">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/reference/img24.png"
            alt="Luxury corporate boardroom"
            fill
            priority
            className="hero-image animate-[slowZoom_18s_ease-in-out_infinite] object-cover object-center opacity-65"
          />

          {/* overlays */}
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,168,97,0.16),transparent_34%)] animate-pulse" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,11,0.28),rgba(10,10,11,0.92))]" />
        </div>

        {/* Main container */}
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-6 py-6 md:px-8 lg:px-12">
          {/* Header */}
          <header className="animate-[fadeUp_1s_ease-out] flex items-center justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-2.5 w-2.5 rounded-full bg-[#c9a861]" />
                <div className="absolute inset-0 animate-ping rounded-full bg-[#c9a861]/40" />
              </div>

              <p className="text-[11px] uppercase tracking-[0.38em] text-white/58">
                SAMMAN CAPITAL
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-white/20" />

              <p className="text-[11px] uppercase tracking-[0.3em] text-white/38">
                Diligence Copilot v1
              </p>
            </div>
          </header>

          {/* Hero */}
          <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1fr_0.95fr] lg:gap-12 lg:py-12">
            {/* Left */}
            <div className="max-w-2xl">
              <div className="animate-[fadeUp_1.1s_ease-out] inline-flex items-center gap-3 rounded-full border border-[#c9a861]/20 bg-[#c9a861]/6 px-4 py-2 backdrop-blur-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-[#c9a861]" />

                <p className="text-[10px] uppercase tracking-[0.34em] text-[#d8c7a1]">
                  Investor Intelligence System
                </p>
              </div>

              <div className="mt-6 space-y-0">
                <h1 className="animate-[fadeUp_1.2s_ease-out] text-4xl font-semibold leading-[0.96] tracking-[-0.05em] md:text-6xl lg:text-[5.2rem]">
                  Startup
                </h1>

                <h1 className="animate-[fadeUp_1.35s_ease-out] text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-white/65 md:text-6xl lg:text-[5.2rem]">
                  Diligence
                </h1>

                <div className="overflow-hidden pt-1">
                  <span className="font-script inline-block animate-[luxuryFloat_7s_ease-in-out_infinite] text-[3.8rem] leading-[0.95] tracking-normal text-[#e6d6b2] md:text-[4.6rem] lg:text-[5rem]">
                    Copilot
                  </span>
                </div>
              </div>

              <p className="animate-[fadeUp_1.5s_ease-out] mt-6 max-w-lg text-sm leading-7 text-white/58 md:text-[15px]">
                A workspace for angels and micro-VCs to analyze startup
                documents, surface risk, ask evidence-backed questions, and draft
                investment memos with traceable citations.
              </p>

              {/* CTA */}
              <div className="animate-[fadeUp_1.7s_ease-out] mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/dashboard"
                  className="group relative overflow-hidden rounded-full border border-[#c9a861]/40 bg-[#c9a861] px-7 py-3 text-sm font-medium text-black transition-all duration-500 hover:scale-[1.04] hover:shadow-[0_0_45px_rgba(201,168,97,0.28)]"
                >
                  <span className="relative z-10">Enter Workspace</span>

                  <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-700 group-hover:translate-y-0" />
                </Link>

                <Link
                  href="/deals/new"
                  className="rounded-full border border-white/12 bg-white/[0.02] px-7 py-3 text-sm text-white/78 backdrop-blur-sm transition-all duration-500 hover:scale-[1.03] hover:border-white/25 hover:bg-white/[0.05]"
                >
                  Create New Deal
                </Link>
              </div>
            </div>

            {/* Right Card */}
            <div className="relative mx-auto w-full max-w-[500px] animate-[floatCard_9s_ease-in-out_infinite]">
              {/* glow */}
              <div className="absolute inset-0 rounded-[32px] bg-[#c9a861]/10 blur-3xl" />

              <div className="deal-card relative rounded-[30px] border border-white/10 bg-white/[0.045] p-[1px] shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-700 hover:translate-y-[-3px] hover:border-white/15">
                <div className="rounded-[30px] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-5">
                  {/* top */}
                  <div className="mb-7 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.32em] text-white/42">
                        Active Deal
                      </p>
                    </div>

                    <span className="rounded-full border border-[#c9a861]/25 bg-[#c9a861]/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#d8c7a1]">
                      In Review
                    </span>
                  </div>

                  {/* company */}
                  <div className="border-b border-white/8 pb-5">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">
                      Company
                    </p>

                    <h2 className="mt-3 text-[2rem] font-medium tracking-[-0.03em] text-white">
                      Northstar Labs
                    </h2>

                    <p className="mt-2 text-sm text-white/48">
                      Seed • B2B SaaS • Workflow Intelligence
                    </p>
                  </div>

                  {/* cards */}
                  <div className="mt-5 space-y-3">
                    <div className="group rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition-all duration-500 hover:border-white/15 hover:bg-white/[0.045] hover:translate-x-[2px]">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">
                          Sources
                        </p>

                        <div className="h-1.5 w-1.5 rounded-full bg-[#c9a861]" />
                      </div>

                      <p className="text-sm leading-6 text-white/78">
                        12 files ingested, 8 public sources enriched
                      </p>
                    </div>

                    <div className="group rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition-all duration-500 hover:border-white/15 hover:bg-white/[0.045] hover:translate-x-[2px]">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">
                          Risk Signal
                        </p>

                        <div className="h-1.5 w-1.5 rounded-full bg-[#c9a861]" />
                      </div>

                      <p className="text-sm leading-6 text-white/78">
                        Cap table mismatch flagged, missing IP assignment evidence
                      </p>
                    </div>

                    <div className="group rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition-all duration-500 hover:border-white/15 hover:bg-white/[0.045] hover:translate-x-[2px]">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">
                          Memo Status
                        </p>

                        <div className="h-1.5 w-1.5 rounded-full bg-[#c9a861]" />
                      </div>

                      <p className="text-sm leading-6 text-white/78">
                        Draft memo ready with citations across deck and web data
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="animate-[fadeUp_2s_ease-out] flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 text-[10px] uppercase tracking-[0.28em] text-white/32">
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-8 bg-white/15" />
              <p>Boardroom-grade diligence</p>
            </div>

            <p>Traceable • Structured • Quietly premium</p>
          </footer>
        </div>
      </section>
    </main>
  );
}