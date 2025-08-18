// src/pages/EventDetailsPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../hooks/useAuth";
import { FaCheck, FaUserPlus } from "react-icons/fa";
import { NavBar } from "../components/NavBar";

export default function EventDetailsPage() {
  const { eventId } = useParams(); // Event document UID from URL
  const { user } = useAuth();
  const [eventData, setEventData] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId || !user) return;
      try {
        const eventRef = doc(db, "events", eventId);
        const eventSnap = await getDoc(eventRef);
        if (eventSnap.exists()) {
          const data = eventSnap.data();
          setEventData(data);
          setIsJoined(data.interestedUsers?.includes(user.uid) || false);
          setLiked(data.lovedUsers?.includes(user.uid) || false);
          setLikeCount(data.reactCount || 0);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId, user]);

  const handleJoinToggle = async () => {
    if (!user) return;
    const eventRef = doc(db, "events", eventId);
    try {
      if (isJoined) {
        await updateDoc(eventRef, { interestedUsers: arrayRemove(user.uid) });
      } else {
        await updateDoc(eventRef, { interestedUsers: arrayUnion(user.uid) });
      }
      setIsJoined(!isJoined);
    } catch (error) {
      console.error("Error updating join status:", error);
    }
  };

  const handleLikeToggle = async () => {
    if (!user) return;
    const eventRef = doc(db, "events", eventId);
    try {
      if (liked) {
        await updateDoc(eventRef, {
          lovedUsers: arrayRemove(user.uid),
          reactCount: likeCount > 0 ? likeCount - 1 : 0,
        });
        setLikeCount((prev) => (prev > 0 ? prev - 1 : 0));
      } else {
        await updateDoc(eventRef, {
          lovedUsers: arrayUnion(user.uid),
          reactCount: likeCount + 1,
        });
        setLikeCount((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading event...</p>;
  if (!eventData) return <p className="text-center mt-10">Event not found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-0 py-0 relative">
      <NavBar />
      {/* Event Banner */}
      <div className="relative w-full h-64 sm:h-80 lg:h-[400px] rounded-xl overflow-hidden shadow-lg mt-4 sm:mt-6 lg:mt-8 px-4 sm:px-6">
        <img
          src={eventData.imageUrl}
          alt={eventData.title}
          className="object-cover object-center w-full h-full rounded-xl"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {eventData.title}
          </h2>
          <p className="text-gray-300 text-sm">
            {new Date(eventData.startingTime.seconds * 1000).toLocaleString()}
          </p>
        </div>

        {/* Love/Like Button */}
        <button
          onClick={handleLikeToggle}
          className={`absolute bottom-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full text-sm shadow-md select-none transition-colors ${
            liked
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-black/70 text-white hover:bg-red-500"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            stroke="none"
            className={`w-4 h-4 ${liked ? "text-white" : "text-red-500"}`}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3 9.24 3 10.91 3.81 12 5.09 13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span>{likeCount}</span>
        </button>
      </div>

      {/* Event Description */}
      <div className="mt-6 px-4 sm:px-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">
          About This Event
        </h3>
        <p className="text-gray-600 leading-relaxed">{eventData.description}</p>
        <div className="mt-4 text-sm text-gray-500">
          <p>
            <strong>📍 Venue:</strong> {eventData.location}
          </p>
          <p>
            <strong>⏰ Start Time:</strong>{" "}
            {new Date(eventData.startingTime.seconds * 1000).toLocaleString()}
          </p>
          <p>
            <strong>⏰ End Time:</strong>{" "}
            {new Date(eventData.endTime.seconds * 1000).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Join Button */}
      <div className="mt-8 flex justify-start px-4 sm:px-6">
        <button
          onClick={handleJoinToggle}
          className="flex items-center gap-3 px-8 py-3 rounded-3xl font-semibold
                   text-white bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-700
                   shadow-lg hover:scale-105 hover:shadow-xl
                   transition-transform duration-300
                   focus:outline-none focus:ring-4 focus:ring-purple-400
                   backdrop-blur-sm bg-white/10"
        >
          {isJoined ? (
            <>
              <FaCheck className="text-green-300" size={20} /> Joined
            </>
          ) : (
            <>
              <FaUserPlus size={20} /> Join Event
            </>
          )}
        </button>
      </div>
    </div>
  );
}
