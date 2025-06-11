import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Search } from 'lucide-react';
import ChatInterface from './ChatInterface';

const MessagesModal = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_FETCH_URL}/api/organization/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-md rounded-xl bg-[#1a1f2e] shadow-2xl mx-2 sm:mx-4 h-[80vh] flex flex-col overflow-hidden"
                    >
                        {selectedUser ? (
                            <div className="h-full">
                                <ChatInterface
                                    user={selectedUser}
                                    onClose={onClose}
                                    onBack={() => setSelectedUser(null)}
                                />
                            </div>
                        ) : (
                            <>
                                <div className="flex-none p-4 border-b border-gray-700/50">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold text-white">Messages</h2>
                                        <button
                                            onClick={onClose}
                                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-700/50 hover:text-white"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="mt-3">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search users..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full rounded-lg bg-gray-700/50 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 min-h-0 overflow-y-auto">
                                    <div className="p-4">
                                        {loading ? (
                                            <div className="flex items-center justify-center py-6">
                                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
                                            </div>
                                        ) : filteredUsers.length === 0 ? (
                                            <div className="py-6 text-center text-gray-400">
                                                No users found
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {filteredUsers.map((user) => (
                                                    <button
                                                        key={user.user_id}
                                                        onClick={() => setSelectedUser(user)}
                                                        className="flex w-full items-center space-x-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-700/50"
                                                    >
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-white">{user.name}</p>
                                                            <p className="text-sm text-gray-400">{user.email}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default MessagesModal; 