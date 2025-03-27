import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "@/styles/global.css";
import "./footer.css"; // Component-specific styles

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2025 My Shop. All rights reserved.</p>
      <p>Made with ❤️ by Abdelaziz HAMMOUDI</p>
      <p>
        <Link to="/admin/login" className="admin-login-link">
          Admin
        </Link>
      </p>
    </footer>
  );
}

export default Footer;