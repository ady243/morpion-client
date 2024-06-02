import React, {useContext} from 'react'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext';

function PotentialChats() {
    const {user} = useContext(AuthContext);
    const { potentialChats, createChat, onlineUsers } = useContext(ChatContext); 

    return (
        <>
            <div>Mes contact</div>
            <div className='mt-12 flex'>
                {potentialChats && potentialChats.map((u, index) => {
                    return (
                        <div className='relative flex items-center' key={index} onClick={
                            async () => {
                                if (user && user._id) {
                                    try {
                                        await createChat(user._id, u._id)
                                    } catch (error) {
                                        console.error('Error creating chat:', error);
                                    }
                                } else {
                                    console.error('User or user._id is undefined');
                                }
                            }
                        }>
                          <span className='border border-black rounded-full py-1 px-3 mr-2'>{u.fullName}</span>
                     
                            <span className={
                                onlineUsers.some((user)=>user?.userId === u?._id) ?
                                'bg-green-400 w-2 h-2 rounded-full' : 'bg-red-500 w-2 h-2 rounded-full' }></span>
                        </div>


                    );
                })}
            </div>
        </>
    );
}

export default PotentialChats;