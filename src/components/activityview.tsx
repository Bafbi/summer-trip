import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaHeart, FaMeh, FaTimes } from "react-icons/fa";
import { api, type RouterOutputs } from "~/utils/api";
import RatingStars from "./ratingstartview";

const ActivityComponent: React.FC<{ groupId: string }> = ({ groupId }) => {
  const [activity, setActivity] =
    useState<RouterOutputs["activity"]["getActivityToRate"]>();

  const {
    mutate: activityMutation,
    isLoading,
    isError,
  } = api.activity.getActivityToRate.useMutation({
    onSuccess: (activity) => {
      setActivity(activity);
    },
  });

  useEffect(() => {
    activityMutation({ groupId });
  }, []);

  const { mutate: rateActivity } = api.activity.rateActivity.useMutation({
    onSuccess: () => {
      activityMutation({ groupId });
    },
  });

  const handleRateActivity = (activityId: string, rating: number) => {
    rateActivity({ activityId, rating });
  };

  const generateEuroSymbols = (priceLevel: number) => {
    let symbols = "";
    for (let i = 0; i < priceLevel; i++) {
      symbols += "€";
    }
    return symbols;
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="pt-3 text-center text-3xl font-bold text-[#E49A0A]">
        {"Ça t'interesse ?"}
      </h2>
      <div className="mx-auto w-full max-w-md">
        {isError ? (
          <div className="flex flex-col items-center justify-center">
            <p className="text-center text-2xl font-bold text-[#E49A0A]">
              {"Oups !"}
            </p>
            <p className="text-center text-2xl font-bold text-[#E49A0A]">
              {"Il n'y a plus d'activité à noter"}
            </p>
          </div>
        ) : (!isLoading && activity) ? (
          <>
            <div className="mt-3 flex justify-center">
              <div className="relative h-80 w-80">
                <div className="h-full w-full overflow-hidden rounded-lg shadow-xl">
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
            <div className="flex flex-col items-center justify-center">
              <p className="pt-3 text-center text-2xl font-bold text-[#E49A0A]">
                {activity.place.name}
              </p>
              <p className="mt-0 flex items-center justify-center text-2xl font-bold text-[#E49A0A]">
                <RatingStars rating={activity.place.rating ?? 0} />
              </p>
              <p className="mt-2 flex items-center justify-center text-2xl font-bold text-[#E49A0A]">
                {generateEuroSymbols(activity.place.priceLevel ?? 0)}
              </p>
              <hr className="mb-2 mt-2 w-4/5 border-2 border-[#E49A0A]" />
            </div>
          </>
        ) : (
          <>
            <div className="mt-3 flex justify-center">
              <div className="relative h-80 w-80">
                <div className="h-full w-full overflow-hidden rounded-lg shadow-xl">
                  <div className="aspect-w-1 aspect-h-1">
                    <svg
                      className="h-full w-full text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        clipRule="evenodd"
                        d="M19.414 4.586a2 2 0 010 2.828L6.828 19.414a2 2 0 01-2.828-2.828L16.586 4.586a2 2 0 012.828 0z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="pt-3 text-center text-2xl font-bold text-[#E49A0A]">
                {"Oubliez pas de voter pour nous!"}
              </p>
            </div>
          </>
        )}
      </div>
      <div className="mt-5 flex">
        <button
          disabled={isLoading}
          onClick={() => handleRateActivity(activity?.id as string, -1)}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-[#E49A0A] text-white"
        >
          <FaTimes className="h-10 w-10" />
        </button>
        <button
          disabled={isLoading}
          onClick={() => handleRateActivity(activity?.id as string, 0)}
          className="mx-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-400 text-white"
        >
          <FaMeh className="h-12 w-12" />
        </button>
        <button
          disabled={isLoading}
          onClick={() => handleRateActivity(activity?.id as string, 1)}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-red-500 text-white"
        >
          <FaHeart className="h-10 w-10" />
        </button>
      </div>
    </div>
  );
};

export default ActivityComponent;
