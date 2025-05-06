import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../LanguageSwitcher/LanguageSwitcher';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import "@/styles/global.css";
import "./header.css";
import logo from "@/assets/logo.jpg";

function Header() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsMobileMenuOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigate("/");
    }, 0);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="header">
      {/* Logo */}
      <Link to="/" className="logo-link">
        <img 
          src={logo} 
          alt={t('nav.logoAlt')} 
          className="logo-image"
          loading="lazy" 
        />
      </Link>
      <>
            <Link to="/" className="nav-link">
              <HomeIcon />
              {t('nav.home')}
            </Link>
      </>

      {/* Desktop Navigation */}
      <div className="desktop-controls">
        <ul className="nav-links">
          
          {admin && (
            <>
              <li>
                <Link to="/admin/dashboard" className="nav-link">
                  <DashboardIcon />
                  {t('nav.dashboard')}
                </Link>
              </li>
              <li>
                <Link to="/addProduct" className="nav-link">
                  <AddCircleIcon />
                  {t('nav.addProduct')}
                </Link>
              </li>
              <li>
                <button className="logout-button" onClick={handleLogout}>
                  <ExitToAppIcon />
                  {t('nav.logout')}
                </button>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={t(isMobileMenuOpen ? 'nav.closeMenu' : 'nav.openMenu')}
      >
        {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <ul className="mobile-nav-links">
          <li>
            <Link to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              <HomeIcon />
              {t('nav.home')}
            </Link>
          </li>
          
          {admin && (
            <>
              <li>
                <Link to="/admin/dashboard" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <DashboardIcon />
                  {t('nav.dashboard')}
                </Link>
              </li>
              <li>
                <Link to="/addProduct" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <AddCircleIcon />
                  {t('nav.addProduct')}
                </Link>
              </li>
              <li>
                <button className="mobile-logout-button" onClick={handleLogout}>
                  <ExitToAppIcon />
                  {t('nav.logout')}
                </button>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
        role="presentation"
      />
      <div className="mobile-language-switcher"> 
            <LanguageSwitcher />
      </div>      
    </nav>
  );
}

export default Header;