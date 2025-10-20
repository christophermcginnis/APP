import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import type { FastifyInstance } from "fastify";

import { createContext } from "./context.js";
import { appRouter } from "./router.js";

export async function registerTrpcPlugin(server: FastifyInstance) {
  await server.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      router: appRouter,
      createContext
    }
  });
}
