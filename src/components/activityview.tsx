import React, { useState } from "react";
import { type Activity } from "@prisma/client";
import { api } from "~/utils/api";

const ActivityComponent: React.FC<{ groupId: string }> = ({ groupId }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  
  const { data: activityData } = api.activity.getActivitiesByGroupId.useQuery({
    groupId,
  });
  

  // useEffect(() => {
  //   if (activityData) {
  //     setActivities(activityData);
  //     setCurrentActivity(activityData[0]);
  //   }
  // }, [activityData]);

  // const handleNextActivity = () => {
  //   const currentIndex = activities.indexOf(currentActivity!);
  //   const nextIndex = (currentIndex + 1) % activities.length;
  //   setCurrentActivity(activities[nextIndex]);
  // };

  if (!currentActivity) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-center text-[#E49A0A] font-bold text-2xl">{`Envie d'une activité ?`}</h2>
      {/* <div>
        <h3>{currentActivity.place.name}</h3> 
      </div>
      <div>
        <button onClick={handleNextActivity} className="w-24 h-24 rounded-full bg-[#1E5552] text-white flex justify-center items-center">
          <FaTimes className="h-8 w-8" />
        </button>
        <button onClick={handleNextActivity} className="w-24 h-24 rounded-full bg-red-500 text-white flex justify-center items-center ml-6">
          <FaHeart className="h-8 w-8" />
        </button>
      </div> */}
    </div>
  );
};

export default ActivityComponent;
