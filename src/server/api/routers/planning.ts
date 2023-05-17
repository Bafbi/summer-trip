import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const planningRouter = createTRPCRouter({
  
  getEvents: protectedProcedure
  .input(z.object({ groupId: z.string() }))
  .query(async ({input, ctx }) => {
    const events = await ctx.prisma.planning.findMany({
      where: {
        groupId: input.groupId,
      },
      select: {
        id: true,
        start: true,
        end: true,
        activity: {
          select: {
            place: {
              select: {
                name: true,
              },
            },
          },
        },
      },

    });

    return events;
  }
  ),

});