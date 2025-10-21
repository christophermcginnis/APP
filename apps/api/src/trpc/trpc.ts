import { initTRPC, TRPCError } from "@trpc/server";

import type { TrpcContext } from "./context.js";

const t = initTRPC.context<TrpcContext>().create();

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  const session = ctx.session;
  const userId = session?.user.id;

  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({ ctx: { ...ctx, session: session ?? { user: { id: userId } } } });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
