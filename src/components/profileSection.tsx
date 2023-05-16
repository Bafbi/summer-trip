import { useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { api } from "~/utils/api";
import React from 'react';
import { useRouter } from "next/router";
import Image from "next/image";

const Profile = () => {
  const { data: sessionData } = useSession({ required: true });
  const { data: groupsData, isLoading: groupsLoading } = api.group.getAll.useQuery();

  return (
    <div className="profile-container center text-center">
      <div className="sticky w-28 h-24 m-auto z-0">
        {sessionData?.user.image ? (
          <Image
            className="z-0 rounded-full w-fit h-fit"
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
        <p className="mt-4 font-semibold text-lg text-[#1CCDB3]">
          {sessionData?.user.name}
        </p>
        <p className="font-thin text-s text-[#E49A0A]">
          
        </p>
      </div>
      <div className="email mt-12">
        <p className="text-[#E49A0A] font-semibold">Email:</p>
        <p className="text-center mt-4 text-[#1CCDB3]">
          {sessionData?.user.email}
        </p>
      </div>
      <div className="group-count mt-6">
        <p className="text-[#E49A0A] font-semibold">Nombre de groupes:</p>
        <p className="text-center mt-4 text-[#1CCDB3]">
          {groupsData?.length || 0}
        </p>
      </div>
      <div className="message-count mt-4">
        <p className="text-[#E49A0A] font-semibold">Nombre de message envoyés:</p>
        <p className="text-center text-[#1CCDB3] mt-4">12</p>
      </div>
      <button
        className="bg-[#1CCDB3] text-white px-4 py-2 rounded-md mt-8"
        onClick={() => void signOut({ redirect: true, callbackUrl: '/' })}
      >
        Sign out
      </button>
    </div>
  );
}

export default Profile;
