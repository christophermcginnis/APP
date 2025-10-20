import { z } from "zod";
export declare const circleAccessSchema: z.ZodEnum<["open", "waitlist", "premium"]>;
export declare const circleSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    focusArea: z.ZodString;
    cadence: z.ZodString;
    access: z.ZodEnum<["open", "waitlist", "premium"]>;
    members: z.ZodNumber;
    companionTone: z.ZodString;
    createdAt: z.ZodString;
    ownerId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    focusArea: string;
    cadence: string;
    access: "open" | "waitlist" | "premium";
    members: number;
    companionTone: string;
    createdAt: string;
    ownerId: string;
}, {
    id: string;
    name: string;
    focusArea: string;
    cadence: string;
    access: "open" | "waitlist" | "premium";
    members: number;
    companionTone: string;
    createdAt: string;
    ownerId: string;
}>;
export type Circle = z.infer<typeof circleSchema>;
export declare const circleCreationSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    name: z.ZodString;
    focusArea: z.ZodString;
    cadence: z.ZodString;
    access: z.ZodEnum<["open", "waitlist", "premium"]>;
    members: z.ZodNumber;
    companionTone: z.ZodString;
    createdAt: z.ZodString;
    ownerId: z.ZodString;
}, "id" | "createdAt">, "strip", z.ZodTypeAny, {
    name: string;
    focusArea: string;
    cadence: string;
    access: "open" | "waitlist" | "premium";
    members: number;
    companionTone: string;
    ownerId: string;
}, {
    name: string;
    focusArea: string;
    cadence: string;
    access: "open" | "waitlist" | "premium";
    members: number;
    companionTone: string;
    ownerId: string;
}>;
//# sourceMappingURL=circle.d.ts.map