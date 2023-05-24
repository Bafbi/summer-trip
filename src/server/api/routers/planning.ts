import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { generatePlaning } from "~/server/algo/planning";

export const planningRouter = createTRPCRouter({
  getEvents: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.prisma.planning.findMany({
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
    }),

  generatePlaning: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await generatePlaning(input.groupId);
      return ctx.prisma.planning.findMany({
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
    }),
});
