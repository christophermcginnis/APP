"use client";

import { trpc } from "@/lib/trpc/react";
import { followingCreatorsMock } from "@/mocks/profile";

export function useFollowingCreators() {
  return trpc.profile.following.useQuery(undefined, {
    staleTime: 60_000,
    retry: false,
    placeholderData: followingCreatorsMock
  });
}
