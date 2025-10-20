import { circleSessionSchema, type CircleSession } from "@circlecast/core";
import { z } from "zod";

export const createCircleSessionInputSchema = z.object({
  circleId: z.string().uuid(),
  scheduledFor: z.string().datetime(),
  topic: z.string().min(5),
  hostId: z.string().uuid()
});

export const circleSessionListResponseSchema = z.object({
  sessions: z.array(circleSessionSchema)
});

export const circleSessionResponseSchema = z.object({
  session: circleSessionSchema
});

export const prismaCircleSessionStatusFromDto: Record<
  CircleSession["status"],
  "SCHEDULED" | "LIVE" | "COMPLETED" | "DRAFT"
> = {
  scheduled: "SCHEDULED",
  live: "LIVE",
  completed: "COMPLETED",
  draft: "DRAFT"
};

export function mapCircleSessionToDto(session: {
  id: string;
  circleId: string;
  scheduledFor: Date;
  topic: string;
  status: string;
  hostId: string;
  companionSummaryId: string | null;
}): CircleSession {
  const status = session.status.toLowerCase() as CircleSession["status"];
  return {
    id: session.id,
    circleId: session.circleId,
    scheduledFor: session.scheduledFor.toISOString(),
    topic: session.topic,
    status,
    hostId: session.hostId,
    companionSummaryId: session.companionSummaryId
  };
}
