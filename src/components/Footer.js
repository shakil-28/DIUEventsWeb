// src/components/Footer.js
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo & Description */}
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold mb-1">DIU Events</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Explore, join, and connect with clubs at Daffodil International
              University.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex space-x-6">
            <a href="/home" className="hover:text-indigo-500 transition">
              Home
            </a>
            <a
              href="/student-explore"
              className="hover:text-indigo-500 transition"
            >
              Explore
            </a>
            <a
              href="/student-profile"
              className="hover:text-indigo-500 transition"
            >
              Profile
            </a>
            <a
              href="#featured-clubs"
              className="hover:text-indigo-500 transition"
            >
              Clubs
            </a>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-6 border-t border-gray-300 dark:border-gray-700 pt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} DIU Clubs. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
