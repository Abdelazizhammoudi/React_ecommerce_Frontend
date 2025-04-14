import React from 'react';
import { useLocation } from 'react-router-dom';
import './Unauthorized.css';

const Unauthorized = () => {
  const location = useLocation();
  const { from, reason } = location.state || {};

  return (
    <div className="unauthorized-container">
      <h1>403 - تم رفض الوصول</h1>
      <p>
        {reason || 'You do not have the necessary permissions to view this page.'}
      </p>
      {from && (
        <p>
          لقد حاولت الوصول : <code>{from.pathname}</code>
        </p>
      )}
      <p>
      إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع المسؤول أو محاولة تسجيل الدخول مرة أخرى.
      </p>
      <div className="action-buttons">
        <a href="/admin/login" className="login-link">
        تسجيل الدخول
        </a>
        <a href="/" className="home-link">
        الرجوع إلى الصفحة الرئيسية
        </a>
      </div>
    </div>
  );
};

export default Unauthorized;