import fp from "fastify-plugin";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().default("3030"),
  LOG_LEVEL: z.string().default("info"),
  ALLOWED_ORIGINS: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  DATABASE_URL: z.string()
});

declare module "fastify" {
  interface FastifyInstance {
    env: z.infer<typeof envSchema>;
  }
}

export const registerEnvPlugin = fp(async (fastify) => {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    fastify.log.error(parsed.error.errors, "Invalid environment configuration");
    throw new Error("Invalid environment variables");
  }

  fastify.decorate("env", parsed.data);
});
