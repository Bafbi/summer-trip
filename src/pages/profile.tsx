import Head from "next/head";
import { useSession, signOut } from "next-auth/react";
import { api } from "~/utils/api";

import Image from "next/image";
import { GroupHeader } from "~/components/header";

const ProfilePage = () => {

  const { data: sessionData } = useSession({ required: true });
  const { data: groupsData, isLoading: groupsLoading } =
    api.group.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Your Profile</title>
      </Head>

      <div className="flex h-screen flex-col">
        {/* Header */}
        {/* // Affiche le header commun à toutes les pages, hormis la page de groupe g */}
        <GroupHeader />
        {/* Content */}
        <main className="h-full flex-grow overflow-hidden bg-[#405340] px-4 py-8">
          <div className="profile-container center text-center">
            <div className="sticky z-0 m-auto h-24 w-28">
              {sessionData?.user.image ? (
                <Image
                  className="z-0 h-fit w-fit rounded-full"
                  src={sessionData.user.image}
                  alt="User Logo"
                  width={120}
                  height={120}
                />
              ) : (
                <p className="z-0">Sign in</p>
              )}
            </div>
            <div className="username mt-4">
              <p className="mt-4 text-2xl font-semibold text-[#1CCDB3]">
                {sessionData?.user.name}
              </p>
              <p className="text-s font-thin text-[#E49A0A]"></p>
            </div>
            <div className="email mt-12">
              <p className="font-semibold text-[#E49A0A] text-2xl">Email:</p>
              <p className="mt-4 text-center text-xl text-[#1CCDB3]">
                {sessionData?.user.email}
              </p>
            </div>
            <div className="group-count mt-6">
              <p className="font-semibold text-[#E49A0A] text-2xl">Nombre de groupes:</p>
              <p className="mt-4 text-center text-[#1CCDB3] text-xl">
                {groupsData?.length || 0}
              </p>
            </div>
            <button
              className="mt-14 rounded-md bg-[#1CCDB3] px-4 py-2 text-white"
              onClick={() => void signOut({ redirect: true, callbackUrl: "/" })}
            >
              Sign out
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProfilePage;
