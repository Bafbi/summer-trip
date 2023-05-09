import { group } from "console";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import Head from "next/head";
import Link from "next/link";
import { use } from "react";
import { PostView } from "~/components/groupview";
import { api } from "~/utils/api";

const GroupsPage: NextPage = () => {

    const {data: groupsData, isLoading: groupsLoading} = api.group.getAll.useQuery();

    if (groupsLoading) return <div>Loading...</div>

    if (!groupsData) return <div>Something went wrong</div>

  return (
    <>
      <Head>
        <title>Groups</title>
      </Head>
      <main>
        <div className="grid row-span-2">
          {groupsData.map((group) => {
            return (
              <Link key={group.id} href={`/g/${group.id}`}>
                <div className="flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                  <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                    {group.name}
                  </h1>
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </>
  );
};

export default GroupsPage;
