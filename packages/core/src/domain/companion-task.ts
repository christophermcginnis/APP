import { z } from "zod";

export const companionTaskKindSchema = z.enum([
  "summary",
  "clip",
  "invites",
  "quiz"
]);

export const companionTaskStatusSchema = z.enum([
  "queued",
  "in_progress",
  "ready"
]);

export const companionTaskSchema = z.object({
  id: z.string().uuid(),
  circleId: z.string().uuid(),
  title: z.string(),
  kind: companionTaskKindSchema,
  status: companionTaskStatusSchema,
  etaMinutes: z.number().int().nonnegative(),
  payload: z.record(z.unknown())
});

export type CompanionTask = z.infer<typeof companionTaskSchema>;

