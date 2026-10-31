import { Annotation, END, START, StateGraph } from "@langchain/langgraph"
import {
  EMPLOYEE_MIDPOINT,
  computeStats,
  findPeerGroup,
  loadPeers,
  normalizeName,
  percentileRank,
  type Peer,
  type PeerStats,
} from "../benchmarks/loader"
import type { ApplicationInput } from "./schema"
import { buildQuestions, type Finding, type InvestorQuestion } from "./questions"
import { checkDocuments, type DocFact } from "./documents-check"

const State = Annotation.Root({
  application: Annotation<ApplicationInput>(),
  documentFacts: Annotation<DocFact[]>(),
  peers: Annotation<Peer[]>(),
  usedFullSet: Annotation<boolean>(),
  stats: Annotation<PeerStats | null>(),
  exactMatch: Annotation<Peer | null>(),
  findings: Annotation<Finding[]>(),
  docQuestions: Annotation<InvestorQuestion[]>(),
  questions: Annotation<InvestorQuestion[]>(),
})

type S = typeof State.State

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`

async function findPeers(state: S): Promise<Partial<S>> {
  const a = state.application
  const { peers, usedFullSet } = findPeerGroup(a.industries)
  const key = normalizeName(a.companyName)
  const exactMatch = loadPeers().find((p) => normalizeName(p.company) === key) ?? null
  return { peers, usedFullSet, stats: computeStats(peers), exactMatch }
}

async function checkClaims(state: S): Promise<Partial<S>> {
  const a = state.application
  const st = state.stats!
  const findings: Finding[] = []
  const year = new Date().getFullYear()
  const age = Math.max(year - a.foundedYear, 0)
  const add = (f: Finding) => findings.push(f)

  if (a.foundedYear > year || a.foundedYear < 1984) {
    add({ id: "founded_year", claim: `Founded ${a.foundedYear}`, verdict: "outlier", severity: "high", detail: "Founding year is outside the plausible range for a startup." })
  }

  if (state.exactMatch) {
    const m = state.exactMatch
    const ratio = m.fundingUsd > 0 ? a.fundingRaisedUsd / m.fundingUsd : 1
    if (m.fundingUsd > 0 && (ratio > 1.25 || ratio < 0.75)) {
      add({ id: "dataset_match", claim: `Funding ${usd(a.fundingRaisedUsd)}`, verdict: "outlier", severity: "high", detail: `A company named ${m.company} is in the benchmark with ${usd(m.fundingUsd)} raised over ${m.rounds} rounds; the application differs by ${Math.round(Math.abs(ratio - 1) * 100)}%.` })
    } else {
      add({ id: "dataset_match", claim: `Funding ${usd(a.fundingRaisedUsd)}`, verdict: "consistent", severity: "low", detail: `Matches the benchmark record for ${m.company} within 25%.` })
    }
  }

  const fundingRank = percentileRank(state.peers.map((p) => p.fundingUsd), a.fundingRaisedUsd)
  if (a.fundingRaisedUsd > st.funding.p90 && age <= 5) {
    add({ id: "total_funding", claim: `Raised ${usd(a.fundingRaisedUsd)}`, verdict: "outlier", severity: "high", detail: `Above the peer 90th percentile (${usd(st.funding.p90)}) despite being only ${age} years old. Peer median is ${usd(st.funding.p50)} (n=${st.count}).` })
  } else {
    add({ id: "total_funding", claim: `Raised ${usd(a.fundingRaisedUsd)}`, verdict: "consistent", severity: "low", detail: `At roughly the ${fundingRank}th percentile of ${st.count} peers (median ${usd(st.funding.p50)}).` })
  }

  if (a.fundingRounds > 0) {
    const perRound = a.fundingRaisedUsd / a.fundingRounds
    if (perRound > st.perRoundP90) {
      add({ id: "per_round", claim: `${a.fundingRounds} rounds, avg ${usd(perRound)}`, verdict: "outlier", severity: "medium", detail: `Average round size exceeds peer 90th percentile (${usd(st.perRoundP90)}); median is ${usd(st.perRoundMedian)}.` })
    }
    if (a.fundingRounds > st.roundsP90 || (age > 0 && a.fundingRounds > age * 2 + 1)) {
      add({ id: "rounds_vs_age", claim: `${a.fundingRounds} rounds in ${age} years`, verdict: "outlier", severity: "medium", detail: `More rounds than the peer 90th percentile (${Math.round(st.roundsP90)}) or than is typical for the company age.` })
    }
    if (a.investorCount > Math.max(a.fundingRounds * 4, st.investorsPerRoundMedian * a.fundingRounds * 3)) {
      add({ id: "investor_count", claim: `${a.investorCount} investors`, verdict: "outlier", severity: "medium", detail: `Peers have a median of ${st.investorsPerRoundMedian.toFixed(1)} investors per round; this is ${(a.investorCount / a.fundingRounds).toFixed(1)}.` })
    }
  } else if (a.fundingRaisedUsd > 0) {
    add({ id: "rounds_vs_age", claim: "Funding with 0 rounds", verdict: "outlier", severity: "medium", detail: "Funding is claimed but no rounds are reported." })
  }

  const heads = EMPLOYEE_MIDPOINT[a.employeeBand]
  if (heads && st.fundingPerEmployeeMedian > 0) {
    const fpe = a.fundingRaisedUsd / heads
    if (fpe > st.fundingPerEmployeeMedian * 4) {
      add({ id: "funding_per_employee", claim: `${a.employeeBand} employees`, verdict: "outlier", severity: "medium", detail: `About ${usd(fpe)} raised per employee vs peer median ${usd(st.fundingPerEmployeeMedian)}.` })
    }
  }

  if (a.annualRevenueUsd != null) {
    add({ id: "revenue_evidence", claim: `Revenue ${usd(a.annualRevenueUsd)}/yr`, verdict: "unverifiable", severity: "medium", detail: "The benchmark dataset has no revenue data. Needs primary documents." })
    if (heads && a.annualRevenueUsd / heads > 500000) {
      add({ id: "revenue_per_employee", claim: "Revenue per employee", verdict: "outlier", severity: "medium", detail: `Implies ${usd(a.annualRevenueUsd / heads)} revenue per employee.` })
    }
  }
  if (a.monthlyGrowthPct != null && a.monthlyGrowthPct > 30) {
    add({ id: "growth", claim: `${a.monthlyGrowthPct}% monthly growth`, verdict: "outlier", severity: "medium", detail: "Above 30% month-on-month is rarely sustained; usually reflects a small base." })
  }
  if (a.customerCount != null) {
    add({ id: "customers", claim: `${a.customerCount} customers`, verdict: "unverifiable", severity: "low", detail: "Not verifiable from the benchmark dataset." })
  }
  if (a.otherClaims && a.otherClaims.trim()) {
    add({ id: "other_claims", claim: "Other claims", verdict: "unverifiable", severity: "low", detail: "Free-text claims need documentary evidence." })
  }
  return { findings }
}

async function checkDocs(state: S): Promise<Partial<S>> {
  const res = checkDocuments(state.application, state.findings, state.documentFacts ?? [])
  return { findings: res.findings, docQuestions: res.questions }
}

async function generateQuestions(state: S): Promise<Partial<S>> {
  const rank = { high: 0, medium: 1, low: 2 }
  const all = [...(state.docQuestions ?? []), ...buildQuestions(state.application, state.findings)]
  return { questions: all.sort((a, b) => rank[a.priority] - rank[b.priority]) }
}

const graph = new StateGraph(State)
  .addNode("find_peers", findPeers)
  .addNode("check_claims", checkClaims)
  .addNode("check_documents", checkDocs)
  .addNode("generate_questions", generateQuestions)
  .addEdge(START, "find_peers")
  .addEdge("find_peers", "check_claims")
  .addEdge("check_claims", "check_documents")
  .addEdge("check_documents", "generate_questions")
  .addEdge("generate_questions", END)
  .compile()

export async function runDiligenceGraph(application: ApplicationInput, documentFacts: DocFact[] = []) {
  const out = await graph.invoke({ application, documentFacts })
  return {
    findings: out.findings,
    questions: out.questions,
    stats: out.stats,
    usedFullSet: out.usedFullSet,
    matchedCompany: out.exactMatch?.company ?? null,
    examplePeers: out.peers.slice(0, 5).map((p) => p.company),
  }
}
