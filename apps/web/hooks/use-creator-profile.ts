"use client";

import { trpc } from "@/lib/trpc/react";
import { creatorProfileMock, creatorProfilesMock } from "@/mocks/profile";

export function useCreatorProfile(handle: string) {
  return trpc.profile.creatorByHandle.useQuery(
    { handle },
    {
      enabled: Boolean(handle),
      staleTime: 30_000,
      retry: false,
      placeholderData:
        creatorProfilesMock[handle] ?? { ...creatorProfileMock, handle }
    }
  );
}
