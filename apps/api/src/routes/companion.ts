import type { FastifyInstance } from "fastify";

import { prisma } from "../lib/prisma.js";
import {
  companionTaskListResponseSchema,
  mapCompanionTaskToDto
} from "../serializers/companion-task.js";

export async function registerCompanionRoutes(server: FastifyInstance) {
  server.get(
    "/tasks",
    {
      schema: {
        response: {
          200: companionTaskListResponseSchema
        }
      }
    },
    async () => {
      const tasks = await prisma.companionTask.findMany({
        orderBy: { createdAt: "desc" }
      });

      return {
        tasks: tasks.map(mapCompanionTaskToDto)
      };
    }
  );

  server.get(
    "/stream",
    {
      websocket: true
    },
    (connection) => {
      const interval = setInterval(async () => {
        const tasks = await prisma.companionTask.findMany({
          orderBy: { createdAt: "desc" }
        });

        connection.socket.send(
          JSON.stringify({
            type: "companion:update",
            tasks: tasks.map(mapCompanionTaskToDto),
            timestamp: new Date().toISOString()
          })
        );
      }, 5000);

      connection.socket.on("close", () => {
        clearInterval(interval);
      });
    }
  );
}
