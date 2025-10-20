import type {
  CirclesListResponse,
  CompanionTasksResponse
} from "@/types/api";

export const circlesMock: CirclesListResponse = {
  circles: [
    {
      id: "circle-1",
      name: "Indie Music Circle",
      focusArea: "Independent music production",
      cadence: "Weekly · Thursdays",
      access: "waitlist",
      members: 18,
      companionTone: "Curated, calm, collaborative",
      createdAt: new Date().toISOString(),
      ownerId: "creator-avery"
    },
    {
      id: "circle-2",
      name: "Creator Monetisation Lab",
      focusArea: "Productised services · Creator ops",
      cadence: "Bi-weekly · Tuesdays",
      access: "premium",
      members: 12,
      companionTone: "Strategic, growth-minded",
      createdAt: new Date().toISOString(),
      ownerId: "creator-avery"
    },
    {
      id: "circle-3",
      name: "CircleCast Alpha",
      focusArea: "Audio community builders",
      cadence: "Weekly · Mondays",
      access: "open",
      members: 24,
      companionTone: "Warm, onboarding-led",
      createdAt: new Date().toISOString(),
      ownerId: "creator-avery"
    }
  ]
};

export const companionTasksMock: CompanionTasksResponse = {
  tasks: [
    {
      id: "task-1",
      circleId: "circle-1",
      title: "Refine highlight reel copy",
      kind: "clip",
      status: "in_progress",
      etaMinutes: 14,
      payload: {
        insight:
          "Companion trimmed 3 highlight clips. Approve tone before publishing to members."
      }
    },
    {
      id: "task-2",
      circleId: "circle-2",
      title: "Queue premium tier invites",
      kind: "invites",
      status: "queued",
      etaMinutes: 26,
      payload: {
        insight:
          "Suggested 8 creators who engaged with Monetisation Lab prompts in the last week."
      }
    },
    {
      id: "task-3",
      circleId: "circle-3",
      title: "Draft onboarding prompt",
      kind: "summary",
      status: "ready",
      etaMinutes: 0,
      payload: {
        insight:
          "Onboarding note drafted to re-engage new members who have not joined a live room yet."
      }
    }
  ]
};
