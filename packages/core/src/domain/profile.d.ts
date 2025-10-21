import { z } from "zod";
export declare const profileCircleSummarySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    cadence: z.ZodString;
    members: z.ZodNumber;
    status: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: string;
    id: string;
    name: string;
    cadence: string;
    members: number;
}, {
    status: string;
    id: string;
    name: string;
    cadence: string;
    members: number;
}>;
export declare const profileHighlightSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    circle: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    description: string;
    circle?: string | undefined;
}, {
    id: string;
    title: string;
    description: string;
    circle?: string | undefined;
}>;
export declare const profileTaskSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    eta: z.ZodString;
    status: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: string;
    id: string;
    title: string;
    eta: string;
}, {
    status: string;
    id: string;
    title: string;
    eta: string;
}>;
export declare const profileStatSchema: z.ZodObject<{
    label: z.ZodString;
    value: z.ZodString;
}, "strip", z.ZodTypeAny, {
    value: string;
    label: string;
}, {
    value: string;
    label: string;
}>;
export declare const profileAgendaItemSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    time: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    time: string;
}, {
    id: string;
    title: string;
    time: string;
}>;
export declare const profileSearchResultSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    handle: z.ZodString;
    avatarUrl: z.ZodOptional<z.ZodString>;
    headline: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    handle: string;
    avatarUrl?: string | undefined;
    headline?: string | undefined;
}, {
    id: string;
    name: string;
    handle: string;
    avatarUrl?: string | undefined;
    headline?: string | undefined;
}>;
export declare const creatorSummarySchema: z.ZodObject<{
    handle: z.ZodString;
    name: z.ZodString;
    avatarUrl: z.ZodOptional<z.ZodString>;
    headline: z.ZodString;
    focus: z.ZodString;
    circles: z.ZodNumber;
    followers: z.ZodNumber;
    status: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: string;
    name: string;
    handle: string;
    headline: string;
    focus: string;
    circles: number;
    followers: number;
    avatarUrl?: string | undefined;
}, {
    status: string;
    name: string;
    handle: string;
    headline: string;
    focus: string;
    circles: number;
    followers: number;
    avatarUrl?: string | undefined;
}>;
export declare const creatorNotificationSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodLiteral<"follow">;
    createdAt: z.ZodString;
    seenAt: z.ZodOptional<z.ZodString>;
    follower: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        handle: z.ZodOptional<z.ZodString>;
        avatarUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        handle?: string | undefined;
        avatarUrl?: string | undefined;
    }, {
        id: string;
        name: string;
        handle?: string | undefined;
        avatarUrl?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: "follow";
    createdAt: string;
    seenAt?: string | undefined;
    follower: {
        id: string;
        name: string;
        handle?: string | undefined;
        avatarUrl?: string | undefined;
    };
}, {
    id: string;
    type: "follow";
    createdAt: string;
    seenAt?: string | undefined;
    follower: {
        id: string;
        name: string;
        handle?: string | undefined;
        avatarUrl?: string | undefined;
    };
}>;
export declare const profileOverviewSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    handle: z.ZodString;
    headline: z.ZodString;
    avatarUrl: z.ZodOptional<z.ZodString>;
    location: z.ZodString;
    availability: z.ZodString;
    expertise: z.ZodArray<z.ZodString, "many">;
    birthdate: z.ZodOptional<z.ZodString>;
    circles: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        cadence: z.ZodString;
        members: z.ZodNumber;
        status: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        status: string;
        id: string;
        name: string;
        cadence: string;
        members: number;
    }, {
        status: string;
        id: string;
        name: string;
        cadence: string;
        members: number;
    }>, "many">;
    highlights: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        circle: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        description: string;
        circle?: string | undefined;
    }, {
        id: string;
        title: string;
        description: string;
        circle?: string | undefined;
    }>, "many">;
    companionFocus: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        eta: z.ZodString;
        status: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        status: string;
        id: string;
        title: string;
        eta: string;
    }, {
        status: string;
        id: string;
        title: string;
        eta: string;
    }>, "many">;
    stats: z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        label: string;
    }, {
        value: string;
        label: string;
    }>, "many">;
    agenda: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        time: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        time: string;
    }, {
        id: string;
        title: string;
        time: string;
    }>, "many">;
    following: z.ZodArray<z.ZodObject<{
        handle: z.ZodString;
        name: z.ZodString;
        avatarUrl: z.ZodOptional<z.ZodString>;
        headline: z.ZodString;
        focus: z.ZodString;
        circles: z.ZodNumber;
        followers: z.ZodNumber;
        status: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        status: string;
        name: string;
        handle: string;
        headline: string;
        focus: string;
        circles: number;
        followers: number;
        avatarUrl?: string | undefined;
    }, {
        status: string;
        name: string;
        handle: string;
        headline: string;
        focus: string;
        circles: number;
        followers: number;
        avatarUrl?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    location: string;
    id: string;
    name: string;
    handle: string;
    headline: string;
    circles: {
        status: string;
        id: string;
        name: string;
        cadence: string;
        members: number;
    }[];
    availability: string;
    expertise: string[];
    birthdate?: string | undefined;
    highlights: {
        id: string;
        title: string;
        description: string;
        circle?: string | undefined;
    }[];
    companionFocus: {
        status: string;
        id: string;
        title: string;
        eta: string;
    }[];
    stats: {
        value: string;
        label: string;
    }[];
    agenda: {
        id: string;
        title: string;
        time: string;
    }[];
    following: {
        status: string;
        name: string;
        handle: string;
        headline: string;
        focus: string;
        circles: number;
        followers: number;
        avatarUrl?: string | undefined;
    }[];
    avatarUrl?: string | undefined;
}, {
    location: string;
    id: string;
    name: string;
    handle: string;
    headline: string;
    circles: {
        status: string;
        id: string;
        name: string;
        cadence: string;
        members: number;
    }[];
    availability: string;
    expertise: string[];
    birthdate?: string | undefined;
    highlights: {
        id: string;
        title: string;
        description: string;
        circle?: string | undefined;
    }[];
    companionFocus: {
        status: string;
        id: string;
        title: string;
        eta: string;
    }[];
    stats: {
        value: string;
        label: string;
    }[];
    agenda: {
        id: string;
        title: string;
        time: string;
    }[];
    following: {
        status: string;
        name: string;
        handle: string;
        headline: string;
        focus: string;
        circles: number;
        followers: number;
        avatarUrl?: string | undefined;
    }[];
    avatarUrl?: string | undefined;
}>;
export declare const creatorCircleSummarySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    theme: z.ZodString;
    cadence: z.ZodString;
    members: z.ZodNumber;
    highlight: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    cadence: string;
    members: number;
    theme: string;
    highlight: string;
}, {
    id: string;
    name: string;
    cadence: string;
    members: number;
    theme: string;
    highlight: string;
}>;
export declare const creatorTestimonialSchema: z.ZodObject<{
    id: z.ZodString;
    quote: z.ZodString;
    author: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    quote: string;
    author: string;
}, {
    id: string;
    quote: string;
    author: string;
}>;
export declare const creatorHighlightSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    description: string;
}, {
    id: string;
    title: string;
    description: string;
}>;
export declare const creatorProfileSchema: z.ZodObject<{
    handle: z.ZodString;
    headline: z.ZodString;
    featuredCircles: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        theme: z.ZodString;
        cadence: z.ZodString;
        members: z.ZodNumber;
        highlight: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        cadence: string;
        members: number;
        theme: string;
        highlight: string;
    }, {
        id: string;
        name: string;
        cadence: string;
        members: number;
        theme: string;
        highlight: string;
    }>, "many">;
    testimonials: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        quote: z.ZodString;
        author: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        quote: string;
        author: string;
    }, {
        id: string;
        quote: string;
        author: string;
    }>, "many">;
    highlights: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        description: string;
    }, {
        id: string;
        title: string;
        description: string;
    }>, "many">;
    isFollowing: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    handle: string;
    headline: string;
    highlights: {
        id: string;
        title: string;
        description: string;
    }[];
    featuredCircles: {
        id: string;
        name: string;
        cadence: string;
        members: number;
        theme: string;
        highlight: string;
    }[];
    testimonials: {
        id: string;
        quote: string;
        author: string;
    }[];
    isFollowing: boolean;
}, {
    handle: string;
    headline: string;
    highlights: {
        id: string;
        title: string;
        description: string;
    }[];
    featuredCircles: {
        id: string;
        name: string;
        cadence: string;
        members: number;
        theme: string;
        highlight: string;
    }[];
    testimonials: {
        id: string;
        quote: string;
        author: string;
    }[];
    isFollowing: boolean;
}>;
export type ProfileCircleSummary = z.infer<typeof profileCircleSummarySchema>;
export type ProfileHighlight = z.infer<typeof profileHighlightSchema>;
export type ProfileTask = z.infer<typeof profileTaskSchema>;
export type ProfileStat = z.infer<typeof profileStatSchema>;
export type ProfileAgendaItem = z.infer<typeof profileAgendaItemSchema>;
export type ProfileSearchResult = z.infer<typeof profileSearchResultSchema>;
export type CreatorSummary = z.infer<typeof creatorSummarySchema>;
export type ProfileOverview = z.infer<typeof profileOverviewSchema>;
export type CreatorCircleSummary = z.infer<typeof creatorCircleSummarySchema>;
export type CreatorTestimonial = z.infer<typeof creatorTestimonialSchema>;
export type CreatorHighlight = z.infer<typeof creatorHighlightSchema>;
export type CreatorProfile = z.infer<typeof creatorProfileSchema>;
export type CreatorNotification = z.infer<typeof creatorNotificationSchema>;
//# sourceMappingURL=profile.d.ts.map