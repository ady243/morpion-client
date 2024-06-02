import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'
import { useFetchRecipientUser } from '../../hook/useFetchRecipient'
import moment from 'moment'
import InputEmojiWithRef from 'react-input-emoji'

const LoadingMessage = ({message}) => (
   <p style={{
    textAlign:"center",
    width:"100%"
   }}>
      {message}
   </p>
)

const Message = ({message, isCurrentUser}) => (
    <div className={`p-2 mt-2 rounded-lg ${isCurrentUser ? "bg-red-500 text-white" : "bg-green-700 text-white"}`}>
        <span>{message.text}</span>
        <br></br>
        <span className="text-xs">{moment(message.createdAt).calendar()}</span>
    </div>
)

function ChatBox() {
   const {user} = useContext(AuthContext)
   const {currentChat, messages, isMessagesLoading, sendTextMessage} = useContext(ChatContext)
   const {recipientUser} = useFetchRecipientUser(currentChat, user)
   const [textMessage, setTextMessage]= useState("")

   if(!recipientUser) return <LoadingMessage message="Pas encore de conversation" />

   if(isMessagesLoading) return <LoadingMessage message="chargement du message" />

   const chatBoxStyle = {
    backgroundColor:"#12343"
   }

   const handleSendMessage = async () => {
        if (typeof sendTextMessage === 'function') {
            try {
                await sendTextMessage(textMessage, user, currentChat._id);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        } else {
            console.error('sendTextMessage is not a function');
        }
    }

  return (
    <div className="flex flex-col h-full" style={chatBoxStyle}>
        <div className="flex-grow overflow-auto p-4">
            <div>Les messages</div>
            <strong>{recipientUser?.fullName}</strong>
            {messages && Array.isArray(messages.messages) && messages.messages.map((message, index)=>
                <Message key={index} message={message} isCurrentUser={message?.senderId === user?._id} />
            )}
        </div>
        <div className='flex'>
            <InputEmojiWithRef value={textMessage} onChange={setTextMessage}/>
            <button onClick={handleSendMessage}>ddd</button>
        </div>
    </div>
  )
}

export default ChatBox