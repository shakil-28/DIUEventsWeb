// src/pages/StudentProfile.js
import React, { useState } from "react";
import { FaCamera, FaSave, FaTimes } from "react-icons/fa";

export default function StudentProfile() {
  const [editMode, setEditMode] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "Imon Sutradhar",
    email: "imonsutradhar34@gmail.com",
    phone: "01827380200",
    bio: "CSE student at DIU, club enthusiast.",
  });

  const [passwordInfo, setPasswordInfo] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [joinedClubs] = useState([
    { name: "CPC", role: "Member" },
    { name: "Chess Club", role: "Admin" },
    { name: "Prothom Alo Bandhushova", role: "Member" },
  ]);

  const handlePersonalChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordInfo({ ...passwordInfo, [e.target.name]: e.target.value });
  };

  const savePersonalInfo = () => {
    setEditMode(false);
    alert("Personal info saved!");
  };

  const changePassword = () => {
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    alert("Password changed successfully!");
    setPasswordInfo({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <img
            src="https://res.cloudinary.com/da4tktbus/image/upload/v1755376858/v0uodg9mewxnzqj7bohj.jpg"
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover shadow-lg"
          />
          <div className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition">
            <FaCamera className="text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-indigo-700 mt-4">
          {personalInfo.fullName}
        </h1>
        <p className="text-gray-500">{personalInfo.email}</p>
      </div>

      {/* Personal Info Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-indigo-700">
            Personal Information
          </h2>
          <button
            onClick={() => setEditMode(!editMode)}
            className="px-3 py-1.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition"
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-gray-500 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={personalInfo.fullName}
              onChange={handlePersonalChange}
              disabled={!editMode}
              className={`p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                editMode ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-500 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={personalInfo.email}
              onChange={handlePersonalChange}
              disabled={!editMode}
              className={`p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                editMode ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-500 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={personalInfo.phone}
              onChange={handlePersonalChange}
              disabled={!editMode}
              className={`p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                editMode ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>
          <div className="flex flex-col col-span-1 sm:col-span-2">
            <label className="text-gray-500 mb-1">Bio</label>
            <textarea
              name="bio"
              value={personalInfo.bio}
              onChange={handlePersonalChange}
              disabled={!editMode}
              className={`p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none ${
                editMode ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>
        </div>
        {editMode && (
          <div className="flex justify-end mt-4 gap-2">
            <button
              onClick={savePersonalInfo}
              className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition flex items-center gap-1"
            >
              <FaSave /> Save
            </button>
          </div>
        )}
      </div>

      {/* Change Password Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-indigo-700 mb-4">
          Change Password
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-gray-500 mb-1">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              value={passwordInfo.oldPassword}
              onChange={handlePasswordChange}
              className="p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-500 mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordInfo.newPassword}
              onChange={handlePasswordChange}
              className="p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-500 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordInfo.confirmPassword}
              onChange={handlePasswordChange}
              className="p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={changePassword}
            className="px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Joined Clubs */}
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-indigo-700 mb-4">Joined Clubs</h2>
        <div className="flex gap-4 overflow-x-auto py-2">
          {joinedClubs.map((club, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-2xl shadow hover:shadow-md transition"
            >
              <p className="font-semibold">{club.name}</p>
              <p className="text-sm">{club.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
