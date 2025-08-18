import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../hooks/useAuth";

export function NavBar() {
  const { user } = useAuth();
  const [theme, setTheme] = useState("light");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [photoURL, setPhotoURL] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from Firestore
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setPhotoURL(data.photoURL || null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (
      storedTheme === "dark" ||
      (!storedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuItems = [
    { name: "Home", path: "/home" },
    { name: "Explore", path: "/student-explore" },
    { name: "Profile", path: "/student-profile" },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white dark:bg-slate-900 shadow-md w-full z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center space-x-4">
            <button onClick={toggleMenu} className="md:hidden">
              <svg
                className="w-8 h-8 text-gray-800 dark:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>

            {/* Logo */}
            <div>
              <img
                src="/assets/images/lightLogo.svg"
                className="block max-w-[50px] dark:hidden w-full h-auto"
                alt="Logo"
              />
              <img
                src="/assets/images/darkLogo.svg"
                className="hidden dark:block w-full h-auto max-w-[50px]"
                alt="Logo"
              />
            </div>
          </div>

          {/* Desktop navigation + profile */}
          <div className="hidden md:flex items-center space-x-6">
            <ul className="flex items-center space-x-6">
              {menuItems.map((item) => (
                <li
                  key={item.name}
                  onClick={() => handleNavigate(item.path)}
                  className={`cursor-pointer font-medium hover:underline ${
                    location.pathname === item.path
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {item.name}
                </li>
              ))}
            </ul>

            {/* Profile image */}
            {photoURL && (
              <img
                onClick={() => navigate("/student-profile")}
                src={photoURL}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500 cursor-pointer"
              />
            )}

            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded ml-4"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m8.66-9H21m-18 0H3
                      m15.36-6.36l-.71.71M6.34 17.66l-.71.71
                      m12.72 0l-.71-.71M6.34 6.34l-.71-.71
                      M12 7a5 5 0 100 10 5 5 0 000-10z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                >
                  <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu omitted for brevity (can add profile image same way as desktop) */}
    </>
  );
}
