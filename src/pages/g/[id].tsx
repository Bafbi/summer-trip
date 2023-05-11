import { type NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "~/components/layout/header";
import { api } from "~/utils/api";

const ChatComponent = dynamic(() => import("~/components/chatview"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

const GroupPage: NextPage = () => {
  const [page, setPage] = useState("chat");

  useEffect(() => {
    const last_page = localStorage.getItem("last_page");
    if (last_page) {
      setPage(last_page);
    }
  }, []);

  const setSelectedPage = (page: string) => {
    localStorage.setItem("last_page", page);
    setPage(page);
  };



  const id = useRouter().query.id as string;

  const { data: groupData, isLoading: groupLoading } =
    api.group.getById.useQuery({ id });

  if (!groupData) return <div>Something went wrong</div>;

  return (
    <>
      <Head>
        <title>{page}</title>
      </Head>
      <Header />
      <main>
        <ChatComponent groupId={id} />
      </main>
      <footer>
        <button className="h-12 w-12" onClick={() => setSelectedPage("like")}>
          Like
        </button>
        <button className="h-12 w-12" onClick={() => setSelectedPage("chat")}>
          Chat
        </button>
      </footer>
    </>
  );
};

export default GroupPage;
