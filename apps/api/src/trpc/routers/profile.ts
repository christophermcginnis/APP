import { randomUUID } from "node:crypto";

import {
  creatorNotificationSchema,
  creatorProfileSchema,
  creatorSummarySchema,
  profileOverviewSchema,
  profileSearchResultSchema
} from "@circlecast/core";
import type {
  CreatorNotification,
  CreatorProfile,
  CreatorSummary
} from "@circlecast/core";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

import {
  creatorProfilesMock,
  followingCreatorsMock,
  profileOverviewMock
} from "../../data/profile.js";
import { protectedProcedure, publicProcedure, router } from "../trpc.js";
import type { TrpcContext } from "../context.js";

type CircleWithDetails = Prisma.CircleGetPayload<{
  include: { companionTasks: true; sessions: true };
}>;

type UserWithCircles = Prisma.UserGetPayload<{
  include: { circles: { include: { companionTasks: true; sessions: true } } };
}>;

function formatStatusLabel(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildCreatorProfileFromUser(user: UserWithCircles): CreatorProfile {
  if (!user.handle) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Creator not found"
    });
  }

  const circles = (user.circles ?? []) as CircleWithDetails[];
  const displayName = user.name?.trim() && user.name.trim().length > 0 ? user.name.trim() : `@${user.handle}`;

  const featuredCircles: CreatorProfile["featuredCircles"] = circles.map((circle) => {
    const focusArea = circle.focusArea.trim();
    return {
      id: circle.id,
      name: circle.name,
      theme: circle.focusArea,
      cadence: circle.cadence,
      members: circle.members,
      highlight:
        circle.companionTone && circle.companionTone.length > 0
          ? circle.companionTone
          : `${displayName} keeps ${focusArea} momentum alive.`
    };
  });

  if (featuredCircles.length === 0) {
    featuredCircles.push({
      id: `${user.handle}-circle`,
      name: `${displayName}'s circle`,
      theme: "CircleCast community",
      cadence: "Coming soon",
      members: 0,
      highlight: `${displayName} is preparing new CircleCast experiences.`
    });
  }

  const testimonials: CreatorProfile["testimonials"] = circles.map((circle) => ({
    id: `${circle.id}-testimonial`,
    quote:
      circle.companionTone && circle.companionTone.length > 0
        ? circle.companionTone
        : `Members praise ${displayName}'s calm guidance through ${circle.focusArea}.`,
    author: circle.name
  }));

  if (testimonials.length === 0) {
    testimonials.push({
      id: `${user.handle}-testimonial`,
      quote: `${displayName}'s circles are launching soon—join the waitlist to get updates first.`,
      author: "CircleCast community"
    });
  }

  const highlights: CreatorProfile["highlights"] = [];

  circles.forEach((circle) => {
    circle.sessions.forEach((session) => {
      highlights.push({
        id: `${session.id}-session`,
        title: `Session: ${session.topic}`,
        description: `Scheduled for ${session.scheduledFor.toISOString()} in ${circle.name}.`
      });
    });

    circle.companionTasks.forEach((task) => {
      const statusLabel = formatStatusLabel(task.status);
      highlights.push({
        id: `${task.id}-task`,
        title: `Companion task: ${task.title}`,
        description: `${statusLabel} · ETA ${task.etaMinutes} min.`
      });
    });
  });

  if (highlights.length === 0) {
    highlights.push({
      id: `${user.handle}-highlight`,
      title: "CircleCast update",
      description: `${displayName} is preparing the first highlights—check back soon.`
    });
  }

  const headline = user.bio?.trim();

  return {
    handle: user.handle,
    headline:
      headline && headline.length > 0
        ? headline
        : `${displayName} is building calm creator circles on CircleCast.`,
    featuredCircles,
    testimonials,
    highlights: highlights.slice(0, 6),
    isFollowing: false
  };
}

function findMockCreatorProfile(handle: string): CreatorProfile | undefined {
  const directMatch = creatorProfilesMock[handle];
  if (directMatch) {
    return directMatch;
  }

  const lowerCased = handle.toLowerCase();
  if (lowerCased !== handle) {
    const lowerMatch = creatorProfilesMock[lowerCased];
    if (lowerMatch) {
      return lowerMatch;
    }
  }

  const entry = Object.entries(creatorProfilesMock).find(
    ([key]) => key.toLowerCase() === lowerCased
  );

  return entry?.[1];
}

const creatorFollowers = new Map<string, Set<string>>();

