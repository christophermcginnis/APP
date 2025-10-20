import type { FastifyInstance } from "fastify";

import { getStripeClient, assertWebhookSecret } from "../lib/stripe.js";

declare module "fastify" {
  interface FastifyRequest {
    rawBody?: Buffer | string;
  }
}

export async function registerStripeWebhookRoutes(server: FastifyInstance) {
  server.post(
    "/webhook",
    {
      config: {
        rawBody: true
      }
    },
    async (request, reply) => {
      const signature = request.headers["stripe-signature"];
      if (!signature || typeof signature !== "string") {
        return reply.code(400).send({ message: "Missing stripe-signature header" });
      }

      const secretKey = server.env.STRIPE_SECRET_KEY;
      const webhookSecret = server.env.STRIPE_WEBHOOK_SECRET;

      if (!secretKey || !webhookSecret) {
        server.log.warn("Stripe secrets not configured; skipping webhook verification.");
        return reply.code(202).send({ skipped: true });
      }

      let event;
      try {
        const stripe = getStripeClient(secretKey);
        const rawCandidate = request.rawBody ?? request.body;
        const payload =
          typeof rawCandidate === "string" || Buffer.isBuffer(rawCandidate)
            ? rawCandidate
            : JSON.stringify(rawCandidate ?? {});
        event = stripe.webhooks.constructEvent(
          payload,
          signature,
          assertWebhookSecret(webhookSecret)
        );
      } catch (error) {
        server.log.error({ err: error }, "Failed to verify Stripe webhook");
        return reply.code(400).send({ message: "Invalid payload" });
      }

      server.log.info({ type: event.type }, "Stripe event received");

      // TODO: dispatch event.type to domain handlers (subscriptions, payouts, etc.).

      return reply.code(200).send({ received: true });
    }
  );
}
