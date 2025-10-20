import { trpc } from "@/lib/trpc/react";

export function useCircles(ownerId?: string) {
  return trpc.circles.list.useQuery(
    { ownerId: ownerId! },
    {
      staleTime: 30_000,
      enabled: Boolean(ownerId)
    }
  );
}
