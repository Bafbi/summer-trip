import Head from 'next/head';
import React from 'react';
import { useSession, signOut } from "next-auth/react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Header from "~/components/header";
import Profile from "~/components/profileSection";
import Image from "next/image";


const ProfilePage = () => {  
  let content = null;

  const { data: sessionData } = useSession({ required: true });
  const { data: groupsData, isLoading: groupsLoading } =
    api.group.getAll.useQuery();

  return (
    <>
      <Head>
          <title>Your Profile</title>
      </Head>

      <div className="flex flex-col h-screen">
        {/* Header */}
        {/* // Affiche le header commun à toutes les pages, hormis la page de groupe g */}
        <Header />
        {/* Content */}
        <main className="flex-grow bg-[#405340] px-4 py-8 h-full overflow-hidden">
          <Profile />
          {/*Voir "profileSection.tsx" */}
        </main>
      </div>
    </>
  );

};


export default ProfilePage;