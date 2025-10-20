"use client";

import { trpc } from "@/lib/trpc/react";
import { profileOverviewMock } from "@/mocks/profile";

export function useProfileOverview(userId?: string) {
  return trpc.profile.overview.useQuery(
    { userId: userId! },
    {
      staleTime: 30_000,
      retry: false,
      enabled: Boolean(userId),
      placeholderData: profileOverviewMock
    }
  );
}
