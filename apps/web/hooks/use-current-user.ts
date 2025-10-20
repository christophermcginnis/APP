"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";

export type CurrentUser = {
  id: string;
  name: string;
  email?: string | null;
  handle?: string | null;
  avatarUrl?: string | null;
  isAuthenticated: boolean;
};

export function useCurrentUser(): { user: CurrentUser } {
  const { data: session, status } = useSession();

  const user = useMemo<CurrentUser>(() => {
    if (status === "authenticated" && session?.user) {
      return {
        id: session.user.id,
        name: session.user.name ?? session.user.email ?? "Creator",
        email: session.user.email,
        handle: session.user.handle,
        avatarUrl: session.user.image,
        isAuthenticated: true
      };
    }

    return {
      id: "",
      name: "Guest",
      isAuthenticated: false
    };
  }, [session, status]);

  return { user };
}
