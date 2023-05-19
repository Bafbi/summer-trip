import { type NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaPlus, FaPlusSquare } from "react-icons/fa";
import { GroupDropMenu } from "~/components/dropMenu";
import { GroupComponent } from "~/components/groupcomponent";
import { api } from "~/utils/api";

const GroupsPage: NextPage = () => {
  const { data: sessionData, status: sessionStatus } = useSession({
    required: true,
  });
  const { data: groupsData, isLoading: groupsLoading } =
    api.group.getAll.useQuery();

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

  const { mutate: createGroup } = api.group.create.useMutation({
    onSuccess: () => {
      setShowForm(false);
      setIsExpanded(false);
      setGroupName("");
      setGroupDescription("");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createGroup({ name: groupName, description: groupDescription, location: "Lille" });
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

  return (
    <>
      <Head>
        <title>Groups</title>
      </Head>

      <header>
        <div className="flex h-16 items-center justify-between bg-secondary">
          <button className="mx-4 h-full w-14">
            {sessionData?.user.image ? (
              <Image
                className=""
                src={"/logo.svg"}
                alt="User Logo"
                width={56}
                height={56}
              />
            ) : (
              "Sign in"
            )}
          </button>

          <h1 className="px-2 text-xl font-bold text-primary">
            {sessionStatus !== "loading" ? sessionData.user.name : "..."}
          </h1>

          <button className="mx-4 h-full w-14" onClick={toggleMenu}>
            <Image
              className="rounded-full"
              src={
                sessionStatus !== "loading" && sessionData.user.image
                  ? sessionData.user.image
                  : "/loading-user-icon.png"
              }
              alt="User Logo"
              width={56}
              height={56}
            />
          </button>
        </div>
        <GroupDropMenu isOpen={isMenuOpen} />
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
            <div className="h-24 rounded-lg bg-tertiary shadow">
              <button
                className="flex h-full w-full flex-col items-center justify-center p-2"
                onClick={toggleExpansion}
              >
                <FaPlus className="w-full flex-1 border-b-2 border-accent  text-gray-300" />
                <div className="flex-2 mt-2 max-w-xl text-sm text-gray-200">
                  <p>Create Group</p>
                </div>
              </button>
            </div>
            {groupsLoading ? (
              <div className="h-24 rounded-lg bg-tertiary shadow">
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg p-4 md:p-6">
                  <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-300"></div>
                  <h1 className="mt-2 text-xs text-gray-200">Loading...</h1>
                </div>
              </div>
            ) : !groupsData ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-white p-4 md:p-6">
                <h1 className="mt-2 text-xs">Something went wrong</h1>
              </div>
            ) : (
              groupsData.map((group) => {
                return <GroupComponent key={group.id} {...group} />;
              })
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default GroupsPage;
