import type { ProfileStat } from "@/types/profile";

type ProfileStatsProps = {
  stats: ProfileStat[];
};

export function ProfileStats({ stats }: ProfileStatsProps) {
  if (!stats.length) {
    return null;
  }

  return (
    <dl className="mt-4 grid grid-cols-2 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-white/15 bg-white/8 px-4 py-3"
        >
          <dt className="text-xs uppercase tracking-wide text-white/60">{stat.label}</dt>
          <dd className="mt-2 text-xl font-semibold text-white">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
