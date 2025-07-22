import React, { useState } from "react";
import { FaCheck, FaUserPlus } from "react-icons/fa";

export default function EventDetailsPage() {
  const [isJoined, setIsJoined] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const eventData = {
    title: "DIU Annual Tech Carnival 2025",
    date: "August 25, 2025",
    imageUrl: "https://i.ytimg.com/vi/gCaFQXBWiC0/maxresdefault.jpg",
    description:
      "Join us at DIU’s most exciting event of the year! Experience cutting-edge technology, workshops, and keynote speakers from around the globe. Network with professionals, students, and innovators!",
    venue: "Daffodil International University Auditorium",
    time: "10:00 AM - 4:00 PM",
  };

  const handleJoinToggle = () => {
    setIsJoined((prev) => !prev);
  };

  const handleLikeToggle = () => {
    if (liked) {
      setLikeCount((count) => (count > 0 ? count - 1 : 0));
    } else {
      setLikeCount((count) => count + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 sm:py-10 relative">
      {/* Event Banner */}
      <div className="relative w-full h-64 sm:h-80 lg:h-[400px] rounded-xl overflow-hidden shadow-lg">
        <img
          src={eventData.imageUrl}
          alt={eventData.title}
          className="object-cover object-center w-full h-full"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {eventData.title}
          </h2>
          <p className="text-gray-300 text-sm">{eventData.date}</p>
        </div>

        {/* Like count badge inside image - bottom right */}
        <div className="absolute bottom-4 right-4 text-white text-sm bg-black/70 px-3 py-1 rounded-full flex items-center gap-1 select-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            stroke="none"
            className="w-4 h-4 text-red-500"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3 9.24 3 10.91 3.81 12 5.09 13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span>{likeCount}</span>
        </div>
      </div>

      {/* Event Description */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">
          About This Event
        </h3>
        <p className="text-gray-600 leading-relaxed">{eventData.description}</p>
        <div className="mt-4 text-sm text-gray-500">
          <p>
            <strong>📍 Venue:</strong> {eventData.venue}
          </p>
          <p>
            <strong>⏰ Time:</strong> {eventData.time}
          </p>
        </div>
      </div>

      {/* Join Button - Glassmorphism style, left aligned */}
      <div className="mt-8 flex justify-start">
        <button
          onClick={handleJoinToggle}
          className={`
            flex items-center gap-3 px-8 py-3 rounded-3xl font-semibold
            text-white
            bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-700
            shadow-lg
            hover:scale-105 hover:shadow-xl
            transition-transform duration-300
            focus:outline-none focus:ring-4 focus:ring-purple-400
            backdrop-blur-sm bg-white/10
          `}
        >
          {isJoined ? (
            <>
              <FaCheck className="text-green-300" size={20} />
              Joined
            </>
          ) : (
            <>
              <FaUserPlus size={20} />
              Join Event
            </>
          )}
        </button>
      </div>

      {/* Floating Love Button */}
      <button
        onClick={handleLikeToggle}
        className={`
    fixed bottom-6 right-6
    p-4 rounded-full shadow-xl
    transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-red-400
    z-50
    ${
      liked
        ? "bg-red-600 text-white hover:bg-red-700"
        : "bg-red-100 text-red-600 hover:bg-red-500 hover:text-white"
    }
  `}
        aria-label="Toggle Like"
        title="Love this event"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={liked ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
          />
        </svg>
      </button>
    </div>
  );
}
