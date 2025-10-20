import Image from "next/image";
import Link from "next/link";
import type { CreatorSummary } from "@/types/profile";

type ProfileFollowingGridProps = {
  creators: CreatorSummary[];
};

export function ProfileFollowingGrid({ creators }: ProfileFollowingGridProps) {
  if (!creators.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/20 bg-white/6 px-6 py-10 text-center text-sm text-white/60">
        You&apos;re not following any creators yet. Discover new circles from your feed.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {creators.map((creator) => (
        <article
          key={creator.handle}
          className="rounded-3xl border border-white/12 bg-white/8 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.3)] transition hover:border-white/30 hover:bg-white/12"
        >
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/20 bg-white/15">
              {creator.avatarUrl ? (
                <Image
                  src={creator.avatarUrl}
                  alt={`${creator.name} avatar`}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : null}
            </div>
            <div>
              <Link
                href={`/creator/${creator.handle}`}
                className="text-sm font-semibold text-white hover:text-white/80"
              >
                {creator.name}
              </Link>
              <p className="text-xs text-white/60">{creator.headline}</p>
            </div>
          </div>

          <p className="mt-4 text-sm text-white/70">{creator.focus}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/60">
            <span className="rounded-full bg-white/10 px-3 py-1 font-semibold text-white">
              {creator.circles} circles
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 font-semibold text-white">
              {creator.followers.toLocaleString()} followers
            </span>
            <span className="rounded-full bg-indigo-500/20 px-3 py-1 font-semibold text-sky-200">
              {creator.status}
            </span>
          </div>

          <Link
            href={`/creator/${creator.handle}`}
            className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-white/25 px-3 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            View profile
          </Link>
        </article>
      ))}
    </div>
  );
}
