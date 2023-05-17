import { api } from "~/utils/api";
import dayjs from "dayjs";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import Head from "next/head";

const localizer = dayjsLocalizer(dayjs);

const PlanningView = (props: { groupId: string }) => {
  const groupId = props.groupId;

  const { data: groupData, isLoading: groupLoading } =
    api.group.getById.useQuery({ id: groupId });

  const localizer = dayjsLocalizer(dayjs);

  return (
    <div className="h-full">
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
        />
    </div>
  );
};

export default PlanningView;
