import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
import { BASE_URL } from '@/config/constants';

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null); // Tracks if the user is logged in
  const [loading, setLoading] = useState(false); // Tracks loading state
  const [error, setError] = useState(null); // Tracks login errors
  const navigate = useNavigate(); // For navigation after login/logout

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/admin-login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // If login is successful, set the admin state
        setAdmin({ username });
        return true; // Return true to indicate success
      } else {
        // Handle invalid credentials
        const errorData = await response.json();
        setError(errorData.error || 'Invalid credentials. Please try again.');
        return false; // Return false to indicate failure
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
      return false; // Return false to indicate failure
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear the admin state and redirect to the login page
    setAdmin(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ admin, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);