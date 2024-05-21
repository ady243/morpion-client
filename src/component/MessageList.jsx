import React from 'react';

const MessageList = ({ messages }) => {
    return (
        <div className="message-list p-4 overflow-y-auto h-full">
            {messages.map((message) => (
                <div key={message._id} className="message-item mb-2">
                    <strong>{message.senderId}:</strong> {message.text}
                </div>
            ))}
        </div>
    );
};

export default MessageList;
