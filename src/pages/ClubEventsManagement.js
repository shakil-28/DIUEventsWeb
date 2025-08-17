// src/pages/EventsManagement.js
import React, { useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";

export default function ClubEventsManagement() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "AI in 2025",
      description: "Explore AI trends and breakthroughs.",
      date: "2025-08-25",
      status: "approved",
      poster: "https://via.placeholder.com/400x250",
    },
    {
      id: 2,
      title: "Hackathon 2025",
      description: "Participate in a 48-hour coding marathon.",
      date: "2025-09-10",
      status: "pending",
      poster: "https://via.placeholder.com/400x250",
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

  const handleInputChange = (e) => {
    const target = editingEvent ? editingEvent : newEvent;
    const setter = editingEvent ? setEditingEvent : setNewEvent;
    setter({ ...target, [e.target.name]: e.target.value });
  };

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

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      alert("Title and Date are required!");
      return;
    }
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

  const handleSaveEdit = () => {
    if (!editingEvent.title || !editingEvent.date) {
      alert("Title and Date are required!");
      return;
    }
    setEvents(events.map((e) => (e.id === editingEvent.id ? editingEvent : e)));
    setEditingEvent(null);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((e) => e.id !== id));
    }
  };

  // Instant approve/reject without showing status text/icon
  const handlePendingAction = (id, action) => {
    setEvents(
      events.map((e) =>
        e.id === id
          ? { ...e, status: action === "approve" ? "approved" : "rejected" }
          : e
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-8 text-center">
        Events Management
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300 flex flex-col"
          >
            {/* Poster Image */}
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={event.poster}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <h2 className="text-xl font-bold text-indigo-700 mb-1">
                {event.title}
              </h2>
              <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                {event.description}
              </p>
              <p className="text-gray-500 text-sm mb-4">📅 {event.date}</p>

              {event.status === "pending" && (
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => handlePendingAction(event.id, "approve")}
                    className="flex-1 bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1.5 rounded-xl flex items-center justify-center gap-1 hover:from-green-500 hover:to-green-700 transition"
                  >
                    <FaCheck /> Approve
                  </button>
                  <button
                    onClick={() => handlePendingAction(event.id, "reject")}
                    className="flex-1 bg-gradient-to-r from-red-400 to-red-600 text-white px-3 py-1.5 rounded-xl flex items-center justify-center gap-1 hover:from-red-500 hover:to-red-700 transition"
                  >
                    <FaTimes /> Reject
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-auto">
                <button
                  onClick={() => {
                    setEditingEvent(event);
                    setShowModal(true);
                  }}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-3 py-1.5 rounded-xl hover:from-indigo-600 hover:to-indigo-800 flex items-center gap-1 transition"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="bg-gradient-to-r from-red-500 to-red-700 text-white px-3 py-1.5 rounded-xl hover:from-red-600 hover:to-red-800 flex items-center gap-1 transition"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Event */}
      <button
        onClick={() => {
          setEditingEvent(null);
          setShowModal(true);
        }}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-2xl flex items-center justify-center hover:from-indigo-600 hover:to-indigo-800 transition text-2xl"
      >
        <FaPlus />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg relative shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">
              {editingEvent ? "Edit Event" : "Create Event"}
            </h2>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={editingEvent ? editingEvent.title : newEvent.title}
              onChange={handleInputChange}
              className="w-full p-3 mb-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={
                editingEvent ? editingEvent.description : newEvent.description
              }
              onChange={handleInputChange}
              className="w-full p-3 mb-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none shadow-sm"
            />
            <input
              type="date"
              name="date"
              value={editingEvent ? editingEvent.date : newEvent.date}
              onChange={handleInputChange}
              className="w-full p-3 mb-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
            />
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
                className="w-full h-48 object-cover mb-4 rounded-2xl shadow-inner"
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
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 text-white hover:from-indigo-600 hover:to-indigo-800 transition"
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
