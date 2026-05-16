import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  console.log("🔐 ProtectedRoute check - Token exists:", !!token);

  // If no token, redirect to auth
  if (!token) {
    console.log("❌ No token - redirecting to /auth");
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  try {
    // Basic token validation - parse JWT payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log("🔍 Token payload:", payload);
    
    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (payload.exp && payload.exp < currentTime) {
      console.log("❌ Token expired");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return <Navigate to="/auth" replace state={{ from: location }} />;
    }
    
    // Check role if required
    if (requiredRole && payload.role !== requiredRole) {
      console.log(`❌ Role mismatch: required ${requiredRole}, user has ${payload.role}`);
      return <Navigate to="/auth" replace state={{ from: location }} />;
    }

    console.log("✅ Access granted");
    return children;
  } catch (err) {
    console.error("❌ Token validation error:", err);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }
}