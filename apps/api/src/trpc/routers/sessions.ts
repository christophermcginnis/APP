import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  circleSessionListResponseSchema,
  circleSessionResponseSchema,
  createCircleSessionInputSchema,
  mapCircleSessionToDto,
  prismaCircleSessionStatusFromDto
} from "../../serializers/circle-session.js";
import { publicProcedure, router } from "../trpc.js";

export const sessionsRouter = router({
  byCircle: publicProcedure
    .input(
      z.object({
        circleId: z.string().uuid()
      })
    )
    .output(circleSessionListResponseSchema)
    .query(async ({ ctx, input }) => {
      const circle = await ctx.prisma.circle.findUnique({
        where: { id: input.circleId },
        select: { id: true }
      });

      if (!circle) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Circle not found"
        });
      }

      const sessions = await ctx.prisma.circleSession.findMany({
        where: { circleId: input.circleId },
        orderBy: { scheduledFor: "asc" }
      });

      return {
        sessions: sessions.map(mapCircleSessionToDto)
      };
    }),
  create: publicProcedure
    .input(createCircleSessionInputSchema)
    .output(circleSessionResponseSchema)
    .mutation(async ({ ctx, input }) => {
      const circle = await ctx.prisma.circle.findUnique({
        where: { id: input.circleId },
        select: { id: true }
      });

      if (!circle) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Circle not found"
        });
      }

      const session = await ctx.prisma.circleSession.create({
        data: {
          circleId: input.circleId,
          scheduledFor: new Date(input.scheduledFor),
          topic: input.topic,
          hostId: input.hostId,
          status: prismaCircleSessionStatusFromDto.scheduled,
          companionSummaryId: null
        }
      });

      return {
        session: mapCircleSessionToDto(session)
      };
    })
});
