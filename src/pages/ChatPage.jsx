import React, { useContext, useEffect, useMemo, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import UserChat from "../component/chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../component/chat/PotentialChats";
import ChatBox from "../component/chat/ChatBox";


function createUniqueUserChat(userChat) {
    if (!userChat) {
        return [];
    }
    return Object.values(userChat.reduce((uniqueChats, chat) => {
        const chatId = chat._id;
        if (!uniqueChats[chatId]) {
            uniqueChats[chatId] = chat;
        }
        return uniqueChats;
    }, {}));
}
function Chat({ setChatOpen }) {
    const { user } = useContext(AuthContext);
    const { userChat, isUserChatLoading, updateCurrentChat, currentChat } = useContext(ChatContext);
    const uniqueUserChat = useMemo(() => createUniqueUserChat(userChat), [userChat]);
    const [hasUnreadMessage, setHasUnreadMessage] = useState(false); 
    const [socket, setSocket] = useState(null);
  
    useEffect(() => {
       const currentChatId = currentChat?._id;
        if (currentChatId) {
            const chat = userChat.find((chat) => chat._id === currentChatId);
            if (!chat) {
                updateCurrentChat(null);
            }
        }
    }, [currentChat]);

    useEffect(() => {
        if (socket === null || currentChat === null) return;

        const messageListener = (res) => {
            if (!currentChat || currentChat._id !== res.chatId) {
                setHasUnreadMessage(true); 
                return;
            }

            setMessages((prev) => [...prev, res]);
        };

        socket.on("getMessage", messageListener);

        return () => {
            socket.off("getMessage", messageListener);
        };
    }, [socket, currentChat]);

    if (!userChat) return null;

    const handleChatSelect = (chat) => {
        updateCurrentChat(chat);
    };

    const handleCloseChat = () => {
      setChatOpen(false);
  };

    return (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
           <button onClick={handleCloseChat} className="absolute top-0 right-0 m-4 p-2 bg-red-500 text-white rounded-full">
                X
            </button>
            <div className="flex flex-col items-center mt-24 p-4">
                <PotentialChats />
                <div className="mt-8 flex w-full justify-between">
                    <div className="flex flex-col items-start flex-1 w-96">
                        {isUserChatLoading && <p className="text-center">Loading...</p>}
                        {uniqueUserChat.map((chat, index) => (
                            <div
                                key={index}
                                onClick={() => handleChatSelect(chat)}
                                className="mt-4 p-4 w-full cursor-pointer"
                            >
                                <UserChat chat={chat} user={user} />
                            </div>
                        ))}
                    </div>
                    <div>
                        <ChatBox/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
