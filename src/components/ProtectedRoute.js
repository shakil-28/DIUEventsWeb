// src/components/ProtectedRoute.js
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user } = useAuth();
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [needsRegistration, setNeedsRegistration] = useState(false);

  const checkAccess = async () => {
    if (!user || !requiredRole) {
      setAllowed(false);
      setLoading(false);
      return;
    }

    try {
      const docSnapshot = await getDoc(doc(db, "users", user.uid));

      if (docSnapshot) {
        const userType = docSnapshot.data().userType;
        setAllowed(userType === requiredRole);
      }
      else {
        setNeedsRegistration(true);
      }
    } catch (error) {
      console.error("Error checking userType:", error);
      setAllowed(false);
    }

    finally {
      setLoading(false);
    }

  }

  checkAccess();
}