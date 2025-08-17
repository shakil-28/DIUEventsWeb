import React, { useState } from "react";
import { db } from "../firebase/config";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import AdminNavBar from "../components/AdminNavBar";

const AdminAddClub = () => {
  const [clubName, setClubName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAddClub = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    if (!clubName || !email) {
      setErrorMsg("Name and Email are required");
      setLoading(false);
      return;
    }

    try {
      const newClubRef = doc(collection(db, "users"));

      await setDoc(newClubRef, {
        uid: newClubRef.id,
        name: clubName,
        email: email,
        role: "club",
        description: description || "",
        logoUrl: logoUrl || "",
        members: [],
        memberRequests: [],
        createdAt: serverTimestamp(),
      });

      setSuccessMsg("Club account created successfully!");
      setClubName("");
      setEmail("");
      setDescription("");
      setLogoUrl("");
    } catch (error) {
      console.error("Error creating club:", error);
      setErrorMsg("Failed to create club account.");
    } finally {
      setLoading(false);
    }
  };

  // Dummy props for AdminNavBar (replace with real logic)
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

      <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Add New Club
        </h2>

        {successMsg && <p className="text-green-500 mb-2">{successMsg}</p>}
        {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}

        <form onSubmit={handleAddClub} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Club Name"
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
            className="p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <input
            type="text"
            placeholder="Logo URL (optional)"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Creating..." : "Add Club"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddClub;
