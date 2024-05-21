import React, { useState } from 'react';

const MessageInput = ({ sendMessage }) => {
    const [text, setText] = useState('');

    const handleSend = () => {
        if (text.trim()) {
            sendMessage(text);
            setText('');
        }
    };

    return (
        <div className="message-input p-4 flex items-center border-t border-gray-200">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Tapez votre message ici ..."
                className="flex-1 p-2 border rounded"
            />
            <button onClick={handleSend} className="ml-2 p-2 bg-blue-500 text-white rounded">
                Envoyer
            </button>
        </div>
    );
};

export default MessageInput;
