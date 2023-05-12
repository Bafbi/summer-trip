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

  likeActivity: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  dislikeActivity: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

});
