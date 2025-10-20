import { companionTaskSchema, type CompanionTask } from "@circlecast/core";
import { z } from "zod";

export const companionTaskListResponseSchema = z.object({
  tasks: z.array(companionTaskSchema)
});

const statusMap: Record<"QUEUED" | "IN_PROGRESS" | "READY", CompanionTask["status"]> = {
  QUEUED: "queued",
  IN_PROGRESS: "in_progress",
  READY: "ready"
};

const kindMap: Record<"SUMMARY" | "CLIP" | "INVITES" | "QUIZ", CompanionTask["kind"]> = {
  SUMMARY: "summary",
  CLIP: "clip",
  INVITES: "invites",
  QUIZ: "quiz"
};

export function mapCompanionTaskToDto(task: {
  id: string;
  circleId: string;
  title: string;
  kind: "SUMMARY" | "CLIP" | "INVITES" | "QUIZ";
  status: "QUEUED" | "IN_PROGRESS" | "READY";
  etaMinutes: number;
  payload: unknown;
}): CompanionTask {
  const payload = (typeof task.payload === "object" && task.payload !== null)
    ? (task.payload as Record<string, unknown>)
    : {};

  return {
    id: task.id,
    circleId: task.circleId,
    title: task.title,
    kind: kindMap[task.kind],
    status: statusMap[task.status],
    etaMinutes: task.etaMinutes,
    payload
  };
}
