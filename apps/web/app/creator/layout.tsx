import type { ReactNode } from "react";

export default function CreatorLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_55%),linear-gradient(180deg,_rgba(15,23,42,1)_0%,_rgba(30,41,59,1)_35%,_rgba(15,23,42,1)_100%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-5xl px-4 pb-16 pt-16 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
