"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function VerifyButton({ applicationId }: { applicationId: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  async function run() {
    setBusy(true)
    await fetch(`/api/applications/${applicationId}/verify`, { method: "POST" })
    setBusy(false)
    router.refresh()
  }
  return (
    <button onClick={run} disabled={busy} className="rounded border px-3 py-1 text-sm disabled:opacity-50">
      {busy ? "Re-running..." : "Re-run verification"}
    </button>
  )
}
