import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/config/constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  //The admin state is initialized from localStorage when the app loads: 
    const [admin, setAdmin] = useState(() => {
    const token = localStorage.getItem('adminToken');
    return token ? { isAdmin: true, verified: true } : null; // Rehydrate admin state if token exists
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getToken = () => localStorage.getItem('adminToken');

  // Validate admin token
  const validateAdmin = async () => {
    const token = getToken();
    console.log('Validating admin with token:', token);

    if (!token) {
      setLoading(false);
      setAdmin(null);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/validate-admin/`, {
        headers: { Authorization: `Token ${token}` },
      });

      console.log('Admin validation response:', response.data);

      setAdmin({ isAdmin: response.data.is_admin || response.data.isAdmin, verified: true });
    } catch (error) {
      setAdmin({ verified: false });
      console.error('Admin validation failed:', error);
      logout();
      setError('Failed to validate admin status');
    } finally {
      setLoading(false);
    }
  };

  // Set up axios interceptor
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          logout();
          setError('Session expired. Please login again.');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Initial validation
  useEffect(() => {
    validateAdmin();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${BASE_URL}/api-token-auth/`, credentials);
      const token = response.data.token;
      localStorage.setItem('adminToken', token);
      await validateAdmin();
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);