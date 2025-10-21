"use client";

import Image from "next/image";
import { Bell, Loader2, LogOut, Menu, User2, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useCreatorNotifications } from "@/hooks/use-creator-notifications";
import { trpc } from "@/lib/trpc/react";
import { UserSearch } from "./user-search";

const primaryLinks = [
  { href: "/dashboard", label: "Feed" },
  { href: "/dashboard/circles", label: "Circles" },
  { href: "/dashboard/companion", label: "Companion" },
  { href: "/dashboard/monetisation", label: "Monetisation" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const { user } = useCurrentUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasViewedNotifications, setHasViewedNotifications] = useState(false);
  const notificationsContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    data: notificationsData = [],
    isFetching: notificationsFetching,
    refetch: refetchNotifications
  } = useCreatorNotifications();

  const utils = trpc.useUtils();
  const {
    mutate: markNotificationsAsSeen,
    reset: resetMarkNotificationsAsSeen,
    isPending: markNotificationsAsSeenPending,
    isSuccess: markNotificationsAsSeenSuccess
  } = trpc.profile.markNotificationsAsSeen.useMutation();

  const notificationsQueryInput = useMemo(
    () =>
      user.isAuthenticated
        ? {
            userId: user.id,
            handle: user.handle ?? undefined
          }
        : undefined,
    [user.id, user.handle, user.isAuthenticated]
  );
  const notificationsHandle = notificationsQueryInput?.handle;

  const notifications = notificationsData;
  const unseenNotificationsCount = notifications.length;
  const previousNotificationsCountRef = useRef(unseenNotificationsCount);

  useEffect(() => {
    if (unseenNotificationsCount > previousNotificationsCountRef.current) {
      setHasViewedNotifications(false);
      resetMarkNotificationsAsSeen();
    }

    previousNotificationsCountRef.current = unseenNotificationsCount;
  }, [resetMarkNotificationsAsSeen, unseenNotificationsCount]);

  useEffect(() => {
    if (!notificationsOpen) {
      return;
    }

    if (notifications.length === 0) {
      return;
    }

    if (hasViewedNotifications) {
      return;
    }

    setHasViewedNotifications(true);

    if (user.isAuthenticated && !markNotificationsAsSeenPending) {
      markNotificationsAsSeen(
        notificationsHandle ? { handle: notificationsHandle } : undefined
      );
    }
  }, [
    hasViewedNotifications,
    markNotificationsAsSeen,
    markNotificationsAsSeenPending,
    notifications.length,
    notificationsOpen,
    notificationsHandle,
    user.isAuthenticated
  ]);

  useEffect(() => {
    if (notificationsOpen) {
      return;
    }

    if (!user.isAuthenticated) {
      return;
    }

    if (!hasViewedNotifications) {
      return;
    }

    if (!markNotificationsAsSeenSuccess) {
      return;
    }

    if (!notificationsQueryInput) {
      return;
    }

    if (notifications.length === 0) {
      return;
    }

    void utils.profile.notifications.invalidate(notificationsQueryInput);
  }, [
    hasViewedNotifications,
    notifications.length,
    notificationsOpen,
    notificationsQueryInput,
    markNotificationsAsSeenSuccess,
    user.isAuthenticated,
    utils
  ]);

  useEffect(() => {
    if (!notificationsOpen) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsContainerRef.current &&
        !notificationsContainerRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationsOpen]);

  const navLinks = user.isAuthenticated ? primaryLinks : [];

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/12 bg-slate-950/80 shadow-[0_12px_48px_rgba(15,23,42,0.45)] backdrop-blur-2xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 via-sky-400 to-emerald-400 text-xs font-bold text-slate-900">
            CC
          </span>
          CircleCast
        </Link>

        <div className="flex flex-1 items-center justify-center gap-6 min-w-0">
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-200 md:flex">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || (pathname?.startsWith(link.href) ?? false);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition ${
                    isActive ? "text-white" : "text-slate-300 hover:text-white/80"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <UserSearch />
        </div>

        <div className="flex items-center gap-3">
          {user.isAuthenticated ? (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="hidden items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-white/40 hover:bg-white/10 sm:inline-flex"
            >
              <LogOut className="h-3 w-3" />
              Sign out
            </button>
          ) : (
            <>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-white/40 hover:bg-white/10 sm:inline-flex"
              >
                Start free
              </Link>
              <Link
                href="/sign-in"
                className="hidden rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 px-4 py-2 text-xs font-semibold text-slate-900 transition hover:brightness-105 sm:inline-flex"
              >
                Sign in
              </Link>
            </>
          )}

          {user.isAuthenticated ? (
            <div className="relative" ref={notificationsContainerRef}>
              <button
                type="button"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-white/40 hover:bg-white/10"
                onClick={() => {
                  const willOpen = !notificationsOpen;

                  if (willOpen && notifications.length === 0) {
                    void refetchNotifications();
                  }

                  setNotificationsOpen(willOpen);
                }}
                aria-label={
                  notifications.length
                    ? `Open notifications (${notifications.length})`
                    : "Open notifications"
                }
                aria-expanded={notificationsOpen}
              >
                <Bell className="h-4 w-4" aria-hidden />
                {notifications.length > 0 && !hasViewedNotifications ? (
                  <span className="absolute right-2 top-2 inline-flex h-2.5 w-2.5 rounded-full bg-rose-400 ring-2 ring-slate-950" />
                ) : null}
              </button>

              {notificationsOpen ? (
                <div className="absolute right-0 top-12 w-72 rounded-3xl border border-white/15 bg-slate-950/95 p-4 shadow-xl backdrop-blur">
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span className="font-semibold uppercase tracking-[0.2em] text-white/60">
                      Alerts
                    </span>
                    {notificationsFetching ? (
                      <span className="inline-flex items-center gap-1 text-white/70">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Syncing
                      </span>
                    ) : null}
                  </div>

                  {notifications.length === 0 ? (
                    <p className="mt-3 text-sm text-white/70">
                      You&apos;re all caught up. New followers will appear here.
                    </p>
                  ) : (
                    <ul className="mt-3 space-y-2">
                      {notifications.map((notification) => (
                        <li
                          key={notification.id}
                          className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/80"
                        >
                          <div className="font-semibold text-white">
                            {notification.follower.name}
                          </div>
                          <div className="mt-1 flex items-center justify-between text-xs text-white/70">
                            <span>followed you</span>
                            {notification.follower.handle ? (
                              <Link
                                href={`/creator/${notification.follower.handle}`}
                                className="font-semibold text-white/80 transition hover:text-white hover:underline"
                              >
                                View profile
                              </Link>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : null}
            </div>
          ) : null}

          <Link
            href={user.isAuthenticated ? "/profile" : "/signup"}
            className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10 text-white transition hover:border-white/40 hover:bg-white/20"
            onClick={closeMobileMenu}
          >
            <span className="sr-only">
              {user.isAuthenticated ? "Open profile" : "Join CircleCast"}
            </span>
            {user.avatarUrl && user.isAuthenticated ? (
              <Image
                src={user.avatarUrl}
                alt={`${user.name} avatar`}
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            ) : (
              <User2 className="h-4 w-4" aria-hidden />
            )}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-white/40 hover:bg-white/10 md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/12 bg-slate-950/95 md:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-4 text-sm font-medium text-slate-200">
            <UserSearch variant="mobile" onResultSelected={closeMobileMenu} />

            <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || (pathname?.startsWith(link.href) ?? false);
              return (
                <Link
                  key={`mobile-${link.href}`}
                  href={link.href}
                  className={`rounded-2xl px-3 py-3 transition ${
                    isActive ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              );
            })}
            {user.isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  closeMobileMenu();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 px-3 py-3 text-xs font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
              >
                <LogOut className="h-3 w-3" />
                Sign out
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/signup"
                  className="rounded-2xl border border-white/25 px-3 py-3 text-center text-xs font-semibold text-white transition hover:bg-white/10 hover:text-white"
                  onClick={closeMobileMenu}
                >
                  Start free
                </Link>
                <Link
                  href="/sign-in"
                  className="rounded-2xl bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 px-3 py-3 text-center text-xs font-semibold text-slate-900 transition hover:brightness-110"
                  onClick={closeMobileMenu}
                >
                  Sign in
                </Link>
              </div>
            )}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
