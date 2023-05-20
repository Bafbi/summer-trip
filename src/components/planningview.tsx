import { Calendar, EventProps, HeaderProps, dayjsLocalizer, DayPropGetter } from "react-big-calendar";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { type RouterOutputs, api } from "~/utils/api";

const localizer = dayjsLocalizer(dayjs);

const PlanningView: React.FC<{ groupId: string }> = ({ groupId }) => {
  
  const [events, setEvents] = useState<RouterOutputs["planning"]["getEvents"]>([]);

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
    const isCurrentDay = dayjs(date).isSame(new Date(), 'day');
    const backgroundColor = isCurrentDay ? '#E49A0A' : ''; // Set the color for the current day
    
    return {
      style: {
        backgroundColor: backgroundColor
      }
    };
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="h-full flex-grow relative">
        <Calendar
          localizer={localizer}
          events={events.map((event) => {
            return {
              title: event.activity.place.name,
              start: event.start,
              end: event.end,
            }
          })}
          defaultView='week'
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
      <div className="bottom-10 pl-60 sticky">
        <button className="bg-[#1E5552] bg-opacity-80 text-[#E49A0A] px-4 pb-2  rounded-md" onClick={() => mutate({groupId})}>
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
    <div className="flex justify-between items-center bg-[#E49A0A] px-4 py-2">
      <div className="text-sm font-bold">{label}</div>
      <div className="space-x-2 flex">
        {views.map((view) => (
          <button
            key={view}
            className="px-3 py-1 rounded-md bg-[#1E5552] text-[#E49A0A] hover:text-[#1CCDB3]"
            onClick={() => onView(view)}
          >
            {view}
          </button>
        ))}
        <button
          className="px-3 py-1 rounded-md bg-[#1E5552] text-[#E49A0A] hover:text-[#1CCDB3]"
          onClick={() => onNavigate("PREV")}
        >
          &lt;
        </button>
        <button
          className="px-3 py-1 rounded-md bg-[#1E5552] text-[#E49A0A] hover:text-[#1CCDB3]"
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

  return (
    <div className="text-gray-800 font-bold my-2 text-sm">{shortDay}</div>
  );
};

// Composant personnalisé pour l'en-tête de la journée
const CustomDayView = (headerProps: HeaderProps) => {
  const formattedDate = dayjs(headerProps.date).format("MMMM Do, YYYY");
  return (
    <div className="p-4">
      <div className="text-gray-800 font-bold mb-2">{formattedDate}</div>
    </div>
  );
};

// Composant personnalisé pour les événements de l'agenda
// Composant personnalisé pour les événements de l'agenda
const CustomAgendaEvent = (eventProps: EventProps) => {
  return (
    <div className="p-2 bg-[#E49A0A] text-[#1E5552] border border-[#E49A0A] rounded-md">
      <span className="font-bold">{eventProps.event.title?.toLocaleString()}</span>
    </div>
  );
};


export default PlanningView;
