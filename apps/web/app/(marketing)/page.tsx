import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Gamepad2,
  Headphones,
  MessageSquareHeart,
  Mic2,
  Music,
  Palette,
  Sparkle
} from "lucide-react";

const heroStats = [
  { label: "Creators vibing weekly", value: "2.8k" },
  { label: "Clips auto-remixed", value: "63k" },
  { label: "Avg. circle retention", value: "92%" }
] as const;

const featureTracks = [
  {
    icon: Mic2,
    title: "Go live without friction",
    description:
      "Spin up voice rooms, story-driven lounges, or async listening parties. Companion handles intros, spotlights, and recaps."
  },
  {
    icon: Sparkle,
    title: "AI producer on autopilot",
    description:
      "Draft invites, craft highlight reels, surface lapsed voices, and queue tasks so your vibe never flatlines."
  },
  {
    icon: MessageSquareHeart,
    title: "Community loops that stick",
    description:
      "Launch quests, member prompts, and vibe-check polls. Feed your circle a fan-cast of the best moments every week."
  },
  {
    icon: Palette,
    title: "Monetise without feeling salesy",
    description:
      "Drop premium tiers, supporter badges, and CircleBoost campaigns. Let companion nudge the right members at the right time."
  }
] as const;

const flowMoments = [
  {
    title: "Drop your intent",
    copy:
      "Tell Companion the niche you serve and how you want members to feel. It spins up a vibe guide, tone samples, and a launch playlist."
  },
  {
    title: "Unlock curated circles",
    copy:
      "Match with 8–20 members who share your energy. Visual dashboards show sentiment, highlights, and next-step nudges."
  },
  {
    title: "Keep the feed buzzing",
    copy:
      "Companion remixes sessions into snackable clips, publishes threads, and schedules follow-ups so your community hums between meetups."
  }
] as const;

const communitySpotlights = [
  {
    title: "Indie Sound Forge",
    tag: "Audio storytellers",
    description:
      "Weekly listening labs where producers swap loops. Companion cuts highlight reels and suggests collaborator pairings.",
    image:
      "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Calm Founder Cabins",
    tag: "Mindful build clubs",
    description:
      "A retreat-style circle for founders balancing shipping with rest. Companion keeps accountability rituals light but consistent.",
    image:
      "https://images.unsplash.com/photo-1504387828636-09a0a25abf2d?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Narrative Arcade",
    tag: "Story game makers",
    description:
      "Designers playtest narrative mechanics live. Companion threads lore ideas, surfaces feedback themes, and assigns action items.",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80"
  }
] as const;

const vibePills = ["Chill but electric", "Creator-led", "Community-first", "Playful automation"];

