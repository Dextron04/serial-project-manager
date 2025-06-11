import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, CheckCircle2, AlertCircle, Info, X, MessageSquare, Calendar, Star, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import { io } from "socket.io-client";

const NotificationSystem = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io(import.meta.env.VITE_BACKEND_FETCH_URL);
        setSocket(newSocket);

        // Get current user ID
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.user_id) {
            // Register user with socket
            newSocket.emit('register', userData.user_id);

            // Listen for notifications
            newSocket.on('receive-notification', (data) => {
                const newNotification = {
                    id: Date.now(),
                    message: data.message,
                    type: data.type,
                    title: data.title,
                    timestamp: new Date().toISOString(),
                    read: false
                };

                setNotifications(prev => [newNotification, ...prev]);
                setUnreadCount(prev => prev + 1);

                // Show toast notification
                toast.info(data.message, {
                    position: window.innerWidth <= 768 ? "top-center" : "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            });
        }

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle2 className="h-5 w-5 text-green-400" />;
            case 'error':
                return <AlertCircle className="h-5 w-5 text-red-400" />;
            case 'info':
                return <Info className="h-5 w-5 text-blue-400" />;
            case 'message':
                return <MessageSquare className="h-5 w-5 text-purple-400" />;
            case 'event':
                return <Calendar className="h-5 w-5 text-yellow-400" />;
            case 'achievement':
                return <Star className="h-5 w-5 text-orange-400" />;
            case 'team':
                return <Users className="h-5 w-5 text-indigo-400" />;
            default:
                return <Info className="h-5 w-5 text-blue-400" />;
        }
    };

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id ? { ...notification, read: true } : notification
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
    };

    const removeNotification = (timestamp) => {
        setNotifications(prev => prev.filter(n => n.timestamp !== timestamp));
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative rounded-lg p-2 text-white transition-colors duration-200 hover:bg-purple-800/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                aria-label="Notifications"
            >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed md:absolute right-0 top-16 md:top-12 w-full md:w-80 max-h-[calc(100vh-4rem)] overflow-y-auto rounded-lg border border-purple-800/30 bg-gradient-to-br from-purple-900/95 to-blue-900/95 p-4 shadow-xl backdrop-blur-md z-[60]"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">Notifications</h3>
                            {notifications.length > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="flex items-center text-sm text-blue-400 hover:text-blue-300"
                                >
                                    <Check className="mr-1 h-4 w-4" />
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <motion.div
                                        key={notification.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex items-start space-x-3 rounded-lg p-3 ${notification.read
                                            ? 'bg-gray-800/50'
                                            : 'bg-blue-900/30'
                                            }`}
                                    >
                                        <div className="mt-1">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white break-words">
                                                {notification.message}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-400">
                                                {new Date(notification.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="ml-2 text-xs text-blue-400 hover:text-blue-300"
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => removeNotification(notification.timestamp)}
                                            className="ml-2 text-xs text-gray-400 hover:text-gray-300"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                    <Bell className="h-8 w-8 mb-2" />
                                    <p>No notifications</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationSystem; 