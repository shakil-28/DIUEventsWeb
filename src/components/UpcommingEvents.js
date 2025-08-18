// src/components/UpcomingEvents.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../hooks/useAuth";
import { FaCheck, FaUserPlus } from "react-icons/fa";

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsRef = collection(db, "events");
        const q = query(
          eventsRef,
          where("approved", "==", true),
          orderBy("startingTime", "asc")
        );
        const snapshot = await getDocs(q);
        const eventsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleJoinToggle = async (eventId, isJoined) => {
    if (!user) return;
    const eventRef = doc(db, "events", eventId);
    try {
      if (isJoined) {
        await updateDoc(eventRef, { interestedUsers: arrayRemove(user.uid) });
      } else {
        await updateDoc(eventRef, { interestedUsers: arrayUnion(user.uid) });
      }

      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === eventId
            ? {
                ...ev,
                interestedUsers: isJoined
                  ? ev.interestedUsers.filter((uid) => uid !== user.uid)
                  : [...(ev.interestedUsers || []), user.uid],
              }
            : ev
        )
      );
    } catch (error) {
      console.error("Error updating join status:", error);
    }
  };

  const handleLikeToggle = async (eventId, isLiked, reactCount) => {
    if (!user) return;
    const eventRef = doc(db, "events", eventId);

    try {
      if (isLiked) {
        await updateDoc(eventRef, {
          lovedUsers: arrayRemove(user.uid),
          reactCount: reactCount > 0 ? reactCount - 1 : 0,
        });
      } else {
        await updateDoc(eventRef, {
          lovedUsers: arrayUnion(user.uid),
          reactCount: reactCount + 1,
        });
      }

      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === eventId
            ? {
                ...ev,
                reactCount: isLiked
                  ? Math.max(ev.reactCount - 1, 0)
                  : ev.reactCount + 1,
                lovedUsers: isLiked
                  ? ev.lovedUsers.filter((uid) => uid !== user.uid)
                  : [...(ev.lovedUsers || []), user.uid],
              }
            : ev
        )
      );
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-20 py-6">
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4">
        Upcoming Events
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center">
            No upcoming events.
          </p>
        )}

        {events.map((event) => {
          const isJoined = event.interestedUsers?.includes(user?.uid);
          const isLiked = event.lovedUsers?.includes(user?.uid);

          return (
            <div
              key={event.id}
              className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md flex flex-col relative"
            >
              {/* Event Image */}
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-48 sm:h-56 md:h-60 object-cover rounded-md mb-4 cursor-pointer"
                onClick={() => navigate(`/event/${event.id}`)}
              />

              {/* Event Info */}
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                {event.title}
              </h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mt-1">
                {event.location}
              </p>
              <p className="py-1 text-xs text-gray-500 dark:text-gray-400">
                {new Date(event.startingTime.seconds * 1000).toLocaleString()}
              </p>

              {/* Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleJoinToggle(event.id, isJoined)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-3xl font-semibold text-white shadow-md transition-colors ${
                    isJoined
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-indigo-500 hover:bg-indigo-600"
                  }`}
                >
                  {isJoined ? <FaCheck /> : <FaUserPlus />}
                  {isJoined ? "Joined" : "Join"}
                </button>

                <button
                  onClick={() =>
                    handleLikeToggle(event.id, isLiked, event.reactCount)
                  }
                  className={`flex items-center gap-1 px-4 py-2 rounded-3xl font-semibold shadow-md transition-colors ${
                    isLiked
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-red-100 text-red-600 hover:bg-red-500 hover:text-white"
                  }`}
                >
                  ❤️ {event.reactCount || 0}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
