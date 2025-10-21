"use client";

import { TRPCClientError } from "@trpc/client";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";

import { useCurrentUser } from "@/hooks/use-current-user";
import { trpc } from "@/lib/trpc/react";

type FollowCreatorButtonProps = {
  handle: string;
  isFollowing: boolean;
};

export function FollowCreatorButton({ handle, isFollowing: initialIsFollowing }: FollowCreatorButtonProps) {
  const { user } = useCurrentUser();
  const utils = trpc.useUtils();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const viewerKey = useMemo(
    () => ({ handle, viewerId: user.isAuthenticated ? user.id : undefined }),
    [handle, user.id, user.isAuthenticated]
  );

  const followerId = user.isAuthenticated ? user.id : undefined;

  const followMutation = trpc.profile.followCreator.useMutation({
    onMutate: async ({ follow }) => {
      const nextState = follow ?? !isFollowing;
      setError(null);
      setIsFollowing(nextState);

      const previousProfile = utils.profile.creatorByHandle.getData(viewerKey);
      if (previousProfile) {
        utils.profile.creatorByHandle.setData(viewerKey, {
          ...previousProfile,
          isFollowing: nextState
        });
      }

      return { previousProfile, previousIsFollowing: isFollowing };
    },
    onError: (error, _variables, context) => {
      if (context?.previousProfile) {
        utils.profile.creatorByHandle.setData(viewerKey, context.previousProfile);
      }
      if (context?.previousIsFollowing !== undefined) {
        setIsFollowing(context.previousIsFollowing);
      }
      if (error instanceof TRPCClientError && error.data?.code === "UNAUTHORIZED") {
        setError("Please sign in to follow creators.");
        return;
      }
      setError("We couldn't update your follow preference. Please try again.");
    },
    onSuccess: (data) => {
      setIsFollowing(data.isFollowing);
      utils.profile.creatorByHandle.setData(viewerKey, (existing) =>
        existing ? { ...existing, isFollowing: data.isFollowing } : existing
      );
    },
    onSettled: () => {
      utils.profile.creatorByHandle.invalidate(viewerKey);
      if (followerId) {
        utils.profile.following.invalidate({ followerId });
        utils.profile.overview.invalidate({ userId: followerId });
      } else {
        utils.profile.following.invalidate();
      }
    }
  });

  const canFollow = user.isAuthenticated;
  const isProcessing = followMutation.isLoading;

  function handleClick() {
    if (!canFollow) {
      setError("Please sign in to follow creators.");
      return;
    }

    const nextState = !isFollowing;
    followMutation.mutate({
      handle,
      follow: nextState,
      followerId
    });
  }

  const buttonLabel = !canFollow
    ? "Sign in to follow"
    : isProcessing
      ? isFollowing
        ? "Saving..."
        : "Following..."
      : isFollowing
        ? "Following"
        : "Follow for updates";

  const buttonClassName = clsx(
    "rounded-full px-4 py-2 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
    canFollow && !isFollowing
      ? "bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 text-slate-900 hover:brightness-110 disabled:opacity-70"
      : "border border-white/25 bg-white/10 text-white/80 hover:bg-white/20 disabled:opacity-60"
  );

  return (
    <div className="flex flex-col gap-2 text-white">
      <button
        type="button"
        onClick={handleClick}
        disabled={isProcessing}
        className={buttonClassName}
      >
        {buttonLabel}
      </button>
      {error ? (
        <p className="text-[11px] font-medium text-amber-200/90">{error}</p>
      ) : null}
    </div>
  );
}
