"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { trpc } from "@/lib/trpc/react";

export function useCreatorNotifications() {
  const { user } = useCurrentUser();

  const input = user.isAuthenticated
    ? {
        userId: user.id,
        handle: user.handle ?? undefined
      }
    : undefined;

  const shouldFetchNotifications = user.isAuthenticated;

  return trpc.profile.notifications.useQuery(input, {
    enabled: shouldFetchNotifications,
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: shouldFetchNotifications ? 5_000 : false,
    refetchIntervalInBackground: true,
    staleTime: 0,
    placeholderData: []
  });
}