const followerFollowing = new Map<string, Set<string>>();

type StoredNotification = {
  id: string;
  type: "follow";
  createdAt: Date;
  follower: {
    id: string;
    name: string;
    handle?: string | null;
    avatarUrl?: string | null;
  };
};

const creatorNotifications = new Map<string, StoredNotification[]>();

const creatorSummaryLookup = new Map(
  followingCreatorsMock.map((creator) => [creator.handle.toLowerCase(), creator])
);

function getOrCreateFollowedHandles(followerId: string) {
  let handles = followerFollowing.get(followerId);
  if (handles) {
    return handles;
  }

  handles = new Set<string>();
  for (const [handle, followers] of creatorFollowers.entries()) {
    if (followers.has(followerId)) {
      handles.add(handle);
    }
  }

  followerFollowing.set(followerId, handles);
  return handles;
}

async function resolveCreatorSummaries(
  handles: Iterable<string>,
  ctx: Pick<TrpcContext, "prisma">
): Promise<CreatorSummary[]> {
  const summaries: CreatorSummary[] = [];

  for (const handleKey of handles) {
    const normalized = handleKey.toLowerCase();
    const mockSummary = creatorSummaryLookup.get(normalized);

    if (mockSummary) {
      const additionalFollowers = creatorFollowers.get(normalized)?.size ?? 0;
      summaries.push({
        ...mockSummary,
        followers: mockSummary.followers + additionalFollowers
      });
      continue;
    }

    const user = await ctx.prisma.user.findFirst({
      where: {
        handle: {
          equals: normalized,
          mode: "insensitive"
        }
      },
      include: {
        circles: true
      }
    });

    if (!user || !user.handle) {
      continue;
    }

    const circles = user.circles ?? [];
    const primaryCircle = circles[0];
    const focusArea = primaryCircle?.focusArea ?? "CircleCast community building";
    const followerCount = creatorFollowers.get(normalized)?.size ?? 0;
    const displayName = user.name?.trim() && user.name.trim().length > 0 ? user.name.trim() : `@${user.handle}`;

    const status = primaryCircle
      ? primaryCircle.companionTone && primaryCircle.companionTone.length > 0
        ? primaryCircle.companionTone
        : `Next session cadence: ${primaryCircle.cadence}`
      : "Preparing new circle experiences.";

    const summary: CreatorSummary = {
      handle: user.handle,
      name: displayName,
      avatarUrl: user.image ?? undefined,
      headline:
        user.bio && user.bio.length > 0
          ? user.bio
          : `${displayName} is growing calm creator circles on CircleCast.`,
      focus: focusArea,
      circles: circles.length,
      followers: followerCount,
      status
    };

    summaries.push(summary);
  }

  return summaries;
}

function getNotificationsForHandle(handle: string): CreatorNotification[] {
  const key = handle.toLowerCase();
  const stored = creatorNotifications.get(key);

  if (!stored || stored.length === 0) {
    return [];
  }

  return stored.map((notification) => ({
    id: notification.id,
    type: "follow" as const,
    createdAt: notification.createdAt.toISOString(),
    follower: {
      id: notification.follower.id,
      name: notification.follower.name,
      handle: notification.follower.handle ?? undefined,
      avatarUrl: notification.follower.avatarUrl ?? undefined
    }
  }));
}

function clearNotificationsForHandle(handle: string) {
  const key = handle.toLowerCase();
  creatorNotifications.set(key, []);
}

function getIsFollowing(handle: string, viewerId?: string) {
  if (!viewerId) {
    return false;
  }

  const followers = creatorFollowers.get(handle.toLowerCase());
  return followers?.has(viewerId) ?? false;
}

