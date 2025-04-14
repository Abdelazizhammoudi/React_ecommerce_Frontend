import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // Import useAuth hook
import "@/styles/global.css";
import "./header.css";
import logo from "@/assets/logo.jpg"; // Import logo image

function Header() {
  const { admin, logout } = useAuth(); // Get admin status and logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call the logout function to clear the token and reset admin state
    setTimeout(() => {
      navigate("/"); // Redirect to the home page after logout
    }, 0); // Use a timeout to ensure redirection happens after state updates
  };

  return (
    <nav className="header">
      <div className="logo">
        <img
          src={logo}
          alt="logo"
          className="logo-image"
        />
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-link">الصفحة الرئيسية</Link>
        </li>
       
        {admin && ( // Show the Logout button only if the user is logged in
        <>
            <li>
              <Link to="/admin/dashboard" className="nav-link">لوحة التحكم</Link>
            </li>
            <li>
              <Link to="/addProduct" className="nav-link">إضافة منتج</Link>
            </li>
            <li>
              <button className="logout-button" onClick={handleLogout}>
              تسجيل الخروج
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Header;