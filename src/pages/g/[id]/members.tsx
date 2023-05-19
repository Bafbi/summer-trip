import { type User } from "@prisma/client";
import { router } from "@trpc/server";
import { type NextPage, type GetStaticPaths, type GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaTimes, FaCopy } from "react-icons/fa";
import { AppHeader } from "~/components/header";
import { type RouterOutputs, api } from "~/utils/api";

export const getStaticProps: GetStaticProps = (context) => {
  const groupId = context.params?.id as string;
  return {
    props: {
      groupId,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

const GroupMembersPage: NextPage<{ groupId: string }> = ({ groupId }) => {
  // Members list
  const [members, setMembers] = useState<User[]>();

  const { data: groupData, isLoading: groupLoading } =
    api.group.getMembers.useQuery({ groupId: groupId });

  const { mutate: removeMember } = api.group.removeMember.useMutation({
    onSuccess: (_, variables) => {
      const updatedMembers = members?.filter((m) => m.id !== variables.userId);
      setMembers(updatedMembers);
    },
  });

  useEffect(() => {
    if (!groupLoading && groupData) {
      setMembers(groupData.members);
    }
  }, [groupData, groupLoading]); // Run the effect only once on component mount
  ///

  // Invitation links
  const { mutate: generateInvitationLink } =
    api.group.generateInvitationLink.useMutation();

  const [invitationLinks, setInvitationLinks] =
    useState<RouterOutputs["group"]["getInvitationLinks"]>();

  const { data: invitationLinkData } = api.group.getInvitationLinks.useQuery({
    groupId,
  });

  useEffect(() => {
    if (invitationLinkData) {
      setInvitationLinks(invitationLinkData);
    }
  }, [invitationLinkData]);

  const router = useRouter();
  ///

  const copyToClipboard = (text) => {
    const textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  };

  return (
    <>
      <Head>
        <title>{`Summer-Trip | Group members`}</title>
      </Head>
      <AppHeader groupId={groupId} groupName="Members" />
      <main className="h-screen  bg-[#405340] px-4 pt-8 ">
        <div id="membersList" className="border-2 border-[#E49A0A] rounded-lg p-4 mb-4">
          <h2 className="text-center  text-primary">Group members list</h2>
          <ul className="mt-4  text-primary">
            {members ? (
              members.map((member, index) => (
                <li
                  key={member.id}
                  className={`item-center flex justify-between px-4 py-2 ${index !== members.length - 1 ? 'border-b border-[#E49A0A]' : ''}`}
                >
                  <span>{member.name}</span>
                  <button
                    onClick={() => removeMember({ groupId, userId: member.id })}
                  >
                    <FaTimes className="h-4 w-4 text-red-500" />
                  </button>
                </li>
              ))
            ) : (
              <li className="item-center flex justify-between px-4 py-2">
                <span>Chargement...</span>
              </li>
            )}
          </ul>
        </div>
        <div id="inviteLinks">
          <button
            className="rounded-full bg-[#E49A0A] px-4 py-2 text-[#1E5552]"
            onClick={() => generateInvitationLink({ groupId })}
          >
            Generate invitation links
          </button>
          <ul className="mt-4  text-primary">
            {invitationLinks ? (
              invitationLinks.map((inviteLink, index) => (
                <li
                  key={inviteLink.id}
                  className="item-center flex justify-between  py-2"
                >
                  <span className="text-sm sm:text-base">{`https://summertrip.fr${router.basePath}/i/${inviteLink.link}`}</span>
                  <div>
                    
                      <button onClick={() => copyToClipboard(`https://summertrip.fr${router.basePath}/i/${inviteLink.link}`)}>
                        <FaCopy className="h-4 w-4 text-primary" />
                      </button>
                    
                  </div>
                </li>
              ))
            ) : (
              <li className="item-center flex justify-between px-4 py-2">
                <span>Chargement...</span>
              </li>
            )}
          </ul>
        </div>
      </main>
    </>
  );
};

export default GroupMembersPage;
