import { Type, type Prisma, Place } from "@prisma/client";
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
        // Get the coordinates of the location
        const coordinates = await getLocation(input.location);

        // Create the group
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

        // Find new activities near the location
        const activities = await findNewActivities(coordinates);

        // Mapping types to the activities
        // [{ category: "restaurant", index: [0,1] }, { category: "bar", index: 0}]
        const typesMapping = activities.flatMap((activity, index) => {
          if (!activity.types) {
            return [];
          }
          return activity.types.map((type) => {
            return {
              category: type.toString(),
              index,
            };
          });
        });

        // Get the types of the activities
        const types = await ctx.prisma.type.findMany({
          where: {
            category: {
              in: typesMapping.map((type) => type.category),
            },
          },
        });

        // Create the types that don't exist
        const typesToCreate = typesMapping.filter((type) => {
          return !types.find((t) => t.category === type.category);
        });
        await ctx.prisma.type.createMany({
          data: typesToCreate.map((type) => {
            return {
              category: type.category,
            };
          }),
        });

        // Get the types again
        const allTypes = await ctx.prisma.type.findMany({
          where: {
            category: {
              in: typesMapping.map((type) => type.category),
            },
          },
        });

        // Create the photos of the activities
        const photoPromises = activities.flatMap((activity, index) => {
          if (!activity.photos || !activity.photos[0]) {
            return [];
          }
          return ctx.prisma.placePhoto.create({
            data: {
              photoReference: activity.photos[0].photo_reference,
              height: activity.photos[0].height,
              width: activity.photos[0].width,
              main: true,
            },
          });
        });

        const createdPhotos = await ctx.prisma.$transaction(photoPromises);

        // Create the places of the activities
        const placePromises = activities.map((activity, index) => {
          const photo = createdPhotos[index];

          if (!activity || !activity.types || !activity.geometry || !photo) {
            return null;
          }

          const types = allTypes.filter((type) => {
            return activity.types?.some((activityType) => {
              return type.category === activityType;
            });
          });

          return ctx.prisma.place.create({
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
        });

        //remove nulls
        const places = placePromises.filter((place) => place !== null) as Prisma.Prisma__PlaceClient<Place, never>[];

        await ctx.prisma.$transaction(places);

        return group;
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
          },
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
