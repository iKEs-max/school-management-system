import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

// This interceptor automatically adds the JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // We MUST add 'Bearer ' before the token for our backend middleware to accept it!
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;