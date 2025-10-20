"use client";

import { CreatorFeaturedCircles } from "@/components/profile/creator-featured-circles";
import { CreatorTestimonials } from "@/components/profile/creator-testimonials";
import { ProfileHighlights } from "@/components/profile/profile-highlights";
import { ProfileHeader } from "@/components/profile/profile-header";
import { useCreatorProfile } from "@/hooks/use-creator-profile";
import { creatorProfileMock } from "@/mocks/profile";

type CreatorProfilePageProps = {
  params: {
    handle: string;
  };
};

export default function CreatorProfilePage({ params }: CreatorProfilePageProps) {
  const decodedHandle = decodeURIComponent(params.handle ?? "");
  const { data, isLoading, isError, error, refetch, isFetching } =
    useCreatorProfile(decodedHandle);

  const profile = data ?? { ...creatorProfileMock, handle: decodedHandle };
  const errorMessage =
    error instanceof Error ? error.message : "Please try again shortly.";

  return (
    <section className="space-y-10 text-white">
      {isLoading && !data ? (
        <div className="rounded-3xl border border-white/10 bg-white/6 px-6 py-4 text-sm text-white/70">
          Loading creator profile…
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-3xl border border-amber-400/40 bg-amber-500/15 px-6 py-4 text-sm text-amber-100">
          <p className="font-semibold">We couldn&apos;t load this creator right now.</p>
          <p className="mt-1 text-xs text-amber-100/80">{errorMessage}</p>
          <button
            onClick={() => refetch()}
            className="mt-3 rounded-full border border-amber-300/60 px-3 py-1 text-xs font-semibold text-amber-100 transition hover:bg-amber-400/20"
          >
            Retry
          </button>
        </div>
      ) : null}

      <ProfileHeader
        name={`@${profile.handle}`}
        headline={profile.headline}
        actions={
          <>
            <button className="rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 px-4 py-2 text-xs font-semibold text-slate-900 transition hover:brightness-110">
              Request to join a circle
            </button>
            <button className="rounded-full border border-white/25 px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10 hover:text-white">
              Follow for updates
            </button>
          </>
        }
      />

      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-white">Featured circles</h2>
        <CreatorFeaturedCircles circles={profile.featuredCircles} />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-4xl border border-white/10 bg-white/6 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.3)]">
          <h2 className="text-lg font-semibold text-white">Highlights</h2>
          <ProfileHighlights highlights={profile.highlights} />
        </article>

        <aside className="space-y-4">
          <h2 className="text-lg font-semibold text-white">What members are saying</h2>
          <CreatorTestimonials testimonials={profile.testimonials} />
        </aside>
      </section>

      {isFetching && !isLoading ? (
        <p className="text-xs text-white/60">Refreshing creator details…</p>
      ) : null}
    </section>
  );
}
