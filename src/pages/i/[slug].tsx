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

  const router = useRouter();

  useSession({
    required: true,
  });

  const { data: invitationData, isLoading: invitationLoading } = api.group.useInvitationLink.useQuery(
    { link: inviteLink }
  );

  if (invitationLoading) return <div>Loading...</div>;

  if (invitationData) {
    void router.push(`/g`);
  }

  return <div>Something went wrong</div>;
};

export default InvitePage;
