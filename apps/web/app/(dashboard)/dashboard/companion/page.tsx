"use client";

import type { CompanionTask } from "@circlecast/core";
import { Loader2, Sparkles, TimerReset } from "lucide-react";
import { useMemo } from "react";
import { useCompanionTasks } from "@/hooks/use-companion-tasks";
import { useCircles } from "@/hooks/use-circles";
import { useCurrentUser } from "@/hooks/use-current-user";

type CompanionTaskCard = CompanionTask & {
  circleName: string;
  insight?: string;
};

function formatEta(minutes: number) {
  if (minutes <= 0) return "now";
  return `${minutes} min`;
}

const fallbackCopy: Record<CompanionTask["kind"], string> = {
  summary:
    "Review the session summary and adjust the tone before sending to members.",
  clip: "Preview generated highlights and pick the best moments to publish.",
  invites:
    "Check outreach suggestions before the companion contacts prospective members.",
  quiz: "Validate assessment questions before they are delivered to the circle."
};

export default function CompanionPage() {
  const { user } = useCurrentUser();
  const ownerId = user.isAuthenticated ? user.id : undefined;

  const { data: circleData } = useCircles(ownerId);
  const {
    data: tasksData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useCompanionTasks(ownerId);

  const circleMap = useMemo(() => {
    return new Map(circleData?.circles.map((circle) => [circle.id, circle.name]));
  }, [circleData?.circles]);

  const tasks: CompanionTaskCard[] = useMemo(() => {
    if (!tasksData?.tasks) return [];

    return tasksData.tasks.map((task) => ({
      ...task,
      circleName: circleMap.get(task.circleId) ?? "Untitled circle",
      insight:
        typeof task.payload?.insight === "string"
          ? task.payload.insight
          : fallbackCopy[task.kind]
    }));
  }, [tasksData?.tasks, circleMap]);

  return (
    <section className="space-y-6 text-white">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-white">
          Circle companion studio
        </h1>
        <p className="text-sm text-white/70">
          Review automated outputs, fine-tune prompts, and keep your AI producer
          aligned with community tone.
        </p>
      </header>

      {isLoading ? (
        <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/6 px-6 py-16 text-sm text-white/70">
          <Loader2 className="h-4 w-4 animate-spin" />
          Syncing with your companion tasks...
        </div>
      ) : isError ? (
        <div className="space-y-2 rounded-3xl border border-white/10 bg-white/6 px-6 py-10 text-sm text-white/70">
          <p>We couldn&apos;t reach the companion service.</p>
          <p className="text-xs text-white/50">
            {error?.message ?? "An unexpected error occurred."}
          </p>
          <button
            onClick={() => refetch()}
            className="rounded-full border border-white/25 px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {tasks.map((task) => (
            <article
              key={task.id}
              className="rounded-3xl border border-white/12 bg-gradient-to-br from-indigo-500/20 via-sky-500/15 to-purple-500/10 p-6 shadow-[0_12px_35px_rgba(59,130,246,0.25)]"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                  <Sparkles size={14} />
                  {task.status.replace("_", " ")}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-white/70">
                  <TimerReset size={12} />
                  {formatEta(task.etaMinutes)}
                </span>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-white">
                {task.title}
              </h2>
              <p className="text-sm text-white/70">{task.circleName}</p>
              <p className="mt-4 text-sm text-white/70">{task.insight}</p>
              <button className="mt-6 w-full rounded-full border border-white/25 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white">
                Review output
              </button>
            </article>
          ))}
          {tasks.length === 0 ? (
            <article className="rounded-3xl border border-dashed border-white/20 bg-white/6 p-6 text-sm text-white/60">
              No active tasks yet. Once sessions run, the companion will queue
              summaries, clips, and outreach suggestions here.
            </article>
          ) : null}
        </div>
      )}

      {isFetching && !isLoading ? (
        <p className="text-xs text-white/60">Updating companion activity…</p>
      ) : null}
    </section>
  );
}
