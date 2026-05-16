"use client";

import { useState } from "react";

export default function NewDealPage() {
  const [form, setForm] = useState({
    startupName: "",
    website: "",
    stage: "",
    sector: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.ok) {
        setMessage(data.message);
        setForm({
          startupName: "",
          website: "",
          stage: "",
          sector: "",
        });
      } else {
        setMessage("Something went wrong");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setMessage("Request failed");
    }
  }

  return (
    <main className="min-h-screen text-[#f5f1e8]">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#c9a861]">
          New Deal
        </p>

        <h1 className="text-4xl font-semibold md:text-6xl">
          Create a startup record
        </h1>

        <p className="mt-4 max-w-2xl text-white/60">
          This form will later store startup details, website, stage, and uploaded documents.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-[28px] border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-white/70">
                Startup name
              </label>
              <input
                name="startupName"
                value={form.startupName}
                onChange={handleChange}
                type="text"
                placeholder="Northstar Labs"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/25"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">
                Website
              </label>
              <input
                name="website"
                value={form.website}
                onChange={handleChange}
                type="text"
                placeholder="https://company.com"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/25"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">
                Stage
              </label>
              <input
                name="stage"
                value={form.stage}
                onChange={handleChange}
                type="text"
                placeholder="Pre-seed / Seed"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/25"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">
                Sector
              </label>
              <input
                name="sector"
                value={form.sector}
                onChange={handleChange}
                type="text"
                placeholder="B2B SaaS"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/25"
              />
            </div>
          </div>

          <button
            type="submit"
            className="luxury-btn mt-8 rounded-full border border-[#c9a861]/40 bg-[#c9a861] px-6 py-3 text-sm font-medium text-black"
          >
            Save Deal
          </button>

          {message && (
            <p className="mt-4 text-sm text-[#d8c7a1]">{message}</p>
          )}
        </form>
      </div>
    </main>
  );
}