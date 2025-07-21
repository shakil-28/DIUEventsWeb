import React, { useState } from 'react';
import { FaBars, FaArrowLeft, FaTachometerAlt, FaCalendarAlt, FaUsers, FaUser, FaCog, FaSearch } from 'react-icons/fa';

const Dashboard = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className={`flex min-h-screen font-sans ${!sidebarVisible ? 'md:pl-0' : ''}`}>      
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-56 bg-gray-800 text-white z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-white/10 cursor-pointer flex items-center" onClick={toggleSidebar}>
          <FaArrowLeft className="mr-2" /> Back
        </div>
        <nav className="mt-4">
          <ul>
            <li className="px-6 py-3 hover:bg-gray-700 flex items-center"><FaTachometerAlt className="mr-3" /> Dashboard</li>
            <li className="px-6 py-3 hover:bg-gray-700 flex items-center"><FaCalendarAlt className="mr-3" /> Events</li>
            <li className="px-6 py-3 hover:bg-gray-700 flex items-center"><FaUsers className="mr-3" /> Clubs</li>
            <li className="px-6 py-3 hover:bg-gray-700 flex items-center"><FaUser className="mr-3" /> Users</li>
            <li className="px-6 py-3 hover:bg-gray-700 flex items-center"><FaCog className="mr-3" /> Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarVisible ? 'md:ml-56' : ''}`}>        
        {/* Topbar */}
        <header className="flex items-center bg-white p-4 shadow-md flex-wrap gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            {!sidebarVisible && (
              <button className="text-xl" onClick={toggleSidebar}>
                <FaBars />
              </button>
            )}
            <h1 className="text-2xl font-bold">DIU</h1>
          </div>

          <div className="flex flex-1 items-center bg-gray-100 rounded-lg px-3 py-2 shadow-sm">
            <input
              type="text"
              placeholder="Search anything..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <FaSearch className="text-gray-600" />
          </div>

          <div className="flex items-center gap-3">
            <span>Kelsey Miller</span>
            <img
              src="https://randomuser.me/api/portraits/women/68.jpg"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>

        {/* Dashboard Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
          <div className="text-white text-center bg-gradient-to-r from-green-600 to-green-400 p-4 rounded-xl">
            <h3 className="text-lg">Total Events</h3>
            <p className="text-xl">24</p>
          </div>
          <div className="text-white text-center bg-gradient-to-r from-yellow-500 to-yellow-300 p-4 rounded-xl">
            <h3 className="text-lg">Total Clubs</h3>
            <p className="text-xl">8</p>
          </div>
          <div className="text-white text-center bg-gradient-to-r from-blue-600 to-blue-400 p-4 rounded-xl">
            <h3 className="text-lg">Registered Users</h3>
            <p className="text-xl">145</p>
          </div>
          <div className="text-white text-center bg-gradient-to-r from-red-600 to-red-400 p-4 rounded-xl">
            <h3 className="text-lg">Pending Requests</h3>
            <p className="text-xl">3</p>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="p-4">
          <div className="bg-blue-50 p-6 rounded-xl shadow">
            <h2 className="text-2xl text-gray-800 mb-4">Upcoming Events</h2>

            <div className="bg-white p-4 rounded-md shadow flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 ml-2">
              <div>
                <h4 className="text-lg font-semibold">Tech Carnival</h4>
                <p>Date: 2025-08-01</p>
                <p>Status: Upcoming</p>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button className="bg-blue-600 text-white px-3 py-1 rounded">Edit</button>
                <button className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md shadow flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 ml-2">
              <div>
                <h4 className="text-lg font-semibold">Workshop on AI</h4>
                <p>Date: 2025-08-15</p>
                <p>Status: Upcoming</p>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button className="bg-blue-600 text-white px-3 py-1 rounded">Edit</button>
                <button className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
