import React from "react";
import { Link } from "react-router-dom";
import "@/styles/global.css";
import "./not-found.css"; // Component-specific styles

function NotFound() {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="primary-button">Go Home</Link>
    </div>
  );
}

export default NotFound;