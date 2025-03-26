import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; // Import the AuthContext

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Updated to use navigate
  const { login } = useAuth(); // Use the login function from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Attempting login with:', { username, password }); // Debugging log
    const success = await login(username, password); // Call the login function
    console.log('Login success status:', success); // Debugging log
    if (success) {
      console.log('Login successful, navigating to dashboard'); // Debugging log
      navigate('/dashboard'); // Redirect to the dashboard on success
    } else {
      console.log('Login failed'); // Debugging log
      setError('Invalid credentials or not an admin'); // Show error on failure
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;