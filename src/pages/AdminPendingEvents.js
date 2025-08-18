import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import AdminNavBar from "../components/AdminNavBar";

export default function AdminPendingEvents() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch pending events from Firestore
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const eventsRef = collection(db, "events");
      const q = query(eventsRef, where("status", "==", "pending"));
      const snapshot = await getDocs(q);
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Approve or Reject an event
  const handleAction = async (id, approve) => {
    try {
      const eventRef = doc(db, "events", id);

      if (approve) {
        await updateDoc(eventRef, { status: "approved" });
      } else {
        await deleteDoc(eventRef); // or set status to "rejected" if you don't want to delete
      }

      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Error updating/deleting event:", error);
    }
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  // Dummy props for AdminNavBar
  const toggleSidebar = () => {};
  const sidebarVisible = false;
  const darkMode = true; // Enable dark mode for demo
  const toggleDarkMode = () => {};
  const handleLogout = () => {};

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600 dark:text-gray-300">
        Loading events...
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      {/* Navbar */}
      <AdminNavBar
        toggleSidebar={toggleSidebar}
        sidebarVisible={sidebarVisible}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        handleLogout={handleLogout}
      />

      {/* Page content */}
      <div className="p-6">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 dark:text-indigo-300 mb-10">
          Pending Events
        </h1>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition"
          />
        </div>

        {/* Pending Events List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-gray-800 shadow-lg p-4 rounded-2xl transition hover:scale-105 duration-200"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {event.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {new Date(
                      event.startingTime.seconds * 1000
                    ).toLocaleString()}{" "}
                    |{" "}
                    {new Date(
                      event.endTime.seconds * 1000
                    ).toLocaleTimeString()}
                  </p>
                  <p className="mt-1 font-medium text-yellow-600 dark:text-yellow-400">
                    Status: {event.approved ? "approved" : "pending"}
                  </p>
                </div>

                <div className="mt-3 md:mt-0 space-x-2">
                  <button
                    onClick={() => handleAction(event.id, true)}
                    className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => handleAction(event.id, false)}
                    className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition"
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 text-lg mt-10">
              No pending events found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
