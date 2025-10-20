import { trpc } from "@/lib/trpc/react";

export function useCompanionTasks(ownerId?: string) {
  return trpc.companion.tasks.useQuery(
    { ownerId: ownerId! },
    {
      refetchInterval: 5_000,
      staleTime: 5_000,
      enabled: Boolean(ownerId)
    }
  );
}
