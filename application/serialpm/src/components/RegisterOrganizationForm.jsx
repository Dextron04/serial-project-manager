import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_BACKEND_FETCH_URL;

const RegisterOrganizationForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        admin_name: '',
        admin_email: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        user_id: '',
    });
    const { t } = useTranslation();

    // Initialize user data from localStorage
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setFormData(prev => ({
                    ...prev,
                    admin_email: parsedUser.email,
                    user_id: parsedUser.user_id
                }));
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []);

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Check if user data is available
        if (!formData.user_id || !formData.admin_email) {
            setError('User data not available. Please log in again.');
            return;
        }

        // Validate ZIP code format
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (!zipRegex.test(formData.zip)) {
            setError('Please enter a valid ZIP code');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                return;
            }

            const response = await fetch(`${API_URL}/api/orgs/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to register organization');
            }

            // Store the new token and organization ID
            localStorage.setItem('token', data.token);
            localStorage.setItem('organization_id', data.organization_id);

            // Update user object in localStorage with new organization_id
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                const updatedUser = {
                    ...parsedUser,
                    organization_id: data.organization_id
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            // Navigate to dashboard
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900/90 to-blue-900/90 py-20 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mx-auto max-w-2xl"
            >
                <div className="mb-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent"
                    >
                        {t("regOrgRegisterTitle")}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-4 text-lg text-white/80"
                    >
                        {t("regOrgRegisterDescription")}
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="rounded-lg bg-white/10 p-8 shadow-xl backdrop-blur-md"
                >
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 rounded-lg bg-red-500/20 p-4 text-red-200"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid gap-6 md:grid-cols-2">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <label htmlFor="name" className="block text-sm font-medium text-white/90">
                                    {t("regOrgOrganizationName")}
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="mt-2 block w-full rounded-lg border border-purple-300/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 transition-all duration-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    placeholder={t("regOrgEnterOrganizationName")}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                            >
                                <label htmlFor="admin_name" className="block text-sm font-medium text-white/90">
                                    {t("regOrgAdminName")}
                                </label>
                                <input
                                    type="text"
                                    id="admin_name"
                                    name="admin_name"
                                    value={formData.admin_name}
                                    onChange={handleChange}
                                    required
                                    className="mt-2 block w-full rounded-lg border border-purple-300/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 transition-all duration-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    placeholder={t("regOrgEnterAdminName")}
                                />
                            </motion.div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                            >
                                <label htmlFor="city" className="block text-sm font-medium text-white/90">
                                    {t("regOrgCity")}City
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    className="mt-2 block w-full rounded-lg border border-purple-300/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 transition-all duration-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    placeholder={t("regOrgEnterCity")}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.7 }}
                            >
                                <label htmlFor="state" className="block text-sm font-medium text-white/90">
                                    {t("regOrgState")}
                                </label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                    className="mt-2 block w-full rounded-lg border border-purple-300/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 transition-all duration-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    placeholder={t("regOrgEnterState")}
                                />
                            </motion.div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                            >
                                <label htmlFor="zip" className="block text-sm font-medium text-white/90">
                                    {t("regOrgZIPCode")}
                                </label>
                                <input
                                    type="text"
                                    id="zip"
                                    name="zip"
                                    value={formData.zip}
                                    onChange={handleChange}
                                    required
                                    pattern="^\d{5}(-\d{4})?$"
                                    className="mt-2 block w-full rounded-lg border border-purple-300/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 transition-all duration-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    placeholder={t("regOrgEnterZIPCode")}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.9 }}
                            >
                                <label htmlFor="country" className="block text-sm font-medium text-white/90">
                                    {t("regOrgCountry")}
                                </label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                    className="mt-2 block w-full rounded-lg border border-purple-300/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 transition-all duration-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    placeholder={t("regOrgEnterCountry")}
                                />
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1 }}
                        >
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-lg font-semibold text-white transition-all duration-200 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                                {t("regOrgRegisterOrganization")}
                            </button>
                        </motion.div>
                    </form>
                </motion.div>
            </motion.div>
            <div className="fixed top-1/2 right-2">
                <LanguageSelector />
            </div>
        </div>
    );
};

export default RegisterOrganizationForm; 