import { Prisma } from "@prisma/client";
import { type } from "os";
import { getActivitiesByGroupId } from "../utils/activity";
import { durees } from "./duree";

async function generateTabActivity(groupID:string) {
  const activities = await getActivitiesByGroupId(groupID);
  const TabAct = activities.map((activity) => {
    const hours = activity.place.openingHours;
    const types = activity.place.types;
    let dureeTyp;
    types.forEach((type) => {
      dureeTyp = durees[type.category];
    })
    const { nom, type, lattitude, longitude, duree } = {
      nom: activity.place.name,
      type: activity.place.types, // Remplacez "type d'activité" par la propriété correspondante de l'objet activity.place.types
      lattitude: activity.place.location?.lat, // Remplacez "[valeur de la latitude]" par la propriété correspondante de l'objet activity.place.location
      longitude: activity.place.location?.lng, // Remplacez "[valeur de la longitude]" par la propriété correspondante de l'objet activity.place.location
      duree: dureeTyp,
    };
    return { nom, type, lattitude, longitude, duree };
  });

  return TabAct;
}


/*
async function generateTabActivity(groupID:string){
    const activities = await getActivitiesByGroupId(groupID);
    // const likedActivities = activities.filter((activity) => activity.Vote === 1);
    activities.forEach((activity) => {
      const location = activity.place.location;
      const lat = location?.lat;  
      const lng = location?.lng;
      const types = activity.place.types;
      let duree;
      types.forEach((type) => {
        duree = durees[type.category];
      })
      const prix = activity.place.priceLevel;
    });
}
*/
