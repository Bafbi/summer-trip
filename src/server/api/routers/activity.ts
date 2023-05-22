import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure
} from "~/server/api/trpc";
import { getActivitiesByGroupId } from "~/server/utils/activity";
import { getActivityPhoto } from "~/server/utils/place";

export const activityRouter = createTRPCRouter({
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

  getActivitiesByGroupId: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .query(({ input }) => {
      return getActivitiesByGroupId(input.groupId);
    }),

  getActivityToRate: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const activities = await ctx.prisma.activity.findMany({
        where: {
          groupId: input.groupId,
          Vote: {
            none: {
              user: {
                id: ctx.session?.user?.id,
              },
            },
          },
        },
        include: {
          place: {
            include: {
              types: true,
              photos: {
                take: 1,
                where: {
                  main: true,
                },
              },
            },
          },
        },
        
      });

      const activity = activities[Math.floor(Math.random() * activities.length)];
      

      if (!activity) {
        throw new Error("No activity to rate");
      }

      if (!activity.place.photos[0]) {
        throw new Error("Photo not found");
      }

      const photo = (await getActivityPhoto(
        activity.place.photos[0].photoReference
      )).toString("base64");

      return {
        ...activity,
        photo,
      };
    }),
    getActivitiesWithVotes: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ input, ctx }) => {
      const activities = await ctx.prisma.activity.findMany({
        where: {
          groupId: input.groupId,
        },
        include: {
          place: true,
          Vote: {
            where: {
              vote: {
                gt: 0,
              },
            },
          },
        },
      });

      return activities.map(activity => ({
        ...activity,
        voteCount: activity.Vote.length,
      }));
    }),

});
