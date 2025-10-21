"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useUserSearch } from "@/hooks/use-user-search";

type UserSearchProps = {
  variant?: "desktop" | "mobile";
  className?: string;
  onResultSelected?: () => void;
};

export function UserSearch({
  variant = "desktop",
  className = "",
  onResultSelected
}: UserSearchProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isFetching } = useUserSearch(query);
  const results = data ?? [];
  const trimmedQuery = query.trim();
  const hasSufficientQuery = trimmedQuery.length >= 2;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) {
        return;
      }

      if (!containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const shouldShowResults = isFocused && hasSufficientQuery;
  const helperMessage =
    isFocused && !hasSufficientQuery ? (
      <p className="mt-2 text-[11px] text-white/55">
        Enter at least two characters to find creators.
      </p>
    ) : null;

  const handleResultSelected = useCallback(() => {
    setQuery("");
    setIsFocused(false);
    onResultSelected?.();
  }, [onResultSelected]);

  const resultList = useMemo(() => {
    if (!shouldShowResults) {
      return null;
    }

    const containerClasses =
      variant === "mobile"
        ? "mt-3 space-y-1"
        : "absolute left-0 right-0 top-full mt-2 origin-top overflow-hidden rounded-2xl border border-white/12 bg-slate-950/95 p-2 shadow-[0_16px_45px_rgba(15,23,42,0.35)] backdrop-blur";

    return (
      <div className={containerClasses}>
        {isFetching ? (
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            Searching CircleCast…
          </div>
        ) : null}

        {!isFetching && results.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60">
            No creators found. Try another name or handle.
          </div>
        ) : null}

        {results.map((result) => (
          <Link
            key={result.id}
            href={`/creator/${encodeURIComponent(result.handle)}`}
            onClick={handleResultSelected}
            className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-sm text-white transition hover:border-white/20 hover:bg-white/10"
          >
            <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10 text-xs font-semibold text-white/80">
              {result.avatarUrl ? (
                <Image
                  src={result.avatarUrl}
                  alt={`${result.name} avatar`}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{result.name?.charAt(0)?.toUpperCase() ?? result.handle.charAt(0).toUpperCase()}</span>
              )}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-semibold text-white">{result.name}</span>
              <span className="truncate text-xs text-white/60">@{result.handle}</span>
              {result.headline ? (
                <span className="truncate text-[11px] text-white/50">{result.headline}</span>
              ) : null}
            </span>
          </Link>
        ))}
      </div>
    );
  }, [shouldShowResults, variant, isFetching, results, handleResultSelected]);

  const wrapperClasses = [
    "relative",
    variant === "desktop" ? "hidden md:block md:w-72" : "w-full",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={containerRef} className={wrapperClasses}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search creators"
          className="h-10 w-full rounded-full border border-white/12 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-white/50 focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
        />
        {isFetching ? (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-white/60" aria-hidden />
        ) : null}
      </div>
      {resultList}
      {helperMessage}
    </div>
  );
}
