import { initTRPC } from "@trpc/server";
import { z } from "zod";
import {
  circleAccessSchema,
  circleSchema,
  circleSessionSchema,
  companionTaskSchema,
  creatorNotificationSchema,
  creatorProfileSchema,
  creatorSummarySchema,
  profileOverviewSchema,
  profileSearchResultSchema
} from "@circlecast/core";

const t = initTRPC.context<Record<string, never>>().create();
const router = t.router;
const publicProcedure = t.procedure;
const protectedProcedure = t.procedure;

const circleListResponseSchema = z.object({
  circles: z.array(circleSchema)
});

const circleResponseSchema = z.object({
  circle: circleSchema
});

const createCircleInputSchema = z.object({
  name: z.string(),
  focusArea: z.string(),
  cadence: z.string(),
  access: circleAccessSchema.default("waitlist"),
  members: z.number().int().nonnegative().default(0),
  companionTone: z.string(),
  ownerId: z.string().uuid()
});

const createCircleSessionInputSchema = z.object({
  circleId: z.string().uuid(),
  scheduledFor: z.string().datetime(),
  topic: z.string().min(5),
  hostId: z.string().uuid()
});

const circleSessionResponseSchema = z.object({
  session: circleSessionSchema
});

const circleSessionListResponseSchema = z.object({
  sessions: z.array(circleSessionSchema)
});

const companionTaskListResponseSchema = z.object({
  tasks: z.array(companionTaskSchema)
});

const circlesRouter = router({
  list: publicProcedure
    .input(
      z.object({
        ownerId: z.string().uuid()
      })
    )
    .output(circleListResponseSchema)
    .query(() => ({} as z.infer<typeof circleListResponseSchema>)),
  byId: publicProcedure
    .input(
      z.object({
        id: z.string().uuid()
      })
    )
    .output(circleResponseSchema)
    .query(() => ({} as z.infer<typeof circleResponseSchema>)),
  create: publicProcedure
    .input(createCircleInputSchema)
    .output(circleResponseSchema)
    .mutation(() => ({} as z.infer<typeof circleResponseSchema>))
});

const sessionsRouter = router({
  byCircle: publicProcedure
    .input(
      z.object({
        circleId: z.string().uuid()
      })
    )
    .output(circleSessionListResponseSchema)
    .query(() => ({} as z.infer<typeof circleSessionListResponseSchema>)),
  create: publicProcedure
    .input(createCircleSessionInputSchema)
    .output(circleSessionResponseSchema)
    .mutation(() => ({} as z.infer<typeof circleSessionResponseSchema>))
});

const companionRouter = router({
  tasks: publicProcedure
    .input(
      z.object({
        ownerId: z.string().uuid()
      })
    )
    .output(companionTaskListResponseSchema)
    .query(() => ({} as z.infer<typeof companionTaskListResponseSchema>))
});

const profileRouter = router({
  overview: publicProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .output(profileOverviewSchema)
    .query(() => ({} as z.infer<typeof profileOverviewSchema>)),
  following: publicProcedure
    .input(
      z
        .object({
          followerId: z.string().uuid()
        })
        .optional()
    )
    .output(z.array(creatorSummarySchema))
    .query(() => [] as Array<z.infer<typeof creatorSummarySchema>>),
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
    .query(() => [] as Array<z.infer<typeof creatorNotificationSchema>>),
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
    .mutation(() => ({ acknowledged: true })),
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(2).max(100)
      })
    )
    .output(z.array(profileSearchResultSchema))
    .query(() => [] as Array<z.infer<typeof profileSearchResultSchema>>),
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        firstName: z.string(),
        lastName: z.string(),
        handle: z.string(),
        password: z.string().min(8),
        birthdate: z.string().datetime().optional(),
        headline: z.string().optional()
      })
    )
    .mutation(() => ({ userId: "mock-user-id" })),
  creatorByHandle: publicProcedure
    .input(
      z.object({
        handle: z.string(),
        viewerId: z.string().uuid().optional()
      })
    )
    .output(creatorProfileSchema)
    .query(() => ({} as z.infer<typeof creatorProfileSchema>)),
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
    .mutation(() => ({ handle: "", isFollowing: false }))
});

export const appRouter = router({
  circles: circlesRouter,
  sessions: sessionsRouter,
  companion: companionRouter,
  profile: profileRouter
});

export type AppRouter = typeof appRouter;
export type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
