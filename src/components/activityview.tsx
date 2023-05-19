import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaHeart, FaTimes } from "react-icons/fa";
import { type RouterOutputs, api } from "~/utils/api";

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

  const handleLike = () => {
    if (!activity) return;
    // Implement your logic to rate the activity on the server
    handleNextActivity();
  };

  const handleDislike = () => {
    if (!activity) return;
    // Implement your logic to rate the activity on the server
    handleNextActivity();
  };

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
          onClick={handleDislike}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1E5552] text-white"
        >
          <FaTimes className="h-8 w-8" />
        </button>
        <button
          onClick={handleLike}
          className="ml-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-500 text-white"
        >
          <FaHeart className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
};

export default ActivityComponent;
