import type { FastifyInstance } from "fastify";
import { z } from "zod";

export async function registerHealthRoutes(server: FastifyInstance) {
  server.get(
    "/",
    {
      schema: {
        response: {
          200: z.object({
            status: z.literal("ok"),
            uptime: z.number(),
            env: z.string()
          })
        }
      }
    },
    async () => ({
      status: "ok" as const,
      uptime: process.uptime(),
      env: server.env.NODE_ENV
    })
  );
}

