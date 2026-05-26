async function getDeals() {
  const res = await fetch("http://localhost:3000/api/deals", {
    cache: "no-store",
  });
  return res.json();
}

export default async function DashboardPage() {
  const data = await getDeals();
  const deals = data.deals || [];

  return (
    <main className="relative min-h-screen text-[#f5f1e8]">
      <div className="relative">
        {/* Header — compact for web app context */}
        <div className="mb-10">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.5em] text-[#c9a861]">
            Dashboard
          </p>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Active Deal Workspace
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/50">
                Monitor pipelines, investment opportunities, diligence workflows,
                and active company records.
              </p>
            </div>

            {/* Pipeline count pill */}
            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-[#c9a861]/20 bg-[#c9a861]/8 px-5 py-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#c9a861]">
                  Active Pipeline
                </p>
                <p className="mt-0.5 text-2xl font-semibold tabular-nums text-white">
                  {deals.length}
                </p>
              </div>
              <div className="ml-2 h-8 w-px bg-[#c9a861]/20" />
              <div className="text-[10px] leading-4 text-white/40">
                startups <br /> tracked
              </div>
            </div>
          </div>
        </div>

        {/* Stats row — tighter, more informative */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {/* Total Deals */}
          <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-xl">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c9a861]/50 to-transparent" />
            <div className="p-5">
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">
                Total Deals
              </p>
              <p className="mt-3 text-4xl font-semibold tabular-nums text-white">
                {deals.length}
              </p>
              <p className="mt-2 text-xs leading-5 text-white/40">
                Startups in the investment workspace
              </p>
            </div>
          </div>

          {/* Latest Stage */}
          <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-xl">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="p-5">
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">
                Latest Stage
              </p>
              <p className="mt-3 text-xl font-semibold text-white">
                {deals[0]?.stage || "—"}
              </p>
              <p className="mt-2 text-xs leading-5 text-white/40">
                Most recent fundraising stage added
              </p>
            </div>
          </div>

          {/* Latest Sector */}
          <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-xl">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="p-5">
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">
                Latest Sector
              </p>
              <p className="mt-3 text-xl font-semibold text-white">
                {deals[0]?.sector || "—"}
              </p>
              <p className="mt-2 text-xs leading-5 text-white/40">
                Most recent industry category tracked
              </p>
            </div>
          </div>
        </div>

        {/* Deals table */}
        <div className="overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03] shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c9a861]/50 to-transparent" />

          <div className="p-6 md:p-8">
            {/* Table header row */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Recent Deals</h2>
                <p className="mt-1 text-xs text-white/40">
                  All saved startup records — updated in real time
                </p>
              </div>

              <a
                href="/deals/new"
                className="flex items-center gap-2 rounded-full border border-[#c9a861]/30 bg-[#c9a861]/10 px-4 py-2 text-xs font-medium tracking-wide text-[#f3ddb0] transition-all duration-200 hover:bg-[#c9a861]/18 hover:border-[#c9a861]/50"
              >
                <span>+</span>
                <span>New Deal</span>
              </a>
            </div>

            {/* Column headers */}
            {deals.length > 0 && (
              <div className="mb-3 grid grid-cols-[2rem_1fr_auto] items-center gap-4 px-4 text-[10px] uppercase tracking-[0.35em] text-white/25 md:grid-cols-[2rem_1fr_140px_140px_auto]">
                <span>#</span>
                <span>Startup</span>
                <span className="hidden md:block">Stage</span>
                <span className="hidden md:block">Sector</span>
                <span />
              </div>
            )}

            {/* Empty state */}
            {deals.length === 0 ? (
              <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/15 text-center">
                <div className="mb-4 rounded-full border border-[#c9a861]/20 bg-[#c9a861]/8 p-3">
                  <svg
                    className="h-5 w-5 text-[#c9a861]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white">
                  Pipeline is empty
                </h3>
                <p className="mt-2 max-w-xs text-xs leading-6 text-white/40">
                  Create your first startup record to begin tracking diligence,
                  financials, and investment workflows.
                </p>
                <a
                  href="/deals/new"
                  className="mt-5 rounded-full border border-[#c9a861]/30 bg-[#c9a861]/10 px-5 py-2.5 text-xs font-medium text-[#f3ddb0] transition-all duration-200 hover:bg-[#c9a861]/18"
                >
                  Add first deal →
                </a>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.05]">
                {deals.map((deal: any, index: number) => (
                  <div
                    key={deal.id}
                    className="group relative grid grid-cols-[2rem_1fr_auto] items-center gap-4 rounded-xl px-4 py-4 transition-all duration-200 hover:bg-white/[0.04] md:grid-cols-[2rem_1fr_140px_140px_auto]"
                  >
                    {/* Index */}
                    <span className="text-xs tabular-nums text-white/25">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Name + website */}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {deal.startupName}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-white/35">
                        {deal.website}
                      </p>
                    </div>

                    {/* Stage pill — hidden on mobile */}
                    <div className="hidden md:block">
                      <span className="inline-flex rounded-full border border-[#c9a861]/20 bg-[#c9a861]/8 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#f3ddb0]">
                        {deal.stage}
                      </span>
                    </div>

                    {/* Sector pill — hidden on mobile */}
                    <div className="hidden md:block">
                      <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/50">
                        {deal.sector}
                      </span>
                    </div>

                    {/* Chevron action */}
                    <svg
                      className="h-4 w-4 text-white/20 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#c9a861]/60"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}