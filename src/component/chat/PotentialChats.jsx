import React, {useContext} from 'react'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext';

function PotentialChats() {
    const {user} = useContext(AuthContext);
    const { potentialChats, createChat } = useContext(ChatContext); 

    console.log('PotentialChats:', potentialChats); 
    return (
        <>
            <div>Start Chat</div>
            <div>
                {potentialChats && potentialChats.map((u, index) => {
                    return (
                        <div key={index} onClick={
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
                            {u.fullName}
                            <span className='text-green-400'>En ligne</span>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default PotentialChats;