import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Unauthorized.css';

const Unauthorized = () => {
  const location = useLocation();
  const { from, reason } = location.state || {};
  const { t } = useTranslation();

  return (
    <div className="unauthorized-container">
      <h1>{t('unauthorized.title')}</h1>
      <p>
        {reason || t('unauthorized.defaultMessage')}
      </p>
      {from && (
        <p>
          {t('unauthorized.attemptedAccess')} <code>{from.pathname}</code>
        </p>
      )}
      <p>{t('unauthorized.contactAdmin')}</p>
      <div className="action-buttons">
        <a href="/admin/login" className="login-link">
          {t('unauthorized.loginButton')}
        </a>
        <a href="/" className="home-link">
          {t('unauthorized.homeButton')}
        </a>
      </div>
    </div>
  );
};

export default Unauthorized;