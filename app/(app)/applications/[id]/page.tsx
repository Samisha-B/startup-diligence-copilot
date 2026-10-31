import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import QuestionList from "./QuestionList"
import type { Finding } from "@/lib/diligence/questions"

export const dynamic = "force-dynamic"

const BADGE: Record<string, string> = { consistent: "text-green-400", outlier: "text-red-400", unverifiable: "text-amber-300" }

export default async function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const app = await prisma.startupApplication.findUnique({
    where: { id },
    include: { questions: { orderBy: { createdAt: "asc" } } },
  })
  if (!app) notFound()
  const analysis = app.analysis as { findings?: Finding[]; stats?: { count: number }; matchedCompany?: string | null; usedFullSet?: boolean } | null
  const rank: Record<string, number> = { high: 0, medium: 1, low: 2 }
  const questions = [...app.questions].sort((a, b) => rank[a.priority] - rank[b.priority])

  return (
    <div className="space-y-8">
      <Link href="/applications" className="text-sm text-white/50 hover:text-white">← All applications</Link>
      <header>
        <h1 className="text-2xl font-semibold text-white">{app.companyName}</h1>
        <p className="text-sm text-white/50">{app.city} · founded {app.foundedYear} · {app.industries.join(", ")}</p>
        {analysis?.stats && (
          <p className="mt-1 text-sm text-white/50">
            Compared with {analysis.stats.count} {analysis.usedFullSet ? "startups (no close sector match)" : "sector peers"} from the Indian top-300 dataset (2022 snapshot).
            {analysis.matchedCompany ? ` Name matches benchmark entry: ${analysis.matchedCompany}.` : ""}
          </p>
        )}
      </header>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#f3ddb0]">Claim verification</h2>
        {!analysis?.findings && <p className="text-sm text-white/50">Not analysed yet (status: {app.status}).</p>}
        <ul className="space-y-2">
          {analysis?.findings?.map((f, i) => (
            <li key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/85">
              <span className={`font-medium ${BADGE[f.verdict]}`}>{f.verdict}</span> · {f.claim}
              <p className="mt-1 text-white/55">{f.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-[#f3ddb0]">Questions to ask the founders</h2>
        <QuestionList applicationId={app.id} initial={questions.map((q) => ({ id: q.id, topic: q.topic, question: q.question, rationale: q.rationale, priority: q.priority, asked: q.asked, answer: q.answer }))} />
      </section>
    </div>
  )
}
