import Link from "next/link"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function ApplicationsPage() {
  const apps = await prisma.startupApplication.findMany({ orderBy: { createdAt: "desc" }, take: 100 })
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#c9a861]">Inbound</p>
          <h1 className="text-2xl font-semibold text-white">Startup applications</h1>
        </div>
        <Link href="/apply" target="_blank" className="rounded-full border border-[#c9a861]/50 px-5 py-2 text-sm text-[#f3ddb0] hover:bg-[#c9a861]/10">Open founder form ↗</Link>
      </div>
      <ul className="divide-y divide-white/8 overflow-hidden rounded-xl border border-white/8">
        {apps.map((a) => (
          <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 p-4">
            <Link href={`/applications/${a.id}`} className="font-medium text-[#f3ddb0] hover:underline">{a.companyName}</Link>
            <span className="text-sm text-white/45">{a.city} · {a.status} · {a.createdAt.toDateString()}</span>
          </li>
        ))}
        {apps.length === 0 && <li className="p-4 text-sm text-white/50">No applications yet. Share the founder form at /apply.</li>}
      </ul>
    </div>
  )
}
