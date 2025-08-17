import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../components/AdminNavBar";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config"; // make sure this path is correct

const AdminDashboard = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalClubs, setTotalClubs] = useState(0);
  const [registeredUsers, setRegisteredUsers] = useState(0);
  const [pendingEvents, setPendingEvents] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const now = new Date();
        const upcomingQuery = query(
          collection(db, "events"),
          where("startingTime", ">", now),
          where("approved", "==", true)
        );

        const snapshot = await getDocs(upcomingQuery);
        const events = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort by date ascending
        events.sort(
          (a, b) => a.startingTime.toDate() - b.startingTime.toDate()
        );

        setUpcomingEvents(events);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      }
    };

    fetchUpcomingEvents();
  }, []);

  useEffect(() => {
    const fetchDashboardCounts = async () => {
      try {
        // Total events
        const eventsSnap = await getDocs(collection(db, "events"));
        setTotalEvents(eventsSnap.size);

        // Pending events
        const pendingQuery = query(
          collection(db, "events"),
          where("approved", "==", false)
        );
        const pendingSnap = await getDocs(pendingQuery);
        setPendingEvents(pendingSnap.size);

        // Total clubs
        const clubsQuery = query(
          collection(db, "users"),
          where("role", "==", "club")
        );
        const clubsSnap = await getDocs(clubsQuery);
        setTotalClubs(clubsSnap.size);

        // Registered users (students)
        const usersQuery = query(
          collection(db, "users"),
          where("role", "==", "student")
        );
        const usersSnap = await getDocs(usersQuery);
        setRegisteredUsers(usersSnap.size);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardCounts();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div
      className={`flex min-h-screen font-sans ${
        !sidebarVisible ? "md:pl-0" : ""
      } bg-gray-100 dark:bg-gray-900`}
    >
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-56 bg-gray-800 text-white z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="p-4 border-b border-white/10 cursor-pointer flex items-center"
          onClick={toggleSidebar}
        >
          <FaArrowLeft className="mr-2" /> Back
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          sidebarVisible ? "md:ml-56" : ""
        }`}
      >
        {/* Replaced old header with NavBar */}
        <AdminNavBar
          toggleSidebar={toggleSidebar}
          sidebarVisible={sidebarVisible}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          handleLogout={handleLogout}
        />

        {/* Dashboard Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
          <div className="text-white text-center bg-gradient-to-r from-green-600 to-green-400 p-4 rounded-xl">
            <h3 className="text-lg">Total Events</h3>
            <p className="text-xl">{totalEvents}</p>
          </div>
          <div className="text-white text-center bg-gradient-to-r from-yellow-500 to-yellow-300 p-4 rounded-xl">
            <h3 className="text-lg">Total Clubs</h3>
            <p className="text-xl">{totalClubs}</p>
          </div>
          <div className="text-white text-center bg-gradient-to-r from-blue-600 to-blue-400 p-4 rounded-xl">
            <h3 className="text-lg">Registered Users</h3>
            <p className="text-xl">{registeredUsers}</p>
          </div>
          <div className="text-white text-center bg-gradient-to-r from-red-600 to-red-400 p-4 rounded-xl">
            <h3 className="text-lg">Pending Events</h3>
            <p className="text-xl">{pendingEvents}</p>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="p-4">
          <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-xl shadow">
            <h2 className="text-2xl text-gray-800 dark:text-gray-100 mb-4">
              Upcoming Events
            </h2>

            {upcomingEvents.length === 0 ? (
              <p className="text-gray-700 dark:text-gray-300 ml-2">
                No upcoming events.
              </p>
            ) : (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-md shadow flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 ml-2"
                >
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {event.name}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      Date: {event.startingTime.toDate().toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      Status: Upcoming
                    </p>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
                      Edit
                    </button>
                    <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
