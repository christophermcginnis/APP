import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@circlecast/api-types";

export const trpc = createTRPCReact<AppRouter>();
