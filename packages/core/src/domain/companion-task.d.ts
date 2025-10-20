import { z } from "zod";
export declare const companionTaskKindSchema: z.ZodEnum<["summary", "clip", "invites", "quiz"]>;
export declare const companionTaskStatusSchema: z.ZodEnum<["queued", "in_progress", "ready"]>;
export declare const companionTaskSchema: z.ZodObject<{
    id: z.ZodString;
    circleId: z.ZodString;
    title: z.ZodString;
    kind: z.ZodEnum<["summary", "clip", "invites", "quiz"]>;
    status: z.ZodEnum<["queued", "in_progress", "ready"]>;
    etaMinutes: z.ZodNumber;
    payload: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    status: "ready" | "queued" | "in_progress";
    id: string;
    circleId: string;
    title: string;
    kind: "summary" | "clip" | "invites" | "quiz";
    etaMinutes: number;
    payload: Record<string, unknown>;
}, {
    status: "ready" | "queued" | "in_progress";
    id: string;
    circleId: string;
    title: string;
    kind: "summary" | "clip" | "invites" | "quiz";
    etaMinutes: number;
    payload: Record<string, unknown>;
}>;
export type CompanionTask = z.infer<typeof companionTaskSchema>;
//# sourceMappingURL=companion-task.d.ts.map