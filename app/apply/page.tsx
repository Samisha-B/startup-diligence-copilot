import ApplyForm from "./ApplyForm"

export default function ApplyPage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Startup application</h1>
      <p className="mb-6 text-sm text-gray-600">Tell us about your company. Claims you make here are checked against peer benchmarks.</p>
      <ApplyForm />
    </main>
  )
}
