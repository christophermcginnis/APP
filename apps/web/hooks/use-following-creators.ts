"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { trpc } from "@/lib/trpc/react";
import { followingCreatorsMock } from "@/mocks/profile";

export function useFollowingCreators() {
  const { user } = useCurrentUser();
  const followerId = user.isAuthenticated ? user.id : undefined;
  const input = followerId ? { followerId } : undefined;

  return trpc.profile.following.useQuery(input, {
    staleTime: 60_000,
    retry: false,
    enabled: Boolean(followerId),
    placeholderData: followerId ? [] : followingCreatorsMock
  });
}
