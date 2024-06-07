import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { useFetchRecipientUser } from '../../hook/useFetchRecipient';
import moment from 'moment';
import { io } from 'socket.io-client';

const LoadingMessage = ({ message }) => (
    <p style={{ textAlign: "center", width: "100%", color: "black" }}>{message}</p>
);

const Message = ({ message, isCurrentUser }) => (
    <div className={`p-2 mt-2 rounded-lg ${isCurrentUser ? "bg-red-500 text-white" : "bg-green-700 text-white"}`}>
        <span>{message.text}</span>
        <br />
        <span className="text-xs">{moment(message.createdAt).calendar()}</span>
    </div>
);

function ChatBox() {
    const { user } = useContext(AuthContext);
    const { currentChat, messages, isMessagesLoading, sendTextMessage, setMessages } = useContext(ChatContext);
    const { recipientUser } = useFetchRecipientUser(currentChat, user);
    const [textMessage, setTextMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        const newSocket = io('http://localhost:4000');
        setSocket(newSocket);

        newSocket.on('newMessage', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        newSocket.on('getMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        newSocket.on('messageSent', (message) => {
            console.log('Message sent: ', message);
        });

        newSocket.on('getNotification', (notification) => {
            console.log(notification);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [setMessages]);

    if (!recipientUser) return <LoadingMessage message="Pas encore de conversation..." />

    if (isMessagesLoading) return <LoadingMessage message="chargement du message" />

    const handleSendMessage = async () => {
        if (textMessage && user && currentChat) {
            try {
                await sendTextMessage(textMessage, user, currentChat._id);
                setTextMessage("");
            } catch (error) {
                console.error('Erreur lors de l\'envoi du message:', error);
            }
        }
    };

    return (
        <div className="flex flex-col h-full" style={{ backgroundColor: "#12343" }}>
            <div className="flex-grow overflow-y-auto max-h-[calc(50vh-5rem)] p-4">
                <strong className='text-white'>{recipientUser?.fullName}</strong>
                {Array.isArray(messages) && messages.map((message, index) =>
                    <Message key={index} message={message} isCurrentUser={user && user._id && message.senderId === user._id} />
                )}
            </div>
            <div className='flex items-center'>
                <input
                    value={textMessage}
                    onChange={(e) => setTextMessage(e.target.value)}
                    className="flex-grow mr-2 rounded-lg p-2 border-none shadow-lg"
                    style={{ width: '500px', backgroundColor: '#f5f5f5' }}
                    placeholder="Votre message"
                />
                <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2 rounded-lg shadow-lg">Envoyer</button>
            </div>
        </div>
    );
}

export default ChatBox;
