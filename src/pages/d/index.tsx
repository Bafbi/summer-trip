import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { FaTimes, FaUserPlus } from 'react-icons/fa';
import Header2 from "~/components/header2";

const GroupMembersPage = () => {
  const [members, setMembers] = useState<string[]>(["John", "Jane", "Bob"]);

  const removeMember = (member: string) => {
    const updatedMembers = members.filter((m) => m !== member);
    setMembers(updatedMembers);
  };

  const inviteMember = () => {
    // Code pour inviter un membre, à implémenter selon vos besoins
  };

  return (
    <>
      <Head>
        <title>Liste des membres du groupe</title>
      </Head>

      <div className="flex flex-col h-screen">
        {/* Header */}
        <Header2 />

        {/* Content */}
        <main className="flex-grow bg-[#405340] px-4 py-8 h-full overflow-y-auto">
          <div>
            <h2 className="text-center  text-[#E49A0A]">Liste des membres du groupe</h2>
            <ul className="mt-4  text-[#E49A0A]">
              {members.map((member, index) => (
                <li key={member} className={`flex items-center justify-between py-2 border rounded-lg px-4 ${index !== members.length - 1 ? 'mb-2' : ''}`}>
                  <span>{member}</span>
                  <button onClick={() => removeMember(member)}>
                    <FaTimes className="h-4 w-4 text-red-500" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <button
              className="bg-[#1E5552]  text-[#E49A0A] font-bold py-2 px-4 rounded"
              onClick={inviteMember}
            >
              Inviter un membre
            </button>
          </div>
        </main>

        {/* Footer */}
        {/* ... */}
      </div>
    </>
  );
};

export default GroupMembersPage;
