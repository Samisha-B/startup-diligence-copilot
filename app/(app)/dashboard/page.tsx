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
    <main className="min-h-screen text-[#f5f1e8]">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#c9a861]">
          Dashboard
        </p>

        <h1 className="text-4xl font-semibold md:text-6xl">
          Active Deal Workspace
        </h1>

        <p className="mt-4 max-w-2xl text-white/60">
          Saved startup records now appear here.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="info-card rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-white/35">
              Total Deals
            </p>
            <h2 className="mt-4 text-3xl text-white">{deals.length}</h2>
          </div>

          <div className="info-card rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-white/35">
              Latest Stage
            </p>
            <h2 className="mt-4 text-2xl text-white">
              {deals[0]?.stage || "—"}
            </h2>
          </div>

          <div className="info-card rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-white/35">
              Latest Sector
            </p>
            <h2 className="mt-4 text-2xl text-white">
              {deals[0]?.sector || "—"}
            </h2>
          </div>
        </div>

        <div className="mt-10 rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl text-white">Recent deals</h2>
            <p className="text-sm text-white/40">
              {deals.length} saved
            </p>
          </div>

          {deals.length === 0 ? (
            <p className="text-white/45">No deals yet. Create your first one.</p>
          ) : (
            <div className="space-y-4">
              {deals.map((deal: any) => (
                <div
                  key={deal.id}
                  className="rounded-2xl border border-white/10 bg-black/20 p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl text-white">{deal.startupName}</h3>
                      <p className="mt-1 text-sm text-white/50">{deal.website}</p>
                    </div>

                    <div className="flex gap-3 text-xs uppercase tracking-[0.22em] text-white/45">
                      <span>{deal.stage}</span>
                      <span>{deal.sector}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}