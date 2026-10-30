import type { ApplicationInput } from "./schema"

export type Severity = "high" | "medium" | "low"

export type Finding = {
  id: string
  claim: string
  verdict: "consistent" | "outlier" | "unverifiable"
  severity: Severity
  detail: string
}

export type InvestorQuestion = {
  topic: string
  question: string
  rationale: string
  priority: Severity
}

const BY_FINDING: Record<string, (a: ApplicationInput) => Omit<InvestorQuestion, "priority">> = {
  founded_year: (a) => ({
    topic: "Company history",
    question: `You list ${a.foundedYear} as the founding year. Can you share incorporation documents and explain when product development and first revenue began?`,
    rationale: "Founding year is implausible or inconsistent with the stage claimed.",
  }),
  dataset_match: (a) => ({
    topic: "Identity & funding history",
    question: `${a.companyName} appears in our benchmark of well-known Indian startups. Is this the same entity, and can you reconcile your stated funding with public records?`,
    rationale: "Stated funding differs from the recorded figure for a company with the same name.",
  }),
  total_funding: () => ({
    topic: "Funding raised",
    question: "Please provide signed term sheets or bank-credited proof for each round, and list investors by round with amounts.",
    rationale: "Total funding is far above peers in the same sector.",
  }),
  per_round: () => ({
    topic: "Round sizes",
    question: "Walk us through round sizes and valuations. Why are your rounds larger than typical peers at this stage?",
    rationale: "Average round size is well above the peer 90th percentile.",
  }),
  rounds_vs_age: (a) => ({
    topic: "Fundraising cadence",
    question: `You report ${a.fundingRounds} rounds in ${new Date().getFullYear() - a.foundedYear} years. Which of these were priced rounds versus SAFEs, notes or bridges?`,
    rationale: "Number of rounds is high relative to company age and peers.",
  }),
  investor_count: () => ({
    topic: "Cap table",
    question: "Please share the full cap table. Who are the lead investors, and are any of the listed investors angels or syndicate members counted individually?",
    rationale: "Investor count is high relative to the number of rounds.",
  }),
  funding_per_employee: () => ({
    topic: "Burn & team",
    question: "What is your monthly burn and current runway? Where is the capital going given the team size?",
    rationale: "Capital per employee is far above the peer median.",
  }),
  revenue_evidence: (a) => ({
    topic: "Revenue proof",
    question: `You claim annual revenue of about $${Math.round(a.annualRevenueUsd ?? 0).toLocaleString("en-US")}. Can you share bank statements, GST filings or invoices for the last 12 months?`,
    rationale: "Revenue cannot be verified from the benchmark dataset and needs primary evidence.",
  }),
  revenue_per_employee: () => ({
    topic: "Revenue quality",
    question: "Revenue per employee looks unusually high. Is revenue gross or net, recurring or one-off, and what share comes from your top 3 customers?",
    rationale: "Revenue per head is far above typical ranges.",
  }),
  growth: (a) => ({
    topic: "Growth claim",
    question: `You claim ${a.monthlyGrowthPct}% monthly growth. Over which months, on what base, and how does retention look for those cohorts?`,
    rationale: "Sustained growth at this rate is rare and often reflects a very small base.",
  }),
  customers: (a) => ({
    topic: "Customer proof",
    question: `You report ${a.customerCount} customers. Can we speak to 3 of them, and how do you define an active customer?`,
    rationale: "Customer count cannot be verified from the benchmark.",
  }),
  other_claims: () => ({
    topic: "Other claims",
    question: "For each additional claim in your application (awards, partnerships, patents, pilots), please provide a supporting document or contact.",
    rationale: "Free-text claims were provided and need evidence.",
  }),
}

const BASELINE: InvestorQuestion[] = [
  { topic: "Runway", question: "What is your current monthly burn, cash in bank, and months of runway?", rationale: "Standard diligence.", priority: "medium" },
  { topic: "Founders", question: "What is the founder equity split and vesting schedule? Has any founder left or changed role?", rationale: "Standard diligence.", priority: "medium" },
  { topic: "Concentration", question: "What percentage of revenue comes from your largest customer?", rationale: "Standard diligence.", priority: "low" },
  { topic: "Compliance", question: "Are there any pending litigation, regulatory notices or IP disputes?", rationale: "Standard diligence.", priority: "low" },
]

export function buildQuestions(app: ApplicationInput, findings: Finding[]): InvestorQuestion[] {
  const out: InvestorQuestion[] = []
  for (const f of findings) {
    if (f.verdict === "consistent") continue
    const make = BY_FINDING[f.id]
    if (make) out.push({ ...make(app), priority: f.severity })
  }
  out.push(...BASELINE)
  const rank = { high: 0, medium: 1, low: 2 }
  return out.sort((a, b) => rank[a.priority] - rank[b.priority])
}
