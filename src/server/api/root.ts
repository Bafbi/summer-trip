import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { groupRouter } from "./routers/group";
import { activityRouter } from "./routers/activity";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  group: groupRouter,
  activity: activityRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
