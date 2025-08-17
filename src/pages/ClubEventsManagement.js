// src/pages/EventsManagement.js
import React, { useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";

export default function EventsManagement() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "AI in 2025",
      description: "Explore AI trends and breakthroughs.",
      date: "2025-08-25",
      status: "approved",
      poster: "https://via.placeholder.com/300x180",
    },
    {
      id: 2,
      title: "Hackathon 2025",
      description: "Participate in a 48-hour coding marathon.",
      date: "2025-09-10",
      status: "pending",
      poster: "https://via.placeholder.com/300x180",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    status: "pending",
    poster: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const target = editingEvent ? editingEvent : newEvent;
    const setter = editingEvent ? setEditingEvent : setNewEvent;
    setter({ ...target, [e.target.name]: e.target.value });
  };

  // Handle poster file change
  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (editingEvent) {
        setEditingEvent({ ...editingEvent, poster: reader.result });
      } else {
        setNewEvent({ ...newEvent, poster: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  // Save new event
  const handleAddEvent = () => {
    setEvents([...events, { ...newEvent, id: Date.now() }]);
    setNewEvent({
      title: "",
      description: "",
      date: "",
      status: "pending",
      poster: "",
    });
    setShowModal(false);
  };

  // Save edited event
  const handleSaveEdit = () => {
    setEvents(events.map((e) => (e.id === editingEvent.id ? editingEvent : e)));
    setEditingEvent(null);
    setShowModal(false);
  };

  // Delete event
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((e) => e.id !== id));
    }
  };

  // Approve or reject pending events
  const handlePendingAction = (id, action) => {
    if (window.confirm(`Are you sure you want to ${action} this event?`)) {
      setEvents(
        events.map((e) =>
          e.id === id
            ? { ...e, status: action === "approve" ? "approved" : "rejected" }
            : e
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
        Events Management
      </h1>

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition transform hover:scale-105 overflow-hidden flex flex-col"
          >
            <img
              src={event.poster}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex-1 flex flex-col">
              <h2 className="text-xl font-bold text-indigo-700 mb-2">
                {event.title}
              </h2>
              <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                {event.description}
              </p>
              <p className="text-gray-500 text-sm mb-2">📅 {event.date}</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  event.status === "approved"
                    ? "bg-green-200 text-green-800"
                    : event.status === "pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {event.status.toUpperCase()}
              </span>

              {/* Pending actions */}
              {event.status === "pending" && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handlePendingAction(event.id, "approve")}
                    className="flex-1 bg-green-500 text-white px-2 py-1 rounded-xl hover:bg-green-600 transition flex items-center justify-center"
                  >
                    <FaCheck className="mr-1" /> Approve
                  </button>
                  <button
                    onClick={() => handlePendingAction(event.id, "reject")}
                    className="flex-1 bg-red-500 text-white px-2 py-1 rounded-xl hover:bg-red-600 transition flex items-center justify-center"
                  >
                    <FaTimes className="mr-1" /> Reject
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-auto">
                <button
                  onClick={() => {
                    setEditingEvent(event);
                    setShowModal(true);
                  }}
                  className="bg-indigo-500 text-white px-3 py-1.5 rounded-xl hover:bg-indigo-600 transition flex items-center"
                >
                  <FaEdit className="mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="bg-red-500 text-white px-3 py-1.5 rounded-xl hover:bg-red-600 transition flex items-center"
                >
                  <FaTrash className="mr-1" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Create Event Button */}
      <button
        onClick={() => {
          setEditingEvent(null);
          setShowModal(true);
        }}
        className="fixed bottom-8 right-8 bg-indigo-600 text-white w-16 h-16 rounded-full shadow-xl hover:bg-indigo-700 transition flex items-center justify-center text-2xl"
      >
        <FaPlus />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg relative">
            <h2 className="text-2xl font-bold mb-4">
              {editingEvent ? "Edit Event" : "Create Event"}
            </h2>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={editingEvent ? editingEvent.title : newEvent.title}
              onChange={handleInputChange}
              className="w-full p-3 mb-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={
                editingEvent ? editingEvent.description : newEvent.description
              }
              onChange={handleInputChange}
              className="w-full p-3 mb-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
            <input
              type="date"
              name="date"
              value={editingEvent ? editingEvent.date : newEvent.date}
              onChange={handleInputChange}
              className="w-full p-3 mb-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <select
              name="status"
              value={editingEvent ? editingEvent.status : newEvent.status}
              onChange={handleInputChange}
              className="w-full p-3 mb-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={handlePosterChange}
              className="mb-4"
            />
            {(editingEvent ? editingEvent.poster : newEvent.poster) && (
              <img
                src={editingEvent ? editingEvent.poster : newEvent.poster}
                alt="Preview"
                className="w-full h-48 object-cover mb-4 rounded-2xl"
              />
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-400 text-white hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={editingEvent ? handleSaveEdit : handleAddEvent}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                {editingEvent ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
