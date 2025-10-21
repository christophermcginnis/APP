"use client";

import type { CreatorSummary } from "@circlecast/core";
import { Bell, Loader2, Mic, Sparkles, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { ProfileHighlights } from "@/components/profile/profile-highlights";
import { ProfileStats } from "@/components/profile/profile-stats";
import { useCompanionTasks } from "@/hooks/use-companion-tasks";
import { useCircles } from "@/hooks/use-circles";
import { useCreatorNotifications } from "@/hooks/use-creator-notifications";
import { useFollowingCreators } from "@/hooks/use-following-creators";
import { useProfileOverview } from "@/hooks/use-profile-overview";
import { useCurrentUser } from "@/hooks/use-current-user";
import { profileOverviewMock } from "@/mocks/profile";

type FeedItem =
  | {
      type: "task";
      id: string;
      title: string;
      status: string;
      eta: number;
      circleName: string;
      insight: string;
    }
  | {
      type: "session";
      id: string;
      circleName: string;
      cadence: string;
      members: number;
      focusArea: string;
    };

function formatMinutes(minutes: number) {
  if (minutes <= 0) return "Ready";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining ? `${hours}h ${remaining}m` : `${hours}h`;
}

export default function DashboardFeedPage() {
  const { user } = useCurrentUser();
  const ownerId = user.isAuthenticated ? user.id : undefined;

  const {
    data: profileData,
    isFetching: profileFetching,
    isError: profileError,
    error: profileErrorObj,
    refetch: refetchProfile
  } = useProfileOverview(ownerId);

  const {
    data: circlesData,
    isLoading: circlesLoading,
    isError: circlesError,
    error: circlesErrorObj,
    refetch: refetchCircles,
    isFetching: circlesFetching
  } = useCircles(ownerId);

  const {
    data: tasksData,
    isLoading: tasksLoading,
    isError: tasksError,
    error: tasksErrorObj,
    refetch: refetchTasks,
    isFetching: tasksFetching
  } = useCompanionTasks(ownerId);

  const {
    data: followingData,
    isFetching: followingFetching,
    isError: followingError,
    error: followingErrorObj,
    refetch: refetchFollowing
  } = useFollowingCreators();
  const {
    data: notificationsData = [],
    isFetching: notificationsFetching
  } = useCreatorNotifications();

  const profile = profileData ?? profileOverviewMock;
  const circles = circlesData?.circles ?? [];
  const tasks = tasksData?.tasks ?? [];
  const following: CreatorSummary[] = followingData ?? profile.following;
  const notifications = notificationsData;

  const feedItems = useMemo<FeedItem[]>(() => {
    const taskEntries = tasks.map((task) => ({
      type: "task" as const,
      id: task.id,
      title: task.title,
      status: task.status.replace("_", " "),
      eta: task.etaMinutes,
      circleName: circles.find((circle) => circle.id === task.circleId)?.name ?? "Circle",
      insight:
        typeof task.payload?.insight === "string"
          ? task.payload.insight
          : "Companion is preparing a new deliverable."
    }));

    const sessionEntries = circles.slice(0, 4).map((circle) => ({
      type: "session" as const,
      id: circle.id,
      circleName: circle.name,
      cadence: circle.cadence,
      members: circle.members,
      focusArea: circle.focusArea
    }));

    return [...taskEntries, ...sessionEntries];
  }, [tasks, circles]);

  const stats = profile.stats;
  const highlights = profile.highlights;

  const profileErrorMessage =
    profileErrorObj instanceof Error ? profileErrorObj.message : "Unable to load profile.";

  const circlesErrorMessage =
    circlesErrorObj instanceof Error
      ? circlesErrorObj.message
      : "Unable to load circles right now.";

  const tasksErrorMessage =
    tasksErrorObj instanceof Error
      ? tasksErrorObj.message
      : "Unable to sync with the companion service.";

  const followingErrorMessage =
    followingErrorObj instanceof Error
      ? followingErrorObj.message
      : "Unable to load followed creators.";

  return (
    <section className="space-y-10 text-white">
      <header className="rounded-4xl border border-white/10 bg-white/6 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Creator feed</p>
        <h1 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
          Welcome back, {profile.name.split(" ")[0]}.
        </h1>
        <p className="mt-2 text-sm text-white/70">
          Your AI companion prepped updates, surfaced member activity, and queued sessions
          to keep circles active.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/60">
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
            @{profile.handle}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/70">
          <Link
            href="/profile"
            className="rounded-full border border-white/30 px-4 py-2 font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            View my profile
          </Link>
          <Link
            href="/dashboard/companion"
            className="rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 px-4 py-2 font-semibold text-slate-900 transition hover:brightness-110"
          >
            Open companion studio
          </Link>
        </div>
      </header>

      {profileError ? (
        <div className="rounded-3xl border border-amber-400/40 bg-amber-500/15 px-6 py-4 text-sm text-amber-100">
          <p className="font-semibold">Profile data is currently unavailable.</p>
          <p className="mt-1 text-xs text-amber-200/80">{profileErrorMessage}</p>
          <button
            onClick={() => refetchProfile()}
            className="mt-3 rounded-full border border-amber-300/60 px-3 py-1 text-xs font-semibold text-amber-100 transition hover:bg-amber-400/20"
          >
            Retry
          </button>
        </div>
      ) : null}

      {notifications.length ? (
        <section className="rounded-4xl border border-white/10 bg-gradient-to-br from-indigo-500/25 via-sky-500/15 to-emerald-500/10 p-6 shadow-[0_18px_60px_rgba(59,130,246,0.35)]">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
              <Bell className="h-4 w-4" />
              Notifications
            </h2>
            {notificationsFetching ? (
              <span className="inline-flex items-center gap-2 text-xs text-white/70">
                <Loader2 className="h-3 w-3 animate-spin" />
                Updating
              </span>
            ) : null}
          </div>

          <ul className="mt-4 space-y-3 text-sm text-white/80">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className="flex items-center justify-between rounded-3xl border border-white/15 bg-white/10 px-4 py-3"
              >
                <div>
                  <span className="font-semibold text-white">{notification.follower.name}</span>{" "}
                  has followed you.
                </div>
                {notification.follower.handle ? (
                  <Link
                    href={`/creator/${notification.follower.handle}`}
                    className="text-xs font-semibold text-white/80 hover:text-white hover:underline"
                  >
                    View profile
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <section className="rounded-4xl border border-white/10 bg-white/6 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.35)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">What&apos;s happening</h2>
              {tasksFetching || circlesFetching || profileFetching ? (
                <span className="inline-flex items-center gap-2 text-xs text-white/60">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Updating…
                </span>
              ) : null}
            </div>

            {tasksLoading && !tasks.length && circlesLoading && !circles.length ? (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-12 text-sm text-white/70">
                <Loader2 className="h-4 w-4 animate-spin" />
                Gathering companion and circle activity…
              </div>
            ) : null}

            {tasksError && !tasks.length ? (
              <div className="mt-6 rounded-2xl border border-amber-400/40 bg-amber-500/15 px-4 py-4 text-xs text-amber-100">
                <p className="font-semibold">Companion data unavailable.</p>
                <p className="mt-1 text-amber-100/80">{tasksErrorMessage}</p>
                <button
                  onClick={() => refetchTasks()}
                  className="mt-2 rounded-full border border-amber-300/60 px-3 py-1 font-semibold text-amber-50 transition hover:bg-amber-400/20"
                >
                  Retry
                </button>
              </div>
            ) : null}

            {circlesError && !circles.length ? (
              <div className="mt-6 rounded-2xl border border-amber-400/40 bg-amber-500/15 px-4 py-4 text-xs text-amber-100">
                <p className="font-semibold">Circle updates unavailable.</p>
                <p className="mt-1 text-amber-100/80">{circlesErrorMessage}</p>
                <button
                  onClick={() => refetchCircles()}
                  className="mt-2 rounded-full border border-amber-300/60 px-3 py-1 font-semibold text-amber-50 transition hover:bg-amber-400/20"
                >
                  Retry
                </button>
              </div>
            ) : null}

            <div className="mt-6 space-y-4">
              {feedItems.map((item) =>
                item.type === "task" ? (
                  <article
                    key={`task-${item.id}`}
                    className="rounded-3xl border border-white/12 bg-gradient-to-br from-indigo-500/20 via-sky-500/15 to-purple-500/10 p-5 shadow-[0_12px_35px_rgba(59,130,246,0.25)]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-xs font-semibold text-white/80">
                        <Sparkles size={14} />
                        Companion task · {item.status}
                      </span>
                      <span className="text-xs text-white/70">
                        ETA {formatMinutes(item.eta)}
                      </span>
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-white/70">{item.circleName}</p>
                    <p className="mt-3 text-sm text-white/70">{item.insight}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href="/dashboard/companion"
                        className="rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/15"
                      >
                        Review output
                      </Link>
                      <button className="rounded-full border border-transparent px-3 py-1 text-xs font-semibold text-white/70 hover:text-white hover:underline">
                        Snooze
                      </button>
                    </div>
                  </article>
                ) : (
                  <article
                    key={`session-${item.id}`}
                    className="rounded-3xl border border-white/10 bg-white/6 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.3)]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-xs font-semibold text-white/70">
                        <Mic size={14} />
                        Upcoming session
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                        {item.cadence}
                      </span>
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-white">
                      {item.circleName}
                    </h3>
                    <p className="text-sm text-white/70">
                      Focus: {item.focusArea || "Member alignment"}
                    </p>
                    <p className="mt-3 inline-flex items-center gap-2 text-xs text-white/60">
                      <Users size={14} />
                      {item.members} members expected
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button className="rounded-full border border-white/25 px-3 py-1 text-xs font-semibold text-white/80 transition hover:bg-white/10 hover:text-white">
                        Open circle room
                      </button>
                      <button className="rounded-full border border-transparent px-3 py-1 text-xs font-semibold text-white/70 hover:text-white hover:underline">
                        Share update
                      </button>
                    </div>
                  </article>
                )
              )}
              {!feedItems.length && !tasksLoading && !circlesLoading ? (
                <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 py-12 text-center text-sm text-white/60">
                  Once your circles are running, live sessions and companion outputs will
                  flow into your feed.
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-4xl border border-white/10 bg-white/6 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.3)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Circle highlights</h2>
              <Link
                href="/dashboard/circles"
                className="text-xs font-semibold text-white/70 hover:text-white hover:underline"
              >
                Manage circles
              </Link>
            </div>
            <ProfileHighlights highlights={highlights} />
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-4xl border border-white/10 bg-white/6 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.3)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Creators you follow
              </h2>
              {followingFetching ? (
                <span className="inline-flex items-center gap-2 text-xs text-white/60">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Syncing
                </span>
              ) : null}
            </div>

            {followingError ? (
              <div className="mt-3 rounded-2xl border border-amber-400/40 bg-amber-500/15 px-4 py-3 text-xs text-amber-100">
                <p className="font-semibold">Couldn&apos;t load followed creators.</p>
                <p className="mt-1 text-amber-100/80">{followingErrorMessage}</p>
                <button
                  onClick={() => refetchFollowing()}
                  className="mt-2 rounded-full border border-amber-300/60 px-3 py-1 font-semibold text-amber-50 transition hover:bg-amber-400/20"
                >
                  Retry
                </button>
              </div>
            ) : null}

            {following.length ? (
              <ul className="mt-4 space-y-3">
                {following.slice(0, 4).map((creator) => (
                  <li
                    key={`following-${creator.handle}`}
                    className="flex items-center justify-between rounded-2xl border border-white/12 bg-white/8 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/15 bg-white/10">
                        {creator.avatarUrl ? (
                          <Image
                            src={creator.avatarUrl}
                            alt={`${creator.name} avatar`}
                            fill
                            className="object-cover"
                            sizes="40px"
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
                        <p className="text-xs text-white/60">{creator.status}</p>
                      </div>
                    </div>
                    <span className="text-xs text-white/60">
                      {creator.followers.toLocaleString()} followers
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-xs text-white/60">
                Follow creators to see their activity here.
              </p>
            )}

            <Link
              href="/profile"
              className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-white/25 px-3 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              View all followed creators
            </Link>
          </section>

          <section className="rounded-4xl border border-white/10 bg-white/6 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.3)]">
            <h2 className="text-lg font-semibold text-white">Quick stats</h2>
            <ProfileStats stats={stats} />
          </section>

          <section className="rounded-4xl border border-white/12 bg-gradient-to-br from-indigo-500/20 via-sky-500/15 to-purple-500/10 p-6 shadow-[0_12px_35px_rgba(59,130,246,0.25)]">
            <h2 className="text-lg font-semibold text-white">Companion quick actions</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
                Approve highlight clips for Indie Music Circle
              </li>
              <li className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
                Invite 5 creators to Monetisation Lab premium tier
              </li>
              <li className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
                Share onboarding prompt in CircleCast Alpha
              </li>
            </ul>
          </section>

          <section className="rounded-4xl border border-white/10 bg-white/6 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.3)]">
            <h2 className="text-lg font-semibold text-white">Member momentum</h2>
            {circlesLoading && !circles.length ? (
              <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
                <Loader2 className="h-3 w-3 animate-spin" />
                Measuring engagement…
              </div>
            ) : (
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                {circles.slice(0, 3).map((circle) => (
                  <li
                    key={`momentum-${circle.id}`}
                    className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3"
                  >
                    <p className="font-semibold text-white">{circle.name}</p>
                    <p className="text-xs text-white/60">
                      {circle.members} members · {circle.cadence}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            {!circles.length && !circlesLoading ? (
              <p className="mt-4 text-xs text-white/60">
                Launch your first circle to unlock live momentum tracking.
              </p>
            ) : null}
          </section>
        </aside>
      </div>
    </section>
  );
}
