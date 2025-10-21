"use client";

import { trpc } from "@/lib/trpc/react";

export function useUserSearch(query: string) {
  const trimmedQuery = query.trim();
  const enabled = trimmedQuery.length >= 2;

  return trpc.profile.search.useQuery(
    { query: trimmedQuery },
    {
      enabled,
      keepPreviousData: true,
      staleTime: 30_000,
      retry: false
    }
  );
}
