"use client";

import { useState } from "react";

type FormState = {
  startupName: string;
  website: string;
  stage: string;
  sector: string;
};

type MessageType = "success" | "error" | null;

export default function NewDealPage() {
  const [form, setForm] = useState<FormState>({
    startupName: "",
    website: "",
    stage: "",
    sector: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    setTouched({ ...touched, [e.target.name]: true });
  }

  function isFieldEmpty(field: keyof FormState) {
    return touched[field] && !form[field].trim();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setMessageType(null);

    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.ok) {
        setMessage(data.message || "Deal saved successfully.");
        setMessageType("success");
        setForm({ startupName: "", website: "", stage: "", sector: "" });
        setTouched({});
      } else {
        setMessage("Something went wrong. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setMessage("Request failed. Check your connection.");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  const fields: { name: keyof FormState; label: string; placeholder: string }[] = [
    { name: "startupName", label: "Startup name", placeholder: "Northstar Labs" },
    { name: "website", label: "Website", placeholder: "https://company.com" },
    { name: "stage", label: "Stage", placeholder: "Pre-seed / Seed" },
    { name: "sector", label: "Sector", placeholder: "B2B SaaS" },
  ];

  return (
    <main className="relative min-h-screen text-[#f5f1e8]">
      <div className="relative">
        {/* Header — compact */}
        <div className="mb-10">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.5em] text-[#c9a861]">
            New Deal
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Create a startup record
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/50">
            Store startup information, fundraising stage, sector details, and prepare
            the company profile for diligence workflows.
          </p>
        </div>

        {/* Form card */}
        <div className="overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03] shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c9a861]/50 to-transparent" />

          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              {fields.map(({ name, label, placeholder }) => (
                <div key={name} className="space-y-2">
                  <label className="flex items-center justify-between text-xs font-medium text-white/60">
                    <span>{label}</span>
                    {isFieldEmpty(name) && (
                      <span className="text-red-400/80">Required</span>
                    )}
                  </label>
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    placeholder={placeholder}
                    required
                    className={`w-full rounded-xl border bg-black/25 px-4 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/20
                      ${isFieldEmpty(name)
                        ? "border-red-500/30 focus:border-red-400/50 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]"
                        : "border-white/10 focus:border-[#c9a861]/45 focus:bg-black/35 focus:shadow-[0_0_0_3px_rgba(201,168,97,0.07)]"
                      }`}
                  />
                </div>
              ))}
            </div>

            {/* Bottom row */}
            <div className="mt-7 flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-xs leading-5 text-white/35">
                Submitted records can be connected to diligence reports, financial
                uploads, AI analysis, and investor workflows.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative shrink-0 overflow-hidden rounded-full border border-[#c9a861]/40 bg-[#c9a861] px-7 py-3 text-sm font-semibold tracking-wide text-black transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(201,168,97,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <svg
                        className="h-3.5 w-3.5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Saving…
                    </>
                  ) : (
                    "Save Deal"
                  )}
                </span>
                <div className="absolute inset-0 translate-y-full bg-white/15 transition-transform duration-300 group-hover:translate-y-0" />
              </button>
            </div>

            {/* Status message */}
            {message && (
              <div
                className={`mt-5 rounded-xl border px-4 py-3 text-sm backdrop-blur-sm
                  ${messageType === "success"
                    ? "border-[#c9a861]/20 bg-[#c9a861]/8 text-[#e7d4aa]"
                    : "border-red-500/20 bg-red-500/8 text-red-300"
                  }`}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}