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
  const [showForm, setShowForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setShowForm(false);
  };

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Vérifier si les champs du formulaire sont valides

    // Effectuer une action pour créer le groupe en utilisant les valeurs de groupName et groupDescription

    // Réinitialiser les valeurs des champs du formulaire
    setGroupName('');
    setGroupDescription('');
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
                width={40}
                height={40}
              />
            ) : (
              "Sign in"
            )}
        </button>
        {isDropdownOpen && <DropdownMenu />}
      </header>

  <main className="min-h-screen bg-[#40534D] flex flex-col">
  <div className="grid grid-cols-2 md:grid-cols-2 gap-6 p-4">
    <div
  onClick={toggleExpansion}
  className={`flex flex-col items-center justify-center gap-2 rounded-lg bg-white p-4 md:p-6 ${
    isExpanded ? "md:col-span-2 w-full" : ""
  } cursor-pointer`}
>
      {isExpanded ? (
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label htmlFor="groupName" className="block text-gray-700 text-sm font-bold mb-2">
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="groupDescription" className="block text-gray-700 text-sm font-bold mb-2">
              Group Description
            </label>
            <textarea
              id="groupDescription"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Créer
          </button>
        </form>
      ) : (
        <div>
          {<div>
  <img src="/plus.png" alt="Add Group" className="h-9 w-9" />
  <h1 className="mt-2 text-xs">Create Group</h1>
</div>
}
        </div>
      )}
    </div>
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
