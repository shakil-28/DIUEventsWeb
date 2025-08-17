// AdminProfile.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateProfile,
} from "firebase/auth";
import AdminNavBar from "../components/AdminNavBar";

const AdminProfile = () => {

  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    role: "Admin",
    logoUrl: "",
    logoPublicId: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMsg, setPasswordMsg] = useState("");

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Fetch admin data from Firestore
  useEffect(() => {
    const fetchAdminData = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAdminData({
          name: docSnap.data().name || auth.currentUser.displayName || "",
          email: auth.currentUser.email,
          role: "Admin",
          logoUrl: docSnap.data().logoUrl || auth.currentUser.photoURL || "",
          logoPublicId: docSnap.data().logoPublicId || "",
        });
      }
      setLoading(false);
    };
    fetchAdminData();
  }, []);

  const handleInputChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  // Upload image to Cloudinary
  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "diu_profile");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/da4tktbus/image/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      return data; // {secure_url, public_id}
    } catch (err) {
      console.error("Image upload failed:", err);
      return null;
    }
  };

  const handleProfileUpdate = async () => {
    setUpdating(true);
    try {
      let imageData = null;

      if (selectedFile) {
        // Upload new image
        imageData = await uploadImage(selectedFile);

        // Delete old image via backend if exists
        if (adminData.logoPublicId) {
          try {
            await fetch("/api/delete-cloudinary-image", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ publicId: adminData.logoPublicId }),
            });
          } catch (err) {
            console.error("Failed to delete old image:", err);
          }
        }

        // Update Firebase Auth profile
        await updateProfile(auth.currentUser, {
          photoURL: imageData.secure_url,
        });
      }

      // Update Firestore
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, {
        name: adminData.name,
        logoUrl: imageData ? imageData.secure_url : adminData.logoUrl,
        logoPublicId: imageData ? imageData.public_id : adminData.logoPublicId,
      });

      // Update local state immediately
      setAdminData({
        ...adminData,
        logoUrl: imageData ? imageData.secure_url : adminData.logoUrl,
        logoPublicId: imageData ? imageData.public_id : adminData.logoPublicId,
      });
      setSelectedFile(null);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
    setUpdating(false);
  };

  const handlePasswordChange = async () => {
    setPasswordMsg("");
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMsg("New password and confirm password do not match.");
      return;
    }
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        passwords.currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, passwords.newPassword);
      setPasswordMsg("Password updated successfully!");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      setPasswordMsg("Failed to update password. Check your current password.");
    }
  };

  // Dummy props for AdminNavBar
  const toggleSidebar = () => {};
  const sidebarVisible = false;
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const handleLogout = () => {};

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
      <AdminNavBar
        toggleSidebar={toggleSidebar}
        sidebarVisible={sidebarVisible}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        handleLogout={handleLogout}
      />

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow mt-6 p-6 transition-colors duration-500">
          <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Admin Profile
          </h1>

          {/* Profile Info */}
          <div className="mb-6 space-y-4">
            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-200">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={adminData.name}
                onChange={handleInputChange}
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-200">
                Email (read-only)
              </label>
              <input
                type="email"
                value={adminData.email}
                readOnly
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-200">
                Role
              </label>
              <input
                type="text"
                value="Admin"
                readOnly
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-200">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                {selectedFile ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border border-gray-400 dark:border-gray-600"
                  />
                ) : adminData.logoUrl ? (
                  <img
                    src={adminData.logoUrl}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border border-gray-400 dark:border-gray-600"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500">
                    📷
                  </div>
                )}
                <label className="cursor-pointer inline-flex items-center px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg shadow transition">
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <button
              onClick={handleProfileUpdate}
              disabled={updating}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {updating ? "Updating..." : "Update Profile"}
            </button>
          </div>

          {/* Password Change */}
          <div className="mb-6 space-y-2">
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
              Change Password
            </h2>
            <input
              type="password"
              placeholder="Current Password"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, currentPassword: e.target.value })
              }
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
            <button
              onClick={handlePasswordChange}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Change Password
            </button>
            {passwordMsg && (
              <p className="text-sm text-red-500 mt-1">{passwordMsg}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
