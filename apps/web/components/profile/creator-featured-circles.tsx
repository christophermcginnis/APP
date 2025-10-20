import type { CreatorCircleSummary } from "@/types/profile";

type CreatorFeaturedCirclesProps = {
  circles: CreatorCircleSummary[];
};

export function CreatorFeaturedCircles({ circles }: CreatorFeaturedCirclesProps) {
  if (!circles.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/20 bg-white/6 px-6 py-10 text-center text-sm text-white/60">
        No circles published yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {circles.map((circle) => (
        <article
          key={circle.id}
          className="rounded-3xl border border-white/12 bg-white/8 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.3)]"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{circle.name}</h3>
            <span className="rounded-full border border-white/25 px-3 py-1 text-xs text-white/70">
              {circle.cadence}
            </span>
          </div>
          <p className="mt-2 text-xs uppercase tracking-wide text-white/60">
            {circle.theme}
          </p>
          <p className="mt-3 text-sm text-white/70">
            {circle.members} members · Companion-led programming
          </p>
          <p className="mt-4 rounded-2xl border border-white/20 bg-gradient-to-br from-indigo-500/15 via-sky-500/10 to-purple-500/10 p-4 text-xs text-white/80">
            {circle.highlight}
          </p>
          <button className="mt-4 w-full rounded-full border border-white/25 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10 hover:text-white">
            View circle details
          </button>
        </article>
      ))}
    </div>
  );
}
