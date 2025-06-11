import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LanguageSelector from "../../components/LanguageSelector"; 
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_FETCH_URL
          }/api/users/${localStorage.getItem("user_id")}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    const localUser = JSON.parse(localStorage.getItem("user"));
    if (localUser) {
      setUser(localUser);
      setLoading(false);
    } else {
      fetchUser();
    }
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.user_id) {
        throw new Error('User data not found');
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_FETCH_URL}/api/users/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userData.user_id })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to logout');
      }

      // Clear all local storage items
      localStorage.clear();

      // Dispatch auth change event before navigation
      window.dispatchEvent(new Event('authChange'));

      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading || !user) {
    return <div className="py-20 text-center text-white">{t("profileLoading")}</div>;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 px-4 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl bg-gray-800/70 p-6 shadow-xl backdrop-blur-md sm:p-8"
        >
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-2xl font-bold text-white shadow-lg">
                {user.name.charAt(0)}
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                  {user.name}
                </h1>
                <p className="mt-1 text-gray-400">{t("profileUserID")}: {user.user_id}</p>
              </div>
            </div>
            <span className="rounded-full bg-green-500/20 px-4 py-1.5 text-sm font-medium text-green-400">
              {t("profileActive")}
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-xl bg-gray-700/50 p-6 lg:col-span-2"
            >
              <h2 className="mb-4 text-xl font-semibold">{t("profileDetails")}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">{t("profileUserName")}</p>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-full rounded-lg bg-gray-800 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">{t("profileEmail")}</p>
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full cursor-not-allowed rounded-lg bg-gray-700 p-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">{t("profileRole")}</p>
                  <p className="font-medium">{user.role}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">{t("profileTimeZone")}</p>
                  <p className="font-medium">{user.timezone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">{t("profileAccountCreated")}</p>
                  <p className="font-medium">{user.createdAt}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">{t("profilePhone")}</p>
                  <input
                    type="text"
                    value={user.phone}
                    onChange={(e) =>
                      setUser({ ...user, phone: e.target.value })
                    }
                    className="w-full rounded-lg bg-gray-800 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-xl bg-gray-700/50 p-6"
            >
              <h2 className="mb-4 text-xl font-semibold">{t("profileAvatar")}</h2>
              <div className="flex items-center gap-4">
                <div className="group relative">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50`}
                    alt="Avatar"
                    className="h-20 w-20 rounded-full shadow-lg"
                  />
                  <div className="absolute bottom-0 left-1/2 mt-2 -translate-x-1/2 translate-y-full rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 shadow transition group-hover:opacity-100">
                    {t("profileAvatarBased")}
                  </div>
                </div>

                <div>
                  <p>{t("profileAvatarAutoGen")}</p>
                  <p className="mt-1 text-sm text-gray-400">
                    {t("profileAvatarCustomSoon")}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-6 text-right">
            {confirmLogout ? (
              <div className="inline-flex items-center gap-2">
                <span className="text-sm text-gray-300">{t("profileAskSignOut")}</span>
                <button
                  onClick={handleSignOut}
                  className="rounded bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                >
                  {t("profileConfirmSignOut")}
                </button>
                <button
                  onClick={() => setConfirmLogout(false)}
                  className="rounded border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-700"
                >
                  {t("profileCancel")}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmLogout(true)}
                className="rounded bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
              >
                {t("profileSignOut")}
              </button>
            )}
          </div>
        </motion.div>
      </div>
        <div className="fixed top-1/2 right-2">
          <LanguageSelector />
        </div>
    </div>

    
  );
};

export default Profile;
