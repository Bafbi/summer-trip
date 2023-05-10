import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Header from "~/components/layout/header";
import { api } from "~/utils/api";

const GroupPage: NextPage = () => {

  const id = useRouter().query.id as string;

  const { data: groupData, isLoading: groupLoading } = api.group.getById.useQuery({ id });

  if (groupLoading) return <div>a{id}a Loading...</div>;
  if (!groupData) return <div>Something went wrong</div>;

  return (
    <>
      <Head>
        <title>{groupData.name}</title>
      </Head>
      <Header />
      <main>
        <div className="flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            {groupData.name}
          </h1>
        </div>
      </main>
    </>
  );
};

export default GroupPage;