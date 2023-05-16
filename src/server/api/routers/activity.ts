import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { addPhoto, getActivitiesByGroupId } from "~/server/utils/activity";

export const activityRouter = createTRPCRouter({
  rateActivity: protectedProcedure
    .input(z.object({ activityId: z.string(), rating: z.number() }))
    .mutation(({ input, ctx }) => {
      return prisma.vote.create({
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
    .query(({ input, ctx }) => {
      return getActivitiesByGroupId(input.groupId);
    }),

  getMainPhoto: protectedProcedure
    .input(z.object({ activityId: z.string() }))
    .query(async ({ input }) => {
      const activity = await prisma.activity.findUnique({
        where: {
          id: input.activityId,
        },
        include: {
          place: {
            select: {
              photos: {
                take: 1,
              }
            }, 
          },
        },
      });

      if (!activity) {
        throw new Error("Activity not found");
      }

      if (!activity.place.photos[0]) {
        throw new Error("Photo not found");
      }

      if (activity.place.photos[0].blob) return activity.place.photos[0].blob as string;

      const blob = await addPhoto(activity.place.photos[0].id);

      return blob;
    }
  ),
});
