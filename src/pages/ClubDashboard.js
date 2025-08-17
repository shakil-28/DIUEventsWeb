// src/pages/ClubDashboard.js
import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaUsers, FaCheckCircle, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase/config"; // make sure db and auth are exported
import ClubNavBar from "../components/ClubNavBar";

const ClubDashboard = () => {
  const navigate = useNavigate();
  const [upcomingEventsCount, setUpcomingEventsCount] = useState(0);
  const [approvedEventsCount, setApprovedEventsCount] = useState(0);
  const [registeredMembersCount, setRegisteredMembersCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // 1️⃣ Get the club document for the logged-in user
        const clubQuery = query(
          collection(db, "users"), // assuming clubs are in 'users' collection
          where("uid", "==", user.uid)
        );
        const clubSnapshot = await getDocs(clubQuery);
        if (clubSnapshot.empty) return;

        const clubData = clubSnapshot.docs[0].data();

        // Registered members
        setRegisteredMembersCount(clubData.members?.length || 0);

        // 2️⃣ Fetch events for this club
        const eventsQuery = query(
          collection(db, "events"),
          where("clubId", "==", user.uid)
        );
        const eventsSnapshot = await getDocs(eventsQuery);

        let upcoming = 0;
        let approved = 0;
        const today = new Date();

        eventsSnapshot.forEach((doc) => {
          const event = doc.data();
          const eventDate = event.date ? new Date(event.date) : null;

          if (eventDate && eventDate >= today) upcoming += 1;
          if (event.status === "approved") approved += 1;
        });

        setUpcomingEventsCount(upcoming);
        setApprovedEventsCount(approved);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <ClubNavBar />

      <div className="p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-10 drop-shadow-md">
          Club Dashboard
        </h1>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <FaCalendarAlt className="text-indigo-500 text-4xl mb-3" />
            <h2 className="text-lg font-semibold">Upcoming Events</h2>
            <p className="text-2xl font-bold text-indigo-700">{upcomingEventsCount}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <FaUsers className="text-green-500 text-4xl mb-3" />
            <h2 className="text-lg font-semibold">Registered Members</h2>
            <p className="text-2xl font-bold text-green-700">{registeredMembersCount}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <FaCheckCircle className="text-purple-500 text-4xl mb-3" />
            <h2 className="text-lg font-semibold">Approved Events</h2>
            <p className="text-2xl font-bold text-purple-700">{approvedEventsCount}</p>
          </div>
        </div>

        {/* Actions Section */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => navigate("/club-events-management")}
              className="flex items-center justify-center gap-3 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              <FaPlus /> Add New Event
            </button>
            <button
              onClick={() => navigate("/club-members-management")}
              className="flex items-center justify-center gap-3 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              <FaUsers /> Manage Members
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDashboard;
