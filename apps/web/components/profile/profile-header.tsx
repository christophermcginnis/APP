"use client";

import Image from "next/image";
import type { ReactNode } from "react";

type ProfileHeaderProps = {
  name: string;
  handle?: string;
  headline: string;
  avatarUrl?: string;
  location?: string;
  availability?: string;
  expertise?: string[];
  actions?: ReactNode;
  birthdate?: string;
  showBirthdate?: boolean;
};

export function ProfileHeader({
  name,
  handle,
  headline,
  avatarUrl,
  location,
  availability,
  expertise = [],
  birthdate,
  showBirthdate = false,
  actions
}: ProfileHeaderProps) {
  const birthdateLabel =
    showBirthdate && birthdate
      ? new Date(birthdate).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric"
        })
      : null;

  return (
    <header className="flex flex-col gap-6 rounded-4xl border border-white/10 bg-white/6 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.35)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border border-white/20 bg-white/15">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={`${name} avatar`}
                fill
                className="object-cover"
                sizes="64px"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
                {name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-white">{name}</h1>
            {handle ? <p className="text-sm text-white/60">@{handle}</p> : null}
          </div>
        </div>

        {actions ? <div className="flex flex-wrap gap-3 text-white">{actions}</div> : null}
      </div>

      <p className="text-sm text-white/70">{headline}</p>

      <div className="flex flex-wrap gap-3 text-xs text-white/60">
        {location ? (
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">
            {location}
          </span>
        ) : null}
        {availability ? (
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">
            {availability}
          </span>
        ) : null}
        {expertise.map((area) => (
          <span
            key={area}
            className="rounded-full border border-white/20 bg-white/8 px-3 py-1 text-white/70"
          >
            {area}
          </span>
        ))}
        {showBirthdate && birthdateLabel ? (
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">
            Born {birthdateLabel}
          </span>
        ) : null}
      </div>
    </header>
  );
}
