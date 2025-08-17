import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, forRegister = false, requiredRole }) {
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
          setAllowed(!docSnapshot.exists());
        } else {
          if (!docSnapshot.exists()) {
            setAllowed(false);
          } else if (requiredRole) {
            setAllowed(docSnapshot.data().role === requiredRole);
          } else {
            setAllowed(true);
          }
        }
      } catch (error) {
        console.error("Error checking access:", error);
        setAllowed(false);
      } finally {
        setCheckingAccess(false);
      }
    };

    checkAccess();
  }, [user, forRegister, requiredRole]);

  if (authLoading || checkingAccess) return <div className="text-center mt-10">Checking access...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowed) return <Navigate to={forRegister ? "/home" : "/home"} replace />;

  return children;
}
