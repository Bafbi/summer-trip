import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { AppHeader } from "~/components/header";

const SettingsPage: NextPage = () => {
  

  return (
    <>
      <Head>
        <title>Summer-Trip | Settings</title>
      </Head>
      <AppHeader groupId="" groupName="Settings" />
      <main className="h-screen bg-[#405340] px-4 pt-8 ">
        <h1 className="text-xl pl-20"> EN TRAVAUX </h1>
      </main>
      
    </>
  );
};

export default SettingsPage;
