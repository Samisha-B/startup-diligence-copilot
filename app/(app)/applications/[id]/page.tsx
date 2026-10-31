import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import QuestionList from "./QuestionList"
import VerifyButton from "./VerifyButton"
import DocumentUploader from "@/app/apply/DocumentUploader"
import type { Finding } from "@/lib/diligence/questions"
import type { CoverageItem } from "@/lib/diligence/coverage"

export const dynamic = "force-dynamic"

const BADGE: Record<string, string> = { consistent: "text-green-700", outlier: "text-red-700", unverifiable: "text-amber-700" }
const COVER: Record<string, { label: string; cls: string }> = {
  verified: { label: "Verified by document", cls: "text-green-700" },
  contradicted: { label: "Contradicted by document", cls: "text-red-700" },
  not_covered: { label: "Not covered by uploaded documents", cls: "text-amber-700" },
  no_documents: { label: "No documents yet", cls: "text-gray-500" },
}
const FACT_LABELS: Record<string, string> = {
  docType: "Type",
  companyName: "Company",
  revenueAmount: "Revenue",
  revenueCurrency: "Revenue currency",
  revenuePeriod: "Revenue period",
  customerCount: "Customers",
  incorporationYear: "Incorporation year",
  totalFundingAmount: "Funding",
  fundingCurrency: "Funding currency",
  founders: "Founders",
  keyEvidence: "Evidence",
}

function factLines(facts: unknown): string[] {
  if (!facts || typeof facts !== "object") return []
  return Object.entries(facts as Record<string, unknown>)
    .filter(([, v]) => v !== null && v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0))
    .map(([k, v]) => `${FACT_LABELS[k] ?? k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`)
}

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
  const analysis = app.analysis as { findings?: Finding[]; coverage?: CoverageItem[]; stats?: { count: number }; matchedCompany?: string | null; usedFullSet?: boolean } | null
  const coverage = analysis?.coverage ?? []
  const verified = coverage.filter((c) => c.status === "verified").length
  const contradicted = coverage.filter((c) => c.status === "contradicted").length
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
        <div className="mt-2"><VerifyButton applicationId={app.id} /></div>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Documents</h2>
        <ul className="space-y-2 text-sm">
          {documents.map((d) => {
            const lines = factLines(d.facts)
            return (
              <li key={d.id}>
                {d.name} · <span className={d.status === "done" ? "text-green-700" : "text-red-700"}>{d.status}</span>
                {d.method ? ` · ${d.method}` : ""}
                {d.error ? ` · ${d.error.slice(0, 120)}` : ""}
                {lines.length > 0 && (
                  <details className="mt-1 text-gray-600">
                    <summary className="cursor-pointer">What we read from this file</summary>
                    <ul className="ml-4 list-disc">{lines.map((l, i) => (<li key={i}>{l}</li>))}</ul>
                  </details>
                )}
                {d.status === "done" && lines.length <= 1 && <p className="text-gray-500">No verifiable figures were found in this file.</p>}
              </li>
            )
          })}
          {documents.length === 0 && <li className="text-gray-500">No documents uploaded yet.</li>}
        </ul>
        <DocumentUploader applicationId={app.id} />
      </section>

      <section>
        <h2 className="mb-1 text-lg font-semibold">Evidence coverage</h2>
        {coverage.length === 0 ? (
          <p className="text-sm text-gray-500">Click "Re-run verification" to compute coverage.</p>
        ) : (
          <>
            <p className="mb-2 text-sm text-gray-600">{verified} of {coverage.length} claims verified by documents{contradicted ? `, ${contradicted} contradicted` : ""}.</p>
            <ul className="space-y-2">
              {coverage.map((c) => (
                <li key={c.key} className="rounded border p-3 text-sm">
                  <span className={`font-medium ${COVER[c.status].cls}`}>{COVER[c.status].label}</span> · {c.claim}
                  <p className="text-gray-600">{c.note}</p>
                  {c.evidence && <p className="text-gray-500">{c.evidence}</p>}
                  {c.status !== "verified" && <p className="text-gray-500">Would be verified by: {c.needs.join(", ")}</p>}
                </li>
              ))}
            </ul>
          </>
        )}
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
