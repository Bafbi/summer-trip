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
    <div className="flex flex-col items-center">
      <h2 className="text-center text-2xl font-bold text-[#E49A0A] pt-8">
        What do you think?
      </h2>
      <div className="max-w-md w-full mx-auto">
        {activity ? (
          <>
            
            <div className="flex justify-center mt-4">
              <div className="relative w-80 h-80">
                <div className="w-full h-full rounded-lg overflow-hidden shadow-xl">
                  <div className="aspect-w-1 aspect-h-1">
                    <Image 
                      // ByteBuffer "activity.photo" to base64
                      src={`data:image/png;base64,${activity.photo}`}
                      alt="Activity Image"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg shadow-xl"
                    />
                  </div>
                
                </div>
              </div>
            </div>
            <h3 className="text-center text-2xl font-bold pt-4 text-[#E49A0A]">
              {activity.place.name}
            </h3>
          </>
        ) : (
          <h3 className="text-center text-2xl font-bold text-[#E49A0A]">
            No more activities
          </h3>
        )}
      </div>
      <div className="flex mt-20">
        <button
          {...(activity ? {} : { disabled: true })}
          onClick={() => rateActivity({ activityId: activity?.id as string, rating: -1 })}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1E5552] text-white"
        >
          <FaTimes className="h-6 w-6" />
        </button>
        <button
          {...(activity ? {} : { disabled: true })}
          onClick={() => rateActivity({ activityId: activity?.id as string, rating: 0 })}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-400 text-white mr-4"
        >
         Maybe
        </button>
        <button
          {...(activity ? {} : { disabled: true })}
          onClick={() => rateActivity({ activityId: activity?.id as string, rating: 1 })}
          className="ml-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-500 text-white"
        >
          <FaHeart className="h-6 w-6" />
        </button>
      </div> 
    </div>
  );
};

export default ActivityComponent;
