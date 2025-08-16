// ProtectedRoute.js
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function ProtectedRoute({ children, forRegister = false }) {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const docSnapshot = await getDoc(doc(db, "students", user.uid));

        if (forRegister) {
          // Only allow if user logged in but has NO Firestore data
          if (!docSnapshot.exists()) {
            setAllowed(true);
          } else {
            setAllowed(false);
          }
        } else {
          // Normal protected page: allow if user has Firestore data
          if (docSnapshot.exists()) {
            setAllowed(true);
          } else {
            setAllowed(false);
          }
        }
      } catch (error) {
        console.error("Error checking access:", error);
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, forRegister]);

  if (authLoading || loading) return <div className="text-center mt-10">Checking access...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (!allowed) {
    // If forRegister, redirect to home (already registered)
    // Else redirect to register (needs registration)
    return <Navigate to={forRegister ? "/home" : "/register"} replace />;
  }

  return children;
}
