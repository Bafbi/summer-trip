import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

export const getStaticProps: GetStaticProps = (context) => {
  const inviteLink = context.params?.slug as string;
  return {
    props: {
      inviteLink,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

const InvitePage: NextPage<{ inviteLink: string }> = ({ inviteLink }) => {
  useSession({
    required: true,
  });
  const router = useRouter();

  const { data: invitationData, isLoading: invitationLoading } =
    api.group.getGroupByInvitationLink.useQuery({ link: inviteLink });

  const { mutate } = api.group.useInvitationLink.useMutation({
    onSuccess: () => {
      void router.push(`/g`);
    },
  });

  return (
    <>
      <main className="flex h-screen flex-col items-center justify-center bg-[#40534D]">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-4xl font-bold text-[#E49A0A]">SUMMER TRIP</h1>
          <p className="text-2xl font-semibold text-[#E49A0A]">Invitation</p>
          {invitationLoading ? (
            <p>Loading...</p>
          ) : !invitationData ? (
            <p>Something went wrong</p>
          ) : (
            <p className="text-2xl font-semibold text-[#E49A0A]">
              Vous avez été invité à rejoindre le groupe {invitationData.group.name}
            </p>
          )}
          <button
            className="rounded-lg bg-[#1E5552] px-4 py-2 text-lg font-semibold text-[#E49A0A] disabled:opacity-50 hover:bg-[#1CCDB3]"
            onClick={() => void mutate({link: inviteLink})}
            {...(invitationLoading || !invitationData ? { disabled: true } : {})}
          >
            Rejoindre le groupe
          </button>
        </div>
      </main>
    </>
  );
};

export default InvitePage;
