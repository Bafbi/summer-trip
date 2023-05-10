import { useState } from "react";
import Link from "next/link";
import React from "react";


const MobilePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="flex justify-between items-center h-16 bg-teal-900 text-amber-500 px-4">
          <button
            className="text-amber-500 hover:text-gray-300 focus:outline-none"
            onClick={() => console.log("back")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
          <h1 className="text-xl font-bold">Séjour Paris</h1>
          <button
            className="text-amber-500 hover:text-gray-300 focus:outline-none"
            onClick={toggleMenu}
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
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>
        </header>
        {/* Content */}
        <main className="flex-grow bg-teal-500 px-4 py-8">
          <h2 className="text-lg font-semibold mb-4 text-amber-400">Contenue de la page</h2>
        </main>
      </div>
      
      <div>
        <footer className="fixed bottom-0 left-0 right-0 bg-teal-900 text-amber-500">
          <div className="flex justify-between items-center py-2 px-4">
            <button className="flex items-center space-x-1">
              {/* <HeartIcon /> */}
              <span>Like</span>
            </button>
            <button className="flex items-center space-x-1">
              {/* <MessageIcon /> */}
              <span>Comment</span>
            </button>
            <button className="flex items-center space-x-1">
              {/* <CalendarIcon /> */}
              <span>Calendar</span>
            </button>
          </div>
        </footer>
      </div>
    </>
  );
};

export default MobilePage;