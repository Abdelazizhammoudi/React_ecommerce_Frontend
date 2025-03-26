import axios from 'axios';

// Add token to all requests
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

// Handle 401 Unauthorized responses
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401) {
            localStorage.removeItem('adminToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);