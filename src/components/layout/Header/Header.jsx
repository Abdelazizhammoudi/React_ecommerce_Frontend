import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // Import useAuth hook
import "@/styles/global.css";
import "./header.css";
import logo from "@/assets/logo.jpg"; // Import logo image

import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../LanguageSwitcher/LanguageSwitcher';

function Header() {
  const { admin, logout } = useAuth(); // Get admin status and logout function
  const navigate = useNavigate();
  
  const { t } = useTranslation(); // Initialize translation function

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
        alt={t('nav.logoAlt')}
        className="logo-image"
      />
    </div>
    <ul className="nav-links">
      <li>
        <Link to="/" className="nav-link">{t('nav.home')}</Link>
      </li>
     
      {admin && (
      <>
          <li>
            <Link to="/admin/dashboard" className="nav-link">{t('nav.dashboard')}</Link>
          </li>
          <li>
            <Link to="/addProduct" className="nav-link">{t('nav.addProduct')}</Link>
          </li>
          <li>
            <button className="logout-button" onClick={handleLogout}>
              {t('nav.logout')}
            </button>
          </li>
        </>
      )}
    </ul>
    <LanguageSwitcher />
  </nav>
);
}

export default Header;