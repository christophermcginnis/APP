import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { prisma } from "../lib/prisma.js";
import {
  circleListResponseSchema,
  circleResponseSchema,
  createCircleInputSchema,
  mapCircleToDto,
  prismaAccessFromDto
} from "../serializers/circle.js";

export async function registerCircleRoutes(server: FastifyInstance) {
  server.get(
    "/",
    {
      schema: {
        response: {
          200: circleListResponseSchema
        }
      }
    },
    async () => {
      const circles = await prisma.circle.findMany({
        orderBy: { createdAt: "desc" }
      });

      return { circles: circles.map(mapCircleToDto) };
    }
  );

  server.get(
    "/:id",
    {
      schema: {
        params: z.object({
          id: z.string().uuid()
        }),
        response: {
          200: circleResponseSchema,
          404: z.object({ message: z.string() })
        }
      }
    },
    async (request, reply) => {
      const params = z.object({ id: z.string().uuid() }).parse(request.params);
      const circle = await prisma.circle.findUnique({
        where: { id: params.id }
      });
      if (!circle) {
        return reply.code(404).send({ message: "Circle not found" });
      }

      return { circle: mapCircleToDto(circle) };
    }
  );

  server.post(
    "/",
    {
      schema: {
        body: createCircleInputSchema,
        response: {
          201: circleResponseSchema
        }
      }
    },
    async (request, reply) => {
      const body = createCircleInputSchema.parse(request.body);

      const circle = await prisma.circle.create({
        data: {
          name: body.name,
          focusArea: body.focusArea,
          cadence: body.cadence,
          access: prismaAccessFromDto[body.access ?? "waitlist"],
          members: body.members ?? 0,
          companionTone: body.companionTone,
          ownerId: body.ownerId
        }
      });

      return reply.code(201).send({ circle: mapCircleToDto(circle) });
    }
  );
}
