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
      const message = await ctx.prisma.chat.create({
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
      await pusher.trigger(`chat-${input.groupId}`, 'message', message.id);
    }),

  getAll: protectedProcedure
  .input(z.object({ groupId: z.string() }))
  .query(({ input, ctx }) => {
    return ctx.prisma.chat.findMany({
      where: {
        groupId: input.groupId,
      },
      select: {
        content: true,
        sender: {
          select: {
            name: true,
            image: true,
          },
        },
        createdAt: true,
      },
    });
  }),

  getChatMessage: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.chat.findUnique({
        where: {
          id: input.id,
        },
        select: {
          content: true,
          sender: {
            select: {
              name: true,
              image: true,
            },
          },
          createdAt: true,
        },
      });
    }
    ),
});