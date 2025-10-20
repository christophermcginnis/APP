import { z } from "zod";

import { companionTaskListResponseSchema, mapCompanionTaskToDto } from "../../serializers/companion-task.js";
import { publicProcedure, router } from "../trpc.js";

export const companionRouter = router({
  tasks: publicProcedure
    .input(
      z.object({
        ownerId: z.string().uuid()
      })
    )
    .output(companionTaskListResponseSchema)
    .query(async ({ ctx, input }) => {
      const tasks = await ctx.prisma.companionTask.findMany({
        where: {
          circle: {
            ownerId: input.ownerId
          }
        },
        orderBy: { createdAt: "desc" }
      });

      return {
        tasks: tasks.map(mapCompanionTaskToDto)
      };
    })
});
