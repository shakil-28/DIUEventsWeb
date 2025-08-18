// src/pages/StudentExplore.js
import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaUsers,
  FaCalendarAlt,
  FaPlus,
  FaMinus,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { NavBar } from "../components/NavBar";
import { auth, db } from "../firebase/config";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

export default function StudentExplore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const currentUid = auth.currentUser?.uid;

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUid) return;
      try {
        const studentSnap = await getDoc(doc(db, "users", currentUid));
        const studentData = studentSnap.data() || {};
        setJoinedClubs(studentData.selectedClubs || []);
        setRegisteredEvents(studentData.registeredEvents || []);

        const clubsQuery = query(
          collection(db, "users"),
          where("role", "==", "club")
        );
        const clubsSnap = await getDocs(clubsQuery);
        const clubsData = clubsSnap.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: data.name || "No Name",
            description: data.description || "",
            members: data.members?.length || 0,
            logoUrl: data.logoUrl || "",
          };
        });
        setClubs(clubsData);

        const eventsSnap = await getDocs(collection(db, "events"));
        const eventsData = eventsSnap.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title || "No Title",
            description: data.description || "",
            club:
              clubsData.find((c) => c.id === data.clubId)?.name ||
              "Unknown Club",
            date: data.startingTime
              ? data.startingTime.toDate().toLocaleDateString()
              : "",
            time: data.startingTime
              ? data.startingTime.toDate().toLocaleTimeString()
              : "",
            venue: data.location || "",
            type: data.type || "",
            imageUrl: data.imageUrl || "",
          };
        });
        setEvents(eventsData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [currentUid]);

  const handleJoinLeave = async (clubId) => {
    if (!currentUid) return;
    const studentRef = doc(db, "users", currentUid);
    const clubRef = doc(db, "users", clubId);

    try {
      if (joinedClubs.includes(clubId)) {
        await updateDoc(studentRef, { selectedClubs: arrayRemove(clubId) });
        await updateDoc(clubRef, {
          members: arrayRemove(currentUid),
          memberRequests: arrayRemove(currentUid),
        });
        setJoinedClubs((prev) => prev.filter((id) => id !== clubId));
      } else {
        await updateDoc(studentRef, { selectedClubs: arrayUnion(clubId) });
        await updateDoc(clubRef, { memberRequests: arrayUnion(currentUid) });
        setJoinedClubs((prev) => [...prev, clubId]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to join/leave club.");
    }
  };

  const handleRegisterEvent = async (eventId) => {
    if (!currentUid) return;
    const studentRef = doc(db, "users", currentUid);
    try {
      if (registeredEvents.includes(eventId)) {
        await updateDoc(studentRef, { registeredEvents: arrayRemove(eventId) });
        setRegisteredEvents((prev) => prev.filter((id) => id !== eventId));
      } else {
        await updateDoc(studentRef, { registeredEvents: arrayUnion(eventId) });
        setRegisteredEvents((prev) => [...prev, eventId]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update registration.");
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
    <div className={`${darkMode ? "dark" : ""} min-h-screen`}>
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-colors duration-300">
        <NavBar />
        <div className="flex justify-between items-center px-6 mt-6">
          <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 text-center mb-6">
            Explore Clubs & Events
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl p-2 rounded-full bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-6 px-6">
          <div className="flex items-center bg-white dark:bg-gray-700 rounded-full shadow px-4 py-2 w-full max-w-xl transition-colors duration-300">
            <FaSearch className="text-gray-400 dark:text-gray-300 mr-2" />
            <input
              type="text"
              placeholder="Search clubs or events..."
              className="flex-grow outline-none p-2 bg-transparent text-gray-800 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Clubs */}
        <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4 px-6">
          Clubs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 px-6">
          {filteredClubs.length > 0 ? (
            filteredClubs.map((club) => (
              <div
                key={club.id}
                className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
              >
                {club.logoUrl && (
                  <img
                    src={club.logoUrl}
                    alt={club.name}
                    className="w-full h-32 object-cover rounded-xl mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                  {club.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {club.description}
                </p>
                <p className="text-gray-400 dark:text-gray-400 text-sm flex items-center mb-4">
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
            <p className="text-gray-500 dark:text-gray-400 col-span-full text-center">
              No clubs found.
            </p>
          )}
        </div>

        {/* Events */}
        <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4 px-6">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 mb-8">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105"
              >
                {event.imageUrl && (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-32 object-cover rounded-xl mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-1">
                  {event.club}
                </p>
                <p className="text-gray-400 dark:text-gray-400 text-sm mb-2">
                  <FaCalendarAlt className="inline mr-1" /> {event.date}{" "}
                  {event.time}
                </p>
                <p className="text-gray-500 dark:text-gray-300 mb-2">
                  {event.venue}
                </p>
                {event.type && (
                  <span className="inline-block px-2 py-1 text-sm rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 mb-2">
                    {event.type}
                  </span>
                )}
                <button
                  onClick={() => handleRegisterEvent(event.id)}
                  className={`w-full px-3 py-2 mt-2 rounded-xl transition font-semibold ${
                    registeredEvents.includes(event.id)
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-indigo-500 hover:bg-indigo-600 text-white"
                  }`}
                >
                  {registeredEvents.includes(event.id)
                    ? "Registered"
                    : "Register / View"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 col-span-full text-center">
              No events found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
