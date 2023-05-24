import { type Group } from "@prisma/client";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { GroupDropMenu } from "~/components/dropMenu";
import { GroupComponent } from "~/components/groupcomponent";
import { api } from "~/utils/api";

const GroupsPage: NextPage = () => {
  const { data: sessionData, status: sessionStatus } = useSession({
    required: true,
  });

  const [groups, setGroups] = useState<Group[]>([]);

  const { data: groupsData, isLoading: groupsLoading } =
    api.group.getAll.useQuery();

  useEffect(() => {
    if (groupsData) {
      setGroups(groupsData);
    }
  }, [groupsData]);

  const [showForm, setShowForm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  ///////////////////////

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const createGroupMutation = api.group.create.useMutation({
    onSuccess: (data) => {
      setGroupName("");
      setGroupDescription("");
      setPlaceName("");
      setStartDate(new Date());
      setEndDate(new Date());
      setShowForm(false);
      setGroups((prev) => [...prev, data]);
    },
});

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

          <button
            className="mx-4 h-full w-14"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
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
    <div className="relative flex w-full flex-col items-center justify-center gap-2 rounded-lg bg-[#40534D] p-4 md:p-6">
      <form onSubmit={(e) => {
        e.preventDefault();
        
        createGroupMutation.mutate({
          name: groupName,
          description: groupDescription,
          location: placeName,
          start: startDate,
          end: endDate,
        });
      }} 
      className="w-full">
        <p className="mb-5 mt-2 text-center text-2xl font-bold text-[#E49A0A]">
          {" "}
          Créer un nouveau groupe
        </p>
        <div className="mb-4">
          <label
            htmlFor="groupName"
            className="nomGroupe text-l mb-2 mt-4 block text-left font-bold text-[#1CCDB3]"
          >
            Nom du Groupe :
          </label>
          <input
            type="text"
            id="groupName"
            placeholder="Donne un petit nom à ton séjour !"
            maxLength={30}
            className="nomContent w-full rounded-md border border-solid border-[#E49A0A] bg-[#40534D]
            px-3 py-2 text-gray-300"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required={true}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="groupDescription"
            className="text-l mb-2 mt-4 block text-left font-bold text-[#1CCDB3]"
          >
            Description :
          </label>
          <textarea
            id="groupDescription"
            className="min-height:10px w-full rounded-md border border-solid 
            border-[#E49A0A] bg-[#405340] px-3 py-2 text-gray-300"
            value={groupDescription}
            maxLength={140}
            placeholder="Décris ton séjour en quelques mots ! (140 caractères max)"
            onChange={(e) => setGroupDescription(e.target.value)}
            required={true}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="groupName"
            className="nomGroupe text-l mb-2 mt-4 block text-left font-bold text-[#1CCDB3]"
          >
            Lieu exact du séjour :
          </label>
          <input
            type="text"
            id="placeName"
            placeholder="Que ce soit une ville, un quartier, etc."
            maxLength={30}
            className="placeContent min-height:20px w-full rounded-md border border-solid border-[#E49A0A] bg-[#40534D] px-3 py-2 text-gray-300"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            required={true}
          />
        </div>
        <p className="text-m my-4 text-left font-light text-[#E49A0A]">
          Astuce : Pour avoir des suggestions fiables, penses à écrire
          <span className="font-extrabold"> correctement</span> le lieu où tu
          souhaites voyager !
        </p>
        <div className="mb-4">
          <label
            htmlFor="startDate"
            className="text-l mb-2 mt-4 block text-left font-bold text-[#1CCDB3]"
          >
            Date de début de séjour :
          </label>
          <input
            type="date"
            id="startDate"
            className="w-full rounded-md border border-solid border-[#E49A0A] bg-[#40534D] px-3 py-2 text-gray-400"
            value={startDate.toISOString().split("T")[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            required={true}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="endDate"
            className="text-l mb-2 mt-4 block text-left font-bold text-[#1CCDB3]"
          >
            Date de fin de séjour :
          </label>
          <input
            type="date"
            id="endDate"
            className="w-full rounded-md border border-solid border-[#E49A0A] bg-[#40534D] px-3 py-2 text-gray-400"
            value={endDate.toISOString().split("T")[0]}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            required={true}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="mx-auto mt-3 rounded-lg bg-gray-500 px-12 py-5 text-gray-200 hover:bg-[#1CCDB3]"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="text-bold mx-auto mt-3 rounded-lg bg-[#E49A0A] px-12 py-5 text-gray-100 hover:bg-[#1CCDB3]"
            disabled={createGroupMutation.isLoading}
          >
            {createGroupMutation.isLoading ? (
              <svg
                className="... mr-3 h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Create"
            )}
          </button>
        </div>
      </form>
    </div>
  ) : (
          <div className="grid grid-cols-2 gap-6 p-4 md:grid-cols-2">
            <div className="h-32 rounded-lg bg-[#E49A0A] border-[#E49A0A] border-2">
              <button
                className="flex h-full w-full flex-col items-center justify-center p-2"
                onClick={() => setShowForm(true)}
              >
                <FaPlus className="w-10 h-10 flex- text-gray-300" />
                <div className="flex-2 mt-2 max-w-xl text-sm text-gray-300">
                  <p className="text-l text-sm">Créer un groupe</p>
                </div>
              </button>
            </div>
            {groupsLoading ? (
              <div className="h-24 rounded-lg bg-tertiary">
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
              groups.map((group) => {
                return <GroupComponent key={group.id} {...group} />;
              })
            )}
          </div>
        )}
      </main>
    </>
  );
};

const CreateGroupWizard = () => {





  return ;
};

export default GroupsPage;
