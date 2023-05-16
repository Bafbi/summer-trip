import React from "react";
import { FaHeart, FaTimes, FaRegHeart } from 'react-icons/fa';

const CoeurPageContent = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <h2 className="text-center text-[#E49A0A] font-bold text-2xl">Envie d'une activité ?</h2>
      <div className="flex justify-center items-center">
        {/* Placeholder pour l'image de l'activité */}
        {/* Utilisez une logique pour afficher l'image récupérée de l'API */}
        <div className="w-full h-96 bg-gray-200"></div>
      </div>
      <div className="flex justify-center mt-4">
        {/* Boutons ronds */}
        <button className="w-24 h-24 rounded-full bg-[#1E5552] text-white flex justify-center items-center">
          <FaTimes className="h-8 w-8" />
        </button>
        <button className="w-24 h-24 rounded-full bg-gray-500 text-white flex justify-center items-center font-extrabold ml-6">
          Maybe
        </button>
        <button className="w-24 h-24 rounded-full bg-red-500 text-white flex justify-center items-center ml-6">
          <FaHeart className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
};

export default CoeurPageContent;
