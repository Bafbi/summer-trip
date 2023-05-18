import { prisma } from "../db";

export const addPlanningEvents = async (
  groupId: string,
  events: {
    start: Date;
    end: Date;
    activityId: string;
  }[]
) => {
  await prisma.planning.createMany({
    data: events.map((event) => {
      return {
        groupId: groupId,
        start: event.start,
        end: event.end,
        activityId: event.activityId,
      };
    }),
  });
}