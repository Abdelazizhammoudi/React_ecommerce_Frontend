import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "@/styles/global.css";
import "./not-found.css";

function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="not-found-container">
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.message')}</p>
      <Link to="/" className="primary-button">
        {t('notFound.goHome')}
      </Link>
    </div>
  );
}

export default NotFound;