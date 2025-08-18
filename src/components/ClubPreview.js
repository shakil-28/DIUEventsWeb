import React, { useEffect, useState } from "react";
import { FaUsers, FaPlus } from "react-icons/fa";
import { db, auth } from "../firebase/config"; // Make sure auth is imported
import { collection, doc, getDoc, getDocs, updateDoc, arrayUnion } from "firebase/firestore";

export default function ClubsPreview() {
  const [clubs, setClubs] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;

      try {
        setLoading(true);
        const studentUid = auth.currentUser.uid;

        // Fetch student document
        const studentRef = doc(db, "users", studentUid);
        const studentSnap = await getDoc(studentRef);
        if (studentSnap.exists()) {
          setStudentData(studentSnap.data());
        } else {
          console.error("Student not found!");
        }

        // Fetch all club documents
        const usersSnapshot = await getDocs(collection(db, "users"));
        const clubsData = usersSnapshot.docs
          .map((doc) => ({ uid: doc.id, ...doc.data() }))
          .filter((user) => user.role === "club"); // only clubs
        setClubs(clubsData);
      } catch (error) {
        console.error("Error fetching clubs or student:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleJoin = async (clubUid) => {
    if (!studentData || !auth.currentUser) return;

    try {
      const studentUid = auth.currentUser.uid;

      // Update student's selectedClubs
      const studentRef = doc(db, "users", studentUid);
      await updateDoc(studentRef, {
        selectedClubs: arrayUnion(clubUid),
      });

      // Update club's memberRequests
      const clubRef = doc(db, "users", clubUid);
      await updateDoc(clubRef, {
        memberRequests: arrayUnion(studentUid),
      });

      // Update local state for UI
      setStudentData((prev) => ({
        ...prev,
        selectedClubs: [...(prev.selectedClubs || []), clubUid],
      }));
    } catch (error) {
      console.error("Error joining club:", error);
    }
  };

  const getClubStatus = (club) => {
    if (!studentData || !auth.currentUser) return "join";

    const studentUid = auth.currentUser.uid;
    if (club.members?.includes(studentUid)) return "joined";
    if (club.memberRequests?.includes(studentUid)) return "pending";
    return "join";
  };

  if (loading) {
    return <p className="text-center py-16">Loading clubs...</p>;
  }

  return (
    <section className="bg-gray-100 dark:bg-slate-900 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-10 text-center">
          Popular Clubs
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {clubs.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">
              No clubs available.
            </p>
          )}

          {clubs.map((club) => {
            const status = getClubStatus(club);

            return (
              <div
                key={club.uid}
                className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl shadow-lg p-6 hover:shadow-2xl hover:scale-105 transition transform duration-300"
              >
                {/* Club Logo */}
                <div className="w-16 h-16 rounded-full bg-indigo-200 dark:bg-indigo-700 flex items-center justify-center mb-4 overflow-hidden">
                  <img
                    src={club.logoUrl}
                    alt={club.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                  {club.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  {club.description}
                </p>

                <p className="text-gray-400 text-sm flex items-center mb-4">
                  <FaUsers className="mr-1" /> {club.members?.length || 0} Members
                </p>

                {/* Status Button */}
                {status === "joined" ? (
                  <button className="w-full px-4 py-2 rounded-full font-semibold bg-green-500 text-white cursor-default">
                    Joined
                  </button>
                ) : status === "pending" ? (
                  <button className="w-full px-4 py-2 rounded-full font-semibold bg-yellow-400 text-white cursor-default">
                    Pending
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoin(club.uid)}
                    className="w-full px-4 py-2 rounded-full font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white transition"
                  >
                    <FaPlus className="mr-2 inline" /> Join
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
