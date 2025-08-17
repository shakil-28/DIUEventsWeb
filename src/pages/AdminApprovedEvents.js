import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminApprovedEvents() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedClub, setSelectedClub] = useState("All");

  // Fetch approved events
  const fetchApprovedEvents = async () => {
    try {
      const eventsRef = collection(db, "events");
      const q = query(eventsRef, where("approved", "==", true));
      const snapshot = await getDocs(q);
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsData);
      setFilteredEvents(eventsData);
    } catch (error) {
      console.error("Error fetching approved events:", error);
    }
  };

  // Fetch departments and clubs from users collection
  const fetchDepartmentsAndClubs = async () => {
    try {
      const usersRef = collection(db, "users");

      // Departments
      const deptQuery = query(usersRef, where("role", "==", "department"));
      const deptSnap = await getDocs(deptQuery);
      const deptNames = deptSnap.docs.map((doc) => doc.data().name);

      // Clubs
      const clubQuery = query(usersRef, where("role", "==", "club"));
      const clubSnap = await getDocs(clubQuery);
      const clubNames = clubSnap.docs.map((doc) => doc.data().name);

      setDepartments(["All", ...deptNames]);
      setClubs(["All", ...clubNames]);
    } catch (error) {
      console.error("Error fetching departments and clubs:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchApprovedEvents();
      await fetchDepartmentsAndClubs();
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((e) => e.title.toLowerCase().includes(term));
    }

    if (selectedDepartment !== "All") {
      filtered = filtered.filter((e) => e.department === selectedDepartment);
    }

    if (selectedClub !== "All") {
      filtered = filtered.filter((e) => e.clubid === selectedClub);
    }

    setFilteredEvents(filtered);
  }, [searchTerm, selectedDepartment, selectedClub, events]);

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading events...</p>;

  const COLORS = ["#10B981", "#F59E0B"]; // Loved, Interested

  const getEngagementData = (event) => ({
    Loved: event.lovedUsers?.length || 0,
    Interested: event.interestedUsers?.length || 0,
  });

  // Summary statistics
  const totalEvents = filteredEvents.length;
  const totalLoved = filteredEvents.reduce(
    (acc, e) => acc + (e.lovedUsers?.length || 0),
    0
  );
  const totalInterested = filteredEvents.reduce(
    (acc, e) => acc + (e.interestedUsers?.length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 to-blue-50 p-6">
      <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-6">
        Admin Dashboard: Approved Events
      </h1>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search events by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="w-full md:w-1/4 px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          {departments.map((dept, idx) => (
            <option key={idx} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        <select
          value={selectedClub}
          onChange={(e) => setSelectedClub(e.target.value)}
          className="w-full md:w-1/4 px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          {clubs.map((club, idx) => (
            <option key={idx} value={club}>
              {club}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-lg rounded-3xl p-6 flex flex-col items-center transition transform hover:scale-105 duration-300">
          <p className="text-gray-400">Total Approved Events</p>
          <p className="text-3xl font-bold text-indigo-600">{totalEvents}</p>
        </div>
        <div className="bg-white shadow-lg rounded-3xl p-6 flex flex-col items-center transition transform hover:scale-105 duration-300">
          <p className="text-gray-400">Total Loved Users</p>
          <p className="text-3xl font-bold text-green-600">{totalLoved}</p>
        </div>
        <div className="bg-white shadow-lg rounded-3xl p-6 flex flex-col items-center transition transform hover:scale-105 duration-300">
          <p className="text-gray-400">Total Interested Users</p>
          <p className="text-3xl font-bold text-yellow-600">{totalInterested}</p>
        </div>
      </div>

      {/* Event Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {filteredEvents.map((event) => {
          const engagement = getEngagementData(event);
          return (
            <div
              key={event.id}
              className="bg-white rounded-3xl shadow-xl p-6 transition transform hover:scale-105 duration-300 flex flex-col"
            >
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-52 object-cover rounded-2xl mb-4 shadow-sm"
              />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {event.title}
              </h2>
              <p className="text-gray-600 mb-2 line-clamp-3">{event.description}</p>
              <p className="text-sm text-gray-500 mb-4">
                📍 {event.location} | 📅{" "}
                {new Date(event.startingTime.seconds * 1000).toLocaleString()}
              </p>

              {/* Engagement Bar Chart */}
              <div className="bg-gray-50 p-4 rounded-2xl shadow-inner">
                <h3 className="font-semibold mb-2 text-gray-700">Engagement</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={[{ name: event.title, ...engagement }]}>
                    <XAxis dataKey="name" hide />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Loved" fill={COLORS[0]} radius={[8, 8, 0, 0]} />
                    <Bar
                      dataKey="Interested"
                      fill={COLORS[1]}
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
