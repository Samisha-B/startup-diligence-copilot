import Image from "next/image";
import Link from "next/link";

const workflow = [
  ["Ingest documents", "Organize pitch decks, financial statements, and supporting startup documents."],
  ["Assess claims", "Compare extracted claims with available evidence and highlight contradictions or missing information."],
  ["Research and compare", "Explore startup comparisons and market-size research with dated sources and explicit assumptions."],
  ["Summarize findings", "Answer investor questions and prepare diligence summaries with traceable evidence."],
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0a0a0b] text-[#f5f1e8]">
      <section className="relative isolate min-h-screen">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <Image src="/reference/img24.png" alt="" fill priority className="hero-image object-cover object-center opacity-65" />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0b]" />
        </div>
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6 md:px-8 lg:px-12">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[#d8c7a1]">Samisha Boywar</p>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Academic project · Prototype</p>
          </header>
          <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#d8c7a1]">Evidence-led investor research</p>
              <h1 className="mt-6 text-5xl font-semibold leading-tight tracking-tight md:text-6xl">Startup Diligence <span className="text-[#e6d6b2]">Copilot</span></h1>
              <p className="mt-6 max-w-lg text-base leading-8 text-white/70">An AI-assisted workspace for investors to review startup documents, assess claims against available evidence, identify risks, compare startups, and prepare evidence-backed diligence summaries.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/dashboard" className="rounded-full bg-[#c9a861] px-7 py-3 text-sm font-medium text-black transition hover:bg-[#e6d6b2]">Explore Workspace</Link>
                <Link href="/deals/new" className="rounded-full border border-white/25 px-7 py-3 text-sm text-white/80 transition hover:bg-white/10">Create New Deal</Link>
              </div>
              <p className="mt-6 text-sm leading-6 text-white/55">Prototype in development. The workflow below describes the target scope, not a claim that every capability is live. Research support only; not investment advice.</p>
            </div>
            <aside className="rounded-3xl border border-white/15 bg-black/35 p-6 backdrop-blur-xl" aria-labelledby="workflow-heading">
              <p className="text-xs uppercase tracking-[0.25em] text-[#d8c7a1]">Planned LangGraph workflow</p>
              <h2 id="workflow-heading" className="mt-3 text-2xl">From documents to diligence</h2>
              <ol className="mt-6 space-y-5">
                {workflow.map(([title, description], index) => (
                  <li key={title} className="border-t border-white/10 pt-4">
                    <h3 className="text-base font-medium text-[#e6d6b2]">{index + 1}. {title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/65">{description}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-6 border-t border-white/10 pt-4 text-sm leading-6 text-white/55">Assessment outcomes should distinguish supported, contradicted, and insufficient-evidence claims. Missing evidence is not proof of misconduct.</p>
            </aside>
          </div>
          <section className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-5" aria-labelledby="dataset-heading">
            <h2 id="dataset-heading" className="text-lg text-[#e6d6b2]">Dataset integration · Next phase</h2>
            <p className="mt-2 text-sm leading-7 text-white/65">The Indian startups dataset by ashishraut64 on Kaggle is the planned starting point for startup discovery and profile comparison. Dataset import and database integration are not included in this frontend update. Company profiles alone do not independently verify document claims or establish market size.</p>
            <a href="https://www.kaggle.com/datasets/ashishraut64/indian-startups-top-300" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-[#d8c7a1] underline underline-offset-4">View dataset source</a>
          </section>
          <footer className="flex flex-wrap justify-between gap-3 border-t border-white/10 py-5 text-xs text-white/55">
            <p>Developed by Samisha Boywar</p>
            <p>Startup Diligence Copilot · Traceable evidence, explicit uncertainty</p>
          </footer>
        </div>
      </section>
    </main>
  );
}
