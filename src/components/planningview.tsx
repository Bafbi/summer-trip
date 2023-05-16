import { api } from "~/utils/api";
import dayjs from "dayjs";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import Head from "next/head";

const localizer = dayjsLocalizer(dayjs);

const PlanningView = (props: { groupId: string }) => {
  const groupId = props.groupId;

  const { data: groupData, isLoading: groupLoading } =
    api.group.getById.useQuery({ id: groupId });

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <Calendar
            localizer={localizer}
            events={[
              {
                title: "My event",
                start: new Date(),
                end: dayjs().add(1, "hour").toDate(),
              },
            ]}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 1500 }}

          />
        </h1>
      </div>
    </div>
  );
};

export default PlanningView;