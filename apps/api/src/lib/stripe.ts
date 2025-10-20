import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripeClient(secretKey: string | undefined) {
  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Update apps/api/.env with your Stripe test secret key."
    );
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(secretKey, {
      apiVersion: "2023-10-16"
    });
  }

  return stripeInstance;
}

export function assertWebhookSecret(webhookSecret: string | undefined) {
  if (!webhookSecret) {
    throw new Error(
      "STRIPE_WEBHOOK_SECRET is not set. Run `stripe listen --forward-to localhost:3030/stripe/webhook` to obtain one and update apps/api/.env."
    );
  }
  return webhookSecret;
}
