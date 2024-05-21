import React from 'react';

const ChatList = ({ chats, selectChat }) => {
    return (
        <div className="chat-list">
            {chats && chats.map((chat) => (
                <div 
                    key={chat._id} 
                    onClick={() => selectChat(chat)} 
                    className="chat-item cursor-pointer p-2 hover:bg-gray-200"
                >
                    {chat.name || `Chat ${chat._id}`}
                </div>
            ))}
        </div>
    );
};

export default ChatList;