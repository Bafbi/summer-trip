import dayjs from "dayjs";
import { CalendarData, addPlanningEvents } from "../utils/planning";
import { durees } from "./duree";
import { prisma } from "~/server/db";
import {randomInt} from "crypto";

export const generatePlaning = async (groupID:string) => {
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
      place: true,
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

  const topActivities = topRatedActivities.map((activity) => {
    const hours = activity.place.openingHours;
    const types = activity.place.types;
let dureeTyp = 0;
types?.forEach((type) => {
  dureeTyp = durees[type.category] || dureeTyp;
})

    const { nom, type, lattitude, longitude, duree } = {
      nom: activity.place.name,
      type: activity.place.types,
      lattitude: activity.place.location?.lat,
      longitude: activity.place.location?.lng,
      duree: dureeTyp,
    };
    return { nom, type, lattitude, longitude, duree, id: activity.id };
  });

  const tmpPlanning: CalendarData[] = [];
  
  let currentDate = dayjs();

  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  topActivities.forEach((activity, index) => {
    // Wait between 1 and 3 hours before starting the activity
    currentDate = currentDate.add(randomInt(1, 3), 'hours');
    let start = currentDate?.toDate();
    
    let activityDurationInHours;
    if (typeof activity.duree === 'number') {
      // Converting minutes to hours
      activityDurationInHours = activity.duree / 60;
    } else {
      throw new Error(`activity.duree is not a number: ${activity.duree}`);
    }
  
    let end = currentDate.add(activityDurationInHours, "hours")?.toDate();
      
    if (!end) {
      throw new Error(`end date could not be calculated for activity: ${activity.id}`);
    }
  
    // Check if the activity falls in sleeping hours, if so move it to next day morning
    if (currentDate.hour() >= 22 || currentDate.hour() < 6) {
      currentDate = currentDate.add(1, 'day').hour(6).minute(0);
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
}
