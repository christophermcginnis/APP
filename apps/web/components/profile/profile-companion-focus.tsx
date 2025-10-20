import type { ProfileTask } from "@/types/profile";

type ProfileCompanionFocusProps = {
  tasks: ProfileTask[];
};

export function ProfileCompanionFocus({ tasks }: ProfileCompanionFocusProps) {
  if (!tasks.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/20 bg-white/6 px-4 py-10 text-center text-sm text-white/70">
        Companion has no queued actions.
      </div>
    );
  }

  return (
    <ul className="mt-4 space-y-3 text-sm text-white/80">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="rounded-2xl border border-white/20 bg-gradient-to-br from-indigo-500/20 via-sky-500/15 to-purple-500/10 px-4 py-3"
        >
          <p className="font-medium text-white">{task.title}</p>
          <p className="text-xs text-white/70">
            {task.status} · ETA {task.eta}
          </p>
        </li>
      ))}
    </ul>
  );
}
