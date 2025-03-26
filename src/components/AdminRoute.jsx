import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const TOKEN_KEY = 'adminToken'; // Define the key in a central place
const AdminRoute = () => {
  const { admin, loading } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem(TOKEN_KEY);

  // Log debug information
  console.log('AdminRoute Debug:', {
    loading,
    token: !!token,
    isAdmin: admin?.isAdmin,
  });

  if (loading) {
    return <div className="admin-loading">Verifying permissions...</div>;
  }

  if (!token || !admin?.isAdmin) {
    return (
      <Navigate
        to="/unauthorized"
        state={{
          from: location,
          reason: !token ? 'Missing authentication token' : 'Admin privileges required',
        }}
        replace
      />
    );
  } else {
    return  <Outlet/>;
      // <Navigate to="/admin/dashboard" replace />
       
  }

};

export default AdminRoute;