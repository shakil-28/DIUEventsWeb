// src/pages/StudentProfile.js
import React, { useState, useEffect } from "react";
import { FaCamera, FaSave } from "react-icons/fa";
import { auth, db } from "../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateProfile,
} from "firebase/auth";

export default function StudentProfile() {
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
  });

  const [passwordInfo, setPasswordInfo] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPersonalInfo({
          fullName: data.fullName || auth.currentUser.displayName || "",
          email: auth.currentUser.email,
          phone: data.phone || "",
          bio: data.bio || "",
        });
        setProfileImage(data.photoURL || auth.currentUser.photoURL || "");
        setJoinedClubs(data.joinedClubs || []);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handlePersonalChange = (e) =>
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPasswordInfo({ ...passwordInfo, [e.target.name]: e.target.value });

  const toggleEditMode = () => setEditMode(!editMode);

  // Cloudinary image upload
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "diu_profile");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/da4tktbus/image/upload",
      { method: "POST", body: formData }
    );
    const data = await res.json();
    return data;
  };

  const savePersonalInfo = async () => {
    try {
      let imageData = null;
      if (selectedFile) {
        imageData = await uploadImage(selectedFile);
        await updateProfile(auth.currentUser, {
          photoURL: imageData.secure_url,
        });
      }
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, {
        fullName: personalInfo.fullName,
        phone: personalInfo.phone,
        bio: personalInfo.bio,
        photoURL: imageData ? imageData.secure_url : profileImage,
      });
      setProfileImage(imageData ? imageData.secure_url : profileImage);
      setSelectedFile(null);
      setEditMode(false);
      alert("Personal info saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save personal info");
    }
  };

  const changePassword = async () => {
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        passwordInfo.oldPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, passwordInfo.newPassword);
      alert("Password changed successfully!");
      setPasswordInfo({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to change password. Check your current password.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative">
          <img
            src={
              selectedFile ? URL.createObjectURL(selectedFile) : profileImage
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover shadow-lg"
          />
          <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition">
            <FaCamera className="text-white" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>
        <h1 className="text-2xl font-bold text-indigo-700 mt-4">
          {personalInfo.fullName}
        </h1>
        <p className="text-gray-500">{personalInfo.email}</p>
      </div>

      {/* Personal Info Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-indigo-700">
            Personal Information
          </h2>
          <button
            onClick={toggleEditMode}
            className="px-3 py-1.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition"
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {["fullName", "email", "phone"].map((field) => (
            <div className="flex flex-col" key={field}>
              <label className="text-gray-500 mb-1 capitalize">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={personalInfo[field]}
                onChange={handlePersonalChange}
                disabled={!editMode || field === "email"}
                className={`p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                  editMode ? "bg-white" : "bg-gray-100"
                }`}
              />
            </div>
          ))}
          <div className="flex flex-col col-span-1 sm:col-span-2">
            <label className="text-gray-500 mb-1">Bio</label>
            <textarea
              name="bio"
              value={personalInfo.bio}
              onChange={handlePersonalChange}
              disabled={!editMode}
              className={`p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none ${
                editMode ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>
        </div>

        {editMode && (
          <div className="flex justify-end mt-4 gap-2">
            <button
              onClick={savePersonalInfo}
              className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition flex items-center gap-1"
            >
              <FaSave /> Save
            </button>
          </div>
        )}
      </div>

      {/* Change Password Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-indigo-700 mb-4">
          Change Password
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="password"
            name="oldPassword"
            value={passwordInfo.oldPassword}
            onChange={handlePasswordChange}
            placeholder="Old Password"
            className="p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white"
          />
          <input
            type="password"
            name="newPassword"
            value={passwordInfo.newPassword}
            onChange={handlePasswordChange}
            placeholder="New Password"
            className="p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white"
          />
          <input
            type="password"
            name="confirmPassword"
            value={passwordInfo.confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Confirm Password"
            className="p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white"
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={changePassword}
            className="px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Joined Clubs (display only) */}
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-indigo-700 mb-4">Joined Clubs</h2>
        <div className="flex gap-4 overflow-x-auto py-2">
          {joinedClubs.map((club, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-2xl shadow hover:shadow-md transition"
            >
              <p className="font-semibold">{club.name}</p>
              <p className="text-sm">{club.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
