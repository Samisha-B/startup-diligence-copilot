import { normalizeName } from "../benchmarks/loader"
import type { ApplicationInput } from "./schema"
import type { DocFacts } from "./facts"
import type { Finding, InvestorQuestion } from "./questions"

export type DocFact = DocFacts & { docName: string }

const INR_PER_USD = Number(process.env.INR_PER_USD) || 85
const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`

function toUsd(amount?: number | null, currency?: string | null): number | null {
  if (amount == null) return null
  const c = (currency ?? "").toUpperCase()
  if (c === "USD") return amount
  if (c === "INR" || c === "") return amount / INR_PER_USD
  return null
}

function annualFactor(period?: string | null) {
  const p = (period ?? "").toLowerCase()
  return p === "monthly" ? 12 : p === "quarterly" ? 4 : 1
}

export function checkDocuments(
  app: ApplicationInput,
  findings: Finding[],
  facts: DocFact[],
): { findings: Finding[]; questions: InvestorQuestion[] } {
  const out = [...findings]
  const questions: InvestorQuestion[] = []
  if (!facts.length) return { findings: out, questions }

  const drop = (id: string) => {
    const i = out.findIndex((f) => f.id === id)
    if (i >= 0) out.splice(i, 1)
  }
  const add = (f: Finding) => out.push(f)
  const ask = (q: InvestorQuestion) => questions.push(q)

  if (app.annualRevenueUsd != null) {
    const hit = facts.map((f) => ({ f, v: toUsd(f.revenueAmount, f.revenueCurrency) })).find((x) => x.v != null)
    if (hit) {
      const annual = (hit.v as number) * annualFactor(hit.f.revenuePeriod)
      const ratio = annual / Math.max(app.annualRevenueUsd, 1)
      const note = `${hit.f.docName} (${hit.f.docType}) shows about ${usd(annual)}/yr${annualFactor(hit.f.revenuePeriod) > 1 ? " (annualised from a partial period)" : ""}; INR converted at ${INR_PER_USD}/USD.`
      drop("revenue_evidence")
      if (ratio < 0.75) {
        add({ id: "doc_revenue", claim: `Revenue ${usd(app.annualRevenueUsd)}/yr (document check)`, verdict: "outlier", severity: "high", detail: `Claim is higher than the document: ${note}` })
        ask({ topic: "Revenue mismatch", question: `Your application claims ${usd(app.annualRevenueUsd)} annual revenue but ${hit.f.docName} supports roughly ${usd(annual)}. What explains the gap (other periods, other entities, unbilled revenue)?`, rationale: "Uploaded document contradicts the revenue claim.", priority: "high" })
      } else {
        add({ id: "doc_revenue", claim: `Revenue ${usd(app.annualRevenueUsd)}/yr (document check)`, verdict: "consistent", severity: "low", detail: `Supported: ${note}` })
      }
    }
  }

  if (app.customerCount != null) {
    const hit = facts.find((f) => f.customerCount != null)
    if (hit) {
      const ratio = (hit.customerCount as number) / Math.max(app.customerCount, 1)
      drop("customers")
      if (ratio < 0.8) {
        add({ id: "doc_customers", claim: `${app.customerCount} customers (document check)`, verdict: "outlier", severity: ratio < 0.5 ? "high" : "medium", detail: `${hit.docName} states ${hit.customerCount} customers.` })
        ask({ topic: "Customer count mismatch", question: `You claim ${app.customerCount} customers but ${hit.docName} shows ${hit.customerCount}. How do you define a customer in each case?`, rationale: "Uploaded document contradicts the customer claim.", priority: ratio < 0.5 ? "high" : "medium" })
      } else {
        add({ id: "doc_customers", claim: `${app.customerCount} customers (document check)`, verdict: "consistent", severity: "low", detail: `Supported by ${hit.docName} (${hit.customerCount}).` })
      }
    }
  }

  const inc = facts.find((f) => f.incorporationYear != null)
  if (inc) {
    const diff = Math.abs((inc.incorporationYear as number) - app.foundedYear)
    if (diff >= 1) {
      add({ id: "doc_founded", claim: `Founded ${app.foundedYear} (document check)`, verdict: "outlier", severity: diff >= 3 ? "high" : "medium", detail: `${inc.docName} shows incorporation in ${inc.incorporationYear}.` })
      ask({ topic: "Founding date", question: `Incorporation documents show ${inc.incorporationYear}, but you list ${app.foundedYear}. Was there an earlier entity, a rename or a pivot?`, rationale: "Document year differs from the application.", priority: diff >= 3 ? "high" : "medium" })
    } else {
      add({ id: "doc_founded", claim: `Founded ${app.foundedYear} (document check)`, verdict: "consistent", severity: "low", detail: `Matches ${inc.docName}.` })
    }
  }

  const fund = facts.map((f) => ({ f, v: toUsd(f.totalFundingAmount, f.fundingCurrency) })).find((x) => x.v != null)
  if (fund && app.fundingRaisedUsd > 0) {
    const ratio = (fund.v as number) / app.fundingRaisedUsd
    if (ratio < 0.75 || ratio > 1.25) {
      add({ id: "doc_funding", claim: `Raised ${usd(app.fundingRaisedUsd)} (document check)`, verdict: "outlier", severity: "high", detail: `${fund.f.docName} shows about ${usd(fund.v as number)}.` })
      ask({ topic: "Funding mismatch", question: `You state ${usd(app.fundingRaisedUsd)} raised, but ${fund.f.docName} shows about ${usd(fund.v as number)}. Which rounds are included in each figure?`, rationale: "Document funding differs from the claim by more than 25%.", priority: "high" })
    } else {
      add({ id: "doc_funding", claim: `Raised ${usd(app.fundingRaisedUsd)} (document check)`, verdict: "consistent", severity: "low", detail: `Within 25% of ${fund.f.docName}.` })
    }
  }

  const named = facts.find((f) => f.companyName)
  if (named) {
    const a = normalizeName(app.companyName)
    const b = normalizeName(named.companyName as string)
    if (a && b && !a.includes(b) && !b.includes(a)) {
      add({ id: "doc_entity", claim: "Entity name", verdict: "outlier", severity: "medium", detail: `${named.docName} is issued to "${named.companyName}", not "${app.companyName}".` })
      ask({ topic: "Legal entity", question: `Documents are in the name "${named.companyName}". What is the relationship to ${app.companyName} (parent, subsidiary, rename)?`, rationale: "Document belongs to a differently named entity.", priority: "medium" })
    }
  }

  const docFounders = facts.find((f) => f.founders && f.founders.length)
  if (docFounders) {
    const mine = app.founders.split(",").map((s) => normalizeName(s)).filter(Boolean)
    const theirs = (docFounders.founders as string[]).map((s) => normalizeName(s))
    const overlap = mine.some((m) => theirs.some((t) => t.includes(m) || m.includes(t)))
    if (!overlap) {
      add({ id: "doc_founders", claim: "Founders", verdict: "outlier", severity: "medium", detail: `${docFounders.docName} lists ${(docFounders.founders as string[]).join(", ")}; none match the application.` })
      ask({ topic: "Founders", question: "The people named in your documents differ from the founders you listed. Who are the directors and shareholders today?", rationale: "No overlap between declared founders and document names.", priority: "medium" })
    }
  }

  return { findings: out, questions }
}
