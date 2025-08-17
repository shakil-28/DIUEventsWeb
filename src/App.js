import "./App.css";
import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { getDoc, doc } from "firebase/firestore";
import { db } from "./firebase/config";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminPendingEvents from "./pages/AdminPendingEvents";
import AdminApprovedEvents from "./pages/AdminApprovedEvents";
import ClubDashboard from "./pages/ClubDashboard";

function App() {
  const { user, loading } = useAuth(); // assumes useAuth provides `loading`
  const navigate = useNavigate();

  // Setup dark theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Redirect user based on their role
  useEffect(() => {
    if (loading) return; // Wait for auth status

    const redirectUser = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (!userDoc.exists()) {
          navigate("/register");
          return;
        }

        const userType = userDoc.data().role;
        console.log(userType);

        if (userType === "admin") {
          navigate("/admin-dashboard");
        } else if (userType === "club") {
          // Add route if needed for club users
          navigate("/home");
        } else {
          navigate("/home");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    redirectUser();
  }, [user, loading, navigate]);

  return (
    <div className="dark:bg-slate-900 min-h-screen">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute forRegister={true}>
              <Register />
            </ProtectedRoute>
          }
        />
      </Routes>
      <AdminUserManagement />
      <AdminPendingEvents />
      <AdminApprovedEvents />
      <ClubDashboard />
    </div>
  );
}

export default App;
