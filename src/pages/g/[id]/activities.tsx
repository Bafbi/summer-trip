import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { api } from "~/utils/api";
import { AppHeader } from "~/components/header";
import { FaHeart } from 'react-icons/fa';

export const getStaticProps: GetStaticProps = (context) => {
  const groupId = context.params?.id as string;
  return {
    props: {
      groupId,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

const ActivitiesPage: NextPage<{ groupId: string }> = ({ groupId }) => {
  useSession({ required: true });

  const { data: activityData, isLoading: activityLoading } = api.activity.getActivitiesWithVotes.useQuery({ groupId });

  return (
    <>
      <Head>
        <title>Groups</title>
      </Head>
      <div className="flex flex-col min-h-screen bg-[#40534D]">
        {/* Header */}
        <AppHeader groupId={groupId} groupName={"Activities"} />

        <main className="">
          <div className="grid grid-cols-2 gap-4 p-4">
            {activityLoading ? (
              <div>Loading...</div>
            ) : !activityData ? (
              <div>No activities</div>
            ) : ( activityData.map((activity) => (
              <div key={activity.id} className="overflow-hidden rounded-lg bg-[#E49A0A] shadow p-4 text-[#1E5552]">
                <h3 className="text-xl font-bold">{activity.place.name}</h3>
                <div className="flex items-center mt-2 text-black">
                  <FaHeart className="h-4 w-4 mr-1 text-black font-bold" />
                  <span className="text-black font-bold">{activity.voteCount} Likes</span>
                </div>
              </div>
            )))}
          </div>
        </main>
      </div>
    </>
  );
};

export default ActivitiesPage;
