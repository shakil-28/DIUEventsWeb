// src/pages/StudentProfile.js
import React, { useState, useEffect } from "react";
import { FaCamera, FaSave } from "react-icons/fa";
import { auth, db } from "../firebase/config";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateProfile,
} from "firebase/auth";
import { NavBar } from "../components/NavBar";
import { signOut } from "firebase/auth";

export default function StudentProfile() {
  const [darkMode] = useState(false); // only keep the value if needed
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
  const [pendingClubs, setPendingClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;

      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;

      const userData = userSnap.data();

      setPersonalInfo({
        fullName: userData.fullName || auth.currentUser.displayName || "",
        email: auth.currentUser.email,
        phone: userData.phone || "",
        bio: userData.bio || "",
      });

      setProfileImage(userData.photoURL || auth.currentUser.photoURL || "");

      const studentUid = auth.currentUser.uid;

      const usersRef = collection(db, "users");
      const usersSnap = await getDocs(usersRef);
      const allUsers = usersSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const joined = allUsers.filter(
        (u) => u.role === "club" && u.members?.includes(studentUid)
      );

      const pending = allUsers.filter(
        (u) =>
          u.role === "club" &&
          userData.selectedClubs?.includes(u.id) &&
          !joined.some((j) => j.id === u.id)
      );

      setJoinedClubs(joined);
      setPendingClubs(pending);

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect to login page
      window.location.href = "/login"; // or use react-router navigate
    } catch (err) {
      console.error(err);
      alert("Failed to logout");
    }
  };

  const handlePersonalChange = (e) =>
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPasswordInfo({ ...passwordInfo, [e.target.name]: e.target.value });

  const toggleEditMode = () => setEditMode(!editMode);

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
    <div className={`${darkMode ? "dark" : ""} min-h-screen`}>
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
        <NavBar />

        {/* Profile Header */}
        <div className="flex flex-col items-center mb-10 p-6">
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
          <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mt-4">
            {personalInfo.fullName}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {personalInfo.email}
          </p>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Personal Info Card */}
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 mb-6 max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
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
                <label className="text-gray-500 dark:text-gray-400 mb-1 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={personalInfo[field]}
                  onChange={handlePersonalChange}
                  disabled={!editMode || field === "email"}
                  className={`p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                    editMode
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  }`}
                />
              </div>
            ))}
            <div className="flex flex-col col-span-1 sm:col-span-2">
              <label className="text-gray-500 dark:text-gray-400 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={personalInfo.bio}
                onChange={handlePersonalChange}
                disabled={!editMode}
                className={`p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none ${
                  editMode
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 mb-6 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">
            Change Password
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="password"
              name="oldPassword"
              value={passwordInfo.oldPassword}
              onChange={handlePasswordChange}
              placeholder="Old Password"
              className="p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <input
              type="password"
              name="newPassword"
              value={passwordInfo.newPassword}
              onChange={handlePasswordChange}
              placeholder="New Password"
              className="p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <input
              type="password"
              name="confirmPassword"
              value={passwordInfo.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm Password"
              className="p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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

        {/* Joined Clubs */}
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 mb-6 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">
            Joined Clubs
          </h2>
          <div className="flex gap-4 overflow-x-auto py-2">
            {joinedClubs.length > 0 ? (
              joinedClubs.map((club) => (
                <div
                  key={club.id}
                  className="flex-shrink-0 px-4 py-2 bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 rounded-2xl shadow hover:shadow-md transition"
                >
                  <p className="font-semibold">{club.name}</p>
                  <p className="text-sm">{club.role}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No joined clubs yet.
              </p>
            )}
          </div>
        </div>

        {/* Pending Club Requests */}
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">
            Pending Club Requests
          </h2>
          <div className="flex gap-4 overflow-x-auto py-2">
            {pendingClubs.length > 0 ? (
              pendingClubs.map((club) => (
                <div
                  key={club.id}
                  className="flex-shrink-0 px-4 py-2 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-2xl shadow hover:shadow-md transition"
                >
                  <p className="font-semibold">{club.name}</p>
                  <p className="text-sm">Request Pending</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No pending requests.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
