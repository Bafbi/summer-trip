import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const { data: session } = useSession();

  return (
    <>
      <div className="flex bg-[#1E5552] p-2">
        <Link className="basis-1/8" href={"/g"}>
          <Image
            className="h-12 w-12"
            src="/icon_propre.png"
            alt="ChitChat Logo"
            width={64}
            height={64}
          />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#E49A0A]">Groups</h1>
        </div>
        <div className="basis-1/12">
          <button
            className="h-12 w-12 "
            onClick={session ? () => void signOut() : () => void signIn()}
          >
            {session?.user.image ? (
              <Image
                className="rounded-full"
                src={session.user.image}
                alt="User Logo"
                width={64}
                height={64}
              />
            ) : (
              "Sign in"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
