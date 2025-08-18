import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export default function FeaturedClubs() {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("role", "==", "club"));
        const snapshot = await getDocs(q);
        const clubsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched clubs:", clubsData); // debug
        setClubs(clubsData);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };
    fetchClubs();
  }, []);

  const handleJoin = (clubId) => {
    alert(`Join club with ID: ${clubId}`);
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-20 py-6">
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4">
        Featured Clubs
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {clubs.map((club) => (
          <div
            key={club.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
          >
            <img
              src={club.logoUrl || "/assets/images/defaultClub.png"}
              alt={club.name}
              className="w-24 h-24 rounded-full mb-3 object-cover"
            />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {club.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {club.description?.slice(0, 60)}...
            </p>
            <button
              onClick={() => handleJoin(club.id)}
              className="mt-3 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition"
            >
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
