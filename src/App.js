// src/App.js
import "./App.css";
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminApprovedEvents from "./pages/AdminApprovedEvents";
import AdminAddClub from "./pages/AdminAddClub";
import AdminPendingEvents from "./pages/AdminPendingEvents";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminProfile from "./pages/AdminProfile";
import ClubDashboard from "./pages/ClubDashboard";
import ClubEventsManagement from "./pages/ClubEventsManagement";
import ClubMembersManagement from "./pages/ClubMembersManagement";
import ClubProfile from "./pages/ClubProfile";

function App() {
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

  return (
    <div className="dark:bg-slate-900 min-h-screen">
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route
          path="/register"
          element={
            <ProtectedRoute forRegister={true}>
              <Register />
            </ProtectedRoute>
          }
        />

        {/* Authenticated user routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-approved-events"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminApprovedEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-add-club"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminAddClub />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-pending-events"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPendingEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-user-management"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminUserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-profile"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/club-dashboard"
          element={
            <ProtectedRoute requiredRole="club">
              <ClubDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/club-events-management"
          element={
            <ProtectedRoute requiredRole="club">
              <ClubEventsManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/club-members-management"
          element={
            <ProtectedRoute requiredRole="club">
              <ClubMembersManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/club-profile"
          element={
            <ProtectedRoute requiredRole="club">
              <ClubProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
