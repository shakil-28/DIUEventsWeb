import React, { useState } from 'react';

const ProfileEditPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    department: '',
    semester: '',
    dob: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
    console.log(formData);
    // Call an API here to save the data
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-blue-800 text-center">Edit Your Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Picture */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-blue-300 rounded-full flex items-center justify-center text-white text-xl font-bold">
              👤
            </div>
            <button
              type="button"
              className="text-blue-600 hover:underline font-medium"
            >
              Change Profile Picture
            </button>
          </div>

          {/* Name */}
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@diu.edu.bd"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select Department</option>
              <option value="CSE">CSE</option>
              <option value="EEE">EEE</option>
              <option value="BBA">BBA</option>
              <option value="ENG">English</option>
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Semester</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select Semester</option>
              <option value="Spring 2025">Spring 2025</option>
              <option value="Summer 2025">Summer 2025</option>
              <option value="Fall 2025">Fall 2025</option>
            </select>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Short Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us something about yourself..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="3"
            />
          </div>

          {/* Submit */}
          <div className="text-right">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditPage;
