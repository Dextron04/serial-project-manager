import React, { useState, useEffect } from "react";
import RegisterOrganizationForm from "../../components/RegisterOrganizationForm";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import LanguageSelector from "../../components/LanguageSelector"; 
import { useTranslation } from 'react-i18next';

const Organization = () => {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [inviteKey, setInviteKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [orgData, setOrgData] = useState(null);
  const [noOrgFound, setNoOrgFound] = useState(false);
  const { t } = useTranslation();

  const API_URL = import.meta.env.VITE_BACKEND_FETCH_URL;

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!userData || !token) {
          throw new Error("User data or token not found");
        }

        const parsedUser = JSON.parse(userData);
        if (!parsedUser.user_id) {
          throw new Error("User ID not found");
        }

        const response = await fetch(`${API_URL}/api/users/get-organization`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify({ user_id: parsedUser.user_id }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data && Object.keys(data).length > 0) {
            setOrgData(data);
            console.log(data);
            setNoOrgFound(false);
          } else {
            setOrgData(null);
            setNoOrgFound(true);
          }
        } else if (response.status === 404) {
          setOrgData(null);
          setNoOrgFound(true);
        } else {
          throw new Error("Failed to fetch organization data");
        }
      } catch (error) {
        console.error("Error fetching organization:", error);
        toast.error(error.message || "Failed to fetch organization data");
        setOrgData(null);
        setNoOrgFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [localStorage.getItem("token")]);

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!inviteKey.trim()) {
      setError("Please enter an invite key");
      return;
    }

    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userData || !token) {
      throw new Error("User data or token not found");
    }

    const parsedUser = JSON.parse(userData);
    if (!parsedUser.user_id) {
      throw new Error("User ID not found");
    }

    try {
      const response = await fetch(`${API_URL}/api/organizations/join`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ invite_key: inviteKey, user_id: parsedUser.user_id }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrgData(data.organization);
        setNoOrgFound(false);
        setShowJoinDialog(false);
        toast.success("Successfully joined the organization!");
        console.log("This is the data", data);

        // Update localStorage with new token and organization data
        localStorage.setItem("token", data.token);
        localStorage.setItem("organization_id", data.organization.organization_id);

        // Update user object in localStorage with new organization_id
        const updatedUser = {
          ...parsedUser,
          organization_id: data.organization.organization_id
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        console.log(localStorage);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to join organization");
      }
    } catch (error) {
      console.error("Error joining organization:", error);
      setError("An error occurred while joining the organization");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (showRegisterForm) {
    return <RegisterOrganizationForm />;
  }

  if (orgData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4 sm:p-18 text-white pt-20">
        {/* Added pt-20 (padding-top) to account for navbar height */}
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl bg-gray-800/70 p-6 sm:p-8 shadow-xl backdrop-blur-md"
          >
            {/* b5cb89fd-cecf-412a-a94c-946d3da1cc2b */}
            {/* Header Section */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold">{orgData.name[0].toUpperCase()}</span>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {orgData.name}
                  </h1>
                  <p className="text-gray-400 mt-1">{t("orgDataHeaderID")}: {orgData.organization_id}</p>
                  <p className="text-gray-400 mt-1">{t("orgDataHeaderInviteKey")}: {orgData.invite_key}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-green-500/20 px-4 py-1.5 text-sm font-medium text-green-400">
                  {t("orgDataHeaderActive")}
                </span>
                <button className="rounded-lg bg-blue-600/20 px-4 py-1.5 text-sm font-medium text-blue-400 hover:bg-blue-600/30 transition-colors">
                  {t("orgDataHeaderSettings")}
                </button>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Organization Details */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2 rounded-xl bg-gray-700/50 p-6"
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {t("orgDataGridOrganizationDetails")}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">{t("orgDataGridLocation")}</p>
                    <p className="font-medium">{orgData.city}, {orgData.state}, {orgData.country}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">{t("orgDataGridZIPCode")}</p>
                    <p className="font-medium">{orgData.zip}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">{t("orgDataGridAdmin")}</p>
                    <p className="font-medium">{orgData.admin_name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">{t("orgDataGridAdminEmail")}</p>
                    <p className="font-medium">{orgData.admin_email}</p>
                  </div>
                </div>
              </motion.div>

              {/* Team Members */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-xl bg-gray-700/50 p-6"
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {t("orgDataTeamMembers")}
                </h2>
                <div className="space-y-4">
                  {orgData.members?.map((member, index) => (
                    <motion.div
                      key={member.user_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-600/50 transition-colors"
                    >
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-medium">
                        {member.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{member.name}</p>
                        <p className="text-sm text-gray-400 truncate">{member.role}</p>
                      </div>
                      {member.role === 'admin' && (
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                          {t("orgDataGridAdmin")}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6 rounded-xl bg-gray-700/50 p-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {t("orgDataRecentActivity")}
              </h2>
              <div className="space-y-4">
                {orgData.recent_activity?.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-600/50 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-300">{activity.description}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
        <div className="fixed top-1/2 right-2">
          <LanguageSelector />
        </div>
      </div>
    );
  }

  if (noOrgFound) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white p-4">
        {/* Join Organization Dialog */}
        {showJoinDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-gray-800/90 p-4 sm:p-6 shadow-xl backdrop-blur-md">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {t("orgNotFoundJoin")}
                </h3>
                <button
                  onClick={() => setShowJoinDialog(false)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-700/50 hover:text-white"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleJoinSubmit} className="space-y-4">
                <div>
                  <label htmlFor="inviteKey" className="mb-1 block text-sm font-medium text-gray-300">
                    {t("orgNotFoundInviteKey")}
                  </label>
                  <input
                    type="text"
                    id="inviteKey"
                    value={inviteKey}
                    onChange={(e) => setInviteKey(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder={t("orgNotFoundEnterInviteKey")}
                  />
                </div>
                {error && (
                  <div className="rounded-lg bg-red-500/20 p-3 text-sm text-red-300">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {t("orgNotFoundJoin")}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="w-full max-w-md rounded-xl bg-gray-800/70 backdrop-blur-md shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 text-center">
            <div className="mb-6 flex justify-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{t("orgNotFoundNoFound")}</h2>
            <p className="mb-6 text-gray-300">{t("orgNotFoundDescription")}</p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => setShowRegisterForm(true)}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {t("orgNotFoundCreateOrg")}
              </button>
              <button
                onClick={() => setShowJoinDialog(true)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 font-medium text-gray-300 hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {t("orgNotFoundJoin")}
              </button>
            </div>
          </div>
        </div>
        <div className="fixed top-1/2 right-2">
          <LanguageSelector />
        </div>
      </div>
    );
  }
  return null;
};

export default Organization;
