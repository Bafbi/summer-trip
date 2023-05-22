import { GetStaticPaths, GetStaticProps, type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { api } from "~/utils/api";
import { AppHeader } from "~/components/header";

export const getStaticProps: GetStaticProps = (context) => {
  const groupId = context.params?.id as string;
  return {
    props: {
      groupId,
    },
  };
}

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
}

const ActivitiesPage: NextPage<{groupId: string}> = ({groupId}) => {
  useSession({ required: true });

  const { data: activityData, isLoading: activityLoading } = api.activity.getActivitiesWithVotes.useQuery( { groupId });

  if (activityLoading) return <div>Loading... {groupId}</div>;

  if (!activityData) return <div>Something went wrong</div>;


  // const onSubmit = (data: any) => {
  //   console.log(data);
  //   setIsOpen(false);
  // };

  return (
    <>
      <Head>
        <title>Groups</title>
      </Head>
      <div className="flex flex-col h-screen bg-[#40534D]">
      {/* Header */}
      <AppHeader groupId={groupId} groupName={"Activities"}/>

      <main className="mt-8">
        <div className="grid grid-cols-2 gap-4">
            {activityData.map((activity) => (
              <div
                key={activity.id}
                className="overflow-hidden rounded-lg bg-white shadow"
              >
                <span>{activity.place.name}</span>
                <span>{activity.voteCount}</span>
              </div>
            ))}
          </div>
      </main>
      </div>
    </>
  );
};

export default ActivitiesPage;

