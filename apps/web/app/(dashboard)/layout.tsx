"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Feed" },
  { href: "/dashboard/circles", label: "Circles" },
  { href: "/dashboard/companion", label: "Companion" },
  { href: "/dashboard/monetisation", label: "Monetisation" },
  { href: "/profile", label: "Profile" }
];

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen bg-[linear-gradient(135deg,_rgba(15,23,42,1)_0%,_rgba(30,41,79,1)_40%,_rgba(30,64,175,0.25)_100%)] text-white md:flex">
      <aside className="sticky top-16 z-30 hidden h-[calc(100vh-4rem)] w-64 flex-col justify-between border-r border-white/10 bg-white/5 p-6 backdrop-blur-xl md:flex">
        <div className="space-y-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
              CC
            </span>
            CircleCast
          </Link>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-white/15 text-white shadow-[0_8px_24px_rgba(59,130,246,0.3)]"
                      : "text-white/70 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  {item.label}
                  {isActive ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/6 p-4 text-xs text-white/70">
          <p className="font-semibold text-white">Companion Tip</p>
          <p className="mt-2">
            Queue highlight reels after every session—your feed audience will see them first.
          </p>
        </div>
      </aside>
      <main className="flex-1 px-4 pb-16 pt-24 sm:px-6 lg:px-10">{children}</main>
    </div>
  );
}
