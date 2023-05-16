import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { FaHeart, FaComment, FaCalendar } from 'react-icons/fa';
import Header2 from "~/components/header2";
import CoeurPageContent from "~/components/likeContent";
import ChatPageContent from "~/components/chatContent";

const MobilePage = () => {
  const [activePage, setActivePage] = useState("coeur");

  const handlePageChange = (page: React.SetStateAction<string>) => {
    setActivePage(page);
  };

  let content = null;

  // Page Coeur (page par défaut)
  if (activePage === "coeur") {
    content = (
      <div>
        <CoeurPageContent />;
      </div>
    );
      // Page de Chat
  } else if (activePage === "chat") {
    content = (
      <div>
        <ChatPageContent />
      </div>
    );
      // Page du Calendrier
  } else if (activePage === "calendrier") {
    content = (
      <div>
        <h2 className="text-center">Contenu de la page Calendrier</h2>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Your Trip</title>
      </Head>

      <div className="flex flex-col h-screen">
        {/* Header */}
        {/* // Affiche le header commun à toutes les pages, hormis la page de groupe g */}
        <Header2 />

        {/* Content */}
        <main className="flex-grow bg-[#405340] px-4 py-8 h-full overflow-y-auto">
          {content}
        </main>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 pt-0 right-0 bg-[#1E5552] text-[#E49A0A]">
          <div className="flex justify-between  items-center py-2 px-4">
            <button
              className={`${
                activePage === "coeur" ? "bg-[#E49A0A] text-[#1E5552]" : ""
              } py-2 px-4 rounded-full`}
              onClick={() => handlePageChange("coeur")}
            >
              <FaHeart className="h-12 w-12" />
            </button>
            <span className="h-12 w-0.5 bg-[#E49A0A] mx-2"></span>
            <button
              className={`${
                activePage === "chat" ? "bg-[#E49A0A] text-[#1E5552]" : ""
              } py-2 px-4 rounded-full`}
              onClick={() => handlePageChange("chat")}
            >
              <FaComment className="h-12 w-12" />
            </button>
            <span className="h-12 w-0.5 bg-[#E49A0A] mx-2"></span>
            <button
              className={`${
                activePage === "calendrier" ? "bg-[#E49A0A] text-[#1E5552]" : ""
              } py-2 px-4 rounded-full`}
              onClick={() => handlePageChange("calendrier")}
            >
              <FaCalendar className="h-12 w-12" />
            </button>
          </div>
        </footer>
      </div>
    </>
  );
};

export default MobilePage;
