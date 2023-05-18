import { createTRPCRouter } from "~/server/api/trpc";
import { groupRouter } from "./routers/group";
import { activityRouter } from "./routers/activity";
import { messageRouter } from "./routers/message";
import { planningRouter } from "./routers/planning";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  group: groupRouter,
  activity: activityRouter,
  message: messageRouter,
  planning: planningRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
