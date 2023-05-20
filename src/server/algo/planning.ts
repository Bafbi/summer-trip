import dayjs from "dayjs";
import { type } from "os";
import { prisma } from "~/server/db";
import { addPlanningEvents, type CalendarData } from "../utils/planning";
import { durees } from "./duree";

export const generatePlaning = async (groupID: string) => {
  const topRatedActivities = await prisma.activity.findMany({
    where: {
      groupId: groupID,
      Vote: {
        some: {
          vote: 1,
        },
      },
    },
    include: {
      Vote: true,
      place: {
        include: {
          types: true,
          location: true,
        },
      },
    },
    orderBy: {
      Vote: {
        _count: "desc",
      },
    },
  });

  if (topRatedActivities.length === 0) {
    throw new Error("No top rated activity found");
  }
  const typePriorities = [
    "tourist_attraction",
    "transit_station",
    "train_station",
    "taxi_stand",
    "subway_station",
    "store",
    "storage",
    "shoe_store",
    "roofing_contractor",
    "real_estate_agency",
    "primary_school",
    "post_office",
    "police",
    "plumber",
    "physiotherapist",
    "pharmacy",
    "pet_store",
    "parking",
    "painter",
    "moving_company",
    "movie_rental",
    "mosque",
    "meal_takeaway",
    "meal_delivery",
    "locksmith",
    "local_government_office",
    "liquor_store",
    "light_rail_station",
    "lawyer",
    "laundry",
    "insurance_agency",
    "hospital",
    "home_goods_store",
    "hardware_store",
    "hair_care",
    "gym",
    "gas_station",
    "funeral_home",
    "florist",
    "fire_station",
    "embassy",
    "electronics_store",
    "electrician",
    "drugstore",
    "doctor",
    "dentist",
    "courthouse",
    "convenience_store",
    "clothing_store",
    "city_hall",
    "church",
    "cemetery",
    "car_wash",
    "car_repair",
    "car_rental",
    "car_dealer",
    "bus_station",
    "book_store",
    "bicycle_store",
    "beauty_salon",
    "bar",
    "bank",
    "bakery",
    "atm",
    "art_gallery",
    "aquarium",
    "amusement_park",
    "airport",
    "accounting",
    "synagogue",
    "supermarket",
    "stadium",
    "spa",
    "shopping_mall",
    "secondary_school",
    "school",
    "rv_park",
    "night_club",
    "movie_theater",
    "lodging",
    "library",
    "jewelry_store",
    "hindu_temple",
    "furniture_store",
    "department_store",
    "cafe",
    "campground",
    "casino",
    "park",
    "university",
    "veterinary_care",
    "zoo",
    "restaurant",
    "museum",
  ];

  const topActivities = topRatedActivities.map((activity) => {
    const hours = activity.place.openingHours;
    const types = activity.place.types;
    let dureeTyp = 0;
    const sortedTypes = types?.sort((typeA, typeB) => {
      const priorityA = typePriorities.indexOf(typeA.category);
      const priorityB = typePriorities.indexOf(typeB.category);
      return priorityB - priorityA;
    });

    if (sortedTypes && sortedTypes[0]) {
      dureeTyp = durees[sortedTypes[0].category] || dureeTyp;
    }

    const { nom, type, lattitude, longitude, duree } = {
      nom: activity.place.name,
      type: activity.place.types,
      lattitude: activity.place.location?.lat,
      longitude: activity.place.location?.lng,
      duree: dureeTyp,
    };
    return { nom, type, lattitude, longitude, duree, id: activity.id };
  });

  console.log(type);
  const tmpPlanning: CalendarData[] = [];

  let currentDate = dayjs();

  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  topActivities.forEach((activity, index) => {
    // Wait between 1 and 3 hours before starting the activity
    currentDate = currentDate.add(randomInt(1, 3), "hours");

    // Adjust start time depending on the type of activity
    const isRestaurant = activity.type?.find(
      (type) => type.category === "restaurant"
    );
    const isPark = activity.type?.find((type) => type.category === "park");

    if (isRestaurant) {
      const currentHour = currentDate.hour();

      // If current hour is not within the desired range, adjust accordingly
      if (
        !(currentHour >= 12 && currentHour < 14) &&
        !(currentHour >= 19 && currentHour < 21)
      ) {
        // Set start time to the next nearest restaurant time slot
        if (currentHour < 12) {
          currentDate = currentDate.hour(12).minute(0);
        } else if (currentHour >= 14 && currentHour < 19) {
          currentDate = currentDate.hour(19).minute(0);
        } else {
          // If current time is past the evening slot, schedule the restaurant for the next day
          currentDate = currentDate.add(1, "day").hour(12).minute(0);
        }
      }
    } else if (isPark) {
      const currentHour = currentDate.hour();

      // If current hour is not within the desired range, adjust accordingly
      if (!(currentHour >= 10 && currentHour < 19)) {
        // Set start time to the next nearest park time slot
        if (currentHour < 10) {
          currentDate = currentDate.hour(10).minute(0);
        } else {
          // If current time is past the park time, schedule the park for the next day
          currentDate = currentDate.add(1, "day").hour(10).minute(0);
        }
      }
    }

    let start = currentDate?.toDate();

    let activityDurationInHours;
    if (typeof activity.duree === "number") {
      // Converting minutes to hours
      activityDurationInHours = activity.duree / 60;
    } else {
      throw new Error(`activity.duree is not a number: `);
    }

    let end = currentDate.add(activityDurationInHours, "hours")?.toDate();

    if (!end) {
      throw new Error(
        `end date could not be calculated for activity: ${activity.id}`
      );
    }

    // Check if the activity falls in sleeping hours, if so move it to next day morning
    if (currentDate.hour() >= 22 || currentDate.hour() < 6) {
      currentDate = currentDate.add(1, "day").hour(6).minute(0);
      start = currentDate.toDate();
      end = currentDate.add(activityDurationInHours, "hours").toDate();
    }

    tmpPlanning.push({
      start,
      end,
      activityId: activity.id,
    });

    currentDate = dayjs(end);
  });

  await addPlanningEvents(groupID, tmpPlanning);
};
