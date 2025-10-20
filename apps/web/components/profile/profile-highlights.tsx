import type { ProfileHighlight } from "@/types/profile";

type ProfileHighlightsProps = {
  highlights: ProfileHighlight[];
};

export function ProfileHighlights({ highlights }: ProfileHighlightsProps) {
  if (!highlights.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/20 bg-white/6 px-4 py-10 text-center text-sm text-white/60">
        No highlights published yet. Promote a session to generate clips.
      </div>
    );
  }

  return (
    <ul className="mt-4 space-y-4 text-sm text-white/70">
      {highlights.map((highlight) => (
        <li
          key={highlight.id}
          className="rounded-2xl border border-white/15 bg-white/8 p-4"
        >
          {highlight.circle ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
              {highlight.circle}
            </p>
          ) : null}
          <p className="mt-2 text-sm font-semibold text-white">{highlight.title}</p>
          <p className="mt-1 text-xs text-white/60">{highlight.description}</p>
        </li>
      ))}
    </ul>
  );
}
