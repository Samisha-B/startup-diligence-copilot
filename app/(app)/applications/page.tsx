import Link from "next/link"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function ApplicationsPage() {
  const apps = await prisma.startupApplication.findMany({ orderBy: { createdAt: "desc" }, take: 100 })
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Applications</h1>
      <ul className="divide-y rounded border">
        {apps.map((a) => (
          <li key={a.id} className="flex items-center justify-between p-3">
            <Link href={`/applications/${a.id}`} className="font-medium underline">{a.companyName}</Link>
            <span className="text-sm text-gray-500">{a.city} · {a.status} · {a.createdAt.toDateString()}</span>
          </li>
        ))}
        {apps.length === 0 && <li className="p-3 text-sm text-gray-500">No applications yet. Share /apply with founders.</li>}
      </ul>
    </div>
  )
}
