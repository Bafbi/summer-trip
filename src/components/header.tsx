import { useState } from "react";
import Link from "next/link";
import { AppDropMenu } from "~/components/dropMenu";
import {GroupDropMenu} from "~/components/dropMenu";
import {useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const AppHeader = (props: { groupId: string, groupName: string }) => {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  
  };

  return (
    <>
      {/* Header */}
      <header className="">
        <div className="flex h-16 items-center justify-between bg-[#1E5552] px-4 text-[#E49A0A]">
         
            <button
              className="text-[#E49A0A] hover:text-gray-300 focus:outline-none"
              onClick={() => router.back()} 
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.707 5.293a1 1 0 00-1.414 0L6.586 9.586a1 1 0 000 1.414L10.293 15.707a1 1 0 001.414-1.414L8.414 11H16a1 1 0 100-2H8.414l3.293-3.293a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          
          <h1 className="text-xl font-bold">{props.groupName}</h1>
          <button
            className="text-[#E49A0A] hover:text-[#E49A0A] focus:outline-none"
            onClick={toggleMenu}
            onBlur={() => setIsMenuOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              {isMenuOpen ? (
                <path
                  fillRule="evenodd"
                  d="M3 18a1 1 0 01-1-1V3a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H3zm1-7h12v2H4v-2zM4 6h12v2H4V6z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M3 4h14a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1zm0 6h14a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1v-2a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>
        </div>
        {/* Dropdown */}
        <AppDropMenu isOpen={isMenuOpen} groupId={props.groupId} />
      </header>
      {/* Menu */}
    </>
  );
};


export const GroupHeader = () => {
  const { data: sessionData } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  
  };

  return (
    <>
      {/* Header */}
      <header className="">
        <div className="flex h-16 items-center justify-between bg-[#1E5552] px-4 text-[#E49A0A]">
          <Link href="/g">
            <button
              className="text-[#E49A0A] hover:text-gray-300 focus:outline-none"
              onClick={() => console.log("back")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.707 5.293a1 1 0 00-1.414 0L6.586 9.586a1 1 0 000 1.414L10.293 15.707a1 1 0 001.414-1.414L8.414 11H16a1 1 0 100-2H8.414l3.293-3.293a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </Link>
          <h1 className="text-xl font-bold">{sessionData?.user.name}</h1>
          <button
            className="text-[#E49A0A] hover:text-[#E49A0A] focus:outline-none"
            onClick={toggleMenu}
            onBlur={() => setIsMenuOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              {isMenuOpen ? (
                <path
                  fillRule="evenodd"
                  d="M3 18a1 1 0 01-1-1V3a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H3zm1-7h12v2H4v-2zM4 6h12v2H4V6z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M3 4h14a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1zm0 6h14a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1v-2a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>
        </div>
        {/* Dropdown */}
        <GroupDropMenu isOpen={isMenuOpen} />
      </header>
      {/* Menu */}
    </>
  );
};

