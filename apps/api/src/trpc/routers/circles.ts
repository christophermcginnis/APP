import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  circleListResponseSchema,
  circleResponseSchema,
  createCircleInputSchema,
  mapCircleToDto,
  prismaAccessFromDto
} from "../../serializers/circle.js";
import { publicProcedure, router } from "../trpc.js";

export const circlesRouter = router({
  list: publicProcedure
    .input(
      z.object({
        ownerId: z.string().uuid()
      })
    )
    .output(circleListResponseSchema)
    .query(async ({ ctx, input }) => {
      const circles = await ctx.prisma.circle.findMany({
        where: { ownerId: input.ownerId },
        orderBy: { createdAt: "desc" }
      });

      return {
        circles: circles.map(mapCircleToDto)
      };
    }),
  byId: publicProcedure
    .input(
      z.object({
        id: z.string().uuid()
      })
    )
    .output(circleResponseSchema)
    .query(async ({ ctx, input }) => {
      const circle = await ctx.prisma.circle.findUnique({
        where: { id: input.id }
      });

      if (!circle) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Circle not found"
        });
      }

      return {
        circle: mapCircleToDto(circle)
      };
    }),
  create: publicProcedure
    .input(createCircleInputSchema)
    .output(circleResponseSchema)
    .mutation(async ({ ctx, input }) => {
      const circle = await ctx.prisma.circle.create({
        data: {
          name: input.name,
          focusArea: input.focusArea,
          cadence: input.cadence,
          access: prismaAccessFromDto[input.access ?? "waitlist"],
          members: input.members ?? 0,
          companionTone: input.companionTone,
          ownerId: input.ownerId
        }
      });

      return {
        circle: mapCircleToDto(circle)
      };
    })
});
