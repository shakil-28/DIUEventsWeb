import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user } = useAuth();
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [needsRegistration, setNeedsRegistration] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const docSnapshot = await getDoc(doc(db, "users", user.uid));

        if (docSnapshot.exists()) {
          const userType = docSnapshot.data().role;
          console.log(userType);

          // If no specific role is required, allow all authenticated users
          if (!requiredRole || userType === requiredRole) {
            setAllowed(true);
          } else {
            setAllowed(false);
          }
        } else {
          setNeedsRegistration(true);
        }
      } catch (error) {
        console.error("Error checking userType:", error);
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, requiredRole]);

  // Redirects
  if (!user) return <Navigate to="/login" replace />;
  if (loading) return <div className="text-center mt-10">Checking permission...</div>;
  if (needsRegistration) return <Navigate to="/register" replace />;
  if (!allowed) return <Navigate to="/home" replace />;

  return children;
}
