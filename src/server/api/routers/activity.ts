import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  getNewAtivity: publicProcedure
    .input(z.object({ groupId: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.groupId}`,
      };
    }),

  rateActivity: protectedProcedure
    .input(z.object({ activityId: z.string(), rating: z.number() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.vote.create({
        data: {
          activity: {
            connect: {
              id: input.activityId,
            },
          },
          user: {
            connect: {
              id: ctx.session?.user?.id,
            },
          },
          vote: input.rating,
        },
      });
    }),

});
