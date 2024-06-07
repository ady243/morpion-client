import React, { useContext } from 'react';
import { useFetchRecipientUser } from '../../hook/useFetchRecipient';
import { ChatContext } from '../../context/ChatContext';

const UserChat = ({ chat, user }) => {
    const { recipientUser } = useFetchRecipientUser(chat, user);
    const { onlineUsers } = useContext(ChatContext);

    const isOnline = onlineUsers?.some((user) => user?.userId === recipientUser?._id);

    return (
        <>
            <h4 className="text-lg font-semibold">{recipientUser?.fullName}</h4>
            <div className='notification'>
                <span className={isOnline ? 'bg-green-400 w-2 h-2 rounded-full' : 'bg-red-500 w-2 h-2 rounded-full'}></span>
            </div>
        </>
    );
};

export default UserChat;