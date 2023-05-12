import { useState } from "react";
import Link from "next/link";
import React from "react";
import { DropdownMenu } from "~/components/menu";
import Head from "next/head";
import { useSession, signOut } from "next-auth/react";
import { api } from "~/utils/api";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Header */}
      <header className="">
        <div className="flex justify-between items-center h-16 bg-[#1E5552] text-[#E49A0A] px-4">
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
          <h1 className="text-xl font-bold">Séjour Paris</h1>
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
          <nav
          className={`${
            isMenuOpen ? "h-52" : "h-0"
          } overflow-hidden bg-[#1E5552] text-[#E49A0A] transition-height ease-in-out duration-500 absolute w-screen`}
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
        </header>
        {/* Menu */}
        
    </>
  );
}

export default Header;