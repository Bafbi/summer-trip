import { useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { api } from "~/utils/api";

export const DropdownMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    (
      <nav
          className={`${
            isMenuOpen ? "h-44" : "h-0"
          } overflow-hidden bg-[#1E5552] text-[#E49A0A] transition-height ease-in-out duration-500`}
        >
          <ul className="flex flex-col items-center justify-evenly h-full">
            <li>
                <Link href="/profile">
                  <span className="block px-4 py-2 text-lg font-semibold
                  text-[#E49A0A] hover:bg-gray-100 hover:text-gray-900">
                    Profile
                  </span>
              </Link>
            </li> 
            <li>
              <Link href="/settings">
                <span className="block px-4 py-2 text-lg font-semibold
                text-[#E49A0A] hover:bg-gray-100 hover:text-gray-900">
                  Settings
                </span>
              </Link>
            </li>
            <li>
              <button
                className="block w-full text-left px-4 py-2 text-lg text-[#E49A0A] font-semibold hover:bg-gray-100 hover:text-gray-900"
                onClick={() => void signOut({redirect: true, callbackUrl: '/'})}
              >
                Sign out
              </button>
            </li>
          </ul>
        </nav>
    )
  );
};