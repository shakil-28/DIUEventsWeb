// src/components/TopEvents.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import {
  collection,
  limit,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query, // <-- FIX: import query
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../hooks/useAuth";

export default function TopEvents() {
  const [events, setEvents] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTopEvents() {
      try {
        const eventRef = collection(db, "events");
        const eventQuery = query(
          eventRef,
          orderBy("reactCount", "desc"),
          limit(5)
        );
        const eventSnapshot = await getDocs(eventQuery);
        const topEvents = eventSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((ev) => ev.status !== "pending"); // <-- filter out pending events
        setEvents(topEvents);
      } catch (error) {
        console.log(error);
      }
    }
    fetchTopEvents();
  }, []);

  const handleLikeToggle = async (eventId, liked, reactCount) => {
    if (!user) return;

    const eventRef = doc(db, "events", eventId);

    try {
      if (liked) {
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
                reactCount: liked
                  ? Math.max(ev.reactCount - 1, 0)
                  : ev.reactCount + 1,
                lovedUsers: liked
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
    <div className="px-4 sm:px-6 md:px-10 lg:px-20 py-3">
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2 text-left">
        Top Events
      </h3>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop={events.length >= 2}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="relative"
      >
        {events.map((event) => {
          const isLiked = event.lovedUsers?.includes(user?.uid);
          return (
            <SwiperSlide key={event.id}>
              <div className="bg-slate-100 dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md text-center h-full flex flex-col relative">
                {/* Event Image */}
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-48 sm:h-56 md:h-60 lg:h-64 object-cover rounded-md mb-4 cursor-pointer"
                  onClick={() => navigate(`/event/${event.id}`)}
                />

                {/* Event Info */}
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                  {event.title}
                </h3>
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mt-2">
                  {event.location}
                </p>
                <p className="py-2 text-xs text-gray-500 dark:text-gray-400">
                  {new Date(event.startingTime.seconds * 1000).toLocaleString()}
                </p>

                {/* Like Button */}
                <button
                  onClick={() =>
                    handleLikeToggle(event.id, isLiked, event.reactCount)
                  }
                  className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-colors ${
                    isLiked
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-red-100 text-red-600 hover:bg-red-500 hover:text-white"
                  }`}
                >
                  ❤️ {event.reactCount || 0}
                </button>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
