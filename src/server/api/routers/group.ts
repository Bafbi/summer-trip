import {
  PlacePhoto,
  type AddressType,
  OpeningHours,
  PlaceData,
} from "@googlemaps/google-maps-services-js";
import { writeFile } from "fs";
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

      // writeFile("/coordinates.json", JSON.stringify(coordinates), (err) => {
      //   if (err) {
      //     console.log(err);
      //   }
      // });

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

      // writeFile("/near.jsontest", JSON.stringify(activities), (err) => {
      //   if (err) {
      //     console.log(err);
      //   }
      // });

      const places = activities.map((a) => {
        if (!a) {
          throw new Error("Activity not found");
        }
        if (!a.geometry) {
          throw new Error("Activity not found");
        }

        if (!a.types) {
          throw new Error("Activity not found");
        }

        const types = a.types?.map((type) => {
          return {
            category: type.toString(),
          };
        });

        if (!a.photos) {
          throw new Error("Activity not found");
        }
        if (!a.photos[0]) {
          throw new Error("Activity not found");
        }
        const photo = a.photos[0];

        return {
          placeId: a.place_id,
          name: a.name,
          location: {
            create: {
              lat: a.geometry.location.lat,
              lng: a.geometry.location.lng,
            },
          },
          businessStatus: a.business_status,
          formattedAddress: a.formatted_address,
          internationalPhoneNumber: a.international_phone_number,
          rating: a.rating,
          userRatingsTotal: a.user_ratings_total,
          priceLevel: a.price_level,
          types: {
            createMany: {
              data: types,
            },
          },
          photos: {
            create: {
              photoReference: photo.photo_reference,
              height: photo.height,
              width: photo.width,
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
          json: JSON.stringify(a),
        };
      });

      await prisma.place.createMany({
        data: places,
        skipDuplicates: true,
      });
    }),
});

const createTypesRows = (placeId: string, types: AddressType[]) => {
  const typesData = types.map((type) => {
    return {
      category: type.toString(),
      place: {
        connect: {
          placeId: placeId,
        },
      },
    };
  });
  return prisma.type.createMany({
    data: typesData,
    skipDuplicates: true,
  });
};

const createPhotosRows = (photos: {data: PlacePhoto[], placeId: string}[]) => {
  // convert photos array to array of objects with placeId and photoData
  const photosData = photos.map(({data, placeId}) => {
    
  

  const photosData = photos.map(({data, placeId}) => {

    return {
      photoReference: data.photo_reference,
      height: data.height,
      width: photo.width,
      place: {
        connect: {
          placeId: placeId,
        },
      },
    };
  });
  return prisma.placePhoto.createMany({
    data: photosData,
    skipDuplicates: true,
  });
};

const createPlaceRow = (places: Partial<PlaceData>[]) => {
  const placesData = places.map((place) => {
    return {
      placeId: place.place_id,
      name: place.name,





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
