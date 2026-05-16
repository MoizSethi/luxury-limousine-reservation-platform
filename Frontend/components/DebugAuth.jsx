// src/components/DebugAuth.jsx
import React from "react";
import { useLocation } from "react-router-dom";

export default function DebugAuth() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  
  console.log("🔍 Debug Auth Info:");
  console.log("Current path:", location.pathname);
  console.log("Token exists:", !!token);
  
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("Token payload:", payload);
      console.log("User role:", payload.role);
      console.log("Token expiry:", new Date(payload.exp * 1000).toLocaleString());
      console.log("Current time:", new Date().toLocaleString());
      console.log("Is expired:", payload.exp < Date.now() / 1000);
    } catch (error) {
      console.log("Token decode error:", error.message);
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Authentication Debug Info</h2>
      <pre>
        {JSON.stringify({
          path: location.pathname,
          hasToken: !!token,
          tokenLength: token?.length,
          tokenPayload: token ? JSON.parse(atob(token.split('.')[1])) : null
        }, null, 2)}
      </pre>
      <button onClick={() => window.location.reload()}>Refresh</button>
      <button onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/auth";
      }}>Clear Token & Login Again</button>
    </div>
  );
}