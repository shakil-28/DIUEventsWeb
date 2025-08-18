import React from "react";

export default function HeroSection() {
  return (
    <section className="relative bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24 flex flex-col lg:flex-row items-center justify-between">
        {/* Text Content */}
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Discover & Join Campus Events
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300">
            Stay updated with the latest workshops, club activities, and events
            happening around you. Connect, learn, and have fun!
          </p>
          <div className="flex space-x-4">
            <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-500 transition">
              Explore Events
            </button>
            <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition">
              Join a Club
            </button>
          </div>
        </div>

        {/* Image / Illustration */}
        <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80"
            alt="Campus Events"
            className="rounded-2xl shadow-2xl max-w-full lg:max-w-lg"
          />
        </div>
      </div>
    </section>
  );
}
