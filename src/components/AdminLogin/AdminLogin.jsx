import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import './AdminLogin.css';
import { useTranslation } from 'react-i18next';

const AdminLogin = () => {
  const { t } = useTranslation();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(credentials);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div className="admin-login">
      <h2>{t('admin.title')}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={t('admin.username')}
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder={t('admin.password')}
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          autoComplete="current-password"
        />
        {error && <div className="error">{error}</div>}
        <button type="submit">{t('admin.submit')}</button>
      </form>
    </div>
  );
};

export default AdminLogin;