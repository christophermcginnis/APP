import { z } from "zod";
export const circleAccessSchema = z.enum(["open", "waitlist", "premium"]);
export const circleSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    focusArea: z.string(),
    cadence: z.string(),
    access: circleAccessSchema,
    members: z.number().nonnegative(),
    companionTone: z.string(),
    createdAt: z.string(),
    ownerId: z.string().uuid()
});
export const circleCreationSchema = circleSchema.omit({
    id: true,
    createdAt: true
});
