import { circlesRouter } from "./routers/circles.js";
import { companionRouter } from "./routers/companion.js";
import { profileRouter } from "./routers/profile.js";
import { sessionsRouter } from "./routers/sessions.js";
import { router } from "./trpc.js";

export const appRouter = router({
  circles: circlesRouter,
  sessions: sessionsRouter,
  companion: companionRouter,
  profile: profileRouter
});

export type AppRouter = typeof appRouter;
