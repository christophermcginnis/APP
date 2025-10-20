import type { ProfileCircleSummary } from "@/types/profile";

type ProfileCircleListProps = {
  circles: ProfileCircleSummary[];
  emptyState?: string;
};

export function ProfileCircleList({ circles, emptyState }: ProfileCircleListProps) {
  if (!circles.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/20 bg-white/6 px-4 py-10 text-center text-sm text-white/60">
        {emptyState ?? "No circles to show yet."}
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {circles.map((circle) => (
        <li key={circle.id} className="rounded-2xl border border-white/15 bg-white/8 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">{circle.name}</p>
              <p className="text-xs text-white/60">
                {circle.cadence} · {circle.members} members
              </p>
            </div>
            <span className="text-xs font-medium text-white/70">{circle.status}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
