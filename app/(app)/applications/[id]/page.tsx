import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import QuestionList from "./QuestionList"
import DocumentUploader from "@/app/apply/DocumentUploader"
import type { Finding } from "@/lib/diligence/questions"

export const dynamic = "force-dynamic"

const BADGE: Record<string, string> = { consistent: "text-green-700", outlier: "text-red-700", unverifiable: "text-amber-700" }

export default async function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const app = await prisma.startupApplication.findUnique({
    where: { id },
    include: { questions: { orderBy: { createdAt: "asc" } } },
  })
  if (!app) notFound()
  const documents = await prisma.applicationDocument.findMany({
    where: { applicationId: id },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, status: true, method: true, error: true, facts: true },
  })
  const analysis = app.analysis as { findings?: Finding[]; stats?: { count: number }; matchedCompany?: string | null; usedFullSet?: boolean } | null
  const rank: Record<string, number> = { high: 0, medium: 1, low: 2 }
  const questions = [...app.questions].sort((a, b) => rank[a.priority] - rank[b.priority])

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <header>
        <h1 className="text-2xl font-semibold">{app.companyName}</h1>
        <p className="text-sm text-gray-500">{app.city} · founded {app.foundedYear} · {app.industries.join(", ")}</p>
        {analysis?.stats && (
          <p className="mt-1 text-sm text-gray-500">
            Compared with {analysis.stats.count} {analysis.usedFullSet ? "startups (no close sector match)" : "sector peers"} from the Indian top-300 dataset (2022 snapshot).
            {analysis.matchedCompany ? ` Name matches benchmark entry: ${analysis.matchedCompany}.` : ""}
          </p>
        )}
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Documents</h2>
        <ul className="space-y-1 text-sm">
          {documents.map((d) => (
            <li key={d.id}>
              {d.name} · <span className={d.status === "done" ? "text-green-700" : "text-red-700"}>{d.status}</span>
              {d.method ? ` · ${d.method}` : ""}
              {d.facts ? ` · ${(d.facts as { docType?: string }).docType ?? "other"}` : ""}
              {d.error ? ` · ${d.error}` : ""}
            </li>
          ))}
          {documents.length === 0 && <li className="text-gray-500">No documents uploaded yet.</li>}
        </ul>
        <DocumentUploader applicationId={app.id} />
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Claim verification</h2>
        {!analysis?.findings && <p className="text-sm text-gray-500">Not analysed yet (status: {app.status}).</p>}
        <ul className="space-y-2">
          {analysis?.findings?.map((f, i) => (
            <li key={i} className="rounded border p-3 text-sm">
              <span className={`font-medium ${BADGE[f.verdict]}`}>{f.verdict}</span> · {f.claim}
              <p className="text-gray-600">{f.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Questions to ask the founders</h2>
        <QuestionList applicationId={app.id} initial={questions.map((q) => ({ id: q.id, topic: q.topic, question: q.question, rationale: q.rationale, priority: q.priority, asked: q.asked, answer: q.answer }))} />
      </section>
    </div>
  )
}
