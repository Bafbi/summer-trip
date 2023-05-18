import Link from "next/link";
import { signOut } from "next-auth/react";

export const GroupDropMenu = (props:{isOpen:boolean}) => {

  return (
    <>

      <nav
        className={`${
          props.isOpen ? "h-52" : "h-0"
        } transition-height absolute w-screen overflow-hidden bg-[#1E5552]
          z-10 text-[#E49A0A] duration-500 ease-in-out`}
      >
        <ul className="flex h-full flex-col items-center justify-evenly">
          <li>
            <Link href="/profile">
              <span
                className="block px-4 py-2 text-lg font-semibold
                  text-[#E49A0A] hover:bg-gray-100 hover:text-gray-900"
              >
                Profile
              </span>
            </Link>
          </li>
          <li>
            <Link href="/settings">
              <span
                className="block px-4 py-2 text-lg font-semibold
                text-[#E49A0A] hover:bg-gray-100 hover:text-gray-900"
              >
                Settings
              </span>
            </Link>
          </li>
          <li>
            <button
              className="block w-full px-4 py-2 text-left text-lg font-semibold text-[#E49A0A] hover:bg-gray-100 hover:text-gray-900"
              onClick={() => void signOut({ redirect: true, callbackUrl: "/" })}
            >
              Sign out
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export const AppDropMenu = (props:{isOpen:boolean, groupId: string}) => {

  

  return (
    <>
      <nav
        className={`${
          props.isOpen ? "h-52" : "h-0"
        } transition-height absolute z-10 w-screen overflow-hidden
          bg-[#1E5552] text-[#E49A0A] duration-500 ease-in-out`}
      >
        <ul className="flex h-full flex-col items-center justify-evenly">
          <li>
            <Link href={`/g/${props.groupId}/settings`}>
              <span
                className="block px-4 py-2 text-lg font-semibold
                  text-[#E49A0A] hover:bg-gray-100 hover:text-gray-900"
              >
                Groupe
              </span>
            </Link>
          </li>
          <li>
            <Link href={`/g/${props.groupId}/members`}>
              <span
                className="block px-4 py-2 text-lg font-semibold
                text-[#E49A0A] hover:bg-gray-100 hover:text-gray-900"
              >
                Membres
              </span>
            </Link>
          </li>
          <li>
            <Link href={`/g/${props.groupId}/activities`}>
              <span
                className="block px-4 py-2 text-lg font-semibold
                text-[#E49A0A] hover:bg-gray-100 hover:text-gray-900"
              >
                Activités
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};