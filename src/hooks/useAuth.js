import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/auth";

// Create the context
const AuthContext = createContext();

// AuthProvider: Wrap your app with this in main.jsx/index.js
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores the logged-in user
  const [loading, setLoading] = useState(true); // Prevents premature UI rendering

  useEffect(() => {
    // Start listening to Firebase auth changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      setLoading(false); // Done checking
    });

    // Stop listening when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {!loading && children} {/* Only render app when auth check is complete */}
    </AuthContext.Provider>
  );
};

// useAuth() hook to access user from context
export const useAuth = () => {
  return useContext(AuthContext);
};
