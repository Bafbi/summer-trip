import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaHeart, FaTimes } from "react-icons/fa";
import { api, type RouterOutputs } from "~/utils/api";

const ActivityComponent: React.FC<{ groupId: string }> = ({ groupId }) => {
  const [activity, setActivity] =
    useState<RouterOutputs["activity"]["getActivityToRate"]>();

  const { mutate: activityMutation } = api.activity.getActivityToRate.useMutation({
    onSuccess: (activity) => {
      setActivity(activity);
    },
  });

  const handleNextActivity = () => {
    activityMutation({ groupId });
  };

  useEffect(() => {
    handleNextActivity(); // Call handleNextActivity once when the component loads
  }, []); // Empty dependency array to ensure it runs only once on mount

  const { mutate: rateActivity } = api.activity.rateActivity.useMutation({
    onSuccess: () => {
      handleNextActivity();
    },
  });

  return (
    <div>
      <h2 className="text-center text-2xl font-bold text-[#E49A0A]">
        What do you think ?
      </h2>
      <div>
        {activity ? (
          <>
            <h3 className="text-center text-2xl font-bold text-[#E49A0A]">
              {activity.place.name}
            </h3>
            <Image
              // ByteBuffer "activity.photo" to base64
              src={`data:image/png;base64,${activity.photo}`}
              alt="Activity Image"
              width={600}
              height={600}
            />
          </>
        ) : (
          <h3 className="text-center text-2xl font-bold text-[#E49A0A]">
            No more activities
          </h3>
        )}
      </div>
      <div>
        <button
          {...(activity ? {} : { disabled: true })}
          onClick={() => rateActivity({ activityId: activity?.id as string, rating: -1 })}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1E5552] text-white"
        >
          <FaTimes className="h-8 w-8" />
        </button>
        <button
          {...(activity ? {} : { disabled: true })}
          onClick={() => rateActivity({ activityId: activity?.id as string, rating: 1 })}
          className="ml-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-500 text-white"
        >
          <FaHeart className="h-8 w-8" />
        </button>
      </div> 
    </div>
  );
};

export default ActivityComponent;
