"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Result = { name: string; ok: boolean; message: string }

export default function DocumentUploader({ applicationId }: { applicationId: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [results, setResults] = useState<Result[]>([])

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setBusy(true)
    for (const file of files) {
      const fd = new FormData()
      fd.append("file", file)
      try {
        const res = await fetch(`/api/applications/${applicationId}/documents`, { method: "POST", body: fd })
        const j = await res.json()
        const ok = res.ok && j.status === "done"
        setResults((r) => [...r, { name: file.name, ok, message: ok ? `Read via ${j.method}` : (j.error ?? "Failed") }])
      } catch {
        setResults((r) => [...r, { name: file.name, ok: false, message: "Upload failed" }])
      }
    }
    setBusy(false)
    e.target.value = ""
    router.refresh()
  }

  return (
    <div className="space-y-2 rounded border p-4">
      <p className="text-sm font-medium">Upload supporting documents (bank statements, GST returns, invoices, incorporation certificate, cap table)</p>
      <input type="file" multiple accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.webp" onChange={onChange} disabled={busy} className="text-sm" />
      {busy && <p className="text-sm text-gray-500">Reading documents (OCR can take ~20s each)...</p>}
      <ul className="text-sm">
        {results.map((r, i) => (
          <li key={i} className={r.ok ? "text-green-700" : "text-red-700"}>{r.name}: {r.message}</li>
        ))}
      </ul>
    </div>
  )
}
