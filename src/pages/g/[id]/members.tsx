import { type User } from "@prisma/client";
import { type GetStaticPaths, type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaCopy, FaTimes } from "react-icons/fa";
import QRCode from "react-qr-code";
import { AppHeader } from "~/components/header";
import { api, type RouterOutputs } from "~/utils/api";

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

  const [invitationLinks, setInvitationLinks] = useState<
    RouterOutputs["group"]["getInvitationLinks"]
  >([]);

  const { mutate: generateInvitationLink } =
    api.group.generateInvitationLink.useMutation({
      onSuccess: (data) => {
        setInvitationLinks((links) => [...links, data]);
      },
    });

  const { data: invitationLinkData } = api.group.getInvitationLinks.useQuery({
    groupId,
  });

  useEffect(() => {
    if (invitationLinkData) {
      setInvitationLinks(invitationLinkData);
    }
  }, [invitationLinkData]);

  const router = useRouter();
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [qrCodeUrl, setQRCodeUrl] = useState("");

  const copyToClipboard = (text: string) => {
    const textField = document.createElement("textarea");
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  };

  const showQRCodeHandler = (url: string) => {
    setShowQRCodeModal(true);
    setQRCodeUrl(url);
  };

  return (
    <>
      <Head>
        <title>{`Summer-Trip | Group members`}</title>
      </Head>
      <AppHeader groupId={groupId} groupName="Members" />
      <main className="h-screen bg-[#405340] px-4 pt-8 ">
        <div
          id="membersList"
          className="mb-4 rounded-lg border-2 border-[#E49A0A] p-4"
        >
          <h2 className="text-center text-primary">Group members list</h2>
          <ul className="mt-4 text-primary">
            {members ? (
              members.map((member, index) => (
                <li
                  key={member.id}
                  className={`item-center flex justify-between px-4 py-2 ${
                    index !== members.length - 1
                      ? "border-b border-[#E49A0A]"
                      : ""
                  }`}
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
          <ul className="mt-4 text-primary">
            {invitationLinks ? (
              invitationLinks.map((inviteLink, index) => (
                <li
                  key={inviteLink.id}
                  className="item-center flex justify-between py-2"
                >
                  <div className="flex items-center">
                    <span className="text-xs sm:text-base">
                      {`https://summertrip.fr${router.basePath}/i/${inviteLink.link}`}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `https://summertrip.fr${router.basePath}/i/${inviteLink.link}`
                        )
                      }
                      className="ml-2"
                    >
                      <FaCopy className="h-4 w-4 text-primary" />
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        showQRCodeHandler(
                          `https://summertrip.fr${router.basePath}/i/${inviteLink.link}`
                        )
                      }
                    >
                      QR Code
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
        {showQRCodeModal && (
          <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
            <div className="max-h-80vh max-w-md overflow-y-auto rounded-lg bg-[#E49A0A] p-4 text-center">
              <h3 className=" mb-4 text-lg font-bold text-[#1E5552]">
                QR Code
              </h3>
              <QRCode value={qrCodeUrl} size={200} />
              <button
                className="absolute right-4 top-4 text-[#E49A0A] hover:text-gray-700"
                onClick={() => setShowQRCodeModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default GroupMembersPage;
