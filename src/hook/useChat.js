// src/hooks/useChat.js
import { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const useChat = () => {
    const { currentUser, token } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        if (token) {
            const newSocket = io('http://localhost:4000', { query: { token } });
            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('Connected:', newSocket.id);
                newSocket.emit('addNewUser', currentUser.id);
            });

            newSocket.on('getMessage', (message) => {
                setMessages((prev) => [...prev, message]);
            });

            newSocket.on('getNotification', (notification) => {
                console.log('Notification:', notification);
            });

            return () => newSocket.close();
        }
    }, [token, currentUser]);

    useEffect(() => {
        if (currentUser) {
            axios.get(`/api/chats/${currentUser.id}`)
                .then((response) => setChats(response.data.chats))
                .catch((error) => console.error(error));
        }
    }, [currentUser]);

    const selectChat = (chat) => {
        setActiveChat(chat);
        axios.get(`/api/messages/${chat._id}`)
            .then((response) => setMessages(response.data.messages))
            .catch((error) => console.error(error));
    };

    const sendMessage = (text) => {
        if (activeChat && text.trim()) {
            const message = {
                chatId: activeChat._id,
                senderId: currentUser.id,
                text,
            };
            axios.post('/api/messages', message)
                .then((response) => {
                    socket.emit('addMessage', response.data.message);
                    setMessages((prev) => [...prev, response.data.message]);
                })
                .catch((error) => console.error(error));
        }
    };

    return {
        chats,
        messages,
        activeChat,
        selectChat,
        sendMessage
    };
};

export default useChat;
