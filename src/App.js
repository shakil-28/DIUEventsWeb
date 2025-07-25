import "./App.css";
import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { getDoc, doc } from "firebase/firestore";
import { db } from "./firebase/config";
import AdminDashboard from './pages/AdminDashboard'


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
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (!userDoc.exists()) {
          navigate('/register')
          return;
        }

        const userType = userDoc.data().userType;

        if (userType === "admin") {
          navigate('/admin-dashboard');
        }

        else if (userType === "club") {
          
        }
        else {
          navigate('/home');
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    userNavigation();
  }, [user, navigate]);

  return (
    <div className="dark:bg-slate-900 min-h-screen">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={ <Register /> }/>

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
      </Routes>
      <Register />
      <EventDetailsPage />
      {/* <ProfileEditPage /> */}
    </div>
  );
}

export default App;
