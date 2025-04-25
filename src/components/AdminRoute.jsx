import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

const TOKEN_KEY = 'adminToken';

const AdminRoute = () => {
  const { admin, loading } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem(TOKEN_KEY);
  const { t } = useTranslation();

  // Log debug information
  console.log('AdminRoute Debug:', {
    loading,
    token: !!token,
    isAdmin: admin?.isAdmin,
  });

  if (loading) {
    return <div className="admin-loading">{t('admin.route.verifying')}</div>;
  }

  if (!token || !admin?.isAdmin) {
    return (
      <Navigate
        to="/unauthorized"
        state={{
          from: location,
          reason: !token ? t('admin.route.missingToken') : t('admin.route.adminRequired'),
        }}
        replace
      />
    );
  } else {
    return <Outlet />;
  }
};

export default AdminRoute;