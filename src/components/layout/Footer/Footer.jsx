import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "@/styles/global.css";
import "./footer.css";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <p>{t('footer.rights')}</p>
      <p>{t('footer.madeBy')}</p>
      <p>
        <Link to="/admin/login" className="admin-login-link">
          {t('footer.admin')}
        </Link>
      </p>
    </footer>
  );
}

export default Footer;