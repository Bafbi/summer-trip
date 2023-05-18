import { prisma } from "../db";

export type CalendarData = {
  start: Date;
  end: Date;
  activityId: string;
};

export const addPlanningEvents = async (
  groupId: string,
  events: CalendarData[]
) => {
  await prisma.planning.deleteMany({
    where: {
      groupId: groupId,
    },
  });
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