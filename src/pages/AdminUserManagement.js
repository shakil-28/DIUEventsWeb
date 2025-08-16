import React, { useState } from "react";
import { FaSearch, FaTrash, FaEnvelope } from "react-icons/fa";

export default function AdminUserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);

  // Example users (replace with API/backend later)
  const users = [
    { id: 1, username: "john_doe", email: "john@example.com" },
    { id: 2, username: "imon", email: "imon@example.com" },
    { id: 3, username: "nayem", email: "nayem@example.com" },
  ];

  const handleSearch = () => {
    const foundUser = users.find(
      (u) => u.username.toLowerCase() === searchTerm.toLowerCase()
    );
    setUser(foundUser || null);
  };

  const handleDelete = () => {
    alert(`User "${user.username}" has been deleted.`);
    setUser(null);
  };

  const handleSendReset = () => {
    alert(`Password reset link sent to ${user.email}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Admin User Management</h1>

      {/* Search Bar */}
      <div className="flex items-center bg-white shadow-md rounded-full px-4 py-2 w-full max-w-md">
        <FaSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search username..."
          className="flex-grow outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="ml-2 bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* Result */}
      {user && (
        <div className="mt-6 bg-white shadow-lg rounded-lg p-4 w-full max-w-md">
          <h2 className="text-lg font-semibold">{user.username}</h2>
          <p className="text-gray-500">{user.email}</p>

          <div className="flex justify-between mt-4">
            <button
              onClick={handleDelete}
              className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              <FaTrash className="mr-2" /> Delete
            </button>
            <button
              onClick={handleSendReset}
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              <FaEnvelope className="mr-2" /> Send Reset Link
            </button>
          </div>
        </div>
      )}

      {/* No User Found */}
      {user === null && searchTerm !== "" && (
        <p className="mt-4 text-red-500">⚠️ No user found.</p>
      )}
    </div>
  );
}
