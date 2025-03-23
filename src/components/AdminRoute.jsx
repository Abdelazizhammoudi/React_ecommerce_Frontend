// components/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const AdminRoute = ({ children }) => {
    const { admin } = useAuth();
    const adminToken = localStorage.getItem('adminToken');

    if (!admin?.isAdmin || !adminToken) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};