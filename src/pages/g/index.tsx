import { type NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { FaPlus, FaPlusCircle, FaPlusSquare } from "react-icons/fa";
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
  const [placeName, setPlaceName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
          <div className="flex w-full flex-col relative items-center justify-center gap-2 rounded-lg bg-[#40534D] p-4 md:p-6">
            <form onSubmit={handleSubmit} className="w-full">
              <p className="text-2xl font-bold text-center text-[#E49A0A] mt-2 mb-5"> Créer un nouveau groupe</p>
              <div className="mb-4">
                <label
                  htmlFor="groupName"
                  className="nomGroupe mb-2 mt-4 block font-bold text-left text-l text-[#1CCDB3]"
                >
                  Nom du Groupe :
                </label>
                <input
                  type="text"
                  id="groupName"
                  placeholder="Donne un petit nom à ton séjour !"
                  maxLength={30}
                  className="nomContent w-full rounded-md border border-[#E49A0A] border-solid bg-[#40534D]
                  text-gray-300 px-3 py-2"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="groupDescription"
                  className="mb-2 mt-4 block font-bold text-left text-l text-[#1CCDB3]"
                >
                  Description :
                </label>
                <textarea
                  id="groupDescription"
                  className='w-full rounded-md border border-[#E49A0A] bg-[#405340] 
                  min-height:10px border-solid text-gray-300 px-3 py-2'
                  value={groupDescription}
                  maxLength={140}
                  placeholder="Décris ton séjour en quelques mots ! (140 caractères max)"
                  onChange={(e) => setGroupDescription(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="groupName"
                  className="nomGroupe mb-2 mt-4 block font-bold text-left text-l text-[#1CCDB3]"
                >
                  Lieu exact du séjour :
                </label>
                <input
                  type="text"
                  id="placeName"
                  placeholder="Que ce soit une ville, un quartier, etc."
                  maxLength={30}
                  className="placeContent w-full rounded-md border border-[#E49A0A] border-solid bg-[#40534D]
                  text-gray-300 px-3 py-2 min-height:20px"
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  required
                />
              </div>
              <p className="text-m font-light text-left text-[#E49A0A] my-4">
                Astuce : Pour avoir des suggestions fiables, penses à écrire
                <span className="font-extrabold"> correctement</span> l'endroit où tu souhaites voyager !
              </p>
              <div className="mb-4">
                <label htmlFor="startDate" className="mb-2 mt-4 block font-bold text-left text-l text-[#1CCDB3]">
                  Date de début de séjour :
                </label>
                <input
                  type="date"
                  id="startDate"
                  className="w-full rounded-md border border-[#E49A0A] bg-[#40534D] border-solid text-gray-400 px-3 py-2"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="endDate" className="mb-2 mt-4 block font-bold text-left text-l text-[#1CCDB3]">
                  Date de fin de séjour :
                </label>
                <input
                  type="date"
                  id="endDate"
                  className="w-full rounded-md border border-[#E49A0A] bg-[#40534D] border-solid text-gray-400 px-3 py-2"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mx-auto rounded-lg mt-3 bg-gray-500 px-12 py-5 text-gray-200 hover:bg-[#1CCDB3]"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="mx-auto rounded-lg mt-3 bg-[#E49A0A] text-gray-100 text-bold px-12 py-5 hover:bg-[#1CCDB3]"
                >
                  Create
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
                <FaPlusCircle className="w-10 h-10 flex- text-gray-300" />
                <div className="flex-2 mt-2 max-w-xl text-sm text-gray-200">
                  <p className="text-l text-sm">Créer un groupe</p>
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
