// src/pages/AdminAddClub.js
import React, { useState } from "react";
import { db, auth } from "../firebase/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import AdminNavBar from "../components/AdminNavBar";

const AdminAddClub = () => {
  const [clubName, setClubName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Upload image to Cloudinary
  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "diu_profile"); // your Cloudinary preset

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/da4tktbus/image/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error("Image upload failed:", err);
      return null;
    }
  };

  const handleAddClub = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    if (!clubName || !email || !password) {
      setErrorMsg("Name, Email, and Password are required");
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 2️⃣ Upload image if selected
      let logoUrl = "";
      if (selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile);
        if (!uploadedUrl) {
          setErrorMsg("Failed to upload logo");
          setLoading(false);
          return;
        }
        logoUrl = uploadedUrl;
      }

      // 3️⃣ Save club in Firestore
      const newClubRef = doc(db, "users", uid);
      await setDoc(newClubRef, {
        uid,
        name: clubName,
        email,
        role: "club",
        description: description || "",
        logoUrl: logoUrl,
        members: [],
        memberRequests: [],
        createdAt: serverTimestamp(),
      });

      setSuccessMsg("Club account created successfully!");
      setClubName("");
      setEmail("");
      setPassword("");
      setDescription("");
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || "Failed to create club account.");
    }
    setLoading(false);
  };

  // Dummy props for AdminNavBar
  const toggleSidebar = () => {};
  const sidebarVisible = false;
  const darkMode = false;
  const toggleDarkMode = () => {};
  const handleLogout = () => {};

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 to-blue-50">
      <AdminNavBar
        toggleSidebar={toggleSidebar}
        sidebarVisible={sidebarVisible}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        handleLogout={handleLogout}
      />

      <div className="max-w-md mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
          Add New Club
        </h2>

        {successMsg && <p className="text-green-500 mb-4">{successMsg}</p>}
        {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

        <form onSubmit={handleAddClub} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Club Name"
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
          />

          {/* Image Upload */}
          <div className="flex items-center gap-4">
            {selectedFile ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover border border-gray-400 dark:border-gray-600"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 text-xl">
                📷
              </div>
            )}
            <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition">
              Choose Logo
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Creating..." : "Add Club"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddClub;
