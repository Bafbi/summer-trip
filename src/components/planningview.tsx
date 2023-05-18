import { api } from "~/utils/api";
import dayjs from "dayjs";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import Head from "next/head";

const localizer = dayjsLocalizer(dayjs);

const PlanningView: React.FC<{ groupId: string }> = ({ groupId }) => {

  const { data: planningData } = api.planning.getEvents.useQuery({
    groupId,
  });

  const localizer = dayjsLocalizer(dayjs);

  return (
    <div className="h-full">
        <Calendar
          localizer={localizer}
          events={planningData ? 
            planningData.map((event) => {
            return {
              title: event.activity.place.name,
              start: event.start,
              end: event.end,
            };
            })
          : []
          }
          startAccessor="start"
          endAccessor="end"
        />
    </div>
  );
};

export default PlanningView;
