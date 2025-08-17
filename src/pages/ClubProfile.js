// src/pages/ClubProfile.js
import React, { useState } from "react";

export default function ClubProfile() {
  const [club, setClub] = useState({
    logo: "https://via.placeholder.com/120",
    name: "CPC",
    email: "awesomeclub@example.com",
    description: "This is a short description about the club.",
    totalMembers: 45,
    totalEvents: 12,
    events: [
      { id: 1, title: "Hackathon 2025", date: "2025-09-01" },
      { id: 2, title: "AI in 2025", date: "2025-09-10" },
      { id: 3, title: "Cybersecurity Trends", date: "2025-09-15" },
    ],
  });

  const [editMode, setEditMode] = useState(false);
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Update club info
  const handleChange = (e) => {
    setClub({ ...club, [e.target.name]: e.target.value });
  };

  // Update logo preview
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setClub({ ...club, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Update password fields
  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // 🔹 Perform backend save for profile info & logo here
    alert("Profile changes saved!");
    setEditMode(false);
  };

  const handlePasswordSave = () => {
    if (password.newPassword !== password.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    // 🔹 Perform backend password change here
    alert("Password updated successfully!");
    setPassword({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 to-blue-50 p-6 flex flex-col items-center">
      {/* Profile Header */}
      <div className="bg-white shadow-lg rounded-3xl p-6 w-full max-w-2xl flex flex-col items-center">
        <div className="relative group">
          <img
            src={club.logo}
            alt="Club Logo"
            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-400"
          />
          {/* Edit button overlay */}
          {editMode && (
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition">
              <span className="text-white bg-indigo-600 px-3 py-1 rounded-xl text-sm hover:bg-indigo-700">
                Edit
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </label>
          )}
        </div>
        <h2 className="text-3xl font-bold mt-4">{club.name}</h2>
        <p className="text-gray-500">{club.email}</p>
      </div>

      {/* Description Section */}
      <div className="bg-white shadow-lg rounded-3xl p-6 w-full max-w-2xl mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Description</h3>
          <button
            onClick={() => setEditMode(!editMode)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>
        {editMode ? (
          <textarea
            name="description"
            value={club.description}
            onChange={handleChange}
            className="w-full h-32 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none"
          />
        ) : (
          <p className="text-gray-600">{club.description}</p>
        )}
        {editMode && (
          <div className="mt-4 flex justify-end gap-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Password Change Section */}
      <div className="bg-white shadow-lg rounded-3xl p-6 w-full max-w-2xl mt-6">
        <h3 className="text-xl font-semibold mb-4">Change Password</h3>
        <div className="flex flex-col gap-4">
          <input
            type="password"
            name="oldPassword"
            value={password.oldPassword}
            onChange={handlePasswordChange}
            placeholder="Old Password"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <input
            type="password"
            name="newPassword"
            value={password.newPassword}
            onChange={handlePasswordChange}
            placeholder="New Password"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <input
            type="password"
            name="confirmPassword"
            value={password.confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Confirm New Password"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <button
            onClick={handlePasswordSave}
            className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* All Events Section */}
      <div className="bg-white shadow-lg rounded-3xl p-6 w-full max-w-2xl mt-6">
        <h3 className="text-xl font-semibold mb-4">All Events</h3>
        <ul className="flex flex-col gap-2">
          {club.events.map((event) => (
            <li
              key={event.id}
              className="p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition flex justify-between"
            >
              <span>{event.title}</span>
              <span className="text-gray-500 text-sm">{event.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
