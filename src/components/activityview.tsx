import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaHeart, FaMeh, FaTimes } from "react-icons/fa";
import { api, type RouterOutputs } from "~/utils/api";
import RatingStars from "./ratingstartview";

const ActivityComponent: React.FC<{ groupId: string }> = ({ groupId }) => {
  const [activity, setActivity] = useState<RouterOutputs["activity"]["getActivityToRate"]>();
  const [nextActivity, setNextActivity] = useState<RouterOutputs["activity"]["getActivityToRate"]>();
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: activityMutation } = api.activity.getActivityToRate.useMutation({
    onSuccess: (activity) => {
      if (!nextActivity) {
        setActivity(activity);
      } else {
        setActivity(nextActivity);
        setNextActivity(activity);
      }
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleNextActivity = () => {
    setIsLoading(true);
    activityMutation({ groupId });
  };

  useEffect(() => {
    handleNextActivity();
  }, []);

  const { mutate: rateActivity } = api.activity.rateActivity.useMutation();

  const rateAndFetchNextActivity = (activityId: string, rating: number) => {
    rateActivity({ activityId, rating });
    activityMutation({ groupId });
  };

  const generateEuroSymbols = (priceLevel: number) => {
    let symbols = '';
    for(let i = 0; i < priceLevel; i++) {
      symbols += '€';
    }
    return symbols;
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-center text-3xl font-bold text-[#E49A0A] pt-3">
        {"Ça t'interesse ?"}
      </h2>
      <div className="max-w-md w-full mx-auto">
        {isLoading ? (
          <h3 className="text-center text-2xl font-bold text-[#E49A0A]">
            Chargement ...
          </h3>
        ) : (
          activity && (
            <>
              <div className="flex justify-center mt-3">
                <div className="relative w-80 h-80">
                  <div className="w-full h-full rounded-lg overflow-hidden shadow-xl">
                    <div className="aspect-w-1 aspect-h-1">
                      <Image 
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
              <div className="flex flex-col justify-center items-center">
                <p className="text-center text-2xl font-bold pt-3 text-[#E49A0A]">
                  {activity.place.name}
                </p>
                <p className="flex justify-center mt-0 items-center text-2xl font-bold text-[#E49A0A]">
                  <RatingStars rating={activity.place.rating ?? 0} />
                </p>
                <p className="flex justify-center mt-2 items-center text-2xl font-bold text-[#E49A0A]">
                  {generateEuroSymbols(activity.place.priceLevel ?? 0)}
                </p>
                <hr className="w-4/5 mt-2 mb-2 border-[#E49A0A] border-2" />
              </div>
            </>
          )
        )}
      </div>
      <div className="flex mt-5">
        <button
          {...(activity ? {} : { disabled: true })}
          onClick={() => rateAndFetchNextActivity(activity?.id as string, -1)}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-[#E49A0A] text-white"
        >
          <FaTimes className="h-10 w-10" />
        </button>
        <button
          {...(activity ? {} : { disabled: true })}
          onClick={() => rateAndFetchNextActivity(activity?.id as string, 0)}
          className="mx-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-400 text-white"
        >
          <FaMeh className="h-12 w-12" />
        </button>
        <button
          {...(activity ? {} : { disabled: true })}
          onClick={() => rateAndFetchNextActivity(activity?.id as string, 1)}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-red-500 text-white"
        >
          <FaHeart className="h-10 w-10" />
        </button>
      </div> 
    </div>
  );
};

export default ActivityComponent;
