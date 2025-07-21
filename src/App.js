import "./App.css";
import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import EventDetailsPage from "./pages/EventDetailsPage";
import ProfileEditPage from "./pages/ProfileEditPage";

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();

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

  // Redirect based on login state
  useEffect(() => {
    if (user) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="dark:bg-slate-900 min-h-screen">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Register />
      <EventDetailsPage />
      {/* <ProfileEditPage /> */}
    </div>
  );
}

export default App;
