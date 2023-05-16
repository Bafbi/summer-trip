import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import DropMenu from "~/components/dropMenu";
import Header from "~/components/header";

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
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

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
    setGroupName("");
    setGroupDescription("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsExpanded(false);
    setGroupName("");
    setGroupDescription("");
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (groupsLoading) return <div>Loading...</div>;
  if (!groupsData) return <div>Something went wrong</div>;

  return (
    <>
      <Head>
        <title>Groups</title>
      </Head>

      <header className="">
        <div className="flex h-16 items-center justify-between bg-[#1E5552] px-4 text-[#E49A0A]">
          <button className="">
            {sessionData?.user.image ? (
              <Image
                className="h-fit w-fit rounded-full"
                src={"/judog.PNG"}
                alt="User Logo"
                width={64}
                height={64}
              />
            ) : (
              "Sign in"
            )}
          </button>
          <h1 className="flex text-xl font-bold text-[#E49A0A]">
            {sessionData?.user?.name}
          </h1>

          <button className="h-fit w-fit" onClick={toggleMenu}>
            {sessionData?.user.image ? (
              <Image
                className="h-fit w-fit rounded-full"
                src={sessionData.user.image}
                alt="User Logo"
                width={40}
                height={40}
              />
            ) : (
              "Sign in"
            )}
          </button>
        </div>
        <DropMenu isOpen={isMenuOpen} />
      </header>

      <main className="flex min-h-screen flex-col bg-[#40534D]">
        {showForm ? (
          <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg bg-white p-4 md:p-6">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-4">
                <label
                  htmlFor="groupName"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Nom du Groupe 
                </label>
                <input
                  type="text"
                  id="groupName"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="groupDescription"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Group Description
                </label>
                <textarea
                  id="groupDescription"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="mr-2 rounded-md bg-blue-500 px-4 py-2 text-white"
                >
                  Create
                </button>
                <button
                  type="button"
                  className="rounded-md bg-gray-500 px-4 py-2 text-white"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 p-4 md:grid-cols-2">
            <div
              onClick={toggleExpansion}
              className={`${
                isExpanded ? "w-full md:col-span-2" : ""
              } flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg bg-white p-4 md:p-6`}
            >
              {isExpanded ? (
                <div>
                  <img src="/minus.png" alt="Close Form" className="h-9 w-9" />
                  <h1 className="mt-2 text-xs">Close Form</h1>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  {" "}
                  {/* Ajout des classes CSS "flex flex-col items-center" */}
                  <img src="/plus.png" alt="Add Group" className="h-9 w-9" />
                  <h1 className="mt-2 text-xs">Create Group</h1>
                </div>
              )}
            </div>

            {groupsData.map((group) => {
              return (
                <Link key={group.id} href={"/g/${group.id}"}>
                  <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-white p-4 px-2">
                    <div className="flex h-full flex-col items-center justify-end">
                      <div className="h-8 w-8 rounded-full bg-[#1CCDB3]"></div>
                      <h1 className="mt-2 text-xs">{group.id}</h1>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
};

export default GroupsPage;
