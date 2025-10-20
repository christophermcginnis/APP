import { z } from "zod";
export declare const circleSessionStatusSchema: z.ZodEnum<["scheduled", "live", "completed", "draft"]>;
export declare const circleSessionSchema: z.ZodObject<{
    id: z.ZodString;
    circleId: z.ZodString;
    scheduledFor: z.ZodString;
    topic: z.ZodString;
    status: z.ZodEnum<["scheduled", "live", "completed", "draft"]>;
    hostId: z.ZodString;
    companionSummaryId: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "scheduled" | "live" | "completed" | "draft";
    id: string;
    circleId: string;
    scheduledFor: string;
    topic: string;
    hostId: string;
    companionSummaryId: string | null;
}, {
    status: "scheduled" | "live" | "completed" | "draft";
    id: string;
    circleId: string;
    scheduledFor: string;
    topic: string;
    hostId: string;
    companionSummaryId: string | null;
}>;
export type CircleSession = z.infer<typeof circleSessionSchema>;
export declare const circleSessionCreationSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    circleId: z.ZodString;
    scheduledFor: z.ZodString;
    topic: z.ZodString;
    status: z.ZodEnum<["scheduled", "live", "completed", "draft"]>;
    hostId: z.ZodString;
    companionSummaryId: z.ZodNullable<z.ZodString>;
}, "status" | "id" | "companionSummaryId">, "strip", z.ZodTypeAny, {
    circleId: string;
    scheduledFor: string;
    topic: string;
    hostId: string;
}, {
    circleId: string;
    scheduledFor: string;
    topic: string;
    hostId: string;
}>;
//# sourceMappingURL=circle-session.d.ts.map