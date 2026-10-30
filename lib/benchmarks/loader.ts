import fs from "node:fs"
import path from "node:path"

export type Peer = {
  company: string
  city: string
  year: number
  industries: string[]
  employees: string
  fundingUsd: number
  rounds: number
  investors: number
}

export type PeerStats = {
  count: number
  funding: { p25: number; p50: number; p75: number; p90: number }
  perRoundMedian: number
  perRoundP90: number
  roundsP90: number
  investorsMedian: number
  investorsPerRoundMedian: number
  fundingPerEmployeeMedian: number
}

export const EMPLOYEE_MIDPOINT: Record<string, number> = {
  "1-10": 5,
  "11-50": 30,
  "51-100": 75,
  "101-250": 175,
  "251-500": 375,
  "501-1000": 750,
  "1001-5000": 3000,
  "5001-10000": 7500,
  "10001+": 15000,
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ""
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (c === '"') quoted = false
      else field += c
    } else if (c === '"') quoted = true
    else if (c === ",") {
      row.push(field)
      field = ""
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++
      row.push(field)
      field = ""
      if (row.some((x) => x.trim() !== "")) rows.push(row)
      row = []
    } else field += c
  }
  if (field !== "" || row.length) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

let cache: Peer[] | null = null

export function loadPeers(): Peer[] {
  if (cache) return cache
  const file = path.join(process.cwd(), "data", "indian_startups.csv")
  if (!fs.existsSync(file)) {
    throw new Error("Benchmark dataset missing: add data/indian_startups.csv (see data/README.md)")
  }
  const rows = parseCsv(fs.readFileSync(file, "utf8"))
  const header = rows[0].map((h) => h.trim())
  const idx = (name: string) => header.findIndex((h) => h.toLowerCase().startsWith(name.toLowerCase()))
  const col = {
    company: idx("Company"),
    city: idx("City"),
    year: idx("Starting Year"),
    industries: idx("Industries"),
    employees: idx("No. of Employees"),
    funding: idx("Funding Amount"),
    rounds: idx("Funding Round"),
    investors: idx("No. of Investors"),
  }
  cache = rows.slice(1).map((r) => ({
    company: (r[col.company] ?? "").trim(),
    city: (r[col.city] ?? "").trim(),
    year: Number(r[col.year]) || 0,
    industries: (r[col.industries] ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    employees: (r[col.employees] ?? "").trim(),
    fundingUsd: Number(r[col.funding]) || 0,
    rounds: Number(r[col.rounds]) || 0,
    investors: Number(r[col.investors]) || 0,
  })).filter((p) => p.company)
  return cache
}

export function quantile(values: number[], p: number): number {
  if (!values.length) return 0
  const s = [...values].sort((a, b) => a - b)
  const pos = (s.length - 1) * p
  const lo = Math.floor(pos)
  const hi = Math.ceil(pos)
  return s[lo] + (s[hi] - s[lo]) * (pos - lo)
}

export function percentileRank(values: number[], x: number): number {
  if (!values.length) return 0
  return Math.round((values.filter((v) => v <= x).length / values.length) * 100)
}

export function normalizeName(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "")
}

export function findPeerGroup(industries: string[]): { peers: Peer[]; usedFullSet: boolean } {
  const all = loadPeers().filter((p) => p.fundingUsd > 0)
  const wanted = new Set(industries.map((i) => i.toLowerCase()))
  const scored = all
    .map((p) => ({ p, score: p.industries.filter((i) => wanted.has(i.toLowerCase())).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 40)
    .map((x) => x.p)
  if (scored.length < 10) return { peers: all, usedFullSet: true }
  return { peers: scored, usedFullSet: false }
}

export function computeStats(peers: Peer[]): PeerStats {
  const funding = peers.map((p) => p.fundingUsd)
  const perRound = peers.filter((p) => p.rounds > 0).map((p) => p.fundingUsd / p.rounds)
  const ipr = peers.filter((p) => p.rounds > 0 && p.investors > 0).map((p) => p.investors / p.rounds)
  const fpe = peers
    .filter((p) => EMPLOYEE_MIDPOINT[p.employees])
    .map((p) => p.fundingUsd / EMPLOYEE_MIDPOINT[p.employees])
  return {
    count: peers.length,
    funding: {
      p25: quantile(funding, 0.25),
      p50: quantile(funding, 0.5),
      p75: quantile(funding, 0.75),
      p90: quantile(funding, 0.9),
    },
    perRoundMedian: quantile(perRound, 0.5),
    perRoundP90: quantile(perRound, 0.9),
    roundsP90: quantile(peers.map((p) => p.rounds), 0.9),
    investorsMedian: quantile(peers.map((p) => p.investors), 0.5),
    investorsPerRoundMedian: quantile(ipr, 0.5),
    fundingPerEmployeeMedian: quantile(fpe, 0.5),
  }
}
