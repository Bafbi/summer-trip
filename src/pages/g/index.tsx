import { useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { api } from "~/utils/api";

const GroupsPage: NextPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: sessionData } = useSession();

  const { data: groupsData, isLoading: groupsLoading } = api.group.getAll.useQuery();

  if (groupsLoading) return <div>Loading...</div>;

  if (!groupsData) return <div>Something went wrong</div>;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <>
      <Head>
        <title>Groups</title>
      </Head>
      <main>
        <div className="flex justify-end pt-4 pr-4">
          <div className="relative">
            <button
              className="flex items-center space-x-2 text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
              onClick={toggleDropdown}
            >
              <span>{sessionData?.user?.name}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M3 10a7 7 0 1114 0 7 7 0 01-14 0zm7-7a1 1 0 012 0v2a1 1 0 11-2 0V3zm0 12a1 1 0 100 2 1 1 0 000-2z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                <Link href="/profile">
                  <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                    Profile
                  </a>
                </Link>
                <Link href="/settings">
                  <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                    Settings
                  </a>
                </Link>
                <Link href="/help">
                  <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                    Help
                  </a>
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default GroupsPage;
