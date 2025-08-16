import React, { useState } from "react";

export default function Register() {
  const [notifications, setNotifications] = useState(true);
  const [selectedClubs, setSelectedClubs] = useState([]);
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

  const handleRegisterFormSubmit = async () => {
    
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4 py-12">
      <div className="bg-white/10 backdrop-blur-lg shadow-xl rounded-3xl p-10 w-full max-w-2xl transition-all duration-300 border border-white/20">
        <h2 className="text-4xl font-extrabold text-center text-white mb-8 tracking-tight">
          Join DIU Events
        </h2>

        <form className="space-y-6 text-white" onSubmit={handleRegisterFormSubmit}>
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl border border-gray-500 bg-black/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Student ID */}
          <div>
            <label className="block text-sm font-semibold mb-1">Student ID</label>
            <input
              type="text"
              placeholder="XXX-XX-XXXX"
              pattern="\d{3}-\d{2}-\d{4}"
              title="Format: xxx-xx-xxxx"
              className="w-full px-4 py-3 rounded-xl border border-gray-500 bg-black/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="01XXXXXXXXX"
              className="w-full px-4 py-3 rounded-xl border border-gray-500 bg-black/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Upload Photo */}
          <div>
            <label className="block text-sm font-semibold mb-1">Upload Photo</label>
            <div className="flex items-center gap-4 mt-1">
              {photo ? (
                <img
                  src={photo}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover border border-gray-500 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-800 border border-dashed border-gray-500 flex items-center justify-center text-gray-400 text-xs">
                  📷
                </div>
              )}

              <div>
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer inline-flex items-center px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg shadow transition"
                >
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
            <label className="block text-sm font-semibold mb-1">Department</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-500 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">-- Select Department --</option>
              {departments.map((dept, i) => (
                <option key={i} value={dept} className="text-black">
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold">Enable Notifications</span>
            <button
              type="button"
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                notifications ? "bg-blue-500" : "bg-gray-500"
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
            <label className="block text-sm font-semibold mb-1">Select Club</label>
            <select
              onChange={(e) => {
                const selected = e.target.value;
                if (selected && !selectedClubs.includes(selected)) {
                  setSelectedClubs([...selectedClubs, selected]);
                }
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-500 bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Choose a Club --</option>
              {clubs.filter((club) => !selectedClubs.includes(club)).map((club, i) => (
                <option key={i} value={club} className="text-black">
                  {club}
                </option>
              ))}
            </select>

            {selectedClubs.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedClubs.map((club, index) => (
                  <span
                    key={index}
                    onClick={() =>
                      setSelectedClubs(selectedClubs.filter((c) => c !== club))
                    }
                    className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-red-500 transition"
                  >
                    {club} ✖
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg transition duration-300"
          >
            Register Now
          </button>
        </form>
      </div>
    </div>
  );
}
