import React from 'react';
import { useLocation } from 'react-router-dom';
import './Unauthorized.css';

const Unauthorized = () => {
  const location = useLocation();
  const { from, reason } = location.state || {};

  return (
    <div className="unauthorized-container">
      <h1>403 - Access Denied</h1>
      <p>
        {reason || 'You do not have the necessary permissions to view this page.'}
      </p>
      {from && (
        <p>
          You tried to access: <code>{from.pathname}</code>
        </p>
      )}
      <p>
        If you believe this is a mistake, please contact the administrator or try logging in again.
      </p>
      <div className="action-buttons">
        <a href="/admin/login" className="login-link">
          Go to Login
        </a>
        <a href="/" className="home-link">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default Unauthorized;