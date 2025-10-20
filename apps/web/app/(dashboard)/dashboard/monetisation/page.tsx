"use client";

import { DollarSign, Gift, TrendingUp } from "lucide-react";

const tiers = [
  {
    name: "Community Pass",
    price: "$5/mo",
    perks: ["Live circle access", "Weekly summaries", "Companion Q&A"],
    highlight: "Best for engaged members"
  },
  {
    name: "Creator Lab",
    price: "$18/mo",
    perks: ["Premium workshops", "1:1 office hours", "Clip studio credits"],
    highlight: "High demand"
  }
];

const boosts = [
  {
    title: "CircleBoost Spotlight",
    status: "Active",
    spend: "$45",
    reach: "1.8k targeted creators"
  },
  {
    title: "Referral Amplifier",
    status: "Draft",
    spend: "$0",
    reach: "Est. 950 members"
  }
];

export default function MonetisationPage() {
  return (
    <section className="space-y-6 text-white">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-white">
          Monetisation control centre
        </h1>
        <p className="text-sm text-white/70">
          Configure subscription tiers, monitor payouts, and launch CircleBoost
          campaigns.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="rounded-3xl border border-white/12 bg-gradient-to-br from-indigo-500/20 via-sky-500/15 to-purple-500/10 p-6 shadow-[0_12px_35px_rgba(59,130,246,0.25)]">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <TrendingUp size={18} />
            Monthly revenue forecast
          </h2>
          <p className="mt-2 text-3xl font-semibold text-white">$1,250</p>
          <p className="text-sm text-white/70">
            Projected with current churn + pending CircleBoost.
          </p>
        </article>

        {tiers.map((tier) => (
          <article
            key={tier.name}
            className="rounded-3xl border border-white/10 bg-white/6 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.3)]"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                {tier.name}
              </h2>
              <span className="rounded-full border border-white/25 px-3 py-1 text-xs text-white/70">
                {tier.highlight}
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-white">
              {tier.price}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {tier.perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2">
                  <DollarSign size={14} className="text-sky-300" />
                  {perk}
                </li>
              ))}
            </ul>
            <button className="mt-6 w-full rounded-full border border-white/25 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white">
              Edit tier
            </button>
          </article>
        ))}
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/6 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.3)]">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Gift size={18} className="text-sky-300" />
          CircleBoost campaigns
        </h2>
        <p className="mt-2 text-sm text-white/70">
          Boost discovery with AI-optimised placements across the CircleCast
          network.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {boosts.map((boost) => (
            <article
              key={boost.title}
              className="rounded-2xl border border-white/12 bg-white/8 p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">
                  {boost.title}
                </h3>
                <span className="rounded-full bg-gradient-to-r from-indigo-500/40 to-sky-500/40 px-2 py-1 text-xs font-semibold text-white">
                  {boost.status}
                </span>
              </div>
              <dl className="mt-3 space-y-1 text-xs text-white/70">
                <div className="flex justify-between">
                  <dt>Spend</dt>
                  <dd>{boost.spend}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Target reach</dt>
                  <dd>{boost.reach}</dd>
                </div>
              </dl>
              <button className="mt-4 w-full rounded-full border border-white/25 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10 hover:text-white">
                Manage
              </button>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
