// src/pages/MembersManagement.js
import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaTrash, FaSearch } from "react-icons/fa";
import ClubNavBar from "../components/ClubNavBar";
import { db, auth } from "../firebase/config";
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";

export default function ClubMembersManagement() {
  const [activeTab, setActiveTab] = useState("members");
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const clubUid = auth.currentUser.uid; // currently logged-in club

  // Fetch members and pending requests
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);

        // Get club document
        const clubRef = doc(db, "users", clubUid);
        const clubSnap = await getDoc(clubRef);

        if (!clubSnap.exists()) {
          console.error("Club not found");
          return;
        }

        const clubData = clubSnap.data();
        const memberIds = clubData.members || [];
        const pendingIds = clubData.memberRequests || [];

        // Fetch member user documents
        const membersPromises = memberIds.map((uid) =>
          getDoc(doc(db, "users", uid))
        );
        const membersSnaps = await Promise.all(membersPromises);
        const membersData = membersSnaps
          .filter((snap) => snap.exists())
          .map((snap) => ({ uid: snap.id, ...snap.data() }));

        // Fetch pending request user documents
        const pendingPromises = pendingIds.map((uid) =>
          getDoc(doc(db, "users", uid))
        );
        const pendingSnaps = await Promise.all(pendingPromises);
        const pendingData = pendingSnaps
          .filter((snap) => snap.exists())
          .map((snap) => ({ uid: snap.id, ...snap.data() }));

        setMembers(membersData);
        setPendingRequests(pendingData);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [clubUid]);

  const handleRemove = async (memberUid) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      // Remove club UID from student's selectedClubs
      const studentRef = doc(db, "users", memberUid);
      await updateDoc(studentRef, {
        selectedClubs: arrayRemove(clubUid),
      });

      // Remove student UID from club's members array
      const clubRef = doc(db, "users", clubUid);
      await updateDoc(clubRef, {
        members: arrayRemove(memberUid),
      });

      // Update local state
      setMembers((prev) => prev.filter((m) => m.uid !== memberUid));
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  const handleApprove = async (pendingUid) => {
    try {
      const clubRef = doc(db, "users", clubUid);
      const studentRef = doc(db, "users", pendingUid);

      // Remove from memberRequests and add to members
      await updateDoc(clubRef, {
        memberRequests: arrayRemove(pendingUid),
        members: arrayUnion(pendingUid),
      });

      // Add club UID to student's selectedClubs
      await updateDoc(studentRef, {
        selectedClubs: arrayUnion(clubUid),
      });

      // Fetch student data once
      const studentSnap = await getDoc(studentRef);
      const studentData = studentSnap.data() || {};

      // Update local state
      setPendingRequests((prev) => prev.filter((p) => p.uid !== pendingUid));
      setMembers((prev) => [...prev, { uid: pendingUid, ...studentData }]);
    } catch (error) {
      console.error("Error approving member:", error);
    }
  };

  const handleReject = async (pendingUid) => {
    try {
      const clubRef = doc(db, "users", clubUid);
      const studentRef = doc(db, "users", pendingUid);

      // Remove from club's memberRequests
      await updateDoc(clubRef, {
        memberRequests: arrayRemove(pendingUid),
      });

      // Remove club UID from student's selectedClubs
      await updateDoc(studentRef, {
        selectedClubs: arrayRemove(clubUid),
      });

      // Update local state
      setPendingRequests((prev) => prev.filter((p) => p.uid !== pendingUid));
    } catch (error) {
      console.error("Error rejecting member:", error);
    }
  };

  const filteredUsers = (
    activeTab === "members" ? members : pendingRequests
  ).filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p className="text-center py-16">Loading members...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Navbar */}
      <ClubNavBar />

      <h1 className="text-3xl font-bold text-indigo-700 mb-6 mt-4 text-center">
        Members Management
      </h1>

      {/* Tabs */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setActiveTab("members")}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
            activeTab === "members"
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-white shadow hover:bg-indigo-100"
          }`}
        >
          Members List
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
            activeTab === "pending"
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-white shadow hover:bg-indigo-100"
          }`}
        >
          Pending Requests
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center bg-white rounded-full shadow px-4 py-2 w-full max-w-md">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="flex-grow outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.uid}
              className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition transform hover:scale-105 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-indigo-700 mb-1">
                  {user.fullName}
                </h2>
                <p className="text-gray-600 mb-1">{user.email}</p>
              </div>

              <div className="flex justify-between mt-4 gap-2">
                {activeTab === "pending" ? (
                  <>
                    <button
                      onClick={() => handleApprove(user.uid)}
                      className="flex-1 bg-green-500 text-white px-3 py-2 rounded-xl hover:bg-green-600 transition flex items-center justify-center"
                    >
                      <FaCheck className="mr-1" /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(user.uid)}
                      className="flex-1 bg-red-500 text-white px-3 py-2 rounded-xl hover:bg-red-600 transition flex items-center justify-center"
                    >
                      <FaTimes className="mr-1" /> Reject
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleRemove(user.uid)}
                    className="flex-1 bg-gray-400 text-white px-3 py-2 rounded-xl hover:bg-gray-500 transition flex items-center justify-center"
                  >
                    <FaTrash className="mr-1" /> Remove
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No users found.
          </p>
        )}
      </div>
    </div>
  );
}
