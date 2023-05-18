import { useEffect, useState } from "react";
import Head from "next/head";
import { FaTimes } from 'react-icons/fa';
import { AppHeader } from "~/components/header";
import { type GetStaticProps, type GetStaticPaths, NextPage } from "next";
import { api } from "~/utils/api";
import { User } from "@prisma/client";

export const getStaticProps: GetStaticProps = (context) => {
  const groupId = context.params?.id as string;
  return {
    props: {
      groupId,
    },
  };
}

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
}

const GroupMembersPage: NextPage<{groupId: string}> = ({groupId}) => {
  const [members, setMembers] = useState<User[]>([]);

  const [inviteInput, setInviteInput] = useState<string>("");

  const { data: groupData, isLoading: groupLoading } = api.group.getMembers.useQuery({ groupId: groupId });

  const { mutate: removeMember } = api.group.removeMember.useMutation({
    onSuccess: (_, variables) => {
      const updatedMembers = members.filter((m) => m.id !== variables.userId);
      setMembers(updatedMembers);
    },
  });


  useEffect(() => {
    if (!groupLoading && groupData) {
      setMembers(groupData.members);
    }
  }, [groupData, groupLoading]); // Run the effect only once on component mount


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
        <AppHeader 
          groupId={groupId}
          groupName="Members"
        />

        {/* Content */}
        <main className="flex-grow bg-[#405340] px-4 py-8 h-full overflow-y-auto">
          <div>
            <h2 className="text-center  text-[#E49A0A]">Liste des membres du groupe</h2>
            <ul className="mt-4  text-[#E49A0A]">
              {members.map((member, index) => (
                <li key={member.id} className="flex item-center justify-between py-2 px-4">
                  <span>{member.name}</span>
                  <button onClick={() => removeMember({groupId, userId: member.id})}>
                    <FaTimes className="h-4 w-4 text-red-500" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 w-full justify-center flex">
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