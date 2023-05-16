import React from "react";
import { FaHeart, FaTimes, FaRegHeart } from 'react-icons/fa';

const CoeurPageContent = () => {
  return (
    <div>
      <h2 className="text-center text-[#E49A0A] font-semibold">Envie d'une activité ?</h2>
      <div className="flex justify-center items-center h-72">
        {/* Placeholder pour l'image de l'activité */}
        {/* Utilisez une logique pour afficher l'image récupérée de l'API */}
        <div className="w-64 h-64 bg-gray-200"></div>
      </div>
      <div className="flex justify-center mt-4">
        {/* Boutons ronds */}
        <button className="w-20 h-20 rounded-full bg-[#1E5552] text-white flex justify-center items-center">
          <FaTimes className="h-8 w-8" />
        </button>
        <button className="w-20 h-20 rounded-full bg-gray-500 text-white flex justify-center items-center font-extrabold ml-6">
          Maybe
        </button>
        <button className="w-20 h-20 rounded-full bg-red-500 text-white flex justify-center items-center ml-6">
          <FaHeart className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
};

export default CoeurPageContent;
