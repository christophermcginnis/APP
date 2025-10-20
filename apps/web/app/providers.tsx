"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren, useMemo, useState } from "react";
import { environment } from "@/lib/env";
import { trpc } from "@/lib/trpc/react";

export function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false
          }
        }
      })
  );

  const apiUrl = environment.apiUrl || "http://localhost:3030";

  const trpcClient = useMemo(
    () =>
      trpc.createClient({
        links: [
          httpBatchLink({
            url: `${apiUrl}/trpc`,
            fetch: (url: RequestInfo | URL, options?: RequestInit) =>
              fetch(url, {
                ...options,
                credentials: "include"
              })
          })
        ]
      }),
    [apiUrl]
  );

  return (
    <SessionProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </trpc.Provider>
    </SessionProvider>
  );
}
