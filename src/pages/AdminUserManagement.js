// src/pages/AdminUserManagement.js
import React, { useState, useEffect } from "react";
import { FaSearch, FaTrash, FaEnvelope } from "react-icons/fa";
import { db } from "../firebase/config";
import { auth } from "../firebase/auth";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Fetch users in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setUsers(usersData);
    });

    return () => unsubscribe(); // cleanup
  }, []);

  // 🔹 Filter users safely by name or email
  const filteredUsers = users.filter(
    (user) =>
      ((user.name || user.fullName || "") // fallback if name missing
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 🔹 Delete user document from Firestore
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteDoc(doc(db, "users", id));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  // 🔹 Send password reset email via Firebase Auth
  const handleResetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert(`Password reset link sent to ${email}`);
    } catch (error) {
      console.error("Error sending reset link:", error);
      alert("Failed to send reset link");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Admin User Management</h1>

      {/* Search Bar */}
      <div className="flex items-center bg-white shadow-md rounded-full px-4 py-2 w-full max-w-md mb-6">
        <FaSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search name or email..."
          className="flex-grow outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* User List */}
      <div className="w-full max-w-md space-y-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col"
            >
              <h2 className="text-lg font-semibold">
                {user.name || user.fullName || "No Name"}
              </h2>
              <p className="text-gray-500">{user.email || "No Email"}</p>
              {user.department && (
                <p className="text-sm text-gray-400">Dept: {user.department}</p>
              )}
              {user.studentId && (
                <p className="text-sm text-gray-400">Student ID: {user.studentId}</p>
              )}

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  <FaTrash className="mr-2" /> Delete
                </button>
                <button
                  onClick={() => handleResetPassword(user.email)}
                  className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  <FaEnvelope className="mr-2" /> Reset Password
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-red-500 text-center">⚠️ No user found.</p>
        )}
      </div>
    </div>
  );
}
