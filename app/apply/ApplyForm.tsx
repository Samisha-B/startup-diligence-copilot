"use client"

import { useState } from "react"

const BANDS = ["1-10", "11-50", "51-100", "101-250", "251-500", "501-1000", "1001-5000", "5001-10000", "10001+"]

const FIELDS: { name: string; label: string; type?: string; required?: boolean; hint?: string }[] = [
  { name: "contactEmail", label: "Contact email", type: "email", required: true },
  { name: "companyName", label: "Company name", required: true },
  { name: "website", label: "Website" },
  { name: "city", label: "City", required: true },
  { name: "foundedYear", label: "Founded (year)", type: "number", required: true },
  { name: "founders", label: "Founders (comma separated)", required: true },
  { name: "industries", label: "Industries (comma separated)", required: true, hint: "e.g. FinTech, Payments, SaaS" },
  { name: "fundingRaisedUsd", label: "Total funding raised (USD)", type: "number", required: true },
  { name: "fundingRounds", label: "Number of funding rounds", type: "number", required: true },
  { name: "investorCount", label: "Number of investors", type: "number", required: true },
  { name: "annualRevenueUsd", label: "Annual revenue (USD, optional)", type: "number" },
  { name: "customerCount", label: "Customers (optional)", type: "number" },
  { name: "monthlyGrowthPct", label: "Monthly growth % (optional)", type: "number" },
]

const INPUT = "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white placeholder:text-white/30 focus:border-[#c9a861] focus:outline-none"

export default function ApplyForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle")
  const [error, setError] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState("sending")
    const fd = new FormData(e.currentTarget)
    const body: Record<string, string> = {}
    fd.forEach((v, k) => {
      if (typeof v === "string" && v.trim() !== "") body[k] = v.trim()
    })
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (res.ok) setState("done")
    else {
      setError("Please check the fields and try again.")
      setState("error")
    }
  }

  if (state === "done") {
    return <p className="rounded-xl border border-[#c9a861]/30 bg-[#c9a861]/10 p-4 text-[#f3ddb0]">Thanks! Your application has been submitted.</p>
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {FIELDS.map((f) => (
        <label key={f.name} className="block text-sm">
          <span className="mb-1 block font-medium text-white/80">{f.label}</span>
          <input name={f.name} type={f.type ?? "text"} required={f.required} step="any" placeholder={f.hint} className={INPUT} />
        </label>
      ))}
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-white/80">Employees</span>
        <select name="employeeBand" required className={INPUT}>
          {BANDS.map((b) => (<option key={b} className="bg-[#0a0a0b]">{b}</option>))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-white/80">What does your company do?</span>
        <textarea name="description" required minLength={10} rows={4} className={INPUT} />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-white/80">Other claims (awards, pilots, partnerships)</span>
        <textarea name="otherClaims" rows={3} className={INPUT} />
      </label>
      {state === "error" && <p className="text-sm text-red-400">{error}</p>}
      <button disabled={state === "sending"} className="rounded-full bg-[#c9a861] px-6 py-2.5 text-sm font-medium text-black transition hover:bg-[#e6d6b2] disabled:opacity-50">
        {state === "sending" ? "Submitting and verifying..." : "Submit application"}
      </button>
    </form>
  )
}
