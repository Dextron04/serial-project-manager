import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Send, ArrowLeft } from 'lucide-react';
import { io } from "socket.io-client";

const ChatInterface = ({ user, onClose, onBack }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const [socket, setSocket] = useState(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchMessages = async () => {
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('user'));

        const response = await fetch(`${import.meta.env.VITE_BACKEND_FETCH_URL}/api/socket/get-messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                toUser: user.user_id,
                fromUser: userData.user_id
            })
        });

        const data = await response.json();
        console.log('Fetched messages:', data);
        setMessages(data);
    };

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io(import.meta.env.VITE_BACKEND_FETCH_URL);
        setSocket(newSocket);

        // Get current user ID
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.user_id) {
            // Register user with socket
            newSocket.emit('register', userData.user_id);

            // Listen for new messages
            newSocket.on('receive-message', (data) => {
                console.log('Received message:', data);
                if (data.fromUser === user.user_id) {
                    setMessages(prev => [...prev, {
                        id: Date.now(),
                        message: data.message,
                        sender_id: data.fromUser,
                        receiver_id: currentUser.user_id,
                        timestamp: new Date().toISOString()
                    }]);
                    scrollToBottom();
                }
            });
        }

        scrollToBottom();
        fetchMessages();

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, [user.user_id, currentUser.user_id]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('user'));

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_FETCH_URL}/api/socket/send-message`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    toUser: user.user_id,
                    fromUser: userData.user_id,
                    message: newMessage
                })
            });

            if (response.ok) {
                const message = {
                    id: Date.now(),
                    message: newMessage,
                    sender_id: userData.user_id,
                    receiver_id: user.user_id,
                    timestamp: new Date().toISOString()
                };
                setMessages(prev => [...prev, message]);
                setNewMessage('');
                scrollToBottom();
            } else {
                const errorData = await response.json();
                console.error('Failed to send message:', errorData);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex h-full flex-col bg-[#1a1f2e]"
        >
            <div className="flex-none border-b border-gray-700/50 p-3">
                <div className="flex items-center">
                    <button
                        onClick={onBack}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-700/50 hover:text-white"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="flex items-center space-x-3 ml-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium text-white">{user.name}</p>
                            <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-700/50 hover:text-white ml-auto"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="flex flex-col space-y-4 p-4">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center py-20">
                            <p className="text-gray-400">No messages yet. Start a conversation!</p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender_id === currentUser.user_id ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-2 ${message.sender_id === currentUser.user_id
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-700/50 text-white'
                                        }`}
                                >
                                    <p className="text-sm">{message.message || message.content}</p>
                                    <p className="mt-1 text-xs text-gray-300/80">
                                        {new Date(message.timestamp).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="flex-none border-t border-gray-700/50 p-3">
                <form onSubmit={handleSendMessage}>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 rounded-lg bg-gray-700/50 px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                            type="submit"
                            className="rounded-lg bg-purple-600 p-2 text-white transition-colors hover:bg-purple-700"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default ChatInterface; 