// src/pages/Explore.js
import React, { useState } from "react";
import {
  FaSearch,
  FaUsers,
  FaCalendarAlt,
  FaPlus,
  FaMinus,
} from "react-icons/fa";

export default function StudentExplore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [clubs] = useState([
    {
      id: 1,
      name: "CPC",
      description: "Coding enthusiasts club",
      members: 120,
    },
    {
      id: 2,
      name: "Chess Club",
      description: "Sharpen your mind",
      members: 45,
    },
    {
      id: 3,
      name: "Prothom Alo Bandhushova",
      description: "Cultural activities",
      members: 60,
    },
  ]);
  const [events] = useState([
    {
      id: 1,
      title: "Hackathon 2025",
      date: "2025-09-10",
      time: "10:00 AM",
      venue: "DIU Lab 1",
      club: "CPC",
      type: "Competition",
    },
    {
      id: 2,
      title: "Chess Championship",
      date: "2025-09-15",
      time: "2:00 PM",
      venue: "DIU Hall",
      club: "Chess Club",
      type: "Competition",
    },
    {
      id: 3,
      title: "Music Fest",
      date: "2025-09-20",
      time: "6:00 PM",
      venue: "DIU Auditorium",
      club: "Prothom Alo Bandhushova",
      type: "Cultural",
    },
  ]);

  const [joinedClubs, setJoinedClubs] = useState([1]); // initially joined club IDs

  const handleJoinLeave = (id) => {
    if (joinedClubs.includes(id)) {
      if (window.confirm("Do you want to leave this club?")) {
        setJoinedClubs(joinedClubs.filter((clubId) => clubId !== id));
      }
    } else {
      if (window.confirm("Do you want to join this club?")) {
        setJoinedClubs([...joinedClubs, id]);
      }
    }
  };

  const filteredClubs = clubs.filter(
    (club) =>
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.club.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
      <h1 className="text-3xl font-bold text-indigo-700 text-center mb-6">
        Explore Clubs & Events
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center bg-white rounded-full shadow px-4 py-2 w-full max-w-xl">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search clubs or events..."
            className="flex-grow outline-none p-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Clubs Section */}
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Clubs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {filteredClubs.length > 0 ? (
          filteredClubs.map((club) => (
            <div
              key={club.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                {club.name}
              </h3>
              <p className="text-gray-600 mb-2">{club.description}</p>
              <p className="text-gray-400 text-sm flex items-center mb-4">
                <FaUsers className="mr-1" /> {club.members} Members
              </p>
              <button
                onClick={() => handleJoinLeave(club.id)}
                className={`w-full px-3 py-2 rounded-xl transition flex items-center justify-center font-semibold ${
                  joinedClubs.includes(club.id)
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {joinedClubs.includes(club.id) ? (
                  <>
                    <FaMinus className="mr-1" /> Leave
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-1" /> Join
                  </>
                )}
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No clubs found.
          </p>
        )}
      </div>

      {/* Events Section */}
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">
        Upcoming Events
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                {event.title}
              </h3>
              <p className="text-gray-600 mb-1">{event.club}</p>
              <p className="text-gray-400 text-sm mb-2">
                <FaCalendarAlt className="inline mr-1" /> {event.date} -{" "}
                {event.time}
              </p>
              <p className="text-gray-500 mb-4">{event.venue}</p>
              <span className="inline-block px-2 py-1 text-sm rounded-full bg-indigo-100 text-indigo-700 mb-2">
                {event.type}
              </span>
              <button className="w-full px-3 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition font-semibold">
                Register / View
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No events found.
          </p>
        )}
      </div>
    </div>
  );
}
