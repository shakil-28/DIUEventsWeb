import React, { useState } from "react";

export default function Register() {
  const [notifications, setNotifications] = useState(true);
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [currentClub, setCurrentClub] = useState("");
  const [photo, setPhoto] = useState(null);

  const departments = ["CSE", "EEE", "BBA", "English", "Pharmacy"];
  const clubs = [
    "CPC",
    "Cultural Club",
    "Prothom Alo Bandhushova",
    "Photography Club",
    "Chess Club",
    "DIU Film Society",
    "Change Together Club",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-indigo-200 px-4 py-12">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-2xl transition-all duration-300">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-8 tracking-tight">
          🌟 Join DIU Events
        </h2>
        <form className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
              required
            />
          </div>

          {/* Student ID */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Student ID
            </label>
            <input
              type="text"
              placeholder="XXX-XX-XXXX"
              pattern="\d{3}-\d{2}-\d{4}"
              title="Format: xxx-xx-xxxx"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="01XXXXXXXXX"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
              required
            />
          </div>

          {/* Upload Photo */}
          {/* Upload Photo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Upload Photo
            </label>

            <div className="flex items-center gap-3 mt-1">
              {photo ? (
                <img
                  src={photo}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover border border-gray-300 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 border border-dashed border-gray-400 flex items-center justify-center text-gray-500 text-xs">
                  No Image
                </div>
              )}

              <div>
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md shadow hover:bg-blue-700 transition duration-200"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7h4l2-3h6l2 3h4v13H3V7z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 11l3 4H9l3-4z"
                    />
                  </svg>
                  Choose Image
                </label>

                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setPhoto(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Department Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Department
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
              required
            >
              <option value="">-- Select Department --</option>
              {departments.map((dept, i) => (
                <option key={i} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold text-gray-700">
              Enable Notifications
            </span>
            <button
              type="button"
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                notifications ? "bg-indigo-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  notifications ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>

          {/* Club Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Select Club
            </label>
            <div className="flex gap-2 mt-1">
              <select
                value={currentClub}
                onChange={(e) => {
                  const selected = e.target.value;
                  setCurrentClub(""); // reset selection

                  if (selected && !selectedClubs.includes(selected)) {
                    setSelectedClubs([...selectedClubs, selected]);
                  }
                }}
                className="flex-grow px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
              >
                <option value="">-- Choose a Club --</option>
                {clubs
                  .filter((club) => !selectedClubs.includes(club))
                  .map((club, i) => (
                    <option key={i} value={club}>
                      {club}
                    </option>
                  ))}
              </select>
            </div>

            {selectedClubs.length > 0 && (
              <ul className="mt-3 list-disc list-inside text-sm text-gray-700">
                {selectedClubs.map((club, index) => (
                  <li
                    key={index}
                    onClick={() =>
                      setSelectedClubs(selectedClubs.filter((c) => c !== club))
                    }
                    className="cursor-pointer hover:text-red-600"
                    title="Click to remove"
                  >
                    {club}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition duration-300"
          >
            Register Now
          </button>
        </form>
      </div>
    </div>
  );
}
