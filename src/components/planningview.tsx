import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  Calendar,
  DayPropGetter,
  EventProps,
  HeaderProps,
  ToolbarProps,
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
    onSuccess: (updatePlanningData) => {
      console.log(updatePlanningData);
    },
  });

  const getDayProps: DayPropGetter = (date: Date) => {
    const isCurrentDay = dayjs(date).isSame(new Date(), "day");
    const backgroundColor = isCurrentDay ? "#E49A0A" : ""; // Set the color for the current day

    return {
      style: {
        backgroundColor: backgroundColor,
      },
    };
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

// Composant personnalisé pour la barre d'outils
const CustomToolbar = (toolbarProps: ToolbarProps) => {
  const { label, onView, onNavigate, views } = toolbarProps;

  return (
    <div className="flex items-center justify-between bg-[#E49A0A] px-4 py-2">
      <div className="text-sm font-bold">{label}</div>
      <div className="flex space-x-2">
        {views.map((view) => (
          <button
            key={view}
            className="rounded-md bg-[#1E5552] px-3 py-1 text-[#E49A0A] hover:text-[#1CCDB3]"
            onClick={() => onView(view)}
          >
            {view}
          </button>
        ))}
        <button
          className="rounded-md bg-[#1E5552] px-3 py-1 text-[#E49A0A] hover:text-[#1CCDB3]"
          onClick={() => onNavigate("PREV")}
        >
          &lt;
        </button>
        <button
          className="rounded-md bg-[#1E5552] px-3 py-1 text-[#E49A0A] hover:text-[#1CCDB3]"
          onClick={() => onNavigate("NEXT")}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

// Composant personnalisé pour l'en-tête de la semaine
const CustomWeekView = (headerProps: HeaderProps) => {
  const formattedDate = dayjs(headerProps.date).format("dddd");
  const shortDay = formattedDate.substring(0, 3);

  return <div className="my-2 text-sm font-bold text-gray-800">{shortDay}</div>;
};

// Composant personnalisé pour l'en-tête de la journée
const CustomDayView = (headerProps: HeaderProps) => {
  const formattedDate = dayjs(headerProps.date).format("MMMM Do, YYYY");
  return (
    <div className="p-4">
      <div className="mb-2 font-bold text-gray-800">{formattedDate}</div>
    </div>
  );
};

// Composant personnalisé pour les événements de l'agenda
// Composant personnalisé pour les événements de l'agenda
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
