import { useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { api } from "~/utils/api";

export const DropdownMenu = () => {
  return (
    (
      <div className="fixed right-0 top-10 w-48 bg-[#1CCDB3] rounded-md shadow-lg">
        <Link href="/profile">
          <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
            Profile
          </span>
        </Link>
        <Link href="/settings">
          <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
            Settings
          </span>
        </Link>
        <Link href="/help">
          <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
            Help
          </span>
        </Link>
        <button
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          onClick={() => void signOut({redirect: true, callbackUrl: '/'})}
        >
          Sign out
        </button>
      </div>
    )
  );
};