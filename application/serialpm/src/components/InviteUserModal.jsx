import React, { useState } from "react";
import { toast } from "react-toastify";

const InviteUserModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const API_URL = import.meta.env.VITE_BACKEND_FETCH_URL;

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const org = JSON.parse(localStorage.getItem("organization")); // assuming stored
      const response = await fetch(`${API_URL}/api/organization/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          role,
          organization_id: org.organization_id,
        }),
      });

      if (response.ok) {
        toast.success("Invitation sent!");
        onClose();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to invite user");
      }
    } catch (err) {
      toast.error("Error inviting user");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-gray-800/90 p-6 shadow-lg backdrop-blur-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-xl font-semibold text-transparent">
            Invite Member
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-300">Email</label>
            <input
              type="email"
              required
              className="w-full rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-300">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="member">Member</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Send Invite
          </button>
        </form>
      </div>
    </div>
  );
};

export default InviteUserModal;