export const profileRouter = router({
  overview: publicProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .output(profileOverviewSchema)
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
        include: {
          circles: {
            include: {
              companionTasks: true,
              sessions: true
            }
          }
        }
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found"
        });
      }

      const base = JSON.parse(JSON.stringify(profileOverviewMock));

      base.id = user.id;
      base.name = user.name ?? base.name;
      base.handle = user.handle ?? base.handle;
      base.avatarUrl = user.image ?? base.avatarUrl;
      base.birthdate = user.birthdate?.toISOString();

      const circles = (user.circles ?? []) as Array<{
        id: string;
        name: string;
        cadence: string;
        members: number;
        companionTasks: Array<{
          id: string;
          title: string;
          etaMinutes: number;
          status: string;
        }>;
        sessions: Array<{
          id: string;
          topic: string;
          scheduledFor: Date;
        }>;
      }>;

      base.circles = circles.map((circle) => ({
        id: circle.id,
        name: circle.name,
        cadence: circle.cadence,
        members: circle.members,
        status: "Active"
      }));

      const allTasks = circles.flatMap((circle) => circle.companionTasks);
      const taskFocus = allTasks.slice(0, 3).map((task) => ({
        id: task.id,
        title: task.title,
        eta: `${task.etaMinutes} min`,
        status: task.status.replace("_", " ")
      }));

      if (taskFocus.length > 0) {
        base.companionFocus = taskFocus;
      }

      const allSessions = circles.flatMap((circle) => circle.sessions);
      const agendaItems = allSessions.slice(0, 3).map((session) => ({
        id: session.id,
        title: session.topic,
        time: session.scheduledFor.toISOString()
      }));

      if (agendaItems.length > 0) {
        base.agenda = agendaItems;
      }

      base.stats = [
        { label: "Active circles", value: String(circles.length) },
        { label: "Companion tasks", value: String(allTasks.length) }
      ];

      const followingHandles = getOrCreateFollowedHandles(input.userId);
      if (followingHandles.size > 0) {
        base.following = await resolveCreatorSummaries(followingHandles, ctx);
      } else {
        base.following = [];
      }

      return base;
    }),
  following: publicProcedure
    .input(
      z
        .object({
          followerId: z.string().uuid()
        })
        .optional()
    )
    .output(z.array(creatorSummarySchema))
    .query(async ({ ctx, input }) => {
      if (!input?.followerId) {
        return followingCreatorsMock;
      }

      const handles = getOrCreateFollowedHandles(input.followerId);
      if (handles.size === 0) {
        return [];
      }

      return resolveCreatorSummaries(handles, ctx);
    }),
  followCreator: publicProcedure
    .input(
      z.object({
        handle: z.string(),
        follow: z.boolean().optional(),
        followerId: z.string().uuid().optional()
      })
    )
    .output(
      z.object({
        handle: z.string(),
        isFollowing: z.boolean()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const normalizedHandle = input.handle.trim();
      const key = normalizedHandle.toLowerCase();
      const followerId = input.followerId ?? ctx.session?.user.id;

      if (!followerId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const followers = creatorFollowers.get(key) ?? new Set<string>();
      const currentlyFollowing = followers.has(followerId);
      const nextState = input.follow ?? !currentlyFollowing;

      if (nextState) {
        followers.add(followerId);
      } else {
        followers.delete(followerId);
      }

      creatorFollowers.set(key, followers);

      const followingHandles = getOrCreateFollowedHandles(followerId);
      if (nextState) {
        followingHandles.add(key);
      } else {
        followingHandles.delete(key);
      }

      if (nextState && !currentlyFollowing) {
        const follower = await ctx.prisma.user.findUnique({
          where: { id: followerId },
          select: { id: true, name: true, handle: true, image: true }
        });

        const followerName = follower?.name?.trim() && follower.name.trim().length > 0
          ? follower.name.trim()
          : follower?.handle?.trim() && follower.handle.trim().length > 0
            ? follower.handle.trim()
            : "A CircleCast creator";

        const notification: StoredNotification = {
          id: randomUUID(),
          type: "follow",
          createdAt: new Date(),
          follower: {
            id: followerId,
            name: followerName,
            handle: follower?.handle ?? null,
            avatarUrl: follower?.image ?? null
          }
        };

        const existingNotifications = creatorNotifications.get(key) ?? [];
        creatorNotifications.set(key, [...existingNotifications, notification]);
      }

      await new Promise((resolve) => setTimeout(resolve, 150));

      return {
        handle: normalizedHandle,
        isFollowing: followers.has(followerId)
      };
    }),
  notifications: publicProcedure
    .input(
      z
        .object({
          userId: z.string().uuid().optional(),
          handle: z.string().optional()
        })
        .optional()
    )
    .output(z.array(creatorNotificationSchema))
    .query(async ({ ctx, input }) => {
      if (!input) {
        return [];
      }

      let targetHandle = input.handle?.trim();

      if (!targetHandle && input.userId) {
        const user = await ctx.prisma.user.findUnique({
          where: { id: input.userId },
          select: { handle: true }
        });

        targetHandle = user?.handle ?? undefined;
      }

      if (!targetHandle) {
        return [];
      }

      return getNotificationsForHandle(targetHandle);
    }),
  acknowledgeNotifications: publicProcedure
    .input(
      z
        .object({
          userId: z.string().uuid().optional(),
          handle: z.string().optional()
        })
        .optional()
    )
    .output(z.object({ acknowledged: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (!input) {
        return { acknowledged: false };
      }

      let targetHandle = input.handle?.trim();

      if (!targetHandle && input.userId) {
        const user = await ctx.prisma.user.findUnique({
          where: { id: input.userId },
          select: { handle: true }
        });

        targetHandle = user?.handle ?? undefined;
      }

      if (!targetHandle) {
        return { acknowledged: false };
      }

      clearNotificationsForHandle(targetHandle);

      return { acknowledged: true };
    }),
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(2).max(100)
      })
    )
    .output(z.array(profileSearchResultSchema))
    .query(async ({ ctx, input }) => {
      const searchTerm = input.query.trim();

      if (searchTerm.length < 2) {
        return [];
      }

      const users = await ctx.prisma.user.findMany({
        where: {
          OR: [
            { handle: { contains: searchTerm, mode: "insensitive" } },
            { name: { contains: searchTerm, mode: "insensitive" } },
            { email: { contains: searchTerm, mode: "insensitive" } }
          ]
        },
        select: {
          id: true,
          name: true,
          handle: true,
          image: true,
          bio: true
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 8
      });

      const seenHandles = new Set<string>();

      return users
        .filter((user) => {
          if (!user.handle) {
            return false;
          }

          if (seenHandles.has(user.handle)) {
            return false;
          }

          seenHandles.add(user.handle);
          return true;
        })
        .map((user) => {
          const normalizedName = user.name?.trim();
          const normalizedHeadline = user.bio?.trim();

          return {
            id: user.id,
            name:
              normalizedName && normalizedName.length > 0
                ? normalizedName
                : user.handle!,
            handle: user.handle!,
            avatarUrl: user.image ?? undefined,
            headline:
              normalizedHeadline && normalizedHeadline.length > 0
                ? normalizedHeadline
                : undefined
          };
        });
    }),
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        handle: z
          .string()
          .min(3)
          .regex(/^[a-z0-9-_]+$/i, "Handle can only include letters, numbers, dashes, and underscores"),
        password: z
          .string()
          .min(8, "Password must be at least 8 characters long")
          .max(100, "Password must be less than 100 characters"),
        birthdate: z.string().datetime().optional(),
        headline: z.string().max(160).optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const normalizedEmail = input.email.trim().toLowerCase();
      const birthdate = input.birthdate ? new Date(input.birthdate) : null;

      const firstName = input.firstName.trim();
      const lastName = input.lastName.trim();
      const handle = input.handle.trim();
      const fullName = `${firstName} ${lastName}`.trim();

      const existingEmailOwner = await ctx.prisma.user.findUnique({
        where: { email: normalizedEmail }
      });

      if (existingEmailOwner) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An account with that email already exists. Please sign in instead."
        });
      }

      const existingHandleOwner = await ctx.prisma.user.findFirst({
        where: {
          handle,
          email: {
            not: normalizedEmail
          }
        }
      });

      if (existingHandleOwner) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "That username is already taken. Please choose another."
        });
      }

      const passwordHash = await bcrypt.hash(input.password, 12);

      const user = await ctx.prisma.user.create({
        data: {
          email: normalizedEmail,
          name: fullName,
          handle,
          birthdate,
          bio: input.headline ?? null,
          image: null,
          passwordHash
        }
      });

      return {
        userId: user.id
      };
    }),
  creatorByHandle: publicProcedure
    .input(
      z.object({
        handle: z.string(),
        viewerId: z.string().uuid().optional()
      })
    )
    .output(creatorProfileSchema)
    .query(async ({ ctx, input }) => {
      const normalizedHandle = input.handle.trim();
      const isFollowing = getIsFollowing(normalizedHandle, input.viewerId);

      const mockProfile = findMockCreatorProfile(normalizedHandle);
      if (mockProfile) {
        return { ...mockProfile, isFollowing };
      }

      const user = await ctx.prisma.user.findFirst({
        where: {
          handle: {
            equals: normalizedHandle,
            mode: "insensitive"
          }
        },
        include: {
          circles: {
            include: {
              companionTasks: true,
              sessions: true
            }
          }
        }
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Creator not found"
        });
      }

      const profile = buildCreatorProfileFromUser(user);
      return { ...profile, isFollowing };
    })
});
