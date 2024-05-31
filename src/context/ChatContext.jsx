import React, { useContext, useState, useEffect, useCallback } from 'react';
import { createContext } from 'react';
import { getRequest, baseUrl, postRequest } from '../utils/services';
import { AuthContext } from './AuthContext';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children}) => {
    const { user } = useContext(AuthContext);
    const [userChat, setUserChat] = useState(null);
    const [isUserChatLoading, setIsUserChatLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);


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

        const createChat = useCallback( async(firstId, secondId)=>{
            const response = await postRequest(`${baseUrl}/chats`, {
                firstId: firstId,
                secondId: secondId
            });
            console.log('response:', response);
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
                createChat
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}