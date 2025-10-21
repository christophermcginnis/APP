import {
  creatorProfileSchema,
  creatorSummarySchema,
  profileOverviewSchema,
  profileSearchResultSchema
} from "@circlecast/core";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import {
  creatorProfilesMock,
  followingCreatorsMock,
  profileOverviewMock
} from "../../data/profile.js";
import { publicProcedure, router } from "../trpc.js";

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

      return base;
    }),
  following: publicProcedure
    .output(z.array(creatorSummarySchema))
    .query(() => followingCreatorsMock),
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
        handle: z.string()
      })
    )
    .output(creatorProfileSchema)
    .query(({ input }) => {
      const profile = creatorProfilesMock[input.handle];
      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Creator not found"
        });
      }

      return profile;
    })
});
