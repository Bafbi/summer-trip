import { Type, type Prisma } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import {
  findNewActivities,
  getActivityPhoto,
  getLocation,
} from "../../utils/place";
import dayjs from "dayjs";

export const groupRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.group.findMany({
      where: {
        members: {
          some: {
            id: ctx.session?.user?.id,
          },
        },
      },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.group.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        location: z.string(),
        start: z.date(),
        end: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const coordinates = await getLocation(input.location);

        const group = await ctx.prisma.group.create({
          data: {
            name: input.name,
            description: input.description,
            destination: input.location,
            startDate: input.start,
            endDate: input.end,
            location: {
              create: {
                lat: coordinates.lat,
                lng: coordinates.lng,
              },
            },
            members: {
              connect: {
                id: ctx.session?.user?.id,
              },
            },
          },
        });

        const activities = await findNewActivities(coordinates);

        const typePromises = activities.flatMap((activity) => {
          if (!activity.types) {
            return [];
          }

          return activity.types.map((type) => {
            return ctx.prisma.type.upsert({
              where: {
                category: type.toString(),
              },
              create: {
                category: type.toString(),
              },
              update: {
                category: type.toString(),
              },
            });
          });
        });

        const photosPromises = activities.flatMap((activity) => {
          if (!activity.photos) {
            return [];
          }

          return activity.photos.map((photo) => {
            return ctx.prisma.placePhoto.create({
              data: {
                photoReference: photo.photo_reference,
                width: photo.width,
                height: photo.height,
                main: true,
              },
            });
          });
        });

        const createdPhotos = await Promise.all(photosPromises);
        const createdTypes = await Promise.all(typePromises);

        for (let i = 0; i < activities.length; i++) {
          const activity = activities[i];
          const photo = createdPhotos[i];

          if (!activity || !activity.types || !activity.geometry || !photo) {
            continue;
          }

          const types = createdTypes.filter((type) => {
            return activity.types?.some((activityType) => {
              return type.category === activityType;
            });
          });

          const place = await ctx.prisma.place.create({
            data: {
              placeId: activity.place_id,
              name: activity.name,
              vicinity: activity.vicinity,
              businessStatus: activity.business_status,
              rating: activity.rating,
              userRatingsTotal: activity.user_ratings_total,
              priceLevel: activity.price_level,
              formattedAddress: activity.formatted_address,
              internationalPhoneNumber: activity.international_phone_number,
              website: activity.website,
              url: activity.url,
              openingHours:
                activity.opening_hours as unknown as Prisma.JsonObject,
              json: activity as unknown as Prisma.JsonObject,
              location: {
                create: {
                  lat: activity.geometry.location.lat,
                  lng: activity.geometry.location.lng,
                },
              },
              photos: {
                connect: {
                  id: photo.id,
                },
              },
              types: {
                connect: types.map((type) => {
                  return { id: type.id };
                }),
              },
              activity: {
                create: {
                  group: {
                    connect: {
                      id: group.id,
                    },
                  },
                },
              },
            },
          });
        }
      } catch (error) {
        // Handle errors appropriately
        console.error(error);
        throw new Error(
          "An error occurred during group creation and activity fetching."
        );
      }
    }),

  getMembers: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.group.findUnique({
        where: {
          id: input.groupId,
        },
        select: {
          members: true,
        },
      });
    }),

  addMember: protectedProcedure
    .input(z.object({ groupId: z.string(), userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const group = await ctx.prisma.group.findUnique({
        where: {
          id: input.groupId,
        },
        select: {
          members: true,
        },
      });

      if (!group) {
        throw new Error("Group not found");
      }

      const isMember = group.members.some((member) => {
        return member.id === input.userId;
      });

      if (isMember) {
        throw new Error("User is already a member of this group");
      }

      await ctx.prisma.group.update({
        where: {
          id: input.groupId,
        },
        data: {
          members: {
            connect: {
              id: input.userId,
            },
          },
        },
      });
    }),

  removeMember: protectedProcedure
    .input(z.object({ groupId: z.string(), userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const group = await ctx.prisma.group.findUnique({
        where: {
          id: input.groupId,
        },
        select: {
          members: true,
        },
      });

      if (!group) {
        throw new Error("Group not found");
      }

      const isMember = group.members.some((member) => {
        return member.id === input.userId;
      });

      if (!isMember) {
        throw new Error("User is not a member of this group");
      }

      await ctx.prisma.group.update({
        where: {
          id: input.groupId,
        },
        data: {
          members: {
            disconnect: {
              id: input.userId,
            },
          },
        },
      });
    }),

  generateInvitationLink: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.inviteLink.create({
        data: {
          group: {
            connect: {
              id: input.groupId,
            },
          },
          link:
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15),
          expiresAt: dayjs().add(1, "day").toDate(),
          maxUses: 99,
        },
      });
    }),

  getInvitationLinks: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.prisma.inviteLink.findMany({
        where: {
          groupId: input.groupId,
        },
      });
    }),

  getGroupByInvitationLink: protectedProcedure
    .input(z.object({ link: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.prisma.inviteLink.findUnique({
        where: {
          link: input.link,
        },
        select: {
          group: {
            select: {
              name: true,
            },
          }
        },
      });
    }),

  useInvitationLink: protectedProcedure
    .input(z.object({ link: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const link = await ctx.prisma.inviteLink.findUnique({
        where: {
          link: input.link,
        },
      });

      if (!link) {
        throw new Error("Link not found");
      }

      if (link.used >= link.maxUses || link.expiresAt < new Date()) {
        throw new Error("Link expired");
      }

      await ctx.prisma.inviteLink.update({
        where: {
          link: input.link,
        },
        data: {
          used: link.used + 1,
        },
      });

      await ctx.prisma.group.update({
        where: {
          id: link.groupId,
        },
        data: {
          members: {
            connect: {
              id: ctx.session?.user?.id,
            },
          },
        },
      });
    }),
});
