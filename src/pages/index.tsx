import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

import { useRouter } from "next/router";

const Home: NextPage = () => {

  const { data: sessionData } = useSession();
  const router = useRouter();

  if (sessionData) {
    void router.push("/g");
  }

  const handleSignIn = () => {
    void signIn(undefined, {callbackUrl: "/g"}); // Perform the sign-in action
  };

  return (
    <>
      <Head>
        <title>Summer Trip</title>
        <meta name="description" content="Summer TRIP" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#1E5552]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="font-bold text-4xl">SUMMER TRIP</h1>
          <Image
                className=""
                src={"/logo.svg"}
                alt="User Logo"
                width={600}
                height={600}
              />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8"></div>
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase onSignIn={handleSignIn} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;


type AuthShowcaseProps = {
  onSignIn: () => void;
};

const AuthShowcase: React.FC<AuthShowcaseProps> = ({ onSignIn }) => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Bienvenue {sessionData.user?.name}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : onSignIn}
      >
        {sessionData ? "Se déconnecter" : "Se connecter"}
      </button>
    </div>
  );
};