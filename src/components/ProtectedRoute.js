// ProtectedRoute.js
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function ProtectedRoute({ children, forRegister = false }) {
  const { user, loading: authLoading } = useAuth();
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setAllowed(false);
        setCheckingAccess(false);
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnapshot = await getDoc(docRef);

        if (forRegister) {
          // Allow if user is logged in BUT has no Firestore record
          setAllowed(!docSnapshot.exists());
        } else {
          // Allow if user has Firestore record
          setAllowed(docSnapshot.exists());
        }
      } catch (error) {
        console.error("Error checking access:", error);
        setAllowed(false);
      } finally {
        setCheckingAccess(false);
      }
    };

    checkAccess();
  }, [user, forRegister]);

  // Show loader while Firebase/Auth is still checking
  if (authLoading || checkingAccess) {
    return <div className="text-center mt-10">Checking access...</div>;
  }

  // If not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // If not allowed → redirect based on route type
  if (!allowed) {
    return <Navigate to={forRegister ? "/home" : "/register"} replace />;
  }

  // Otherwise, render child routes
  return children;
}
