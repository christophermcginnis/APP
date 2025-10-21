"use client";

import { useCallback, useMemo } from "react";

import { useCurrentUser } from "@/hooks/use-current-user";
import { trpc } from "@/lib/trpc/react";

export function useCreatorNotifications() {
  const { user } = useCurrentUser();
  const utils = trpc.useContext();

  const input = useMemo(
    () =>
      user.isAuthenticated
        ? {
            userId: user.id,
            handle: user.handle ?? undefined
          }
        : undefined,
    [user.handle, user.id, user.isAuthenticated]
  );

  const queryResult = trpc.profile.notifications.useQuery(input, {
    enabled: user.isAuthenticated,
    retry: false,
    refetchOnWindowFocus: true,
    refetchInterval: 5_000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    placeholderData: () => (input ? utils.profile.notifications.getData(input) ?? [] : []),
    select: (incoming) => {
      if (!input) {
        return [];
      }

      const existing = utils.profile.notifications.getData(input) ?? [];

      if (!incoming.length) {
        return existing;
      }

      const existingIds = new Set(existing.map((notification) => notification.id));
      const newNotifications = incoming.filter((notification) => !existingIds.has(notification.id));

      if (newNotifications.length === 0) {
        return existing;
      }

      return [...newNotifications, ...existing];
    }
  });

  const notifications = queryResult.data ?? [];

  const clearNotifications = useCallback(() => {
    if (!input) {
      return;
    }

    utils.profile.notifications.setData(input, []);
  }, [input, utils]);

  return {
    ...queryResult,
    data: notifications,
    notifications,
    clearNotifications
  };
}
