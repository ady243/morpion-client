import React, { useContext, useState, useEffect } from "react";
import NavBar from "../component/NavBar.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import Chat from "./ChatPage.jsx";
import Game from "../component/Game.jsx";

export default function Home() {
    const { currentUser, user } = useContext(AuthContext);
    const [isChatOpen, setChatOpen] = useState(false);
    const [hasUnreadMessage, setHasUnreadMessage] = useState(false); 
    useEffect(() => {
      if (isChatOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'hidden auto';
      }
    }, [isChatOpen]);

    const toggleChat = () => {
      setChatOpen(!isChatOpen);
      setHasUnreadMessage(false);
    };

    return (
      <>
        <NavBar hasUnreadMessage={hasUnreadMessage} /> 
        <div>
          <button onClick={toggleChat} className="fixed bottom-5 right-5 z-50 p-2 bg-blue-500 text-white rounded-full shadow-lg">
            {hasUnreadMessage ? 'Nouveau message !' : 'Ouvrir le chat'} 
          </button>
        </div>
        <div className="text-center">
          {currentUser ? <h1>Bonjour, {currentUser.fullName}</h1> : <h1>Veuillez vous connecter</h1>}
        </div>
        <div className="flex items-center justify-center h-screen">
          <Game />
        </div>
        {isChatOpen && (
            <div className="fixed right-0 top-0 h-screen w-1/3 overflow-auto z-50">
                <Chat setChatOpen={setChatOpen} setHasUnreadMessage={setHasUnreadMessage} /> 
            </div>
        )}
      </>
    );
  }
