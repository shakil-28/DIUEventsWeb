// src/pages/AdminUserManagement.js
import React, { useState, useEffect } from "react";
import { FaSearch, FaTrash, FaEnvelope } from "react-icons/fa";
import { db } from "../firebase/config";
import { auth } from "../firebase/auth";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import AdminNavBar from "../components/AdminNavBar";

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

    return () => unsubscribe();
  }, []);

  // 🔹 Filter users safely by name or email
  const filteredUsers = users.filter(
    (user) =>
      (user.name || user.fullName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
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

  // Dummy props for AdminNavBar
  const toggleSidebar = () => {};
  const sidebarVisible = false;
  const darkMode = true; // Enable dark mode
  const toggleDarkMode = () => {};
  const handleLogout = () => {};

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
      {/* Navbar */}
      <AdminNavBar
        toggleSidebar={toggleSidebar}
        sidebarVisible={sidebarVisible}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        handleLogout={handleLogout}
      />

      {/* Page content */}
      <div className="p-6 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-900 dark:text-gray-100">
          Admin User Management
        </h1>

        {/* Search Bar */}
        <div className="flex items-center bg-white dark:bg-gray-800 shadow-md rounded-full px-4 py-2 w-full max-w-md mb-6">
          <FaSearch className="text-gray-500 dark:text-gray-300 mr-2" />
          <input
            type="text"
            placeholder="Search name or email..."
            className="flex-grow outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
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
                className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-4 flex flex-col transition transform hover:scale-105 duration-200"
              >
                {/* Top Section: Profile + Info */}
                <div className="flex items-center space-x-4 mb-3">
                  <img
                    src={user.photoURL || "https://via.placeholder.com/50"}
                    alt={user.name || user.fullName || "No Name"}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />

                  {/* User Info */}
                  <div className="flex flex-col min-w-[150px]">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
                      {user.name || user.fullName || "No Name"}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-300 text-sm truncate">
                      {user.email || "No Email"}
                    </p>
                    {user.department && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                        Dept: {user.department}
                      </p>
                    )}
                    {user.studentId && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                        Student ID: {user.studentId}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Section: Actions */}
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="flex items-center bg-red-500 dark:bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-600 dark:hover:bg-red-700 text-sm transition"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                  <button
                    onClick={() => handleResetPassword(user.email)}
                    className="flex items-center bg-green-500 dark:bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-600 dark:hover:bg-green-700 text-sm transition"
                  >
                    <FaEnvelope className="mr-1" /> Reset
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 text-lg mt-10">
              ⚠️ No user found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
