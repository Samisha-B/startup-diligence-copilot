import ApplyForm from "./ApplyForm"

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0b] px-6 py-10 text-[#f5f1e8]">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs uppercase tracking-[0.3em] text-[#c9a861]">Startup Diligence Copilot</p>
        <h1 className="mt-3 text-3xl font-semibold">Startup application</h1>
        <p className="mb-8 mt-2 text-sm text-white/60">Tell us about your company. The claims you make here are checked against peer benchmarks from the Indian top-300 startups dataset.</p>
        <ApplyForm />
      </div>
    </main>
  )
}
