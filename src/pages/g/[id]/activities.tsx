import { get } from "http";
import { GetStaticPaths, GetStaticProps, type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

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

  const { data: activityData, isLoading: activityLoading } = api.activity.getActivitiesByGroupId.useQuery( { groupId });

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
      {/* <Header/> */}
      <main>
        <div className="min-h-screen bg-primary-900 p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activityData.map((activity) => (
              <div
                key={activity.id}
                className="overflow-hidden rounded-lg bg-white shadow"
              >
              <span>{activity.place.name}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default ActivitiesPage;

