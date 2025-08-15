import React, { useState } from "react";

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    "https://imgcdn.stablediffusionweb.com/2024/4/7/76683d35-d0e9-4bf4-a630-99a6cc7da8c2.jpg"
  );

  const [formData, setFormData] = useState({
    fullName: "Nayem Hasan",
    email: "admin@example.com",
    phone: "+8801234567890",
    university: "Daffodil International University",
    degree: "Bachelor",
    present: "Dhaka, Bangladesh",
    permanent: "Gazipur, Bangladesh",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, degree: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-indigo-200 px-4 py-12">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-3xl transition-all duration-300">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6 tracking-tight">
          Admin Profile
        </h2>
        {/* Profile Image */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <img
            src={imagePreview}
            alt="Admin"
            className="rounded-full w-full h-full object-cover border-4 border-[#2d84c2]"
          />

          {isEditing && (
            <>
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-2 shadow cursor-pointer hover:bg-gray-100"
                title="Change Profile Photo"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#2d84c2]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536M9 13l6-6m2-2a2.828 2.828 0 114 4l-9 9H6v-6l9-9z"
                  />
                </svg>
              </label>

              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </>
          )}
        </div>

        <form className="space-y-6">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>

          {/* Addresses */}
          <div>
            <label
              htmlFor="present"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Present Address
            </label>
            <input
              type="text"
              id="present"
              value={formData.present}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>

          <div>
            <label
              htmlFor="permanent"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Permanent Address
            </label>
            <input
              type="text"
              id="permanent"
              value={formData.permanent}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>

          {/* Degree */}
          <div>
            <label
              htmlFor="degreeSelect"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Degree
            </label>
            <select
              id="degreeSelect"
              disabled={!isEditing}
              value={formData.degree}
              onChange={handleSelectChange}
              className={`w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
            >
              <option value="">Select Option</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Bachelor">Bachelor</option>
              <option value="Masters">Masters</option>
            </select>
          </div>

          {/* University */}
          {formData.degree && (
            <div>
              <label
                htmlFor="university"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                University
              </label>
              <input
                type="text"
                id="university"
                value={formData.university}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm ${
                  isEditing ? "bg-white" : "bg-gray-100"
                }`}
              />
            </div>
          )}

          {/* Edit / Save Button */}
          <div>
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition duration-300"
              >
                Edit Profile
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 transition duration-300"
              >
                Save Changes
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
