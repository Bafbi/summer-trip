import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  Calendar,
  type DayPropGetter,
  type EventProps,
  type HeaderProps,
  type ToolbarProps,
  type View,
  dayjsLocalizer,
} from "react-big-calendar";
import { api, type RouterOutputs } from "~/utils/api";

const localizer = dayjsLocalizer(dayjs);

const PlanningView: React.FC<{ groupId: string }> = ({ groupId }) => {
  const [events, setEvents] = useState<RouterOutputs["planning"]["getEvents"]>(
    []
  );

  const { data: planningData } = api.planning.getEvents.useQuery({
    groupId,
  });

  useEffect(() => {
    if (planningData) {
      setEvents(planningData);
    }
  }, [planningData]);

  const { mutate } = api.planning.generatePlaning.useMutation({
    onSuccess: (data) => {
      setEvents(data);
    },
  });

  const getDayProps: DayPropGetter = (date: Date) => {
    const isCurrentDay = dayjs(date).isSame(new Date(), "day");
    const backgroundColor = isCurrentDay ? "#E49A0A" : "";
    const textColor = isCurrentDay ? "#000000" : "#E49A0A";

    return {
      style: {
        backgroundColor: backgroundColor,
        color: textColor,
      },
    };
  };

  const CustomTimeSlotWrapper = () => {
    return <div>{/* Contenu personnalisé du TimeSlotWrapper */}</div>;
  };

  const CustomTimeGutterWrapper = () => {
    const hours = [];
    const startHour = 8; // Heure de début (7h du matin)
    const endHour = 23; // Heure de fin (23h)

    for (let hour = startHour; hour <= endHour; hour++) {
      const formattedHour = dayjs().hour(hour).format("HH"); // Formate l'heure au format HH:mm
      hours.push(formattedHour);
    }

    return (
      <div className="grid-rows-24 grid gap-y-6 p-3">
        {hours.map((hour, index) => (
          <div key={index} className="row-span-1 text-primary">
            {`${hour}h`}
          </div>
        ))}
      </div>
    );
  };

  const CustomTimeGutterHeader = () => {
    return <div className="w-11"></div>;
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="relative h-full flex-grow">
        <Calendar
          localizer={localizer}
          events={events.map((event) => {
            return {
              title: event.activity.place.name,
              start: event.start,
              end: event.end,
            };
          })}
          defaultView="week"
          toolbar={true}
          views={{
            month: false,
            week: true,
            day: true,
            agenda: true,
          }}
          components={{
            toolbar: CustomToolbar,
            timeSlotWrapper: CustomTimeSlotWrapper,
            timeGutterHeader: CustomTimeGutterHeader,
            timeGutterWrapper: CustomTimeGutterWrapper,

            week: {
              header: CustomWeekView,
            },
            day: {
              header: CustomDayView,
            },
            agenda: {
           
              event: CustomAgendaEvent,
              
                
            },
          }}
          dayPropGetter={getDayProps}
          min={dayjs().hour(7).toDate()} // Définir l'heure minimale à 7h du matin
          max={dayjs().hour(23).toDate()} // Définir l'heure maximale à 23h
        />
      </div>
      <div className="sticky bottom-10 pl-60">
        <button
          className="rounded-md bg-[#1E5552] bg-opacity-80 px-4 pb-2  text-[#E49A0A]"
          onClick={() => mutate({ groupId })}
        >
          New planning
        </button>
      </div>
    </div>
  );
};

const CustomToolbar = (toolbarProps: ToolbarProps) => {
  return (
    <div className="flex items-center justify-between bg-[#E49A0A] px-4 py-2">
      <div className="text-sm font-bold">{toolbarProps.label}</div>
      <div className="flex space-x-2">
        {(toolbarProps.views as View[]).map((view) => (
          <button
            key={view}
            className="rounded-md bg-[#1E5552] px-3 py-1 text-[#E49A0A] hover:text-[#1CCDB3]"
            onClick={() => toolbarProps.onView(view)}
          >
            {view}
          </button>
        ))}
        <button
          className="rounded-md bg-[#1E5552] px-3 py-1 text-[#E49A0A] hover:text-[#1CCDB3]"
          onClick={() => toolbarProps.onNavigate("PREV")}
        >
          &lt;
        </button>
        <button
          className="rounded-md bg-[#1E5552] px-3 py-1 text-[#E49A0A] hover:text-[#1CCDB3]"
          onClick={() => toolbarProps.onNavigate("NEXT")}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

const CustomWeekView = (headerProps: HeaderProps) => {
  const formattedDate = dayjs(headerProps.date).format("dddd");
  const shortDay = formattedDate.substring(0, 3);

  return <div className="mb-2 font-bold">{shortDay}</div>;
};

const CustomDayView = (headerProps: HeaderProps) => {
  const formattedDate = dayjs(headerProps.date).format("MMMM Do, YYYY");
  return (
    <div className="p-4">
      <div className="mb-2 font-bold">{formattedDate}</div>
    </div>
  );
};

const CustomAgendaEvent = (eventProps: EventProps) => {
  return (
    <div className="rounded-md border border-[#E49A0A] bg-[#E49A0A] p-2 text-[#1E5552]">
      <span className="font-bold">
        {eventProps.event.title?.toLocaleString()}
      </span>
    </div>
  );
};


export default PlanningView;
