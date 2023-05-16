import { useState } from "react";
import Link from "next/link";
import React from "react";
import Head from "next/head";
import { useSession, signOut } from "next-auth/react";
import { api } from "~/utils/api";

const DropMenu = (props:{isOpen:boolean}) => {

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
            <Link href="/p">
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

export default DropMenu;
