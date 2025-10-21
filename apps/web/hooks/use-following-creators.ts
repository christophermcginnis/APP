"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { trpc } from "@/lib/trpc/react";
import { followingCreatorsMock } from "@/mocks/profile";

const ANONYMOUS_FOLLOWER_ID = "00000000-0000-0000-0000-000000000000";

export function useFollowingCreators() {
  const { user } = useCurrentUser();

  const followerId = user.isAuthenticated ? user.id : ANONYMOUS_FOLLOWER_ID;

  return trpc.profile.following.useQuery(
    { followerId },
    {
      enabled: user.isAuthenticated,
      staleTime: 60_000,
      retry: false,
      placeholderData: followingCreatorsMock
    }
  );
}
