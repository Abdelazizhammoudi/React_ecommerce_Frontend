import React from 'react';
import { useLocation } from 'react-router-dom';

const Unauthorized = () => {
  const location = useLocation();
  const { from, reason } = location.state || {};

  return (
    <div className="unauthorized-container">
      <h1>403 - Access Denied</h1>
      <p>
        {reason || 'You do not have permission to access this page.'}
      </p>
      {from && (
        <p>
          Attempted to access: <code>{from.pathname}</code>
        </p>
      )}
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