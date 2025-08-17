// src/pages/EventsManagement.js
import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebase/config";
import ClubNavBar from "../components/ClubNavBar";

export default function EventsManagement() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    endDate: "",
    location: "",
    status: "pending",
    poster: "",
    imageFile: null,
    restricted: false,
    reactCount: 0,
  });

  const formatDateOnly = (tsOrStr) => {
    if (!tsOrStr) return "";
    const d =
      tsOrStr instanceof Timestamp
        ? tsOrStr.toDate()
        : tsOrStr instanceof Date
        ? tsOrStr
        : new Date(tsOrStr);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  const toMidnightDate = (yyyyMmDd) => {
    if (!yyyyMmDd) return null;
    const [y, m, d] = yyyyMmDd.split("-").map((n) => parseInt(n, 10));
    return new Date(y, m - 1, d, 0, 0, 0, 0);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const user = auth?.currentUser || null;
        const eventsRef = collection(db, "events");

        let snap;
        if (user?.uid) {
          const q = query(eventsRef, where("clubId", "==", user.uid));
          snap = await getDocs(q);
        } else {
          snap = await getDocs(eventsRef);
        }

        const list = snap.docs.map((d) => {
          const data = d.data();
          const status =
            typeof data.status === "string"
              ? data.status
              : data.approved
              ? "approved"
              : "pending";

          return {
            id: d.id,
            title: data.title || "",
            description: data.description || "",
            date: data.startingTime ? formatDateOnly(data.startingTime) : "",
            endDate: data.endTime ? formatDateOnly(data.endTime) : "",
            status,
            location: data.location || "",
            poster: data.imageUrl || "",
          };
        });

        setEvents(list);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };
    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingEvent) {
      setEditingEvent({ ...editingEvent, [name]: value });
    } else {
      setNewEvent({ ...newEvent, [name]: value });
    }
  };

  const handlePosterChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (editingEvent) {
        setEditingEvent({
          ...editingEvent,
          poster: reader.result,
          imageFile: file,
        });
      } else {
        setNewEvent({ ...newEvent, poster: reader.result, imageFile: file });
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (photo) => {
    if (!photo) return "";
    let uploadedPhotoURL = "";
    if (photo instanceof File) {
      const formData = new FormData();
      formData.append("file", photo);
      formData.append("upload_preset", "diu_profile");
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/da4tktbus/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      uploadedPhotoURL = data.secure_url || "";
    }
    return uploadedPhotoURL;
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date) {
      alert("Title and Start Date are required!");
      return;
    }

    try {
      const imageUrl = await uploadImage(newEvent.imageFile);
      const user = auth?.currentUser || null;
      const startingDate = toMidnightDate(newEvent.date) || new Date();
      const endingDate =
        toMidnightDate(newEvent.endDate) || new Date(startingDate);

      const payload = {
        title: newEvent.title,
        description: newEvent.description || "",
        startingTime: Timestamp.fromDate(startingDate),
        endTime: Timestamp.fromDate(endingDate),
        location: newEvent.location || "",
        imageUrl: imageUrl || "",
        clubId: user?.uid || "some_club_id",
        approved: false,
        status: "pending",
        restricted: newEvent.restricted || false,
        interestedUsers: [],
        lovedUsers: [],
        reactCount: newEvent.reactCount || 0,
        createdAt: serverTimestamp(),
      };

      const ref = await addDoc(collection(db, "events"), payload);

      setEvents((prev) => [
        ...prev,
        {
          id: ref.id,
          title: payload.title,
          description: payload.description,
          date: formatDateOnly(payload.startingTime),
          endDate: formatDateOnly(payload.endTime),
          status: payload.status,
          location: payload.location,
          poster: payload.imageUrl,
        },
      ]);

      setNewEvent({
        title: "",
        description: "",
        date: "",
        endDate: "",
        location: "",
        status: "pending",
        poster: "",
        imageFile: null,
        restricted: false,
        reactCount: 0,
      });
      setShowModal(false);
    } catch (err) {
      console.error("Error adding event:", err);
      alert("Failed to add event.");
    }
  };

  const handleSaveEdit = async () => {
    if (!editingEvent.title || !editingEvent.date) {
      alert("Title and Start Date are required!");
      return;
    }

    try {
      const imageUrl = await uploadImage(
        editingEvent.imageFile || editingEvent.poster
      );
      const startingDate = toMidnightDate(editingEvent.date) || new Date();
      const endingDate =
        toMidnightDate(editingEvent.endDate) || new Date(startingDate);

      const updates = {
        title: editingEvent.title,
        description: editingEvent.description || "",
        location: editingEvent.location || "",
        startingTime: Timestamp.fromDate(startingDate),
        endTime: Timestamp.fromDate(endingDate),
        imageUrl,
        approved: editingEvent.status === "approved",
        status: editingEvent.status,
        restricted: editingEvent.restricted || false,
        reactCount: editingEvent.reactCount || 0,
      };

      await updateDoc(doc(db, "events", editingEvent.id), updates);

      setEvents((prev) =>
        prev.map((e) =>
          e.id === editingEvent.id
            ? {
                ...e,
                ...updates,
                date: formatDateOnly(updates.startingTime),
                endDate: formatDateOnly(updates.endTime),
              }
            : e
        )
      );

      setEditingEvent(null);
      setShowModal(false);
    } catch (err) {
      console.error("Error saving edit:", err);
      alert("Failed to update event.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteDoc(doc(db, "events", id));
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Failed to delete event.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <ClubNavBar />

      <div className="pt-4 px-4 md:px-8">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-8 text-center">
          Events Management
        </h1>

        {/* Event Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={event.poster || "https://via.placeholder.com/400x250"}
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
                <p className="text-gray-500 text-sm mb-1">📅 {event.date}</p>
                <p className="text-gray-500 text-sm mb-1">
                  📅 End: {event.endDate}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  📍 {event.location}
                </p>

                <div className="flex justify-end gap-2 mt-auto">
                  <button
                    onClick={() => {
                      setEditingEvent({ ...event, imageFile: null });
                      setShowModal(true);
                    }}
                    className="bg-indigo-600 text-white px-3 py-1.5 rounded-xl hover:bg-indigo-700 flex items-center gap-1 transition"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="bg-red-600 text-white px-3 py-1.5 rounded-xl hover:bg-red-700 flex items-center gap-1 transition"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Add Event Button */}
        <button
          onClick={() => {
            setEditingEvent(null);
            setShowModal(true);
          }}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-indigo-600 text-white shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition text-2xl"
        >
          <FaPlus />
        </button>
      </div>

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
              className="w-full p-3 mb-3 border rounded-xl"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={
                editingEvent ? editingEvent.description : newEvent.description
              }
              onChange={handleInputChange}
              className="w-full p-3 mb-3 border rounded-xl resize-none"
            />

            <input
              type="date"
              name="date"
              value={editingEvent ? editingEvent.date : newEvent.date}
              onChange={handleInputChange}
              className="w-full p-3 mb-3 border rounded-xl"
            />

            <input
              type="date"
              name="endDate"
              value={editingEvent ? editingEvent.endDate : newEvent.endDate}
              onChange={handleInputChange}
              className="w-full p-3 mb-3 border rounded-xl"
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={editingEvent ? editingEvent.location : newEvent.location}
              onChange={handleInputChange}
              className="w-full p-3 mb-3 border rounded-xl"
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
                className="px-4 py-2 rounded-xl bg-gray-400 text-white hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={editingEvent ? handleSaveEdit : handleAddEvent}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
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
