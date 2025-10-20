"use client";

import { ProfileAgenda } from "@/components/profile/profile-agenda";
import { ProfileCircleList } from "@/components/profile/profile-circle-list";
import { ProfileCompanionFocus } from "@/components/profile/profile-companion-focus";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileHighlights } from "@/components/profile/profile-highlights";
import { ProfileFollowingGrid } from "@/components/profile/profile-following-grid";
import { ProfileStats } from "@/components/profile/profile-stats";
import { useProfileOverview } from "@/hooks/use-profile-overview";
import { useCurrentUser } from "@/hooks/use-current-user";
import { profileOverviewMock } from "@/mocks/profile";

export default function ProfilePage() {
  const { user } = useCurrentUser();
  const ownerId = user.isAuthenticated ? user.id : undefined;

  const { data, isLoading, isError, error, refetch, isFetching } = useProfileOverview(ownerId);
  const profile = data ?? profileOverviewMock;
  const errorMessage =
    error instanceof Error ? error.message : "Please try again shortly.";

  return (
    <section className="space-y-10 text-white">
      {isLoading && !data ? (
        <div className="rounded-3xl border border-white/10 bg-white/6 px-6 py-4 text-sm text-white/70">
          Loading your profile…
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-3xl border border-amber-400/40 bg-amber-500/15 px-6 py-4 text-sm text-amber-100">
          <p className="font-semibold">Live profile data is unavailable right now.</p>
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
        name={profile.name}
        handle={profile.handle}
        headline={profile.headline}
        avatarUrl={profile.avatarUrl}
        location={profile.location}
        availability={profile.availability}
        birthdate={profile.birthdate}
        showBirthdate
        expertise={profile.expertise}
        actions={
          <>
            <button className="rounded-full border border-white/25 px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10 hover:text-white">
              View public profile
            </button>
            <button className="rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 px-4 py-2 text-xs font-semibold text-slate-900 transition hover:brightness-110">
              Edit profile
            </button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="space-y-6 rounded-4xl border border-white/10 bg-white/6 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.3)]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Your circles</h2>
            <button className="rounded-full border border-white/25 px-3 py-1 text-xs font-semibold text-white/80 transition hover:bg-white/10 hover:text-white">
              Create circle
            </button>
          </div>
          <ProfileCircleList circles={profile.circles} emptyState="No circles launched yet." />
        </article>

        <aside className="space-y-6">
          <article className="rounded-4xl border border-white/12 bg-gradient-to-br from-indigo-500/20 via-sky-500/15 to-purple-500/10 p-6 shadow-[0_12px_35px_rgba(59,130,246,0.25)]">
            <h2 className="text-lg font-semibold text-white">Companion focus</h2>
            <ProfileCompanionFocus tasks={profile.companionFocus} />
          </article>

          <article className="rounded-4xl border border-white/10 bg-white/6 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.3)]">
            <h2 className="text-lg font-semibold text-white">Today&apos;s agenda</h2>
            <ProfileAgenda agenda={profile.agenda} />
          </article>
        </aside>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        <article className="rounded-4xl border border-white/10 bg-white/6 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.3)]">
          <h2 className="text-lg font-semibold text-white">Highlights</h2>
          <ProfileHighlights highlights={profile.highlights} />
        </article>

        <article className="rounded-4xl border border-white/10 bg-white/6 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.3)]">
          <h2 className="text-lg font-semibold text-white">Profile stats</h2>
          <ProfileStats stats={profile.stats} />
        </article>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Creators you follow
          </h2>
          <p className="text-xs text-white/60">
            {profile.following.length} creators
          </p>
        </div>
        <ProfileFollowingGrid creators={profile.following} />
      </section>

      {isFetching && !isLoading ? (
        <p className="text-xs text-white/60">Refreshing profile insights…</p>
      ) : null}
    </section>
  );
}
