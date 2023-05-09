import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const groupRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.group.findMany({
      where: {
        members: {
          some: {
            id: ctx.session?.user?.id
          }
        }
      },
      select: {
        id: true
      }
    });
  }),

  // like: protectedProcedure.query(({ input, ctx }) => {
  //   return ctx.prisma.group.update({
  //     where: {
  //       id: input.id
  //     },
  //     data: {
  //       likes: {
  //         connect: {
  //           id: ctx.session?.user?.id
  //         }
  //       }
  //     }
  //   });
  // }),

  
});
