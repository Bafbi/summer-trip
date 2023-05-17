import { env } from "~/env.mjs";
import Pusher from "pusher-js";

const globalForPusher = globalThis as unknown as {
  pusher: Pusher | undefined;
};

export const pusher =
  globalForPusher.pusher ??
  new Pusher(env.PUSHER_KEY, {
    cluster: env.PUSHER_CLUSTER,
    enabledTransports: ["ws"],
    forceTLS: true,
  });

if (env.NODE_ENV !== "production") globalForPusher.pusher = pusher;
