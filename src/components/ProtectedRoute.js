// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user } = useAuth();

  if (!user) {
    // If no user, redirect to login
    return <Navigate to="/login" replace />;
  }

  try {

  } catch (error) {
    
  }

  

  // If logged in, render children components
  return children;
}
