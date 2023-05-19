import { type GetStaticPaths, type GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";
import { api } from "~/utils/api";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaHeart, FaComment, FaCalendar } from "react-icons/fa";
import { useRouter } from "next/router";
import { AppHeader } from "~/components/header";

const ChatComponent = dynamic(() => import("~/components/chatview"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});
const PlanningComponent = dynamic(() => import("~/components/planningview"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

const ActivityComponent = dynamic(() => import("~/components/activityview"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

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


type PageType = "chat" | "planning" | "activity";

const AppPage = (props: { groupId: string; } ) => {
  const { groupId } = props;

  const [page, setPage] = useState<PageType>("chat");

  const router = useRouter();

  const { data: groupData, isLoading: groupLoading } =
    api.group.getById.useQuery({ id: groupId });

  if ((!groupLoading && !groupData) || groupData === null)
    return router.push("/g");

  return (
    <>
      <Head>
        <title>{`Summer-Trip${groupLoading ? "" : ` | ${groupData.name}`}`}</title>
      </Head>

      <div className="flex h-screen flex-col">
        {/* Header */}
        {/* // Affiche le header commun à toutes les pages, hormis la page de groupe g */}
        <AppHeader
          groupId={groupId}
          groupName={groupLoading ? "..." : groupData.name}
        />

        {/* Content */}
        <main className="flex-grow overflow-y-auto overflow-x-hidden bg-[#405340] px-0 py-0" style={{ height: 'calc(100vh - 220px)' }}>

          {page === "chat" && <ChatComponent groupId={groupId} />}
          {page === "planning" && <PlanningComponent groupId={groupId} />}
          {page === "activity" && <ActivityComponent groupId={groupId}/>}
          
        </main>

        {/* Footer */}
        <footer className="bg-[#1E5552] pt-0 text-[#E49A0A]">
          <div className="flex items-center  justify-between px-4 py-2">
            <button
              className={`${
                page === "activity" ? "bg-[#E49A0A] text-[#1E5552]" : ""
              } rounded-full px-4 py-2`}
              onClick={() => setPage("activity")}
            >
              <FaHeart className="h-12 w-12" />
            </button>
            <span className="mx-2 h-12 w-0.5 bg-[#E49A0A]"></span>
            <button
              className={`${
                page === "chat" ? "bg-[#E49A0A] text-[#1E5552]" : ""
              } rounded-full px-4 py-2`}
              onClick={() => setPage("chat")}
            >
              <FaComment className="h-12 w-12" />
            </button>
            <span className="mx-2 h-12 w-0.5 bg-[#E49A0A]"></span>
            <button
              className={`${
                page === "planning" ? "bg-[#E49A0A] text-[#1E5552]" : ""
              } rounded-full px-4 py-2`}
              onClick={() => setPage("planning")}
            >
              <FaCalendar className="h-12 w-12" />
            </button>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AppPage;
