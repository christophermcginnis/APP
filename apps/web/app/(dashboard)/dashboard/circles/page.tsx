"use client";

import type { Circle } from "@circlecast/core";
import { BadgeCheck, Loader2, Mic, Users } from "lucide-react";
import { useMemo } from "react";
import { useCircles } from "@/hooks/use-circles";
import { useCurrentUser } from "@/hooks/use-current-user";

type CircleRow = Circle & { statusLabel: string };

function getStatusLabel(circle: Circle) {
  switch (circle.access) {
    case "open":
      return "Live now";
    case "waitlist":
      return "Applications open";
    case "premium":
      return "Premium tier";
    default:
      return "Active";
  }
}

export default function CirclesPage() {
  const { user } = useCurrentUser();
  const ownerId = user.isAuthenticated ? user.id : undefined;

  const { data, isLoading, isError, error, refetch, isFetching } = useCircles(ownerId);

  const circles: CircleRow[] = useMemo(() => {
    if (!data?.circles) return [];
    return data.circles.map((circle) => ({
      ...circle,
      statusLabel: getStatusLabel(circle)
    }));
  }, [data?.circles]);

  return (
    <section className="space-y-6 text-white">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-white">Circles</h1>
        <p className="text-sm text-white/70">
          Manage membership, session cadence, and AI companion roles for each
          circle.
        </p>
      </header>

      <div className="rounded-4xl border border-white/10 bg-white/6 shadow-[0_12px_35px_rgba(15,23,42,0.3)]">
        {isLoading ? (
          <div className="flex items-center justify-center gap-3 px-6 py-16 text-sm text-white/70">
            <Loader2 className="h-4 w-4 animate-spin" /> Fetching circles...
          </div>
        ) : isError ? (
          <div className="space-y-2 px-6 py-10 text-sm text-white/70">
            <p>Unable to load circles right now.</p>
            <p className="text-xs text-white/50">
              {error?.message ?? "An unexpected error occurred."}
            </p>
            <button
              onClick={() => refetch()}
              className="rounded-full border border-white/25 px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              Try again
            </button>
          </div>
        ) : (
          <table className="w-full table-fixed">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-white/60">
                <th className="px-6 py-4">Circle</th>
                <th className="px-6 py-4">Members</th>
                <th className="px-6 py-4">Cadence</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {circles.map((circle) => (
                <tr
                  key={circle.id}
                  className="border-t border-white/10 text-sm text-white/70"
                >
                  <td className="px-6 py-4 font-medium text-white">
                    {circle.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2">
                      <Users size={16} />
                      <span className="text-white/70">{circle.members}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/70">{circle.cadence}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                      <Mic size={14} />
                      {circle.statusLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10 hover:text-white">
                      <BadgeCheck size={14} />
                      Companion brief
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {isFetching && !isLoading ? (
        <p className="text-xs text-white/60">Refreshing latest data…</p>
      ) : null}
    </section>
  );
}
