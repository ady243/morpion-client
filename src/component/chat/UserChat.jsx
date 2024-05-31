import React from 'react'
import { useFetchRecipientUser } from '../../hook/useFetchRecipient';

const UserChat = ({chat, user}) =>{

    const {recipientUser} = useFetchRecipientUser(chat, user);
  
  return (
   <div>
    <h1>User Chat</h1>
    <h1>{recipientUser?.fullName}</h1>
    <div> 
        Text Message ici
    </div>
    <div>
        <div>
        <span className='text-green-400'>0</span>
            31/05/2024
        </div>
      
    </div>
   </div>
  )
}

export default UserChat