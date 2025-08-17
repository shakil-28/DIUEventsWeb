import React from "react";
import { FaCalendarAlt, FaUsers, FaCheckCircle, FaPlus } from "react-icons/fa";

const ClubDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-8">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-10 drop-shadow-md">
        Club Dashboard
      </h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <FaCalendarAlt className="text-indigo-500 text-4xl mb-3" />
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
          <p className="text-2xl font-bold text-indigo-700">05</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <FaUsers className="text-green-500 text-4xl mb-3" />
          <h2 className="text-lg font-semibold">Registered Members</h2>
          <p className="text-2xl font-bold text-green-700">124</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <FaCheckCircle className="text-purple-500 text-4xl mb-3" />
          <h2 className="text-lg font-semibold">Approved Events</h2>
          <p className="text-2xl font-bold text-purple-700">08</p>
        </div>
      </div>

      {/* Actions Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button className="flex items-center justify-center gap-3 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
            <FaPlus /> Add New Event
          </button>
          <button className="flex items-center justify-center gap-3 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition">
            <FaUsers /> Manage Members
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClubDashboard;
