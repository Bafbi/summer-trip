import { Client } from "@googlemaps/google-maps-services-js";
import { env } from "~/env.mjs";

const globalForMaps = globalThis as unknown as {
  maps: Client | undefined;
};

export const maps =
  globalForMaps.maps ??
  new Client();

if (env.NODE_ENV !== "production") globalForMaps.maps = maps;
