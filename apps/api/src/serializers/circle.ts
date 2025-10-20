import {
  circleAccessSchema,
  circleCreationSchema,
  circleSchema,
  type Circle
} from "@circlecast/core";
import { z } from "zod";

export const createCircleInputSchema = circleCreationSchema
  .pick({
    name: true,
    focusArea: true,
    cadence: true,
    access: true,
    members: true,
    companionTone: true,
    ownerId: true
  })
  .extend({
    access: circleAccessSchema.default("waitlist"),
    members: z.number().int().nonnegative().default(0)
  });

export const prismaAccessFromDto: Record<Circle["access"], "OPEN" | "WAITLIST" | "PREMIUM"> = {
  open: "OPEN",
  waitlist: "WAITLIST",
  premium: "PREMIUM"
};

export function mapCircleToDto(circle: {
  id: string;
  name: string;
  focusArea: string;
  cadence: string;
  access: string;
  members: number;
  companionTone: string;
  ownerId: string;
  createdAt: Date;
}): Circle {
  const accessValue =
    typeof circle.access === "string" ? circle.access : "WAITLIST";
  const access = accessValue.toLowerCase() as Circle["access"];
  return {
    id: circle.id,
    name: circle.name,
    focusArea: circle.focusArea,
    cadence: circle.cadence,
    access,
    members: circle.members,
    companionTone: circle.companionTone,
    ownerId: circle.ownerId,
    createdAt: circle.createdAt.toISOString()
  };
}

export const circleListResponseSchema = z.object({
  circles: z.array(circleSchema)
});

export const circleResponseSchema = z.object({
  circle: circleSchema
});
