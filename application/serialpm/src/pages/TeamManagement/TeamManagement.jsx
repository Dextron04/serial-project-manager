import React, { useState, useEffect } from "react";
import InviteUserModal from "../../components/InviteUserModal";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [userRole, setUserRole] = useState("");
  const API_URL = import.meta.env.VITE_BACKEND_FETCH_URL;

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        const response = await fetch(`${API_URL}/api/users/get-organization`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: user.user_id }),
        });

        if (response.ok) {
          const data = await response.json();
          setTeamMembers(data.members);
          setUserRole(data.role); // assuming backend sends the current user's role
        } else {
          throw new Error("Failed to fetch team members");
        }
      } catch (err) {
        console.error(err);
        toast.error("Could not load team members");
      }
    };

    fetchTeamData();
  }, []);

  const handleRemoveUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/organization/remove-user`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (response.ok) {
        setTeamMembers((prev) =>
          prev.filter((member) => member.user_id !== userId)
        );
        toast.success("User removed successfully");
      } else {
        throw new Error("Remove failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove user");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4 pt-20 text-white">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xl bg-gray-800/70 p-6 shadow-xl backdrop-blur-md"
        >
          <div className="mb-6 flex items-center justify-between">
            <h1 className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent">
              Team Management
            </h1>
            {["admin", "manager"].includes(userRole) && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="rounded-lg bg-blue-600/20 px-4 py-2 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-600/30"
              >
                Invite Member
              </button>
            )}
          </div>

          <div className="space-y-4">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.user_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between rounded-lg p-4 transition hover:bg-gray-700/40"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-purple-400 font-semibold text-white">
                    {member.name[0]}
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-400">{member.role}</p>
                  </div>
                </div>
                {["admin", "manager"].includes(userRole) &&
                  member.role !== "admin" && (
                    <button
                      onClick={() => handleRemoveUser(member.user_id)}
                      className="text-sm text-red-400 hover:text-red-600"
                    >
                      Remove
                    </button>
                  )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {showInviteModal && (
        <InviteUserModal onClose={() => setShowInviteModal(false)} />
      )}
    </div>
  );
};

export default TeamManagement;