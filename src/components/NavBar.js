import { useEffect, useState } from "react";

export function NavBar() {
  const [theme, setTheme] = useState("light");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");

    if (
      storedTheme === "dark" ||
      (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="bg-white dark:bg-slate-900 shadow-md w-full z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Hamburger button for mobile */}
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

          {/* Desktop navigation */}
          <ul className="hidden md:flex space-x-4 mx-2">
            <li className="hover:underline cursor-pointer dark:text-gray-200">
              Home
            </li>
            <li className="hover:underline cursor-pointer dark:text-gray-200">
              About
            </li>
            <li className="hover:underline cursor-pointer dark:text-gray-200">
              Contact
            </li>
          </ul>

          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded"
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
      </nav>

      {/* Sliding mobile menu */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 shadow-lg z-50
          transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Close button */}
        <button
          onClick={toggleMenu}
          className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 text-2xl"
          aria-label="Close menu"
        >
          &times;
        </button>

        {/* Menu Items */}
        <ul className="px-6 pt-16 space-y-6 text-lg">
          <li
            className="hover:underline cursor-pointer dark:text-gray-200"
            onClick={toggleMenu}
          >
            Home
          </li>
          <li
            className="hover:underline cursor-pointer dark:text-gray-200"
            onClick={toggleMenu}
          >
            About
          </li>
          <li
            className="hover:underline cursor-pointer dark:text-gray-200"
            onClick={toggleMenu}
          >
            Contact
          </li>
        </ul>
      </div>

      {/* Optional overlay when menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-25 z-40"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}
