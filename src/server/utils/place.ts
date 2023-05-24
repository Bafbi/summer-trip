import { maps } from "~/server/map";
import { env } from "~/env.mjs";
import { map } from "@trpc/server/observable";
import { Stream } from "stream";

// get activity by location with google place api
export const findNewActivities = async (coordinates: {lat: number, lng: number}) => {

  const types = ["restaurant|bar|night_club", "museum|amusement_park|bowling_alley"];

  const placePromises = types.flatMap((type) => {
    return maps.placesNearby({
      params: {
        location: `${coordinates.lat},${coordinates.lng}`,
        radius: 10000,
        keyword: type,
        key: env.GOOGLE_PLACES_API_KEY,
      },
    });
  });

  const places = await Promise.all(placePromises);

  const activities = places.flatMap((place) => place.data.results);

  // use half of the activities
  const half = Math.ceil(activities.length / 2);
  const randomActivities = activities.sort(() => 0.5 - Math.random()).slice(0, half);


  if (!activities) {
    throw new Error("No activities found");
  }

  console.log(activities);
  

  return randomActivities;
};

// get location by place name with google geocode api
export const getLocation = async (placeName: string) => {
  const coordinates = await maps.geocode({
    params: {
      address: placeName,
      key: env.GOOGLE_PLACES_API_KEY,
    },
  });

  if (coordinates.data.status !== "OK") {
    throw new Error("City not found");
  }
  if (!coordinates.data.results[0]) {
    throw new Error("City not found");
  }
  const { lat, lng } = coordinates.data.results[0].geometry.location;
  return { lat, lng };
}

// get details of activity by place id with google place api
export const getActivityDetails = async (placeId: string) => {
  const activity = await maps.placeDetails({
    params: {
      place_id: placeId,
      key: env.GOOGLE_PLACES_API_KEY,
    },
  });

  if (activity.data.status !== "OK") {
    throw new Error("Activity not found");
  }

  return activity.data.result;
}

// get photo of activity by photo reference with google place api
export const getActivityPhoto = async (photoReference: string) => {
  const photo = await maps.placePhoto({
    params: {
      photoreference: photoReference,
      maxheight: 800,
      maxwidth: 800,
      key: env.GOOGLE_PLACES_API_KEY,
    },
    responseType: 'arraybuffer',
  });

  if (photo.status !== 200) {
    throw new Error("Photo not found");
  }

  return photo.data as Buffer;
}
