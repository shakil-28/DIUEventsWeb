import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function Register() {
  const [notifications, setNotifications] = useState(true);
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [currentClub, setCurrentClub] = useState("");

  const departments = ["CSE", "EEE", "BBA", "English", "Pharmacy"];
  const clubs = [
    "CPC",
    "Cultural Club",
    "Prothom Alo Bandhushova",
    "Photography Club",
    "Chess Club",
    "DIU Film Society",
    "Change Together Club",
  ];

  const handleAddClub = () => {
    if (currentClub && !selectedClubs.includes(currentClub)) {
      setSelectedClubs([...selectedClubs, currentClub]);
      setCurrentClub("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-indigo-200 px-4 py-12">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-2xl transition-all duration-300">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-8 tracking-tight">
          🌟 Join DIU Events
        </h2>
        <form className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
              required
            />
          </div>

          {/* Student ID */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Student ID
            </label>
            <input
              type="text"
              placeholder="XXX-XX-XXXX"
              pattern="\d{3}-\d{2}-\d{4}"
              title="Format: xxx-xx-xxxx"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="01XXXXXXXXX"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
              required
            />
          </div>

          {/* Department Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Department
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
              required
            >
              <option value="">-- Select Department --</option>
              {departments.map((dept, i) => (
                <option key={i} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold text-gray-700">
              Enable Notifications
            </span>
            <button
              type="button"
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                notifications ? "bg-indigo-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  notifications ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>

          {/* Club Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Select Club
            </label>
            <div className="flex gap-2 mt-1">
              <select
                value={currentClub}
                onChange={(e) => setCurrentClub(e.target.value)}
                className="flex-grow px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
              >
                <option value="">-- Choose a Club --</option>
                {clubs.map((club, i) => (
                  <option key={i} value={club}>
                    {club}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddClub}
                className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 flex items-center justify-center shadow-md"
              >
                <FaPlus size={14} />
              </button>
            </div>

            {selectedClubs.length > 0 && (
              <ul className="mt-3 list-disc list-inside text-sm text-gray-700">
                {selectedClubs.map((club, index) => (
                  <li key={index}>{club}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition duration-300"
          >
            Register Now
          </button>
        </form>
      </div>
    </div>
  );
}
