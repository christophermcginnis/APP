import { z } from "zod";

export const profileCircleSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  cadence: z.string(),
  members: z.number().int().nonnegative(),
  status: z.string()
});

export const profileHighlightSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  circle: z.string().optional()
});

export const profileTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  eta: z.string(),
  status: z.string()
});

export const profileStatSchema = z.object({
  label: z.string(),
  value: z.string()
});

export const profileAgendaItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  time: z.string()
});

export const creatorSummarySchema = z.object({
  handle: z.string(),
  name: z.string(),
  avatarUrl: z.string().url().optional(),
  headline: z.string(),
  focus: z.string(),
  circles: z.number().int().nonnegative(),
  followers: z.number().int().nonnegative(),
  status: z.string()
});

export const profileOverviewSchema = z.object({
  id: z.string(),
  name: z.string(),
  handle: z.string(),
  headline: z.string(),
  avatarUrl: z.string().url().optional(),
  location: z.string(),
  availability: z.string(),
  expertise: z.array(z.string()),
  birthdate: z.string().optional(),
  circles: z.array(profileCircleSummarySchema),
  highlights: z.array(profileHighlightSchema),
  companionFocus: z.array(profileTaskSchema),
  stats: z.array(profileStatSchema),
  agenda: z.array(profileAgendaItemSchema),
  following: z.array(creatorSummarySchema)
});

export const creatorCircleSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  theme: z.string(),
  cadence: z.string(),
  members: z.number().int().nonnegative(),
  highlight: z.string()
});

export const creatorTestimonialSchema = z.object({
  id: z.string(),
  quote: z.string(),
  author: z.string()
});

export const creatorHighlightSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string()
});

export const creatorProfileSchema = z.object({
  handle: z.string(),
  headline: z.string(),
  featuredCircles: z.array(creatorCircleSummarySchema),
  testimonials: z.array(creatorTestimonialSchema),
  highlights: z.array(creatorHighlightSchema)
});

export type ProfileCircleSummary = z.infer<typeof profileCircleSummarySchema>;
export type ProfileHighlight = z.infer<typeof profileHighlightSchema>;
export type ProfileTask = z.infer<typeof profileTaskSchema>;
export type ProfileStat = z.infer<typeof profileStatSchema>;
export type ProfileAgendaItem = z.infer<typeof profileAgendaItemSchema>;
export type CreatorSummary = z.infer<typeof creatorSummarySchema>;
export type ProfileOverview = z.infer<typeof profileOverviewSchema>;
export type CreatorCircleSummary = z.infer<typeof creatorCircleSummarySchema>;
export type CreatorTestimonial = z.infer<typeof creatorTestimonialSchema>;
export type CreatorHighlight = z.infer<typeof creatorHighlightSchema>;
export type CreatorProfile = z.infer<typeof creatorProfileSchema>;
