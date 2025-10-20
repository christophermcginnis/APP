import type { AppRouter, inferRouterOutputs } from "@circlecast/api-types";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type CirclesListResponse = RouterOutputs["circles"]["list"];
export type CompanionTasksResponse = RouterOutputs["companion"]["tasks"];
export type SessionsByCircleResponse = RouterOutputs["sessions"]["byCircle"];
