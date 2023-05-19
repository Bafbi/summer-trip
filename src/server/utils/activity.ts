import { prisma } from "../db";
import { getActivityPhoto } from "./place";

export const getActivitiesByGroupId = async (groupId: string) => {
  const activities = await prisma.activity.findMany({
    where: {
      groupId: groupId,
    },
    include: {
      place: {
        include: {
          photos: {
            take: 1,
          },
          types: true,
          location: true,
        },
      },
      Vote: true,
      group: {
        select: {
          startDate: true,
          endDate: true,
        },
      }
    },
  });


  return activities;
};

export const addPhoto = async (photoId: string) => {
  const reference = await prisma.placePhoto.findUnique({
    where: {
      id: photoId,
    },
    select: {
      photoReference: true,
    },
  });

  if (!reference) {
    throw new Error("Photo not found");
  }

  const photo = (await getActivityPhoto(reference.photoReference)).toString("base64");

  await prisma.placePhoto.update({
    where: {
      id: photoId,
    },
    data: {
      blob : photo,
    },
  });

  return photo;
};
export const getTopLikedActivitiesByGroupId = async (groupId: string, limit: number) => {
  const activities = await prisma.activity.findMany({
    where: {
      groupId: groupId,
    },
    include: {
      place: {
        include: {
          photos: {
            take: 1,
          },
          types: true,
          location: true,
        },
      },
      Vote: {
        where: {
          vote: {
            equals: 1, // Vote positif
          },
        },
      },
      group: {
        select: {
          startDate: true,
          endDate: true,
        },
      },
    },
    orderBy: {
      Vote: {
        vote: 'desc', // Trier par vote décroissant
      },
    },
    take: limit, // Limiter le nombre de résultats
  });

  return activities;
};
