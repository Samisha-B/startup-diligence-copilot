import type { ApplicationInput } from "./schema"
import type { Finding } from "./questions"
import type { DocFact } from "./documents-check"

export type CoverageStatus = "verified" | "contradicted" | "not_covered" | "no_documents"

export type CoverageItem = {
  key: string
  claim: string
  status: CoverageStatus
  needs: string[]
  evidence?: string
  note: string
}

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`

export function buildCoverage(app: ApplicationInput, findings: Finding[], facts: DocFact[]): CoverageItem[] {
  const hasDocs = facts.length > 0
  const uploaded = [...new Set(facts.map((f) => f.docType))].join(", ")
  const byId = (id?: string) => (id ? findings.find((f) => f.id === id) : undefined)

  const mk = (key: string, claim: string, docFindingId: string | undefined, needs: string[], extra?: string): CoverageItem => {
    const f = byId(docFindingId)
    if (f) {
      const ok = f.verdict === "consistent"
      return {
        key,
        claim,
        status: ok ? "verified" : "contradicted",
        needs,
        evidence: f.detail,
        note: ok ? "Backed by an uploaded document." : "An uploaded document disagrees with this claim.",
      }
    }
    if (!hasDocs) {
      return { key, claim, status: "no_documents", needs, note: `No documents yet. Upload ${needs.join(" or ")} to verify.` }
    }
    return {
      key,
      claim,
      status: "not_covered",
      needs,
      note: `Uploaded documents (${uploaded}) do not state this. ${extra ?? `Need ${needs.join(" or ")}.`}`,
    }
  }

  const items: CoverageItem[] = []

  if (app.annualRevenueUsd != null) {
    items.push(mk("revenue", `Revenue ${usd(app.annualRevenueUsd)}/yr`, "doc_revenue", ["bank statements", "GST returns", "audited financials", "invoices"]))
  }
  if (app.customerCount != null) {
    items.push(mk("customers", `${app.customerCount.toLocaleString("en-US")} customers`, "doc_customers", ["customer list", "sales ledger", "invoices"]))
  }
  if (app.monthlyGrowthPct != null) {
    items.push(mk("growth", `${app.monthlyGrowthPct}% monthly growth`, undefined, ["12 months of monthly revenue (bank statements or MIS)"], "Growth needs a month-by-month revenue series; a single document cannot prove it."))
  }
  items.push(mk("founded", `Founded ${app.foundedYear}`, "doc_founded", ["certificate of incorporation"]))
  items.push(mk("funding", `Raised ${usd(app.fundingRaisedUsd)}`, "doc_funding", ["term sheets", "cap table", "bank credit advices"]))

  const withFounders = facts.find((f) => f.founders && f.founders.length)
  if (withFounders) {
    const bad = byId("doc_founders")
    items.push({
      key: "founders",
      claim: `Founders: ${app.founders}`,
      status: bad ? "contradicted" : "verified",
      needs: ["certificate of incorporation", "cap table"],
      evidence: bad ? bad.detail : `Names overlap with ${withFounders.docName}.`,
      note: bad ? "Document names do not match the declared founders." : "Backed by an uploaded document.",
    })
  } else {
    items.push(mk("founders", `Founders: ${app.founders}`, undefined, ["certificate of incorporation", "cap table"]))
  }

  if (app.otherClaims && app.otherClaims.trim()) {
    items.push(mk("other", "Other claims (awards, partnerships)", undefined, ["award certificate", "press link", "partnership letter"], "These need a manual check."))
  }
  return items
}
