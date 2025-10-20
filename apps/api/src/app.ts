import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import Fastify from "fastify";
import rawBody from "fastify-raw-body";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider
} from "fastify-type-provider-zod";

import { registerEnvPlugin } from "./plugins/env.js";
import { registerCircleRoutes } from "./routes/circles.js";
import { registerCompanionRoutes } from "./routes/companion.js";
import { registerHealthRoutes } from "./routes/health.js";
import { registerSessionRoutes } from "./routes/sessions.js";
import { registerStripeWebhookRoutes } from "./routes/stripe-webhook.js";
import { registerTrpcPlugin } from "./trpc/plugin.js";

export async function buildServer() {
  const server = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? "info",
      transport:
        process.env.NODE_ENV !== "production"
          ? { target: "pino-pretty", options: { colorize: true } }
          : undefined
    }
  }).withTypeProvider<ZodTypeProvider>();

  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  await server.register(registerEnvPlugin);
  await server.register(cors, {
    origin: (origin, cb) => {
      if (!origin) {
        cb(null, true);
        return;
      }

      const allowed = server.env.ALLOWED_ORIGINS?.split(",") ?? [];
      if (allowed.length === 0 || allowed.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error("Origin not allowed"), false);
      }
    },
    credentials: true
  });

  await server.register(rawBody, {
    field: "rawBody",
    global: false,
    runFirst: true
  });

  await server.register(websocket);

  await registerTrpcPlugin(server);

  await server.register(registerHealthRoutes, { prefix: "/health" });
  await server.register(registerCircleRoutes, { prefix: "/circles" });
  await server.register(registerSessionRoutes, { prefix: "/sessions" });
  await server.register(registerCompanionRoutes, { prefix: "/companion" });
  await server.register(registerStripeWebhookRoutes, { prefix: "/stripe" });

  return server;
}
