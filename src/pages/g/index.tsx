import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { DropdownMenu } from "~/components/menu";
import { useState } from "react";
import Image from "next/image";

const GroupsPage: NextPage = () => {
  const { data: sessionData } = useSession({ required: true });
  const { data: groupsData, isLoading: groupsLoading } =
    api.group.getAll.useQuery();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
    // redirect("/");
    // router.push(""); // Redirige vers la page de connexion après déconnexion
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (groupsLoading) return <div>Loading...</div>;
  if (!groupsData) return <div>Something went wrong</div>;

  return (
    <>
      <Head>
        <title>Groups</title>
      </Head>

      <header className="flex items-center bg-[#1E5552] w-screen p-2 justify-between min-h-fit">
        <button className="">
        {sessionData?.user.image ? (
              <Image
                className="rounded-full w-fit h-fit"
                src={"/judog.PNG"}
                alt="User Logo"
                width={64}
                height={64}
              />
            ) : (
              "Sign in"
            )} 

        </button>
        <h1 className="flex text-[#E49A0A] font-bold text-xl">
          {sessionData?.user?.name}
        </h1>
        
        <button
        
          className="w-fit h-fit"
          onClick={toggleDropdown}
        >
          {sessionData?.user.image ? (
              <Image
                className="rounded-full w-fit h-fit"
                src={sessionData.user.image}
                alt="User Logo"
                width={64}
                height={64}
              />
            ) : (
              "Sign in"
            )}
        </button>
        {isDropdownOpen && <DropdownMenu />}
      </header>

      <main className="min-h-screen bg-[#40534D]">
        <div className=" grid grid-cols-2 gap-6 p-4">
          <Link href="/create-group">
            <div className=" flex flex-col items-center justify-center gap-2 rounded-lg bg-[white] px-2 p-4">
              <div className="flex h-full flex-col items-center justify-end">
                <img src="/plus.png" alt="Add Group" className="h-9 w-9 " />
                <h1 className="mt-2 text-xs ">  
                  Create Group
                </h1>
              </div>
            </div>
          </Link>
          {groupsData.map((group) => {
            return (
              <Link key={group.id} href={`/g/${group.id}`}>
                <div className=" flex flex-col items-center justify-center gap-2 rounded-lg bg-white px-2 p-4">
                  <div className="flex h-full flex-col items-center justify-end">
                    <div className="h-8 w-8 rounded-full bg-[#1CCDB3]"></div>
                    <h1 className="mt-2 text-xs ">
                      {group.id}
                    </h1>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
};

export default GroupsPage;
