import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import {
  updateProfile,
  EmailAuthProvider,
  linkWithCredential,
  updatePassword,
  reauthenticateWithCredential,
} from "firebase/auth";
import { doc, setDoc, collection, getDocs } from "firebase/firestore"; // <-- fixed imports
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [notifications, setNotifications] = useState(true);
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [clubs, setClubs] = useState([]);

  const navigate = useNavigate();
  const departments = ["CSE", "EEE", "BBA", "English", "Pharmacy"];

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    if (auth.currentUser) setUserEmail(auth.currentUser.email);
  }, []);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const clubsSnapshot = await getDocs(collection(db, "clubs")); // fetch clubs collection
        const clubsData = clubsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClubs(clubsData);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };
    fetchClubs();
  }, []);

  const validatePassword = (pwd) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return regex.test(pwd);
  };

  const handleRegisterFormSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!validatePassword(password)) {
      alert(
        "Password must be at least 8 characters, include a letter, a number, and a special character."
      );
      return;
    }

    setLoading(true);

    try {
      let uploadedPhotoURL = "";

      if (photo instanceof File) {
        const formData = new FormData();
        formData.append("file", photo);
        formData.append("upload_preset", "diu_profile");

        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/da4tktbus/image/upload`,
          { method: "POST", body: formData }
        );
        const data = await cloudinaryResponse.json();
        uploadedPhotoURL = data.secure_url;
      }

      const fullName = e.target.fullName.value;
      const studentId = e.target.studentId.value;
      const phone = e.target.phone.value;
      const department = e.target.department.value;
      const currentUser = auth.currentUser;

      const hasPasswordProvider = currentUser.providerData.some(
        (p) => p.providerId === "password"
      );

      if (!hasPasswordProvider) {
        const credential = EmailAuthProvider.credential(userEmail, password);
        await linkWithCredential(currentUser, credential);
      } else {
        try {
          const credential = EmailAuthProvider.credential(userEmail, password);
          await reauthenticateWithCredential(currentUser, credential);
          await updatePassword(currentUser, password);
        } catch (err) {
          if (err.code === "auth/requires-recent-login") {
            alert(
              "Please logout and login again with Google to update your password."
            );
            setLoading(false);
            return;
          } else {
            throw err;
          }
        }
      }

      await updateProfile(currentUser, {
        displayName: fullName,
        photoURL: uploadedPhotoURL,
      });

      await setDoc(doc(db, "users", currentUser.uid), {
        fullName,
        studentId,
        phone,
        department,
        notifications,
        selectedClubs,
        photoURL: uploadedPhotoURL,
        email: userEmail,
        role: "student", // <-- added role here
        createdAt: new Date(),
      });

      alert("Registration successful!");
      e.target.reset();
      setPhoto(null);
      setSelectedClubs([]);
      setPassword("");
      setConfirmPassword("");
      navigate("/home");
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-12 transition-colors duration-500">
      <div className="bg-white/90 dark:bg-gray-800 backdrop-blur-lg shadow-xl rounded-3xl p-10 w-full max-w-2xl border border-gray-300 dark:border-gray-700 transition-colors duration-500">
        {/* Dark Mode Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 font-semibold transition-colors duration-300"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <h2 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-8 tracking-tight">
          Complete Your Registration
        </h2>

        <form
          className="space-y-6 text-gray-900 dark:text-white"
          onSubmit={handleRegisterFormSubmit}
        >
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Full Name
            </label>
            <input
              name="fullName"
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300"
              required
            />
          </div>

          {/* Student ID */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Student ID
            </label>
            <input
              name="studentId"
              type="text"
              placeholder="XXX-XX-XXXX"
              pattern="\d{3}-\d{2}-\d{4}"
              title="Format: xxx-xx-xxxx"
              className="w-full px-4 py-3 rounded-xl border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Phone Number
            </label>
            <input
              name="phone"
              type="tel"
              placeholder="01XXXXXXXXX"
              className="w-full px-4 py-3 rounded-xl border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300"
              required
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Upload Photo
            </label>
            <div className="flex items-center gap-4 mt-1">
              {photo ? (
                <img
                  src={URL.createObjectURL(photo)}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover border border-gray-400 dark:border-gray-600 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-600 border border-dashed border-gray-400 dark:border-gray-500 flex items-center justify-center text-gray-500 dark:text-gray-300 text-xs">
                  📷
                </div>
              )}
              <div>
                <label className="cursor-pointer inline-flex items-center px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg shadow transition">
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Department
            </label>
            <select
              name="department"
              className="w-full px-4 py-3 rounded-xl border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300"
              required
            >
              <option value="">-- Select Department --</option>
              {departments.map((dept, i) => (
                <option
                  key={i}
                  value={dept}
                  className="text-gray-900 dark:text-white"
                >
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300"
              required
            />
          </div>

          {/* Notifications */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold">Enable Notifications</span>
            <button
              type="button"
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                notifications ? "bg-blue-500" : "bg-gray-400 dark:bg-gray-600"
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
            <label className="block text-sm font-semibold mb-1">
              Select Club
            </label>
            <select
              onChange={(e) => {
                const selected = e.target.value;
                if (selected && !selectedClubs.includes(selected)) {
                  setSelectedClubs([...selectedClubs, selected]);
                }
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300"
            >
              <option value="">-- Choose a Club --</option>
              {clubs
                .filter((club) => !selectedClubs.includes(club.id))
                .map((club) => (
                  <option
                    key={club.id}
                    value={club.id}
                    className="text-gray-900 dark:text-white"
                  >
                    {club.name || club.id}
                  </option>
                ))}
            </select>

            {selectedClubs.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedClubs.map((clubId) => {
                  const clubObj = clubs.find((c) => c.id === clubId);
                  return (
                    <span
                      key={clubId}
                      onClick={() =>
                        setSelectedClubs(
                          selectedClubs.filter((c) => c !== clubId)
                        )
                      }
                      className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-red-500 transition"
                    >
                      {clubObj?.name || clubId} ✖
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg transition duration-300 flex justify-center items-center gap-2"
          >
            {loading ? "Registering..." : "Complete Registration"}
          </button>
        </form>
      </div>
    </div>
  );
}
