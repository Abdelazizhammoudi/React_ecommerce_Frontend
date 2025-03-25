import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const AdminRoute = () => {
  const { admin, loading } = useAuth();
  const location = useLocation();
  const [isVerified, setIsVerified] = useState(false);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!loading && token && admin?.isAdmin) {
      setIsVerified(true);
    }
  }, [loading, admin, token]);

  console.log('Final verification state:', {
    verified: isVerified,
    loading,
    token: !!token,
    isAdmin: admin?.isAdmin
  });

  if (loading) {
    return <div className="admin-loading">Verifying permissions...</div>;
  }

  if (!isVerified) {
    return (
      <Navigate
        to="/unauthorized"
        state={{
          from: location,
          reason: !token ? 'Missing authentication token' : 'Admin privileges required'
        }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default AdminRoute;