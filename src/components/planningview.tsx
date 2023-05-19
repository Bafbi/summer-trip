import { api } from "~/utils/api";
import dayjs from "dayjs";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import Head from "next/head";
import { FaTimes } from "react-icons/fa";

const localizer = dayjsLocalizer(dayjs);

const PlanningView: React.FC<{ groupId: string }> = ({ groupId }) => {

  const { data: planningData } = api.planning.getEvents.useQuery({
    groupId,
  });

  const {mutate} = api.planning.generatePlaning.useMutation({
    onSuccess: () => {
      console.log("Planning généré");
    },
  });


  return (
      <main className="h-full">
        <button className="w-24 h-24 rounded-full bg-[#1E5552] text-white flex justify-center items-center"
          onClick={() => mutate({groupId})}
        >
          <FaTimes className="h-8 w-8" />
        </button>
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
      </main>
  );
};

export default PlanningView;
