import { useState, useEffect } from 'react';

export default function NavBar() {
  const [theme, setTheme] = useState('light');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
  <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
    <div className="text-2xl font-bold text-gray-900 dark:text-white">DIU Events</div>

    {/* Desktop menu */}
    <ul className="hidden md:flex space-x-6 text-gray-800 dark:text-gray-200 font-medium">
      <li className="hover:text-blue-500 cursor-pointer">Home</li>
      <li className="hover:text-blue-500 cursor-pointer">Events</li>
      <li className="hover:text-blue-500 cursor-pointer">About</li>
      <li className="hover:text-blue-500 cursor-pointer">Contact</li>
    </ul>

    <div className="flex items-center space-x-4">
      {/* Theme toggle button - always visible */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        aria-label="Toggle Dark Mode"
      >
        {theme === 'dark' ? (
          /* Sun icon */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m8.66-9H21m-18 0H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z"
            />
          </svg>
        ) : (
          /* Moon icon */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            stroke="none"
          >
            <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
          </svg>
        )}
      </button>

      {/* Mobile menu button - only visible on small screens */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="p-2 rounded-md text-gray-800 dark:text-gray-200 focus:outline-none"
          aria-label="Toggle menu"
        >
          {!menuOpen ? (
            /* Hamburger icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          ) : (
            /* Close icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  </div>

  {/* Mobile menu */}
  {menuOpen && (
    <ul className="md:hidden px-4 pb-4 space-y-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-medium">
      <li className="hover:text-blue-500 cursor-pointer">Home</li>
      <li className="hover:text-blue-500 cursor-pointer">Events</li>
      <li className="hover:text-blue-500 cursor-pointer">About</li>
      <li className="hover:text-blue-500 cursor-pointer">Contact</li>
    </ul>
  )}
</nav>

  );
}
