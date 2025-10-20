import type { ProfileAgendaItem } from "@/types/profile";

type ProfileAgendaProps = {
  agenda: ProfileAgendaItem[];
};

export function ProfileAgenda({ agenda }: ProfileAgendaProps) {
  if (!agenda.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/20 bg-white/6 px-4 py-10 text-center text-sm text-white/60">
        No sessions scheduled. Companion will suggest next touchpoints soon.
      </div>
    );
  }

  return (
    <ul className="mt-4 space-y-3 text-sm text-white/70">
      {agenda.map((event) => (
        <li
          key={event.id}
          className="rounded-2xl border border-white/15 bg-white/8 px-4 py-3"
        >
          <p className="font-medium text-white">{event.title}</p>
          <p className="text-xs text-white/60">{event.time}</p>
        </li>
      ))}
    </ul>
  );
}
