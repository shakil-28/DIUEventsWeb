// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // If no user, redirect to login
    return <Navigate to="/login" replace />;
  }

  // If logged in, render children components
  return children;
}
