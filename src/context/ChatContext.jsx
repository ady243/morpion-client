import React, { useContext, useState, useEffect, useCallback } from 'react';
import { createContext } from 'react';
import { getRequest, baseUrl, postRequest,baseUrlSocket } from '../utils/services';
import { AuthContext } from './AuthContext';
import { io } from 'socket.io-client';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children}) => {
    const { user } = useContext(AuthContext);
    const [userChat, setUserChat] = useState(null);
    const [isUserChatLoading, setIsUserChatLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState(null)
    const [isMessagesLoading, setisMessagesLoading] = useState(false)
    const [messagesError, setMessagesError] = useState(null)
    const [sendTextMessageError, setSendTextMessageError]=useState(null)
    const [newMessage, setNewMessage]=useState(null)
    const [textMessage, setTextMessage] = useState("");
    const [socket, setSocket]=useState(null)
    const [onlineUsers, setOnlineUsers]=useState(null)



    useEffect(()=>{
        const newSocket = io("http://localhost:4000")
        setSocket(newSocket)

        return () =>{
            newSocket.disconnect()
        }
    }, [user])

    useEffect(()=>{
       if(socket === null) return;
       socket.emit("addNewUser", user?._id)
       socket.on("getOnlineUsers", (res)=>{
        setOnlineUsers(res)
       })

       return () =>{
        socket.off("getOnlineUsers")
       }

    }, [socket])


    //send message
    useEffect(()=>{
        if(socket === null) return;

        const recipientId = currentChat?.numbers?.find((id) => id !== user?._id);
        socket.emit("sendMessage", {...newMessage, recipientId})
 
     }, [newMessage])


    useEffect(() => {
        if (!user) {
            console.error('User is null');
            return;
        }
    
        const getUsers = async () => {
            const response = await getRequest(`${baseUrl}/users/`);
            if(response.error){
                return console.error('error:', response.error);
            }
            const pChats = response.filter((u)=>{
                let isChatCreated = false;
                
                if(user._id === u._id){
                    return false;
                }
    
                if(userChat){
                    isChatCreated = userChat?.some((chat) => {
                        return chat?.members && (chat.members[0] === u._id || chat.members[1] === u._id);
                    });
                }
    
                return !isChatCreated;
            })
    
            setPotentialChats(pChats);
        };
    
        getUsers();
    }, [userChat]);

    useEffect(() => {
        const getUserChats = async () => {
            if(user?._id){
                setIsUserChatLoading(true);
                setUserChatsError(null);
    
                try {
                    const response = await getRequest(`${baseUrl}/chats/${user?._id}`);
                 
                    setIsUserChatLoading(false);
    
                    if(response.error){
                        return setUserChatsError(response);
                    }
                    if(!response.chats){
                        console.log('response does not contain chats');
                    }
                    setUserChat(response.chats);
                } catch (error) {
                    console.error('request failed:', error);
                }
            }
        }
    
        getUserChats();
    }, [user]);


    useEffect(() => {
        const getMessages = async () => {
            if (!currentChat || !currentChat._id) {
                return;
            }
    
            setisMessagesLoading(true);
            setMessagesError(null);
    
            const response = await fetch(`${baseUrl}/messages/${currentChat._id}`);
    
            setisMessagesLoading(false);
    
            if (response.ok) {
                const text = await response.text();
                if (text !== 'PRO FEATURE ONLY') {
                    const data = JSON.parse(text);
                    setMessages(data);
                } else {
                    setMessagesError('La fonctionnalité requise est une fonctionnalité pro');
                }
            } else {
                setMessagesError(`Erreur de requête: ${response.status}`);
            }
        }
    
        getMessages();
    
    }, [currentChat]);

    const sendTextMessage = useCallback( async (textMessage, sender, currentChatId)=>{
        if(!textMessage) return console.log("must type something")
   
           const response = await postRequest(`${baseUrl}/messages`, {
               chatId: currentChatId,
               senderId: sender._id,
               text: textMessage
           });
       if(response.error){
           return setSendTextMessageError(response)
       }
       setNewMessage(response)
       setMessages((prev) => Array.isArray(prev) ? [...prev, response] : [response]);
       setTextMessage("")
   },  [])

    //recevoir le message 

    useEffect(()=>{
     if(socket === null) return

    socket.on("getMessage", res => {
            if(currentChat?._id !== res.chatId) return

            setMessages((prev) => Array.isArray(prev) ? [...prev, res] : [res]);
            })

            return ()=>{
                socket.off("getMessage")
            }

    }, [socket, currentChat])


    const updateCurrentChat = useCallback((chat)=>{
        setCurrentChat(chat);
    }, [])

        const createChat = useCallback( async(firstId, secondId)=>{
            const response = await postRequest(`${baseUrl}/chats`, {
                firstId: firstId,
                secondId: secondId
            });
            if(response.error){
                console.error('error:', response.error);
            }
            setUserChat((prev)=> [...prev, response.chat]);
        },[])

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
                isMessagesLoading,
                messagesError,
                sendTextMessage,
                onlineUsers
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}