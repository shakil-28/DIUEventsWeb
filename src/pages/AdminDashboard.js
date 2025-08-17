import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../components/AdminNavBar";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

const AdminDashboard = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const [totalEvents, setTotalEvents] = useState(0);
  const [pendingEvents, setPendingEvents] = useState(0);
  const [totalClubs, setTotalClubs] = useState(0);
  const [registeredUsers, setRegisteredUsers] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  // Real-time counts
  useEffect(() => {
    const user = auth.currentUser;
    console.log(user.uid);
    if (!user) return;

    const eventsQuery = query(
      collection(db, "events"),
      where("clubId", "==", user.uid)
    );

    const unsubscribeEvents = onSnapshot(eventsQuery, (snapshot) => {
      setTotalEvents(snapshot.size);

      const pending = snapshot.docs.filter(
        (doc) => !doc.data().approved
      ).length;
      setPendingEvents(pending);

      const now = new Date();
      const upcoming = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((e) => e.approved === true && e.startingTime?.toDate() > now)
        .sort((a, b) => a.startingTime.toDate() - b.startingTime.toDate());

      setUpcomingEvents(upcoming);
    });

    // Clubs and registered users can remain the same
    const clubsQuery = query(
      collection(db, "users"),
      where("role", "==", "club")
    );
    const unsubscribeClubs = onSnapshot(clubsQuery, (snapshot) =>
      setTotalClubs(snapshot.size)
    );

    const usersQuery = query(
      collection(db, "users"),
      where("role", "==", "student")
    );
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) =>
      setRegisteredUsers(snapshot.size)
    );

    return () => {
      unsubscribeEvents();
      unsubscribeClubs();
      unsubscribeUsers();
    };
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigate("/login"))
      .catch(console.error);
  };

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

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  return (
    <div className={`flex min-h-screen font-sans bg-gray-100 dark:bg-gray-900`}>
      <aside
        className={`fixed top-0 left-0 h-full w-56 bg-gray-800 text-white z-50 transform transition-transform duration-300 ${
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

      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarVisible ? "md:ml-56" : ""
        }`}
      >
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
                      {event.title}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      Date: {event.startingTime.toDate().toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      Status: Upcoming
                    </p>
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
