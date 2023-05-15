import { z } from "zod";

import { env } from "~/env.mjs";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { maps } from "~/server/map";

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
      })
    )
    .mutation(async ({ input, ctx }) => {
      const coordinates = await maps.geocode({
        params: {
          address: input.location,
          key: env.GOOGLE_PLACES_API_KEY,
        },
      });

      if (coordinates.data.status !== "OK") {
        throw new Error("City not found");
      }
      if (!coordinates.data.results[0]) {
        throw new Error("City not found");
      }

      const group = await ctx.prisma.group.create({
        data: {
          name: input.name,
          description: input.description,
          destination: input.location,
          location: {
            create: {
              lat: coordinates.data.results[0]?.geometry.location.lat,
              lng: coordinates.data.results[0]?.geometry.location.lng,
            },
          },
          members: {
            connect: {
              id: ctx.session?.user?.id,
            },
          },
        },
      });

      const activities = await findNewActivities(
        `${coordinates.data.results[0]?.geometry.location.lat},${coordinates.data.results[0]?.geometry.location.lng}`
      );

      activities.map(async (activity) => {
        if (!activity.types) return;
        if (!activity.geometry) return;
        if (!activity.photos) return;
        if (!activity.photos[0]) return;

        const types = await prisma.$transaction(
          activity.types.map((type) => {
            return prisma.type.upsert({
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
          })
        );

        await ctx.prisma.place.create({
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
            json: JSON.stringify(activity),
            location: {
              create: {
                lat: activity.geometry.location.lat,
                lng: activity.geometry.location.lng,
              },
            },
            types: {
              connect: types.map((type) => {
                return { id: type.id };
              }),
            },
            photos: {
              create: {
                photoReference: activity.photos[0]?.photo_reference,
                height: activity.photos[0]?.height,
                width: activity.photos[0]?.width,
              },
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
    }),
});

// get activity by location with google place api
const findNewActivities = async (location: string) => {
  const cityCode = await maps.geocode({
    params: {
      address: location,
      key: env.GOOGLE_PLACES_API_KEY,
    },
  });

  if (cityCode.data.status !== "OK") {
    throw new Error("City not found");
  }
  if (!cityCode.data.results[0]) {
    throw new Error("City not found");
  }
  const { lat, lng } = cityCode.data.results[0].geometry.location;

  const activity = await maps.placesNearby({
    params: {
      location: `${lat},${lng}`,
      radius: 10000,
      type: "tourist_attraction",
      key: env.GOOGLE_PLACES_API_KEY,
    },
  });

  if (activity.data.status !== "OK") {
    throw new Error("Activity not found");
  }

  return activity.data.results;
};
