import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getRequest, postRequest, baseUrl } from '../utils/services';
import { AuthContext } from './AuthContext';
import { io } from 'socket.io-client';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [userChat, setUserChat] = useState(null);
    const [isUserChatLoading, setIsUserChatLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [isMessagesLoading, setisMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [textMessage, setTextMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const newSocket = io("https://morpion-soket-back.onrender.com");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    useEffect(() => {
        if (socket === null || user === null) return;
        socket.emit("addNewUser", user._id);
        socket.on("getOnlineUsers", (res) => {
            setOnlineUsers(res);
        });

        return () => {
            socket.off("getOnlineUsers");
        };
    }, [socket, user]);

    useEffect(() => {
        if (socket === null || user === null || currentChat === null) return;

        const recipientId = currentChat?.members?.find((id) => id !== user._id);
        if (recipientId) {
            socket.emit("sendMessage", { ...newMessage, recipientId });
        }

    }, [newMessage, user, socket, currentChat]);

    useEffect(() => {
        if (!user) {
            console.error('User is null');
            return;
        }

        const getUsers = async () => {
            const response = await getRequest(`${baseUrl}/users/`);
            if (response.error) {
                return console.error('error:', response.error);
            }
            const pChats = response.filter((u) => {
                let isChatCreated = false;

                if (user._id === u._id) {
                    return false;
                }

                if (userChat) {
                    isChatCreated = userChat?.some((chat) => {
                        return chat?.members && (chat.members[0] === u._id || chat.members[1] === u._id);
                    });
                }

                return !isChatCreated;
            });

            setPotentialChats(pChats);
        };

        getUsers();
    }, [userChat]);

    useEffect(() => {
        const getUserChats = async () => {
            if (user?._id) {
                setIsUserChatLoading(true);
                setUserChatsError(null);

                try {
                    const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

                    setIsUserChatLoading(false);

                    if (response.error) {
                        return setUserChatsError(response);
                    }
                    if (!response.chats) {
                        return setUserChat([]);
                    }
                    setUserChat(response.chats);
                } catch (error) {
                    console.error('request failed:', error);
                }
            }
        }

        getUserChats();
    }, [user]);

    const getMessages = useCallback(async (chatId) => {
        setisMessagesLoading(true);
        setMessagesError(null);

        const response = await fetch(`${baseUrl}/messages/${chatId}`);

        setisMessagesLoading(false);

        if (response.ok) {
            const text = await response.text();
            if (text !== 'PRO FEATURE ONLY') {
                const data = JSON.parse(text);
                setMessages(data.messages);
            } else {
                setMessagesError('La fonctionnalité requise est une fonctionnalité pro');
            }
        } else {
            setMessagesError(`Erreur de requête: ${response.status}`);
        }
    }, []);

    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId) => {
        if (!textMessage) return console.log("must type something");

        const response = await postRequest(`${baseUrl}/messages`, {
            chatId: currentChatId,
            senderId: sender._id,
            text: textMessage
        });
        if (response.error) {
            setSendTextMessageError(response);
            return response;
        }

        setMessages((prevMessages) => [...prevMessages, response]);
        setTextMessage("");
        return response;
    }, []);

    useEffect(() => {
        if (socket === null || currentChat === null) return;

        const messageListener = (res) => {
            if (!currentChat || currentChat._id !== res.chatId) return;

            setMessages((prev) => [...prev, res]);
        };

        socket.on("getMessage", messageListener);

        return () => {
            socket.off("getMessage", messageListener);
        };
    }, [socket, currentChat]);

    const updateCurrentChat = useCallback(async (chat) => {
        setCurrentChat(chat);
        await getMessages(chat._id);
    }, [getMessages]);

    const createChat = useCallback(async (firstId, secondId) => {
        const response = await postRequest(`${baseUrl}/chats`, {
            firstId: firstId,
            secondId: secondId
        });
        if (response.error) {
            console.error('error:', response.error);
        }
        setUserChat((prev) => [...prev, response.chat]);
        await updateCurrentChat(response.chat);
    }, [updateCurrentChat]);

    return (
        <ChatContext.Provider
            value={{
                userChat,
                setUserChat,
                isUserChatLoading,
                setIsUserChatLoading,
                userChatsError,
                setUserChatsError,
                potentialChats,
                setPotentialChats,
                createChat,
                updateCurrentChat,
                currentChat,
                messages,
                setMessages,
                isMessagesLoading,
                messagesError,
                sendTextMessage,
                onlineUsers,
                setOnlineUsers,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
