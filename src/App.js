import "./App.css";
import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import { getDoc, query } from "firebase/firestore";
import { db } from "./firebase/config"


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
    const userNavigation = async () => {
      if (!user) {
        navigate('/login');
      }
      else if (1) {
        navigate()
      }
      else {
        navigate('/home');
      }
    };

    userNavigation();
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
        <Route 
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              
            </ProtectedRoute>
          }
        />
      </Routes>
      {/* <ProfileEditPage /> */}
    </div>
  );
}

export default App;
