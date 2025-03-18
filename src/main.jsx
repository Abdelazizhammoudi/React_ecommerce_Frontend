import React from "react";
import { createRoot } from "react-dom/client";
import App from "@/app/App"; // Correct import path
import "@/styles/global.css"; // Global styles

// Create root and render the app
const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);