export default function MarketingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-24 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.18),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.22),_transparent_45%),linear-gradient(180deg,_rgba(9,9,16,1)_0%,_rgba(16,24,60,0.92)_40%,_rgba(15,23,42,1)_100%)]" />

      <section className="mx-auto w-full max-w-6xl px-4 pt-28 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              <Headphones className="h-4 w-4" />
              Meet CircleCast Companion
            </span>
            <h1 className="text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
              Build a modern community feed with calm vibes, live rooms, and an AI co-host.
            </h1>
            <p className="max-w-xl text-pretty text-base text-slate-200 sm:text-lg">
              Think Discord energy with a studio-grade producer. Companion handles invitations,
              reminders, highlight reels, and vibe checks while you focus on hosting moments members
              can&apos;t stop sharing.
            </p>

            <div className="flex flex-wrap gap-3">
              {vibePills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80"
                >
                  {pill}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-[0_12px_40px_rgba(99,102,241,0.35)] transition hover:brightness-105"
              >
                Join the waitlist
                <ArrowRight size={16} />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                Peek the product
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-indigo-500/60 via-sky-400/30 to-purple-500/40 blur-3xl" />
            <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(59,130,246,0.25)]">
              <Image
                src="https://images.unsplash.com/photo-1515165562835-c4c1b235f3f6?auto=format&fit=crop&w=1440&q=80"
                alt="CircleCast live room preview"
                width={900}
                height={720}
                className="h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 space-y-3 bg-gradient-to-t from-slate-950/95 via-slate-900/60 to-transparent p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">
                  Live circle
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Narrative Arcade · Session 12</h2>
                    <p className="text-xs text-slate-300">
                      Companion clipped 5 highlights · 23 members tuned in
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                    <Gamepad2 className="h-3 w-3" />
                    Now playing
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {heroStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/80"
            >
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="features"
        className="mx-auto mt-24 w-full max-w-6xl rounded-[36px] border border-white/10 bg-white/5 px-4 py-16 shadow-[0_20px_80px_rgba(15,23,42,0.45)] sm:px-6 lg:px-10"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              Why creators switch
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
              Feed meets studio, powered by Companion.
            </h2>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            See feed preview
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {featureTracks.map((feature) => (
            <article
              key={feature.title}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/8 p-6 transition hover:border-white/30 hover:bg-white/12"
            >
              <span className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 transition group-hover:opacity-100" />
              <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="relative mt-6 text-xl font-semibold text-white">{feature.title}</h3>
              <p className="relative mt-3 text-sm leading-6 text-white/70">{feature.description}</p>
              <button className="relative mt-4 inline-flex items-center gap-2 text-xs font-semibold text-white/70 transition hover:text-white">
                Learn how it works
                <ArrowRight size={14} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8 lg:flex-row">
        <div className="w-full space-y-6 rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8 lg:max-w-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
            Your launch flow
          </p>
          <h3 className="text-2xl font-semibold text-white">
            Companion keeps the runway fun. You keep the mic steady.
          </h3>
          <p className="text-sm text-white/70">
            From onboarding new members to surfacing highlights, every step is visual,
            collaborative, and ready to remix like your favourite social feeds.
          </p>
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Book a vibe check
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid flex-1 gap-4">
          {flowMoments.map((moment, index) => (
            <article
              key={moment.title}
              className="rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.25)] transition hover:border-white/25 hover:bg-white/12"
            >
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white">
                  0{index + 1}
                </span>
                Stage
              </div>
              <h4 className="mt-4 text-lg font-semibold text-white">{moment.title}</h4>
              <p className="mt-2 text-sm text-white/70">{moment.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              CircleCast creators
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
              Spotlight sessions lighting up the feed.
            </h2>
          </div>
          <Link
            href="/creator/hazel-quinn"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Browse creator profiles
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {communitySpotlights.map((spotlight) => (
            <article
              key={spotlight.title}
              className="overflow-hidden rounded-[30px] border border-white/10 bg-white/6 shadow-[0_16px_50px_rgba(15,23,42,0.3)] transition hover:border-white/30 hover:bg-white/12"
            >
              <div className="relative h-52 w-full">
                <Image
                  src={spotlight.image}
                  alt={spotlight.title}
                  fill
                  className="object-cover"
                />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                  <Music className="h-3 w-3" />
                  {spotlight.tag}
                </span>
              </div>
              <div className="space-y-3 px-5 pb-6 pt-5">
                <h3 className="text-lg font-semibold text-white">{spotlight.title}</h3>
                <p className="text-sm text-white/70">{spotlight.description}</p>
                <Link
                  href="/dashboard/companion"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-white/70 transition hover:text-white"
                >
                  See their toolkit
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 w-full max-w-6xl rounded-[36px] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 px-4 py-16 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              Ready when you are
            </p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Secure your companion seat and start shipping unforgettable sessions.
            </h2>
            <p className="text-sm text-white/70">
              Founders who join CircleCast Alpha get onboarding support, premium credits, and a
              private creator lounge to swap playbooks.
            </p>
          </div>
          <div className="flex flex-col gap-3 text-sm text-white/80">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Claim your invite
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/apply"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              Talk with the team
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="mx-auto mt-16 w-full max-w-6xl px-4 text-xs text-white/60 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 rounded-[28px] border border-white/10 bg-white/6 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
              CC
            </span>
            CircleCast · Build calmer communities
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-white/60">
            <Link href="/dashboard" className="hover:text-white">
              Product
            </Link>
            <Link href="/apply" className="hover:text-white">
              Apply
            </Link>
            <Link href="/signup" className="hover:text-white">
              Waitlist
            </Link>
            <span>© {new Date().getFullYear()} CircleCast Labs</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
