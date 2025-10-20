import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { prisma } from "../lib/prisma.js";
import {
  circleSessionListResponseSchema,
  circleSessionResponseSchema,
  createCircleSessionInputSchema,
  mapCircleSessionToDto,
  prismaCircleSessionStatusFromDto
} from "../serializers/circle-session.js";

export async function registerSessionRoutes(server: FastifyInstance) {
  server.get(
    "/circle/:circleId",
    {
      schema: {
        params: z.object({
          circleId: z.string().uuid()
        }),
        response: {
          200: circleSessionListResponseSchema
        }
      }
    },
    async (request) => {
      const params = z.object({ circleId: z.string().uuid() }).parse(request.params);
      const sessions = await prisma.circleSession.findMany({
        where: { circleId: params.circleId },
        orderBy: { scheduledFor: "asc" }
      });

      return {
        sessions: sessions.map(mapCircleSessionToDto)
      };
    }
  );

  server.post(
    "/",
    {
      schema: {
        body: createCircleSessionInputSchema,
        response: {
          201: circleSessionResponseSchema
        }
      }
    },
    async (request, reply) => {
      const body = createCircleSessionInputSchema.parse(request.body);
      const session = await prisma.circleSession.create({
        data: {
          circleId: body.circleId,
          scheduledFor: new Date(body.scheduledFor),
          topic: body.topic,
          hostId: body.hostId,
          status: prismaCircleSessionStatusFromDto.scheduled,
          companionSummaryId: null
        }
      });

      return reply.code(201).send({ session: mapCircleSessionToDto(session) });
    }
  );
}
