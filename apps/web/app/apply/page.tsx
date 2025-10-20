"use client";

import { useState } from "react";

const segments = [
  "Educators & cohort leaders",
  "Creator collectives",
  "Startup masterminds",
  "Skill-share communities"
];

export default function ApplyPage() {
  const [selected, setSelected] = useState<string | null>(segments[0]);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      alert("CircleCast team will reach out to set up onboarding.");
    }, 500);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold text-slate-900">
        Apply for creator access
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        First cohort partners get lifetime CircleBoost credits and priority
        features.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-8">
        <fieldset>
          <legend className="text-sm font-medium text-slate-700">
            What type of community are you building?
          </legend>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {segments.map((segment) => (
              <button
                type="button"
                key={segment}
                onClick={() => setSelected(segment)}
                className={`rounded-3xl border px-4 py-4 text-left text-sm font-medium transition ${
                  selected === segment
                    ? "border-brand-300 bg-brand-50 text-brand-700 shadow-md"
                    : "border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:text-brand-600"
                }`}
              >
                {segment}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Community description
          </span>
          <textarea
            required
            rows={5}
            className="mt-2 w-full rounded-3xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-brand-400 focus:outline-none"
            placeholder="Share your audience, topics, audience size, and current challenges."
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Contact</span>
          <input
            required
            type="email"
            className="mt-2 w-full rounded-3xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-brand-400 focus:outline-none"
            placeholder="you@studio.com"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-full bg-brand-600 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitted ? "Application sent" : "Request a cohort onboarding call"}
        </button>
      </form>
    </div>
  );
}

