import React, { useState } from "react";

export default function PendingEvents() {
  const [events, setEvents] = useState([
    { id: 1, name: "AI in 2025", date: "2025-08-20", time: "10:00", status: "pending" },
    { id: 2, name: "Hackathon 2025", date: "2025-09-10", time: "14:00", status: "pending" },
    { id: 3, name: "Cybersecurity Trends", date: "2025-10-05", time: "12:00", status: "approved" },
  ]);

  const [search, setSearch] = useState("");

  // Approve or Reject
  const handleAction = (id, action) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id ? { ...event, status: action } : event
      )
    );
  };

  // Filter only pending events
  const filteredEvents = events.filter(
    (event) =>
      event.status === "pending" &&
      event.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 to-blue-50 p-6">
      <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-10">
        Pending Events
      </h1>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
        />
      </div>

      {/* Pending Events List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="flex flex-col md:flex-row items-center justify-between bg-white shadow-lg p-4 rounded-2xl transition hover:scale-105 duration-200"
            >
              <div>
                <h2 className="text-xl font-semibold">{event.name}</h2>
                <p className="text-gray-600">
                  {event.date} | {event.time}
                </p>
                <p className="mt-1 font-medium text-yellow-600">
                  Status: {event.status}
                </p>
              </div>

              <div className="mt-3 md:mt-0 space-x-2">
                <button
                  onClick={() => handleAction(event.id, "approved")}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => handleAction(event.id, "rejected")}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-lg mt-10">
            No pending events found.
          </p>
        )}
      </div>
    </div>
  );
}
