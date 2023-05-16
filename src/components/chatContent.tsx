import { FaHeart, FaTimes, FaRegHeart } from 'react-icons/fa';
import React, { useState } from "react";

const ChatPageContent = () => {



  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      const [messages, setMessages] = useState([]); // Tableau des messages
      const [newMessage, setNewMessage] = useState(""); // Nouveau message à envoyer

      {/* // Fonction pour gérer l'envoi du message
      const handleSendMessage = () => {
        if (newMessage.trim() !== "") {
          setMessages([...messages, newMessage]); // Ajouter le nouveau message à la liste des messages
          setNewMessage(""); // Réinitialiser le champ de saisie du message
        }
  }; */}
    
    </div>
  );
};

export default ChatPageContent;