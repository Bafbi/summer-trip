import { createTRPCRouter, protectedProcedure } from "../trpc";

export const planningRouter = createTRPCRouter({
  
  getWeek: protectedProcedure.query(async ({ ctx }) => {
    // const week = await ctx.prisma.week.findMany({
    //   where: {
    //     userId: ctx.session?.user?.id,
    //   },
    // });
    // return week;
  }
  ),

});