// src/pages/StudentDashboard.js
import React from "react";
import { FaBell } from "react-icons/fa";

export default function StudentDashboard() {
  const profile = {
    name: "Imon Sutradhar",
    photo:
      "https://res.cloudinary.com/da4tktbus/image/upload/v1755376858/v0uodg9mewxnzqj7bohj.jpg",
  };

  const summaryCards = [
    { title: "Clubs Joined", value: 3 },
    { title: "Upcoming Events", value: 5 },
    { title: "Events Attended", value: 2 },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "AI in 2025",
      date: "2025-08-25",
      description: "Explore AI trends and breakthroughs.",
    },
    {
      id: 2,
      title: "Hackathon 2025",
      date: "2025-09-10",
      description: "Participate in a 48-hour coding marathon.",
    },
    {
      id: 3,
      title: "Cybersecurity Trends",
      date: "2025-09-20",
      description: "Learn about modern cybersecurity practices.",
    },
  ];

  const notifications = [
    "Your registration for AI in 2025 is confirmed.",
    "New event Hackathon 2025 added.",
    "Your profile has been updated successfully.",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">
          Welcome, {profile.name}
        </h1>
        <div className="flex items-center gap-4">
          <FaBell className="text-2xl text-indigo-600 cursor-pointer" />
          <img
            src={profile.photo}
            alt="Profile"
            className="w-12 h-12 rounded-full border-2 border-indigo-600"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="flex gap-6 overflow-x-auto mb-8">
        {summaryCards.map((card, idx) => (
          <div
            key={idx}
            className="min-w-[150px] bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <h2 className="text-xl font-bold text-indigo-700">{card.value}</h2>
            <p className="text-gray-500 mt-1">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Events */}
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">
        Upcoming Events
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition transform hover:scale-105 flex flex-col justify-between"
          >
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">
              {event.title}
            </h3>
            <p className="text-gray-500 text-sm mb-2">📅 {event.date}</p>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {event.description}
            </p>
            <button className="mt-auto bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition">
              Register / View
            </button>
          </div>
        ))}
      </div>

      {/* Notifications */}
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Notifications</h2>
      <div className="flex flex-col gap-3">
        {notifications.map((note, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-2xl shadow hover:shadow-md transition"
          >
            {note}
          </div>
        ))}
      </div>
    </div>
  );
}
