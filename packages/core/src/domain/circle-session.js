import { z } from "zod";
export const circleSessionStatusSchema = z.enum([
    "scheduled",
    "live",
    "completed",
    "draft"
]);
export const circleSessionSchema = z.object({
    id: z.string().uuid(),
    circleId: z.string().uuid(),
    scheduledFor: z.string(),
    topic: z.string(),
    status: circleSessionStatusSchema,
    hostId: z.string().uuid(),
    companionSummaryId: z.string().uuid().nullable()
});
export const circleSessionCreationSchema = circleSessionSchema.omit({
    id: true,
    status: true,
    companionSummaryId: true
});
