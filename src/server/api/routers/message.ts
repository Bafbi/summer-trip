import { z } from "zod";

import { pusher } from "~/server/pusher";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const messageRouter = createTRPCRouter({
  send: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      await ctx.prisma.message.create({
        data: {
          group: {
            connect: {
              id: input.groupId,
            },
          },
          sender: {
            connect: {
              id: ctx.session?.user?.id,
            },
          },
          content: input.content,
        },
      });
      await pusher.trigger(`chat-${input.groupId}`, 'message', input.content);
    }),

  getAll: protectedProcedure
  .input(z.object({ groupId: z.string() }))
  .query(({ input, ctx }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return ctx.prisma.message.findMany({
      where: {
        groupId: input.groupId,
      },
      select: {
        content: true,
        sender: {
          select: {
            name: true,
          },
        },
        createdAt: true,
      },
    });
  }),
});