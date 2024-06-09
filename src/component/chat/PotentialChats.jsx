import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { io } from 'socket.io-client';
import moment from 'moment';

function PotentialChats() {
    const { user } = useContext(AuthContext);
    const { potentialChats, createChat, onlineUsers, messages, updateCurrentChat } = useContext(ChatContext);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('https://morpion-soket-back.onrender.com');
        setSocket(newSocket);

        newSocket.on('newMessage', (newMessage) => {
            updateCurrentChat(newMessage);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [updateCurrentChat]);

    const hasNewMessages = (userId) => {
        const hasNewMessages = messages.some(message => message.recipientId === user._id && message.senderId === userId);
        return hasNewMessages;
    };

    return (
        <>
            <div>Mes contacts</div>
            <div className='mt-12 flex'>
                {potentialChats && potentialChats.map((potentialChat, index) => {
                    const hasNewMessage = hasNewMessages(potentialChat._id);
                    return (
                        <div className='relative flex flex-col items-start' key={index} onClick={async () => {
                            if (user && user._id) {
                                try {
                                    await createChat(user._id, potentialChat._id);
                                    await updateCurrentChat({ _id: potentialChat._id, members: [user._id, potentialChat._id] });
                                } catch (error) {
                                    console.error('Error creating chat:', error);
                                }
                            } else {
                                console.error('User or user._id is undefined');
                            }
                        }}>
                            <span className='border border-black rounded-full py-1 px-3 mr-3 cursor-pointer'>
                                {potentialChat?.fullName}
                                <span className="text-xs">{moment(potentialChat.createdAt).calendar()}</span>
                            </span>
                            {hasNewMessage && <span className="text-blue-500">*</span>}
                            <span className={
                                onlineUsers && onlineUsers.some(user => user?.userId === potentialChat?._id) ?
                                    'bg-green-400 w-2 h-2 rounded-full' : 'bg-red-500 w-2 h-2 rounded-full'
                            }></span>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default PotentialChats;
