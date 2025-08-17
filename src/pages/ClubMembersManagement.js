// src/pages/MembersManagement.js
import React, { useState } from "react";
import { FaCheck, FaTimes, FaTrash, FaSearch } from "react-icons/fa";

export default function ClubMembersManagement() {
  const [activeTab] = useState("members");
  const [searchTerm] = useState("");

  const [members] = useState([
    {
      id: 1,
      name: "Alice Smith",
      email: "alice@example.com",
      joinDate: "2025-01-10",
    },
    {
      id: 2,
      name: "Bob Johnson",
      email: "bob@example.com",
      joinDate: "2025-02-15",
    },
  ]);

  const [pendingRequests] = useState([
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      joinDate: "2025-08-01",
    },
  ]);

  const filteredUsers = (
    activeTab === "members" ? members : pendingRequests
  ).filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (id) => alert(`Approved user ID: ${id}`);
  const handleReject = (id) => alert(`Rejected user ID: ${id}`);
  const handleRemove = (id) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      alert(`Removed user ID: ${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
        Members Management
      </h1>

      {/* Tabs */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setActiveTab("members")}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
            activeTab === "members"
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-white shadow hover:bg-indigo-100"
          }`}
        >
          Members List
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
            activeTab === "pending"
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-white shadow hover:bg-indigo-100"
          }`}
        >
          Pending Requests
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center bg-white rounded-full shadow px-4 py-2 w-full max-w-md">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="flex-grow outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition transform hover:scale-105 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-indigo-700 mb-1">
                  {user.name}
                </h2>
                <p className="text-gray-600 mb-1">{user.email}</p>
                <p className="text-gray-400 text-sm">Joined: {user.joinDate}</p>
              </div>
              <div className="flex justify-between mt-4 gap-2">
                {activeTab === "pending" ? (
                  <>
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="flex-1 bg-green-500 text-white px-3 py-2 rounded-xl hover:bg-green-600 transition flex items-center justify-center"
                    >
                      <FaCheck className="mr-1" /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(user.id)}
                      className="flex-1 bg-red-500 text-white px-3 py-2 rounded-xl hover:bg-red-600 transition flex items-center justify-center"
                    >
                      <FaTimes className="mr-1" /> Reject
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleRemove(user.id)}
                    className="flex-1 bg-gray-400 text-white px-3 py-2 rounded-xl hover:bg-gray-500 transition flex items-center justify-center"
                  >
                    <FaTrash className="mr-1" /> Remove
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No users found.
          </p>
        )}
      </div>
    </div>
  );
}
