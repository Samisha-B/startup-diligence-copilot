"use client"

import { useState } from "react"

type Q = { id: string; topic: string; question: string; rationale: string | null; priority: string; asked: boolean; answer: string | null }

const COLORS: Record<string, string> = { high: "bg-red-500/20 text-red-300", medium: "bg-amber-500/20 text-amber-300", low: "bg-white/10 text-white/60" }

export default function QuestionList({ applicationId, initial }: { applicationId: string; initial: Q[] }) {
  const [items, setItems] = useState(initial)

  async function patch(id: string, data: Partial<Pick<Q, "asked" | "answer">>) {
    setItems((cur) => cur.map((q) => (q.id === id ? { ...q, ...data } : q)))
    await fetch(`/api/applications/${applicationId}/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  }

  return (
    <ul className="space-y-3">
      {items.map((q) => (
        <li key={q.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-1 flex items-center gap-2 text-xs">
            <span className={`rounded px-2 py-0.5 ${COLORS[q.priority]}`}>{q.priority}</span>
            <span className="text-white/45">{q.topic}</span>
          </div>
          <p className="font-medium text-white">{q.question}</p>
          {q.rationale && <p className="mt-1 text-sm text-white/50">Why: {q.rationale}</p>}
          <label className="mt-2 flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" checked={q.asked} onChange={(e) => patch(q.id, { asked: e.target.checked })} />
            Asked
          </label>
          <textarea defaultValue={q.answer ?? ""} onBlur={(e) => patch(q.id, { answer: e.target.value })} placeholder="Founder's answer / notes" rows={2} className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-sm text-white placeholder:text-white/30" />
        </li>
      ))}
    </ul>
  )
}
