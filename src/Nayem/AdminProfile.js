import React, { useState } from "react";

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Admin Rahim",
    email: "admin@example.com",
    phone: "+8801234567890",
    fatherName: "Mr. Abdur Rahim",
    fatherContact: "+8801234567000",
    motherName: "Mrs. Rahima",
    motherContact: "+8801234567001",
    university: "Daffodil International University",
    degree: "Bachelor",
    present: "Dhaka, Bangladesh",
    permanent: "Gazipur, Bangladesh",
    guardian: "Mr. Karim",
    guardianContact: "+8801234567002",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, degree: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-l from-[#d1ebf3] to-[#fdfdfd] p-6">
      {/* Header */}
      <header className="flex items-center justify-between bg-[#2d84c2] px-6 py-4 rounded-lg mb-8">
        <button
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => (window.location.href = "/dashboard")}
        >
          <img src="Asset/darkLogo.svg" alt="Logo" className="h-10" />
        </button>
        <h1 className="text-white text-xl text-center flex-grow -ml-10">
          Admin Profile
        </h1>
        <a
          href="/dashboard"
          className="bg-[#1f6ea5] hover:bg-[#185b87] text-white w-10 h-8 text-center rounded-md text-lg font-bold"
        >
          ←
        </a>
      </header>

      {/* Profile Box */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#96caee7b] to-[#f1f8ff] p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-6">
          <img
            src="https://media.istockphoto.com/id/533995902/photo/gentoo-penguin-walking-in-snow-in-antarctica.jpg?s=612x612&w=0&k=20&c=VZ2ufwdkfo7BXK22tCu8tqTM27pxby-bKRGpYO61k-s="
            alt="Admin"
            className="w-24 h-24 mx-auto rounded-full border-4 border-[#2d84c2] object-cover"
          />
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[#2d84c2] hover:bg-[#1a5c90] text-white font-bold py-2 px-6 rounded-md mx-auto block"
          >
            Edit
          </button>
        )}

        <h2 className="text-center text-[#2d3e50] text-xl mt-4 mb-6">
          Welcome, Admin
        </h2>

        {[
          ["Full Name", "fullName"],
          ["Email", "email"],
          ["Phone Number", "phone"],
          ["Present Address", "present"],
          ["Permanent Address", "permanent"],
        ].map(([label, id]) => (
          <div className="mb-4" key={id}>
            <label className="font-semibold block mb-1 text-gray-700">{label}</label>
            <input
              type="text"
              id={id}
              value={formData[id]}
              onChange={handleChange}
              readOnly={!isEditing}
              className="w-full p-3 rounded-md border border-gray-300 bg-gray-100 text-gray-800"
            />
          </div>
        ))}

        {["father", "mother", "guardian"].map((role) => (
          <div className="mb-4 flex flex-col md:flex-row gap-4" key={role}>
            <div className="flex-7">
              <label className="font-semibold block mb-1 text-gray-700">
                {role.charAt(0).toUpperCase() + role.slice(1)}'s Name
              </label>
              <input
                type="text"
                id={`${role}Name`}
                value={formData[`${role}Name`]}
                onChange={handleChange}
                readOnly={!isEditing}
                className="w-full p-3 rounded-md border border-gray-300 bg-gray-100 text-gray-800"
              />
            </div>
            <div className="flex-3">
              <label className="font-semibold block mb-1 text-gray-700">
                {role === "guardian" ? "Contact" : `${role.charAt(0).toUpperCase() + role.slice(1)}'s Contact`}
              </label>
              <input
                type="text"
                id={`${role}Contact`}
                value={formData[`${role}Contact`]}
                onChange={handleChange}
                readOnly={!isEditing}
                className="w-full p-3 rounded-md border border-gray-300 bg-gray-100 text-gray-800"
              />
            </div>
          </div>
        ))}

        <div className="mb-4">
          <label className="font-semibold block mb-1 text-gray-700">University</label>
          <select
            id="degreeSelect"
            disabled={!isEditing}
            value={formData.degree}
            onChange={handleSelectChange}
            className="w-full p-3 rounded-md border border-gray-300 bg-gray-100 text-gray-800"
          >
            <option value="">Select Option</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Masters">Masters</option>
            <option value="Graduated">Graduated From</option>
          </select>
          {formData.degree && (
            <input
              type="text"
              id="university"
              value={formData.university}
              onChange={handleChange}
              readOnly={!isEditing}
              className="w-full p-3 rounded-md border border-gray-300 bg-gray-100 text-gray-800 mt-2"
            />
          )}
        </div>

        {isEditing && (
          <button
            onClick={() => setIsEditing(false)}
            className="bg-[#2d84c2] hover:bg-[#1a5c90] text-white font-bold py-2 px-6 rounded-md mt-6 mx-auto block"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;

